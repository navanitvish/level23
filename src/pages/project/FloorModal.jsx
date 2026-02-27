// src/pages/project/FloorModal.jsx
import { useState, useEffect } from 'react'
import { X, Layers, Loader2 } from 'lucide-react'

const FloorModal = ({ isOpen, onClose, onSave, floor, wingId, projectId, loading }) => {
  const isEditing = Boolean(floor)
   const towerId =wingId;

  const getEmptyForm = () => ({
    name:   '',   // e.g. "Floor 1"
    number: '',   // e.g. "1"
  })

  const [form, setForm] = useState(getEmptyForm)

  useEffect(() => {
    setForm(floor
      ? { name: floor.name || '', number: floor.number ?? '' }
      : getEmptyForm()
    )
  }, [floor, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return alert('Floor name is required')
    // ── API body: { wingId, projectId, name, number } ──
    onSave({
      towerId,
      name:   form.name.trim(),
      number: form.number.trim() || form.name.trim(),
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">

        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-2xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-white font-bold text-lg">
              {isEditing ? 'Edit Floor' : 'Add Floor'}
            </h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Floor Name <span className="text-red-500">*</span>
              </label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                required placeholder="e.g. Floor 1"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Floor Number
              </label>
              <input type="text" name="number" value={form.number} onChange={handleChange}
                placeholder="e.g. 1"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Floor' : 'Add Floor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FloorModal