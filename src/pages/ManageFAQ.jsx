// src/pages/ManageFAQ.jsx
import { useState } from 'react'
import {
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Download,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

// ─────────────────────────────────────────────
// STATIC FAQ DATA
// ─────────────────────────────────────────────
const STATIC_FAQS = [
  {
    id: 1,
    question: 'What documents are required to book a property?',
    answer:
      'You need a valid government-issued ID (Aadhaar, Passport, or PAN card), address proof, and income proof (salary slips or ITR). Additional documents may be required based on the property type.',
    category: 'Documentation',
    isActive: true,
    createdAt: '2024-01-10',
  },
  {
    id: 2,
    question: 'What is the booking amount for a unit?',
    answer:
      'The booking amount is typically 10% of the total property value. This amount is adjustable against the final payment at the time of registration.',
    category: 'Payment',
    isActive: true,
    createdAt: '2024-01-12',
  },
  {
    id: 3,
    question: 'How is the total price calculated?',
    answer:
      'The total price is calculated as Area (sq ft) × Price per sq ft. Additional charges such as parking, club membership, and maintenance deposits may apply on top of the base price.',
    category: 'Pricing',
    isActive: true,
    createdAt: '2024-01-15',
  },
  {
    id: 4,
    question: 'What is the possession timeline?',
    answer:
      'Possession timelines vary per project and are mentioned in the sale agreement. Typically, projects are delivered within 36–48 months from the date of booking, subject to RERA guidelines.',
    category: 'General',
    isActive: true,
    createdAt: '2024-01-18',
  },
  {
    id: 5,
    question: 'Are home loans available for these properties?',
    answer:
      'Yes, all our properties are approved by leading banks and HFCs including SBI, HDFC, ICICI, and Axis Bank. Our team can assist you with the loan application process.',
    category: 'Payment',
    isActive: true,
    createdAt: '2024-02-01',
  },
  {
    id: 6,
    question: 'What is the cancellation and refund policy?',
    answer:
      'Cancellations made within 30 days of booking are eligible for a full refund minus processing fees. Post 30 days, a cancellation charge of 2% of the booking amount applies.',
    category: 'Policy',
    isActive: false,
    createdAt: '2024-02-05',
  },
  {
    id: 7,
    question: 'Is there a maintenance charge after possession?',
    answer:
      'Yes, a monthly maintenance charge is applicable post possession. The amount varies per project and covers common area upkeep, security, and amenities.',
    category: 'General',
    isActive: true,
    createdAt: '2024-02-10',
  },
  {
    id: 8,
    question: 'Can NRIs purchase properties?',
    answer:
      'Yes, Non-Resident Indians (NRIs) can purchase residential properties under FEMA regulations. Special assistance is available for NRI buyers including digital KYC and POA facilitation.',
    category: 'General',
    isActive: false,
    createdAt: '2024-02-14',
  },
]

const CATEGORIES = ['All', 'General', 'Payment', 'Documentation', 'Pricing', 'Policy']

// ─────────────────────────────────────────────
// FAQ MODAL
// ─────────────────────────────────────────────
const FAQModal = ({ isOpen, onClose, onSave, faq, loading }) => {
  const isEditing = Boolean(faq)

  const emptyForm = { question: '', answer: '', category: 'General', isActive: true }
  const [form, setForm] = useState(faq || emptyForm)

  const prevId = faq?.id
  const [syncedId, setSyncedId] = useState(prevId)
  if (faq?.id !== syncedId) {
    setSyncedId(faq?.id)
    setForm(faq || emptyForm)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-2xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-white font-bold text-lg">
              {isEditing ? 'Edit FAQ' : 'Add New FAQ'}
            </h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Question */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Question <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="question"
              value={form.question}
              onChange={handleChange}
              required
              placeholder="e.g. What documents are required?"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Answer */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Answer <span className="text-red-500">*</span>
            </label>
            <textarea
              name="answer"
              value={form.answer}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Write a clear and detailed answer..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {CATEGORIES.filter(c => c !== 'All').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Is Active */}
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-700">Active Status</p>
              <p className="text-xs text-gray-400">FAQ will be visible to users</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-cyan-600"></div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              {isEditing ? 'Update FAQ' : 'Create FAQ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// ACCORDION PREVIEW (read-only expand)
// ─────────────────────────────────────────────
const AccordionRow = ({ faq, onEdit, onDelete, onToggle }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <tr className="hover:bg-blue-50/30 transition-colors group">
      {/* Question (expandable) */}
      <td className="px-5 py-4">
        <button
          onClick={() => setExpanded(p => !p)}
          className="flex items-start gap-2 text-left w-full"
        >
          <span className="mt-0.5 text-blue-500 flex-shrink-0">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900">{faq.question}</p>
            {expanded && (
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">{faq.answer}</p>
            )}
          </div>
        </button>
      </td>

      {/* Category */}
      <td className="px-5 py-4">
        <span className="inline-block bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
          {faq.category}
        </span>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
          faq.isActive
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-gray-100 text-gray-600 border-gray-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${faq.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
          {faq.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>

      {/* Created */}
      <td className="px-5 py-4 text-sm text-gray-400 whitespace-nowrap">
        {faq.createdAt ? new Date(faq.createdAt).toLocaleDateString() : '—'}
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggle(faq.id)}
            title={faq.isActive ? 'Deactivate' : 'Activate'}
            className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            {faq.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          </button>
          <button
            onClick={() => onEdit(faq)}
            className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(faq.id)}
            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
const ManageFAQ = () => {
  const [faqs, setFaqs]                       = useState(STATIC_FAQS)
  const [searchTerm, setSearchTerm]           = useState('')
  const [statusFilter, setStatusFilter]       = useState('all')
  const [categoryFilter, setCategoryFilter]   = useState('All')
  const [isModalOpen, setIsModalOpen]         = useState(false)
  const [editingFaq, setEditingFaq]           = useState(null)

  // ─── FILTER ───────────────────────────────
  const getFiltered = () => {
    return faqs.filter(f => {
      const matchSearch =
        f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchTerm.toLowerCase())
      const matchStatus =
        statusFilter === 'all' ? true : statusFilter === 'active' ? f.isActive : !f.isActive
      const matchCategory =
        categoryFilter === 'All' ? true : f.category === categoryFilter
      return matchSearch && matchStatus && matchCategory
    })
  }

  // ─── HANDLERS ─────────────────────────────
  const handleAdd = () => {
    setEditingFaq(null)
    setIsModalOpen(true)
  }

  const handleEdit = (faq) => {
    setEditingFaq(faq)
    setIsModalOpen(true)
  }

  const handleSave = (formData) => {
    if (editingFaq) {
      setFaqs(prev => prev.map(f => f.id === editingFaq.id ? { ...f, ...formData } : f))
    } else {
      const newFaq = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
      }
      setFaqs(prev => [...prev, newFaq])
    }
    setIsModalOpen(false)
    setEditingFaq(null)
  }

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return
    setFaqs(prev => prev.filter(f => f.id !== id))
  }

  const handleToggle = (id) => {
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f))
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(faqs, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `faqs-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // ─── STATS ────────────────────────────────
  const stats = {
    total:    faqs.length,
    active:   faqs.filter(f => f.isActive).length,
    inactive: faqs.filter(f => !f.isActive).length,
  }

  const filtered = getFiltered()

  return (
    <div className="min-h-screen bg-white p-6 space-y-6">

      {/* ── Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-3xl font-bold mb-1">Manage FAQs</h1>
              <p className="text-white/75 text-sm">Frequently asked questions for your customers</p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <HelpCircle className="h-4 w-4" />
                  <span className="font-medium">{stats.total} Total</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">{stats.active} Active</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <XCircle className="h-4 w-4" />
                  <span className="font-medium">{stats.inactive} Inactive</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={handleAdd}
                className="bg-white text-blue-600 hover:bg-white/90 font-semibold px-5 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add FAQ
              </button>
            </div>
          </div>
        </div>
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* ── Category Chips ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              categoryFilter === cat
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-transparent shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {cat}
            {cat !== 'All' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({faqs.filter(f => f.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Main Table Card ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between p-5 border-b border-gray-100">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'all',      label: `All (${stats.total})` },
              { key: 'active',   label: `Active (${stats.active})` },
              { key: 'inactive', label: `Inactive (${stats.inactive})` },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  statusFilter === key
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions or answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-9 py-2 w-72 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Question / Answer', 'Category', 'Status', 'Created', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(faq => (
                  <AccordionRow
                    key={faq.id}
                    faq={faq}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                  />
                ))}
              </tbody>
            </table>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <p className="text-xs text-gray-400">
                Showing <span className="font-medium text-gray-600">{filtered.length}</span> of{' '}
                <span className="font-medium text-gray-600">{faqs.length}</span> FAQs
              </p>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-20">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">No FAQs found</h3>
            <p className="text-sm text-gray-500 mb-5">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'All'
                ? 'Try adjusting your search or filters.'
                : 'Get started by adding your first FAQ.'}
            </p>
            <button
              onClick={handleAdd}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add FAQ
            </button>
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      <FAQModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingFaq(null)
        }}
        onSave={handleSave}
        faq={editingFaq}
      />
    </div>
  )
}

export default ManageFAQ