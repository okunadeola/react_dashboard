import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Paperclip,
  Clock,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  RotateCcw
} from 'lucide-react'
import { useStore } from '@/stores/useStore'
import { FilePreviewModal } from '@/components/shared/FilePreviewModal'
import moment from 'moment'
import toast from 'react-hot-toast'

export function TaskReview({ task, projectId, onClose }) {
  const [feedback, setFeedback] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [showHistory, setShowHistory] = useState(false)
  const { updateTaskReviewStatus, addTaskComment } = useStore()

  const handleReview = async (status) => {
    try {
      await updateTaskReviewStatus(projectId, task.id, status, feedback)
      
      if (feedback.trim()) {
        await addTaskComment(projectId, task.id, {
          id: Date.now(),
          content: feedback,
          type: 'review',
          status,
          createdAt: moment().toISOString(),
          user: {
            id: 1, // Replace with actual reviewer ID
            name: 'John Doe', // Replace with actual reviewer name
            avatar: 'https://picsum.photos/seed/reviewer/40'
          }
        })
      }

      toast.success(`Task ${status === 'approved' ? 'approved' : 'rejected'}`)
      onClose()
    } catch (err) {
      toast.error('Failed to update task status')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-500 bg-green-50'
      case 'rejected':
        return 'text-red-500 bg-red-50'
      default:
        return 'text-gray-500 bg-gray-50'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{task.title}</h2>
          <p className="text-sm text-gray-500">
            Submitted by {task.assignee} • {moment(task.submittedAt).fromNow()}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full ${getStatusColor(task.submissionStatus)}`}>
          <span className="text-sm capitalize">{task.submissionStatus || 'Pending Review'}</span>
        </div>
      </div>

      {/* Task Details */}
      <div className="space-y-6">
        {/* Description */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
          <p className="text-gray-600">{task.description}</p>
        </div>

        {/* Submission Notes */}
        {task.submissionNotes && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Submission Notes</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">{task.submissionNotes}</p>
            </div>
          </div>
        )}

        {/* Attachments */}
        {task.attachments?.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Attachments</h3>
            <div className="grid grid-cols-2 gap-4">
              {task.attachments.map((file) => (
                <button
                  key={file.id}
                  onClick={() => setSelectedFile(file)}
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <Paperclip className="w-4 h-4 text-gray-400 mr-2" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Review History */}
        {task.reviews?.length > 0 && (
          <div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <Clock className="w-4 h-4 mr-1" />
              Review History ({task.reviews.length})
            </button>
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-2 space-y-3"
                >
                  {task.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className={`p-2 rounded-full ${getStatusColor(review.status)}`}>
                        {review.status === 'approved' ? (
                          <ThumbsUp className="w-4 h-4" />
                        ) : (
                          <ThumbsDown className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{review.feedback}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          By {review.reviewer} • {moment(review.createdAt).fromNow()}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Review Form */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Review Feedback</h3>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            placeholder="Provide feedback about this submission..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            onClick={() => handleReview('rejected')}
            className="flex items-center px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
          >
            <XCircle className="w-5 h-5 mr-2" />
            Reject
          </button>
          <button
            onClick={() => handleReview('approved')}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Approve
          </button>
        </div>
      </div>

      {/* File Preview Modal */}
      {selectedFile && (
        <FilePreviewModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  )
} 