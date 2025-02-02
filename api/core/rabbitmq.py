import pika
import json
import time
from pika.exceptions import AMQPConnectionError, StreamLostError
from core.config import Config

class RabbitMQClient:
    def __init__(self, max_retries: int = 3, retry_delay: int = 5):
        self.max_retries = max_retries
        self.retry_delay = retry_delay

    def _connect(self):
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(
                host=Config.RABBITMQ_HOST,
                heartbeat=60,
                blocked_connection_timeout=300,
                credentials=pika.PlainCredentials(
                    Config.RABBITMQ_USER,
                    Config.RABBITMQ_PASSWORD
                )
            )
        )
        channel = connection.channel()
        channel.queue_declare(queue=Config.RABBITMQ_IMAGE_PROCESSING_QUEUE, durable=True)
        return connection, channel

    def publish_message(self, message: dict):
        attempts = 0
        while attempts < self.max_retries:
            try:
                connection, channel = self._connect()
                channel.basic_publish(
                    exchange='',
                    routing_key=Config.RABBITMQ_IMAGE_PROCESSING_QUEUE,
                    body=json.dumps(message),
                    properties=pika.BasicProperties(delivery_mode=2)
                )
                connection.close()
                break
            except (AMQPConnectionError, StreamLostError, ConnectionResetError) as e:
                attempts += 1
                print(f"[RabbitMQ] Publish attempt {attempts} failed: {e}")
                time.sleep(self.retry_delay)
        else:
            raise Exception("Failed to publish message to RabbitMQ after multiple attempts")