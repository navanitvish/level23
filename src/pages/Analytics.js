import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  Users,
  DollarSign,
  Building,
  Eye,
  Download,
  Calendar,
  Target
} from 'lucide-react';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data for charts
  const salesData = [
    { month: 'Jan', sales: 4000, revenue: 2400 },
    { month: 'Feb', sales: 3000, revenue: 1398 },
    { month: 'Mar', sales: 2000, revenue: 9800 },
    { month: 'Apr', sales: 2780, revenue: 3908 },
    { month: 'May', sales: 1890, revenue: 4800 },
    { month: 'Jun', sales: 2390, revenue: 3800 },
  ];

  const projectData = [
    { name: 'Completed', value: 45, color: '#10B981' },
    { name: 'In Progress', value: 30, color: '#F59E0B' },
    { name: 'Pending', value: 15, color: '#EF4444' },
    { name: 'On Hold', value: 10, color: '#6B7280' },
  ];

  const userEngagementData = [
    { day: 'Mon', visits: 1200, leads: 80 },
    { day: 'Tue', visits: 1100, leads: 75 },
    { day: 'Wed', visits: 1300, leads: 90 },
    { day: 'Thu', visits: 1400, leads: 95 },
    { day: 'Fri', visits: 1500, leads: 100 },
    { day: 'Sat', visits: 1000, leads: 60 },
    { day: 'Sun', visits: 900, leads: 50 },
  ];

  const stats = [
    { label: 'Total Revenue', value: '₹2.4Cr', change: '+15%', icon: DollarSign },
    { label: 'Active Users', value: '12,456', change: '+8%', icon: Users },
    { label: 'Projects Completed', value: '156', change: '+12%', icon: Building },
    { label: 'Conversion Rate', value: '24.5%', change: '+5%', icon: Target }
  ];

  const topProjects = [
    { name: 'Green Valley Apartments', revenue: '₹45L', leads: 120, status: 'Completed' },
    { name: 'Sunrise Villas', revenue: '₹78L', leads: 95, status: 'In Progress' },
    { name: 'Metro Heights', revenue: '₹1.2Cr', leads: 200, status: 'In Progress' },
    { name: 'Lake View Residency', revenue: '₹52L', leads: 85, status: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive insights into sales, revenue, and project performance
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <IconComponent className="text-gray-400" size={24} />
                    <span className={`px-2 py-1 text-xs rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex space-x-1 px-6 pt-4">
                  {[
                    { id: 'overview', label: 'Overview', icon: '📊' },
                    { id: 'sales', label: 'Sales', icon: '💰' },
                    { id: 'projects', label: 'Projects', icon: '🏗️' },
                    { id: 'users', label: 'Users', icon: '👥' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-t-lg font-medium transition-all ${activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 border-t border-x border-gray-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xl">{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Analytics Overview</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <h4 className="text-lg font-semibold mb-4">Revenue Trend</h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <h4 className="text-lg font-semibold mb-4">Project Status Distribution</h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={projectData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {projectData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'sales' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Sales Analytics</h3>
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <h4 className="text-lg font-semibold mb-4">Sales vs Revenue</h4>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="sales" fill="#3B82F6" />
                          <Bar dataKey="revenue" fill="#10B981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {activeTab === 'projects' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Project Performance</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leads</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {topProjects.map((project, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.name}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{project.revenue}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{project.leads}</td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                  project.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {project.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'users' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">User Engagement</h3>
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <h4 className="text-lg font-semibold mb-4">Weekly User Activity</h4>
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={userEngagementData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="visits" stroke="#3B82F6" strokeWidth={2} />
                          <Line type="monotone" dataKey="leads" stroke="#F59E0B" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  <Download size={16} />
                  <span>Export Report</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  <Calendar size={16} />
                  <span>Schedule Report</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                  <Eye size={16} />
                  <span>View Insights</span>
                </button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg. Deal Size</span>
                  <span className="font-semibold">₹2.5L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Lead Conversion</span>
                  <span className="font-semibold">24.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Customer Retention</span>
                  <span className="font-semibold">89%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">ROI</span>
                  <span className="font-semibold">156%</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="text-green-600 mt-1" size={16} />
                  <div>
                    <p className="text-sm font-medium">Revenue increased by 15%</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="text-blue-600 mt-1" size={16} />
                  <div>
                    <p className="text-sm font-medium">New user milestone reached</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Building className="text-purple-600 mt-1" size={16} />
                  <div>
                    <p className="text-sm font-medium">Project completion rate up</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
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

export default Analytics;