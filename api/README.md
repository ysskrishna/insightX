# API Service

The backend API service for InsightX, built with FastAPI and Python.

## Tech Stack

- **Framework**: FastAPI
- **Language**: Python 3.8+
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Message Queue**: RabbitMQ (via aio-pika)
- **Storage**: AWS S3 (via boto3)
- **Documentation**: OpenAPI/Swagger

## Getting Started

### Prerequisites

- Python 3.8 or later
- PostgreSQL
- RabbitMQ
- pip

### Installation

1. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables in .env file

4. Run the development server:
```bash
cd api
python main.py
```

1. Access the API documentation at [http://localhost:8000/docs](http://localhost:8000/docs)

## Project Structure

```
api/
├── core/           # Core functionality and configurations
├── routers/        # API route handlers
├── services/       # Business logic and services
└── main.py         # Application entry point
```

## Development

### Available Commands

- `python main.py` - Start development server

### API Documentation

The API documentation is automatically generated using OpenAPI/Swagger. Access it at:
- Swagger UI: `/docs`
- ReDoc: `/redoc`


## Contributing

1. Follow PEP 8 style guide
2. Write meaningful commit messages
3. Update documentation as needed

## Keywords

- fastapi
- python
- computer-vision
- postgresql
- sqlalchemy
- rest-api
- openapi
- swagger
- async
- image-processing
- microservices