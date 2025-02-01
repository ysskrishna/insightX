import boto3
from core.config import Config
from typing import Dict
from fastapi import HTTPException
from datetime import datetime
from werkzeug.utils import secure_filename
from botocore.exceptions import ClientError

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
        self.check_bucket()
    
    def check_bucket(self) -> None:
        try:
            self.s3_client.head_bucket(Bucket=self.bucket_name)
        except ClientError:
            self.s3_client.create_bucket(Bucket=self.bucket_name)
    
    def clean_filename(self, filename: str) -> str:
        safe_name = secure_filename(filename)
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")[:-3]
        name, ext = safe_name.rsplit('.', 1)
        return f"{timestamp}_{name}.{ext}"

    def upload_file(self, file_obj, content_type: str, filename: str) -> Dict[str, str]:
        try:            
            object_key = f"uploads/{self.clean_filename(filename)}"
            self.s3_client.upload_fileobj(
                file_obj,
                self.bucket_name,
                object_key,
                ExtraArgs={
                    'ContentType': content_type
                }
            )
            return object_key
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")
    
    def generate_presigned_get_url(self, object_key: str) -> str:
        try:
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': object_key},
                ExpiresIn=3600
            )
            return url
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to get presigned GET url: {str(e)}")
    
    def generate_presigned_put_url(self, object_key: str, content_type: str = 'image/jpeg', expires_in: int = 3600) -> str:
        try:
            url = self.s3_client.generate_presigned_url(
                'put_object',
                Params={'Bucket': self.bucket_name, 'Key': object_key, 'ContentType': content_type},
                ExpiresIn=expires_in
            )
            return url
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to get presigned PUT url: {str(e)}")

s3_client = S3Client() 