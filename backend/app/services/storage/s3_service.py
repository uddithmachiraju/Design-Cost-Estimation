
import boto3

from app.config.logging import get_logger
from app.config.settings import settings

logger = get_logger(__name__)

s3_client = boto3.client(
    "s3",
    region_name=settings.AWS_REGION,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
)

BUCKET_NAME = settings.AWS_S3_BUCKET_NAME

def generate_file_key(user_id: str, estimation_code: str, version: int, filename: str) -> str:
    """Generate a unique S3 key for storing the file based on user and estimation IDs."""
    
    safe_filename = filename.replace("/", "_")
    
    logger.info("generating_file_key", user_id=user_id, estimation_code=estimation_code, version=version, filename=filename)
    return f"{user_id}/{estimation_code}/{version}/{safe_filename}"


async def generate_presigned_url(user_id: str, estimation_code: str, version: int, filename: str, content_type: str) -> str:
    """Generate a presigned URL for uploading a file to S3."""
    
    file_key = generate_file_key(user_id, estimation_code, version, filename)
    
    try:
        presigned_url = s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": BUCKET_NAME, 
                "Key": file_key,
                "ContentType": content_type
            },
            ExpiresIn=settings.AWS_S3_FILE_EXPIRE_SECONDS,
        )
        logger.info("generated_presigned_url", user_id=user_id, estimation_code=estimation_code, version=version, filename=filename)
        return presigned_url
    except Exception as e:
        logger.error("error_generating_presigned_url", user_id=user_id, estimation_code=estimation_code, version=version, filename=filename, error=str(e))
        raise RuntimeError(f"Error generating presigned URL: {str(e)}")