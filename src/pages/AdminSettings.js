// src/pages/AdminSettings.jsx
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Settings, IndianRupee, Save, Loader2, CheckCircle,
  RotateCcw, Info, TrendingUp, Building2, Zap,
  Shield, Users, Wrench
} from 'lucide-react'
import { adminSettingsApi } from '../api/endpoints'

// ─── RATE FIELDS CONFIG ────────────────────────────────────────
const RATE_FIELDS = [
  { key: 'basicRate',       label: 'Basic Rate',                       hint: 'Per sqft base price',              icon: Building2, color: 'blue'    },
  { key: 'development',     label: 'Development Charges',              hint: 'Per sqft development cost',        icon: Wrench,    color: 'cyan'     },
  { key: 'dgBackup',        label: 'DG Backup',                        hint: 'Per sqft DG backup charges',       icon: Zap,       color: 'amber'    },
  { key: 'recreation',      label: 'Recreational Facilities',          hint: 'Per sqft recreation charges',      icon: Shield,    color: 'emerald'  },
  { key: 'societyLegal',    label: 'Society & Legal Charges',          hint: 'Per sqft society formation',       icon: Users,     color: 'violet'   },
  { key: 'floorRise',       label: 'Floor Rise',                       hint: 'Per sqft per floor (from 7th)',    icon: TrendingUp,color: 'rose'     },
  { key: 'otherCharges',    label: 'Other Charges',                    hint: 'Fixed amount (not per sqft)',      icon: IndianRupee,color: 'slate'   },
]

const COLOR = {
  blue:    { bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-200',    ring: 'focus:ring-blue-500'    },
  cyan:    { bg: 'bg-cyan-50',    text: 'text-cyan-600',    border: 'border-cyan-200',    ring: 'focus:ring-cyan-500'    },
  amber:   { bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-200',   ring: 'focus:ring-amber-500'   },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', ring: 'focus:ring-emerald-500' },
  violet:  { bg: 'bg-violet-50',  text: 'text-violet-600',  border: 'border-violet-200',  ring: 'focus:ring-violet-500'  },
  rose:    { bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-200',    ring: 'focus:ring-rose-500'    },
  slate:   { bg: 'bg-slate-50',   text: 'text-slate-600',   border: 'border-slate-200',   ring: 'focus:ring-slate-500'   },
}

const inr = (n) => '₹' + parseFloat(n || 0).toLocaleString('en-IN')

const DEFAULT_RATES = {
  basicRate: 16000, development: 500, dgBackup: 200,
  recreation: 200, societyLegal: 100, floorRise: 50, otherCharges: 1000000,
}

// ═══════════════════════════════════════════════════════════════
const AdminSettings = () => {
  const qc = useQueryClient()
  const [rates, setRates]       = useState({ ...DEFAULT_RATES })
  const [saved, setSaved]       = useState(false)
  const [settingsId, setSettingsId] = useState(null)

  // ── GET settings ──
  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn:  async () => {
      const res = await adminSettingsApi.get()
      return res?.data?.data || res?.data || res || null
    },
  })

  // populate form when data loads
  useEffect(() => {
    if (settings?.costSheetRates) {
      setRates({ ...DEFAULT_RATES, ...settings.costSheetRates })
      setSettingsId(settings._id || settings.id || null)
    }
  }, [settings])

  // ── SAVE mutation ──
  const save = useMutation({
    mutationFn: (payload) => settingsId
      ? adminSettingsApi.update({ costSheetRates: payload })
      : adminSettingsApi.create({ costSheetRates: payload }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['admin-settings'] })
      const newId = res?.data?.data?._id || res?.data?._id
      if (newId) setSettingsId(newId)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    },
    onError: (e) => alert(e?.response?.data?.message || 'Failed to save settings'),
  })

  const handleChange = (key, val) => {
    setRates(prev => ({ ...prev, [key]: parseFloat(val) || 0 }))
  }

  const handleReset = () => {
    setRates({ ...DEFAULT_RATES })
  }

  const handleSave = () => {
    save.mutate(rates)
  }

  // ── live total preview (for 1000 sqft unit) ──
  const previewArea = 1000
  const previewTotal =
    previewArea * rates.basicRate +
    previewArea * rates.development +
    previewArea * rates.dgBackup +
    previewArea * rates.recreation +
    previewArea * rates.societyLegal +
    previewArea * rates.floorRise +
    rates.otherCharges

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-7 text-white">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Settings</h1>
              <p className="text-slate-400 text-sm mt-0.5">Configure default cost sheet rates for all projects</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleReset}
              className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all">
              <RotateCcw size={15} /> Reset Defaults
            </button>
            <button onClick={handleSave} disabled={save.isPending}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg ${
                saved
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-slate-900 hover:bg-slate-100'
              }`}>
              {save.isPending
                ? <Loader2 size={15} className="animate-spin" />
                : saved
                ? <CheckCircle size={15} />
                : <Save size={15} />
              }
              {save.isPending ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
            </button>
          </div>
        </div>
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT: RATE FIELDS ── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <IndianRupee className="w-5 h-5 text-blue-600" />
                <div>
                  <h2 className="font-bold text-gray-900">Cost Sheet Rates</h2>
                  <p className="text-xs text-gray-400 mt-0.5">These defaults will be used when generating cost sheets</p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {RATE_FIELDS.map(({ key, label, hint, icon: Icon, color }) => {
                  const c = COLOR[color]
                  return (
                    <div key={key}
                      className={`flex items-center gap-4 p-4 rounded-xl border ${c.border} ${c.bg} transition-all`}>
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0`}>
                        <Icon size={18} className={c.text} />
                      </div>

                      {/* Label */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${c.text}`}>{label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{hint}</p>
                      </div>

                      {/* Input */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm font-bold text-gray-500">₹</span>
                        <input
                          type="number"
                          value={rates[key]}
                          onChange={e => handleChange(key, e.target.value)}
                          min="0"
                          className={`w-32 border border-white bg-white rounded-xl px-3 py-2 text-sm font-bold text-right text-gray-900 focus:outline-none focus:ring-2 ${c.ring} shadow-sm`}
                        />
                        {key !== 'otherCharges' && (
                          <span className="text-xs text-gray-400 font-medium w-14">/sqft</span>
                        )}
                        {key === 'otherCharges' && (
                          <span className="text-xs text-gray-400 font-medium w-14">fixed</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── RIGHT: PREVIEW + INFO ── */}
          <div className="space-y-4">

            {/* Live Preview */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-sm">Live Preview</h3>
                <p className="text-xs text-gray-400 mt-0.5">Sample calc for 1,000 sqft unit</p>
              </div>
              <div className="p-5 space-y-2">
                {RATE_FIELDS.map(({ key, label, color }) => {
                  const c   = COLOR[color]
                  const val = key === 'otherCharges'
                    ? rates[key]
                    : previewArea * rates[key]
                  return (
                    <div key={key} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                      <span className="text-xs text-gray-500">{label}</span>
                      <span className={`text-xs font-bold ${c.text}`}>{inr(val)}</span>
                    </div>
                  )
                })}
                <div className="flex items-center justify-between pt-3 mt-1 border-t-2 border-slate-800">
                  <span className="text-sm font-bold text-slate-800">Total</span>
                  <span className="text-base font-black text-slate-800">{inr(previewTotal)}</span>
                </div>
                <p className="text-xs text-gray-400 text-center pt-1">For 1,000 sqft unit</p>
              </div>
            </div>

            {/* Info card */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-800 mb-2">How it works</p>
                  <ul className="text-xs text-blue-700 space-y-1.5">
                    <li>• Per sqft rates × unit's saleable area</li>
                    <li>• Other Charges is a fixed amount</li>
                    <li>• Floor Rise applies from 7th floor onwards</li>
                    <li>• These are default values, can be overridden per cost sheet</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Current saved values */}
            {settings?.costSheetRates && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Last Saved Values</p>
                <div className="space-y-1.5">
                  {RATE_FIELDS.map(({ key, label }) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-xs text-gray-400">{label}</span>
                      <span className="text-xs font-semibold text-gray-700">{inr(settings.costSheetRates[key] || 0)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GLOBAL SAVING */}
      {save.isPending && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-5 shadow-2xl flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span className="font-semibold text-gray-900 text-sm">Saving settings...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminSettings