import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  Users,
  Plus,
  MoreVertical,
  CheckCircle2
} from 'lucide-react'
import { useStore } from '@/stores/useStore'
import { AddTaskForm } from '@/components/forms/AddTaskForm'
import moment from 'moment'

export function ProjectCard({ project, onClick }) {
  const { openModal, closeModal } = useStore()
  const [isHovered, setIsHovered] = useState(false)

  const handleAddTask = (e) => {
    e.stopPropagation() // Prevent project click
    openModal(
      'Add New Task',
      <AddTaskForm 
        projectId={project.id}
        onClose={() => {
          closeModal()
        }}
      />
    )
  }

  const getProgressColor = (progress) => {
    if (progress < 30) return 'bg-red-500'
    if (progress < 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{project.description}</p>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation()
            // Handle menu click
          }}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full">
          <div 
            className={`h-full rounded-full ${getProgressColor(project.progress)}`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">
            {moment(project.dueDate).format('MMM D, YYYY')}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">
            {project.estimatedHours || 0}h
          </span>
        </div>
      </div>

      {/* Team & Tasks */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex -space-x-2">
            {project.team?.slice(0, 3).map((member, index) => (
              <img
                key={index}
                src={member.avatar}
                alt={member.name}
                className="w-8 h-8 rounded-full border-2 border-white"
                title={member.name}
              />
            ))}
            {project.team?.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                <span className="text-xs text-gray-600">+{project.team.length - 3}</span>
              </div>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            <span>{project.tasks?.filter(t => t.status === 'Done').length || 0}/{project.tasks?.length || 0}</span>
          </div>
        </div>
        <motion.button
          initial={false}
          animate={{ scale: isHovered ? 1 : 0.9, opacity: isHovered ? 1 : 0 }}
          onClick={handleAddTask}
          className="flex items-center px-2 py-1 bg-primary-blue text-white text-sm rounded-lg hover:bg-blue-600"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Task
        </motion.button>
      </div>
    </motion.div>
  )
} 