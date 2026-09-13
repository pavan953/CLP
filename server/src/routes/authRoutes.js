const express = require('express');
const router = express.Router();
const { register, login, addDoctor, getMe, getDoctors } = require('../controllers/authController');
const { protect, authorizeRoles } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/add-doctor', protect, authorizeRoles('doctor'), addDoctor);
router.get('/me', protect, getMe);
router.get('/doctors', getDoctors);

module.exports = router;
