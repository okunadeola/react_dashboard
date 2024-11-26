import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  Calendar, 
  Users, 
  Clock, 
  MoreVertical,
  FileText,
  MessageSquare,
  Edit,
  Trash,
  Share2
} from 'lucide-react'
import { useStore } from '@/stores/useStore'
import moment from 'moment'

export function ProjectList({ searchTerm = '' }) {
  const { projects } = useStore()
  const [expandedProject, setExpandedProject] = useState(null)
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
    e.stopPropagation()
    setShowMenu(showMenu === projectId ? null : projectId)
  }

  return (
    <div className="space-y-4">
      {filteredProjects.map((project) => (
        <motion.div
          key={project.id}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          {/* Project Header */}
          <div
            onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
            className="p-6 cursor-pointer hover:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">{project.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                {/* Progress */}
                <div className="flex items-center space-x-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-full rounded-full ${getProgressColor(project.progress)}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{project.progress}%</span>
                </div>

                {/* Menu */}
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

                <motion.button
                  animate={{ rotate: expandedProject === project.id ? 180 : 0 }}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </motion.button>
              </div>
            </div>

            {/* Project Meta */}
            <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{moment(project.startDate).format('MMM D')} - {moment(project.endDate).format('MMM D, YYYY')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>{project.team.length} Members</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Updated {moment(project.lastUpdated).fromNow()}</span>
              </div>
            </div>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {expandedProject === project.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-gray-200 overflow-hidden"
              >
                <div className="p-6 space-y-6">
                  {/* Tasks Overview */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Tasks</h4>
                    <div className="space-y-3">
                      {project.tasks?.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              task.status === 'Done' ? 'bg-green-500' :
                              task.status === 'In Progress' ? 'bg-blue-500' :
                              'bg-gray-500'
                            }`} />
                            <span className="text-sm text-gray-900">{task.title}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">
                              Due {moment(task.dueDate).format('MMM D')}
                            </span>
                            {task.assignees?.map((assignee, index) => (
                              <img
                                key={index}
                                src={assignee.avatar}
                                alt={assignee.name}
                                className="w-6 h-6 rounded-full"
                                title={assignee.name}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Team Members */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Team Members</h4>
                    <div className="flex -space-x-2">
                      {project.team.map((member, index) => (
                        <img
                          key={index}
                          src={`https://picsum.photos/seed/${member}/40`}
                          alt={member}
                          className="w-8 h-8 rounded-full border-2 border-white"
                          title={member}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Files & Comments */}
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <FileText className="w-4 h-4" />
                      <span>{project.attachments?.length || 0} Files</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <MessageSquare className="w-4 h-4" />
                      <span>{project.comments?.length || 0} Comments</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
} 