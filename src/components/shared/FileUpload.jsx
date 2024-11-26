import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, File, Image, FileText, Film, Music, Archive } from 'lucide-react'
import toast from 'react-hot-toast'

const FILE_TYPES = {
  'image/': { icon: Image, color: 'text-purple-500' },
  'video/': { icon: Film, color: 'text-pink-500' },
  'audio/': { icon: Music, color: 'text-blue-500' },
  'application/pdf': { icon: FileText, color: 'text-red-500' },
  'application/zip': { icon: Archive, color: 'text-yellow-500' },
  'default': { icon: File, color: 'text-gray-500' }
}

export function FileUpload({ onUpload, maxSize = 5, allowedTypes = '*', multiple = false }) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const validateFile = (file) => {
    // Check file size (in MB)
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`)
      return false
    }

    // Check file type
    if (allowedTypes !== '*') {
        const it = "image/,application/pdf,.doc,.docx,.xls,.xlsx"
      const allowed = it.split(',').map(type => type.trim())
      if (!allowed.some(type => file.type.startsWith(type))) {
        toast.error(`File type not allowed. Accepted types: ${allowedTypes}`)
        return false
      }
    }

    return true
  }

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList)
    const validFiles = files.filter(validateFile)
    
    if (validFiles.length > 0) {
      try {
        validFiles.forEach(file => {
          onUpload(file)
        })
      } catch (err) {
        toast.error('Failed to process files')
      }
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`
        relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-colors duration-200
        ${isDragging 
          ? 'border-primary-blue bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400'
        }
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple={multiple}
        accept={allowedTypes === '*' ? undefined : allowedTypes}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Upload className="w-10 h-10 mx-auto text-gray-400 mb-4" />
      <div className="text-sm text-gray-600">
        <span className="font-medium text-primary-blue">Click to upload</span>
        {' or drag and drop'}
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {allowedTypes === '*' 
          ? 'Any file type up to ' 
          : `${allowedTypes.split(',').join(', ')} files up to `
        }
        {maxSize}MB
      </p>
    </div>
  )
} 