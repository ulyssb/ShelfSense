// src/api.js

const API_URL = import.meta.env.VITE_API_BASE_URL;

async function post(endpoint, body, signal = null) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: signal
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error("Request was cancelled");
    }
    throw error;
  }
}

/** Analyze an image and get books */
export async function analyzeImage(imageFile, signal = null) {

  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch(`${API_URL}/analyze-image`, {
      method: 'POST',
      body: formData,
      signal: signal
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Server error: ${response.status} ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data; // Return full response, not just books
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error("Request was cancelled");
    }
    throw error;
  }
}

/** Get refined book recommendations */
export async function recommendBooks(currentBooks, preferredGenres, previouslyChosenBooks = [], signal = null) {
  const data = await post("/recommend-books", { currentBooks, preferredGenres, previouslyChosenBooks }, signal);
  return data; // Backend now returns array directly
}

