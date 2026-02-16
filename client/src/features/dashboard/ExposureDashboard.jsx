import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../../services/api';

const ExposureDashboard = ({ filterLob }) => {
  const [exposure, setExposure] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExposure = async () => {
      try {
        const res = await dashboardAPI.getExposureByType();
        setExposure(res.data);
      } catch (err) {
        setError('Failed to load exposure data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExposure();
  }, []);

  if (loading) return <div className="card"><div className="animate-pulse space-y-3"><div className="h-4 bg-slate-200 rounded w-3/4"></div></div></div>;
  if (error) return <div className="card alert alert-error">{error}</div>;

  const filteredExposure = filterLob && filterLob !== 'ALL'
    ? exposure.filter(row => row._id === filterLob)
    : exposure;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Exposure by Policy Type 📊</h3>
      <div className="overflow-x-auto">
        <table className="table-responsive">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-200">
              <th className="table-th">Line of Business</th>
              <th className="table-th text-right">Total Exposure</th>
            </tr>
          </thead>
          <tbody>
            {filteredExposure.length > 0 ? filteredExposure.map((row, idx) => (
              <tr key={row._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="table-td font-medium text-slate-900">{row._id}</td>
                <td className="table-td text-right text-primary-600 font-semibold">₹{row.totalExposure?.toFixed(2) || 0}</td>
              </tr>
            )) : <tr><td colSpan="2" className="table-td text-center text-slate-500">No data available</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExposureDashboard;
