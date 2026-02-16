import React, { useEffect, useState } from 'react';
import { reinsuranceAPI } from '../../services/api';
import AddTreatyForm from './AddTreatyForm';
import AddTreatyModal from './AddTreatyModal';


const TreatyList = () => {
  const [treaties, setTreaties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchTreaties = async () => {
    try {
      const res = await reinsuranceAPI.getTreaties();
      setTreaties(res.data);
    } catch (err) {
      setError('Failed to load treaties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreaties();
  }, []);


  if (loading) return <div style={{ padding: '20px' }}>Loading treaties...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Reinsurance Treaties</h2>
      <button
        className="btn btn-primary"
        style={{ marginBottom: 16 }}
        onClick={() => setShowModal(true)}
      >
        Add New Treaty
      </button>
      <AddTreatyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreated={() => { setShowModal(false); fetchTreaties(); }}
        AddTreatyForm={AddTreatyForm}
      />
      {error && <div style={{ padding: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '20px' }}>{error}</div>}

      {treaties.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          No treaties configured
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Treaty Name</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Type</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Reinsurer</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Share %</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {treaties.map(treaty => (
              <tr key={treaty._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>{treaty.treatyName}</td>
                <td style={{ padding: '12px' }}>{treaty.treatyType}</td>
                <td style={{ padding: '12px' }}>{treaty.reinsurerId?.name || 'N/A'}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>{treaty.sharePercentage}%</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: treaty.status === 'ACTIVE' ? '#4CAF50' : '#999', color: 'white', borderRadius: '4px', fontSize: '12px' }}>
                    {treaty.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TreatyList;
