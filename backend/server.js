import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import { aiService } from "./services/aiService.js";

dotenv.config();

const app = express();
app.use(cors());

const BODY_SIZE_LIMIT_MB = process.env.BODY_SIZE_LIMIT_MB || 5; // fallback

// Configure multer for memory storage (no disk storage needed)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: BODY_SIZE_LIMIT_MB * 1024 * 1024, // Convert MB to bytes
  },
  fileFilter: (req, file, cb) => {
    // Accept common image formats including HEIC
    const allowedTypes = /jpeg|jpg|png|gif|webp|heic|heif/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype || extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

app.use(express.json({ limit: `${BODY_SIZE_LIMIT_MB}mb` }));
app.use(express.urlencoded({ limit: `${BODY_SIZE_LIMIT_MB}mb`, extended: true }));
// ---------- ROUTE 1 ----------
// Analyze an image and suggest books
app.post("/analyze-image", upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Convert buffer to base64 data URL
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    const result = await aiService.analyzeBookshelfImage(base64Image);
    res.json(result);
  } catch (err) {
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
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
    res.send("Backend is running and ready");
  });
  

// ---------- SERVER START ----------
const PORT = parseInt(process.env.PORT) || 5001;
const HOST = process.env.BACKEND_HOST || 'localhost';

// Validate PORT is a number
if (isNaN(PORT) || PORT < 1 || PORT > 65535) {
  process.exit(1);
}

const server = app.listen(PORT, HOST, () => {
  console.log(`Backend running on http://${HOST}:${PORT}`)
})

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
  } else {
  }
  process.exit(1)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})