import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  FileText, 
  UserPlus, 
  DollarSign,
  CheckCircle2
} from 'lucide-react'

export function ActivityTimeline() {
  const activities = [
    {
      id: 1,
      type: 'comment',
      user: 'Sarah M.',
      action: 'commented on',
      target: 'Project Proposal',
      time: '5m ago',
      icon: MessageSquare,
      color: 'text-blue-500 bg-blue-100'
    },
    {
      id: 2,
      type: 'document',
      user: 'John D.',
      action: 'uploaded',
      target: 'Budget Report Q1',
      time: '1h ago',
      icon: FileText,
      color: 'text-purple-500 bg-purple-100'
    },
    {
      id: 3,
      type: 'team',
      user: 'Michael K.',
      action: 'added',
      target: 'Emily R. to the team',
      time: '2h ago',
      icon: UserPlus,
      color: 'text-green-500 bg-green-100'
    },
    {
      id: 4,
      type: 'payment',
      user: 'Finance Team',
      action: 'processed payment for',
      target: 'Project X',
      time: '3h ago',
      icon: DollarSign,
      color: 'text-yellow-500 bg-yellow-100'
    },
    {
      id: 5,
      type: 'milestone',
      user: 'Project Team',
      action: 'completed',
      target: 'Phase 1 Milestone',
      time: '5h ago',
      icon: CheckCircle2,
      color: 'text-indigo-500 bg-indigo-100'
    }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 w-full">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-3"
          >
            <div className={`p-2 rounded-lg ${activity.color}`}>
              <activity.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-white">
                <span className="font-medium">{activity.user}</span>{' '}
                {activity.action}{' '}
                <span className="font-medium">{activity.target}</span>
              </p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-4 w-full py-2 text-sm text-primary-blue hover:text-blue-600 dark:hover:text-blue-400"
      >
        View All Activity
      </motion.button>
    </div>
  )
} 