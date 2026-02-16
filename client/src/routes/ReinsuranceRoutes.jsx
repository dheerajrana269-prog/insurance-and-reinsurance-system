import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TreatyList from '../features/reinsurance/TreatyList';
import ReinsuranceDashboard from '../features/reinsurance/ReinsuranceDashboard';
import { useAuth } from '../hooks/useAuth';

const NotAuthorized = () => (
  <div className="p-8 text-center text-red-600 font-semibold">You are not authorized to view this page.</div>
);

const ReinsuranceRoutes = () => {
  const { user } = useAuth();
  if (user?.role === 'UNDERWRITER') {
    return <NotAuthorized />;
  }
  return (
    <Routes>
      <Route path="" element={<ReinsuranceDashboard />} />
      <Route path="treaties" element={<TreatyList />} />
    </Routes>
  );
};

export default ReinsuranceRoutes;
