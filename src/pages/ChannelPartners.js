import React, { useState } from 'react';

const ChannelPartners = () => {
  const [showModal, setShowModal] = useState(false);
  const [showMarketingModal, setShowMarketingModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedCreatives, setSelectedCreatives] = useState([]);
  const [creativePreview, setCreativePreview] = useState([]);
  const [qrPartner, setQrPartner] = useState(null);
  const [qrLink, setQrLink] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sendingStatus, setSendingStatus] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    type: 'broker',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    commission: '',
    notes: '',
  });
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataWithLogo = { ...formData, logo };
    console.log('Partner data:', formDataWithLogo);
    setShowModal(false);
    setFormData({
      name: '',
      company: '',
      type: 'broker',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      commission: '',
      notes: '',
    });
    setLogo(null);
    setLogoPreview(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setLogo(null);
    setLogoPreview(null);
  };

  // QR Code generation using simple canvas
  const generateQRCode = (text) => {
    // Create a simple QR-like pattern representation
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 200;
    canvas.width = size;
    canvas.height = size;
    
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // Generate pseudo-random QR pattern based on text
    const modules = 25;
    const moduleSize = size / modules;
    
    // Create hash from text
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash = hash & hash;
    }
    
    // Draw QR-like pattern
    ctx.fillStyle = '#000000';
    
    // Corner squares
    const drawCorner = (x, y) => {
      ctx.fillRect(x * moduleSize, y * moduleSize, 7 * moduleSize, 7 * moduleSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect((x + 1) * moduleSize, (y + 1) * moduleSize, 5 * moduleSize, 5 * moduleSize);
      ctx.fillStyle = '#000000';
      ctx.fillRect((x + 2) * moduleSize, (y + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize);
    };
    
    drawCorner(0, 0);
    drawCorner(modules - 7, 0);
    drawCorner(0, modules - 7);
    
    // Data modules
    ctx.fillStyle = '#000000';
    for (let i = 0; i < modules; i++) {
      for (let j = 0; j < modules; j++) {
        // Skip corner areas
        if ((i < 8 && j < 8) || (i < 8 && j >= modules - 8) || (i >= modules - 8 && j < 8)) {
          continue;
        }
        
        // Pseudo-random pattern based on hash
        const index = (i * modules + j) % 32;
        if ((hash >> index) & 1) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
        }
      }
    }
    
    return canvas.toDataURL('image/png');
  };

  const handleGenerateQR = (partner) => {
    const baseUrl = window.location.origin;
    const registrationLink = `${baseUrl}/register?partner=${encodeURIComponent(partner.company)}&ref=${encodeURIComponent(partner.name)}`;
    setQrPartner(partner);
    setQrLink(registrationLink);
    setShowQRModal(true);
  };

  const handleCreativeChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newPreviews = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              file,
              preview: reader.result,
              name: file.name
            });
          };
          reader.readAsDataURL(file);
        });
      });
      
      Promise.all(newPreviews).then(previews => {
        setCreativePreview([...creativePreview, ...previews]);
        setSelectedCreatives([...selectedCreatives, ...files]);
      });
    }
  };

  const handleRemoveCreative = (index) => {
    const newPreviews = creativePreview.filter((_, i) => i !== index);
    const newFiles = selectedCreatives.filter((_, i) => i !== index);
    setCreativePreview(newPreviews);
    setSelectedCreatives(newFiles);
  };

  const handleSendCreatives = () => {
    setSendingStatus('sending');
    
    // Simulate sending process
    setTimeout(() => {
      setSendingStatus('success');
      setTimeout(() => {
        setShowMarketingModal(false);
        setSelectedCreatives([]);
        setCreativePreview([]);
        setMessageText('');
        setSendingStatus('');
      }, 2000);
    }, 3000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Channel Partners</h1>
      <p style={styles.description}>Manage your channel partners, agents, and collaborators.</p>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>156</h3>
          <p style={styles.statLabel}>Total Partners</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>45</h3>
          <p style={styles.statLabel}>Active Partners</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>₹2.5Cr</h3>
          <p style={styles.statLabel}>Total Revenue</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>12</h3>
          <p style={styles.statLabel}>New This Month</p>
        </div>
      </div>

      <div style={styles.actionBar}>
        <div style={styles.searchBox}>
          <input type="text" style={styles.searchInput} placeholder="Search partners..." />
        </div>
        <div style={styles.filterGroup}>
          <select style={styles.filterSelect}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          <select style={styles.filterSelect}>
            <option value="">All Types</option>
            <option value="broker">Broker</option>
            <option value="agent">Agent</option>
            <option value="builder">Builder</option>
            <option value="consultant">Consultant</option>
          </select>
          <button 
            style={{...styles.addButton, backgroundColor: '#9b59b6'}}
            onClick={() => setShowMarketingModal(true)}
          >
            📷 Send Creative
          </button>
          <button style={styles.addButton} onClick={() => setShowModal(true)}>
            + Add Partner
          </button>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Partner Name</th>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Contact</th>
              <th style={styles.th}>Projects</th>
              <th style={styles.th}>Revenue</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.td}>
                <div style={styles.partnerInfo}>
                  <div style={styles.avatar}>RK</div>
                  <span>Rahul Kumar</span>
                </div>
              </td>
              <td style={styles.td}>Kumar Real Estate</td>
              <td style={styles.td}><span style={styles.typeBadge}>Broker</span></td>
              <td style={styles.td}>
                <div style={styles.contactInfo}>
                  <span>+91 98765 43210</span>
                  <span style={styles.email}>rahul@kumar.com</span>
                </div>
              </td>
              <td style={styles.td}>8</td>
              <td style={styles.td}>₹45,00,000</td>
              <td style={styles.td}><span style={styles.statusActive}>Active</span></td>
              <td style={styles.td}>
                <div style={styles.actionButtons}>
                  <button style={styles.viewBtn}>View</button>
                  <button style={styles.editBtn}>Edit</button>
                  <button 
                    style={{...styles.editBtn, backgroundColor: '#9b59b6', minWidth: '50px'}} 
                    onClick={() => handleGenerateQR({ name: 'Rahul Kumar', company: 'Kumar Real Estate' })}
                    title="Generate QR Code"
                  >
                    QR
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td style={styles.td}>
                <div style={styles.partnerInfo}>
                  <div style={styles.avatar}>PM</div>
                  <span>Priya Mehta</span>
                </div>
              </td>
              <td style={styles.td}>Mehta Properties</td>
              <td style={styles.td}><span style={styles.typeBadgeAgent}>Agent</span></td>
              <td style={styles.td}>
                <div style={styles.contactInfo}>
                  <span>+91 87654 32109</span>
                  <span style={styles.email}>priya@mehta.com</span>
                </div>
              </td>
              <td style={styles.td}>5</td>
              <td style={styles.td}>₹32,00,000</td>
              <td style={styles.td}><span style={styles.statusActive}>Active</span></td>
              <td style={styles.td}>
                <div style={styles.actionButtons}>
                  <button style={styles.viewBtn}>View</button>
                  <button style={styles.editBtn}>Edit</button>
                  <button 
                    style={{...styles.editBtn, backgroundColor: '#9b59b6', minWidth: '50px'}} 
                    onClick={() => handleGenerateQR({ name: 'Priya Mehta', company: 'Mehta Properties' })}
                    title="Generate QR Code"
                  >
                    QR
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td style={styles.td}>
                <div style={styles.partnerInfo}>
                  <div style={styles.avatar}>AS</div>
                  <span>Amit Sharma</span>
                </div>
              </td>
              <td style={styles.td}>Sharma Builders</td>
              <td style={styles.td}><span style={styles.typeBadgeBuilder}>Builder</span></td>
              <td style={styles.td}>
                <div style={styles.contactInfo}>
                  <span>+91 76543 21098</span>
                  <span style={styles.email}>amit@sharma.com</span>
                </div>
              </td>
              <td style={styles.td}>12</td>
              <td style={styles.td}>₹78,00,000</td>
              <td style={styles.td}><span style={styles.statusActive}>Active</span></td>
              <td style={styles.td}>
                <div style={styles.actionButtons}>
                  <button style={styles.viewBtn}>View</button>
                  <button style={styles.editBtn}>Edit</button>
                  <button 
                    style={{...styles.editBtn, backgroundColor: '#9b59b6', minWidth: '50px'}} 
                    onClick={() => handleGenerateQR({ name: 'Amit Sharma', company: 'Sharma Builders' })}
                    title="Generate QR Code"
                  >
                    QR
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td style={styles.td}>
                <div style={styles.partnerInfo}>
                  <div style={styles.avatar}>SJ</div>
                  <span>Sneha Jain</span>
                </div>
              </td>
              <td style={styles.td}>Jain Consultants</td>
              <td style={styles.td}><span style={styles.typeBadgeConsultant}>Consultant</span></td>
              <td style={styles.td}>
                <div style={styles.contactInfo}>
                  <span>+91 65432 10987</span>
                  <span style={styles.email}>sneha@jain.com</span>
                </div>
              </td>
              <td style={styles.td}>3</td>
              <td style={styles.td}>₹18,00,000</td>
              <td style={styles.td}><span style={styles.statusPending}>Pending</span></td>
              <td style={styles.td}>
                <div style={styles.actionButtons}>
                  <button style={styles.viewBtn}>View</button>
                  <button style={styles.editBtn}>Edit</button>
                  <button 
                    style={{...styles.editBtn, backgroundColor: '#9b59b6', minWidth: '50px'}} 
                    onClick={() => handleGenerateQR({ name: 'Sneha Jain', company: 'Jain Consultants' })}
                    title="Generate QR Code"
                  >
                    QR
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={styles.pagination}>
        <button style={styles.pageButton}>Previous</button>
        <span style={styles.pageInfo}>Page 1 of 8</span>
        <button style={styles.pageButton}>Next</button>
      </div>

      <div style={styles.sectionsGrid}>
        <div style={styles.sectionCard}>
          <h2 style={styles.sectionTitle}>Top Performing Partners</h2>
          <div style={styles.partnerList}>
            <div style={styles.topPartner}>
              <span style={styles.rank}>1</span>
              <div style={styles.partnerDetails}>
                <strong>Sharma Builders</strong>
                <span>₹78,00,000 Revenue</span>
              </div>
            </div>
            <div style={styles.topPartner}>
              <span style={styles.rank}>2</span>
              <div style={styles.partnerDetails}>
                <strong>Kumar Real Estate</strong>
                <span>₹45,00,000 Revenue</span>
              </div>
            </div>
            <div style={styles.topPartner}>
              <span style={styles.rank}>3</span>
              <div style={styles.partnerDetails}>
                <strong>Mehta Properties</strong>
                <span>₹32,00,000 Revenue</span>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.sectionCard}>
          <h2 style={styles.sectionTitle}>Recent Activities</h2>
          <div style={styles.activityList}>
            <div style={styles.activityItem}>
              <div style={styles.activityDot}></div>
              <div style={styles.activityContent}>
                <p>New partner <strong>Raj Patel</strong> registered</p>
                <span style={styles.activityTime}>2 hours ago</span>
              </div>
            </div>
            <div style={styles.activityItem}>
              <div style={styles.activityDot}></div>
              <div style={styles.activityContent}>
                <p><strong>Amit Sharma</strong> closed deal worth ₹12L</p>
                <span style={styles.activityTime}>5 hours ago</span>
              </div>
            </div>
            <div style={styles.activityItem}>
              <div style={styles.activityDot}></div>
              <div style={styles.activityContent}>
                <p>Commission paid to <strong>Priya Mehta</strong></p>
                <span style={styles.activityTime}>1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Partner Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add New Partner</h2>
              <button style={styles.closeButton} onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Logo Upload Section */}
              <div style={styles.logoSection}>
                <label style={styles.label}>Partner Logo</label>
                <div style={styles.logoUploadArea}>
                  {logoPreview ? (
                    <div style={styles.logoPreviewContainer}>
                      <img src={logoPreview} alt="Logo Preview" style={styles.logoPreview} />
                      <button
                        type="button"
                        style={styles.removeLogoButton}
                        onClick={handleRemoveLogo}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div style={styles.logoPlaceholder}>
                      <svg style={styles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p style={styles.uploadText}>Upload Logo</p>
                      <p style={styles.uploadSubtext}>PNG, JPG up to 5MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        style={styles.fileInput}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Partner Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Company Name *</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Partner Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    style={styles.select}
                  >
                    <option value="broker">Broker</option>
                    <option value="agent">Agent</option>
                    <option value="builder">Builder</option>
                    <option value="consultant">Consultant</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <div style={styles.formRow}>
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
                <div style={styles.formGroup}>
                  <label style={styles.label}>Commission Rate (%)</label>
                  <input
                    type="number"
                    name="commission"
                    value={formData.commission}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="e.g., 2.5"
                  />
                </div>
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
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  style={styles.textarea}
                  rows="3"
                  placeholder="Additional notes about the partner..."
                />
              </div>

              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelButton} onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitButton}>
                  Add Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Marketing Creative Modal */}
      {showMarketingModal && (
        <div style={styles.modalOverlay} onClick={() => setShowMarketingModal(false)}>
          <div style={{...styles.modalContent, maxWidth: '700px'}} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>📷 Send Marketing Creative to All CPs</h2>
              <button style={styles.closeButton} onClick={() => setShowMarketingModal(false)}>
                ×
              </button>
            </div>
            <div style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Upload Marketing Images</label>
                <div 
                  style={styles.logoUploadArea}
                  onClick={() => document.getElementById('creativeInput').click()}
                >
                  <svg style={styles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p style={styles.uploadText}>Click to Upload Marketing Creatives</p>
                  <p style={styles.uploadSubtext}>PNG, JPG, JPEG up to 10MB each</p>
                  <input
                    id="creativeInput"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleCreativeChange}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              {/* Creative Previews */}
              {creativePreview.length > 0 && (
                <div style={styles.creativeGrid}>
                  {creativePreview.map((creative, index) => (
                    <div key={index} style={styles.creativeItem}>
                      <img 
                        src={creative.preview} 
                        alt={creative.name}
                        style={styles.creativePreview}
                      />
                      <button
                        style={styles.removeCreativeButton}
                        onClick={() => handleRemoveCreative(index)}
                      >
                        ×
                      </button>
                      <span style={styles.creativeName}>{creative.name}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={styles.formGroup}>
                <label style={styles.label}>Message to Channel Partners</label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  style={styles.textarea}
                  rows="4"
                  placeholder="Enter your message to send along with the creatives..."
                />
              </div>

              <div style={styles.infoBox}>
                <strong>📋 Summary:</strong>
                <p style={{margin: '5px 0'}}>• {selectedCreatives.length} creative(s) selected</p>
                <p style={{margin: '5px 0'}}>• Will be sent to all {156} active channel partners</p>
                <p style={{margin: '5px 0'}}>• Recipients: {selectedCreatives.length} partners via Email & WhatsApp</p>
              </div>

              {sendingStatus === 'sending' && (
                <div style={styles.sendingStatus}>
                  <div style={styles.spinner}></div>
                  <span>Sending creatives to all channel partners...</span>
                </div>
              )}

              {sendingStatus === 'success' && (
                <div style={styles.successStatus}>
                  ✅ Successfully sent to all {156} channel partners!
                </div>
              )}

              <div style={styles.modalActions}>
                <button 
                  style={styles.cancelButton} 
                  onClick={() => setShowMarketingModal(false)}
                  disabled={sendingStatus === 'sending'}
                >
                  Cancel
                </button>
                <button 
                  style={{...styles.submitButton, backgroundColor: '#9b59b6'}}
                  onClick={handleSendCreatives}
                  disabled={selectedCreatives.length === 0 || sendingStatus === 'sending'}
                >
                  {sendingStatus === 'sending' ? 'Sending...' : '🚀 Send to All CPs'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && qrPartner && (
        <div style={styles.modalOverlay} onClick={() => setShowQRModal(false)}>
          <div style={{...styles.modalContent, maxWidth: '450px'}} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>📱 Registration QR Code</h2>
              <button style={styles.closeButton} onClick={() => setShowQRModal(false)}>
                ×
              </button>
            </div>
            <div style={{...styles.form, textAlign: 'center'}}>
              <div style={styles.qrPartnerInfo}>
                <h3 style={{marginBottom: '5px'}}>{qrPartner.company}</h3>
                <p style={{color: '#7f8c8d', fontSize: '0.9rem'}}>Ref: {qrPartner.name}</p>
              </div>

              <div style={styles.qrCodeContainer}>
                <img 
                  src={generateQRCode(qrLink)} 
                  alt="QR Code" 
                  style={styles.qrCodeImage}
                />
              </div>

              <div style={styles.linkContainer}>
                <label style={styles.label}>Registration Link:</label>
                <div style={styles.linkBox}>
                  <input
                    type="text"
                    value={qrLink}
                    readOnly
                    style={{...styles.input, backgroundColor: '#f8f9fa'}}
                  />
                  <button 
                    style={styles.copyButton}
                    onClick={() => copyToClipboard(qrLink)}
                  >
                    📋 Copy
                  </button>
                </div>
              </div>

              <div style={styles.qrActions}>
                <button 
                  style={{...styles.submitButton, backgroundColor: '#27ae60'}}
                  onClick={() => {
                    const link = document.createElement('a');
                    link.download = `${qrPartner.company.replace(/\s+/g, '_')}_QR.png`;
                    link.href = generateQRCode(qrLink);
                    link.click();
                  }}
                >
                  ⬇️ Download QR
                </button>
                <button 
                  style={{...styles.submitButton, backgroundColor: '#3498db'}}
                  onClick={() => copyToClipboard(qrLink)}
                >
                  📤 Share Link
                </button>
              </div>

              <p style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '15px'}}>
                Scan QR code or share link with the channel partner for registration
              </p>
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
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    border: '1px solid #eee',
  },
  statNumber: {
    fontSize: '2rem',
    color: '#3498db',
    marginBottom: '5px',
  },
  statLabel: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
  },
  actionBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '15px',
  },
  searchBox: {
    flex: '1',
    minWidth: '250px',
  },
  searchInput: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
  },
  filterGroup: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  filterSelect: {
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    backgroundColor: '#fff',
    minWidth: '150px',
  },
  addButton: {
    padding: '12px 25px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  tableContainer: {
    overflowX: 'auto',
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  th: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '15px',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  td: {
    padding: '15px',
    borderBottom: '1px solid #eee',
  },
  partnerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#3498db',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  email: {
    color: '#7f8c8d',
    fontSize: '0.85rem',
  },
  typeBadge: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '3px',
    fontSize: '0.85rem',
  },
  typeBadgeAgent: {
    backgroundColor: '#9b59b6',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '3px',
    fontSize: '0.85rem',
  },
  typeBadgeBuilder: {
    backgroundColor: '#27ae60',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '3px',
    fontSize: '0.85rem',
  },
  typeBadgeConsultant: {
    backgroundColor: '#e67e22',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '3px',
    fontSize: '0.85rem',
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
  actionButtons: {
    display: 'flex',
    gap: '5px',
  },
  viewBtn: {
    padding: '8px 15px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  editBtn: {
    padding: '8px 15px',
    backgroundColor: '#95a5a6',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '15px',
    marginTop: '20px',
  },
  pageButton: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  pageInfo: {
    color: '#7f8c8d',
  },
  sectionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '30px',
  },
  sectionCard: {
    backgroundColor: '#f8f9fa',
    padding: '25px',
    borderRadius: '10px',
    border: '1px solid #eee',
  },
  sectionTitle: {
    fontSize: '1.2rem',
    color: '#2c3e50',
    marginBottom: '20px',
    borderBottom: '2px solid #3498db',
    paddingBottom: '10px',
  },
  partnerList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  topPartner: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '5px',
  },
  rank: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: '#3498db',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  partnerDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },
  activityDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#27ae60',
    marginTop: '5px',
  },
  activityContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  activityTime: {
    color: '#7f8c8d',
    fontSize: '0.85rem',
  },
  // Modal styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '650px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #eee',
  },
  modalTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '2rem',
    color: '#999',
    cursor: 'pointer',
    lineHeight: 1,
  },
  form: {
    padding: '20px',
  },
  formRow: {
    display: 'flex',
    gap: '20px',
    marginBottom: '15px',
  },
  formGroup: {
    flex: 1,
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#2c3e50',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
  },
  select: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    backgroundColor: '#fff',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    resize: 'vertical',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  },
  cancelButton: {
    padding: '12px 25px',
    backgroundColor: '#95a5a6',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '12px 25px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  // Logo upload styles
  logoSection: {
    marginBottom: '20px',
  },
  logoUploadArea: {
    border: '2px dashed #ddd',
    borderRadius: '10px',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    position: 'relative',
  },
  logoPlaceholder: {
    padding: '20px',
  },
  uploadIcon: {
    width: '48px',
    height: '48px',
    color: '#95a5a6',
    marginBottom: '10px',
  },
  uploadText: {
    fontSize: '1rem',
    color: '#2c3e50',
    marginBottom: '5px',
  },
  uploadSubtext: {
    fontSize: '0.85rem',
    color: '#7f8c8d',
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
  logoPreviewContainer: {
    position: 'relative',
    display: 'inline-block',
  },
  logoPreview: {
    width: '100px',
    height: '100px',
    objectFit: 'contain',
    borderRadius: '5px',
  },
  removeLogoButton: {
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    width: '25px',
    height: '25px',
    borderRadius: '50%',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    lineHeight: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Marketing Creative styles
  creativeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '15px',
    marginBottom: '20px',
  },
  creativeItem: {
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '2px solid #eee',
  },
  creativePreview: {
    width: '100%',
    height: '100px',
    objectFit: 'cover',
    display: 'block',
  },
  removeCreativeButton: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    lineHeight: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  creativeName: {
    display: 'block',
    fontSize: '0.75rem',
    color: '#7f8c8d',
    padding: '5px',
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  infoBox: {
    backgroundColor: '#e8f4fd',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    border: '1px solid #bee5eb',
  },
  sendingStatus: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '15px',
    backgroundColor: '#fff3cd',
    borderRadius: '8px',
    marginBottom: '15px',
  },
  successStatus: {
    padding: '15px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '8px',
    marginBottom: '15px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid #f3f3f3',
    borderTop: '2px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  // QR Code styles
  qrPartnerInfo: {
    marginBottom: '20px',
  },
  qrCodeContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  qrCodeImage: {
    width: '200px',
    height: '200px',
    border: '1px solid #ddd',
    borderRadius: '8px',
  },
  linkContainer: {
    marginBottom: '20px',
  },
  linkBox: {
    display: 'flex',
    gap: '10px',
    marginTop: '5px',
  },
  copyButton: {
    padding: '10px 15px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  qrActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '15px',
  },
};

export default ChannelPartners;
