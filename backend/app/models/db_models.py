import uuid
from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    UniqueConstraint,
)
from sqlalchemy import (
    Enum as SAEnum,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


# Base model with timestamp fields for created_at and updated_at will be appended to all other models for consistency and auditability.
class TimeStamp:
    """Base model for timestamp fields."""

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)


# Represents a user in the system.
class User(TimeStamp, Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str | None] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    is_email_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    estimations: Mapped[list["Estimations"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    # drawings: Mapped[list["Drawing"]] = relationship(back_populates="owner")


# Represents an email verification token for a user.
class EmailVerificationToken(TimeStamp, Base):
    """Model for storing email verification tokens associated with users."""

    __tablename__ = "email_verification_tokens"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token_hash: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

# Represents the estimation data for a user, including the input parameters and the resulting cost estimation.

class EstimationStatus(Enum):
    """Enum for estimation status values."""
    
    DRAFT = "draft"
    FINAL = "final"
    APPROVED = "approved"


class Estimations(TimeStamp, Base):
    """Model for storing cost estimation data associated with users."""

    __tablename__ = "estimations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    estimation_code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True) 
    component_name: Mapped[str] = mapped_column(String(255), nullable=False)
    material: Mapped[str] = mapped_column(String(255), nullable=True)
    process: Mapped[str] = mapped_column(String(255), nullable=True)

    total_cost: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    estimation_status: Mapped[EstimationStatus] = mapped_column(SAEnum(EstimationStatus), nullable=False, default=EstimationStatus.DRAFT)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    files: Mapped[list["EstimationFiles"]] = relationship("EstimationFiles", back_populates="estimation", cascade="all, delete-orphan")

    user = relationship("User", back_populates="estimations")
    versions: Mapped[list["EstimationVersions"]] = relationship(back_populates="estimation", cascade="all, delete-orphan")


# Estimation versions for tracking changes to estimations over time, allowing users to maintain a history of their cost estimation modifications and compare different versions.
class EstimationVersions(TimeStamp, Base):
    """Model for storing different versions of cost estimations for tracking changes over time."""

    __tablename__ = "estimation_versions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    estimation_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("estimations.id", ondelete="CASCADE"), nullable=False)
    version_number: Mapped[int] = mapped_column(Integer, nullable=False)
    total_cost: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    created_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    files: Mapped[list["EstimationFiles"]] = relationship("EstimationFiles", back_populates="version", cascade="all, delete-orphan")
    
    estimation: Mapped["Estimations"] = relationship("Estimations", back_populates="versions")

    __table_args__ = (
        # Ensure that each estimation can have only one version at a time
        UniqueConstraint("estimation_id", "version_number", name="uq_estimation_version"),
    )
    
class EstimationFiles(TimeStamp, Base):
    """Model for storing files associated with cost estimations."""

    __tablename__ = "estimation_files"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    estimation_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("estimations.id", ondelete="CASCADE"), nullable=False)
    version_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("estimation_versions.id", ondelete="CASCADE"), nullable=False, index=True)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_key: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    file_type: Mapped[str] = mapped_column(String(50), nullable=False)
    file_size: Mapped[int] = mapped_column(Integer, nullable=False)
    estimation: Mapped["Estimations"] = relationship("Estimations", back_populates="files")
    version: Mapped["EstimationVersions"] = relationship("EstimationVersions", back_populates="files")
    uploaded_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)