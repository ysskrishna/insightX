import json
import logging
import aio_pika
import numpy as np
import aiohttp
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
from nudenet import NudeDetector
from core.config import Config
from core.s3utils import s3_client
from ultralytics import YOLO

logger = logging.getLogger(__name__)

# Image format configuration
IMAGE_FORMATS = {
    'jpg': {'content_type': 'image/jpeg', 'pil_format': 'JPEG'},
    'jpeg': {'content_type': 'image/jpeg', 'pil_format': 'JPEG'},
    'png': {'content_type': 'image/png', 'pil_format': 'PNG'},
    'webp': {'content_type': 'image/webp', 'pil_format': 'WEBP'}
}

# Initialize NSFW detector
nude_detector = NudeDetector()
model = YOLO('yolov8n.pt')

def get_format_info(image_format: str) -> dict:
    format_key = image_format.lower()
    return IMAGE_FORMATS.get(format_key, IMAGE_FORMATS['jpg'])  # Default to JPEG if unknown


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
    
    # Calculate relative sizes based on image dimensions
    img_width, img_height = image.size
    box_width = max(2, int(img_width * 0.002))  # 0.2% of image width, minimum 2px
    font_size = max(12, int(img_width * 0.02))  # 2% of image width, minimum 12px
    
    # Calculate padding relative to image size
    padding = max(5, int(img_width * 0.005))  # 0.5% of image width, minimum 5px
    text_padding = max(3, int(img_width * 0.003))  # 0.3% of image width, minimum 3px
    
    # Create font with relative size
    try:
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        font = None  # Fallback to default font if arial.ttf is not available
    
    for detection in detections:
        box = detection['box']
        label = detection['class']
        conf = detection['confidence']
        
        # Add padding to box coordinates while ensuring they stay within image boundaries
        x1 = max(0, min(box[0] - padding, img_width))
        y1 = max(0, min(box[1] - padding, img_height))
        x2 = max(0, min(box[2] + padding, img_width))
        y2 = max(0, min(box[3] + padding, img_height))
        
        # Draw rectangle
        draw.rectangle([x1, y1, x2, y2], outline='green', width=box_width)
        
        # Draw label with relative positioning and padding
        text = f"{label} {conf:.2f}"
        text_y_offset = max(10, int(img_height * 0.01))  # 1% of image height, minimum 10px
        
        # Calculate text position to ensure it stays within image
        text_x = x1 + text_padding
        text_y = max(text_y_offset, y1 - text_y_offset)  # Ensure text doesn't go above image
        
        # If text would go below image, place it inside the box with padding
        if text_y + font_size > img_height:
            text_y = y1 + box_width + text_padding
        
        # Draw text with background for better visibility
        text_bbox = draw.textbbox((text_x, text_y), text, font=font)
        draw.rectangle(
            [text_bbox[0] - text_padding, text_bbox[1] - text_padding,
             text_bbox[2] + text_padding, text_bbox[3] + text_padding],
            fill='green'
        )
        draw.text((text_x, text_y), text, fill='white', font=font)
    
    return image

async def upload_image_to_presigned_url(image, presigned_url, format_info):
    try:
        img_byte_arr = BytesIO()
        image.save(img_byte_arr, format=format_info.get('pil_format'))
        img_byte_arr = img_byte_arr.getvalue()
        
        headers = {
            'Content-Type': format_info.get('content_type')
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
        format_info = get_format_info(original_format)
        
        payload = {
            "storage_path": f"processed/{image_id}/detected.{original_format}",
            "content_type": format_info.get('content_type'),
            "expires_in": 3600
        }
        async with session.post(f"{Config.API_BASE_URL}/images/{image_id}/processed_presigned_url", json=payload) as response:
            if response.status != 200:
                raise Exception(f"Failed to get presigned URL: {response.status}")
            presigned_data = await response.json()
            return presigned_data.get('presigned_url'), presigned_data.get('storage_path'), format_info

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
            presigned_url, processed_image_path, format_info = await get_processed_presigned_url(body['image_id'], original_format)
            
            # Upload image to presigned URL
            await upload_image_to_presigned_url(image_with_detections, presigned_url, format_info)
            
            # Update detection results
            await update_detection_results(body['image_id'], detected_objects, nsfw_detections, processed_image_path)
            
        except Exception as e:
            logger.error(f"Error processing message: {e}")
            raise
