import { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { 
  Plus, 
  MoreVertical, 
  Calendar,
  Clock,
  Users,
  MessageSquare,
  Paperclip,
  AlertCircle
} from 'lucide-react'
import { useStore } from '@/stores/useStore'
import moment from 'moment'
import toast from 'react-hot-toast'

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
  { id: 'inProgress', title: 'In Progress', color: 'bg-blue-100' },
  { id: 'review', title: 'Review', color: 'bg-yellow-100' },
  { id: 'done', title: 'Done', color: 'bg-green-100' }
]

export function ProjectKanban() {
  const { projects, updateTask } = useStore()
  const [draggingTaskId, setDraggingTaskId] = useState(null)
  const [hoveredColumn, setHoveredColumn] = useState(null)

  // Get all tasks from all projects
  const allTasks = projects.flatMap(project => 
    (project.tasks || []).map(task => ({
      ...task,
      projectId: project.id,
      projectName: project.name
    }))
  )

  // Group tasks by status
  const tasksByStatus = COLUMNS.reduce((acc, column) => {
    acc[column.id] = allTasks.filter(task => task.status === column.title)
    return acc
  }, {})

  const handleDragStart = (taskId) => {
    setDraggingTaskId(taskId)
  }

  const handleDragEnd = async (taskId, newStatus) => {
    try {
      const task = allTasks.find(t => t.id === taskId)
      if (task && task.status !== newStatus) {
        await updateTask(task.projectId, taskId, { status: newStatus })
        toast.success('Task status updated')
      }
    } catch (err) {
      toast.error('Failed to update task status')
    }
    setDraggingTaskId(null)
    setHoveredColumn(null)
  }

  const TaskCard = ({ task, columnId }) => {
    const priorityColors = {
      High: 'bg-red-100 text-red-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Low: 'bg-green-100 text-green-800'
    }

    return (
      <motion.div
        layoutId={`task-${task.id}`}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={1}
        onDragStart={() => handleDragStart(task.id)}
        onDragEnd={() => handleDragEnd(task.id, columnId)}
        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
          <button className="p-1 hover:bg-gray-100 rounded-full">
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-3">{task.description}</p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">
              {moment(task.dueDate).format('MMM D')}
            </span>
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>

        <div className="flex items-center justify-between">
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
          <div className="flex items-center space-x-2 text-gray-400">
            {task.attachments?.length > 0 && (
              <div className="flex items-center">
                <Paperclip className="w-4 h-4" />
                <span className="text-xs ml-1">{task.attachments.length}</span>
              </div>
            )}
            {task.comments?.length > 0 && (
              <div className="flex items-center">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs ml-1">{task.comments.length}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Project Tasks</h2>
          <p className="text-sm text-gray-500">Drag and drop tasks to update their status</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {COLUMNS.map((column) => (
          <div
            key={column.id}
            className={`flex flex-col rounded-lg ${column.color} p-4`}
            onDragOver={(e) => {
              e.preventDefault()
              setHoveredColumn(column.id)
            }}
            onDragLeave={() => setHoveredColumn(null)}
            onDrop={(e) => {
              e.preventDefault()
              if (draggingTaskId) {
                handleDragEnd(draggingTaskId, column.title)
              }
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">{column.title}</h3>
              <span className="text-sm text-gray-500">
                {tasksByStatus[column.id]?.length || 0}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              <AnimatePresence>
                {tasksByStatus[column.id]?.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    columnId={column.title}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 