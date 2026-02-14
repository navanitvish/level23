import React, { useState } from 'react';

const CostSheets = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showCostSheetGenerator, setShowCostSheetGenerator] = useState(false);

  // Construction Link Plan Style Cost Sheet Generator State
  const [costSheetForm, setCostSheetForm] = useState({
    projectName: '',
    floor: '',
    units: [
      {
        unitType: 'A',
        carpetArea: '',
        saleArea: '',
        basicRate: 16000,
      }
    ],
    charges: {
      developmentCharges: 500,
      dgBackup: 200,
      recreationalFacilities: 200,
      societyFormation: 100,
      floorRise: 50,
      otherCharges: 1000000,
    }
  });

  const addUnit = () => {
    const unitTypes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const nextType = unitTypes[costSheetForm.units.length] || `Unit ${costSheetForm.units.length + 1}`;
    
    setCostSheetForm({
      ...costSheetForm,
      units: [
        ...costSheetForm.units,
        {
          unitType: nextType,
          carpetArea: '',
          saleArea: '',
          basicRate: 16000,
        }
      ]
    });
  };

  const removeUnit = (index) => {
    setCostSheetForm({
      ...costSheetForm,
      units: costSheetForm.units.filter((_, i) => i !== index)
    });
  };

  const updateUnit = (index, field, value) => {
    const newUnits = [...costSheetForm.units];
    newUnits[index][field] = value;
    setCostSheetForm({
      ...costSheetForm,
      units: newUnits
    });
  };

  const updateCharge = (field, value) => {
    setCostSheetForm({
      ...costSheetForm,
      charges: {
        ...costSheetForm.charges,
        [field]: value
      }
    });
  };

  const calculateUnitCosts = (unit) => {
    const saleArea = parseFloat(unit.saleArea) || 0;
    const basicRate = parseFloat(unit.basicRate) || 0;
    
    const basicAmount = saleArea * basicRate;
    const developmentCharges = saleArea * (costSheetForm.charges.developmentCharges || 0);
    const dgBackup = saleArea * (costSheetForm.charges.dgBackup || 0);
    const recreationalFacilities = saleArea * (costSheetForm.charges.recreationalFacilities || 0);
    const societyFormation = saleArea * (costSheetForm.charges.societyFormation || 0);
    const floorRise = saleArea * (costSheetForm.charges.floorRise || 0);
    const otherCharges = parseFloat(costSheetForm.charges.otherCharges) || 0;
    
    const total = basicAmount + developmentCharges + dgBackup + recreationalFacilities + 
                  societyFormation + floorRise + otherCharges;
    
    return {
      basicAmount,
      developmentCharges,
      dgBackup,
      recreationalFacilities,
      societyFormation,
      floorRise,
      otherCharges,
      total
    };
  };

  const generateCostSheet = () => {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6">
          <h2 className="text-2xl font-bold text-white text-center">
            COST SHEET (CONSTRUCTION LINK PLAN)
          </h2>
          {costSheetForm.projectName && (
            <p className="text-slate-200 text-center mt-2">{costSheetForm.projectName}</p>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="px-4 py-3 text-left font-bold text-gray-900"></th>
                <th className="px-4 py-3 text-center font-bold text-gray-900 border-l border-gray-300">Unit Type</th>
                {costSheetForm.units.map((unit, index) => (
                  <th key={index} className="px-4 py-3 text-center font-bold text-gray-900 border-l border-gray-300">
                    {unit.unitType}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Floor Row */}
              <tr className="border-b border-gray-300 bg-white hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900"></td>
                <td className="px-4 py-3 text-center font-semibold text-gray-700 border-l border-gray-300">Floor</td>
                {costSheetForm.units.map((unit, index) => (
                  <td key={index} className="px-4 py-3 text-center border-l border-gray-300">
                    {costSheetForm.floor || '-'}
                  </td>
                ))}
              </tr>

              {/* Carpet Area Row */}
              <tr className="border-b border-gray-300 bg-gray-50 hover:bg-gray-100">
                <td className="px-4 py-3 font-semibold text-gray-900"></td>
                <td className="px-4 py-3 text-center font-semibold text-gray-700 border-l border-gray-300">Carpet Area (Sq.ft.)</td>
                {costSheetForm.units.map((unit, index) => (
                  <td key={index} className="px-4 py-3 text-center border-l border-gray-300">
                    {unit.carpetArea || '-'}
                  </td>
                ))}
              </tr>

              {/* Sale Area Row */}
              <tr className="border-b border-gray-300 bg-white hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900"></td>
                <td className="px-4 py-3 text-center font-semibold text-gray-700 border-l border-gray-300">Sale Area (Sq.ft.)</td>
                {costSheetForm.units.map((unit, index) => (
                  <td key={index} className="px-4 py-3 text-center border-l border-gray-300 font-semibold">
                    {unit.saleArea || '-'}
                  </td>
                ))}
              </tr>

              {/* Basic Rate Row */}
              <tr className="border-b-2 border-gray-400 bg-blue-50 hover:bg-blue-100">
                <td className="px-4 py-3 font-bold text-gray-900">Basic Rate</td>
                <td className="px-4 py-3 text-center font-semibold text-gray-700 border-l border-gray-300">₹ {costSheetForm.units[0]?.basicRate.toLocaleString('en-IN') || '16,000'}</td>
                {costSheetForm.units.map((unit, index) => {
                  const costs = calculateUnitCosts(unit);
                  return (
                    <td key={index} className="px-4 py-3 text-center border-l border-gray-300 font-bold text-blue-700">
                      ₹ {costs.basicAmount.toLocaleString('en-IN')}
                    </td>
                  );
                })}
              </tr>

              {/* Development Charges */}
              <tr className="border-b border-gray-300 bg-white hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900">Development Charges</td>
                <td className="px-4 py-3 text-center font-semibold text-gray-700 border-l border-gray-300">₹ {costSheetForm.charges.developmentCharges}</td>
                {costSheetForm.units.map((unit, index) => {
                  const costs = calculateUnitCosts(unit);
                  return (
                    <td key={index} className="px-4 py-3 text-center border-l border-gray-300">
                      ₹ {costs.developmentCharges.toLocaleString('en-IN')}
                    </td>
                  );
                })}
              </tr>

              {/* DG Backup */}
              <tr className="border-b border-gray-300 bg-gray-50 hover:bg-gray-100">
                <td className="px-4 py-3 font-semibold text-gray-900">DG Backup</td>
                <td className="px-4 py-3 text-center font-semibold text-gray-700 border-l border-gray-300">₹ {costSheetForm.charges.dgBackup}</td>
                {costSheetForm.units.map((unit, index) => {
                  const costs = calculateUnitCosts(unit);
                  return (
                    <td key={index} className="px-4 py-3 text-center border-l border-gray-300">
                      ₹ {costs.dgBackup.toLocaleString('en-IN')}
                    </td>
                  );
                })}
              </tr>

              {/* Recreational Facilities */}
              <tr className="border-b border-gray-300 bg-white hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900">Recreational Facilities</td>
                <td className="px-4 py-3 text-center font-semibold text-gray-700 border-l border-gray-300">₹ {costSheetForm.charges.recreationalFacilities}</td>
                {costSheetForm.units.map((unit, index) => {
                  const costs = calculateUnitCosts(unit);
                  return (
                    <td key={index} className="px-4 py-3 text-center border-l border-gray-300">
                      ₹ {costs.recreationalFacilities.toLocaleString('en-IN')}
                    </td>
                  );
                })}
              </tr>

              {/* Society Formation */}
              <tr className="border-b border-gray-300 bg-gray-50 hover:bg-gray-100">
                <td className="px-4 py-3 font-semibold text-gray-900">Society Formation and Legal Charges</td>
                <td className="px-4 py-3 text-center font-semibold text-gray-700 border-l border-gray-300">₹ {costSheetForm.charges.societyFormation}</td>
                {costSheetForm.units.map((unit, index) => {
                  const costs = calculateUnitCosts(unit);
                  return (
                    <td key={index} className="px-4 py-3 text-center border-l border-gray-300">
                      ₹ {costs.societyFormation.toLocaleString('en-IN')}
                    </td>
                  );
                })}
              </tr>

              {/* Floor Rise */}
              <tr className="border-b border-gray-300 bg-white hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900">Floor Rise</td>
                <td className="px-4 py-3 text-center font-semibold text-gray-700 border-l border-gray-300">₹ {costSheetForm.charges.floorRise}</td>
                {costSheetForm.units.map((unit, index) => {
                  const costs = calculateUnitCosts(unit);
                  return (
                    <td key={index} className="px-4 py-3 text-center border-l border-gray-300">
                      ₹ {costs.floorRise.toLocaleString('en-IN')}
                    </td>
                  );
                })}
              </tr>

              {/* Other Charges */}
              <tr className="border-b-2 border-gray-400 bg-gray-50 hover:bg-gray-100">
                <td className="px-4 py-3 font-semibold text-gray-900">Other Charges</td>
                <td className="px-4 py-3 text-center font-semibold text-gray-700 border-l border-gray-300"></td>
                {costSheetForm.units.map((unit, index) => {
                  const costs = calculateUnitCosts(unit);
                  return (
                    <td key={index} className="px-4 py-3 text-center border-l border-gray-300">
                      ₹ {costs.otherCharges.toLocaleString('en-IN')}
                    </td>
                  );
                })}
              </tr>

              {/* Total Row */}
              <tr className="bg-gradient-to-r from-emerald-600 to-emerald-700 border-t-4 border-emerald-800">
                <td className="px-4 py-4 font-bold text-white text-lg">Total</td>
                <td className="px-4 py-4 text-center font-bold text-white border-l border-emerald-500"></td>
                {costSheetForm.units.map((unit, index) => {
                  const costs = calculateUnitCosts(unit);
                  return (
                    <td key={index} className="px-4 py-4 text-center border-l border-emerald-500 font-bold text-white text-lg">
                      ₹ {costs.total.toLocaleString('en-IN')}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button 
            onClick={() => window.print()}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all"
          >
            Print / Download PDF
          </button>
          <button 
            onClick={() => setShowCostSheetGenerator(false)}
            className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
          >
            Edit Details
          </button>
        </div>
      </div>
    );
  };

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
        gst: 1296750,
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
        carParking: 0,
        clubMembership: 500000,
        developmentCharges: 300000,
        maintenanceDeposit: 200000,
        legalCharges: 150000,
        gst: 2511000,
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
        gst: 1998000,
      },
      total: 13098000,
      status: 'Active',
      createdDate: '2026-01-10',
      project: 'Business Park',
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

  if (showCostSheetGenerator) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setShowCostSheetGenerator(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Construction Link Plan Cost Sheet</h1>
            <p className="text-gray-600 mt-1">Fill in the details to generate your cost sheet</p>
          </div>
        </div>

        {/* Cost Sheet Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name</label>
              <input
                type="text"
                value={costSheetForm.projectName}
                onChange={(e) => setCostSheetForm({...costSheetForm, projectName: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Skyline Heights"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Floor Number</label>
              <input
                type="text"
                value={costSheetForm.floor}
                onChange={(e) => setCostSheetForm({...costSheetForm, floor: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 7"
              />
            </div>
          </div>

          {/* Rate Configuration */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Rate Configuration (₹ per sq.ft.)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Basic Rate</label>
                <input
                  type="number"
                  value={costSheetForm.units[0]?.basicRate || ''}
                  onChange={(e) => {
                    const newUnits = costSheetForm.units.map(unit => ({
                      ...unit,
                      basicRate: parseFloat(e.target.value) || 0
                    }));
                    setCostSheetForm({...costSheetForm, units: newUnits});
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="16000"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Development</label>
                <input
                  type="number"
                  value={costSheetForm.charges.developmentCharges}
                  onChange={(e) => updateCharge('developmentCharges', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">DG Backup</label>
                <input
                  type="number"
                  value={costSheetForm.charges.dgBackup}
                  onChange={(e) => updateCharge('dgBackup', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Recreation</label>
                <input
                  type="number"
                  value={costSheetForm.charges.recreationalFacilities}
                  onChange={(e) => updateCharge('recreationalFacilities', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Society/Legal</label>
                <input
                  type="number"
                  value={costSheetForm.charges.societyFormation}
                  onChange={(e) => updateCharge('societyFormation', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Floor Rise</label>
                <input
                  type="number"
                  value={costSheetForm.charges.floorRise}
                  onChange={(e) => updateCharge('floorRise', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="50"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Other Charges (Fixed Amount)</label>
              <input
                type="number"
                value={costSheetForm.charges.otherCharges}
                onChange={(e) => updateCharge('otherCharges', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1000000"
              />
            </div>
          </div>

          {/* Units Configuration */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Unit Details</h3>
              <button
                onClick={addUnit}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all text-sm"
              >
                + Add Unit
              </button>
            </div>
            <div className="space-y-4">
              {costSheetForm.units.map((unit, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex-none w-20">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Unit Type</label>
                    <input
                      type="text"
                      value={unit.unitType}
                      onChange={(e) => updateUnit(index, 'unitType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-bold"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Carpet Area (sq.ft.)</label>
                    <input
                      type="number"
                      value={unit.carpetArea}
                      onChange={(e) => updateUnit(index, 'carpetArea', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="685"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Sale Area (sq.ft.)</label>
                    <input
                      type="number"
                      value={unit.saleArea}
                      onChange={(e) => updateUnit(index, 'saleArea', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1370"
                    />
                  </div>
                  <div className="flex-none">
                    <label className="block text-xs font-semibold text-gray-700 mb-2 opacity-0">Remove</label>
                    {costSheetForm.units.length > 1 && (
                      <button
                        onClick={() => removeUnit(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowCostSheetGenerator(false)}
              className="px-6 py-2.5 text-gray-700 font-semibold border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Validate that at least one unit has sale area
                const hasValidUnit = costSheetForm.units.some(u => u.saleArea && parseFloat(u.saleArea) > 0);
                if (!hasValidUnit) {
                  alert('Please add at least one unit with sale area');
                  return;
                }
                window.scrollTo(0, 0);
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all"
            >
              Generate Cost Sheet
            </button>
          </div>
        </div>

        {/* Generated Cost Sheet Preview */}
        {costSheetForm.units.some(u => u.saleArea && parseFloat(u.saleArea) > 0) && (
          <div className="mt-8">
            {generateCostSheet()}
          </div>
        )}
      </div>
    );
  }

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
            onClick={() => setShowCostSheetGenerator(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-sm hover:shadow-md font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Construction Link Plan
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

            <div className="p-6 space-y-6">
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

              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">Total Cost</span>
                  <span className="text-3xl font-bold">{formatCurrency(selectedTemplate.total)}</span>
                </div>
              </div>

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
    </div>
  );
};

export default CostSheets;