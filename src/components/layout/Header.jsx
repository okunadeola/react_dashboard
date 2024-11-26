import PropTypes from 'prop-types'
import { Menu, Search, Bell } from 'lucide-react'
import { ThemeSwitcher } from '@/components/shared/ThemeSwitcher'
import { useStore } from '@/stores/useStore'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Header({ onMenuClick }) {
  const { notifications = [] } = useStore()
  const [showNotifications, setShowNotifications] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onMenuClick}
          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
        >
          <Menu className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </button>
        
        <div className="hidden md:flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span>Projects</span>
          <span className="mx-2">/</span>
          <span>Construction</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white">House Spectrum Ltd</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search... (⌘F)"
            className="w-64 pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <ThemeSwitcher />
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                >
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notifications</h3>
                    <div className="mt-2 space-y-3">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="flex items-start space-x-3">
                          <div className={`w-2 h-2 mt-2 rounded-full ${notification.read ? 'bg-gray-300' : 'bg-blue-500'}`} />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}

Header.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
} 