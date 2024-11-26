import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'

export const useTableState = create(
  devtools(
    persist(
      (set, get) => ({
        // Table state
        selectedRows: [],
        sortConfig: { field: 'deal', direction: 'asc' },
        filters: {},
        searchTerm: '',
        pagination: { page: 1, pageSize: 10 },
        viewMode: 'table', // or 'grid'

        // Actions
        setSelectedRows: (rows) => set({ selectedRows: rows }),
        toggleRowSelection: (id) => set((state) => ({
          selectedRows: state.selectedRows.includes(id)
            ? state.selectedRows.filter(rowId => rowId !== id)
            : [...state.selectedRows, id]
        })),
        clearSelection: () => set({ selectedRows: [] }),
        setSortConfig: (config) => set({ sortConfig: config }),
        setFilters: (filters) => set({ filters }),
        setSearchTerm: (term) => set({ searchTerm: term }),
        setPagination: (pagination) => set({ pagination }),
        setViewMode: (mode) => set({ viewMode: mode }),

        // Bulk actions
        handleBulkAction: async (action, ids) => {
          switch (action) {
            case 'delete':
              // Handle delete
              break
            case 'archive':
              // Handle archive
              break
            case 'export':
              // Handle export
              break
            default:
              break
          }
          set({ selectedRows: [] })
        }
      }),
      {
        name: 'table-state',
        partialize: (state) => ({
          sortConfig: state.sortConfig,
          filters: state.filters,
          viewMode: state.viewMode,
          pagination: state.pagination
        })
      }
    )
  )
) 