import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { policyAPI } from '../../services/api';
import PolicyActions from './PolicyActions';
import AllocationTable from '../reinsurance/AllocationTable';
import AllocationSummary from '../reinsurance/AllocationSummary';

const PolicyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPolicy = async () => {
    try {
      const res = await policyAPI.getPolicyById(id);
      setPolicy(res.data);
    } catch (err) {
      setError('Failed to load policy details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicy();
    // eslint-disable-next-line
  }, [id]);

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
  if (!policy) return <div style={{ padding: '20px' }}>Policy not found</div>;

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate('/policy')} style={{ marginBottom: '20px', padding: '8px 16px', backgroundColor: '#f0f0f0', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>
        Back to Policies
      </button>
      
      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ marginTop: 0 }}>Policy Details</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Policy Number:</label>
              <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px' }}>{policy.policyNumber}</div>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Insured Name:</label>
              <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px' }}>{policy.insuredName}</div>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Insured Type:</label>
              <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px' }}>{policy.insuredType}</div>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Line of Business:</label>
              <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px' }}>{policy.lineOfBusiness}</div>
            </div>
          </div>
          
          <div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Status:</label>
              <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px', color: '#007bff', fontWeight: 'bold' }}>{policy.status}</div>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Sum Insured:</label>
              <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px' }}>₹{policy.sumInsured?.toFixed(2) || 0}</div>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Premium:</label>
              <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px' }}>₹{policy.premium?.toFixed(2) || 0}</div>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Retention Limit:</label>
              <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px' }}>₹{policy.retentionLimit?.toFixed(2) || 0}</div>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Effective From:</label>
            <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px' }}>
              {policy.effectiveFrom ? new Date(policy.effectiveFrom).toLocaleDateString() : '-'}
            </div>
          </div>
          
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Effective To:</label>
            <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px' }}>
              {policy.effectiveTo ? new Date(policy.effectiveTo).toLocaleDateString() : '-'}
            </div>
          </div>
        </div>
      </div>
      
      <PolicyActions policy={policy} refresh={fetchPolicy} />

      {/* Show allocation only for ACTIVE policies */}
      {policy.status === 'ACTIVE' && (
        <>
          <AllocationTable policyId={policy._id} />
          <AllocationSummary policyId={policy._id} />
        </>
      )}
    </div>
  );
};

export default PolicyDetails;
