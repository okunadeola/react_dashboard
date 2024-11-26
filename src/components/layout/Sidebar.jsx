import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { 
  LayoutDashboard, 
  FolderKanban, 
  BarChart2, 
  FileText, 
  Puzzle, 
  Building2, 
  Users,
  X,
  ChevronRight,
  Settings
} from 'lucide-react'

export function Sidebar({ isOpen, setIsOpen }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile && !isOpen) {
        setIsOpen(true)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Initial check

    return () => window.removeEventListener('resize', handleResize)
  }, [setIsOpen])

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/dashboard', 
      count: null,
      color: 'from-blue-400 to-blue-600'
    },
    { 
      icon: FolderKanban, 
      label: 'Projects', 
      path: '/projects', 
      count: '3/5',
      color: 'from-purple-400 to-purple-600'
    },
    { 
      icon: BarChart2, 
      label: 'Analytics', 
      path: '/analytics', 
      count: null,
      color: 'from-green-400 to-green-600'
    },
    { 
      icon: FileText, 
      label: 'Reports', 
      path: '/reports', 
      count: null,
      color: 'from-yellow-400 to-yellow-600'
    },
    { 
      icon: Puzzle, 
      label: 'Extensions', 
      path: '/extensions', 
      count: null,
      color: 'from-pink-400 to-pink-600'
    },
    { 
      icon: Building2, 
      label: 'Companies', 
      path: '/companies', 
      count: '17',
      color: 'from-indigo-400 to-indigo-600'
    },
    { 
      icon: Users, 
      label: 'People', 
      path: '/people', 
      count: '164',
      color: 'from-red-400 to-red-600'
    }
  ]

  const handleMobileNavClick = () => {
    if (isMobile) {
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black z-40"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isOpen ? 0 : -280,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className={`
          fixed inset-y-0 left-0 z-50 bg-gray-800 border-r border-gray-700
          flex flex-col w-64
          md:relative md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          <motion.img 
            src="https://picsum.photos/seed/company2/100/100" 
            alt="Logo" 
            className="h-8 rounded-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          />
          {isMobile && (
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={handleMobileNavClick}
              className={({ isActive }) => `
                relative flex items-center px-3 py-2 rounded-lg group
                transition-all duration-200 ease-in-out
                ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'}
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="active-bg"
                      className={`absolute inset-0 rounded-lg bg-gradient-to-r ${item.color}`}
                      initial={false}
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    />
                  )}
                  <item.icon className={`w-5 h-5 mr-3 relative z-10 ${
                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'
                  }`} />
                  <span className="flex-1 relative z-10">{item.label}</span>
                  {item.count && (
                    <span className={`px-2 py-1 text-xs rounded-full relative z-10 ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-600">
          <button className="flex items-center w-full px-3 py-2 text-gray-500 rounded-lg hover:bg-gray-100">
            <Settings className="w-5 h-5 mr-3 text-gray-500" />
            <span>Settings</span>
          </button>
        </div>
      </motion.aside>
    </>
  )
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
} 