from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Query
from core.s3utils import s3_client
from core.dbutils import get_db
from core import models, schemas
from core.rabbitmq import rabbitmq_client
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import update, select, func
from services.images import format_image_row

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
    image = models.Image(
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

@router.get("/list")
async def get_image_list(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    offset = (page - 1) * limit

    result = await db.execute(select(models.Image).offset(offset).limit(limit))
    images = result.scalars().all()

    total_result = await db.execute(select(func.count()).select_from(models.Image))
    total = total_result.scalar()

    return {
        "page": page,
        "limit": limit,
        "total": total,
        "data": [format_image_row(image) for image in images]
    }


@router.get("/{image_id}")
async def get_image(
    image_id: int,
    db: AsyncSession = Depends(get_db)
):
    image = await db.get(models.Image, image_id)
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    return format_image_row(image)


@router.post("/{image_id}/detection_result")
async def update_detection_result(
    image_id: int,
    results: schemas.ImageDetectionResultSchema,
    db: AsyncSession = Depends(get_db)
):
    image = await db.get(models.Image, image_id)
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    stmt = (
        update(models.Image)
        .where(models.Image.image_id == image_id)
        .values(
            is_processed=True,
            detected_objects=results.detected_objects,
            is_nsfw=results.is_nsfw,
            detected_nsfw=results.detected_nsfw,
            processed_image_path=results.processed_image_path
        )
    )
    
    await db.execute(stmt)
    await db.commit()
    
    return {"message": "Detection results updated successfully"}


@router.post("/{image_id}/processed_presigned_url")
async def get_processed_presigned_url(
    image_id: int,
    info: schemas.ProcessedPresignedUrlSchema,
    db: AsyncSession = Depends(get_db)
):
    image = await db.get(models.Image, image_id)
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    presigned_url = s3_client.generate_presigned_put_url(info.storage_path, info.content_type, info.expires_in)
    
    return {
        "image_id": image.image_id,
        "presigned_url": presigned_url,
        "storage_path": info.storage_path
    }