import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

const statusColor    = { Pending: '#FFA500', 'In Progress': '#2196F3', Resolved: '#4CAF50', Rejected: '#F44336' };
const priorityColor  = { Low: '#8BC34A', Medium: '#FF9800', High: '#F44336' };

const MyComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState('All');

  useEffect(() => {
    API.get('/complaints/my')
      .then(({ data }) => setComplaints(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? complaints : complaints.filter(c => c.status === filter);

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ color: '#1E3A5F', fontSize: '24px' }}>📋 My Complaints</h2>
        <Link to="/submit" style={{ background: '#1E3A5F', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
          + Submit New
        </Link>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: '7px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer',
              fontWeight: filter === s ? '700' : '400', fontSize: '13px',
              background: filter === s ? '#1E3A5F' : '#e8edf2',
              color: filter === s ? '#fff' : '#555' }}>
            {s}
          </button>
        ))}
      </div>

      {loading && <p style={{ textAlign: 'center', color: '#888', padding: '3rem' }}>Loading...</p>}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '12px' }}>
          <p style={{ fontSize: '48px', marginBottom: '1rem' }}>📭</p>
          <p style={{ color: '#888', fontSize: '16px' }}>No complaints found.</p>
          <Link to="/submit" style={{ color: '#1E3A5F', fontWeight: '600' }}>Submit your first complaint →</Link>
        </div>
      )}

      {filtered.map(c => (
        <Link to={`/complaint/${c._id}`} key={c._id} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.4rem', marginBottom: '1rem',
            boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: `5px solid ${statusColor[c.status]}`,
            cursor: 'pointer', transition: 'transform 0.1s', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E3A5F', margin: 0 }}>{c.title}</h3>
                <span style={{ background: priorityColor[c.priority], color: '#fff',
                  padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>{c.priority}</span>
              </div>
              <p style={{ color: '#666', fontSize: '13px', marginTop: '6px', lineHeight: '1.5' }}>
                {c.description.length > 120 ? c.description.slice(0, 120) + '...' : c.description}
              </p>
              <div style={{ display: 'flex', gap: '16px', marginTop: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', color: '#999' }}>📁 {c.category}</span>
                <span style={{ fontSize: '12px', color: '#999' }}>📅 {new Date(c.createdAt).toLocaleDateString()}</span>
                {c.adminComment && <span style={{ fontSize: '12px', color: '#1565C0' }}>💬 Admin replied</span>}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ background: statusColor[c.status], color: '#fff',
                padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>
                {c.status}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MyComplaintsPage;
