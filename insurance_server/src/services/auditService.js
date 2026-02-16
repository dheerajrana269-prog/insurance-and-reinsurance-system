const AuditLog = require('../models/AuditLog');

const logAction = async ({ entityType, entityId, action, oldValue, newValue, performedBy, ipAddress }) => {
  const log = new AuditLog({
    entityType,
    entityId,
    action,
    oldValue,
    newValue,
    performedBy,
    ipAddress,
    performedAt: new Date()
  });
  await log.save();
};

module.exports = { logAction };