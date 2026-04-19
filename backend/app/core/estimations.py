from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.db_models import Estimations, User


async def fetch_user_estimations(user: User, db: AsyncSession) -> list[Estimations]:
    """Return the list of all estimations for the authenticated user."""

    results = await db.execute(
        select(Estimations).where(Estimations.user_id == user.id).order_by(Estimations.created_at.desc())
    )

    estimations = results.scalars().all()
    return estimations