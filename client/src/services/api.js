import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Policy endpoints
export const policyAPI = {
  getPolicies: () => api.get('/policies'),
  getPolicyById: (id) => api.get(`/policies/${id}`),
  createPolicy: (data) => api.post('/policies', data),
  updatePolicy: (id, data) => api.put(`/policies/${id}`, data),
  submitPolicy: (id) => api.post(`/policies/${id}/submit`, {}),
  approvePolicy: (id) => api.post(`/policies/${id}/approve`, {}),
  deletePolicy: (id) => api.delete(`/policies/${id}`)
};

// Claim endpoints
export const claimAPI = {
  getClaims: () => api.get('/claims'),
  getClaimById: (id) => api.get(`/claims/${id}`),
  createClaim: (data) => api.post('/claims', data),
  updateClaim: (id, data) => api.put(`/claims/${id}`, data),
  reviewClaim: (id) => api.post(`/claims/${id}/review`, {}),
  approveClaim: (id, data) => api.post(`/claims/${id}/approve`, data),
  rejectClaim: (id) => api.post(`/claims/${id}/reject`, {}),
  settleClaim: (id) => api.post(`/claims/${id}/settle`, {}),
  deleteClaim: (id) => api.delete(`/claims/${id}`)
};

// Reinsurance endpoints
export const reinsuranceAPI = {
  getTreaties: () => api.get('/reinsurance/treaties'),
  createTreaty: (data) => api.post('/reinsurance/treaties', data),
  getRiskAllocations: (policyId) => api.get(`/reinsurance/allocations/${policyId}`),
  allocateRisk: (data) => api.post('/reinsurance/allocations', data),
  getReinsurers: () => api.get('/reinsurance/reinsurers'),
  createReinsurer: (data) => api.post('/reinsurance/reinsurers', data)
};

// Dashboard endpoints
export const dashboardAPI = {
  getExposureByType: () => api.get('/dashboard/exposure-by-type'),
  getClaimsRatio: () => api.get('/dashboard/claims-ratio'),
  getReinsurerRiskDistribution: () => api.get('/dashboard/reinsurer-risk')
};

// Admin endpoints
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAuditLogs: () => api.get('/admin/audit-logs')
};

export default api;
