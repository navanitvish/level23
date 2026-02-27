// src/pages/CostSheets.jsx
import React, { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectApi, wingApi, floorApi, unitApi, costSheetApi, adminSettingsApi } from '../api/endpoints'
import {
  FileText, Plus, Trash2, Pencil, X, Loader2, ChevronDown,
  ChevronLeft, ChevronRight, Printer, Eye, Save,
  Building2, Layers, Hash
} from 'lucide-react'

// ─── HELPERS ─────────────────────────────────────────────────
const toArr = (res) => {
  if (Array.isArray(res)) return res
  if (Array.isArray(res?.data)) return res.data
  if (Array.isArray(res?.data?.data)) return res.data.data
  return []
}
const inr = (n) => '₹' + parseFloat(n || 0).toLocaleString('en-IN')

// Print styles
const PRINT_STYLE = `
@media print {
  body > * { display: none !important; }
  #cost-sheet-print { display: block !important; position:fixed; top:0; left:0; width:100%; }
  @page { size: A4 landscape; margin: 8mm; }
}
#cost-sheet-print { display: none; }
`

// ─── INLINE LOGOS ─────────────────────────────────────────────
const AksharLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <svg width="36" height="50" viewBox="0 0 36 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 2C18 2 5 13 5 25C5 32.5 10.7 38.7 18 40C25.3 38.7 31 32.5 31 25C31 13 18 2 18 2Z" fill="#B8860B" opacity="0.85"/>
      <path d="M18 9C18 9 9 19 9 27C9 32.3 13 36.8 18 38.1C23 36.8 27 32.3 27 27C27 19 18 9 18 9Z" fill="#DAA520"/>
      <path d="M18 17C18 17 13 23 13 28C13 31.2 15.2 33.9 18 34.8C20.8 33.9 23 31.2 23 28C23 23 18 17 18 17Z" fill="#FFD700"/>
      <circle cx="18" cy="44" r="3.5" fill="#B8860B"/>
      <rect x="16.5" y="37" width="3" height="7" fill="#B8860B"/>
    </svg>
    <div>
      <div style={{ fontSize: '19px', fontWeight: '900', letterSpacing: '3px', color: '#1a1a1a', fontFamily: 'Georgia, serif', textTransform: 'uppercase' }}>AKSHAR</div>
      <div style={{ fontSize: '7px', letterSpacing: '4px', color: '#888', marginTop: '2px' }}>I N S P I R E &nbsp; L I F E</div>
    </div>
  </div>
)

const BhagwatiLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '9px', borderLeft: '1.5px solid #ccc', paddingLeft: '14px', marginLeft: '10px' }}>
    <svg width="30" height="34" viewBox="0 0 30 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="15" cy="22" rx="13" ry="11" fill="#1a1a2e"/>
      <ellipse cx="15" cy="22" rx="9" ry="7.5" fill="#0f3460"/>
      <circle cx="11" cy="19" r="2.5" fill="white" opacity="0.5"/>
      <circle cx="15" cy="13" r="5" fill="#16213e"/>
      <circle cx="15" cy="13" r="3" fill="#e94560"/>
      <ellipse cx="15" cy="4" rx="2.5" ry="3.5" fill="#999"/>
      <rect x="14" y="7" width="2" height="6" fill="#aaa"/>
    </svg>
    <div>
      <div style={{ fontSize: '16px', fontWeight: '900', letterSpacing: '1.5px', color: '#1a1a1a', fontFamily: 'Georgia, serif', textTransform: 'uppercase' }}>BHAGWATI</div>
      <div style={{ fontSize: '6.5px', letterSpacing: '2px', color: '#888', marginTop: '2px' }}>INNOVATION IN REALTY</div>
    </div>
  </div>
)

// ─── UPDATE MODAL ─────────────────────────────────────────────
const UpdateModal = ({ open, onClose, sheet, onSubmit, loading }) => {
  if (!open || !sheet) return null
  const inputCls = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-right font-semibold"
  const area = parseFloat(sheet.unit?.saleableArea || 0)
  const toRate = (total) => area ? Math.round(total / area) : total

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Pencil size={15} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm">Update Cost Sheet</h2>
              <p className="text-xs text-gray-400">{sheet.unit?.name || '—'} · Area: {area} sqft</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"><X size={16} /></button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-3">
          {[
            { name: 'basicRate',    label: 'Basic Rate (₹/sqft)',      val: toRate(sheet.basicRate) },
            { name: 'development',  label: 'Development (₹/sqft)',      val: toRate(sheet.development) },
            { name: 'dgBackup',     label: 'DG Backup (₹/sqft)',        val: toRate(sheet.dgBackup) },
            { name: 'recreation',   label: 'Recreation (₹/sqft)',       val: toRate(sheet.recreation) },
            { name: 'societyLegal', label: 'Society & Legal (₹/sqft)',  val: toRate(sheet.societyLegal) },
            { name: 'floorRise',    label: 'Floor Rise (₹/sqft)',       val: toRate(sheet.floorRise) },
            { name: 'otherCharges', label: 'Other Charges (Fixed ₹)',   val: sheet.otherCharges },
          ].map(({ name, label, val }) => (
            <div key={name} className="flex items-center justify-between gap-3">
              <label className="text-xs font-semibold text-gray-500 min-w-[160px]">{label}</label>
              <input type="number" name={name} defaultValue={val} className={inputCls} />
            </div>
          ))}
          <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">Enter per-sqft rates. Totals will auto-recalculate × {area} sqft.</p>
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
              {loading && <Loader2 size={14} className="animate-spin" />} Update
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── CONFIRM DELETE ───────────────────────────────────────────
const ConfirmDelete = ({ open, onClose, onConfirm, loading, name }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="font-bold text-gray-900 mb-1">Delete Cost Sheet?</h3>
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

// ─── COST SHEET DOCUMENT ─────────────────────────────────────
// `units` = array of sheet objects (from API or preview)
// Each unit must have: basicRate, development, dgBackup, recreation,
//   societyLegal, floorRise, otherCharges (all as TOTAL amounts)
//   + unit: { name, carpetArea, saleableArea, floor: { number } }
const CostSheetDocument = ({ units, projectName, reraNo, developer, notes }) => {
  const TH  = { border: '1px solid #555', padding: '7px 10px', textAlign: 'center', fontWeight: '700', fontSize: '11.5px', background: '#f0ece6', whiteSpace: 'nowrap' }
  const TD  = { border: '1px solid #555', padding: '7px 10px', textAlign: 'center', fontSize: '11.5px' }
  const TDL = { ...TD, textAlign: 'left', paddingLeft: '14px', fontWeight: '600' }

  const ROWS = [
    { key: 'basicRate',    label: 'Basic Rate' },
    { key: 'development',  label: 'Development Charges' },
    { key: 'dgBackup',     label: 'DG Backup' },
    { key: 'recreation',   label: 'Recreational Facilities' },
    { key: 'societyLegal', label: 'Society Formation and Legal Charges' },
    { key: 'floorRise',    label: 'Floor Rise' },
    { key: 'otherCharges', label: 'Other Charges' },
  ]

  // Derive per-sqft rate from first unit for the Rate column
  const firstUnit = units[0]
  const firstArea = parseFloat(firstUnit?.unit?.saleableArea ?? firstUnit?.saleableArea ?? 0)
  const rateOf = (key) => {
    if (key === 'otherCharges') return ''
    const total = parseFloat(firstUnit?.[key] || 0)
    if (!firstArea || !total) return ''
    return `₹ ${Math.round(total / firstArea).toLocaleString('en-IN')}`
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f5f0eb', padding: '22px', minWidth: '860px' }}>

      {/* ── HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <AksharLogo />
          <BhagwatiLogo />
        </div>
        <div style={{ textAlign: 'right', border: '1.5px solid #333', padding: '8px 14px', borderRadius: '4px', background: '#fff', minWidth: '185px' }}>
          <div style={{ fontSize: '9px', fontWeight: '700', color: '#333', letterSpacing: '1px' }}>MAHA RERA NO.</div>
          <div style={{ fontSize: '21px', fontWeight: '900', color: '#111', letterSpacing: '1px' }}>{reraNo || 'P51700053764'}</div>
          <div style={{ fontSize: '8px', color: '#555', marginTop: '2px' }}>Available on MahaRERA Website:</div>
          <div style={{ fontSize: '8px', color: '#0066cc' }}>www.maharera.maharashtra.gov.in</div>
        </div>
      </div>

      {/* ── PROJECT NAME ── */}
      <div style={{ textAlign: 'center', marginBottom: '18px' }}>
        <div style={{ fontSize: '9px', letterSpacing: '6px', color: '#888', marginBottom: '4px' }}>• C O D E N A M E •</div>
        <div style={{ fontSize: '40px', fontWeight: '900', letterSpacing: '5px', color: '#1a1a1a', lineHeight: 1, textTransform: 'uppercase', fontFamily: 'Georgia, serif' }}>
          {projectName || 'PROJECT'}
        </div>
      </div>

      {/* ── TABLE ── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1.5px solid #333', background: '#fff', marginBottom: '22px' }}>
        <thead>
          <tr>
            <td colSpan={units.length + 2} style={{ textAlign: 'center', fontWeight: '900', fontSize: '15px', padding: '10px', border: '1.5px solid #333', letterSpacing: '1px' }}>
              COST SHEET (CONSTRUCTION LINK PLAN)
            </td>
          </tr>
          <tr>
            <th style={{ ...TH, width: '230px' }}></th>
            <th style={TH}>Unit Type</th>
            {units.map(u => <th key={u._id} style={TH}>{u.unit?.name || u.unit?.number || '—'}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr style={{ background: '#fafaf8' }}>
            <td style={TDL}></td>
            <td style={{ ...TD, fontWeight: '600' }}>Floor</td>
            {units.map(u => <td key={u._id} style={TD}>{u.floor?.number ?? u.unit?.floor?.number ?? '—'}</td>)}
          </tr>
          <tr>
            <td style={TDL}></td>
            <td style={{ ...TD, fontWeight: '600' }}>Carpet Area (Sq.ft.)</td>
            {units.map(u => <td key={u._id} style={TD}>{u.unit?.carpetArea ?? '—'}</td>)}
          </tr>
          <tr style={{ background: '#fafaf8' }}>
            <td style={TDL}></td>
            <td style={{ ...TD, fontWeight: '700' }}>Sale Area (Sq.ft.)</td>
            {units.map(u => <td key={u._id} style={{ ...TD, fontWeight: '700' }}>{u.unit?.saleableArea ?? '—'}</td>)}
          </tr>

          {ROWS.map((row, i) => (
            <tr key={row.key} style={{ background: i % 2 === 0 ? '#fff' : '#fafaf8' }}>
              <td style={TDL}>{row.label}</td>
              <td style={TD}>{rateOf(row.key)}</td>
              {units.map(u => <td key={u._id} style={TD}>{inr(u[row.key] || 0)}</td>)}
            </tr>
          ))}

          <tr style={{ background: '#1a1a1a' }}>
            <td style={{ ...TDL, color: '#fff', fontSize: '14px', fontWeight: '900' }}>Total</td>
            <td style={{ ...TD, color: '#fff' }}></td>
            {units.map(u => {
              const t = (u.basicRate||0)+(u.development||0)+(u.dgBackup||0)+(u.recreation||0)+(u.societyLegal||0)+(u.floorRise||0)+(u.otherCharges||0)
              return <td key={u._id} style={{ ...TD, color: '#fff', fontWeight: '900', fontSize: '14px' }}>{inr(t)}</td>
            })}
          </tr>
        </tbody>
      </table>

      {/* ── NOTES ── */}
      <div style={{ maxWidth: '600px', margin: '0 auto', border: '1.5px solid #333', borderRadius: '4px', background: '#fff', padding: '12px 18px' }}>
        <div style={{ textAlign: 'center', fontWeight: '900', fontSize: '14px', marginBottom: '10px', letterSpacing: '1px' }}>NOTES:</div>
        {(notes || '').split('\n').filter(Boolean).map((line, i) => (
          <div key={i} style={{ fontSize: '11px', color: '#333', marginBottom: '5px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>{line}</div>
        ))}
      </div>
    </div>
  )
}

// ─── VIEW MODAL ───────────────────────────────────────────────
const ViewCostSheetModal = ({ open, onClose, sheet }) => {
  const printRef = useRef(null)
  if (!open || !sheet) return null

  const projectName = sheet.project?.name || '—'
  const reraNo = sheet.project?.reraNo || 'P51700053764'
  const developer = sheet.project?.developer || ''
  const defaultNotes = [
    '1) Floor Rise Charges:- Rs 50 Psf Per Floor From 7th Floor Onwards.',
    '2) GST, Stamp Duty, Registration And Any Other Statutory Charges At Actuals.',
    '3) Above Quotation Is For Internal Discussion Only.',
    `4) MahaRERA no - ${reraNo}.`,
    '5) Maintenance Charges at the time of possession.',
  ].join('\n')

  const handlePrint = () => {
    const content = printRef.current?.innerHTML
    if (!content) return
    const win = window.open('', '_blank', 'width=1200,height=860')
    win.document.write(`<html><head><title>Cost Sheet - ${sheet.unit?.name || projectName}</title>
      <style>body{margin:0;padding:0;background:#f5f0eb;}@page{size:A4 landscape;margin:8mm;}
      @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}</style>
      </head><body>${content}</body></html>`)
    win.document.close(); win.focus()
    setTimeout(() => { win.print(); win.close() }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-7 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
              <Eye size={15} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base">Cost Sheet Preview</h2>
              <p className="text-slate-400 text-xs">
                {sheet.unit?.name || '—'} · {projectName}
                {sheet.tower ? ` · ${sheet.tower.name}` : ''}
                {sheet.floor ? ` · Floor ${sheet.floor.number}` : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
              <Printer size={14} /> Print / Download PDF
            </button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10">
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="overflow-auto flex-1 bg-gray-100 p-6">
          <div ref={printRef}>
            <CostSheetDocument
              units={[sheet]}
              projectName={projectName}
              reraNo={reraNo}
              developer={developer}
              notes={defaultNotes}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
const CostSheets = () => {
  const qc = useQueryClient()

  const [tab, setTab] = useState('create')
  const [showModal, setShowModal] = useState(false)
  const [projectId, setProjectId] = useState('')
  const [wingId, setWingId] = useState('')
  const [selectedFloorIds, setSelectedFloorIds] = useState([])
  const [selectedUnitIds, setSelectedUnitIds] = useState([])
  const [notes, setNotes] = useState(
    '1) Floor Rise Charges:- Rs 50 Psf Per Floor From 7th Floor Onwards.\n2) GST, Stamp Duty, Registration And Any Other Statutory Charges At Actuals.\n3) Above Quotation Is For Internal Discussion Only.\n4) MahaRERA no - P51700053764.\n5) Maintenance Charges at the time of possession.'
  )
  const [generated, setGenerated] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [apiError, setApiError] = useState('')
  const [previewUnits, setPreviewUnits] = useState([])

  const [page, setPage] = useState(1)
  const LIMIT = 10
  const [updateModal, setUpdateModal] = useState({ open: false, sheet: null })
  const [delModal, setDelModal] = useState({ open: false, id: null, name: '' })
  const [viewModal, setViewModal] = useState({ open: false, sheet: null })

  // ── FETCH ADMIN SETTINGS ──
  const { data: adminSettings } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => { const res = await adminSettingsApi.get(); return res?.data || res },
  })

  // Per-sqft rates
  const ratesPerSqft = {
    basicRate:             adminSettings?.basicRate             || 16000,
    developmentCharges:    adminSettings?.developmentCharges    || 500,
    dgBackup:              adminSettings?.dgBackup              || 200,
    recreationalFacilities:adminSettings?.recreationalFacilities|| 200,
    societyFormation:      adminSettings?.societyFormation      || 100,
    floorRise:             adminSettings?.floorRise             || 50,
    otherCharges:          adminSettings?.otherCharges          || 1000000,
  }

  // ── QUERIES ──
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => toArr(await projectApi.getAll()),
  })
  const { data: wings = [] } = useQuery({
    queryKey: ['wings', projectId],
    queryFn: async () => toArr(await wingApi.getByProject(projectId)),
    enabled: !!projectId,
  })
  const { data: floors = [] } = useQuery({
    queryKey: ['floors', wingId],
    queryFn: async () => toArr(await floorApi.getByWing(wingId)),
    enabled: !!wingId,
  })
  const { data: allUnits = [] } = useQuery({
    queryKey: ['units-multi', selectedFloorIds],
    queryFn: async () => {
      if (!selectedFloorIds.length) return []
      const res = await Promise.all(selectedFloorIds.map(fid => unitApi.getByFloor(fid).then(toArr)))
      return res.flat()
    },
    enabled: selectedFloorIds.length > 0,
  })
  const { data: sheetsRes, isLoading: sheetsLoading } = useQuery({
    queryKey: ['cost-sheets', page],
    queryFn: async () => {
      const res = await costSheetApi.getAll({ page, limit: LIMIT })
      return res?.data || res
    },
    keepPreviousData: true,
  })

  const sheets = toArr(sheetsRes?.data || sheetsRes)
  const totalPages = sheetsRes?.totalPages || Math.ceil((sheetsRes?.total || 0) / LIMIT) || 1

  // ── MUTATIONS ──
  const saveCostSheet = useMutation({
    mutationFn: (payload) => costSheetApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cost-sheets'] }),
    onError: (e) => { setApiError(e?.response?.data?.message || 'Failed'); setGenerating(false) },
  })
  const updateSheet = useMutation({
    mutationFn: ({ id, data }) => costSheetApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cost-sheets'] }); setUpdateModal({ open: false, sheet: null }) },
    onError: (e) => alert(e?.response?.data?.message || 'Failed to update'),
  })
  const deleteSheet = useMutation({
    mutationFn: (id) => costSheetApi.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cost-sheets'] }); setDelModal({ open: false }) },
    onError: (e) => alert(e?.response?.data?.message || 'Failed to delete'),
  })

  // ── HELPERS ──
  const selectedProject = projects.find(p => (p._id || p.id) === projectId)
  const selectedFloors = floors.filter(f => selectedFloorIds.includes(f._id))
  const selectedUnits = selectedUnitIds.length > 0 ? allUnits.filter(u => selectedUnitIds.includes(u._id)) : allUnits

  const toggleFloor = (fid) => { setSelectedFloorIds(p => p.includes(fid) ? p.filter(x => x !== fid) : [...p, fid]); setSelectedUnitIds([]) }
  const toggleUnit = (uid) => setSelectedUnitIds(p => p.includes(uid) ? p.filter(x => x !== uid) : [...p, uid])
  const toggleAllUnits = () => setSelectedUnitIds(p => p.length === allUnits.length ? [] : allUnits.map(u => u._id))

  // Calc total amounts from per-sqft rates × area
  const calcTotals = (unit) => {
    const area = parseFloat(unit.saleableArea || 0)
    return {
      basicRate:    area * ratesPerSqft.basicRate,
      development:  area * ratesPerSqft.developmentCharges,
      dgBackup:     area * ratesPerSqft.dgBackup,
      recreation:   area * ratesPerSqft.recreationalFacilities,
      societyLegal: area * ratesPerSqft.societyFormation,
      floorRise:    area * ratesPerSqft.floorRise,
      otherCharges: ratesPerSqft.otherCharges,
    }
  }

  // ── GENERATE ──
  const handleGenerate = async () => {
    if (!projectId) return alert('Please select a project')
    if (!wingId) return alert('Please select a wing/tower')
    if (!selectedFloorIds.length) return alert('Please select at least one floor')
    if (!selectedUnits.length) return alert('Please select at least one unit')
    setApiError(''); setGenerating(true)
    try {
      await Promise.all(selectedUnits.map(u => saveCostSheet.mutateAsync({ unitId: u._id, otherCharges: ratesPerSqft.otherCharges })))
      // Build preview using local calc
      setPreviewUnits(selectedUnits.map(u => ({
        ...calcTotals(u),
        _id: u._id,
        unit: { ...u, floor: floors.find(f => f._id === (u.floorId || u.floor?._id)) || u.floor },
        floor: floors.find(f => f._id === (u.floorId || u.floor?._id)) || u.floor,
      })))
      setGenerated(true); setShowModal(false); setTab('list'); setPage(1)
    } catch (e) { /* handled */ }
    finally { setGenerating(false) }
  }

  const handleUpdateSubmit = (e) => {
    e.preventDefault()
    const els = e.target
    const area = parseFloat(updateModal.sheet?.unit?.saleableArea || 0)
    updateSheet.mutate({
      id: updateModal.sheet._id || updateModal.sheet.id,
      data: {
        basicRate:    (parseFloat(els.basicRate.value)    || 0) * area,
        development:  (parseFloat(els.development.value)  || 0) * area,
        dgBackup:     (parseFloat(els.dgBackup.value)     || 0) * area,
        recreation:   (parseFloat(els.recreation.value)   || 0) * area,
        societyLegal: (parseFloat(els.societyLegal.value) || 0) * area,
        floorRise:    (parseFloat(els.floorRise.value)    || 0) * area,
        otherCharges: parseFloat(els.otherCharges.value)  || 0,
      },
    })
  }

  return (
    <div className="space-y-5">
      <style>{PRINT_STYLE}</style>

      {/* HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-7 text-white">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Cost Sheet Generator</h1>
              <p className="text-slate-400 text-sm mt-0.5">Construction Link Plan — select floors & units to generate</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 rounded-xl p-1 border border-white/20">
              <button onClick={() => setTab('create')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'create' ? 'bg-white text-slate-900 shadow' : 'text-white/70 hover:text-white'}`}>+ Create</button>
              <button onClick={() => setTab('list')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${tab === 'list' ? 'bg-white text-slate-900 shadow' : 'text-white/70 hover:text-white'}`}>
                All Sheets
                <span className="bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{sheets.length}</span>
              </button>
            </div>
            {tab === 'create' && (
              <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-white text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-slate-100 text-sm shadow-lg">
                <Plus size={16} /> Create Cost Sheet
              </button>
            )}
          </div>
        </div>
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* CREATE TAB */}
      {tab === 'create' && (
        generated && previewUnits.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Generated Cost Sheet</h2>
                <p className="text-sm text-gray-500">{previewUnits.length} units · {selectedFloors.length} floors</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setShowModal(true); setGenerated(false) }} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">← Edit</button>
                <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:opacity-90 text-sm">
                  <Printer size={15} /> Print / PDF
                </button>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-auto">
              <CostSheetDocument units={previewUnits} projectName={selectedProject?.name} reraNo={selectedProject?.reraNo} developer={selectedProject?.developer} notes={notes} />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center min-h-[400px] text-center p-10">
            <FileText className="w-14 h-14 text-gray-200 mb-4" />
            <p className="text-gray-500 font-semibold mb-2">No cost sheet generated yet</p>
            <p className="text-gray-400 text-sm mb-5">Click "Create Cost Sheet" to select project, floors & units</p>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold px-6 py-3 rounded-xl text-sm">
              <Plus size={16} /> Create Cost Sheet
            </button>
          </div>
        )
      )}

      {/* LIST TAB */}
      {tab === 'list' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">All Cost Sheets</h2>
            <p className="text-xs text-gray-400 mt-0.5">Page {page} · {LIMIT} per page</p>
          </div>

          {sheetsLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
          ) : sheets.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm mb-4">No cost sheets yet</p>
              <button onClick={() => { setTab('create'); setShowModal(true) }} className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
                <Plus size={14} /> Create First Sheet
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['#', 'Unit', 'Project', 'Tower', 'Floor', 'Basic', 'Dev', 'DG', 'Rec', 'Soc', 'Flr Rise', 'Other', 'Grand Total', 'Actions'].map(h => (
                        <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {sheets.map((s, idx) => {
                      // API returns TOTAL amounts directly — use as-is
                      const basic = s.basicRate    || 0
                      const dev   = s.development  || 0
                      const dg    = s.dgBackup     || 0
                      const rec   = s.recreation   || 0
                      const soc   = s.societyLegal || 0
                      const flr   = s.floorRise    || 0
                      const other = s.otherCharges || 0
                      const total = basic + dev + dg + rec + soc + flr + other

                      return (
                        <tr key={s._id || s.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-3 py-3 text-sm text-gray-400">{(page - 1) * LIMIT + idx + 1}</td>
                          {/* Unit */}
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600">
                                {(s.unit?.number || '').toString().slice(-2) || '—'}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-900">{s.unit?.name || '—'}</p>
                                <p className="text-xs text-gray-400 capitalize">{s.unit?.unitType || ''}</p>
                              </div>
                            </div>
                          </td>
                          {/* Project */}
                          <td className="px-3 py-3 text-xs text-gray-600">{s.project?.name || '—'}</td>
                          {/* Tower */}
                          <td className="px-3 py-3">
                            {s.tower
                              ? <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-lg font-semibold">{s.tower.name}</span>
                              : <span className="text-xs text-gray-400">—</span>}
                          </td>
                          {/* Floor */}
                          <td className="px-3 py-3">
                            {s.floor
                              ? <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg font-bold">F{s.floor.number}</span>
                              : <span className="text-xs text-gray-400">—</span>}
                          </td>
                          <td className="px-3 py-3 text-xs text-gray-700 font-medium">{inr(basic)}</td>
                          <td className="px-3 py-3 text-xs text-gray-700 font-medium">{inr(dev)}</td>
                          <td className="px-3 py-3 text-xs text-gray-700 font-medium">{inr(dg)}</td>
                          <td className="px-3 py-3 text-xs text-gray-700 font-medium">{inr(rec)}</td>
                          <td className="px-3 py-3 text-xs text-gray-700 font-medium">{inr(soc)}</td>
                          <td className="px-3 py-3 text-xs text-gray-700 font-medium">{inr(flr)}</td>
                          <td className="px-3 py-3 text-xs font-bold text-amber-600">{inr(other)}</td>
                          <td className="px-3 py-3 text-sm font-black text-gray-900">{inr(total)}</td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-1">
                              <button onClick={() => setViewModal({ open: true, sheet: s })} title="View Cost Sheet"
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-emerald-500 hover:bg-emerald-50">
                                <Eye size={13} />
                              </button>
                              <button onClick={() => setUpdateModal({ open: true, sheet: s })}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-blue-500 hover:bg-blue-50">
                                <Pencil size={13} />
                              </button>
                              <button onClick={() => setDelModal({ open: true, id: s._id || s.id, name: s.unit?.name || 'this sheet' })}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-400">Page <span className="font-semibold text-gray-700">{page}</span> of <span className="font-semibold text-gray-700">{totalPages}</span></p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed">
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
                    return (
                      <button key={p} onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${p === page ? 'bg-blue-600 text-white shadow' : 'border border-gray-200 text-gray-600 hover:bg-white'}`}>
                        {p}
                      </button>
                    )
                  })}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* HIDDEN PRINT AREA */}
      <div id="cost-sheet-print">
        <CostSheetDocument units={previewUnits} projectName={selectedProject?.name} reraNo={selectedProject?.reraNo} developer={selectedProject?.developer} notes={notes} />
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-7 py-5 rounded-t-2xl flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-white font-bold text-xl">Create Cost Sheet</h2>
                <p className="text-slate-300 text-xs mt-0.5">Construction Link Plan Generator</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white/60 hover:text-white"><X size={22} /></button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {selectedProject && (
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-4 flex flex-wrap gap-4">
                  <div className="flex-1"><p className="text-xs text-slate-400">Project</p><p className="text-white font-bold text-sm">{selectedProject.name}</p></div>
                  {selectedProject.reraNo && <div><p className="text-xs text-slate-400">RERA</p><p className="text-white font-bold text-sm">{selectedProject.reraNo}</p></div>}
                  {selectedProject.developer && <div><p className="text-xs text-slate-400">Developer</p><p className="text-white font-bold text-sm">{selectedProject.developer}</p></div>}
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Building2 size={13} />Project & Wing</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Select Project</label>
                    <div className="relative">
                      <select value={projectId} onChange={e => { setProjectId(e.target.value); setWingId(''); setSelectedFloorIds([]); setSelectedUnitIds([]) }}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                        <option value="">— Select Project —</option>
                        {projects.map(p => <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Select Wing / Tower</label>
                    <div className="relative">
                      <select value={wingId} onChange={e => { setWingId(e.target.value); setSelectedFloorIds([]); setSelectedUnitIds([]) }}
                        disabled={!projectId} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none disabled:opacity-50">
                        <option value="">— Select Wing —</option>
                        {wings.map(w => <option key={w._id || w.id} value={w._id || w.id}>{w.name}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {floors.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><Layers size={13} />Select Floors</p>
                    <div className="flex gap-2">
                      <button onClick={() => { setSelectedFloorIds(floors.map(f => f._id)); setSelectedUnitIds([]) }} className="text-xs text-blue-600 font-semibold hover:underline">All</button>
                      <span className="text-gray-300">|</span>
                      <button onClick={() => { setSelectedFloorIds([]); setSelectedUnitIds([]) }} className="text-xs text-gray-500 font-semibold hover:underline">None</button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {floors.map(f => {
                      const isSel = selectedFloorIds.includes(f._id)
                      return (
                        <button key={f._id} onClick={() => toggleFloor(f._id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all flex items-center gap-1.5 ${isSel ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>
                          {isSel && <span className="font-black">✓</span>} Floor {f.number}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {allUnits.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><Hash size={13} />Select Units</p>
                    <button onClick={toggleAllUnits} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-semibold">
                      {selectedUnitIds.length === allUnits.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white max-h-80">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0">
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-3 py-3"><input type="checkbox" checked={selectedUnitIds.length === allUnits.length && allUnits.length > 0} onChange={toggleAllUnits} className="w-4 h-4 accent-blue-600 cursor-pointer" /></th>
                          {['Unit', 'Floor', 'Type', 'Carpet', 'Saleable', 'Facing', 'Status', 'Est. Total'].map(h => (
                            <th key={h} className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {allUnits.map((u, idx) => {
                          const isSelected = selectedUnitIds.includes(u._id)
                          const stCls = { available: 'bg-emerald-100 text-emerald-700', sold: 'bg-red-100 text-red-700', hold: 'bg-amber-100 text-amber-700' }[u.status] || 'bg-gray-100 text-gray-600'
                          const area = parseFloat(u.saleableArea || 0)
                          const totals = calcTotals(u)
                          const est = Object.values(totals).reduce((a, b) => a + b, 0)
                          const floorForUnit = floors.find(f => f._id === (u.floorId || u.floor?._id))
                          return (
                            <tr key={u._id} onClick={() => toggleUnit(u._id)}
                              className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'} hover:bg-blue-50/60`}>
                              <td className="px-3 py-2.5"><input type="checkbox" checked={isSelected} onChange={() => toggleUnit(u._id)} onClick={e => e.stopPropagation()} className="w-4 h-4 accent-blue-600 cursor-pointer" /></td>
                              <td className="px-3 py-2.5">
                                <div className="flex items-center gap-2">
                                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>{(u.number || '').toString().slice(-2)}</div>
                                  <span className="font-bold text-gray-900 text-xs">{u.name}</span>
                                </div>
                              </td>
                              <td className="px-3 py-2.5"><span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg font-semibold">F{floorForUnit?.number ?? u.floor?.number ?? '—'}</span></td>
                              <td className="px-3 py-2.5"><span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-lg font-bold uppercase">{u.unitType || '—'}</span></td>
                              <td className="px-3 py-2.5 text-xs text-gray-600">{u.carpetArea || '—'}</td>
                              <td className="px-3 py-2.5 text-xs font-bold text-gray-900">{u.saleableArea || '—'}</td>
                              <td className="px-3 py-2.5"><span className="text-xs capitalize text-gray-500">{u.facing || '—'}</span></td>
                              <td className="px-3 py-2.5"><span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${stCls}`}>{u.status || '—'}</span></td>
                              <td className="px-3 py-2.5 text-right text-xs font-bold text-slate-800">{area > 0 ? inr(est) : '—'}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Notes</p>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-white rounded-b-2xl flex-shrink-0">
              {apiError && <div className="mb-3 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">{apiError}</div>}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {selectedUnits.length > 0
                    ? <span className="text-blue-600 font-semibold">{selectedUnits.length} units · {selectedFloorIds.length} floors · Other: {inr(ratesPerSqft.otherCharges)}</span>
                    : 'Select floors & units above'}
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setShowModal(false)} disabled={generating} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50">Cancel</button>
                  <button onClick={handleGenerate} disabled={generating}
                    className="px-6 py-2.5 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold rounded-xl hover:opacity-90 text-sm flex items-center gap-2 disabled:opacity-60 min-w-[180px] justify-center">
                    {generating ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : <><Save size={15} /> Generate Cost Sheet</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <UpdateModal open={updateModal.open} onClose={() => setUpdateModal({ open: false, sheet: null })} sheet={updateModal.sheet} onSubmit={handleUpdateSubmit} loading={updateSheet.isPending} />
      <ConfirmDelete open={delModal.open} onClose={() => setDelModal({ open: false })} onConfirm={() => deleteSheet.mutate(delModal.id)} loading={deleteSheet.isPending} name={delModal.name} />
      <ViewCostSheetModal open={viewModal.open} onClose={() => setViewModal({ open: false, sheet: null })} sheet={viewModal.sheet} />

      {(generating || updateSheet.isPending || deleteSheet.isPending) && (
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

export default CostSheets