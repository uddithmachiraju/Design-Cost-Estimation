import uuid
from datetime import datetime, timezone
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.config.logging import get_logger
from app.config.settings import settings
from app.db.database import get_db
from app.models.db_models import User

bearer_scheme = HTTPBearer(auto_error=False)
logger = get_logger(__name__)

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


# Utility function to decode a JWT token and extract the user_id (subject) from it.
def decode_user_token(token: str) -> str:
    """Decode a JWT token and return the user_id if valid."""

    try:
        payload = jwt.decode(
            token, 
            settings.JWT_SECRET_KEY, 
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except JWTError as e:
        logger.error("token_decoding_failed", error=str(e))
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from e


# Dependency to get the current authenticated user from the JWT token in the Authorization header.
async def get_current_user(credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)], db: AsyncSession = Depends(get_db)) -> User:
    """Extract and validate the user ID from the JWT token in the Authorization header."""

    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials.")

    payload = decode_user_token(credentials.credentials)
    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload.")
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found.")
    
    logger.info("user_authenticated", user_id=str(user.id))
    return user