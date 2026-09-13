const mongoose = require('mongoose');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const { getStatus, readData, writeData } = require('../config/db');

const generateId = () => {
  return new mongoose.Types.ObjectId().toString();
};

const DOCTOR_ONLY_FIELDS = [
  'specialty',
  'department',
  'qualification',
  'experience',
  'bio',
  'consultationFee',
  'availableDays',
  'cabinNumber',
  'isProfileComplete'
];

const sanitizePatientData = (data) => {
  const clean = { ...data };
  for (const field of DOCTOR_ONLY_FIELDS) {
    delete clean[field];
  }
  return clean;
};

const DataService = {

  async findUserByEmail(email) {
    const { isMongoConnected } = getStatus();
    if (isMongoConnected) {
      return await User.findOne({ email: email.toLowerCase() });
    }
    const data = readData();
    return data.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id) {
    const { isMongoConnected } = getStatus();
    if (isMongoConnected) {
      return await User.findById(id).select('-password');
    }
    const data = readData();
    const user = data.users.find(u => u._id === id.toString() || u.id === id.toString());
    if (!user) return null;
    const { password, ...safeUser } = user;
    if (safeUser.role === 'patient') {
      return sanitizePatientData(safeUser);
    }
    return safeUser;
  },

  async createUser(userData) {
    let cleanData = { ...userData };
    if (cleanData.role === 'patient') {
      cleanData = sanitizePatientData(cleanData);
    }

    const { isMongoConnected } = getStatus();
    if (isMongoConnected) {
      const user = new User(cleanData);
      return await user.save();
    }
    const data = readData();
    const newUser = {
      _id: generateId(),
      ...cleanData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.users.push(newUser);
    writeData(data);
    return newUser;
  },

  async updateUser(id, updateData) {
    let cleanUpdate = { ...updateData };
    const existingUser = await this.findUserById(id);
    if (existingUser && existingUser.role === 'patient') {
      cleanUpdate = sanitizePatientData(cleanUpdate);
    }

    const { isMongoConnected } = getStatus();
    if (isMongoConnected) {
      return await User.findByIdAndUpdate(
        id,
        { ...cleanUpdate, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).select('-password');
    }
    const data = readData();
    const index = data.users.findIndex(u => u._id === id.toString() || u.id === id.toString());
    if (index === -1) return null;

    if (data.users[index].role === 'patient') {
      cleanUpdate = sanitizePatientData(cleanUpdate);
    }

    data.users[index] = {
      ...data.users[index],
      ...cleanUpdate,
      updatedAt: new Date().toISOString()
    };

    if (data.users[index].role === 'patient') {
      data.users[index] = sanitizePatientData(data.users[index]);
    }

    writeData(data);
    const { password, ...safeUser } = data.users[index];
    return safeUser;
  },

  async getDoctors() {
    const { isMongoConnected } = getStatus();
    if (isMongoConnected) {
      return await User.find({ role: 'doctor' }).select('-password');
    }
    const data = readData();
    return data.users
      .filter(u => u.role === 'doctor')
      .map(({ password, ...doc }) => doc);
  },

  async getPatients() {
    const { isMongoConnected } = getStatus();
    if (isMongoConnected) {
      const patients = await User.find({ role: 'patient' }).select('-password').sort({ createdAt: -1 });
      return patients.map(p => sanitizePatientData(p.toObject ? p.toObject() : p));
    }
    const data = readData();
    return data.users
      .filter(u => u.role === 'patient')
      .map(({ password, ...p }) => sanitizePatientData(p));
  },

  async createAppointment(appointmentData) {
    const { isMongoConnected } = getStatus();
    if (isMongoConnected) {
      const appt = new Appointment(appointmentData);
      return await appt.save();
    }
    const data = readData();
    const newAppointment = {
      _id: generateId(),
      status: 'Pending',
      reason: '',
      aiSummary: '',
      ...appointmentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.appointments.push(newAppointment);
    writeData(data);
    return newAppointment;
  },

  async getAppointments(filter = {}) {
    const { isMongoConnected } = getStatus();
    if (isMongoConnected) {
      const query = {};
      if (filter.patientId) query.patientId = filter.patientId;
      if (filter.doctorName) query.doctorName = new RegExp(filter.doctorName, 'i');
      if (filter.status) query.status = filter.status;
      if (filter.date) query.appointmentDate = filter.date;
      return await Appointment.find(query).sort({ appointmentDate: 1, appointmentTime: 1 });
    }

    const data = readData();
    let list = [...data.appointments];

    if (filter.patientId) {
      list = list.filter(a => a.patientId && a.patientId.toString() === filter.patientId.toString());
    }
    if (filter.doctorName) {
      const docName = filter.doctorName.toLowerCase();
      list = list.filter(a => a.doctorName && a.doctorName.toLowerCase().includes(docName));
    }
    if (filter.status) {
      list = list.filter(a => a.status === filter.status);
    }
    if (filter.date) {
      list = list.filter(a => a.appointmentDate === filter.date);
    }

    list.sort((a, b) => {
      const dateA = new Date(`${a.appointmentDate} ${a.appointmentTime || '00:00'}`);
      const dateB = new Date(`${b.appointmentDate} ${b.appointmentTime || '00:00'}`);
      return dateA - dateB;
    });

    return list;
  },

  async findAppointmentById(id) {
    const { isMongoConnected } = getStatus();
    if (isMongoConnected) {
      return await Appointment.findById(id);
    }
    const data = readData();
    return data.appointments.find(a => a._id === id.toString() || a.id === id.toString()) || null;
  },

  async updateAppointmentStatus(id, newStatus) {
    const { isMongoConnected } = getStatus();
    if (isMongoConnected) {
      return await Appointment.findByIdAndUpdate(
        id,
        { status: newStatus, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
    }
    const data = readData();
    const index = data.appointments.findIndex(a => a._id === id.toString() || a.id === id.toString());
    if (index === -1) return null;

    data.appointments[index].status = newStatus;
    data.appointments[index].updatedAt = new Date().toISOString();
    writeData(data);
    return data.appointments[index];
  },

  async deleteAppointment(id) {
    const { isMongoConnected } = getStatus();
    if (isMongoConnected) {
      return await Appointment.findByIdAndDelete(id);
    }
    const data = readData();
    const index = data.appointments.findIndex(a => a._id === id.toString() || a.id === id.toString());
    if (index === -1) return null;
    const [deleted] = data.appointments.splice(index, 1);
    writeData(data);
    return deleted;
  }
};

module.exports = DataService;

