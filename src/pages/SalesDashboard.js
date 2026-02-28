// src/pages/SalesDashboard.jsx

import { useQuery } from '@tanstack/react-query'
import {
  TrendingUp, Building2, CheckCircle, Clock, Users,
  FileText, IndianRupee, ArrowUpRight, Home,
  BarChart2, Plus, 
  Loader2, Award, Target, Activity, MapPin,
} from 'lucide-react'
import { projectApi, unitApi, demandLetterApi, bookingApi } from '../api/endpoints'

// ─── HELPERS ──────────────────────────────────────────────────
const toArr = (res) => {
  if (Array.isArray(res))             return res
  if (Array.isArray(res?.data))       return res.data
  if (Array.isArray(res?.data?.data)) return res.data.data
  return []
}

const inr = (n) => {
  const num = parseFloat(n || 0)
  if (num >= 10000000) return '₹' + (num / 10000000).toFixed(2) + ' Cr'
  if (num >= 100000)   return '₹' + (num / 100000).toFixed(1) + ' L'
  return '₹' + num.toLocaleString('en-IN')
}

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

// ─── MOCK DATA (fallback when API returns empty) ──────────────
const MOCK = {
  projects: [
    { _id: 'm1', name: 'Akshar Heights', location: 'Navi Mumbai', reraNo: 'P51700053764' },
    { _id: 'm2', name: 'Akshar Residency', location: 'Thane West', reraNo: 'P51700053765' },
    { _id: 'm3', name: 'Level 23', location: 'Vashi', reraNo: 'P51700053766' },
  ],
  units: [
    { _id: 'u1', name: 'A-701', number: '701', unitType: '3BHK', saleableArea: 950, status: 'sold',      projectId: 'm1', soldByUserId: 'me', floor: { number: 7 }  },
    { _id: 'u2', name: 'B-1203', number: '1203', unitType: '2BHK', saleableArea: 720, status: 'hold',    projectId: 'm1', holdByUserId: 'me', floor: { number: 12 } },
    { _id: 'u3', name: 'C-502', number: '502', unitType: '3BHK', saleableArea: 980, status: 'available', projectId: 'm2', floor: { number: 5 }  },
    { _id: 'u4', name: 'A-301', number: '301', unitType: '1BHK', saleableArea: 480, status: 'sold',      projectId: 'm2', soldByUserId: 'me', floor: { number: 3 }  },
    { _id: 'u5', name: 'D-804', number: '804', unitType: '2BHK', saleableArea: 750, status: 'hold',      projectId: 'm3', holdByUserId: 'me', floor: { number: 8 }  },
    { _id: 'u6', name: 'B-1501', number: '1501', unitType: '4BHK', saleableArea: 1350, status: 'sold',   projectId: 'm3', soldByUserId: 'me', floor: { number: 15 } },
  ],
  demandLetters: [
    { _id: 'd1', customer: { name: 'Ravi Sharma' },   property: { letterDate: '2025-10-20' }, totalConsideration: 8500000,  amountReceived: 850000,  paymentStatus: 'partial', unit: { name: 'A-701' },  project: { name: 'Akshar Heights'   } },
    { _id: 'd2', customer: { name: 'Priya Mehta' },   property: { letterDate: '2025-11-05' }, totalConsideration: 6200000,  amountReceived: 6200000, paymentStatus: 'paid',    unit: { name: 'A-301' },  project: { name: 'Akshar Residency' } },
    { _id: 'd3', customer: { name: 'Amit Patel' },    property: { letterDate: '2025-12-12' }, totalConsideration: 12000000, amountReceived: 0,       paymentStatus: 'pending', unit: { name: 'B-1501' }, project: { name: 'Level 23'         } },
    { _id: 'd4', customer: { name: 'Sunita Joshi' },  property: { letterDate: '2026-01-08' }, totalConsideration: 5800000,  amountReceived: 1000000, paymentStatus: 'partial', unit: { name: 'B-1203' }, project: { name: 'Akshar Heights'   } },
    { _id: 'd5', customer: { name: 'Deepak Verma' },  property: { letterDate: '2026-02-01' }, totalConsideration: 7500000,  amountReceived: 7500000, paymentStatus: 'paid',    unit: { name: 'D-804' },  project: { name: 'Level 23'         } },
  ],
  bookings: [
    { _id: 'b1', bookingNo: 'BK-2501', firstName: 'Ravi',   lastName: 'Sharma',  bookingDate: '2025-10-18', bookingAmount: 500000, status: 'confirmed', type: 'new'    },
    { _id: 'b2', bookingNo: 'BK-2502', firstName: 'Priya',  lastName: 'Mehta',   bookingDate: '2025-11-03', bookingAmount: 300000, status: 'confirmed', type: 'new'    },
    { _id: 'b3', bookingNo: 'BK-2503', firstName: 'Amit',   lastName: 'Patel',   bookingDate: '2025-12-10', bookingAmount: 700000, status: 'processing',type: 'new'    },
    { _id: 'b4', bookingNo: 'BK-2504', firstName: 'Sunita', lastName: 'Joshi',   bookingDate: '2026-01-05', bookingAmount: 400000, status: 'confirmed', type: 'resale' },
    { _id: 'b5', bookingNo: 'BK-2505', firstName: 'Deepak', lastName: 'Verma',   bookingDate: '2026-01-28', bookingAmount: 600000, status: 'confirmed', type: 'new'    },
  ],
}

// ─── STAT CARD ────────────────────────────────────────────────
const StatCard = ({ label, value, sub, gradient, Icon, trend, isMock }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
    {isMock && (
      <span className="absolute top-2 right-2 text-[9px] font-bold text-gray-300 uppercase tracking-widest">demo</span>
    )}
    <div className="flex items-start justify-between mb-4">
      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
        <Icon size={20} className="text-white" />
      </div>
      {trend !== undefined && (
        <span className="flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
          <ArrowUpRight size={11} /> {trend}%
        </span>
      )}
    </div>
    <p className="text-2xl font-black text-gray-900 mb-0.5">{value}</p>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
)

// ─── MINI BAR CHART ───────────────────────────────────────────
const MiniBarChart = ({ data, color }) => {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="flex items-end gap-1.5 h-16">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t-md transition-all hover:opacity-80"
            style={{ height: `${(d.value / max) * 52}px`, minHeight: 4, background: color }} />
          <span className="text-[9px] text-gray-400 font-medium">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
const SalesDashboard = () => {

  const PAY_BADGE = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    partial: 'bg-blue-50 text-blue-700 border-blue-200',
    paid:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  }
  const STATUS_BADGE = {
    confirmed:  'bg-emerald-50 text-emerald-700',
    processing: 'bg-amber-50 text-amber-700',
    pending:    'bg-gray-100 text-gray-600',
    cancelled:  'bg-red-50 text-red-600',
  }

  // ── QUERIES ──
  const { data: apiProjects = [], isLoading: pLoad } = useQuery({
    queryKey: ['projects'],
    queryFn:  async () => toArr(await projectApi.getAll()),
  })

  const { data: apiUnits = [], isLoading: uLoad } = useQuery({
    queryKey: ['all-units-sales'],
    queryFn:  async () => {
      if (!apiProjects.length) return []
      const res = await Promise.all(
        apiProjects.map(p => unitApi.getByProject?.(p._id||p.id)?.then?.(toArr).catch(() => []) ?? Promise.resolve([]))
      )
      return res.flat()
    },
    enabled: apiProjects.length > 0,
  })

  const { data: apiLetters = [], isLoading: lLoad } = useQuery({
    queryKey: ['demand-letters'],
    queryFn:  async () => toArr(await demandLetterApi.getAll()),
  })

  const { data: apiBookings = [], isLoading: bLoad } = useQuery({
    queryKey: ['bookings', 'recent'],
    queryFn:  async () => {
      const res = await bookingApi.getAll()
      return toArr(res?.data || res)
    },
  })

  const isLoading = pLoad || uLoad || lLoad || bLoad

  // ── USE MOCK IF API EMPTY ──
  const isMock     = !isLoading && apiProjects.length === 0
  const projects   = isMock ? MOCK.projects   : apiProjects
  const allUnits   = isMock ? MOCK.units       : apiUnits
  const letters    = isMock ? MOCK.demandLetters : apiLetters
  const bookings   = isMock ? MOCK.bookings    : apiBookings


  const soldUnits   = allUnits.filter(u => u.status === 'sold')
  const holdUnits   = allUnits.filter(u => u.status === 'hold')

  const totalRevenue = soldUnits.reduce((s, u) => s + parseFloat(u.saleableArea || 0) * 16000, 0)
  const pendingAmt   = letters.filter(l => l.paymentStatus === 'pending').reduce((s, l) => s + (l.totalConsideration || 0), 0)
  const collectedAmt = letters.reduce((s, l) => s + (l.amountReceived || 0), 0)

  const recentLetters  = [...letters].sort((a, b) => new Date(b.createdAt||0) - new Date(a.createdAt||0)).slice(0, 5)
  const recentBookings = [...bookings].sort((a, b) => new Date(b.bookingDate||0) - new Date(a.bookingDate||0)).slice(0, 5)

  // ── MONTHLY BAR DATA (from bookings) ──
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const monthlyBookings = months.map((label, i) => ({
    label: label.slice(0,3),
    value: bookings.filter(b => b.bookingDate && new Date(b.bookingDate).getMonth() === i).length
  })).slice(-6)

  const monthlyRevenue = months.map((label, i) => ({
    label: label.slice(0,3),
    value: soldUnits.filter(u => u.createdAt && new Date(u.createdAt).getMonth() === i)
                    .reduce((s, u) => s + parseFloat(u.saleableArea || 0) * 16000, 0) / 100000
  })).slice(-6)

  // project-wise sold
  const projectStats = projects.map(p => {
    const pId  = p._id || p.id
    const pU   = allUnits.filter(u => u.projectId === pId)
    const sold = pU.filter(u => u.status === 'sold').length
    const hold = pU.filter(u => u.status === 'hold').length
    return { ...p, total: pU.length, sold, hold, available: pU.filter(u => u.status === 'available').length }
  })

  return (
    <div className="space-y-6 relative">

      {/* MOCK BANNER */}
      {isMock && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 flex items-center gap-3">
          <Activity size={16} className="text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-700 font-medium">
            Demo data is shown below — API se data aane ke baad yeh automatically replace ho jayega.
          </p>
        </div>
      )}

      {/* ─── HEADER ─────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-700 rounded-2xl p-7 text-white">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <p className="text-emerald-200 text-sm mb-1">Welcome back 👋</p>
            <h1 className="text-3xl font-black tracking-tight">Sales Dashboard</h1>
            <p className="text-emerald-200 text-sm mt-1">Track your sales performance & manage clients</p>
          </div>
          {/* Quick numbers */}
          <div className="flex gap-3 flex-wrap">
            {[
              { label: 'My Sold',    val: soldUnits.length,  color: 'from-red-400 to-rose-500'     },
              { label: 'On Hold',    val: holdUnits.length,  color: 'from-amber-400 to-orange-400'  },
              { label: 'Bookings',   val: bookings.length,   color: 'from-blue-400 to-indigo-500'   },
              { label: 'Letters',    val: letters.length,    color: 'from-violet-400 to-purple-500' },
            ].map(({ label, val, color }) => (
              <div key={label} className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-center min-w-[80px]">
                <p className="text-2xl font-black text-white">{isLoading ? '—' : val}</p>
                <p className="text-xs text-emerald-200 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-56 h-56 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-teal-400/10 rounded-full blur-3xl" />
      </div>

      {/* ─── STAT CARDS ─────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Units Sold"       value={isLoading ? '…' : soldUnits.length}    sub="By you this period"           gradient="from-red-500 to-rose-400"      Icon={CheckCircle}  trend={12} isMock={isMock} />
        <StatCard label="Est. Revenue"     value={isLoading ? '…' : inr(totalRevenue)}   sub="From sold units"              gradient="from-emerald-500 to-teal-500"  Icon={IndianRupee}  trend={8}  isMock={isMock} />
        <StatCard label="Pending Payment"  value={isLoading ? '…' : inr(pendingAmt)}     sub="Demand letters pending"       gradient="from-amber-500 to-orange-400"  Icon={Clock}                   isMock={isMock} />
        <StatCard label="Collected"        value={isLoading ? '…' : inr(collectedAmt)}   sub="Total amount received"        gradient="from-blue-600 to-cyan-500"     Icon={TrendingUp}   trend={18} isMock={isMock} />
      </div>

      {/* ─── ROW 2: Charts + Unit Status ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Monthly Bookings Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <BarChart2 size={15} className="text-white" />
              </div>
              <h2 className="font-bold text-gray-900 text-sm">Monthly Bookings</h2>
            </div>
            {isMock && <span className="text-[9px] font-bold text-gray-300 uppercase">demo</span>}
          </div>
          {isLoading ? <div className="flex justify-center py-8"><Loader2 className="animate-spin text-blue-400" /></div>
            : <MiniBarChart data={monthlyBookings} color="url(#blueGrad)" />}
          <svg width="0" height="0">
            <defs>
              <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-400">
            <span>Last 6 months</span>
            <span className="font-bold text-blue-600">{bookings.length} total</span>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <TrendingUp size={15} className="text-white" />
              </div>
              <h2 className="font-bold text-gray-900 text-sm">Revenue (₹L)</h2>
            </div>
            {isMock && <span className="text-[9px] font-bold text-gray-300 uppercase">demo</span>}
          </div>
          {isLoading ? <div className="flex justify-center py-8"><Loader2 className="animate-spin text-emerald-400" /></div>
            : <MiniBarChart data={monthlyRevenue} color="url(#greenGrad)" />}
          <svg width="0" height="0">
            <defs>
              <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-400">
            <span>Last 6 months</span>
            <span className="font-bold text-emerald-600">{inr(totalRevenue)}</span>
          </div>
        </div>

        {/* Unit status breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-500 rounded-lg flex items-center justify-center">
              <Home size={15} className="text-white" />
            </div>
            <h2 className="font-bold text-gray-900 text-sm">My Units</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Sold by Me',  val: soldUnits.length,  total: allUnits.length, dot: 'bg-red-500',     bar: 'bg-red-500'     },
              { label: 'On Hold',     val: holdUnits.length,  total: allUnits.length, dot: 'bg-amber-500',   bar: 'bg-amber-500'   },
              { label: 'Available',   val: allUnits.filter(u=>u.status==='available').length, total: allUnits.length, dot: 'bg-emerald-500', bar: 'bg-emerald-500' },
            ].map(({ label, val, total, dot, bar }) => (
              <div key={label}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${dot}`} />
                    <span className="text-xs font-semibold text-gray-600">{label}</span>
                  </div>
                  <span className="text-sm font-black text-gray-900">{val}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${bar}`} style={{ width: total > 0 ? `${val/total*100}%` : '0%', transition: 'width 0.6s ease' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">Total inventory: <span className="font-bold text-gray-700">{allUnits.length} units</span></p>
          </div>
        </div>
      </div>

      {/* ─── ROW 3: Demand Letters + Bookings ──── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent Demand Letters */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-500 rounded-lg flex items-center justify-center">
                <FileText size={15} className="text-white" />
              </div>
              <h2 className="font-bold text-gray-900">Demand Letters</h2>
            </div>
            <div className="flex items-center gap-2">
              {isMock && <span className="text-[9px] font-bold text-gray-300 uppercase">demo</span>}
              <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full">{letters.length} total</span>
            </div>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-violet-400" /></div>
          ) : recentLetters.length === 0 ? (
            <div className="text-center py-10"><FileText className="w-8 h-8 text-gray-200 mx-auto mb-2" /><p className="text-gray-400 text-sm">No demand letters yet</p></div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentLetters.map(l => (
                <div key={l._id||l.id} className="px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-violet-700 font-black text-xs">{(l.customer?.name||'?')[0].toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{l.customer?.name||'—'}</p>
                        <p className="text-xs text-gray-400">{l.unit?.name||'—'} · {l.project?.name||'—'}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-gray-900">{inr(l.totalConsideration)}</p>
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

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <Home size={15} className="text-white" />
              </div>
              <h2 className="font-bold text-gray-900">Recent Bookings</h2>
            </div>
            <div className="flex items-center gap-2">
              {isMock && <span className="text-[9px] font-bold text-gray-300 uppercase">demo</span>}
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{bookings.length} total</span>
            </div>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-400" /></div>
          ) : recentBookings.length === 0 ? (
            <div className="text-center py-10"><Home className="w-8 h-8 text-gray-200 mx-auto mb-2" /><p className="text-gray-400 text-sm">No bookings yet</p></div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentBookings.map(b => (
                <div key={b._id||b.id} className="px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-700 font-black text-xs">{(b.firstName||'?')[0].toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{b.firstName} {b.lastName}</p>
                        <p className="text-xs text-gray-400">{b.bookingNo} · {fmtDate(b.bookingDate)}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-emerald-600">₹{(b.bookingAmount||0).toLocaleString('en-IN')}</p>
                      <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[b.status]||'bg-gray-100 text-gray-600'}`}>
                        {b.status||'—'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── ROW 4: Project-wise + Quick Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Project-wise */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center">
                <Building2 size={15} className="text-white" />
              </div>
              <h2 className="font-bold text-gray-900">Projects Overview</h2>
            </div>
            {isMock && <span className="text-[9px] font-bold text-gray-300 uppercase">demo</span>}
          </div>
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
          ) : (
            <div className="divide-y divide-gray-50">
              {projectStats.map(p => {
                const soldPct = p.total > 0 ? Math.round(p.sold / p.total * 100) : 0
                return (
                  <div key={p._id||p.id} className="px-6 py-4 hover:bg-gray-50/40 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <MapPin size={10} /> {p.location || 'N/A'}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-white bg-gradient-to-r from-slate-700 to-slate-900 px-2.5 py-1 rounded-lg">{soldPct}% sold</span>
                    </div>
                    <div className="flex items-center gap-6 mb-2">
                      {[
                        { label: 'Total',  val: p.total,     cls: 'text-gray-900'     },
                        { label: 'Avail',  val: p.available, cls: 'text-emerald-600'  },
                        { label: 'Hold',   val: p.hold,      cls: 'text-amber-600'    },
                        { label: 'Sold',   val: p.sold,      cls: 'text-red-600'      },
                      ].map(({ label, val, cls }) => (
                        <div key={label} className="text-center">
                          <p className={`text-sm font-black ${cls}`}>{val}</p>
                          <p className="text-[10px] text-gray-400">{label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                      <div className="h-full bg-red-500"      style={{ width: `${p.total>0?p.sold/p.total*100:0}%` }} />
                      <div className="h-full bg-amber-400"    style={{ width: `${p.total>0?p.hold/p.total*100:0}%` }} />
                      <div className="h-full bg-emerald-500"  style={{ width: `${p.total>0?p.available/p.total*100:0}%` }} />
                    </div>
                  </div>
                )
              })}
              {projectStats.length === 0 && (
                <div className="text-center py-10"><Building2 className="w-8 h-8 text-gray-200 mx-auto mb-2" /><p className="text-gray-400 text-sm">No projects found</p></div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Target size={15} className="text-white" />
            </div>
            <h2 className="font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'New Booking',     Icon: Plus,       bg: 'bg-blue-50 border-blue-200 hover:bg-blue-100',     icon: 'text-blue-600'    },
              { label: 'New Letter',      Icon: FileText,   bg: 'bg-violet-50 border-violet-200 hover:bg-violet-100', icon: 'text-violet-600' },
              { label: 'View Inventory',  Icon: Building2,  bg: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100', icon: 'text-emerald-600' },
              { label: 'Cost Sheet',      Icon: BarChart2,  bg: 'bg-amber-50 border-amber-200 hover:bg-amber-100',  icon: 'text-amber-600'   },
            ].map(({ label, Icon, bg, icon }) => (
              <button key={label} className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all hover:shadow-sm ${bg}`}>
                <Icon size={24} className={`${icon} mb-2`} />
                <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{label}</span>
              </button>
            ))}
          </div>

          {/* Target tracker */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-bold text-gray-600">Monthly Target</p>
              <p className="text-xs font-bold text-emerald-600">{soldUnits.length} / 10 units</p>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all"
                style={{ width: `${Math.min((soldUnits.length / 10) * 100, 100)}%` }} />
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5">{Math.round((soldUnits.length / 10) * 100)}% of monthly goal achieved</p>
          </div>

          {/* Best performing unit type */}
          <div className="mt-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <Award size={16} className="text-emerald-600" />
              <div>
                <p className="text-xs font-bold text-emerald-700">Top Unit Type</p>
                <p className="text-sm font-black text-gray-900">
                  {(() => {
                    const counts = soldUnits.reduce((acc, u) => { acc[u.unitType||'N/A'] = (acc[u.unitType||'N/A']||0)+1; return acc }, {})
                    const top = Object.entries(counts).sort((a,b) => b[1]-a[1])[0]
                    return top ? `${top[0]} (${top[1]} sold)` : 'N/A'
                  })()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default SalesDashboard