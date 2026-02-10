import React, { useState } from 'react';

const TermsConditions = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [expandedSection, setExpandedSection] = useState(null);

  // General Terms & Conditions Data
  const generalTerms = [
    {
      id: 1,
      title: 'Acceptance of Terms',
      content: 'By accessing and using this website/application, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this website/application.',
    },
    {
      id: 2,
      title: 'Use of Services',
      content: 'The services provided by Level23 are intended for legitimate business purposes only. Users agree not to use the platform for any illegal or unauthorized purpose, including but not limited to: violating any laws or regulations, infringing on intellectual property rights, transmitting harmful code or malware.',
    },
    {
      id: 3,
      title: 'User Responsibilities',
      content: 'Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account. You agree to immediately notify us of any unauthorized use of your account or any other breach of security.',
    },
    {
      id: 4,
      title: 'Privacy Policy',
      content: 'Your use of our services is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information. By using our services, you consent to the collection and use of your information as described in the Privacy Policy.',
    },
    {
      id: 5,
      title: 'Intellectual Property Rights',
      content: 'All content, features, and functionality of this website/application (including but not limited to text, graphics, logos, icons, images, audio clips, and software) are owned by Level23 or its licensors and are protected by copyright, trademark, and other intellectual property laws.',
    },
  ];

  // Booking Terms
  const bookingTerms = [
    {
      id: 1,
      title: 'Booking Process',
      content: 'Booking of units/properties shall be considered confirmed only upon receipt of the prescribed booking amount and acceptance of the booking form by Level23. The booking amount is typically 10-20% of the total consideration amount, subject to the specific project terms.',
    },
    {
      id: 2,
      title: 'Booking Amount',
      content: 'The booking amount is subject to the following conditions: It is non-transferable except with written consent from Level23. It may be adjusted against the final sale consideration. A nominal administrative fee may be deducted for cancellations.',
    },
    {
      id: 3,
      title: 'Price Quotation',
      content: 'All prices quoted are indicative and subject to change without prior notice. The final price shall be as per the booked unit at the time of agreement execution. Prices do not includestamp duty, registration charges, and GST unless specifically mentioned.',
    },
    {
      id: 4,
      title: 'Payment Schedule',
      content: 'Payments shall be made as per the agreed payment schedule. Default in payment may result in: Interest charges at the prescribed rate, Cancellation of booking with applicable deductions, Forfeiture of booking amount as per policy terms.',
    },
    {
      id: 5,
      title: 'Preferential Location Charges',
      content: 'Units with preferential locations (corner, facing park, higher floors, etc.) may attract additional preferential location charges (PLC). These charges are non-refundable and shall be added to the final sale consideration.',
    },
  ];

  // Cancellation & Refund Policy
  const cancellationTerms = [
    {
      id: 1,
      title: 'Cancellation Period',
      content: 'Bookers may cancel their booking within 15 days from the date of booking by submitting a written request. Within this period, the booking amount shall be refunded after deducting a processing fee of ₹5,000 (or as applicable).',
    },
    {
      id: 2,
      title: 'Post-Cancellation Period',
      content: 'After the 15-day cancellation period, the following deductions shall apply: 0-30 days: 20% of booking amount, 31-60 days: 40% of booking amount, 61-90 days: 60% of booking amount, Beyond 90 days: As per discretion of management.',
    },
    {
      id: 3,
      title: 'Refund Timeline',
      content: 'Refund of applicable amounts shall be processed within 30-45 working days from the date of cancellation request approval. Refunds shall be made to the original source of payment or as per mutual agreement.',
    },
    {
      id: 4,
      title: 'Non-Refundable Items',
      content: 'The following amounts are non-refundable: Preferential Location Charges (PLC), Development Charges, Documentation Charges, Booking Fee, Any additional customization charges already incurred.',
    },
    {
      id: 5,
      title: 'Force Majeure',
      content: 'Level23 shall not be liable for any delay or failure in performance due to circumstances beyond its reasonable control, including but not limited to: Natural disasters, Government actions, War or terrorism, Pandemic or epidemic, Economic sanctions.',
    },
  ];

  // Legal Terms
  const legalTerms = [
    {
      id: 1,
      title: 'Governing Law',
      content: 'These terms and conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts in the jurisdiction where the project is located.',
    },
    {
      id: 2,
      title: 'Dispute Resolution',
      content: 'Any disputes, controversies, or claims arising out of or relating to these terms shall be settled through: First, amicable negotiation between parties, Second, mediation through an agreed mediator, Third, arbitration in accordance with the Arbitration and Conciliation Act, 1996.',
    },
    {
      id: 3,
      title: 'Limitation of Liability',
      content: 'Level23\'s liability shall be limited to the maximum extent permitted by applicable law. In no event shall Level23 be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits or data.',
    },
    {
      id: 4,
      title: 'Indemnification',
      content: 'You agree to indemnify, defend, and hold harmless Level23 and its affiliates, officers, directors, employees, and agents from and against any and all claims, liabilities, damages, losses, or expenses (including reasonable attorney\'s fees) arising out of your use of our services.',
    },
    {
      id: 5,
      title: 'Severability',
      content: 'If any provision of these terms is held to be invalid, illegal, or unenforceable, the validity, legality, and enforceability of the remaining provisions shall not be affected or impaired thereby.',
    },
  ];

  // Property-Specific Terms
  const propertyTerms = [
    {
      id: 1,
      title: 'Property Description',
      content: 'All property details, including but not limited to area, dimensions, layouts, specifications, and amenities, are subject to change without notice. The actual property may vary slightly from the representations made in marketing materials.',
    },
    {
      id: 2,
      title: 'Area Calculations',
      content: 'All areas mentioned are approximate and based on preliminary calculations. The final super built-up area, built-up area, and carpet area shall be as per the actual measurement and may vary by ±5%. Minor variations shall not be considered grounds for cancellation.',
    },
    {
      id: 3,
      title: 'Amenities',
      content: 'Amenities mentioned in brochures or marketing materials are indicative and subject to availability. Level23 reserves the right to modify, substitute, or remove any amenities without prior notice. Completion of amenities may not coincide with possession date.',
    },
    {
      id: 4,
      title: 'Possession Timeline',
      content: 'The tentative possession date is provided as an estimate and may change due to various factors including construction progress, regulatory approvals, and force majeure events. Level23 shall not be liable for any delay in possession.',
    },
    {
      id: 5,
      title: 'Maintenance Charges',
      content: 'Maintenance charges shall be applicable from the date of possession. The rate and terms of maintenance shall be as decided by the Association of Apartment Owners (AO/POA) or as communicated by Level23. A security deposit may be collected at the time of possession.',
    },
    {
      id: 6,
      title: 'Owner Association',
      content: 'Upon completion and transfer of a majority of units, the Association shall be formed as per the applicable laws. All unit owners shall be members of the Association and bound by its rules and regulations.',
    },
  ];

  // Statistics
  const stats = [
    { label: 'Active Projects', value: '156', change: '+8%' },
    { label: 'Happy Customers', value: '12,450', change: '+15%' },
    { label: 'Properties Sold', value: '8,920', change: '+12%' },
    { label: 'Years of Experience', value: '18+', change: 'New' }
  ];

  const allTerms = {
    general: generalTerms,
    booking: bookingTerms,
    cancellation: cancellationTerms,
    legal: legalTerms,
    property: propertyTerms,
  };

  const tabInfo = {
    general: { icon: '📋', label: 'General Terms', color: '#3498db' },
    booking: { icon: '🏠', label: 'Booking Terms', color: '#27ae60' },
    cancellation: { icon: '↩️', label: 'Cancellation Policy', color: '#e74c3c' },
    legal: { icon: '⚖️', label: 'Legal Terms', color: '#9b59b6' },
    property: { icon: '🏗️', label: 'Property Terms', color: '#f39c12' },
  };

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Terms & Conditions</h1>
      <p style={styles.description}>
        Comprehensive terms and conditions governing the use of our services, booking processes, 
        and property transactions. Please read carefully before proceeding.
      </p>

      {/* Stats Overview */}
      <div style={styles.statsRow}>
        {stats.map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <p style={styles.statLabel}>{stat.label}</p>
            <p style={styles.statValue}>{stat.value}</p>
            <span style={stat.change.startsWith('+') ? styles.statChangePositive : styles.statChangeNeutral}>
              {stat.change}
            </span>
          </div>
        ))}
      </div>

      {/* Quick Navigation */}
      <div style={styles.quickNav}>
        <div style={styles.quickNavTitle}>Quick Navigation</div>
        <div style={styles.quickNavLinks}>
          {Object.entries(tabInfo).map(([key, info]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                ...styles.quickNavButton,
                backgroundColor: activeTab === key ? info.color : 'transparent',
                color: activeTab === key ? '#fff' : info.color,
                borderColor: info.color,
              }}
            >
              {info.icon} {info.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={styles.mainContent}>
        <div style={styles.sectionHeader}>
          <span style={{ fontSize: '2rem' }}>{tabInfo[activeTab].icon}</span>
          <h2 style={styles.sectionTitle}>{tabInfo[activeTab].label}</h2>
        </div>

        <div style={styles.termsContainer}>
          {allTerms[activeTab].map((term, index) => (
            <div key={term.id} style={styles.termCard}>
              <div
                style={styles.termHeader}
                onClick={() => toggleSection(term.id)}
              >
                <div style={styles.termTitleRow}>
                  <span style={styles.termNumber}>{index + 1}.</span>
                  <span style={styles.termTitle}>{term.title}</span>
                </div>
                <span style={styles.toggleIcon}>
                  {expandedSection === term.id ? '▲' : '▼'}
                </span>
              </div>
              {(expandedSection === term.id || expandedSection === null) && (
                <div style={styles.termContent}>
                  <p style={styles.termText}>{term.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Important Notes */}
      <div style={styles.importantNotes}>
        <h3 style={styles.notesTitle}>⚠️ Important Notes</h3>
        <div style={styles.notesGrid}>
          <div style={styles.noteCard}>
            <div style={styles.noteIcon}>📝</div>
            <h4 style={styles.noteCardTitle}>Document Verification</h4>
            <p style={styles.noteCardText}>
              All documents should be verified by the customer before making any payments or signing agreements.
            </p>
          </div>
          <div style={styles.noteCard}>
            <div style={styles.noteIcon}>💰</div>
            <h4 style={styles.noteCardTitle}>Payment Safety</h4>
            <p style={styles.noteCardText}>
              Make payments only through official channels. Never transfer money to personal accounts.
            </p>
          </div>
          <div style={styles.noteCard}>
            <div style={styles.noteIcon}>📞</div>
            <h4 style={styles.noteCardTitle}>Contact Support</h4>
            <p style={styles.noteCardText}>
              For any queries, contact our support team at support@level23.com or call 1800-XXX-XXXX.
            </p>
          </div>
          <div style={styles.noteCard}>
            <div style={styles.noteIcon}>🔄</div>
            <h4 style={styles.noteCardTitle}>Policy Updates</h4>
            <p style={styles.noteCardText}>
              Terms may be updated periodically. Please review the latest terms before each transaction.
            </p>
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div style={styles.downloadSection}>
        <h3 style={styles.downloadTitle}>📄 Download Documents</h3>
        <div style={styles.downloadButtons}>
          <button style={styles.downloadButton}>
            📥 Download Full Terms (PDF)
          </button>
          <button style={styles.downloadButton}>
            📋 Download Booking Form
          </button>
          <button style={styles.downloadButton}>
            📄 Download Privacy Policy
          </button>
        </div>
      </div>

      {/* Agreement Section */}
      <div style={styles.agreementSection}>
        <div style={styles.agreementBox}>
          <h3 style={styles.agreementTitle}>✅ Agreement to Terms</h3>
          <p style={styles.agreementText}>
            By using our services, booking a property, or accessing our platform, you acknowledge that 
            you have read, understood, and agree to be bound by these Terms & Conditions. If you are 
            using our services on behalf of a company or organization, you represent that you have the 
            authority to bind such entity to these terms.
          </p>
          <div style={styles.contactInfo}>
            <p><strong>For questions or concerns, please contact us at:</strong></p>
            <p>📧 Email: legal@level23.com</p>
            <p>📞 Phone: +91 20 XXXX XXXX</p>
            <p>📍 Address: Level23 Headquarters, Pune, Maharashtra, India</p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div style={styles.footerNote}>
        <p>Last Updated: January 2025 | Version 2.5 | © 2025 Level23. All rights reserved.</p>
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
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: '2.5rem',
    color: '#2c3e50',
    marginBottom: '10px',
    borderBottom: '3px solid #3498db',
    paddingBottom: '15px',
  },
  description: {
    fontSize: '1.1rem',
    color: '#7f8c8d',
    marginBottom: '30px',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '15px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  statLabel: {
    color: '#7f8c8d',
    fontSize: '0.85rem',
    marginBottom: '5px',
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
  statChangeNeutral: {
    color: '#3498db',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  quickNav: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '30px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  quickNavTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '15px',
    textAlign: 'center',
  },
  quickNavLinks: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center',
  },
  quickNavButton: {
    padding: '10px 20px',
    border: '2px solid',
    borderRadius: '25px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '500',
  },
  mainContent: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '25px',
    paddingBottom: '15px',
    borderBottom: '2px solid #eee',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    color: '#2c3e50',
    margin: 0,
  },
  termsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  termCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  },
  termHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    backgroundColor: '#f8f9fa',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  termTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  termNumber: {
    fontWeight: 'bold',
    color: '#3498db',
    fontSize: '1.1rem',
  },
  termTitle: {
    fontWeight: '600',
    color: '#2c3e50',
    fontSize: '1.05rem',
  },
  toggleIcon: {
    color: '#7f8c8d',
    fontSize: '0.8rem',
  },
  termContent: {
    padding: '20px',
    backgroundColor: '#fff',
    borderTop: '1px solid #e0e0e0',
  },
  termText: {
    color: '#555',
    lineHeight: '1.8',
    margin: 0,
  },
  importantNotes: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  notesTitle: {
    fontSize: '1.4rem',
    color: '#e74c3c',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '2px solid #e74c3c',
  },
  notesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  noteCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '20px',
    borderLeft: '4px solid #f39c12',
  },
  noteIcon: {
    fontSize: '2rem',
    marginBottom: '10px',
  },
  noteCardTitle: {
    fontSize: '1rem',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  noteCardText: {
    fontSize: '0.9rem',
    color: '#7f8c8d',
    margin: 0,
  },
  downloadSection: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  downloadTitle: {
    fontSize: '1.4rem',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  downloadButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
  },
  downloadButton: {
    padding: '12px 25px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
  },
  agreementSection: {
    marginBottom: '30px',
  },
  agreementBox: {
    backgroundColor: '#e8f4fd',
    borderRadius: '10px',
    padding: '30px',
    borderLeft: '5px solid #3498db',
  },
  agreementTitle: {
    fontSize: '1.4rem',
    color: '#2c3e50',
    marginBottom: '15px',
  },
  agreementText: {
    color: '#555',
    lineHeight: '1.8',
    marginBottom: '20px',
  },
  contactInfo: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '15px',
  },
  footerNote: {
    textAlign: 'center',
    padding: '20px',
    color: '#7f8c8d',
    fontSize: '0.9rem',
  },
};

export default TermsConditions;
