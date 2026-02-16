const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Login handler
exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
//   console.log('User found:', user);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.passwordHash);
//   console.log('Password valid:', valid);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
};

// Register handler (for admin/user creation)
exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ username, email, passwordHash, role });
  await user.save();
  res.status(201).json({ message: 'User created', user: { id: user._id, username, role } });
};