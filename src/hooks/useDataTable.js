import { useState, useMemo, useCallback } from 'react'
import { usePagination } from './usePagination'

export function useDataTable({
  data = [],
  initialSort = { column: null, direction: 'asc' },
  initialFilters = {},
  searchFields = [],
  itemsPerPage = 10
}) {
  const [sortConfig, setSortConfig] = useState(initialSort)
  const [filters, setFilters] = useState(initialFilters)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredData = useMemo(() => {
    let processed = [...data]

    // Apply search
    if (searchTerm && searchFields.length) {
      const term = searchTerm.toLowerCase()
      processed = processed.filter(item =>
        searchFields.some(field => 
          String(item[field]).toLowerCase().includes(term)
        )
      )
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        processed = processed.filter(item => item[key] === value)
      }
    })

    // Apply sorting
    if (sortConfig.column) {
      processed.sort((a, b) => {
        const aValue = a[sortConfig.column]
        const bValue = b[sortConfig.column]

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return processed
  }, [data, sortConfig, filters, searchTerm, searchFields])

  const {
    currentPage,
    pageSize,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    previousPage,
    changePageSize
  } = usePagination({
    data: filteredData,
    itemsPerPage
  })

  const handleSort = useCallback((column) => {
    setSortConfig(current => ({
      column,
      direction: current.column === column && current.direction === 'asc' 
        ? 'desc' 
        : 'asc'
    }))
  }, [])

  const handleFilter = useCallback((key, value) => {
    setFilters(current => ({
      ...current,
      [key]: value
    }))
    goToPage(1)
  }, [goToPage])

  const handleSearch = useCallback((term) => {
    setSearchTerm(term)
    goToPage(1)
  }, [goToPage])

  const clearFilters = useCallback(() => {
    setFilters(initialFilters)
    setSearchTerm('')
    goToPage(1)
  }, [initialFilters, goToPage])

  return {
    // Data
    data: paginatedData,
    totalItems: filteredData.length,
    
    // Sorting
    sortConfig,
    handleSort,
    
    // Filtering
    filters,
    handleFilter,
    clearFilters,
    
    // Search
    searchTerm,
    handleSearch,
    
    // Pagination
    currentPage,
    pageSize,
    totalPages,
    goToPage,
    nextPage,
    previousPage,
    changePageSize
  }
} 