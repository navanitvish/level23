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
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 200;
    canvas.width = size;
    canvas.height = size;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    const modules = 25;
    const moduleSize = size / modules;
    
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash = hash & hash;
    }
    
    ctx.fillStyle = '#000000';
    
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
    
    ctx.fillStyle = '#000000';
    for (let i = 0; i < modules; i++) {
      for (let j = 0; j < modules; j++) {
        if ((i < 8 && j < 8) || (i < 8 && j >= modules - 8) || (i >= modules - 8 && j < 8)) {
          continue;
        }
        
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

  const downloadQRCode = () => {
    if (qrPartner) {
      const qrImage = generateQRCode(qrLink);
      const link = document.createElement('a');
      link.download = `QR-${qrPartner.company}.png`;
      link.href = qrImage;
      link.click();
    }
  };

  const stats = [
    { label: 'Total Partners', value: '156', change: '+12', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'blue' },
    { label: 'Active Partners', value: '45', change: '+5', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'emerald' },
    { label: 'Total Revenue', value: '₹2.5Cr', change: '+18%', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1', color: 'violet' },
    { label: 'New This Month', value: '12', change: '+4', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', color: 'amber' }
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

  const partners = [
    { name: 'Rahul Kumar', company: 'Kumar Real Estate', type: 'Broker', avatar: 'RK', phone: '+91 98765 43210', email: 'rahul@kumar.com', projects: 8, revenue: '₹45,00,000', status: 'Active', typeBadge: 'blue' },
    { name: 'Priya Mehta', company: 'Mehta Properties', type: 'Agent', avatar: 'PM', phone: '+91 87654 32109', email: 'priya@mehta.com', projects: 5, revenue: '₹32,00,000', status: 'Active', typeBadge: 'violet' },
    { name: 'Amit Sharma', company: 'Sharma Builders', type: 'Builder', avatar: 'AS', phone: '+91 76543 21098', email: 'amit@sharma.com', projects: 12, revenue: '₹78,00,000', status: 'Active', typeBadge: 'emerald' },
    { name: 'Sneha Jain', company: 'Jain Consultants', type: 'Consultant', avatar: 'SJ', phone: '+91 65432 10987', email: 'sneha@jain.com', projects: 3, revenue: '₹18,00,000', status: 'Pending', typeBadge: 'amber' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Channel Partners</h1>
        <p className="text-gray-600 mt-1">Manage your channel partners, agents, and collaborators</p>
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
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                  {stat.change}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full md:w-96">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search partners..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white" style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem'
          }}>
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Pending</option>
          </select>
          
          <select className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white" style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem'
          }}>
            <option>All Types</option>
            <option>Broker</option>
            <option>Agent</option>
            <option>Builder</option>
            <option>Consultant</option>
          </select>

          <button
            onClick={() => setShowMarketingModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Send Creative
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Partner
          </button>
        </div>
      </div>

      {/* Partners Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Partner</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Company</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Projects</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Revenue</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {partners.map((partner, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                        {partner.avatar}
                      </div>
                      <span className="font-semibold text-gray-900">{partner.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{partner.company}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      partner.typeBadge === 'blue' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200' :
                      partner.typeBadge === 'violet' ? 'bg-violet-100 text-violet-700 ring-1 ring-violet-200' :
                      partner.typeBadge === 'emerald' ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200' :
                      'bg-amber-100 text-amber-700 ring-1 ring-amber-200'
                    }`}>
                      {partner.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-sm">
                      <span className="text-gray-900">{partner.phone}</span>
                      <span className="text-gray-500 text-xs">{partner.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{partner.projects}</td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-600">{partner.revenue}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      partner.status === 'Active' 
                        ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200' 
                        : 'bg-amber-100 text-amber-700 ring-1 ring-amber-200'
                    }`}>
                      {partner.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleGenerateQR(partner)}
                        className="p-2 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                        title="Generate QR"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 p-4 border-t border-gray-100">
          <button className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            Previous
          </button>
          <span className="text-sm text-gray-600">Page 1 of 8</span>
          <button className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            Next
          </button>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">Top Performing Partners</h2>
          <div className="space-y-3">
            {[
              { rank: 1, name: 'Sharma Builders', revenue: '₹78,00,000' },
              { rank: 2, name: 'Kumar Real Estate', revenue: '₹45,00,000' },
              { rank: 3, name: 'Mehta Properties', revenue: '₹32,00,000' },
            ].map((item) => (
              <div key={item.rank} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-sm">
                  {item.rank}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.revenue} Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">Recent Activities</h2>
          <div className="space-y-4">
            {[
              { text: 'New partner Raj Patel registered', time: '2 hours ago', color: 'emerald' },
              { text: 'Amit Sharma closed deal worth ₹12L', time: '5 hours ago', color: 'blue' },
              { text: 'Commission paid to Priya Mehta', time: '1 day ago', color: 'violet' },
            ].map((activity, index) => (
              <div key={index} className="flex gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  activity.color === 'emerald' ? 'bg-emerald-500' :
                  activity.color === 'blue' ? 'bg-blue-500' :
                  'bg-violet-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: activity.text.replace(/(\w+ \w+)$/g, '<strong>$1</strong>') }}></p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Partner Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Add New Partner</h2>
                <button onClick={handleCloseModal} className="text-white hover:bg-white/20 p-2 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Partner Logo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer relative">
                  {logoPreview ? (
                    <div className="relative inline-block">
                      <img src={logoPreview} alt="Logo" className="w-24 h-24 object-contain rounded-lg" />
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-600">Upload Logo</p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Partner Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
                  <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type *</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                    <option value="broker">Broker</option>
                    <option value="agent">Agent</option>
                    <option value="builder">Builder</option>
                    <option value="consultant">Consultant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Commission % *</label>
                  <input type="number" name="commission" value={formData.commission} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="5" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="3" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <button type="button" onClick={handleCloseModal} className="px-6 py-2.5 text-gray-700 font-semibold border border-gray-300 rounded-xl hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700">
                  Add Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Marketing Creative Modal */}
      {showMarketingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowMarketingModal(false)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Send Marketing Creative</h2>
                  <p className="text-violet-100 text-sm mt-1">Share promotional materials with partners</p>
                </div>
                <button onClick={() => setShowMarketingModal(false)} className="text-white hover:bg-white/20 p-2 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Upload Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Creatives</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-violet-500 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*,video/*,.pdf"
                    multiple
                    onChange={handleCreativeChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-lg font-semibold text-gray-700">Drop files here or click to upload</p>
                  <p className="text-sm text-gray-500 mt-1">Images, videos, PDFs up to 10MB each</p>
                </div>
              </div>

              {/* Preview Section */}
              {creativePreview.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Selected Files ({creativePreview.length})</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {creativePreview.map((item, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                          <img src={item.preview} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCreative(index)}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <p className="text-xs text-gray-600 mt-1 truncate">{item.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message (Optional)</label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows="4"
                  placeholder="Add a message to your partners..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                ></textarea>
              </div>

              {/* Select Partners */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Recipients</label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-4">
                  {partners.map((partner, index) => (
                    <label key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500" />
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                        {partner.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{partner.name}</p>
                        <p className="text-xs text-gray-500">{partner.company}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sending Status */}
              {sendingStatus === 'sending' && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                  <p className="text-blue-700 font-semibold">Sending creatives...</p>
                </div>
              )}

              {sendingStatus === 'success' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-emerald-700 font-semibold">Creatives sent successfully!</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowMarketingModal(false)}
                  className="px-6 py-2.5 text-gray-700 font-semibold border border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendCreatives}
                  disabled={creativePreview.length === 0 || sendingStatus === 'sending'}
                  className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingStatus === 'sending' ? 'Sending...' : 'Send to Partners'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && qrPartner && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowQRModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Partner QR Code</h2>
                  <p className="text-violet-100 text-sm mt-1">{qrPartner.company}</p>
                </div>
                <button onClick={() => setShowQRModal(false)} className="text-white hover:bg-white/20 p-2 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* QR Code Display */}
              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 flex justify-center">
                <img src={generateQRCode(qrLink)} alt="QR Code" className="w-64 h-64" />
              </div>

              {/* Partner Info */}
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {qrPartner.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{qrPartner.name}</p>
                    <p className="text-sm text-gray-600">{qrPartner.company}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-2">Registration Link:</p>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-700 break-all font-mono">{qrLink}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => copyToClipboard(qrLink)}
                  className="flex-1 px-4 py-2.5 bg-white border-2 border-violet-600 text-violet-600 font-semibold rounded-xl hover:bg-violet-50 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Link
                </button>
                <button
                  onClick={downloadQRCode}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelPartners;