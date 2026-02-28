// src/pages/ManageFAQ.jsx
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  HelpCircle, Plus, Edit, Trash2, Search, X, 
  CheckCircle, XCircle, ChevronDown, ChevronUp, Eye,
  Loader2, Image as ImageIcon, Tag, Calendar, Info
} from 'lucide-react'
import { faqApi, categoryApi } from '../api/endpoints'

// ─── HELPERS ──────────────────────────────────────────────────
const toArr = (res) => {
  if (Array.isArray(res))             return res
  if (Array.isArray(res?.data))       return res.data
  if (Array.isArray(res?.data?.data)) return res.data.data
  return []
}
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—'

// ─── FAQ MODAL (Add / Edit) ────────────────────────────────────
const FAQModal = ({ open, onClose, onSave, faq, loading, categories }) => {
  const isEdit = Boolean(faq)
  const [form, setForm]         = useState({
    categoryId: faq?.categoryId || faq?.category?._id || '',
    title:      faq?.title || faq?.question || '',
    answer:     faq?.answer || '',
    isActive:   faq?.isActive ?? true,
  })
  const [images, setImages]     = useState([])
  const [previews, setPreviews] = useState([])

  // sync form when faq prop changes
  const [lastId, setLastId] = useState(faq?._id)
  if (faq?._id !== lastId) {
    setLastId(faq?._id)
    setForm({
      categoryId: faq?.categoryId || faq?.category?._id || '',
      title:      faq?.title || faq?.question || '',
      answer:     faq?.answer || '',
      isActive:   faq?.isActive ?? true,
    })
    setImages([]); setPreviews([])
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImages = (e) => {
    const files = Array.from(e.target.files)
    setImages(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  const removeImage = (idx) => {
    setImages(p => p.filter((_,i)=>i!==idx))
    setPreviews(p => p.filter((_,i)=>i!==idx))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('categoryId', form.categoryId)
    fd.append('title',      form.title)
    fd.append('answer',     form.answer)
    fd.append('isActive',   form.isActive)
    images.forEach(img => fd.append('images', img))
    onSave(fd, faq?._id || faq?.id)
  }

  if (!open) return null
  const inputCls = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-t-2xl px-6 py-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <HelpCircle size={18} className="text-white" />
            </div>
            <h2 className="text-white font-bold text-lg">{isEdit ? 'Edit FAQ' : 'Add New FAQ'}</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Category <span className="text-red-400">*</span></label>
            <div className="relative">
              <select name="categoryId" value={form.categoryId} onChange={handleChange} required className={`${inputCls} appearance-none`}>
                <option value="">— Select Category —</option>
                {categories.map(c => <option key={c._id||c.id} value={c._id||c.id}>{c.name}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Question (Title) <span className="text-red-400">*</span></label>
            <input type="text" name="title" value={form.title} onChange={handleChange} required
              className={inputCls} placeholder="e.g. What documents are required?" />
          </div>

          {/* Answer */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Answer <span className="text-red-400">*</span></label>
            <textarea name="answer" value={form.answer} onChange={handleChange} required rows={4}
              className={`${inputCls} resize-none`} placeholder="Write a clear and detailed answer..." />
          </div>

          {/* Images */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Images (optional)</label>
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-4 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all">
              <ImageIcon size={18} className="text-gray-400" />
              <span className="text-sm text-gray-500">Click to upload images</span>
              <input type="file" multiple accept="image/*" onChange={handleImages} className="hidden" />
            </label>
            {/* existing images in edit mode */}
            {isEdit && faq?.images?.length > 0 && previews.length === 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {faq.images.map((img, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <span className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-xs font-bold">saved</span>
                  </div>
                ))}
              </div>
            )}
            {/* new previews */}
            {previews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {previews.map((src, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-blue-200">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <X size={9} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* isActive toggle */}
          <div className="flex items-center justify-between py-2.5 border-t border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-700">Active Status</p>
              <p className="text-xs text-gray-400">FAQ will be visible to users</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-cyan-500"></div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
              {loading && <Loader2 size={14} className="animate-spin" />}
              {isEdit ? 'Update FAQ' : 'Create FAQ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── VIEW MODAL ────────────────────────────────────────────────
const ViewModal = ({ open, onClose, faq }) => {
  if (!open || !faq) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-t-2xl px-6 py-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
              <Eye size={16} className="text-white" />
            </div>
            <h2 className="text-white font-bold">FAQ Details</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status + Category */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${faq.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${faq.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
              {faq.isActive ? 'Active' : 'Inactive'}
            </span>
            {(faq.category?.name || faq.categoryName) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                <Tag size={11} /> {faq.category?.name || faq.categoryName}
              </span>
            )}
            {faq.createdAt && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-500 border border-gray-200">
                <Calendar size={11} /> {fmtDate(faq.createdAt)}
              </span>
            )}
          </div>

          {/* Question */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs font-bold text-blue-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <HelpCircle size={13} /> Question
            </p>
            <p className="text-gray-900 font-semibold text-sm leading-relaxed">{faq.title || faq.question}</p>
          </div>

          {/* Answer */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Info size={13} /> Answer
            </p>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
          </div>

          {/* Images */}
          {faq.images?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <ImageIcon size={13} /> Images ({faq.images.length})
              </p>
              <div className="grid grid-cols-3 gap-2">
                {faq.images.map((img, i) => (
                  <a key={i} href={img} target="_blank" rel="noopener noreferrer"
                    className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 hover:opacity-80 transition-opacity">
                    <img src={img} alt={`faq-img-${i}`} className="w-full h-full object-cover" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <button onClick={onClose}
            className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── CONFIRM DELETE ─────────────────────────────────────────────
const ConfirmDelete = ({ open, onClose, onConfirm, loading, name }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="font-bold text-gray-900 mb-1">Delete FAQ?</h3>
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

// ─── ACCORDION ROW ──────────────────────────────────────────────
const AccordionRow = ({ faq, onEdit, onDelete, onView, onToggle }) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <tr className="hover:bg-blue-50/20 transition-colors group">
      <td className="px-5 py-4">
        <button onClick={() => setExpanded(p => !p)} className="flex items-start gap-2 text-left w-full">
          <span className="mt-0.5 text-blue-500 flex-shrink-0">
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900">{faq.title || faq.question}</p>
            {expanded && <p className="text-xs text-gray-500 mt-2 leading-relaxed">{faq.answer}</p>}
            {faq.images?.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-blue-500 mt-1">
                <ImageIcon size={10} /> {faq.images.length} image{faq.images.length>1?'s':''}
              </span>
            )}
          </div>
        </button>
      </td>
      <td className="px-5 py-4">
        <span className="bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
          {faq.category?.name || faq.categoryName || '—'}
        </span>
      </td>
      <td className="px-5 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${faq.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${faq.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
          {faq.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">{fmtDate(faq.createdAt)}</td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-1">
          {/* VIEW */}
          <button onClick={() => onView(faq)} title="View details"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            <Eye size={14} />
          </button>
          {/* TOGGLE */}
          <button onClick={() => onToggle(faq._id||faq.id, !faq.isActive)} title={faq.isActive ? 'Deactivate' : 'Activate'}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
            {faq.isActive ? <XCircle size={14} /> : <CheckCircle size={14} />}
          </button>
          {/* EDIT */}
          <button onClick={() => onEdit(faq)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
            <Edit size={14} />
          </button>
          {/* DELETE */}
          <button onClick={() => onDelete(faq._id||faq.id, faq.title||faq.question)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  )
}

// ═══════════════════════════════════════════════════════════════
const ManageFAQ = () => {
  const qc = useQueryClient()

  const [searchTerm, setSearchTerm]       = useState('')
  const [statusFilter, setStatusFilter]   = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [faqModal, setFaqModal]           = useState({ open: false, faq: null })
  const [viewModal, setViewModal]         = useState({ open: false, faq: null })
  const [delModal, setDelModal]           = useState({ open: false, id: null, name: '' })

  // ── QUERIES ──
  const { data: faqs = [], isLoading: faqsLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn:  async () => toArr(await faqApi.getAll()),
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['faq-categories'],
    queryFn:  async () => toArr(await categoryApi.getAll()),
  })

  // ── MUTATIONS ──
  const createFaq = useMutation({
    mutationFn: (fd) => faqApi.create(fd),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['faqs'] }); setFaqModal({ open: false, faq: null }) },
    onError:   (e) => alert(e?.response?.data?.message || 'Failed to create'),
  })

  const updateFaq = useMutation({
    mutationFn: ({ id, fd }) => faqApi.update(id, fd),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['faqs'] }); setFaqModal({ open: false, faq: null }) },
    onError:   (e) => alert(e?.response?.data?.message || 'Failed to update'),
  })

  const toggleFaq = useMutation({
    mutationFn: ({ id, isActive }) => {
      const fd = new FormData(); fd.append('isActive', isActive); return faqApi.update(id, fd)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['faqs'] }),
    onError:   (e) => alert(e?.response?.data?.message || 'Failed'),
  })

  const deleteFaq = useMutation({
    mutationFn: (id) => faqApi.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['faqs'] }); setDelModal({ open: false }) },
    onError:   (e) => alert(e?.response?.data?.message || 'Failed to delete'),
  })

  // ── HANDLERS ──
  const handleSave = (fd, id) => {
    if (id) updateFaq.mutate({ id, fd })
    else    createFaq.mutate(fd)
  }

  // ── FILTER ──
  const filtered = faqs.filter(f => {
    const q = (f.title || f.question || '').toLowerCase()
    const a = (f.answer || '').toLowerCase()
    const matchSearch = !searchTerm || q.includes(searchTerm.toLowerCase()) || a.includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'all' ? true : statusFilter === 'active' ? f.isActive : !f.isActive
    const catName = f.category?.name || f.categoryName || ''
    const matchCat = categoryFilter === 'All' ? true : catName === categoryFilter
    return matchSearch && matchStatus && matchCat
  })

  const stats = {
    total:    faqs.length,
    active:   faqs.filter(f => f.isActive).length,
    inactive: faqs.filter(f => !f.isActive).length,
  }

  // unique category names from API data
  const catNames = ['All', ...new Set(faqs.map(f => f.category?.name || f.categoryName).filter(Boolean))]

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 rounded-2xl p-7 text-white">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 bg-white/15 rounded-2xl flex items-center justify-center border border-white/20">
                <HelpCircle size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Manage FAQs</h1>
                <p className="text-white/70 text-sm">Frequently asked questions for your customers</p>
              </div>
            </div>
            <div className="flex items-center gap-5 mt-3">
              {[
                { label: `${stats.total} Total`,    icon: HelpCircle  },
                { label: `${stats.active} Active`,  icon: CheckCircle },
                { label: `${stats.inactive} Inactive`, icon: XCircle  },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-1.5 text-sm text-white/80">
                  <Icon size={14} /><span>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => setFaqModal({ open: true, faq: null })}
            className="flex items-center gap-2 bg-white text-blue-700 font-bold px-5 py-2.5 rounded-xl hover:bg-blue-50 text-sm shadow-lg self-start lg:self-auto">
            <Plus size={16} /> Add FAQ
          </button>
        </div>
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* CATEGORY CHIPS */}
      <div className="flex items-center gap-2 flex-wrap">
        {catNames.map(cat => (
          <button key={cat} onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              categoryFilter === cat
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-transparent shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
            }`}>
            {cat}
            {cat !== 'All' && <span className="ml-1 opacity-60">({faqs.filter(f => (f.category?.name||f.categoryName) === cat).length})</span>}
          </button>
        ))}
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {[
              { key:'all',      label:`All (${stats.total})`       },
              { key:'active',   label:`Active (${stats.active})`   },
              { key:'inactive', label:`Inactive (${stats.inactive})`},
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setStatusFilter(key)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === key ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search questions or answers..."
              className="pl-9 pr-9 py-2 w-72 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><X size={13} /></button>}
          </div>
        </div>

        {faqsLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <HelpCircle className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm mb-4">{searchTerm || statusFilter !== 'all' || categoryFilter !== 'All' ? 'No FAQs match your filters.' : 'No FAQs yet.'}</p>
            <button onClick={() => setFaqModal({ open: true, faq: null })}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
              <Plus size={14} /> Add FAQ
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Question / Answer','Category','Status','Created','Actions'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(faq => (
                    <AccordionRow key={faq._id||faq.id} faq={faq}
                      onEdit={(f)  => setFaqModal({ open: true, faq: f })}
                      onView={(f)  => setViewModal({ open: true, faq: f })}
                      onDelete={(id, name) => setDelModal({ open: true, id, name })}
                      onToggle={(id, val)  => toggleFaq.mutate({ id, isActive: val })}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-400">Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of <span className="font-semibold text-gray-600">{faqs.length}</span> FAQs</p>
            </div>
          </>
        )}
      </div>

      {/* MODALS */}
      <FAQModal
        open={faqModal.open}
        onClose={() => setFaqModal({ open: false, faq: null })}
        onSave={handleSave}
        faq={faqModal.faq}
        loading={createFaq.isPending || updateFaq.isPending}
        categories={categories} />

      <ViewModal
        open={viewModal.open}
        onClose={() => setViewModal({ open: false, faq: null })}
        faq={viewModal.faq} />

      <ConfirmDelete
        open={delModal.open}
        onClose={() => setDelModal({ open: false })}
        onConfirm={() => deleteFaq.mutate(delModal.id)}
        loading={deleteFaq.isPending}
        name={delModal.name} />

      {/* GLOBAL LOADING */}
      {(createFaq.isPending || updateFaq.isPending || deleteFaq.isPending || toggleFaq.isPending) && (
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

export default ManageFAQ