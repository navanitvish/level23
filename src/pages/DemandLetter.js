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
      
      // Calculate GST and Total
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
      
      // Calculate installment amount
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

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Demand Letter</h1>
      <p style={styles.description}>Generate and manage demand letters with flexible payment schedules and GST calculation.</p>

      <div style={styles.formSection}>
        <h2 style={styles.sectionTitle}>Create New Demand Letter</h2>
        
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Letter Type</label>
            <select
              name="letterType"
              value={formData.letterType}
              onChange={handleInputChange}
              style={styles.select}
            >
              <option value="payment">Payment Demand</option>
              <option value="reminder">Payment Reminder</option>
              <option value="legal">Legal Notice</option>
              <option value="final">Final Demand</option>
              <option value="installment">Installment Demand</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Recipient Name</label>
            <input
              type="text"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter recipient name"
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Recipient Email</label>
          <input
            type="email"
            name="recipientEmail"
            value={formData.recipientEmail}
            onChange={handleInputChange}
            style={styles.input}
            placeholder="Enter email for reminders"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Recipient Address</label>
          <textarea
            name="recipientAddress"
            value={formData.recipientAddress}
            onChange={handleInputChange}
            style={styles.textarea}
            placeholder="Enter full address"
            rows="2"
          />
        </div>

        {/* Payment Schedule Section */}
        <div style={styles.paymentSection}>
          <h3 style={styles.subSectionTitle}>Payment Schedule</h3>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Payment Type</label>
            <div style={styles.radioGroup}>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="paymentSchedule"
                  value="one-time"
                  checked={formData.paymentSchedule === 'one-time'}
                  onChange={handleInputChange}
                />
                One-time Payment
              </label>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="paymentSchedule"
                  value="installments"
                  checked={formData.paymentSchedule === 'installments'}
                  onChange={handleInputChange}
                />
                Installments
              </label>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="paymentSchedule"
                  value="custom"
                  checked={formData.paymentSchedule === 'custom'}
                  onChange={handleInputChange}
                />
                Custom Schedule
              </label>
            </div>
          </div>

          {formData.paymentSchedule === 'installments' && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Number of Installments</label>
              <select
                name="installments"
                value={formData.installments}
                onChange={handleInputChange}
                style={styles.select}
              >
                <option value="2">2 Installments</option>
                <option value="3">3 Installments</option>
                <option value="4">4 Installments</option>
                <option value="5">5 Installments</option>
                <option value="6">6 Installments</option>
                <option value="12">12 Installments</option>
              </select>
              <p style={styles.helpText}>
                Each installment: <strong>₹ {parseFloat(formData.installmentAmount).toLocaleString()}</strong>
              </p>
            </div>
          )}

          {formData.paymentSchedule === 'custom' && (
            <div style={styles.customSchedule}>
              <div style={styles.scheduleItem}>
                <span>Installment 1:</span>
                <input type="date" style={styles.input} />
              </div>
              <div style={styles.scheduleItem}>
                <span>Installment 2:</span>
                <input type="date" style={styles.input} />
              </div>
              <div style={styles.scheduleItem}>
                <span>Installment 3:</span>
                <input type="date" style={styles.input} />
              </div>
            </div>
          )}
        </div>

        {/* GST Calculation Section */}
        <div style={styles.paymentSection}>
          <h3 style={styles.subSectionTitle}>Amount Details</h3>
          
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Base Amount (₹)</label>
              <input
                type="number"
                name="baseAmount"
                value={formData.baseAmount}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter base amount"
                onBlur={calculateTotals}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="includeGst"
                  checked={formData.includeGst}
                  onChange={handleInputChange}
                />
                Include GST
              </label>
            </div>
          </div>

          {formData.includeGst && (
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>GST Rate (%)</label>
                <select
                  name="gstRate"
                  value={formData.gstRate}
                  onChange={handleInputChange}
                  style={styles.select}
                  onBlur={calculateTotals}
                >
                  <option value="5">5% (GST)</option>
                  <option value="12">12% (GST)</option>
                  <option value="18">18% (GST)</option>
                  <option value="28">28% (GST)</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>GST Amount (₹)</label>
                <input
                  type="text"
                  name="gstAmount"
                  value={formData.gstAmount}
                  readOnly
                  style={{ ...styles.input, backgroundColor: '#f0f0f0' }}
                />
              </div>
            </div>
          )}

          <div style={styles.totalSection}>
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Base Amount:</span>
              <span style={styles.totalValue}>₹ {parseFloat(formData.baseAmount || 0).toLocaleString()}</span>
            </div>
            {formData.includeGst && (
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>GST ({formData.gstRate}%):</span>
                <span style={styles.totalValue}>₹ {parseFloat(formData.gstAmount || 0).toLocaleString()}</span>
              </div>
            )}
            <div style={{ ...styles.totalRow, ...styles.grandTotal }}>
              <span style={styles.totalLabel}>Total Amount:</span>
              <span style={styles.totalValueHighlight}>₹ {parseFloat(formData.totalAmount || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Letter subject"
            />
          </div>
        </div>

        {/* Email Reminder Section */}
        <div style={styles.paymentSection}>
          <h3 style={styles.subSectionTitle}>Email Reminders</h3>
          
          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="sendEmailReminder"
                checked={formData.sendEmailReminder}
                onChange={handleInputChange}
              />
              Send Email Reminders for Due Payment
            </label>
          </div>

          {formData.sendEmailReminder && (
            <div style={styles.reminderOptions}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Reminder Frequency</label>
                  <select
                    name="reminderFrequency"
                    value={formData.reminderFrequency}
                    onChange={handleInputChange}
                    style={styles.select}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="bi-weekly">Bi-Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Remind Before Due Date (Days)</label>
                  <select
                    name="reminderBeforeDays"
                    value={formData.reminderBeforeDays}
                    onChange={handleInputChange}
                    style={styles.select}
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

              <div style={styles.reminderPreview}>
                <h4 style={styles.reminderPreviewTitle}>Reminder Schedule Preview</h4>
                <div style={styles.reminderItem}>
                  <span style={styles.reminderIcon}>📧</span>
                  <span>First reminder: {formData.reminderBeforeDays} days before due date</span>
                </div>
                <div style={styles.reminderItem}>
                  <span style={styles.reminderIcon}>🔔</span>
                  <span>Frequency: Every {formData.reminderFrequency === 'bi-weekly' ? '2 weeks' : formData.reminderFrequency}</span>
                </div>
                <div style={styles.reminderItem}>
                  <span style={styles.reminderIcon}>⚠️</span>
                  <span>Final notice: On due date if unpaid</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Message / Additional Details</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            style={styles.textarea}
            placeholder="Enter detailed message or custom terms..."
            rows="4"
          />
        </div>

        <div style={styles.buttonGroup}>
          <button style={styles.generateButton}>Generate Letter</button>
          <button style={styles.previewButton}>Preview</button>
          <button style={styles.downloadButton}>Download PDF</button>
          {formData.sendEmailReminder && (
            <button style={styles.emailButton}>📧 Send with Reminders</button>
          )}
        </div>
      </div>

      <div style={styles.recentSection}>
        <h2 style={styles.sectionTitle}>Recent Demand Letters</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Recipient</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Schedule</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.td}>2026-01-30</td>
              <td style={styles.td}>ABC Properties Ltd.</td>
              <td style={styles.td}>Payment Demand</td>
              <td style={styles.td}>
                <div style={styles.amountBreakup}>
                  <span>₹5,00,000</span>
                  <small>+ ₹90,000 GST</small>
                </div>
              </td>
              <td style={styles.td}>One-time</td>
              <td style={styles.td}><span style={styles.statusSent}>Sent</span></td>
              <td style={styles.td}>
                <div style={styles.actionButtons}>
                  <button style={styles.actionButton}>View</button>
                  <button style={styles.resendButton}>Resend</button>
                </div>
              </td>
            </tr>
            <tr>
              <td style={styles.td}>2026-01-28</td>
              <td style={styles.td}>XYZ Developers</td>
              <td style={styles.td}>Installment</td>
              <td style={styles.td}>
                <div style={styles.amountBreakup}>
                  <span>₹2,50,000</span>
                  <small>× 3 inst.</small>
                </div>
              </td>
              <td style={styles.td}>3 Installments</td>
              <td style={styles.td}><span style={styles.statusPending}>Pending</span></td>
              <td style={styles.td}>
                <div style={styles.actionButtons}>
                  <button style={styles.actionButton}>View</button>
                  <button style={styles.resendButton}>Send Reminder</button>
                </div>
              </td>
            </tr>
            <tr>
              <td style={styles.td}>2026-01-25</td>
              <td style={styles.td}>PQR Infrastructure</td>
              <td style={styles.td}>Final Demand</td>
              <td style={styles.td}>₹10,00,000</td>
              <td style={styles.td}>One-time</td>
              <td style={styles.td}><span style={styles.statusSent}>Sent</span></td>
              <td style={styles.td}>
                <div style={styles.actionButtons}>
                  <button style={styles.actionButton}>View</button>
                  <button style={styles.resendButton}>Resend</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={styles.templateSection}>
        <h2 style={styles.sectionTitle}>Letter Templates</h2>
        <div style={styles.templateGrid}>
          <div style={styles.templateCard}>
            <h3 style={styles.templateTitle}>Payment Demand</h3>
            <p style={styles.templateDesc}>Standard payment demand letter for overdue amounts with GST.</p>
            <button style={styles.useTemplateButton}>Use Template</button>
          </div>
          <div style={styles.templateCard}>
            <h3 style={styles.templateTitle}>Installment Agreement</h3>
            <p style={styles.templateDesc}>For payments with flexible installment schedules.</p>
            <button style={styles.useTemplateButton}>Use Template</button>
          </div>
          <div style={styles.templateCard}>
            <h3 style={styles.templateTitle}>Payment Reminder</h3>
            <p style={styles.templateDesc}>Friendly reminder with automated follow-up options.</p>
            <button style={styles.useTemplateButton}>Use Template</button>
          </div>
          <div style={styles.templateCard}>
            <h3 style={styles.templateTitle}>Final Demand</h3>
            <p style={styles.templateDesc}>Final demand letter before taking legal action.</p>
            <button style={styles.useTemplateButton}>Use Template</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
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
  formSection: {
    backgroundColor: '#f8f9fa',
    padding: '25px',
    borderRadius: '10px',
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '1.4rem',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  subSectionTitle: {
    fontSize: '1.1rem',
    color: '#2c3e50',
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '1px solid #ddd',
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
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 'bold',
    color: '#2c3e50',
    cursor: 'pointer',
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
  radioGroup: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  paymentSection: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
    border: '1px solid #eee',
  },
  customSchedule: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  scheduleItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  helpText: {
    fontSize: '0.9rem',
    color: '#7f8c8d',
    marginTop: '5px',
  },
  totalSection: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    marginTop: '15px',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '5px 0',
  },
  totalLabel: {
    color: '#7f8c8d',
  },
  totalValue: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  grandTotal: {
    borderTop: '2px solid #3498db',
    paddingTop: '10px',
    marginTop: '10px',
  },
  totalValueHighlight: {
    fontWeight: 'bold',
    color: '#27ae60',
    fontSize: '1.2rem',
  },
  reminderOptions: {
    marginTop: '15px',
  },
  reminderPreview: {
    backgroundColor: '#e8f4fd',
    padding: '15px',
    borderRadius: '8px',
    marginTop: '15px',
  },
  reminderPreviewTitle: {
    fontSize: '1rem',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  reminderItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '5px 0',
    color: '#7f8c8d',
  },
  reminderIcon: {
    fontSize: '1.2rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
    flexWrap: 'wrap',
  },
  generateButton: {
    padding: '12px 25px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  previewButton: {
    padding: '12px 25px',
    backgroundColor: '#95a5a6',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  downloadButton: {
    padding: '12px 25px',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  emailButton: {
    padding: '12px 25px',
    backgroundColor: '#9b59b6',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  recentSection: {
    marginBottom: '30px',
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
  },
  td: {
    padding: '15px',
    borderBottom: '1px solid #eee',
  },
  amountBreakup: {
    display: 'flex',
    flexDirection: 'column',
  },
  statusSent: {
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
  actionButton: {
    padding: '8px 15px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  resendButton: {
    padding: '8px 15px',
    backgroundColor: '#9b59b6',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  templateSection: {
    marginBottom: '30px',
  },
  templateGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  templateCard: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #eee',
  },
  templateTitle: {
    fontSize: '1.2rem',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  templateDesc: {
    color: '#7f8c8d',
    marginBottom: '15px',
  },
  useTemplateButton: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
  },
};

export default DemandLetter;
