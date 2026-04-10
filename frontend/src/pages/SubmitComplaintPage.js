import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api';

const SubmitComplaintPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: 'Technical', priority: 'Medium',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return toast.error('Title and description are required');
    setLoading(true);
    try {
      await API.post('/complaints', form);
      toast.success('✅ Complaint submitted! SMS & Email sent to your registered details.');
      navigate('/my-complaints');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '2rem auto', padding: '0 1rem' }}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={{ margin: 0, fontSize: '22px' }}>📝 Submit a Complaint</h2>
          <p style={{ margin: '6px 0 0', fontSize: '14px', opacity: 0.8 }}>
            You will receive SMS & Email confirmation after submission
          </p>
        </div>
        <div style={styles.cardBody}>
          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Complaint Title *</label>
              <input style={styles.input} name="title" placeholder="Brief title of your complaint"
                value={form.title} onChange={handleChange} required />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Description *</label>
              <textarea style={{ ...styles.input, height: '130px', resize: 'vertical' }}
                name="description" placeholder="Describe your complaint in detail..."
                value={form.description} onChange={handleChange} required />
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Category *</label>
                <select style={styles.input} name="category" value={form.category} onChange={handleChange}>
                  {['Technical', 'Billing', 'Service', 'Product', 'Other'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Priority *</label>
                <select style={styles.input} name="priority" value={form.priority} onChange={handleChange}>
                  {['Low', 'Medium', 'High'].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.infoBox}>
              📧 <strong>Notification:</strong> After submitting, you'll automatically receive
              a confirmation <strong>Email</strong> and <strong>SMS</strong> with your complaint ID
              and details on your registered contact information.
            </div>

            <button style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
              type="submit" disabled={loading}>
              {loading ? '⏳ Submitting...' : '🚀 Submit Complaint'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card:       { background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', overflow: 'hidden' },
  cardHeader: { background: '#1E3A5F', color: '#fff', padding: '1.5rem 2rem' },
  cardBody:   { padding: '2rem' },
  field:      { marginBottom: '18px' },
  label:      { display: 'block', fontSize: '13px', fontWeight: '600', color: '#555', marginBottom: '6px' },
  input:      { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#fafafa' },
  infoBox:    { background: '#e8f4fd', border: '1px solid #b3d9f7', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#1565C0', marginBottom: '20px', lineHeight: '1.6' },
  submitBtn:  { width: '100%', padding: '14px', background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' },
};

export default SubmitComplaintPage;
