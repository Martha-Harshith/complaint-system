import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api';

const messages = [
  { text: 'welcome to the team! 👋', highlight: false },
  { text: 'excited to be here!',      highlight: true  },
  { text: 'offer on the way 🎉',      highlight: false },
];

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.phone) {
      return toast.error('All fields are required');
    }
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      await API.post('/auth/register', {
        name:     form.name,
        email:    form.email,
        password: form.password,
        phone:    form.phone,
      });
      toast.success('Account created successfully! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
            <h2 style={s.leftTitle}>Join the conversation today</h2>
            <p style={s.leftSub}>
              Create your account and start tracking complaints instantly.
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
                  fontSize: '13px', maxWidth: '85%',
                }}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right white form ───────────────────────── */}
        <div style={s.right}>
          <h2 style={s.title}>Create account</h2>
          <p style={s.sub}>Fill in the details below to get started</p>

          <form onSubmit={handleSubmit}>
            <div style={s.field}>
              <label style={s.label}>Full Name</label>
              <input style={s.input} name="name" placeholder="John Doe"
                value={form.name} onChange={handleChange} required />
            </div>

            <div style={s.field}>
              <label style={s.label}>Email Address</label>
              <input style={s.input} name="email" type="email"
                placeholder="john@example.com"
                value={form.email} onChange={handleChange} required />
            </div>

            <div style={s.field}>
              <label style={s.label}>Phone Number</label>
              <input style={s.input} name="phone" placeholder="+919876543210"
                value={form.phone} onChange={handleChange} required />
            </div>

            <div style={s.field}>
              <label style={s.label}>Password</label>
              <input style={s.input} name="password" type="password"
                placeholder="Min 6 characters"
                value={form.password} onChange={handleChange} required />
            </div>

            <div style={s.field}>
              <label style={s.label}>Confirm Password</label>
              <input style={s.input} name="confirmPassword" type="password"
                placeholder="Repeat password"
                value={form.confirmPassword} onChange={handleChange} required />
            </div>

            <button
              style={{ ...s.btn, opacity: loading ? 0.75 : 1 }}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={s.footer}>
            Already have an account?{' '}
            <Link to="/login" style={s.link}>Sign in</Link>
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
    width: '100%', maxWidth: '780px', minHeight: '560px',
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
    padding: '2.5rem 2.2rem',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
  },
  title: { fontSize: '22px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 4px' },
  sub:   { fontSize: '13px', color: '#aaa', marginBottom: '1.6rem' },
  field: { marginBottom: '13px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '5px' },
  input: {
    width: '100%', padding: '10px 13px',
    border: '1.5px solid #ebebeb', borderRadius: '8px',
    fontSize: '13px', outline: 'none', boxSizing: 'border-box',
    background: '#fafafa', color: '#333',
  },
  btn: {
    width: '100%', padding: '12px',
    background: '#6C63FF', color: '#fff',
    border: 'none', borderRadius: '8px',
    fontSize: '15px', fontWeight: '700', cursor: 'pointer',
    marginTop: '6px', letterSpacing: '0.3px',
  },
  footer: { textAlign: 'center', marginTop: '1.2rem', fontSize: '13px', color: '#999' },
  link:   { color: '#6C63FF', fontWeight: '700', textDecoration: 'none' },
};

export default RegisterPage;
