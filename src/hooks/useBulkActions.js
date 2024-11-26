import { useState, useCallback } from 'react'
import { useStore } from '@/stores/useStore'
import { useNotifications } from './useNotifications'

export function useBulkActions() {
  const [selectedItems, setSelectedItems] = useState([])
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false)
  const [actionMenuPosition, setActionMenuPosition] = useState({ x: 0, y: 0 })
  const { success, error } = useNotifications()

  const handleSelect = useCallback((id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    )
  }, [])

  const handleSelectAll = useCallback((items) => {
    const allIds = items.map(item => item.id)
    setSelectedItems(prev => 
      prev.length === items.length ? [] : allIds
    )
  }, [])

  const handleBulkDelete = useCallback(async (deleteAction) => {
    try {
      await Promise.all(selectedItems.map(id => deleteAction(id)))
      success('Success', `${selectedItems.length} items deleted successfully`)
      setSelectedItems([])
    } catch (err) {
      error('Error', 'Failed to delete selected items')
    }
  }, [selectedItems, success, error])

  const handleBulkUpdate = useCallback(async (updateAction, updates) => {
    try {
      await Promise.all(selectedItems.map(id => updateAction(id, updates)))
      success('Success', `${selectedItems.length} items updated successfully`)
      setSelectedItems([])
    } catch (err) {
      error('Error', 'Failed to update selected items')
    }
  }, [selectedItems, success, error])

  const openActionMenu = useCallback((e) => {
    e.preventDefault()
    setActionMenuPosition({ x: e.clientX, y: e.clientY })
    setIsActionMenuOpen(true)
  }, [])

  return {
    selectedItems,
    setSelectedItems,
    handleSelect,
    handleSelectAll,
    handleBulkDelete,
    handleBulkUpdate,
    isActionMenuOpen,
    setIsActionMenuOpen,
    actionMenuPosition,
    openActionMenu,
    hasSelection: selectedItems.length > 0
  }
} 