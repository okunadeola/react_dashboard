import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Send, 
  Paperclip, 
  Image as ImageIcon,
  Smile,
  MoreVertical,
  Check,
  Clock
} from 'lucide-react'
import { useStore } from '@/stores/useStore'
import moment from 'moment'

export function ChatSlider({ isOpen, onClose, projectId, taskId }) {
  const [message, setMessage] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const messagesEndRef = useRef(null)
  const { addMessage, messages = [] } = useStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!message.trim()) return

    try {
      await addMessage({
        projectId,
        taskId,
        content: message,
        timestamp: moment().toISOString(),
        sender: {
          id: 1, // Replace with actual user ID
          name: 'You',
          avatar: 'https://picsum.photos/seed/user1/40'
        }
      })
      setMessage('')
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h3 className="font-medium text-gray-900">Team Chat</h3>
              <p className="text-sm text-gray-500">
                {taskId ? 'Task Discussion' : 'Project Discussion'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages
              .filter(m => m.projectId === projectId && (!taskId || m.taskId === taskId))
              .map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 ${
                    message.sender.id === 1 ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <img
                    src={message.sender.avatar}
                    alt={message.sender.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className={`flex flex-col ${
                    message.sender.id === 1 ? 'items-end' : ''
                  }`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender.id === 1
                        ? 'bg-primary-blue text-white rounded-tr-none'
                        : 'bg-gray-100 text-gray-900 rounded-tl-none'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className="text-xs text-gray-500">
                        {moment(message.timestamp).fromNow()}
                      </span>
                      {message.sender.id === 1 && (
                        <Check className="w-4 h-4 text-primary-blue" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="w-full p-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent resize-none"
                  rows={1}
                />
                <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                  <button className="p-1 hover:bg-gray-100 rounded-full">
                    <Paperclip className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded-full">
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  </button>
                  <button 
                    onClick={() => setShowEmoji(!showEmoji)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <Smile className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className={`p-3 rounded-lg ${
                  message.trim()
                    ? 'bg-primary-blue text-white hover:bg-blue-600'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 