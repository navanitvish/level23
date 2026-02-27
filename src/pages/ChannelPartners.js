// src/pages/ChannelPartners.jsx
//
// ╔══════════════════════════════════════════════════════════╗
// ║  API STRUCTURE                                           ║
// ║  partner._id               → partner document ID        ║
// ║  partner.companyName       → company name               ║
// ║  partner.type              → broker/agent/builder       ║
// ║  partner.commissionPercent → commission %               ║
// ║  partner.status            → pending/active/inactive    ║
// ║  partner.user.name         → ✅ name (nested)           ║
// ║  partner.user.email        → ✅ email (nested)          ║
// ║  partner.user.mobile       → ✅ mobile number (nested)  ║
// ║  partner.user.image        → ✅ cloudinary URL (nested) ║
// ║  partner.user.isOnline     → online status (nested)     ║
// ╚══════════════════════════════════════════════════════════╝

import React, { useState, useRef, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { channelPartnerApi } from '../api/endpoints'

// ─── Flatten nested partner object ───────────────────────────
const F = (p) => ({
  _id:               p?._id                        ?? '',
  userId:            p?.user?._id                  ?? '',
  name:              p?.user?.name     || p?.name  || '',
  email:             p?.user?.email    || p?.email || '',
  mobile:            String(p?.user?.mobile ?? p?.mobile ?? ''),
  image:             p?.user?.image    || p?.image || null,
  companyName:       p?.companyName                ?? '',
  type:              p?.type                       ?? 'broker',
  commissionPercent: p?.commissionPercent          ?? 0,
  status:            p?.status                     ?? 'pending',
  projectsCount:     p?.projectsCount              ?? 0,
  revenue:           p?.revenue                    ?? 0,
  createdAt:         p?.createdAt                  ?? '',
  isOnline:          p?.user?.isOnline             ?? false,
  isEmailVerified:   p?.user?.isEmailVerified      ?? false,
  isMobileVerified:  p?.user?.isMobileVerified     ?? false,
})

const EMPTY = () => ({
  role:'partner', loginType:'password',
  name:'', email:'', mobile:'', password:'', fcmToken:'',
  companyName:'', type:'broker', commissionPercent:'',
  address:'', city:'', state:'', notes:'', status:'pending', image:null,
})

// ─── Canvas creative overlay ─────────────────────────────────
const drawCreative = (canvas, tplImg, pd) => new Promise(resolve => {
  const W = tplImg.naturalWidth || 899, H = tplImg.naturalHeight || 1599
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')
  const s = x => Math.round(x * W / 899)
  const v = y => Math.round(y * H / 1599)
  ctx.drawImage(tplImg, 0, 0, W, H)

  const paint = (logo) => {
    // Zone 1: Top-right logo circle
    const ls=s(105), lx=W-ls-s(15), ly=v(245)
    ctx.save(); ctx.shadowColor='rgba(0,0,0,0.3)'; ctx.shadowBlur=s(10)
    ctx.beginPath(); ctx.arc(lx+ls/2,ly+ls/2,ls/2,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill(); ctx.restore()
    ctx.beginPath(); ctx.arc(lx+ls/2,ly+ls/2,ls/2,0,Math.PI*2); ctx.strokeStyle='rgba(160,190,230,0.8)'; ctx.lineWidth=s(3); ctx.stroke()
    if (logo) {
      ctx.save(); ctx.beginPath(); ctx.arc(lx+ls/2,ly+ls/2,ls/2-s(2),0,Math.PI*2); ctx.clip(); ctx.drawImage(logo,lx,ly,ls,ls); ctx.restore()
    } else {
      const init=(pd.name||'CP').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
      ctx.save(); ctx.beginPath(); ctx.arc(lx+ls/2,ly+ls/2,ls/2-s(2),0,Math.PI*2); ctx.fillStyle='rgba(25,55,140,0.9)'; ctx.fill(); ctx.restore()
      ctx.fillStyle='#fff'; ctx.font=`bold ${s(36)}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle'
      ctx.fillText(init,lx+ls/2,ly+ls/2); ctx.textAlign='left'; ctx.textBaseline='alphabetic'
    }
    // Zone 2: Bottom-left name+company
    ctx.fillStyle='#fff'; ctx.fillRect(0,v(1392),s(436),v(120))
    ctx.fillStyle='rgb(10,28,90)'; ctx.fillRect(0,v(1396),s(5),v(112))
    ctx.fillStyle='rgb(10,28,80)'; ctx.font=`bold ${s(52)}px sans-serif`; ctx.textBaseline='top'
    ctx.fillText(pd.name||'',s(16),v(1396))
    ctx.fillStyle='rgba(10,28,90,0.15)'; ctx.fillRect(s(16),v(1452),s(404),s(2))
    ctx.fillStyle='rgb(40,65,125)'; ctx.font=`${s(29)}px sans-serif`; ctx.fillText(pd.companyName||'',s(16),v(1459))
    ctx.textBaseline='alphabetic'
    // Zone 3: Bottom-right mobile
    ctx.fillStyle='#fff'; ctx.fillRect(s(435),v(1510),W-s(435),H-v(1510))
    ctx.fillStyle='rgba(10,28,90,0.1)'; ctx.fillRect(s(440),v(1510),W-s(440),s(2))
    const ix=s(448),iy=v(1524),ir=s(26)
    ctx.beginPath(); ctx.arc(ix+ir,iy+ir,ir,0,Math.PI*2); ctx.fillStyle='rgb(10,28,90)'; ctx.fill()
    ctx.fillStyle='#fff'; ctx.font=`bold ${s(26)}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle'
    ctx.fillText('✆',ix+ir,iy+ir); ctx.textAlign='left'; ctx.textBaseline='alphabetic'
    ctx.fillStyle='rgb(10,28,80)'; ctx.font=`bold ${s(58)}px sans-serif`; ctx.fillText(pd.mobile||'',s(510),v(1574))
    resolve(canvas.toDataURL('image/png'))
  }
  if (pd.image) { const i=new Image(); i.crossOrigin='anonymous'; i.onload=()=>paint(i); i.onerror=()=>paint(null); i.src=pd.image } else paint(null)
})

// ════════════════════════════════════════════════════
//  VIEW MODAL
// ════════════════════════════════════════════════════
const ViewModal = ({ p, onClose, onEdit }) => {
  const sc = p.status==='active'?'bg-emerald-100 text-emerald-700 border-emerald-200':p.status==='pending'?'bg-amber-100 text-amber-700 border-amber-200':'bg-gray-100 text-gray-600 border-gray-200'
  const sd = p.status==='active'?'bg-emerald-400':p.status==='pending'?'bg-amber-400':'bg-gray-400'

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" onClick={e=>e.stopPropagation()}>

        {/* ── Header with avatar ── */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 px-6 py-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              {p.image
                ? <img src={p.image} alt={p.name} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/20"/>
                : <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-black">{(p.name||'P').charAt(0).toUpperCase()}</div>
              }
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${p.isOnline?'bg-emerald-400':'bg-gray-500'}`}/>
            </div>
            <div>
              <h2 className="text-white font-black text-xl">{p.name||'—'}</h2>
              <p className="text-slate-400 text-sm">{p.companyName||'—'}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold rounded-full border capitalize ${sc}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sd}`}/>{p.status}
                </span>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-500/20 text-blue-300 capitalize border border-blue-500/30">{p.type}</span>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">{p.commissionPercent}% comm.</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Info grid ── */}
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            {[
              {icon:'📧', label:'Email',    val: p.email   || '—'},
              {icon:'📞', label:'Mobile',   val: p.mobile  || '—'},
              {icon:'📁', label:'Projects', val: p.projectsCount ?? 0},
              {icon:'💰', label:'Revenue',  val: p.revenue ? `₹${Number(p.revenue).toLocaleString('en-IN')}` : '₹0'},
              {icon:'✅', label:'Email Verified', val: p.isEmailVerified ? 'Yes' : 'No'},
              {icon:'📅', label:'Joined',   val: p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—'},
            ].map(({icon,label,val})=>(
              <div key={label} className="bg-gray-50 rounded-xl px-3.5 py-3 border border-gray-100">
                <p className="text-xs text-gray-400 mb-0.5">{icon} {label}</p>
                <p className="text-sm font-bold text-gray-800 truncate">{String(val)}</p>
              </div>
            ))}
          </div>

          {/* IDs */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">System IDs</p>
            <div className="space-y-1">
              <div className="flex justify-between"><span className="text-xs text-slate-400">Partner ID</span><span className="text-xs font-mono text-slate-600">{p._id || '—'}</span></div>
              <div className="flex justify-between"><span className="text-xs text-slate-400">User ID</span><span className="text-xs font-mono text-slate-600">{p.userId || '—'}</span></div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-5 pb-5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Close</button>
          <button onClick={onEdit} className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-bold rounded-xl hover:opacity-90 flex items-center justify-center gap-2 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
            Edit Partner
          </button>
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════
//  EDIT MODAL
// ════════════════════════════════════════════════════
const EditModal = ({ p, onClose, onSave, saving }) => {
  const [form, setForm] = useState({
    name:              p.name              || '',
    email:             p.email             || '',
    mobile:            p.mobile            || '',
    companyName:       p.companyName       || '',
    type:              p.type              || 'broker',
    commissionPercent: p.commissionPercent ?? 0,
    status:            p.status            || 'pending',
  })
  const c = (e) => setForm(f=>({...f,[e.target.name]:e.target.value}))
  const s = (e) => { e.preventDefault(); onSave(p._id, form) }
  const inp = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white transition-colors"

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden" onClick={e=>e.stopPropagation()}>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {p.image
              ? <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover border-2 border-white/30"/>
              : <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-black text-lg">{(p.name||'P').charAt(0)}</div>
            }
            <div>
              <h2 className="text-white font-black text-lg leading-tight">Edit Partner</h2>
              <p className="text-blue-100 text-xs">{p.name} · {p.companyName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={s} className="overflow-y-auto flex-1">
          <div className="p-6 space-y-5">

            <div>
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3 pb-2 border-b border-blue-100">Personal Info</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                  <input name="name" value={form.name} onChange={c} required className={inp} placeholder="Partner Name"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Mobile</label>
                  <input name="mobile" value={form.mobile} onChange={c} maxLength={10} className={inp} placeholder="9999999999"/>
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Email <span className="text-red-400">*</span></label>
                <input name="email" type="email" value={form.email} onChange={c} required className={inp} placeholder="partner@email.com"/>
              </div>
            </div>

            <div>
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3 pb-2 border-b border-blue-100">Company Details</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Company Name</label>
                  <input name="companyName" value={form.companyName} onChange={c} className={inp} placeholder="Company name"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Type</label>
                  <select name="type" value={form.type} onChange={c} className={inp}>
                    <option value="broker">Broker</option>
                    <option value="agent">Agent</option>
                    <option value="builder">Builder</option>
                    <option value="consultant">Consultant</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Commission %</label>
                  <input name="commissionPercent" type="number" value={form.commissionPercent} onChange={c} min="0" max="100" step="0.5" className={inp}/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Status</label>
                  <select name="status" value={form.status} onChange={c} className={inp}>
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex gap-3 border-t border-gray-100 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
              {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>}
              {saving ? 'Saving…' : '✓ Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════
//  MAIN PAGE
// ════════════════════════════════════════════════════
export default function ChannelPartners() {
  const qc = useQueryClient()

  // UI state
  const [viewP,     setViewP]     = useState(null)   // flattened partner for View modal
  const [editP,     setEditP]     = useState(null)   // flattened partner for Edit modal
  const [addOpen,   setAddOpen]   = useState(false)
  const [studio,    setStudio]    = useState(false)
  const [search,    setSearch]    = useState('')
  const [selected,  setSelected]  = useState([])
  const [imgPrev,   setImgPrev]   = useState(null)
  const [addForm,   setAddForm]   = useState(EMPTY())

  // Creative studio state
  const [tplDataUrl, setTplDataUrl] = useState(null)
  const [tplImg,     setTplImg]     = useState(null)
  const [   setTplFile]    = useState(null)
  const [creatives,  setCreatives]  = useState([])
  const [prevIdx,    setPrevIdx]    = useState(0)
  const [generating, setGenerating] = useState(false)
  const [sendSt,     setSendSt]     = useState(null)

  const cvs = useRef(null)

  // ── Fetch ──────────────────────────────────────────────────
  const { data: raw = [], isLoading } = useQuery({
    queryKey: ['channel-partners'],
    queryFn:  channelPartnerApi.getAll,
    select: res => {
      const d = res?.data || res
      const arr = Array.isArray(d) ? d : (Array.isArray(d?.data) ? d.data : (Array.isArray(d?.partners) ? d.partners : []))
      return arr
    },
  })
  const partners = raw.map(F)

  // ── Mutations ──────────────────────────────────────────────
  const createMut = useMutation({
    mutationFn: d => { const fd=new FormData(); Object.entries(d).forEach(([k,v])=>{ if(v!==null&&v!==undefined&&v!=='') fd.append(k,v) }); return channelPartnerApi.create(fd) },
    onSuccess:  () => { qc.invalidateQueries({queryKey:['channel-partners']}); closeAdd() },
    onError:    e  => alert(e?.response?.data?.message || 'Failed to add partner'),
  })

  // NOTE: update API — PATCH /api/channel-partners/:id
  // Body: { name, email, mobile, companyName, type, commissionPercent, status }
  const updateMut = useMutation({
    mutationFn: ({id, data}) => channelPartnerApi.update(id, data),
    onSuccess:  () => { qc.invalidateQueries({queryKey:['channel-partners']}); setEditP(null) },
    onError:    e  => alert(e?.response?.data?.message || 'Failed to update partner'),
  })

  const sendMut = useMutation({
    mutationFn: payload => channelPartnerApi.sendCreative(payload),
    onSuccess:  () => { setSendSt('done'); setSelected([]) },
    onError:    e  => { setSendSt('error'); alert(e?.response?.data?.message||'Failed to send') },
  })

  // ── Handlers ───────────────────────────────────────────────
  const closeAdd     = ()  => { setAddOpen(false); setAddForm(EMPTY()); setImgPrev(null) }
  const chgAdd       = e   => setAddForm(f=>({...f,[e.target.name]:e.target.value}))
  const chgImg       = e   => { const f=e.target.files[0]; if(!f) return; setAddForm(p=>({...p,image:f})); const r=new FileReader(); r.onloadend=()=>setImgPrev(r.result); r.readAsDataURL(f) }
  const submitAdd    = e   => { e.preventDefault(); if(!addForm.password) return alert('Password required'); createMut.mutate(addForm) }
  const handleEdit   = ()  => { setEditP(viewP); setViewP(null) }
  const saveEdit     = (id,data) => updateMut.mutate({id, data})
  const toggleOne    = id  => setSelected(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id])
  const toggleAll    = e   => setSelected(e.target.checked ? filtered.map(p=>p._id) : [])
  const openStudio   = ids => { const s=ids||selected; if(!s.length) return alert('Select at least one partner'); setSelected(s); setStudio(true); setSendSt(null); setCreatives([]) }

  const onTpl = e => {
    const f=e.target.files[0]; if(!f) return
    setTplFile(f); setCreatives([]); setSendSt(null)
    const r=new FileReader(); r.onloadend=()=>{ setTplDataUrl(r.result); const i=new Image(); i.onload=()=>setTplImg(i); i.src=r.result }; r.readAsDataURL(f)
  }

  const generate = useCallback(async () => {
    if (!tplImg) return alert('Upload a template first')
    setGenerating(true)
    try {
      const res=[]
      for (const id of selected) {
        const p=partners.find(x=>x._id===id); if(!p) continue
        const b64=await drawCreative(cvs.current,tplImg,{name:p.name,companyName:p.companyName,mobile:p.mobile,image:p.image})
        res.push({partnerId:id,partnerName:p.name,email:p.email,imageBase64:b64})
      }
      setCreatives(res); setPrevIdx(0)
    } finally { setGenerating(false) }
  }, [tplImg, selected, partners])

  const sendAll = () => { if(!creatives.length) return; setSendSt('sending'); sendMut.mutate({creatives}) }
  const dlOne   = (b64,name) => { const a=document.createElement('a'); a.download=`${name}-creative.png`; a.href=b64; a.click() }

  const filtered = partners.filter(p =>
    (p.name?.toLowerCase()??'').includes(search.toLowerCase()) ||
    (p.companyName?.toLowerCase()??'').includes(search.toLowerCase()) ||
    (p.mobile??'').includes(search) ||
    (p.email?.toLowerCase()??'').includes(search.toLowerCase())
  )
  const selObjs = selected.map(id=>partners.find(p=>p._id===id)).filter(Boolean)

  const stats = [
    {label:'Total',    val:partners.length,                                  col:'blue',    icon:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z'},
    {label:'Active',   val:partners.filter(p=>p.status==='active').length,   col:'emerald', icon:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'},
    {label:'Pending',  val:partners.filter(p=>p.status==='pending').length,  col:'amber',   icon:'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'},
    {label:'Online',   val:partners.filter(p=>p.isOnline).length,            col:'violet',  icon:'M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z'},
  ]
  const bg = {blue:'bg-blue-50',emerald:'bg-emerald-50',amber:'bg-amber-50',violet:'bg-violet-50'}
  const tx = {blue:'text-blue-600',emerald:'text-emerald-600',amber:'text-amber-600',violet:'text-violet-600'}
  const inp = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"

  return (
    <div className="space-y-6 min-h-screen">
      <canvas ref={cvs} className="hidden"/>

      {/* ── HEADER ── */}
      <div>
        <h1 className="text-3xl font-black text-gray-900">Channel Partners</h1>
        <p className="text-gray-500 text-sm mt-1">Manage brokers & agents · Send personalized marketing creatives via email</p>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s,i)=>(
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${bg[s.col]} rounded-xl flex items-center justify-center mb-3`}>
              <svg className={`w-5 h-5 ${tx[s.col]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon}/></svg>
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{s.val}</p>
          </div>
        ))}
      </div>

      {/* ── ACTION BAR ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-60">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, company, mobile…" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"/>
        </div>
        {selected.length > 0 && (
          <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 px-3.5 py-2 rounded-xl">
            <span className="w-5 h-5 bg-violet-600 text-white rounded-full flex items-center justify-center text-xs font-bold">{selected.length}</span>
            <span className="text-sm font-semibold text-violet-700">selected</span>
            <button onClick={()=>setSelected([])} className="text-violet-400 hover:text-violet-600 ml-0.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        )}
        <button onClick={()=>openStudio()} disabled={!selected.length}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${selected.length?'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:opacity-90 shadow-md':'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
          Send Creative{selected.length>0?` (${selected.length})`:''}
        </button>
        <button onClick={()=>setAddOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-bold rounded-xl hover:opacity-90 shadow-md">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Add Partner
        </button>
      </div>

      {/* ── TABLE ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <h2 className="font-black text-gray-900">All Partners</h2>
          <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2.5 py-1 rounded-full">{filtered.length}</span>
          {selected.length>0 && <span className="bg-violet-100 text-violet-700 text-xs font-bold px-2.5 py-1 rounded-full">{selected.length} selected for creative</span>}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
            <p className="text-gray-400 text-sm">Loading partners…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <p className="text-gray-500 font-bold">No partners found</p>
            <p className="text-gray-400 text-sm">Add your first channel partner</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3.5 text-left w-10">
                    <input type="checkbox" onChange={toggleAll} checked={selected.length===filtered.length&&filtered.length>0} className="w-4 h-4 accent-blue-600"/>
                  </th>
                  {['Partner','Company','Type','Mobile','Commission','Status','Joined','Actions'].map(h=>(
                    <th key={h} className="px-4 py-3.5 text-left text-xs font-black text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, idx) => {
                  const isSel = selected.includes(p._id)
                  const sc = p.status==='active'?'bg-emerald-100 text-emerald-700':p.status==='pending'?'bg-amber-100 text-amber-700':'bg-gray-100 text-gray-500'
                  const sd = p.status==='active'?'bg-emerald-500':p.status==='pending'?'bg-amber-500':'bg-gray-400'
                  return (
                    <tr key={p._id} className={`border-b border-gray-50 transition-colors ${isSel?'bg-violet-50/60':'hover:bg-gray-50/80'}`}>
                      <td className="px-5 py-4">
                        <input type="checkbox" checked={isSel} onChange={()=>toggleOne(p._id)} className="w-4 h-4 accent-blue-600"/>
                      </td>

                      {/* ── Partner: name + email + avatar from API ── */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            {p.image
                              ? <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-gray-200"/>
                              : <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm ${isSel?'bg-violet-500':'bg-gradient-to-br from-blue-500 to-cyan-500'}`}>{(p.name||'P').charAt(0).toUpperCase()}</div>
                            }
                            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${p.isOnline?'bg-emerald-400':'bg-gray-300'}`}/>
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 text-sm truncate max-w-[140px]">{p.name||'—'}</p>
                            <p className="text-xs text-gray-400 truncate max-w-[140px]">{p.email||'—'}</p>
                          </div>
                        </div>
                      </td>

                      {/* ── Company ── */}
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-700 max-w-[120px] truncate">{p.companyName||'—'}</p>
                      </td>

                      {/* ── Type ── */}
                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700 capitalize">{p.type}</span>
                      </td>

                      {/* ── Mobile from API: partner.user.mobile ── */}
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-gray-800">{p.mobile||'—'}</p>
                      </td>

                      {/* ── Commission ── */}
                      <td className="px-4 py-4">
                        <span className="text-sm font-black text-gray-900">{p.commissionPercent}%</span>
                      </td>

                      {/* ── Status ── */}
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full capitalize ${sc}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sd}`}/>{p.status}
                        </span>
                      </td>

                      {/* ── Joined ── */}
                      <td className="px-4 py-4 text-xs text-gray-400 whitespace-nowrap">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—'}
                      </td>

                      {/* ── ACTIONS ── */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-0.5">

                          {/* VIEW BUTTON → opens ViewModal */}
                          <button
                            onClick={() => setViewP(p)}
                            title="View details"
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                          </button>

                          {/* EDIT BUTTON → opens EditModal */}
                          <button
                            onClick={() => setEditP(p)}
                            title="Edit partner"
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                            </svg>
                          </button>

                          {/* SEND CREATIVE BUTTON → opens Studio for this partner */}
                          <button
                            onClick={() => openStudio([p._id])}
                            title="Send creative"
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-violet-500 hover:bg-violet-50 hover:text-violet-700 transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ══════ VIEW MODAL ══════ */}
      {viewP && <ViewModal p={viewP} onClose={()=>setViewP(null)} onEdit={handleEdit}/>}

      {/* ══════ EDIT MODAL ══════ */}
      {editP && <EditModal p={editP} onClose={()=>setEditP(null)} onSave={saveEdit} saving={updateMut.isPending}/>}

      {/* ══════ CREATIVE STUDIO ══════ */}
      {studio && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden">

            <div className="bg-gradient-to-r from-violet-700 to-fuchsia-700 px-7 py-5 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-xl font-black text-white">🎨 Creative Studio</h2>
                <p className="text-violet-200 text-xs mt-0.5">Upload poster → partner info auto-overlaid → send email</p>
              </div>
              <button onClick={()=>setStudio(false)} className="text-white/50 hover:text-white hover:bg-white/10 p-2 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* LEFT PANEL */}
              <div className="w-72 shrink-0 border-r border-gray-100 bg-gray-50 flex flex-col overflow-y-auto">

                {/* Upload */}
                <div className="p-4 border-b border-gray-200">
                  <p className="flex items-center gap-2 text-sm font-black text-gray-700 mb-3">
                    <span className="w-5 h-5 bg-violet-600 text-white rounded-full flex items-center justify-center text-xs">1</span> Template
                  </p>
                  <label className={`block border-2 border-dashed rounded-2xl cursor-pointer overflow-hidden transition-all ${tplDataUrl?'border-violet-400':'border-gray-200 hover:border-violet-400'}`}>
                    <input type="file" accept="image/*" onChange={onTpl} className="hidden"/>
                    {tplDataUrl
                      ? <div className="relative"><img src={tplDataUrl} alt="image5" className="w-full h-36 object-cover"/><div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"><p className="text-white text-sm font-bold">Change</p></div><div className="absolute top-2 right-2 bg-violet-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">✓ loaded</div></div>
                      : <div className="p-5 text-center"><div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center mx-auto mb-2"><svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div><p className="text-sm font-semibold text-gray-600">Upload poster/banner</p><p className="text-xs text-gray-400 mt-0.5">PNG or JPG</p></div>
                    }
                  </label>
                </div>

                {/* Overlay zones */}
                <div className="p-4 border-b border-gray-200">
                  <p className="flex items-center gap-2 text-sm font-black text-gray-700 mb-3">
                    <span className="w-5 h-5 bg-violet-600 text-white rounded-full flex items-center justify-center text-xs">2</span> Overlay Zones
                  </p>
                  {[
                    {i:'🔵',z:'Top-Right',   d:'Partner logo circle'},
                    {i:'✏️',z:'Bottom-Left',  d:'Name + Company'},
                    {i:'📞',z:'Bottom-Right', d:'Mobile number'},
                  ].map(x=>(
                    <div key={x.z} className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl px-3 py-2 mb-2">
                      <span className="text-base">{x.i}</span>
                      <div><p className="text-xs font-bold text-gray-700">{x.z}</p><p className="text-[11px] text-gray-400">{x.d}</p></div>
                    </div>
                  ))}
                </div>

                {/* Partners */}
                <div className="p-4 flex-1">
                  <p className="flex items-center gap-2 text-sm font-black text-gray-700 mb-3">
                    <span className="w-5 h-5 bg-violet-600 text-white rounded-full flex items-center justify-center text-xs">3</span> Partners ({selObjs.length})
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selObjs.map(p=>(
                      <div key={p._id} className="flex items-center gap-2.5 bg-white border border-gray-100 rounded-xl px-3 py-2">
                        {p.image ? <img src={p.image} alt="image7" className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-200"/> : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-black shrink-0">{(p.name||'P').charAt(0)}</div>}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{p.name}</p>
                          <p className="text-xs text-gray-400 truncate">{p.mobile||'—'}</p>
                        </div>
                        <span className={`text-[10px] font-bold shrink-0 ${p.image?'text-emerald-600':'text-amber-500'}`}>{p.image?'✓logo':'init'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Generate */}
                <div className="p-4 border-t border-gray-200">
                  <button onClick={generate} disabled={!tplImg||generating}
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black rounded-2xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm">
                    {generating ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Generating…</> : `⚡ Generate ${selObjs.length}`}
                  </button>
                  {!tplImg && <p className="text-xs text-center text-gray-400 mt-2">↑ Upload template first</p>}
                </div>
              </div>

              {/* RIGHT PANEL */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {creatives.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    {tplDataUrl
                      ? <><div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mb-4"><svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></div><p className="text-gray-700 font-black">Ready to generate!</p><p className="text-gray-400 text-sm mt-1">Click the button to create {selObjs.length} personalized creative{selObjs.length>1?'s':''}</p><img src={tplDataUrl} alt="tplDataUrl" className="w-32 rounded-xl mt-4 shadow opacity-70"/></>
                      : <><div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4"><svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div><p className="text-gray-500 font-bold">Upload template first</p><p className="text-gray-400 text-sm mt-1">Your poster will be the background canvas</p></>
                    }
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Nav */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-violet-100 rounded-full flex items-center justify-center text-xs font-black text-violet-700">{creatives[prevIdx]?.partnerName?.charAt(0)||'P'}</div>
                        <p className="font-bold text-gray-800 text-sm">{creatives[prevIdx]?.partnerName}</p>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">✓</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={()=>setPrevIdx(i=>Math.max(0,i-1))} disabled={prevIdx===0} className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:opacity-30"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg></button>
                        <span className="text-xs font-bold text-gray-400">{prevIdx+1}/{creatives.length}</span>
                        <button onClick={()=>setPrevIdx(i=>Math.min(creatives.length-1,i+1))} disabled={prevIdx===creatives.length-1} className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:opacity-30"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg></button>
                      </div>
                    </div>
                    {/* Preview */}
                    <div className="flex-1 overflow-auto bg-gray-100 p-4 flex items-start justify-center">
                      <img src={creatives[prevIdx]?.imageBase64} alt="image3" className="max-w-full max-h-full rounded-xl shadow-2xl"/>
                    </div>
                    {/* Thumbs */}
                    {creatives.length > 1 && (
                      <div className="flex gap-2 px-4 py-3 bg-white border-t border-gray-100 overflow-x-auto shrink-0">
                        {creatives.map((c,i)=>(
                          <button key={i} onClick={()=>setPrevIdx(i)} className={`shrink-0 transition-all ${i===prevIdx?'scale-105':'opacity-60'}`}>
                            <img src={c.imageBase64} alt="image1" className={`w-12 h-12 object-cover rounded-lg border-2 ${i===prevIdx?'border-violet-500':'border-gray-200'}`}/>
                            <p className="text-[10px] text-gray-400 mt-1 truncate w-12">{c.partnerName}</p>
                          </button>
                        ))}
                      </div>
                    )}
                    {/* Send */}
                    <div className="px-5 py-4 border-t border-gray-100 bg-white shrink-0">
                      {sendSt==='done' ? (
                        <div className="flex items-center justify-center gap-3 py-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                          <span className="text-xl">✅</span>
                          <div><p className="font-black text-emerald-800 text-sm">Emails Sent!</p><p className="text-xs text-emerald-600">{creatives.length} partner{creatives.length>1?'s':''} received creatives</p></div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2.5">
                          <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 min-w-0">
                            <p className="text-xs font-bold text-blue-700 mb-1">📧 Sending to:</p>
                            <div className="flex flex-wrap gap-1">
                              {creatives.slice(0,2).map((c,i)=><span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full truncate max-w-[100px]">{c.email||'—'}</span>)}
                              {creatives.length>2 && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">+{creatives.length-2}</span>}
                            </div>
                          </div>
                          <button onClick={()=>creatives.forEach((c,i)=>setTimeout(()=>dlOne(c.imageBase64,c.partnerName),i*400))} className="px-3 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-1 whitespace-nowrap">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>Download
                          </button>
                          <button onClick={sendAll} disabled={sendSt==='sending'} className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-sm font-black rounded-xl hover:opacity-90 disabled:opacity-60 flex items-center gap-2 whitespace-nowrap">
                            {sendSt==='sending'?<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Sending…</>:<><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>Send {creatives.length}</>}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════ ADD PARTNER MODAL ══════ */}
      {addOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeAdd}>
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden" onClick={e=>e.stopPropagation()}>
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-5 flex items-center justify-between shrink-0">
              <div><h2 className="text-xl font-black text-white">Add New Partner</h2><p className="text-blue-100 text-xs mt-0.5">role: partner · loginType: password</p></div>
              <button onClick={closeAdd} className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-xl"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <form onSubmit={submitAdd} className="overflow-y-auto flex-1">
              <div className="p-6 space-y-5">
                <div>
                  <p className="text-xs font-black text-blue-600 uppercase tracking-widest pb-2 border-b border-blue-100 mb-3">Personal</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Name <span className="text-red-400">*</span></label><input name="name" value={addForm.name} onChange={chgAdd} required placeholder="Rahul Kumar" className={inp}/></div>
                    <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Mobile <span className="text-red-400">*</span></label><input name="mobile" value={addForm.mobile} onChange={chgAdd} required placeholder="9999999999" maxLength={10} className={inp}/></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Email <span className="text-red-400">*</span></label><input name="email" type="email" value={addForm.email} onChange={chgAdd} required placeholder="partner@email.com" className={inp}/></div>
                    <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Password <span className="text-red-400">*</span></label><input name="password" type="password" value={addForm.password} onChange={chgAdd} required placeholder="Password@123" className={inp}/></div>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-black text-blue-600 uppercase tracking-widest pb-2 border-b border-blue-100 mb-3">Company</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Company Name <span className="text-red-400">*</span></label><input name="companyName" value={addForm.companyName} onChange={chgAdd} required placeholder="Kumar Real Estate" className={inp}/></div>
                    <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Type</label><select name="type" value={addForm.type} onChange={chgAdd} className={inp}><option value="broker">Broker</option><option value="agent">Agent</option><option value="builder">Builder</option><option value="consultant">Consultant</option></select></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Commission %</label><input name="commissionPercent" type="number" value={addForm.commissionPercent} onChange={chgAdd} placeholder="5" min="0" max="100" step="0.5" className={inp}/></div>
                    <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Status</label><select name="status" value={addForm.status} onChange={chgAdd} className={inp}><option value="pending">Pending</option><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-black text-blue-600 uppercase tracking-widest pb-2 border-b border-blue-100 mb-3">Address</p>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Address</label><input name="address" value={addForm.address} onChange={chgAdd} placeholder="Office address" className={inp}/></div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div><label className="block text-xs font-bold text-gray-600 mb-1.5">City</label><input name="city" value={addForm.city} onChange={chgAdd} placeholder="Mumbai" className={inp}/></div>
                    <div><label className="block text-xs font-bold text-gray-600 mb-1.5">State</label><input name="state" value={addForm.state} onChange={chgAdd} placeholder="Maharashtra" className={inp}/></div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Profile Image <span className="text-gray-400 font-normal">(used as logo in creatives)</span></label>
                  <label className="block border-2 border-dashed border-gray-200 rounded-xl p-5 text-center hover:border-blue-400 cursor-pointer transition-all relative">
                    <input type="file" accept="image/*" onChange={chgImg} className="hidden"/>
                    {imgPrev
                      ? <div className="relative inline-block"><img src={imgPrev} alt="image8" className="w-20 h-20 object-cover rounded-full mx-auto border-4 border-blue-100"/><button type="button" onClick={e=>{e.preventDefault();e.stopPropagation();setImgPrev(null);setAddForm(f=>({...f,image:null}))}} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">×</button></div>
                      : <><svg className="w-9 h-9 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg><p className="text-sm text-gray-500">Click to upload</p></>
                    }
                  </label>
                </div>
              </div>
              <div className="px-6 pb-6 flex gap-3 border-t border-gray-100 pt-4">
                <button type="button" onClick={closeAdd} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={createMut.isPending} className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                  {createMut.isPending && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>}
                  {createMut.isPending?'Adding…':'Add Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}