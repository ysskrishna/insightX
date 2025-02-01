import pika
import json
import time
from pika.exceptions import AMQPConnectionError
from core.config import Config

class RabbitMQClient:
    def __init__(self, max_retries: int = 5, retry_delay: int = 5):
        self.max_retries = max_retries
        self.retry_delay = retry_delay
        self.connection = None
        self.channel = None
        self.connect()
    
    def connect(self):
        attempts = 0
        while attempts < self.max_retries:
            try:
                self.connection = pika.BlockingConnection(
                    pika.ConnectionParameters(
                        host=Config.RABBITMQ_HOST,
                        heartbeat=60,
                        blocked_connection_timeout=300,
                        credentials=pika.PlainCredentials(
                            Config.RABBITMQ_USER, 
                            Config.RABBITMQ_PASSWORD
                        ),
                    )
                )
                self.channel = self.connection.channel()
                self.channel.queue_declare(queue=Config.RABBITMQ_IMAGE_PROCESSING_QUEUE, durable=True)
                break
            except AMQPConnectionError as e:
                attempts += 1
                print(f"Connection attempt {attempts} failed: {e}")
                time.sleep(self.retry_delay)
        else:
            raise Exception("Failed to connect to RabbitMQ")

    def ensure_connection(self):
        try:
            if not self.connection or self.connection.is_closed:
                self.connect()
            if not self.channel or self.channel.is_closed:
                self.channel = self.connection.channel()
                self.channel.queue_declare(queue=Config.RABBITMQ_IMAGE_PROCESSING_QUEUE, durable=True)
        except Exception as e:
            print(f"Error ensuring connection: {e}")
            self.connect()

    def publish_message(self, message: dict):
        self.ensure_connection()
        self.channel.basic_publish(
            exchange='',
            routing_key=Config.RABBITMQ_IMAGE_PROCESSING_QUEUE,
            body=json.dumps(message),
            properties=pika.BasicProperties(
                delivery_mode=2
            )
        )

    def close(self):
        if self.channel and self.channel.is_open:
            self.channel.close()
        if self.connection and self.connection.is_open:
            self.connection.close()

rabbitmq_client = RabbitMQClient() 