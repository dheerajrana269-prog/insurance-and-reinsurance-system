const express = require('express');
const app = express();
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');

const policyRoutes = require('./routes/policyRoutes');

const claimRoutes = require('./routes/claimRoutes');

const reinsuranceRoutes = require('./routes/reinsuranceRoutes');

const adminRoutes = require('./routes/adminRoutes');

const dashboardRoutes = require('./routes/dashboardRoutes');

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.use('/api/policies', policyRoutes);

app.use('/api/claims', claimRoutes);

app.use('/api/reinsurance', reinsuranceRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
    res.send("Hello");
});

module.exports = app;