import { ExternalLink, Plus } from 'lucide-react'

export function Extensions() {
  const extensions = [
    {
      id: 1,
      name: 'Budget Tracker Pro',
      description: 'Advanced budget tracking and forecasting',
      status: 'active',
      icon: '💰'
    },
    {
      id: 2,
      name: 'Team Calendar',
      description: 'Synchronized team calendar and scheduling',
      status: 'inactive',
      icon: '📅'
    },
    {
      id: 3,
      name: 'Document Scanner',
      description: 'Scan and process construction documents',
      status: 'active',
      icon: '📄'
    }
  ]

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Extensions</h1>
          <button className="flex items-center px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Extension
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {extensions.map((extension) => (
            <div key={extension.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{extension.icon}</div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{extension.name}</h3>
                    <p className="text-sm text-gray-500">{extension.description}</p>
                  </div>
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-500">
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  extension.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {extension.status.charAt(0).toUpperCase() + extension.status.slice(1)}
                </span>
                <button className="text-sm text-primary-blue hover:text-blue-600">
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 