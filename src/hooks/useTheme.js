import { useStore } from '@/stores/useStore'
import { useEffect } from 'react'

export function useTheme() {
  const { theme, setTheme, toggleTheme } = useStore()

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
  }, [theme])

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark'
  }
} 