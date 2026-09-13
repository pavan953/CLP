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
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  qualification: {
    type: String,
    trim: true
  },
  experience: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  consultationFee: {
    type: String,
    trim: true
  },
  availableDays: {
    type: String,
    trim: true
  },
  cabinNumber: {
    type: String,
    trim: true
  },
  isProfileComplete: {
    type: Boolean
  },

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

UserSchema.pre('save', function(next) {
  if (this.role === 'patient') {
    this.specialty = undefined;
    this.department = undefined;
    this.qualification = undefined;
    this.experience = undefined;
    this.bio = undefined;
    this.consultationFee = undefined;
    this.availableDays = undefined;
    this.cabinNumber = undefined;
    this.isProfileComplete = undefined;
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);

