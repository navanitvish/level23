// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// ─── ADMIN MENU ───────────────────────────────────────────────
const adminMenu = [
  {
    group: 'Main',
    items: [
      { id: 1,  name: 'Dashboard',          path: '/dashboard',         icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    ]
  },
  {
    group: 'Project & Property',
    items: [
      { id: 2,  name: 'Manage Project',     path: '/projects',          icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
      { id: 3,  name: 'Manage Properties',  path: '/manage-properties', icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z' },
      { id: 4,  name: 'Inventory',          path: '/inventory',         icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
      { id: 5,  name: 'Manage Categories',  path: '/manage-categories', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    ]
  },
  {
    group: 'Finance & Legal',
    items: [
      { id: 6,  name: 'Cost Sheets',        path: '/cost-sheets',       icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
      { id: 7,  name: 'Booking Forms',      path: '/booking-forms',     icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { id: 8,  name: 'Demand Letters',     path: '/demand-letters',    icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
      { id: 9,  name: 'RERA Details',       path: '/rera-details',      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
      { id: 10, name: 'Terms & Conditions', path: '/terms-conditions',  icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { id: 11, name: 'Privacy Policy',     path: '/privacy-policy',    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    ]
  },
  {
    group: 'Tools & Partners',
    items: [
      { id: 12, name: 'Data Analysis',      path: '/data-analysis',     icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
      { id: 13, name: 'Calculator',         path: '/calculator',        icon: 'M7 2a1 1 0 00-1 1v14a1 1 0 001 1h10a1 1 0 001-1V3a1 1 0 00-1-1H7zM9 6h2v2H9V6zm4 0h2v2h-2V6zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2z' },
      { id: 14, name: 'Channel Partners',   path: '/channel-partners',  icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
      { id: 15, name: 'FAQ',                path: '/faq',               icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    ]
  },
]

// ─── SALES MENU ───────────────────────────────────────────────
const salesMenu = [
  {
    group: 'Main',
    items: [
      { id: 1, name: 'Dashboard',          path: '/dashboard',        icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    ]
  },
  {
    group: 'Sales Tools',
    items: [
      { id: 2, name: 'Inventory',          path: '/inventory',        icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
      { id: 3, name: 'Cost Sheets',        path: '/cost-sheets',      icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
      { id: 4, name: 'Booking Forms',      path: '/booking-forms',    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { id: 5, name: 'Demand Letters',     path: '/demand-letters',   icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
      { id: 6, name: 'Calculator',         path: '/calculator',       icon: 'M7 2a1 1 0 00-1 1v14a1 1 0 001 1h10a1 1 0 001-1V3a1 1 0 00-1-1H7zM9 6h2v2H9V6zm4 0h2v2h-2V6zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2z' },
    ]
  },
  {
    group: 'Info & Compliance',
    items: [
      { id: 7, name: 'RERA Details',       path: '/rera-details',     icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
      { id: 8, name: 'Terms & Conditions', path: '/terms-conditions', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { id: 9, name: 'Privacy Policy',     path: '/privacy-policy',   icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
      { id: 10, name: 'Data Analysis',     path: '/data-analysis',    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
      { id: 11, name: 'Channel Partners',  path: '/channel-partners', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
      { id: 12, name: 'FAQ',               path: '/faq',              icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    ]
  },
]

// ─── ROLE CONFIG ─────────────────────────────────────────────
const roleConfig = {
  admin: {
    menu:       adminMenu,
    label:      'Admin Panel',
    initials:   'AD',
    badgeColor: 'from-blue-400 to-cyan-400',
    badge:      'bg-blue-100 text-blue-700',
    accentBar:  'bg-gradient-to-b from-blue-600 to-cyan-700',
  },
  sales: {
    menu:       salesMenu,
    label:      'Sales Panel',
    initials:   'SP',
    badgeColor: 'from-emerald-400 to-teal-400',
    badge:      'bg-emerald-100 text-emerald-700',
    accentBar:  'bg-gradient-to-b from-emerald-600 to-teal-700',
  },
}

// ─── SIDEBAR ─────────────────────────────────────────────────
const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation()
  const { user, logout } = useAuth()

  const role   = user?.role === 'sales' ? 'sales' : 'admin'
  const config = roleConfig[role]
  const menu   = config.menu

  return (
    <>
      <aside
        className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          fixed lg:static inset-y-0 left-0 z-30 w-64 text-white
          transition-transform duration-300 ease-in-out lg:flex lg:flex-shrink-0 shadow-xl
          ${config.accentBar}`}
      >
        <div className="flex flex-col h-full w-full">

          {/* ── Header ── */}
          <div className="flex items-center px-5 h-16 border-b border-white/10">
            <div className="h-9 w-9 bg-white/20 rounded-xl flex items-center justify-center ring-2 ring-white/30 flex-shrink-0">
              <span className="text-white font-bold text-sm">LE</span>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">LEVEL23</p>
              <p className="text-xs text-white/60">{config.label}</p>
            </div>
            {/* Role badge */}
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${config.badge} flex-shrink-0`}>
              {role === 'admin' ? 'Admin' : 'Sales'}
            </span>
          </div>

          {/* ── Nav ── */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {menu.map((section) => (
              <div key={section.group}>
                {/* Group label */}
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest px-3 mb-1.5">
                  {section.group}
                </p>
                <nav className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                      <Link
                        key={item.id}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 group ${
                          isActive
                            ? 'bg-white text-gray-900 shadow-md'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <svg
                          className={`w-4 h-4 mr-3 flex-shrink-0 transition-transform duration-150 ${
                            isActive ? 'text-gray-700 scale-110' : 'text-white/60 group-hover:text-white group-hover:scale-110'
                          }`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                        <span className="flex-1 truncate">{item.name}</span>
                        {isActive && (
                          <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${config.badgeColor} flex-shrink-0`} />
                        )}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            ))}
          </div>

          {/* ── User Card ── */}
          <div className="px-3 pb-3 border-t border-white/10 pt-3 space-y-2">
            <div className="flex items-center gap-3 px-3 py-3 bg-white/10 rounded-xl border border-white/15">
              <div className={`h-9 w-9 bg-gradient-to-br ${config.badgeColor} rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow`}>
                {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || config.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-white/50 capitalize">{user?.email || user?.role}</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-white/10 hover:bg-red-500/80 rounded-xl transition-all duration-200 border border-white/15 group"
            >
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>

        </div>
      </aside>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar