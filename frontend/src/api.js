// src/api.js

const API_URL = import.meta.env.VITE_API_BASE_URL;


async function post(endpoint, body) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

/** Analyze an image and get books */
export async function analyzeImage(imageUrl) {
  console.log("ABOUT TO POST DATA to backend");
  const data = await post("/analyze-image", { imageUrl });
  return data; // Return full response, not just books
}

/** Get refined book recommendations */
export async function recommendBooks(currentBooks, preferredGenres, previouslyChosenBooks = []) {
  const data = await post("/recommend-books", { currentBooks, preferredGenres, previouslyChosenBooks });
  return data; // Backend now returns array directly
}

console.log("📡 Using API base:", API_URL);
