import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ClaimsList from '../features/claims/ClaimsList';
import ClaimDetails from '../features/claims/ClaimDetails';
import ClaimCreateForm from '../features/claims/ClaimCreateForm';
import { useAuth } from '../hooks/useAuth';

const NotAuthorized = () => (
  <div className="p-8 text-center text-red-600 font-semibold">You are not authorized to view this page.</div>
);

const ClaimsRoutes = () => {
  const { user } = useAuth();
  if (user?.role === 'UNDERWRITER') {
    return <NotAuthorized />;
  }
  return (
    <Routes>
      <Route path="" element={<ClaimsList />} />
      <Route path=":id" element={<ClaimDetails />} />
      <Route path="create" element={<ClaimCreateForm />} />
    </Routes>
  );
};

export default ClaimsRoutes;
