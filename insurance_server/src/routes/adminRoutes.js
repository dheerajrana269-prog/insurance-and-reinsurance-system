const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const rbacMiddleware = require('../middleware/rbacMiddleware');

router.use(authMiddleware);

// User management
router.get('/users', rbacMiddleware(['ADMIN']), adminController.getUsers);
router.post('/users', rbacMiddleware(['ADMIN']), adminController.createUser);
router.put('/users/:id', rbacMiddleware(['ADMIN']), adminController.updateUser);
router.delete('/users/:id', rbacMiddleware(['ADMIN']), adminController.deleteUser);

module.exports = router;