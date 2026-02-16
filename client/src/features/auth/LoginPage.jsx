import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import { authAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await authAPI.login(username, password);
      // Patch: ensure user object has _id for backend compatibility
      const userObj = {
        ...res.data.user,
        _id: res.data.user.id // backend returns 'id', but MongoDB uses '_id'
      };
      login(userObj, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-slate-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <span className="text-3xl font-bold text-white">I</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">InsureHub</h1>
          <p className="text-slate-600 mt-2">Insurance & Reinsurance Management</p>
        </div>

        {/* Login Form Card */}
        <div className="card-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input"
                required
              />
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full btn btn-primary ${isLoading ? 'btn-disabled' : ''}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-600 text-center mb-3">Demo Credentials</p>
            <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg">
              <p><strong>Admin:</strong> admin1 / password123</p>
              <p><strong>UNDERWRITER:</strong> underwriter1 / password123</p>
              <p><strong>Claims Adjuster:</strong> claimsadjuster1 / password123</p>
              <p><strong>Reinsurance Manager:</strong> reinsurance1 / password123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-6">
          © 2026 InsureHub. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
