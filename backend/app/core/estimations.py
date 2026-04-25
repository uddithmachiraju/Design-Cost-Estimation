from decimal import Decimal

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.db_models import (
    EstimationFiles,
    Estimations,
    EstimationStatus,
    EstimationVersions,
    User,
)
from app.schemas.schemas import (
    EstimationFileMetadata,
    NewEstimationRequest,
    NewEstimationResponse,
)


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

async def new_estimation(user: User, payload: NewEstimationRequest, db: AsyncSession) -> NewEstimationResponse:
    """Create a new estimation for the authenticated user."""
    
    estimation = Estimations(
        user_id=user.id,
        estimation_code=await get_next_estimation_code(db),
        component_name=payload.component_name,
        material=payload.material or None,
        process=payload.process or None,
        estimation_status=EstimationStatus.DRAFT,
        total_cost=Decimal("0.00"),
    )

    db.add(estimation)
    await db.flush()

    version = EstimationVersions(
        estimation_id=estimation.id,
        version_number=1,
        total_cost=Decimal("0.00"),
        created_by=user.id,
        is_active=True
    )

    db.add(version)

    await db.commit()
    await db.refresh(estimation)

    return NewEstimationResponse(
        estimation_id=estimation.id,
        estimation_code=estimation.estimation_code,
        component_name=estimation.component_name,
        material=estimation.material,
        process=estimation.process,
        total_cost=float(estimation.total_cost),
        estimation_status=estimation.estimation_status.value,
        created_at=estimation.created_at.isoformat(),
    )

async def fetch_estimation_by_id(estimation_id: str, user: User, db: AsyncSession) -> Estimations:
    """Fetch a specific estimation by its ID for the authenticated user."""

    result = await db.execute(
        select(Estimations).where(Estimations.id == estimation_id, Estimations.user_id == user.id)
    )

    estimation = result.scalar_one_or_none()

    return estimation

async def fetch_estimation_version(estimation_id: str, user: User, db: AsyncSession) -> EstimationVersions:
    """Fetch the latest version number for a specific estimation."""

    version = await db.execute(
        select(EstimationVersions)
        .where(EstimationVersions.estimation_id == estimation_id)
        .order_by(EstimationVersions.version_number.desc())
        .limit(1)
    )

    version_obj = version.scalar_one()

    return version_obj

async def create_estimation_file_record(payload: EstimationFileMetadata, version_id: str, user: User, db: AsyncSession):
    """Create a new estimation file record in the database."""

    file = EstimationFiles(
        estimation_id=payload.estimation_id,
        version_id=version_id,
        file_name=payload.file_name,
        file_key=payload.file_key,
        file_type=payload.file_type,
        file_size=payload.file_size,
        uploaded_by=user.id,
    )

    db.add(file)
    await db.commit()
    await db.refresh(file)

    return file