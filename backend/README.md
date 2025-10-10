# ShelfSense Backend

Backend API server for ShelfSense - AI-powered book recommendation system.

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- OpenAI API Key

### Environment Setup
1. Create a `.env` file in the backend directory:
```bash
PORT=5001
OPENAI_API_KEY=your_openai_api_key_here
```

### Running Locally

#### Option 1: Direct start
```bash
npm start
```

#### Option 2: Development mode (recommended)
```bash
npm run dev
```

The server will start on `http://localhost:5001`

## API Endpoints

- `GET /` - Health check
- `POST /analyze-image` - Analyze bookshelf image
- `POST /recommend-books` - Get book recommendations

## Troubleshooting

### Port Already in Use
If you get "Port 5001 is already in use":
1. Kill any existing processes: `lsof -ti:5001 | xargs kill -9`
2. Or change the PORT in your `.env` file

### OpenAI API Key Missing
Make sure your `.env` file contains:
```
OPENAI_API_KEY=your_actual_api_key_here
```

## Development

The server automatically:
- Loads environment variables from `.env`
- Validates the PORT configuration
- Provides detailed startup logging
- Handles graceful shutdown on SIGINT/SIGTERM
