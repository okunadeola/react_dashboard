import { useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  ArrowUpDown,
  Filter,
  Download,
  Trash2,
  Archive,
  CheckSquare,
  Square
} from 'lucide-react'
import { useEnhancedTable } from '@/hooks/useEnhancedTable'

export function DataTable({
  data,
  columns,
  onRowClick,
  onBulkAction,
  enableSelection = true,
  enableFiltering = true,
  enableSorting = true,
  enablePagination = true,
}) {
  const {
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    globalFilter,
    setGlobalFilter,
    rowSelection,
    setRowSelection,
    pagination,
    setPagination,
    paginatedData,
    totalRows,
    handleBulkAction,
    selectedCount,
    hasSelection,
    clearSelection,
    pageCount
  } = useEnhancedTable({ data, columns })

  const handleHeaderClick = useCallback((column) => {
    if (!enableSorting || !column.sortable) return

    setSorting(prev => ({
      id: column.id,
      desc: prev.id === column.id ? !prev.desc : false
    }))
  }, [enableSorting, setSorting])

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Table Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {hasSelection && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2"
              >
                <span className="text-sm text-gray-600">
                  {selectedCount} selected
                </span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleBulkAction('archive')}
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
          
          {enableFiltering && (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={globalFilter}
                onChange={e => setGlobalFilter(e.target.value)}
                placeholder="Search..."
                className="px-3 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <Filter className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <Download className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {enableSelection && (
                <th className="px-6 py-3">
                  <button
                    onClick={() => {
                      if (selectedCount === data.length) {
                        clearSelection()
                      } else {
                        setRowSelection(
                          data.reduce((acc, row) => ({
                            ...acc,
                            [row.id]: true
                          }), {})
                        )
                      }
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {selectedCount === data.length ? (
                      <CheckSquare className="w-5 h-5 text-primary-blue" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </th>
              )}
              {columns.map(column => (
                <th
                  key={column.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <button
                    className={`flex items-center space-x-1 ${
                      column.sortable ? 'cursor-pointer hover:text-gray-700' : ''
                    }`}
                    onClick={() => handleHeaderClick(column)}
                  >
                    <span>{column.header}</span>
                    {column.sortable && (
                      <ArrowUpDown className="w-4 h-4" />
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onRowClick?.(row)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                {enableSelection && (
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setRowSelection(prev => ({
                          ...prev,
                          [row.id]: !prev[row.id]
                        }))
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {rowSelection[row.id] ? (
                        <CheckSquare className="w-5 h-5 text-primary-blue" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </td>
                )}
                {columns.map(column => (
                  <td key={column.id} className="px-6 py-4 whitespace-nowrap">
                    {column.cell ? column.cell(row) : row[column.id]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {enablePagination && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {pagination.pageIndex * pagination.pageSize + 1} to{' '}
            {Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalRows)} of{' '}
            {totalRows} entries
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
              disabled={pagination.pageIndex === 0}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
              disabled={pagination.pageIndex === pageCount - 1}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 