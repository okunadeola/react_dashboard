import { useForm, Controller } from 'react-hook-form'
import { motion } from 'framer-motion'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertCircle, Calendar, Users, DollarSign } from 'lucide-react'
import { useStore } from '@/stores/useStore'
import { FileUpload } from '@/components/shared/FileUpload'
import moment from 'moment'
import toast from 'react-hot-toast'

const projectSchema = z.object({
  name: z.string()
    .min(3, 'Project name must be at least 3 characters')
    .max(100, 'Project name must be less than 100 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  budget: z.string().regex(/^\$?\d+(\.\d{1,2})?[KMB]?$/, 'Please enter a valid budget'),
  type: z.enum(['Construction', 'Infrastructure', 'Landscaping', 'Commercial']),
  priority: z.enum(['Low', 'Medium', 'High']),
  client: z.string().min(3, 'Client name is required'),
  team: z.array(z.string()).optional(),
  attachments: z.array(z.any()).optional()
})

export function AddProjectForm({ initialData = null, onClose }) {
  const { addProject } = useStore()
  const isEditing = !!initialData

  const { 
    control, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().add(1, 'month').format('YYYY-MM-DD'),
      budget: '',
      type: 'Construction',
      priority: 'Medium',
      client: '',
      team: [],
      attachments: []
    }
  })

  const onSubmit = async (data) => {
    try {
      await addProject(data)
      reset()
      onClose()
    } catch (err) {
      toast.error('Failed to create project')
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

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormField name="name" label="Project Name" error={errors.name}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className={`
                mt-1 block w-full rounded-lg border px-3 py-2
                ${errors.name 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-primary-blue focus:border-primary-blue'
                }
              `}
              placeholder="Enter project name"
            />
          )}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField name="type" label="Project Type" error={errors.type}>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className={`
                  mt-1 block w-full rounded-lg border px-3 py-2
                  ${errors.type 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-primary-blue focus:border-primary-blue'
                  }
                `}
              >
                <option value="Construction">Construction</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Landscaping">Landscaping</option>
                <option value="Commercial">Commercial</option>
              </select>
            )}
          />
        </FormField>

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
      </div>

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
              placeholder="Enter project description"
            />
          )}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField name="startDate" label="Start Date" error={errors.startDate}>
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="date"
                className={`
                  mt-1 block w-full rounded-lg border px-3 py-2
                  ${errors.startDate 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-primary-blue focus:border-primary-blue'
                  }
                `}
              />
            )}
          />
        </FormField>

        <FormField name="endDate" label="End Date" error={errors.endDate}>
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="date"
                className={`
                  mt-1 block w-full rounded-lg border px-3 py-2
                  ${errors.endDate 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-primary-blue focus:border-primary-blue'
                  }
                `}
              />
            )}
          />
        </FormField>
      </div>

      <FormField name="budget" label="Budget" error={errors.budget}>
        <Controller
          name="budget"
          control={control}
          render={({ field }) => (
            <div className="mt-1 relative rounded-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="w-5 h-5 text-gray-400" />
              </div>
              <input
                {...field}
                type="text"
                className={`
                  block w-full rounded-lg border pl-10 pr-3 py-2
                  ${errors.budget 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-primary-blue focus:border-primary-blue'
                  }
                `}
                placeholder="0.00"
              />
            </div>
          )}
        />
      </FormField>

      <FormField name="client" label="Client" error={errors.client}>
        <Controller
          name="client"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className={`
                mt-1 block w-full rounded-lg border px-3 py-2
                ${errors.client 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-primary-blue focus:border-primary-blue'
                }
              `}
              placeholder="Enter client name"
            />
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
          {isSubmitting ? 'Creating...' : 'Create Project'}
        </button>
      </div>
    </motion.form>
  )
} 