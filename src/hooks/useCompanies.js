import { useStore } from '@/stores/useStore'
import { useCallback } from 'react'
import { useNotifications } from './useNotifications'

export function useCompanies() {
  const { companies, addCompany, updateCompany, removeCompany } = useStore()
  const { success, error } = useNotifications()

  const createCompany = useCallback(async (companyData) => {
    try {
      await addCompany({
        ...companyData,
        employees: [],
        projects: [],
        createdAt: new Date()
      })
      success('Company Created', 'New company has been successfully created')
      return true
    } catch (err) {
      error('Error', 'Failed to create company')
      return false
    }
  }, [addCompany, success, error])

  const updateCompanyDetails = useCallback(async (id, updates) => {
    try {
      await updateCompany(id, updates)
      success('Company Updated', 'Company has been successfully updated')
      return true
    } catch (err) {
      error('Error', 'Failed to update company')
      return false
    }
  }, [updateCompany, success, error])

  const deleteCompany = useCallback(async (id) => {
    try {
      await removeCompany(id)
      success('Company Deleted', 'Company has been successfully deleted')
      return true
    } catch (err) {
      error('Error', 'Failed to delete company')
      return false
    }
  }, [removeCompany, success, error])

  const getCompanyStats = useCallback(() => {
    return {
      total: companies.length,
      totalEmployees: companies.reduce((acc, company) => acc + company.employees.length, 0),
      totalProjects: companies.reduce((acc, company) => acc + company.projects.length, 0),
      activeCompanies: companies.filter(c => c.projects.some(p => p.status === 'active')).length
    }
  }, [companies])

  return {
    companies,
    createCompany,
    updateCompanyDetails,
    deleteCompany,
    getCompanyStats
  }
} 