import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PolicyList from '../features/policy/PolicyList';
import PolicyDetails from '../features/policy/PolicyDetails';
import CreatePolicyWizard from '../features/policy/CreatePolicyWizard';

const PolicyRoutes = () => (
  <Routes>
    <Route path="" element={<PolicyList />} />
    <Route path=":id" element={<PolicyDetails />} />
    <Route path="create" element={<CreatePolicyWizard />} />
  </Routes>
);

export default PolicyRoutes;
