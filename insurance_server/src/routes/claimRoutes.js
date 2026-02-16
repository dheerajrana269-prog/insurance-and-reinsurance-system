const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');
const authMiddleware = require('../middleware/authMiddleware');
const rbacMiddleware = require('../middleware/rbacMiddleware');

router.use(authMiddleware);

// Submit claim
router.post('/', rbacMiddleware(['CLAIMS_ADJUSTER']), claimController.createClaim);
// Get all claims
router.get('/', claimController.getClaims);
// Get claim by ID
router.get('/:id', claimController.getClaimById);
// Review claim
router.post('/:id/review', rbacMiddleware(['CLAIMS_ADJUSTER']), claimController.reviewClaim);
// Approve claim
router.post('/:id/approve', rbacMiddleware(['CLAIMS_ADJUSTER']), claimController.approveClaim);
// Reject claim
router.post('/:id/reject', rbacMiddleware(['CLAIMS_ADJUSTER']), claimController.rejectClaim);
// Settle claim
router.post('/:id/settle', rbacMiddleware(['CLAIMS_ADJUSTER']), claimController.settleClaim);
// Update claim
router.put('/:id', rbacMiddleware(['CLAIMS_ADJUSTER']), claimController.updateClaim);
// Delete claim
router.delete('/:id', rbacMiddleware(['CLAIMS_ADJUSTER']), claimController.deleteClaim);

module.exports = router;