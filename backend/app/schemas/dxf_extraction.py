from pydantic import BaseModel, Field


class DXFExtractionRequest(BaseModel):
    """Schema for the request to extract DXF data."""

    file_key: str = Field(..., description="S3 key of the processed DXF file")
    cost_metrics: dict = Field(..., description="Estimated cost metrics based on the extracted geometry")