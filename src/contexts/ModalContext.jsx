import { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { SlideModal } from '@/components/shared/SlideModal'

const ModalContext = createContext()

export function ModalProvider({ children }) {
  const [modalContent, setModalContent] = useState(null)

  const openModal = (title, content) => {
    setModalContent({ title, content })
  }

  const closeModal = () => {
    setModalContent(null)
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <SlideModal
        isOpen={!!modalContent}
        onClose={closeModal}
        title={modalContent?.title || ''}
      >
        {modalContent?.content}
      </SlideModal>
    </ModalContext.Provider>
  )
}

ModalProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
} 