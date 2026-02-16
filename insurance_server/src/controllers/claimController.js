const Claim = require('../models/Claim');
const Policy = require('../models/Policy');
const { logAction } = require('../services/auditService');

// Submit claim
exports.createClaim = async (req, res) => {
  const { policyId, claimAmount, incidentDate, reportedDate, remarks } = req.body;
  
  // Validate claim against policy coverage
  const policy = await Policy.findById(policyId);
  if (!policy) {
    return res.status(404).json({ message: 'Policy not found' });
  }
  if (policy.status !== 'ACTIVE') {
    return res.status(400).json({ message: 'Only ACTIVE policies can have claims filed' });
  }
  if (claimAmount > policy.sumInsured) {
    return res.status(400).json({ message: `Claim amount ($${claimAmount}) cannot exceed policy coverage ($${policy.sumInsured})` });
  }
  
  const claimNumber = 'CLM' + Date.now();
  const claim = new Claim({
    claimNumber,
    policyId,
    claimAmount,
    status: 'SUBMITTED',
    incidentDate,
    reportedDate,
    remarks,
    handledBy: req.user._id
  });
  await claim.save();
  await logAction({
    entityType: 'CLAIM',
    entityId: claim._id,
    action: 'CREATE',
    newValue: claim,
    performedBy: req.user._id,
    ipAddress: req.ip
  });
  res.status(201).json(claim);
};

// Get all claims
exports.getClaims = async (req, res) => {
  const claims = await Claim.find().populate('policyId handledBy');
  res.json(claims);
};

// Get claim by ID
exports.getClaimById = async (req, res) => {
  const claim = await Claim.findById(req.params.id).populate('policyId handledBy');
  if (!claim) return res.status(404).json({ message: 'Claim not found' });
  res.json(claim);
};

// Review claim (set IN_REVIEW)
exports.reviewClaim = async (req, res) => {
  const claim = await Claim.findById(req.params.id);
  if (!claim) return res.status(404).json({ message: 'Claim not found' });
  const oldValue = { ...claim.toObject() };
  claim.status = 'IN_REVIEW';
  await claim.save();
  await logAction({
    entityType: 'CLAIM',
    entityId: claim._id,
    action: 'UPDATE',
    oldValue,
    newValue: claim,
    performedBy: req.user._id,
    ipAddress: req.ip
  });
  res.json(claim);
};

// Approve claim
exports.approveClaim = async (req, res) => {
  const claim = await Claim.findById(req.params.id).populate('policyId');
  if (!claim) return res.status(404).json({ message: 'Claim not found' });
  if (claim.status !== 'IN_REVIEW') {
    return res.status(400).json({ message: 'Only IN_REVIEW claims can be approved' });
  }
  
  const approvedAmount = req.body.approvedAmount || claim.claimAmount;
  
  // Validate approved amount doesn't exceed claim amount
  if (approvedAmount > claim.claimAmount) {
    return res.status(400).json({ message: `Approved amount ($${approvedAmount}) cannot exceed claim amount ($${claim.claimAmount})` });
  }
  
  // Validate approved amount doesn't exceed policy coverage
  if (approvedAmount > claim.policyId.sumInsured) {
    return res.status(400).json({ message: `Approved amount ($${approvedAmount}) exceeds policy coverage ($${claim.policyId.sumInsured})` });
  }
  
  const oldValue = { ...claim.toObject() };
  claim.status = 'APPROVED';
  claim.approvedAmount = approvedAmount;
  await claim.save();
  await logAction({
    entityType: 'CLAIM',
    entityId: claim._id,
    action: 'APPROVE',
    oldValue,
    newValue: claim,
    performedBy: req.user._id,
    ipAddress: req.ip
  });
  res.json(claim);
};

// Reject claim
exports.rejectClaim = async (req, res) => {
  const claim = await Claim.findById(req.params.id);
  if (!claim) return res.status(404).json({ message: 'Claim not found' });
  const oldValue = { ...claim.toObject() };
  claim.status = 'REJECTED';
  await claim.save();
  await logAction({
    entityType: 'CLAIM',
    entityId: claim._id,
    action: 'UPDATE',
    oldValue,
    newValue: claim,
    performedBy: req.user._id,
    ipAddress: req.ip
  });
  res.json(claim);
};

// Settle claim
exports.settleClaim = async (req, res) => {
  const claim = await Claim.findById(req.params.id);
  if (!claim) return res.status(404).json({ message: 'Claim not found' });
  const oldValue = { ...claim.toObject() };
  claim.status = 'SETTLED';
  await claim.save();
  await logAction({
    entityType: 'CLAIM',
    entityId: claim._id,
    action: 'UPDATE',
    oldValue,
    newValue: claim,
    performedBy: req.user._id,
    ipAddress: req.ip
  });
  res.json(claim);
};

// Update claim
exports.updateClaim = async (req, res) => {
  const oldValue = await Claim.findById(req.params.id);
  const claim = await Claim.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!claim) return res.status(404).json({ message: 'Claim not found' });
  await logAction({
    entityType: 'CLAIM',
    entityId: claim._id,
    action: 'UPDATE',
    oldValue,
    newValue: claim,
    performedBy: req.user._id,
    ipAddress: req.ip
  });
  res.json(claim);
};

// Delete claim
exports.deleteClaim = async (req, res) => {
  const claim = await Claim.findByIdAndDelete(req.params.id);
  if (!claim) return res.status(404).json({ message: 'Claim not found' });
  await logAction({
    entityType: 'CLAIM',
    entityId: claim._id,
    action: 'DELETE',
    oldValue: claim,
    performedBy: req.user._id,
    ipAddress: req.ip
  });
  res.json({ message: 'Claim deleted' });
};
