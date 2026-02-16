import React, { useState, useEffect } from 'react';
import { reinsuranceAPI } from '../../services/api';

const initialForm = {
  treatyName: '',
  treatyType: 'QUOTA_SHARE',
  reinsurerId: '',
  sharePercentage: '',
  retentionLimit: '',
  treatyLimit: '',
  applicableLOBs: [],
  effectiveFrom: '',
  effectiveTo: '',
  status: 'ACTIVE',
};

const lobOptions = ['HEALTH', 'MOTOR', 'LIFE', 'PROPERTY'];
const treatyTypes = ['QUOTA_SHARE', 'SURPLUS'];

const AddTreatyForm = ({ onCreated }) => {
  const [form, setForm] = useState(initialForm);
  const [reinsurers, setReinsurers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    reinsuranceAPI.getReinsurers().then(res => setReinsurers(res.data));
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm(f => ({
        ...f,
        applicableLOBs: checked
          ? [...f.applicableLOBs, value]
          : f.applicableLOBs.filter(lob => lob !== value),
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        sharePercentage: Number(form.sharePercentage),
        retentionLimit: Number(form.retentionLimit),
        treatyLimit: Number(form.treatyLimit),
      };
      await reinsuranceAPI.createTreaty(payload);
      setSuccess('Treaty created successfully!');
      setForm(initialForm);
      if (onCreated) onCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create treaty');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: 20, borderRadius: 8, marginBottom: 24 }}>
      <h3 style={{ marginTop: 0 }}>Add New Treaty</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label>Treaty Name</label>
          <input name="treatyName" value={form.treatyName} onChange={handleChange} required className="input" />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label>Treaty Type</label>
          <select name="treatyType" value={form.treatyType} onChange={handleChange} required className="input">
            {treatyTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label>Reinsurer</label>
          <select name="reinsurerId" value={form.reinsurerId} onChange={handleChange} required className="input">
            <option value="">-- Select --</option>
            {reinsurers.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
          </select>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label>Share %</label>
          <input name="sharePercentage" type="number" value={form.sharePercentage} onChange={handleChange} required min={1} max={100} className="input" />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label>Retention Limit</label>
          <input name="retentionLimit" type="number" value={form.retentionLimit} onChange={handleChange} required min={0} className="input" />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label>Treaty Limit</label>
          <input name="treatyLimit" type="number" value={form.treatyLimit} onChange={handleChange} required min={0} className="input" />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label>Applicable LOBs</label>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {lobOptions.map(lob => (
              <label key={lob} style={{ fontWeight: 'normal' }}>
                <input
                  type="checkbox"
                  name="applicableLOBs"
                  value={lob}
                  checked={form.applicableLOBs.includes(lob)}
                  onChange={handleChange}
                /> {lob}
              </label>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label>Effective From</label>
          <input name="effectiveFrom" type="date" value={form.effectiveFrom} onChange={handleChange} required className="input" />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label>Effective To</label>
          <input name="effectiveTo" type="date" value={form.effectiveTo} onChange={handleChange} required className="input" />
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Treaty'}</button>
      </div>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
    </form>
  );
};

export default AddTreatyForm;
