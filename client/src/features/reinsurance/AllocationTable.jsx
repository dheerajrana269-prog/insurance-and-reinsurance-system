import React, { useEffect, useState } from 'react';
import { reinsuranceAPI } from '../../services/api';

const AllocationTable = ({ policyId }) => {
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
        setError('Failed to load allocations');
      }
    };
    if (policyId) fetchAllocations();
  }, [policyId]);

  // Validation: check if allocated exceeds treaty limit
  const validateAllocations = () => {
    let exceeded = false;
    allocations.forEach(a => {
      if (a.allocatedAmount > a.treatyId?.treatyLimit) exceeded = true;
    });
    return exceeded;
  };

  if (!policyId) return <div>Select a policy to view allocations.</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Risk Allocation Table</h3>
      {validateAllocations() && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          One or more allocations exceed treaty limits!
        </div>
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Reinsurer</th>
            <th>Treaty</th>
            <th>Allocated Amount</th>
            <th>Allocated %</th>
            <th>Treaty Limit</th>
          </tr>
        </thead>
        <tbody>
          {allocations.map((a, idx) => (
            <tr key={idx}>
              <td>{a.reinsurerId?.name || 'N/A'}</td>
              <td>{a.treatyId?.treatyName || 'N/A'}</td>
              <td>{a.allocatedAmount}</td>
              <td>{a.allocatedPercentage}%</td>
              <td>{a.treatyId?.treatyLimit}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '10px' }}>
        <strong>Retained Amount:</strong> {retainedAmount}
      </div>
    </div>
  );
};

export default AllocationTable;
