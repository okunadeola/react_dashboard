import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowUpDown, 
  MoreVertical, 
  Calendar, 
  Users, 
  Clock,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash,
  Share2
} from 'lucide-react'
import { useStore } from '@/stores/useStore'
import moment from 'moment'

export function ProjectTable({ projects, onProjectClick }) {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  const [selectedRows, setSelectedRows] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showMenu, setShowMenu] = useState(null)
  const itemsPerPage = 10

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const sortedProjects = [...projects].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1
  })

  const paginatedProjects = sortedProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(projects.length / itemsPerPage)

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedProjects.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(paginatedProjects.map(project => project.id))
    }
  }

  const handleSelectRow = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    )
  }

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

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={handleSelectAll}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {selectedRows.length === paginatedProjects.length ? (
                    <CheckSquare className="w-5 h-5 text-primary-blue" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </th>
              <th className="px-6 py-3">
                <button 
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase"
                >
                  <span>Project Name</span>
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
                  onClick={() => handleSort('progress')}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase"
                >
                  <span>Progress</span>
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3">
                <span className="text-xs font-medium text-gray-500 uppercase">Team</span>
              </th>
              <th className="px-6 py-3">
                <button 
                  onClick={() => handleSort('endDate')}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase"
                >
                  <span>Due Date</span>
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3">
                <span className="text-xs font-medium text-gray-500 uppercase">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedProjects.map((project) => (
              <motion.tr
                key={project.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => onProjectClick(project)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelectRow(project.id)
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {selectedRows.includes(project.id) ? (
                      <CheckSquare className="w-5 h-5 text-primary-blue" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{project.name}</div>
                    <div className="text-sm text-gray-500">{project.description}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-full rounded-full ${getProgressColor(project.progress)}`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500">{project.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member, index) => (
                      <img
                        key={index}
                        src={`https://picsum.photos/seed/${member}/40`}
                        alt={member}
                        className="w-8 h-8 rounded-full border-2 border-white"
                        title={member}
                      />
                    ))}
                    {project.team.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-gray-600">+{project.team.length - 3}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{moment(project.endDate).format('MMM D, YYYY')}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowMenu(showMenu === project.id ? null : project.id)
                      }}
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
                          className="fixed right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
                        >
                          <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                            <Edit className="w-4 h-4 mr-2 inline" />
                            Edit Project
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                            <Share2 className="w-4 h-4 mr-2 inline" />
                            Share Project
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                            <Trash className="w-4 h-4 mr-2 inline" />
                            Delete Project
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, projects.length)} of {projects.length} projects
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
} 