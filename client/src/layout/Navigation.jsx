import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname.startsWith(path);


  let menuItems = [];
  if (user?.role === 'ADMIN') {
    menuItems.push({ label: 'Users List', path: '/admin', icon: '⚙️' });
    menuItems.push({ label: 'Audit Logs', path: '/admin/audit-logs', icon: '📜' });
    menuItems.push({ label: 'Policies', path: '/policy', icon: '📋' });
    menuItems.push({ label: 'Claims', path: '/claims', icon: '💼' });
    menuItems.push({ label: 'Reinsurance', path: '/reinsurance', icon: '🔄' });
  } else if (user?.role === 'UNDERWRITER') {
    menuItems.push({ label: 'Policies', path: '/policy', icon: '📋' });
  } else if (user?.role === 'CLAIMS_ADJUSTER') {
    menuItems.push({ label: 'Policies', path: '/policy', icon: '📋' });
    menuItems.push({ label: 'Claims', path: '/claims', icon: '💼' });
  } else if (user?.role === 'REINSURANCE_MANAGER') {
    menuItems.push({ label: 'Policies', path: '/policy', icon: '📋' });
    menuItems.push({ label: 'Reinsurance', path: '/reinsurance', icon: '🔄' });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            <span className="text-lg font-bold text-slate-900">InsureHub</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-sm">
              <div className="font-medium text-slate-900">{user?.username}</div>
              <div className="text-xs text-slate-500">{user?.role?.replace(/_/g, ' ')}</div>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary text-sm"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full btn btn-secondary text-sm text-left"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
