// src/pages/project/ProjectWingsUnits.jsx
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft, Building2, Plus, Edit, Trash2,
  Layers, Home, CheckCircle, Clock, Ban,
  Loader2, AlertCircle, Search
} from 'lucide-react'
import WingModal from './WingModal'
import UnitModal from './UnitModal'
import { wingApi, unitApi } from '../../api/endpoints'

// ─── STATUS CONFIG ─────────────────────────────────────────────
const STATUS_CFG = {
  Available: { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle className="h-3.5 w-3.5" /> },
  Sold:      { dot: 'bg-red-500',     badge: 'bg-red-50 text-red-700 border-red-200',             icon: <Ban className="h-3.5 w-3.5" /> },
  Hold:      { dot: 'bg-amber-500',   badge: 'bg-amber-50 text-amber-700 border-amber-200',       icon: <Clock className="h-3.5 w-3.5" /> },
}
const getS = (status) => STATUS_CFG[status] || STATUS_CFG.Available

// ─── UNIT CARD ─────────────────────────────────────────────────
const UnitCard = ({ unit, onEdit, onDelete, onStatusChange, actionLoading }) => {
  const [showDetail, setShowDetail] = useState(false)
  const s = getS(unit.status)

  return (
    <div className={`relative rounded-xl border-2 p-3 transition-all cursor-pointer group ${
      unit.status === 'Available' ? 'border-emerald-200 bg-emerald-50/40 hover:shadow-md hover:border-emerald-400' :
      unit.status === 'Sold'      ? 'border-red-200 bg-red-50/40 hover:shadow-md hover:border-red-400' :
                                    'border-amber-200 bg-amber-50/40 hover:shadow-md hover:border-amber-400'
    }`}
      onClick={() => setShowDetail(p => !p)}
    >
      {/* Status dot top-right */}
      <span className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${s.dot}`} />

      {/* Unit header */}
      <p className="text-sm font-bold text-gray-900">{unit.unitNo}</p>
      <p className="text-xs text-gray-500 font-medium">{unit.unitType}</p>
      <p className="text-xs text-gray-400">Floor {unit.floor}</p>

      {/* Status badge */}
      <span className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${s.badge}`}>
        {s.icon} {unit.status}
      </span>

      {/* Expanded detail */}
      {showDetail && (
        <div className="mt-3 pt-3 border-t border-gray-200 space-y-1.5" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Carpet</span>
            <span className="font-semibold text-gray-800">{unit.carpetArea || '—'} sqft</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Scalable</span>
            <span className="font-semibold text-gray-800">{unit.scalableArea || '—'} sqft</span>
          </div>
          {unit.facing && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Facing</span>
              <span className="font-semibold text-gray-800">{unit.facing}</span>
            </div>
          )}
          {unit.price > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Price</span>
              <span className="font-bold text-blue-700">₹{Number(unit.price).toLocaleString('en-IN')}</span>
            </div>
          )}
          {unit.status === 'Hold' && unit.heldBy && (
            <div className="flex justify-between text-xs bg-amber-50 rounded px-2 py-1 border border-amber-100">
              <span className="text-amber-700">Held By</span>
              <span className="font-semibold text-amber-900">{unit.heldBy}</span>
            </div>
          )}
          {unit.status === 'Sold' && unit.soldBy && (
            <div className="flex justify-between text-xs bg-red-50 rounded px-2 py-1 border border-red-100">
              <span className="text-red-700">Sold By</span>
              <span className="font-semibold text-red-900">{unit.soldBy}</span>
            </div>
          )}

          {/* Quick status change */}
          <div className="flex gap-1 pt-1">
            {['Available','Hold','Sold'].filter(st => st !== unit.status).map(st => (
              <button key={st} disabled={actionLoading}
                onClick={() => onStatusChange(unit._id || unit.id, st)}
                className={`flex-1 text-xs py-1 rounded font-semibold transition-colors disabled:opacity-50 ${
                  st === 'Available' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' :
                  st === 'Sold'      ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                                       'bg-amber-100 text-amber-700 hover:bg-amber-200'
                }`}>
                → {st}
              </button>
            ))}
          </div>

          {/* Edit / Delete */}
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
const WingSection = ({ wing, projectId, actionLoading }) => {
  const queryClient = useQueryClient()
  const wingId = wing._id || wing.id
  const [unitModalOpen, setUnitModalOpen] = useState(false)
  const [editingUnit, setEditingUnit]     = useState(null)
  const [searchUnit, setSearchUnit]       = useState('')
  const [statusFilter, setStatusFilter]   = useState('All')
  const [collapsed, setCollapsed]         = useState(false)

  // Fetch units for this wing
  const { data: units = [], isLoading: unitsLoading } = useQuery({
    queryKey: ['units', wingId],
    queryFn: () => unitApi.getByWing(wingId),
    select: (res) => {
      if (Array.isArray(res))             return res
      if (Array.isArray(res.data))        return res.data
      if (Array.isArray(res.data?.data))  return res.data.data
      if (Array.isArray(res.units))       return res.units
      return []
    },
    enabled: !!wingId,
    staleTime: 1000 * 60 * 5,
  })

  // Create unit
  const createUnit = useMutation({
    mutationFn: unitApi.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['units', wingId] }); setUnitModalOpen(false); setEditingUnit(null) },
    onError: (err) => alert(err.response?.data?.message || 'Failed to create unit'),
  })

  // Update unit
  const updateUnit = useMutation({
    mutationFn: ({ id, data }) => unitApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['units', wingId] }); setUnitModalOpen(false); setEditingUnit(null) },
    onError: (err) => alert(err.response?.data?.message || 'Failed to update unit'),
  })

  // Delete unit
  const deleteUnit = useMutation({
    mutationFn: unitApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['units', wingId] }),
    onError: (err) => alert(err.response?.data?.message || 'Failed to delete unit'),
  })

  const handleSaveUnit = (formData) => {
    if (editingUnit) {
      updateUnit.mutate({ id: editingUnit._id || editingUnit.id, data: formData })
    } else {
      createUnit.mutate(formData)
    }
  }

  const handleDeleteUnit = (id) => {
    if (!window.confirm('Delete this unit?')) return
    deleteUnit.mutate(id)
  }

  const handleStatusChange = (id, newStatus) => {
    const unit = units.find(u => (u._id || u.id) === id)
    updateUnit.mutate({ id, data: { ...unit, status: newStatus } })
  }

  const unitActionLoading = createUnit.isPending || updateUnit.isPending || deleteUnit.isPending

  // Stats
  const unitStats = {
    total:     units.length,
    available: units.filter(u => u.status === 'Available').length,
    hold:      units.filter(u => u.status === 'Hold').length,
    sold:      units.filter(u => u.status === 'Sold').length,
  }

  // Filter
  const filteredUnits = units.filter(u => {
    const matchSearch = u.unitNo?.toLowerCase().includes(searchUnit.toLowerCase()) ||
                        u.unitType?.toLowerCase().includes(searchUnit.toLowerCase())
    const matchStatus = statusFilter === 'All' || u.status === statusFilter
    return matchSearch && matchStatus
  })

  // Group by floor
  const byFloor = filteredUnits.reduce((acc, u) => {
    const f = `Floor ${u.floor ?? 'G'}`
    if (!acc[f]) acc[f] = []
    acc[f].push(u)
    return acc
  }, {})

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Wing Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setCollapsed(p => !p)} className="text-white/80 hover:text-white">
            <Layers className="h-5 w-5" />
          </button>
          <div>
            <h3 className="text-white font-bold text-base">{wing.name}</h3>
            <p className="text-white/70 text-xs">{wing.totalFloors ? `${wing.totalFloors} Floors` : ''} · {unitStats.total} Units</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Mini stats */}
          <div className="hidden sm:flex items-center gap-3 mr-2">
            <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">🟢 {unitStats.available}</span>
            <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">🟡 {unitStats.hold}</span>
            <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">🔴 {unitStats.sold}</span>
          </div>
          <button
            onClick={() => { setEditingUnit(null); setUnitModalOpen(true) }}
            className="bg-white text-blue-600 hover:bg-white/90 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1">
            <Plus className="h-3.5 w-3.5" /> Add Unit
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-5">
          {/* Unit Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search unit no, type..."
                value={searchUnit} onChange={e => setSearchUnit(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {['All', 'Available', 'Hold', 'Sold'].map(f => (
                <button key={f} onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    statusFilter === f
                      ? f === 'Available' ? 'bg-emerald-500 text-white shadow-sm'
                      : f === 'Hold'      ? 'bg-amber-500 text-white shadow-sm'
                      : f === 'Sold'      ? 'bg-red-500 text-white shadow-sm'
                                          : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Units Loading */}
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
            /* Floor-wise grid */
            <div className="space-y-6">
              {Object.entries(byFloor)
                .sort(([a], [b]) => {
                  const numA = parseInt(a.replace('Floor ', '')) || 0
                  const numB = parseInt(b.replace('Floor ', '')) || 0
                  return numB - numA // Top floor first
                })
                .map(([floor, floorUnits]) => (
                  <div key={floor}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{floor}</span>
                      <div className="flex-1 h-px bg-gray-100" />
                      <span className="text-xs text-gray-400">{floorUnits.length} units</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                      {floorUnits.map(unit => (
                        <UnitCard
                          key={unit._id || unit.id}
                          unit={unit}
                          onEdit={(u) => { setEditingUnit(u); setUnitModalOpen(true) }}
                          onDelete={handleDeleteUnit}
                          onStatusChange={handleStatusChange}
                          actionLoading={unitActionLoading}
                        />
                      ))}
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      )}

      {/* Unit Modal */}
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

  // Fetch wings
  const {
    data: wings = [], isLoading, isError, error, refetch,
  } = useQuery({
    queryKey: ['wings', projectId],
    queryFn: () => wingApi.getByProject(projectId),
    select: (res) => {
      if (Array.isArray(res))            return res
      if (Array.isArray(res.data))       return res.data
      if (Array.isArray(res.data?.data)) return res.data.data
      if (Array.isArray(res.wings))      return res.wings
      return []
    },
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  })

  // Create wing
  const createWing = useMutation({
    mutationFn: wingApi.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['wings', projectId] }); setWingModalOpen(false) },
    onError: (err) => alert(err.response?.data?.message || 'Failed to create wing'),
  })

  // Update wing
  const updateWing = useMutation({
    mutationFn: ({ id, data }) => wingApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['wings', projectId] }); setWingModalOpen(false); setEditingWing(null) },
    onError: (err) => alert(err.response?.data?.message || 'Failed to update wing'),
  })

  // Delete wing
  const deleteWing = useMutation({
    mutationFn: wingApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wings', projectId] }),
    onError: (err) => alert(err.response?.data?.message || 'Failed to delete wing'),
  })

  const handleSaveWing = (formData) => {
    if (editingWing) {
      updateWing.mutate({ id: editingWing._id || editingWing.id, data: formData })
    } else {
      createWing.mutate(formData)
    }
  }

  const handleDeleteWing = (id) => {
    if (!window.confirm('Delete this wing and all its units?')) return
    deleteWing.mutate(id)
  }

  const wingActionLoading = createWing.isPending || updateWing.isPending || deleteWing.isPending

  return (
    <div className="min-h-screen bg-white p-6 space-y-6">

      {/* ── Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <button onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white text-sm mb-5 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </button>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="h-7 w-7" />
                <h1 className="text-3xl font-bold">{project.projectName}</h1>
              </div>
              <p className="text-white/75 text-sm">{project.developerName} · {project.projectType} · {project.totalUnits} Total Units</p>
              <div className="flex items-center gap-5 mt-3 text-sm">
                <span className="font-medium">{wings.length} Wings/Towers</span>
              </div>
            </div>
            <button
              onClick={() => { setEditingWing(null); setWingModalOpen(true) }}
              className="bg-white text-blue-600 hover:bg-white/90 font-semibold px-5 py-2 rounded-lg text-sm flex items-center gap-2 self-start">
              <Plus className="h-4 w-4" /> Add Wing / Tower
            </button>
          </div>
        </div>
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* ── Legend ── */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status Legend:</span>
        {[
          { label: 'Available', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
          { label: 'Hold',      cls: 'bg-amber-50 text-amber-700 border-amber-200',       dot: 'bg-amber-500' },
          { label: 'Sold',      cls: 'bg-red-50 text-red-700 border-red-200',             dot: 'bg-red-500' },
        ].map(({ label, cls, dot }) => (
          <span key={label} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}>
            <span className={`w-2 h-2 rounded-full ${dot}`} /> {label}
          </span>
        ))}
        <span className="text-xs text-gray-400 ml-2">💡 Click any unit to expand details & change status</span>
      </div>

      {/* ── Error ── */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-900">Error Loading Wings</p>
            <p className="text-sm text-red-700">{error?.response?.data?.message || error?.message}</p>
            <button onClick={() => refetch()} className="mt-1 text-sm font-medium text-red-600 underline">Try Again</button>
          </div>
        </div>
      )}

      {/* ── Loading ── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-500 text-sm">Loading wings & units...</p>
        </div>
      ) : wings.length === 0 ? (
        /* ── Empty State ── */
        <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-20">
            <Layers className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">No Wings / Towers yet</h3>
          <p className="text-sm text-gray-500 mb-5">Add your first wing or tower to start managing units.</p>
          <button onClick={() => { setEditingWing(null); setWingModalOpen(true) }}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Wing / Tower
          </button>
        </div>
      ) : (
        /* ── Wings List ── */
        <div className="space-y-6">
          {wings.map(wing => (
            <div key={wing._id || wing.id} className="relative">
              {/* Wing edit/delete buttons */}
              <div className="absolute top-4 right-20 z-10 flex items-center gap-1">
                <button onClick={() => { setEditingWing(wing); setWingModalOpen(true) }}
                  className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors" title="Edit Wing">
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleDeleteWing(wing._id || wing.id)}
                  className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-red-500/70 transition-colors" title="Delete Wing">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <WingSection
                wing={wing}
                projectId={projectId}
                actionLoading={wingActionLoading}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Wing Modal ── */}
      <WingModal
        isOpen={wingModalOpen}
        onClose={() => { setWingModalOpen(false); setEditingWing(null) }}
        onSave={handleSaveWing}
        wing={editingWing}
        projectId={projectId}
        loading={wingActionLoading}
      />

      {/* ── Loading Overlay ── */}
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