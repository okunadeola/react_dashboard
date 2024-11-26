import { useState, useMemo, useCallback } from 'react'

export function usePagination({
  data = [],
  itemsPerPage = 10,
  initialPage = 1
}) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(itemsPerPage)

  const totalPages = useMemo(() => 
    Math.ceil(data.length / pageSize)
  , [data.length, pageSize])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return data.slice(start, end)
  }, [data, currentPage, pageSize])

  const goToPage = useCallback((page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(pageNumber)
  }, [totalPages])

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1)
  }, [currentPage, goToPage])

  const previousPage = useCallback(() => {
    goToPage(currentPage - 1)
  }, [currentPage, goToPage])

  const changePageSize = useCallback((newSize) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }, [])

  return {
    currentPage,
    pageSize,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    previousPage,
    changePageSize,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1
  }
} 