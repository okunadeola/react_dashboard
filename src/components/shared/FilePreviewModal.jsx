import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Share2 } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import { FileSharing } from './FileSharing'

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

export function FilePreviewModal({ file, onClose }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [numPages, setNumPages] = useState(null)
  const [scale, setScale] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [showSharing, setShowSharing] = useState(false)

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
    setIsLoading(false)
  }

  const isImage = file.type.startsWith('image/')
  const isPDF = file.type === 'application/pdf'

  const renderPreview = () => {
    if (isImage) {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={file.url}
            alt={file.name}
            className="max-w-full max-h-full object-contain"
            style={{ transform: `scale(${scale})` }}
          />
        </div>
      )
    }

    if (isPDF) {
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
          <Document
            file={file.url}
            onLoadSuccess={handleDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
              </div>
            }
          >
            <Page
              pageNumber={currentPage}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>
      )
    }

    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <p className="text-gray-500">Preview not available for this file type</p>
          <button
            onClick={() => window.open(file.url, '_blank')}
            className="mt-4 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600"
          >
            Open File
          </button>
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">{file.name}</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSharing(true)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                title="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => window.open(file.url, '_blank')}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="relative h-[600px] bg-gray-50">
            {renderPreview()}

            {/* Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-white rounded-lg shadow px-4 py-2">
              {(isPDF || isImage) && (
                <>
                  <button
                    onClick={() => setScale(scale => Math.max(0.5, scale - 0.1))}
                    className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-500">
                    {Math.round(scale * 100)}%
                  </span>
                  <button
                    onClick={() => setScale(scale => Math.min(2, scale + 0.1))}
                    className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                </>
              )}

              {isPDF && (
                <>
                  <div className="h-4 border-l border-gray-300" />
                  <button
                    onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                    disabled={currentPage <= 1}
                    className="p-1 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-500">
                    {currentPage} / {numPages || '...'}
                  </span>
                  <button
                    onClick={() => setCurrentPage(page => Math.min(numPages, page + 1))}
                    disabled={currentPage >= numPages}
                    className="p-1 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-50"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
            </div>
            <div className="text-sm text-gray-500">
              Last modified: {new Date(file.lastModified).toLocaleString()}
            </div>
          </div>

          {/* Sharing Modal */}
          <AnimatePresence>
            {showSharing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
                onClick={() => setShowSharing(false)}
              >
                <div onClick={e => e.stopPropagation()}>
                  <FileSharing
                    file={file}
                    onClose={() => setShowSharing(false)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 