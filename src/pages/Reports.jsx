import { FileText, Download, Filter, ChevronDown } from 'lucide-react'

export function Reports() {
  const reports = [
    { 
      id: 1, 
      name: 'Q2 Financial Summary', 
      type: 'Financial',
      date: '2024-03-15',
      size: '2.4 MB'
    },
    { 
      id: 2, 
      name: 'Project Performance Review', 
      type: 'Performance',
      date: '2024-03-10',
      size: '1.8 MB'
    },
    { 
      id: 3, 
      name: 'Resource Allocation Report', 
      type: 'Resources',
      date: '2024-03-05',
      size: '3.2 MB'
    }
  ]

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filter
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="grid divide-y divide-gray-200">
            {reports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText className="w-6 h-6 text-primary-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{report.name}</h3>
                      <p className="text-sm text-gray-500">
                        {report.type} • {new Date(report.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">{report.size}</span>
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 