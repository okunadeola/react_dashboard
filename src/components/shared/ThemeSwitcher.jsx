import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useDarkMode } from '@/hooks/useDarkMode'

export function ThemeSwitcher() {
  const { isDark, toggleTheme } = useDarkMode()

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`
        p-2 rounded-lg transition-colors
        ${isDark 
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
        }
      `}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ type: "spring", duration: 0.3 }}
      >
        {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </motion.div>
    </motion.button>
  )
} 