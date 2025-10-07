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
export async function generateRecommendations(currentBooks, preferredGenres, previouslyChosenBooks = []) {
  try {
    console.log("Generating recommendations with:", { currentBooks, preferredGenres, previouslyChosenBooks })
    const aiRecommendations = await recommendBooks(currentBooks, preferredGenres, previouslyChosenBooks)
    console.log("AI response:", aiRecommendations)
    
    // Add IDs to the recommendations
    const newRecommendations = aiRecommendations.map((rec, index) => ({
      ...rec,
      id: index + 1
    }))
    
    console.log("AI generated recommendations:", newRecommendations)
    return newRecommendations
  } catch (error) {
    const apiError = handleApiError(error, 'recommendation generation')
    logError(error, 'RecommendationService', { currentBooks, preferredGenres, previouslyChosenBooks })
    
    // Fallback to hardcoded recommendations if AI fails
    console.log("Falling back to hardcoded recommendations due to:", apiError.message)
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
