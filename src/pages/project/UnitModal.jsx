// src/pages/project/UnitModal.jsx
import { useState, useEffect } from 'react'
import { X, Home, Loader2 } from 'lucide-react'

const UNIT_TYPES = ['1bhk', '2bhk', '3bhk', '4bhk', 'studio', 'penthouse', 'shop', 'office']
const UNIT_TYPE_LABELS = {
  '1bhk': '1 BHK', '2bhk': '2 BHK', '3bhk': '3 BHK', '4bhk': '4 BHK',
  'studio': 'Studio', 'penthouse': 'Penthouse', 'shop': 'Shop', 'office': 'Office',
}
const UNIT_STATUSES = ['available', 'sold', 'hold']

const STATUS_STYLE = {
  available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  sold:      'bg-red-50 text-red-700 border-red-200',
  hold:      'bg-amber-50 text-amber-700 border-amber-200',
}
const STATUS_LABEL = { available: 'Available', sold: 'Sold', hold: 'Hold' }

const UnitModal = ({ isOpen, onClose, onSave, unit, floorId, wingId, projectId, loading }) => {
  const isEditing = Boolean(unit)

  const getEmptyForm = () => ({
    name:         '',    // e.g. "Unit 101"
    number:       '',    // e.g. "101"
    unitType:     '2bhk',
    carpetArea:   '',
    saleableArea: '',
    facing:       '',
    status:       'available',
    heldBy:       '',
    soldBy:       '',
    isActive:     true,
  })

  const [form, setForm] = useState(getEmptyForm)

  useEffect(() => {
    setForm(unit
      ? {
          name:         unit.name         || '',
          number:       unit.number       || '',
          unitType:     unit.unitType     || '2bhk',
          carpetArea:   unit.carpetArea   ?? '',
          saleableArea: unit.saleableArea ?? '',
          facing:       unit.facing       || '',
          status:       unit.status       || 'available',
          heldBy:       unit.heldBy       || '',
          soldBy:       unit.soldBy       || '',
          isActive:     unit.isActive     ?? true,
        }
      : getEmptyForm()
    )
  }, [unit, isOpen])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return alert('Unit name is required')
    if (!floorId)          return alert('Floor not selected')

    // ── API body matching Postman ──
    onSave({
      floorId,
      projectId,
      name:         form.name.trim(),
      number:       form.number.trim() || form.name.trim(),
      carpetArea:   form.carpetArea,
      saleableArea: form.saleableArea,
      unitType:     form.unitType,
      facing:       form.facing,
      status:       form.status,
      // Conditional
      // heldBy: form.status === 'hold' ? form.heldBy : '',
      // soldBy: form.status === 'sold' ? form.soldBy : '',
      // isActive: form.isActive,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-2xl px-6 py-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
              <Home className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-white font-bold text-lg">
              {isEditing ? 'Edit Unit' : 'Add New Unit'}
            </h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* ── Unit Info ── */}
          <div className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2">
            Unit Information
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Unit Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Unit Name <span className="text-red-500">*</span>
              </label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                required placeholder="e.g. Unit 101"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Unit Number */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Unit Number
              </label>
              <input type="text" name="number" value={form.number} onChange={handleChange}
                placeholder="e.g. 101"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Unit Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Unit Type <span className="text-red-500">*</span>
              </label>
              <select name="unitType" value={form.unitType} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {UNIT_TYPES.map(t => (
                  <option key={t} value={t}>{UNIT_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>

            {/* Facing */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Facing</label>
              <select name="facing" value={form.facing} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Facing</option>
                {['north', 'south', 'east', 'west', 'north-east', 'north-west', 'south-east', 'south-west'].map(f => (
                  <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Area ── */}
          <div className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2 pt-1">
            Area Details
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Carpet Area (sq ft)
              </label>
              <input type="number" name="carpetArea" value={form.carpetArea} onChange={handleChange}
                min="0" placeholder="e.g. 1200"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Saleable Area (sq ft)
              </label>
              <input type="number" name="saleableArea" value={form.saleableArea} onChange={handleChange}
                min="0" placeholder="e.g. 1500"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Efficiency preview */}
          {form.carpetArea && form.saleableArea && Number(form.saleableArea) > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-blue-700 font-medium">Efficiency Ratio</span>
              <span className="text-sm font-bold text-blue-800">
                {Math.round((Number(form.carpetArea) / Number(form.saleableArea)) * 100)}% carpet
              </span>
            </div>
          )}

          {/* ── Status ── */}
          <div className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2 pt-1">
            Status
          </div>

          <div className="grid grid-cols-3 gap-3">
            {UNIT_STATUSES.map(s => (
              <label key={s} className={`cursor-pointer flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                form.status === s
                  ? `border-transparent ${STATUS_STYLE[s]} ring-2 ring-offset-1 ring-blue-400`
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}>
                <input type="radio" name="status" value={s} checked={form.status === s} onChange={handleChange} className="sr-only" />
                <span className={`w-2 h-2 rounded-full ${
                  s === 'available' ? 'bg-emerald-500' : s === 'sold' ? 'bg-red-500' : 'bg-amber-500'
                }`} />
                {STATUS_LABEL[s]}
              </label>
            ))}
          </div>

          {/* Hold By */}
          {form.status === 'hold' && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Held By (Customer Name)
              </label>
              <input type="text" name="heldBy" value={form.heldBy} onChange={handleChange}
                placeholder="e.g. Ramesh Sharma"
                className="w-full border border-amber-200 rounded-lg px-3 py-2.5 text-sm bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          )}

          {/* Sold By */}
          {form.status === 'sold' && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Sold By (Agent / Sales Person)
              </label>
              <input type="text" name="soldBy" value={form.soldBy} onChange={handleChange}
                placeholder="e.g. Priya Mehta"
                className="w-full border border-red-200 rounded-lg px-3 py-2.5 text-sm bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          )}

          {/* Active */}
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-700">Active</p>
              <p className="text-xs text-gray-400">Unit is visible in inventory</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-cyan-600" />
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Unit' : 'Add Unit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UnitModal