// src/pages/DemandLetter.jsx
import React, { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  FileText, Plus, Trash2, Pencil, X, Loader2, ChevronDown,
  CheckCircle, Clock, IndianRupee, Users, Building2,
  Hash, Save, RotateCcw,Eye, AlertCircle, Printer
} from 'lucide-react'
import { demandLetterApi, projectApi, unitApi } from '../api/endpoints'

// ─── HELPERS ──────────────────────────────────────────────────
const toArr = (res) => {
  if (Array.isArray(res))             return res
  if (Array.isArray(res?.data))       return res.data
  if (Array.isArray(res?.data?.data)) return res.data.data
  return []
}
const inr = (n) => '₹' + parseFloat(n || 0).toLocaleString('en-IN')
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' }) : '—'
const inputCls  = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-300"
const taCls     = `${inputCls} resize-none`
const F = ({ label, required, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
  </div>
)

const DEFAULT_MILESTONES = [
  { title: 'On Booking',                                percentage: 9  },
  { title: 'Within 15 days from the booking',          percentage: 16 },
  { title: 'Due On Commencement of Work',               percentage: 10 },
  { title: 'Due On Completion of Raft',                 percentage: 5  },
  { title: 'Due On Completion of Basement of 1st Slab', percentage: 5  },
  { title: 'Due On Completion of Basement of 2nd Slab', percentage: 5  },
  { title: 'Due On Completion of 1st Slab',             percentage: 2  },
  { title: 'Due On Completion of 2nd Slab',             percentage: 2  },
  { title: 'Due On Completion of 3rd Slab',             percentage: 2  },
  { title: 'Due On Completion of 4th Slab',             percentage: 2  },
  { title: 'Due On Completion of 5th Slab',             percentage: 2  },
  { title: 'Due On Completion of 6th Slab',             percentage: 2  },
  { title: 'Due On Completion of 8th Slab',             percentage: 1  },
  { title: 'Due On Completion of 12th Slab',            percentage: 1  },
  { title: 'Due On Completion of 14th Slab',            percentage: 1  },
  { title: 'Due On Completion of 16th Slab',            percentage: 1  },
  { title: 'Due On Completion of 18th Slab',            percentage: 1  },
  { title: 'Due On Completion of 20th Slab',            percentage: 1  },
  { title: 'Due On Completion of 22nd Slab',            percentage: 1  },
  { title: 'Due On Completion of 24th Slab',            percentage: 1  },
  { title: 'Due On Commencement of Plaster Work',       percentage: 5  },
  { title: 'Due On Commencement of Brickwork',          percentage: 10 },
]

const emptyForm = () => ({
  customerName: '', customerAddress: '', agreementDate: '',
  unitId: '', letterDate: new Date().toISOString().split('T')[0],
  subjectLine: '', totalConsideration: '', amountReceived: 0,
  paymentStatus: 'pending', sgstPercentage: 6, cgstPercentage: 6,
  milestones: DEFAULT_MILESTONES.map(m => ({ ...m, checked: false })),
})

const PAY_BADGE = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  partial: 'bg-blue-50 text-blue-700 border-blue-200',
  paid:    'bg-emerald-50 text-emerald-700 border-emerald-200',
}

// ══════════════════════════════════════════════════════════════
// DEMAND LETTER PRINT PREVIEW — exact format like image
// ══════════════════════════════════════════════════════════════
const DemandLetterPreview = ({ letter, onClose }) => {
  const printRef = useRef()

  const handlePrint = () => {
    const content = printRef.current.innerHTML
    const w = window.open('', '_blank')
    w.document.write(`
      <html><head><title>Demand Letter</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; color: #000; padding: 20mm; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #000; padding: 4px 8px; font-size: 10pt; }
        th { background: #f0f0f0; font-weight: bold; text-align: center; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .bold { font-weight: bold; }
        .underline { text-decoration: underline; }
        .italic { font-style: italic; }
        h-line { display: block; border-top: 1px solid #000; margin: 6px 0; }
        .header-row { display: flex; justify-content: space-between; margin-bottom: 16px; }
        .note-box { border: 1px solid #000; padding: 8px; margin: 10px 0; font-size: 10pt; }
        @media print { body { padding: 15mm; } }
      </style>
      </head><body>${content}</body></html>
    `)
    w.document.close()
    w.focus()
    setTimeout(() => { w.print(); w.close() }, 500)
  }

  if (!letter) return null

  const breakup      = letter.considerationBreakup || []
  const total        = letter.totalConsideration || 0
  const dueAmt       = breakup.reduce((s, m) => s + (total * m.percentage / 100), 0)
  const duePct       = breakup.reduce((s, m) => s + m.percentage, 0)
  const rcvd         = letter.amountReceived || 0
  const netDue       = dueAmt - rcvd
  const sgstPct      = letter.gst?.sgstPercentage || 6
  const cgstPct      = letter.gst?.cgstPercentage || 6
  const sgstAmt      = letter.gst?.sgstAmount  || netDue * sgstPct / 100
  const cgstAmt      = letter.gst?.cgstAmount  || netDue * cgstPct / 100
  const totalGst     = sgstAmt + cgstAmt
  const grandTotal   = netDue + totalGst
  const unit         = letter.unit || {}
  const project      = letter.project || {}
  const letterDate   = fmtDate(letter.property?.letterDate)

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-4">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-500" />
            <h2 className="font-bold text-gray-900">Demand Letter Preview</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90">
              <Printer size={15} /> Print / Download PDF
            </button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"><X size={16} /></button>
          </div>
        </div>

        {/* Letter content */}
        <div ref={printRef} className="p-10 font-serif text-sm text-black leading-relaxed" style={{ fontFamily: "'Times New Roman', Times, serif" }}>

          {/* Top: To + Date */}
          <div className="flex justify-between mb-4">
            <div><span className="font-bold">To,</span></div>
            <div><span className="font-bold">Date: </span>{letterDate}</div>
          </div>

          {/* Customer address */}
          <div className="mb-4 font-bold">
            <p className="uppercase">{letter.customer?.name}</p>
            {letter.customer?.address?.split(',').map((line, i) => (
              <p key={i} className="uppercase">{line.trim()}</p>
            ))}
          </div>

          <p className="mb-4">Dear Customer,</p>

          {/* Ref */}
          <div className="flex gap-4 mb-3">
            <span className="font-bold min-w-[50px]">Ref :</span>
            <span>
              Sale / Reservation of Unit No. <span className="font-bold underline">{unit.number || '—'}</span> in
              Floor <span className="font-bold underline">{unit.floor?.number || '—'}</span> vide provisional Allotment letter / Agreement for
              sale dated <span className="font-bold underline">{fmtDate(letter.customer?.agreementDate)}</span> in our Project{' '}
              <span className="font-bold">"{project.name || '—'}"</span>
            </span>
          </div>

          {/* Sub */}
          <div className="flex gap-4 mb-4">
            <span className="font-bold min-w-[50px]">Sub :</span>
            <span className="font-bold">{letter.property?.subjectLine || 'Demand Letter'}</span>
          </div>

          <p className="mb-4 text-justify">
            In accordance with the agreed terms of the above referred Allotment / Agreement and schedule of payment towards
            the reservation of the above Unit, you are requested to make the following payments against the installments due
            and payable by you to us as per the progress of work of the building.
          </p>

          {/* Main table */}
          <table className="w-full border-collapse border border-black mb-4 text-xs">
            <thead>
              <tr>
                <th colSpan={3} className="border border-black px-3 py-2 text-right font-bold bg-gray-100">
                  Total Consideration Rs. &nbsp;&nbsp; {total.toLocaleString('en-IN')}
                </th>
              </tr>
            </thead>
            <tbody>
              {breakup.map((m, i) => {
                const amt = total * m.percentage / 100
                return (
                  <tr key={i}>
                    <td className="border border-black px-3 py-1">{m.title}</td>
                    <td className="border border-black px-3 py-1 text-center">{m.percentage}%</td>
                    <td className="border border-black px-3 py-1 text-right">{amt.toLocaleString('en-IN')}</td>
                  </tr>
                )
              })}
              {/* Due as on date */}
              <tr>
                <td className="border border-black px-3 py-1">Due as on Date …….</td>
                <td className="border border-black px-3 py-1 text-center font-bold">{duePct}%</td>
                <td className="border border-black px-3 py-1 text-right font-bold">{dueAmt.toLocaleString('en-IN')}</td>
              </tr>
              {/* Amount received */}
              <tr>
                <td colSpan={2} className="border border-black px-3 py-1">(-) Amount Received so far…….</td>
                <td className="border border-black px-3 py-1 text-right">{rcvd.toLocaleString('en-IN')}</td>
              </tr>
              {/* Net due */}
              <tr>
                <td colSpan={2} className="border border-black px-3 py-1">Total Due as on Date …….</td>
                <td className="border border-black px-3 py-1 text-right font-bold">{netDue.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>

          {/* GST Table */}
          <table className="w-full border-collapse border border-black mb-4 text-xs">
            <tbody>
              <tr>
                <td colSpan={2} className="border border-black px-3 py-1 font-bold text-center bg-gray-100">Total Gst Consideration</td>
                <td className="border border-black px-3 py-1 text-right font-bold">{totalGst.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="border border-black px-3 py-1">SGST @ {sgstPct}% Payable …….</td>
                <td className="border border-black px-3 py-1 text-center">{sgstPct}%</td>
                <td className="border border-black px-3 py-1 text-right">₹ {sgstAmt.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="border border-black px-3 py-1">CGST @ {cgstPct}% Payable …….</td>
                <td className="border border-black px-3 py-1 text-center">{cgstPct}%</td>
                <td className="border border-black px-3 py-1 text-right">₹ {cgstAmt.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td colSpan={2} className="border border-black px-3 py-1">(-) Total Gst Received So Far</td>
                <td className="border border-black px-3 py-1 text-right">₹ {(0).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td colSpan={2} className="border border-black px-3 py-1">Total Gst Due On Date</td>
                <td className="border border-black px-3 py-1 text-right">₹ {totalGst.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td colSpan={2} className="border border-black px-3 py-1 font-bold">Total Due as on Date with GST …….</td>
                <td className="border border-black px-3 py-1 text-right font-bold">₹ {grandTotal.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>

          {/* Note */}
          <p className="mb-4 text-justify text-xs">
            You shall have to make this <span className="font-bold underline">due payment within 7 days</span> from the date of this letter issued, irrespective of whether
            you are availing/applied Loan Facility from any Financial Institution or not any delay in payment of installments
            would be charged financial charges as per the agreed terms in provisional allotment letter/agreement
          </p>

          {/* Payment box */}
          <div className="border border-black p-3 mb-6 text-xs">
            <p className="font-bold mb-2">You are requested to send Cheque/DD/Pay Order/RTGS/NEFT in favor of :</p>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="align-top pr-3 font-bold">1)</td>
                  <td>
                    <span className="font-bold underline">"AKSHAR BHAGWATI VENTURES LLP RERA DESIGNATED COLLECTION A/C FOR {project.name?.toUpperCase() || 'PROJECT'}"</span>,
                    Escrow A/c No - <span className="font-bold">9250200500448560</span>, AXIS Bank, Branch{' '}
                    <span className="font-bold underline">Corporate Branch Banking (CBB)</span>,
                    IFSC No. <span className="font-bold underline">UTIB0001394</span> (For Total Due Amount)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Sign off */}
          <p>Thanking you,</p>
          <p>Yours faithfully,</p>
          <p className="font-bold">For Akshar Bhagwati Ventures LLP</p>
          <br /><br />
          <p className="italic font-bold">Authorised Signatory.</p>
        </div>
      </div>
    </div>
  )
}

// ─── PAYMENT UPDATE MODAL ──────────────────────────────────────
const PaymentModal = ({ open, onClose, letter, onSubmit, loading }) => {
  if (!open || !letter) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
              <IndianRupee size={16} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm">Update Payment</h2>
              <p className="text-xs text-gray-400">{letter.customer?.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"><X size={16} /></button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <F label="Amount Received (₹)" required>
            <input name="amountReceived" type="number" defaultValue={letter.amountReceived || 0} className={inputCls} />
          </F>
          <F label="Payment Status" required>
            <div className="relative">
              <select name="paymentStatus" defaultValue={letter.paymentStatus || 'pending'} className={`${inputCls} appearance-none`}>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </F>
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
              {loading && <Loader2 size={14} className="animate-spin" />} Update
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
        <h3 className="font-bold text-gray-900 mb-1">Delete Demand Letter?</h3>
        <p className="text-sm text-gray-400 mb-6">{name}</p>
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
const DemandLetter = () => {
  const qc = useQueryClient()
  const [tab, setTab]                   = useState('create')
  const [selectedProject, setSelectedProject] = useState('')
  const [formData, setFormData]         = useState(emptyForm())
  const [newMilestone, setNewMilestone] = useState({ title: '', percentage: '' })
  const [payModal, setPayModal]         = useState({ open: false, letter: null })
  const [delModal, setDelModal]         = useState({ open: false, id: null, name: '' })
  const [previewLetter, setPreviewLetter] = useState(null)

  // ── QUERIES ──
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn:  async () => toArr(await projectApi.getAll()),
  })
  const { data: units = [] } = useQuery({
    queryKey: ['units-project', selectedProject],
    queryFn:  async () => toArr(await unitApi.getByProject(selectedProject)),
    enabled:  !!selectedProject,
  })
  const { data: letters = [], isLoading: lettersLoading } = useQuery({
    queryKey: ['demand-letters'],
    queryFn:  async () => toArr(await demandLetterApi.getAll()),
  })

  // ── MUTATIONS ──
  const createLetter = useMutation({
    mutationFn: (payload) => demandLetterApi.create(payload),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['demand-letters'] })
      resetForm()
      setTab('list')
      // show preview of newly created letter
      const created = res?.data?.data || res?.data || res
      if (created?._id) setPreviewLetter(created)
    },
    onError: (e) => alert(e?.response?.data?.message || 'Failed to create'),
  })

  const updatePayment = useMutation({
    mutationFn: ({ id, data }) => demandLetterApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['demand-letters'] }); setPayModal({ open: false, letter: null }) },
    onError:   (e) => alert(e?.response?.data?.message || 'Failed to update'),
  })

  const deleteLetter = useMutation({
    mutationFn: (id) => demandLetterApi.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['demand-letters'] }); setDelModal({ open: false }) },
    onError:   (e) => alert(e?.response?.data?.message || 'Failed to delete'),
  })

  // ── FORM HANDLERS ──
  const handleChange  = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }))
  const toggleMilestone = (idx) => setFormData(p => {
    const m = [...p.milestones]; m[idx] = { ...m[idx], checked: !m[idx].checked }; return { ...p, milestones: m }
  })
  const changePct = (idx, val) => setFormData(p => {
    const m = [...p.milestones]; m[idx] = { ...m[idx], percentage: parseFloat(val) || 0 }; return { ...p, milestones: m }
  })
  const addMilestone = () => {
    if (!newMilestone.title.trim()) return
    setFormData(p => ({ ...p, milestones: [...p.milestones, { title: newMilestone.title, percentage: parseFloat(newMilestone.percentage) || 0, checked: true }] }))
    setNewMilestone({ title: '', percentage: '' })
  }
  const removeMilestone = (idx) => setFormData(p => ({ ...p, milestones: p.milestones.filter((_, i) => i !== idx) }))

  // ── TOTALS ──
  const calcT = () => {
    const total = parseFloat(formData.totalConsideration) || 0
    const sel   = formData.milestones.filter(m => m.checked)
    const pct   = sel.reduce((s, m) => s + m.percentage, 0)
    const due   = total * pct / 100
    const rcvd  = parseFloat(formData.amountReceived) || 0
    const net   = due - rcvd
    const sgst  = net * formData.sgstPercentage / 100
    const cgst  = net * formData.cgstPercentage / 100
    return { pct, due, net, sgst, cgst, grand: net + sgst + cgst }
  }
  const T = calcT()

  // ── SUBMIT ──
  const handleSubmit = () => {
    if (!formData.customerName.trim()) return alert('Customer name is required')
    if (!formData.unitId)              return alert('Please select a unit')
    if (!formData.totalConsideration)  return alert('Total consideration is required')
    const sel = formData.milestones.filter(m => m.checked)
    if (!sel.length)                   return alert('Select at least one milestone')

    const payload = {
      customer: {
        name:          formData.customerName,
        agreementDate: formData.agreementDate,
        address:       formData.customerAddress,
      },
      property: {
        unitId:      formData.unitId,
        letterDate:  formData.letterDate,
        subjectLine: formData.subjectLine,
      },
      totalConsideration:   parseFloat(formData.totalConsideration),
      considerationBreakup: sel.map(m => ({ title: m.title, percentage: m.percentage })),
      gst: {
        sgstPercentage: parseFloat(formData.sgstPercentage),
        cgstPercentage: parseFloat(formData.cgstPercentage),
      },
      amountReceived: parseFloat(formData.amountReceived) || 0,
      paymentStatus:  formData.paymentStatus,
    }
    console.log('POST payload:', JSON.stringify(payload, null, 2))
    createLetter.mutate(payload)
  }

  const resetForm = () => { setFormData(emptyForm()); setSelectedProject('') }

  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    updatePayment.mutate({
      id:   payModal.letter._id || payModal.letter.id,
      data: { amountReceived: parseFloat(e.target.amountReceived.value), paymentStatus: e.target.paymentStatus.value }
    })
  }

  const stats = {
    total:   letters.length,
    pending: letters.filter(l => l.paymentStatus === 'pending').length,
    partial: letters.filter(l => l.paymentStatus === 'partial').length,
    paid:    letters.filter(l => l.paymentStatus === 'paid').length,
  }

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-7 text-white">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Demand Letters</h1>
              <p className="text-slate-400 text-sm mt-0.5">Generate & manage milestone-based demand letters</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-xl p-1 border border-white/20">
            <button onClick={() => setTab('create')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'create' ? 'bg-white text-slate-900 shadow' : 'text-white/70 hover:text-white'}`}>
              + Create
            </button>
            <button onClick={() => setTab('list')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${tab === 'list' ? 'bg-white text-slate-900 shadow' : 'text-white/70 hover:text-white'}`}>
              All Letters
              <span className="bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{stats.total}</span>
            </button>
          </div>
        </div>
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total',   value: stats.total,   gradient: 'from-blue-600 to-cyan-500',     Icon: FileText    },
          { label: 'Pending', value: stats.pending, gradient: 'from-amber-500 to-orange-400',  Icon: Clock       },
          { label: 'Partial', value: stats.partial, gradient: 'from-blue-500 to-indigo-500',   Icon: AlertCircle },
          { label: 'Paid',    value: stats.paid,    gradient: 'from-emerald-500 to-green-500', Icon: CheckCircle },
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

      {/* ══════════ CREATE TAB ══════════ */}
      {tab === 'create' && (
        <div className="space-y-5">

          {/* Customer */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
              <Users size={18} className="text-blue-500" /><h2 className="font-bold text-gray-900">Customer Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <F label="Customer Name" required>
                <input name="customerName" value={formData.customerName} onChange={handleChange} className={inputCls} placeholder="e.g. Aditya Sharma" />
              </F>
              <F label="Agreement Date">
                <input type="date" name="agreementDate" value={formData.agreementDate} onChange={handleChange} className={inputCls} />
              </F>
              <div className="md:col-span-2">
                <F label="Customer Address">
                  <textarea name="customerAddress" value={formData.customerAddress} onChange={handleChange} rows={2} className={taCls} placeholder="e.g. Flat 601, Tower 7, Palm Beach Road, Navi Mumbai" />
                </F>
              </div>
            </div>
          </div>

          {/* Property */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
              <Building2 size={18} className="text-violet-500" /><h2 className="font-bold text-gray-900">Property Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <F label="Select Project" required>
                <div className="relative">
                  <select value={selectedProject} onChange={e => { setSelectedProject(e.target.value); setFormData(p => ({ ...p, unitId: '' })) }} className={`${inputCls} appearance-none`}>
                    <option value="">— Select Project —</option>
                    {projects.map(p => <option key={p._id||p.id} value={p._id||p.id}>{p.name}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </F>
              <F label="Select Unit" required>
                <div className="relative">
                  <select name="unitId" value={formData.unitId} onChange={handleChange} disabled={!selectedProject} className={`${inputCls} appearance-none disabled:opacity-50`}>
                    <option value="">— Select Unit —</option>
                    {units.map(u => <option key={u._id||u.id} value={u._id||u.id}>{u.name} · {u.unitType}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </F>
              <F label="Letter Date">
                <input type="date" name="letterDate" value={formData.letterDate} onChange={handleChange} className={inputCls} />
              </F>
              <F label="Subject Line">
                <input name="subjectLine" value={formData.subjectLine} onChange={handleChange} className={inputCls} placeholder="Demand letter due on completion of 5th slab" />
              </F>
            </div>
          </div>

          {/* Total Consideration */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
              <IndianRupee size={18} className="text-emerald-500" /><h2 className="font-bold text-gray-900">Total Consideration</h2>
            </div>
            <div className="relative max-w-xs">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">₹</span>
              <input type="number" name="totalConsideration" value={formData.totalConsideration} onChange={handleChange}
                className="w-full pl-8 pr-4 py-3 text-xl font-bold border-2 border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="12000000" />
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Hash size={18} className="text-amber-500" />
                <h2 className="font-bold text-gray-900">Construction Milestones</h2>
              </div>
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                {formData.milestones.filter(m => m.checked).length} selected
              </span>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1 mb-4">
              {formData.milestones.map((m, idx) => {
                const amt = formData.totalConsideration ? parseFloat(formData.totalConsideration) * m.percentage / 100 : null
                return (
                  <div key={idx}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all ${m.checked ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}>
                    <input type="checkbox" checked={m.checked} onChange={() => toggleMilestone(idx)}
                      className="w-4 h-4 accent-blue-600 flex-shrink-0 cursor-pointer" />
                    <span className="flex-1 text-sm text-gray-800 cursor-pointer" onClick={() => toggleMilestone(idx)}>{m.title}</span>
                    {/* PRICE — shown when checked + totalConsideration filled */}
                    {m.checked && amt !== null && (
                      <span className="text-xs font-bold text-blue-600 bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg min-w-[90px] text-right flex-shrink-0">
                        {inr(amt)}
                      </span>
                    )}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <input type="number" value={m.percentage} onChange={e => changePct(idx, e.target.value)}
                        step="0.1" min="0"
                        className="w-14 px-2 py-1 text-xs font-bold text-right border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white" />
                      <span className="text-xs text-gray-400">%</span>
                      {idx >= DEFAULT_MILESTONES.length && (
                        <button onClick={() => removeMilestone(idx)} className="w-5 h-5 flex items-center justify-center text-red-400 hover:text-red-600 rounded ml-1">
                          <X size={11} />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Add custom milestone */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">+ Add Custom Milestone</p>
              <div className="flex gap-2">
                <input value={newMilestone.title} onChange={e => setNewMilestone(p => ({ ...p, title: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && addMilestone()}
                  className={`${inputCls} flex-1`} placeholder="e.g. Due on 10 days from booking" />
                <div className="relative w-24 flex-shrink-0">
                  <input type="number" value={newMilestone.percentage} onChange={e => setNewMilestone(p => ({ ...p, percentage: e.target.value }))}
                    className={`${inputCls} pr-7`} placeholder="5" step="0.1" min="0" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
                </div>
                <button onClick={addMilestone}
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl text-sm font-bold hover:opacity-90 flex items-center gap-1.5 flex-shrink-0">
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>

            {/* Total bar */}
            <div className="mt-4 flex items-center justify-between bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl px-5 py-3.5">
              <span className="font-semibold text-sm">Total: {T.pct.toFixed(1)}%</span>
              <span className="font-black text-lg">{inr(T.due)}</span>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
              <CheckCircle size={18} className="text-emerald-500" /><h2 className="font-bold text-gray-900">Payment Status</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <F label="Amount Received (₹)">
                <input type="number" name="amountReceived" value={formData.amountReceived} onChange={handleChange} className={inputCls} />
              </F>
              <F label="Payment Status">
                <div className="relative">
                  <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} className={`${inputCls} appearance-none`}>
                    <option value="pending">Pending</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Paid</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </F>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 text-lg mb-5 pb-4 border-b border-gray-100">Payment Summary</h2>
            <div className="space-y-2.5">
              {[
                { label: 'Total Consideration',              val: inr(formData.totalConsideration || 0), cls: '' },
                { label: `Due (${T.pct.toFixed(1)}%)`,      val: inr(T.due),                            cls: '' },
                { label: '(-) Amount Received',              val: `-${inr(formData.amountReceived||0)}`, cls: 'text-red-500' },
              ].map(({ label, val, cls }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className={`font-bold ${cls}`}>{val}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="font-bold text-gray-900">Net Due</span>
                <span className="font-black text-blue-600 text-base">{inr(T.net)}</span>
              </div>
              <div className="flex justify-between text-sm"><span className="text-gray-400">SGST @ {formData.sgstPercentage}%</span><span className="text-gray-600 font-medium">{inr(T.sgst)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400">CGST @ {formData.cgstPercentage}%</span><span className="text-gray-600 font-medium">{inr(T.cgst)}</span></div>
              <div className="border-t-2 border-gray-800 pt-3 flex justify-between">
                <span className="font-black text-gray-900 text-lg">Grand Total</span>
                <span className="font-black text-emerald-600 text-2xl">{inr(T.grand)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={handleSubmit} disabled={createLetter.isPending}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 disabled:opacity-50">
              {createLetter.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {createLetter.isPending ? 'Creating...' : 'Create & Preview'}
            </button>
            <button onClick={resetForm} className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50">
              <RotateCcw size={15} /> Reset
            </button>
          </div>
        </div>
      )}

      {/* ══════════ LIST TAB ══════════ */}
      {tab === 'list' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">All Demand Letters</h2>
            <p className="text-xs text-gray-400 mt-0.5">{letters.length} total</p>
          </div>

          {lettersLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
          ) : letters.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm mb-4">No demand letters yet</p>
              <button onClick={() => setTab('create')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
                <Plus size={14} /> Create First Letter
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['#','Customer','Unit / Project','Date','Total','Received','Status','Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {letters.map((l, idx) => (
                    <tr key={l._id||l.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-4 py-3.5 text-sm text-gray-400">{idx+1}</td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-semibold text-gray-900">{l.customer?.name||'—'}</p>
                        <p className="text-xs text-gray-400">{l.customer?.agreementDate ? fmtDate(l.customer.agreementDate) : ''}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-bold text-violet-700 bg-violet-100 px-2 py-1 rounded-lg">{l.unit?.name || l.property?.unitId || '—'}</span>
                        {l.project?.name && <p className="text-xs text-gray-400 mt-0.5">{l.project.name}</p>}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-gray-500">{l.property?.letterDate ? fmtDate(l.property.letterDate) : '—'}</td>
                      <td className="px-4 py-3.5 text-sm font-bold text-gray-900">{inr(l.totalConsideration)}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-emerald-600">{inr(l.amountReceived)}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${PAY_BADGE[l.paymentStatus]||PAY_BADGE.pending}`}>
                          {l.paymentStatus||'pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          {/* Preview / Print */}
                          <button onClick={() => setPreviewLetter(l)} title="Preview & Print"
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-blue-500 hover:bg-blue-50">
                            <Eye size={13} />
                          </button>
                          {/* Update payment */}
                          <button onClick={() => setPayModal({ open: true, letter: l })} title="Update payment"
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-emerald-500 hover:bg-emerald-50">
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => setDelModal({ open: true, id: l._id||l.id, name: l.customer?.name })}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* DEMAND LETTER PREVIEW MODAL */}
      {previewLetter && (
        <DemandLetterPreview letter={previewLetter} onClose={() => setPreviewLetter(null)} />
      )}

      {/* PAYMENT MODAL */}
      <PaymentModal open={payModal.open} onClose={() => setPayModal({ open: false, letter: null })}
        letter={payModal.letter} onSubmit={handlePaymentSubmit} loading={updatePayment.isPending} />

      {/* CONFIRM DELETE */}
      <ConfirmDelete open={delModal.open} onClose={() => setDelModal({ open: false })}
        onConfirm={() => deleteLetter.mutate(delModal.id)} loading={deleteLetter.isPending} name={delModal.name} />

      {/* GLOBAL LOADING */}
      {(createLetter.isPending || updatePayment.isPending || deleteLetter.isPending) && (
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

export default DemandLetter