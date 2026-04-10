import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const messages = [
  { text: 'back again? more opportunities waiting 😊', highlight: false },
  { text: 'progress updated in real time ✅',          highlight: true  },
  { text: "you're closer than you think 🎯",           highlight: false },
];

const LoginPage = () => {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      login(data);
      toast.success(`Welcome back, ${data.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>

        {/* ── Left dark panel ────────────────────────── */}
        <div style={s.left}>
          <div>
            <div style={s.brandRow}>
              <span style={s.brandIcon}>🗂️</span>
              <span style={s.brandName}>ComplaintHub</span>
            </div>
            <h2 style={s.leftTitle}>Connect with your complaints in real time</h2>
            <p style={s.leftSub}>
              Track, manage, and resolve complaints — all in one place.
            </p>
          </div>

          {/* chat bubbles */}
          <div style={s.chatBox}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: m.highlight ? 'flex-end' : 'flex-start',
                marginBottom: '10px',
              }}>
                <div style={{
                  background: m.highlight ? '#6C63FF' : 'rgba(255,255,255,0.15)',
                  color: '#fff', padding: '8px 16px', borderRadius: '20px',
                  fontSize: '13px', maxWidth: '90%',
                }}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right white form ───────────────────────── */}
        <div style={s.right}>
          <h2 style={s.title}>Welcome back</h2>
          <p style={s.sub}>Sign in to your account to continue</p>

          <form onSubmit={handleSubmit}>
            <div style={s.field}>
              <label style={s.label}>Email Address</label>
              <input style={s.input} name="email" type="email"
                placeholder="john@example.com" autoComplete="off"
                value={form.email} onChange={handleChange} required />
            </div>

            <div style={s.field}>
              <label style={s.label}>Password</label>
              <input style={s.input} name="password" type="password"
                placeholder="Your password" autoComplete="new-password"
                value={form.password} onChange={handleChange} required />
            </div>

            <div style={{ textAlign: 'right', marginBottom: '16px', marginTop: '-6px' }}>
              <span style={{ fontSize: '12px', color: '#6C63FF', cursor: 'pointer' }}>
                Forgot password?
              </span>
            </div>

            <button
              style={{ ...s.btn, opacity: loading ? 0.75 : 1 }}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={s.footer}>
            Don't have an account?{' '}
            <Link to="/register" style={s.link}>Register</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

const s = {
  page: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: '100vh', background: '#f0f4f8', padding: '1rem',
  },
  card: {
    display: 'flex', borderRadius: '18px', overflow: 'hidden',
    boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
    width: '100%', maxWidth: '720px', minHeight: '500px',
  },

  /* left */
  left: {
    width: '42%',
    background: 'linear-gradient(155deg, #1a1a2e 0%, #16213e 55%, #0f3460 100%)',
    padding: '2.5rem 2rem',
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    color: '#fff',
  },
  brandRow:  { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' },
  brandIcon: { fontSize: '22px' },
  brandName: { fontWeight: '700', fontSize: '15px' },
  leftTitle: { fontSize: '21px', fontWeight: '700', lineHeight: '1.35', marginBottom: '10px' },
  leftSub:   { fontSize: '13px', color: 'rgba(255,255,255,0.58)', lineHeight: '1.65' },
  chatBox:   { paddingTop: '2rem' },

  /* right */
  right: {
    width: '58%', background: '#fff',
    padding: '3rem 2.5rem',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
  },
  title: { fontSize: '24px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 4px' },
  sub:   { fontSize: '13px', color: '#aaa', marginBottom: '2rem' },
  field: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '6px' },
  input: {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid #ebebeb', borderRadius: '8px',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    background: '#fafafa', color: '#333',
  },
  btn: {
    width: '100%', padding: '13px',
    background: '#6C63FF', color: '#fff',
    border: 'none', borderRadius: '8px',
    fontSize: '15px', fontWeight: '700', cursor: 'pointer',
    letterSpacing: '0.3px',
  },
  footer: { textAlign: 'center', marginTop: '1.5rem', fontSize: '13px', color: '#999' },
  link:   { color: '#6C63FF', fontWeight: '700', textDecoration: 'none' },
};

export default LoginPage;
