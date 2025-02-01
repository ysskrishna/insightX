import json
import logging
import aio_pika
import numpy as np
import torch
import aiohttp
from PIL import Image
from io import BytesIO
from nudenet import NudeDetector
from core.config import Config
from core.s3utils import s3_client

logger = logging.getLogger(__name__)

# Initialize YOLO detector
def load_yolo():
    model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
    return model

# Initialize NSFW detector
nude_detector = NudeDetector()

def run_yolo_detection(image):
    model = load_yolo()
    results = model(image)
    detections = []
    
    for *box, conf, cls in results.xyxy[0]:
        detections.append({
            'class': results.names[int(cls)],
            'confidence': float(conf),
            'box': box.tolist()
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

async def update_detection_results(image_id, detected_objects, nsfw_detections):
    async with aiohttp.ClientSession() as session:
        try:
            payload = {
                'image_id': image_id,
                'detected_objects': detected_objects,
                'is_nsfw': len(nsfw_detections) > 0,
                'detected_nsfw': nsfw_detections
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

async def process_message(message: aio_pika.abc.AbstractIncomingMessage) -> None:
    async with message.process():
        try:
            body = json.loads(message.body.decode())
            logger.info(f"Received message: {body}")
            
            response = s3_client.download_file(body['storage_path'])
            image_data = response['Body'].read()
            image = Image.open(BytesIO(image_data))
            
            # Run NSFW detection
            nsfw_detections = run_nsfw_detection(image)
            logger.info(f"NSFW detections: {nsfw_detections}")
            
            # Run YOLO detection
            detected_objects = run_yolo_detection(image)
            logger.info(f"YOLO detections: {detected_objects}")
            
            await update_detection_results(body['image_id'], detected_objects, nsfw_detections)
            
        except Exception as e:
            logger.error(f"Error processing message: {e}")
            raise
