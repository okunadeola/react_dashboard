import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  MessageSquare, 
  Paperclip, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { FileUpload } from '@/components/shared/FileUpload'
import { useStore } from '@/stores/useStore'
import moment from 'moment'
import toast from 'react-hot-toast'

export function TaskSubmission({ task, projectId, onClose }) {
  const [comment, setComment] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const { updateTask, addTaskComment, addTaskAttachment } = useStore()
  const [submissionStatus, setSubmissionStatus] = useState('draft') // draft, submitted, approved, rejected

  const handleSubmit = async () => {
    try {
      await updateTask(projectId, task.id, {
        ...task,
        status: 'Review',
        submissionStatus: 'submitted',
        submittedAt: moment().toISOString()
      })

      if (comment.trim()) {
        await addTaskComment(projectId, task.id, {
          id: Date.now(),
          content: comment,
          type: 'submission',
          createdAt: moment().toISOString(),
          user: {
            id: 1, // Replace with actual user ID
            name: 'John Doe', // Replace with actual user name
            avatar: 'https://picsum.photos/seed/user1/40'
          }
        })
      }

      toast.success('Task submitted for review')
      onClose()
    } catch (err) {
      toast.error('Failed to submit task')
    }
  }

  const handleFileUpload = async (file) => {
    try {
      await addTaskAttachment(projectId, task.id, file)
      toast.success('File uploaded successfully')
    } catch (err) {
      toast.error('Failed to upload file')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted':
        return 'text-blue-500 bg-blue-50'
      case 'approved':
        return 'text-green-500 bg-green-50'
      case 'rejected':
        return 'text-red-500 bg-red-50'
      default:
        return 'text-gray-500 bg-gray-50'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted':
        return Clock
      case 'approved':
        return CheckCircle
      case 'rejected':
        return XCircle
      default:
        return AlertCircle
    }
  }

  const StatusIcon = getStatusIcon(submissionStatus)

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{task.title}</h2>
          <p className="text-sm text-gray-500">Due: {moment(task.dueDate).format('MMM D, YYYY')}</p>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(submissionStatus)}`}>
          <StatusIcon className="w-4 h-4" />
          <span className="text-sm capitalize">{submissionStatus}</span>
        </div>
      </div>

      {/* Task Description */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
        <p className="text-gray-600">{task.description}</p>
      </div>

      {/* Submission Form */}
      <div className="space-y-6">
        {/* Comment Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Submission Notes
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            placeholder="Add any notes or comments about your submission..."
          />
        </div>

        {/* Attachments */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Attachments
            </label>
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="text-sm text-primary-blue hover:text-blue-600"
            >
              {showUpload ? 'Cancel' : 'Add Files'}
            </button>
          </div>

          <AnimatePresence>
            {showUpload && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <FileUpload
                  onUpload={handleFileUpload}
                  maxSize={10}
                  allowedTypes="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
                  multiple={true}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Attached Files List */}
          <div className="space-y-2 mt-2">
            {task.attachments?.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{file.name}</span>
                </div>
                <button className="text-red-500 hover:text-red-600">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600"
          >
            Submit Task
          </button>
        </div>
      </div>
    </div>
  )
} 