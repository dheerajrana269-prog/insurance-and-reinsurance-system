// Create reinsurer
exports.createReinsurer = async (req, res) => {
  try {
    const { name, contact, email } = req.body;
    if (!name || !contact || !email) {
      return res.status(400).json({ message: 'Name, contact, and email are required.' });
    }
    // Generate a code (e.g., uppercase, no spaces)
    const code = name.replace(/\s+/g, '').toUpperCase();
    const reinsurer = await Reinsurer.create({
      name,
      code,
      contactEmail: email,
      status: 'ACTIVE',
    });
    res.status(201).json(reinsurer);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Reinsurer code or name already exists.' });
    }
    res.status(500).json({ message: 'Failed to create reinsurer', error: err.message });
  }
};
const Treaty = require('../models/Treaty');
const RiskAllocation = require('../models/RiskAllocation');
const Policy = require('../models/Policy');
const Reinsurer = require('../models/Reinsurer');

// Get all treaties
exports.getTreaties = async (req, res) => {
  const treaties = await Treaty.find().populate('reinsurerId');
  res.json(treaties);
};

// Create treaty
exports.createTreaty = async (req, res) => {
  const treaty = new Treaty(req.body);
  await treaty.save();
  res.status(201).json(treaty);
};

// Get risk allocations for a policy
exports.getRiskAllocations = async (req, res) => {
  const allocations = await RiskAllocation.find({ policyId: req.params.policyId }).populate('allocations.reinsurerId allocations.treatyId');
  res.json(allocations);
};

// Allocate risk (simple proportional allocation)
exports.allocateRisk = async (req, res) => {
  const { policyId, allocations, retainedAmount } = req.body;
  const riskAllocation = new RiskAllocation({ policyId, allocations, retainedAmount, calculatedBy: req.user._id });
  await riskAllocation.save();
  res.status(201).json(riskAllocation);
};

// Get reinsurers
exports.getReinsurers = async (req, res) => {
  const reinsurers = await Reinsurer.find();
  res.json(reinsurers);
};