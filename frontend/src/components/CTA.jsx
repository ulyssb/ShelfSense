import { Link } from 'react-router-dom'
import './Components.css'

function CTA() {
  return (
    <section id="cta" className="cta-section">
      <div className="card cta-card">
        <h2 className="cta-title">
          Ready to explore your shelf?
        </h2>
        <p className="cta-description">
          Get started with ShelfSense. No signup needed.
        </p>
        <Link to="/get-started" className="cta-button">
          Start now
        </Link>
      </div>
    </section>
  )
}

export default CTA


