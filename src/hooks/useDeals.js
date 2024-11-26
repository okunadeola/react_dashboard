import { useStore } from '@/stores/useStore'
import { useCallback } from 'react'
import { useNotifications } from './useNotifications'

export function useDeals() {
  const { deals, addDeal, updateDeal, removeDeal } = useStore()
  const { success, error } = useNotifications()

  const createDeal = useCallback(async (dealData) => {
    try {
      await addDeal(dealData)
      success('Deal Created', 'New deal has been successfully created')
      return true
    } catch (err) {
      error('Error', 'Failed to create deal')
      return false
    }
  }, [addDeal, success, error])

  const editDeal = useCallback(async (id, updates) => {
    try {
      await updateDeal(id, updates)
      success('Deal Updated', 'Deal has been successfully updated')
      return true
    } catch (err) {
      error('Error', 'Failed to update deal')
      return false
    }
  }, [updateDeal, success, error])

  const deleteDeal = useCallback(async (id) => {
    try {
      await removeDeal(id)
      success('Deal Deleted', 'Deal has been successfully deleted')
      return true
    } catch (err) {
      error('Error', 'Failed to delete deal')
      return false
    }
  }, [removeDeal, success, error])

  return {
    deals,
    createDeal,
    editDeal,
    deleteDeal
  }
} 