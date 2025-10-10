import { recommendBooks } from '../api.js'
import { FALLBACK_RECOMMENDATIONS } from '../constants/fallbackRecommendations.js'
import { logError, handleApiError } from '../utils/errorHandling.js'

/**
 * Generate AI recommendations with fallback to hardcoded recommendations
 * @param {string[]} currentBooks - Array of current books
 * @param {string[]} preferredGenres - Array of preferred genres
 * @param {string[]} previouslyChosenBooks - Array of previously recommended books to avoid
 * @returns {Promise<Array>} Array of recommendations with IDs
 */
export async function generateRecommendations(currentBooks, preferredGenres, previouslyChosenBooks = [], signal = null) {
  try {
    const aiRecommendations = await recommendBooks(currentBooks, preferredGenres, previouslyChosenBooks, signal)

    // Add IDs to the recommendations
    const newRecommendations = aiRecommendations.map((rec, index) => ({
      ...rec,
      id: index + 1
    }))

    return newRecommendations
  } catch (error) {
    // Don't fallback if request was cancelled
    if (error.message === "Request was cancelled") {
      throw error;
    }

    const apiError = handleApiError(error, 'recommendation generation')
    logError(error, 'RecommendationService', { currentBooks, preferredGenres, previouslyChosenBooks })

    // Fallback to hardcoded recommendations if AI fails
    return FALLBACK_RECOMMENDATIONS
  }
}

/**
 * Add IDs to recommendations array
 * @param {Array} recommendations - Array of recommendations without IDs
 * @returns {Array} Array of recommendations with IDs
 */
export function addIdsToRecommendations(recommendations) {
  return recommendations.map((rec, index) => ({
    ...rec,
    id: index + 1
  }))
}
