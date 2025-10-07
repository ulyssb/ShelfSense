import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { useRecommendations } from '../hooks/useRecommendations.js'
import { generateRecommendations } from '../services/recommendationService.js'
import './Recommendations.css'

function Recommendations() {
  const { recommendations, hasRecommendations, loading, saveRecommendations } = useRecommendations()
  const [isRegenerating, setIsRegenerating] = useState(false)

  const handleRegenerateRecommendations = async () => {
    setIsRegenerating(true)
    try {
      // Use AI to generate new recommendations
      // Note: This would need the original detected books and genres from localStorage or context
      // For now, we'll use a sample set
      const sampleBooks = ["The Great Gatsby", "1984", "To Kill a Mockingbird"]
      const sampleGenres = ["Fiction", "Classic Literature"]
      
      console.log("Regenerating recommendations with AI...")
      const newRecommendations = await generateRecommendations(sampleBooks, sampleGenres)
      console.log("Generated new recommendations:", newRecommendations)
      saveRecommendations(newRecommendations)
    } catch (error) {
      console.error('Error regenerating recommendations:', error)
      // Error handling is done in the service
    } finally {
      setIsRegenerating(false)
    }
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
              🔄 Get New Recommendations
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
                <div className="book-rating">
                  ⭐ {book.rating}
                </div>
              </div>
              
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                <span className="book-genre">{book.genre}</span>
                
                <p className="book-description">{book.description}</p>
                
                <div className="recommendation-reason">
                  <strong>Why we recommend this:</strong>
                  <p>{book.reason}</p>
                </div>
                
                <div className="book-actions">
                  <button className="add-to-list-button">
                    📚 Add to Reading List
                  </button>
                  <button className="find-book-button">
                    🔍 Find This Book
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
