import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

// ── Stat Card ─────────────────────────────────────────────────────────────
const StatCard = ({ label, value, color, icon }) => (
  <div style={{
    background: '#fff', borderRadius: '12px', padding: '1.5rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)', borderTop: `4px solid ${color}`,
    flex: '1', minWidth: '140px', textAlign: 'center',
  }}>
    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
    <div style={{ fontSize: '28px', fontWeight: '700', color }}>{value}</div>
    <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>{label}</div>
  </div>
);

// ── Status color map ───────────────────────────────────────────────────────
const statusColor = {
  Pending: '#FFA500', 'In Progress': '#2196F3',
  Resolved: '#4CAF50', Rejected: '#F44336',
};

// ══════════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ══════════════════════════════════════════════════════════════════════════
const AdminDashboardHome = () => {
  const [stats, setStats]   = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    API.get('/complaints/stats').then(({ data }) => setStats(data));
    API.get('/complaints/all').then(({ data }) => setRecent(data.slice(0, 6)));
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Header */}
      <div style={s.pageHeader}>
        <div style={{ background: '#FFD700', borderRadius: '50%', width: '56px', height: '56px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
          👨‍💼
        </div>
        <div>
          <h1 style={{ color: '#1E3A5F', fontSize: '26px', margin: 0 }}>Admin Dashboard</h1>
          <p style={{ color: '#888', margin: '4px 0 0', fontSize: '14px' }}>
            Manage all complaints and user registrations
          </p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <StatCard label="Total Complaints" value={stats.total}      color="#1E3A5F" icon="📋" />
          <StatCard label="Pending"          value={stats.pending}    color="#FFA500" icon="⏳" />
          <StatCard label="In Progress"      value={stats.inProgress} color="#2196F3" icon="🔄" />
          <StatCard label="Resolved"         value={stats.resolved}   color="#4CAF50" icon="✅" />
          <StatCard label="Rejected"         value={stats.rejected}   color="#F44336" icon="❌" />
        </div>
      )}

      {/* Quick Action */}
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/admin" style={s.primaryBtn}>
          🛠️ Go to Manage Complaints
        </Link>
      </div>

      {/* Recent Complaints */}
      <div style={s.card}>
        <h2 style={s.cardTitle}>🕐 Recent Complaints from Users</h2>
        {recent.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>
            No complaints submitted yet.
          </p>
        ) : (
          recent.map(c => (
            <div key={c._id} style={s.complaintRow}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <p style={{ fontWeight: '600', margin: 0, fontSize: '15px' }}>{c.title}</p>
                  <span style={{ fontSize: '12px', background: '#f0f4f8', color: '#555',
                    padding: '2px 8px', borderRadius: '10px' }}>{c.category}</span>
                </div>
                <p style={{ fontSize: '12px', color: '#999', margin: '4px 0 0' }}>
                  👤 {c.user?.name} • 📧 {c.user?.email} • 📅 {new Date(c.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span style={{
                background: statusColor[c.status], color: '#fff',
                padding: '5px 14px', borderRadius: '20px',
                fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap',
              }}>
                {c.status}
              </span>
            </div>
          ))
        )}
        {recent.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link to="/admin" style={{ color: '#1E3A5F', fontWeight: '600', fontSize: '14px' }}>
              View all complaints →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// USER DASHBOARD
// ══════════════════════════════════════════════════════════════════════════
const UserDashboardHome = ({ user }) => {
  const [stats, setStats]   = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    API.get('/complaints/my').then(({ data }) => {
      setRecent(data.slice(0, 5));
      setStats({
        total:      data.length,
        pending:    data.filter(c => c.status === 'Pending').length,
        inProgress: data.filter(c => c.status === 'In Progress').length,
        resolved:   data.filter(c => c.status === 'Resolved').length,
      });
    });
  }, []);

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Header */}
      <div style={s.pageHeader}>
        <div style={{ background: '#e8f4fd', borderRadius: '50%', width: '56px', height: '56px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
          👋
        </div>
        <div>
          <h1 style={{ color: '#1E3A5F', fontSize: '26px', margin: 0 }}>
            Welcome, {user.name}!
          </h1>
          <p style={{ color: '#888', margin: '4px 0 0', fontSize: '14px' }}>
            Track and manage your complaints here
          </p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <StatCard label="Total"       value={stats.total}      color="#1E3A5F" icon="📋" />
          <StatCard label="Pending"     value={stats.pending}    color="#FFA500" icon="⏳" />
          <StatCard label="In Progress" value={stats.inProgress} color="#2196F3" icon="🔄" />
          <StatCard label="Resolved"    value={stats.resolved}   color="#4CAF50" icon="✅" />
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <Link to="/submit"        style={s.primaryBtn}>➕ Submit New Complaint</Link>
        <Link to="/my-complaints" style={s.secondaryBtn}>📋 View All My Complaints</Link>
      </div>

      {/* Recent Complaints */}
      <div style={s.card}>
        <h2 style={s.cardTitle}>🕐 My Recent Complaints</h2>
        {recent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#888', fontSize: '16px' }}>No complaints yet.</p>
            <Link to="/submit" style={{ color: '#1E3A5F', fontWeight: '600' }}>
              Submit your first complaint →
            </Link>
          </div>
        ) : (
          recent.map(c => (
            <Link to={`/complaint/${c._id}`} key={c._id}
              style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={s.complaintRow}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '600', margin: 0, fontSize: '15px' }}>{c.title}</p>
                  <p style={{ fontSize: '12px', color: '#999', margin: '4px 0 0' }}>
                    📁 {c.category} • 📅 {new Date(c.createdAt).toLocaleDateString()}
                    {c.adminComment && <span style={{ color: '#1565C0' }}> • 💬 Admin replied</span>}
                  </p>
                </div>
                <span style={{
                  background: statusColor[c.status], color: '#fff',
                  padding: '5px 14px', borderRadius: '20px',
                  fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap',
                }}>
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

// ══════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD — decides which to show
// ══════════════════════════════════════════════════════════════════════════
const DashboardPage = () => {
  const { user } = useAuth();
  if (user.role === 'admin') return <AdminDashboardHome />;
  return <UserDashboardHome user={user} />;
};

// ── Shared styles ──────────────────────────────────────────────────────────
const s = {
  pageHeader: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    marginBottom: '2rem',
  },
  card: {
    background: '#fff', borderRadius: '12px', padding: '1.5rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  cardTitle: {
    color: '#1E3A5F', marginBottom: '1rem', fontSize: '18px', fontWeight: '700',
  },
  complaintRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 0', borderBottom: '1px solid #f0f0f0',
    gap: '1rem', flexWrap: 'wrap',
  },
  primaryBtn: {
    background: '#1E3A5F', color: '#fff', padding: '12px 20px',
    borderRadius: '8px', textDecoration: 'none', fontWeight: '600',
    fontSize: '14px', display: 'inline-block',
  },
  secondaryBtn: {
    background: '#2C5F8A', color: '#fff', padding: '12px 20px',
    borderRadius: '8px', textDecoration: 'none', fontWeight: '600',
    fontSize: '14px', display: 'inline-block',
  },
};

export default DashboardPage;
