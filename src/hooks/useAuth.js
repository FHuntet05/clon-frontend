import { useState, useEffect } from 'react'

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay una sesión guardada
    const auth = localStorage.getItem('cosno-auth')
    setIsAuthenticated(auth === 'true')
    setIsLoading(false)
  }, [])

  return {
    isAuthenticated,
    isLoading,
    user: isAuthenticated ? {
      id: 12345,
      first_name: 'Test',
      username: 'testuser'
    } : null
  }
}