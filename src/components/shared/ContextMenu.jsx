import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import { 
  Edit, 
  Trash2, 
  Copy, 
  Share2, 
  MoreHorizontal,
  Download,
  Archive
} from 'lucide-react'

export function ContextMenu({ 
  isOpen, 
  onClose, 
  position, 
  onAction,
  actions = ['edit', 'delete', 'duplicate', 'share', 'download', 'archive']
}) {
  const menuItems = {
    edit: { icon: Edit, label: 'Edit', color: 'text-blue-600' },
    delete: { icon: Trash2, label: 'Delete', color: 'text-red-600' },
    duplicate: { icon: Copy, label: 'Duplicate', color: 'text-gray-600' },
    share: { icon: Share2, label: 'Share', color: 'text-green-600' },
    more: { icon: MoreHorizontal, label: 'More', color: 'text-gray-600' },
    download: { icon: Download, label: 'Download', color: 'text-purple-600' },
    archive: { icon: Archive, label: 'Archive', color: 'text-orange-600' }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'fixed',
              left: position.x,
              top: position.y,
              zIndex: 50
            }}
            className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px]"
          >
            {actions.map((action) => {
              const { icon: Icon, label, color } = menuItems[action]
              return (
                <button
                  key={action}
                  onClick={() => {
                    onAction(action)
                    onClose()
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50"
                >
                  <Icon className={`w-4 h-4 mr-3 ${color}`} />
                  <span className="text-gray-700">{label}</span>
                </button>
              )
            })}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

ContextMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
  onAction: PropTypes.func.isRequired,
  actions: PropTypes.arrayOf(PropTypes.string)
} 