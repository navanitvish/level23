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
    preLaunchNote: 'During Pre launch, taxes as applicable can be added later when going for registration.',
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
    { id: 'new-booking', label: 'New Booking', icon: '🏢' },
    { id: 'resale', label: 'Resale Booking', icon: '🔄' },
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
    { label: 'Total Bookings', value: '1,247', change: '+12%' },
    { label: 'New Bookings', value: '892', change: '+8%' },
    { label: 'Resale', value: '355', change: '+15%' },
    { label: 'Revenue', value: '₹128Cr', change: '+18%' }
  ];

  const recentBookings = [
    { id: '#BK001', type: 'New', customer: 'Rahul Sharma', project: 'Skyline Towers', amount: '₹45,00,000', status: 'Confirmed', date: '2026-01-30' },
    { id: '#BK002', type: 'Resale', customer: 'Priya Mehta', project: 'Green Valley', amount: '₹32,00,000', status: 'Pending', date: '2026-01-29' },
    { id: '#BK003', type: 'New', customer: 'Amit Kumar', project: 'Royal Gardens', amount: '₹58,00,000', status: 'Confirmed', date: '2026-01-28' },
    { id: '#BK004', type: 'Resale', customer: 'Sneha Jain', project: 'Lake View', amount: '₹41,00,000', status: 'Processing', date: '2026-01-27' },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Booking Management</h1>
      <p style={styles.description}>Manage new and resale property bookings with complete KYC details</p>

      {/* Stats Overview */}
      <div style={styles.statsRow}>
        {stats.map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <div style={styles.statContent}>
              <p style={styles.statLabel}>{stat.label}</p>
              <p style={styles.statValue}>{stat.value}</p>
              <span style={stat.change.startsWith('+') ? styles.statChangePositive : styles.statChangeNegative}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.mainContent}>
        {/* Left Column - Booking Form */}
        <div style={styles.formSection}>
          <div style={styles.formCard}>
            {/* Form Tabs */}
            <div style={styles.tabContainer}>
              {bookingTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveTab(type.id)}
                  style={activeTab === type.id ? styles.activeTab : styles.tab}
                >
                  <span style={styles.tabIcon}>{type.icon}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>

            {/* Progress Steps */}
            <div style={styles.progressContainer}>
              <div style={styles.progressBar}>
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} style={styles.progressStep}>
                    <div style={bookingStep >= step ? styles.progressCircleActive : styles.progressCircle}>
                      {bookingStep > step ? '✓' : step}
                    </div>
                    <span style={bookingStep >= step ? styles.progressLabelActive : styles.progressLabel}>
                      {step === 1 && 'Personal'}
                      {step === 2 && 'KYC'}
                      {step === 3 && 'Property'}
                      {step === 4 && 'Payment'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {isSubmitted ? (
              <div style={styles.successMessage}>
                <div style={styles.successIcon}>✓</div>
                <h3 style={styles.successTitle}>Booking Submitted Successfully!</h3>
                <p>Your booking has been registered. Our team will contact you shortly.</p>
                <button style={styles.submitAnotherButton} onClick={() => setIsSubmitted(false)}>
                  Submit Another Booking
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={styles.form}>
                {/* Step 1: Personal Details */}
                {bookingStep === 1 && (
                  <div style={styles.formStep}>
                    <h3 style={styles.stepTitle}>Personal Details</h3>
                    
                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          style={styles.input}
                          required
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Last Name *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          style={styles.input}
                          required
                        />
                      </div>
                    </div>

                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Email ID *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          style={styles.input}
                          required
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          style={styles.input}
                          required
                        />
                      </div>
                    </div>

                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Aadhar Number *</label>
                        <input
                          type="text"
                          name="aadharNumber"
                          value={formData.aadharNumber}
                          onChange={handleInputChange}
                          style={styles.input}
                          placeholder="XXXX XXXX XXXX"
                          maxLength="12"
                          required
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>PAN Number *</label>
                        <input
                          type="text"
                          name="panNumber"
                          value={formData.panNumber}
                          onChange={handleInputChange}
                          style={styles.input}
                          placeholder="ABCDE1234F"
                          maxLength="10"
                          required
                        />
                      </div>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Alternate Phone</label>
                      <input
                        type="tel"
                        name="alternatePhone"
                        value={formData.alternatePhone}
                        onChange={handleInputChange}
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        style={styles.textarea}
                        rows="2"
                      />
                    </div>

                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          style={styles.input}
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          style={styles.input}
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Pincode</label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          style={styles.input}
                          maxLength="6"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: KYC Documents */}
                {bookingStep === 2 && (
                  <div style={styles.formStep}>
                    <h3 style={styles.stepTitle}>KYC Documents</h3>
                    
                    <div style={styles.kycNote}>
                      <strong>Note:</strong> Please upload clear copies of your documents for verification.
                    </div>

                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Aadhar Card *</label>
                        <div style={styles.fileUpload}>
                          <input
                            type="file"
                            name="aadharFile"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            style={styles.fileInput}
                          />
                          <span style={styles.fileLabel}>
                            {formData.aadharFile ? formData.aadharFile.name : 'Choose File'}
                          </span>
                        </div>
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>PAN Card *</label>
                        <div style={styles.fileUpload}>
                          <input
                            type="file"
                            name="panFile"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            style={styles.fileInput}
                          />
                          <span style={styles.fileLabel}>
                            {formData.panFile ? formData.panFile.name : 'Choose File'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Passport Photo *</label>
                      <div style={styles.fileUpload}>
                        <input
                          type="file"
                          name="photoFile"
                          accept="image/*"
                          onChange={handleFileChange}
                          style={styles.fileInput}
                        />
                        <span style={styles.fileLabel}>
                          {formData.photoFile ? formData.photoFile.name : 'Choose File'}
                        </span>
                      </div>
                    </div>

                    <div style={styles.documentPreview}>
                      <h4 style={styles.documentTitle}>Document Guidelines</h4>
                      <ul style={styles.guidelinesList}>
                        <li>Documents should be clearly readable</li>
                        <li>All four corners of the document must be visible</li>
                        <li>File size should be less than 5MB each</li>
                        <li>Accepted formats: JPG, PNG, PDF</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Step 3: Property Details */}
                {bookingStep === 3 && (
                  <div style={styles.formStep}>
                    <h3 style={styles.stepTitle}>Property Details</h3>
                    
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Property Type *</label>
                      <select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleInputChange}
                        style={styles.select}
                      >
                        {propertyTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Project Name *</label>
                      <input
                        type="text"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleInputChange}
                        style={styles.input}
                        required
                      />
                    </div>

                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Tower/Block</label>
                        <input
                          type="text"
                          name="tower"
                          value={formData.tower}
                          onChange={handleInputChange}
                          style={styles.input}
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Unit Number</label>
                        <input
                          type="text"
                          name="unitNumber"
                          value={formData.unitNumber}
                          onChange={handleInputChange}
                          style={styles.input}
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Floor</label>
                        <input
                          type="number"
                          name="floor"
                          value={formData.floor}
                          onChange={handleInputChange}
                          style={styles.input}
                        />
                      </div>
                    </div>

                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Area (sq ft)</label>
                        <input
                          type="number"
                          name="area"
                          value={formData.area}
                          onChange={handleInputChange}
                          style={styles.input}
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Price per sq ft (₹)</label>
                        <input
                          type="number"
                          name="pricePerSqft"
                          value={formData.pricePerSqft}
                          onChange={handleInputChange}
                          onBlur={calculateTotalPrice}
                          style={styles.input}
                        />
                      </div>
                    </div>

                    <div style={styles.totalPriceDisplay}>
                      <span style={styles.totalPriceLabel}>Total Property Price:</span>
                      <span style={styles.totalPriceValue}>₹ {parseFloat(formData.totalPrice || 0).toLocaleString()}</span>
                    </div>

                    {/* Resale History Section */}
                    {activeTab === 'resale' && (
                      <div style={styles.resaleSection}>
                        <h4 style={styles.resaleTitle}>Resale History</h4>
                        
                        <div style={styles.formRow}>
                          <div style={styles.formGroup}>
                            <label style={styles.label}>Original Buyer Name</label>
                            <input
                              type="text"
                              name="originalBuyerName"
                              value={formData.originalBuyerName}
                              onChange={handleInputChange}
                              style={styles.input}
                            />
                          </div>
                          <div style={styles.formGroup}>
                            <label style={styles.label}>Original Booking Date</label>
                            <input
                              type="date"
                              name="originalBookingDate"
                              value={formData.originalBookingDate}
                              onChange={handleInputChange}
                              style={styles.input}
                            />
                          </div>
                        </div>

                        <div style={styles.formRow}>
                          <div style={styles.formGroup}>
                            <label style={styles.label}>Original Price (₹)</label>
                            <input
                              type="number"
                              name="originalPrice"
                              value={formData.originalPrice}
                              onChange={handleInputChange}
                              style={styles.input}
                            />
                          </div>
                          <div style={styles.formGroup}>
                            <label style={styles.label}>Current Owner Name</label>
                            <input
                              type="text"
                              name="currentOwnerName"
                              value={formData.currentOwnerName}
                              onChange={handleInputChange}
                              style={styles.input}
                            />
                          </div>
                        </div>

                        <div style={styles.formGroup}>
                          <label style={styles.label}>Reason for Sale</label>
                          <textarea
                            name="reasonForSale"
                            value={formData.reasonForSale}
                            onChange={handleInputChange}
                            style={styles.textarea}
                            rows="2"
                          />
                        </div>
                      </div>
                    )}

                    {/* Pre-launch Note */}
                    <div style={styles.preLaunchNote}>
                      <strong>📌 Important:</strong> During Pre launch, taxes as applicable can be added later when going for registration.
                    </div>
                  </div>
                )}

                {/* Step 4: Payment */}
                {bookingStep === 4 && (
                  <div style={styles.formStep}>
                    <h3 style={styles.stepTitle}>Payment Details</h3>
                    
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Booking Amount (₹) *</label>
                      <input
                        type="number"
                        name="bookingAmount"
                        value={formData.bookingAmount}
                        onChange={handleInputChange}
                        style={styles.input}
                        required
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Payment Mode *</label>
                      <select
                        name="paymentMode"
                        value={formData.paymentMode}
                        onChange={handleInputChange}
                        style={styles.select}
                      >
                        {paymentModes.map(mode => (
                          <option key={mode.value} value={mode.value}>{mode.label}</option>
                        ))}
                      </select>
                    </div>

                    {(formData.paymentMode === 'cheque' || formData.paymentMode === 'rtgs' || formData.paymentMode === 'card') && (
                      <div style={styles.formRow}>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Bank Name</label>
                          <input
                            type="text"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleInputChange}
                            style={styles.input}
                          />
                        </div>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>
                            {formData.paymentMode === 'cheque' ? 'Cheque Number' : 'Transaction Reference'}
                          </label>
                          <input
                            type="text"
                            name="chequeNumber"
                            value={formData.chequeNumber}
                            onChange={handleInputChange}
                            style={styles.input}
                          />
                        </div>
                      </div>
                    )}

                    <div style={styles.paymentSummary}>
                      <h4 style={styles.summaryTitle}>Payment Summary</h4>
                      <div style={styles.summaryRow}>
                        <span>Booking Amount:</span>
                        <span>₹ {parseFloat(formData.bookingAmount || 0).toLocaleString()}</span>
                      </div>
                      <div style={styles.summaryNote}>
                        * Registration charges and taxes will be added at the time of final registration as applicable.
                      </div>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Special Requests / Notes</label>
                      <textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        style={styles.textarea}
                        rows="3"
                      />
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div style={styles.buttonGroup}>
                  {bookingStep > 1 && (
                    <button
                      type="button"
                      style={styles.backButton}
                      onClick={() => setBookingStep(prev => prev - 1)}
                    >
                      Back
                    </button>
                  )}
                  
                  {bookingStep < 4 ? (
                    <button
                      type="button"
                      style={styles.continueButton}
                      onClick={() => setBookingStep(prev => prev + 1)}
                    >
                      Continue
                    </button>
                  ) : (
                    <button type="submit" style={styles.submitButton}>
                      Submit Booking
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Column - Recent Bookings */}
        <div style={styles.recentSection}>
          <div style={styles.recentCard}>
            <h3 style={styles.sectionTitle}>Recent Bookings</h3>
            <div style={styles.bookingList}>
              {recentBookings.map((booking) => (
                <div key={booking.id} style={styles.bookingItem}>
                  <div style={styles.bookingInfo}>
                    <div style={styles.bookingHeader}>
                      <span style={styles.bookingId}>{booking.id}</span>
                      <span style={booking.type === 'New' ? styles.typeBadgeNew : styles.typeBadgeResale}>
                        {booking.type}
                      </span>
                    </div>
                    <p style={styles.customerName}>{booking.customer}</p>
                    <p style={styles.projectName}>{booking.project}</p>
                  </div>
                  <div style={styles.bookingMeta}>
                    <p style={styles.amount}>{booking.amount}</p>
                    <p style={styles.date}>{booking.date}</p>
                    <span style={
                      booking.status === 'Confirmed' ? styles.statusConfirmed :
                      booking.status === 'Pending' ? styles.statusPending :
                      styles.statusProcessing
                    }>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button style={styles.viewAllButton}>View All Bookings</button>
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>Booking Guidelines</h3>
            <ul style={styles.guidelines}>
              <li>Minimum booking amount: ₹1,00,000</li>
              <li>KYC documents are mandatory</li>
              <li>Payment via cheque requires 2-3 days clearance</li>
              <li>Resale bookings require original owner documents</li>
              <li>Registration within 30 days of booking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
    color: '#333',
  },
  title: {
    fontSize: '2.5rem',
    color: '#2c3e50',
    marginBottom: '10px',
    borderBottom: '2px solid #3498db',
    paddingBottom: '10px',
  },
  description: {
    fontSize: '1.1rem',
    color: '#7f8c8d',
    marginBottom: '30px',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    border: '1px solid #eee',
  },
  statContent: {
    textAlign: 'center',
  },
  statLabel: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
  },
  statValue: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    margin: '5px 0',
  },
  statChangePositive: {
    color: '#27ae60',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  statChangeNegative: {
    color: '#e74c3c',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '30px',
  },
  formSection: {
    flex: 1,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  tabContainer: {
    display: 'flex',
    borderBottom: '2px solid #eee',
  },
  tab: {
    flex: 1,
    padding: '15px',
    border: 'none',
    backgroundColor: '#f8f9fa',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '0.95rem',
    color: '#7f8c8d',
    transition: 'all 0.3s',
  },
  activeTab: {
    flex: 1,
    padding: '15px',
    border: 'none',
    backgroundColor: '#3498db',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '0.95rem',
  },
  tabIcon: {
    fontSize: '1.2rem',
  },
  progressContainer: {
    padding: '20px',
    borderBottom: '1px solid #eee',
  },
  progressBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  progressCircle: {
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    backgroundColor: '#ecf0f1',
    color: '#7f8c8d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  progressCircleActive: {
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    backgroundColor: '#3498db',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  progressLabel: {
    fontSize: '0.8rem',
    color: '#7f8c8d',
  },
  progressLabelActive: {
    fontSize: '0.8rem',
    color: '#3498db',
    fontWeight: 'bold',
  },
  form: {
    padding: '25px',
  },
  formStep: {
    marginBottom: '20px',
  },
  stepTitle: {
    fontSize: '1.3rem',
    color: '#2c3e50',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  formRow: {
    display: 'flex',
    gap: '15px',
    marginBottom: '15px',
    flexWrap: 'wrap',
  },
  formGroup: {
    flex: '1 1 200px',
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#2c3e50',
    fontSize: '0.9rem',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    backgroundColor: '#fff',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    resize: 'vertical',
  },
  kycNote: {
    backgroundColor: '#fff3cd',
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '20px',
    color: '#856404',
    fontSize: '0.9rem',
  },
  fileUpload: {
    position: 'relative',
    border: '2px dashed #ddd',
    borderRadius: '5px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
  },
  fileInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  },
  fileLabel: {
    display: 'block',
    color: '#7f8c8d',
  },
  documentPreview: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '5px',
    marginTop: '20px',
  },
  documentTitle: {
    fontSize: '1rem',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  guidelinesList: {
    marginLeft: '20px',
    color: '#7f8c8d',
    fontSize: '0.9rem',
  },
  resaleSection: {
    backgroundColor: '#f0f7ff',
    padding: '20px',
    borderRadius: '10px',
    marginTop: '20px',
    border: '1px solid #3498db',
  },
  resaleTitle: {
    fontSize: '1.1rem',
    color: '#2c3e50',
    marginBottom: '15px',
  },
  preLaunchNote: {
    backgroundColor: '#e8f4fd',
    padding: '15px',
    borderRadius: '5px',
    marginTop: '20px',
    color: '#2c3e50',
    fontSize: '0.9rem',
    borderLeft: '4px solid #3498db',
  },
  totalPriceDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#27ae60',
    color: '#fff',
    padding: '15px 20px',
    borderRadius: '5px',
    marginTop: '20px',
  },
  totalPriceLabel: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  totalPriceValue: {
    fontWeight: 'bold',
    fontSize: '1.3rem',
  },
  paymentSummary: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    marginTop: '20px',
  },
  summaryTitle: {
    fontSize: '1.1rem',
    color: '#2c3e50',
    marginBottom: '15px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    padding: '10px 0',
    borderBottom: '2px solid #3498db',
  },
  summaryNote: {
    fontSize: '0.85rem',
    color: '#7f8c8d',
    marginTop: '10px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  },
  backButton: {
    padding: '12px 30px',
    backgroundColor: '#95a5a6',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  continueButton: {
    padding: '12px 30px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginLeft: 'auto',
  },
  submitButton: {
    padding: '12px 30px',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginLeft: 'auto',
  },
  successMessage: {
    textAlign: 'center',
    padding: '40px',
  },
  successIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#27ae60',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    margin: '0 auto 20px',
  },
  successTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  submitAnotherButton: {
    padding: '12px 30px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '20px',
  },
  recentSection: {
    width: '350px',
  },
  recentCard: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '20px',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '1.2rem',
    color: '#2c3e50',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '2px solid #3498db',
  },
  bookingList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  bookingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px',
    border: '1px solid #eee',
    borderRadius: '8px',
    transition: 'all 0.3s',
  },
  bookingInfo: {
    flex: 1,
  },
  bookingHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '5px',
  },
  bookingId: {
    fontWeight: 'bold',
    color: '#3498db',
  },
  typeBadgeNew: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '2px 8px',
    borderRadius: '3px',
    fontSize: '0.75rem',
  },
  typeBadgeResale: {
    backgroundColor: '#9b59b6',
    color: '#fff',
    padding: '2px 8px',
    borderRadius: '3px',
    fontSize: '0.75rem',
  },
  customerName: {
    fontWeight: 'bold',
    color: '#2c3e50',
    margin: '5px 0',
  },
  projectName: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
  },
  bookingMeta: {
    textAlign: 'right',
  },
  amount: {
    fontWeight: 'bold',
    color: '#27ae60',
    margin: '5px 0',
  },
  date: {
    color: '#7f8c8d',
    fontSize: '0.85rem',
    margin: '5px 0',
  },
  statusConfirmed: {
    backgroundColor: '#27ae60',
    color: '#fff',
    padding: '3px 8px',
    borderRadius: '3px',
    fontSize: '0.75rem',
  },
  statusPending: {
    backgroundColor: '#f39c12',
    color: '#fff',
    padding: '3px 8px',
    borderRadius: '3px',
    fontSize: '0.75rem',
  },
  statusProcessing: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '3px 8px',
    borderRadius: '3px',
    fontSize: '0.75rem',
  },
  viewAllButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #ddd',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '15px',
    fontSize: '1rem',
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    padding: '20px',
    border: '1px solid #eee',
  },
  infoTitle: {
    fontSize: '1.1rem',
    color: '#2c3e50',
    marginBottom: '15px',
  },
  guidelines: {
    marginLeft: '20px',
    color: '#7f8c8d',
  },
};

export default BookingForms;
