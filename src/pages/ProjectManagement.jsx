// src/pages/ProjectManagement.jsx
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectApi, categoryApi, subCategoryApi } from '../api/endpoints'
import {
  Building2, Plus, Edit, Trash2, Search, X,
  Download, CheckCircle, XCircle, Eye, Loader2,
} from 'lucide-react'
import ProjectWingsUnits from './project/ProjectWingsUnits'

// ─── PROJECT MODAL ─────────────────────────────────────────────
const ProjectModal = ({ isOpen, onClose, onSave, project, categories, subcategories, loading }) => {
  const isEditing = Boolean(project)

  const getEmptyForm = () => ({
    name:           '',
    description:    '',
    categoryId:     '',
    subCategoryId:  '',
    developer:      '',
    reraNo:         '',
    completionDate: '',
    isActive:       true,
  })

  const [form, setForm] = useState(getEmptyForm)

  useEffect(() => {
    setForm(project
      ? {
          name:           project.name           || '',
          description:    project.description    || '',
          categoryId:     project.categoryId     || '',
          subCategoryId:  project.subCategoryId  || '',
          developer:      project.developer      || '',
          reraNo:         project.reraNo         || '',
          completionDate: project.completionDate ? project.completionDate.split('T')[0] : '',
          isActive:       project.isActive       ?? true,
        }
      : getEmptyForm()
    )
  }, [project, isOpen])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  // When category changes → reset subcategory
  const handleCategoryChange = (e) => {
    setForm(prev => ({ ...prev, categoryId: e.target.value, subCategoryId: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return alert('Project name is required')
    onSave(form)
  }

  if (!isOpen) return null

  // Filter subcategories based on selected category
  const filteredSubs = subcategories.filter(s =>
    s.categoryId === form.categoryId ||
    s.category?._id === form.categoryId ||
    s.category?.id  === form.categoryId
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-2xl px-6 py-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-white font-bold text-lg">
              {isEditing ? 'Edit Project' : 'Add New Project'}
            </h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* ── Project Info ── */}
          <div className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2">
            Project Information
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required
                placeholder="e.g. Green Valley Apartments"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Developer Name <span className="text-red-500">*</span>
              </label>
              <input type="text" name="developer" value={form.developer} onChange={handleChange} required
                placeholder="e.g. Navneet Builders Ltd"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2}
              placeholder="Luxury project with modern amenities..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* ── Category & Subcategory ── */}
          <div className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2 pt-1">
            Property Type
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Category <span className="text-red-500">*</span>
              </label>
              <select name="categoryId" value={form.categoryId} onChange={handleCategoryChange} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Subcategory — filtered by selected category */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Sub-Category
                {filteredSubs.length === 0 && form.categoryId && (
                  <span className="text-gray-400 font-normal ml-1 text-xs normal-case">(none available)</span>
                )}
              </label>
              <select name="subCategoryId" value={form.subCategoryId} onChange={handleChange}
                disabled={!form.categoryId || filteredSubs.length === 0}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="">
                  {!form.categoryId ? 'Select category first' : filteredSubs.length === 0 ? 'No sub-categories' : 'Select Sub-Category'}
                </option>
                {filteredSubs.map(sub => (
                  <option key={sub._id || sub.id} value={sub._id || sub.id}>{sub.name}</option>
                ))}
              </select>

              {/* Show selected subcategory badge */}
              {form.subCategoryId && filteredSubs.length > 0 && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="text-xs text-cyan-700 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-full font-semibold">
                    ✓ {filteredSubs.find(s => (s._id || s.id) === form.subCategoryId)?.name}
                  </span>
                  <button type="button" onClick={() => setForm(p => ({ ...p, subCategoryId: '' }))}
                    className="text-gray-400 hover:text-red-500 text-xs">×</button>
                </div>
              )}
            </div>
          </div>

          {/* ── RERA & Completion ── */}
          <div className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2 pt-1">
            Regulatory Details
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                RERA Number <span className="text-red-500">*</span>
              </label>
              <input type="text" name="reraNo" value={form.reraNo} onChange={handleChange} required
                placeholder="e.g. P5180001234598"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Completion Date
              </label>
              <input type="date" name="completionDate" value={form.completionDate} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* ── Active Toggle ── */}
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-700">Active Status</p>
              <p className="text-xs text-gray-400">Project will be visible on listings</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-cyan-600" />
            </label>
          </div>

          {/* ── Submit ── */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ──────────────────────────────────────────────────
const ProjectManagement = () => {
  const queryClient = useQueryClient()

  const [searchTerm, setSearchTerm]         = useState('')
  const [statusFilter, setStatusFilter]     = useState('all')
  const [isModalOpen, setIsModalOpen]       = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [viewingProject, setViewingProject] = useState(null)

  // ── Fetch Projects ──
  const {
    data: projects = [],
    isLoading,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: projectApi.getAll,
    select: (res) => {
      const d = res?.data || res
      if (Array.isArray(d))           return d
      if (Array.isArray(d?.data))     return d.data
      if (Array.isArray(d?.projects)) return d.projects
      return []
    },
  })

  // ── Fetch Categories ──
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
    select: (res) => {
      const d = res?.data || res
      if (Array.isArray(d))             return d
      if (Array.isArray(d?.data))       return d.data
      if (Array.isArray(d?.categories)) return d.categories
      return []
    },
  })

  // ── Fetch All Subcategories from subCategories/getAll ──
  const { data: subcategories = [] } = useQuery({
    queryKey: ['subcategories'],
    queryFn: subCategoryApi.getAll,
    select: (res) => {
      const d = res?.data || res
      if (Array.isArray(d))                  return d
      if (Array.isArray(d?.data))            return d.data
      if (Array.isArray(d?.subcategories))   return d.subcategories
      return []
    },
  })

  // ── Mutations ──
  const createMutation = useMutation({
    mutationFn: projectApi.create,
    onSuccess:  () => { queryClient.invalidateQueries({ queryKey: ['projects'] }); setIsModalOpen(false); setEditingProject(null) },
    onError:    (err) => alert(err.response?.data?.message || 'Failed to create project'),
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => projectApi.update(id, data),
    onSuccess:  () => { queryClient.invalidateQueries({ queryKey: ['projects'] }); setIsModalOpen(false); setEditingProject(null) },
    onError:    (err) => alert(err.response?.data?.message || 'Failed to update project'),
  })
  const deleteMutation = useMutation({
    mutationFn: projectApi.remove,
    onSuccess:  () => { queryClient.invalidateQueries({ queryKey: ['projects'] }); if (viewingProject) setViewingProject(null) },
    onError:    (err) => alert(err.response?.data?.message || 'Failed to delete project'),
  })

  // ── Handlers ──
  const handleAdd    = ()        => { setEditingProject(null); setIsModalOpen(true) }
  const handleEdit   = (project) => { setEditingProject(project); setIsModalOpen(true) }
  const handleSave   = (form)    => {
    if (editingProject) updateMutation.mutate({ id: editingProject._id || editingProject.id, data: form })
    else                createMutation.mutate(form)
  }
  const handleDelete = (id) => { if (!window.confirm('Delete this project?')) return; deleteMutation.mutate(id) }
  const handleToggle = (project) => updateMutation.mutate({ id: project._id || project.id, data: { ...project, isActive: !project.isActive } })

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(projects, null, 2)], { type: 'application/json' })
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `projects-${new Date().toISOString().split('T')[0]}.json` })
    a.click()
  }

  // ── Filters ──
  const filtered = projects.filter(p => {
    const ms = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               p.developer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               p.reraNo?.toLowerCase().includes(searchTerm.toLowerCase())
    const mf = statusFilter === 'all' ? true : statusFilter === 'active' ? p.isActive : !p.isActive
    return ms && mf
  })

  const stats = {
    total:    projects.length,
    active:   projects.filter(p => p.isActive).length,
    inactive: projects.filter(p => !p.isActive).length,
  }

  const actionLoading = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  // Helper: get names for table
  const getCatName = (project) =>
    categories.find(c => (c._id || c.id) === project.categoryId)?.name || '—'

  const getSubName = (project) =>
    subcategories.find(s => (s._id || s.id) === project.subCategoryId)?.name || null

  // ── Wings/Units View ──
  if (viewingProject) {
    return <ProjectWingsUnits project={viewingProject} onBack={() => setViewingProject(null)} />
  }

  return (
    <div className="min-h-screen bg-white p-6 space-y-6">

      {/* ── HEADER ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl font-bold mb-1">Project Management</h1>
            <p className="text-white/75 text-sm">Track and manage all real estate projects</p>
            <div className="flex flex-wrap items-center gap-5 mt-4">
              <span className="flex items-center gap-2 text-sm"><Building2 className="h-4 w-4" /><b>{stats.total}</b> Projects</span>
              <span className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4" /><b>{stats.active}</b> Active</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleExport}
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
              <Download className="h-4 w-4" /> Export
            </button>
            <button onClick={handleAdd}
              className="bg-white text-blue-600 hover:bg-white/90 font-semibold px-5 py-2 rounded-lg text-sm flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Project
            </button>
          </div>
        </div>
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Total Projects',    value: stats.total,    color: 'from-blue-600 to-cyan-600',    icon: <Building2 className="h-5 w-5" /> },
          { label: 'Active Projects',   value: stats.active,   color: 'from-emerald-500 to-green-500',icon: <CheckCircle className="h-5 w-5" /> },
          { label: 'Inactive Projects', value: stats.inactive, color: 'from-gray-500 to-gray-600',    icon: <XCircle className="h-5 w-5" /> },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center text-white flex-shrink-0`}>{icon}</div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── TABLE CARD ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'all',      label: `All (${stats.total})` },
              { key: 'active',   label: `Active (${stats.active})` },
              { key: 'inactive', label: `Inactive (${stats.inactive})` },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setStatusFilter(key)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  statusFilter === key
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}>
                {label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search project, developer, RERA..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-9 py-2 w-72 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 text-sm">Loading projects...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-20">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">No projects found</h3>
            <p className="text-sm text-gray-500 mb-5">Try adjusting your search or filters.</p>
            <button onClick={handleAdd}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Project
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['#', 'Project', 'Developer', 'RERA No.', 'Category', 'Sub-Category', 'Completion', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((project, idx) => {
                  const id     = project._id || project.id
                  const catName = getCatName(project)
                  const subName = getSubName(project)

                  return (
                    <tr key={id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-5 py-4 text-sm text-gray-400">{idx + 1}</td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                            <Building2 className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">{project.name}</p>
                            <p className="text-xs text-gray-400">{project.description || 'No description'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{project.developer || '—'}</td>

                      <td className="px-5 py-4">
                        <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded">{project.reraNo || '—'}</span>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        {catName !== '—' ? (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            {catName}
                          </span>
                        ) : <span className="text-xs text-gray-400">—</span>}
                      </td>

                      {/* Sub-Category — NEW ✅ */}
                      <td className="px-5 py-4">
                        {subName ? (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                            {subName}
                          </span>
                        ) : <span className="text-xs text-gray-400">—</span>}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {project.completionDate
                          ? new Date(project.completionDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                          : '—'}
                      </td>

                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          project.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${project.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                          {project.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setViewingProject(project)} title="Manage Wings & Units"
                            className="p-2 rounded-lg text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleToggle(project)} title={project.isActive ? 'Deactivate' : 'Activate'}
                            className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                            {project.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </button>
                          <button onClick={() => handleEdit(project)}
                            className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(id)}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Showing <span className="font-medium text-gray-600">{filtered.length}</span> of{' '}
                <span className="font-medium text-gray-600">{projects.length}</span> projects
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Eye className="h-3 w-3" /> Eye icon → Manage Wings &amp; Units
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── MODAL ── */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingProject(null) }}
        onSave={handleSave}
        project={editingProject}
        categories={categories}
        subcategories={subcategories}
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

export default ProjectManagement