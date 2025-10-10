/**
 * Error handling utilities
 */

/**
 * Log error with context
 * @param {Error} error - The error object
 * @param {string} context - Context where the error occurred
 * @param {Object} additionalData - Additional data to log
 */
export function logError(error, context, additionalData = {}) {
  if (Object.keys(additionalData).length > 0) {
  }
}

/**
 * Create a user-friendly error message
 * @param {Error} error - The error object
 * @param {string} defaultMessage - Default message if error is not user-friendly
 * @returns {string} User-friendly error message
 */
export function getUserFriendlyErrorMessage(error, defaultMessage = "Something went wrong. Please try again.") {
  // Check if error message is user-friendly (doesn't contain technical details)
  const technicalKeywords = ['undefined', 'null', 'TypeError', 'ReferenceError', 'SyntaxError', 'NetworkError']
  const isTechnicalError = technicalKeywords.some(keyword =>
    error.message.toLowerCase().includes(keyword.toLowerCase())
  )

  if (isTechnicalError) {
    return defaultMessage
  }

  return error.message || defaultMessage
}

/**
 * Handle API errors consistently
 * @param {Error} error - The error object
 * @param {string} operation - The operation that failed
 * @returns {Object} Error object with user-friendly message
 */
export function handleApiError(error, operation) {
  logError(error, `API ${operation}`)

  let userMessage = "Something went wrong. Please try again."

  if (error.message.includes('Failed to fetch')) {
    userMessage = "Unable to connect to the server. Please check your internet connection."
  } else if (error.message.includes('500')) {
    userMessage = "Server error. Please try again later."
  } else if (error.message.includes('404')) {
    userMessage = "The requested resource was not found."
  }

  return {
    message: userMessage,
    originalError: error
  }
}
