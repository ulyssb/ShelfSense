import './Components.css'

function HowItWorks() {
  const steps = [
    { step: '1', title: 'Capture Your Collection', desc: 'Simply snap a photo of your bookshelf and let our AI do the rest.' },
    { step: '2', title: 'Set Your Preferences', desc: 'Tell us your reading tastes and discover what you truly love.' },
    { step: '3', title: 'Find Your Next Favorite', desc: 'Get personalized recommendations that match your unique style.' },
  ]

  return (
    <section id="how" className="how-it-works-section">
      <h2 className="section-title">
        How it works
      </h2>
      <ol className="steps-grid">
        {steps.map((s, index) => (
          <li key={s.step} className={`card step-item ${index === 1 ? 'featured' : ''}`}>
            <div className={`step-number ${index === 1 ? 'featured' : ''}`}>
              {s.step}
            </div>
            <h3 className="step-title">{s.title}</h3>
            <p className={`step-description ${index === 1 ? 'featured' : ''}`}>{s.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default HowItWorks


