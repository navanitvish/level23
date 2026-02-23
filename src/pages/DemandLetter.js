// src/pages/DemandLetter.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { demandLetterApi } from '../api/endpoints';

const DemandLetter = () => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    // Customer Details
    customerName: '',
    customerAddress: '',
    officeNo: '',
    floorNo: '',
    projectName: 'LEVEL 23',
    plotNo: 'Plot No. 22, 23, 32 & 33, sector-02, Vashi, Navi Mumbai',
    agreementDate: '',
    letterDate: new Date().toISOString().split('T')[0],
    
    // Property Details
    totalConsideration: '',
    
    // Payment Milestones
    milestones: [
      { id: 1, name: 'On Booking', percentage: 9, amount: 0, checked: false },
      { id: 2, name: 'Within 15 days from the Booking', percentage: 16, amount: 0, checked: false },
      { id: 3, name: 'Due On Commencement of Work', percentage: 10, amount: 0, checked: false },
      { id: 4, name: 'Due On Completion of Raft', percentage: 5, amount: 0, checked: false },
      { id: 5, name: 'Due On Completion of Basement of 1st Slab', percentage: 5, amount: 0, checked: false },
      { id: 6, name: 'Due On Completion of Basement of 2nd Slab', percentage: 5, amount: 0, checked: false },
      { id: 7, name: 'Due On Completion of 1st Slab', percentage: 2, amount: 0, checked: false },
      { id: 8, name: 'Due On Completion of 2nd Slab', percentage: 2, amount: 0, checked: false },
      { id: 9, name: 'Due On Completion of 3rd Slab', percentage: 2, amount: 0, checked: false },
      { id: 10, name: 'Due On Completion of 4th Slab', percentage: 2, amount: 0, checked: false },
      { id: 11, name: 'Due On Completion of 5th Slab', percentage: 2, amount: 0, checked: false },
      { id: 12, name: 'Due On Completion of 6th Slab', percentage: 2, amount: 0, checked: false },
      { id: 13, name: 'Due On Completion of 8th Slab', percentage: 1, amount: 0, checked: false },
      { id: 14, name: 'Due On Completion of 12th Slab', percentage: 1, amount: 0, checked: false },
      { id: 15, name: 'Due On Completion of 14th Slab', percentage: 1, amount: 0, checked: false },
      { id: 16, name: 'Due On Completion of 16th Slab', percentage: 1, amount: 0, checked: false },
      { id: 17, name: 'Due On Completion of 18th Slab', percentage: 1, amount: 0, checked: false },
      { id: 18, name: 'Due On Completion of 20th Slab', percentage: 1, amount: 0, checked: false },
      { id: 19, name: 'Due On Completion of 22nd Slab', percentage: 1, amount: 0, checked: false },
      { id: 20, name: 'Due On Completion of 24th Slab', percentage: 1, amount: 0, checked: false },
      { id: 21, name: 'Due On Commencement of Plaster Work', percentage: 5, amount: 0, checked: false },
      { id: 22, name: 'Due On Commencement of Brickwork', percentage: 10, amount: 0, checked: false },
    ],
    
    // GST Details
    sgstRate: 6,
    cgstRate: 6,
    totalGst: 0,
    sgstAmount: 0,
    cgstAmount: 0,
    
    // Payment Status
    amountReceived: 0,
    gstReceived: 0,
    
    // Bank Details
    bankName: 'AKSHAR BHAGWATI VENTURES LLP RERA DESIGNATED COLLECTION A/C FOR LEVEL 23',
    accountNo: '925020050448560',
    bankBranch: 'AXIS Bank, Branch Corporate Branch Banking (CBB)',
    ifscCode: 'UTIB0001394',
    
    // Subject Line
    subjectLine: '',
  });

  // ─── FETCH DEMAND LETTERS ─────────────────────────────────
  const {
    data: demandLetters = [],
    // isLoading,
    // refetch,
  } = useQuery({
    queryKey: ['demand-letters'],
    queryFn: demandLetterApi.getAll,
    select: (response) => {
      const data = response?.data || response;
      if (Array.isArray(data)) return data;
      if (data.data && Array.isArray(data.data)) return data.data;
      return [];
    },
  });

  // ─── CREATE DEMAND LETTER ─────────────────────────────────
  const createMutation = useMutation({
    mutationFn: demandLetterApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demand-letters'] });
      alert('Demand letter created successfully!');
      resetForm();
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to create demand letter');
    },
  });

  // ─── GENERATE PDF ─────────────────────────────────────────
  const generatePdfMutation = useMutation({
    mutationFn: demandLetterApi.generate,
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `demand-letter-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    },
    onError: (err) => {
      alert('Failed to generate PDF');
    },
  });

  // ─── HANDLERS ─────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Recalculate when total consideration changes
      if (name === 'totalConsideration') {
        const total = parseFloat(value) || 0;
        updated.milestones = prev.milestones.map(m => ({
          ...m,
          amount: (total * m.percentage / 100)
        }));
        
        // Calculate GST
        const gstBase = total * 0.85; // 85% of total for GST calculation
        updated.sgstAmount = gstBase * updated.sgstRate / 100;
        updated.cgstAmount = gstBase * updated.cgstRate / 100;
        updated.totalGst = updated.sgstAmount + updated.cgstAmount;
      }
      
      if (name === 'amountReceived' || name === 'gstReceived') {
        // These will be used for calculating dues
      }
      
      return updated;
    });
  };

  const handleMilestoneToggle = (id) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map(m =>
        m.id === id ? { ...m, checked: !m.checked } : m
      )
    }));
  };

  const handleMilestonePercentage = (id, percentage) => {
    setFormData(prev => {
      const total = parseFloat(prev.totalConsideration) || 0;
      return {
        ...prev,
        milestones: prev.milestones.map(m =>
          m.id === id ? { ...m, percentage: parseFloat(percentage) || 0, amount: total * parseFloat(percentage) / 100 } : m
        )
      };
    });
  };

  const calculateDues = () => {
    // const total = parseFloat(formData.totalConsideration) || 0;
    const checkedMilestones = formData.milestones.filter(m => m.checked);
    const dueAmount = checkedMilestones.reduce((sum, m) => sum + m.amount, 0);
    const amountReceived = parseFloat(formData.amountReceived) || 0;
    const totalDue = dueAmount - amountReceived;
    
    const dueGst = totalDue * 0.12; // 12% GST (6% SGST + 6% CGST)
    const gstReceived = parseFloat(formData.gstReceived) || 0;
    const totalGstDue = dueGst - gstReceived;
    
    return {
      dueAmount,
      totalDue,
      dueGst,
      totalGstDue,
      totalWithGst: totalDue + totalGstDue,
      checkedPercentage: checkedMilestones.reduce((sum, m) => sum + m.percentage, 0)
    };
  };

  const handleSubmit = () => {
    const dues = calculateDues();
    const checkedMilestones = formData.milestones.filter(m => m.checked);
    
    const payload = {
      customerName: formData.customerName,
      customerAddress: formData.customerAddress,
      officeNo: formData.officeNo,
      floorNo: formData.floorNo,
      projectName: formData.projectName,
      plotNo: formData.plotNo,
      agreementDate: formData.agreementDate,
      letterDate: formData.letterDate,
      totalConsideration: parseFloat(formData.totalConsideration),
      milestones: checkedMilestones,
      dueAmount: dues.totalDue,
      gstAmount: dues.totalGstDue,
      totalDue: dues.totalWithGst,
      amountReceived: parseFloat(formData.amountReceived),
      gstReceived: parseFloat(formData.gstReceived),
      bankDetails: {
        bankName: formData.bankName,
        accountNo: formData.accountNo,
        bankBranch: formData.bankBranch,
        ifscCode: formData.ifscCode,
      },
      subjectLine: formData.subjectLine,
    };
    
    createMutation.mutate(payload);
  };

  const resetForm = () => {
    setFormData(prev => ({
      ...prev,
      customerName: '',
      customerAddress: '',
      officeNo: '',
      floorNo: '',
      agreementDate: '',
      totalConsideration: '',
      amountReceived: 0,
      gstReceived: 0,
      subjectLine: '',
      milestones: prev.milestones.map(m => ({ ...m, checked: false, amount: 0 }))
    }));
  };

  const dues = calculateDues();
  const actionLoading = createMutation.isPending || generatePdfMutation.isPending;

  const stats = [
    { label: 'Total Letters', value: demandLetters.length.toString(), icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'blue' },
    { label: 'Sent This Month', value: '45', icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'emerald' },
    { label: 'Pending Payment', value: '23', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'amber' },
    { label: 'Total Amount', value: '₹2.8Cr', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1', color: 'violet' }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
      emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
      violet: { bg: 'bg-violet-50', text: 'text-violet-600' },
      amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
    };
    return colors[color];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Demand Letter Generator</h1>
        <p className="text-gray-600 mt-1">Generate construction milestone-based demand letters with GST calculation</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const colorClass = getColorClasses(stat.color);
          return (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 ${colorClass.bg} rounded-xl`}>
                  <svg className={`w-6 h-6 ${colorClass.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b">Create Demand Letter</h2>
        
        <div className="space-y-6">
          {/* Customer Details */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Name *</label>
                <input type="text" name="customerName" value={formData.customerName} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="MRS. RUCHIRA PURUSHOTTAM THAKRE" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Agreement Date *</label>
                <input type="date" name="agreementDate" value={formData.agreementDate} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Address *</label>
              <textarea name="customerAddress" value={formData.customerAddress} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none" rows="3" placeholder="FLAT NO. 601, TOWER NO. -07, 38, PALM BEACH ROAD..." />
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Property Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Office No. *</label>
                <input type="text" name="officeNo" value={formData.officeNo} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="908" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Floor No. *</label>
                <input type="text" name="floorNo" value={formData.floorNo} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="9th" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Letter Date</label>
                <input type="date" name="letterDate" value={formData.letterDate} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Line</label>
              <input type="text" name="subjectLine" value={formData.subjectLine} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="Demand letter due On Completion of 24th slab..." />
            </div>
          </div>

          {/* Total Consideration */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Total Consideration</h3>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
              <input type="number" name="totalConsideration" value={formData.totalConsideration} onChange={handleInputChange} className="w-full pl-8 pr-4 py-3 text-xl font-bold border-2 border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500" placeholder="1,20,00,000" />
            </div>
          </div>

          {/* Payment Milestones */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Construction Milestones (Select Due Payments)</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {formData.milestones.map((milestone) => (
                <div key={milestone.id} className={`flex items-center justify-between p-3 rounded-lg transition-colors ${milestone.checked ? 'bg-blue-100 border border-blue-300' : 'bg-white border border-gray-200'}`}>
                  <label className="flex items-center gap-3 flex-1 cursor-pointer">
                    <input type="checkbox" checked={milestone.checked} onChange={() => handleMilestoneToggle(milestone.id)} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                    <span className="text-sm font-medium text-gray-900">{milestone.name}</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input type="number" value={milestone.percentage} onChange={(e) => handleMilestonePercentage(milestone.id, e.target.value)} className="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-right" step="0.1" />
                    <span className="text-sm font-medium text-gray-600">%</span>
                    <span className="text-sm font-bold text-gray-900 w-32 text-right">₹{milestone.amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-white border-2 border-blue-500 rounded-xl">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Selected: {dues.checkedPercentage}%</span>
                <span className="text-blue-600">₹{dues.dueAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount Received So Far (₹)</label>
                <input type="number" name="amountReceived" value={formData.amountReceived} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">GST Received So Far (₹)</label>
                <input type="number" name="gstReceived" value={formData.gstReceived} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          {/* Calculation Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-violet-50 border-2 border-blue-300 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-base">
                <span className="text-gray-700">Total Consideration:</span>
                <span className="font-bold">₹{parseFloat(formData.totalConsideration || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-gray-700">Due as on Date (Selected {dues.checkedPercentage}%):</span>
                <span className="font-bold">₹{dues.dueAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-gray-700">(-) Amount Received:</span>
                <span className="font-bold text-red-600">-₹{parseFloat(formData.amountReceived || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="h-px bg-gray-300 my-2"></div>
              <div className="flex justify-between text-lg">
                <span className="font-bold text-gray-900">Total Due as on Date:</span>
                <span className="font-bold text-blue-600">₹{dues.totalDue.toLocaleString('en-IN')}</span>
              </div>
              <div className="h-px bg-gray-300 my-2"></div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">SGST @ 6%:</span>
                <span className="font-semibold">₹{(dues.totalDue * 0.06).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">CGST @ 6%:</span>
                <span className="font-semibold">₹{(dues.totalDue * 0.06).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">(-) GST Received:</span>
                <span className="font-semibold text-red-600">-₹{parseFloat(formData.gstReceived || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="h-px bg-gray-300 my-2"></div>
              <div className="flex justify-between text-lg">
                <span className="font-bold text-gray-900">Total GST Due:</span>
                <span className="font-bold text-violet-600">₹{dues.totalGstDue.toLocaleString('en-IN')}</span>
              </div>
              <div className="h-1 bg-emerald-500 my-3 rounded"></div>
              <div className="flex justify-between text-2xl">
                <span className="font-bold text-gray-900">Grand Total Due:</span>
                <span className="font-bold text-emerald-600">₹{dues.totalWithGst.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <button onClick={handleSubmit} disabled={actionLoading} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50">
              {actionLoading ? 'Generating...' : 'Generate Letter'}
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-green-700">
              Download PDF
            </button>
            <button onClick={resetForm} className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200">
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {actionLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 shadow-2xl flex items-center gap-4">
            <div className="animate-spin rounded-full h-6 w-6 border-4 border-blue-500 border-t-transparent"></div>
            <span className="font-semibold text-gray-900">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemandLetter;