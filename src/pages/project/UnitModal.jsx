// src/pages/project/UnitModal.jsx
import { useState, useEffect } from 'react'
import { X, Home, Loader2 } from 'lucide-react'

const UNIT_TYPES   = ['1BHK', '2BHK', '3BHK', '4BHK', 'Studio', 'Penthouse', 'Shop', 'Office']
const UNIT_STATUSES = ['Available', 'Sold', 'Hold']

const STATUS_STYLE = {
  Available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Sold:      'bg-red-50 text-red-700 border-red-200',
  Hold:      'bg-amber-50 text-amber-700 border-amber-200',
}

const UnitModal = ({ isOpen, onClose, onSave, unit, wingId, projectId, loading }) => {
  const isEditing = Boolean(unit)

  const empty = {
    unitNo:       '',
    unitType:     '2BHK',
    floor:        '',
    carpetArea:   '',
    scalableArea: '',
    facing:       '',
    status:       'Available',
    heldBy:       '',
    soldBy:       '',
    price:        '',
    isActive:     true,
  }

  const [form, setForm] = useState(empty)

  useEffect(() => {
    setForm(unit
      ? {
          unitNo:       unit.unitNo       || '',
          unitType:     unit.unitType     || '2BHK',
          floor:        unit.floor        ?? '',
          carpetArea:   unit.carpetArea   ?? '',
          scalableArea: unit.scalableArea ?? '',
          facing:       unit.facing       || '',
          status:       unit.status       || 'Available',
          heldBy:       unit.heldBy       || '',
          soldBy:       unit.soldBy       || '',
          price:        unit.price        ?? '',
          isActive:     unit.isActive     ?? true,
        }
      : empty
    )
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.unitNo.trim()) return alert('Unit number is required')
    onSave({
      ...form,
      wingId,
      projectId,
      floor:        Number(form.floor),
      carpetArea:   Number(form.carpetArea),
      scalableArea: Number(form.scalableArea),
      price:        Number(form.price),
      // Clear irrelevant fields based on status
      heldBy: form.status === 'Hold' ? form.heldBy : '',
      soldBy: form.status === 'Sold' ? form.soldBy : '',
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

          {/* Section: Unit Info */}
          <div className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2">
            Unit Information
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Unit No */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Unit No <span className="text-red-500">*</span>
              </label>
              <input type="text" name="unitNo" value={form.unitNo} onChange={handleChange}
                required placeholder="e.g. A-101"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Unit Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Unit Type <span className="text-red-500">*</span>
              </label>
              <select name="unitType" value={form.unitType} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                {UNIT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Floor */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Floor</label>
              <input type="number" name="floor" value={form.floor} onChange={handleChange}
                min="0" placeholder="e.g. 5"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Facing */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Facing</label>
              <select name="facing" value={form.facing} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select Facing</option>
                {['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'].map(f => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Section: Area */}
          <div className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2 pt-2">
            Area Details
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Carpet Area */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Carpet Area (sq ft)
              </label>
              <input type="number" name="carpetArea" value={form.carpetArea} onChange={handleChange}
                min="0" placeholder="e.g. 650"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Scalable / Built-up Area */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Scalable Area (sq ft)
              </label>
              <input type="number" name="scalableArea" value={form.scalableArea} onChange={handleChange}
                min="0" placeholder="e.g. 750"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Area Preview */}
          {form.carpetArea && form.scalableArea && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-blue-700 font-medium">Efficiency Ratio</span>
              <span className="text-sm font-bold text-blue-800">
                {Math.round((Number(form.carpetArea) / Number(form.scalableArea)) * 100)}% carpet
              </span>
            </div>
          )}

          {/* Price */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Price (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">₹</span>
              <input type="number" name="price" value={form.price} onChange={handleChange}
                min="0" placeholder="e.g. 4500000"
                className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Section: Status */}
          <div className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2 pt-2">
            Status
          </div>

          {/* Status Radio Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {UNIT_STATUSES.map(s => (
              <label key={s} className={`cursor-pointer flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                form.status === s
                  ? `border-transparent ${STATUS_STYLE[s]} ring-2 ring-offset-1 ring-blue-400`
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}>
                <input type="radio" name="status" value={s} checked={form.status === s} onChange={handleChange} className="sr-only" />
                <span className={`w-2 h-2 rounded-full ${
                  s === 'Available' ? 'bg-emerald-500' : s === 'Sold' ? 'bg-red-500' : 'bg-amber-500'
                }`} />
                {s}
              </label>
            ))}
          </div>

          {/* Conditional: Hold By */}
          {form.status === 'Hold' && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Held By (Customer Name)
              </label>
              <input type="text" name="heldBy" value={form.heldBy} onChange={handleChange}
                placeholder="e.g. Ramesh Sharma"
                className="w-full border border-amber-200 rounded-lg px-3 py-2.5 text-sm bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>
          )}

          {/* Conditional: Sold By */}
          {form.status === 'Sold' && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Sold By (Agent / Sales Person)
              </label>
              <input type="text" name="soldBy" value={form.soldBy} onChange={handleChange}
                placeholder="e.g. Priya Mehta"
                className="w-full border border-red-200 rounded-lg px-3 py-2.5 text-sm bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
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
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-cyan-600" />
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