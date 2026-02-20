// src/pages/project/WingModal.jsx
import { useState, useEffect } from 'react'
import { X, Layers, Loader2 } from 'lucide-react'

const WingModal = ({ isOpen, onClose, onSave, wing, projectId, loading }) => {
  const isEditing = Boolean(wing)

  const empty = {
    name:        '',
    totalFloors: '',
    description: '',
    isActive:    true,
  }

  const [form, setForm] = useState(empty)

  useEffect(() => {
    setForm(wing
      ? { name: wing.name || '', totalFloors: wing.totalFloors || '', description: wing.description || '', isActive: wing.isActive ?? true }
      : empty
    )
  }, [wing, isOpen])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return alert('Wing name is required')
    onSave({
      ...form,
      projectId,
      totalFloors: Number(form.totalFloors) || 0,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-2xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-white font-bold text-lg">
              {isEditing ? 'Edit Wing / Tower' : 'Add Wing / Tower'}
            </h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Wing Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Wing / Tower Name <span className="text-red-500">*</span>
            </label>
            <input type="text" name="name" value={form.name} onChange={handleChange}
              required placeholder="e.g. Wing A  or  Tower 1"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Total Floors */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Total Floors
            </label>
            <input type="number" name="totalFloors" value={form.totalFloors} onChange={handleChange}
              min="0" placeholder="e.g. 10"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Description
            </label>
            <textarea name="description" value={form.description} onChange={handleChange}
              rows={2} placeholder="Optional notes about this wing..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-700">Active</p>
              <p className="text-xs text-gray-400">Wing is open for booking</p>
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
              {isEditing ? 'Update Wing' : 'Add Wing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WingModal