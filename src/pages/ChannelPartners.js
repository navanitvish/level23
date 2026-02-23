// src/pages/ChannelPartners.jsx
import React, { useState, useRef,  } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { channelPartnerApi } from '../api/endpoints';

const ChannelPartners = () => {
  const queryClient = useQueryClient();
  
  const [showModal, setShowModal] = useState(false);
  const [showCreativeModal, setShowCreativeModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedPartners, setSelectedPartners] = useState([]);
  const [generatedCreatives, setGeneratedCreatives] = useState([]);
  
  const canvasRef = useRef(null);
  const baseImageRef = useRef(null);

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
    logo: null,
  });

  const [creativeFormData, setCreativeFormData] = useState({
    partnerName: '',
    companyName: '',
    phoneNumber: '',
    logo: null,
    logoPreview: null,
    templateType: 'price-rise',
  });

  // ─── FETCH PARTNERS ───────────────────────────────────────
  const {
    data: partners = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['channel-partners'],
    queryFn: channelPartnerApi.getAll,
    select: (response) => {
      const data = response?.data || response;
      if (Array.isArray(data)) return data;
      if (data.data && Array.isArray(data.data)) return data.data;
      if (data.partners && Array.isArray(data.partners)) return data.partners;
      return [];
    },
  });

  // ─── CREATE PARTNER ───────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: channelPartnerApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channel-partners'] });
      alert('Partner added successfully!');
      handleCloseModal();
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to add partner');
    },
  });

  // ─── SEND CREATIVE ────────────────────────────────────────
  const sendCreativeMutation = useMutation({
    mutationFn: channelPartnerApi.sendCreative,
    onSuccess: () => {
      alert('Creative sent successfully!');
      setShowCreativeModal(false);
      setSelectedPartners([]);
      setGeneratedCreatives([]);
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to send creative');
    },
  });

  // ─── HANDLERS ─────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreativeLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCreativeFormData({
          ...creativeFormData,
          logo: reader.result,
          logoPreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleCloseModal = () => {
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
      logo: null,
    });
  };

  const handlePartnerSelect = (partnerId) => {
    setSelectedPartners(prev =>
      prev.includes(partnerId)
        ? prev.filter(id => id !== partnerId)
        : [...prev, partnerId]
    );
  };

  const handleSelectAllPartners = (e) => {
    if (e.target.checked) {
      setSelectedPartners(partners.map(p => p._id || p.id));
    } else {
      setSelectedPartners([]);
    }
  };

  // ─── CANVAS TEMPLATE GENERATOR ────────────────────────────
  const generateCreativeTemplate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Instagram post size
    canvas.width = 1080;
    canvas.height = 1080;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 1080);
    gradient.addColorStop(0, '#4A6FA5');
    gradient.addColorStop(1, '#2D4A73');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);

    // Top left - website
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('🌐 abpvashi.com', 50, 60);

    // Top right - AKSHAR logo placeholder
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 40px Arial';
    ctx.fillText('AKSHAR', 850, 60);
    ctx.font = '20px Arial';
    ctx.fillText('INSPIRE LIFE', 850, 90);

    // Main heading - 1 DAYS TO GO
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 120px Arial';
    ctx.fillText('1', 450, 250);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 60px Arial';
    ctx.fillText('DAYS', 380, 340);
    ctx.fillText('TO GO', 380, 400);

    // Subheading
    ctx.font = 'italic 32px Arial';
    ctx.fillText('PRICES CHANGE TOMORROW', 280, 470);

    // Offer box
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.strokeRect(200, 520, 680, 120);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 40px Arial';
    ctx.fillText('SAVE', 420, 560);
    
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 50px Arial';
    ctx.fillText('₹10 LACS*', 360, 615);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('BEFORE A PRICE RISE', 390, 660);

    // Offer end date
    ctx.font = '28px Arial';
    ctx.fillText('OFFER ENDS 26TH JANUARY 2026', 310, 730);

    // Location details
    ctx.font = '22px Arial';
    ctx.fillText('Airport - 20 Mins  |  Atal Setu- 20 Mins  |  APMC- 2 Mins  |  BKC- 20 Mins', 80, 950);

    // Bottom section background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(0, 970, 1080, 110);

    // Partner logo (if uploaded)
    if (creativeFormData.logo) {
      const logoImg = new Image();
      logoImg.onload = () => {
        ctx.drawImage(logoImg, 50, 985, 80, 80);
      };
      logoImg.src = creativeFormData.logo;
    } else {
      // Placeholder logo
      ctx.fillStyle = '#4A6FA5';
      ctx.fillRect(50, 985, 80, 80);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 30px Arial';
      ctx.fillText('LOGO', 55, 1035);
    }

    // Partner details (bottom left)
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 28px Arial';
    ctx.fillText(creativeFormData.partnerName || 'Partner Name', 150, 1005);
    
    ctx.font = '24px Arial';
    ctx.fillText(creativeFormData.companyName || 'Company Name', 150, 1040);
    
    ctx.font = '20px Arial';
    ctx.fillText('MahaRera Reg. No. P51700024978', 150, 1065);

    // Ready to move section (bottom center-right)
    ctx.fillStyle = '#1E3A8A';
    ctx.fillRect(540, 985, 250, 80);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px Arial';
    ctx.fillText('READY TO MOVE IN', 560, 1015);
    ctx.font = '20px Arial';
    ctx.fillText('RENT & INTERIOR', 560, 1045);
    ctx.fillText('ASSISTANCE', 570, 1065);

    // Phone number (top right corner)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px Arial';
    ctx.fillText(`📞 ${creativeFormData.phoneNumber || '7666 688 788'}`, 750, 120);

    // Phone number (bottom right)
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 36px Arial';
    ctx.fillText(`📞 ${creativeFormData.phoneNumber || '7666 688 788'}`, 810, 1030);

    // Generate image
    return canvas.toDataURL('image/png');
  };

  const handleGenerateForSelected = () => {
    const creatives = selectedPartners.map(partnerId => {
      const partner = partners.find(p => (p._id || p.id) === partnerId);
      if (!partner) return null;

      // Set partner data
      setCreativeFormData({
        partnerName: partner.name,
        companyName: partner.company,
        phoneNumber: partner.phone,
        logo: partner.logo || null,
        logoPreview: partner.logo || null,
        templateType: 'price-rise',
      });

      // Generate creative
      setTimeout(() => {
        const imageUrl = generateCreativeTemplate();
        return {
          partnerId: partner._id || partner.id,
          partnerName: partner.name,
          imageUrl,
        };
      }, 100);
    }).filter(Boolean);

    setTimeout(() => {
      setGeneratedCreatives(creatives);
      setShowTemplateModal(true);
    }, 500);
  };

  const handleGenerateSingle = () => {
    if (!creativeFormData.partnerName || !creativeFormData.phoneNumber) {
      alert('Please fill partner name and phone number');
      return;
    }
    
    const imageUrl = generateCreativeTemplate();
    setGeneratedCreatives([{
      partnerId: 'custom',
      partnerName: creativeFormData.partnerName,
      imageUrl,
    }]);
    setShowTemplateModal(true);
  };

  const downloadCreative = (imageUrl, partnerName) => {
    const link = document.createElement('a');
    link.download = `${partnerName}-creative-${Date.now()}.png`;
    link.href = imageUrl;
    link.click();
  };

  const downloadAllCreatives = () => {
    generatedCreatives.forEach((creative, index) => {
      setTimeout(() => {
        downloadCreative(creative.imageUrl, creative.partnerName);
      }, index * 500);
    });
  };

  const handleSendCreatives = () => {
    const payload = {
      partners: selectedPartners,
      creatives: generatedCreatives,
      templateType: creativeFormData.templateType,
    };
    
    sendCreativeMutation.mutate(payload);
  };

  const actionLoading = createMutation.isPending || sendCreativeMutation.isPending;

  const stats = [
    { label: 'Total Partners', value: partners.length.toString(), change: '+12', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'blue' },
    { label: 'Active Partners', value: partners.filter(p => p.status === 'active').length.toString(), change: '+5', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'emerald' },
    { label: 'Total Revenue', value: '₹2.5Cr', change: '+18%', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1', color: 'violet' },
    { label: 'New This Month', value: '12', change: '+4', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', color: 'amber' }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
      emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
      violet: { bg: 'bg-violet-50', text: 'text-violet-600' },
      amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
    };
    return colors[color];
  };

  return (
    <div className="space-y-6">
      {/* Hidden canvas for template generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Channel Partners</h1>
        <p className="text-gray-600 mt-1">Manage your channel partners and generate personalized marketing creatives</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const colorClass = getColorClasses(stat.color);
          return (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 ${colorClass.bg} rounded-xl`}>
                  <svg className={`w-6 h-6 ${colorClass.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">{stat.change}</span>
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
            <input type="text" placeholder="Search partners..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        
        <div className="flex gap-3">
          <button onClick={() => setShowCreativeModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-purple-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Send Creative
          </button>

          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Partner
          </button>
        </div>
      </div>

      {/* Partners Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading partners...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="px-6 py-4 text-left">
                    <input type="checkbox" onChange={handleSelectAllPartners} checked={selectedPartners.length === partners.length && partners.length > 0} className="w-4 h-4 text-blue-600 rounded" />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Partner</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Company</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Commission</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {partners.map((partner) => (
                  <tr key={partner._id || partner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input type="checkbox" checked={selectedPartners.includes(partner._id || partner.id)} onChange={() => handlePartnerSelect(partner._id || partner.id)} className="w-4 h-4 text-blue-600 rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {partner.logo ? (
                          <img src={partner.logo} alt={partner.name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                            {partner.name?.charAt(0) || 'P'}
                          </div>
                        )}
                        <span className="font-semibold text-gray-900">{partner.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{partner.company}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 capitalize">{partner.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-sm">
                        <span className="text-gray-900">{partner.phone}</span>
                        <span className="text-gray-500 text-xs">{partner.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{partner.commission}%</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full capitalize ${partner.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {partner.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Partner Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Add New Partner</h2>
                <button onClick={handleCloseModal} className="text-white hover:bg-white/20 p-2 rounded-lg">✕</button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Partner Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
                  <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type *</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required>
                    <option value="broker">Broker</option>
                    <option value="agent">Agent</option>
                    <option value="builder">Builder</option>
                    <option value="consultant">Consultant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Commission % *</label>
                  <input type="number" name="commission" value={formData.commission} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Partner Logo</label>
                <input type="file" accept="image/*" onChange={handleLogoChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <button type="button" onClick={handleCloseModal} className="px-6 py-2.5 text-gray-700 font-semibold border border-gray-300 rounded-xl hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={actionLoading} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50">
                  {actionLoading ? 'Adding...' : 'Add Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Creative Form Modal */}
      {showCreativeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowCreativeModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">Generate Marketing Creative</h2>
              <p className="text-violet-100 text-sm mt-1">Fill partner details to generate personalized template</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Partner Name *</label>
                  <input type="text" value={creativeFormData.partnerName} onChange={(e) => setCreativeFormData({...creativeFormData, partnerName: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500" placeholder="Rahul Kumar" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
                  <input type="text" value={creativeFormData.companyName} onChange={(e) => setCreativeFormData({...creativeFormData, companyName: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500" placeholder="Kumar Real Estate" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                <input type="tel" value={creativeFormData.phoneNumber} onChange={(e) => setCreativeFormData({...creativeFormData, phoneNumber: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500" placeholder="+91 98765 43210" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Partner Logo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-violet-500 transition-colors cursor-pointer relative">
                  <input type="file" accept="image/*" onChange={handleCreativeLogoChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  {creativeFormData.logoPreview ? (
                    <img src={creativeFormData.logoPreview} alt="Logo" className="w-24 h-24 object-contain mx-auto rounded-lg" />
                  ) : (
                    <>
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-600">Click to upload logo</p>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-800">
                  ℹ️ The logo will appear at bottom left, and phone number will be shown at top right and bottom right of the creative.
                </p>
              </div>

              {selectedPartners.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-blue-900">
                    {selectedPartners.length} partner(s) selected. Click "Generate for Selected" to create creatives for all.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button onClick={() => setShowCreativeModal(false)} className="px-6 py-2.5 text-gray-700 font-semibold border border-gray-300 rounded-xl hover:bg-gray-50">Cancel</button>
                {selectedPartners.length > 0 ? (
                  <button onClick={handleGenerateForSelected} className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-purple-700">
                    Generate for Selected ({selectedPartners.length})
                  </button>
                ) : (
                  <button onClick={handleGenerateSingle} className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-purple-700">
                    Generate Creative
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Preview Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowTemplateModal(false)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Generated Creatives</h2>
                  <p className="text-emerald-100 text-sm mt-1">{generatedCreatives.length} creative(s) ready to download</p>
                </div>
                <button onClick={() => setShowTemplateModal(false)} className="text-white hover:bg-white/20 p-2 rounded-lg">✕</button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {generatedCreatives.map((creative, index) => (
                  <div key={index} className="border-2 border-gray-200 rounded-xl p-4 hover:border-violet-500 transition-colors">
                    <img src={creative.imageUrl} alt={creative.partnerName} className="w-full rounded-lg mb-3" />
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900">{creative.partnerName}</p>
                        <p className="text-xs text-gray-500">Marketing Creative</p>
                      </div>
                      <button onClick={() => downloadCreative(creative.imageUrl, creative.partnerName)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button onClick={downloadAllCreatives} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700">
                  Download All
                </button>
                <button onClick={handleSendCreatives} disabled={actionLoading} className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-green-700 disabled:opacity-50">
                  {actionLoading ? 'Sending...' : 'Send to Partners'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {actionLoading && (
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

export default ChannelPartners;