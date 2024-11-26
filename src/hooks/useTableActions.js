import { useState, useCallback } from 'react'
import { useStore } from '@/stores/useStore'
import { useNotifications } from './useNotifications'

export function useTableActions() {
  const [selectedRows, setSelectedRows] = useState([])
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false)
  const [actionMenuPosition, setActionMenuPosition] = useState({ x: 0, y: 0 })
  const { success, error } = useNotifications()

  const handleRowSelect = useCallback((id) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    )
  }, [])

  const handleSelectAll = useCallback((ids) => {
    setSelectedRows(prev => 
      prev.length === ids.length ? [] : ids
    )
  }, [])

  const handleBulkAction = useCallback(async (action, ids) => {
    try {
      await action(ids)
      success('Success', 'Bulk action completed successfully')
      setSelectedRows([])
    } catch (err) {
      error('Error', 'Failed to complete bulk action')
    }
  }, [success, error])

  const openActionMenu = useCallback((e, id) => {
    e.preventDefault()
    setActionMenuPosition({ x: e.clientX, y: e.clientY })
    setIsActionMenuOpen(true)
  }, [])

  return {
    selectedRows,
    setSelectedRows,
    handleRowSelect,
    handleSelectAll,
    handleBulkAction,
    isActionMenuOpen,
    setIsActionMenuOpen,
    actionMenuPosition,
    openActionMenu
  }
} 