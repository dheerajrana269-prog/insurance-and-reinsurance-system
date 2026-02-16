import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserList from '../features/admin/UserList';

const AdminRoutes = () => (
  <Routes>
    <Route path="" element={<UserList />} />
    {/* Add RoleMatrix, PermissionEditor, TreatyConfiguration, ThresholdConfig routes here */}
  </Routes>
);

export default AdminRoutes;
