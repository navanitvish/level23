// src/pages/Inventory.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi, categoryApi } from '../api/endpoints';
import {
  Building2, Plus, Edit, Trash2, Search, X,
  CheckCircle, Clock, Ban, Loader2, AlertCircle,
  Download, LayoutGrid, List,
} from 'lucide-react';

// ─── STATUS CONFIG ────────────────────────────────────────────
const STATUS_CONFIG = {
  available: {
    label: 'Available',
    dot:   'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon:  <CheckCircle className="h-3.5 w-3.5" />,
  },
  reserved: {
    label: 'Reserved',
    dot:   'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    icon:  <Clock className="h-3.5 w-3.5" />,
  },
  sold: {
    label: 'Sold',
    dot:   'bg-red-500',
    badge: 'bg-red-50 text-red-700 border-red-200',
    icon:  <Ban className="h-3.5 w-3.5" />,
  },
};

const getStatus = (status) =>
  STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.available;

const Inventory = () => {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm]         = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter]     = useState('all');
  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [editingItem, setEditingItem]       = useState(null);
  const [viewMode, setViewMode]             = useState('table'); // 'table' | 'grid'
  const [newItem, setNewItem] = useState({
    name: '', categoryId: '', quantity: 1,
    status: 'available', price: '', isActive: true,
  });

  // ─── FETCH CATEGORIES ─────────────────────────────────────
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
    select: (response) => {
      const data = response?.data || response;
      if (Array.isArray(data)) return data.filter(cat => cat && cat.image);
      if (data.data && Array.isArray(data.data)) return data.data.filter(cat => cat && cat.image);
      if (data.categories && Array.isArray(data.categories)) return data.categories.filter(cat => cat && cat.image);
      return [];
    },
  });

  // ─── FETCH INVENTORY ──────────────────────────────────────
  const {
    data: inventoryItems = [],
    isLoading, isError, error, refetch,
  } = useQuery({
    queryKey: ['inventory'],
    queryFn: inventoryApi.getAll,
    select: (response) => {
      const data = response?.data || response;
      if (Array.isArray(data)) return data;
      if (data.data && Array.isArray(data.data)) return data.data;
      if (data.inventory && Array.isArray(data.inventory)) return data.inventory;
      return [];
    },
    staleTime: 1000 * 60 * 5,
  });

  // ─── MUTATIONS ────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: inventoryApi.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['inventory'] }); closeModal(); },
    onError: (err) => alert(err.response?.data?.message || 'Failed to create inventory item'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => inventoryApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['inventory'] }); closeModal(); },
    onError: (err) => alert(err.response?.data?.message || 'Failed to update inventory item'),
  });

  const deleteMutation = useMutation({
    mutationFn: inventoryApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory'] }),
    onError: (err) => alert(err.response?.data?.message || 'Failed to delete inventory item'),
  });

  // ─── FILTERS ──────────────────────────────────────────────
  const filteredItems = inventoryItems.filter(item => {
    const matchSearch   = item.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'All' ||
      item.categoryId === selectedCategory ||
      item.category?.name === selectedCategory ||
      item.category?._id === selectedCategory;
    const matchStatus   = statusFilter === 'all' || item.status?.toLowerCase() === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  // ─── STATS ────────────────────────────────────────────────
  const stats = {
    total:     inventoryItems.length,
    available: inventoryItems.filter(i => i.status?.toLowerCase() === 'available').length,
    reserved:  inventoryItems.filter(i => i.status?.toLowerCase() === 'reserved').length,
    sold:      inventoryItems.filter(i => i.status?.toLowerCase() === 'sold').length,
  };

  // ─── HANDLERS ─────────────────────────────────────────────
  const openAddModal = () => {
    setEditingItem(null);
    setNewItem({ name: '', categoryId: categories[0]?._id || '', quantity: 1, status: 'available', price: '', isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setNewItem({
      name:       item.name,
      categoryId: item.categoryId || item.category?._id || item.category?.id,
      quantity:   item.quantity,
      status:     item.status?.toLowerCase() || 'available',
      price:      item.price?.toString() || '',
      isActive:   item.isActive !== undefined ? item.isActive : true,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setNewItem({ name: '', categoryId: '', quantity: 1, status: 'available', price: '', isActive: true });
  };

  const handleSubmit = () => {
    if (!newItem.name.trim() || !newItem.categoryId) {
      alert('Name and category are required');
      return;
    }
    const payload = {
      name:       newItem.name,
      categoryId: newItem.categoryId,
      quantity:   parseInt(newItem.quantity) || 1,
      status:     newItem.status,
      price:      parseFloat(newItem.price?.toString().replace(/,/g, '')) || 0,
      isActive:   newItem.isActive,
    };
    if (editingItem) {
      updateMutation.mutate({ id: editingItem._id || editingItem.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) deleteMutation.mutate(id);
  };

  const handleInputChange = (field, value) => setNewItem(prev => ({ ...prev, [field]: value }));

  const getCategoryName = (item) => {
    if (item.category?.name) return item.category.name;
    return categories.find(c => (c._id || c.id) === item.categoryId)?.name || 'Unknown';
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(inventoryItems, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventory-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const actionLoading  = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const statusOptions  = ['available', 'reserved', 'sold'];

  return (
    <div className="min-h-screen bg-white p-6 space-y-6">

      {/* ── HEADER ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Inventory Management</h1>
            <p className="text-white/75 text-sm">Track all property units and their availability</p>
            <div className="flex flex-wrap items-center gap-5 mt-4">
              <div className="flex items-center gap-2 text-sm"><Building2 className="h-4 w-4" /><span className="font-medium">{stats.total} Total</span></div>
              <div className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4" /><span className="font-medium">{stats.available} Available</span></div>
              <div className="flex items-center gap-2 text-sm"><Clock className="h-4 w-4" /><span className="font-medium">{stats.reserved} Reserved</span></div>
              <div className="flex items-center gap-2 text-sm"><Ban className="h-4 w-4" /><span className="font-medium">{stats.sold} Sold</span></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleExport}
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
              <Download className="h-4 w-4" /> Export
            </button>
            <button onClick={openAddModal} disabled={actionLoading}
              className="bg-white text-blue-600 hover:bg-white/90 font-semibold px-5 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50">
              <Plus className="h-4 w-4" /> Add Inventory
            </button>
          </div>
        </div>
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Units',  value: stats.total,     color: 'from-blue-600 to-cyan-600',     icon: <Building2 className="h-5 w-5" /> },
          { label: 'Available',    value: stats.available,  color: 'from-emerald-500 to-green-500', icon: <CheckCircle className="h-5 w-5" /> },
          { label: 'Reserved',     value: stats.reserved,   color: 'from-amber-500 to-orange-500',  icon: <Clock className="h-5 w-5" /> },
          { label: 'Sold',         value: stats.sold,       color: 'from-red-500 to-rose-500',      icon: <Ban className="h-5 w-5" /> },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center text-white flex-shrink-0`}>{icon}</div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── STATUS LEGEND ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Filter by status:</span>
        {[
          { key: 'all',       label: `All (${stats.total})`,           cls: 'bg-gray-100 text-gray-700 border-gray-200' },
          { key: 'available', label: `Available (${stats.available})`, cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
          { key: 'reserved',  label: `Reserved (${stats.reserved})`,   cls: 'bg-amber-50 text-amber-700 border-amber-200' },
          { key: 'sold',      label: `Sold (${stats.sold})`,           cls: 'bg-red-50 text-red-700 border-red-200' },
        ].map(({ key, label, cls }) => (
          <button key={key} onClick={() => setStatusFilter(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              statusFilter === key
                ? 'ring-2 ring-offset-1 ring-blue-500 ' + cls
                : cls + ' opacity-60 hover:opacity-100'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── MAIN CARD ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">

        {/* Error */}
        {isError && (
          <div className="m-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900">Error Loading Inventory</p>
              <p className="text-sm text-red-700">{error?.response?.data?.message || error?.message}</p>
              <button onClick={() => refetch()} className="mt-2 text-sm font-medium text-red-600 underline">Try Again</button>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 text-sm">Loading inventory...</p>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="text" placeholder="Search properties..."
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-9 py-2 w-60 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                  disabled={categoriesLoading}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
                  <option value="All">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                  <List className="h-4 w-4" />
                </button>
                <button onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-20">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">No properties found</h3>
                <p className="text-sm text-gray-500 mb-5">Try adjusting your search or filters.</p>
                <button onClick={openAddModal}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 inline-flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add Inventory
                </button>
              </div>
            ) : viewMode === 'table' ? (

              /* ── TABLE VIEW ── */
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['#', 'Property', 'Category', 'Qty', 'Price', 'Status', 'Active', 'Actions'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredItems.map((item, idx) => {
                      const s = getStatus(item.status);
                      return (
                        <tr key={item._id || item.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-5 py-4 text-sm text-gray-400">{idx + 1}</td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                                <Building2 className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                                <p className="text-xs text-gray-400 font-mono">{(item._id || item.id)?.toString().slice(-6)}</p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-block bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                              {getCategoryName(item)}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-700 font-medium">{item.quantity || 1}</td>

                          <td className="px-5 py-4 text-sm font-bold text-gray-900">
                            {item.price ? `₹${Number(item.price).toLocaleString('en-IN')}` : '—'}
                          </td>

                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.badge}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                              {s.label}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold ${item.isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${item.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                              {item.isActive ? 'Yes' : 'No'}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1">
                              <button onClick={() => openEditModal(item)} disabled={actionLoading}
                                className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-50">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleDelete(item._id || item.id)} disabled={actionLoading}
                                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Table Footer */}
                <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                  <p className="text-xs text-gray-400">
                    Showing <span className="font-medium text-gray-600">{filteredItems.length}</span> of{' '}
                    <span className="font-medium text-gray-600">{inventoryItems.length}</span> items
                  </p>
                </div>
              </div>

            ) : (

              /* ── GRID VIEW ── */
              <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredItems.map((item) => {
                    const s = getStatus(item.status);
                    return (
                      <div key={item._id || item.id}
                        className="relative bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all group">
                        {/* Status stripe */}
                        <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${s.dot}`} />

                        <div className="flex items-start justify-between mb-3 mt-1">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-white" />
                          </div>
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold border ${s.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                            {s.label}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-gray-900 mb-1 truncate">{item.name}</h3>
                        <p className="text-xs text-cyan-600 font-semibold mb-1">{getCategoryName(item)}</p>
                        <p className="text-xs text-gray-500 mb-3">Qty: {item.quantity || 1}</p>

                        {item.price ? (
                          <p className="text-base font-bold text-gray-900">₹{Number(item.price).toLocaleString('en-IN')}</p>
                        ) : (
                          <p className="text-xs text-gray-400 italic">No price set</p>
                        )}

                        <div className="flex items-center gap-1 mt-4 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditModal(item)} disabled={actionLoading}
                            className="flex-1 py-1.5 text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors flex items-center justify-center gap-1 disabled:opacity-50">
                            <Edit className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button onClick={() => handleDelete(item._id || item.id)} disabled={actionLoading}
                            className="flex-1 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center gap-1 disabled:opacity-50">
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Showing <span className="font-medium text-gray-600">{filteredItems.length}</span> of{' '}
                    <span className="font-medium text-gray-600">{inventoryItems.length}</span> items
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── ADD / EDIT MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-2xl px-6 py-5 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-white font-bold text-lg">
                  {editingItem ? 'Edit Inventory' : 'Add New Inventory'}
                </h2>
              </div>
              <button onClick={closeModal} className="text-white/70 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Property Name <span className="text-red-500">*</span>
                </label>
                <input type="text" value={newItem.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g. Luxury Villa A101"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Category <span className="text-red-500">*</span>
                </label>
                <select value={newItem.categoryId} onChange={(e) => handleInputChange('categoryId', e.target.value)}
                  disabled={categoriesLoading}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Quantity + Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Quantity</label>
                  <input type="number" min="1" value={newItem.quantity}
                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Status</label>
                  <select value={newItem.status} onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    {statusOptions.map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Preview */}
              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${getStatus(newItem.status).badge}`}>
                {getStatus(newItem.status).icon}
                <span className="text-sm font-semibold">Status: {getStatus(newItem.status).label}</span>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">₹</span>
                  <input type="number" value={newItem.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="e.g. 5000000"
                    className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Is Active */}
              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Active Property</p>
                  <p className="text-xs text-gray-400">Visible on listings</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={newItem.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-cyan-600" />
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 pt-0">
              <button type="button" onClick={closeModal} disabled={actionLoading}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={actionLoading}
                className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50">
                {actionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingItem ? 'Update Property' : 'Add Property'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LOADING OVERLAY ── */}
      {actionLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 shadow-2xl flex items-center gap-4">
            <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
            <span className="font-semibold text-gray-900">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;