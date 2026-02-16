import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { policyAPI, claimAPI, adminAPI } from '../../services/api';
import ExposureDashboard from './ExposureDashboard';
import ClaimsRatioChart from './ClaimsRatioChart';
import RiskDistributionChart from './RiskDistributionChart';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ policies: 0, claims: 0, users: 0, loading: true });
  const [lob, setLob] = useState('ALL');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [policiesRes, claimsRes, usersRes] = await Promise.all([
          policyAPI.getPolicies(),
          claimAPI.getClaims(),
          adminAPI.getUsers()
        ]);
        setStats({
          policies: policiesRes.data.length,
          claims: claimsRes.data.length,
          users: usersRes.data.length,
          loading: false
        });
      } catch (err) {
        console.error(err);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ label, value, color, icon }) => (
    <div className={`card border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );

  // Role-specific dashboards
  const role = user?.role;

  const renderDashboard = () => {
    switch (role) {
      case 'ADMIN':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
            <p className="mb-4">Manage users, roles, and system configuration.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard label="Total Users" value={stats.loading ? '...' : stats.users} color="border-success-500" icon="👥" />
              <StatCard label="Total Policies" value={stats.loading ? '...' : stats.policies} color="border-primary-500" icon="📋" />
              <StatCard label="Total Claims" value={stats.loading ? '...' : stats.claims} color="border-warning-500" icon="💼" />
            </div>
          </div>
        );
      case 'UNDERWRITER':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Underwriter Dashboard</h2>
            <p className="mb-4">Create and approve policies. View policy analytics below.</p>
            <StatCard label="Total Policies" value={stats.loading ? '...' : stats.policies} color="border-primary-500" icon="📋" />
            {/* Add more underwriter-specific components here */}
            {/* <div className="mt-6">
              <ExposureDashboard filterLob={lob} />
            </div> */}
          </div>
        );
      case 'CLAIMS_ADJUSTER':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Claims Adjuster Dashboard</h2>
            <p className="mb-4">Review and settle claims. Claims analytics below.</p>
            {/* ClaimsRatioChart and other analytics can go here, but no stat card */}
            <div className="mt-6">
              <ClaimsRatioChart filterLob={lob} />
            </div>
          </div>
        );
      case 'REINSURANCE_MANAGER':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Reinsurance Manager Dashboard</h2>
            <p className="mb-4">Manage treaties and validate allocations. Reinsurance analytics below.</p>
            {/* Add reinsurance manager-specific components here */}
            <div className="mt-6">
              <RiskDistributionChart />
            </div>
          </div>
        );
      default:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">User Dashboard</h2>
            <p className="mb-4">Welcome to the Insurance & Reinsurance Management System.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.username}! 👋</h1>
          <p className="text-slate-600 mt-2">Insurance & Reinsurance Management System</p>
        </div>
        {renderDashboard()}
      </div>
    </div>
  );
};

export default Dashboard;
