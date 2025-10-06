function Features() {
  const items = [
    { title: 'Scan shelves', desc: 'Capture your bookshelf to analyze titles and authors.' },
    { title: 'Smart insights', desc: 'Get tailored recommendations and discover hidden gems.' },
    { title: 'Track reading', desc: 'Keep a simple view of what you own and what to read next.' },
  ]

  return (
    <section id="features" style={{ padding: '2rem 0' }}>
      <h2>Features</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        {items.map((f) => (
          <div key={f.title} className="card" style={{ textAlign: 'left' }}>
            <h3 style={{ marginTop: 0 }}>{f.title}</h3>
            <p style={{ opacity: 0.9 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features


