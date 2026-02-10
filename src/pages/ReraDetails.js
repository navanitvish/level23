import React, { useState } from 'react';

const ReraDetails = () => {
  const [activeTab, setActiveTab] = useState('rera-info');
  const [ setShowCostSheet] = useState(false);
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

  const stats = [
    { label: 'Total Projects', value: '156', change: '+8%' },
    { label: 'RERA Registered', value: '142', change: '+12%' },
    { label: 'Pending', value: '14', change: '-2%' },
    { label: 'Total Revenue', value: '₹2.4Cr', change: '+15%' }
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>RERA Details & Cost Sheets</h1>
      <p style={styles.description}>Complete project details, permissions, terms, and cost sheet management</p>

      {/* Stats Overview */}
      <div style={styles.statsRow}>
        {stats.map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <p style={styles.statLabel}>{stat.label}</p>
            <p style={styles.statValue}>{stat.value}</p>
            <span style={stat.change.startsWith('+') ? styles.statChangePositive : styles.statChangeNegative}>
              {stat.change}
            </span>
          </div>
        ))}
      </div>

      {/* Main Tabs */}
      <div style={styles.tabContainer}>
        <button
          style={activeTab === 'rera-info' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('rera-info')}
        >
          📋 RERA Info
        </button>
        <button
          style={activeTab === 'permissions' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('permissions')}
        >
          ✅ Permissions
        </button>
        <button
          style={activeTab === 'terms' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('terms')}
        >
          📝 Terms & Conditions
        </button>
        <button
          style={activeTab === 'cost-sheet' ? styles.activeTab : styles.tab}
          onClick={() => { setShowCostSheet(true); setActiveTab('cost-sheet'); }}
        >
          💰 Cost Sheet
        </button>
        <button
          style={activeTab === 'brochure' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('brochure')}
        >
          📄 Brochure
        </button>
      </div>

      {/* RERA Info Tab */}
      {activeTab === 'rera-info' && (
        <div style={styles.contentSection}>
          <div style={styles.infoCard}>
            <h2 style={styles.cardTitle}>Project Information</h2>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Project Name</span>
                <span style={styles.infoValue}>{reraData.projectName}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Developer Name</span>
                <span style={styles.infoValue}>{reraData.developerName}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>RERA Number</span>
                <span style={styles.infoValueHighlight}>{reraData.reraNumber}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>RERA Website</span>
                <span style={styles.infoValue}><a href="#">{reraData.reraWebsite}</a></span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Project Address</span>
                <span style={styles.infoValue}>{reraData.projectAddress}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Project Type</span>
                <span style={styles.infoValue}>{reraData.projectType}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Total Area</span>
                <span style={styles.infoValue}>{reraData.totalArea}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Total Units</span>
                <span style={styles.infoValue}>{reraData.totalUnits}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Launched Units</span>
                <span style={styles.infoValue}>{reraData.launchedUnits}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Sold Units</span>
                <span style={styles.infoValue}>{reraData.soldUnits}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Expected Completion</span>
                <span style={styles.infoValue}>{reraData.completionDate}</span>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div style={styles.infoCard}>
            <h2 style={styles.cardTitle}>Location & Directions</h2>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Latitude</span>
                <span style={styles.infoValue}>{reraData.latitude}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Longitude</span>
                <span style={styles.infoValue}>{reraData.longitude}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Google Maps</span>
                <span style={styles.infoValue}>
                  <a href={reraData.googleMapsLink} style={styles.link} target="_blank" rel="noreferrer">
                    📍 View on Map
                  </a>
                </span>
              </div>
            </div>
            <div style={styles.directionsBox}>
              <h4 style={styles.subTitle}>Directions</h4>
              <p style={styles.directionsText}>{reraData.directions}</p>
            </div>
            <div style={styles.landmarksBox}>
              <h4 style={styles.subTitle}>Nearby Landmarks</h4>
              <p style={styles.landmarksText}>{reraData.nearbyLandmarks}</p>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div style={styles.contentSection}>
          <div style={styles.infoCard}>
            <h2 style={styles.cardTitle}>Government Permissions & Clearances</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Permission/Clearance</th>
                  <th style={styles.th}>Reference Number</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={styles.td}>Environmental Clearance</td>
                  <td style={styles.td}>{reraData.environmentalClearance}</td>
                  <td style={styles.td}>{reraData.environmentalDate}</td>
                  <td style={styles.td}><span style={styles.statusActive}>✓ Approved</span></td>
                </tr>
                <tr>
                  <td style={styles.td}>Building Permit</td>
                  <td style={styles.td}>{reraData.buildingPermit}</td>
                  <td style={styles.td}>{reraData.buildingDate}</td>
                  <td style={styles.td}><span style={styles.statusActive}>✓ Approved</span></td>
                </tr>
                <tr>
                  <td style={styles.td}>Fire NOC</td>
                  <td style={styles.td}>{reraData.fireNoc}</td>
                  <td style={styles.td}>{reraData.fireDate}</td>
                  <td style={styles.td}><span style={styles.statusActive}>✓ Approved</span></td>
                </tr>
                <tr>
                  <td style={styles.td}>Water Connection NOC</td>
                  <td style={styles.td}>{reraData.waterNoc}</td>
                  <td style={styles.td}>{reraData.waterDate}</td>
                  <td style={styles.td}><span style={styles.statusActive}>✓ Approved</span></td>
                </tr>
                <tr>
                  <td style={styles.td}>Sewage Connection NOC</td>
                  <td style={styles.td}>{reraData.sewageNoc}</td>
                  <td style={styles.td}>{reraData.sewageDate}</td>
                  <td style={styles.td}><span style={styles.statusActive}>✓ Approved</span></td>
                </tr>
                <tr>
                  <td style={styles.td}>Occupancy Certificate (OC)</td>
                  <td style={styles.td}>-</td>
                  <td style={styles.td}>{reraData.ocDate}</td>
                  <td style={styles.td}><span style={styles.statusPending}>⏳ Pending</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Terms & Conditions Tab */}
      {activeTab === 'terms' && (
        <div style={styles.contentSection}>
          <div style={styles.infoCard}>
            <h2 style={styles.cardTitle}>Terms & Conditions</h2>
            <div style={styles.termsList}>
              {reraData.terms.map((term, index) => (
                <div key={index} style={styles.termItem}>
                  <span style={styles.termNumber}>{index + 1}.</span>
                  <span style={styles.termText}>{term}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cost Sheet Tab */}
      {activeTab === 'cost-sheet' && (
        <div style={styles.contentSection}>
          <div style={styles.costSheetToggle}>
            <button
              style={!showMultipleUnits ? styles.activeToggle : styles.toggleButton}
              onClick={() => { setShowMultipleUnits(false); }}
            >
              📄 Single Unit Cost Sheet
            </button>
            <button
              style={showMultipleUnits ? styles.activeToggle : styles.toggleButton}
              onClick={() => { setShowMultipleUnits(true); }}
            >
              🏠 Multiple Units Cost Sheet
            </button>
          </div>

          {/* Single Unit Cost Sheet */}
          {!showMultipleUnits ? (
            <div style={styles.infoCard}>
              <div style={styles.costSheetHeader}>
                <h2 style={styles.cardTitle}>Proposal Cost Sheet</h2>
                <div style={styles.unitInfo}>
                  <span>Unit: {costSheet.unitNumber}</span>
                  <span>Tower: {costSheet.tower}</span>
                  <span>Floor: {costSheet.floor}</span>
                </div>
              </div>

              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Description</th>
                    <th style={styles.th}>Rate (₹)</th>
                    <th style={styles.th}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={styles.td}>Basic Property Cost ({costSheet.area} sqft × ₹{costSheet.ratePerSqft})</td>
                    <td style={styles.td}>{costSheet.ratePerSqft}/sqft</td>
                    <td style={styles.td}>{costSheet.basicCost.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>Car Parking</td>
                    <td style={styles.td}>Fixed</td>
                    <td style={styles.td}>{costSheet.parkingCost.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>Clubhouse Membership</td>
                    <td style={styles.td}>Fixed</td>
                    <td style={styles.td}>{costSheet.clubhouse.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>Development Charges</td>
                    <td style={styles.td}>Fixed</td>
                    <td style={styles.td}>{costSheet.developmentCharges.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>GST (18%)</td>
                    <td style={styles.td}>-</td>
                    <td style={styles.td}>{costSheet.gst.toLocaleString()}</td>
                  </tr>
                  <tr style={styles.totalRow}>
                    <td style={styles.td}><strong>Total Amount</strong></td>
                    <td style={styles.td}></td>
                    <td style={styles.td}><strong>₹ {parseFloat(costSheet.totalBeforeDiscount).toLocaleString()}</strong></td>
                  </tr>
                </tbody>
              </table>

              <div style={styles.discountSection}>
                <label style={styles.discountLabel}>Discount (%):</label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  style={styles.discountInput}
                  min="0"
                  max="100"
                />
                <span style={styles.discountedAmount}>
                  Final Amount: <strong>₹ {calculateTotal().toLocaleString()}</strong>
                </span>
              </div>

              <div style={styles.brochureNote}>
                📄 <strong>Brochure Note:</strong> Prices are subject to change without prior notice. This cost sheet is valid for 30 days from the date of generation.
              </div>
            </div>
          ) : (
            /* Multiple Units Cost Sheet */
            <div style={styles.infoCard}>
              <h2 style={styles.cardTitle}>Multiple Units Cost Sheet</h2>
              <p style={styles.multipleUnitInfo}>Select multiple units to calculate combined cost</p>

              <div style={styles.unitGrid}>
                {multiUnitData.map((unit, index) => (
                  <div
                    key={index}
                    style={unit.selected ? styles.selectedUnitCard : styles.unitCard}
                    onClick={() => handleUnitSelect(index)}
                  >
                    <div style={styles.unitHeader}>
                      <span style={styles.unitNumber}>{unit.unit}</span>
                      {unit.selected && <span style={styles.selectedCheck}>✓</span>}
                    </div>
                    <div style={styles.unitDetails}>
                      <span>Area: {unit.area} sqft</span>
                      <span>Rate: ₹{unit.rate}/sqft</span>
                      <span style={styles.unitTotal}>₹{(unit.area * unit.rate).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.discountSection}>
                <label style={styles.discountLabel}>Discount (%):</label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  style={styles.discountInput}
                  min="0"
                  max="100"
                />
              </div>

              {selectedUnits.length > 0 && (
                <div style={styles.multiTotalSection}>
                  <div style={styles.multiTotalRow}>
                    <span>Selected Units:</span>
                    <span>{selectedUnits.length}</span>
                  </div>
                  <div style={styles.multiTotalRow}>
                    <span>Total Area:</span>
                    <span>{selectedUnits.reduce((sum, u) => sum + u.area, 0)} sqft</span>
                  </div>
                  <div style={styles.multiTotalRow}>
                    <span>Sub Total:</span>
                    <span>₹ {calculateMultiUnitTotal().toLocaleString()}</span>
                  </div>
                  <div style={styles.multiTotalRow}>
                    <span>Discount ({discount}%):</span>
                    <span>- ₹ {(calculateMultiUnitTotal() * (discount / 100)).toLocaleString()}</span>
                  </div>
                  <div style={{ ...styles.multiTotalRow, ...styles.grandTotal }}>
                    <span>Grand Total:</span>
                    <span>₹ {calculateMultiUnitTotalWithDiscount().toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div style={styles.brochureNote}>
                📄 <strong>Brochure Note:</strong> Combined booking of multiple units eligible for additional benefits. Contact sales team for more details.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Brochure Tab */}
      {activeTab === 'brochure' && (
        <div style={styles.contentSection}>
          <div style={styles.infoCard}>
            <h2 style={styles.cardTitle}>Project Brochure Information</h2>
            
            <div style={styles.brochureSection}>
              <h3 style={styles.brochureTitle}>📍 Location & Directions</h3>
              <div style={styles.brochureContent}>
                <p><strong>Address:</strong> {reraData.projectAddress}</p>
                <p><strong>Coordinates:</strong> {reraData.latitude}, {reraData.longitude}</p>
                <p><strong>Google Maps:</strong> <a href={reraData.googleMapsLink} style={styles.link} target="_blank" rel="noreferrer">View Location</a></p>
                <div style={styles.directionsBox}>
                  <h4>How to Reach:</h4>
                  <p>{reraData.directions}</p>
                </div>
                <div style={styles.landmarksBox}>
                  <h4>Nearby Landmarks:</h4>
                  <p>{reraData.nearbyLandmarks}</p>
                </div>
              </div>
            </div>

            <div style={styles.brochureSection}>
              <h3 style={styles.brochureTitle}>🏗️ Project Highlights</h3>
              <div style={styles.brochureContent}>
                <ul style={styles.highlightsList}>
                  <li>Premium {reraData.projectType} Project</li>
                  <li>Total Area: {reraData.totalArea}</li>
                  <li>Total Units: {reraData.totalUnits}</li>
                  <li>Expected Completion: {reraData.completionDate}</li>
                  <li>All Government Permissions Cleared</li>
                  <li>World-class Amenities</li>
                  <li>Green Building Certified</li>
                </ul>
              </div>
            </div>

            <div style={styles.brochureSection}>
              <h3 style={styles.brochureTitle}>📋 Key Terms</h3>
              <div style={styles.brochureContent}>
                <ul style={styles.termsListMini}>
                  {reraData.terms.slice(0, 5).map((term, index) => (
                    <li key={index}>{term}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={styles.brochureActions}>
              <button style={styles.downloadButton}>📥 Download Brochure PDF</button>
              <button style={styles.shareButton}>📤 Share via Email</button>
              <button style={styles.whatsappButton}>📱 Share on WhatsApp</button>
            </div>
          </div>
        </div>
      )}
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
  tabContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  tab: {
    padding: '12px 25px',
    backgroundColor: '#f8f9fa',
    border: '2px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  activeTab: {
    padding: '12px 25px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: '2px solid #3498db',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  contentSection: {
    marginBottom: '30px',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '1.4rem',
    color: '#2c3e50',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '2px solid #3498db',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px',
  },
  infoLabel: {
    fontSize: '0.85rem',
    color: '#7f8c8d',
    marginBottom: '5px',
  },
  infoValue: {
    fontSize: '1rem',
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  infoValueHighlight: {
    fontSize: '1.1rem',
    color: '#27ae60',
    fontWeight: 'bold',
  },
  link: {
    color: '#3498db',
    textDecoration: 'none',
  },
  subTitle: {
    fontSize: '1rem',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  directionsBox: {
    backgroundColor: '#e8f4fd',
    padding: '15px',
    borderRadius: '8px',
    marginTop: '15px',
    borderLeft: '4px solid #3498db',
  },
  directionsText: {
    color: '#2c3e50',
    margin: 0,
  },
  landmarksBox: {
    backgroundColor: '#f0fff4',
    padding: '15px',
    borderRadius: '8px',
    marginTop: '10px',
    borderLeft: '4px solid #27ae60',
  },
  landmarksText: {
    color: '#2c3e50',
    margin: 0,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px',
  },
  th: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '12px',
    textAlign: 'left',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #eee',
  },
  statusActive: {
    backgroundColor: '#27ae60',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '3px',
    fontSize: '0.85rem',
  },
  statusPending: {
    backgroundColor: '#f39c12',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '3px',
    fontSize: '0.85rem',
  },
  termsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  termItem: {
    display: 'flex',
    gap: '10px',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px',
  },
  termNumber: {
    fontWeight: 'bold',
    color: '#3498db',
  },
  termText: {
    color: '#2c3e50',
  },
  costSheetToggle: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  toggleButton: {
    padding: '12px 25px',
    backgroundColor: '#f8f9fa',
    border: '2px solid #ddd',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  activeToggle: {
    padding: '12px 25px',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: '2px solid #27ae60',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  costSheetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  unitInfo: {
    display: 'flex',
    gap: '15px',
    color: '#7f8c8d',
  },
  totalRow: {
    backgroundColor: '#e8f4fd',
  },
  discountSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    flexWrap: 'wrap',
  },
  discountLabel: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  discountInput: {
    width: '100px',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
  },
  discountedAmount: {
    marginLeft: 'auto',
    fontSize: '1.2rem',
    color: '#27ae60',
  },
  brochureNote: {
    backgroundColor: '#fff3cd',
    padding: '15px',
    borderRadius: '5px',
    marginTop: '20px',
    color: '#856404',
    fontSize: '0.9rem',
  },
  multipleUnitInfo: {
    color: '#7f8c8d',
    marginBottom: '20px',
  },
  unitGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '15px',
    marginBottom: '20px',
  },
  unitCard: {
    border: '2px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  selectedUnitCard: {
    border: '2px solid #27ae60',
    borderRadius: '8px',
    padding: '15px',
    cursor: 'pointer',
    backgroundColor: '#f0fff4',
  },
  unitHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  unitNumber: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  selectedCheck: {
    backgroundColor: '#27ae60',
    color: '#fff',
    width: '25px',
    height: '25px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    color: '#7f8c8d',
    fontSize: '0.9rem',
  },
  unitTotal: {
    fontWeight: 'bold',
    color: '#27ae60',
    marginTop: '5px',
  },
  multiTotalSection: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    marginTop: '20px',
  },
  multiTotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #ddd',
  },
  grandTotal: {
    borderTop: '2px solid #27ae60',
    marginTop: '10px',
    paddingTop: '15px',
    fontSize: '1.2rem',
    color: '#27ae60',
  },
  brochureSection: {
    marginBottom: '30px',
  },
  brochureTitle: {
    fontSize: '1.2rem',
    color: '#2c3e50',
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  brochureContent: {
    color: '#2c3e50',
  },
  highlightsList: {
    marginLeft: '20px',
  },
  termsListMini: {
    marginLeft: '20px',
  },
  brochureActions: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
    marginTop: '20px',
  },
  downloadButton: {
    padding: '12px 25px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  shareButton: {
    padding: '12px 25px',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  whatsappButton: {
    padding: '12px 25px',
    backgroundColor: '#25D366',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};

export default ReraDetails;
