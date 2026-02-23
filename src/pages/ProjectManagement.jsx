// src/pages/ProjectManagement.jsx
import { useState } from 'react'
import {
  Building2, Plus, Edit, Trash2, Search, X,
  Download, CheckCircle, XCircle, MapPin,
  Home, Layers, TrendingUp, Eye,
} from 'lucide-react'
import ProjectWingsUnits from './project/ProjectWingsUnits'

// ─── STATIC DATA ───────────────────────────────────────────────
const STATIC_PROJECTS = [
  {
    id: 1,
    projectName: 'Green Valley Apartments', developerName: 'Green Builders Ltd',
    reraNumber: 'P51800012345', reraWebsite: 'www.maharera.mahaonline.gov.in',
    projectAddress: 'Survey No. 45, Near MG Road, Pune - 411001',
    projectType: 'Residential', totalArea: '5 Acres',
    totalUnits: 120, launchedUnits: 85, soldUnits: 62,
    expectedCompletion: '2025-12-31', isActive: true, createdAt: '2024-01-10',
  },
  {
    id: 2,
    projectName: 'Skyline Towers', developerName: 'Metro Constructions Pvt Ltd',
    reraNumber: 'P51800098765', reraWebsite: 'www.maharera.mahaonline.gov.in',
    projectAddress: 'Plot No. 12, Baner Road, Pune - 411045',
    projectType: 'Commercial', totalArea: '3.2 Acres',
    totalUnits: 200, launchedUnits: 150, soldUnits: 110,
    expectedCompletion: '2026-06-30', isActive: true, createdAt: '2024-02-15',
  },
  {
    id: 3,
    projectName: 'Palm Grove Villas', developerName: 'Sunshine Realty',
    reraNumber: 'P51800055432', reraWebsite: 'www.maharera.mahaonline.gov.in',
    projectAddress: 'Sector 7, Hinjewadi, Pune - 411057',
    projectType: 'Villa', totalArea: '8 Acres',
    totalUnits: 48, launchedUnits: 48, soldUnits: 40,
    expectedCompletion: '2025-03-31', isActive: false, createdAt: '2023-11-20',
  },
]

const PROJECT_TYPES = ['Residential', 'Commercial', 'Villa', 'Plotted', 'Mixed Use']

const progressPct = (sold, total) => total > 0 ? Math.round((sold / total) * 100) : 0

const typeColor = (type) => {
  const map = {
    Residential: 'bg-blue-50 text-blue-700 border-blue-200',
    Commercial:  'bg-purple-50 text-purple-700 border-purple-200',
    Villa:       'bg-amber-50 text-amber-700 border-amber-200',
    Plotted:     'bg-green-50 text-green-700 border-green-200',
    'Mixed Use': 'bg-pink-50 text-pink-700 border-pink-200',
  }
  return map[type] || 'bg-gray-50 text-gray-700 border-gray-200'
}

// ─── PROJECT MODAL ─────────────────────────────────────────────
const ProjectModal = ({ isOpen, onClose, onSave, project }) => {
  const isEditing = Boolean(project)
  const empty = {
    projectName: '', developerName: '', reraNumber: '', reraWebsite: '',
    projectAddress: '', projectType: 'Residential', totalArea: '',
    totalUnits: '', launchedUnits: '', soldUnits: '',
    expectedCompletion: '', isActive: true,
  }
  const [form, setForm] = useState(project || empty)
  const [syncedId, setSyncedId] = useState(project?.id)

  if (project?.id !== syncedId) { setSyncedId(project?.id); setForm(project || empty) }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...form, totalUnits: Number(form.totalUnits), launchedUnits: Number(form.launchedUnits), soldUnits: Number(form.soldUnits) })
  }

  if (!isOpen) return null

  const Field = ({ label, name, type = 'text', placeholder, required, children }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children || (
        <input type={type} name={name} value={form[name]} onChange={handleChange}
          required={required} placeholder={placeholder}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      )}
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-2xl px-6 py-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center"><Building2 className="h-5 w-5 text-white" /></div>
            <h2 className="text-white font-bold text-lg">{isEditing ? 'Edit Project' : 'Add New Project'}</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2">Project Information</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Project Name" name="projectName" required placeholder="e.g. Green Valley Apartments" />
            <Field label="Developer Name" name="developerName" required placeholder="e.g. Green Builders Ltd" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="RERA Number" name="reraNumber" required placeholder="e.g. P51800012345" />
            <Field label="RERA Website" name="reraWebsite" placeholder="e.g. www.maharera.mahaonline.gov.in" />
          </div>
          <Field label="Project Address" name="projectAddress" required>
            <textarea name="projectAddress" value={form.projectAddress} onChange={handleChange} required rows={2}
              placeholder="Survey No., Street, City - PIN"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Project Type" name="projectType" required>
              <select name="projectType" value={form.projectType} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Total Area" name="totalArea" placeholder="e.g. 5 Acres" />
          </div>
          <div className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2 pt-2">Unit Details</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Total Units" name="totalUnits" type="number" required placeholder="120" />
          </div>
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-700">Active Status</p>
              <p className="text-xs text-gray-400">Project will be visible on listings</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-cyan-600" />
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold hover:opacity-90">
              {isEditing ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ─────────────────────────────────────────────────
const ProjectManagement = () => {
  const [projects, setProjects]             = useState(STATIC_PROJECTS)
  const [searchTerm, setSearchTerm]         = useState('')
  const [statusFilter, setStatusFilter]     = useState('all')
  const [typeFilter, setTypeFilter]         = useState('All')
  const [isModalOpen, setIsModalOpen]       = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [viewingProject, setViewingProject] = useState(null) // ← opens wings/units view

  const getFiltered = () =>
    projects.filter(p => {
      const matchSearch = p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.developerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.reraNumber.toLowerCase().includes(searchTerm.toLowerCase())
      const matchStatus = statusFilter === 'all' ? true : statusFilter === 'active' ? p.isActive : !p.isActive
      const matchType   = typeFilter === 'All' ? true : p.projectType === typeFilter
      return matchSearch && matchStatus && matchType
    })

  const handleAdd  = () => { setEditingProject(null); setIsModalOpen(true) }
  const handleEdit = (project) => { setEditingProject(project); setIsModalOpen(true) }

  const handleSave = (formData) => {
    if (editingProject) {
      setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...p, ...formData } : p))
    } else {
      setProjects(prev => [...prev, { ...formData, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] }])
    }
    setIsModalOpen(false); setEditingProject(null)
  }

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return
    setProjects(prev => prev.filter(p => p.id !== id))
    if (viewingProject?.id === id) setViewingProject(null)
  }

  const handleToggle = (id) =>
    setProjects(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p))

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(projects, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob); const link = document.createElement('a')
    link.href = url; link.download = `projects-${new Date().toISOString().split('T')[0]}.json`
    link.click(); URL.revokeObjectURL(url)
  }

  const stats = {
    total: projects.length, active: projects.filter(p => p.isActive).length,
    inactive: projects.filter(p => !p.isActive).length,
    totalUnits: projects.reduce((s, p) => s + (Number(p.totalUnits) || 0), 0),
    soldUnits:  projects.reduce((s, p) => s + (Number(p.soldUnits)  || 0), 0),
  }

  const filtered = getFiltered()
  const allTypes  = ['All', ...PROJECT_TYPES]

  // ── Wings/Units View ────────────────────────────────────────
  if (viewingProject) {
    return <ProjectWingsUnits project={viewingProject} onBack={() => setViewingProject(null)} />
  }

  return (
    <div className="min-h-screen bg-white p-6 space-y-6">

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-3xl font-bold mb-1">Project Management</h1>
              <p className="text-white/75 text-sm">Track and manage all real estate projects</p>
              <div className="flex flex-wrap items-center gap-5 mt-4">
                <div className="flex items-center gap-2 text-sm"><Building2 className="h-4 w-4" /><span className="font-medium">{stats.total} Projects</span></div>
                <div className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4" /><span className="font-medium">{stats.active} Active</span></div>
                <div className="flex items-center gap-2 text-sm"><Home className="h-4 w-4" /><span className="font-medium">{stats.totalUnits} Total Units</span></div>
                <div className="flex items-center gap-2 text-sm"><TrendingUp className="h-4 w-4" /><span className="font-medium">{stats.soldUnits} Sold</span></div>
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
        </div>
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Projects',  value: stats.total,      color: 'from-blue-600 to-cyan-600',    icon: <Building2 className="h-5 w-5" /> },
          { label: 'Total Units',     value: stats.totalUnits, color: 'from-cyan-500 to-teal-500',    icon: <Home className="h-5 w-5" /> },
          { label: 'Units Sold',      value: stats.soldUnits,  color: 'from-emerald-500 to-green-500',icon: <TrendingUp className="h-5 w-5" /> },
          { label: 'Available Units', value: stats.totalUnits - stats.soldUnits, color: 'from-amber-500 to-orange-500', icon: <Layers className="h-5 w-5" /> },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center text-white flex-shrink-0`}>{icon}</div>
            <div><p className="text-xs text-gray-500 font-medium">{label}</p><p className="text-xl font-bold text-gray-900">{value}</p></div>
          </div>
        ))}
      </div>

      {/* Type Filter Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {allTypes.map(type => (
          <button key={type} onClick={() => setTypeFilter(type)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              typeFilter === type
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-transparent shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
            }`}>
            {type}
            {type !== 'All' && <span className="ml-1.5 text-xs opacity-70">({projects.filter(p => p.projectType === type).length})</span>}
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'all', label: `All (${stats.total})` },
              { key: 'active', label: `Active (${stats.active})` },
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
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-9 py-2 w-72 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['#', 'Project', 'Developer', 'RERA No.', 'Type', 'Units', 'Progress', 'Completion', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((project, idx) => {
                  const id  = project.id
                  const pct = progressPct(project.soldUnits, project.totalUnits)
                  return (
                    <tr key={id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-5 py-4 text-sm text-gray-400 font-medium">{idx + 1}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                            <Building2 className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">{project.projectName}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="h-3 w-3" />{project.projectAddress.split(',').slice(-1)[0]?.trim()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{project.developerName}</td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded">{project.reraNumber}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${typeColor(project.projectType)}`}>
                          {project.projectType}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm font-semibold text-gray-900">{project.soldUnits || 0}<span className="text-gray-400 font-normal">/{project.totalUnits}</span></div>
                        <div className="text-xs text-gray-400">sold/total</div>
                      </td>
                      <td className="px-5 py-4 min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div className="h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-bold text-blue-600 w-9 text-right">{pct}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {project.expectedCompletion ? new Date(project.expectedCompletion).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          project.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${project.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                          {project.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          {/* 👁️ Eye → opens Wings/Units page */}
                          <button onClick={() => setViewingProject(project)} title="Manage Wings & Units"
                            className="p-2 rounded-lg text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleToggle(id)} title={project.isActive ? 'Deactivate' : 'Activate'}
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
        ) : (
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
        )}
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingProject(null) }}
        onSave={handleSave}
        project={editingProject}
      />
    </div>
  )
}

export default ProjectManagement