from app.core.auth import get_current_user
from app.core.estimations import fetch_user_estimations, new_estimation
from app.db.database import get_db
from app.models.db_models import User
from app.schemas.schemas import NewEstimationRequest, NewEstimationResponse
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(tags=["Estimations"])

@router.get("/estimations")
async def get_estimations(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """Return the list of all estimations for the authenticated user."""

    result = await fetch_user_estimations(user, db)

    return result

@router.post("/estimations", response_model=NewEstimationResponse, status_code=201)
async def create_estimation(payload: NewEstimationRequest, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """Create a new estimation for the authenticated user."""

    result = await new_estimation(user, payload, db)

    return NewEstimationResponse(
        # id=result.id, 
        estimation_code=result.estimation_code,
        component_name=result.component_name,
        material=result.material,
        process=result.process,
        total_cost=float(result.total_cost),
        estimation_status=result.estimation_status.value,
        created_at=result.created_at.isoformat()
    )