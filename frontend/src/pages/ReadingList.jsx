import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Toast from '../components/Toast.jsx'
import { useReadingList } from '../hooks/useReadingList.js'
import './ReadingList.css'

function ReadingList() {
  const { readingList, removeFromReadingList, clearReadingList } = useReadingList()
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' })

  const handleRemoveFromList = (bookToRemove) => {
    removeFromReadingList(bookToRemove.title)
    setToast({
      isVisible: true,
      message: `${bookToRemove.title} removed from your Reading List!`,
      type: 'success'
    })
  }

  const handleClearList = () => {
    if (window.confirm("Are you sure you want to clear your entire reading list?")) {
      clearReadingList()
      setToast({
        isVisible: true,
        message: "Reading list cleared!",
        type: 'success'
      })
    }
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

  if (readingList.length === 0) {
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
          <section className="empty-reading-list">
            <h1 className="empty-title">Your Reading List is Empty</h1>
            <p className="empty-subtitle">
              Start building your reading list by adding books from your recommendations!
            </p>
            <Link to="/recommendations" className="browse-button">
              Browse Recommendations
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
        <section className="reading-list-hero">
          <h1 className="reading-list-title">Your Reading List</h1>
          <p className="reading-list-subtitle">
            {readingList.length} book{readingList.length !== 1 ? 's' : ''} saved for later
          </p>
          <button 
            onClick={handleClearList}
            className="clear-list-button"
          >
            Clear All
          </button>
        </section>

        <section className="reading-list-grid">
          {readingList.map((book, index) => (
            <div key={`${book.title}-${index}`} className="book-card">
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
                <span className="book-genre">{book.genre}</span>
                <div className="book-rating">
                  ⭐ {book.rating}
                </div>
                
                <p className="book-description">{book.description}</p>
                
                <div className="book-actions">
                  <button 
                    className="remove-button"
                    onClick={() => handleRemoveFromList(book)}
                  >
                    Remove from List
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
      </main>
      <Footer />
    </>
  )
}

export default ReadingList
