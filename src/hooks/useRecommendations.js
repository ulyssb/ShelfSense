import { useState, useEffect } from 'react'

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState([])
  const [hasRecommendations, setHasRecommendations] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadRecommendations = () => {
    const savedRecommendations = localStorage.getItem('shelfSenseRecommendations')
    
    if (savedRecommendations) {
      const parsedRecommendations = JSON.parse(savedRecommendations)
      setRecommendations(parsedRecommendations)
      setHasRecommendations(parsedRecommendations.length > 0)
    } else {
      setRecommendations([])
      setHasRecommendations(false)
    }
  }

  const saveRecommendations = (newRecommendations) => {
    setRecommendations(newRecommendations)
    setHasRecommendations(newRecommendations.length > 0)
    localStorage.setItem('shelfSenseRecommendations', JSON.stringify(newRecommendations))
  }

  useEffect(() => {
    // Load initial recommendations
    loadRecommendations()
    setLoading(false)

    // Listen for localStorage changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'shelfSenseRecommendations') {
        loadRecommendations()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return {
    recommendations,
    hasRecommendations,
    loading,
    saveRecommendations
  }
}
