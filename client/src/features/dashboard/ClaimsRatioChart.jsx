import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../../services/api';

const ClaimsRatioChart = ({ filterLob }) => {
  const [ratio, setRatio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRatio = async () => {
      try {
        const res = await dashboardAPI.getClaimsRatio();
        setRatio(res.data.claimsRatio);
      } catch (err) {
        setError('Failed to load claims ratio');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRatio();
  }, [filterLob]);

  if (loading) return <div className="card"><div className="animate-pulse space-y-3"><div className="h-4 bg-slate-200 rounded w-3/4"></div></div></div>;
  if (error) return <div className="card alert alert-error">{error}</div>;

  return (
    <div className="card bg-gradient-to-br from-primary-50 to-primary-100">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Claims Ratio 📈</h3>
      <div className="text-center">
        <div className="text-5xl font-bold text-primary-600 mb-2">
          {ratio !== null ? (ratio * 100).toFixed(2) : '--'}%
        </div>
        <p className="text-sm text-slate-600">Claims to Premium Ratio</p>
      </div>
    </div>
  );
};

export default ClaimsRatioChart;
