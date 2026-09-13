const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    minlength: 2
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['patient', 'doctor'],
    default: 'patient',
    required: true
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  // --- Doctor Professional Profile ---
  specialty: {
    type: String,
    trim: true,
    default: 'General Physician'
  },
  department: {
    type: String,
    trim: true,
    default: 'OPD'
  },
  qualification: {
    type: String,
    trim: true,
    default: ''
  },
  experience: {
    type: String,
    trim: true,
    default: ''
  },
  bio: {
    type: String,
    trim: true,
    default: ''
  },
  consultationFee: {
    type: String,
    trim: true,
    default: '$50'
  },
  availableDays: {
    type: String,
    trim: true,
    default: 'Mon - Fri'
  },
  cabinNumber: {
    type: String,
    trim: true,
    default: ''
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  // --- Patient Medical Profile ---
  bloodGroup: {
    type: String,
    trim: true,
    default: ''
  },
  dateOfBirth: {
    type: String,
    trim: true,
    default: ''
  },
  gender: {
    type: String,
    trim: true,
    default: ''
  },
  emergencyContact: {
    type: String,
    trim: true,
    default: ''
  },
  allergies: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
