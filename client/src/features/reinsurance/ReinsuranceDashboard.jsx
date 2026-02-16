import React, { useState, useEffect } from 'react';
import TreatyList from './TreatyList';
import AllocationTable from './AllocationTable';
import AllocationSummary from './AllocationSummary';

import { policyAPI, reinsuranceAPI } from '../../services/api';
import AddReinsurerModal from './AddReinsurerModal';

const ReinsuranceDashboard = () => {
  const [selectedPolicyId, setSelectedPolicyId] = useState('');
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReinsurerModal, setShowReinsurerModal] = useState(false);
  const [reinsurerSuccess, setReinsurerSuccess] = useState('');
  const [reinsurerError, setReinsurerError] = useState('');

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await policyAPI.getPolicies();
        setPolicies(res.data.filter(p => p.status === 'ACTIVE'));
      } catch (err) {
        setError('Failed to load policies');
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  const handleCreateReinsurer = async (data) => {
    setReinsurerError('');
    setReinsurerSuccess('');
    try {
      await reinsuranceAPI.createReinsurer(data);
      setReinsurerSuccess('Reinsurer created successfully!');
    } catch (err) {
      setReinsurerError(err.response?.data?.message || 'Failed to create reinsurer');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Reinsurance Dashboard</h2>
      <button
        className="btn btn-secondary"
        style={{ marginBottom: 16 }}
        onClick={() => setShowReinsurerModal(true)}
      >
        Add Reinsurer
      </button>
      <AddReinsurerModal
        isOpen={showReinsurerModal}
        onClose={() => setShowReinsurerModal(false)}
        onCreate={handleCreateReinsurer}
      />
      {reinsurerSuccess && <div style={{ color: 'green', marginBottom: 8 }}>{reinsurerSuccess}</div>}
      {reinsurerError && <div style={{ color: 'red', marginBottom: 8 }}>{reinsurerError}</div>}
      <div style={{ margin: '20px 0' }}>
        <label htmlFor="policySelect"><strong>Select Policy:</strong> </label>
        <select
          id="policySelect"
          value={selectedPolicyId}
          onChange={e => setSelectedPolicyId(e.target.value)}
        >
          <option value="">-- Select Policy --</option>
          {policies.map(p => (
            <option key={p._id} value={p._id}>{p.policyNumber}</option>
          ))}
        </select>
      </div>
      <AllocationTable policyId={selectedPolicyId} />
      <AllocationSummary policyId={selectedPolicyId} />
      <div style={{ marginTop: '40px' }}>
        <TreatyList />
      </div>
      {loading && <div>Loading policies...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default ReinsuranceDashboard;
