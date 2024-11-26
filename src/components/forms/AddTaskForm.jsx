import { useForm, Controller } from 'react-hook-form'
import { motion } from 'framer-motion'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertCircle, Calendar, Clock, Users, FileText, Image, Table, X } from 'lucide-react'
import { useStore } from '@/stores/useStore'
import { FileUpload } from '@/components/shared/FileUpload'
import moment from 'moment'
import toast from 'react-hot-toast'
import Select from 'react-select'

const taskSchema = z.object({
  title: z.string()
    .min(3, 'Task title must be at least 3 characters')
    .max(100, 'Task title must be less than 100 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  dueDate: z.string().min(1, 'Due date is required'),
  estimatedHours: z.number()
    .min(0, 'Hours cannot be negative')
    .max(1000, 'Hours cannot exceed 1000'),
  priority: z.enum(['Low', 'Medium', 'High']),
  assignees: z.array(z.string()).min(1, 'At least one assignee is required'),
  attachments: z.array(z.any()).optional(),
  status: z.enum(['Todo', 'In Progress', 'Review', 'Done']).default('Todo')
})

export function AddTaskForm({ projectId, initialData = null, onClose }) {
  const { addTask, updateTask, addTaskAttachment } = useStore()

  const { 
    control, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset,
    setValue,
    getValues,
    watch
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      dueDate: moment().add(1, 'week').format('YYYY-MM-DD'),
      estimatedHours: 0,
      priority: 'Medium',
      assignees: [],
      attachments: [],
      status: 'Todo'
    }
  })

  const handleFileUpload = (file) => {
    try {
      const fileData = {
        id: Date.now(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        file
      }
      
      const currentFiles = watch('attachments') || []
      setValue('attachments', [...currentFiles, fileData])
    } catch (err) {
      toast.error('Failed to upload file')
    }
  }

  const onSubmit = async (data) => {
    try {
      const taskData = {
        ...data,
        projectId,
        createdAt: moment().toISOString(),
        lastUpdated: moment().toISOString(),
        status: 'Todo',
        progress: 0,
        comments: [],
        attachments: data.attachments?.map(({ id, name, size, type, url }) => ({
          id, name, size, type, url
        })) || []
      }

      if (initialData) {
        await updateTask(projectId, initialData.id, taskData)
        toast.success('Task updated successfully')
      } else {
        await addTask(projectId, taskData)
        toast.success('Task created successfully')
      }

      reset()
      onClose()
    } catch (err) {
      console.error('Task error:', err)
      toast.error(initialData ? 'Failed to update task' : 'Failed to create task')
    }
  }

  const FormField = ({ name, label, children, error }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-1 text-red-500 text-sm"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{error.message}</span>
        </motion.div>
      )}
    </div>
  )

  const FileIcon = ({ type, size = 24 }) => {
    if (type.startsWith('image/')) return <Image size={size} className="text-purple-500" />
    if (type === 'application/pdf') return <FileText size={size} className="text-red-500" />
    if (type.includes('spreadsheet') || type.includes('excel')) 
      return <Table size={size} className="text-green-500" />
    if (type.includes('document') || type.includes('word')) 
      return <FileText size={size} className="text-blue-500" />
    return <File size={size} className="text-gray-500" />
  }

  const assigneeOptions = [
    { value: 'john', label: 'John Doe', avatar: 'https://picsum.photos/seed/john/40' },
    { value: 'jane', label: 'Jane Smith', avatar: 'https://picsum.photos/seed/jane/40' },
    { value: 'bob', label: 'Bob Johnson', avatar: 'https://picsum.photos/seed/bob/40' }
  ]

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? '#2D7FF9' : '#E5E7EB',
      boxShadow: state.isFocused ? '0 0 0 1px #2D7FF9' : 'none',
      '&:hover': {
        borderColor: '#2D7FF9'
      }
    }),
    option: (base, { isSelected, isFocused }) => ({
      ...base,
      backgroundColor: isSelected ? '#2D7FF9' : isFocused ? '#EFF6FF' : 'white',
      color: isSelected ? 'white' : '#374151',
      ':active': {
        backgroundColor: '#2D7FF9'
      }
    })
  }

  const CustomOption = ({ innerProps, label, data }) => (
    <div {...innerProps} className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50">
      <img src={data.avatar} alt={label} className="w-6 h-6 rounded-full mr-2" />
      <span>{label}</span>
    </div>
  )

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormField name="title" label="Task Title" error={errors.title}>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className={`
                mt-1 block w-full rounded-lg border px-3 py-2
                ${errors.title 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-primary-blue focus:border-primary-blue'
                }
              `}
              placeholder="Enter task title"
            />
          )}
        />
      </FormField>

      <FormField name="description" label="Description" error={errors.description}>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              rows={3}
              className={`
                mt-1 block w-full rounded-lg border px-3 py-2
                ${errors.description 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-primary-blue focus:border-primary-blue'
                }
              `}
              placeholder="Describe the task..."
            />
          )}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField name="dueDate" label="Due Date" error={errors.dueDate}>
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...field}
                  type="date"
                  className={`
                    mt-1 block w-full rounded-lg border pl-10 pr-3 py-2
                    ${errors.dueDate 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-primary-blue focus:border-primary-blue'
                    }
                  `}
                />
              </div>
            )}
          />
        </FormField>

        <FormField name="estimatedHours" label="Estimated Hours" error={errors.estimatedHours}>
          <Controller
            name="estimatedHours"
            control={control}
            render={({ field: { onChange, ...field } }) => (
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...field}
                  type="number"
                  onChange={(e) => onChange(parseFloat(e.target.value))}
                  className={`
                    mt-1 block w-full rounded-lg border pl-10 pr-3 py-2
                    ${errors.estimatedHours 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-primary-blue focus:border-primary-blue'
                    }
                  `}
                  placeholder="0"
                  min="0"
                  step="0.5"
                />
              </div>
            )}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField name="priority" label="Priority" error={errors.priority}>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className={`
                  mt-1 block w-full rounded-lg border px-3 py-2
                  ${errors.priority 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-primary-blue focus:border-primary-blue'
                  }
                `}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            )}
          />
        </FormField>

        <FormField name="assignees" label="Assignees" error={errors.assignees}>
          <Controller
            name="assignees"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <Select
                ref={ref}
                value={assigneeOptions.filter(option => value?.includes(option.value))}
                onChange={(selected) => {
                  onChange(selected ? selected.map(option => option.value) : [])
                }}
                options={assigneeOptions}
                isMulti
                styles={selectStyles}
                components={{ Option: CustomOption }}
                placeholder="Select assignees..."
                className="mt-1"
              />
            )}
          />
        </FormField>
      </div>

      <FormField name="attachments" label="Attachments">
        <FileUpload
          onUpload={handleFileUpload}
          maxSize={10}
          allowedTypes="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
          multiple={true}
        />
        {watch('attachments')?.length > 0 && (
          <div className="mt-2 space-y-2">
            {watch('attachments').map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileIcon type={file.type} size={20} />
                  <span className="text-sm text-gray-600">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const files = watch('attachments').filter((_, i) => i !== index)
                    setValue('attachments', files)
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </FormField>

      <FormField name="status" label="Status" error={errors.status}>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              className={`
                mt-1 block w-full rounded-lg border px-3 py-2
                ${errors.status 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-primary-blue focus:border-primary-blue'
                }
              `}
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Done">Done</option>
            </select>
          )}
        />
      </FormField>

      <div className="pt-4 flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => {
            reset()
            onClose()
          }}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            px-4 py-2 text-white rounded-lg
            ${isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary-blue hover:bg-blue-600'
            }
          `}
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </motion.form>
  )
} 