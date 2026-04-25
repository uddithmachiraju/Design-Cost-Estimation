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

# ----------- Estimation Schemas -----------
class NewEstimationRequest(BaseModel):
    """Schema for creating a new estimation."""

    component_name: str = Field(..., description="Name of the component to be estimated")
    material: str = Field(..., description="Material of the component")
    process: str = Field(..., description="Manufacturing process for the component")

class NewEstimationResponse(BaseModel):
    """Schema for the response after creating a new estimation."""

    estimation_id: uuid.UUID = Field(..., description="Unique identifier for the estimation")
    estimation_code: str = Field(..., description="Unique code for the estimation")
    component_name: str = Field(..., description="Name of the component")
    material: str = Field(..., description="Material of the component")
    process: str = Field(..., description="Manufacturing process for the component")
    total_cost: float = Field(..., description="Total cost estimated for the component")
    estimation_status: str = Field(..., description="Status of the estimation (e.g., draft, final, approved)")
    created_at: str = Field(..., description="Timestamp when the estimation was created")

class PreSignedURLRequest(BaseModel):
    """Schema for requesting a pre-signed URL for file upload."""

    filename: str = Field(..., description="Name of the file to be uploaded")
    content_type: str = Field(..., description="MIME type of the file")
    estimation_id: uuid.UUID = Field(..., description="Unique identifier for the estimation associated with the file upload")

class PreSignedURLResponse(BaseModel):
    """Schema for the response containing the pre-signed URL."""

    presigned_url: str = Field(..., description="Pre-signed URL for uploading a file to S3")
    file_key: str = Field(..., description="Unique key for the file in S3, to be used for confirming the upload")

class EstimationFileMetadata(BaseModel):
    """Schema for confirming file upload and storing metadata in DB."""

    estimation_id: str = Field(..., description="Unique identifier for the estimation associated with the file")
    file_name: str = Field(..., description="Name of the uploaded file")
    file_key: str = Field(..., description="Unique key for the uploaded file in S3")
    file_type: str = Field(..., description="MIME type of the uploaded file")
    file_size: int = Field(..., description="Size of the uploaded file in bytes")