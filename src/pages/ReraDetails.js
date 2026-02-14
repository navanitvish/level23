import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ReraDetails = () => {
  const [activeTab, setActiveTab] = useState('rera-info');
  const [showMultipleUnits, setShowMultipleUnits] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [selectedUnits, setSelectedUnits] = useState([]);

  // RERA Project Details
  const [reraData] = useState({
    projectName: 'Green Valley Apartments',
    developerName: 'Green Builders Ltd',
    reraNumber: 'P51800012345',
    reraWebsite: 'www.maharera.mahaonline.gov.in',
    projectAddress: 'Survey No. 45, Near MG Road, Pune - 411001',
    projectType: 'Residential',
    totalArea: '5 Acres',
    totalUnits: 120,
    launchedUnits: 85,
    soldUnits: 62,
    completionDate: '2025-12-31',
    // Permissions
    environmentalClearance: 'EC/2021/1234',
    environmentalDate: '2021-05-15',
    buildingPermit: 'BP/2021/5678',
    buildingDate: '2021-06-20',
    ocStatus: 'Pending',
    ocDate: '-',
    fireNoc: 'FNC/2021/9012',
    fireDate: '2021-08-10',
    waterNoc: 'WNC/2021/3456',
    waterDate: '2021-07-05',
    sewageNoc: 'SNC/2021/7890',
    sewageDate: '2021-07-05',
    // Location
    latitude: '18.5204° N',
    longitude: '73.8567° E',
    googleMapsLink: 'https://maps.google.com/?q=18.5204,73.8567',
    // Directions
    directions: 'From Pune Station: Take MG Road towards Koregaon Park. Turn right at Koregaon Park Signal. Project is 2km on left.',
    nearbyLandmarks: 'Koregaon Park, Osho Ashram, Pune Airport (8km)',
    // Terms
    terms: [
      'Booking amount is refundable within 15 days of payment subject to deduction of ₹5,000 processing fee.',
      'Stamp duty and registration charges are extra and to be borne by the purchaser.',
      'GST as applicable will be added to the final consideration amount.',
      'Payment schedule as per construction milestones.',
      'Possession will be handed over within 30 days of OC receipt.',
      'Developer reserves right to change specifications without prior notice.',
      'All disputes subject to Pune jurisdiction only.',
      'Rate quoted is subject to change without prior notice.',
    ],
  });

  // Single Unit Cost Sheet
  const [costSheet] = useState({
    unitNumber: 'A-101',
    tower: 'Tower A',
    floor: '1st Floor',
    area: 1250,
    ratePerSqft: 6500,
    basicCost: 8125000,
    parkingCost: 500000,
    clubhouse: 200000,
    developmentCharges: 125000,
    gst: 1338750,
    totalBeforeDiscount: 10288750,
  });

  // Calculate totals with discount
  const calculateTotal = () => {
    const discountAmount = costSheet.totalBeforeDiscount * (discount / 100);
    return costSheet.totalBeforeDiscount - discountAmount;
  };

  // Multiple Units Cost Sheet
  const [multiUnitData, setMultiUnitData] = useState([
    { unit: 'A-101', area: 1250, rate: 6500, selected: false },
    { unit: 'A-102', area: 1100, rate: 6500, selected: false },
    { unit: 'A-201', area: 1450, rate: 6700, selected: false },
    { unit: 'A-202', area: 1325, rate: 6600, selected: false },
    { unit: 'B-101', area: 1500, rate: 6800, selected: false },
    { unit: 'B-102', area: 1275, rate: 6500, selected: false },
  ]);

  const handleUnitSelect = (index) => {
    const updated = [...multiUnitData];
    updated[index].selected = !updated[index].selected;
    setMultiUnitData(updated);
    const selected = updated.filter(u => u.selected);
    setSelectedUnits(selected);
  };

  const calculateMultiUnitTotal = () => {
    return selectedUnits.reduce((sum, unit) => {
      return sum + (unit.area * unit.rate);
    }, 0);
  };

  const calculateMultiUnitTotalWithDiscount = () => {
    const total = calculateMultiUnitTotal();
    return total - (total * (discount / 100));
  };

  const formatCurrency = (amount) => {
    return '₹' + parseFloat(amount).toLocaleString('en-IN');
  };

  const stats = [
    { label: 'Total Projects', value: '156', change: '+8%', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'blue' },
    { label: 'RERA Registered', value: '142', change: '+12%', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'emerald' },
    { label: 'Pending', value: '14', change: '-2%', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'amber' },
    { label: 'Total Revenue', value: '₹2.4Cr', change: '+15%', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1', color: 'violet' }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: { gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-600' },
      emerald: { gradient: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-600' },
      violet: { gradient: 'from-violet-500 to-violet-600', bg: 'bg-violet-50', text: 'text-violet-600' },
      amber: { gradient: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', text: 'text-amber-600' },
    };
    return colors[color];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">RERA Details & Cost Sheets</h1>
        <p className="text-gray-600 mt-1">Complete project details, permissions, terms, and cost sheet management</p>
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
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3">
        {[
          { id: 'rera-info', label: 'RERA Info', icon: '📋' },
          { id: 'permissions', label: 'Permissions', icon: '✅' },
          { id: 'terms', label: 'Terms & Conditions', icon: '📝' },
          { id: 'cost-sheet', label: 'Cost Sheet', icon: '💰' },
          { id: 'brochure', label: 'Brochure', icon: '📄' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:shadow-sm'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* RERA Info Tab */}
      {activeTab === 'rera-info' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">Project Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Project Name', value: reraData.projectName },
                { label: 'Developer Name', value: reraData.developerName },
                { label: 'RERA Number', value: reraData.reraNumber, highlight: true },
                { label: 'RERA Website', value: <Link to="/" className="text-blue-600 hover:underline">{reraData.reraWebsite}</Link> },
                { label: 'Project Address', value: reraData.projectAddress },
                { label: 'Project Type', value: reraData.projectType },
                { label: 'Total Area', value: reraData.totalArea },
                { label: 'Total Units', value: reraData.totalUnits },
                { label: 'Launched Units', value: reraData.launchedUnits },
                { label: 'Sold Units', value: reraData.soldUnits },
                { label: 'Expected Completion', value: reraData.completionDate },
              ].map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-medium text-gray-500 mb-2">{item.label}</p>
                  <p className={`text-sm font-semibold ${item.highlight ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Location Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">Location & Directions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-xs font-medium text-gray-600 mb-2">Latitude</p>
                <p className="text-sm font-semibold text-gray-900">{reraData.latitude}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-xs font-medium text-gray-600 mb-2">Longitude</p>
                <p className="text-sm font-semibold text-gray-900">{reraData.longitude}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-xs font-medium text-gray-600 mb-2">Google Maps</p>
                <a href={reraData.googleMapsLink} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  View on Map
                </a>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-xl mb-4">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                How to Reach
              </h4>
              <p className="text-sm text-gray-700">{reraData.directions}</p>
            </div>

            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-5 rounded-r-xl">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Nearby Landmarks
              </h4>
              <p className="text-sm text-gray-700">{reraData.nearbyLandmarks}</p>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">Government Permissions & Clearances</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 rounded-tl-xl">Permission/Clearance</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Reference Number</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 rounded-tr-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { name: 'Environmental Clearance', ref: reraData.environmentalClearance, date: reraData.environmentalDate, status: 'approved' },
                  { name: 'Building Permit', ref: reraData.buildingPermit, date: reraData.buildingDate, status: 'approved' },
                  { name: 'Fire NOC', ref: reraData.fireNoc, date: reraData.fireDate, status: 'approved' },
                  { name: 'Water Connection NOC', ref: reraData.waterNoc, date: reraData.waterDate, status: 'approved' },
                  { name: 'Sewage Connection NOC', ref: reraData.sewageNoc, date: reraData.sewageDate, status: 'approved' },
                  { name: 'Occupancy Certificate (OC)', ref: '-', date: reraData.ocDate, status: 'pending' },
                ].map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.ref}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'approved' 
                          ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200' 
                          : 'bg-amber-100 text-amber-700 ring-1 ring-amber-200'
                      }`}>
                        {item.status === 'approved' ? '✓' : '⏳'}
                        {item.status === 'approved' ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Terms & Conditions Tab */}
      {activeTab === 'terms' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">Terms & Conditions</h2>
          <div className="space-y-3">
            {reraData.terms.map((term, index) => (
              <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">{term}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cost Sheet Tab */}
      {activeTab === 'cost-sheet' && (
        <div className="space-y-6">
          {/* Toggle Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowMultipleUnits(false)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                !showMultipleUnits
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300'
              }`}
            >
              <span>📄</span>
              Single Unit Cost Sheet
            </button>
            <button
              onClick={() => setShowMultipleUnits(true)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                showMultipleUnits
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300'
              }`}
            >
              <span>🏠</span>
              Multiple Units Cost Sheet
            </button>
          </div>

          {/* Single Unit Cost Sheet */}
          {!showMultipleUnits ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Proposal Cost Sheet</h2>
                <div className="flex gap-4 text-sm">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-semibold">Unit: {costSheet.unitNumber}</span>
                  <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-lg font-semibold">{costSheet.tower}</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg font-semibold">{costSheet.floor}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 rounded-tl-xl">Description</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rate (₹)</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 rounded-tr-xl">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">Basic Property Cost ({costSheet.area} sqft × ₹{costSheet.ratePerSqft})</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{costSheet.ratePerSqft}/sqft</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatCurrency(costSheet.basicCost)}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">Car Parking</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Fixed</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatCurrency(costSheet.parkingCost)}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">Clubhouse Membership</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Fixed</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatCurrency(costSheet.clubhouse)}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">Development Charges</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Fixed</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatCurrency(costSheet.developmentCharges)}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">GST (18%)</td>
                      <td className="px-6 py-4 text-sm text-gray-600">-</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatCurrency(costSheet.gst)}</td>
                    </tr>
                    <tr className="bg-blue-50 border-t-2 border-blue-500">
                      <td className="px-6 py-4 text-base font-bold text-gray-900">Total Amount</td>
                      <td className="px-6 py-4"></td>
                      <td className="px-6 py-4 text-lg font-bold text-blue-600">{formatCurrency(costSheet.totalBeforeDiscount)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-5 bg-gray-50 rounded-xl flex flex-col md:flex-row items-center gap-4">
                <label className="font-semibold text-gray-700">Discount (%):</label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-32 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="100"
                />
                <div className="ml-auto text-right">
                  <p className="text-sm text-gray-600 mb-1">Final Amount</p>
                  <p className="text-2xl font-bold text-emerald-600">{formatCurrency(calculateTotal())}</p>
                </div>
              </div>

              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <p className="font-semibold text-gray-900">Brochure Note</p>
                  <p className="text-sm text-gray-700 mt-1">Prices are subject to change without prior notice. This cost sheet is valid for 30 days from the date of generation.</p>
                </div>
              </div>
            </div>
          ) : (
            /* Multiple Units Cost Sheet */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Multiple Units Cost Sheet</h2>
              <p className="text-gray-600 mb-6">Select multiple units to calculate combined cost</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
                {multiUnitData.map((unit, index) => (
                  <div
                    key={index}
                    onClick={() => handleUnitSelect(index)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                      unit.selected
                        ? 'border-emerald-500 bg-emerald-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-gray-900">{unit.unit}</span>
                      {unit.selected && (
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <p>Area: {unit.area} sqft</p>
                      <p>Rate: ₹{unit.rate}/sqft</p>
                      <p className="font-semibold text-emerald-600 text-sm mt-2">{formatCurrency(unit.area * unit.rate)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-5 bg-gray-50 rounded-xl mb-6">
                <label className="font-semibold text-gray-700 mb-3 block">Discount (%):</label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-32 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="100"
                />
              </div>

              {selectedUnits.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-blue-200">
                      <span className="text-gray-700">Selected Units</span>
                      <span className="font-semibold text-gray-900">{selectedUnits.length}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-blue-200">
                      <span className="text-gray-700">Total Area</span>
                      <span className="font-semibold text-gray-900">{selectedUnits.reduce((sum, u) => sum + u.area, 0)} sqft</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-blue-200">
                      <span className="text-gray-700">Sub Total</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(calculateMultiUnitTotal())}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-blue-200">
                      <span className="text-gray-700">Discount ({discount}%)</span>
                      <span className="font-semibold text-red-600">- {formatCurrency(calculateMultiUnitTotal() * (discount / 100))}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t-2 border-emerald-500">
                      <span className="text-lg font-bold text-gray-900">Grand Total</span>
                      <span className="text-2xl font-bold text-emerald-600">{formatCurrency(calculateMultiUnitTotalWithDiscount())}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <p className="font-semibold text-gray-900">Brochure Note</p>
                  <p className="text-sm text-gray-700 mt-1">Combined booking of multiple units eligible for additional benefits. Contact sales team for more details.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Brochure Tab */}
      {activeTab === 'brochure' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">Project Brochure Information</h2>

          <div className="space-y-6">
            {/* Location & Directions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">📍</span>
                Location & Directions
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p><strong>Address:</strong> {reraData.projectAddress}</p>
                <p><strong>Coordinates:</strong> {reraData.latitude}, {reraData.longitude}</p>
                <p>
                  <strong>Google Maps:</strong>{' '}
                  <a href={reraData.googleMapsLink} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
                    View Location →
                  </a>
                </p>
                <div className="bg-white p-4 rounded-lg mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">How to Reach:</h4>
                  <p>{reraData.directions}</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Nearby Landmarks:</h4>
                  <p>{reraData.nearbyLandmarks}</p>
                </div>
              </div>
            </div>

            {/* Project Highlights */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">🏗️</span>
                Project Highlights
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  `Premium ${reraData.projectType} Project`,
                  `Total Area: ${reraData.totalArea}`,
                  `Total Units: ${reraData.totalUnits}`,
                  `Expected Completion: ${reraData.completionDate}`,
                  'All Government Permissions Cleared',
                  'World-class Amenities',
                  'Green Building Certified',
                  '24/7 Security & CCTV',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Terms */}
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Key Terms
              </h3>
              <ul className="space-y-2">
                {reraData.terms.slice(0, 5).map((term, index) => (
                  <li key={index} className="flex gap-3 text-sm text-gray-700">
                    <span className="text-violet-600 font-bold">{index + 1}.</span>
                    <span>{term}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all shadow-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Share via Email
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-md">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Share on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReraDetails;