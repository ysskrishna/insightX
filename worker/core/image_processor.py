import json
import logging
import aio_pika


logger = logging.getLogger(__name__)


async def process_message(message: aio_pika.abc.AbstractIncomingMessage) -> None:
    async with message.process():
        try:
            body = json.loads(message.body.decode())
            logger.info(f"Received message: {body}")
            # Add your image processing logic here
            # For now, we'll just log the message
        except Exception as e:
            logger.error(f"Error processing message: {e}")