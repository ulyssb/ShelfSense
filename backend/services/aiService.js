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
      console.warn("⚠️ No OPENAI_API_KEY found.");
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
   * @param {string[]} previouslyChosenBooks - List of previously recommended books to avoid
   * @returns {Promise<Array>}
   */
  async getBookRecommendations(currentBooks, preferredGenres, previouslyChosenBooks = []) {
    try {
      console.log(`[AI Service] Getting book recommendations with ${this.provider}...`);

      switch (this.provider.toLowerCase()) {
        case "openai":
          return await this._recommendWithOpenAI(currentBooks, preferredGenres, previouslyChosenBooks);
        case "claude":
          return await this._recommendWithClaude(currentBooks, preferredGenres, previouslyChosenBooks);
        case "gemini":
          return await this._recommendWithGemini(currentBooks, preferredGenres, previouslyChosenBooks);
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
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this bookshelf image and identify the books visible on the shelves.
              Return a JSON object with 'visibility' (a string describing image quality) and 'books'
              (an array of book titles you can identify).
              In visibility, write one word to say how good/bad the image is, and if it's bad explain why you can't identify books (e.g I don't find books in the image, too much sunlight, too dark)`
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" }
    });

    const raw = response.choices[0]?.message?.content;
    console.log("📸 Raw AI response:", raw);

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error("Failed to parse AI response:", raw);
      throw new Error("Invalid JSON returned by AI");
    }

    return parsed;
  }

  /** Claude: Analyze bookshelf image */
  async _analyzeWithClaude(imageUrl) {
    // Placeholder for Claude implementation
    throw new Error("Claude image analysis not implemented yet");
  }

  /** Gemini: Analyze bookshelf image */
  async _analyzeWithGemini(imageUrl) {
    // Placeholder for Gemini implementation
    throw new Error("Gemini image analysis not implemented yet");
  }

  /** OpenAI: Recommend books */
  async _recommendWithOpenAI(currentBooks, preferredGenres) {
    const response = await this.client.chat.completions.create({
      model: "gpt-4o", // full model for better reasoning & creativity
      temperature: 1.2, // adds diversity and avoids repetitive picks
      messages: [
        {
          role: "system",
          content: `
            You are ShelfSense, a personalized literary recommendation assistant.
  
            Your goal is to recommend 5–7 *diverse and relevant* books based on the user's current reading list and genre preferences.
  
            --- RULES ---
            1. Do NOT include any books in the current books list.
            2. Avoid repeating generic "bestseller" suggestions unless they are highly relevant.
            3. Analyze the user's current books in terms of:
               - Themes
               - Emotional tone
               - Writing style
               - Genre balance
            4. Recommend books that share these traits, but also add variety in time period, culture, or perspective.
            5. Only include *real, existing* books (no invented titles).
            6. Provide a short, natural reason that clearly ties each recommendation to the user's preferences.
            7. Output *only* valid JSON — no commentary or extra text.
  
            --- JSON FORMAT ---
            {
              "recommendations": [
                {
                  "title": "string",
                  "author": "string",
                  "genre": "string",
                  "rating": number (1–5),
                  "description": "string",
                  "reason": "string"
                }
              ]
            }
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
  async _recommendWithOpenAI(currentBooks, preferredGenres, previouslyChosenBooks = []) {
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
                  "reason": "string"
                }
              ]
            }
  
            Rules:
            - The rating should be an approximate average (1–5 scale).
            - Use null for coverImage unless you can confidently provide a *real* link from Open Library or Wikipedia.
            - Return only valid JSON.
            - Do NOT include any text or explanation outside the JSON.
            - Do NOT use any other key than "recommendations".
            - AVOID recommending books that are in the previously chosen books list.
          `,
        },
        {
          role: "user",
          content: `
            Current books: ${JSON.stringify(currentBooks)}.
            Preferred genres: ${preferredGenres.join(", ")}.
            ${previouslyChosenBooks.length > 0 ? `Avoid these books: ${JSON.stringify(previouslyChosenBooks)}.` : ''}
          `,
        },
      ],
      response_format: { type: "json_object" },
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
