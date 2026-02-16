import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { claimAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const ClaimsList = () => {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await claimAPI.getClaims();
        setClaims(res.data);
      } catch (err) {
        setError('Failed to load claims.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'SUBMITTED': '#2196F3',
      'IN_REVIEW': '#FF9800',
      'APPROVED': '#4CAF50',
      'REJECTED': '#F44336',
      'SETTLED': '#9C27B0'
    };
    return colors[status] || '#999';
  };

  const filteredClaims = filter === 'ALL' ? claims : claims.filter(c => c.status === filter);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this claim?')) return;
    try {
      await claimAPI.deleteClaim(id);
      setClaims(claims.filter(c => c._id !== id));
    } catch (err) {
      setError('Failed to delete claim.');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading claims...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Claims Management</h2>
        {user?.role !== 'ADMIN' && (
          <Link to="/claims/create" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            File New Claim
          </Link>
        )}
      </div>

      {error && <div style={{ padding: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '20px' }}>{error}</div>}
      
      <div style={{ marginBottom: '20px' }}>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd' }}>
          <option value="ALL">All Claims</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="IN_REVIEW">In Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="SETTLED">Settled</option>
        </select>
      </div>

      {filteredClaims.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          No claims found
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Claim Number</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Policy</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Amount</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Reported Date</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClaims.map(claim => (
              <tr key={claim._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>{claim.claimNumber}</td>
                <td style={{ padding: '12px' }}>{claim.policyId?.policyNumber || '-'}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>₹{claim.claimAmount?.toFixed(2) || 0}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: getStatusColor(claim.status), color: 'white', borderRadius: '4px', fontSize: '12px' }}>
                    {claim.status}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>{claim.reportedDate ? new Date(claim.reportedDate).toLocaleDateString() : '-'}</td>
                <td style={{ padding: '12px' }}>
                  <Link to={`/claims/${claim._id}`} style={{ color: '#007bff', textDecoration: 'none', marginRight: 12 }}>View Details</Link>
                  {user?.role === 'CLAIMS_ADJUSTER' && (
                    <button onClick={() => handleDelete(claim._id)} style={{ color: 'white', background: '#e53935', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClaimsList;
