import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { policyAPI } from '../../services/api';

const PolicyActions = ({ policy, refresh }) => {
  const { user } = useAuth();
  const [actionError, setActionError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if user has permission
  const canSubmit = user?.role === 'UNDERWRITER';
  const canApprove = user?.role === 'UNDERWRITER';

  const handleApprove = async () => {
    setActionError('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      await policyAPI.approvePolicy(policy._id);
      setSuccessMsg('Policy approved successfully. Risk allocation has been auto-calculated.');
      setTimeout(() => refresh(), 1000);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to approve policy');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setActionError('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      await policyAPI.submitPolicy(policy._id);
      setSuccessMsg('Policy submitted for approval. An underwriter will review it soon.');
      setTimeout(() => refresh(), 1000);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to submit policy');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!canSubmit && !canApprove) {
    return (
      <div className="card mt-6 bg-amber-50 border-l-4 border-amber-500">
        <p className="text-sm text-amber-800">You do not have permission to manage policies. Only Underwriters can create and approve policies.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {actionError && (
        <div className="alert alert-error mb-4">
          {actionError}
        </div>
      )}
      {successMsg && (
        <div className="alert alert-success mb-4">
          {successMsg}
        </div>
      )}
      
      <div className="card">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Policy Actions 📋</h3>
        
        {policy.status === 'DRAFT' && canSubmit && (
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`btn btn-primary ${isLoading ? 'btn-disabled' : ''}`}
          >
            {isLoading ? 'Submitting...' : 'Submit for Approval'}
          </button>
        )}
        
        {policy.status === 'SUBMITTED' && canApprove && (
          <button
            onClick={handleApprove}
            disabled={isLoading}
            className={`btn btn-success ${isLoading ? 'btn-disabled' : ''}`}
          >
            {isLoading ? 'Approving...' : 'Approve Policy & Allocate Risk'}
          </button>
        )}
        
        {policy.status === 'ACTIVE' && (
          <div className="inline-block bg-success-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
            ✓ Policy Active & Risk Allocated
          </div>
        )}

        {policy.status === 'DRAFT' && !canSubmit && (
          <p className="text-sm text-slate-500 italic">Policy is in draft. Only Underwriters can submit it for approval.</p>
        )}

        {policy.status === 'SUBMITTED' && !canApprove && (
          <p className="text-sm text-slate-500 italic">Policy is awaiting Underwriter approval. Risk allocation will occur when approved.</p>
        )}
      </div>
    </div>
  );
};
export default PolicyActions;
