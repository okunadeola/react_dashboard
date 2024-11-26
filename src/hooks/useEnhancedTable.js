import { useState, useMemo, useCallback } from 'react'
import { useStore } from '@/stores/useStore'
import { useNotifications } from './useNotifications'

export function useEnhancedTable({ data, columns, defaultSort = { id: '', desc: false } }) {
  const [sorting, setSorting] = useState(defaultSort)
  const [columnFilters, setColumnFilters] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const { success, error } = useNotifications()

  // Memoized sorting function
  const sortedData = useMemo(() => {
    if (!sorting.id) return data

    return [...data].sort((a, b) => {
      const aValue = a[sorting.id]
      const bValue = b[sorting.id]

      // Handle currency values
      if (typeof aValue === 'string' && aValue.startsWith('$')) {
        const aNum = parseFloat(aValue.replace(/[$,]/g, ''))
        const bNum = parseFloat(bValue.replace(/[$,]/g, ''))
        return sorting.desc ? bNum - aNum : aNum - bNum
      }

      if (aValue < bValue) return sorting.desc ? 1 : -1
      if (aValue > bValue) return sorting.desc ? -1 : 1
      return 0
    })
  }, [data, sorting])

  // Memoized filtering
  const filteredData = useMemo(() => {
    let filtered = sortedData

    // Apply column filters
    if (columnFilters.length) {
      filtered = filtered.filter(row => 
        columnFilters.every(filter => {
          const value = row[filter.id]
          return value?.toString().toLowerCase().includes(filter.value.toLowerCase())
        })
      )
    }

    // Apply global filter
    if (globalFilter) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          value?.toString().toLowerCase().includes(globalFilter.toLowerCase())
        )
      )
    }

    return filtered
  }, [sortedData, columnFilters, globalFilter])

  // Pagination
  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize
    const end = start + pagination.pageSize
    return filteredData.slice(start, end)
  }, [filteredData, pagination])

  // Bulk actions
  const handleBulkAction = useCallback(async (action, selectedRows) => {
    try {
      switch (action) {
        case 'delete':
          // Handle delete
          success('Success', 'Selected items deleted successfully')
          break
        case 'archive':
          // Handle archive
          success('Success', 'Selected items archived successfully')
          break
        case 'export':
          // Handle export
          success('Success', 'Data exported successfully')
          break
        default:
          break
      }
      setRowSelection({})
    } catch (err) {
      error('Error', 'Failed to perform bulk action')
    }
  }, [success, error])

  return {
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
    totalRows: filteredData.length,
    handleBulkAction,
    selectedCount: Object.keys(rowSelection).length,
    hasSelection: Object.keys(rowSelection).length > 0,
    clearSelection: () => setRowSelection({}),
    pageCount: Math.ceil(filteredData.length / pagination.pageSize)
  }
} 