// src/pages/project/ProjectWingsUnits.jsx
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft, Building2, Plus, Edit, Trash2,
  Layers, Home, CheckCircle, Clock, Ban,
  Loader2, AlertCircle, Search, X,
} from 'lucide-react'
import WingModal from './WingModal'
import UnitModal from './UnitModal'
import { wingApi, unitApi } from '../../api/endpoints'
import { MOCK_WINGS, MOCK_UNITS } from './mockData'

// ─── STATUS CONFIG ─────────────────────────────────────────────
const STATUS_CFG = {
  Available: { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle className="h-3.5 w-3.5" /> },
  Sold:      { dot: 'bg-red-500',     badge: 'bg-red-50 text-red-700 border-red-200',             icon: <Ban className="h-3.5 w-3.5" /> },
  Hold:      { dot: 'bg-amber-500',   badge: 'bg-amber-50 text-amber-700 border-amber-200',       icon: <Clock className="h-3.5 w-3.5" /> },
}
const getS = (status) => STATUS_CFG[status] || STATUS_CFG.Available

const toArray = (res) => {
  if (Array.isArray(res))             return res
  if (Array.isArray(res?.data))       return res.data
  if (Array.isArray(res?.data?.data)) return res.data.data
  if (Array.isArray(res?.wings))      return res.wings
  if (Array.isArray(res?.units))      return res.units
  return []
}

// ─── UNIT CARD ─────────────────────────────────────────────────
const UnitCard = ({ unit, onEdit, onDelete, onStatusChange, actionLoading }) => {
  const [open, setOpen] = useState(false)
  const s = getS(unit.status)

  return (
    <div onClick={() => setOpen(p => !p)}
      className={`relative rounded-xl border-2 p-3 cursor-pointer transition-all select-none ${
        unit.status === 'Available' ? 'border-emerald-200 bg-emerald-50/40 hover:shadow-md hover:border-emerald-400' :
        unit.status === 'Sold'      ? 'border-red-200 bg-red-50/40 hover:shadow-md hover:border-red-400' :
                                      'border-amber-200 bg-amber-50/40 hover:shadow-md hover:border-amber-400'
      }`}>
      <span className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${s.dot}`} />

      <p className="text-sm font-bold text-gray-900 pr-4">{unit.unitNo}</p>
      <p className="text-xs text-gray-500 font-medium">{unit.unitType}</p>
      <p className="text-xs text-gray-400">Floor {unit.floor}</p>

      <span className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${s.badge}`}>
        {s.icon} {unit.status}
      </span>

      {open && (
        <div className="mt-3 pt-3 border-t border-gray-200 space-y-1.5" onClick={e => e.stopPropagation()}>
          {[
            ['Carpet',   unit.carpetArea   ? `${unit.carpetArea} sqft`   : '—'],
            ['Scalable', unit.scalableArea ? `${unit.scalableArea} sqft` : '—'],
            unit.facing ? ['Facing', unit.facing] : null,
          ].filter(Boolean).map(([l, v]) => (
            <div key={l} className="flex justify-between text-xs">
              <span className="text-gray-500">{l}</span>
              <span className="font-semibold text-gray-800">{v}</span>
            </div>
          ))}

          {unit.price > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Price</span>
              <span className="font-bold text-blue-700">₹{Number(unit.price).toLocaleString('en-IN')}</span>
            </div>
          )}

          {unit.status === 'Hold' && unit.heldBy && (
            <div className="flex justify-between text-xs bg-amber-50 rounded px-2 py-1 border border-amber-100">
              <span className="text-amber-700">Held By</span>
              <span className="font-semibold text-amber-900 truncate max-w-[60%]">{unit.heldBy}</span>
            </div>
          )}
          {unit.status === 'Sold' && unit.soldBy && (
            <div className="flex justify-between text-xs bg-red-50 rounded px-2 py-1 border border-red-100">
              <span className="text-red-700">Sold By</span>
              <span className="font-semibold text-red-900 truncate max-w-[60%]">{unit.soldBy}</span>
            </div>
          )}

          {/* Quick status */}
          <div className="flex gap-1 pt-1">
            {['Available', 'Hold', 'Sold'].filter(st => st !== unit.status).map(st => (
              <button key={st} disabled={actionLoading}
                onClick={() => onStatusChange(unit._id || unit.id, st)}
                className={`flex-1 text-xs py-1 rounded font-semibold transition-colors disabled:opacity-50 ${
                  st === 'Available' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' :
                  st === 'Sold'      ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                                       'bg-amber-100 text-amber-700 hover:bg-amber-200'
                }`}>→ {st}</button>
            ))}
          </div>

          <div className="flex gap-1 pt-1">
            <button onClick={() => onEdit(unit)} disabled={actionLoading}
              className="flex-1 py-1.5 text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg flex items-center justify-center gap-1 disabled:opacity-50">
              <Edit className="h-3 w-3" /> Edit
            </button>
            <button onClick={() => onDelete(unit._id || unit.id)} disabled={actionLoading}
              className="flex-1 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center gap-1 disabled:opacity-50">
              <Trash2 className="h-3 w-3" /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── WING SECTION ──────────────────────────────────────────────
const WingSection = ({ wing, projectId, onEditWing, onDeleteWing, wingActionLoading }) => {
  const queryClient   = useQueryClient()
  const wingId        = wing._id || wing.id
  const [unitModalOpen, setUnitModalOpen] = useState(false)
  const [editingUnit, setEditingUnit]     = useState(null)
  const [searchUnit, setSearchUnit]       = useState('')
  const [statusFilter, setStatusFilter]   = useState('All')
  const [collapsed, setCollapsed]         = useState(false)

  // Fetch units — fallback to mock if API empty/fails
  const { data: units = [], isLoading: unitsLoading } = useQuery({
    queryKey: ['units', wingId],
    queryFn: async () => {
      try {
        const res  = await unitApi.getByWing(wingId)
        const data = toArray(res)
        if (data.length === 0) return MOCK_UNITS[wingId] || []
        return data
      } catch {
        return MOCK_UNITS[wingId] || []
      }
    },
    enabled:   !!wingId,
    staleTime: 1000 * 60 * 5,
  })

  const createUnit = useMutation({
    mutationFn: unitApi.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['units', wingId] }); setUnitModalOpen(false); setEditingUnit(null) },
    onError: (err) => alert(err.response?.data?.message || 'Failed to create unit'),
  })
  const updateUnit = useMutation({
    mutationFn: ({ id, data }) => unitApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['units', wingId] }); setUnitModalOpen(false); setEditingUnit(null) },
    onError: (err) => alert(err.response?.data?.message || 'Failed to update unit'),
  })
  const deleteUnit = useMutation({
    mutationFn: unitApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['units', wingId] }),
    onError: (err) => alert(err.response?.data?.message || 'Failed to delete unit'),
  })

  const handleSaveUnit       = (fd) => editingUnit ? updateUnit.mutate({ id: editingUnit._id || editingUnit.id, data: fd }) : createUnit.mutate(fd)
  const handleDeleteUnit     = (id) => { if (!window.confirm('Delete this unit?')) return; deleteUnit.mutate(id) }
  const handleStatusChange   = (id, newStatus) => {
    const unit = units.find(u => (u._id || u.id) === id)
    updateUnit.mutate({ id, data: { ...unit, status: newStatus } })
  }

  const unitActionLoading = createUnit.isPending || updateUnit.isPending || deleteUnit.isPending

  const unitStats = {
    total:     units.length,
    available: units.filter(u => u.status === 'Available').length,
    hold:      units.filter(u => u.status === 'Hold').length,
    sold:      units.filter(u => u.status === 'Sold').length,
  }

  const filteredUnits = units.filter(u => {
    const ms = u.unitNo?.toLowerCase().includes(searchUnit.toLowerCase()) || u.unitType?.toLowerCase().includes(searchUnit.toLowerCase())
    const mf = statusFilter === 'All' || u.status === statusFilter
    return ms && mf
  })

  const byFloor = filteredUnits.reduce((acc, u) => {
    const f = `Floor ${u.floor ?? 'G'}`
    if (!acc[f]) acc[f] = []
    acc[f].push(u)
    return acc
  }, {})

  const sortedFloors = Object.entries(byFloor).sort(([a], [b]) => {
    return (parseInt(b.replace('Floor ', '')) || 0) - (parseInt(a.replace('Floor ', '')) || 0)
  })

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Wing Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setCollapsed(p => !p)} title={collapsed ? 'Expand' : 'Collapse'}
            className="text-white/80 hover:text-white">
            <Layers className="h-5 w-5" />
          </button>
          <div>
            <h3 className="text-white font-bold text-base">{wing.name}</h3>
            <p className="text-white/70 text-xs">
              {wing.totalFloors ? `${wing.totalFloors} Floors · ` : ''}{unitStats.total} Units
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 mr-1">
            <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">🟢 {unitStats.available}</span>
            <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">🟡 {unitStats.hold}</span>
            <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">🔴 {unitStats.sold}</span>
          </div>
          <button onClick={() => onEditWing(wing)} disabled={wingActionLoading} title="Edit Wing"
            className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 disabled:opacity-50">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={() => onDeleteWing(wing._id || wing.id)} disabled={wingActionLoading} title="Delete Wing"
            className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-red-500/60 disabled:opacity-50">
            <Trash2 className="h-4 w-4" />
          </button>
          <button onClick={() => { setEditingUnit(null); setUnitModalOpen(true) }}
            className="bg-white text-blue-600 hover:bg-white/90 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 ml-1">
            <Plus className="h-3.5 w-3.5" /> Add Unit
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-5">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search unit no, type..."
                value={searchUnit} onChange={e => setSearchUnit(e.target.value)}
                className="w-full pl-9 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchUnit && (
                <button onClick={() => setSearchUnit('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {[
                { k: 'All',       cnt: unitStats.total },
                { k: 'Available', cnt: unitStats.available },
                { k: 'Hold',      cnt: unitStats.hold },
                { k: 'Sold',      cnt: unitStats.sold },
              ].map(({ k, cnt }) => (
                <button key={k} onClick={() => setStatusFilter(k)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    statusFilter === k
                      ? k === 'Available' ? 'bg-emerald-500 text-white shadow-sm'
                      : k === 'Hold'      ? 'bg-amber-500 text-white shadow-sm'
                      : k === 'Sold'      ? 'bg-red-500 text-white shadow-sm'
                                          : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>
                  {k} <span className="opacity-70">({cnt})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Units */}
          {unitsLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
          ) : filteredUnits.length === 0 ? (
            <div className="text-center py-10">
              <Home className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm font-medium">No units found</p>
              <button onClick={() => { setEditingUnit(null); setUnitModalOpen(true) }}
                className="mt-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90 inline-flex items-center gap-1">
                <Plus className="h-3.5 w-3.5" /> Add First Unit
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedFloors.map(([floor, floorUnits]) => (
                <div key={floor}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{floor}</span>
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-xs text-gray-400">{floorUnits.length} units</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {floorUnits.map(unit => (
                      <UnitCard key={unit._id || unit.id} unit={unit}
                        onEdit={(u) => { setEditingUnit(u); setUnitModalOpen(true) }}
                        onDelete={handleDeleteUnit}
                        onStatusChange={handleStatusChange}
                        actionLoading={unitActionLoading}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <UnitModal
        isOpen={unitModalOpen}
        onClose={() => { setUnitModalOpen(false); setEditingUnit(null) }}
        onSave={handleSaveUnit}
        unit={editingUnit}
        wingId={wingId}
        projectId={projectId}
        loading={unitActionLoading}
      />
    </div>
  )
}

// ─── MAIN PAGE ─────────────────────────────────────────────────
const ProjectWingsUnits = ({ project, onBack }) => {
  const queryClient = useQueryClient()
  const projectId   = project._id || project.id

  const [wingModalOpen, setWingModalOpen] = useState(false)
  const [editingWing, setEditingWing]     = useState(null)

  // Fetch wings — fallback to mock if API empty/fails
  const { data: wings = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['wings', projectId],
    queryFn: async () => {
      try {
        const res  = await wingApi.getByProject(projectId)
        const data = toArray(res)
        if (data.length === 0) return MOCK_WINGS
        return data
      } catch {
        return MOCK_WINGS
      }
    },
    enabled:   !!projectId,
    staleTime: 1000 * 60 * 5,
  })

  const createWing = useMutation({
    mutationFn: wingApi.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['wings', projectId] }); setWingModalOpen(false) },
    onError: (err) => alert(err.response?.data?.message || 'Failed to create wing'),
  })
  const updateWing = useMutation({
    mutationFn: ({ id, data }) => wingApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['wings', projectId] }); setWingModalOpen(false); setEditingWing(null) },
    onError: (err) => alert(err.response?.data?.message || 'Failed to update wing'),
  })
  const deleteWing = useMutation({
    mutationFn: wingApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wings', projectId] }),
    onError: (err) => alert(err.response?.data?.message || 'Failed to delete wing'),
  })

  const handleSaveWing   = (fd) => editingWing ? updateWing.mutate({ id: editingWing._id || editingWing.id, data: fd }) : createWing.mutate(fd)
  const handleDeleteWing = (id) => { if (!window.confirm('Delete this wing and all its units?')) return; deleteWing.mutate(id) }
  const handleEditWing   = (wing) => { setEditingWing(wing); setWingModalOpen(true) }

  const wingActionLoading = createWing.isPending || updateWing.isPending || deleteWing.isPending

  return (
    <div className="min-h-screen bg-white p-6 space-y-6">

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <button onClick={onBack} className="flex items-center gap-2 text-white/80 hover:text-white text-sm mb-5">
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </button>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="h-7 w-7" />
                <h1 className="text-3xl font-bold">{project.projectName}</h1>
              </div>
              <p className="text-white/75 text-sm">
                {project.developerName} · {project.projectType} · {project.totalUnits} Total Units
              </p>
              <p className="text-white/70 text-sm mt-2 font-medium">{wings.length} Wings / Towers</p>
            </div>
            <button onClick={() => { setEditingWing(null); setWingModalOpen(true) }}
              className="bg-white text-blue-600 hover:bg-white/90 font-semibold px-5 py-2 rounded-lg text-sm flex items-center gap-2 self-start">
              <Plus className="h-4 w-4" /> Add Wing / Tower
            </button>
          </div>
        </div>
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status:</span>
        {[
          { label: 'Available', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
          { label: 'Hold',      cls: 'bg-amber-50 text-amber-700 border-amber-200',       dot: 'bg-amber-500' },
          { label: 'Sold',      cls: 'bg-red-50 text-red-700 border-red-200',             dot: 'bg-red-500' },
        ].map(({ label, cls, dot }) => (
          <span key={label} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}>
            <span className={`w-2 h-2 rounded-full ${dot}`} /> {label}
          </span>
        ))}
        <span className="text-xs text-gray-400 ml-2">💡 Click any unit card to expand details</span>
      </div>

      {/* Error */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-900">Error Loading Wings</p>
            <p className="text-sm text-red-700">{error?.response?.data?.message || error?.message}</p>
            <button onClick={() => refetch()} className="mt-1 text-sm font-medium text-red-600 underline">Try Again</button>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-500 text-sm">Loading wings & units...</p>
        </div>
      ) : wings.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-20">
            <Layers className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">No Wings / Towers yet</h3>
          <p className="text-sm text-gray-500 mb-5">Add your first wing to start managing units.</p>
          <button onClick={() => { setEditingWing(null); setWingModalOpen(true) }}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Wing / Tower
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {wings.map(wing => (
            <WingSection key={wing._id || wing.id} wing={wing} projectId={projectId}
              onEditWing={handleEditWing} onDeleteWing={handleDeleteWing}
              wingActionLoading={wingActionLoading}
            />
          ))}
        </div>
      )}

      <WingModal
        isOpen={wingModalOpen}
        onClose={() => { setWingModalOpen(false); setEditingWing(null) }}
        onSave={handleSaveWing}
        wing={editingWing}
        projectId={projectId}
        loading={wingActionLoading}
      />

      {wingActionLoading && (
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

export default ProjectWingsUnits