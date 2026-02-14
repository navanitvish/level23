import React from 'react';

const RealEstateCRM = () => {
  const stats = [
    { name: 'Total Properties', value: '1,234', change: '+12%', changeType: 'increase', icon: 'building', color: 'blue' },
    { name: 'Active Listings', value: '56', change: '+8%', changeType: 'increase', icon: 'home', color: 'emerald' },
    { name: 'Monthly Revenue', value: '₹45,67,800', change: '+23%', changeType: 'increase', icon: 'rupee', color: 'violet' },
    { name: 'Closing Rate', value: '98%', change: '+2%', changeType: 'increase', icon: 'chart', color: 'amber' },
  ];

  const recentActivities = [
    { id: 1, user: 'Priya Sharma', action: 'Added luxury villa in Banjara Hills', time: '2 minutes ago', type: 'new', avatar: 'PS' },
    { id: 2, user: 'Rajesh Kumar', action: 'Closed deal - 3BHK Apartment', time: '15 minutes ago', type: 'sale', avatar: 'RK' },
    { id: 3, user: 'Anita Desai', action: 'Scheduled site visit for client', time: '1 hour ago', type: 'visit', avatar: 'AD' },
    { id: 4, user: 'Vikram Singh', action: 'Updated property pricing', time: '2 hours ago', type: 'update', avatar: 'VS' },
    { id: 5, user: 'Meera Patel', action: 'Uploaded new property images', time: '3 hours ago', type: 'new', avatar: 'MP' },
  ];

  const getIcon = (iconName) => {
    const icons = {
      building: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      home: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      rupee: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1",
      chart: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    };
    return icons[iconName];
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        gradient: 'from-blue-500 to-blue-600',
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        ring: 'ring-blue-100'
      },
      emerald: {
        gradient: 'from-emerald-500 to-emerald-600',
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        ring: 'ring-emerald-100'
      },
      violet: {
        gradient: 'from-violet-500 to-violet-600',
        bg: 'bg-violet-50',
        text: 'text-violet-600',
        ring: 'ring-violet-100'
      },
      amber: {
        gradient: 'from-amber-500 to-amber-600',
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        ring: 'ring-amber-100'
      }
    };
    return colors[color];
  };

  const getActivityIcon = (type) => {
    const config = {
      new: { bg: 'bg-blue-500', icon: 'M12 4v16m8-8H4' },
      sale: { bg: 'bg-green-500', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
      visit: { bg: 'bg-purple-500', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
      update: { bg: 'bg-orange-500', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' }
    };
    return config[type] || config.new;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Grid - Modern Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {stats.map((stat) => {
            const colorClass = getColorClasses(stat.color);
            return (
              <div 
                key={stat.name} 
                className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 overflow-hidden"
              >
                {/* Decorative gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colorClass.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${colorClass.bg} ${colorClass.ring} ring-4 group-hover:scale-110 transition-transform duration-300`}>
                      <svg 
                        className={`w-6 h-6 ${colorClass.text}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d={getIcon(stat.icon)} 
                        />
                      </svg>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      {stat.change}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Recent Activities - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
                    <p className="text-sm text-gray-500 mt-1">Latest updates from your team</p>
                  </div>
                  <button className="text-sm font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-sm hover:shadow-md">
                    View All
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {recentActivities.map((activity) => {
                  const activityConfig = getActivityIcon(activity.type);
                  return (
                    <div 
                      key={activity.id} 
                      className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150 group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative flex-shrink-0">
                          <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                            {activity.avatar}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${activityConfig.bg} rounded-lg border-2 border-white shadow-sm flex items-center justify-center`}>
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={activityConfig.icon} />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {activity.user}
                          </p>
                          <p className="text-sm text-gray-600 mt-0.5 line-clamp-1">
                            {activity.action}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Actions - Takes 1 column */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 hover:border-blue-300 transition-all duration-200 text-left group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Add Property</h4>
                      <p className="text-xs text-gray-500">List new property</p>
                    </div>
                  </div>
                </button>

                <button className="w-full p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 hover:border-emerald-300 transition-all duration-200 text-left group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Manage Clients</h4>
                      <p className="text-xs text-gray-500">View all clients</p>
                    </div>
                  </div>
                </button>

                <button className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100 hover:border-purple-300 transition-all duration-200 text-left group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">View Reports</h4>
                      <p className="text-xs text-gray-500">Analytics & insights</p>
                    </div>
                  </div>
                </button>

                <button className="w-full p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 hover:border-amber-300 transition-all duration-200 text-left group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Schedule Visit</h4>
                      <p className="text-xs text-gray-500">Book site tour</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">This Month</h3>
                  <p className="text-blue-100 text-sm">Performance Summary</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100 text-sm">Deals Closed</span>
                  <span className="font-bold text-xl">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100 text-sm">Site Visits</span>
                  <span className="font-bold text-xl">67</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100 text-sm">New Leads</span>
                  <span className="font-bold text-xl">152</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-100">vs Last Month</span>
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    +18%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealEstateCRM;