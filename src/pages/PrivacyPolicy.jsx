// src/pages/PrivacyPolicy.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { policyApi } from '../api/endpoints';

const PrivacyPolicy = () => {
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('collection');
  const [expandedSection, setExpandedSection] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', category: 'collection' });

  // ─── FETCH ALL POLICIES ───────────────────────────────────
  const {
    data: policiesData = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['policies'],
    queryFn: policyApi.getAll,
    select: (response) => {
      const data = response?.data || response;
      
      // Group policies by category
      const grouped = {
        collection: [],
        usage: [],
        sharing: [],
        security: [],
        rights: [],
        cookies: [],
      };

      if (Array.isArray(data)) {
        data.forEach(policy => {
          const category = policy.category || 'collection';
          if (grouped[category]) {
            grouped[category].push(policy);
          }
        });
      }

      return grouped;
    },
    staleTime: 1000 * 60 * 5,
  });

  // ─── CREATE POLICY ────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: policyApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      closeModal();
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
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to delete policy');
    },
  });

  // ─── HANDLERS ─────────────────────────────────────────────
  const openAddModal = () => {
    setEditingPolicy(null);
    setFormData({ title: '', content: '', category: activeTab });
    setShowModal(true);
  };

  const openEditModal = (policy) => {
    setEditingPolicy(policy);
    setFormData({
      title: policy.title,
      content: policy.content,
      category: policy.category || activeTab,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPolicy(null);
    setFormData({ title: '', content: '', category: 'collection' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      alert('Title and content are required');
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

  const tabInfo = {
    collection: { icon: '📊', label: 'Data Collection', color: '#3b82f6' },
    usage: { icon: '🔍', label: 'Data Usage', color: '#10b981' },
    sharing: { icon: '🤝', label: 'Data Sharing', color: '#f59e0b' },
    security: { icon: '🔒', label: 'Security', color: '#ef4444' },
    rights: { icon: '⚖️', label: 'User Rights', color: '#8b5cf6' },
    cookies: { icon: '🍪', label: 'Cookies', color: '#ec4899' },
  };

  const actionLoading = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const currentPolicies = policiesData[activeTab] || [];

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>🔒 Privacy Policy</h1>
          <p style={styles.subtitle}>Manage privacy policies and data protection</p>
        </div>
        <button onClick={openAddModal} style={styles.addButton} disabled={actionLoading}>
          ✚ Add Policy
        </button>
      </div>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        {Object.entries(tabInfo).map(([key, info]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              ...styles.tab,
              ...(activeTab === key ? { ...styles.tabActive, backgroundColor: info.color } : {}),
            }}
          >
            <span style={styles.tabIcon}>{info.icon}</span>
            <span style={styles.tabLabel}>{info.label}</span>
            <span style={styles.tabCount}>
              {policiesData[key]?.length || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Loading */}
        {isLoading && (
          <div style={styles.centerMessage}>
            <div style={styles.spinner}>⏳</div>
            <p>Loading policies...</p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div style={styles.errorBox}>
            <p style={styles.errorText}>
              ❌ {error?.response?.data?.message || error?.message || 'Failed to load policies'}
            </p>
            <button onClick={() => refetch()} style={styles.retryButton}>
              🔄 Retry
            </button>
          </div>
        )}

        {/* Policies List */}
        {!isLoading && !isError && (
          <>
            {currentPolicies.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>{tabInfo[activeTab].icon}</div>
                <h3 style={styles.emptyTitle}>No policies yet</h3>
                <p style={styles.emptyText}>Add your first policy in this category</p>
                <button onClick={openAddModal} style={styles.emptyButton}>
                  ✚ Add Policy
                </button>
              </div>
            ) : (
              <div style={styles.policyList}>
                {currentPolicies.map((policy, index) => (
                  <div key={policy._id || policy.id || index} style={styles.policyCard}>
                    <div
                      style={styles.policyHeader}
                      onClick={() => setExpandedSection(
                        expandedSection === (policy._id || policy.id) ? null : (policy._id || policy.id)
                      )}
                    >
                      <div style={styles.policyHeaderLeft}>
                        <span style={styles.policyIndex}>{index + 1}</span>
                        <h3 style={styles.policyTitle}>{policy.title}</h3>
                      </div>
                      <div style={styles.policyHeaderRight}>
                        <button
                          onClick={(e) => { e.stopPropagation(); openEditModal(policy); }}
                          style={styles.iconButton}
                          disabled={actionLoading}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(policy._id || policy.id); }}
                          style={styles.iconButton}
                          disabled={actionLoading}
                          title="Delete"
                        >
                          🗑️
                        </button>
                        <span style={styles.expandIcon}>
                          {expandedSection === (policy._id || policy.id) ? '▲' : '▼'}
                        </span>
                      </div>
                    </div>
                    {expandedSection === (policy._id || policy.id) && (
                      <div style={styles.policyContent}>
                        <p style={styles.policyText}>{policy.content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editingPolicy ? '✏️ Edit Policy' : '✚ Add New Policy'}
              </h2>
              <button onClick={closeModal} style={styles.closeButton}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={styles.select}
                >
                  {Object.entries(tabInfo).map(([key, info]) => (
                    <option key={key} value={key}>
                      {info.icon} {info.label}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={styles.input}
                  placeholder="Enter policy title..."
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  style={styles.textarea}
                  placeholder="Enter policy content..."
                  rows={8}
                  required
                />
              </div>
              <div style={styles.modalActions}>
                <button type="button" onClick={closeModal} style={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" style={styles.saveBtn} disabled={actionLoading}>
                  {actionLoading ? '⏳ Saving...' : editingPolicy ? '💾 Update' : '✅ Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {actionLoading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingBox}>
            <div style={styles.spinner}>⏳</div>
            <span>Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    padding: '24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0,
  },
  addButton: {
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '8px',
    marginBottom: '24px',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: '#fff',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '14px',
    color: '#6b7280',
    flexWrap: 'wrap',
  },
  tabActive: {
    color: '#fff',
    border: 'none',
    fontWeight: '600',
  },
  tabIcon: {
    fontSize: '18px',
  },
  tabLabel: {
    fontSize: '13px',
  },
  tabCount: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    minHeight: '400px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  centerMessage: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#6b7280',
  },
  spinner: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  errorBox: {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#fef2f2',
    borderRadius: '8px',
  },
  errorText: {
    color: '#dc2626',
    marginBottom: '16px',
    fontSize: '16px',
  },
  retryButton: {
    padding: '10px 20px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '24px',
  },
  emptyButton: {
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  policyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  policyCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'all 0.2s',
  },
  policyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    backgroundColor: '#f9fafb',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  policyHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  policyIndex: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#3b82f6',
    minWidth: '24px',
  },
  policyTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  policyHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  iconButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '4px 8px',
    opacity: 0.7,
    transition: 'opacity 0.2s',
  },
  expandIcon: {
    fontSize: '12px',
    color: '#6b7280',
    marginLeft: '8px',
  },
  policyContent: {
    padding: '20px',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#fff',
  },
  policyText: {
    fontSize: '14px',
    lineHeight: '1.7',
    color: '#374151',
    margin: 0,
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #e5e7eb',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '4px 8px',
  },
  form: {
    padding: '24px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: '#fff',
    color: '#111827',
    outline: 'none',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px',
  },
  cancelBtn: {
    padding: '10px 20px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  saveBtn: {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  loadingBox: {
    backgroundColor: '#fff',
    padding: '24px 40px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '16px',
    fontWeight: '600',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
  },
};

export default PrivacyPolicy;