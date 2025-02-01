from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from core.s3utils import s3_client
from core.dbutils import get_db
from core.models import Image
from core.rabbitmq import rabbitmq_client
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import update
from core.schemas import ImageDetectionResultSchema

router = APIRouter(prefix="/images", tags=["images"])


def validate_image_type(file: UploadFile) -> str:
    ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

    # Get file extension
    file_ext = "." + file.filename.split(".")[-1].lower()
    
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    return file_ext

@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    validate_image_type(file)
    s3_object_key = s3_client.upload_file(file.file, file.content_type, file.filename)
    image = Image(
        name=file.filename,
        storage_path=s3_object_key
    )
    
    db.add(image)
    await db.commit()
    await db.refresh(image)
    
    message = {
        "image_id": image.image_id,
        "storage_path": image.storage_path
    }
    rabbitmq_client.publish_message(message)
    
    return {
        "image_id": image.image_id,
        "name": image.name
    }
    
@router.post("/{image_id}/detection_result")
async def update_detection_result(
    image_id: int,
    results: ImageDetectionResultSchema,
    db: AsyncSession = Depends(get_db)
):
    image = await db.get(Image, image_id)
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    stmt = (
        update(Image)
        .where(Image.image_id == image_id)
        .values(
            is_processed=True,
            detected_objects=results.detected_objects,
            is_nsfw=results.is_nsfw,
            detected_nsfw=results.detected_nsfw
        )
    )
    
    await db.execute(stmt)
    await db.commit()
    
    return {"message": "Detection results updated successfully"}