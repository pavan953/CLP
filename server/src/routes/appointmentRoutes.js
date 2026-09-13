const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  updateStatus,
  deleteAppointment
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

// Flexible create: can be called with or without auth token
// If token is present, we attach the user; if not, it still records the booking!
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.route('/')
  .post(optionalAuth, createAppointment)
  .get(protect, getAppointments);

router.route('/:id/status')
  .patch(protect, updateStatus);

router.route('/:id')
  .delete(protect, deleteAppointment);

module.exports = router;
