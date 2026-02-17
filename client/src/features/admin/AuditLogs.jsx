import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterEntity, setFilterEntity] = useState('');
  const [filterAction, setFilterAction] = useState('');

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAuditLogs();
      setLogs(res.data || []);
    } catch (err) {
      setError('Failed to load audit logs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    if (filterEntity && log.entityType !== filterEntity) return false;
    if (filterAction && log.action !== filterAction) return false;
    return true;
  });

  const getActionColor = (action) => {
    switch (action) {
      case 'CREATE':
        return '#22c55e';
      case 'UPDATE':
        return '#0284c7';
      case 'DELETE':
        return '#dc2626';
      case 'APPROVE':
        return '#9333ea';
      default:
        return '#6b7280';
    }
  };

  const getEntityColor = (entity) => {
    switch (entity) {
      case 'POLICY':
        return '#2196F3';
      case 'CLAIM':
        return '#FF9800';
      case 'TREATY':
        return '#4CAF50';
      case 'USER':
        return '#F44336';
      default:
        return '#999';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading audit logs...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ marginBottom: '16px' }}>Audit Logs</h2>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          Complete history of all system changes and actions performed by users.
        </p>
      </div>

      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #fecaca'
        }}>
          {error}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
            Filter by Entity Type
          </label>
          <select
            value={filterEntity}
            onChange={(e) => setFilterEntity(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="">All Types</option>
            <option value="POLICY">Policy</option>
            <option value="CLAIM">Claim</option>
            <option value="TREATY">Treaty</option>
            <option value="USER">User</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
            Filter by Action
          </label>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="APPROVE">Approve</option>
          </select>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        {filteredLogs.length === 0 ? (
          <div style={{
            padding: '24px',
            textAlign: 'center',
            backgroundColor: '#f9fafb',
            borderRadius: '6px',
            border: '1px solid #e5e7eb'
          }}>
            No audit logs found
          </div>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#f3f4f6',
                borderBottom: '2px solid #e5e7eb'
              }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>
                  Timestamp
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>
                  Entity Type
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>
                  Action
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>
                  Performed By
                </th>
                {/* <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>
                  IP Address
                </th> */}
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f9fafb';
                  }}
                >
                  <td style={{ padding: '12px', fontSize: '13px', color: '#374151' }}>
                    {formatDate(log.performedAt)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      backgroundColor: getEntityColor(log.entityType),
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      {log.entityType}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      backgroundColor: getActionColor(log.action),
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '13px', color: '#374151' }}>
                    {log.performedBy?.username || 'System'}
                  </td>
                  {/* <td style={{ padding: '12px', fontSize: '12px', color: '#6b7280' }}>
                    {log.ipAddress || 'N/A'}
                  </td> */}
                  <td style={{ padding: '12px' }}>
                    <details style={{ cursor: 'pointer' }}>
                      <summary style={{ color: '#0284c7', fontWeight: '500' }}>View</summary>
                      <div style={{
                        marginTop: '8px',
                        padding: '8px',
                        backgroundColor: '#f0f9ff',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        maxHeight: '200px',
                        overflowY: 'auto'
                      }}>
                        {log.oldValue && (
                          <div>
                            <strong>Old:</strong>
                            <pre style={{ margin: '4px 0', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                              {JSON.stringify(log.oldValue, null, 2)}
                            </pre>
                          </div>
                        )}
                        {log.newValue && (
                          <div>
                            <strong>New:</strong>
                            <pre style={{ margin: '4px 0', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                              {JSON.stringify(log.newValue, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: '16px', color: '#6b7280', fontSize: '12px' }}>
        Showing {filteredLogs.length} of {logs.length} logs
      </div>
    </div>
  );
};

export default AuditLogs;
