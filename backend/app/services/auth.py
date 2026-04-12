from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, Request, status
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.config.logging import get_logger
from app.config.settings import settings
from app.core.auth import create_user_token
from app.core.email import generate_token, hash_token, send_verification_email
from app.models.db_models import EmailVerificationToken, User
from app.schemas.schemas import (
    UserLoginRequest,
    UserLoginResponse,
    UserRegistrationRequest,
    UserRegistrationResponse,
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
logger = get_logger(__name__)


def hash_password(password: str) -> str:
    """Hash a plaintext password using bcrypt."""

    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against a hashed password."""

    return pwd_context.verify(plain_password, hashed_password)


async def register_user(payload: UserRegistrationRequest, db: AsyncSession) -> UserRegistrationResponse:
    """Register a new user with email verification."""

    # check if the email or username alread exists
    existing_user = await db.execute(
        select(User).where((User.email == payload.email) | (User.username == payload.username))
    )

    if existing_user.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email or username already registered.")
    
    # Create a new user with hashed password and unverified email
    new_user = User(
        username=payload.username,
        email=payload.email,
        hashed_password=hash_password(payload.password),  # Implement hash_password function
        is_active=True,
        is_email_verified=False,
        full_name=payload.full_name
    )

    db.add(new_user)
    await db.commit()

    # Generate verification token for the email and send verification email
    raw_token = generate_token()

    # Store the token in the database for user verification
    token_record = EmailVerificationToken(
        user_id=new_user.id,
        token_hash=hash_token(raw_token),  # Use hash_token for consistent hashing
        expires_at=datetime.now(timezone.utc) + timedelta(hours=settings.EMAIL_VERIFY_EXPIRE_HOURS)
    )

    db.add(token_record)
    await db.commit()

    # Send an verification email to the user with the raw token (not hashed) for verification link
    send_verification_email(new_user.email, new_user.username, raw_token)

    logger.info("user registered", user_id=str(new_user.id), username=new_user.username)

    return UserRegistrationResponse(
        id=new_user.id,
        username=new_user.username,
        email=new_user.email,
        is_active=new_user.is_active,
        is_email_verified=new_user.is_email_verified,
        created_at=new_user.created_at.isoformat()
    )


async def verify_email(token: str, db: AsyncSession) -> dict:
    """Verify user registered email that is sent after the registration."""

    token_hash = hash_token(token)
    now = datetime.now(timezone.utc)

    result = await db.execute(
        select(EmailVerificationToken).where(EmailVerificationToken.token_hash == token_hash)
    )
    token_record = result.scalar_one_or_none()

    if not token_record:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid verification link.")
    if token_record.used_at is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Verification link already used.")
    if token_record.expires_at.replace(tzinfo=timezone.utc) < now:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Verification link expired. Request a new one.")

    # Mark token user and verify the player
    token_record.used_at = now
    user_result = await db.execute(select(User).where(User.id == token_record.user_id))
    user = user_result.scalar_one()
    user.is_email_verified = True
    await db.commit()

    logger.info("email_verified", user_id=str(user.id))
    return {
        "message": "Email Verified successfully. You can now log in."
    }


async def login_user(payload: UserLoginRequest, request: Request, db: AsyncSession) -> UserLoginResponse:
    """User login"""

    client_ip = request.client.host if request.client else "unknown"

    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()

    dummy_hash = pwd_context.hash("dummy-password-for-timing-attack-prevention")
    password_ok = verify_password(payload.password, user.hashed_password if user else dummy_hash)

    if not user or not password_ok:
        logger.warning("login_failed", email=payload.email, ip=client_ip)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password.")

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is inactive.")
    if not user.is_email_verified:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Please verify your email before loggin in. Check your inbox or request for a new link.")

    token = create_user_token(user.id)
    logger.info("user_logged_in", user_id=str(user.id), ip=client_ip)
    return UserLoginResponse(
        access_token=token,
        token_type="bearer",
        expire_in_minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES
    )
