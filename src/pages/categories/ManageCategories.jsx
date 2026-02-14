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
  
  const [searchTerm, setSearchTerm]       = useState('')
  const [statusFilter, setStatusFilter]   = useState('all')
  const [isModalOpen, setIsModalOpen]     = useState(false)
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
      // Handle different response structures
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

      // Filter to show only categories with images
      return allCategories.filter(cat => cat && cat.image)
    },
    staleTime: 1000 * 60 * 5, // 5 min
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
      // Update existing
      updateMutation.mutate({
        id: editingCategory._id || editingCategory.id,
        data: categoryData,
      })
    } else {
      // Create new
      createMutation.mutate(categoryData)
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return
    }
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
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold mb-2">Property Type</h1>
              <p className="text-white/80 text-lg">Property Type</p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  <span className="font-semibold">{stats.total} Categories</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">{stats.active} Active</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleExport}
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={handleAddCategory}
                disabled={actionLoading}
                className="bg-white text-purple-600 hover:bg-white/90 font-semibold px-6 py-2 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
                Add Category
              </button>
            </div>
          </div>
        </div>

        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        {/* Error Message */}
        {isError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900 mb-1">Error Loading Categories</h4>
              <p className="text-sm text-red-700">
                {error?.response?.data?.message || error?.message || 'Failed to load categories'}
              </p>
              <button
                onClick={() => refetch()}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-700 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading categories...</p>
          </div>
        ) : (
          <>
            {/* Filters and Search */}
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    statusFilter === 'all'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All ({categories.length})
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    statusFilter === 'active'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Active ({categories.filter(c => c.isActive).length})
                </button>
                <button
                  onClick={() => setStatusFilter('inactive')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    statusFilter === 'inactive'
                      ? 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Inactive ({categories.filter(c => !c.isActive).length})
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 py-2.5 w-80 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map((category) => (
                <div
                  key={category._id || category.id}
                  className="relative group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md overflow-hidden bg-gray-200">
                        {category.image ? (
                          <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl font-bold text-gray-600">
                            {category.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      category.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {category.description || 'No description available'}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-xs text-gray-500">
                      {category.createdAt ? `Created: ${new Date(category.createdAt).toLocaleDateString()}` : 'No date'}
                    </span>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleToggleStatus(category._id || category.id)}
                        disabled={actionLoading}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={category.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {category.isActive ? (
                          <XCircle className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEditCategory(category)}
                        disabled={actionLoading}
                        className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id || category.id)}
                        disabled={actionLoading}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredCategories.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by creating your first category.'}
                </p>
                <button
                  onClick={handleAddCategory}
                  disabled={actionLoading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                  Add New Category
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
            <Loader2 className="h-6 w-6 text-purple-600 animate-spin" />
            <span className="font-semibold text-gray-900">Processing...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageCategories