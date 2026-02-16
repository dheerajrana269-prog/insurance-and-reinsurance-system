
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
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: 24, borderRadius: 8, minWidth: 320 }}>
        <h3>{user ? 'Edit User' : 'Create User'}</h3>
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        <div style={{ marginBottom: 12 }}>
          <label>Username</label>
          <input name="username" value={form.username} onChange={handleChange} required style={{ width: '100%' }} disabled={!!user} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} required style={{ width: '100%' }} />
        </div>
        {!user && (
          <div style={{ marginBottom: 12 }}>
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required style={{ width: '100%' }} />
          </div>
        )}
        <div style={{ marginBottom: 12 }}>
          <label>Role</label>
          <select name="role" value={form.role} onChange={handleChange} style={{ width: '100%' }}>
            <option value="ADMIN">Admin</option>
            <option value="UNDERWRITER">Underwriter</option>
            <option value="CLAIMS_ADJUSTER">Claims Adjuster</option>
            <option value="REINSURANCE_MANAGER">Reinsurance Manager</option>
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange} style={{ width: '100%' }}>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button type="button" onClick={onClose} style={{ padding: '6px 16px' }}>Cancel</button>
          <button type="submit" disabled={saving} style={{ padding: '6px 16px', background: '#0284c7', color: 'white', border: 'none', borderRadius: 4 }}>{saving ? 'Saving...' : 'Save'}</button>
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

  if (loading) return <div style={{ padding: '20px' }}>Loading users...</div>;

  const roleColors = {
    'ADMIN': '#F44336',
    'UNDERWRITER': '#2196F3',
    'CLAIMS_ADJUSTER': '#FF9800',
    'REINSURANCE_MANAGER': '#4CAF50'
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>User Management</h2>
      <button onClick={handleCreate} style={{ marginBottom: 16, padding: '8px 20px', background: '#0284c7', color: 'white', border: 'none', borderRadius: 4, fontWeight: 600 }}>Create User</button>
      {error && <div style={{ padding: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '20px' }}>{error}</div>}

      {users.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          No users found
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Username</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Last Login</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}><strong>{user.username}</strong></td>
                <td style={{ padding: '12px' }}>{user.email}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: roleColors[user.role] || '#999', color: 'white', borderRadius: '4px', fontSize: '12px' }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: user.status === 'ACTIVE' ? '#4CAF50' : '#999', color: 'white', borderRadius: '4px', fontSize: '12px' }}>
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button onClick={() => handleEdit(user)} style={{ padding: '4px 12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: 4, fontWeight: 600, marginRight: 8 }}>Edit</button>
                  
                    <button onClick={() => handleDelete(user._id)} style={{ padding: '4px 12px', background: '#e53935', color: 'white', border: 'none', borderRadius: 4, fontWeight: 600 }}>Delete</button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showForm && (
        <UserForm user={editUser} onSave={handleSave} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
};

export default UserList;
