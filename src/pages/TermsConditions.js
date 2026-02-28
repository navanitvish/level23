// src/pages/TermsConditions.jsx
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Scale, Plus, Pencil, Trash2, ChevronDown, ChevronUp,
  X, Loader2, Tag, FileText, AlertCircle, RefreshCw, CheckCircle
} from 'lucide-react'
import { termsApi, categoryApi } from '../api/endpoints'

// ─── HELPERS ──────────────────────────────────────────────────
const toArr = (res) => {
  if (Array.isArray(res))             return res
  if (Array.isArray(res?.data))       return res.data
  if (Array.isArray(res?.data?.data)) return res.data.data
  return []
}
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—'
const inputCls  = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-300"
const taCls     = `${inputCls} resize-none`

// ─── CONFIRM DELETE ────────────────────────────────────────────
const ConfirmDelete = ({ open, onClose, onConfirm, loading, name }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="font-bold text-gray-900 mb-1">Delete Term?</h3>
        <p className="text-sm text-gray-400 mb-6 line-clamp-2">{name}</p>
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

// ─── ADD / EDIT MODAL ──────────────────────────────────────────
const TermModal = ({ open, onClose, onSave, term, loading, categories }) => {
  const isEdit = Boolean(term)
  const [form, setForm] = useState({
    title:      term?.title       || '',
    description: term?.description || term?.content || '',
    categoryId: term?.categoryId  || term?.category?._id || '',
    isActive:   term?.isActive    ?? true,
  })

  // sync when term prop changes
  const [lastId, setLastId] = useState(term?._id)
  if (term?._id !== lastId) {
    setLastId(term?._id)
    setForm({
      title:       term?.title       || '',
      description: term?.description || term?.content || '',
      categoryId:  term?.categoryId  || term?.category?._id || '',
      isActive:    term?.isActive    ?? true,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim())       return alert('Title is required')
    if (!form.description.trim()) return alert('Description is required')
    if (!form.categoryId)         return alert('Please select a category')
    onSave(form, term?._id || term?.id)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-t-2xl px-6 py-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center border border-white/20">
              <Scale size={17} className="text-white" />
            </div>
            <h2 className="text-white font-bold text-lg">{isEdit ? 'Edit Term' : 'Add New Term'}</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Category dropdown — from API */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Category <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                value={form.categoryId}
                onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}
                required
                className={`${inputCls} appearance-none`}>
                <option value="">— Select Category —</option>
                {categories.map(c => (
                  <option key={c._id||c.id} value={c._id||c.id}>{c.name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              required
              className={inputCls}
              placeholder="e.g. Product Purchase Terms" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              required
              rows={6}
              className={taCls}
              placeholder="Enter terms description..." />
          </div>

          {/* isActive toggle */}
          <div className="flex items-center justify-between py-2.5 border-t border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-700">Active Status</p>
              <p className="text-xs text-gray-400">Term will be visible to users</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={form.isActive}
                onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))}
                className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-cyan-500" />
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
              {loading && <Loader2 size={14} className="animate-spin" />}
              {isEdit ? 'Update Term' : 'Create Term'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── ACCORDION TERM ROW ────────────────────────────────────────
const TermRow = ({ term, index, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all ${open ? 'border-blue-200 shadow-sm' : 'border-gray-200'}`}>
      {/* Row header */}
      <div
        className={`flex items-center justify-between px-5 py-4 cursor-pointer transition-colors ${open ? 'bg-blue-50/50' : 'bg-gray-50/50 hover:bg-gray-100/50'}`}
        onClick={() => setOpen(p => !p)}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-black flex-shrink-0">
            {index + 1}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{term.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              {(term.category?.name || term.categoryName) && (
                <span className="text-xs text-cyan-600 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <Tag size={9} /> {term.category?.name || term.categoryName}
                </span>
              )}
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${term.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                {term.isActive ? '● Active' : '● Inactive'}
              </span>
              {term.createdAt && (
                <span className="text-xs text-gray-400">{fmtDate(term.createdAt)}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 ml-3">
          <button onClick={e => { e.stopPropagation(); onEdit(term) }}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
            <Pencil size={13} />
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(term._id||term.id, term.title) }}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
            <Trash2 size={13} />
          </button>
          <div className={`w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}>
            <ChevronDown size={15} />
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {open && (
        <div className="px-5 py-4 border-t border-blue-100 bg-white">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{term.description || term.content}</p>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
const TermsConditions = () => {
  const qc = useQueryClient()

  const [activeCatId, setActiveCatId] = useState('all')
  const [termModal, setTermModal]     = useState({ open: false, term: null })
  const [delModal, setDelModal]       = useState({ open: false, id: null, name: '' })

  // ── QUERIES ──
  const { data: categories = [], isLoading: cLoad } = useQuery({
    queryKey: ['term-categories'],
    queryFn:  async () => toArr(await categoryApi.getAll()),
  })

  const { data: terms = [], isLoading: tLoad, isError, error, refetch } = useQuery({
    queryKey: ['terms'],
    queryFn:  async () => toArr(await termsApi.getAll()),
  })

  // ── MUTATIONS ──
  const createTerm = useMutation({
    mutationFn: (data) => termsApi.create(data),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['terms'] }); setTermModal({ open: false, term: null }) },
    onError:    (e) => alert(e?.response?.data?.message || 'Failed to create'),
  })

  const updateTerm = useMutation({
    mutationFn: ({ id, data }) => termsApi.update(id, data),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['terms'] }); setTermModal({ open: false, term: null }) },
    onError:    (e) => alert(e?.response?.data?.message || 'Failed to update'),
  })

  const deleteTerm = useMutation({
    mutationFn: (id) => termsApi.remove(id),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['terms'] }); setDelModal({ open: false }) },
    onError:    (e) => alert(e?.response?.data?.message || 'Failed to delete'),
  })

  const handleSave = (formData, id) => {
    // POST payload: { title, description, categoryId, isActive }
    const payload = {
      title:       formData.title,
      description: formData.description,
      categoryId:  formData.categoryId,
      isActive:    formData.isActive,
    }
    if (id) updateTerm.mutate({ id, data: payload })
    else    createTerm.mutate(payload)
  }

  const isLoading  = tLoad || cLoad
  const mutLoading = createTerm.isPending || updateTerm.isPending || deleteTerm.isPending

  // ── FILTER by category ──
  const filtered = activeCatId === 'all'
    ? terms
    : terms.filter(t => (t.categoryId || t.category?._id || t.category?.id) === activeCatId)

  // ── STATS ──
  const stats = {
    total:  terms.length,
    active: terms.filter(t => t.isActive !== false).length,
    cats:   categories.length,
  }

  return (
    <div className="space-y-5">

      {/* ─── HEADER ─────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-7 text-white">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Terms & Conditions</h1>
              <p className="text-slate-400 text-sm mt-0.5">Manage legal terms and policies for your customers</p>
            </div>
          </div>
          <button
            onClick={() => setTermModal({ open: true, term: null })}
            className="flex items-center gap-2 bg-white text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-slate-100 text-sm shadow-lg self-start lg:self-auto">
            <Plus size={16} /> Add New Term
          </button>
        </div>
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* ─── STATS ──────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Terms',   val: stats.total,  gradient: 'from-blue-600 to-cyan-500',     Icon: FileText     },
          { label: 'Active Terms',  val: stats.active, gradient: 'from-emerald-500 to-green-400', Icon: CheckCircle  },
          { label: 'Categories',    val: stats.cats,   gradient: 'from-violet-600 to-purple-500', Icon: Tag          },
        ].map(({ label, val, gradient, Icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <Icon size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{isLoading ? '—' : val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── CATEGORY TABS ──────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setActiveCatId('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${activeCatId === 'all' ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white border-transparent shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-slate-400'}`}>
          All Terms
          <span className="ml-1.5 opacity-70">({terms.length})</span>
        </button>
        {categories.map(c => {
          const count = terms.filter(t => (t.categoryId || t.category?._id) === (c._id||c.id)).length
          return (
            <button key={c._id||c.id} onClick={() => setActiveCatId(c._id||c.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${activeCatId === (c._id||c.id) ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-transparent shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'}`}>
              <Tag size={10} /> {c.name}
              <span className="opacity-70">({count})</span>
            </button>
          )
        })}
        {cLoad && <Loader2 size={14} className="animate-spin text-gray-400 ml-1" />}
      </div>

      {/* ─── TERMS LIST ─────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900">
              {activeCatId === 'all' ? 'All Terms' : categories.find(c=>(c._id||c.id)===activeCatId)?.name || 'Terms'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{filtered.length} term{filtered.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="p-5">
          {isLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
          ) : isError ? (
            <div className="text-center py-12">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <p className="text-red-500 font-semibold mb-4">{error?.response?.data?.message || 'Failed to load terms'}</p>
              <button onClick={() => refetch()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600">
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Scale className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-semibold mb-1">No terms found</p>
              <p className="text-gray-300 text-sm mb-5">
                {activeCatId !== 'all' ? 'No terms in this category.' : 'Get started by adding your first term.'}
              </p>
              <button onClick={() => setTermModal({ open: true, term: null })}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
                <Plus size={14} /> Add Term
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((term, idx) => (
                <TermRow
                  key={term._id||term.id||idx}
                  term={term}
                  index={idx}
                  onEdit={(t)         => setTermModal({ open: true, term: t })}
                  onDelete={(id, name) => setDelModal({ open: true, id, name })} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      <TermModal
        open={termModal.open}
        onClose={() => setTermModal({ open: false, term: null })}
        onSave={handleSave}
        term={termModal.term}
        loading={createTerm.isPending || updateTerm.isPending}
        categories={categories} />

      <ConfirmDelete
        open={delModal.open}
        onClose={() => setDelModal({ open: false })}
        onConfirm={() => deleteTerm.mutate(delModal.id)}
        loading={deleteTerm.isPending}
        name={delModal.name} />

      {/* GLOBAL LOADING */}
      {mutLoading && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-5 shadow-2xl flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span className="font-semibold text-gray-900 text-sm">Processing...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default TermsConditions