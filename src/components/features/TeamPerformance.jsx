import { motion } from 'framer-motion'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { 
  Users, 
  Target, 
  TrendingUp,
  Award,
  Calendar,
  ChevronDown
} from 'lucide-react'

export function TeamPerformance() {
  const performanceData = [
    { 
      name: 'Design', 
      completed: 45, 
      inProgress: 30, 
      planned: 25,
      teamLead: 'Sarah M.',
      efficiency: 92,
      members: 8
    },
    { 
      name: 'Development', 
      completed: 35, 
      inProgress: 45, 
      planned: 20,
      teamLead: 'Michael K.',
      efficiency: 88,
      members: 12
    },
    { 
      name: 'Testing', 
      completed: 55, 
      inProgress: 25, 
      planned: 20,
      teamLead: 'Emily R.',
      efficiency: 95,
      members: 6
    },
    { 
      name: 'Deployment', 
      completed: 65, 
      inProgress: 20, 
      planned: 15,
      teamLead: 'John D.',
      efficiency: 90,
      members: 4
    },
  ]

  const topPerformers = [
    { name: 'Sarah M.', score: 98, avatar: 'https://picsum.photos/seed/sarah/40' },
    { name: 'Emily R.', score: 95, avatar: 'https://picsum.photos/seed/emily/40' },
    { name: 'Michael K.', score: 92, avatar: 'https://picsum.photos/seed/michael/40' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Team Performance</h2>
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg">
            <Calendar className="w-4 h-4" />
            <span>This Month</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} barGap={0} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                          <p className="font-medium text-gray-900 mb-2">{label}</p>
                          {payload.map((entry, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <p className="text-sm text-gray-600">
                                {entry.name}: {entry.value}%
                              </p>
                            </div>
                          ))}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend />
                <Bar dataKey="completed" stackId="a" fill="#10B981" name="Completed" />
                <Bar dataKey="inProgress" stackId="a" fill="#2D7FF9" name="In Progress" />
                <Bar dataKey="planned" stackId="a" fill="#E5E7EB" name="Planned" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performers */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Top Performers</h3>
          {topPerformers.map((performer, index) => (
            <motion.div
              key={performer.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={performer.avatar}
                  alt={performer.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{performer.name}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Target className="w-3 h-3 mr-1" />
                    <span>Performance Score</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{performer.score}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">/100</span>
              </div>
            </motion.div>
          ))}

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <div className="flex items-center text-blue-600 dark:text-blue-400 mb-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-xs font-medium">Efficiency</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">91.3%</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                <div className="flex items-center text-green-600 dark:text-green-400 mb-1">
                  <Award className="w-4 h-4 mr-1" />
                  <span className="text-xs font-medium">Success Rate</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">88.7%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 