// src/components/Layout.jsx
import React, { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  // const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Sidebar - Fixed, Full height, Scrollable */}
      <div className="fixed left-0 top-0 h-screen overflow-y-auto">
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      {/* Right side container with Header and Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Navigation Bar - Fixed at top of content area */}
        <div className="fixed top-0 right-0 left-0 z-10 transition-all duration-300" style={{ marginLeft: isSidebarOpen ? '16rem' : '0' }}>
          <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        </div>

        {/* Main Content - Scrollable, with top padding for fixed header */}
        <main className="flex-1 overflow-y-auto  pt-16">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Page Header */}
            {/* <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name?.split(' ')[0] || 'User'}!
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Here's what's happening with your projects today.
              </p>
            </div> */}

            {/* Content Area */}
            <div className=" ">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;