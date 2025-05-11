# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-05-11

### Added
- Initial project setup with client, API, and worker components
- Docker Compose setup for all services
- Development environment configuration
- Basic project documentation and README files
- License (AGPL-3.0) and contribution guidelines



#### Client
- Next.js 15 frontend application with TypeScript
- Modern UI using Tailwind CSS and Radix UI components
- Real-time image analysis results display
- File upload functionality using React Dropzone
- Environment configuration for API integration

#### API
- FastAPI backend service with Python 3.8+
- PostgreSQL database integration with SQLAlchemy ORM
- RabbitMQ message queue integration using aio-pika
- Flexible storage with MinIO or AWS S3 via boto3
- OpenAPI/Swagger documentation
- Core API routes and services structure

#### Worker
- Background processing service for image analysis
- YOLOv8 integration for object detection
- NSFW content detection capabilities
- Image processing with OpenCV
- RabbitMQ consumer implementation
- Flexible storage with MinIO or AWS S3 via boto3


[1.0.0]: https://github.com/ysskrishna/insightX/releases/tag/v1.0.0