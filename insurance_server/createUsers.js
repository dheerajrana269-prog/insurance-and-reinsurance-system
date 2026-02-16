// createUsers.js
// Run with: node createUsers.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost/insurance_db_v2';

const users = [
  {
    username: 'underwriter1',
    email: 'underwriter1@example.com',
    password: 'password123',
    role: 'UNDERWRITER',
  },
  {
    username: 'claimsadjuster1',
    email: 'claimsadjuster1@example.com',
    password: 'password123',
    role: 'CLAIMS_ADJUSTER',
  },
  {
    username: 'reinsurance1',
    email: 'reinsurance1@example.com',
    password: 'password123',
    role: 'REINSURANCE_MANAGER',
  },
  {
    username: 'admin1',
    email: 'admin1@example.com',
    password: 'password123',
    role: 'ADMIN',
  },
];

async function createUsers() {
  await mongoose.connect(MONGO_URL);
  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    const exists = await User.findOne({ username: user.username });
    if (!exists) {
      await User.create({
        username: user.username,
        email: user.email,
        passwordHash,
        role: user.role,
      });
      console.log(`Created user: ${user.username} (${user.role})`);
    } else {
      console.log(`User already exists: ${user.username}`);
    }
  }
  await mongoose.disconnect();
}

createUsers().catch(err => {
  console.error('Error creating users:', err);
  process.exit(1);
});
