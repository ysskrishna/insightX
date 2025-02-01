import os
from dotenv import load_dotenv

load_dotenv()


class Config(object):
    RABBITMQ_HOST = os.getenv('RABBITMQ_HOST')
    RABBITMQ_PORT = int(os.getenv('RABBITMQ_PORT'))
    RABBITMQ_USER = os.getenv('RABBITMQ_USER')
    RABBITMQ_PASSWORD = os.getenv('RABBITMQ_PASSWORD')
    RABBITMQ_VHOST = os.getenv('RABBITMQ_VHOST')
    RABBITMQ_IMAGE_PROCESSING_QUEUE = os.getenv('RABBITMQ_IMAGE_PROCESSING_QUEUE')