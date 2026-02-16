import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../../services/api';

const RiskDistributionChart = () => {
  const [distribution, setDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDistribution = async () => {
      try {
        const res = await dashboardAPI.getReinsurerRiskDistribution();
        setDistribution(res.data);
      } catch (err) {
        setError('Failed to load risk distribution data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDistribution();
  }, []);

  if (loading) return <div className="card"><div className="animate-pulse space-y-3"><div className="h-4 bg-slate-200 rounded w-3/4"></div></div></div>;
  if (error) return <div className="card alert alert-error">{error}</div>;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Risk Distribution by Reinsurer 🔄</h3>
      <div className="overflow-x-auto">
        <table className="table-responsive">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-200">
              <th className="table-th">Reinsurer</th>
              <th className="table-th text-right">Total Allocated</th>
            </tr>
          </thead>
          <tbody>
            {distribution.length > 0 ? distribution.map((row, idx) => (
              <tr key={row._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="table-td font-medium text-slate-900">{row._id}</td>
                <td className="table-td text-right text-success-600 font-semibold">₹{row.totalAllocated?.toFixed(2) || 0}</td>
              </tr>
            )) : <tr><td colSpan="2" className="table-td text-center text-slate-500">No data available</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiskDistributionChart;
