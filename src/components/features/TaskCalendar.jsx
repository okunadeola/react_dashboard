import { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  X,
  AlertCircle,
  CheckCircle,
  FileText,
  MessageSquare,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import { useStore } from '@/stores/useStore'
import moment from 'moment'
import toast from 'react-hot-toast'

export function TaskCalendar({ tasks, projectId }) {
  const [selectedTask, setSelectedTask] = useState(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const { updateTask } = useStore()

  // Convert tasks to calendar events
  const events = tasks.map(task => ({
    id: task.id,
    title: task.title,
    start: task.startDate || task.dueDate,
    end: task.endDate || task.dueDate,
    backgroundColor: getStatusColor(task.status),
    borderColor: getStatusColor(task.status),
    extendedProps: {
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignees: task.assignees,
      attachments: task.attachments,
      comments: task.comments,
      progress: task.progress
    }
  }))

  function getStatusColor(status) {
    switch (status) {
      case 'Todo': return '#6B7280'
      case 'In Progress': return '#2563EB'
      case 'Review': return '#F59E0B'
      case 'Done': return '#10B981'
      default: return '#6B7280'
    }
  }

  const handleEventClick = (info) => {
    setSelectedTask({
      ...info.event.extendedProps,
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end
    })
    setShowTaskModal(true)
  }

  const handleEventDrop = async (info) => {
    try {
      await updateTask(projectId, info.event.id, {
        startDate: info.event.start,
        endDate: info.event.end || info.event.start
      })
      toast.success('Task dates updated')
    } catch (err) {
      toast.error('Failed to update task dates')
      info.revert()
    }
  }

  const renderEventContent = (eventInfo) => (
    <div className="p-1">
      <div className="font-medium text-sm truncate">{eventInfo.event.title}</div>
      {eventInfo.event.extendedProps.assignees?.length > 0 && (
        <div className="flex -space-x-2 mt-1">
          {eventInfo.event.extendedProps.assignees.map((assignee, index) => (
            <img
              key={index}
              src={assignee.avatar}
              alt={assignee.name}
              className="w-6 h-6 rounded-full border-2 border-white"
              title={assignee.name}
            />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          events={events}
          eventContent={renderEventContent}
          editable={true}
          droppable={true}
          eventDrop={handleEventDrop}
          eventClick={handleEventClick}
          height="auto"
          aspectRatio={1.8}
        />
      </div>

      {/* Task Details Modal */}
      <AnimatePresence>
        {showTaskModal && selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={() => setShowTaskModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedTask.title}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedTask.status === 'Done' ? 'bg-green-100 text-green-800' :
                      selectedTask.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      selectedTask.status === 'Review' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedTask.status}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedTask.priority === 'High' ? 'bg-red-100 text-red-800' :
                      selectedTask.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedTask.priority}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Task Details */}
              <div className="space-y-4">
                {/* Description */}
                {selectedTask.description && (
                  <p className="text-sm text-gray-600">
                    {selectedTask.description}
                  </p>
                )}

                {/* Dates */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {moment(selectedTask.start).format('MMM D, YYYY')}
                    </span>
                  </div>
                  {selectedTask.end && (
                    <>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {moment(selectedTask.end).format('MMM D, YYYY')}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{selectedTask.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-full rounded-full ${
                        selectedTask.progress < 30 ? 'bg-red-500' :
                        selectedTask.progress < 70 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${selectedTask.progress}%` }}
                    />
                  </div>
                </div>

                {/* Assignees */}
                {selectedTask.assignees?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Assignees</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTask.assignees.map((assignee, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 px-2 py-1 bg-gray-100 rounded-full"
                        >
                          <img
                            src={assignee.avatar}
                            alt={assignee.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm text-gray-700">{assignee.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attachments & Comments Count */}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {selectedTask.attachments?.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <FileText className="w-4 h-4" />
                      <span>{selectedTask.attachments.length}</span>
                    </div>
                  )}
                  {selectedTask.comments?.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{selectedTask.comments.length}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Handle edit action
                    setShowTaskModal(false)
                  }}
                  className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600"
                >
                  Edit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 