const express = require('express');
const router = express.Router();
const { register, login, addDoctor, updateProfile, getMe, getDoctors, getPatients } = require('../controllers/authController');
const { protect, authorizeRoles } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/add-doctor', protect, authorizeRoles('doctor'), addDoctor);
router.put('/profile', protect, updateProfile);
router.get('/me', protect, getMe);
router.get('/doctors', getDoctors);
router.get('/patients', protect, authorizeRoles('doctor'), getPatients);

module.exports = router;

