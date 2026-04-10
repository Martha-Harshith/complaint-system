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
            <Link to="/dashboard"      style={styles.navLink}>Dashboard</Link>
            <Link to="/submit"         style={styles.navLink}>Submit Complaint</Link>
            <Link to="/my-complaints"  style={styles.navLink}>My Complaints</Link>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ ...styles.navLink, color: '#FFD700' }}>
                Admin Panel
              </Link>
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

// ─── Private Route ────────────────────────────────────────────────────────
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

// ─── Admin Route ──────────────────────────────────────────────────────────
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

// ─── App ──────────────────────────────────────────────────────────────────
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div style={{ paddingTop: '70px', minHeight: '100vh' }}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/submit"   element={<PrivateRoute><SubmitComplaintPage /></PrivateRoute>} />
            <Route path="/my-complaints" element={<PrivateRoute><MyComplaintsPage /></PrivateRoute>} />
            <Route path="/complaint/:id" element={<PrivateRoute><ComplaintDetailPage /></PrivateRoute>} />
            <Route path="/admin"    element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/"         element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
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
  brand: { color: '#fff', fontWeight: '700', fontSize: '20px', textDecoration: 'none' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  navLink: { color: '#cce4ff', fontSize: '14px', textDecoration: 'none', padding: '6px 10px',
    borderRadius: '4px', transition: 'background 0.2s' },
  userBadge: { color: '#aad4f5', fontSize: '13px', marginLeft: '8px' },
  logoutBtn: { background: '#c0392b', color: '#fff', border: 'none', padding: '6px 14px',
    borderRadius: '5px', cursor: 'pointer', fontSize: '13px', marginLeft: '4px' },
};

export default App;
