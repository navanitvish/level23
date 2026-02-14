// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const menuItems = [
  { id: 1, name: 'Dashboard', path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', roles: ['admin', 'sales'] },
  { id: 2, name: 'Inventory', path: '/inventory', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', roles: ['admin', 'sales'] },
  { id: 3, name: 'Manage Categories', path: '/manage-categories', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', roles: ['admin'] },
  { id: 4, name: 'Cost Sheets', path: '/cost-sheets', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', roles: ['admin', 'sales'] },
  { id: 5, name: 'Booking Forms', path: '/booking-forms', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', roles: ['admin', 'sales'] },
  { id: 6, name: 'RERA Details', path: '/rera-details', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', roles: ['admin', 'sales'] },
  { id: 7, name: 'Terms & Conditions', path: '/terms-conditions', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', roles: ['admin', 'sales'] },
  { id: 8, name: 'Privacy Policy', path: '/privacy-policy', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', roles: ['admin', 'sales'] },
  { id: 9, name: 'FAQ', path: '/faq', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', roles: ['admin', 'sales'] },
  { id: 10, name: 'Data Analysis', path: '/data-analysis', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', roles: ['admin', 'sales'] },
  { id: 11, name: 'Calculator', path: '/calculator', icon: 'M7 2a1 1 0 00-1 1v14a1 1 0 001 1h10a1 1 0 001-1V3a1 1 0 00-1-1H7zM7 4h10v12H7V4zm2 2h2v2H9V6zm4 0h2v2h-2V6zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2z', roles: ['admin', 'sales'] },
  { id: 12, name: 'Demand Letters', path: '/demand-letters', icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', roles: ['admin', 'sales'] },
  { id: 13, name: 'Channel Partners', path: '/channel-partners', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0A23 23 0 0011.75 3c-2.393 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018c0 1.602 1.123 2.995 2.457 3.228A24.908 24.908 0 0012 15.75c2.648 0 5.195-.429 7.578-1.22m2.022-8.99a24.81 24.81 0 00-2.457-3.228', roles: ['admin', 'sales'] },
  { id: 14, name: 'Marketing', path: '/marketing', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z', roles: ['admin', 'sales'] },
  { id: 15, name: 'Receipts', path: '/receipts', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z', roles: ['admin', 'sales'] },
  { id: 16, name: 'Recovery', path: '/recovery', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', roles: ['admin', 'sales'] },
];

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const filteredMenuItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(user?.role)
  );

  return (
    <>
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 text-white transition-transform duration-300 ease-in-out transform lg:flex lg:flex-shrink-0 shadow-xl`}
        style={{ background: 'linear-gradient(180deg, #0061FF, #0052d6)' }}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center px-6 h-16 border-b border-white/10 backdrop-blur-sm">
            <div className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/30">
              <span className="text-white font-bold text-lg">LE</span>
            </div>
            <span className="ml-3 text-lg font-bold text-white tracking-tight">
              LEVEL23
            </span>
          </div>
          
          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <nav className="space-y-1">
              {filteredMenuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                    location.pathname === item.path 
                      ? 'bg-white text-blue-600 shadow-lg' 
                      : 'text-blue-50 hover:bg-white/10 hover:text-white backdrop-blur-sm'
                  }`}
                >
                  <svg 
                    className={`w-5 h-5 mr-3 transition-transform duration-200 ${
                      location.pathname === item.path 
                        ? 'text-blue-600 scale-110' 
                        : 'text-blue-100 group-hover:text-white group-hover:scale-110'
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span className="flex-1">{item.name}</span>
                  {location.pathname === item.path && (
                    <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Divider */}
            <div className="my-4 border-t border-white/10"></div>

            {/* User Info Card */}
            <div className="mx-1 px-4 py-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-blue-100 capitalize">{user?.role || 'User'}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-4 mx-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
                <h3 className="text-xs font-semibold text-blue-100 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-blue-50">Active Projects</span>
                      <span className="font-semibold text-white">12</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-400 to-blue-300 h-1.5 rounded-full shadow-sm" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-blue-50">Completion</span>
                      <span className="font-semibold text-white">78%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-400 to-emerald-300 h-1.5 rounded-full shadow-sm" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/10 backdrop-blur-sm">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 group backdrop-blur-sm border border-white/20"
            >
              <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;