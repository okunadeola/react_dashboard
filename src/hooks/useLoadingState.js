import { useState, useCallback } from 'react'
import { useNotifications } from './useNotifications'

export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState)
  const [error, setError] = useState(null)
  const { error: showError } = useNotifications()

  const startLoading = useCallback(() => {
    setIsLoading(true)
    setError(null)
  }, [])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
  }, [])

  const handleError = useCallback((err) => {
    setError(err)
    setIsLoading(false)
    showError('Error', err.message || 'An unexpected error occurred')
  }, [showError])

  const withLoading = useCallback(async (asyncFn) => {
    try {
      startLoading()
      const result = await asyncFn()
      stopLoading()
      return result
    } catch (err) {
      handleError(err)
      return null
    }
  }, [startLoading, stopLoading, handleError])

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    handleError,
    withLoading
  }
} 