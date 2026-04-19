from app.core.auth import get_current_user
from app.core.estimations import fetch_user_estimations
from app.db.database import get_db
from app.models.db_models import User
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(tags=["Estimations"])

@router.get("/estimations")
async def get_estimations(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """Return the list of all estimations for the authenticated user."""

    result = await fetch_user_estimations(user, db)

    return result