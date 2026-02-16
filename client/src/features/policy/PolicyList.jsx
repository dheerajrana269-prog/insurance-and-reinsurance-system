import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { policyAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const PolicyList = () => {
  const { user } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await policyAPI.getPolicies();
        setPolicies(res.data);
      } catch (err) {
        setError('Failed to load policies.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'DRAFT': '#FFC107',
      'SUBMITTED': '#2196F3',
      'ACTIVE': '#4CAF50',
      'SUSPENDED': '#FF9800',
      'EXPIRED': '#F44336'
    };
    return colors[status] || '#999';
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this policy?')) return;
    try {
      await policyAPI.deletePolicy(id);
      setPolicies(policies.filter(p => p._id !== id));
    } catch (err) {
      setError('Failed to delete policy.');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading policies...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Policies</h2>
        {user?.role === 'UNDERWRITER' && (
          <Link to="/policy/create" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            Create New Policy
          </Link>
        )}
      </div>
      {/* Total policies count */}
      <div style={{ marginBottom: '16px', fontWeight: 'bold', fontSize: '16px', color: '#007bff' }}>
        Total Policies: {policies.length}
      </div>
      {error && <div style={{ padding: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '20px' }}>{error}</div>}
      {policies.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          No policies found. <Link to="/policy/create">Create one</Link>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Policy Number</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Insured Name</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Type</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Premium</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {policies.map(policy => (
              <tr key={policy._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>{policy.policyNumber}</td>
                <td style={{ padding: '12px' }}>{policy.insuredName}</td>
                <td style={{ padding: '12px' }}>{policy.lineOfBusiness}</td>
                <td style={{ padding: '12px' }}>₹{policy.premium?.toFixed(2) || 0}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: getStatusColor(policy.status), color: 'white', borderRadius: '4px', fontSize: '12px' }}>
                    {policy.status}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <Link to={`/policy/${policy._id}`} style={{ color: '#007bff', textDecoration: 'none', marginRight: 12 }}>View</Link>
                  {user?.role === 'UNDERWRITER' && (
                    <button onClick={() => handleDelete(policy._id)} style={{ color: 'white', background: '#e53935', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }}>Delete</button>
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

export default PolicyList;
