import { motion } from 'framer-motion'
import { Plus, MoreHorizontal } from 'lucide-react'

export function TeamMembers() {
  const members = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Project Manager',
      avatar: 'https://picsum.photos/seed/user1/200',
      status: 'online',
      tasks: 12,
      completion: 85
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Lead Developer',
      avatar: 'https://picsum.photos/seed/user2/200',
      status: 'busy',
      tasks: 8,
      completion: 92
    },
    {
      id: 3,
      name: 'Emily Davis',
      role: 'Designer',
      avatar: 'https://picsum.photos/seed/user3/200',
      status: 'offline',
      tasks: 5,
      completion: 78
    }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Team Members</h2>
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {members.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  member.status === 'online' ? 'bg-green-500' :
                  member.status === 'busy' ? 'bg-red-500' :
                  'bg-gray-500'
                }`} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-900 dark:text-white">{member.tasks} Tasks</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{member.completion}% Complete</p>
              </div>
              <button className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="mt-4 w-full py-2 text-sm text-primary-blue hover:text-blue-600 dark:hover:text-blue-400">
        View All Members
      </button>
    </div>
  )
} 