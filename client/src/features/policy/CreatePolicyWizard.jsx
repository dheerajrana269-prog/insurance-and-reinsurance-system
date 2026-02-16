import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { policyAPI } from '../../services/api';

const CreatePolicyWizard = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    insuredName: '',
    insuredType: 'INDIVIDUAL',
    lineOfBusiness: 'HEALTH',
    sumInsured: '',
    premium: '',
    retentionLimit: '',
    effectiveFrom: '',
    effectiveTo: ''
  });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validateStep = () => {
    if (step === 1) {
      if (!form.insuredName) {
        setError('Please enter insured name');
        return false;
      }
    } else if (step === 2) {
      if (!form.sumInsured || !form.premium || !form.retentionLimit) {
        setError('Please fill all coverage fields');
        return false;
      }
      if (parseFloat(form.retentionLimit) > parseFloat(form.sumInsured)) {
        setError('Retention limit cannot exceed sum insured');
        return false;
      }
    } else if (step === 3) {
      if (!form.effectiveFrom) {
        setError('Please select effective from date');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateStep()) return;
    
    setIsSubmitting(true);
    setError('');
    try {
      const policyData = {
        ...form,
        sumInsured: parseFloat(form.sumInsured),
        premium: parseFloat(form.premium),
        retentionLimit: parseFloat(form.retentionLimit)
      };
      await policyAPI.createPolicy(policyData);
      navigate('/policy');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create policy');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' };
  const buttonStyle = { padding: '10px 20px', marginRight: '10px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '14px' };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Create New Policy</h2>
      
      {/* Progress indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: step >= s ? '#007bff' : '#ddd',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            {s}
          </div>
        ))}
      </div>

      {error && <div style={{ padding: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div>
            <h3>Basic Information</h3>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Insured Name *</label>
            <input type="text" name="insuredName" placeholder="Enter insured name" value={form.insuredName} onChange={handleChange} style={inputStyle} required />
            
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Insured Type *</label>
            <select name="insuredType" value={form.insuredType} onChange={handleChange} style={inputStyle}>
              <option value="INDIVIDUAL">Individual</option>
              <option value="CORPORATE">Corporate</option>
            </select>
            
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Line of Business *</label>
            <select name="lineOfBusiness" value={form.lineOfBusiness} onChange={handleChange} style={inputStyle}>
              <option value="HEALTH">Health</option>
              <option value="MOTOR">Motor</option>
              <option value="LIFE">Life</option>
              <option value="PROPERTY">Property</option>
            </select>
            
            <button type="button" onClick={handleNext} style={{ ...buttonStyle, backgroundColor: '#007bff', color: 'white' }}>Next</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3>Coverage Details</h3>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Sum Insured *</label>
            <input type="number" name="sumInsured" placeholder="Enter sum insured" value={form.sumInsured} onChange={handleChange} style={inputStyle} required />
            
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Premium *</label>
            <input type="number" name="premium" placeholder="Enter premium amount" value={form.premium} onChange={handleChange} style={inputStyle} required />
            
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Retention Limit *</label>
            <input type="number" name="retentionLimit" placeholder="Enter retention limit" value={form.retentionLimit} onChange={handleChange} style={inputStyle} required />
            
            <div>
              <button type="button" onClick={() => setStep(1)} style={{ ...buttonStyle, backgroundColor: '#6c757d', color: 'white' }}>Back</button>
              <button type="button" onClick={handleNext} style={{ ...buttonStyle, backgroundColor: '#007bff', color: 'white' }}>Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3>Effective Dates</h3>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Effective From *</label>
            <input type="date" name="effectiveFrom" value={form.effectiveFrom} onChange={handleChange} style={inputStyle} required />
            
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Effective To</label>
            <input type="date" name="effectiveTo" value={form.effectiveTo} onChange={handleChange} style={inputStyle} />
            
            <div>
              <button type="button" onClick={() => setStep(2)} style={{ ...buttonStyle, backgroundColor: '#6c757d', color: 'white' }}>Back</button>
              <button type="button" onClick={handleNext} style={{ ...buttonStyle, backgroundColor: '#007bff', color: 'white' }}>Review</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3>Review Policy</h3>
            <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
              <p><strong>Insured Name:</strong> {form.insuredName}</p>
              <p><strong>Type:</strong> {form.insuredType}</p>
              <p><strong>Line of Business:</strong> {form.lineOfBusiness}</p>
              <p><strong>Sum Insured:</strong> ₹{form.sumInsured}</p>
              <p><strong>Premium:</strong> ₹{form.premium}</p>
              <p><strong>Retention Limit:</strong> ₹{form.retentionLimit}</p>
              <p><strong>Effective From:</strong> {form.effectiveFrom}</p>
              <p><strong>Effective To:</strong> {form.effectiveTo || '-'}</p>
            </div>
            
            <div>
              <button type="button" onClick={() => setStep(3)} style={{ ...buttonStyle, backgroundColor: '#6c757d', color: 'white' }}>Back</button>
              <button type="submit" disabled={isSubmitting} style={{ ...buttonStyle, backgroundColor: '#28a745', color: 'white', opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                {isSubmitting ? 'Creating...' : 'Create Policy'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreatePolicyWizard;
