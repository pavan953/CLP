const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DataService = require('../services/dataService');

const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET || 'super_secret_appointment_jwt_token_key_2025';
  return jwt.sign({ id, role }, secret, { expiresIn: '7d' });
};

const formatSafeUser = (user) => {
  const base = {
    id: user._id || user.id,
    _id: user._id || user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || ''
  };

  if (user.role === 'doctor') {
    return {
      ...base,
      specialty: user.specialty || 'General Physician',
      department: user.department || 'General OPD',
      qualification: user.qualification || '',
      experience: user.experience || '',
      bio: user.bio || '',
      consultationFee: user.consultationFee || '$50',
      availableDays: user.availableDays || 'Mon - Fri',
      cabinNumber: user.cabinNumber || '',
      isProfileComplete: !!user.isProfileComplete
    };
  }

  return {
    ...base,
    bloodGroup: user.bloodGroup || '',
    dateOfBirth: user.dateOfBirth || '',
    gender: user.gender || '',
    emergencyContact: user.emergencyContact || '',
    allergies: user.allergies || ''
  };
};

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

    if (phone && phone.trim()) {
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        return res.status(400).json({
          success: false,
          message: 'Mobile number must be exactly 10 digits.'
        });
      }
    }

    const existingUser = await DataService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'This email address is already registered in our database. Please use another email address or sign in.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await DataService.createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'patient',
      phone: phone ? phone.replace(/\D/g, '').slice(0, 10) : ''
    });

    const token = generateToken(newUser._id, newUser.role);

    return res.status(201).json({
      success: true,
      message: 'Patient account created successfully!',
      token,
      user: formatSafeUser(newUser)
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during account registration. ' + err.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

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

    if (role && role !== user.role) {
      if (role === 'doctor' && user.role === 'patient') {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: This email is registered as a Patient account, not a Doctor. Please switch to the Patient Portal or log in with your authorized Doctor/Staff email.'
        });
      }
      if (role === 'patient' && user.role === 'doctor') {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: This email is registered as a Doctor/Staff account. Please switch to the Staff Portal or use your Patient email.'
        });
      }
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: formatSafeUser(user)
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during login. ' + err.message
    });
  }
};

const addDoctor = async (req, res) => {
  try {
    const { name, email, password, specialty, department, phone, qualification, experience, bio, consultationFee, cabinNumber } = req.body;

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
      department: (department && department.trim()) || 'General OPD',
      qualification: qualification ? qualification.trim() : '',
      experience: experience ? experience.trim() : '',
      bio: bio ? bio.trim() : '',
      consultationFee: consultationFee ? consultationFee.trim() : '$50',
      cabinNumber: cabinNumber ? cabinNumber.trim() : '',
      isProfileComplete: !!(qualification && bio)
    });

    return res.status(201).json({
      success: true,
      message: `Doctor ${newDoctor.name} onboarded to hospital directory successfully!`,
      doctor: formatSafeUser(newDoctor)
    });
  } catch (err) {
    console.error('Add doctor error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to onboard doctor. ' + err.message
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const {
      name,
      phone,

      specialty,
      department,
      qualification,
      experience,
      bio,
      consultationFee,
      availableDays,
      cabinNumber,

      bloodGroup,
      dateOfBirth,
      gender,
      emergencyContact,
      allergies,

      currentPassword,
      newPassword
    } = req.body;

    const updateFields = {};

    if (name && name.trim()) updateFields.name = name.trim();
    if (phone !== undefined) updateFields.phone = phone.replace(/\D/g, '').slice(0, 10);

    if (req.user.role === 'doctor') {
      if (specialty !== undefined) updateFields.specialty = specialty.trim();
      if (department !== undefined) updateFields.department = department.trim();
      if (qualification !== undefined) updateFields.qualification = qualification.trim();
      if (experience !== undefined) updateFields.experience = experience.trim();
      if (bio !== undefined) updateFields.bio = bio.trim();
      if (consultationFee !== undefined) updateFields.consultationFee = consultationFee.trim();
      if (availableDays !== undefined) updateFields.availableDays = availableDays.trim();
      if (cabinNumber !== undefined) updateFields.cabinNumber = cabinNumber.trim();

      if (qualification || bio || updateFields.qualification || updateFields.bio) {
        updateFields.isProfileComplete = true;
      }
    } else if (req.user.role === 'patient') {
      if (bloodGroup !== undefined) updateFields.bloodGroup = bloodGroup.trim();
      if (dateOfBirth !== undefined) updateFields.dateOfBirth = dateOfBirth.trim();
      if (gender !== undefined) updateFields.gender = gender.trim();
      if (emergencyContact !== undefined) updateFields.emergencyContact = emergencyContact.replace(/\D/g, '').slice(0, 10);
      if (allergies !== undefined) updateFields.allergies = allergies.trim();
    }

    if (currentPassword && newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long.'
        });
      }

      const rawUser = await DataService.findUserByEmail(req.user.email);
      if (!rawUser) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const isMatch = await bcrypt.compare(currentPassword, rawUser.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect. Please verify your current password.'
        });
      }

      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(newPassword, salt);
    }

    const updated = await DataService.updateUser(userId, updateFields);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: formatSafeUser(updated)
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile. ' + err.message
    });
  }
};

const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: formatSafeUser(req.user)
  });
};

const getDoctors = async (req, res) => {
  try {
    const doctors = await DataService.getDoctors();
    return res.status(200).json({
      success: true,
      count: doctors.length,
      doctors: doctors.map(formatSafeUser)
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor list.'
    });
  }
};

const getPatients = async (req, res) => {
  try {
    const patients = await DataService.getPatients();
    return res.status(200).json({
      success: true,
      count: patients.length,
      patients: patients.map(formatSafeUser)
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch patients list.'
    });
  }
};

module.exports = {
  register,
  login,
  addDoctor,
  updateProfile,
  getMe,
  getDoctors,
  getPatients
};

