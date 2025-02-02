import json
import logging
import aio_pika
import numpy as np
import aiohttp
from PIL import Image, ImageDraw
from io import BytesIO
from nudenet import NudeDetector
from core.config import Config
from core.s3utils import s3_client
from ultralytics import YOLO

logger = logging.getLogger(__name__)


# Initialize NSFW detector
nude_detector = NudeDetector()

model = YOLO('yolov8n.pt')

PROCESSED_IMAGE_CONTENT_TYPE = 'image/jpeg'

def run_yolo_detection(image):
    results = model(image)

    detections = []
    result = results[0]
    boxes = result.boxes
    
    for box in boxes:
        cls = int(box.cls[0])
        conf = float(box.conf[0])
        xyxy = box.xyxy[0].tolist()  

        detections.append({
            'class': result.names[cls],
            'confidence': conf,
            'box': xyxy
        })
    return detections

def run_nsfw_detection(image):
    try:
        image_np = np.array(image)
        detections = nude_detector.detect(image_np)
        return detections
    except Exception as e:
        logger.error(f"Error running NSFW detection: {e}")
        return []

async def update_detection_results(image_id, detected_objects, nsfw_detections, processed_image_path):
    async with aiohttp.ClientSession() as session:
        try:
            payload = {
                'image_id': image_id,
                'detected_objects': detected_objects,
                'is_nsfw': len(nsfw_detections) > 0,
                'detected_nsfw': nsfw_detections,
                'processed_image_path': processed_image_path
            }
            
            async with session.post(
                f"{Config.API_BASE_URL}/images/{image_id}/detection_result",
                json=payload
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"API request failed: {error_text}")
                
                logger.info(f"Successfully updated detection results for image {image_id}")
        except Exception as e:
            logger.error(f"Error updating detection results via API: {e}")
            raise

def draw_detections(image, detections):
    draw = ImageDraw.Draw(image)
    
    for detection in detections:
        box = detection['box']
        label = detection['class']
        conf = detection['confidence']
        
        # Draw rectangle
        draw.rectangle(box, outline='red', width=2)
        
        # Draw label
        text = f"{label} {conf:.2f}"
        draw.text((box[0], box[1] - 10), text, fill='red')
    
    return image

async def upload_image_to_presigned_url(image, presigned_url, content_type):
    try:
        img_byte_arr = BytesIO()
        # Map content type to PIL format
        format_map = {
            'image/jpeg': 'JPEG',
            'image/png': 'PNG',
            'image/webp': 'WEBP'
        }
        save_format = format_map.get(content_type, 'JPEG')  # Default to JPEG if unknown
        image.save(img_byte_arr, format=save_format)
        img_byte_arr = img_byte_arr.getvalue()
        
        headers = {
            'Content-Type': content_type
        }
        async with aiohttp.ClientSession() as session:
            async with session.put(presigned_url, headers=headers, data=img_byte_arr) as response:
                if response.status != 200:
                    raise Exception(f"Failed to upload image: {response.status}")
                return presigned_url.split('?')[0]  # Return the S3 path without query parameters
    except Exception as e:
        logger.error(f"Error uploading image to presigned URL: {e}")
        raise

async def get_processed_presigned_url(image_id: int, original_format: str = 'jpg') -> tuple[str, str]:
    async with aiohttp.ClientSession() as session:
        # Map common image formats to their content types
        format_to_content_type = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'webp': 'image/webp'
        }
        content_type = format_to_content_type.get(original_format.lower(), 'image/jpeg')
        
        payload = {
            "storage_path": f"processed/{image_id}/detected.{original_format}",
            "content_type": content_type,
            "expires_in": 3600
        }
        async with session.post(f"{Config.API_BASE_URL}/images/{image_id}/processed_presigned_url", json=payload) as response:
            if response.status != 200:
                raise Exception(f"Failed to get presigned URL: {response.status}")
            presigned_data = await response.json()
            return presigned_data.get('presigned_url'), presigned_data.get('storage_path'), content_type

async def process_message(message: aio_pika.abc.AbstractIncomingMessage) -> None:
    async with message.process():
        try:
            body = json.loads(message.body.decode())
            logger.info(f"Received message: {body}")
            
            response = s3_client.download_file(body['storage_path'])
            image_data = response['Body'].read()
            image = Image.open(BytesIO(image_data))
            
            # Get original format from the image
            original_format = image.format.lower() if image.format else 'jpg'
            
            # Run NSFW detection
            nsfw_detections = run_nsfw_detection(image)
            logger.info(f"NSFW detections: {nsfw_detections}")
            
            # Run YOLO detection
            detected_objects = run_yolo_detection(image)
            logger.info(f"YOLO detections: {detected_objects}")
            
            # Generate image with detections
            image_with_detections = draw_detections(image, detected_objects)
            
            # Get presigned URL and processed path
            presigned_url, processed_image_path, content_type = await get_processed_presigned_url(body['image_id'], original_format)
            
            # Upload image to presigned URL
            await upload_image_to_presigned_url(image_with_detections, presigned_url, content_type)
            
            # Update detection results
            await update_detection_results(body['image_id'], detected_objects, nsfw_detections, processed_image_path)
            
        except Exception as e:
            logger.error(f"Error processing message: {e}")
            raise
