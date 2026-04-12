import uuid

from pydantic import BaseModel, EmailStr, Field


# ----------- User Registration and Login Schemas -----------
class UserRegistrationRequest(BaseModel):
    """Schema for user registration request."""

    username: str = Field(..., description="Username for the user")
    full_name: str = Field(..., description="Full name of the user")
    email: EmailStr = Field(..., description="Email address of the user")
    password: str = Field(..., description="Password for the user")

class UserRegistrationResponse(BaseModel):
    """Schema for user registration response."""

    id: uuid.UUID = Field(..., description="Unique identifier for the user")
    username: str = Field(..., description="Username of the user")
    email: EmailStr = Field(..., description="Email address of the user")
    is_active: bool = Field(..., description="Whether the user account is active")
    is_email_verified: bool = Field(..., description="Whether the user's email is verified")
    created_at: str = Field(..., description="Timestamp when the user account was created")

class UserLoginRequest(BaseModel):
    """Schema for user login request."""

    email: EmailStr = Field(..., description="Email address of the user")
    password: str = Field(..., description="Password for the user")

class UserLoginResponse(BaseModel):
    """Schema for user login response."""

    access_token: str = Field(..., description="JWT access token for the user")
    token_type: str = Field(..., description="Type of the token, typically 'bearer'")
    expire_in_minutes: int = Field(..., description="Expiration time of the access token in minutes")