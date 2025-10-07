# 📚 ShelfSense

ShelfSense is an AI-powered bookshelf companion that analyzes your bookshelf from an image and recommends new books you’ll love — combining computer vision with intelligent recommendations.

---

## ✨ Features

-  **Bookshelf Analyzer** — Upload a photo of your bookshelf, and the AI identifies book titles it can read.
- **Smart Book Recommendations** — Get personalized book suggestions based on your current reads and favorite genres.
- **Real Book Covers** — Uses the Open Library API to attach real cover images to recommendations.
- **Flexible AI Backend** — Modular backend supporting OpenAI (with future support for Claude and Gemini).
- 💬 **Clean JSON API** — Well-defined backend routes for both image analysis and recommendation generation.

---

## How It Works

1. **Upload an Image** — The frontend sends your bookshelf photo to the backend.
2. **AI Vision Analysis** — The backend uses GPT-4o’s vision capabilities to identify visible book titles.
3. **Personalized Suggestions** — The app recommends 5–7 new books based on your bookshelf and genre preferences.
4. **Real Covers & Metadata** — Open Library data enriches the results with actual book covers and descriptions.

---

## Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React + Vite |
| **Backend** | Node.js + Express |
| **AI Model** | OpenAI GPT-4o / GPT-4o-mini |
| **Book Data** | Open Library API |
| **Environment** | dotenv for key management |

