import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../api';

const statusColor   = { Pending: '#FFA500', 'In Progress': '#2196F3', Resolved: '#4CAF50', Rejected: '#F44336' };
const priorityColor = { Low: '#8BC34A', Medium: '#FF9800', High: '#F44336' };

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState(null);
  const [form, setForm]             = useState({ status: '', adminComment: '' });
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm]     = useState('');
  const [stats, setStats]               = useState(null);
  const [updating, setUpdating]         = useState(false);

  const fetchData = async () => {
    try {
      const [complaintsRes, statsRes] = await Promise.all([
        API.get('/complaints/all'),
        API.get('/complaints/stats'),
      ]);
      setComplaints(complaintsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openModal = (complaint) => {
    setSelected(complaint);
    setForm({ status: complaint.status, adminComment: complaint.adminComment || '' });
  };

  const handleUpdate = async () => {
    if (!form.status) return toast.error('Select a status');
    setUpdating(true);
    try {
      await API.put(`/complaints/${selected._id}/status`, form);
      toast.success('✅ Status updated! User notified via SMS & Email.');
      setSelected(null);
      fetchData();
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const filtered = complaints
    .filter(c => filterStatus === 'All' || c.status === filterStatus)
    .filter(c =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
      <h2 style={{ color: '#1E3A5F', fontSize: '24px', marginBottom: '1.5rem' }}>
        🛠️ Admin Dashboard
      </h2>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {[
            { label: 'Total',       val: stats.total,      color: '#1E3A5F' },
            { label: 'Pending',     val: stats.pending,    color: '#FFA500' },
            { label: 'In Progress', val: stats.inProgress, color: '#2196F3' },
            { label: 'Resolved',    val: stats.resolved,   color: '#4CAF50' },
            { label: 'Rejected',    val: stats.rejected,   color: '#F44336' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: '10px', padding: '1rem 1.5rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)', borderTop: `4px solid ${s.color}`,
              flex: 1, minWidth: '120px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input placeholder="🔍 Search by title, user, category..."
          value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          style={{ padding: '9px 14px', border: '1.5px solid #ddd', borderRadius: '8px',
            fontSize: '14px', flex: 1, minWidth: '200px', outline: 'none' }} />
        {['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer',
              fontWeight: filterStatus === s ? '700' : '400', fontSize: '13px',
              background: filterStatus === s ? '#1E3A5F' : '#e8edf2',
              color: filterStatus === s ? '#fff' : '#555' }}>
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>Loading...</p>
      ) : (
        <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead>
                <tr style={{ background: '#1E3A5F', color: '#fff' }}>
                  {['User', 'Title', 'Category', 'Priority', 'Status', 'Date', 'Action'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>No complaints found.</td></tr>
                )}
                {filtered.map((c, i) => (
                  <tr key={c._id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                      <div style={{ fontWeight: '600' }}>{c.user?.name}</div>
                      <div style={{ color: '#999', fontSize: '11px' }}>{c.user?.email}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', maxWidth: '180px' }}>
                      <div style={{ fontWeight: '600', marginBottom: '2px' }}>{c.title}</div>
                      {c.adminComment && <div style={{ fontSize: '11px', color: '#1565C0' }}>💬 Replied</div>}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>{c.category}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: priorityColor[c.priority], color: '#fff',
                        padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '600' }}>
                        {c.priority}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: statusColor[c.status], color: '#fff',
                        padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
                        {c.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#888' }}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => openModal(c)}
                        style={{ background: '#2196F3', color: '#fff', border: 'none', padding: '7px 14px',
                          borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', width: '100%',
            maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <h3 style={{ color: '#1E3A5F', marginBottom: '4px' }}>Update Complaint Status</h3>
            <p style={{ color: '#888', fontSize: '13px', marginBottom: '1.5rem' }}>{selected.title}</p>

            <div style={{ marginBottom: '16px' }}>
              <label style={lbl}>New Status *</label>
              <select style={inp} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                {['Pending', 'In Progress', 'Resolved', 'Rejected'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={lbl}>Admin Comment (optional)</label>
              <textarea style={{ ...inp, height: '100px', resize: 'vertical' }}
                placeholder="Add a note or explanation for the user..."
                value={form.adminComment} onChange={e => setForm({ ...form, adminComment: e.target.value })} />
            </div>

            <div style={{ background: '#fff8e1', border: '1px solid #ffe082', borderRadius: '8px',
              padding: '10px 14px', fontSize: '13px', color: '#e65100', marginBottom: '20px' }}>
              📲 The user will receive an <strong>SMS + Email</strong> notification with the updated status.
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleUpdate} disabled={updating}
                style={{ flex: 1, padding: '12px', background: '#27ae60', color: '#fff', border: 'none',
                  borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px',
                  opacity: updating ? 0.7 : 1 }}>
                {updating ? 'Saving...' : '✅ Save & Notify User'}
              </button>
              <button onClick={() => setSelected(null)}
                style={{ padding: '12px 20px', background: '#ecf0f1', color: '#555', border: 'none',
                  borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
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
const inp = { width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: '8px',
  fontSize: '14px', outline: 'none', boxSizing: 'border-box' };

export default AdminDashboard;
