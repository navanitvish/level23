import React from 'react';

const AdminDashboard = () => {
  const stats = [
    { name: 'Total Users', value: '1,234', change: '+12%', changeType: 'increase' },
    { name: 'Active Projects', value: '56', change: '+8%', changeType: 'increase' },
    { name: 'Revenue', value: '₹4,56,780', change: '+23%', changeType: 'increase' },
    { name: 'System Health', value: '98%', change: '+2%', changeType: 'increase' },
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Created new project', time: '2 minutes ago' },
    { id: 2, user: 'Jane Smith', action: 'Updated user permissions', time: '15 minutes ago' },
    { id: 3, user: 'Mike Johnson', action: 'Deleted old backup', time: '1 hour ago' },
    { id: 4, user: 'Sarah Wilson', action: 'Added new user', time: '2 hours ago' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 text-sm sm:text-base">Welcome back! Here's what's happening with your system today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700 mb-1">{stat.name}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  stat.changeType === 'increase'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  <svg className={`w-3 h-3 mr-1 ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d={
                      stat.changeType === 'increase'
                        ? "M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                        : "M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                    } clipRule="evenodd" />
                  </svg>
                  {stat.change}
                </div>
              </div>
              <div className={`p-3 rounded-full ${
                stat.name === 'Revenue' ? 'bg-green-100' :
                stat.name === 'Active Projects' ? 'bg-blue-100' :
                stat.name === 'Total Users' ? 'bg-purple-100' : 'bg-gray-100'
              }`}>
                <svg className={`w-6 h-6 ${
                  stat.name === 'Revenue' ? 'text-green-600' :
                  stat.name === 'Active Projects' ? 'text-blue-600' :
                  stat.name === 'Total Users' ? 'text-purple-600' : 'text-gray-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                    stat.name === 'Revenue' ? "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" :
                    stat.name === 'Active Projects' ? "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" :
                    stat.name === 'Total Users' ? "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0A23 23 0 0011.75 3c-2.393 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018c0 1.602 1.123 2.995 2.457 3.228A24.908 24.908 0 0012 15.75c2.648 0 5.195-.429 7.578-1.22m2.022-8.99a24.81 24.81 0 00-2.457-3.228" :
                    "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  } />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-indigo-600">
                        {activity.user.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;