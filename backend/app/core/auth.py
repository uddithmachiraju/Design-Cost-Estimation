import uuid
from datetime import datetime, timezone

from jose import jwt

from app.config.settings import settings


def create_user_token(user_id: str | uuid.UUID) -> str:
    """Generate a JWT token for the given user_id."""

    user_sub = str(user_id)
    now = datetime.now(timezone.utc)
    issued_at = int(now.timestamp())
    expires_at = issued_at + settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60

    return jwt.encode(
        {
            "sub": user_sub,
            "type": "user",
            "iat": issued_at,
            "exp": expires_at,
        },
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )
