from core.s3utils import s3_client
from core import models

def format_image_row(image: models.Image) -> dict:
    item = {
        "image_id": image.image_id,
        "name": image.name,
        "is_processed": image.is_processed,
        "is_nsfw": image.is_nsfw,
        "input_image_url": s3_client.get_public_s3_url(s3_client.generate_presigned_get_url(image.storage_path)),
        "detected_nsfw": image.detected_nsfw,
        "detected_objects": image.detected_objects,
        "created_at": image.created_at,
        "updated_at": image.updated_at,
        "output_image_url": s3_client.get_public_s3_url(s3_client.generate_presigned_get_url(image.processed_image_path)) if image.is_processed and image.processed_image_path else None
    }
    return item