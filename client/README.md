# Client Application

The frontend application for InsightX, built with Next.js and modern web technologies.

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **File Upload**: React Dropzone

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Start the development server:
```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
client/
├── app/              # Next.js app directory (pages and layouts)
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and shared logic
├── public/          # Static assets
├── styles/          # Global styles and Tailwind configuration
└── common/          # Shared types and constants
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Contributing

1. Follow the TypeScript and ESLint configurations
2. Write meaningful commit messages
3. Update documentation as needed

## Keywords

- image analysis
- computer vision
- nextjs
- typescript
- react
- tailwindcss
- radix-ui
- dashboard
- analytics
- real-time 