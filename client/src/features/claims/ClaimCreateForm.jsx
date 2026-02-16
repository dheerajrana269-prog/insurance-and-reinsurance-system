import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { policyAPI, claimAPI } from '../../services/api';

const ClaimCreateForm = () => {
  const [policies, setPolicies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [form, setForm] = useState({
    policyId: '',
    claimAmount: '',
    incidentDate: '',
    reportedDate: '',
    remarks: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await policyAPI.getPolicies();
        setPolicies(res.data.filter(p => p.status === 'ACTIVE'));
      } catch (err) {
        setError('Failed to load policies');
        console.error(err);
      }
    };
    fetchPolicies();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'policyId') {
      const policy = policies.find(p => p._id === value);
      setSelectedPolicy(policy);
    }
    setForm({ ...form, [name]: value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.policyId || !form.claimAmount || !form.incidentDate) {
      setError('Please fill in all required fields');
      return;
    }
    setIsLoading(true);
    try {
      await claimAPI.createClaim({
        ...form,
        claimAmount: parseFloat(form.claimAmount)
      });
      navigate('/claims');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create claim');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">File New Claim</h2>
      
      {error && (
        <div className="alert alert-error mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="policyId" className="block text-sm font-medium text-slate-700 mb-2">
            Active Policy *
          </label>
          <select
            id="policyId"
            name="policyId"
            value={form.policyId}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">-- Select a Policy --</option>
            {policies.length > 0 ? policies.map(policy => (
              <option key={policy._id} value={policy._id}>
                {policy.policyNumber} - {policy.insuredName} (Coverage: ₹{policy.sumInsured})
              </option>
            )) : <option disabled>No active policies available</option>}
          </select>
        </div>

        {selectedPolicy && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-800">
              <strong>Policy Coverage:</strong> ₹{selectedPolicy.sumInsured}
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Claim amount cannot exceed the policy coverage limit
            </p>
          </div>
        )}

        <div>
          <label htmlFor="claimAmount" className="block text-sm font-medium text-slate-700 mb-2">
            Claim Amount (₹) *
            {selectedPolicy && <span className="text-xs text-slate-500 ml-1">(Max: ₹{selectedPolicy.sumInsured})</span>}
          </label>
          <input
            id="claimAmount"
            type="number"
            name="claimAmount"
            placeholder="Enter claim amount"
            value={form.claimAmount}
            onChange={handleChange}
            max={selectedPolicy?.sumInsured}
            className="input"
            required
          />
        </div>

        <div>
          <label htmlFor="incidentDate" className="block text-sm font-medium text-slate-700 mb-2">
            Incident Date *
          </label>
          <input
            id="incidentDate"
            type="date"
            name="incidentDate"
            value={form.incidentDate}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div>
          <label htmlFor="reportedDate" className="block text-sm font-medium text-slate-700 mb-2">
            Reported Date
          </label>
          <input
            id="reportedDate"
            type="date"
            name="reportedDate"
            value={form.reportedDate}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label htmlFor="remarks" className="block text-sm font-medium text-slate-700 mb-2">
            Remarks
          </label>
          <textarea
            id="remarks"
            name="remarks"
            placeholder="Enter any additional remarks"
            value={form.remarks}
            onChange={handleChange}
            className="input min-h-32"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/claims')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`btn btn-success ₹{isLoading ? 'btn-disabled' : ''}`}
          >
            {isLoading ? 'Submitting...' : 'File Claim'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClaimCreateForm;
