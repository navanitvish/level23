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

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Real Estate Calculator</h1>
      <p style={styles.description}>Calculate EMI, stamp duty, and convert area units easily.</p>

      <div style={styles.tabs}>
        <button
          style={activeTab === 'emi' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('emi')}
        >
          EMI Calculator
        </button>
        <button
          style={activeTab === 'stamp' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('stamp')}
        >
          Stamp Duty Calculator
        </button>
        <button
          style={activeTab === 'area' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('area')}
        >
          Area Converter
        </button>
      </div>

      {/* EMI Calculator */}
      {activeTab === 'emi' && (
        <div style={styles.calculatorSection}>
          <h2 style={styles.sectionTitle}>Home Loan EMI Calculator</h2>
          
          <div style={styles.inputGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Loan Amount (₹)</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                style={styles.input}
              />
              <input
                type="range"
                min="100000"
                max="50000000"
                step="100000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                style={styles.range}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Interest Rate (% per annum)</label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                step="0.1"
                style={styles.input}
              />
              <input
                type="range"
                min="5"
                max="15"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                style={styles.range}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Loan Tenure (Years)</label>
              <input
                type="number"
                value={loanTenure}
                onChange={(e) => setLoanTenure(e.target.value)}
                style={styles.input}
              />
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={loanTenure}
                onChange={(e) => setLoanTenure(e.target.value)}
                style={styles.range}
              />
            </div>
          </div>

          <button style={styles.calculateButton} onClick={calculateEMI}>
            Calculate EMI
          </button>

          {emiResult && (
            <div style={styles.resultSection}>
              <h3 style={styles.resultTitle}>EMI Calculation Result</h3>
              <div style={styles.resultCard}>
                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>Monthly EMI</span>
                  <span style={styles.resultValueHighlight}>₹ {parseFloat(emiResult.emi).toLocaleString()}</span>
                </div>
                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>Total Interest Payable</span>
                  <span style={styles.resultValue}>₹ {parseFloat(emiResult.totalInterest).toLocaleString()}</span>
                </div>
                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>Total Amount Payable</span>
                  <span style={styles.resultValue}>₹ {parseFloat(emiResult.totalAmount).toLocaleString()}</span>
                </div>
                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>Principal Amount</span>
                  <span style={styles.resultValue}>₹ {parseFloat(emiResult.principal).toLocaleString()}</span>
                </div>
              </div>
              
              <div style={styles.chartPlaceholder}>
                <div style={styles.chartBar}>
                  <div style={{ ...styles.bar, width: '50%', backgroundColor: '#3498db' }}></div>
                </div>
                <div style={styles.chartLegend}>
                  <span><span style={{ ...styles.legendColor, backgroundColor: '#3498db' }}></span> Principal (50%)</span>
                  <span><span style={{ ...styles.legendColor, backgroundColor: '#e74c3c' }}></span> Interest (50%)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stamp Duty Calculator */}
      {activeTab === 'stamp' && (
        <div style={styles.calculatorSection}>
          <h2 style={styles.sectionTitle}>Stamp Duty & Registration Calculator</h2>
          
          <div style={styles.inputGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Property Value (₹)</label>
              <input
                type="number"
                value={propertyValue}
                onChange={(e) => setPropertyValue(e.target.value)}
                style={styles.input}
              />
              <input
                type="range"
                min="100000"
                max="50000000"
                step="100000"
                value={propertyValue}
                onChange={(e) => setPropertyValue(e.target.value)}
                style={styles.range}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>State</label>
              <select
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
                style={styles.select}
              >
                <option value="maharashtra">Maharashtra</option>
                <option value="delhi">Delhi</option>
                <option value="karnataka">Karnataka</option>
                <option value="gujarat">Gujarat</option>
                <option value="rajasthan">Rajasthan</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                style={styles.select}
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
          </div>

          <button style={styles.calculateButton} onClick={calculateStampDuty}>
            Calculate Stamp Duty
          </button>

          {stampDutyResult && (
            <div style={styles.resultSection}>
              <h3 style={styles.resultTitle}>Stamp Duty Calculation Result</h3>
              <div style={styles.resultCard}>
                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>Stamp Duty ({stampDutyResult.stampDutyRate}%)</span>
                  <span style={styles.resultValue}>₹ {parseFloat(stampDutyResult.stampDuty).toLocaleString()}</span>
                </div>
                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>Registration Fee (1%)</span>
                  <span style={styles.resultValue}>₹ {parseFloat(stampDutyResult.registrationFee).toLocaleString()}</span>
                </div>
                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>GST (5%)</span>
                  <span style={styles.resultValue}>₹ {parseFloat(stampDutyResult.gst).toLocaleString()}</span>
                </div>
                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>Total Charges</span>
                  <span style={styles.resultValueHighlight}>₹ {parseFloat(stampDutyResult.total).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Area Converter */}
      {activeTab === 'area' && (
        <div style={styles.calculatorSection}>
          <h2 style={styles.sectionTitle}>Area Unit Converter</h2>
          
          <div style={styles.converterBox}>
            <div style={styles.converterRow}>
              <div style={styles.converterGroup}>
                <label style={styles.label}>From</label>
                <input
                  type="number"
                  value={areaValue}
                  onChange={(e) => setAreaValue(e.target.value)}
                  style={styles.input}
                />
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  style={styles.select}
                >
                  <option value="sqft">Square Feet (sqft)</option>
                  <option value="sqm">Square Meters (sqm)</option>
                  <option value="sqyard">Square Yards (sqyd)</option>
                  <option value="acre">Acres</option>
                  <option value="hectare">Hectares</option>
                </select>
              </div>

              <div style={styles.converterGroup}>
                <label style={styles.label}>To</label>
                <input
                  type="text"
                  value={areaResult || ''}
                  readOnly
                  style={styles.input}
                />
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  style={styles.select}
                >
                  <option value="sqft">Square Feet (sqft)</option>
                  <option value="sqm">Square Meters (sqm)</option>
                  <option value="sqyard">Square Yards (sqyd)</option>
                  <option value="acre">Acres</option>
                  <option value="hectare">Hectares</option>
                </select>
              </div>
            </div>

            <button style={styles.calculateButton} onClick={convertArea}>
              Convert
            </button>
          </div>

          <div style={styles.conversionTable}>
            <h3 style={styles.tableTitle}>Quick Reference</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Unit</th>
                  <th style={styles.th}>1 sqft =</th>
                  <th style={styles.th}>1 sqm =</th>
                  <th style={styles.th}>1 sqyd =</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={styles.td}>sqft</td>
                  <td style={styles.td}>1</td>
                  <td style={styles.td}>10.764</td>
                  <td style={styles.td}>9</td>
                </tr>
                <tr>
                  <td style={styles.td}>sqm</td>
                  <td style={styles.td}>0.0929</td>
                  <td style={styles.td}>1</td>
                  <td style={styles.td}>0.836</td>
                </tr>
                <tr>
                  <td style={styles.td}>sqyd</td>
                  <td style={styles.td}>0.111</td>
                  <td style={styles.td}>1.196</td>
                  <td style={styles.td}>1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Calculator Info Cards */}
      <div style={styles.infoSection}>
        <h2 style={styles.sectionTitle}>Quick Tips</h2>
        <div style={styles.infoGrid}>
          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>EMI Tips</h3>
            <ul style={styles.infoList}>
              <li>Keep EMI under 40% of monthly income</li>
              <li>Compare interest rates from multiple banks</li>
              <li>Consider shorter tenure for less interest</li>
              <li>Prepayment reduces interest burden</li>
            </ul>
          </div>
          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>Stamp Duty Tips</h3>
            <ul style={styles.infoList}>
              <li>Stamp duty rates vary by state</li>
              <li>Timely payment avoids penalties</li>
              <li>Registration within 4 months required</li>
              <li>Digital registration available in many states</li>
            </ul>
          </div>
          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>Area Conversion</h3>
            <ul style={styles.infoList}>
              <li>1 acre = 43,560 sqft</li>
              <li>1 hectare = 107,639 sqft</li>
              <li>1 sqyd = 9 sqft</li>
              <li>1 sqm = 10.764 sqft</li>
            </ul>
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
  tabs: {
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
  calculatorSection: {
    backgroundColor: '#f8f9fa',
    padding: '30px',
    borderRadius: '10px',
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '25px',
  },
  inputGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '25px',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#2c3e50',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    marginBottom: '10px',
  },
  select: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    backgroundColor: '#fff',
  },
  range: {
    width: '100%',
    cursor: 'pointer',
  },
  calculateButton: {
    padding: '15px 40px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    display: 'block',
    margin: '20px auto',
  },
  resultSection: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '2px solid #ddd',
  },
  resultTitle: {
    fontSize: '1.3rem',
    color: '#2c3e50',
    marginBottom: '20px',
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  resultRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #eee',
  },
  resultLabel: {
    color: '#7f8c8d',
  },
  resultValue: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  resultValueHighlight: {
    fontWeight: 'bold',
    color: '#27ae60',
    fontSize: '1.2rem',
  },
  chartPlaceholder: {
    marginTop: '20px',
  },
  chartBar: {
    height: '30px',
    backgroundColor: '#ecf0f1',
    borderRadius: '5px',
    overflow: 'hidden',
    display: 'flex',
  },
  bar: {
    height: '100%',
    transition: 'width 0.5s',
  },
  chartLegend: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '10px',
  },
  legendColor: {
    display: 'inline-block',
    width: '15px',
    height: '15px',
    borderRadius: '3px',
    marginRight: '5px',
  },
  converterBox: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    marginBottom: '30px',
  },
  converterRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
  },
  converterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  conversionTable: {
    marginTop: '30px',
  },
  tableTitle: {
    fontSize: '1.2rem',
    color: '#2c3e50',
    marginBottom: '15px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    borderRadius: '10px',
    overflow: 'hidden',
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
  infoSection: {
    marginTop: '30px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    padding: '25px',
    borderRadius: '10px',
    border: '1px solid #eee',
  },
  infoTitle: {
    fontSize: '1.1rem',
    color: '#2c3e50',
    marginBottom: '15px',
    borderBottom: '2px solid #3498db',
    paddingBottom: '10px',
  },
  infoList: {
    marginLeft: '20px',
    color: '#7f8c8d',
  },
};

export default Calculator;
