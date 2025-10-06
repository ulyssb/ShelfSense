import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useRecommendations } from '../hooks/useRecommendations.js'
import './GetStarted.css'

function GetStarted() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedGenres, setSelectedGenres] = useState([])
  const { saveRecommendations } = useRecommendations()
  return (
    <>
      <Navbar />
      <main>
        <section style={{ padding: '2rem 0', marginBottom: '2rem' }}>
          <h2 className="get-started-main-title">
            Let's get started
          </h2>
          
          {/* Step Progress Indicator */}
          <div className="step-progress">
            {[1, 2, 3].map((step) => (
              <div key={step} className={`step-circle ${step <= currentStep ? 'active' : 'inactive'}`}>
                {step}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {currentStep === 1 && (
            <div className="card step-card step-1">
              <h3 className="step-title">
                📸 Step 1: Upload Your Bookshelf Photo
              </h3>
              <p className="step-description">
                Take a clear photo of your bookshelf. Make sure the book spines are visible for best results.
              </p>
              
              <div className="file-upload-container">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="file-input"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="file-upload-button">
                  Choose Photo
                </label>
              </div>
              
              {selectedFile && (
                <div className="file-selected">
                  <p className="file-name">
                    Selected: {selectedFile.name}
                  </p>
                  <div className="image-preview">
                    <img 
                      src={URL.createObjectURL(selectedFile)} 
                      alt="Selected bookshelf" 
                      className="preview-image"
                    />
                  </div>
                  <button 
                    onClick={() => setCurrentStep(2)}
                    className="secondary-button"
                  >
                    Continue to Preferences
                  </button>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="card step-card step-2">
              <h3 className="step-title">
                ⚙️ Step 2: Set Your Preferences
              </h3>
              <p className="step-description">
                Tell us about your reading preferences. Select all genres you enjoy:
              </p>
              
              <div className="genre-grid">
                {['Fiction', 'Non-fiction', 'Mystery', 'Sci-Fi', 'Romance', 'Biography', 'Fantasy', 'Thriller', 'History', 'Self-Help'].map((genre) => (
                  <label key={genre} className={`genre-label ${selectedGenres.includes(genre) ? 'selected' : ''}`}>
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedGenres([...selectedGenres, genre])
                        } else {
                          setSelectedGenres(selectedGenres.filter(g => g !== genre))
                        }
                      }}
                      className="genre-checkbox"
                    />
                    {genre}
                  </label>
                ))}
              </div>
              
              {selectedGenres.length > 0 && (
                <div className="selected-genres">
                  <p className="selected-genres-text">
                    Selected: {selectedGenres.join(', ')}
                  </p>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="primary-button step-2"
                  >
                    Continue to Recommandations
                  </button>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="card step-card step-3">
              <h3 className="step-title">
                🎯 Step 3: Get Your Recommendations
              </h3>
              <p className="step-description">
                Great! We're analyzing your bookshelf and preferences to find your perfect matches.
              </p>
              <div className="results-box">
                <p className="results-text">
                  📚 Found 12 books in your collection<br/>
                  🎯 Generated 5 personalized recommendations<br/>
                  ⭐ Based on your {selectedGenres.length > 0 ? selectedGenres.join(', ') : 'reading'} preferences
                </p>
              </div>
              <Link 
                to="/recommendations" 
                className="primary-button step-3"
                onClick={() => {
                  // Generate and save recommendations when user clicks to view them
                  const newRecommendations = [
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
                  saveRecommendations(newRecommendations)
                }}
              >
                View Recommendations
              </Link>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="navigation-container">
            {currentStep > 1 && (
              <button 
                onClick={() => setCurrentStep(currentStep - 1)}
                className="nav-button previous"
              >
                ← Previous
              </button>
            )}
            {currentStep < 3 && (
              <button 
                onClick={() => setCurrentStep(currentStep + 1)}
                className="nav-button next"
              >
                Next →
              </button>
            )}
          </div>
        </section>

        {currentStep === 1 && (
          <section className="help-section">
            <div className="card help-card">
              <h3 className="help-title">Need Help?</h3>
              <p className="help-text">
                Check out our tips for taking the perfect bookshelf photo.
              </p>
              <Link to="/" className="back-link">
                ← Back to Home
              </Link>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}

export default GetStarted
