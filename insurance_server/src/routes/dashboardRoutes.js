const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/exposure', dashboardController.getExposureByType);
router.get('/claims-ratio', dashboardController.getClaimsRatio);
router.get('/reinsurer-risk', dashboardController.getReinsurerRiskDistribution);

module.exports = router;