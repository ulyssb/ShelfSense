# ShelfSense

ShelfSense is an AI-powered bookshelf companion that analyzes your bookshelf from an image and recommends new books you’ll love — combining computer vision with intelligent literary recommendations.

**Live Demo:** [https://shelf-sense-six.vercel.app/](https://shelf-sense-six.vercel.app/)

---

## Features

- **Bookshelf Analyzer** — Upload a photo of your bookshelf, and the AI identifies book titles it can read.
- **Smart Book Recommendations** — Personalized book suggestions based on your current reads and genre preferences.
- **Real Book Covers** — Fetches authentic cover images and metadata from the [Open Library API](https://openlibrary.org/developers/api).
- **Modular AI Backend** — Express backend with pluggable AI providers (OpenAI GPT-4o / GPT-4o-mini, future support for Claude and Gemini).
- **Clean JSON API** — Two well-defined routes for image analysis and recommendation generation.

---

## How It Works

1. **Upload an Image** — The frontend sends your bookshelf photo to the backend.  
2. **AI Vision Analysis** — The backend uses OpenAI’s vision models to identify visible book titles.  
3. **Personalized Suggestions** — The AI recommends 5–7 new books based on your bookshelf and genre preferences.  
4. **Real Covers & Metadata** — Book data is enriched with real covers and details from Open Library.

---

## Future Improvements

- **User Authentication & Saved Reading Lists** — Allow users to create accounts, log in, and maintain personalized reading lists stored securely in a database.
- **Multi-AI Provider Support** — Integrate alternative AI models such as Anthropic’s Claude or Google’s Gemini for flexible, cost-efficient AI processing.
- **Enhanced Bookshelf Text Recognition** — Improve title extraction from bookshelf images using dedicated OCR (Optical Character Recognition) tools for better accuracy.
- **Goodreads Integration & Preference Import** — Enable users to connect their Goodreads account or import favorite books directly, allowing them to skip the bookshelf analysis step.

---

## Live Deployment

| Layer | Platform | URL |
|--------|-----------|-----|
| **Frontend** | Vercel | [https://shelf-sense-six.vercel.app/](https://shelf-sense-six.vercel.app/) |
| **Backend** | Render | Private API endpoint (accessed by the frontend) |

The frontend (hosted on **Vercel**) communicates securely with the backend (on **Render**) through environment-configured API URLs.

---

## Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | React + Vite (deployed on Vercel) |
| **Backend** | Node.js + Express (deployed on Render) |
| **AI Models** | OpenAI GPT-4o / GPT-4o-mini |
| **Data Source** | Open Library API |
| **Styling** | Tailwind CSS |
| **Environment** | dotenv + environment variables (Vercel & Render dashboards) |

---

## API Endpoints

| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/analyze-image` | `POST` | Analyzes a bookshelf image and returns detected book titles and readability info. |
| `/recommend-books` | `POST` | Generates personalized book recommendations based on user’s books and genre preferences. |

---

## Environment Variables

### Backend (Render)

| Key | Description |
|-----|--------------|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `NODE_ENV` | Should be set to `production` |
| `BACKEND_HOST` | `0.0.0.0` (optional, Render default) |

### Frontend (Vercel)

| Key | Description |
|-----|--------------|
| `VITE_API_BASE_URL` | URL of your Render backend |

---

## Local Development

To run locally:

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/ShelfSense.git
cd ShelfSense

# 2. Start backend
cd backend
npm install
npm run dev

# 3. Start frontend
cd ../frontend
npm install
npm run dev
