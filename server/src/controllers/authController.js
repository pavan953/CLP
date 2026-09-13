const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DataService = require('../services/dataService');

const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET || 'super_secret_appointment_jwt_token_key_2025';
  return jwt.sign({ id, role }, secret, { expiresIn: '7d' });
};

// @desc    Register a new user (Patient or Doctor)
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, specialty, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required fields.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const assignedRole = role === 'doctor' ? 'doctor' : 'patient';

    const existingUser = await DataService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await DataService.createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: assignedRole,
      phone: phone || '',
      specialty: assignedRole === 'doctor' ? (specialty || 'General Physician') : '',
      department: assignedRole === 'doctor' ? (department || 'OPD') : ''
    });

    const token = generateToken(newUser._id, newUser.role);

    return res.status(201).json({
      success: true,
      message: `${assignedRole === 'doctor' ? 'Doctor' : 'Patient'} account registered successfully!`,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        specialty: newUser.specialty,
        department: newUser.department
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred during account creation. ' + err.message
    });
  }
};

// @desc    Login user (Patient or Doctor)
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
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
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

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user
  });
};

// @desc    Get all registered doctors for booking selection
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
  getMe,
  getDoctors
};
