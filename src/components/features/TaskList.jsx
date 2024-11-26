import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MoreVertical, 
  Calendar, 
  Clock,
  MessageSquare,
  Paperclip,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import moment from 'moment'

export function TaskList({ tasks = [], projectId }) {
  const [expandedTask, setExpandedTask] = useState(null)

  const priorityColors = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-green-100 text-green-800'
  }

  const statusColors = {
    'Todo': 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-blue-100 text-blue-600',
    'Review': 'bg-yellow-100 text-yellow-800',
    'Done': 'bg-green-100 text-green-800'
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            className="p-4 hover:bg-gray-50"
          >
            <div className="flex items-start justify-between">
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
              >
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${statusColors[task.status]}`}>
                    {task.status}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>
                {task.description && (
                  <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                )}
              </div>
              <button className="p-1 hover:bg-gray-100 rounded-full">
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Task Details */}
            <motion.div
              initial={false}
              animate={{ height: expandedTask === task.id ? 'auto' : 0 }}
              className="overflow-hidden"
            >
              {expandedTask === task.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {moment(task.dueDate).format('MMM D, YYYY')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>Est: {task.estimatedHours}h</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full">
                      <div 
                        className={`h-full rounded-full ${
                          task.progress < 30 ? 'bg-red-500' :
                          task.progress < 70 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Assignees */}
                  {task.assignees?.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Assignees</h4>
                      <div className="flex -space-x-2">
                        {task.assignees.map((assignee, index) => (
                          <img
                            key={index}
                            src={`https://picsum.photos/seed/${assignee}/40`}
                            alt={assignee}
                            className="w-8 h-8 rounded-full border-2 border-white"
                            title={assignee}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Attachments & Comments */}
                  <div className="mt-4 flex items-center space-x-4">
                    {task.attachments?.length > 0 && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Paperclip className="w-4 h-4 mr-1" />
                        <span>{task.attachments.length} files</span>
                      </div>
                    )}
                    {task.comments?.length > 0 && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        <span>{task.comments.length} comments</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 