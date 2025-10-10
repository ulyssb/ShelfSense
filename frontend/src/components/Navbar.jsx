import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useRecommendations } from '../hooks/useRecommendations.js'
import './Components.css'

function Navbar() {
  const { hasRecommendations } = useRecommendations()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMobileMenu()
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  // Close menu on route change
  useEffect(() => {
    closeMobileMenu()
  }, [])

  return (
    <header className="navbar" ref={menuRef}>
      <Link to="/" className="navbar-brand">
        ShelfSense
      </Link>

      <button
        className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        <span className="mobile-menu-line"></span>
        <span className="mobile-menu-line"></span>
        <span className="mobile-menu-line"></span>
      </button>

      <nav className={`navbar-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link>
        {!hasRecommendations && (
          <Link to="/get-started" className="nav-link" onClick={closeMobileMenu}>Get started</Link>
        )}
        <Link to="/recommendations" className="nav-link" onClick={closeMobileMenu}>Recommendations</Link>
        <Link to="/reading-list" className="nav-link" onClick={closeMobileMenu}>Reading List</Link>
      </nav>
    </header>
  )
}

export default Navbar


