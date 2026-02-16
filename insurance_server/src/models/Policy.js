const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  policyNumber: { type: String, required: true, unique: true },
  insuredName: { type: String, required: true },
  insuredType: { type: String, enum: ['INDIVIDUAL', 'CORPORATE'], required: true },
  lineOfBusiness: { type: String, enum: ['HEALTH', 'MOTOR', 'LIFE', 'PROPERTY'], required: true },
  sumInsured: { type: Number, required: true },
  premium: { type: Number, required: true },
  retentionLimit: { type: Number, required: true },
  status: { type: String, enum: ['DRAFT', 'SUBMITTED', 'ACTIVE', 'SUSPENDED', 'EXPIRED'], default: 'DRAFT' },
  effectiveFrom: { type: Date },
  effectiveTo: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Policy', policySchema);
