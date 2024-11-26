import { useState } from 'react'
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List,
  Users,
  Briefcase,
  MapPin
} from 'lucide-react'

export function Companies() {
  const [viewMode, setViewMode] = useState('grid')
  
  const companies = [
    {
      id: 1,
      name: 'House Spectrum Ltd',
      logo: 'https://picsum.photos/seed/company1/100/100',
      industry: 'Construction',
      employees: 156,
      projects: 24,
      location: 'New York, USA'
    },
    {
      id: 2,
      name: 'Metro Builders Inc',
      logo: 'https://picsum.photos/seed/company2/100/100',
      industry: 'Infrastructure',
      employees: 89,
      projects: 12,
      location: 'Chicago, USA'
    },
    {
      id: 3,
      name: 'Urban Development Co',
      logo: 'https://picsum.photos/seed/company3/100/100',
      industry: 'Real Estate',
      employees: 234,
      projects: 31,
      location: 'Los Angeles, USA'
    }
  ]

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Companies</h1>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${
                  viewMode === 'grid' ? 'bg-white shadow' : 'text-gray-500'
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${
                  viewMode === 'list' ? 'bg-white shadow' : 'text-gray-500'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            <button className="flex items-center px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Company
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            />
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <div key={company.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{company.name}</h3>
                    <p className="text-sm text-gray-500">{company.industry}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-2" />
                    {company.employees} employees
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Briefcase className="w-4 h-4 mr-2" />
                    {company.projects} projects
                  </div>
                  <div className="flex items-center text-sm text-gray-500 col-span-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    {company.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employees
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projects
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {companies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{company.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {company.industry}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {company.employees}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {company.projects}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {company.location}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
} 