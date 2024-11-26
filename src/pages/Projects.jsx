import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  LayoutGrid, 
  List, 
  Search,
  Filter,
  ArrowLeft
} from 'lucide-react'
import { useStore } from '@/stores/useStore'
import { AddProjectForm } from '@/components/forms/AddProjectForm'
import { ProjectCard } from '@/components/features/ProjectCard'
import { ProjectTable } from '@/components/features/ProjectTable'
import { TaskKanban } from '@/components/features/TaskKanban'
import { toast } from 'react-hot-toast'
import { TaskManagement } from '@/components/features/TaskManagement'

export function Projects() {
  const [viewMode, setViewMode] = useState('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const { projects, openModal, closeModal } = useStore()

  // Filter projects based on search term
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleNewProject = () => {
    openModal(
      'Create New Project', 
      <AddProjectForm 
        onClose={() => {
          closeModal()
          toast.success('Project created successfully')
        }}
      />
    )
  }

  const handleProjectClick = (project) => {
    setSelectedProject(project)
  }

  const handleBack = () => {
    setSelectedProject(null)
  }

  return (
    <div className="p-6">
      <AnimatePresence mode="wait">
        {selectedProject ? (
          // Task Management View with all options
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <TaskManagement 
              project={selectedProject}
              onBack={handleBack}
            />
          </motion.div>
        ) : (
          // Projects View
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Projects Header */}
            <div className="flex flex-col md:flex-row justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
                <p className="text-gray-500">Manage your projects and tasks</p>
              </div>

              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search projects..."
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  />
                </div>

                {/* View Switcher */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${
                      viewMode === 'grid' 
                        ? 'bg-white text-primary-blue shadow' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-lg ${
                      viewMode === 'table' 
                        ? 'bg-white text-primary-blue shadow' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                {/* Filters */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-lg ${
                    showFilters ? 'bg-gray-100' : 'hover:bg-gray-100'
                  }`}
                >
                  <Filter className="w-5 h-5 text-gray-500" />
                </button>

                {/* New Project Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNewProject}
                  className="flex items-center px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className='hidden md:block'>New Project</span>
                  
                </motion.button>
              </div>
            </div>

            {/* Project List */}
            <AnimatePresence mode="wait">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map(project => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onClick={() => handleProjectClick(project)}
                    />
                  ))}
                </div>
              ) : (
                <ProjectTable
                  projects={filteredProjects}
                  onProjectClick={handleProjectClick}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 