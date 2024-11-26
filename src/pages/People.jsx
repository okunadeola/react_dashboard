import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Plus,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'

export function People() {
  const [searchTerm, setSearchTerm] = useState('')
  
  const people = [
    {
      id: 1,
      name: 'John Cooper',
      role: 'Project Manager',
      department: 'Construction',
      avatar: 'https://picsum.photos/seed/person1/200/200',
      email: 'john.cooper@example.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, USA'
    },
    {
      id: 2,
      name: 'Sarah Mitchell',
      role: 'Lead Architect',
      department: 'Design',
      avatar: 'https://picsum.photos/seed/person2/200/200',
      email: 'sarah.mitchell@example.com',
      phone: '+1 (555) 234-5678',
      location: 'Los Angeles, USA'
    },
    {
      id: 3,
      name: 'Michael Chen',
      role: 'Site Engineer',
      department: 'Engineering',
      avatar: 'https://picsum.photos/seed/person3/200/200',
      email: 'michael.chen@example.com',
      phone: '+1 (555) 345-6789',
      location: 'Chicago, USA'
    }
  ]

  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">People</h1>
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
            <button className="flex items-center px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Person
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search people..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPeople.map((person) => (
            <div key={person.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={person.avatar}
                  alt={person.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{person.name}</h3>
                  <p className="text-sm text-gray-500">{person.role}</p>
                  <p className="text-xs text-gray-400">{person.department}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="w-4 h-4 mr-2" />
                  {person.email}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Phone className="w-4 h-4 mr-2" />
                  {person.phone}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-2" />
                  {person.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 