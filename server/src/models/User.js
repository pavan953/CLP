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
  specialty: {
    type: String,
    trim: true,
    default: 'General Physician'
  },
  department: {
    type: String,
    trim: true,
    default: 'OPD'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
