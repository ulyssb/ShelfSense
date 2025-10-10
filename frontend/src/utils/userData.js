/**
 * Utility functions for managing user data in localStorage
 */

const DETECTED_BOOKS_KEY = 'shelfSense_detectedBooks'
const SELECTED_GENRES_KEY = 'shelfSense_selectedGenres'
const STEP1_DATA_KEY = 'shelfSense_step1Data'

/**
 * Save detected books to localStorage
 * @param {string[]} books - Array of detected book titles
 */
export function saveDetectedBooks(books) {
  try {
    localStorage.setItem(DETECTED_BOOKS_KEY, JSON.stringify(books))
  } catch (error) {
  }
}

/**
 * Get detected books from localStorage
 * @returns {string[]} Array of detected book titles
 */
export function getDetectedBooks() {
  try {
    const stored = localStorage.getItem(DETECTED_BOOKS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    return []
  }
}

/**
 * Save selected genres to localStorage
 * @param {string[]} genres - Array of selected genres
 */
export function saveSelectedGenres(genres) {
  try {
    localStorage.setItem(SELECTED_GENRES_KEY, JSON.stringify(genres))
  } catch (error) {
  }
}

/**
 * Get selected genres from localStorage
 * @returns {string[]} Array of selected genres
 */
export function getSelectedGenres() {
  try {
    const stored = localStorage.getItem(SELECTED_GENRES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    return []
  }
}

/**
 * Save step 1 data to localStorage
 * @param {Object} data - Step 1 data including selectedFile, aiResponse, etc.
 */
export function saveStep1Data(data) {
  try {
    localStorage.setItem(STEP1_DATA_KEY, JSON.stringify(data))
  } catch (error) {
  }
}

/**
 * Get step 1 data from localStorage
 * @returns {Object|null} Step 1 data or null if not found
 */
export function getStep1Data() {
  try {
    const stored = localStorage.getItem(STEP1_DATA_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    return null
  }
}

/**
 * Clear step 1 data from localStorage
 */
export function clearStep1Data() {
  try {
    localStorage.removeItem(STEP1_DATA_KEY)
  } catch (error) {
  }
}

/**
 * Clear all user data from localStorage
 */
export function clearUserData() {
  try {
    localStorage.removeItem(DETECTED_BOOKS_KEY)
    localStorage.removeItem(SELECTED_GENRES_KEY)
    localStorage.removeItem(STEP1_DATA_KEY)
  } catch (error) {
  }
}
