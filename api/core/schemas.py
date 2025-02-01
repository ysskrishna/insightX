from pydantic import BaseModel
from typing import List, Dict, Any

class ImageDetectionResultSchema(BaseModel):
    image_id: int
    detected_objects: List[Dict[str, Any]]
    is_nsfw: bool
    detected_nsfw: List[Dict[str, Any]]