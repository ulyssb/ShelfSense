/**
 * Utility functions for managing previously chosen books in localStorage
 */

const PREVIOUSLY_CHOSEN_BOOKS_KEY = 'shelfSense_previouslyChosenBooks'

/**
 * Get previously chosen books from localStorage
 * @returns {string[]} Array of book titles
 */
export function getPreviouslyChosenBooks() {
  try {
    const stored = localStorage.getItem(PREVIOUSLY_CHOSEN_BOOKS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading previously chosen books from localStorage:', error)
    return []
  }
}

/**
 * Add new books to previously chosen books list
 * @param {Array} newRecommendations - Array of recommendation objects with title property
 * @returns {string[]} Updated list of previously chosen books
 */
export function addToPreviouslyChosenBooks(newRecommendations) {
  try {
    const currentBooks = getPreviouslyChosenBooks()
    const newTitles = newRecommendations.map(rec => rec.title).filter(title => title)
    
    // Add new titles that aren't already in the list
    const updatedBooks = [...new Set([...currentBooks, ...newTitles])]
    
    localStorage.setItem(PREVIOUSLY_CHOSEN_BOOKS_KEY, JSON.stringify(updatedBooks))
    console.log('Added to previously chosen books:', newTitles)
    console.log('Total previously chosen books:', updatedBooks.length)
    
    return updatedBooks
  } catch (error) {
    console.error('Error adding to previously chosen books:', error)
    return getPreviouslyChosenBooks()
  }
}

/**
 * Clear all previously chosen books
 */
export function clearPreviouslyChosenBooks() {
  try {
    localStorage.removeItem(PREVIOUSLY_CHOSEN_BOOKS_KEY)
    console.log('Cleared previously chosen books')
  } catch (error) {
    console.error('Error clearing previously chosen books:', error)
  }
}

/**
 * Get count of previously chosen books
 * @returns {number} Number of previously chosen books
 */
export function getPreviouslyChosenBooksCount() {
  return getPreviouslyChosenBooks().length
}
