const mongoose = require('mongoose');

const treatySchema = new mongoose.Schema({
  treatyName: { type: String, required: true },
  treatyType: { type: String, enum: ['QUOTA_SHARE', 'SURPLUS'], required: true },
  reinsurerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reinsurer', required: true },
  sharePercentage: { type: Number, required: true },
  retentionLimit: { type: Number, required: true },
  treatyLimit: { type: Number, required: true },
  applicableLOBs: [{ type: String, enum: ['HEALTH', 'MOTOR', 'LIFE', 'PROPERTY'] }],
  effectiveFrom: { type: Date },
  effectiveTo: { type: Date },
  status: { type: String, enum: ['ACTIVE', 'EXPIRED'], default: 'ACTIVE' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Treaty', treatySchema);