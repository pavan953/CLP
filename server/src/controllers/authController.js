const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DataService = require('../services/dataService');

const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET || 'super_secret_appointment_jwt_token_key_2025';
  return jwt.sign({ id, role }, secret, { expiresIn: '7d' });
};

// @desc    Register a new Patient (Public registration is strictly for Patients)
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.'
      });
    }

    const existingUser = await DataService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in instead.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Public registration is locked to patient role
    const newUser = await DataService.createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'patient',
      phone: phone ? phone.trim() : ''
    });

    const token = generateToken(newUser._id, newUser.role);

    return res.status(201).json({
      success: true,
      message: 'Patient account created successfully!',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during account registration. ' + err.message
    });
  }
};

// @desc    Login user (Patient or Doctor) with strict verification
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const user = await DataService.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account exists with this email address. Please create a new account or verify your email.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Please verify your credentials and try again.'
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        specialty: user.specialty,
        department: user.department
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during login. ' + err.message
    });
  }
};

// @desc    Admin / Doctor onboarding: Add a verified doctor to the hospital staff
// @route   POST /api/auth/add-doctor
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, specialty, department, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Doctor full name, email, and password are required.'
      });
    }

    const existingDoctor = await DataService.findUserByEmail(email);
    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message: 'A staff member or user with this email address already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newDoctor = await DataService.createUser({
      name: name.startsWith('Dr.') ? name.trim() : `Dr. ${name.trim()}`,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'doctor',
      phone: phone ? phone.trim() : '',
      specialty: (specialty && specialty.trim()) || 'General Physician',
      department: (department && department.trim()) || 'General OPD'
    });

    return res.status(201).json({
      success: true,
      message: `Doctor ${newDoctor.name} onboarded to hospital directory successfully!`,
      doctor: {
        id: newDoctor._id,
        name: newDoctor.name,
        email: newDoctor.email,
        role: newDoctor.role,
        phone: newDoctor.phone,
        specialty: newDoctor.specialty,
        department: newDoctor.department
      }
    });
  } catch (err) {
    console.error('Add doctor error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to onboard doctor. ' + err.message
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user
  });
};

// @desc    Get all verified doctors in the hospital directory
// @route   GET /api/auth/doctors
const getDoctors = async (req, res) => {
  try {
    const doctors = await DataService.getDoctors();
    return res.status(200).json({
      success: true,
      count: doctors.length,
      doctors
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor list.'
    });
  }
};

module.exports = {
  register,
  login,
  addDoctor,
  getMe,
  getDoctors
};
