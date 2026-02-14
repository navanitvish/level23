import React, { useState } from 'react';

const Calculator = () => {
  const [activeTab, setActiveTab] = useState('emi');

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [emiResult, setEmiResult] = useState(null);

  // Stamp Duty Calculator State
  const [propertyValue, setPropertyValue] = useState(5000000);
  const [stateCode, setStateCode] = useState('maharashtra');
  const [propertyType, setPropertyType] = useState('residential');
  const [stampDutyResult, setStampDutyResult] = useState(null);

  // Area Converter State
  const [areaValue, setAreaValue] = useState(1000);
  const [fromUnit, setFromUnit] = useState('sqft');
  const [toUnit, setToUnit] = useState('sqm');
  const [areaResult, setAreaResult] = useState(null);

  // Calculate EMI
  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 12 / 100;
    const tenure = parseFloat(loanTenure) * 12;

    const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
    const totalAmount = emi * tenure;
    const totalInterest = totalAmount - principal;

    setEmiResult({
      emi: emi.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      principal: principal.toFixed(2),
    });
  };

  // Calculate Stamp Duty
  const calculateStampDuty = () => {
    const value = parseFloat(propertyValue);
    let stampDutyRate = 0;
    
    if (stateCode === 'maharashtra') {
      stampDutyRate = propertyType === 'residential' ? 0.05 : 0.06;
    } else if (stateCode === 'delhi') {
      stampDutyRate = propertyType === 'residential' ? 0.04 : 0.05;
    } else if (stateCode === 'karnataka') {
      stampDutyRate = propertyType === 'residential' ? 0.05 : 0.06;
    } else if (stateCode === 'gujarat') {
      stampDutyRate = propertyType === 'residential' ? 0.045 : 0.055;
    } else if (stateCode === 'rajasthan') {
      stampDutyRate = propertyType === 'residential' ? 0.05 : 0.06;
    }

    const stampDuty = value * stampDutyRate;
    const registrationFee = value * 0.01;
    const gst = value * 0.05;

    setStampDutyResult({
      stampDuty: stampDuty.toFixed(2),
      registrationFee: registrationFee.toFixed(2),
      gst: gst.toFixed(2),
      total: (stampDuty + registrationFee + gst).toFixed(2),
      stampDutyRate: (stampDutyRate * 100).toFixed(1),
    });
  };

  // Convert Area
  const convertArea = () => {
    const value = parseFloat(areaValue);
    let result = 0;

    const conversions = {
      sqft: 1,
      sqm: 10.764,
      sqyard: 9,
      acre: 43560,
      hectare: 107639,
    };

    result = (value / conversions[fromUnit]) * conversions[toUnit];
    setAreaResult(result.toFixed(4));
  };

  const formatCurrency = (amount) => {
    return '₹' + parseFloat(amount).toLocaleString('en-IN');
  };

  const calculatePercentages = () => {
    if (!emiResult) return { principal: 50, interest: 50 };
    const principal = parseFloat(emiResult.principal);
    const interest = parseFloat(emiResult.totalInterest);
    const total = principal + interest;
    return {
      principal: ((principal / total) * 100).toFixed(1),
      interest: ((interest / total) * 100).toFixed(1),
    };
  };

  const percentages = calculatePercentages();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Real Estate Calculator</h1>
        <p className="text-gray-600 mt-1">Calculate EMI, stamp duty, and convert area units easily</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3">
        {[
          { id: 'emi', label: 'EMI Calculator', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' },
          { id: 'stamp', label: 'Stamp Duty', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
          { id: 'area', label: 'Area Converter', icon: 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4' },
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
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* EMI Calculator */}
      {activeTab === 'emi' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Home Loan EMI Calculator</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Loan Amount</label>
                  <span className="text-lg font-bold text-blue-600">{formatCurrency(loanAmount)}</span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="50000000"
                  step="100000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹1L</span>
                  <span>₹5Cr</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Interest Rate (% per annum)</label>
                  <span className="text-lg font-bold text-emerald-600">{interestRate}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="15"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5%</span>
                  <span>15%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Loan Tenure (Years)</label>
                  <span className="text-lg font-bold text-violet-600">{loanTenure} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 Year</span>
                  <span>30 Years</span>
                </div>
              </div>

              <button
                onClick={calculateEMI}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg"
              >
                Calculate EMI
              </button>
            </div>

            {/* Result Section */}
            {emiResult && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl p-6 text-white">
                  <p className="text-sm opacity-90 mb-1">Monthly EMI</p>
                  <p className="text-4xl font-bold">{formatCurrency(emiResult.emi)}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-700">Principal Amount</span>
                    <span className="font-bold text-gray-900">{formatCurrency(emiResult.principal)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-amber-50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-700">Total Interest</span>
                    <span className="font-bold text-gray-900">{formatCurrency(emiResult.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-violet-50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-700">Total Amount</span>
                    <span className="font-bold text-gray-900">{formatCurrency(emiResult.totalAmount)}</span>
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Payment Breakdown</h4>
                  <div className="flex h-8 rounded-lg overflow-hidden mb-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold"
                      style={{ width: `${percentages.principal}%` }}
                    >
                      {percentages.principal}%
                    </div>
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-semibold"
                      style={{ width: `${percentages.interest}%` }}
                    >
                      {percentages.interest}%
                    </div>
                  </div>
                  <div className="flex justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
                      <span className="text-gray-600">Principal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded"></div>
                      <span className="text-gray-600">Interest</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stamp Duty Calculator */}
      {activeTab === 'stamp' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Stamp Duty & Registration Calculator</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Property Value</label>
                  <span className="text-lg font-bold text-violet-600">{formatCurrency(propertyValue)}</span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="50000000"
                  step="100000"
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹1L</span>
                  <span>₹5Cr</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                <select
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all appearance-none bg-white"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="maharashtra">Maharashtra</option>
                  <option value="delhi">Delhi</option>
                  <option value="karnataka">Karnataka</option>
                  <option value="gujarat">Gujarat</option>
                  <option value="rajasthan">Rajasthan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all appearance-none bg-white"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <button
                onClick={calculateStampDuty}
                className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                Calculate Stamp Duty
              </button>
            </div>

            {/* Result Section */}
            {stampDutyResult && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Stamp Duty</span>
                      <p className="text-xs text-gray-500 mt-0.5">{stampDutyResult.stampDutyRate}% of property value</p>
                    </div>
                    <span className="font-bold text-gray-900">{formatCurrency(stampDutyResult.stampDuty)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Registration Fee</span>
                      <p className="text-xs text-gray-500 mt-0.5">1% of property value</p>
                    </div>
                    <span className="font-bold text-gray-900">{formatCurrency(stampDutyResult.registrationFee)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <div>
                      <span className="text-sm font-semibold text-gray-700">GST</span>
                      <p className="text-xs text-gray-500 mt-0.5">5% of property value</p>
                    </div>
                    <span className="font-bold text-gray-900">{formatCurrency(stampDutyResult.gst)}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl p-6 text-white">
                  <p className="text-sm opacity-90 mb-1">Total Charges</p>
                  <p className="text-4xl font-bold">{formatCurrency(stampDutyResult.total)}</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Note</p>
                      <p className="text-xs text-gray-700 mt-1">Stamp duty rates may vary. Check with local authorities for exact rates.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Area Converter */}
      {activeTab === 'area' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Area Unit Converter</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* From */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">From</label>
                <input
                  type="number"
                  value={areaValue}
                  onChange={(e) => setAreaValue(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-lg font-semibold"
                  placeholder="Enter value"
                />
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all appearance-none bg-white"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="sqft">Square Feet (sqft)</option>
                  <option value="sqm">Square Meters (sqm)</option>
                  <option value="sqyard">Square Yards (sqyd)</option>
                  <option value="acre">Acres</option>
                  <option value="hectare">Hectares</option>
                </select>
              </div>

              {/* To */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">To</label>
                <input
                  type="text"
                  value={areaResult || '0'}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-lg font-semibold text-gray-900"
                />
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all appearance-none bg-white"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="sqft">Square Feet (sqft)</option>
                  <option value="sqm">Square Meters (sqm)</option>
                  <option value="sqyard">Square Yards (sqyd)</option>
                  <option value="acre">Acres</option>
                  <option value="hectare">Hectares</option>
                </select>
              </div>
            </div>

            <button
              onClick={convertArea}
              className="w-full mt-6 py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
            >
              Convert
            </button>
          </div>

          {/* Conversion Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Reference Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 rounded-tl-lg">Unit</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">1 sqft =</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">1 sqm =</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 rounded-tr-lg">1 sqyd =</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900">sqft</td>
                    <td className="px-4 py-3 text-gray-600">1</td>
                    <td className="px-4 py-3 text-gray-600">10.764</td>
                    <td className="px-4 py-3 text-gray-600">9</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900">sqm</td>
                    <td className="px-4 py-3 text-gray-600">0.0929</td>
                    <td className="px-4 py-3 text-gray-600">1</td>
                    <td className="px-4 py-3 text-gray-600">0.836</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900">sqyd</td>
                    <td className="px-4 py-3 text-gray-600">0.111</td>
                    <td className="px-4 py-3 text-gray-600">1.196</td>
                    <td className="px-4 py-3 text-gray-600">1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900">EMI Tips</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Keep EMI under 40% of monthly income</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Compare rates from multiple banks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Shorter tenure = less interest</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Prepayment reduces total burden</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-violet-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900">Stamp Duty Tips</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-violet-600 mt-1">•</span>
                <span>Rates vary by state</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-600 mt-1">•</span>
                <span>Pay on time to avoid penalties</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-600 mt-1">•</span>
                <span>Register within 4 months</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-600 mt-1">•</span>
                <span>Digital registration available</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900">Area Conversions</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>1 acre = 43,560 sqft</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>1 hectare = 107,639 sqft</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>1 sqyd = 9 sqft</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>1 sqm = 10.764 sqft</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;