import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'

export const useTableStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Table data
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
          // ... other initial deals
        ],

        // Table state
        selectedRows: [],
        sortConfig: { field: 'deal', direction: 'asc' },
        filters: {},
        searchTerm: '',
        pagination: { page: 1, pageSize: 10 },

        // Actions
        addDeal: (deal) => set((state) => ({
          deals: [...state.deals, { id: Date.now(), ...deal }]
        })),

        updateDeal: (id, updates) => set((state) => ({
          deals: state.deals.map(deal => 
            deal.id === id ? { ...deal, ...updates } : deal
          )
        })),

        deleteDeal: (id) => set((state) => ({
          deals: state.deals.filter(deal => deal.id !== id),
          selectedRows: state.selectedRows.filter(rowId => rowId !== id)
        })),

        bulkDeleteDeals: (ids) => set((state) => ({
          deals: state.deals.filter(deal => !ids.includes(deal.id)),
          selectedRows: state.selectedRows.filter(rowId => !ids.includes(rowId))
        })),

        toggleRowSelection: (id) => set((state) => ({
          selectedRows: state.selectedRows.includes(id)
            ? state.selectedRows.filter(rowId => rowId !== id)
            : [...state.selectedRows, id]
        })),

        setSelectedRows: (rows) => set({ selectedRows: rows }),

        clearSelection: () => set({ selectedRows: [] }),

        setSortConfig: (config) => set({ sortConfig: config }),

        setFilters: (filters) => set({ filters }),

        setSearchTerm: (term) => set({ searchTerm: term }),

        setPagination: (pagination) => set({ pagination }),

        // Computed values
        getFilteredDeals: () => {
          const state = get()
          let filtered = [...state.deals]

          // Apply search
          if (state.searchTerm) {
            const term = state.searchTerm.toLowerCase()
            filtered = filtered.filter(deal =>
              Object.values(deal).some(value =>
                String(value).toLowerCase().includes(term)
              )
            )
          }

          // Apply filters
          Object.entries(state.filters).forEach(([key, value]) => {
            if (value) {
              filtered = filtered.filter(deal => deal[key] === value)
            }
          })

          // Apply sorting
          if (state.sortConfig.field) {
            filtered.sort((a, b) => {
              if (a[state.sortConfig.field] < b[state.sortConfig.field]) {
                return state.sortConfig.direction === 'asc' ? -1 : 1
              }
              if (a[state.sortConfig.field] > b[state.sortConfig.field]) {
                return state.sortConfig.direction === 'asc' ? 1 : -1
              }
              return 0
            })
          }

          return filtered
        },

        getPaginatedDeals: () => {
          const state = get()
          const filtered = state.getFilteredDeals()
          const { page, pageSize } = state.pagination
          const start = (page - 1) * pageSize
          const end = start + pageSize
          return filtered.slice(start, end)
        },

        getTotalPages: () => {
          const state = get()
          return Math.ceil(state.getFilteredDeals().length / state.pagination.pageSize)
        }
      }),
      {
        name: 'table-storage',
        partialize: (state) => ({
          deals: state.deals,
          sortConfig: state.sortConfig,
          filters: state.filters,
          pagination: state.pagination
        })
      }
    )
  )
) 