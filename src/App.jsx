import { useStore } from '@/stores/useStore'
import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { SlideModal } from '@/components/shared/SlideModal'
import { Dashboard } from '@/pages/Dashboard'
import { Projects } from '@/pages/Projects'
import { Analytics } from '@/pages/Analytics'
import { Reports } from '@/pages/Reports'
import { Extensions } from '@/pages/Extensions'
import { Companies } from '@/pages/Companies'
import { People } from '@/pages/People'
import { Toaster } from 'react-hot-toast'
import { emailService } from '@/services/emailService'

function App() {
  const { 
    sidebar: { isOpen },
    setSidebarOpen,
    modal,
    closeModal
  } = useStore()

  useEffect(() => {
    emailService.init()
  }, [])

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setSidebarOpen])

  const handleSidebarToggle = (value) => {
    setSidebarOpen(typeof value === 'boolean' ? value : !isOpen)
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar isOpen={isOpen} setIsOpen={handleSidebarToggle} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header onMenuClick={() => handleSidebarToggle(true)} />
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects/*" element={<Projects />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/extensions" element={<Extensions />} />
              <Route path="/companies/*" element={<Companies />} />
              <Route path="/people" element={<People />} />
            </Routes>
          </main>
        </div>
      </div>
      <SlideModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
      >
        {modal.content}
      </SlideModal>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </Router>
  )
}

export default App
