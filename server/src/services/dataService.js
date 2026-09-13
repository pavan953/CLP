const mongoose = require('mongoose');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const { getStatus, readData, writeData } = require('../config/db');

// Helper to generate simple ObjectID-like hex string if MongoDB is offline
const generateId = () => {
  return new mongoose.Types.ObjectId().toString();
};

const DataService = {
  // --- USER OPERATIONS ---
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
    return safeUser;
  },

  async createUser(userData) {
    const { isMongoConnected } = getStatus();
    if (isMongoConnected) {
      const user = new User(userData);
      return await user.save();
    }
    const data = readData();
    const newUser = {
      _id: generateId(),
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.users.push(newUser);
    writeData(data);
    return newUser;
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

  // --- APPOINTMENT OPERATIONS ---
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

    // Sort by date then time ascending
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
