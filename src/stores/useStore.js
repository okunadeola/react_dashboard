import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'
import moment from 'moment'

const initialState = {
  projects: [],
  selectedProject: null,
  selectedTask: null,
  filters: {
    status: 'all',
    priority: 'all',
    assignee: 'all',
    dueDate: 'all'
  },
  view: 'list',
  modal: {
    isOpen: false,
    title: '',
    content: null
  },
  sidebar: {
    isOpen: true
  },
  notifications: [
    {
      id: 1,
      title: 'New Project Created',
      message: 'Project "Website Redesign" has been created',
      timestamp: new Date().toISOString(),
      read: false,
      type: 'info'
    },
    {
      id: 2,
      title: 'Task Updated',
      message: 'Task "Design Homepage" has been updated',
      timestamp: new Date().toISOString(),
      read: false,
      type: 'info'
    }
  ],
  deals: [
    { 
      id: 1, 
      deal: 'City Center Complex', 
      value: '$1.2M', 
      status: 'In Progress', 
      progress: 65,
      lastUpdated: '2024-03-15',
      team: ['John D.', 'Sarah M.'],
      priority: 'High'
    },
    { 
      id: 2, 
      deal: 'Riverside Development', 
      value: '$2.5M', 
      status: 'Planning', 
      progress: 25,
      lastUpdated: '2024-03-14',
      team: ['Emily R.', 'Michael K.'],
      priority: 'Medium'
    },
    { 
      id: 3, 
      deal: 'Metro Station Renovation', 
      value: '$800K', 
      status: 'Completed', 
      progress: 100,
      lastUpdated: '2024-03-13',
      team: ['David L.'],
      priority: 'Low'
    }
  ],
  messages: []
}

export const useStore = create(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Modal Actions
        openModal: (title, content) => set({
          modal: { isOpen: true, title, content }
        }),
        closeModal: () => set({
          modal: { isOpen: false, title: '', content: null }
        }),

        // Sidebar Actions
        setSidebarOpen: (isOpen) => set({
          sidebar: { isOpen }
        }),

        // Project Actions
        addProject: (projectData) => set((state) => {
          const newProject = {
            id: Date.now(),
            createdAt: moment().toISOString(),
            progress: 0,
            lastUpdated: moment().toISOString(),
            tasks: [],
            team: [],
            attachments: [],
            status: 'Planning',
            ...projectData
          }
          
          return {
            projects: [...state.projects, newProject]
          }
        }),

        updateProject: (projectId, updates) => set((state) => ({
          projects: state.projects.map(project =>
            project.id === projectId
              ? { 
                  ...project, 
                  ...updates,
                  lastUpdated: moment().toISOString()
                }
              : project
          )
        })),

        deleteProject: (projectId) => set((state) => ({
          projects: state.projects.filter(project => project.id !== projectId)
        })),

        // Task Actions
        addTask: (projectId, taskData) => set((state) => ({
          projects: state.projects.map(project =>
            project.id === projectId
              ? {
                  ...project,
                  tasks: [...(project.tasks || []), {
                    id: Date.now(),
                    createdAt: moment().toISOString(),
                    status: 'Todo',
                    progress: 0,
                    comments: [],
                    attachments: [],
                    history: [],
                    lastUpdated: moment().toISOString(),
                    ...taskData
                  }],
                  lastUpdated: moment().toISOString()
                }
              : project
          )
        })),

        updateTask: (projectId, taskId, updates) => set((state) => ({
          projects: state.projects.map(project =>
            project.id === projectId
              ? {
                  ...project,
                  tasks: project.tasks.map(task =>
                    task.id === taskId
                      ? { ...task, ...updates }
                      : task
                  ),
                  lastUpdated: moment().toISOString()
                }
              : project
          )
        })),

        deleteTask: (projectId, taskId) => set((state) => ({
          projects: state.projects.map(project =>
            project.id === projectId
              ? {
                  ...project,
                  tasks: (project.tasks || []).filter(task => task.id !== taskId),
                  lastUpdated: moment().toISOString()
                }
              : project
          )
        })),

        // View and Filter Actions
        setView: (view) => set({ view }),
        setFilters: (filters) => set({ filters }),

        // Selection Actions
        setSelectedProject: (projectId) => set({ 
          selectedProject: projectId,
          selectedTask: null 
        }),
        setSelectedTask: (taskId) => set({ selectedTask: taskId }),
        clearSelection: () => set({ 
          selectedProject: null, 
          selectedTask: null 
        }),

        // Computed Values
        getProjectById: (projectId) => {
          return get().projects.find(p => p.id === projectId)
        },

        getTaskById: (projectId, taskId) => {
          const project = get().projects.find(p => p.id === projectId)
          return project?.tasks?.find(t => t.id === taskId)
        },

        getFilteredTasks: (projectId) => {
          const project = get().projects.find(p => p.id === projectId)
          const filters = get().filters
          
          if (!project?.tasks) return []

          return project.tasks.filter(task => {
            if (filters.status !== 'all' && task.status !== filters.status) return false
            if (filters.priority !== 'all' && task.priority !== filters.priority) return false
            if (filters.assignee !== 'all' && !task.assignees?.includes(filters.assignee)) return false
            
            if (filters.dueDate !== 'all') {
              const due = moment(task.dueDate)
              const today = moment()
              
              switch (filters.dueDate) {
                case 'today':
                  return due.isSame(today, 'day')
                case 'week':
                  return due.isSame(today, 'week')
                case 'month':
                  return due.isSame(today, 'month')
                case 'overdue':
                  return due.isBefore(today, 'day')
                default:
                  return true
              }
            }
            
            return true
          })
        },

        // Add attachment actions
        addTaskAttachment: (projectId, taskId, file) => set((state) => ({
          projects: state.projects.map(project =>
            project.id === projectId
              ? {
                  ...project,
                  tasks: project.tasks.map(task =>
                    task.id === taskId
                      ? {
                          ...task,
                          attachments: [...(task.attachments || []), {
                            id: Date.now(),
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            url: URL.createObjectURL(file),
                            uploadedAt: moment().toISOString()
                          }],
                          lastUpdated: moment().toISOString()
                        }
                      : task
                  )
                }
              : project
          )
        })),

        removeTaskAttachment: (projectId, taskId, attachmentId) => set((state) => ({
          projects: state.projects.map(project =>
            project.id === projectId
              ? {
                  ...project,
                  tasks: project.tasks.map(task =>
                    task.id === taskId
                      ? {
                          ...task,
                          attachments: task.attachments.filter(a => a.id !== attachmentId),
                          lastUpdated: moment().toISOString()
                        }
                      : task
                  )
                }
              : project
          )
        })),

        // Deal Actions
        addDeal: (dealData) => set((state) => ({
          deals: [...state.deals, { id: Date.now(), ...dealData }]
        })),

        updateDeal: (id, updates) => set((state) => ({
          deals: state.deals.map(deal =>
            deal.id === id ? { ...deal, ...updates } : deal
          )
        })),

        deleteDeal: (id) => set((state) => ({
          deals: state.deals.filter(deal => deal.id !== id)
        })),

        // Message Actions
        addMessage: (message) => set((state) => ({
          messages: [...state.messages, message]
        })),

        deleteMessage: (messageId) => set((state) => ({
          messages: state.messages.filter(m => m.id !== messageId)
        })),

        updateMessage: (messageId, updates) => set((state) => ({
          messages: state.messages.map(message =>
            message.id === messageId ? { ...message, ...updates } : message
          )
        }))
      }),
      {
        name: 'project-storage',
        partialize: (state) => ({
          projects: state.projects,
          filters: state.filters,
          view: state.view,
          sidebar: state.sidebar
        })
      }
    )
  )
) 