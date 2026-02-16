import React from 'react';
import { useAuthContext } from '../context/AuthContext';

// For backward compatibility, export the hook
export const useAuth = () => {
  const context = useAuthContext();
  return {
    user: context.user,
    token: context.token,
    isLoading: context.isLoading,
    login: (userData, token) => context.login(userData, token),
    logout: context.logout
  };
};
