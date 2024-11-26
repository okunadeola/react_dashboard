import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  Users, 
  MoreVertical,
  FileText,
  MessageSquare,
  Edit,
  Trash,
  Share2,
  ChevronRight
} from 'lucide-react'
import { useStore } from '@/stores/useStore'
import { Link } from 'react-router-dom'
import moment from 'moment'

export function ProjectGrid({ searchTerm = '' }) {
  const { projects } = useStore()
  const [hoveredProject, setHoveredProject] = useState(null)
  const [showMenu, setShowMenu] = useState(null)

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getProgressColor = (progress) => {
    if (progress < 30) return 'bg-red-500'
    if (progress < 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'On Hold': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleMenuClick = (e, projectId) => {
    e.preventDefault()
    setShowMenu(showMenu === projectId ? null : projectId)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProjects.map((project) => (
        <Link
          key={project.id}
          to={`/projects/${project.id}`}
          className="block"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            onHoverStart={() => setHoveredProject(project.id)}
            onHoverEnd={() => setHoveredProject(null)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Project Header */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{project.description}</p>
                </div>
                <div className="relative">
                  <button
                    onClick={(e) => handleMenuClick(e, project.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>
                  <AnimatePresence>
                    {showMenu === project.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
                      >
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Project
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share Project
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center">
                          <Trash className="w-4 h-4 mr-2" />
                          Delete Project
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full">
                  <motion.div
                    className={`h-full rounded-full ${getProgressColor(project.progress)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Project Meta */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    Due {moment(project.endDate).format('MMM D')}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    {project.team.length} Members
                  </span>
                </div>
              </div>

              {/* Team Members */}
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {project.team.slice(0, 4).map((member, index) => (
                    <img
                      key={index}
                      src={`https://picsum.photos/seed/${member}/40`}
                      alt={member}
                      className="w-8 h-8 rounded-full border-2 border-white"
                      title={member}
                    />
                  ))}
                  {project.team.length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                      <span className="text-xs text-gray-600">+{project.team.length - 4}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-gray-400">
                  {project.attachments?.length > 0 && (
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      <span className="text-sm">{project.attachments.length}</span>
                    </div>
                  )}
                  {project.comments?.length > 0 && (
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      <span className="text-sm">{project.comments.length}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* View Details Link */}
            <AnimatePresence>
              {hoveredProject === project.id && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="px-6 py-4 bg-gray-50 border-t border-gray-200"
                >
                  <div className="flex items-center justify-between text-primary-blue">
                    <span className="text-sm font-medium">View Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Link>
      ))}
    </div>
  )
} 