import { BudgetGraph } from '@/components/features/BudgetGraph'
import { DealsTable } from '@/components/features/DealsTable'
import { Metrics } from '@/components/features/Metrics'
import { CompanyProfile } from '@/components/features/CompanyProfile'

export function MainContent() {
  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <CompanyProfile />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BudgetGraph />
          </div>
          <div>
            <Metrics />
          </div>
        </div>
        <DealsTable />
      </div>
    </main>
  )
} 