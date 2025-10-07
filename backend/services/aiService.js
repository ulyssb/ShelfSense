import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

// --- Load .env correctly no matter where you run from ---
dotenv.config();

class AIService {
  constructor() {
    this.provider = "openai"; // Default provider
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    if (!process.env.OPENAI_API_KEY) {
      console.warn("⚠️ No OPENAI_API_KEY found. Check your .env file.");
    }
  }

  /**
   * Analyze a bookshelf image and extract book information
   * @param {string} imageUrl - Image URL or base64 image
   * @returns {Promise<{visibility: string, books: string[]}>}
   */
  async analyzeBookshelfImage(imageUrl) {
    try {
      console.log(`[AI Service] Analyzing bookshelf image with ${this.provider}...`);

      switch (this.provider.toLowerCase()) {
        case "openai":
          return await this._analyzeWithOpenAI(imageUrl);
        case "claude":
          return await this._analyzeWithClaude(imageUrl);
        case "gemini":
          return await this._analyzeWithGemini(imageUrl);
        default:
          throw new Error(`Unsupported AI provider: ${this.provider}`);
      }
    } catch (error) {
      console.error("[AI Service] Error analyzing image:", error);
      throw error;
    }
  }

  /**
   * Get book recommendations based on current books and preferences
   * @param {string[]} currentBooks - List of current books
   * @param {string[]} preferredGenres - List of preferred genres
   * @returns {Promise<Array>}
   */
  async getBookRecommendations(currentBooks, preferredGenres) {
    try {
      console.log(`[AI Service] Getting book recommendations with ${this.provider}...`);

      switch (this.provider.toLowerCase()) {
        case "openai":
          return await this._recommendWithOpenAI(currentBooks, preferredGenres);
        case "claude":
          return await this._recommendWithClaude(currentBooks, preferredGenres);
        case "gemini":
          return await this._recommendWithGemini(currentBooks, preferredGenres);
        default:
          throw new Error(`Unsupported AI provider: ${this.provider}`);
      }
    } catch (error) {
      console.error("[AI Service] Error getting recommendations:", error);
      throw error;
    }
  }

  /**
   * Switch AI provider
   * @param {string} provider - 'openai', 'claude', 'gemini'
   */
  setProvider(provider) {
    const supportedProviders = ["openai", "claude", "gemini"];
    const normalized = provider.toLowerCase();

    if (!supportedProviders.includes(normalized)) {
      throw new Error(`Unsupported provider: ${provider}. Supported: ${supportedProviders.join(", ")}`);
    }

    this.provider = normalized;
    console.log(`[AI Service] Switched to ${normalized}`);
  }

  /** Get current provider */
  getCurrentProvider() {
    return this.provider;
  }

  // ---------- Private methods ----------

  /** OpenAI: Analyze bookshelf image */
  async _analyzeWithOpenAI(imageUrl) {
    const response = await this.client.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-4o" for stronger OCR
      messages: [
        {
          role: "system",
          content:
            "You are a vision model that looks at bookshelf photos and describes readability and possible book titles.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
                You'll receive a bookshelf photo.
                1. Tell me if you can read the titles ("all good" or "get better results by ...").
                2. Then list any visible or likely books.
                Return your answer as JSON:
                {
                  "visibility": "string",
                  "books": ["Book 1", "Book 2", ...]
                }
              `,
            },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    const raw = response.choices[0]?.message?.content;
    console.log(" GPT response:", raw);

    try {
      return JSON.parse(raw);
    } catch (err) {
      console.error("❌ Failed to parse AI JSON:", err);
      console.log("Raw content:", raw);
      throw new Error("Invalid JSON returned by AI");
    }
  }

  /** OpenAI: Recommend books */
  async _recommendWithOpenAI(currentBooks, preferredGenres) {
    const response = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
            You are a book recommendation assistant.
            Given a list of books and preferred genres, return 5–7 new book suggestions as a JSON object
            with a single top-level key named "recommendations".
  
            Use this format exactly:
            {
              "recommendations": [
                {
                  "title": "string",
                  "author": "string",
                  "genre": "string",
                  "rating": number,
                  "description": "string",
                  "coverImage": "string or null",
                  "reason": "string"
                }
              ]
            }
  
            Rules:
            - The rating should be an approximate average (1–5 scale).
            - Use null for coverImage unless you can confidently provide a *real* link from Open Library or Wikipedia.
            - Do NOT invent URLs.
            - If unsure, set coverImage to null.
            - Return only valid JSON.
            - Do NOT include any text or explanation outside the JSON.
            - Do NOT use any other key than "recommendations".
          `,
        },
        {
          role: "user",
          content: `
            Current books: ${JSON.stringify(currentBooks)}.
            Preferred genres: ${preferredGenres.join(", ")}.
          `,
        },
      ],
      response_format: { type: "json_object" }, // ✅ Forces GPT to return a valid JSON object
    });
  
    const raw = response.choices[0]?.message?.content;
    console.log("📚 Raw AI response:", raw);
  
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("❌ Could not parse AI response:", err);
      console.log("Raw response:", raw);
      throw new Error("Invalid JSON returned by model");
    }
  
    // ✅ Always expect recommendations array
    if (Array.isArray(parsed.recommendations)) {
      console.log("Parsed recommendations:", parsed.recommendations);
      return parsed.recommendations;
    }
  
    console.warn("⚠️ Unexpected response shape:", parsed);
    return [];
  }

  async _analyzeWithClaude() {
    throw new Error("Claude integration not implemented yet");
  }

  async _analyzeWithGemini() {
    throw new Error("Gemini integration not implemented yet");
  }

  async _recommendWithClaude() {
    throw new Error("Claude integration not implemented yet");
  }

  async _recommendWithGemini() {
    throw new Error("Gemini integration not implemented yet");
  }
}

// Export singleton instance
export const aiService = new AIService();
export { AIService };
