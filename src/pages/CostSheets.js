import React, { useState } from 'react';

const CostSheets = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const [newCostSheet, setNewCostSheet] = useState({
    projectName: '',
    propertyType: 'apartment',
    unitNumber: '',
    basePrice: '',
    area: '',
  });

  // Cost Sheet Templates
  const costSheetTemplates = [
    {
      id: 1,
      name: 'Luxury Apartment - 3BHK',
      propertyType: 'Apartment',
      area: '1850',
      basePrice: '75,00,000',
      breakdown: {
        basePrice: 7500000,
        plcCharges: 500000,
        carParking: 300000,
        clubMembership: 200000,
        developmentCharges: 150000,
        maintenanceDeposit: 100000,
        legalCharges: 75000,
        gst: 1296750, // 18% on total
      },
      total: 10121750,
      status: 'Active',
      createdDate: '2026-01-15',
      project: 'Skyline Towers',
    },
    {
      id: 2,
      name: 'Villa - 4BHK Independent',
      propertyType: 'Villa',
      area: '2500',
      basePrice: '1,20,00,000',
      breakdown: {
        basePrice: 12000000,
        plcCharges: 800000,
        carParking: 0, // Included
        clubMembership: 500000,
        developmentCharges: 300000,
        maintenanceDeposit: 200000,
        legalCharges: 150000,
        gst: 2511000, // 18% on total
      },
      total: 16461000,
      status: 'Active',
      createdDate: '2026-01-12',
      project: 'Green Valley Estates',
    },
    {
      id: 3,
      name: 'Commercial Office Space',
      propertyType: 'Commercial',
      area: '1200',
      basePrice: '96,00,000',
      breakdown: {
        basePrice: 9600000,
        plcCharges: 600000,
        carParking: 400000,
        clubMembership: 0,
        developmentCharges: 250000,
        maintenanceDeposit: 150000,
        legalCharges: 100000,
        gst: 1998000, // 18% on total
      },
      total: 13098000,
      status: 'Active',
      createdDate: '2026-01-10',
      project: 'Business Park',
    },
    {
      id: 4,
      name: 'Penthouse - 5BHK Premium',
      propertyType: 'Penthouse',
      area: '3200',
      basePrice: '2,50,00,000',
      breakdown: {
        basePrice: 25000000,
        plcCharges: 1500000,
        carParking: 600000,
        clubMembership: 750000,
        developmentCharges: 500000,
        maintenanceDeposit: 300000,
        legalCharges: 200000,
        gst: 5193000, // 18% on total
      },
      total: 34043000,
      status: 'Draft',
      createdDate: '2026-01-08',
      project: 'Premium Heights',
    },
    {
      id: 5,
      name: 'Plot - Residential',
      propertyType: 'Plot',
      area: '2000',
      basePrice: '60,00,000',
      breakdown: {
        basePrice: 6000000,
        plcCharges: 300000,
        carParking: 0,
        clubMembership: 0,
        developmentCharges: 100000,
        maintenanceDeposit: 0,
        legalCharges: 80000,
        gst: 1166400, // 18% on total
      },
      total: 7646400,
      status: 'Active',
      createdDate: '2026-01-05',
      project: 'Lake View Plots',
    },
    {
      id: 6,
      name: 'Studio Apartment',
      propertyType: 'Apartment',
      area: '650',
      basePrice: '28,00,000',
      breakdown: {
        basePrice: 2800000,
        plcCharges: 150000,
        carParking: 150000,
        clubMembership: 100000,
        developmentCharges: 50000,
        maintenanceDeposit: 40000,
        legalCharges: 30000,
        gst: 578400, // 18% on total
      },
      total: 3898400,
      status: 'Active',
      createdDate: '2026-01-03',
      project: 'Urban Living',
    },
  ];

  const stats = [
    {
      label: 'Total Templates',
      value: costSheetTemplates.length.toString(),
      change: '+3 this month',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      color: 'blue',
    },
    {
      label: 'Active Sheets',
      value: costSheetTemplates.filter(t => t.status === 'Active').length.toString(),
      change: 'Ready to use',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'emerald',
    },
    {
      label: 'Avg. Total Cost',
      value: '₹' + (costSheetTemplates.reduce((sum, t) => sum + t.total, 0) / costSheetTemplates.length / 10000000).toFixed(2) + 'Cr',
      change: 'Across all types',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
      color: 'violet',
    },
    {
      label: 'Property Types',
      value: '5',
      change: 'Categories',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      color: 'amber',
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        gradient: 'from-blue-500 to-blue-600',
        bg: 'bg-blue-50',
        text: 'text-blue-600',
      },
      emerald: {
        gradient: 'from-emerald-500 to-emerald-600',
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
      },
      violet: {
        gradient: 'from-violet-500 to-violet-600',
        bg: 'bg-violet-50',
        text: 'text-violet-600',
      },
      amber: {
        gradient: 'from-amber-500 to-amber-600',
        bg: 'bg-amber-50',
        text: 'text-amber-600',
      },
    };
    return colors[color];
  };

  const getPropertyTypeColor = (type) => {
    const typeColors = {
      Apartment: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200',
      Villa: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
      Commercial: 'bg-violet-100 text-violet-700 ring-1 ring-violet-200',
      Penthouse: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
      Plot: 'bg-rose-100 text-rose-700 ring-1 ring-rose-200',
    };
    return typeColors[type] || 'bg-gray-100 text-gray-700 ring-1 ring-gray-200';
  };

  const filteredTemplates = costSheetTemplates.filter(template => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return template.status === 'Active';
    if (activeTab === 'draft') return template.status === 'Draft';
    return true;
  });

  const handleViewDetails = (template) => {
    setSelectedTemplate(template);
  };

  const handleCloseDetails = () => {
    setSelectedTemplate(null);
  };

  const formatCurrency = (amount) => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cost Sheets</h1>
          <p className="text-gray-600 mt-1">Manage property cost breakdowns and pricing templates</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-sm hover:shadow-md font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Cost Sheet
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const colorClass = getColorClasses(stat.color);
          return (
            <div key={index} className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 ${colorClass.bg} rounded-xl group-hover:scale-110 transition-transform`}>
                  <svg className={`w-6 h-6 ${colorClass.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'all', label: 'All Templates', count: costSheetTemplates.length },
            { id: 'active', label: 'Active', count: costSheetTemplates.filter(t => t.status === 'Active').length },
            { id: 'draft', label: 'Draft', count: costSheetTemplates.filter(t => t.status === 'Draft').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 font-semibold transition-all relative ${
                activeTab === tab.id
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                activeTab === tab.id
                  ? 'bg-blue-200 text-blue-700'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
              )}
            </button>
          ))}
        </div>

        {/* Templates Grid/List */}
        <div className="p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-lg mb-1">{template.name}</h3>
                        <p className="text-blue-100 text-sm">{template.project}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        template.status === 'Active'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}>
                        {template.status}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPropertyTypeColor(template.propertyType)}`}>
                        {template.propertyType}
                      </span>
                      <span className="text-sm text-gray-600">{template.area} sq ft</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Base Price</span>
                        <span className="font-semibold text-gray-900">₹{template.basePrice}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">Total Cost</span>
                        <span className="font-bold text-xl text-blue-600">{formatCurrency(template.total)}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-500">Created: {template.createdDate}</span>
                      <button
                        onClick={() => handleViewDetails(template)}
                        className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
                      >
                        View Details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-gray-900">{template.name}</h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPropertyTypeColor(template.propertyType)}`}>
                            {template.propertyType}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            template.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {template.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span>{template.project}</span>
                          <span>•</span>
                          <span>{template.area} sq ft</span>
                          <span>•</span>
                          <span>Created: {template.createdDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Total Cost</p>
                        <p className="text-xl font-bold text-blue-600">{formatCurrency(template.total)}</p>
                      </div>
                      <button
                        onClick={() => handleViewDetails(template)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all font-semibold text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 sticky top-0 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedTemplate.name}</h2>
                  <p className="text-blue-100">{selectedTemplate.project}</p>
                </div>
                <button
                  onClick={handleCloseDetails}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Property Info */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Property Type</p>
                  <p className="font-bold text-gray-900">{selectedTemplate.propertyType}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Area</p>
                  <p className="font-bold text-gray-900">{selectedTemplate.area} sq ft</p>
                </div>
                <div className="bg-violet-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <p className="font-bold text-gray-900">{selectedTemplate.status}</p>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Cost Breakdown</h3>
                <div className="space-y-3">
                  {Object.entries(selectedTemplate.breakdown).map(([key, value]) => {
                    const labels = {
                      basePrice: 'Base Price',
                      plcCharges: 'PLC Charges',
                      carParking: 'Car Parking',
                      clubMembership: 'Club Membership',
                      developmentCharges: 'Development Charges',
                      maintenanceDeposit: 'Maintenance Deposit',
                      legalCharges: 'Legal Charges',
                      gst: 'GST (18%)',
                    };
                    const isGST = key === 'gst';
                    const isTotal = key === 'total';
                    
                    return (
                      <div
                        key={key}
                        className={`flex justify-between items-center p-4 rounded-xl ${
                          isGST ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'
                        }`}
                      >
                        <span className={`font-semibold ${isGST ? 'text-amber-900' : 'text-gray-700'}`}>
                          {labels[key]}
                        </span>
                        <span className={`font-bold ${isGST ? 'text-amber-600' : 'text-gray-900'}`}>
                          {value === 0 ? 'Included' : formatCurrency(value)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">Total Cost</span>
                  <span className="text-3xl font-bold">{formatCurrency(selectedTemplate.total)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all">
                  Download PDF
                </button>
                <button className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all">
                  Duplicate Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal (Placeholder) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">Create New Cost Sheet</h2>
              <p className="text-blue-100 text-sm mt-1">Fill in the details to generate a cost breakdown</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Skyline Towers"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type</label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                  <option>Apartment</option>
                  <option>Villa</option>
                  <option>Penthouse</option>
                  <option>Plot</option>
                  <option>Commercial</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Area (sq ft)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="1850"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Base Price (₹)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="7500000"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-gray-700 font-semibold border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-sm">
                Generate Cost Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostSheets;