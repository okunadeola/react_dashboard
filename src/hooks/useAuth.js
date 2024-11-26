import { useStore } from '@/stores/useStore'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export function useAuth() {
  const { user, setUser, resetStore } = useStore()
  const navigate = useNavigate()

  const login = useCallback(async (credentials) => {
    try {
      // Simulate API call
      const userData = { id: 1, name: 'John Doe', role: 'admin' }
      setUser(userData)
      return true
    } catch (err) {
      return false
    }
  }, [setUser])

  const logout = useCallback(() => {
    resetStore()
    navigate('/login')
  }, [resetStore, navigate])

  return {
    user,
    isAuthenticated: !!user,
    login,
    logout
  }
} 