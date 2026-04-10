import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';

const statusColor   = { Pending: '#FFA500', 'In Progress': '#2196F3', Resolved: '#4CAF50', Rejected: '#F44336' };
const priorityColor = { Low: '#8BC34A', Medium: '#FF9800', High: '#F44336' };

const Row = ({ label, value }) => (
  <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', padding: '12px 0' }}>
    <span style={{ minWidth: '160px', fontWeight: '600', color: '#555', fontSize: '14px' }}>{label}</span>
    <span style={{ fontSize: '14px', color: '#333' }}>{value}</span>
  </div>
);

const ComplaintDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    API.get(`/complaints/${id}`)
      .then(({ data }) => setComplaint(data))
      .catch(() => navigate('/my-complaints'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <p style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>Loading...</p>;
  if (!complaint) return null;

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '0 1rem' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none',
        color: '#1E3A5F', cursor: 'pointer', fontSize: '14px', fontWeight: '600', marginBottom: '1rem', padding: 0 }}>
        ← Back
      </button>

      <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        {/* Header */}
        <div style={{ background: '#1E3A5F', color: '#fff', padding: '1.5rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ margin: '0 0 6px', fontSize: '20px' }}>{complaint.title}</h2>
              <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>ID: {complaint._id}</p>
            </div>
            <span style={{ background: statusColor[complaint.status], padding: '6px 16px',
              borderRadius: '20px', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap' }}>
              {complaint.status}
            </span>
          </div>
        </div>

        {/* Details */}
        <div style={{ padding: '2rem' }}>
          <Row label="Category"    value={complaint.category} />
          <Row label="Priority"    value={
            <span style={{ color: priorityColor[complaint.priority], fontWeight: '700' }}>{complaint.priority}</span>
          } />
          <Row label="Submitted"   value={new Date(complaint.createdAt).toLocaleString()} />
          {complaint.resolvedAt && <Row label="Resolved On" value={new Date(complaint.resolvedAt).toLocaleString()} />}

          <div style={{ marginTop: '1.5rem' }}>
            <p style={{ fontWeight: '600', color: '#555', fontSize: '14px', marginBottom: '8px' }}>Description</p>
            <p style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', lineHeight: '1.7',
              fontSize: '14px', color: '#444', border: '1px solid #eee' }}>
              {complaint.description}
            </p>
          </div>

          {complaint.adminComment && (
            <div style={{ marginTop: '1.5rem', background: '#e8f4fd', border: '1px solid #b3d9f7',
              borderRadius: '8px', padding: '16px' }}>
              <p style={{ fontWeight: '700', color: '#1565C0', marginBottom: '6px', fontSize: '14px' }}>
                💬 Admin Comment
              </p>
              <p style={{ color: '#333', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                {complaint.adminComment}
              </p>
            </div>
          )}

          <div style={{ marginTop: '1.5rem', background: '#f0f9f0', border: '1px solid #c8e6c9',
            borderRadius: '8px', padding: '14px', fontSize: '13px', color: '#2e7d32' }}>
            📬 You will receive SMS & Email notifications on every status update for this complaint.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailPage;
