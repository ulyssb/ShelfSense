import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useRecommendations } from '../hooks/useRecommendations.js'
import './Recommendations.css'

// Hardcoded recommendations function
function getRecommendations() {
  return [
    {
      id: 1,
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      genre: "Historical Fiction",
      rating: 4.5,
      description: "A captivating story about a reclusive Hollywood icon who finally decides to tell her life story to an unknown journalist.",
      coverImage: "https://covers.openlibrary.org/b/isbn/9781501139239-L.jpg",
      reason: "Based on your love for character-driven stories and historical fiction"
    },
    {
      id: 2,
      title: "Project Hail Mary",
      author: "Andy Weir",
      genre: "Science Fiction",
      rating: 4.8,
      description: "A lone astronaut must save the earth from disaster in this thrilling space adventure.",
      coverImage: "https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg",
      reason: "Perfect match for your sci-fi preferences and love for problem-solving narratives"
    },
    {
      id: 3,
      title: "The Midnight Library",
      author: "Matt Haig",
      genre: "Fantasy",
      rating: 4.3,
      description: "A library between life and death where you can try out different versions of your life.",
      coverImage: "https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg",
      reason: "Matches your interest in philosophical fiction and life exploration themes"
    },
    {
      id: 4,
      title: "Educated",
      author: "Tara Westover",
      genre: "Memoir",
      rating: 4.7,
      description: "A powerful memoir about education, family, and the struggle to forge your own path.",
      coverImage: "https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg",
      reason: "Based on your appreciation for inspiring true stories and personal growth narratives"
    },
    {
      id: 5,
      title: "The Silent Patient",
      author: "Alex Michaelides",
      genre: "Psychological Thriller",
      rating: 4.4,
      description: "A woman's refusal to speak after allegedly murdering her husband leads to a fascinating psychological mystery.",
      coverImage: "https://covers.openlibrary.org/b/isbn/9781250301697-L.jpg",
      reason: "Perfect for your mystery and thriller preferences with psychological depth"
    }
  ]
}

function Recommendations() {
  const { recommendations, hasRecommendations, loading, saveRecommendations } = useRecommendations()

  const handleRegenerateRecommendations = () => {
    const newRecommendations = getRecommendations()
    saveRecommendations(newRecommendations)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Finding your perfect reads...</p>
          </div>
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
          <button 
            onClick={handleRegenerateRecommendations}
            className="regenerate-button"
          >
            🔄 Get New Recommendations
          </button>
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
