import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Paperclip,
  MoreVertical,
  Users,
  Calendar
} from 'lucide-react'
import moment from 'moment'
import { TaskSubmissionFlow } from './TaskSubmissionFlow'

export function TaskCard({ 
  task, 
  onStatusChange, 
  onComment, 
  onFileUpload, 
  onClick, 
  isSelected, 
  projectId 
}) {
  const [showMenu, setShowMenu] = useState(false)
  const [showSubmission, setShowSubmission] = useState(false)

  const statusColors = {
    'Todo': 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Review': 'bg-yellow-100 text-yellow-800',
    'Done': 'bg-green-100 text-green-800'
  }

  const priorityColors = {
    'Low': 'bg-gray-100 text-gray-600',
    'Medium': 'bg-yellow-100 text-yellow-600',
    'High': 'bg-red-100 text-red-600'
  }

  const getProgressColor = (progress) => {
    if (progress < 30) return 'bg-red-500'
    if (progress < 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        onClick={onClick}
        className={`
          bg-white rounded-lg border p-4 cursor-pointer
          ${isSelected ? 'border-primary-blue shadow-md' : 'border-gray-200 hover:border-gray-300'}
        `}
      >
        {/* Task Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{task.description}</p>
          </div>
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(!showMenu)
              }}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button 
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    onStatusChange(task.id, 'Done')
                    setShowMenu(false)
                  }}
                >
                  Mark as Complete
                </button>
                <button 
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Handle edit
                    setShowMenu(false)
                  }}
                >
                  Edit Task
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Task Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
            <span>Progress</span>
            <span>{task.progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full">
            <div 
              className={`h-full rounded-full ${getProgressColor(task.progress)}`}
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>

        {/* Task Meta */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              {moment(task.dueDate).format('MMM D, YYYY')}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              {task.estimatedHours || 0}h
            </span>
          </div>
        </div>

        {/* Task Status and Priority */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs rounded-full ${statusColors[task.status]}`}>
              {task.status}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {task.attachments?.length > 0 && (
              <div className="flex items-center text-gray-500 text-sm">
                <Paperclip className="w-4 h-4 mr-1" />
                <span>{task.attachments.length}</span>
              </div>
            )}
            {task.comments?.length > 0 && (
              <div className="flex items-center text-gray-500 text-sm">
                <MessageSquare className="w-4 h-4 mr-1" />
                <span>{task.comments.length}</span>
              </div>
            )}
            <div className="flex -space-x-2">
              {task.assignees?.map((assignee, index) => (
                <img
                  key={index}
                  src={assignee.avatar}
                  alt={assignee.name}
                  className="w-6 h-6 rounded-full border-2 border-white"
                  title={assignee.name}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <button
        onClick={() => setShowSubmission(true)}
        className="px-3 py-1 text-sm bg-primary-blue text-white rounded-lg hover:bg-blue-600"
      >
        Submit Work
      </button>

      {/* Submission Modal */}
      <AnimatePresence>
        {showSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={() => setShowSubmission(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-2xl w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <TaskSubmissionFlow
                task={task}
                projectId={projectId}
                onClose={() => setShowSubmission(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 