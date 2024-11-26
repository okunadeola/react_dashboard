import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Users, Link, Copy, Check, Settings, Shield, Mail, X, Calendar } from 'lucide-react'
import { notificationService } from '@/services/notificationService'
import { emailService } from '@/services/emailService'
import toast from 'react-hot-toast'

export function FileSharing({ file, onClose }) {
  const [copied, setCopied] = useState(false)
  const [shareType, setShareType] = useState('link') // 'link' or 'email'
  const [permissions, setPermissions] = useState('view') // 'view' or 'edit'
  const [selectedUsers, setSelectedUsers] = useState([])
  const [expiryDate, setExpiryDate] = useState('')
  const [message, setMessage] = useState('')
  const [notifyOnDownload, setNotifyOnDownload] = useState(false)
  const [notifyOnView, setNotifyOnView] = useState(false)

  const users = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.j@example.com', avatar: 'https://picsum.photos/seed/user1/40' },
    { id: 2, name: 'Michael Chen', email: 'michael.c@example.com', avatar: 'https://picsum.photos/seed/user2/40' },
    { id: 3, name: 'Emily Davis', email: 'emily.d@example.com', avatar: 'https://picsum.photos/seed/user3/40' },
  ]

  const handleCopyLink = () => {
    const shareLink = `https://yourapp.com/share/${file.id}`
    navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Link copied to clipboard')
  }

  const handleShare = async () => {
    if (shareType === 'email' && selectedUsers.length === 0) {
      toast.error('Please select at least one user')
      return
    }

    try {
      if (shareType === 'email') {
        // Generate temporary download URL (in a real app, this would be a server-generated URL)
        const downloadUrl = `https://yourapp.com/download/${file.id}`

        // Send emails to selected users
        const emailPromises = selectedUsers.map(userId => {
          const user = users.find(u => u.id === userId)
          const emailTemplate = emailService.templates.fileShared({
            fileName: file.name,
            sharedBy: 'You', // Replace with actual user name
            message,
            expiryDate: expiryDate || undefined,
            downloadUrl
          })

          return emailService.sendEmail({
            to_email: user.email,
            to_name: user.name,
            subject: emailTemplate.subject,
            message: emailTemplate.message
          })
        })

        await Promise.all(emailPromises)

        // Send in-app notifications
        await Promise.all(selectedUsers.map(userId =>
          notificationService.sendInAppNotification(userId, {
            type: 'file_shared',
            fileId: file.id,
            fileName: file.name,
            sharedBy: 'You', // Replace with actual user ID
            timestamp: new Date().toISOString()
          })
        ))
      }

      // Update file sharing permissions in your store/backend
      // ...

      toast.success('File shared successfully')
      onClose()
    } catch (err) {
      toast.error('Failed to share file')
      console.error('Share error:', err)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Share File</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <span className="sr-only">Close</span>
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* File Info */}
      <div className="flex items-center space-x-3 mb-6 p-3 bg-gray-50 rounded-lg">
        <div className="p-2 bg-gray-100 rounded">
          <FileIcon type={file.type} size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{file.name}</p>
          <p className="text-xs text-gray-500">{file.size}</p>
        </div>
      </div>

      {/* Share Type Toggle */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setShareType('link')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${
            shareType === 'link'
              ? 'bg-primary-blue text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Link className="w-4 h-4 inline mr-2" />
          Share Link
        </button>
        <button
          onClick={() => setShareType('email')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${
            shareType === 'email'
              ? 'bg-primary-blue text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Mail className="w-4 h-4 inline mr-2" />
          Email
        </button>
      </div>

      <AnimatePresence mode="wait">
        {shareType === 'link' ? (
          <motion.div
            key="link"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="relative">
              <input
                type="text"
                value={`https://yourapp.com/share/${file.id}`}
                readOnly
                className="w-full pr-24 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              />
              <button
                onClick={handleCopyLink}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium text-gray-600 flex items-center"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="email"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="border border-gray-200 rounded-lg divide-y">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => {
                      setSelectedUsers(prev =>
                        prev.includes(user.id)
                          ? prev.filter(id => id !== user.id)
                          : [...prev, user.id]
                      )
                    }}
                    className="w-4 h-4 text-primary-blue rounded border-gray-300 focus:ring-primary-blue"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Settings */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Permissions</span>
          </div>
          <select
            value={permissions}
            onChange={(e) => setPermissions(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-2 py-1"
          >
            <option value="view">Can view</option>
            <option value="edit">Can edit</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Expiry Date</span>
          </div>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-2 py-1"
          />
        </div>
      </div>

      {shareType === 'email' && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              rows={3}
              placeholder="Add a message..."
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={notifyOnDownload}
                onChange={(e) => setNotifyOnDownload(e.target.checked)}
                className="rounded border-gray-300 text-primary-blue focus:ring-primary-blue"
              />
              <span className="text-sm text-gray-600">Notify me when file is downloaded</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={notifyOnView}
                onChange={(e) => setNotifyOnView(e.target.checked)}
                className="rounded border-gray-300 text-primary-blue focus:ring-primary-blue"
              />
              <span className="text-sm text-gray-600">Notify me when file is viewed</span>
            </label>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleShare}
          className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600"
        >
          Share
        </button>
      </div>
    </div>
  )
} 