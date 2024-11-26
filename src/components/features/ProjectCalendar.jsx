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
  MapPin,
  CheckCircle,
  AlertCircle,
  FileText,
  MessageSquare,
  X,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import { useStore } from '@/stores/useStore'
import moment from 'moment'
import toast from 'react-hot-toast'

export function ProjectCalendar() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showEventModal, setShowEventModal] = useState(false)
  const [view, setView] = useState('dayGridMonth')
  const { projects } = useStore()

  // Convert projects and tasks to calendar events
  const events = projects.flatMap(project => [
    // Project milestones
    ...(project.milestones || []).map(milestone => ({
      id: `milestone-${milestone.id}`,
      title: `🎯 ${milestone.title}`,
      start: milestone.dueDate,
      allDay: true,
      backgroundColor: '#8B5CF6',
      borderColor: '#8B5CF6',
      classNames: ['milestone-event'],
      extendedProps: {
        type: 'milestone',
        project,
        milestone
      }
    })),
    // Project tasks
    ...(project.tasks || []).map(task => ({
      id: `task-${task.id}`,
      title: task.title,
      start: task.startDate || task.dueDate,
      end: task.endDate || task.dueDate,
      backgroundColor: getStatusColor(task.status),
      borderColor: getStatusColor(task.status),
      classNames: ['task-event'],
      extendedProps: {
        type: 'task',
        project,
        task
      }
    }))
  ])

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
    setSelectedEvent(info.event)
    setShowEventModal(true)
  }

  const handleEventDrop = async (info) => {
    try {
      const { event } = info
      const { type, project, task } = event.extendedProps

      if (type === 'task') {
        // Update task dates
        await updateTask(project.id, task.id, {
          startDate: event.start,
          endDate: event.end || event.start
        })
        toast.success('Task dates updated')
      }
    } catch (err) {
      toast.error('Failed to update dates')
      info.revert()
    }
  }

  const renderEventContent = (eventInfo) => {
    const { type, task } = eventInfo.event.extendedProps
    
    if (type === 'milestone') {
      return (
        <div className="flex items-center p-1">
          <span className="text-sm font-medium">{eventInfo.event.title}</span>
        </div>
      )
    }

    return (
      <div className="flex items-center p-1">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{eventInfo.event.title}</p>
          {task.assignees?.length > 0 && (
            <div className="flex -space-x-2 mt-1">
              {task.assignees.map((assignee, index) => (
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
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView={view}
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
          viewDidMount={({ view }) => setView(view.type)}
        />
      </div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {showEventModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={() => setShowEventModal(false)}
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
                    {selectedEvent.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedEvent.extendedProps.project.name}
                  </p>
                </div>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Event Details */}
              <div className="space-y-4">
                {/* Dates */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {moment(selectedEvent.start).format('MMM D, YYYY')}
                    </span>
                  </div>
                  {selectedEvent.end && (
                    <>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {moment(selectedEvent.end).format('MMM D, YYYY')}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Task Details */}
                {selectedEvent.extendedProps.type === 'task' && (
                  <>
                    {/* Status */}
                    <div className="flex items-center space-x-2">
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        selectedEvent.extendedProps.task.status === 'Done'
                          ? 'bg-green-100 text-green-800'
                          : selectedEvent.extendedProps.task.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedEvent.extendedProps.task.status}
                      </div>
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        selectedEvent.extendedProps.task.priority === 'High'
                          ? 'bg-red-100 text-red-800'
                          : selectedEvent.extendedProps.task.priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedEvent.extendedProps.task.priority}
                      </div>
                    </div>

                    {/* Description */}
                    {selectedEvent.extendedProps.task.description && (
                      <p className="text-sm text-gray-600">
                        {selectedEvent.extendedProps.task.description}
                      </p>
                    )}

                    {/* Assignees */}
                    {selectedEvent.extendedProps.task.assignees?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Assignees</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedEvent.extendedProps.task.assignees.map((assignee, index) => (
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
                      {selectedEvent.extendedProps.task.attachments?.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <FileText className="w-4 h-4" />
                          <span>{selectedEvent.extendedProps.task.attachments.length}</span>
                        </div>
                      )}
                      {selectedEvent.extendedProps.task.comments?.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{selectedEvent.extendedProps.task.comments.length}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Handle edit action
                    setShowEventModal(false)
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