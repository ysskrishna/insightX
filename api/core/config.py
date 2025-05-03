import os
from dotenv import load_dotenv

load_dotenv()


class Config(object):
    DATABASE_URL = os.getenv('DATABASE_URL')
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    AWS_REGION = os.getenv('AWS_REGION')
    AWS_S3_BUCKET_NAME = os.getenv('AWS_S3_BUCKET_NAME')
    AWS_S3_ENDPOINT_URL = os.getenv('AWS_S3_ENDPOINT_URL')
    AWS_S3_ENDPOINT_PUBLIC_URL = os.getenv('AWS_S3_ENDPOINT_PUBLIC_URL')
    RABBITMQ_HOST = os.getenv('RABBITMQ_HOST')
    RABBITMQ_PORT = int(os.getenv('RABBITMQ_PORT'))
    RABBITMQ_USER = os.getenv('RABBITMQ_USER')
    RABBITMQ_PASSWORD = os.getenv('RABBITMQ_PASSWORD')
    RABBITMQ_VHOST = os.getenv('RABBITMQ_VHOST')
    RABBITMQ_IMAGE_PROCESSING_QUEUE = os.getenv('RABBITMQ_IMAGE_PROCESSING_QUEUE')