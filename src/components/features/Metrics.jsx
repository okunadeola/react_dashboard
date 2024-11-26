import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, DollarSign, Users, MoreVertical, ChevronDown } from 'lucide-react'

export function Metrics() {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month')
  const [expandedMetric, setExpandedMetric] = useState(null)

  const metrics = [
    { 
      label: 'Sales Performance', 
      value: 5.3, 
      icon: TrendingUp,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
      trend: [4.8, 5.1, 4.9, 5.3, 5.2, 5.3],
      change: '+8.2%',
      isPositive: true
    },
    { 
      label: 'Profit Margin', 
      value: 2.4, 
      icon: DollarSign,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      trend: [3.1, 2.9, 2.7, 2.5, 2.4, 2.4],
      change: '-4.5%',
      isPositive: false
    },
    { 
      label: 'Customer Satisfaction', 
      value: 7.8, 
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      trend: [7.2, 7.4, 7.5, 7.6, 7.7, 7.8],
      change: '+2.3%',
      isPositive: true
    },
  ]

  const periods = ['Today', 'This Week', 'This Month', 'This Quarter', 'This Year']

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Metrics</h2>
        <div className="relative">
          <button 
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
            onClick={() => setSelectedPeriod(prev => prev === 'This Month' ? 'This Week' : 'This Month')}
          >
            <span>{selectedPeriod}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <motion.div 
              className={`flex items-center p-4 rounded-lg border border-gray-100 dark:border-gray-900 cursor-pointer
                ${expandedMetric === index ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
              onClick={() => setExpandedMetric(expandedMetric === index ? null : index)}
              layoutId={`metric-${index}`}
            >
              <div className={`p-2 rounded-lg ${metric.bgColor} mr-4`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">{metric.label}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xl font-semibold">{metric.value}</span>
                  <span className="text-gray-400 ml-1">/10</span>
                  <span className={`ml-2 text-sm ${
                    metric.isPositive ? 'text-emerald-500' : 'text-red-500'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded-full">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </motion.div>

            <AnimatePresence>
              {expandedMetric === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 p-4 bg-gray-50 rounded-lg overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Trend</span>
                    <div className="flex space-x-1">
                      {metric.trend.map((value, i) => (
                        <motion.div
                          key={i}
                          className={`w-1 rounded-full ${metric.color} bg-opacity-20`}
                          style={{ height: '24px' }}
                        >
                          <motion.div
                            className={`w-full rounded-full ${metric.color}`}
                            initial={{ height: '0%' }}
                            animate={{ height: `${(value / 10) * 100}%` }}
                            transition={{ delay: i * 0.1 }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Last 6 months performance trend
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 