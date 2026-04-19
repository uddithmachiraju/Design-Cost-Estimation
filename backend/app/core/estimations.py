from decimal import Decimal

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.db_models import Estimations, EstimationStatus, EstimationVersions, User
from app.schemas.schemas import NewEstimationRequest


async def get_next_estimation_code(db: AsyncSession) -> str:
    """Generate next estimation code like EST-0001"""

    result = await db.execute(text("SELECT nextval('estimation_code_seq')"))
    number = result.scalar()

    return f"EST-{str(number).zfill(4)}"


async def fetch_user_estimations(user: User, db: AsyncSession) -> list[Estimations]:
    """Return the list of all estimations for the authenticated user."""

    results = await db.execute(
        select(Estimations).where(Estimations.user_id == user.id).order_by(Estimations.created_at.desc())
    )

    estimations = results.scalars().all()
    return estimations

async def new_estimation(user: User, payload: NewEstimationRequest, db: AsyncSession) -> Estimations:
    """Create a new estimation for the authenticated user."""
    
    new_estimation = Estimations(
        user_id=user.id,
        estimation_code=await get_next_estimation_code(db),
        component_name=payload.component_name,
        material=payload.material or None,
        process=payload.process or None,
        estimation_status=EstimationStatus.DRAFT,
        total_cost=Decimal("0.00"),
    )

    db.add(new_estimation)
    await db.flush()

    version = EstimationVersions(
        estimation_id=new_estimation.id,
        version_number=1,
        total_cost=Decimal("0.00"),
        created_by=user.id,
        is_active=True
    )

    db.add(version)

    await db.refresh(new_estimation)
    return new_estimation
