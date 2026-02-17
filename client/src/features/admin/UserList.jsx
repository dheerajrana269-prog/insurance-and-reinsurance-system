
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { adminAPI } from '../../services/api';

const UserForm = ({ user, onSave, onClose }) => {
  const [form, setForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'UNDERWRITER',
    status: user?.status || 'ACTIVE',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      // Only send password if creating a new user
      const payload = { ...form };
      if (user) {
        delete payload.password;
      }
      await onSave(payload);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.4)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(4px)'
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'white',
          padding: '28px',
          borderRadius: '10px',
          minWidth: '380px',
          maxWidth: '90vw',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
          {user ? 'Edit User' : 'Create New User'}
        </h3>

        {error && (
          <div style={{
            color: '#991b1b',
            backgroundColor: '#fee2e2',
            padding: '10px 12px',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '13px',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ marginBottom: '6px' }}>Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            disabled={!!user}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              opacity: user ? 0.6 : 1
            }}
          />
          {user && <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Username cannot be changed</p>}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ marginBottom: '6px' }}>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>

        {!user && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ marginBottom: '6px' }}>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ marginBottom: '6px' }}>Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="ADMIN">Admin</option>
            <option value="UNDERWRITER">Underwriter</option>
            <option value="CLAIMS_ADJUSTER">Claims Adjuster</option>
            <option value="REINSURANCE_MANAGER">Reinsurance Manager</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ marginBottom: '6px' }}>Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 20px',
              background: '#e5e7eb',
              color: '#374151',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#d1d5db'}
            onMouseOut={(e) => e.target.style.background = '#e5e7eb'}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '8px 20px',
              background: '#0284c7',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => !saving && (e.target.style.background = '#0369a1')}
            onMouseOut={(e) => !saving && (e.target.style.background = '#0284c7')}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

const UserList = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getUsers();
      setUsers(res.data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = () => {
    setEditUser(null);
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setShowForm(true);
  };

  const handleSave = async (form) => {
    if (editUser) {
      await adminAPI.updateUser(editUser._id, form);
    } else {
      await adminAPI.createUser(form);
    }
    await fetchUsers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      setError('Failed to delete user.');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '20px', height: '20px', border: '3px solid #e5e7eb', borderTop: '3px solid #0284c7', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          Loading users...
        </div>
      </div>
    );
  }

  const roleColors = {
    'ADMIN': '#F44336',
    'UNDERWRITER': '#2196F3',
    'CLAIMS_ADJUSTER': '#FF9800',
    'REINSURANCE_MANAGER': '#4CAF50'
  };

  return (
    <div style={{ padding: '24px', maxWidth: '100%' }}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ marginBottom: '8px' }}>User Management</h2>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Manage system users and their roles</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleCreate}
          style={{
            padding: '10px 20px',
            background: '#0284c7',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#0369a1';
            e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.15)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = '#0284c7';
            e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
          }}
        >
          + Create User
        </button>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #fecaca',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {users.length === 0 ? (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px dashed #d1d5db'
        }}>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>No users found. Create one to get started.</p>
        </div>
      ) : (
        <div style={{
          overflowX: 'auto',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#f3f4f6',
                borderBottom: '2px solid #e5e7eb'
              }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Username</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Email</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Role</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Status</th>
                {/* <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Last Login</th> */}
                <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr 
                  key={user._id}
                  style={{
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fafb',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#ffffff' : '#f9fafb';
                  }}
                >
                  <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>{user.username}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#6b7280' }}>{user.email}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '5px 12px',
                      backgroundColor: roleColors[user.role] || '#999',
                      color: 'white',
                      borderRadius: '5px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      {user.role.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '5px 12px',
                      backgroundColor: user.status === 'ACTIVE' ? '#d1fae5' : '#f3f4f6',
                      color: user.status === 'ACTIVE' ? '#047857' : '#6b7280',
                      borderRadius: '5px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      {user.status}
                    </span>
                  </td>
                  {/* <td style={{ padding: '14px 16px', fontSize: '13px', color: '#6b7280' }}>
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never logged in'}
                  </td> */}
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleEdit(user)}
                      style={{
                        padding: '6px 12px',
                        background: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: '600',
                        marginRight: '8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#d97706'}
                      onMouseOut={(e) => e.target.style.background = '#f59e0b'}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      style={{
                        padding: '6px 12px',
                        background: '#e53935',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '12px',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#c62828'}
                      onMouseOut={(e) => e.target.style.background = '#e53935'}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '16px', color: '#6b7280', fontSize: '12px' }}>
        Total users: {users.length}
      </div>

      {showForm && (
        <UserForm user={editUser} onSave={handleSave} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
};

export default UserList;
