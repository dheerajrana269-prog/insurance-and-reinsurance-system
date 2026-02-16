import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { claimAPI } from '../../services/api';

const ClaimActions = ({ claim, refresh }) => {
  const { user } = useAuth();
  const [actionError, setActionError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [approvedAmount, setApprovedAmount] = useState(claim.approvedAmount || claim.claimAmount);
  
  // Check if user has permission to perform claim actions
  const canReview = user?.role === 'CLAIMS_ADJUSTER';
  const canApprove = user?.role === 'CLAIMS_ADJUSTER';
  const canReject = user?.role === 'CLAIMS_ADJUSTER';
  const canSettle = user?.role === 'CLAIMS_ADJUSTER';

  const handleReview = async () => {
    setActionError('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      await claimAPI.reviewClaim(claim._id);
      setSuccessMsg('Claim moved to In Review status');
      setTimeout(() => refresh(), 1000);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to review claim');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    setActionError('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      await claimAPI.approveClaim(claim._id, { approvedAmount: parseFloat(approvedAmount) });
      setSuccessMsg('Claim approved successfully');
      setTimeout(() => refresh(), 1000);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to approve claim');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (window.confirm('Are you sure you want to reject this claim?')) {
      setActionError('');
      setSuccessMsg('');
      setIsLoading(true);
      try {
        await claimAPI.rejectClaim(claim._id);
        setSuccessMsg('Claim rejected');
        setTimeout(() => refresh(), 1000);
      } catch (err) {
        setActionError(err.response?.data?.message || 'Failed to reject claim');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSettle = async () => {
    if (window.confirm('Mark this claim as settled?')) {
      setActionError('');
      setSuccessMsg('');
      setIsLoading(true);
      try {
        await claimAPI.settleClaim(claim._id);
        setSuccessMsg('Claim settled successfully');
        setTimeout(() => refresh(), 1000);
      } catch (err) {
        setActionError(err.response?.data?.message || 'Failed to settle claim');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!canReview && !canApprove && !canReject && !canSettle) {
    return (
      <div className="card mt-6 bg-amber-50 border-l-4 border-amber-500">
        <p className="text-sm text-amber-800">You do not have permission to manage claims.</p>
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
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Claim Actions ⚙️</h3>

        {claim.status === 'SUBMITTED' && canReview && (
          <button
            onClick={handleReview}
            disabled={isLoading}
            className={`btn btn-warning ${isLoading ? 'btn-disabled' : ''}`}
          >
            {isLoading ? 'Processing...' : 'Move to Review'}
          </button>
        )}

        {claim.status === 'IN_REVIEW' && canApprove && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Approved Amount (₹)
                <span className="text-xs text-slate-500 ml-1">Max: ₹{claim.claimAmount}</span>
              </label>
              <input
                type="number"
                value={approvedAmount}
                onChange={e => setApprovedAmount(e.target.value)}
                max={claim.claimAmount}
                className="input sm:w-48"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleApprove}
                disabled={isLoading}
                className={`btn btn-success ${isLoading ? 'btn-disabled' : ''}`}
              >
                {isLoading ? 'Approving...' : 'Approve Claim'}
              </button>
              <button
                onClick={handleReject}
                disabled={isLoading}
                className={`btn btn-danger ${isLoading ? 'btn-disabled' : ''}`}
              >
                {isLoading ? 'Processing...' : 'Reject Claim'}
              </button>
            </div>
          </div>
        )}

        {claim.status === 'APPROVED' && canSettle && (
          <button
            onClick={handleSettle}
            disabled={isLoading}
            className={`btn btn-primary ${isLoading ? 'btn-disabled' : ''}`}
          >
            {isLoading ? 'Processing...' : 'Mark as Settled'}
          </button>
        )}

        {(claim.status === 'REJECTED' || claim.status === 'SETTLED') && (
          <div className="inline-block bg-slate-400 text-white px-4 py-2 rounded-lg text-sm font-medium">
            {claim.status === 'REJECTED' ? 'Claim Rejected' : 'Claim Settled'}
          </div>
        )}

        {!canReview && !canApprove && !canReject && !canSettle && claim.status !== 'REJECTED' && claim.status !== 'SETTLED' && (
          <p className="text-sm text-slate-500 italic">No actions available for this claim status or your role.</p>
        )}
      </div>
    </div>
  );
};
export default ClaimActions;
