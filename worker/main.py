import asyncio
import aio_pika
import logging
from core.image_processor import process_message
from core.config import Config


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)



async def main() -> None:
    connection = await aio_pika.connect_robust(
        f"amqp://{Config.RABBITMQ_USER}:{Config.RABBITMQ_PASSWORD}@{Config.RABBITMQ_HOST}:{Config.RABBITMQ_PORT}/{Config.RABBITMQ_VHOST}",
    )

    async with connection:
        channel = await connection.channel()
        queue = await channel.declare_queue(
            Config.RABBITMQ_IMAGE_PROCESSING_QUEUE,
            durable=True
        )

        await queue.consume(process_message)

        logger.info("Worker started. Waiting for messages...")
        try:
            await asyncio.Future()
        finally:
            await connection.close()

if __name__ == "__main__":
    asyncio.run(main()) 