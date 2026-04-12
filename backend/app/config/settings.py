from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import Field, PostgresDsn
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # App Settings
    ENV: Literal["development", "production"] = Field("development", description="Application environment")
    APP_NAME: str = Field("Design Cost Estimator", description="Name of the application")
    DEBUG: bool = Field(False, description="Debug mode")
    APP_BASE_URL: str = Field("http://localhost:8000", description="Base URL for the application")
    APP_VERSION: str = Field("1.0.0", description="Application version")

    # CORS Settings
    CORS_ORIGIN: list[str] = Field(["*"], description="List of allowed CORS origins")

    # Database Settings
    DATABASE_URL: PostgresDsn = Field(..., description="Database connection URL")
    DATABASE_POOL_SIZE: int = Field(10, description="Database connection pool size")
    DATABASE_MAX_OVERFLOW: int = Field(20, description="Maximum overflow size for the database connection pool")
    DATABASE_POOL_TIMEOUT: int = Field(30, description="Timeout for acquiring a connection from the pool in seconds")
    DATABASE_POOL_RECYCLE: int = Field(1800, description="Time in seconds to recycle database connections")

    # Authentication Settings
    JWT_SECRET_KEY: str = Field(..., description="Secret key for JWT token generation")
    JWT_ALGORITHM: str = Field("HS256", description="Algorithm used for JWT token generation")
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(60, description="Access token expiration time in minutes")

    # Email Verification Settings
    SMTP_HOST: str = Field("smtp.gmail.com", description="SMTP server host")
    SMTP_PORT: int = Field(587, description="SMTP server port")
    SMTP_USE_TLS: bool = Field(True, description="Whether to use TLS for SMTP connection")
    SMTP_USERNAME: str = Field(..., description="SMTP server username")
    SMTP_PASSWORD: str = Field(..., description="SMTP server password")
    SMTP_FROM_EMAIL: str = Field(..., description="Email address used as the sender for outgoing emails")
    EMAIL_VERIFY_EXPIRE_HOURS: int = Field(24, description="Expiration time for email verification tokens in hours")

    # Observability Settings
    LOG_LEVEL: str = Field("INFO", description="Logging level")

    class Config:
        env_file = str(Path(__file__).resolve().parents[3] / ".env")
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """Get application settings with caching."""
    return Settings()


settings: Settings = get_settings()
