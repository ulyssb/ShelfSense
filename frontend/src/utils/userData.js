/**
 * Utility functions for managing user data in localStorage
 */

const DETECTED_BOOKS_KEY = 'shelfSense_detectedBooks'
const SELECTED_GENRES_KEY = 'shelfSense_selectedGenres'

/**
 * Save detected books to localStorage
 * @param {string[]} books - Array of detected book titles
 */
export function saveDetectedBooks(books) {
  try {
    localStorage.setItem(DETECTED_BOOKS_KEY, JSON.stringify(books))
    console.log('Saved detected books:', books)
  } catch (error) {
    console.error('Error saving detected books:', error)
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
    console.error('Error reading detected books from localStorage:', error)
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
    console.log('Saved selected genres:', genres)
  } catch (error) {
    console.error('Error saving selected genres:', error)
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
    console.error('Error reading selected genres from localStorage:', error)
    return []
  }
}

/**
 * Clear all user data from localStorage
 */
export function clearUserData() {
  try {
    localStorage.removeItem(DETECTED_BOOKS_KEY)
    localStorage.removeItem(SELECTED_GENRES_KEY)
    console.log('Cleared user data')
  } catch (error) {
    console.error('Error clearing user data:', error)
  }
}
