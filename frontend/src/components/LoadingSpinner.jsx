import './LoadingSpinner.css'

/**
 * Reusable loading spinner component
 * @param {string} message - Loading message to display
 * @param {string} className - Additional CSS classes
 */
function LoadingSpinner({ message = "Loading...", className = "" }) {
  return (
    <div className={`loading-container ${className}`}>
      <div className="loading-spinner"></div>
      <p>{message}</p>
    </div>
  )
}

export default LoadingSpinner
