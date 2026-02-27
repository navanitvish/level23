// src/pages/ManageCategories.jsx
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Tag, Plus, Edit, Trash2, Search, X, Download,
  CheckCircle, XCircle, Loader2, AlertCircle, ChevronDown, ChevronRight,
} from 'lucide-react'
import { categoryApi, subCategoryApi } from '../../api/endpoints'

// ─── MOCK DATA (fallback when API empty) ───────────────────────
const MOCK_CATEGORIES = [
  { _id: 'cat_1', name: 'Residential',  description: 'Homes, apartments and villas', image: null, isActive: true },
  { _id: 'cat_2', name: 'Commercial',   description: 'Shops, offices and showrooms',  image: null, isActive: true },
  { _id: 'cat_3', name: 'Industrial',   description: 'Warehouses and factories',       image: null, isActive: false },
  { _id: 'cat_4', name: 'Plotted',      description: 'Residential and NA plots',       image: null, isActive: true },
]

const MOCK_SUBCATEGORIES = [
  { _id: 'sub_1', categoryId: 'cat_1', category: { name: 'Residential' }, name: '1BHK Apartment', description: '1 Bedroom unit',     image: null, isActive: true },
  { _id: 'sub_2', categoryId: 'cat_1', category: { name: 'Residential' }, name: '2BHK Apartment', description: '2 Bedroom unit',     image: null, isActive: true },
  { _id: 'sub_3', categoryId: 'cat_1', category: { name: 'Residential' }, name: 'Villa',           description: 'Independent house', image: null, isActive: true },
  { _id: 'sub_4', categoryId: 'cat_2', category: { name: 'Commercial' },  name: 'Retail Shop',     description: 'Ground floor shop', image: null, isActive: true },
  { _id: 'sub_5', categoryId: 'cat_2', category: { name: 'Commercial' },  name: 'Office Space',    description: 'Corporate office',  image: null, isActive: false },
  { _id: 'sub_6', categoryId: 'cat_4', category: { name: 'Plotted' },     name: 'NA Plot',         description: 'Non-agricultural',  image: null, isActive: true },
]

// ─── MODAL ─────────────────────────────────────────────────────
const CategorySubcategoryModal = ({ isOpen, onClose, onSave, item, type, categories, loading }) => {
  const isEditing     = Boolean(item)
  const isSubcategory = type === 'Subcategory'

  const getEmpty = () => ({ name: '', description: '', image: null, imagePreview: null, isActive: true, categoryId: '' })
  const [form, setForm] = useState(getEmpty)

  useEffect(() => {
    setForm(item
      ? {
          name:         item.name        || '',
          description:  item.description || '',
          image:        item.image       || null,
          imagePreview: item.image       || null,
          isActive:     item.isActive    ?? true,
          categoryId:   item.categoryId  || item.category?._id || '',
        }
      : getEmpty()
    )
  }, [item, isOpen])

  const handleChange = (e) => {
    const { name, value, type: t, checked } = e.target
    setForm(p => ({ ...p, [name]: t === 'checkbox' ? checked : value }))
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setForm(p => ({ ...p, image: reader.result, imagePreview: reader.result }))
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return alert(`${type} name is required`)
    if (isSubcategory && !form.categoryId) return alert('Please select a parent category')
    onSave(form)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-2xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
              <Tag className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-white font-bold text-lg">{isEditing ? `Edit ${type}` : `Add ${type}`}</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Parent Category dropdown — only for Subcategory */}
          {isSubcategory && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Parent Category <span className="text-red-500">*</span>
              </label>
              <select name="categoryId" value={form.categoryId} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              {type} Name <span className="text-red-500">*</span>
            </label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required
              placeholder={`e.g. ${isSubcategory ? '2BHK Apartment' : 'Residential'}`}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2}
              placeholder="Optional description..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center hover:border-blue-500 transition-colors cursor-pointer relative">
              <input type="file" accept="image/*" onChange={handleImage} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              {form.imagePreview ? (
                <div className="relative inline-block">
                  <img src={form.imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg mx-auto" />
                  <button type="button" onClick={(e) => { e.stopPropagation(); setForm(p => ({ ...p, image: null, imagePreview: null })) }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600">×</button>
                </div>
              ) : (
                <>
                  <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-500">Click to upload image</p>
                </>
              )}
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-700">Active</p>
              <p className="text-xs text-gray-400">{type} will be visible</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-cyan-600" />
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? 'Update' : 'Create'} {type}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── STATUS BADGE ──────────────────────────────────────────────
const StatusBadge = ({ active }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
    active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'
  }`}>
    <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
    {active ? 'Active' : 'Inactive'}
  </span>
)

// ─── MAIN COMPONENT ────────────────────────────────────────────
export default function ManageCategories() {
  const queryClient = useQueryClient()

  const [activeTab, setActiveTab]               = useState('categories') // 'categories' | 'subcategories'
  const [searchTerm, setSearchTerm]             = useState('')
  const [statusFilter, setStatusFilter]         = useState('all')
  const [catFilter, setCatFilter]               = useState('All')   // for subcategory tab
  const [expandedCategories, setExpandedCategories] = useState({})

  const [isModalOpen, setIsModalOpen]           = useState(false)
  const [editingItem, setEditingItem]           = useState(null)
  const [modalType, setModalType]               = useState('Category')
  const [preselectedCatId, setPreselectedCatId] = useState(null)

  // ── Fetch Categories ──
  const {
    data: categories = [],
    isLoading: catLoading,
    isError: catError,
    refetch: refetchCat,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const res  = await categoryApi.getAll()
        const data = res?.data || res
        const arr  = Array.isArray(data) ? data : (data.data || data.categories || [])
        return arr.length > 0 ? arr : MOCK_CATEGORIES
      } catch { return MOCK_CATEGORIES }
    },
  })

  // ── Fetch All Subcategories from getAll ──
  const {
    data: allSubcategories = [],
    isLoading: subLoading,
    isError: subError,
    refetch: refetchSub,
  } = useQuery({
    queryKey: ['subcategories'],
    queryFn: async () => {
      try {
        const res  = await subCategoryApi.getAll()
        const data = res?.data || res
        const arr  = Array.isArray(data) ? data : (data.data || data.subcategories || [])
        return arr.length > 0 ? arr : MOCK_SUBCATEGORIES
      } catch { return MOCK_SUBCATEGORIES }
    },
  })

  // ── Mutations ──
  const createCat = useMutation({
    mutationFn: categoryApi.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); closeModal() },
    onError: (err) => alert(err.response?.data?.message || 'Failed to create'),
  })
  const updateCat = useMutation({
    mutationFn: ({ id, data }) => categoryApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); closeModal() },
    onError: (err) => alert(err.response?.data?.message || 'Failed to update'),
  })
  const deleteCat = useMutation({
    mutationFn: categoryApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    onError: (err) => alert(err.response?.data?.message || 'Failed to delete'),
  })

  const createSub = useMutation({
    mutationFn: ({ categoryId, data }) => subCategoryApi.create(categoryId, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['subcategories'] }); queryClient.invalidateQueries({ queryKey: ['categories'] }); closeModal() },
    onError: (err) => alert(err.response?.data?.message || 'Failed to create subcategory'),
  })
  const updateSub = useMutation({
    mutationFn: ({ id, data }) => subCategoryApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['subcategories'] }); closeModal() },
    onError: (err) => alert(err.response?.data?.message || 'Failed to update subcategory'),
  })
  const deleteSub = useMutation({
    mutationFn: subCategoryApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subcategories'] }),
    onError: (err) => alert(err.response?.data?.message || 'Failed to delete subcategory'),
  })

  const actionLoading = createCat.isPending || updateCat.isPending || deleteCat.isPending ||
                        createSub.isPending || updateSub.isPending || deleteSub.isPending

  // ── Handlers ──
  const openAddCategory    = ()      => { setModalType('Category');    setEditingItem(null); setPreselectedCatId(null); setIsModalOpen(true) }
  const openAddSubcategory = (catId) => { setModalType('Subcategory'); setEditingItem(null); setPreselectedCatId(catId); setIsModalOpen(true) }
  const openEditCategory   = (cat)   => { setModalType('Category');    setEditingItem(cat);  setIsModalOpen(true) }
  const openEditSub        = (sub)   => { setModalType('Subcategory'); setEditingItem(sub);  setIsModalOpen(true) }
  const closeModal         = ()      => { setIsModalOpen(false); setEditingItem(null); setPreselectedCatId(null) }

  const handleSave = (formData) => {
    const payload = { name: formData.name, description: formData.description, image: formData.image, isActive: formData.isActive }
    if (modalType === 'Category') {
      editingItem ? updateCat.mutate({ id: editingItem._id || editingItem.id, data: payload }) : createCat.mutate(payload)
    } else {
      const catId = formData.categoryId || preselectedCatId
      editingItem ? updateSub.mutate({ id: editingItem._id || editingItem.id, data: { ...payload, categoryId: catId } }) : createSub.mutate({ categoryId: catId, data: payload })
    }
  }

  const toggleCatStatus = (cat) => updateCat.mutate({ id: cat._id || cat.id, data: { name: cat.name, description: cat.description, image: cat.image, isActive: !cat.isActive } })
  const toggleSubStatus = (sub) => updateSub.mutate({ id: sub._id || sub.id, data: { name: sub.name, description: sub.description, image: sub.image, isActive: !sub.isActive } })
  const deleteCategory  = (id)  => { if (window.confirm('Delete category and all subcategories?')) deleteCat.mutate(id) }
  const deleteSubcat    = (id)  => { if (window.confirm('Delete subcategory?')) deleteSub.mutate(id) }
  const toggleExpand    = (id)  => setExpandedCategories(p => ({ ...p, [id]: !p[id] }))

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ categories, subcategories: allSubcategories }, null, 2)], { type: 'application/json' })
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `categories-${new Date().toISOString().split('T')[0]}.json` })
    a.click()
  }

  // ── Stats ──
  const catStats = {
    total: categories.length,
    active: categories.filter(c => c.isActive).length,
    inactive: categories.filter(c => !c.isActive).length,
  }
  const subStats = {
    total: allSubcategories.length,
    active: allSubcategories.filter(s => s.isActive).length,
    inactive: allSubcategories.filter(s => !s.isActive).length,
  }

  // ── Filtered data ──
  const filteredCategories = categories.filter(c => {
    const ms = c.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const mf = statusFilter === 'all' ? true : statusFilter === 'active' ? c.isActive : !c.isActive
    return ms && mf
  })

  const uniqueCats = ['All', ...new Set(allSubcategories.map(s => s.category?.name || s.categoryId).filter(Boolean))]

  const filteredSubs = allSubcategories.filter(s => {
    const ms = s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const mf = statusFilter === 'all' ? true : statusFilter === 'active' ? s.isActive : !s.isActive
    const mc = catFilter === 'All' ? true : (s.category?.name === catFilter || s.categoryId === catFilter)
    return ms && mf && mc
  })

  // Attach subcategories to each category for nested view
  const getCategorySubs = (catId) => allSubcategories.filter(s =>
    s.categoryId === catId || s.category?._id === catId || s.category?.id === catId
  )

  const isLoading = catLoading || subLoading

  return (
    <div className="min-h-screen bg-white p-6 space-y-6">

      {/* ── HEADER ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Property Types</h1>
            <p className="text-white/75 text-sm">Manage categories and subcategories</p>
            <div className="flex items-center gap-6 mt-4 text-sm">
              <span className="flex items-center gap-2"><Tag className="h-4 w-4" /><b>{catStats.total}</b> Categories</span>
              <span className="flex items-center gap-2"><Tag className="h-4 w-4 opacity-70" /><b>{subStats.total}</b> Subcategories</span>
              <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4" /><b>{catStats.active + subStats.active}</b> Active</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleExport}
              className="bg-white/20 border border-white/30 text-white hover:bg-white/30 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
              <Download className="h-4 w-4" /> Export
            </button>
            <button onClick={() => { if (activeTab === 'categories') openAddCategory(); else openAddSubcategory(null) }} disabled={actionLoading}
              className="bg-white text-blue-600 font-semibold px-5 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50">
              <Plus className="h-4 w-4" /> Add {activeTab === 'categories' ? 'Category' : 'Subcategory'}
            </button>
          </div>
        </div>
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Categories',   value: catStats.total,   color: 'from-blue-600 to-cyan-600' },
          { label: 'Active Categories',  value: catStats.active,  color: 'from-emerald-500 to-green-500' },
          { label: 'Total Subcategories',value: subStats.total,   color: 'from-purple-500 to-violet-500' },
          { label: 'Active Subcategories',value: subStats.active, color: 'from-amber-500 to-orange-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center flex-shrink-0`}>
              <Tag className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── MAIN CARD ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">

        {/* Tabs */}
        <div className="flex items-center gap-1 p-4 border-b border-gray-100">
          {[
            { key: 'categories',    label: `Categories (${catStats.total})` },
            { key: 'subcategories', label: `Subcategories (${subStats.total})` },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => { setActiveTab(key); setSearchTerm(''); setStatusFilter('all') }}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === key
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* Error */}
        {(catError || subError) && (
          <div className="m-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900">Error Loading Data</p>
              <button onClick={() => { refetchCat(); refetchSub() }} className="mt-1 text-sm font-medium text-red-600 underline">Try Again</button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 text-sm">Loading...</p>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="text" placeholder={`Search ${activeTab}...`}
                    value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    className="pl-9 pr-9 py-2 w-60 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Status filter */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  {[
                    { key: 'all',      label: 'All' },
                    { key: 'active',   label: 'Active' },
                    { key: 'inactive', label: 'Inactive' },
                  ].map(({ key, label }) => (
                    <button key={key} onClick={() => setStatusFilter(key)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        statusFilter === key
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>

                {/* Category filter chips — only in subcategories tab */}
                {activeTab === 'subcategories' && (
                  <div className="flex items-center gap-1 flex-wrap">
                    {uniqueCats.map(cat => (
                      <button key={cat} onClick={() => setCatFilter(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                          catFilter === cat
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-transparent'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                        }`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={() => { if (activeTab === 'categories') openAddCategory(); else openAddSubcategory(null) }} disabled={actionLoading}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:opacity-90 disabled:opacity-50 self-start">
                <Plus className="h-4 w-4" /> Add {activeTab === 'categories' ? 'Category' : 'Subcategory'}
              </button>
            </div>

            {/* ── CATEGORIES TABLE ── */}
            {activeTab === 'categories' && (
              filteredCategories.length === 0 ? (
                <div className="text-center py-16">
                  <Tag className="h-12 w-12 text-blue-600 mx-auto mb-4 opacity-20" />
                  <h3 className="font-semibold text-gray-900 mb-1">No categories found</h3>
                  <button onClick={openAddCategory} className="mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 inline-flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Category
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 w-8">#</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Category</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Description</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Subcategories</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCategories.map((cat, idx) => {
                        const catId   = cat._id || cat.id
                        const subs    = getCategorySubs(catId)
                        const isExpanded = expandedCategories[catId]

                        return (
                          <>
                            <tr key={catId} className="hover:bg-blue-50/30 transition-colors border-b border-gray-50">
                              <td className="px-5 py-4 text-sm text-gray-400">{idx + 1}</td>

                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  {/* Expand toggle */}
                                  {subs.length > 0 ? (
                                    <button onClick={() => toggleExpand(catId)} className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-700 flex-shrink-0">
                                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                    </button>
                                  ) : (
                                    <div className="w-6 flex-shrink-0" />
                                  )}
                                  {/* Image */}
                                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                    {cat.image
                                      ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                      : <span className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-400">{cat.name?.charAt(0)}</span>}
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-900">{cat.name}</p>
                                    <p className="text-xs text-gray-400 font-mono">{catId?.toString().slice(-6)}</p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-5 py-4 text-sm text-gray-500 max-w-xs truncate">{cat.description || '—'}</td>

                              <td className="px-5 py-4">
                                {subs.length > 0 ? (
                                  <span className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                                    {subs.length} sub{subs.length > 1 ? 's' : ''}
                                  </span>
                                ) : (
                                  <span className="text-xs text-gray-400">—</span>
                                )}
                              </td>

                              <td className="px-5 py-4"><StatusBadge active={cat.isActive} /></td>

                              <td className="px-5 py-4">
                                <div className="flex items-center gap-1">
                                  <button onClick={() => openAddSubcategory(catId)} disabled={actionLoading}
                                    title="Add Subcategory"
                                    className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50">
                                    <Plus className="h-4 w-4" />
                                  </button>
                                  <button onClick={() => toggleCatStatus(cat)} disabled={actionLoading}
                                    title={cat.isActive ? 'Deactivate' : 'Activate'}
                                    className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50">
                                    {cat.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                  </button>
                                  <button onClick={() => openEditCategory(cat)} disabled={actionLoading}
                                    className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-50">
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button onClick={() => deleteCategory(catId)} disabled={actionLoading}
                                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {/* Expanded subcategory rows */}
                            {isExpanded && subs.map(sub => {
                              const subId = sub._id || sub.id
                              return (
                                <tr key={subId} className="bg-blue-50/20 hover:bg-blue-50/40 transition-colors border-b border-gray-50">
                                  <td className="px-5 py-3" />
                                  <td className="px-5 py-3">
                                    <div className="flex items-center gap-3 pl-8">
                                      <div className="w-7 h-7 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                        {sub.image
                                          ? <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" />
                                          : <span className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">{sub.name?.charAt(0)}</span>}
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-800">{sub.name}</p>
                                        <p className="text-xs text-gray-400 font-mono">{subId?.toString().slice(-6)}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-5 py-3 text-xs text-gray-500">{sub.description || '—'}</td>
                                  <td className="px-5 py-3">
                                    <span className="text-xs text-cyan-600 font-semibold bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                                      Sub
                                    </span>
                                  </td>
                                  <td className="px-5 py-3"><StatusBadge active={sub.isActive} /></td>
                                  <td className="px-5 py-3">
                                    <div className="flex items-center gap-1">
                                      <button onClick={() => toggleSubStatus(sub)} disabled={actionLoading}
                                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-50">
                                        {sub.isActive ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle className="h-3.5 w-3.5" />}
                                      </button>
                                      <button onClick={() => openEditSub(sub)} disabled={actionLoading}
                                        className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 disabled:opacity-50">
                                        <Edit className="h-3.5 w-3.5" />
                                      </button>
                                      <button onClick={() => deleteSubcat(subId)} disabled={actionLoading}
                                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50">
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              )
                            })}
                          </>
                        )
                      })}
                    </tbody>
                  </table>

                  <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      Showing <span className="font-medium text-gray-600">{filteredCategories.length}</span> of{' '}
                      <span className="font-medium text-gray-600">{categories.length}</span> categories
                    </p>
                    <p className="text-xs text-gray-400">💡 Click <ChevronRight className="h-3 w-3 inline" /> to expand subcategories</p>
                  </div>
                </div>
              )
            )}

            {/* ── SUBCATEGORIES TABLE ── */}
            {activeTab === 'subcategories' && (
              filteredSubs.length === 0 ? (
                <div className="text-center py-16">
                  <Tag className="h-12 w-12 text-blue-600 mx-auto mb-4 opacity-20" />
                  <h3 className="font-semibold text-gray-900 mb-1">No subcategories found</h3>
                  <button onClick={() => openAddSubcategory(null)}
                    className="mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 inline-flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Subcategory
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">#</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Subcategory</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Parent Category</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Description</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredSubs.map((sub, idx) => {
                        const subId  = sub._id || sub.id
                        const catName = sub.category?.name ||
                          categories.find(c => (c._id || c.id) === sub.categoryId)?.name || '—'

                        return (
                          <tr key={subId} className="hover:bg-blue-50/30 transition-colors">
                            <td className="px-5 py-4 text-sm text-gray-400">{idx + 1}</td>

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                  {sub.image
                                    ? <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" />
                                    : <span className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-400">{sub.name?.charAt(0)}</span>}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">{sub.name}</p>
                                  <p className="text-xs text-gray-400 font-mono">{subId?.toString().slice(-6)}</p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <span className="inline-block bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                                {catName}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-sm text-gray-500 max-w-xs truncate">{sub.description || '—'}</td>

                            <td className="px-5 py-4"><StatusBadge active={sub.isActive} /></td>

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1">
                                <button onClick={() => toggleSubStatus(sub)} disabled={actionLoading}
                                  title={sub.isActive ? 'Deactivate' : 'Activate'}
                                  className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-50">
                                  {sub.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                </button>
                                <button onClick={() => openEditSub(sub)} disabled={actionLoading}
                                  className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 disabled:opacity-50">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button onClick={() => deleteSubcat(subId)} disabled={actionLoading}
                                  className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>

                  <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                    <p className="text-xs text-gray-400">
                      Showing <span className="font-medium text-gray-600">{filteredSubs.length}</span> of{' '}
                      <span className="font-medium text-gray-600">{allSubcategories.length}</span> subcategories
                    </p>
                  </div>
                </div>
              )
            )}
          </>
        )}
      </div>

      {/* ── MODAL ── */}
      <CategorySubcategoryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        item={editingItem}
        type={modalType}
        categories={categories}
        loading={actionLoading}
      />

      {/* ── LOADING OVERLAY ── */}
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