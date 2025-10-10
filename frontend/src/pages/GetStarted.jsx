import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { useRecommendations } from '../hooks/useRecommendations.js'
import { useIsMounted } from '../hooks/useIsMounted.js'
import { analyzeImage } from '../api.js'
import { generateRecommendations } from '../services/recommendationService.js'
import { getPreviouslyChosenBooks, addToPreviouslyChosenBooks } from '../utils/previouslyChosenBooks.js'
import { getBookCovers } from '../utils/bookCoverService.js'
import { saveDetectedBooks, saveSelectedGenres, saveStep1Data, getStep1Data, clearStep1Data } from '../utils/userData.js'
import { compressImage } from '../utils/imageCompression.js'
import './GetStarted.css'

function GetStarted() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedGenres, setSelectedGenres] = useState([])
  const [aiResponse, setAiResponse] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [detectedBooks, setDetectedBooks] = useState([])
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false)
  const [recommendationsReady, setRecommendationsReady] = useState(false)
  const [imageObjectUrl, setImageObjectUrl] = useState(null)
  const { saveRecommendations } = useRecommendations()
  const isMounted = useIsMounted()

  // Refs to store abort controllers for cleanup
  const imageAnalysisController = useRef(null)
  const recommendationController = useRef(null)

  // Helper function to create File object from step1Data
  const createFileFromStep1Data = async (step1Data) => {
    if (step1Data.selectedFileDataUrl) {
      try {
        const response = await fetch(step1Data.selectedFileDataUrl)
        const blob = await response.blob()
        return new File([blob], step1Data.selectedFileName || 'image.jpg', {
          type: step1Data.selectedFileType || 'image/jpeg'
        })
      } catch (error) {
        return null
      }
    } else if (step1Data.selectedFile instanceof File) {
      return step1Data.selectedFile
    }
    return null
  }

  // Helper function to handle request cancellation
  const handleRequestCancellation = (error) => {
    if (error.message === "Request was cancelled") {
      return true // Request was cancelled
    }
    return false // Request was not cancelled
  }

  // Restore step 1 data on mount
  useEffect(() => {
    const restoreData = async () => {
      const step1Data = getStep1Data()
      if (step1Data) {
        // Handle selectedFile restoration
        const restoredFile = await createFileFromStep1Data(step1Data)
        if (restoredFile) {
          setSelectedFile(restoredFile)
        }

        setAiResponse(step1Data.aiResponse)
        setDetectedBooks(step1Data.detectedBooks || [])
        setSelectedGenres(step1Data.selectedGenres || [])
        
        // Check if we have a file but no AI response (interrupted analysis)
        const hasFile = step1Data.selectedFileDataUrl || step1Data.selectedFile
        const hasAiResponse = step1Data.aiResponse
        
        if (hasFile && !hasAiResponse) {
          // We have a file but no AI response - restart the analysis
          setTimeout(async () => {
            if (isMounted() && restoredFile) {
              handleImageUpload(restoredFile)
            }
          }, 100) // Small delay to ensure component is fully mounted
        } else if (hasFile && hasAiResponse) {
          // We have both file and AI response - restore normally
          setCurrentStep(step1Data.currentStep || 1)
        }
      }
    }

    restoreData()
  }, [])

  // Save step 1 data
  const saveCurrentStep1Data = () => {
    // Convert File to data URL for storage
    if (selectedFile instanceof File) {
      const reader = new FileReader()
      reader.onload = () => {
        const step1Data = {
          selectedFileDataUrl: reader.result,
          selectedFileName: selectedFile.name,
          selectedFileType: selectedFile.type,
          aiResponse: aiResponse,
          detectedBooks: detectedBooks,
          selectedGenres: selectedGenres,
          currentStep: currentStep
        }
        saveStep1Data(step1Data)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      // If no file, save as is
      const step1Data = {
        selectedFile: selectedFile,
        aiResponse: aiResponse,
        detectedBooks: detectedBooks,
        selectedGenres: selectedGenres,
        currentStep: currentStep
      }
      saveStep1Data(step1Data)
    }
  }

  // Manage image object URL for preview
  useEffect(() => {
    if (selectedFile instanceof File) {
      const objectUrl = URL.createObjectURL(selectedFile)
      setImageObjectUrl(objectUrl)

      // Cleanup function
      return () => {
        URL.revokeObjectURL(objectUrl)
        setImageObjectUrl(null)
      }
    } else {
      setImageObjectUrl(null)
    }
  }, [selectedFile])

  // Save step 1 data whenever relevant state changes
  useEffect(() => {
    if (selectedFile || aiResponse || detectedBooks.length > 0 || selectedGenres.length > 0) {
      saveCurrentStep1Data()
    }
  }, [selectedFile, aiResponse, detectedBooks, selectedGenres, currentStep])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (imageAnalysisController.current) {
        imageAnalysisController.current.abort()
      }
      if (recommendationController.current) {
        recommendationController.current.abort()
      }
    }
  }, [])

  const handleImageUpload = async (file) => {
    if (!file) return

    // Cancel any existing image analysis
    if (imageAnalysisController.current) {
      imageAnalysisController.current.abort()
    }

    // Only proceed if component is still mounted
    if (!isMounted()) return

    setIsAnalyzing(true)
    setAiResponse(null)

    // Create new AbortController for this request
    imageAnalysisController.current = new AbortController()

    try {
      // Compress the image first (this also converts HEIC to JPEG)
      const compressedFile = await compressImage(file)

      // Only update state if component is still mounted
      if (!isMounted()) return

      // Set the compressed file for preview (this will show HEIC files as JPEG)
      setSelectedFile(compressedFile)

      // Send compressed file directly to API (no base64 conversion needed)
      try {
        const response = await analyzeImage(compressedFile, imageAnalysisController.current.signal)

        // Only update state if component is still mounted
        if (isMounted()) {
          setAiResponse(response)
          const books = response.books || []
          setDetectedBooks(books)
          saveDetectedBooks(books)
        }
      } catch (error) {
        if (handleRequestCancellation(error)) {
          return
        }

        // Only update state if component is still mounted
        if (isMounted()) {
          setAiResponse({
            visibility: "Error analyzing image",
            books: []
          })
          setDetectedBooks([])
          saveDetectedBooks([])
        }
      } finally {
        // Always clean up the analyzing state if mounted
        if (isMounted()) {
          setIsAnalyzing(false)
        }
      }
    } catch (error) {
      if (isMounted()) {
        setAiResponse({
          visibility: "Error processing image",
          books: []
        })
        setIsAnalyzing(false)
      }
    }
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1)
    } else if (currentStep === 3) {
      setCurrentStep(2)
    }
  }

  const handleGenerateRecommendations = async () => {
    // Cancel any existing recommendation generation
    if (recommendationController.current) {
      recommendationController.current.abort()
    }

    // Only proceed if component is still mounted
    if (!isMounted()) return

    setIsGeneratingRecommendations(true)
    setRecommendationsReady(false)

    // Create new AbortController for this request
    recommendationController.current = new AbortController()

    try {
      // Filter out "All Genres" when sending to API
      const genresForAPI = selectedGenres.filter(genre => genre !== 'All Genres')
      const previouslyChosenBooks = getPreviouslyChosenBooks()

      const newRecommendations = await generateRecommendations(detectedBooks, genresForAPI, previouslyChosenBooks, recommendationController.current.signal)

      // Only continue if component is still mounted
      if (!isMounted()) return

      // Get cover images for the recommendations
      const recommendationsWithCovers = await getBookCovers(newRecommendations)

      // Only update state if component is still mounted
      if (isMounted()) {
        // Add new recommendations to previously chosen books
        addToPreviouslyChosenBooks(recommendationsWithCovers)

        saveRecommendations(recommendationsWithCovers)
        setRecommendationsReady(true)

        // Clear step 1 data since we've successfully completed the process
        clearStep1Data()
      }
    } catch (error) {
      if (handleRequestCancellation(error)) {
        return
      }
      // Error handling is done in the service
      if (isMounted()) {
        setRecommendationsReady(true)
      }
    } finally {
      if (isMounted()) {
        setIsGeneratingRecommendations(false)
      }
    }
  }

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
                    Step 1: Upload Your Bookshelf Photo
                  </h3>
              <p className="step-description">
                Take a clear photo of your bookshelf. Make sure the book spines are visible for best results.
              </p>

              <div className="file-upload-container">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  className="file-input"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="file-upload-button">
                  {selectedFile ? 'Retake Photo' : 'Choose Photo'}
                </label>
              </div>

              {selectedFile && (
                <div className="file-selected">
                  <p className="file-name">
                    Selected: {selectedFile.name}
                  </p>
                  <div className="image-preview">
                    <img
                      src={imageObjectUrl}
                      alt="Selected bookshelf"
                      className="preview-image"
                    />
                  </div>

                  {/* AI Analysis Response */}
                  {isAnalyzing && (
                    <LoadingSpinner
                      message="Analyzing your bookshelf..."
                      className="ai-analysis-loading"
                    />
                  )}

                  {aiResponse && (
                    <div className="ai-analysis-response">
                      <h4 className="ai-response-title">AI Analysis:</h4>
                      <div className={`ai-visibility ${aiResponse.visibility && aiResponse.visibility.includes('get better results') ? 'ai-warning' : 'ai-success'}`}>
                        <strong>Visibility:</strong> {aiResponse.visibility || 'No visibility information'}
                      </div>
                      {aiResponse.books && aiResponse.books.length > 0 && (
                        <div className="ai-books-detected">
                          <strong>Books detected:</strong>
                          <div className="books-display">
                            {aiResponse.books.slice(0, 3).map((book, index) => (
                              <span key={index} className="book-tag">{book}</span>
                            ))}
                            {aiResponse.books.length > 3 && (
                              <span className="book-more">and {aiResponse.books.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {aiResponse && !isAnalyzing && (
                    <button
                      onClick={handleNextStep}
                      className="secondary-button"
                    >
                      Continue to Preferences
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="card step-card step-2">
                  <h3 className="step-title">
                    Step 2: Set Your Preferences
                  </h3>
              <p className="step-description">
                Tell us about your reading preferences. Select all genres you enjoy:
              </p>

              <div className="genre-grid">
                {['All Genres', 'Fiction', 'Non-fiction', 'Mystery', 'Sci-Fi', 'Romance', 'Biography', 'Fantasy', 'Thriller', 'History', 'Self-Help'].map((genre) => (
                  <label key={genre} className={`genre-label ${selectedGenres.includes(genre) ? 'selected' : ''}`}>
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre)}
                      onChange={(e) => {
                        let newGenres
                        if (genre === 'All Genres') {
                          if (e.target.checked) {
                            // Select all genres except "All Genres"
                            const allGenres = ['Fiction', 'Non-fiction', 'Mystery', 'Sci-Fi', 'Romance', 'Biography', 'Fantasy', 'Thriller', 'History', 'Self-Help']
                            newGenres = [...allGenres, 'All Genres']
                          } else {
                            newGenres = []
                          }
                        } else {
                          if (e.target.checked) {
                            newGenres = [...selectedGenres, genre]
                          } else {
                            // Remove "All Genres" if any individual genre is unchecked
                            newGenres = selectedGenres.filter(g => g !== genre && g !== 'All Genres')
                          }
                        }
                        setSelectedGenres(newGenres)
                        saveSelectedGenres(newGenres)
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
                    Selected: {selectedGenres.includes('All Genres') ? 'All Genres' : selectedGenres.join(', ')}
                  </p>
                  {isGeneratingRecommendations ? (
                    <div className="step2-loading">
                      <div className="loading-spinner"></div>
                      <span>Generating recommendations...</span>
                    </div>
                  ) : (
                    <button
                      onClick={async () => {
                        await handleGenerateRecommendations()
                        setCurrentStep(3)
                      }}
                      className="primary-button step-2"
                      disabled={isGeneratingRecommendations}
                    >
                      Generate Recommendations
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="card step-card step-3">
              <h3 className="step-title">
                Step 3: Get Your Recommendations
              </h3>

              {isGeneratingRecommendations ? (
                <>
                  <p className="step-description">
                    Our AI is analyzing your bookshelf and preferences to find your perfect matches...
                  </p>
                  <LoadingSpinner
                    message="Generating personalized recommendations..."
                    className="ai-analysis-loading"
                  />
                </>
              ) : recommendationsReady ? (
                <>
                  <p className="step-description">
                    Perfect! We've found some amazing books that match your taste.
                  </p>
                  <div className="results-box">
                    <p className="results-text">
                      Your personalized recommendations are ready!
                    </p>
                  </div>
                  <Link
                    to="/recommendations"
                    className="primary-button step-3"
                  >
                    View Recommendations
                  </Link>
                </>
              ) : (
                <>
                  <p className="step-description">
                    Something went wrong. Please try again.
                  </p>
                  <button
                    onClick={async () => {
                      await handleGenerateRecommendations()
                    }}
                    className="primary-button step-3"
                  >
                    Retry Generating Recommendations
                  </button>
                </>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="navigation-container">
            {currentStep > 1 && (
              <button
                onClick={handlePreviousStep}
                className="nav-button previous"
                disabled={isGeneratingRecommendations}
              >
                ← Previous
              </button>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}

export default GetStarted
