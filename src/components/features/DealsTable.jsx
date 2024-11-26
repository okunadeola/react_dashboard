import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowUpDown, 
  Download, 
  Plus, 
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Filter,
  SlidersHorizontal,
  CheckSquare,
  Square
} from 'lucide-react'
import { useStore } from '@/stores/useStore'
import { AddDealForm } from '@/components/forms/AddDealForm'
import { useBulkActions } from '@/hooks/useBulkActions'
import { BulkActionMenu } from '@/components/shared/BulkActionMenu'
import { ContextMenu } from '@/components/shared/ContextMenu'

export function DealsTable() {
  const { 
    deals,
    addDeal,
    updateDeal,
    deleteDeal,
    openModal,
    closeModal
  } = useStore()
  const [sortColumn, setSortColumn] = useState('deal')
  const [sortDirection, setSortDirection] = useState('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [contextMenu, setContextMenu] = useState({ isOpen: false, position: { x: 0, y: 0 }, dealId: null })
  const itemsPerPage = 5

  const {
    selectedItems,
    handleSelect,
    handleSelectAll,
    handleBulkDelete,
    handleBulkUpdate,
    isActionMenuOpen,
    setIsActionMenuOpen,
    actionMenuPosition,
    openActionMenu,
    hasSelection
  } = useBulkActions()

  const sortedAndFilteredDeals = useMemo(() => {
    let filtered = [...deals]
    
    if (searchTerm) {
      filtered = filtered.filter(deal => 
        deal.deal.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.status.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    filtered.sort((a, b) => {
      let aValue = a[sortColumn]
      let bValue = b[sortColumn]

      if (sortColumn === 'value') {
        aValue = parseFloat(aValue.replace(/[$M,K]/g, ''))
        bValue = parseFloat(bValue.replace(/[$M,K]/g, ''))
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [deals, sortColumn, sortDirection, searchTerm])

  const totalPages = Math.ceil(sortedAndFilteredDeals.length / itemsPerPage)
  const paginatedDeals = sortedAndFilteredDeals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleRowSelect = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    )
  }

  const handleAddNew = () => {
    openModal('Add New Deal', <AddDealForm onClose={closeModal} />)
  }

  const handleEdit = (deal) => {
    openModal('Edit Deal', <AddDealForm initialData={deal} onClose={closeModal} />)
  }

  const handleDelete = async (id) => {
    try {
      await deleteDeal(id)
      // Show success notification
    } catch (err) {
      // Show error notification
    }
  }

  const handleBulkAction = async (action) => {
    try {
      switch (action) {
        case 'delete':
          await Promise.all(selectedItems.map(id => deleteDeal(id)))
          setSelectedItems([])
          break
        case 'archive':
          await Promise.all(selectedItems.map(id => 
            updateDeal(id, { status: 'Archived' })
          ))
          setSelectedItems([])
          break
        // ... handle other bulk actions
      }
    } catch (err) {
      // Show error notification
    }
  }

  const handleContextAction = async (action, dealId) => {
    try {
      switch (action) {
        case 'edit':
          const deal = deals.find(d => d.id === dealId)
          handleEdit(deal)
          break
        case 'delete':
          await handleDelete(dealId)
          break
        case 'duplicate':
          const originalDeal = deals.find(d => d.id === dealId)
          const { id, ...dealData } = originalDeal
          await addDeal({ ...dealData, deal: `${dealData.deal} (Copy)` })
          break
        // ... handle other context menu actions
      }
    } catch (err) {
      // Show error notification
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200 dark:border-gray-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Deals</h2>
            {selectedItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400"
              >
                <span>{selectedItems.length} selected</span>
                <button className="text-red-500 hover:text-red-600 dark:hover:text-red-400">
                  Delete
                </button>
              </motion.div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters ? 'bg-primary-blue text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg">
              <Download className="w-5 h-5" />
            </button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddNew}
              className="flex items-center px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-400"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select className="w-full rounded-lg border-gray-200">
                    <option>All</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Planning</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select className="w-full rounded-lg border-gray-200">
                    <option>All</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date Range
                  </label>
                  <input 
                    type="date" 
                    className="w-full rounded-lg border-gray-200"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={false}
          animate={{ 
            marginTop: showFilters ? '1rem' : '0'
          }}
          className="relative flex-1"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search deals..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
          />
        </motion.div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3">
                <button
                  onClick={() => handleSelectAll(deals)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded"
                >
                  {selectedItems.length === deals.length ? (
                    <CheckSquare className="w-5 h-5 text-primary-blue" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400 dark:text-gray-400" />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <button 
                  className="flex items-center space-x-1"
                  onClick={() => handleSort('deal')}
                >
                  <span>Deal</span>
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <button 
                  className="flex items-center space-x-1"
                  onClick={() => handleSort('value')}
                >
                  <span>Value</span>
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Progress
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-900">
            {paginatedDeals.map((deal) => (
              <motion.tr
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
                className="group"
                onContextMenu={(e) => {
                  e.preventDefault()
                  setContextMenu({
                    isOpen: true,
                    position: { x: e.clientX, y: e.clientY },
                    dealId: deal.id
                  })
                }}
              >
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleSelect(deal.id)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded"
                  >
                    {selectedItems.includes(deal.id) ? (
                      <CheckSquare className="w-5 h-5 text-primary-blue" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{deal.deal}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{deal.value}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    deal.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    deal.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {deal.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 dark:bg-gray-900 rounded-full h-2">
                    <div 
                      className="bg-primary-blue rounded-full h-2" 
                      style={{ width: `${deal.progress}%` }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(deal)}
                    className="text-primary-blue hover:text-blue-600"
                  >
                    Edit
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <motion.div 
        className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-900"
        initial={false}
        animate={{ 
          backgroundColor: selectedItems.length > 0 ? 'rgb(249, 250, 251)' : 'white'
        }}
      >
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedAndFilteredDeals.length)} of {sortedAndFilteredDeals.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      <BulkActionMenu
        isOpen={isActionMenuOpen}
        onClose={() => setIsActionMenuOpen(false)}
        position={actionMenuPosition}
        onAction={handleBulkAction}
        selectedCount={selectedItems.length}
      />

      <ContextMenu
        isOpen={contextMenu.isOpen}
        onClose={() => setContextMenu({ ...contextMenu, isOpen: false })}
        position={contextMenu.position}
        onAction={(action) => handleContextAction(action, contextMenu.dealId)}
      />
    </div>
  )
} 