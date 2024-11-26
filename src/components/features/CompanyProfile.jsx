import { Building2, Users, Calendar, DollarSign } from 'lucide-react'

export function CompanyProfile() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src="https://picsum.photos/seed/company/80/80"
              alt="Company Logo"
              className="w-16 h-16 rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">House Spectrum Ltd</h1>
              <p className="text-sm text-gray-500">Construction & Development</p>
            </div>
          </div>
          <div className="hidden md:flex space-x-6">
            <div className="text-center">
              <div className="flex items-center text-gray-500 mb-1">
                <Building2 className="w-4 h-4 mr-1" />
                <span className="text-sm">Projects</span>
              </div>
              <p className="text-lg font-semibold">24</p>
            </div>
            <div className="text-center">
              <div className="flex items-center text-gray-500 mb-1">
                <Users className="w-4 h-4 mr-1" />
                <span className="text-sm">Team Size</span>
              </div>
              <p className="text-lg font-semibold">156</p>
            </div>
            <div className="text-center">
              <div className="flex items-center text-gray-500 mb-1">
                <Calendar className="w-4 h-4 mr-1" />
                <span className="text-sm">Duration</span>
              </div>
              <p className="text-lg font-semibold">18 mo</p>
            </div>
            <div className="text-center">
              <div className="flex items-center text-gray-500 mb-1">
                <DollarSign className="w-4 h-4 mr-1" />
                <span className="text-sm">Budget</span>
              </div>
              <p className="text-lg font-semibold">$2.4M</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 