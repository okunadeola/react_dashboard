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
  AlertCircle,
  ChevronLeft
} from 'lucide-react'
import { useStore } from '@/stores/useStore'
import { FileUpload } from '@/components/shared/FileUpload'
import moment from 'moment'
import toast from 'react-hot-toast'

export function TaskSubmissionFlow({ task, projectId, onClose }) {
  const [step, setStep] = useState(1) // 1: Details, 2: Files, 3: Review
  const [formData, setFormData] = useState({
    comment: '',
    files: [],
    completionPercentage: task.progress || 0,
    timeSpent: '',
    challenges: '',
    nextSteps: ''
  })

  const { submitTask } = useStore()

  const handleSubmit = async () => {
    try {
      await submitTask(projectId, task.id, {
        ...formData,
        submittedAt: moment().toISOString(),
        status: 'Review'
      })
      toast.success('Task submitted successfully')
      onClose()
    } catch (err) {
      toast.error('Failed to submit task')
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Completion Percentage
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.completionPercentage}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    completionPercentage: parseInt(e.target.value) 
                  })}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600">
                  {formData.completionPercentage}%
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Spent
              </label>
              <input
                type="text"
                value={formData.timeSpent}
                onChange={(e) => setFormData({ ...formData, timeSpent: e.target.value })}
                placeholder="e.g., 4 hours"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Add any notes or comments about your work..."
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Challenges Faced
              </label>
              <textarea
                value={formData.challenges}
                onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Describe any challenges or blockers..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Next Steps
              </label>
              <textarea
                value={formData.nextSteps}
                onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="What are the next steps?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments
              </label>
              <FileUpload
                onUpload={(file) => setFormData({
                  ...formData,
                  files: [...formData.files, file]
                })}
                maxSize={10}
                allowedTypes="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
                multiple={true}
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Submission Summary</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-gray-500">Completion</dt>
                  <dd className="text-sm text-gray-900">{formData.completionPercentage}%</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Time Spent</dt>
                  <dd className="text-sm text-gray-900">{formData.timeSpent}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Files Attached</dt>
                  <dd className="text-sm text-gray-900">{formData.files.length} files</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Comments</h3>
              <p className="text-sm text-gray-600">{formData.comment}</p>
            </div>

            {formData.challenges && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Challenges</h3>
                <p className="text-sm text-gray-600">{formData.challenges}</p>
              </div>
            )}

            {formData.nextSteps && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Next Steps</h3>
                <p className="text-sm text-gray-600">{formData.nextSteps}</p>
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{task.title}</h2>
            <p className="text-sm text-gray-500">
              Due: {moment(task.dueDate).format('MMM D, YYYY')}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Step {step} of 3</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex space-x-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-3 h-3 rounded-full ${
                  s === step ? 'bg-primary-blue' :
                  s < step ? 'bg-green-500' :
                  'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            {step === 1 ? 'Details' : step === 2 ? 'Additional Info' : 'Review'}
          </span>
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-6">
        {renderStep()}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600"
          >
            Submit Task
          </button>
        )}
      </div>
    </div>
  )
} 