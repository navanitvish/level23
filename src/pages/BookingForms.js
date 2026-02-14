import React, { useState } from 'react';

const BookingForms = () => {
  const [activeTab, setActiveTab] = useState('new-booking');
  const [bookingStep, setBookingStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Details
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    aadharNumber: '',
    panNumber: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    // Property Details
    propertyType: 'apartment',
    projectName: '',
    tower: '',
    unitNumber: '',
    floor: '',
    area: '',
    pricePerSqft: '',
    totalPrice: '',
    // Resale History
    originalBuyerName: '',
    originalBookingDate: '',
    originalPrice: '',
    currentOwnerName: '',
    transferDate: '',
    reasonForSale: '',
    // KYC Documents
    aadharFile: null,
    panFile: null,
    photoFile: null,
    // Payment
    bookingAmount: '',
    paymentMode: 'cheque',
    bankName: '',
    chequeNumber: '',
    // Notes
    specialRequests: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setBookingStep(1);
      setIsSubmitted(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        aadharNumber: '',
        panNumber: '',
        alternatePhone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        propertyType: 'apartment',
        projectName: '',
        tower: '',
        unitNumber: '',
        floor: '',
        area: '',
        pricePerSqft: '',
        totalPrice: '',
        originalBuyerName: '',
        originalBookingDate: '',
        originalPrice: '',
        currentOwnerName: '',
        transferDate: '',
        reasonForSale: '',
        aadharFile: null,
        panFile: null,
        photoFile: null,
        bookingAmount: '',
        paymentMode: 'cheque',
        bankName: '',
        chequeNumber: '',
        specialRequests: '',
      });
    }, 3000);
  };

  const calculateTotalPrice = () => {
    const area = parseFloat(formData.area) || 0;
    const pricePerSqft = parseFloat(formData.pricePerSqft) || 0;
    const total = area * pricePerSqft;
    setFormData(prev => ({
      ...prev,
      totalPrice: total.toFixed(2)
    }));
  };

  const bookingTypes = [
    { id: 'new-booking', label: 'New Booking' },
    { id: 'resale', label: 'Resale Booking' },
  ];

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'villa', label: 'Villa' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'plot', label: 'Plot' },
    { value: 'commercial', label: 'Commercial' },
  ];

  const paymentModes = [
    { value: 'cheque', label: 'Cheque' },
    { value: 'rtgs', label: 'RTGS/NEFT' },
    { value: 'cash', label: 'Cash' },
    { value: 'upi', label: 'UPI' },
    { value: 'card', label: 'Debit/Credit Card' },
  ];

  const stats = [
    { label: 'Total Bookings', value: '1,247', change: '+12%', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'blue' },
    { label: 'New Bookings', value: '892', change: '+8%', icon: 'M12 4v16m8-8H4', color: 'emerald' },
    { label: 'Resale', value: '355', change: '+15%', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', color: 'violet' },
    { label: 'Revenue', value: '₹128Cr', change: '+18%', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1', color: 'amber' }
  ];

  const recentBookings = [
    { id: '#BK001', type: 'New', customer: 'Rahul Sharma', project: 'Skyline Towers', amount: '₹45,00,000', status: 'Confirmed', date: '2026-01-30' },
    { id: '#BK002', type: 'Resale', customer: 'Priya Mehta', project: 'Green Valley', amount: '₹32,00,000', status: 'Pending', date: '2026-01-29' },
    { id: '#BK003', type: 'New', customer: 'Amit Kumar', project: 'Royal Gardens', amount: '₹58,00,000', status: 'Confirmed', date: '2026-01-28' },
    { id: '#BK004', type: 'Resale', customer: 'Sneha Jain', project: 'Lake View', amount: '₹41,00,000', status: 'Processing', date: '2026-01-27' },
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
      }
    };
    return colors[color];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
        <p className="text-gray-600 mt-1">Manage new and resale property bookings with complete KYC details</p>
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
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Booking Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Form Tabs */}
            <div className="flex border-b border-gray-200">
              {bookingTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveTab(type.id)}
                  className={`flex-1 px-6 py-4 font-semibold transition-all ${
                    activeTab === type.id
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Progress Steps */}
            <div className="px-6 py-6 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                {[
                  { num: 1, label: 'Personal' },
                  { num: 2, label: 'KYC' },
                  { num: 3, label: 'Property' },
                  { num: 4, label: 'Payment' }
                ].map((step, index) => (
                  <React.Fragment key={step.num}>
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                        bookingStep >= step.num
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {bookingStep > step.num ? '✓' : step.num}
                      </div>
                      <span className={`mt-2 text-xs font-medium ${
                        bookingStep >= step.num ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                    {index < 3 && (
                      <div className={`flex-1 h-1 mx-2 rounded ${
                        bookingStep > step.num ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {isSubmitted ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-6 shadow-lg">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Submitted Successfully!</h3>
                <p className="text-gray-600 mb-6">Your booking has been registered. Our team will contact you shortly.</p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-sm"
                >
                  Submit Another Booking
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6">
                {/* Step 1: Personal Details */}
                {bookingStep === 1 && (
                  <div className="space-y-5">
                    <h3 className="text-xl font-bold text-gray-900 pb-3 border-b border-gray-200">Personal Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email ID *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Aadhar Number *</label>
                        <input
                          type="text"
                          name="aadharNumber"
                          value={formData.aadharNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="XXXX XXXX XXXX"
                          maxLength="12"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">PAN Number *</label>
                        <input
                          type="text"
                          name="panNumber"
                          value={formData.panNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="ABCDE1234F"
                          maxLength="10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        rows="2"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          maxLength="6"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: KYC Documents */}
                {bookingStep === 2 && (
                  <div className="space-y-5">
                    <h3 className="text-xl font-bold text-gray-900 pb-3 border-b border-gray-200">KYC Documents</h3>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold text-amber-800">Important Guidelines</p>
                          <p className="text-sm text-amber-700 mt-1">Please upload clear copies of your documents for verification.</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Aadhar Card *</label>
                        <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                          <input
                            type="file"
                            name="aadharFile"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-sm text-gray-600">
                            {formData.aadharFile ? formData.aadharFile.name : 'Click to upload'}
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">PAN Card *</label>
                        <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                          <input
                            type="file"
                            name="panFile"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-sm text-gray-600">
                            {formData.panFile ? formData.panFile.name : 'Click to upload'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Passport Photo *</label>
                      <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer max-w-md">
                        <input
                          type="file"
                          name="photoFile"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-gray-600">
                          {formData.photoFile ? formData.photoFile.name : 'Click to upload'}
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Document Guidelines
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700 ml-7">
                        <li>• Documents should be clearly readable</li>
                        <li>• All four corners must be visible</li>
                        <li>• File size should be less than 5MB</li>
                        <li>• Accepted formats: JPG, PNG, PDF</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Step 3: Property Details */}
                {bookingStep === 3 && (
                  <div className="space-y-5">
                    <h3 className="text-xl font-bold text-gray-900 pb-3 border-b border-gray-200">Property Details</h3>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type *</label>
                      <select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: 'right 0.5rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.5em 1.5em',
                          paddingRight: '2.5rem'
                        }}
                      >
                        {propertyTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name *</label>
                      <input
                        type="text"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tower/Block</label>
                        <input
                          type="text"
                          name="tower"
                          value={formData.tower}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Unit Number</label>
                        <input
                          type="text"
                          name="unitNumber"
                          value={formData.unitNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Floor</label>
                        <input
                          type="number"
                          name="floor"
                          value={formData.floor}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Area (sq ft)</label>
                        <input
                          type="number"
                          name="area"
                          value={formData.area}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Price per sq ft (₹)</label>
                        <input
                          type="number"
                          name="pricePerSqft"
                          value={formData.pricePerSqft}
                          onChange={handleInputChange}
                          onBlur={calculateTotalPrice}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white p-5 rounded-xl flex justify-between items-center shadow-md">
                      <span className="font-semibold text-lg">Total Property Price:</span>
                      <span className="font-bold text-2xl">₹ {parseFloat(formData.totalPrice || 0).toLocaleString()}</span>
                    </div>

                    {/* Resale History Section */}
                    {activeTab === 'resale' && (
                      <div className="bg-violet-50 border border-violet-200 rounded-xl p-5 space-y-4">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                          <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Resale History
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Original Buyer Name</label>
                            <input
                              type="text"
                              name="originalBuyerName"
                              value={formData.originalBuyerName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Original Booking Date</label>
                            <input
                              type="date"
                              name="originalBookingDate"
                              value={formData.originalBookingDate}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Original Price (₹)</label>
                            <input
                              type="number"
                              name="originalPrice"
                              value={formData.originalPrice}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Current Owner Name</label>
                            <input
                              type="text"
                              name="currentOwnerName"
                              value={formData.currentOwnerName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Sale</label>
                          <textarea
                            name="reasonForSale"
                            value={formData.reasonForSale}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            rows="2"
                          />
                        </div>
                      </div>
                    )}

                    {/* Pre-launch Note */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">📌</span>
                        <div>
                          <p className="font-semibold text-gray-900">Important Note</p>
                          <p className="text-sm text-gray-700 mt-1">During Pre launch, taxes as applicable can be added later when going for registration.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Payment */}
                {bookingStep === 4 && (
                  <div className="space-y-5">
                    <h3 className="text-xl font-bold text-gray-900 pb-3 border-b border-gray-200">Payment Details</h3>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Booking Amount (₹) *</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                        <input
                          type="number"
                          name="bookingAmount"
                          value={formData.bookingAmount}
                          onChange={handleInputChange}
                          className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Mode *</label>
                      <select
                        name="paymentMode"
                        value={formData.paymentMode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: 'right 0.5rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.5em 1.5em',
                          paddingRight: '2.5rem'
                        }}
                      >
                        {paymentModes.map(mode => (
                          <option key={mode.value} value={mode.value}>{mode.label}</option>
                        ))}
                      </select>
                    </div>

                    {(formData.paymentMode === 'cheque' || formData.paymentMode === 'rtgs' || formData.paymentMode === 'card') && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
                          <input
                            type="text"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {formData.paymentMode === 'cheque' ? 'Cheque Number' : 'Transaction Reference'}
                          </label>
                          <input
                            type="text"
                            name="chequeNumber"
                            value={formData.chequeNumber}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                      <h4 className="font-bold text-gray-900 mb-4">Payment Summary</h4>
                      <div className="flex justify-between items-center text-lg font-bold text-gray-900 pb-3 border-b-2 border-blue-500">
                        <span>Booking Amount:</span>
                        <span>₹ {parseFloat(formData.bookingAmount || 0).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-3">
                        * Registration charges and taxes will be added at the time of final registration as applicable.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Special Requests / Notes</label>
                      <textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        rows="3"
                        placeholder="Any special requirements or notes..."
                      />
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  {bookingStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setBookingStep(prev => prev - 1)}
                      className="px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Back
                    </button>
                  )}
                  
                  {bookingStep < 4 ? (
                    <button
                      type="button"
                      onClick={() => setBookingStep(prev => prev + 1)}
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-sm ml-auto"
                    >
                      Continue
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all shadow-sm ml-auto"
                    >
                      Submit Booking
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Column - Recent Bookings & Info */}
        <div className="space-y-6">
          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">Recent Bookings</h3>
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-600 text-sm">{booking.id}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        booking.type === 'New' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-violet-100 text-violet-700'
                      }`}>
                        {booking.type}
                      </span>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      booking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                      booking.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{booking.customer}</p>
                  <p className="text-xs text-gray-600 mt-1">{booking.project}</p>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                    <span className="font-bold text-emerald-600">{booking.amount}</span>
                    <span className="text-xs text-gray-500">{booking.date}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl font-semibold text-gray-700 transition-colors">
              View All Bookings
            </button>
          </div>

          {/* Booking Guidelines */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Booking Guidelines
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Minimum booking amount: ₹1,00,000</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>KYC documents are mandatory</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Payment via cheque requires 2-3 days clearance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Resale bookings require original owner documents</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Registration within 30 days of booking</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForms;