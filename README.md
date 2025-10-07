# ShelfSense

AI-powered book recommendations based on your bookshelf.

## Project Structure

```
ShelfSense/
├── backend/          # Node.js/Express API server
├── frontend/         # React frontend application
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```
   PORT=5000
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

## API Endpoints

- `POST /analyze-image` - Analyze a bookshelf image and extract book titles
- `POST /recommend-books` - Get book recommendations based on current books and preferences

## Environment Variables

### Backend
- `PORT` - Server port (default: 5000)
- `OPENAI_API_KEY` - OpenAI API key for GPT-4 vision and text generation

### Frontend
- `VITE_API_URL` - Backend API URL (default: http://localhost:5001)
