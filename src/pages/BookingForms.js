// src/pages/BookingForms.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../api/endpoints';

const BookingForms = () => {
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('new');
  const [bookingStep, setBookingStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [bookingNo, setBookingNo] = useState(null);

  const [formData, setFormData] = useState({
    type: 'new',
    bookingDate: new Date().toISOString().split('T')[0],
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    aadharNumber: '',
    panNumber: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    aadharFile: null,
    panFile: null,
    photoFile: null,
    propertyId: '',
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
    bookingAmount: '',
    paymentMethod: 'cheque',
    bankName: '',
    chequeNumber: '',
    notes: '',
    status: 'processing',
  });

  // ─── FETCH RECENT BOOKINGS ───────────────────────────────
  const {
    data: recentBookings = [],
  } = useQuery({
    queryKey: ['bookings', 'recent'],
    queryFn: bookingApi.getAll,
    select: (response) => {
      const data = response?.data || response;
      let bookings = [];
      if (Array.isArray(data)) bookings = data;
      else if (data.data && Array.isArray(data.data)) bookings = data.data;
      else if (data.bookings && Array.isArray(data.bookings)) bookings = data.bookings;
      
      // Return last 3 bookings
      return bookings.slice(0, 3);
    },
    staleTime: 1000 * 60,
  });

  // ─── CREATE BOOKING ───────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: bookingApi.create,
    onSuccess: (response) => {
      const booking = response?.data || response;
      setBookingId(booking._id || booking.id);
      setBookingNo(booking.bookingNo);
      setBookingStep(1);
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to create booking');
    },
  });

  // ─── UPDATE PERSONAL ──────────────────────────────────────
  const updatePersonalMutation = useMutation({
    mutationFn: ({ id, data }) => bookingApi.updatePersonal(id, data),
    onSuccess: () => {
      setBookingStep(2);
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to update personal details');
    },
  });

  // ─── UPDATE KYC ───────────────────────────────────────────
  const updateKycMutation = useMutation({
    mutationFn: ({ id, formData }) => bookingApi.updateKyc(id, formData),
    onSuccess: () => {
      setBookingStep(3);
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to upload KYC documents');
    },
  });

  // ─── UPDATE PROPERTY ──────────────────────────────────────
  const updatePropertyMutation = useMutation({
    mutationFn: ({ id, data }) => bookingApi.updateProperty(id, data),
    onSuccess: () => {
      setBookingStep(4);
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to link property');
    },
  });

  // ─── UPDATE PAYMENT ───────────────────────────────────────
  const updatePaymentMutation = useMutation({
    mutationFn: ({ id, data }) => bookingApi.updatePayment(id, data),
    onSuccess: () => {
      // Proceed to submit
      submitMutation.mutate(bookingId);
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to update payment details');
    },
  });

  // ─── SUBMIT BOOKING ───────────────────────────────────────
  const submitMutation = useMutation({
    mutationFn: bookingApi.submit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setIsSubmitted(true);
      
      setTimeout(() => {
        resetForm();
      }, 3000);
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to submit booking');
    },
  });

  // ─── HANDLERS ─────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleTabChange = async (tab) => {
    if (bookingStep > 0) {
      alert('Please complete or reset the current booking before switching tabs');
      return;
    }
    setActiveTab(tab);
    setFormData(prev => ({ ...prev, type: tab }));
  };

  const handleContinue = () => {
    switch (bookingStep) {
      case 0:
        createMutation.mutate({
          type: formData.type,
          bookingDate: formData.bookingDate,
        });
        break;
      case 1:
        updatePersonalMutation.mutate({
          id: bookingId,
          data: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            aadharNumber: formData.aadharNumber,
            panNumber: formData.panNumber,
            alternatePhone: formData.alternatePhone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
          },
        });
        break;
      case 2:
        const kycFormData = new FormData();
        if (formData.aadharFile) kycFormData.append('aadhar', formData.aadharFile);
        if (formData.panFile) kycFormData.append('pan', formData.panFile);
        if (formData.photoFile) kycFormData.append('passport', formData.photoFile);
        updateKycMutation.mutate({ id: bookingId, formData: kycFormData });
        break;
      case 3:
        updatePropertyMutation.mutate({
          id: bookingId,
          data: { propertyId: formData.propertyId },
        });
        break;
      case 4:
        updatePaymentMutation.mutate({
          id: bookingId,
          data: {
            bookingAmount: parseFloat(formData.bookingAmount),
            paymentMethod: formData.paymentMethod,
            bankName: formData.bankName,
            chequeNumber: formData.chequeNumber,
            notes: formData.notes,
            status: formData.status,
          },
        });
        break;
      default:
        break;
    }
  };

  const resetForm = () => {
    setBookingStep(0);
    setIsSubmitted(false);
    setBookingId(null);
    setBookingNo(null);
    setFormData({
      type: activeTab,
      bookingDate: new Date().toISOString().split('T')[0],
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      aadharNumber: '',
      panNumber: '',
      alternatePhone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      aadharFile: null,
      panFile: null,
      photoFile: null,
      propertyId: '',
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
      bookingAmount: '',
      paymentMethod: 'cheque',
      bankName: '',
      chequeNumber: '',
      notes: '',
      status: 'processing',
    });
  };

  const isLoading = 
    createMutation.isPending ||
    updatePersonalMutation.isPending ||
    updateKycMutation.isPending ||
    updatePropertyMutation.isPending ||
    updatePaymentMutation.isPending ||
    submitMutation.isPending;

  const stats = [
    { label: 'Total Bookings', value: '1,247', change: '+12%', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'blue' },
    { label: 'New Bookings', value: '892', change: '+8%', icon: 'M12 4v16m8-8H4', color: 'emerald' },
    { label: 'Resale', value: '355', change: '+15%', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', color: 'violet' },
    { label: 'Revenue', value: '₹128Cr', change: '+18%', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1', color: 'amber' }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: { gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-600' },
      emerald: { gradient: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-600' },
      violet: { gradient: 'from-violet-500 to-violet-600', bg: 'bg-violet-50', text: 'text-violet-600' },
      amber: { gradient: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', text: 'text-amber-600' }
    };
    return colors[color];
  };

  const formatBookingDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage new and resale property bookings with complete KYC details</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, index) => {
            const colorClass = getColorClasses(stat.color);
            return (
              <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-5 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className={`p-2 sm:p-3 ${colorClass.bg} rounded-lg sm:rounded-xl`}>
                    <svg className={`w-4 h-4 sm:w-6 sm:h-6 ${colorClass.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => handleTabChange('new')}
                  disabled={bookingStep > 0}
                  className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 font-semibold text-sm sm:text-base transition-all ${
                    activeTab === 'new'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  } ${bookingStep > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  New Booking
                </button>
                <button
                  onClick={() => handleTabChange('resale')}
                  disabled={bookingStep > 0}
                  className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 font-semibold text-sm sm:text-base transition-all ${
                    activeTab === 'resale'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  } ${bookingStep > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Resale Booking
                </button>
              </div>

              {/* Booking Number */}
              {bookingNo && bookingStep > 0 && (
                <div className="px-4 sm:px-6 py-3 bg-blue-50 border-b border-blue-100">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-sm font-medium text-gray-700">Booking Number:</span>
                    <span className="text-sm sm:text-base font-bold text-blue-600">{bookingNo}</span>
                  </div>
                </div>
              )}

              {/* Progress Steps */}
              {bookingStep > 0 && (
                <div className="px-3 sm:px-6 py-4 sm:py-6 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    {[
                      { num: 1, label: 'Personal', shortLabel: 'Info' },
                      { num: 2, label: 'KYC', shortLabel: 'KYC' },
                      { num: 3, label: 'Property', shortLabel: 'Prop' },
                      { num: 4, label: 'Payment', shortLabel: 'Pay' }
                    ].map((step, index) => (
                      <React.Fragment key={step.num}>
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                            bookingStep >= step.num
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                              : 'bg-gray-200 text-gray-500'
                          }`}>
                            {bookingStep > step.num ? '✓' : step.num}
                          </div>
                          <span className={`mt-1 sm:mt-2 text-xs font-medium ${
                            bookingStep >= step.num ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            <span className="hidden sm:inline">{step.label}</span>
                            <span className="sm:hidden">{step.shortLabel}</span>
                          </span>
                        </div>
                        {index < 3 && (
                          <div className={`flex-1 h-1 mx-1 sm:mx-2 rounded ${
                            bookingStep > step.num ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-gray-200'
                          }`} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {isSubmitted ? (
                <div className="p-8 sm:p-12 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl mx-auto mb-4 sm:mb-6 shadow-lg">
                    ✓
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Booking Submitted Successfully!</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Booking #{bookingNo} has been registered. Our team will contact you shortly.</p>
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-sm"
                  >
                    Submit Another Booking
                  </button>
                </div>
              ) : (
                <div className="p-4 sm:p-6">
                  {/* Step 0: Select Type & Date */}
                  {bookingStep === 0 && (
                    <div className="space-y-4 sm:space-y-5">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 pb-3 border-b border-gray-200">Start New Booking</h3>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Booking Date</label>
                        <input
                          type="date"
                          name="bookingDate"
                          value={formData.bookingDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          Booking Type
                        </h4>
                        <p className="text-sm text-gray-700">
                          You've selected: <span className="font-bold text-blue-600">{activeTab === 'new' ? 'New Booking' : 'Resale Booking'}</span>
                        </p>
                        <p className="text-xs text-gray-600 mt-2">Click the tabs above to change booking type before starting.</p>
                      </div>
                    </div>
                  )}

                  {/* Step 1: Personal Details - SAME AS BEFORE */}
                  {bookingStep === 1 && (
                    <div className="space-y-4 sm:space-y-5">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 pb-3 border-b border-gray-200">Personal Details</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                          <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                          <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                          <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                          <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Aadhar Number</label>
                          <input type="text" name="aadharNumber" value={formData.aadharNumber} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="XXXX XXXX XXXX" maxLength="12" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">PAN Number</label>
                          <input type="text" name="panNumber" value={formData.panNumber} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="ABCDE1234F" maxLength="10" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                        <textarea name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" rows="2" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                          <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                          <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                          <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" maxLength="6" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: KYC Documents - File upload form stays same */}
                  {bookingStep === 2 && (
                    <div className="space-y-4 sm:space-y-5">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 pb-3 border-b border-gray-200">KYC Documents</h3>
                      
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-sm font-semibold text-amber-800">Important</p>
                            <p className="text-sm text-amber-700 mt-1">Upload clear copies of your documents (JPG, PNG, PDF - Max 5MB)</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Aadhar Card *</label>
                          <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                            <input type="file" name="aadharFile" accept="image/*,.pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                            <p className="text-sm text-gray-600 truncate px-2">{formData.aadharFile ? formData.aadharFile.name : 'Click to upload'}</p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">PAN Card *</label>
                          <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                            <input type="file" name="panFile" accept="image/*,.pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                            <p className="text-sm text-gray-600 truncate px-2">{formData.panFile ? formData.panFile.name : 'Click to upload'}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Passport Photo *</label>
                        <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer max-w-md mx-auto">
                          <input type="file" name="photoFile" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                          <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                          <p className="text-sm text-gray-600 truncate px-2">{formData.photoFile ? formData.photoFile.name : 'Click to upload'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Property Details */}
                  {bookingStep === 3 && (
                    <div className="space-y-4 sm:space-y-5">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 pb-3 border-b border-gray-200">Property Details</h3>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Property ID *</label>
                        <input type="text" name="propertyId" value={formData.propertyId} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Enter Property ID" required />
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                          Link Property
                        </h4>
                        <p className="text-sm text-gray-700">Enter the Property ID from your inventory to link this booking.</p>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Payment */}
                  {bookingStep === 4 && (
                    <div className="space-y-4 sm:space-y-5">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 pb-3 border-b border-gray-200">Payment Details</h3>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Booking Amount (₹) *</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                          <input type="number" name="bookingAmount" value={formData.bookingAmount} onChange={handleInputChange} className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method *</label>
                        <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem'}}>
                          <option value="cheque">Cheque</option>
                          <option value="rtgs">RTGS/NEFT</option>
                          <option value="cash">Cash</option>
                          <option value="upi">UPI</option>
                          <option value="card">Debit/Credit Card</option>
                        </select>
                      </div>

                      {(formData.paymentMethod === 'cheque' || formData.paymentMethod === 'rtgs' || formData.paymentMethod === 'card') && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
                            <input type="text" name="bankName" value={formData.bankName} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">{formData.paymentMethod === 'cheque' ? 'Cheque Number' : 'Transaction Reference'}</label>
                            <input type="text" name="chequeNumber" value={formData.chequeNumber} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                        <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" rows="3" placeholder="Any additional notes..." />
                      </div>

                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5">
                        <h4 className="font-bold text-gray-900 mb-4">Payment Summary</h4>
                        <div className="flex justify-between items-center text-lg font-bold text-gray-900 pb-3 border-b-2 border-blue-500">
                          <span>Booking Amount:</span>
                          <span>₹ {parseFloat(formData.bookingAmount || 0).toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">* Registration charges and taxes will be added at the time of final registration</p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 gap-3">
                    {bookingStep > 0 && (
                      <button type="button" onClick={() => setBookingStep(prev => prev - 1)} disabled={isLoading} className="px-4 sm:px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm sm:text-base">
                        Back
                      </button>
                    )}
                    
                    <button type="button" onClick={handleContinue} disabled={isLoading} className={`px-4 sm:px-6 py-2.5 font-semibold rounded-xl transition-all shadow-sm ml-auto flex items-center gap-2 disabled:opacity-50 text-sm sm:text-base ${bookingStep === 4 ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700' : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'} text-white`}>
                      {isLoading && (
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {bookingStep === 4 ? 'Submit Booking' : 'Continue'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Recent Bookings */}
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">Recent Bookings</h3>
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div key={booking._id || booking.id} className="p-3 sm:p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all">
                    <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-600 text-xs sm:text-sm">{booking.bookingNo || `#BK${booking.id}`}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${booking.type === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-violet-100 text-violet-700'}`}>
                          {booking.type || 'N/A'}
                        </span>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${booking.status === 'confirmed' || booking.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : booking.status === 'pending' || booking.status === 'processing' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {booking.status || 'N/A'}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{booking.firstName} {booking.lastName}</p>
                    <p className="text-xs text-gray-600 mt-1">{booking.propertyId || 'Property'}</p>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                      <span className="font-bold text-emerald-600 text-sm">₹{booking.bookingAmount?.toLocaleString('en-IN') || '0'}</span>
                      <span className="text-xs text-gray-500">{formatBookingDate(booking.bookingDate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-5">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                Booking Guidelines
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                <li className="flex items-start gap-2"><span className="text-blue-600 mt-0.5">•</span><span>Minimum booking amount: ₹1,00,000</span></li>
                <li className="flex items-start gap-2"><span className="text-blue-600 mt-0.5">•</span><span>KYC documents are mandatory</span></li>
                <li className="flex items-start gap-2"><span className="text-blue-600 mt-0.5">•</span><span>Payment via cheque requires 2-3 days clearance</span></li>
                <li className="flex items-start gap-2"><span className="text-blue-600 mt-0.5">•</span><span>Registration within 30 days of booking</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
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

export default BookingForms;