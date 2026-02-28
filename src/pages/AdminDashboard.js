// src/pages/Dashboard.jsx

import { useQuery } from '@tanstack/react-query'
import {
  Building2, Users, TrendingUp,
  Clock, CheckCircle,  FileText, HelpCircle,
  ArrowUpRight, ArrowDownRight,
  BarChart2, PieChart, Activity,
   Loader2, MapPin, Award, 
} from 'lucide-react'
import {
  projectApi, unitApi, userApi, demandLetterApi,
  costSheetApi, faqApi
} from '../api/endpoints'

// ─── HELPERS ──────────────────────────────────────────────────
const toArr = (res) => {
  if (Array.isArray(res))             return res
  if (Array.isArray(res?.data))       return res.data
  if (Array.isArray(res?.data?.data)) return res.data.data
  return []
}
const inr = (n) => {
  const num = parseFloat(n || 0)
  if (num >= 10000000) return '₹' + (num/10000000).toFixed(1) + ' Cr'
  if (num >= 100000)   return '₹' + (num/100000).toFixed(1) + ' L'
  return '₹' + num.toLocaleString('en-IN')
}
// const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short' }) : '—'

// ─── MINI STAT CARD ───────────────────────────────────────────
const StatCard = ({ label, value, sub, gradient, Icon, trend, trendUp }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
        <Icon size={20} className="text-white" />
      </div>
      {trend !== undefined && (
        <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
          {trendUp ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}{trend}%
        </span>
      )}
    </div>
    <p className="text-2xl font-black text-gray-900 mb-0.5">{value}</p>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
)

// ─── UNIT STATUS DONUT ────────────────────────────────────────
const UnitDonut = ({ available, hold, sold, total }) => {
  const avPct   = total > 0 ? (available / total * 100) : 0
  const holdPct = total > 0 ? (hold      / total * 100) : 0
  const soldPct = total > 0 ? (sold      / total * 100) : 0

  const r = 52, cx = 64, cy = 64
  const circ = 2 * Math.PI * r
  const av   = circ * avPct   / 100
  const ho   = circ * holdPct / 100
  const so   = circ * soldPct / 100

  let offset = 0
  const segments = [
    { len: so, color: '#ef4444', label: 'Sold',      val: sold,      off: offset },
    { len: ho, color: '#f59e0b', label: 'Hold',      val: hold,      off: (offset += so) },
    { len: av, color: '#10b981', label: 'Available', val: available, off: (offset += ho) },
  ]

  return (
    <div className="flex items-center gap-6">
      <div className="relative flex-shrink-0">
        <svg width={128} height={128} viewBox="0 0 128 128">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={14} />
          {segments.map((s, i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={s.color} strokeWidth={14}
              strokeDasharray={`${s.len} ${circ - s.len}`}
              strokeDashoffset={-s.off}
              strokeLinecap="round"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '64px 64px', transition: 'stroke-dasharray 0.6s ease' }} />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-black text-gray-900">{total}</p>
          <p className="text-xs text-gray-400 font-medium">Total</p>
        </div>
      </div>
      <div className="space-y-2.5 flex-1">
        {[
          { label: 'Available', val: available, pct: avPct,   dot: 'bg-emerald-500' },
          { label: 'On Hold',   val: hold,      pct: holdPct, dot: 'bg-amber-500'   },
          { label: 'Sold',      val: sold,      pct: soldPct, dot: 'bg-red-500'     },
        ].map(({ label, val, pct, dot }) => (
          <div key={label} className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dot}`} />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-gray-600">{label}</span>
                <span className="text-xs font-bold text-gray-900">{val}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${dot}`} style={{ width: `${pct}%`, transition: 'width 0.6s ease' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
const Dashboard = () => {

  // ── QUERIES ──
  const { data: projects = [], isLoading: pLoad } = useQuery({
    queryKey: ['projects'],
    queryFn:  async () => toArr(await projectApi.getAll()),
  })

  const { data: allUnits = [], isLoading: uLoad } = useQuery({
    queryKey: ['all-units-dashboard'],
    queryFn:  async () => {
      if (!projects.length) return []
      const res = await Promise.all(
        projects.map(p => unitApi.getAll({ projectId: p._id || p.id }).then(toArr).catch(() => []))
      )
      return res.flat()
    },
    enabled: projects.length > 0,
  })

  const { data: salesmen = [] } = useQuery({
    queryKey: ['users-salesman'],
    queryFn:  async () => toArr(await userApi.getAll('salesman')),
  })

  const { data: demandLetters = [] } = useQuery({
    queryKey: ['demand-letters'],
    queryFn:  async () => toArr(await demandLetterApi.getAll()),
  })

  const { data: costSheets = [] } = useQuery({
    queryKey: ['cost-sheets', 1],
    queryFn:  async () => {
      const r = await costSheetApi.getAll({ page: 1, limit: 100 })
      return toArr(r?.data?.data || r?.data || r)
    },
  })

  const { data: faqs = [] } = useQuery({
    queryKey: ['faqs'],
    queryFn:  async () => toArr(await faqApi.getAll()),
  })

  const isLoading = pLoad || uLoad

  // ── COMPUTED ──
  const unitStats = {
    total:     allUnits.length,
    available: allUnits.filter(u => u.status === 'available').length,
    hold:      allUnits.filter(u => u.status === 'hold').length,
    sold:      allUnits.filter(u => u.status === 'sold').length,
  }

  const totalRevenue = allUnits
    .filter(u => u.status === 'sold')
    .reduce((s, u) => s + parseFloat(u.saleableArea || 0) * 16000, 0)

  const demandStats = {
    total:   demandLetters.length,
    pending: demandLetters.filter(l => l.paymentStatus === 'pending').length,
    paid:    demandLetters.filter(l => l.paymentStatus === 'paid').length,
  }

  const soldPct = unitStats.total > 0 ? Math.round(unitStats.sold / unitStats.total * 100) : 0

  // Recent demand letters (last 5)
  const recentLetters = [...demandLetters]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  // Per-project stats
  const projectStats = projects.map(p => {
    const pId = p._id || p.id
    const pUnits = allUnits.filter(u => u.projectId === pId || u.project?._id === pId)
    return {
      ...p,
      total:     pUnits.length,
      available: pUnits.filter(u => u.status === 'available').length,
      hold:      pUnits.filter(u => u.status === 'hold').length,
      sold:      pUnits.filter(u => u.status === 'sold').length,
    }
  })

  const PAY_BADGE = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    partial: 'bg-blue-50 text-blue-700 border-blue-200',
    paid:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  }

  return (
    <div className="space-y-6">

      {/* ─── HEADER ──────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-7 text-white">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="text-slate-400 text-sm mb-1">Good morning 👋</p>
            <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Real Estate Management Overview</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Quick numbers */}
            <div className="flex gap-3">
              {[
                { label: 'Projects',  val: projects.length,   color: 'from-blue-500 to-cyan-500'    },
                { label: 'Units',     val: unitStats.total,   color: 'from-violet-500 to-purple-500' },
                { label: 'Salesmen',  val: salesmen.length,   color: 'from-emerald-500 to-green-500' },
              ].map(({ label, val, color }) => (
                <div key={label} className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-center min-w-[80px]">
                  <p className="text-2xl font-black text-white">{isLoading ? '—' : val}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-52 h-52 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* ─── STAT CARDS ──────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      
        <StatCard label="Total Units"     value={isLoading ? '…' : unitStats.total}     sub={`${soldPct}% sold`}                          gradient="from-blue-600 to-cyan-500"     Icon={Building2}     />
        <StatCard label="Available Units" value={isLoading ? '…' : unitStats.available} sub="Ready to book"                               gradient="from-emerald-500 to-green-400" Icon={CheckCircle}   trendUp={true}  trend={soldPct > 0 ? 100-soldPct : undefined} />
        <StatCard label="On Hold"         value={isLoading ? '…' : unitStats.hold}      sub="Booking in progress"                         gradient="from-amber-500 to-orange-400"  Icon={Clock}         />
        <StatCard label="Sold Units"      value={isLoading ? '…' : unitStats.sold}      sub={inr(totalRevenue) + ' est. revenue'}         gradient="from-red-500 to-rose-400"      Icon={TrendingUp}    trendUp={soldPct > 50} trend={soldPct} />
        
      </div>

      {/* ─── ROW 2: Donut + Demand Letters ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Unit Status Donut */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <PieChart size={15} className="text-white" />
            </div>
            <h2 className="font-bold text-gray-900">Unit Status</h2>
          </div>
          {isLoading
            ? <div className="flex justify-center py-8"><Loader2 className="animate-spin text-blue-500" /></div>
            : <UnitDonut {...unitStats} />
          }
        </div>

        {/* Demand Letter Stats */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-500 rounded-lg flex items-center justify-center">
              <FileText size={15} className="text-white" />
            </div>
            <h2 className="font-bold text-gray-900">Demand Letters</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Total Letters',    val: demandStats.total,   color: 'bg-blue-500',    bg: 'bg-blue-50',    text: 'text-blue-700'    },
              { label: 'Pending Payment',  val: demandStats.pending, color: 'bg-amber-500',   bg: 'bg-amber-50',   text: 'text-amber-700'   },
              { label: 'Fully Paid',       val: demandStats.paid,    color: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
            ].map(({ label, val, color, bg, text }) => (
              <div key={label} className={`flex items-center justify-between ${bg} rounded-xl px-4 py-3`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${color}`} />
                  <span className={`text-sm font-semibold ${text}`}>{label}</span>
                </div>
                <span className={`text-xl font-black ${text}`}>{val}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 font-medium">Cost Sheets Generated</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{costSheets.length}</p>
          </div>
        </div>

        {/* Quick Numbers */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center">
              <Activity size={15} className="text-white" />
            </div>
            <h2 className="font-bold text-gray-900">Quick Stats</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Salesmen',  val: salesmen.length,  Icon: Users,       gradient: 'from-cyan-500 to-blue-500'     },
              { label: 'FAQs',      val: faqs.length,      Icon: HelpCircle,  gradient: 'from-violet-500 to-purple-500' },
              { label: 'Projects',  val: projects.length,  Icon: Building2,   gradient: 'from-emerald-500 to-teal-500'  },
              { label: 'Cost Sheets',val: costSheets.length,Icon: BarChart2,   gradient: 'from-amber-500 to-orange-400'  },
            ].map(({ label, val, Icon, gradient }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-lg font-black text-gray-900">{val}</p>
                  <p className="text-xs text-gray-400 font-medium">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── ROW 3: Project-wise + Recent Demand ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Project-wise breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <Building2 size={15} className="text-white" />
              </div>
              <h2 className="font-bold text-gray-900">Projects Overview</h2>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{projects.length} projects</span>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-500" /></div>
          ) : projects.length === 0 ? (
            <div className="text-center py-10"><Building2 className="w-8 h-8 text-gray-200 mx-auto mb-2" /><p className="text-gray-400 text-sm">No projects yet</p></div>
          ) : (
            <div className="divide-y divide-gray-50">
              {projectStats.map(p => {
                const pct = p.total > 0 ? Math.round(p.sold / p.total * 100) : 0
                return (
                  <div key={p._id||p.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <MapPin size={10} /> {p.location || p.address || 'Location N/A'}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">{pct}% sold</span>
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                      {[
                        { label: 'Total',  val: p.total,     color: 'text-gray-900' },
                        { label: 'Avail',  val: p.available, color: 'text-emerald-600' },
                        { label: 'Hold',   val: p.hold,      color: 'text-amber-600' },
                        { label: 'Sold',   val: p.sold,      color: 'text-red-600' },
                      ].map(({ label, val, color }) => (
                        <div key={label} className="text-center">
                          <p className={`text-sm font-black ${color}`}>{val}</p>
                          <p className="text-xs text-gray-400">{label}</p>
                        </div>
                      ))}
                    </div>
                    {/* progress bar */}
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                      <div className="h-full bg-red-500 transition-all" style={{ width: `${p.total > 0 ? p.sold/p.total*100 : 0}%` }} />
                      <div className="h-full bg-amber-400 transition-all" style={{ width: `${p.total > 0 ? p.hold/p.total*100 : 0}%` }} />
                      <div className="h-full bg-emerald-500 transition-all" style={{ width: `${p.total > 0 ? p.available/p.total*100 : 0}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent Demand Letters */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-500 rounded-lg flex items-center justify-center">
                <FileText size={15} className="text-white" />
              </div>
              <h2 className="font-bold text-gray-900">Recent Demand Letters</h2>
            </div>
            <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full">Last {recentLetters.length}</span>
          </div>
          {recentLetters.length === 0 ? (
            <div className="text-center py-10"><FileText className="w-8 h-8 text-gray-200 mx-auto mb-2" /><p className="text-gray-400 text-sm">No demand letters yet</p></div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentLetters.map(l => (
                <div key={l._id||l.id} className="px-6 py-3.5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-violet-700 font-black text-xs">{(l.customer?.name||'?')[0].toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{l.customer?.name || '—'}</p>
                        <p className="text-xs text-gray-400">
                          {l.unit?.name || '—'} · {l.project?.name || '—'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">₹{(l.totalConsideration||0).toLocaleString('en-IN')}</p>
                      <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full border capitalize ${PAY_BADGE[l.paymentStatus]||PAY_BADGE.pending}`}>
                        {l.paymentStatus||'pending'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── ROW 4: Salesman List ──────────────── */}
      {salesmen.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Users size={15} className="text-white" />
              </div>
              <h2 className="font-bold text-gray-900">Sales Team</h2>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">{salesmen.length} active</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 divide-x divide-y divide-gray-50">
            {salesmen.slice(0, 10).map(s => {
              const soldByThis = allUnits.filter(u => u.soldByUserId === (s._id||s.id) || u.holdByUserId === (s._id||s.id)).length
              return (
                <div key={s._id||s.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-black text-sm">{(s.name||'?')[0].toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{s.name}</p>
                      <p className="text-xs text-gray-400 truncate">{s.mobile || s.email || 'Salesman'}</p>
                    </div>
                  </div>
                  {soldByThis > 0 && (
                    <div className="flex items-center gap-1 bg-emerald-50 rounded-lg px-2 py-1">
                      <Award size={11} className="text-emerald-500" />
                      <span className="text-xs font-bold text-emerald-700">{soldByThis} units assigned</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}

export default Dashboard