import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Calendar, ChevronDown, Download, Maximize2 } from 'lucide-react'

export function BudgetGraph() {
  const [timeRange, setTimeRange] = useState('M')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hoveredPoint, setHoveredPoint] = useState(null)
  
  const data = [
    { name: 'Jan', revenue: 4000, expenses: 2400, profit: 1600 },
    { name: 'Feb', revenue: 3000, expenses: 1398, profit: 1602 },
    { name: 'Mar', revenue: 2000, expenses: 9800, profit: -7800 },
    { name: 'Apr', revenue: 2780, expenses: 3908, profit: -1128 },
    { name: 'May', revenue: 1890, expenses: 4800, profit: -2910 },
    { name: 'Jun', revenue: 2390, expenses: 3800, profit: -1410 },
  ]

  const timeRanges = [
    { label: 'Day', value: 'D' },
    { label: 'Month', value: 'M' },
    { label: 'Year', value: 'Y' },
    { label: 'All', value: 'ALL' },
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-lg shadow-lg border border-gray-200"
        >
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <p className="text-sm text-gray-600">
                {entry.name}: {typeof entry.value === 'number' ? 
                  `$${entry.value.toLocaleString()}` : entry.value}
              </p>
            </div>
          ))}
        </motion.div>
      )
    }
    return null
  }

  return (
    <motion.div 
      layout
      className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm ${
        isFullscreen ? 'fixed inset-4 z-50' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Budget Overview</h2>
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {timeRanges.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setTimeRange(value)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeRange === value
                    ? 'bg-white text-primary-blue shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className={`${isFullscreen ? 'h-[calc(100%-100px)]' : 'h-[400px]'}`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={data}
            onMouseMove={(e) => {
              if (e.activeTooltipIndex !== undefined) {
                setHoveredPoint(e.activeTooltipIndex)
              }
            }}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
              stroke="#6B7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#2D7FF9" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 8, fill: "#2D7FF9" }}
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="#FF4D4D" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 8, fill: "#FF4D4D" }}
            />
            <Line 
              type="monotone" 
              dataKey="profit" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 8, fill: "#10B981" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <AnimatePresence>
        {hoveredPoint !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 left-6 bg-white p-4 rounded-lg shadow-lg border border-gray-200"
          >
            <div className="text-sm text-gray-500">
              Total Revenue for {data[hoveredPoint].name}
            </div>
            <div className="text-2xl font-semibold text-gray-900">
              ${data[hoveredPoint].revenue.toLocaleString()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
} 