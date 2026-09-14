const DataService = require('../services/dataService');

const isValidPhone = (phone) => {
  const cleaned = (phone || '').replace(/\D/g, '');
  return cleaned.length === 10;
};

const createAppointment = async (req, res) => {
  try {
    const { patientName, mobileNumber, doctorName, appointmentDate, appointmentTime, reason, aiSummary, doctorId } = req.body;

    const errors = [];
    if (!patientName || patientName.trim().length < 2) {
      errors.push('Patient name must be at least 2 characters.');
    }
    if (!mobileNumber || !isValidPhone(mobileNumber)) {
      errors.push('Please provide a valid 10-digit mobile number (exactly 10 digits).');
    }
    if (!doctorName || doctorName.trim().length === 0) {
      errors.push('Please select a doctor.');
    }
    if (!appointmentDate) {
      errors.push('Please choose an appointment date.');
    }
    if (!appointmentTime) {
      errors.push('Please choose an appointment time.');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.join(' ')
      });
    }

    const cleanedMobile = (mobileNumber || '').replace(/\D/g, '').slice(0, 10);

    const appointmentPayload = {
      patientName: patientName.trim(),
      mobileNumber: cleanedMobile,
      doctorName: doctorName.trim(),
      appointmentDate: appointmentDate.trim(),
      appointmentTime: appointmentTime.trim(),
      status: 'Pending',
      reason: (reason || '').trim(),
      aiSummary: (aiSummary || '').trim(),
      patientId: req.user ? req.user._id || req.user.id : null,
      doctorId: doctorId || null
    };

    const newAppointment = await DataService.createAppointment(appointmentPayload);

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      appointment: newAppointment
    });
  } catch (err) {
    console.error('Create appointment error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create appointment. ' + err.message
    });
  }
};

const getAppointments = async (req, res) => {
  try {
    const { status, date, doctorName, search } = req.query;
    const filter = {};

    if (req.user && req.user.role === 'patient') {
      filter.patientId = req.user._id || req.user.id;
    }

    else if (req.user && req.user.role === 'doctor') {
      const isAdmin = req.user.email === 'admin@hospital.com' || (req.user.name && req.user.name.toLowerCase().includes('admin'));
      if (!isAdmin) {
        filter.doctorName = req.user.name;
      } else if (req.query.myOnly === 'true') {
        filter.doctorName = req.user.name;
      }
    }

    if (status) filter.status = status;
    if (date) filter.date = date;
    if (doctorName) filter.doctorName = doctorName;

    let appointments = await DataService.getAppointments(filter);

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      appointments = appointments.filter(a =>
        (a.patientName && a.patientName.toLowerCase().includes(q)) ||
        (a.mobileNumber && a.mobileNumber.includes(q)) ||
        (a.doctorName && a.doctorName.toLowerCase().includes(q))
      );
    }

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (err) {
    console.error('Get appointments error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve appointments.'
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Permitted values are Pending, Completed, or Cancelled.'
      });
    }

    const appointment = await DataService.findAppointmentById(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.'
      });
    }

    if (req.user && req.user.role === 'patient') {
      const pId = req.user._id || req.user.id;
      if (appointment.patientId && appointment.patientId.toString() !== pId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only manage your own appointments.'
        });
      }
      if (status !== 'Cancelled') {
        return res.status(403).json({
          success: false,
          message: 'Patients can only cancel appointments. Only doctors/admins can mark as Completed.'
        });
      }
    }

    const updated = await DataService.updateAppointmentStatus(id, status);

    return res.status(200).json({
      success: true,
      message: `Appointment marked as ${status}.`,
      appointment: updated
    });
  } catch (err) {
    console.error('Update status error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update appointment status.'
    });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DataService.deleteAppointment(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully.'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete appointment.'
    });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  updateStatus,
  deleteAppointment
};

