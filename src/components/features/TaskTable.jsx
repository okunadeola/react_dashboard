import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowUpDown, 
  MoreVertical,
  Calendar,
  Clock,
  Users,
  Paperclip,
  MessageSquare,
  Edit,
  Trash2,
  CheckSquare,
  Square
} from 'lucide-react'
import { useStore } from '@/stores/useStore'
import moment from 'moment'
import toast from 'react-hot-toast'

export function TaskTable({ tasks = [], projectId }) {
  const { updateTask, deleteTask } = useStore()
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' })
  const [selectedTasks, setSelectedTasks] = useState([])
  const [activeMenu, setActiveMenu] = useState(null)

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortConfig.key === 'dueDate') {
      return sortConfig.direction === 'asc' 
        ? moment(a.dueDate).valueOf() - moment(b.dueDate).valueOf()
        : moment(b.dueDate).valueOf() - moment(a.dueDate).valueOf()
    }
    
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1
    }
    return 0
  })

  const handleSelectAll = () => {
    setSelectedTasks(prev => 
      prev.length === tasks.length ? [] : tasks.map(task => task.id)
    )
  }

  const handleSelectTask = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(projectId, taskId)
      toast.success('Task deleted successfully')
    } catch (err) {
      console.error('Delete error:', err)
      toast.error('Failed to delete task')
    }
  }

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await updateTask(projectId, taskId, { 
        status: newStatus,
        lastUpdated: moment().toISOString()
      })
      toast.success('Task status updated')
    } catch (err) {
      console.error('Update error:', err)
      toast.error('Failed to update task')
    }
  }

  const statusColors = {
    'Todo': 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-blue-100 text-blue-600',
    'Review': 'bg-yellow-100 text-yellow-800',
    'Done': 'bg-green-100 text-green-800'
  }

  const priorityColors = {
    'High': 'bg-red-100 text-red-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Low': 'bg-green-100 text-green-800'
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden relative">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={handleSelectAll}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {selectedTasks.length === tasks.length ? (
                    <CheckSquare className="w-5 h-5 text-primary-blue" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </th>
              <th className="px-6 py-3">
                <button 
                  onClick={() => handleSort('title')}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase"
                >
                  <span>Title</span>
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3">
                <button 
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase"
                >
                  <span>Status</span>
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3">
                <button 
                  onClick={() => handleSort('priority')}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase"
                >
                  <span>Priority</span>
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3">
                <button 
                  onClick={() => handleSort('dueDate')}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase"
                >
                  <span>Due Date</span>
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3">
                <span className="text-xs font-medium text-gray-500 uppercase">Assignees</span>
              </th>
              <th className="px-6 py-3">
                <span className="text-xs font-medium text-gray-500 uppercase">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTasks.map((task) => (
              <motion.tr 
                key={task.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleSelectTask(task.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {selectedTasks.includes(task.id) ? (
                      <CheckSquare className="w-5 h-5 text-primary-blue" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{task.title}</span>
                    {task.description && (
                      <span className="text-sm text-gray-500 truncate">{task.description}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${statusColors[task.status]}`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{moment(task.dueDate).format('MMM D, YYYY')}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex -space-x-2">
                    {task.assignees?.slice(0, 3).map((assignee, index) => (
                      <img
                        key={index}
                        src={`https://picsum.photos/seed/${assignee}/40`}
                        alt={assignee}
                        className="w-8 h-8 rounded-full border-2 border-white"
                        title={assignee}
                      />
                    ))}
                    {task.assignees?.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-gray-600">+{task.assignees.length - 3}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === task.id ? null : task.id);
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                    {activeMenu === task.id && (
                      <div 
                        className="fixed transform -translate-x-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
                        style={{ zIndex: 9999 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            handleUpdateStatus(task.id, 'Done');
                            setActiveMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Mark as Complete
                        </button>
                        <button
                          onClick={() => {
                            /* Handle edit */
                            setActiveMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Edit Task
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteTask(task.id);
                            setActiveMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                        >
                          Delete Task
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 