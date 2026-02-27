// src/pages/ReraDetails.jsx
import React, { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Building2, FileText, ShieldCheck, BookOpen, Scroll,
  Plus, Pencil, Trash2, X, ChevronDown, Paperclip,
  ExternalLink, Loader2, FolderOpen, Hash, AlignLeft,
  Tag, Upload, Calendar, Users, TrendingUp
} from 'lucide-react'
import { reraApi, projectApi } from '../api/endpoints'

// ─── HELPERS ──────────────────────────────────────────────────
const toArr = (res) => {
  if (Array.isArray(res))             return res
  if (Array.isArray(res?.data))       return res.data
  if (Array.isArray(res?.data?.data)) return res.data.data
  return []
}

const buildFD = (obj, file) => {
  const fd = new FormData()
  Object.entries(obj).forEach(([k, v]) => { if (v !== undefined && v !== '') fd.append(k, v) })
  if (file) fd.append('file', file)
  return fd
}

// ─── TYPES ────────────────────────────────────────────────────
const TYPES = [
  { value: 'rera',       label: 'RERA',        Icon: FileText,    color: 'blue'    },
  { value: 'permission', label: 'Permission',  Icon: ShieldCheck, color: 'emerald' },
  { value: 'brochure',   label: 'Brochure',    Icon: BookOpen,    color: 'amber'   },
  { value: 'terms',      label: 'Terms',       Icon: Scroll,      color: 'violet'  },
]

const COLOR = {
  blue:    { bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-200',    badge: 'bg-blue-100 text-blue-700',    dot: 'bg-blue-500'    },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  amber:   { bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-200',   badge: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-500'   },
  violet:  { bg: 'bg-violet-50',  text: 'text-violet-600',  border: 'border-violet-200',  badge: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500'  },
}

// ─── FIELD WRAPPER ─────────────────────────────────────────────
const F = ({ label, required, children, hint, icon: Icon }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}{required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400">{hint}</p>}
  </div>
)

const inputCls = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-300"
const taCls    = `${inputCls} resize-none`

// ─── MODAL ─────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, Icon, onSubmit, loading, submitLabel, children }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-sm">
              {Icon && <Icon className="w-4.5 h-4.5 text-white" size={18} />}
            </div>
            <h2 className="font-bold text-gray-900 text-base">{title}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
            <X size={16} />
          </button>
        </div>
        {/* Body */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {children}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-sm">
              {loading ? <Loader2 size={14} className="animate-spin" /> : null}
              {submitLabel || 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── CONFIRM DELETE ────────────────────────────────────────────
const ConfirmDelete = ({ open, onClose, onConfirm, loading }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">Delete this record?</h3>
        <p className="text-sm text-gray-400 mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 flex items-center justify-center gap-2 disabled:opacity-50">
            {loading && <Loader2 size={14} className="animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
const ReraDetails = () => {
  const qc = useQueryClient()
  const [projectId, setProjectId]     = useState('')
  const [activeType, setActiveType]   = useState('rera')
  const [modal, setModal]             = useState({ open: false, data: null })
  const [delModal, setDelModal]       = useState({ open: false, id: null })
  const fileRef = useRef()

  // ── selected project object ──
  const [selectedProject, setSelectedProject] = useState(null)

  const openAdd  = ()    => { setModal({ open: true, data: null }); if (fileRef.current) fileRef.current.value = '' }
  const openEdit = (row) => { setModal({ open: true, data: row });  if (fileRef.current) fileRef.current.value = '' }
  const closeModal = ()  => setModal({ open: false, data: null })

  // ── Projects ──
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn:  async () => toArr(await projectApi.getAll()),
  })

  // ── RERA records for selected project ──
  const { data: allRecords = [], isLoading } = useQuery({
    queryKey: ['rera-all', projectId],
    queryFn:  async () => toArr(await reraApi.getByProject(projectId)),
    enabled:  !!projectId,
  })

  // filter by active type
  const records = allRecords.filter(r => r.type === activeType)

  // counts per type
  const counts = Object.fromEntries(TYPES.map(t => [t.value, allRecords.filter(r => r.type === t.value).length]))

  // ── Mutations ──
  const save = useMutation({
    mutationFn: (fd) => modal.data
      ? reraApi.update(modal.data._id || modal.data.id, fd)
      : reraApi.create(fd),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['rera-all', projectId] }); closeModal() },
    onError:   (e) => alert(e?.response?.data?.message || 'Failed to save'),
  })

  const del = useMutation({
    mutationFn: (id) => reraApi.delete(id),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['rera-all', projectId] }); setDelModal({ open: false }) },
    onError:    (e) => alert(e?.response?.data?.message || 'Failed to delete'),
  })

  // ── Submit — same fields for all types ──
  const handleSubmit = (e) => {
    e.preventDefault()
    const els = e.target
    const fd = buildFD({
      projectId,
      name:        els.name?.value,
      description: els.description?.value,
      type:        els.type?.value,
      // auto from project
      reraNo:      selectedProject?.reraNo || '',
    }, fileRef.current?.files[0])
    save.mutate(fd)
  }

  // ── Handle project change ──
  const handleProjectChange = (e) => {
    const id = e.target.value
    setProjectId(id)
    const proj = projects.find(p => (p._id || p.id) === id)
    setSelectedProject(proj || null)
  }

  const activeTypeConfig = TYPES.find(t => t.value === activeType)
  const clr = activeTypeConfig ? COLOR[activeTypeConfig.color] : COLOR.blue

  return (
    <div className="space-y-5">

      {/* ── PAGE HEADER ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-7 text-white">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">RERA Details</h1>
                <p className="text-slate-400 text-sm mt-0.5">Manage RERA, permissions, brochure & terms</p>
              </div>
            </div>

            {/* Project Selector */}
            <div className="relative">
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 min-w-[260px] backdrop-blur-sm">
                <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <select
                  value={projectId}
                  onChange={handleProjectChange}
                  className="bg-transparent text-white text-sm font-medium outline-none cursor-pointer flex-1 appearance-none">
                  <option value="" className="text-gray-900 bg-white">— Select Project —</option>
                  {projects.map(p => (
                    <option key={p._id || p.id} value={p._id || p.id} className="text-gray-900 bg-white">
                      {p.name || p.projectName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
              </div>
            </div>
          </div>

          {/* Project info pills — auto from API */}
          {selectedProject && (
            <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-white/10">
              <div className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-lg px-3 py-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-300 font-medium capitalize">{selectedProject.name}</span>
              </div>
              {selectedProject.reraNo && (
                <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-3 py-1.5">
                  <Hash className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs text-emerald-300 font-bold">{selectedProject.reraNo}</span>
                </div>
              )}
              {selectedProject.developer && (
                <div className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-lg px-3 py-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-300 font-medium">{selectedProject.developer}</span>
                </div>
              )}
              {selectedProject.completionDate && (
                <div className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-lg px-3 py-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-300 font-medium">
                    {new Date(selectedProject.completionDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-lg px-3 py-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-300 font-medium">{selectedProject.totalUnits} Units · {selectedProject.noOfSoldUnits} Sold</span>
              </div>
            </div>
          )}
        </div>
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* ── TYPE STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {TYPES.map(({ value, label, Icon, color }) => {
          const c    = COLOR[color]
          const isAc = activeType === value
          return (
            <button key={value}
              onClick={() => setActiveType(value)}
              className={`relative text-left p-4 rounded-2xl border-2 transition-all ${
                isAc
                  ? `${c.bg} ${c.border} shadow-md`
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${isAc ? 'bg-white shadow-sm' : c.bg}`}>
                <Icon className={`w-4.5 h-4.5 ${c.text}`} size={18} />
              </div>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <p className={`text-2xl font-bold mt-0.5 ${isAc ? c.text : 'text-gray-900'}`}>{counts[value] || 0}</p>
              {isAc && <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${c.dot}`} />}
            </button>
          )
        })}
      </div>

      {/* ── NO PROJECT ── */}
      {!projectId && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <div className="w-14 h-14 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-7 h-7 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium text-sm">Select a project to manage RERA details</p>
        </div>
      )}

      {/* ── RECORDS LIST ── */}
      {projectId && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* List Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {activeTypeConfig && (
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${clr.bg}`}>
                  <activeTypeConfig.Icon className={`w-4 h-4 ${clr.text}`} />
                </div>
              )}
              <div>
                <h2 className="font-bold text-gray-900 text-sm">{activeTypeConfig?.label} Records</h2>
                <p className="text-xs text-gray-400">{records.length} record{records.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <button onClick={openAdd}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm">
              <Plus size={15} />
              Add {activeTypeConfig?.label}
            </button>
          </div>

          {/* Records */}
          {isLoading ? (
            <div className="flex justify-center py-14">
              <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
            </div>
          ) : records.length === 0 ? (
            <div className="py-16 text-center">
              <div className={`w-14 h-14 ${clr.bg} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                {activeTypeConfig && <activeTypeConfig.Icon className={`w-7 h-7 ${clr.text} opacity-50`} />}
              </div>
              <p className="text-gray-400 text-sm mb-4">No {activeTypeConfig?.label} records yet</p>
              <button onClick={openAdd}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">
                <Plus size={14} /> Add First Record
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {records.map((row, idx) => (
                <div key={row._id || row.id}
                  className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors group">
                  {/* number */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${clr.bg} ${clr.text}`}>
                    {idx + 1}
                  </div>
                  {/* content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-gray-900 text-sm">{row.name || '—'}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${clr.badge}`}>
                        {row.type}
                      </span>
                      {row.reraNo && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-mono">
                          <Hash size={9} />{row.reraNo}
                        </span>
                      )}
                    </div>
                    {row.description && (
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-1.5">{row.description}</p>
                    )}
                    <div className="flex items-center gap-3">
                      {row.file && (
                        <a href={row.file} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 font-medium">
                          <Paperclip size={11} /> Attachment <ExternalLink size={10} />
                        </a>
                      )}
                      <span className="text-xs text-gray-300">
                        {new Date(row.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  {/* actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button onClick={() => openEdit(row)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-amber-500 hover:bg-amber-50 transition-all">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setDelModal({ open: true, id: row._id || row.id })}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MODAL ── same fields for all types ── */}
      <Modal
        open={modal.open}
        onClose={closeModal}
        title={modal.data ? `Edit ${activeTypeConfig?.label}` : `Add ${activeTypeConfig?.label}`}
        Icon={activeTypeConfig?.Icon}
        onSubmit={handleSubmit}
        loading={save.isPending}
        submitLabel={modal.data ? 'Update' : 'Save'}>

        {/* Auto-filled project info */}
        {selectedProject && (
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
            <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-400 font-medium">Project (auto)</p>
              <p className="text-sm font-bold text-slate-700 truncate">{selectedProject.name}</p>
            </div>
            {selectedProject.reraNo && (
              <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg">
                <Hash size={10} />
                <span className="text-xs font-bold">{selectedProject.reraNo}</span>
              </div>
            )}
          </div>
        )}

        <F label="Name" required icon={AlignLeft}>
          <input name="name" defaultValue={modal.data?.name} required className={inputCls} placeholder="Enter name..." />
        </F>

        <F label="Description" icon={FileText}>
          <textarea name="description" defaultValue={modal.data?.description} rows={3} className={taCls} placeholder="Enter description..." />
        </F>

        <F label="Type" required icon={Tag}>
          <div className="relative">
            <select name="type" defaultValue={modal.data?.type || activeType} className={`${inputCls} appearance-none pr-9`}>
              {TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </F>

        <F label="Attach File" icon={Upload} hint="PDF, JPG, PNG, WEBP supported">
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
            <input type="file" ref={fileRef} accept=".pdf,.jpg,.jpeg,.png,.webp"
              className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 file:font-semibold hover:file:bg-blue-100 cursor-pointer" />
          </div>
          {modal.data?.file && (
            <a href={modal.data.file} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-700 mt-1.5 font-medium">
              <Paperclip size={11} /> Current file <ExternalLink size={10} />
            </a>
          )}
        </F>
      </Modal>

      {/* ── CONFIRM DELETE ── */}
      <ConfirmDelete
        open={delModal.open}
        onClose={() => setDelModal({ open: false })}
        onConfirm={() => del.mutate(delModal.id)}
        loading={del.isPending} />

      {/* GLOBAL SAVING */}
      {(save.isPending || del.isPending) && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-5 shadow-2xl flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span className="font-semibold text-gray-900 text-sm">Saving...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReraDetails