# InsightX

[![License: AGPL-3.0](https://img.shields.io/github/license/ysskrishna/insightX)](https://github.com/ysskrishna/insightX/blob/main/LICENSE) [![GitHub release](https://img.shields.io/github/v/release/ysskrishna/insightX?label=release)](https://github.com/ysskrishna/insightX/releases) [![Author site](https://img.shields.io/badge/author-ysskrishna.space-informational)](https://ysskrishna.space)

A powerful image analysis platform that provides automated insights through advanced computer vision and machine learning capabilities.

## Project Overview

InsightX is a distributed system that provides real-time image analysis with the following key features:

- **NSFW Detection**: Advanced content moderation using deep learning to identify potentially inappropriate content
- **Object Detection**: Real-time object detection with bounding boxes using YOLOv8
- **Visual Insights**: Detailed analysis of image contents with confidence scores
- **Modern UI**: Clean and intuitive interface for viewing and managing image analysis results
- **Flexible Storage**: MinIO for local development and AWS S3 for production environments

## Key Features

- **Real-time Processing**: Asynchronous processing pipeline for quick image analysis
- **Multiple Detection Models**: 
  - YOLOv8 for object detection
  - NudeNet for NSFW content detection
- **Visual Annotations**: Automatic generation of annotated images with bounding boxes
- **Detailed Analytics**: Comprehensive object detection results with confidence scores
- **Content Moderation**: Built-in NSFW detection for content safety
- **Scalable Architecture**: Distributed system design for handling high volumes of images

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- Python 3.8+ (for local development)

## Quick Start

1. Clone the repository:
```bash
git clone [repository-url]
cd insightx
```

2. Start the services using Docker Compose:
```bash
docker-compose up -d
```

3. Access the application:
- Frontend: http://localhost:3000
- API: http://localhost:8000
- Worker: Running in background

## Project Structure

```
.
├── client/          # Next.js frontend application
├── api/            # FastAPI backend service
├── worker/         # Background processing service
├── storage/        # Image storage and processing
└── docker-compose.yml
```

## Development

### Client
- Built with Next.js and TypeScript
- Modern UI components using shadcn/ui
- Real-time image analysis results display
- Located in `client/` directory
- See [Client README](client/README.md) for detailed setup instructions

### API
- FastAPI-based backend service
- Handles image uploads and analysis requests
- Manages detection results and storage
- Supports both MinIO, AWS S3 for image storage
- Located in `api/` directory
- See [API README](api/README.md) for detailed setup instructions

### Worker
- Background processing service for image analysis
- Implements YOLOv8 and NudeNet models
- Generates annotated images with detection results
- Supports both MinIO, AWS S3 for image storage
- Located in `worker/` directory
- See [Worker README](worker/README.md) for detailed setup instructions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Built and maintained by

InsightX is built and maintained by:

| | Name | GitHub | Role |
|---|------|--------|------|
| <img src="https://github.com/ysskrishna.png?size=120" width="60" height="60" alt="Y. Siva Sai Krishna"> | **Y. Siva Sai Krishna** | [@ysskrishna](https://github.com/ysskrishna) | Creator |

## Changelog

See [CHANGELOG](CHANGELOG.md) for release history.

## Support

If you find this project helpful:

- ⭐ Star the repository
- 🐛 [Report issues](https://github.com/ysskrishna/insightX/issues)
- 🔀 Submit pull requests
- 💝 [Sponsor on GitHub](https://github.com/sponsors/ysskrishna)

## License

AGPL-3.0 © [Y. Siva Sai Krishna](https://github.com/ysskrishna) — see [LICENSE](LICENSE) for details.

---

<p align="left">
  <a href="https://github.com/ysskrishna">Author's GitHub</a> •
  <a href="https://linkedin.com/in/ysskrishna">Author's LinkedIn</a> •
  <a href="https://ysskrishna.space">Author's site</a> •
  <a href="https://github.com/ysskrishna/insightX/issues">Report Issues</a>
</p>
