// src/pages/ManageProperties.jsx
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Building2,
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
  Layers,
  DollarSign,
  Home,
} from 'lucide-react'
import { propertyApi, categoryApi } from '../api/endpoints'

// ─────────────────────────────────────────────
// PROPERTY MODAL
// ─────────────────────────────────────────────
const PropertyModal = ({ isOpen, onClose, onSave, property, categories = [], loading }) => {
  const isEditing = Boolean(property)

  const initialForm = {
    categoryId:   '',
    projectName:  '',
    towerBlock:   '',
    unitNumber:   '',
    floor:        '',
    areaSqFt:     '',
    pricePerSqFt: '',
    isActive:     true,
  }

  const [form, setForm] = useState(
    property
      ? {
          categoryId:   property.categoryId?._id || property.categoryId || '',
          projectName:  property.projectName  || '',
          towerBlock:   property.towerBlock   || '',
          unitNumber:   property.unitNumber   || '',
          floor:        property.floor        ?? '',
          areaSqFt:     property.areaSqFt     ?? '',
          pricePerSqFt: property.pricePerSqFt ?? '',
          isActive:     property.isActive     ?? true,
        }
      : initialForm
  )

  // sync form when property prop changes (open for edit)
  const prevProp = property?._id || property?.id
  const [syncedId, setSyncedId] = useState(prevProp)
  if ((property?._id || property?.id) !== syncedId) {
    setSyncedId(property?._id || property?.id)
    setForm(
      property
        ? {
            categoryId:   property.categoryId?._id || property.categoryId || '',
            projectName:  property.projectName  || '',
            towerBlock:   property.towerBlock   || '',
            unitNumber:   property.unitNumber   || '',
            floor:        property.floor        ?? '',
            areaSqFt:     property.areaSqFt     ?? '',
            pricePerSqFt: property.pricePerSqFt ?? '',
            isActive:     property.isActive     ?? true,
          }
        : initialForm
    )
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...form,
      floor:        Number(form.floor),
      areaSqFt:     Number(form.areaSqFt),
      pricePerSqFt: Number(form.pricePerSqFt),
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-2xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-white font-bold text-lg">
              {isEditing ? 'Edit Property' : 'Add New Property'}
            </h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat._id || cat.id} value={cat._id || cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Project Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="projectName"
              value={form.projectName}
              onChange={handleChange}
              required
              placeholder="e.g. Skyline Towers"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Tower Block + Unit Number */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Tower Block <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="towerBlock"
                value={form.towerBlock}
                onChange={handleChange}
                required
                placeholder="e.g. A"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Unit Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="unitNumber"
                value={form.unitNumber}
                onChange={handleChange}
                required
                placeholder="e.g. A101"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Floor + Area */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Floor <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="floor"
                value={form.floor}
                onChange={handleChange}
                required
                placeholder="e.g. 10"
                min="0"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Area (sq ft) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="areaSqFt"
                value={form.areaSqFt}
                onChange={handleChange}
                required
                placeholder="e.g. 1000"
                min="0"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Price Per Sq Ft */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Price per Sq Ft <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₹</span>
              <input
                type="number"
                name="pricePerSqFt"
                value={form.pricePerSqFt}
                onChange={handleChange}
                required
                placeholder="e.g. 4500"
                min="0"
                className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Total Price Preview */}
          {form.areaSqFt && form.pricePerSqFt && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-blue-700 font-medium">Total Price</span>
              <span className="text-sm font-bold text-blue-800">
                ₹{(Number(form.areaSqFt) * Number(form.pricePerSqFt)).toLocaleString('en-IN')}
              </span>
            </div>
          )}

          {/* Is Active Toggle */}
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-700">Active Status</p>
              <p className="text-xs text-gray-400">Property will be visible on listings</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-cyan-600"></div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isEditing ? 'Update Property' : 'Create Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
const ManageProperties = () => {
  const queryClient = useQueryClient()

  const [searchTerm, setSearchTerm]           = useState('')
  const [statusFilter, setStatusFilter]       = useState('all')
  const [isModalOpen, setIsModalOpen]         = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)

  // ─── FETCH PROPERTIES ────────────────────────────────────
  const {
    data: properties = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['properties'],
    queryFn: propertyApi.getAll,
    select: (response) => {
      if (Array.isArray(response))                         return response
      if (Array.isArray(response.data))                    return response.data
      if (Array.isArray(response.data?.data))              return response.data.data
      if (Array.isArray(response.properties))              return response.properties
      return []
    },
    staleTime: 1000 * 60 * 5,
  })

  // ─── FETCH CATEGORIES (for dropdown) ─────────────────────
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
    select: (response) => {
      if (Array.isArray(response))            return response
      if (Array.isArray(response.data))       return response.data
      if (Array.isArray(response.data?.data)) return response.data.data
      if (Array.isArray(response.categories)) return response.categories
      return []
    },
    staleTime: 1000 * 60 * 10,
  })

  // ─── CREATE ───────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: propertyApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      setIsModalOpen(false)
      setEditingProperty(null)
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to create property')
    },
  })

  // ─── UPDATE ───────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => propertyApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      setIsModalOpen(false)
      setEditingProperty(null)
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to update property')
    },
  })

  // ─── DELETE ───────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: propertyApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to delete property')
    },
  })

  // ─── FILTER ───────────────────────────────────────────────
  const getFilteredProperties = () => {
    let filtered = properties.filter(p =>
      p.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.unitNumber?.toLowerCase().includes(searchTerm.toLowerCase())  ||
      p.towerBlock?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p =>
        statusFilter === 'active' ? p.isActive : !p.isActive
      )
    }
    return filtered
  }

  // ─── HANDLERS ─────────────────────────────────────────────
  const handleAdd = () => {
    setEditingProperty(null)
    setIsModalOpen(true)
  }

  const handleEdit = (property) => {
    setEditingProperty(property)
    setIsModalOpen(true)
  }

  const handleSave = (formData) => {
    if (editingProperty) {
      updateMutation.mutate({ id: editingProperty._id || editingProperty.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return
    deleteMutation.mutate(id)
  }

  const handleToggleStatus = (id) => {
    const property = properties.find(p => (p._id || p.id) === id)
    updateMutation.mutate({
      id,
      data: { ...property, isActive: !property.isActive },
    })
  }

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(properties, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `properties-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Failed to export properties')
    }
  }

  // ─── STATS ────────────────────────────────────────────────
  const stats = {
    total:    properties.length,
    active:   properties.filter(p => p.isActive).length,
    inactive: properties.filter(p => !p.isActive).length,
  }

  const filteredProperties = getFilteredProperties()
  const actionLoading = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  return (
    <div className="min-h-screen bg-white p-6 space-y-6">

      {/* ── Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-3xl font-bold mb-1">Manage Properties</h1>
              <p className="text-white/75 text-sm">View and manage all property listings</p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4" />
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
                onClick={handleAdd}
                disabled={actionLoading}
                className="bg-white text-blue-600 hover:bg-white/90 font-semibold px-5 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
                Add Property
              </button>
            </div>
          </div>
        </div>
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Total Properties',
            value: stats.total,
            icon: <Building2 className="h-5 w-5" />,
            color: 'from-blue-600 to-cyan-600',
          },
          {
            label: 'Total Area (sq ft)',
            value: properties.reduce((s, p) => s + (Number(p.areaSqFt) || 0), 0).toLocaleString('en-IN'),
            icon: <Layers className="h-5 w-5" />,
            color: 'from-cyan-500 to-teal-500',
          },
          {
            label: 'Avg Price / sq ft',
            value: properties.length
              ? `₹${Math.round(properties.reduce((s, p) => s + (Number(p.pricePerSqFt) || 0), 0) / properties.length).toLocaleString('en-IN')}`
              : '₹0',
            icon: <DollarSign className="h-5 w-5" />,
            color: 'from-blue-500 to-indigo-500',
          },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center text-white flex-shrink-0`}>
              {icon}
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Table Card ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">

        {/* Error */}
        {isError && (
          <div className="m-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900 mb-1">Error Loading Properties</h4>
              <p className="text-sm text-red-700">
                {error?.response?.data?.message || error?.message || 'Failed to load properties'}
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
            <p className="text-gray-500 text-sm">Loading properties...</p>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                {[
                  { key: 'all',      label: `All (${stats.total})` },
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

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search project, unit, tower..."
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
            {filteredProperties.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['#', 'Project', 'Tower / Unit', 'Floor', 'Area (sq ft)', 'Price/sq ft', 'Total Price', 'Category', 'Status', 'Actions'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredProperties.map((property, idx) => {
                      const id = property._id || property.id
                      const totalPrice = (Number(property.areaSqFt) || 0) * (Number(property.pricePerSqFt) || 0)
                      const categoryName =
                        property.categoryId?.name ||
                        categories.find(c => (c._id || c.id) === property.categoryId)?.name ||
                        '—'

                      return (
                        <tr key={id} className="hover:bg-blue-50/30 transition-colors group">
                          {/* # */}
                          <td className="px-5 py-4 text-sm text-gray-400 font-medium">{idx + 1}</td>

                          {/* Project Name */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                                <Home className="h-4 w-4 text-white" />
                              </div>
                              <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                                {property.projectName}
                              </span>
                            </div>
                          </td>

                          {/* Tower / Unit */}
                          <td className="px-5 py-4">
                            <div className="text-sm font-medium text-gray-800">{property.towerBlock} – {property.unitNumber}</div>
                          </td>

                          {/* Floor */}
                          <td className="px-5 py-4 text-sm text-gray-600">{property.floor}</td>

                          {/* Area */}
                          <td className="px-5 py-4 text-sm text-gray-600">
                            {Number(property.areaSqFt).toLocaleString('en-IN')}
                          </td>

                          {/* Price per sq ft */}
                          <td className="px-5 py-4 text-sm text-gray-600">
                            ₹{Number(property.pricePerSqFt).toLocaleString('en-IN')}
                          </td>

                          {/* Total Price */}
                          <td className="px-5 py-4">
                            <span className="text-sm font-bold text-blue-700">
                              ₹{totalPrice.toLocaleString('en-IN')}
                            </span>
                          </td>

                          {/* Category */}
                          <td className="px-5 py-4">
                            <span className="inline-block bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
                              {categoryName}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              property.isActive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-gray-100 text-gray-600 border-gray-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${property.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                              {property.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleToggleStatus(id)}
                                disabled={actionLoading}
                                title={property.isActive ? 'Deactivate' : 'Activate'}
                                className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {property.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                              </button>
                              <button
                                onClick={() => handleEdit(property)}
                                disabled={actionLoading}
                                className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(id)}
                                disabled={actionLoading}
                                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                  <p className="text-xs text-gray-400">
                    Showing <span className="font-medium text-gray-600">{filteredProperties.length}</span> of{' '}
                    <span className="font-medium text-gray-600">{properties.length}</span> properties
                  </p>
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-20">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">No properties found</h3>
                <p className="text-sm text-gray-500 mb-5">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by adding your first property.'}
                </p>
                <button
                  onClick={handleAdd}
                  disabled={actionLoading}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                  Add Property
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modal ── */}
      <PropertyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingProperty(null)
        }}
        onSave={handleSave}
        property={editingProperty}
        categories={categories}
        loading={actionLoading}
      />

      {/* ── Loading Overlay ── */}
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

export default ManageProperties