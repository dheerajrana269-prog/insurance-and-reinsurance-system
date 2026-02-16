const express = require('express');
const router = express.Router();
const reinsuranceController = require('../controllers/reinsuranceController');
const authMiddleware = require('../middleware/authMiddleware');
const rbacMiddleware = require('../middleware/rbacMiddleware');

router.use(authMiddleware);

// Treaties
router.get('/treaties', reinsuranceController.getTreaties);
router.post('/treaties', rbacMiddleware(['REINSURANCE_MANAGER']), reinsuranceController.createTreaty);
// Risk allocations
router.get('/allocations/:policyId', reinsuranceController.getRiskAllocations);
router.post('/allocations', rbacMiddleware(['REINSURANCE_MANAGER']), reinsuranceController.allocateRisk);
// Reinsurers
router.get('/reinsurers', reinsuranceController.getReinsurers);
router.post('/reinsurers', rbacMiddleware(['REINSURANCE_MANAGER']), reinsuranceController.createReinsurer);

module.exports = router;