import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserList from '../features/admin/UserList';
import AuditLogs from '../features/admin/AuditLogs';

const AdminRoutes = () => (
  <Routes>
    <Route path="" element={<UserList />} />
    <Route path="audit-logs" element={<AuditLogs />} />
    {/* Add RoleMatrix, PermissionEditor, TreatyConfiguration, ThresholdConfig routes here */}
  </Routes>
);

export default AdminRoutes;
