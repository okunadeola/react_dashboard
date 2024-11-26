import { useState } from 'react'
import { motion } from 'framer-motion'
import moment from 'moment'
import { 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
  FileText,
  MessageSquare,
  Filter,
  Search,
  Plus
} from 'lucide-react'
import { useStore } from '@/stores/useStore'
import toast from 'react-hot-toast'

export function TaskTimeline({ tasks = [], projectId }) {
  const [timeScale, setTimeScale] = useState('week') // 'day', 'week', 'month'
  const [currentDate, setCurrentDate] = useState(moment())
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const { updateTask } = useStore()

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getTimelineRange = () => {
    switch (timeScale) {
      case 'day':
        return Array.from({ length: 24 }, (_, i) => 
          moment(currentDate).startOf('day').add(i, 'hours')
        )
      case 'week':
        return Array.from({ length: 7 }, (_, i) => 
          moment(currentDate).startOf('week').add(i, 'days')
        )
      case 'month':
        return Array.from({ length: moment(currentDate).daysInMonth() }, (_, i) => 
          moment(currentDate).startOf('month').add(i, 'days')
        )
      default:
        return []
    }
  }

  const timelineRange = getTimelineRange()

  const getTaskPosition = (task) => {
    const startDate = moment(task.startDate || task.dueDate)
    const endDate = moment(task.endDate || task.dueDate)
    const timelineStart = timelineRange[0]
    const timelineEnd = timelineRange[timelineRange.length - 1]
    
    // Calculate position and width
    const totalDuration = moment.duration(timelineEnd.diff(timelineStart)).asHours()
    const startOffset = moment.duration(startDate.diff(timelineStart)).asHours()
    const duration = moment.duration(endDate.diff(startDate)).asHours()
    
    const left = `${(startOffset / totalDuration) * 100}%`
    const width = `${(duration / totalDuration) * 100}%`
    
    return { left, width }
  }

  const statusColors = {
    'Todo': 'bg-gray-100 text-gray-800 border-gray-200',
    'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
    'Review': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Done': 'bg-green-100 text-green-800 border-green-200'
  }

  const handleNavigate = (direction) => {
    setCurrentDate(prev => {
      switch (timeScale) {
        case 'day':
          return direction === 'prev' ? prev.clone().subtract(1, 'day') : prev.clone().add(1, 'day')
        case 'week':
          return direction === 'prev' ? prev.clone().subtract(1, 'week') : prev.clone().add(1, 'week')
        case 'month':
          return direction === 'prev' ? prev.clone().subtract(1, 'month') : prev.clone().add(1, 'month')
        default:
          return prev
      }
    })
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setTimeScale('day')}
                className={`px-3 py-1 rounded-md text-sm ${
                  timeScale === 'day' ? 'bg-white shadow text-primary-blue' : 'text-gray-600'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setTimeScale('week')}
                className={`px-3 py-1 rounded-md text-sm ${
                  timeScale === 'week' ? 'bg-white shadow text-primary-blue' : 'text-gray-600'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeScale('month')}
                className={`px-3 py-1 rounded-md text-sm ${
                  timeScale === 'month' ? 'bg-white shadow text-primary-blue' : 'text-gray-600'
                }`}
              >
                Month
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleNavigate('prev')}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              </button>
              <span className="text-sm font-medium">
                {timeScale === 'day' && currentDate.format('MMMM D, YYYY')}
                {timeScale === 'week' && `Week of ${currentDate.startOf('week').format('MMMM D')}`}
                {timeScale === 'month' && currentDate.format('MMMM YYYY')}
              </span>
              <button
                onClick={() => handleNavigate('next')}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg ${showFilters ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
            >
              <Filter className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="p-4 overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Time Headers */}
          <div className="flex border-b border-gray-200 pb-2">
            <div className="w-48 flex-shrink-0" /> {/* Spacer for task names */}
            {timelineRange.map((date, index) => (
              <div
                key={index}
                className="flex-1 text-center text-sm text-gray-500"
              >
                {timeScale === 'day' && date.format('HH:mm')}
                {timeScale === 'week' && date.format('ddd, MMM D')}
                {timeScale === 'month' && date.format('D')}
              </div>
            ))}
          </div>

          {/* Tasks */}
          <div className="relative mt-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="flex items-center mb-4">
                <div className="w-48 flex-shrink-0 pr-4">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{task.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[task.status]}`}>
                      {task.status}
                    </span>
                  </div>
                </div>
                <div className="flex-1 relative h-8">
                  <motion.div
                    className={`absolute h-full rounded-lg border ${statusColors[task.status]} cursor-pointer`}
                    style={getTaskPosition(task)}
                    whileHover={{ y: -2 }}
                    onClick={() => {
                      // Handle task click
                    }}
                  >
                    <div className="flex items-center h-full px-2 space-x-2 overflow-hidden">
                      {task.assignees?.length > 0 && (
                        <div className="flex -space-x-2">
                          {task.assignees.slice(0, 2).map((assignee, index) => (
                            <img
                              key={index}
                              src={`https://picsum.photos/seed/${assignee}/40`}
                              alt={assignee}
                              className="w-6 h-6 rounded-full border-2 border-white"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 