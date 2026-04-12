from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config.logging import get_logger
from app.config.settings import settings

logger = get_logger(__name__)

# asyncronous database engine and session setup
engine = create_async_engine(
    str(settings.DATABASE_URL),
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
    pool_timeout=settings.DATABASE_POOL_TIMEOUT,
    pool_recycle=settings.DATABASE_POOL_RECYCLE,
    echo=settings.DEBUG,
)

# Async session factory
async_session_local = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    class_=AsyncSession,
)

class Base(DeclarativeBase):
    """Base class for all database models."""
    pass

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency that provides a database session."""
    
    async with async_session_local() as session:
        try:
            yield session
            await session.commit()
        except Exception as e:
            await session.rollback()
            logger.error(f"Database session error: {e}")
            raise
        finally:
            await session.close()


async def check_database_health() -> bool:
    """Check if the database connection is healthy."""

    try:
        async with async_session_local() as session:
            await session.execute("SELECT 1")
        return True
    except Exception as e:
        logger.error("Database health check failed", error=str(e))
        return False


async def get_pool_status() -> dict:
    """Get the current status of the database connection pool."""

    try:
        pool = engine.pool
        status = {
            "checked_in": pool.checked_in(),
            "checked_out": pool.checked_out(),
            "overflow": pool.overflow(),
            "current_size": pool.size(),
            "max_size": pool._max_overflow + pool._pool_size
        }
        return status
    except Exception as e:
        logger.error("Failed to get database pool status", error=str(e))
        return {}
