
const User = require('../models/User');
const { logAction } = require('../services/auditService');

// Get all users
exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};


// Create user
exports.createUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  const passwordHash = await require('bcryptjs').hash(password, 10);
  const user = new User({ username, email, passwordHash, role });
  await user.save();
  // Audit log
  await logAction({
    entityType: 'USER',
    entityId: user._id,
    action: 'CREATE',
    oldValue: null,
    newValue: { username, email, role },
    performedBy: req.user?._id,
    ipAddress: req.ip
  });
  res.status(201).json(user);
};


// Update user
exports.updateUser = async (req, res) => {
  const oldUser = await User.findById(req.params.id);
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) return res.status(404).json({ message: 'User not found' });
  // Audit log
  await logAction({
    entityType: 'USER',
    entityId: user._id,
    action: 'UPDATE',
    oldValue: oldUser,
    newValue: req.body,
    performedBy: req.user?._id,
    ipAddress: req.ip
  });
  res.json(user);
};


// Delete user
exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  // Audit log
  await logAction({
    entityType: 'USER',
    entityId: req.params.id,
    action: 'DELETE',
    oldValue: user,
    newValue: null,
    performedBy: req.user?._id,
    ipAddress: req.ip
  });
  res.json({ message: 'User deleted' });
};