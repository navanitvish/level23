// src/pages/Inventory.jsx
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Building2, Plus, Pencil, Trash2, Search, X, ChevronDown,
  CheckCircle, Clock, Ban, Loader2, Home,
  LayoutGrid, List, Users, Hash, Layers, ArrowRight
} from 'lucide-react'
import { projectApi, wingApi, floorApi, unitApi, userApi } from '../api/endpoints'

// ─── HELPERS ──────────────────────────────────────────────────
const toArr = (res) => {
  if (Array.isArray(res))             return res
  if (Array.isArray(res?.data))       return res.data
  if (Array.isArray(res?.data?.data)) return res.data.data
  return []
}

// ─── STATUS CONFIG ─────────────────────────────────────────────
const STATUS = {
  available: { label: 'Available', dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', Icon: CheckCircle },
  hold:      { label: 'Hold',      dot: 'bg-amber-500',   badge: 'bg-amber-50 text-amber-700 border-amber-200',       Icon: Clock      },
  sold:      { label: 'Sold',      dot: 'bg-red-500',     badge: 'bg-red-50 text-red-700 border-red-200',             Icon: Ban        },
}
const getStatus = (s) => STATUS[s?.toLowerCase()] || STATUS.available

const inputCls  = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-300"
const selectCls = `${inputCls} appearance-none`

const F = ({ label, required, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
  </div>
)

// ─── ADD MODAL ─────────────────────────────────────────────────
const AddModal = ({ open, onClose, onSubmit, loading, wings, floors, floorId, wingId, setWingId, salesUsers, formStatus, setFormStatus }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[94vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Plus size={16} className="text-white" />
            </div>
            <h2 className="font-bold text-gray-900">Add New Unit</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"><X size={16} /></button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">

          {/* Floor selector — if not already selected */}
          {!floorId && (
            <div className="grid grid-cols-2 gap-3">
              <F label="Wing" required>
                <div className="relative">
                  <select name="wingIdModal" defaultValue={wingId} onChange={e => setWingId(e.target.value)} className={selectCls}>
                    <option value="">Select Wing</option>
                    {wings.map(w => <option key={w._id||w.id} value={w._id||w.id}>{w.name}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </F>
              <F label="Floor" required>
                <div className="relative">
                  <select name="floorId" required className={selectCls}>
                    <option value="">Select Floor</option>
                    {floors.map(f => <option key={f._id||f.id} value={f._id||f.id}>Floor {f.number} – {f.name}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </F>
            </div>
          )}

          {/* Name + Number */}
          <div className="grid grid-cols-2 gap-3">
            <F label="Unit Name" required>
              <input name="name" required className={inputCls} placeholder="e.g. unit 104" />
            </F>
            <F label="Unit Number" required>
              <input name="number" required className={inputCls} placeholder="e.g. 104" />
            </F>
          </div>

          {/* Areas */}
          <div className="grid grid-cols-2 gap-3">
            <F label="Carpet Area (sqft)">
              <input name="carpetArea" type="number" className={inputCls} placeholder="1200" />
            </F>
            <F label="Saleable Area (sqft)">
              <input name="saleableArea" type="number" className={inputCls} placeholder="1500" />
            </F>
          </div>

          {/* Type + Facing */}
          <div className="grid grid-cols-2 gap-3">
            <F label="Unit Type">
              <div className="relative">
                <select name="unitType" defaultValue="2bhk" className={selectCls}>
                  {['1bhk','2bhk','3bhk','4bhk','studio','penthouse','duplex','shop','office'].map(t => (
                    <option key={t} value={t}>{t.toUpperCase()}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </F>
            <F label="Facing">
              <div className="relative">
                <select name="facing" defaultValue="" className={selectCls}>
                  <option value="">Not specified</option>
                  {['north','south','east','west','north-east','north-west','south-east','south-west'].map(f => (
                    <option key={f} value={f}>{f.charAt(0).toUpperCase()+f.slice(1)}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </F>
          </div>

          {/* Status */}
          <F label="Status" required>
            <div className="flex gap-2">
              {Object.entries(STATUS).map(([key, cfg]) => (
                <button key={key} type="button" onClick={() => setFormStatus(key)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 flex items-center justify-center gap-1.5 transition-all ${
                    formStatus === key ? `${cfg.badge} border-current` : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                  }`}>
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />{cfg.label}
                </button>
              ))}
            </div>
            <input type="hidden" name="status" value={formStatus} />
          </F>

          {/* Assign user — only for hold/sold */}
          {(formStatus === 'hold' || formStatus === 'sold') && (
            <F label={formStatus === 'hold' ? 'Hold By (Salesman)' : 'Sold By (Salesman)'} required>
              <div className="relative">
                <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select name="assignedUser" required className={`${selectCls} pl-9`}>
                  <option value="">— Select Salesman —</option>
                  {salesUsers.map(u => (
                    <option key={u._id||u.id} value={u._id||u.id}>{u.name} {u.mobile ? `· ${u.mobile}` : ''}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </F>
          )}

          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50">
              {loading && <Loader2 size={14} className="animate-spin" />} Add Unit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── STATUS UPDATE MODAL (PUT) ──────────────────────────────────
const StatusModal = ({ open, onClose, onSubmit, loading, unit, salesUsers, formStatus, setFormStatus }) => {
  if (!open || !unit) return null
  const currentS = getStatus(unit.status)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Pencil size={15} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Update Status</h2>
              <p className="text-xs text-gray-400">{unit.name} · #{unit.number}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"><X size={16} /></button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">

          {/* Unit info card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap gap-4">
            <div>
              <p className="text-xs text-slate-400">Unit</p>
              <p className="text-sm font-bold text-slate-800">{unit.name} <span className="text-slate-400 font-normal">#{unit.number}</span></p>
            </div>
            {unit.unitType && <div><p className="text-xs text-slate-400">Type</p><p className="text-sm font-bold text-violet-600 uppercase">{unit.unitType}</p></div>}
            {unit.saleableArea && <div><p className="text-xs text-slate-400">Saleable</p><p className="text-sm font-bold text-slate-800">{unit.saleableArea} sqft</p></div>}
            <div>
              <p className="text-xs text-slate-400">Current</p>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${currentS.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${currentS.dot}`}/>{currentS.label}
              </span>
            </div>
          </div>

          {/* New Status buttons */}
          <F label="New Status" required>
            <div className="flex gap-2">
              {Object.entries(STATUS).map(([key, cfg]) => (
                <button key={key} type="button" onClick={() => setFormStatus(key)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 flex items-center justify-center gap-1.5 transition-all ${
                    formStatus === key ? `${cfg.badge} border-current` : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                  }`}>
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`}/>{cfg.label}
                </button>
              ))}
            </div>
            <input type="hidden" name="status" value={formStatus} />
          </F>

          {/* Assign user — hold/sold only */}
          {(formStatus === 'hold' || formStatus === 'sold') && (
            <F label={formStatus === 'hold' ? 'Hold By (Salesman)' : 'Sold By (Salesman)'} required>
              <div className="relative">
                <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select name="assignedUser" required
                  defaultValue={unit.holdByUserId || unit.soldByUserId || ''}
                  className={`${selectCls} pl-9`}>
                  <option value="">— Select Salesman —</option>
                  {salesUsers.map(u => (
                    <option key={u._id||u.id} value={u._id||u.id}>{u.name} {u.mobile ? `· ${u.mobile}` : ''}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </F>
          )}

          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50">
              {loading && <Loader2 size={14} className="animate-spin" />} Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── CONFIRM DELETE ─────────────────────────────────────────────
const ConfirmDelete = ({ open, onClose, onConfirm, loading, name }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="font-bold text-gray-900 mb-1">Delete Unit?</h3>
        <p className="text-sm text-gray-400 mb-1">{name}</p>
        <p className="text-xs text-gray-400 mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600">Cancel</button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            {loading && <Loader2 size={14} className="animate-spin" />} Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
const Inventory = () => {
  const qc = useQueryClient()

  const [projectId, setProjectId] = useState('')
  const [wingId, setWingId]       = useState('')
  const [floorId, setFloorId]     = useState('')
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState('all')
  const [viewMode, setViewMode]   = useState('table')

  // modals
  const [addModal, setAddModal]     = useState(false)
  const [statusModal, setStatusModal] = useState({ open: false, unit: null })
  const [delModal, setDelModal]     = useState({ open: false, id: null, name: '' })

  // form status state (shared)
  const [addFormStatus, setAddFormStatus]       = useState('available')
  const [statusFormStatus, setStatusFormStatus] = useState('available')

  // ── QUERIES ──
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn:  async () => toArr(await projectApi.getAll()),
  })
  const { data: wings = [] } = useQuery({
    queryKey: ['wings', projectId],
    queryFn:  async () => toArr(await wingApi.getByProject(projectId)),
    enabled:  !!projectId,
  })
  const { data: floors = [] } = useQuery({
    queryKey: ['floors', wingId],
    queryFn:  async () => toArr(await floorApi.getByWing(wingId)),
    enabled:  !!wingId,
  })
  const { data: units = [], isLoading } = useQuery({
    queryKey: ['units', projectId, wingId, floorId],
    queryFn:  async () => {
      if (floorId)    return toArr(await unitApi.getByFloor(floorId))
      if (projectId)  return toArr(await unitApi.getAll({ projectId }))
      return []
    },
    enabled: !!projectId,
  })
  const { data: salesUsers = [] } = useQuery({
    queryKey: ['users-salesman'],
    queryFn:  async () => toArr(await userApi.getAll('salesman')),
  })

  // ── filtered ──
  const filtered = units.filter(u => {
    const matchSearch = !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.number?.toString().includes(search)
    const matchStatus = statusFilter === 'all' || u.status?.toLowerCase() === statusFilter
    return matchSearch && matchStatus
  })

  const stats = {
    total:     units.length,
    available: units.filter(u => u.status === 'available').length,
    hold:      units.filter(u => u.status === 'hold').length,
    sold:      units.filter(u => u.status === 'sold').length,
  }

  const selectedProject = projects.find(p => (p._id||p.id) === projectId)
  const selectedWing    = wings.find(w => (w._id||w.id) === wingId)
  const selectedFloor   = floors.find(f => (f._id||f.id) === floorId)

  // ── MUTATIONS ──
  const createUnit = useMutation({
    mutationFn: (payload) => unitApi.create(payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['units'] }); setAddModal(false) },
    onError:   (e) => alert(e?.response?.data?.message || 'Failed to create unit'),
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, payload }) => unitApi.update(id, payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['units'] }); setStatusModal({ open: false, unit: null }) },
    onError:   (e) => alert(e?.response?.data?.message || 'Failed to update status'),
  })

  const deleteUnit = useMutation({
    mutationFn: (id) => unitApi.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['units'] }); setDelModal({ open: false }) },
    onError:   (e) => alert(e?.response?.data?.message || 'Failed to delete'),
  })

  // ── POST handler — full payload ──
  const handleAdd = (e) => {
    e.preventDefault()
    const els    = e.target
    const status = els.status?.value || 'available'
    const payload = {
      floorId:      els.floorId?.value || floorId,
      name:         els.name?.value,
      number:       els.number?.value,
      carpetArea:   els.carpetArea?.value,
      saleableArea: els.saleableArea?.value,
      unitType:     els.unitType?.value,
      status,
      ...(els.facing?.value ? { facing: els.facing.value } : {}),
      ...(status === 'hold' && els.assignedUser?.value ? { holdByUserId: els.assignedUser.value } : {}),
      ...(status === 'sold' && els.assignedUser?.value ? { soldByUserId: els.assignedUser.value } : {}),
    }
    createUnit.mutate(payload)
  }

  // ── PUT handler — ONLY status + userId ──
  const handleStatusUpdate = (e) => {
    e.preventDefault()
    const els    = e.target
    const status = els.status?.value
    const payload = {
      status,
      ...(status === 'hold' && els.assignedUser?.value ? { holdByUserId: els.assignedUser.value } : {}),
      ...(status === 'sold' && els.assignedUser?.value ? { soldByUserId: els.assignedUser.value } : {}),
    }
    updateStatus.mutate({ id: statusModal.unit._id || statusModal.unit.id, payload })
  }

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-7 text-white">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Inventory</h1>
                <p className="text-slate-400 text-sm mt-0.5">Manage units — available, hold, sold</p>
              </div>
            </div>
            {projectId && (
              <button onClick={() => { setAddFormStatus('available'); setAddModal(true) }}
                className="flex items-center gap-2 bg-white text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-slate-100 text-sm shadow-lg self-start lg:self-auto">
                <Plus size={16} /> Add Unit
              </button>
            )}
          </div>

          {/* Selectors */}
          <div className="flex flex-wrap items-center gap-2 mt-5 pt-5 border-t border-white/10">
            <div className="relative flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-3 py-2 min-w-[180px]">
              <Building2 size={14} className="text-slate-400 flex-shrink-0" />
              <select value={projectId} onChange={e => { setProjectId(e.target.value); setWingId(''); setFloorId('') }}
                className="bg-transparent text-white text-xs font-medium outline-none cursor-pointer flex-1 appearance-none">
                <option value="" className="text-gray-900 bg-white">Select Project</option>
                {projects.map(p => <option key={p._id||p.id} value={p._id||p.id} className="text-gray-900 bg-white">{p.name}</option>)}
              </select>
              <ChevronDown size={12} className="text-slate-400 flex-shrink-0" />
            </div>

            {projectId && <ArrowRight size={14} className="text-slate-500" />}
            {projectId && (
              <div className="relative flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-3 py-2 min-w-[150px]">
                <Layers size={14} className="text-slate-400 flex-shrink-0" />
                <select value={wingId} onChange={e => { setWingId(e.target.value); setFloorId('') }}
                  className="bg-transparent text-white text-xs font-medium outline-none cursor-pointer flex-1 appearance-none">
                  <option value="" className="text-gray-900 bg-white">All Wings</option>
                  {wings.map(w => <option key={w._id||w.id} value={w._id||w.id} className="text-gray-900 bg-white">{w.name}</option>)}
                </select>
                <ChevronDown size={12} className="text-slate-400 flex-shrink-0" />
              </div>
            )}

            {wingId && <ArrowRight size={14} className="text-slate-500" />}
            {wingId && (
              <div className="relative flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-3 py-2 min-w-[150px]">
                <Hash size={14} className="text-slate-400 flex-shrink-0" />
                <select value={floorId} onChange={e => setFloorId(e.target.value)}
                  className="bg-transparent text-white text-xs font-medium outline-none cursor-pointer flex-1 appearance-none">
                  <option value="" className="text-gray-900 bg-white">All Floors</option>
                  {floors.map(f => <option key={f._id||f.id} value={f._id||f.id} className="text-gray-900 bg-white">Floor {f.number} – {f.name}</option>)}
                </select>
                <ChevronDown size={12} className="text-slate-400 flex-shrink-0" />
              </div>
            )}

            {selectedProject && (
              <div className="ml-auto flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-slate-300">
                {selectedProject.name}
                {selectedWing  && <><span className="text-slate-500">›</span>{selectedWing.name}</>}
                {selectedFloor && <><span className="text-slate-500">›</span>Floor {selectedFloor.number}</>}
              </div>
            )}
          </div>
        </div>
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      </div>

      {!projectId ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-14 text-center">
          <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Select a project to view inventory</p>
        </div>
      ) : (
        <>
          {/* STAT CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Total',     value: stats.total,     gradient: 'from-blue-600 to-cyan-500',     Icon: Building2   },
              { label: 'Available', value: stats.available, gradient: 'from-emerald-500 to-green-500', Icon: CheckCircle },
              { label: 'On Hold',   value: stats.hold,      gradient: 'from-amber-500 to-orange-400',  Icon: Clock       },
              { label: 'Sold',      value: stats.sold,      gradient: 'from-red-500 to-rose-500',      Icon: Ban         },
            ].map(({ label, value, gradient, Icon }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                  <Icon size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">{label}</p>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* TOOLBAR */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[180px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search units..."
                className="w-full pl-9 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><X size={14} /></button>}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {[
                { key: 'all',       label: `All (${stats.total})`,           cls: 'bg-gray-100 text-gray-600'      },
                { key: 'available', label: `Available (${stats.available})`, cls: 'bg-emerald-50 text-emerald-700' },
                { key: 'hold',      label: `Hold (${stats.hold})`,           cls: 'bg-amber-50 text-amber-700'     },
                { key: 'sold',      label: `Sold (${stats.sold})`,           cls: 'bg-red-50 text-red-700'         },
              ].map(({ key, label, cls }) => (
                <button key={key} onClick={() => setStatus(key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${cls} ${statusFilter === key ? 'ring-2 ring-offset-1 ring-blue-500' : 'opacity-60 hover:opacity-100'}`}>
                  {label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 ml-auto">
              <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}><List size={15} /></button>
              <button onClick={() => setViewMode('grid')}  className={`p-2 rounded-lg transition-all ${viewMode === 'grid'  ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}><LayoutGrid size={15} /></button>
            </div>
          </div>

          {/* TABLE / GRID */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <Home className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm mb-4">No units found</p>
                <button onClick={() => setAddModal(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">
                  <Plus size={14} /> Add Unit
                </button>
              </div>
            ) : viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['#','Unit','Floor','Type','Carpet','Saleable','Facing','Assigned To','Status','Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((unit, idx) => {
                      const s = getStatus(unit.status)
                      const assigned = unit.holdBy?.name || unit.soldBy?.name || unit.holdByName || unit.soldByName
                      return (
                        <tr key={unit._id||unit.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-4 py-3.5 text-sm text-gray-400">{idx+1}</td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                                unit.status==='available' ? 'bg-emerald-500' : unit.status==='hold' ? 'bg-amber-500' : 'bg-red-500'
                              }`}>{(unit.number||'').toString().slice(-2)}</div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{unit.name}</p>
                                <p className="text-xs text-gray-400 font-mono">#{unit.number}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">Floor {unit.floor?.number||'—'}</span></td>
                          <td className="px-4 py-3.5"><span className="px-2 py-1 bg-violet-100 text-violet-700 rounded-lg text-xs font-bold uppercase">{unit.unitType||'—'}</span></td>
                          <td className="px-4 py-3.5 text-sm text-gray-500">{unit.carpetArea ? `${unit.carpetArea} sqft` : '—'}</td>
                          <td className="px-4 py-3.5 text-sm font-medium text-gray-800">{unit.saleableArea ? `${unit.saleableArea} sqft` : '—'}</td>
                          <td className="px-4 py-3.5">{unit.facing ? <span className="px-2 py-1 bg-cyan-50 text-cyan-700 rounded-lg text-xs capitalize">{unit.facing}</span> : <span className="text-gray-300 text-xs">—</span>}</td>
                          <td className="px-4 py-3.5">
                            {assigned
                              ? <div className="flex items-center gap-1.5"><div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center"><span className="text-white text-xs font-bold">{assigned[0]?.toUpperCase()}</span></div><span className="text-xs font-medium text-gray-700">{assigned}</span></div>
                              : <span className="text-gray-300 text-xs">—</span>}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.badge}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}/>{s.label}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1">
                              <button onClick={() => { setStatusFormStatus(unit.status||'available'); setStatusModal({ open: true, unit }) }}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-amber-500 hover:bg-amber-50">
                                <Pencil size={13} />
                              </button>
                              <button onClick={() => setDelModal({ open: true, id: unit._id||unit.id, name: unit.name })}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
                  <p className="text-xs text-gray-400">Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of <span className="font-semibold text-gray-600">{units.length}</span> units</p>
                </div>
              </div>
            ) : (
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(unit => {
                  const s = getStatus(unit.status)
                  const assigned = unit.holdBy?.name || unit.soldBy?.name || unit.holdByName || unit.soldByName
                  return (
                    <div key={unit._id||unit.id} className="relative bg-white border-2 border-gray-100 rounded-2xl p-4 hover:shadow-md transition-all group">
                      <div className={`absolute top-0 inset-x-0 h-1 rounded-t-2xl ${s.dot}`} />
                      <div className="flex items-start justify-between mb-3 mt-1">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white ${
                          unit.status==='available' ? 'bg-emerald-500' : unit.status==='hold' ? 'bg-amber-500' : 'bg-red-500'
                        }`}>{(unit.number||'').toString().slice(-2)}</div>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${s.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}/>{s.label}
                        </span>
                      </div>
                      <p className="font-bold text-gray-900 text-sm mb-0.5">{unit.name}</p>
                      <p className="text-xs text-gray-400 mb-2">#{unit.number} · Floor {unit.floor?.number}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {unit.unitType && <span className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded text-xs font-bold uppercase">{unit.unitType}</span>}
                        {unit.facing   && <span className="px-2 py-0.5 bg-cyan-50 text-cyan-700 rounded text-xs capitalize">{unit.facing}</span>}
                      </div>
                      <div className="text-xs text-gray-500 space-y-0.5 mb-3">
                        <p>Carpet: <span className="font-medium text-gray-700">{unit.carpetArea||'—'} sqft</span></p>
                        <p>Saleable: <span className="font-medium text-gray-700">{unit.saleableArea||'—'} sqft</span></p>
                        {assigned && <p>Assigned: <span className="font-medium text-gray-700">{assigned}</span></p>}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity border-t border-gray-100 pt-3">
                        <button onClick={() => { setStatusFormStatus(unit.status||'available'); setStatusModal({ open: true, unit }) }}
                          className="flex-1 py-1.5 text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg flex items-center justify-center gap-1">
                          <Pencil size={11}/> Status
                        </button>
                        <button onClick={() => setDelModal({ open: true, id: unit._id||unit.id, name: unit.name })}
                          className="flex-1 py-1.5 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center gap-1">
                          <Trash2 size={11}/> Delete
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* ADD MODAL — POST full payload */}
      <AddModal
        open={addModal}
        onClose={() => setAddModal(false)}
        onSubmit={handleAdd}
        loading={createUnit.isPending}
        wings={wings} floors={floors}
        floorId={floorId} wingId={wingId} setWingId={setWingId}
        salesUsers={salesUsers}
        formStatus={addFormStatus} setFormStatus={setAddFormStatus} />

      {/* STATUS MODAL — PUT only status + userId */}
      <StatusModal
        open={statusModal.open}
        onClose={() => setStatusModal({ open: false, unit: null })}
        onSubmit={handleStatusUpdate}
        loading={updateStatus.isPending}
        unit={statusModal.unit}
        salesUsers={salesUsers}
        formStatus={statusFormStatus} setFormStatus={setStatusFormStatus} />

      {/* CONFIRM DELETE */}
      <ConfirmDelete
        open={delModal.open}
        onClose={() => setDelModal({ open: false })}
        onConfirm={() => deleteUnit.mutate(delModal.id)}
        loading={deleteUnit.isPending}
        name={delModal.name} />

      {/* GLOBAL LOADING */}
      {(createUnit.isPending || updateStatus.isPending || deleteUnit.isPending) && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-5 shadow-2xl flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span className="font-semibold text-gray-900 text-sm">Processing...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Inventory