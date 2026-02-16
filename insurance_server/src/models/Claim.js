const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  claimNumber: { type: String, required: true, unique: true },
  policyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy', required: true },
  claimAmount: { type: Number, required: true },
  approvedAmount: { type: Number },
  status: {
    type: String,
    enum: ['SUBMITTED', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'SETTLED'],
    default: 'SUBMITTED'
  },
  incidentDate: { type: Date },
  reportedDate: { type: Date },
  handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  remarks: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Claim', claimSchema);