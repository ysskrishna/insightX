# Worker Service

The background processing service for InsightX, handling image analysis and computer vision tasks.

## Tech Stack

- **Framework**: Python
- **Message Queue**: RabbitMQ (via aio-pika)
- **ML Framework**: YOLOv8
- **Storage**: AWS S3 (via boto3)
- **Data Processing**: Pandas, NumPy
- **Image Processing**: OpenCV

## Getting Started

### Prerequisites

- Python 3.8 or later
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

4. Start the worker:
```bash
python main.py
```

## Project Structure

```
worker/
├── core/           # Core functionality and configurations
├── processors/     # Task processors and handlers
└── main.py         # Worker entry point
```

## Development

### Available Commands

- `python main.py` - Start worker

### Task Processing

The worker processes the following types of tasks:
- Image processing and analysis using YOLOv8
- NSFW content detection
- Object detection with bounding boxes

## Contributing

1. Follow PEP 8 style guide
2. Write meaningful commit messages
3. Update documentation as needed

## Keywords

- python
- rabbitmq
- yolov8
- machine-learning
- computer-vision
- image-processing
- content-moderation
- microservices
- async-processing 