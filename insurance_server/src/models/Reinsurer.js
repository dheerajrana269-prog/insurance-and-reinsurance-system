const mongoose = require('mongoose');

const reinsurerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  country: { type: String },
  rating: { type: String, enum: ['AAA', 'AA', 'A', 'BBB'] },
  contactEmail: { type: String },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reinsurer', reinsurerSchema);