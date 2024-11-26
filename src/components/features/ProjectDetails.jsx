import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  Users, 
  DollarSign,
  FileText,
  MessageSquare,
  Paperclip,
  ChevronDown,
  Edit,
  Share2
} from 'lucide-react'
import { useStore } from '@/stores/useStore'
import moment from 'moment'

export function ProjectDetails({ projectId }) {
  const { projects } = useStore()
  const [activeTab, setActiveTab] = useState('overview')
  
  const project = projects.find(p => p.id === projectId)
  if (!project) return null

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'files', label: 'Files' },
    { id: 'team', label: 'Team' },
    { id: 'activity', label: 'Activity' }
  ]

  const getProgressColor = (progress) => {
    if (progress < 30) return 'bg-red-500'
    if (progress < 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{project.name}</h1>
            <p className="text-gray-500 mt-1">{project.description}</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
            <button className="flex items-center px-3 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600">
              <Edit className="w-4 h-4 mr-2" />
              Edit Project
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 text-gray-500 mb-1">
              <Calendar className="w-4 h-4" />
              <span>Due Date</span>
            </div>
            <p className="text-lg font-medium text-gray-900">
              {moment(project.endDate).format('MMM D, YYYY')}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 text-gray-500 mb-1">
              <DollarSign className="w-4 h-4" />
              <span>Budget</span>
            </div>
            <p className="text-lg font-medium text-gray-900">{project.budget}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 text-gray-500 mb-1">
              <Users className="w-4 h-4" />
              <span>Team Size</span>
            </div>
            <p className="text-lg font-medium text-gray-900">{project.team.length}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 text-gray-500 mb-1">
              <Clock className="w-4 h-4" />
              <span>Progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                <div 
                  className={`h-full rounded-full ${getProgressColor(project.progress)}`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900">
                {project.progress}%
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'text-primary-blue border-primary-blue'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Project Description */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{project.description}</p>
            </div>

            {/* Key Milestones */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Key Milestones</h3>
              <div className="space-y-4">
                {project.milestones?.map((milestone, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                      <p className="text-sm text-gray-500">{milestone.description}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {moment(milestone.dueDate).format('MMM D, YYYY')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Recent Activity</h3>
              <div className="space-y-4">
                {project.activities?.slice(0, 5).map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3"
                  >
                    <img
                      src={activity.user.avatar}
                      alt={activity.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium text-gray-900">
                          {activity.user.name}
                        </span>
                        {' '}{activity.action}
                      </p>
                      <p className="text-sm text-gray-500">
                        {moment(activity.timestamp).fromNow()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other tab contents */}
      </div>
    </div>
  )
} 