import { useStore } from '@/stores/useStore'
import { useCallback } from 'react'

export function useModal() {
  const { modal, openModal: open, closeModal: close } = useStore()

  const openModal = useCallback((title, content, options = {}) => {
    open(title, content, options)
  }, [open])

  const closeModal = useCallback(() => {
    close()
  }, [close])

  return {
    isOpen: modal.isOpen,
    title: modal.title,
    content: modal.content,
    openModal,
    closeModal
  }
} 