import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import RegisterPage        from './pages/RegisterPage';
import LoginPage           from './pages/LoginPage';
import DashboardPage       from './pages/DashboardPage';
import SubmitComplaintPage from './pages/SubmitComplaintPage';
import MyComplaintsPage    from './pages/MyComplaintsPage';
import AdminDashboard      from './pages/AdminDashboard';
import ComplaintDetailPage from './pages/ComplaintDetailPage';

// ─── Navbar ───────────────────────────────────────────────────────────────
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to={user ? '/dashboard' : '/login'} style={styles.brand}>
        🗂️ ComplaintHub
      </Link>

      <div style={styles.navLinks}>
        {user ? (
          <>
            {user.role === 'admin' ? (
              /* ── ADMIN NAVBAR ── */
              <>
                <Link to="/dashboard" style={styles.navLink}>🏠 Dashboard</Link>
                <Link to="/admin"     style={styles.adminLink}>🛠️ Manage Complaints</Link>
                <span style={styles.adminBadge}>👨‍💼 ADMIN</span>
              </>
            ) : (
              /* ── USER NAVBAR ── */
              <>
                <Link to="/dashboard"     style={styles.navLink}>🏠 Dashboard</Link>
                <Link to="/submit"        style={styles.navLink}>➕ Submit Complaint</Link>
                <Link to="/my-complaints" style={styles.navLink}>📋 My Complaints</Link>
              </>
            )}
            <span style={styles.userBadge}>👤 {user.name}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"    style={styles.navLink}>Login</Link>
            <Link to="/register" style={styles.navLink}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

// ─── Route Guards ─────────────────────────────────────────────────────────
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

// Prevents admin from accessing user-only pages
const UserOnlyRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div style={{ paddingTop: '65px', minHeight: '100vh' }}>
          <Routes>
            {/* Public */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login"    element={<LoginPage />} />

            {/* Shared */}
            <Route path="/dashboard"     element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/complaint/:id" element={<PrivateRoute><ComplaintDetailPage /></PrivateRoute>} />

            {/* User only — admin gets redirected to /admin */}
            <Route path="/submit"        element={<UserOnlyRoute><SubmitComplaintPage /></UserOnlyRoute>} />
            <Route path="/my-complaints" element={<UserOnlyRoute><MyComplaintsPage /></UserOnlyRoute>} />

            {/* Admin only */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}

const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    background: '#1E3A5F', padding: '0 2rem', height: '65px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
  },
  brand:     { color: '#fff', fontWeight: '700', fontSize: '20px', textDecoration: 'none' },
  navLinks:  { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' },
  navLink:   { color: '#cce4ff', fontSize: '14px', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px' },
  adminLink: { color: '#FFD700', fontSize: '14px', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', background: 'rgba(255,215,0,0.1)', fontWeight: '600' },
  adminBadge:{ background: '#FFD700', color: '#1E3A5F', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', fontWeight: '700', marginLeft: '4px' },
  userBadge: { color: '#aad4f5', fontSize: '13px', marginLeft: '8px' },
  logoutBtn: { background: '#c0392b', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '5px', cursor: 'pointer', fontSize: '13px', marginLeft: '4px' },
};

export default App;
