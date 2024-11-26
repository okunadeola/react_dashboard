import { useStore } from '@/stores/useStore'
import { useCallback } from 'react'
import { useNotifications } from './useNotifications'

export function useProjects() {
  const { projects, addProject, updateProject, removeProject } = useStore()
  const { success, error } = useNotifications()

  const createProject = useCallback(async (projectData) => {
    try {
      await addProject({
        ...projectData,
        status: 'Planning',
        progress: 0,
        team: [],
        tasks: [],
        createdAt: new Date()
      })
      success('Project Created', 'New project has been successfully created')
      return true
    } catch (err) {
      error('Error', 'Failed to create project')
      return false
    }
  }, [addProject, success, error])

  const updateProjectDetails = useCallback(async (id, updates) => {
    try {
      await updateProject(id, updates)
      success('Project Updated', 'Project has been successfully updated')
      return true
    } catch (err) {
      error('Error', 'Failed to update project')
      return false
    }
  }, [updateProject, success, error])

  const deleteProject = useCallback(async (id) => {
    try {
      await removeProject(id)
      success('Project Deleted', 'Project has been successfully deleted')
      return true
    } catch (err) {
      error('Error', 'Failed to delete project')
      return false
    }
  }, [removeProject, success, error])

  const getProjectStats = useCallback(() => {
    const total = projects.length
    const completed = projects.filter(p => p.progress === 100).length
    const inProgress = projects.filter(p => p.progress > 0 && p.progress < 100).length
    const planning = projects.filter(p => p.progress === 0).length

    return {
      total,
      completed,
      inProgress,
      planning,
      completionRate: total ? (completed / total) * 100 : 0
    }
  }, [projects])

  return {
    projects,
    createProject,
    updateProjectDetails,
    deleteProject,
    getProjectStats
  }
} 