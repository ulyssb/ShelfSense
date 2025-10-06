import { Link } from 'react-router-dom'
import { useRecommendations } from '../hooks/useRecommendations.js'
import './Components.css'

function Navbar() {
  const { hasRecommendations } = useRecommendations()

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        ShelfSense
      </Link>
      <nav className="navbar-nav">
        <Link to="/" className="nav-link">Home</Link>
        {!hasRecommendations && (
          <Link to="/get-started" className="nav-link">Get started</Link>
        )}
        <Link to="/recommendations" className="nav-link">Recommendations</Link>
      </nav>
    </header>
  )
}

export default Navbar


