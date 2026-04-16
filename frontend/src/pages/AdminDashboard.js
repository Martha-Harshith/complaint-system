import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const statusColor   = { Pending: '#FFA500', 'In Progress': '#2196F3', Resolved: '#4CAF50', Rejected: '#F44336' };
const priorityColor = { Low: '#8BC34A', Medium: '#FF9800', High: '#F44336' };

const AdminDashboard = () => {
  const { user }                            = useAuth();
  const [complaints, setComplaints]         = useState([]);
  const [loading, setLoading]               = useState(true);
  const [selected, setSelected]             = useState(null);
  const [form, setForm]                     = useState({ status: '', adminComment: '' });
  const [filterStatus, setFilterStatus]     = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm]         = useState('');
  const [stats, setStats]                   = useState(null);
  const [updating, setUpdating]             = useState(false);

  const fetchData = async () => {
    try {
      const [compRes, statsRes] = await Promise.all([
        API.get('/complaints/all'),
        API.get('/complaints/stats'),
      ]);

      // ── Filter out admin's own complaints ──────────────────────────────
      const othersComplaints = compRes.data.filter(
        c => c.user?._id !== user._id && c.user?.email !== user.email
      );

      setComplaints(othersComplaints);
      setStats(statsRes.data);
    } catch (err) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchData();
}, []);

  const openModal = (complaint) => {
    setSelected(complaint);
    setForm({ status: complaint.status, adminComment: complaint.adminComment || '' });
  };

  const handleUpdate = async () => {
    if (!form.status) return toast.error('Please select a status');
    setUpdating(true);
    try {
      await API.put(`/complaints/${selected._id}/status`, form);
      toast.success('✅ Status updated! User notified via SMS & Email.');
      setSelected(null);
      fetchData();
    } catch (err) {
      toast.error('Update failed. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    try {
      await API.delete(`/complaints/${id}`);
      toast.success('Complaint deleted successfully');
      fetchData();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  // ── Filter logic ────────────────────────────────────────────────────────
  const filtered = complaints
    .filter(c => filterStatus   === 'All' || c.status   === filterStatus)
    .filter(c => filterCategory === 'All' || c.category === filterCategory)
    .filter(c =>
      c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div style={{ maxWidth: '1150px', margin: '2rem auto', padding: '0 1rem' }}>

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#FFD700', borderRadius: '50%', width: '50px', height: '50px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
          🛠️
        </div>
        <div>
          <h2 style={{ color: '#1E3A5F', fontSize: '24px', margin: 0 }}>Manage Complaints</h2>
          <p style={{ color: '#888', margin: '2px 0 0', fontSize: '13px' }}>
            View and manage complaints submitted by users
          </p>
        </div>
      </div>

      {/* Stats Row */}
      {stats && (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total',       val: complaints.length, color: '#1E3A5F' },
            { label: 'Pending',     val: complaints.filter(c => c.status === 'Pending').length,     color: '#FFA500' },
            { label: 'In Progress', val: complaints.filter(c => c.status === 'In Progress').length, color: '#2196F3' },
            { label: 'Resolved',    val: complaints.filter(c => c.status === 'Resolved').length,    color: '#4CAF50' },
            { label: 'Rejected',    val: complaints.filter(c => c.status === 'Rejected').length,    color: '#F44336' },
          ].map(s => (
            <div key={s.label} style={{
              background: '#fff', borderRadius: '10px', padding: '1rem 1.4rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)', borderTop: `4px solid ${s.color}`,
              flex: 1, minWidth: '110px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '22px', fontWeight: '700', color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Search and Filters */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '1.2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)', marginBottom: '1.2rem' }}>

        {/* Search */}
        <input
          placeholder="🔍 Search by title, user name, email or category..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e0e0e0',
            borderRadius: '8px', fontSize: '14px', outline: 'none',
            boxSizing: 'border-box', marginBottom: '12px' }}
        />

        {/* Status Filter */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: '#888', alignSelf: 'center', marginRight: '4px' }}>Status:</span>
          {['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              style={{
                padding: '6px 14px', borderRadius: '20px', border: 'none',
                cursor: 'pointer', fontSize: '12px', fontWeight: filterStatus === s ? '700' : '400',
                background: filterStatus === s ? '#1E3A5F' : '#f0f4f8',
                color: filterStatus === s ? '#fff' : '#555',
              }}>
              {s}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', color: '#888', alignSelf: 'center', marginRight: '4px' }}>Category:</span>
          {['All', 'Technical', 'Billing', 'Service', 'Product', 'Other'].map(c => (
            <button key={c} onClick={() => setFilterCategory(c)}
              style={{
                padding: '6px 14px', borderRadius: '20px', border: 'none',
                cursor: 'pointer', fontSize: '12px', fontWeight: filterCategory === c ? '700' : '400',
                background: filterCategory === c ? '#2C5F8A' : '#f0f4f8',
                color: filterCategory === c ? '#fff' : '#555',
              }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>
        Showing {filtered.length} complaint{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Complaints Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '12px' }}>
          <p style={{ color: '#888', fontSize: '16px' }}>⏳ Loading complaints...</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: '#1E3A5F', color: '#fff' }}>
                  {['User', 'Contact', 'Complaint Title', 'Category', 'Priority', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                      No complaints found.
                    </td>
                  </tr>
                )}
                {filtered.map((c, i) => (
                  <tr key={c._id} style={{
                    background: i % 2 === 0 ? '#fff' : '#fafafa',
                    borderBottom: '1px solid #f0f0f0',
                  }}>
                    {/* User */}
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: '600', fontSize: '13px' }}>{c.user?.name}</div>
                    </td>

                    {/* Contact */}
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#555' }}>{c.user?.email}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>{c.user?.phone}</div>
                    </td>

                    {/* Title */}
                    <td style={{ padding: '12px', maxWidth: '180px' }}>
                      <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '2px' }}>
                        {c.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#999',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>
                        {c.description}
                      </div>
                      {c.adminComment && (
                        <div style={{ fontSize: '11px', color: '#1565C0', marginTop: '2px' }}>
                          💬 Replied
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td style={{ padding: '12px', fontSize: '13px' }}>{c.category}</td>

                    {/* Priority */}
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        background: priorityColor[c.priority], color: '#fff',
                        padding: '3px 10px', borderRadius: '10px',
                        fontSize: '11px', fontWeight: '600',
                      }}>
                        {c.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        background: statusColor[c.status], color: '#fff',
                        padding: '4px 12px', borderRadius: '12px',
                        fontSize: '11px', fontWeight: '600',
                      }}>
                        {c.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td style={{ padding: '12px', fontSize: '12px', color: '#888' }}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button onClick={() => openModal(c)}
                          style={{ background: '#2196F3', color: '#fff', border: 'none',
                            padding: '6px 12px', borderRadius: '6px',
                            cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                          ✏️ Update
                        </button>
                        <button onClick={() => handleDelete(c._id)}
                          style={{ background: '#F44336', color: '#fff', border: 'none',
                            padding: '6px 12px', borderRadius: '6px',
                            cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Update Status Modal ─────────────────────────────────────────── */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 9999, padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem',
            width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>

            <h3 style={{ color: '#1E3A5F', marginBottom: '4px', fontSize: '20px' }}>
              Update Complaint Status
            </h3>
            <p style={{ color: '#888', fontSize: '13px', marginBottom: '1.5rem' }}>
              {selected.title}
            </p>

            {/* User Info */}
            <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '12px',
              marginBottom: '1.2rem', fontSize: '13px' }}>
              <p style={{ margin: '0 0 4px', fontWeight: '600', color: '#555' }}>👤 User Details</p>
              <p style={{ margin: '0 0 2px', color: '#333' }}>Name: {selected.user?.name}</p>
              <p style={{ margin: '0 0 2px', color: '#333' }}>Email: {selected.user?.email}</p>
              <p style={{ margin: 0, color: '#333' }}>Phone: {selected.user?.phone}</p>
            </div>

            {/* Status Select */}
            <div style={{ marginBottom: '14px' }}>
              <label style={lbl}>New Status *</label>
              <select style={inp} value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="Pending">⏳ Pending</option>
                <option value="In Progress">🔄 In Progress</option>
                <option value="Resolved">✅ Resolved</option>
                <option value="Rejected">❌ Rejected</option>
              </select>
            </div>

            {/* Admin Comment */}
            <div style={{ marginBottom: '16px' }}>
              <label style={lbl}>Admin Comment (optional)</label>
              <textarea style={{ ...inp, height: '90px', resize: 'vertical' }}
                placeholder="Add a note or explanation for the user..."
                value={form.adminComment}
                onChange={e => setForm({ ...form, adminComment: e.target.value })} />
            </div>

            {/* Notification note */}
            <div style={{ background: '#fff8e1', border: '1px solid #ffe082', borderRadius: '8px',
              padding: '10px 14px', fontSize: '13px', color: '#e65100', marginBottom: '1.2rem' }}>
              📲 User will automatically receive <strong>SMS + Email</strong> with the updated status.
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleUpdate} disabled={updating}
                style={{ flex: 1, padding: '12px', background: '#27ae60', color: '#fff',
                  border: 'none', borderRadius: '8px', fontWeight: '700',
                  cursor: 'pointer', fontSize: '14px', opacity: updating ? 0.7 : 1 }}>
                {updating ? '⏳ Saving...' : '✅ Save & Notify User'}
              </button>
              <button onClick={() => setSelected(null)}
                style={{ padding: '12px 20px', background: '#ecf0f1', color: '#555',
                  border: 'none', borderRadius: '8px', cursor: 'pointer',
                  fontSize: '14px', fontWeight: '600' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const lbl = { display: 'block', fontSize: '13px', fontWeight: '600', color: '#555', marginBottom: '6px' };
const inp = { width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' };

export default AdminDashboard;
