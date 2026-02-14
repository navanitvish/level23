import React, { useState } from 'react';

const DemandLetter = () => {
  const [formData, setFormData] = useState({
    letterType: 'payment',
    recipientName: '',
    recipientEmail: '',
    recipientAddress: '',
    baseAmount: '',
    gstRate: '18',
    gstAmount: '0',
    totalAmount: '0',
    paymentSchedule: 'one-time',
    installments: '3',
    installmentAmount: '0',
    dueDate: '',
    subject: '',
    message: '',
    includeGst: true,
    sendEmailReminder: false,
    reminderFrequency: 'weekly',
    reminderBeforeDays: '7',
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => {
      const updated = { ...prev, [name]: newValue };
      
      if (name === 'baseAmount' || name === 'gstRate' || name === 'includeGst') {
        const base = parseFloat(updated.baseAmount) || 0;
        const rate = parseFloat(updated.gstRate) || 0;
        if (updated.includeGst) {
          updated.gstAmount = (base * rate / 100).toFixed(2);
          updated.totalAmount = (base + base * rate / 100).toFixed(2);
        } else {
          updated.gstAmount = '0';
          updated.totalAmount = base.toFixed(2);
        }
      }
      
      if (name === 'totalAmount' || name === 'installments') {
        const total = parseFloat(updated.totalAmount) || 0;
        const inst = parseInt(updated.installments) || 1;
        updated.installmentAmount = (total / inst).toFixed(2);
      }
      
      return updated;
    });
  };

  const calculateTotals = () => {
    const base = parseFloat(formData.baseAmount) || 0;
    const rate = parseFloat(formData.gstRate) || 0;
    const gst = formData.includeGst ? (base * rate / 100) : 0;
    const total = base + gst;
    const installment = total / parseInt(formData.installments);
    
    setFormData(prev => ({
      ...prev,
      gstAmount: gst.toFixed(2),
      totalAmount: total.toFixed(2),
      installmentAmount: installment.toFixed(2),
    }));
  };

  const formatCurrency = (amount) => {
    return '₹' + parseFloat(amount || 0).toLocaleString('en-IN');
  };

  const stats = [
    { label: 'Total Letters', value: '156', change: '+12', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'blue' },
    { label: 'Sent This Month', value: '45', change: '+8', icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'emerald' },
    { label: 'Pending Payment', value: '23', change: '-5', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'amber' },
    { label: 'Total Amount', value: '₹2.8Cr', change: '+15%', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1', color: 'violet' }
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
        <h1 className="text-3xl font-bold text-gray-900">Demand Letter</h1>
        <p className="text-gray-600 mt-1">Generate and manage demand letters with flexible payment schedules and GST calculation</p>
      </div>

      {/* Stats */}
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

      {/* Form Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">Create New Demand Letter</h2>
        
        <div className="space-y-6">
          {/* Letter Type & Recipient */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Letter Type</label>
              <select
                name="letterType"
                value={formData.letterType}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="payment">Payment Demand</option>
                <option value="reminder">Payment Reminder</option>
                <option value="legal">Legal Notice</option>
                <option value="final">Final Demand</option>
                <option value="installment">Installment Demand</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Recipient Name</label>
              <input
                type="text"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter recipient name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Recipient Email</label>
            <input
              type="email"
              name="recipientEmail"
              value={formData.recipientEmail}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email for reminders"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Recipient Address</label>
            <textarea
              name="recipientAddress"
              value={formData.recipientAddress}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter full address"
              rows="2"
            />
          </div>

          {/* Payment Schedule Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Payment Schedule
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Payment Type</label>
                <div className="flex flex-wrap gap-4">
                  {[
                    { value: 'one-time', label: 'One-time Payment' },
                    { value: 'installments', label: 'Installments' },
                    { value: 'custom', label: 'Custom Schedule' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentSchedule"
                        value={option.value}
                        checked={formData.paymentSchedule === option.value}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.paymentSchedule === 'installments' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Installments</label>
                  <select
                    name="installments"
                    value={formData.installments}
                    onChange={handleInputChange}
                    className="w-full md:w-64 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    <option value="2">2 Installments</option>
                    <option value="3">3 Installments</option>
                    <option value="4">4 Installments</option>
                    <option value="5">5 Installments</option>
                    <option value="6">6 Installments</option>
                    <option value="12">12 Installments</option>
                  </select>
                  <p className="text-sm text-gray-600 mt-2">
                    Each installment: <strong className="text-blue-600">{formatCurrency(formData.installmentAmount)}</strong>
                  </p>
                </div>
              )}

              {formData.paymentSchedule === 'custom' && (
                <div className="space-y-3">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700 w-28">Installment {num}:</span>
                      <input
                        type="date"
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Amount Details */}
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Amount Details
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Base Amount (₹)</label>
                  <input
                    type="number"
                    name="baseAmount"
                    value={formData.baseAmount}
                    onChange={handleInputChange}
                    onBlur={calculateTotals}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter base amount"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="includeGst"
                      checked={formData.includeGst}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-semibold text-gray-700">Include GST</span>
                  </label>
                </div>
              </div>

              {formData.includeGst && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">GST Rate (%)</label>
                    <select
                      name="gstRate"
                      value={formData.gstRate}
                      onChange={handleInputChange}
                      onBlur={calculateTotals}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                      }}
                    >
                      <option value="5">5% (GST)</option>
                      <option value="12">12% (GST)</option>
                      <option value="18">18% (GST)</option>
                      <option value="28">28% (GST)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">GST Amount (₹)</label>
                    <input
                      type="text"
                      name="gstAmount"
                      value={formData.gstAmount}
                      readOnly
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-semibold"
                    />
                  </div>
                </div>
              )}

              {/* Total Summary */}
              <div className="bg-white border border-violet-300 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Base Amount:</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(formData.baseAmount)}</span>
                </div>
                {formData.includeGst && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">GST ({formData.gstRate}%):</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(formData.gstAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-3 border-t border-violet-200">
                  <span className="font-bold text-gray-900">Total Amount:</span>
                  <span className="font-bold text-2xl text-emerald-600">{formatCurrency(formData.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Due Date & Subject */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Letter subject"
              />
            </div>
          </div>

          {/* Email Reminders */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                name="sendEmailReminder"
                checked={formData.sendEmailReminder}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="text-lg font-bold text-gray-900 cursor-pointer">
                Send Email Reminders for Due Payment
              </label>
            </div>

            {formData.sendEmailReminder && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Reminder Frequency</label>
                    <select
                      name="reminderFrequency"
                      value={formData.reminderFrequency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                      }}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="bi-weekly">Bi-Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Remind Before Due Date (Days)</label>
                    <select
                      name="reminderBeforeDays"
                      value={formData.reminderBeforeDays}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                      }}
                    >
                      <option value="1">1 Day</option>
                      <option value="3">3 Days</option>
                      <option value="5">5 Days</option>
                      <option value="7">7 Days</option>
                      <option value="14">14 Days</option>
                      <option value="30">30 Days</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white border border-amber-300 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Reminder Schedule Preview</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📧</span>
                      <span>First reminder: {formData.reminderBeforeDays} days before due date</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🔔</span>
                      <span>Frequency: Every {formData.reminderFrequency === 'bi-weekly' ? '2 weeks' : formData.reminderFrequency}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">⚠️</span>
                      <span>Final notice: On due date if unpaid</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Message / Additional Details</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter detailed message or custom terms..."
              rows="4"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-sm">
              Generate Letter
            </button>
            <button className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors">
              Preview
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all shadow-sm">
              Download PDF
            </button>
            {formData.sendEmailReminder && (
              <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all shadow-sm flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send with Reminders
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recent Letters Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Recent Demand Letters</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Recipient</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Schedule</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { date: '2026-01-30', recipient: 'ABC Properties Ltd.', type: 'Payment Demand', amount: '5,00,000', gst: '90,000', schedule: 'One-time', status: 'Sent' },
                { date: '2026-01-28', recipient: 'XYZ Developers', type: 'Installment', amount: '2,50,000', inst: '× 3 inst.', schedule: '3 Installments', status: 'Pending' },
                { date: '2026-01-25', recipient: 'PQR Infrastructure', type: 'Final Demand', amount: '10,00,000', schedule: 'One-time', status: 'Sent' },
              ].map((letter, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600">{letter.date}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{letter.recipient}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{letter.type}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">₹{letter.amount}</span>
                      {letter.gst && <span className="text-xs text-gray-500">+ ₹{letter.gst} GST</span>}
                      {letter.inst && <span className="text-xs text-gray-500">{letter.inst}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{letter.schedule}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      letter.status === 'Sent' 
                        ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200' 
                        : 'bg-amber-100 text-amber-700 ring-1 ring-amber-200'
                    }`}>
                      {letter.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        View
                      </button>
                      <button className="px-3 py-1.5 text-xs font-semibold text-violet-600 hover:bg-violet-50 rounded-lg transition-colors">
                        {letter.status === 'Pending' ? 'Send Reminder' : 'Resend'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Templates */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Letter Templates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Payment Demand', desc: 'Standard payment demand letter for overdue amounts with GST.', color: 'blue' },
            { title: 'Installment Agreement', desc: 'For payments with flexible installment schedules.', color: 'emerald' },
            { title: 'Payment Reminder', desc: 'Friendly reminder with automated follow-up options.', color: 'violet' },
            { title: 'Final Demand', desc: 'Final demand letter before taking legal action.', color: 'amber' },
          ].map((template, index) => {
            const colorClass = getColorClasses(template.color);
            return (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all">
                <h3 className="font-bold text-gray-900 mb-2">{template.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{template.desc}</p>
                <button className={`w-full px-4 py-2 bg-gradient-to-r ${colorClass.gradient} text-white font-semibold rounded-lg hover:opacity-90 transition-opacity`}>
                  Use Template
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DemandLetter;