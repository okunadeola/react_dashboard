import { motion } from 'framer-motion'
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

export function ProjectTimeline() {
  const milestones = [
    {
      id: 1,
      title: 'Project Planning Phase',
      date: '2024-03-20',
      status: 'completed',
      description: 'Initial project scope and requirements defined',
      team: ['Sarah M.', 'John D.'],
      deliverables: ['Project Charter', 'Scope Document']
    },
    {
      id: 2,
      title: 'Design Phase',
      date: '2024-04-15',
      status: 'in-progress',
      description: 'Architectural and technical design specifications',
      team: ['Michael K.', 'Emily R.'],
      deliverables: ['Design Specs', 'Technical Documentation']
    },
    {
      id: 3,
      title: 'Development Sprint 1',
      date: '2024-05-01',
      status: 'upcoming',
      description: 'Core functionality implementation',
      team: ['David L.', 'Anna P.'],
      deliverables: ['Core Features', 'Initial Testing']
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Project Timeline</h2>
        <button className="text-sm text-primary-blue hover:text-blue-600">
          View Full Timeline
        </button>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />

        {/* Milestones */}
        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-10"
            >
              {/* Status indicator */}
              <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                milestone.status === 'completed' ? 'bg-green-100' :
                milestone.status === 'in-progress' ? 'bg-blue-100' :
                'bg-gray-100'
              }`}>
                {milestone.status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : milestone.status === 'in-progress' ? (
                  <Clock className="w-5 h-5 text-blue-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-gray-500" />
                )}
              </div>

              {/* Content */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">{milestone.title}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(milestone.date).toLocaleDateString()}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>

                {/* Team members */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex -space-x-2">
                    {milestone.team.map((member, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs text-white"
                      >
                        {member.charAt(0)}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{milestone.team.length} team members</span>
                </div>

                {/* Deliverables */}
                <div className="flex flex-wrap gap-2">
                  {milestone.deliverables.map((deliverable, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs rounded-full bg-white border border-gray-200"
                    >
                      {deliverable}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 