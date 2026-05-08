import hashlib
import os
import tempfile
import time

from annotated_types import doc
import ezdxf
from ezdxf.document import Drawing

from app.config.logging import get_logger
from app.config.settings import get_settings
from app.exceptions.dxf_extractor import S3DownloadError
from app.models.db_models import User
from app.schemas.dxf_extraction import DXFExtractionRequest
from app.services.storage.s3_service import s3_client

logger = get_logger(__name__)
settings = get_settings()


async def _download_file_from_s3(bucket_name: str, file_key: str, dest_path: str) -> dict:
    """Download a file from S3 to a local path."""

    logger.info("downloading file from S3", bucket=bucket_name, key=file_key, local_path=dest_path)
    t0 = time.monotonic() 

    try:
        head = s3_client.head_object(Bucket=bucket_name, Key=file_key)
        content_length = head.get("ContentLength", 0)
        etag = head.get("ETag", "").strip('"')
        content_type = head.get("ContentType", "application/octet-stream")
        last_modified = head.get("LastModified", None)
        logger.info("fetched file metadata from S3", bucket=bucket_name, key=file_key, content_length=content_length, etag=etag, content_type=content_type, last_modified=last_modified)
    except Exception as e:
        logger.error("failed to fetch file metadata from S3", bucket=bucket_name, key=file_key, error=str(e))
        raise S3DownloadError("Failed to fetch file metadata from S3")
    
    try:
        with open(dest_path, "wb") as f:
            s3_client.download_fileobj(Bucket=bucket_name, Key=file_key, Fileobj=f)
    except Exception as e:
        logger.error("failed to download file from S3", bucket=bucket_name, key=file_key, error=str(e))
        raise S3DownloadError("Failed to download file from S3")
    
    actual_size = os.path.getsize(dest_path)
    elapsed = time.monotonic() - t0
    logger.info("completed file download from S3", bucket=bucket_name, key=file_key, local_path=dest_path, actual_size=actual_size, elapsed_seconds=elapsed)

    if content_length and actual_size != content_length:
        logger.error("Size Mismatch", bucket=bucket_name, key=file_key, expected_size=content_length, actual_size=actual_size)
        raise S3DownloadError("Downloaded file size does not match expected content length from S3")
    
    if etag and "-" not in etag and content_length <= 8 * 1024 * 1024 * 1024:  # Only validate ETag for files <= 8GB and non-multipart uploads

        md5_hash = hashlib.md5()
        with open(dest_path, "rb") as f:
            for chunk in iter(lambda: f.read(8192), b""):
                md5_hash.update(chunk)
        calculated_etag = md5_hash.hexdigest()
        if calculated_etag != etag:
            logger.error("ETag Mismatch", bucket=bucket_name, key=file_key, expected_etag=etag, calculated_etag=calculated_etag)
            raise S3DownloadError("Downloaded file ETag does not match expected ETag from S3")
        
    return {
        "content_length": content_length,
        "etag": etag,
        "content_type": content_type,
        "last_modified": last_modified
    }


async def _parse_dxf(path: str) -> tuple[Drawing, list[str]]:
    """Parse the DXF file and extract geometry data."""

    audit_messages: list[str] = [] 

    try:
        doc = ezdxf.readfile(path)
        auditor = doc.audit()
        if auditor.has_errors:
            audit_messages = [f"{msg.code}: {msg.message}" for msg in auditor.messages]
            logger.warning("DXF file has audit errors", path=path, audit_messages=audit_messages)
        else:
            logger.info("DXF file passed audit with no errors", path=path)
        
        return doc, audit_messages
    
    except ezdxf.DXFError as e:
        logger.error("Failed to parse DXF file", path=path, error=str(e))
        raise ValueError("Failed to parse DXF file: " + str(e))


async def _extract_geometry(doc: Drawing) -> dict:
    """Extract geometry data from the DXF document."""

    geometry_data = {
        "lines": [],
        "circles": [],
        "arcs": [],
        "polylines": []
    }

    for entity in doc.entities:
        if entity.dxftype() == "LINE":
            geometry_data["lines"].append({
                "start": (entity.dxf.start.x, entity.dxf.start.y, entity.dxf.start.z),
                "end": (entity.dxf.end.x, entity.dxf.end.y, entity.dxf.end.z)
            })
        elif entity.dxftype() == "CIRCLE":
            geometry_data["circles"].append({
                "center": (entity.dxf.center.x, entity.dxf.center.y, entity.dxf.center.z),
                "radius": entity.dxf.radius
            })
        elif entity.dxftype() == "ARC":
            geometry_data["arcs"].append({
                "center": (entity.dxf.center.x, entity.dxf.center.y, entity.dxf.center.z),
                "radius": entity.dxf.radius,
                "start_angle": entity.dxf.start_angle,
                "end_angle": entity.dxf.end_angle
            })
        elif entity.dxftype() == "POLYLINE":
            vertices = [(v.dxf.x, v.dxf.y, v.dxf.z) for v in entity.vertices]
            geometry_data["polylines"].append({
                "vertices": vertices,
                "is_closed": bool(entity.is_closed)
            })

    return geometry_data
    


async def process_dxf(payload: DXFExtractionRequest, user: User) -> dict:
    """Process the DXF file based on the provided S3 key and cost metrics, and return the extracted data."""

    t0 = time.monotonic()

    try:
        logger.info("starting DXF process", user_id=str(user.id), file_key=payload.file_key)

        with tempfile.TemporaryDirectory(prefix="dxf_processing_") as temp_dir:
            local_path = os.path.join(temp_dir, "input.dxf")

            try:
                # Download the DXF file from S3 to a local path for processing
                s3_data = await _download_file_from_s3(
                    bucket_name=settings.AWS_S3_BUCKET_NAME,
                    file_key=payload.file_key,
                    dest_path=local_path
                )
                logger.info("fetched DXF file metadata from S3", user_id=str(user.id), file_key=payload.file_key, content_length=s3_data["content_length"], etag=s3_data["etag"], content_type=s3_data["content_type"])

            except Exception as e:
                logger.error("failed to fetch DXF file from S3", user_id=str(user.id), file_key=payload.file_key, error=str(e))
                raise S3DownloadError("Failed to fetch DXF file from S3")
            
            # Parse DXF file and extract geometry
            try:
                doc, audit_messages = await _parse_dxf(local_path)

                dxf_version = doc.dxfversion
                num_entities = len(doc.entities)
                logger.info("parsed DXF file successfully", user_id=str(user.id), file_key=payload.file_key, dxf_version=dxf_version, num_entities=num_entities, audit_messages=audit_messages)

            except Exception as e:
                logger.error("failed to parse DXF file", user_id=str(user.id), file_key=payload.file_key, error=str(e))
                raise ValueError("Failed to parse DXF file: " + str(e))
            
            try:
                geometry_data = await _extract_geometry(doc)
                logger.info("extracted geometry from DXF file", user_id=str(user.id), file_key=payload.file_key, geometry_summary={k: len(v) for k, v in geometry_data.items()})
            except Exception as e:
                logger.error("failed to extract geometry from DXF file", user_id=str(user.id), file_key=payload.file_key, error=str(e))
                raise ValueError("Failed to extract geometry from DXF file: " + str(e))
                
        elapsed = time.monotonic() - t0
        logger.info("completed DXF process", user_id=str(user.id), file_key=payload.file_key, elapsed_seconds=elapsed)

        return {
            "dxf_version": doc.dxfversion,
            "num_entities": len(doc.entities),
            "audit_messages": audit_messages,
            "cost_metrics": payload.cost_metrics, 
            "geometry_data": geometry_data
        }

    except Exception as e:
        logger.error("failed to log DXF process start", user_id=str(user.id), file_key=payload.file_key, error=str(e))
        raise