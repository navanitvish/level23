// src/pages/PrivacyPolicy.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { policyApi } from '../api/endpoints';
import {
  Shield, Plus, Edit, Trash2, ChevronDown, ChevronUp,
  Loader2, AlertCircle, X, Save, Check
} from 'lucide-react';

const PrivacyPolicy = () => {
  const queryClient = useQueryClient();
  
  const [expandedPolicy, setExpandedPolicy] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isActive: true
  });

  // ─── FETCH ALL POLICIES ───────────────────────────────────
  const {
    data: policies = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['policies'],
    queryFn: policyApi.getAll,
    select: (response) => {
      const data = response?.data || response;
      if (Array.isArray(data)) return data;
      if (data.data && Array.isArray(data.data)) return data.data;
      if (data.policies && Array.isArray(data.policies)) return data.policies;
      return [];
    },
    staleTime: 1000 * 60 * 5,
  });

  // ─── CREATE POLICY ────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: policyApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      closeModal();
      alert('Policy created successfully!');
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to create policy');
    },
  });

  // ─── UPDATE POLICY ────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => policyApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      closeModal();
      alert('Policy updated successfully!');
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to update policy');
    },
  });

  // ─── DELETE POLICY ────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: policyApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      alert('Policy deleted successfully!');
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to delete policy');
    },
  });

  // ─── HANDLERS ─────────────────────────────────────────────
  const openAddModal = () => {
    setEditingPolicy(null);
    setFormData({ title: '', description: '', isActive: true });
    setShowModal(true);
  };

  const openEditModal = (policy) => {
    setEditingPolicy(policy);
    setFormData({
      title: policy.title || '',
      description: policy.description || '',
      isActive: policy.isActive ?? true,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPolicy(null);
    setFormData({ title: '', description: '', isActive: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      alert('Title and description are required');
      return;
    }

    if (editingPolicy) {
      updateMutation.mutate({
        id: editingPolicy._id || editingPolicy.id,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      deleteMutation.mutate(id);
    }
  };

  const toggleExpand = (id) => {
    setExpandedPolicy(expandedPolicy === id ? null : id);
  };

  const actionLoading = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const activeCount = policies.filter(p => p.isActive).length;
  const inactiveCount = policies.length - activeCount;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Privacy & Policies</h1>
              <p className="text-white/80 text-sm">Manage your privacy policies and terms</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{activeCount} Active</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="w-4 h-4" />
                <span>{inactiveCount} Inactive</span>
              </div>
            </div>
            <button
              onClick={openAddModal}
              disabled={actionLoading}
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
              Add Policy
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        {/* Error State */}
        {isError && (
          <div className="m-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900 mb-1">Error Loading Policies</h4>
              <p className="text-sm text-red-700">
                {error?.response?.data?.message || error?.message || 'Failed to load policies'}
              </p>
              <button
                onClick={() => refetch()}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-700 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500">Loading policies...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && policies.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No policies yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first privacy policy</p>
            <button
              onClick={openAddModal}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Policy
            </button>
          </div>
        )}

        {/* Policies List */}
        {!isLoading && !isError && policies.length > 0 && (
          <div className="divide-y divide-gray-100">
            {policies.map((policy, index) => {
              const isExpanded = expandedPolicy === (policy._id || policy.id);
              
              return (
                <div
                  key={policy._id || policy.id}
                  className="group hover:bg-blue-50/30 transition-colors"
                >
                  {/* Policy Header */}
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer"
                    onClick={() => toggleExpand(policy._id || policy.id)}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                          {policy.title}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                              policy.isActive
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {policy.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {policy.createdAt && (
                            <span className="text-xs text-gray-400">
                              {new Date(policy.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(policy);
                        }}
                        disabled={actionLoading}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(policy._id || policy.id);
                        }}
                        disabled={actionLoading}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="ml-2">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Policy Content (Expanded) */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-0">
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {policy.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-white font-bold text-xl">
                  {editingPolicy ? 'Edit Policy' : 'Add New Policy'}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g. Product Purchase Policy"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="e.g. Products cannot be returned after purchase..."
                  rows={6}
                  required
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Active Status</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Policy will be {formData.isActive ? 'visible' : 'hidden'} to users
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-cyan-600"></div>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {editingPolicy ? 'Update Policy' : 'Create Policy'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {actionLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 shadow-2xl flex items-center gap-4">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            <span className="font-semibold text-gray-900">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyPolicy;