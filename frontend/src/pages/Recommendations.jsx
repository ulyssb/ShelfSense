import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import Toast from '../components/Toast.jsx'
import { useRecommendations } from '../hooks/useRecommendations.js'
import { useReadingList } from '../hooks/useReadingList.js'
import { useIsMounted } from '../hooks/useIsMounted.js'
import { generateRecommendations } from '../services/recommendationService.js'
import { getPreviouslyChosenBooks, addToPreviouslyChosenBooks } from '../utils/previouslyChosenBooks.js'
import { getBookCovers } from '../utils/bookCoverService.js'
import { getDetectedBooks, getSelectedGenres } from '../utils/userData.js'
import './Recommendations.css'

function Recommendations() {
  const { recommendations, hasRecommendations, loading, saveRecommendations } = useRecommendations()
  const { addToReadingList, isBookAdded } = useReadingList()
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' })
  const isMounted = useIsMounted()

  // Ref to store abort controller for cleanup
  const regenerationController = useRef(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (regenerationController.current) {
        regenerationController.current.abort()
      }
    }
  }, [])

  const handleRegenerateRecommendations = async () => {
    // Cancel any existing regeneration
    if (regenerationController.current) {
      regenerationController.current.abort()
    }

    // Only proceed if component is still mounted
    if (!isMounted()) return

    setIsRegenerating(true)

    // Create new AbortController for this request
    regenerationController.current = new AbortController()

    try {
      // Get the actual detected books and selected genres from localStorage
      const detectedBooks = getDetectedBooks()
      const selectedGenres = getSelectedGenres()
      const previouslyChosenBooks = getPreviouslyChosenBooks()

      // Filter out "All Genres" when sending to API
      const genresForAPI = selectedGenres.filter(genre => genre !== 'All Genres')


      // If no detected books or genres, but we have existing recommendations, use those as a base
      if (detectedBooks.length === 0 || genresForAPI.length === 0) {
        if (recommendations.length > 0) {
          // Use existing recommendations as detected books for regeneration
          const existingBooks = recommendations.map(rec => rec.title)
          const existingGenres = [...new Set(recommendations.map(rec => rec.genre))].filter(Boolean)

          const newRecommendations = await generateRecommendations(existingBooks, existingGenres, previouslyChosenBooks, regenerationController.current.signal)

          // Only continue if component is still mounted
          if (!isMounted()) return

          // Get cover images for the recommendations
          const recommendationsWithCovers = await getBookCovers(newRecommendations)

          // Only update state if component is still mounted
          if (isMounted()) {
            // Add new recommendations to previously chosen books
            addToPreviouslyChosenBooks(recommendationsWithCovers)

            saveRecommendations(recommendationsWithCovers)
          }
        } else {
          setToast({
            isVisible: true,
            message: "Please analyze a bookshelf image first to generate recommendations",
            type: 'error'
          })
          return
        }
      } else {
        // Normal flow with detected books and genres
        const newRecommendations = await generateRecommendations(detectedBooks, genresForAPI, previouslyChosenBooks, regenerationController.current.signal)

        // Only continue if component is still mounted
        if (!isMounted()) return

        // Get cover images for the recommendations
        const recommendationsWithCovers = await getBookCovers(newRecommendations)

        // Only update state if component is still mounted
        if (isMounted()) {
          // Add new recommendations to previously chosen books
          addToPreviouslyChosenBooks(recommendationsWithCovers)

          saveRecommendations(recommendationsWithCovers)
        }
      }
    } catch (error) {
      if (error.message === "Request was cancelled") {
        return
      }
      // Error handling is done in the service
    } finally {
      if (isMounted()) {
        setIsRegenerating(false)
      }
    }
  }

  const handleAddToReadingList = (book) => {
    const result = addToReadingList(book)
    setToast({
      isVisible: true,
      message: result.message,
      type: result.success ? 'success' : 'error'
    })
  }

  const handleToastClose = () => {
    setToast({ isVisible: false, message: '', type: 'success' })
  }

  const handleFindBook = (book) => {
    const url = `https://bookshop.org/search?keywords=${encodeURIComponent(
      `${book.title} ${book.author}`
    )}`;
    window.open(url, "_blank");
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main>
          <LoadingSpinner message="Finding your perfect reads..." />
        </main>
        <Footer />
      </>
    )
  }

  if (!hasRecommendations) {
    return (
      <>
        <Navbar />
        <main>
          <section className="no-recommendations-hero">
            <h1 className="no-recommendations-title">
              We can't provide you personalized recommendations just yet
            </h1>
            <p className="no-recommendations-subtitle">
              Get started by uploading a photo of your bookshelf and setting your preferences.
            </p>
            <Link to="/get-started" className="get-started-button">
              Get Started
            </Link>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={handleToastClose}
      />
      <main>
        <section className="recommendations-hero">
          <h1 className="recommendations-title">
            Your Personalized Recommendations
          </h1>
          <p className="recommendations-subtitle">
            Based on your bookshelf and preferences, here are books we think you'll love.
          </p>
          {isRegenerating ? (
            <div className="regenerate-loading">
              <div className="loading-spinner"></div>
              <span>Generating new recommendations...</span>
            </div>
          ) : (
            <button
              onClick={handleRegenerateRecommendations}
              className="regenerate-button"
              disabled={isRegenerating}
            >
              Get New Recommendations
            </button>
          )}
        </section>

        <section className="recommendations-grid">
          {recommendations.map((book) => (
            <div key={book.id} className="book-card">
              <div className="book-cover">
                <img
                  src={book.coverImage}
                  alt={`${book.title} cover`}
                  className="book-cover-image"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="book-cover-fallback" style={{ display: 'none' }}>
                  <span className="cover-emoji">📚</span>
                </div>
              </div>

              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                <div className="book-meta">
                  <span className="book-genre">{book.genre}</span>
                  <span className="book-rating">⭐ {book.rating}</span>
                </div>

                <p className="book-description">{book.description}</p>

                <div className="recommendation-reason">
                  <strong>Why we recommend this:</strong>
                  <p>{book.reason}</p>
                </div>

                <div className="book-actions">
                  <button
                    className={`add-to-list-button ${isBookAdded(book.title) ? 'disabled' : ''}`}
                    onClick={() => handleAddToReadingList(book)}
                    disabled={isBookAdded(book.title)}
                  >
                    {isBookAdded(book.title) ? 'Added to List' : 'Add to Reading List'}
                  </button>
                  <button
                    className="find-book-button"
                    onClick={() => handleFindBook(book)}
                  >
                    Find This Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="recommendations-cta">
          <div className="cta-card">
            <h2>Want More Recommendations?</h2>
            <p>Upload more photos of your bookshelf or update your preferences to get even better suggestions.</p>
            <Link to="/get-started" className="cta-button">
              Update Preferences
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Recommendations
