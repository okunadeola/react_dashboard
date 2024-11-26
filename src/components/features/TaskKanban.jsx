import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  MoreVertical, 
  Calendar,
  MessageSquare,
  Paperclip,
} from 'lucide-react'
import { useStore } from '@/stores/useStore'
import moment from 'moment'
import toast from 'react-hot-toast'
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'

const COLUMNS = [
  { id: 'Todo', title: 'To Do', color: 'bg-gray-100', textColor: 'text-gray-600' },
  { id: 'In Progress', title: 'In Progress', color: 'bg-blue-50', textColor: 'text-blue-600' },
  { id: 'Review', title: 'Review', color: 'bg-yellow-50', textColor: 'text-yellow-600' },
  { id: 'Done', title: 'Done', color: 'bg-green-50', textColor: 'text-green-600' }
]

function Draggable({ children, id }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id.toString(),
  })
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  )
}

function DroppableColumn({ children, id }) {
  const { setNodeRef } = useDroppable({
    id: id,
  })

  return (
    <div ref={setNodeRef} className="flex-1 min-h-[200px]">
      {children}
    </div>
  )
}

export function TaskKanban({ tasks = [], projectId }) {
  const { updateTask } = useStore()
  const [localTasks, setLocalTasks] = useState(tasks)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Group tasks by status
  const tasksByStatus = COLUMNS.reduce((acc, column) => {
    acc[column.id] = localTasks.filter(task => task.status === column.id)
    return acc
  }, {})

  const handleDragEnd = async (event) => {
    const { active, over } = event
    
    if (!over) return

    const taskId = parseInt(active.id)
    const newStatus = over.id

    if (newStatus && active.id !== over.id) {
      // Update local state immediately
      setLocalTasks(prevTasks => 
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      )

      try {
        await updateTask(projectId, taskId, { 
          status: newStatus,
          lastUpdated: moment().toISOString()
        })
        toast.success('Task status updated')
      } catch (err) {
        // Revert on error
        setLocalTasks(tasks)
        console.error('Drop error:', err)
        toast.error('Failed to update task status')
      }
    }
  }

  const TaskCard = ({ task }) => {
    const priorityColors = {
      High: 'bg-red-100 text-red-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Low: 'bg-green-100 text-green-800'
    }

    return (
      <motion.div
        layout
        className="bg-white p-4 rounded-lg border border-gray-200 mb-3 cursor-move"
        whileHover={{ y: -2 }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
            {task.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
            )}
          </div>
          <button className="p-1 hover:bg-gray-100 rounded-full">
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {task.progress !== undefined && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{task.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full">
              <div 
                className={`h-full rounded-full ${
                  task.progress < 30 ? 'bg-red-500' :
                  task.progress < 70 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            {task.dueDate && (
              <div className="flex items-center text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                <span>{moment(task.dueDate).format('MMM D')}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {task.attachments?.length > 0 && (
              <div className="flex items-center text-gray-400">
                <Paperclip className="w-3 h-3 mr-1" />
                <span>{task.attachments.length}</span>
              </div>
            )}
            {task.comments?.length > 0 && (
              <div className="flex items-center text-gray-400">
                <MessageSquare className="w-3 h-3 mr-1" />
                <span>{task.comments.length}</span>
              </div>
            )}
            {task.assignees?.length > 0 && (
              <div className="flex -space-x-2">
                {task.assignees.slice(0, 3).map((assignee, index) => (
                  <img
                    key={index}
                    src={`https://picsum.photos/seed/${assignee}/40`}
                    alt={assignee}
                    className="w-6 h-6 rounded-full border-2 border-white"
                    title={assignee}
                  />
                ))}
                {task.assignees.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                    <span className="text-xs text-gray-600">+{task.assignees.length - 3}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <DndContext 
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {COLUMNS.map((column) => (
          <div
            key={column.id}
            className={`flex flex-col rounded-lg ${column.color} p-4`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h3 className={`font-medium ${column.textColor}`}>{column.title}</h3>
                <span className="text-sm text-gray-500">
                  ({tasksByStatus[column.id]?.length || 0})
                </span>
              </div>
              <button className={`p-1 hover:bg-white/50 rounded ${column.textColor}`}>
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <DroppableColumn id={column.id}>
              {tasksByStatus[column.id]?.map((task) => (
                <Draggable key={task.id} id={task.id}>
                  <TaskCard task={task} />
                </Draggable>
              ))}
            </DroppableColumn>
          </div>
        ))}
      </div>
    </DndContext>
  )
} 