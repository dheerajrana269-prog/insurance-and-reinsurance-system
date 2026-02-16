const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  entityType: {
    type: String,
    enum: ['POLICY', 'CLAIM', 'TREATY', 'USER'],
    required: true
  },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  action: {
    type: String,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'APPROVE'],
    required: true
  },
  oldValue: { type: Object },
  newValue: { type: Object },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  performedAt: { type: Date, default: Date.now },
  ipAddress: { type: String }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);