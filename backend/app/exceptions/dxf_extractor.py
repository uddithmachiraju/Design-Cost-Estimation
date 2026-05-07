


class DXFProcessorError(Exception):
    """Base error for all processor failures."""


class S3DownloadError(DXFProcessorError):
    """S3 download or checksum failure."""


class DXFParseError(DXFProcessorError):
    """File cannot be parsed as a DXF document."""


class GeometryExtractionError(DXFProcessorError):
    """Fatal error during geometry extraction (non-entity-level)."""


class CostConfigError(DXFProcessorError):
    """Invalid cost configuration."""