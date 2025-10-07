import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import CTA from '../components/CTA.jsx'
import Footer from '../components/Footer.jsx'

function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </>
  )
}

export default Home


