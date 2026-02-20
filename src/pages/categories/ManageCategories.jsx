// src/pages/ManageCategories.jsx
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Download,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import CategoryModal from './CategoryModal'
import { categoryApi } from '../../api/endpoints'

const ManageCategories = () => {
  const queryClient = useQueryClient()

  const [searchTerm, setSearchTerm]           = useState('')
  const [statusFilter, setStatusFilter]       = useState('all')
  const [isModalOpen, setIsModalOpen]         = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  // ─── FETCH ALL CATEGORIES ────────────────────────────────
  const {
    data: categories = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
    select: (response) => {
      let allCategories = []
      if (Array.isArray(response)) {
        allCategories = response
      } else if (response.data && Array.isArray(response.data)) {
        allCategories = response.data
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        allCategories = response.data.data
      } else if (response.categories && Array.isArray(response.categories)) {
        allCategories = response.categories
      }
      return allCategories.filter(cat => cat && cat.image)
    },
    staleTime: 1000 * 60 * 5,
  })

  // ─── CREATE CATEGORY ──────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: categoryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setIsModalOpen(false)
      setEditingCategory(null)
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to create category')
    },
  })

  // ─── UPDATE CATEGORY ──────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => categoryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setIsModalOpen(false)
      setEditingCategory(null)
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to update category')
    },
  })

  // ─── DELETE CATEGORY ──────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: categoryApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to delete category')
    },
  })

  // ─── FILTER CATEGORIES ────────────────────────────────────
  const getCurrentCategories = () => {
    let filtered = categories.filter(cat =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    if (statusFilter !== 'all') {
      filtered = filtered.filter(cat =>
        statusFilter === 'active' ? cat.isActive : !cat.isActive
      )
    }
    return filtered
  }

  // ─── HANDLERS ─────────────────────────────────────────────
  const handleAddCategory = () => {
    setEditingCategory(null)
    setIsModalOpen(true)
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  const handleSaveCategory = async (formData) => {
    const categoryData = {
      name: formData.name,
      description: formData.description,
      image: formData.image,
    }
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id || editingCategory.id, data: categoryData })
    } else {
      createMutation.mutate(categoryData)
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return
    deleteMutation.mutate(id)
  }

  const handleToggleStatus = async (id) => {
    const category = categories.find(cat => (cat._id || cat.id) === id)
    const updatedData = {
      name: category.name,
      description: category.description,
      image: category.image,
      isActive: !category.isActive,
    }
    updateMutation.mutate({ id, data: updatedData })
  }

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(categories, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `categories-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error exporting:', err)
      alert('Failed to export categories')
    }
  }

  // ─── STATS ────────────────────────────────────────────────
  const getTotalStats = () => ({
    total: categories.length,
    active: categories.filter(c => c.isActive).length,
    inactive: categories.filter(c => !c.isActive).length,
  })

  const stats = getTotalStats()
  const filteredCategories = getCurrentCategories()
  const actionLoading = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  return (
    <div className="min-h-screen bg-white p-6 space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-3xl font-bold mb-1">Property Type</h1>
              <p className="text-white/75 text-sm">Manage your property categories</p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4" />
                  <span className="font-medium">{stats.total} Total</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">{stats.active} Active</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <XCircle className="h-4 w-4" />
                  <span className="font-medium">{stats.inactive} Inactive</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={handleAddCategory}
                disabled={actionLoading}
                className="bg-white text-blue-600 hover:bg-white/90 font-semibold px-5 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
                Add Category
              </button>
            </div>
          </div>
        </div>
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        {/* Error Message */}
        {isError && (
          <div className="m-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900 mb-1">Error Loading Categories</h4>
              <p className="text-sm text-red-700">
                {error?.response?.data?.message || error?.message || 'Failed to load categories'}
              </p>
              <button onClick={() => refetch()} className="mt-2 text-sm font-medium text-red-600 hover:text-red-700 underline">
                Try Again
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 text-sm">Loading categories...</p>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between p-5 border-b border-gray-100">
              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                {[
                  { key: 'all',      label: `All (${categories.length})` },
                  { key: 'active',   label: `Active (${stats.active})` },
                  { key: 'inactive', label: `Inactive (${stats.inactive})` },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setStatusFilter(key)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                      statusFilter === key
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-9 py-2 w-72 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Table */}
            {filteredCategories.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Category</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Description</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Created</th>
                      <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredCategories.map((category) => (
                      <tr
                        key={category._id || category.id}
                        className="hover:bg-blue-50/30 transition-colors group"
                      >
                        {/* Category Name + Image */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                              {category.image ? (
                                <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-500">
                                  {category.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <span className="font-semibold text-gray-900 text-sm">{category.name}</span>
                          </div>
                        </td>

                        {/* Description */}
                        <td className="px-6 py-4 max-w-xs">
                          <p className="text-sm text-gray-500 truncate">
                            {category.description || <span className="italic text-gray-400">No description</span>}
                          </p>
                        </td>

                        {/* Status Badge */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            category.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${category.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        {/* Created Date */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-400">
                            {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : '—'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            {/* Toggle Status */}
                            <button
                              onClick={() => handleToggleStatus(category._id || category.id)}
                              disabled={actionLoading}
                              title={category.isActive ? 'Deactivate' : 'Activate'}
                              className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {category.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => handleEditCategory(category)}
                              disabled={actionLoading}
                              className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Edit className="h-4 w-4" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteCategory(category._id || category.id)}
                              disabled={actionLoading}
                              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Table Footer */}
                <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                  <p className="text-xs text-gray-400">
                    Showing <span className="font-medium text-gray-600">{filteredCategories.length}</span> of{' '}
                    <span className="font-medium text-gray-600">{categories.length}</span> categories
                  </p>
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-20">
                  <Tag className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">No categories found</h3>
                <p className="text-sm text-gray-500 mb-5">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by creating your first category.'}
                </p>
                <button
                  onClick={handleAddCategory}
                  disabled={actionLoading}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                  Add Category
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingCategory(null)
        }}
        onSave={handleSaveCategory}
        category={editingCategory}
        type="Category"
        loading={actionLoading}
      />

      {/* Loading Overlay */}
      {actionLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 shadow-2xl flex items-center gap-4">
            <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
            <span className="font-semibold text-gray-900">Processing...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageCategories