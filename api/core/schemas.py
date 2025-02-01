from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ImageDetectionResultSchema(BaseModel):
    image_id: int
    detected_objects: List[Dict[str, Any]]
    is_nsfw: bool
    detected_nsfw: List[Dict[str, Any]]
    processed_image_path: str

class ProcessedPresignedUrlSchema(BaseModel):
    storage_path: str
    content_type: str
    expires_in: Optional[int] = 3600
