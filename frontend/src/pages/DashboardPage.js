import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const StatCard = ({ label, value, color, icon }) => (
  <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)', borderTop: `4px solid ${color}`,
    flex: '1', minWidth: '140px', textAlign: 'center' }}>
    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
    <div style={{ fontSize: '28px', fontWeight: '700', color }}>{value}</div>
    <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>{label}</div>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats]           = useState(null);
  const [recentComplaints, setRecent] = useState([]);

  useEffect(() => {
    if (user.role === 'admin') {
      API.get('/complaints/stats').then(({ data }) => setStats(data));
      API.get('/complaints/all').then(({ data }) => setRecent(data.slice(0, 5)));
    } else {
      API.get('/complaints/my').then(({ data }) => {
        setRecent(data.slice(0, 5));
        const total      = data.length;
        const pending    = data.filter(c => c.status === 'Pending').length;
        const inProgress = data.filter(c => c.status === 'In Progress').length;
        const resolved   = data.filter(c => c.status === 'Resolved').length;
        setStats({ total, pending, inProgress, resolved });
      });
    }
  }, [user]);

  const statusColor = { Pending: '#FFA500', 'In Progress': '#2196F3', Resolved: '#4CAF50', Rejected: '#F44336' };

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#1E3A5F', fontSize: '26px' }}>
          👋 Welcome, {user.name}!
        </h1>
        <p style={{ color: '#666', marginTop: '4px' }}>
          {user.role === 'admin' ? 'Admin Dashboard — Manage all complaints' : 'Track and manage your complaints'}
        </p>
      </div>

      {/* Stat Cards */}
      {stats && (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <StatCard label="Total"       value={stats.total}      color="#1E3A5F" icon="📋" />
          <StatCard label="Pending"     value={stats.pending}    color="#FFA500" icon="⏳" />
          <StatCard label="In Progress" value={stats.inProgress} color="#2196F3" icon="🔄" />
          <StatCard label="Resolved"    value={stats.resolved}   color="#4CAF50" icon="✅" />
          {user.role === 'admin' && (
            <StatCard label="Rejected" value={stats.rejected} color="#F44336" icon="❌" />
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <Link to="/submit" style={styles.actionBtn}>
          ➕ Submit New Complaint
        </Link>
        <Link to="/my-complaints" style={{ ...styles.actionBtn, background: '#2C5F8A' }}>
          📋 View My Complaints
        </Link>
        {user.role === 'admin' && (
          <Link to="/admin" style={{ ...styles.actionBtn, background: '#27ae60' }}>
            🛠️ Admin Panel
          </Link>
        )}
      </div>

      {/* Recent Complaints */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <h2 style={{ color: '#1E3A5F', marginBottom: '1rem', fontSize: '18px' }}>
          🕐 Recent Complaints
        </h2>
        {recentComplaints.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>
            No complaints yet. <Link to="/submit">Submit your first complaint</Link>
          </p>
        ) : (
          recentComplaints.map(c => (
            <Link to={`/complaint/${c._id}`} key={c._id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 0', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}>
                <div>
                  <p style={{ fontWeight: '600', marginBottom: '2px' }}>{c.title}</p>
                  <p style={{ fontSize: '12px', color: '#999' }}>
                    {c.category} • {new Date(c.createdAt).toLocaleDateString()}
                    {user.role === 'admin' && c.user && ` • ${c.user.name}`}
                  </p>
                </div>
                <span style={{ background: statusColor[c.status], color: '#fff',
                  padding: '4px 12px', borderRadius: '20px', fontSize: '12px', whiteSpace: 'nowrap' }}>
                  {c.status}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  actionBtn: { background: '#1E3A5F', color: '#fff', padding: '12px 20px', borderRadius: '8px',
    textDecoration: 'none', fontWeight: '600', fontSize: '14px', display: 'inline-block' },
};

export default DashboardPage;
