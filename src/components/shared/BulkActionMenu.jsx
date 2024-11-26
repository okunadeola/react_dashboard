import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import { 
  Trash2, 
  Archive, 
  Share2, 
  Tag,
  Download,
  CheckSquare
} from 'lucide-react'

export function BulkActionMenu({ 
  isOpen, 
  onClose, 
  position,
  onAction,
  selectedCount
}) {
  const actions = [
    { id: 'delete', icon: Trash2, label: 'Delete Selected', color: 'text-red-600' },
    { id: 'archive', icon: Archive, label: 'Archive Selected', color: 'text-orange-600' },
    { id: 'share', icon: Share2, label: 'Share Selected', color: 'text-blue-600' },
    { id: 'tag', icon: Tag, label: 'Add Tags', color: 'text-green-600' },
    { id: 'export', icon: Download, label: 'Export Selected', color: 'text-purple-600' },
    { id: 'markComplete', icon: CheckSquare, label: 'Mark as Complete', color: 'text-indigo-600' },
  ]

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
            className="bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px]"
          >
            <div className="px-4 py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">
                {selectedCount} items selected
              </span>
            </div>
            {actions.map(({ id, icon: Icon, label, color }) => (
              <button
                key={id}
                onClick={() => {
                  onAction(id)
                  onClose()
                }}
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50"
              >
                <Icon className={`w-4 h-4 mr-3 ${color}`} />
                <span className="text-gray-700">{label}</span>
              </button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

BulkActionMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
  onAction: PropTypes.func.isRequired,
  selectedCount: PropTypes.number.isRequired
} 