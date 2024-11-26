import { useStore } from '@/stores/useStore'
// ... other imports

export function Dashboard() {
  const { 
    notifications,
    addNotification,
    removeNotification,
    userPreferences,
    updateUserPreferences
  } = useStore()

  // ... rest of the component code using these store values
} 