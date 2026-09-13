const bcrypt = require('bcryptjs');
const DataService = require('../services/dataService');

const seedInitialData = async () => {
  try {
    const existingDoctors = await DataService.getDoctors();
    if (existingDoctors && existingDoctors.length > 0) {
      return; // Already seeded
    }

    console.log('[Seed] Seeding initial demo doctors, patients, and sample appointments...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 1. Doctors
    const drSarah = await DataService.createUser({
      name: 'Dr. Sarah Jenkins',
      email: 'doctor.sarah@clinic.com',
      password: hashedPassword,
      role: 'doctor',
      phone: '9876500001',
      specialty: 'Cardiologist',
      department: 'Cardiology'
    });

    const drMarcus = await DataService.createUser({
      name: 'Dr. Marcus Chen',
      email: 'doctor.marcus@clinic.com',
      password: hashedPassword,
      role: 'doctor',
      phone: '9876500002',
      specialty: 'General Physician',
      department: 'Internal Medicine'
    });

    const drEmily = await DataService.createUser({
      name: 'Dr. Emily Taylor',
      email: 'doctor.emily@clinic.com',
      password: hashedPassword,
      role: 'doctor',
      phone: '9876500003',
      specialty: 'Pediatrician',
      department: 'Pediatrics'
    });

    // 2. Demo Patient
    const demoPatient = await DataService.createUser({
      name: 'Alex Morgan',
      email: 'patient@demo.com',
      password: hashedPassword,
      role: 'patient',
      phone: '9876543210'
    });

    // Helper to format ISO dates YYYY-MM-DD
    const formatDate = (daysOffset = 0) => {
      const d = new Date();
      d.setDate(d.getDate() + daysOffset);
      return d.toISOString().split('T')[0];
    };

    // 3. Sample appointments matching the requirements
    await DataService.createAppointment({
      patientName: 'Alex Morgan',
      mobileNumber: '9876543210',
      doctorName: 'Dr. Sarah Jenkins',
      appointmentDate: formatDate(0),
      appointmentTime: '10:00 AM',
      status: 'Pending',
      reason: 'Chest tightness and occasional palpitations during exercise',
      aiSummary: 'Clinical Summary: Patient reports exertional chest tightness and episodic palpitations. Recommended triage: Baseline ECG and cardiovascular assessment.',
      patientId: demoPatient._id,
      doctorId: drSarah._id
    });

    await DataService.createAppointment({
      patientName: 'Emma Watson',
      mobileNumber: '9822334455',
      doctorName: 'Dr. Marcus Chen',
      appointmentDate: formatDate(1),
      appointmentTime: '02:30 PM',
      status: 'Pending',
      reason: 'Seasonal allergy flare-up and persistent dry cough',
      aiSummary: 'Clinical Summary: Upper respiratory symptoms consistent with allergic rhinitis. Recommended triage: Symptomatic antihistamine evaluation and chest auscultation.',
      patientId: null,
      doctorId: drMarcus._id
    });

    await DataService.createAppointment({
      patientName: 'John Doe',
      mobileNumber: '9811223344',
      doctorName: 'Dr. Emily Taylor',
      appointmentDate: formatDate(-2),
      appointmentTime: '11:15 AM',
      status: 'Completed',
      reason: 'Routine annual pediatric developmental checkup',
      aiSummary: 'Clinical Summary: Wellness checkup for child milestone progression.',
      patientId: null,
      doctorId: drEmily._id
    });

    await DataService.createAppointment({
      patientName: 'Robert Langdon',
      mobileNumber: '9899887766',
      doctorName: 'Dr. Marcus Chen',
      appointmentDate: formatDate(-1),
      appointmentTime: '04:00 PM',
      status: 'Cancelled',
      reason: 'Rescheduling requested due to emergency travel',
      aiSummary: 'Administrative: Patient requested cancellation due to personal scheduling conflict.',
      patientId: null,
      doctorId: drMarcus._id
    });

    console.log('[Seed] Database initialization complete.');
  } catch (err) {
    console.error('[Seed] Error during data seeding:', err.message);
  }
};

module.exports = seedInitialData;
