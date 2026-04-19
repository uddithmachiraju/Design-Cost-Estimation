from app.core.auth import get_current_user
from app.core.estimations import (
    fetch_estimation_by_id,
    fetch_estimation_version,
    fetch_user_estimations,
    new_estimation,
)
from app.db.database import get_db
from app.models.db_models import User
from app.schemas.schemas import (
    NewEstimationRequest,
    NewEstimationResponse,
    PreSignedURLRequest,
    PreSignedURLResponse,
)
from app.services.storage.s3_service import generate_presigned_url
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(tags=["Estimations"])

@router.get("/estimations")
async def get_estimations(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """Return the list of all estimations for the authenticated user."""

    result = await fetch_user_estimations(user, db)

    return result

@router.post("/estimations", response_model=NewEstimationResponse, status_code=201)
async def create_estimation(payload: NewEstimationRequest, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)) -> NewEstimationResponse:
    """Create a new estimation for the authenticated user."""

    result = await new_estimation(user, payload, db)

    return result

@router.post("/upload-url")
async def get_presigned_url(payload: PreSignedURLRequest, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)) -> PreSignedURLResponse:
    """Returns a presigned URL for uploading a file to S3."""

    estimation = await fetch_estimation_by_id(payload.estimation_id, user, db)

    if not estimation:
        raise HTTPException(status_code=404, detail="Estimation not found")

    version = await fetch_estimation_version(payload.estimation_id, user, db)

    presigned_url = await generate_presigned_url(user_id=str(user.id), estimation_code=estimation.estimation_code, version=version, filename=payload.filename, content_type=payload.content_type)

    return PreSignedURLResponse(presigned_url=presigned_url)