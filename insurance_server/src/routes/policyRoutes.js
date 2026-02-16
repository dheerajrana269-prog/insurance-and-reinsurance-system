const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policyController');
const authMiddleware = require('../middleware/authMiddleware');
const rbacMiddleware = require('../middleware/rbacMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Create policy (Underwriter)
router.post('/', rbacMiddleware(['UNDERWRITER']), policyController.createPolicy);
// Get all policies
router.get('/', policyController.getPolicies);
// Get policy by ID
router.get('/:id', policyController.getPolicyById);
// Submit policy for approval
router.post('/:id/submit', rbacMiddleware(['UNDERWRITER']), policyController.submitPolicy);
// Approve policy
router.post('/:id/approve', rbacMiddleware(['UNDERWRITER']), policyController.approvePolicy);
// Update policy
router.put('/:id', rbacMiddleware(['UNDERWRITER']), policyController.updatePolicy);
// Delete policy
router.delete('/:id', rbacMiddleware(['UNDERWRITER']), policyController.deletePolicy);

module.exports = router;