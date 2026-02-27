// src/components/Layout.jsx
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">

      {/* ── SIDEBAR — fixed, full height, never scrolls ── */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      {/* ── RIGHT SIDE ── */}
      <div className="flex-1 flex flex-col  min-w-0">

        {/* ── HEADER — fixed at top, never scrolls ── */}
        <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        {/* ── MAIN CONTENT — only this scrolls ── */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-4">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};

export default Layout;