import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Bell,
  Users,
  Building2,
  DollarSign,
  ArrowRight,
  ChevronDown
} from 'lucide-react'
import { BudgetGraph } from '@/components/features/BudgetGraph'
import { DealsTable } from '@/components/features/DealsTable'
import { Metrics } from '@/components/features/Metrics'
import { TeamMembers } from '@/components/features/TeamMembers'
import { ActivityTimeline } from '@/components/features/ActivityTimeline'
import { TeamPerformance } from '@/components/features/TeamPerformance'

export function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false)
  const notificationRef = useRef(null)
  const notificationButtonRef = useRef(null)
  const periodRef = useRef(null)
  const periodButtonRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle notifications dropdown
      if (
        showNotifications && 
        notificationRef.current && 
        !notificationRef.current.contains(event.target) &&
        !notificationButtonRef.current.contains(event.target)
      ) {
        setShowNotifications(false)
      }

      // Handle period dropdown
      if (
        showPeriodDropdown &&
        periodRef.current &&
        !periodRef.current.contains(event.target) &&
        !periodButtonRef.current.contains(event.target)
      ) {
        setShowPeriodDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showNotifications, showPeriodDropdown])

  const notifications = [
    {
      id: 1,
      message: 'New project proposal received',
      time: '5 minutes ago',
      read: false
    },
    {
      id: 2,
      message: 'Team meeting in 30 minutes',
      time: '25 minutes ago',
      read: false
    },
    {
      id: 3,
      message: 'Budget report updated',
      time: '1 hour ago',
      read: true
    }
  ]

  const periods = [
    'Today',
    'This Week',
    'This Month',
    'This Quarter',
    'This Year'
  ]

  const quickStats = [
    {
      title: 'Total Revenue',
      value: '$2.4M',
      change: '+12.5%',
      isPositive: true,
      icon: DollarSign,
      color: 'bg-blue-500',
      colortext: 'text-blue-500',
    },
    {
      title: 'Active Projects',
      value: '45',
      change: '+3.2%',
      isPositive: true,
      icon: Building2,
      color: 'bg-purple-500',
      colortext: 'text-purple-500',
    },
    {
      title: 'Team Members',
      value: '164',
      change: '-2.3%',
      isPositive: false,
      icon: Users,
      color: 'bg-green-500',
      colortext: 'text-green-500',
    }
  ]

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Welcome back, here's what's happening</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Period Selector */}
            <div className="relative">
              <button
                ref={periodButtonRef}
                onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
              >
                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">{selectedPeriod}</span>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>

              <AnimatePresence>
                {showPeriodDropdown && (
                  <motion.div
                    ref={periodRef}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                  >
                    {periods.map((period) => (
                      <button
                        key={period}
                        onClick={() => {
                          setSelectedPeriod(period)
                          setShowPeriodDropdown(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {period}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                ref={notificationButtonRef}
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg relative dark:hover:bg-gray-700"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    ref={notificationRef}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                  >
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notifications</h3>
                      <div className="mt-2 space-y-3">
                        {notifications.map((notification) => (
                          <div key={notification.id} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500">{notification.time}</p>
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`w-6 h-6 ${stat.colortext}  text-opacity-100`} />
                </div>
                <span className={`text-sm ${
                  stat.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {stat.change}
                  {stat.isPositive ? <TrendingUp className="w-4 h-4 inline ml-1" /> : <TrendingDown className="w-4 h-4 inline ml-1" />}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-gray-500 dark:text-gray-400 text-sm">{stat.title}</h3>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BudgetGraph />
          </div>
          <div>
            <Metrics />
          </div>
        </div>

        {/* Team Performance and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <TeamPerformance />
          </div>
          <div>
          </div>
        </div>
            <ActivityTimeline />

        {/* Team Members */}
        <TeamMembers />

        {/* Deals Table */}
        <DealsTable />
      </div>
    </div>
  )
} 