import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { aiService } from "./services/aiService.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---------- ROUTE 1 ----------
// Analyze an image and suggest books
app.post("/analyze-image", async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const result = await aiService.analyzeBookshelfImage(imageUrl);
    res.json(result);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- ROUTE 2 ----------
// Recommend books given current list + genre preferences
app.post("/recommend-books", async (req, res) => {
  try {
    const { currentBooks, preferredGenres, previouslyChosenBooks = [] } = req.body;
    const recommendations = await aiService.getBookRecommendations(currentBooks, preferredGenres, previouslyChosenBooks);
    res.json(recommendations); // Return array directly
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
    res.send("Backend is running and ready");
  });
  

// ---------- SERVER START ----------
const PORT = process.env.PORT || 5001;
const HOST = process.env.BACKEND_HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`Backend running on ${HOST}:${PORT}`)
  console.log(`API endpoints:`)
  console.log(`   POST http://${HOST}:${PORT}/analyze-image`)
  console.log(`   POST http://${HOST}:${PORT}/recommend-books`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port.`)
  } else {
    console.error('Server error:', error)
  }
  process.exit(1)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log(' SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log(' SIGINT received, shutting down gracefully')
  server.close(() => {
    console.log(' Server closed')
    process.exit(0)
  })
})