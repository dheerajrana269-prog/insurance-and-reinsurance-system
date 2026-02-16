import React, { useEffect, useState } from 'react';
import { reinsuranceAPI } from '../../services/api';

const AllocationSummary = ({ policyId }) => {
  const [allocations, setAllocations] = useState([]);
  const [retainedAmount, setRetainedAmount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllocations = async () => {
      try {
        const res = await reinsuranceAPI.getRiskAllocations(policyId);
        if (res.data.length > 0) {
          setAllocations(res.data[0].allocations);
          setRetainedAmount(res.data[0].retainedAmount);
        } else {
          setAllocations([]);
          setRetainedAmount(0);
        }
      } catch (err) {
        setError('Failed to load summary');
      }
    };
    if (policyId) fetchAllocations();
  }, [policyId]);

  const cededAmount = allocations.reduce((sum, a) => sum + (a.allocatedAmount || 0), 0);

  if (!policyId) return <div>Select a policy to view summary.</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Allocation Summary</h3>
      <div style={{ display: 'flex', gap: '40px', marginTop: '10px' }}>
        <div style={{ background: '#e3f2fd', padding: '16px', borderRadius: '8px', minWidth: '120px' }}>
          <strong>Retained Risk:</strong>
          <div style={{ fontSize: '20px', color: '#1976d2' }}>{retainedAmount}</div>
        </div>
        <div style={{ background: '#fff3e0', padding: '16px', borderRadius: '8px', minWidth: '120px' }}>
          <strong>Ceded Risk:</strong>
          <div style={{ fontSize: '20px', color: '#f57c00' }}>{cededAmount}</div>
        </div>
      </div>
    </div>
  );
};

export default AllocationSummary;
