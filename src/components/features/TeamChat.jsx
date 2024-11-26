import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Paperclip, Image, Smile, Plus, X, FileText } from 'lucide-react'
import { useStore } from '@/stores/useStore'
import { FileUpload } from '@/components/shared/FileUpload'
import toast from 'react-hot-toast'

export function TeamChat() {
  const [message, setMessage] = useState('')
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const chatEndRef = useRef(null)
  const { user, addMessage, messages } = useStore()

  // Auto scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!message.trim()) return

    addMessage({
      id: Date.now(),
      content: message,
      sender: user,
      timestamp: new Date().toISOString(),
      type: 'text'
    })
    setMessage('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileUpload = (file) => {
    addMessage({
      id: Date.now(),
      content: URL.createObjectURL(file),
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      sender: user,
      timestamp: new Date().toISOString(),
      type: file.type.startsWith('image/') ? 'image' : 'file'
    })
    setShowUploadModal(false)
    toast.success('File shared successfully')
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const MessageBubble = ({ message }) => {
    const isOwnMessage = message.sender.id === user.id

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex items-end space-x-2 max-w-[70%]`}>
          {!isOwnMessage && (
            <img
              src={message.sender.avatar}
              alt={message.sender.name}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div>
            {!isOwnMessage && (
              <p className="text-xs text-gray-500 mb-1">{message.sender.name}</p>
            )}
            <div
              className={`rounded-lg p-3 ${
                isOwnMessage
                  ? 'bg-primary-blue text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.type === 'text' && (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
              {message.type === 'image' && (
                <img
                  src={message.content}
                  alt="Shared image"
                  className="rounded-lg max-w-sm"
                />
              )}
              {message.type === 'file' && (
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium">{message.fileName}</p>
                    <p className="text-xs opacity-75">
                      {(message.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}
              <p className={`text-xs mt-1 ${
                isOwnMessage ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-semibold text-gray-900">Team Chat</h2>
          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
            Online
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex items-end space-x-2">
          <div className="relative flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full p-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent resize-none"
              rows={1}
            />
            <div className="absolute right-2 bottom-2 flex items-center space-x-1">
              <button
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <Smile className="w-5 h-5" />
              </button>
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="p-3 bg-primary-blue text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Attachment Menu */}
      <AnimatePresence>
        {showAttachMenu && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-2"
          >
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setShowUploadModal(true)
                  setShowAttachMenu(false)
                }}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg flex flex-col items-center"
              >
                <Image className="w-5 h-5 mb-1" />
                <span className="text-xs">Image</span>
              </button>
              <button
                onClick={() => {
                  setShowUploadModal(true)
                  setShowAttachMenu(false)
                }}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg flex flex-col items-center"
              >
                <FileText className="w-5 h-5 mb-1" />
                <span className="text-xs">File</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Share File</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FileUpload
                onUpload={handleFileUpload}
                maxSize={10}
                allowedTypes="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 