import boto3
from core.config import Config

class S3Client:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            endpoint_url=Config.AWS_S3_ENDPOINT_URL,
            aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
            region_name=Config.AWS_REGION
        )
        self.bucket_name = Config.AWS_S3_BUCKET_NAME
    
    def download_file(self, storage_path):
        try:
            response = self.s3_client.get_object(
                Bucket=self.bucket_name,
                Key=storage_path
            )   
            return response
        except Exception as e:
            raise Exception(f"Failed to download image from S3: {str(e)}")

s3_client = S3Client() 