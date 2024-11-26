import { useStore } from '@/stores/useStore'
import { useCallback } from 'react'

export function useNotifications() {
  const {
    notifications,
    addNotification,
    removeNotification,
    markNotificationAsRead,
    clearAllNotifications,
  } = useStore()

  const notify = useCallback(
    ({ type = 'info', title, message, duration = 5000 }) => {
      const id = Date.now()
      addNotification({ type, title, message, id })

      if (duration) {
        setTimeout(() => {
          removeNotification(id)
        }, duration)
      }
    },
    [addNotification, removeNotification]
  )

  const success = useCallback(
    (title, message) => {
      notify({ type: 'success', title, message })
    },
    [notify]
  )

  const error = useCallback(
    (title, message) => {
      notify({ type: 'error', title, message })
    },
    [notify]
  )

  const warning = useCallback(
    (title, message) => {
      notify({ type: 'warning', title, message })
    },
    [notify]
  )

  const info = useCallback(
    (title, message) => {
      notify({ type: 'info', title, message })
    },
    [notify]
  )

  return {
    notifications,
    notify,
    success,
    error,
    warning,
    info,
    markAsRead: markNotificationAsRead,
    remove: removeNotification,
    clearAll: clearAllNotifications,
  }
} 