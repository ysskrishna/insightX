from sqlalchemy import  Column, Integer, String, DateTime, Boolean, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import declarative_mixin

from core.dbutils import Base

@declarative_mixin
class Timestamp:
    created_at = Column(DateTime, default=func.now(), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), server_default=func.now(), onupdate=func.now(), nullable=False)


class Image(Timestamp, Base):
    __tablename__ = "images"

    image_id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    storage_path = Column(String, nullable=False)
    is_processed = Column(Boolean, nullable=False, default=False)
    is_nsfw = Column(Boolean, nullable=True)
    detected_nsfw = Column(JSON, nullable=True)
    detected_objects = Column(JSON, nullable=True)
