import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutGrid, 
  List, 
  Calendar as CalendarIcon, 
  Clock,
  Filter,
  Search,
  Plus,
  SlidersHorizontal,
  Users,
//   AlertCircle,
  ArrowLeft,
  Table,
  MessageSquare
} from 'lucide-react'
import { RiDragDropFill } from "react-icons/ri"
import { useStore } from '@/stores/useStore'
import { TaskCard } from './TaskCard'
import { TaskList } from './TaskList'
import { TaskKanban } from './TaskKanban'
import { TaskCalendar } from './TaskCalendar'
// import { TaskTimeline } from './TaskTimeline'
import { ProjectTimeline } from './ProjectTimeline'
import { TaskTable } from './TaskTable'
import { AddTaskForm } from '@/components/forms/AddTaskForm'
import { ChatSlider } from './ChatSlider'

export function TaskManagement({ project, onBack }) {
  const [viewMode, setViewMode] = useState('list') // 'grid', 'list', 'kanban', 'calendar', 'timeline'
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const { openModal, closeModal } = useStore()

  const viewOptions = [
    { id: 'list', icon: List, label: 'List' },
    { id: 'table', icon: Table, label: 'Table' },
    { id: 'grid', icon: LayoutGrid, label: 'Grid' },
    { id: 'kanban', icon: RiDragDropFill, label: 'Kanban' },
    { id: 'calendar', icon: CalendarIcon, label: 'Calendar' },
    { id: 'timeline', icon: Clock, label: 'Timeline' }
  ]

  const handleNewTask = () => {
    openModal('Add New Task', 
      <AddTaskForm 
        projectId={project.id} 
        onClose={() => {
          closeModal()
        }}
      />
    )
  }

  const filteredTasks = project.tasks?.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const renderContent = () => {
    const props = {
      tasks: filteredTasks,
      projectId: project.id
    }

    switch (viewMode) {
      case 'list':
        return <TaskList {...props} />
      case 'table':
        return <TaskTable {...props} />
      case 'kanban':
        return <TaskKanban {...props} />
      case 'calendar':
        return <TaskCalendar {...props} />
      case 'timeline':
        return <ProjectTimeline {...props} />
        // return <TaskTimeline {...props} />
      case 'grid':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task}
                projectId={project.id}
              />
            ))}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {project.name} - Tasks
            </h2>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Users className="w-4 h-4 mr-1" />
              <span>{project.team?.length || 0} team members</span>
              <span className="mx-2">•</span>
              <span>{filteredTasks.length} tasks</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="w-full md:w-64 pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            />
          </div>

          {/* View Switcher */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {viewOptions.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setViewMode(id)}
                className={`p-2 rounded-lg ${
                  viewMode === id 
                    ? 'bg-white text-primary-blue shadow' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title={label}
              >
                <Icon className="w-5 h-5" />
              </button>
            ))}
          </div>


            <div className='flex items-center space-x-4'>
              {/* Filters */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg ${
                  showFilters ? 'bg-gray-100' : 'hover:bg-gray-100'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5 text-gray-500" />
              </button>
                {/* New Task Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNewTask}
                  className="flex items-center px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </motion.button>
                {/* Add this chat button */}
                <button
                  onClick={() => setShowChat(true)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  title="Open Chat"
                >
                  <MessageSquare className="w-5 h-5 text-gray-500" />
                </button>

            </div>


        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select className="w-full rounded-lg border-gray-200">
                  <option>All</option>
                  <option>Todo</option>
                  <option>In Progress</option>
                  <option>Review</option>
                  <option>Done</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select className="w-full rounded-lg border-gray-200">
                  <option>All</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignee
                </label>
                <select className="w-full rounded-lg border-gray-200">
                  <option>All</option>
                  {project.team?.map(member => (
                    <option key={member} value={member}>{member}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <select className="w-full rounded-lg border-gray-200">
                  <option>All</option>
                  <option>Today</option>
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>Overdue</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Views */}
      <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Add the ChatSlider */}
      <ChatSlider 
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        projectId={project.id}
        taskId={null}
      />
    </div>
  )
} 