import { useForm, Controller } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useStore } from '@/stores/useStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DollarSign, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

// Form validation schema
const dealSchema = z.object({
  deal: z.string()
    .min(3, 'Deal name must be at least 3 characters')
    .max(100, 'Deal name must be less than 100 characters'),
  value: z.string()
    .regex(/^\$?\d+(\.\d{1,2})?[KMB]?$/, 'Please enter a valid monetary value'),
  status: z.enum(['Planning', 'In Progress', 'Completed']),
  priority: z.enum(['Low', 'Medium', 'High']),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  team: z.array(z.string()).default([])
})

export function AddDealForm({ initialData = null, onClose }) {
  const { addDeal, updateDeal } = useStore()
  const isEditing = !!initialData

  const { 
    control, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    reset
  } = useForm({
    resolver: zodResolver(dealSchema),
    defaultValues: initialData || {
      deal: '',
      value: '',
      status: 'Planning',
      priority: 'Medium',
      description: '',
      team: []
    }
  })

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await updateDeal(initialData.id, data)
      } else {
        await addDeal(data)
      }
      reset()
      onClose()
    } catch (err) {
      toast.error(isEditing ? 'Failed to update deal' : 'Failed to create deal')
    }
  }

  const FormField = ({ name, label, children, error }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
      <FormField name="deal" label="Deal Name" error={errors.deal}>
        <Controller
          name="deal"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className={`
                mt-1 block w-full rounded-lg border px-3 py-2
                ${errors.deal 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-primary-blue focus:border-primary-blue'
                }
                dark:bg-gray-800 dark:border-gray-700 dark:text-white
              `}
              placeholder="Enter deal name"
            />
          )}
        />
      </FormField>

      <FormField name="value" label="Deal Value" error={errors.value}>
        <Controller
          name="value"
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
                  ${errors.value 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-primary-blue focus:border-primary-blue'
                  }
                  dark:bg-gray-800 dark:border-gray-700 dark:text-white
                `}
                placeholder="0.00"
              />
            </div>
          )}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
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
                  dark:bg-gray-800 dark:border-gray-700 dark:text-white
                `}
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
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
                  dark:bg-gray-800 dark:border-gray-700 dark:text-white
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
                dark:bg-gray-800 dark:border-gray-700 dark:text-white
              `}
              placeholder="Enter deal description..."
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
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
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
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Deal' : 'Create Deal'}
        </button>
      </div>
    </motion.form>
  )
} 