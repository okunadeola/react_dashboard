import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Calendar } from 'lucide-react'

export function Analytics() {
  const data = [
    { month: 'Jan', revenue: 4000, expenses: 2400, profit: 1600 },
    { month: 'Feb', revenue: 3000, expenses: 1398, profit: 1602 },
    { month: 'Mar', revenue: 2000, expenses: 9800, profit: -7800 },
    { month: 'Apr', revenue: 2780, expenses: 3908, profit: -1128 },
    { month: 'May', revenue: 1890, expenses: 4800, profit: -2910 },
    { month: 'Jun', revenue: 2390, expenses: 3800, profit: -1410 },
  ]

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Calendar className="w-4 h-4 mr-2" />
            Last 6 months
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          {[
            { label: 'Total Revenue', value: '$16,060', change: '+12.5%' },
            { label: 'Total Expenses', value: '$26,106', change: '+8.1%' },
            { label: 'Net Profit', value: '-$10,046', change: '-5.3%' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-semibold mt-2">{stat.value}</p>
              <p className={`text-sm mt-2 ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change} from last period
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#2D7FF9" />
                <Bar dataKey="expenses" fill="#FF4D4D" />
                <Bar dataKey="profit" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
} 