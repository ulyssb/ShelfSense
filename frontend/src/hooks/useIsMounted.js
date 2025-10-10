import { useEffect, useRef } from 'react'

/**
 * Custom hook to track if component is mounted
 * Prevents state updates on unmounted components
 */
export function useIsMounted() {
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  // Return a function that checks if component is still mounted
  const checkMounted = () => {
    return isMounted.current
  }

  return checkMounted
}
