import pika
import json
from core.config import Config

class RabbitMQClient:
    def __init__(self):
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters(
                host=Config.RABBITMQ_HOST,
                credentials=pika.PlainCredentials(Config.RABBITMQ_USER, Config.RABBITMQ_PASSWORD)
            )
        )
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue=Config.RABBITMQ_IMAGE_PROCESSING_QUEUE, durable=True)

    def publish_message(self, message: dict):
        self.channel.basic_publish(
            exchange='',
            routing_key=Config.RABBITMQ_IMAGE_PROCESSING_QUEUE,
            body=json.dumps(message),
            properties=pika.BasicProperties(
                delivery_mode=2
            )
        )

    def close(self):
        self.connection.close()

rabbitmq_client = RabbitMQClient() 