import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { claimAPI } from '../../services/api';
import ClaimActions from './ClaimActions';

const ClaimDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchClaim = async () => {
    try {
      const res = await claimAPI.getClaimById(id);
      setClaim(res.data);
    } catch (err) {
      setError('Failed to load claim details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaim();
    // eslint-disable-next-line
  }, [id]);

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
  if (!claim) return <div style={{ padding: '20px' }}>Claim not found</div>;

  const getStatusBadge = (status) => {
    const colors = {
      'SUBMITTED': '#2196F3',
      'IN_REVIEW': '#FF9800',
      'APPROVED': '#4CAF50',
      'REJECTED': '#F44336',
      'SETTLED': '#9C27B0'
    };
    return (
      <span style={{ padding: '6px 14px', backgroundColor: colors[status] || '#999', color: 'white', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
        {status}
      </span>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate('/claims')} style={{ marginBottom: '20px', padding: '8px 16px', backgroundColor: '#f0f0f0', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>
        Back to Claims
      </button>

      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ marginTop: 0 }}>Claim Details</h2>
          {getStatusBadge(claim.status)}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Claim Number:</label>
            <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px', marginBottom: '15px' }}>{claim.claimNumber}</div>

            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Related Policy:</label>
            <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px', marginBottom: '15px' }}>{claim.policyId?.policyNumber || '-'}</div>

            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Claim Amount:</label>
            <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px', marginBottom: '15px', fontSize: '16px', fontWeight: 'bold', color: '#d32f2f' }}>
              ₹{claim.claimAmount?.toFixed(2) || 0}
            </div>

            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Incident Date:</label>
            <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px', marginBottom: '15px' }}>
              {claim.incidentDate ? new Date(claim.incidentDate).toLocaleDateString() : '-'}
            </div>
          </div>

          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Approved Amount:</label>
            <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px', marginBottom: '15px', fontSize: '16px', fontWeight: 'bold', color: '#388e3c' }}>
              ₹{claim.approvedAmount?.toFixed(2) || 'Pending'}
            </div>

            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Reported Date:</label>
            <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px', marginBottom: '15px' }}>
              {claim.reportedDate ? new Date(claim.reportedDate).toLocaleDateString() : '-'}
            </div>

            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Handled By:</label>
            <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px', marginBottom: '15px' }}>
              {claim.handledBy?.username || '-'}
            </div>
          </div>
        </div>

        {claim.remarks && (
          <div style={{ marginTop: '20px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Remarks:</label>
            <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '4px', lineHeight: '1.5' }}>{claim.remarks}</div>
          </div>
        )}
      </div>

      <ClaimActions claim={claim} refresh={fetchClaim} />
    </div>
  );
};

export default ClaimDetails;
