const bcrypt = require('bcryptjs');
const DataService = require('../services/dataService');

const seedInitialData = async () => {
  try {
    const existingDoctors = await DataService.getDoctors();
    if (existingDoctors && existingDoctors.length > 0) {
      return;
    }

    console.log('[Hospital Setup] Initializing Chief Hospital Administrator account...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    await DataService.createUser({
      name: 'Hospital Administrator',
      email: 'admin@hospital.com',
      password: hashedPassword,
      role: 'doctor',
      phone: '+1 (555) 019-2834',
      specialty: 'Chief Hospital Administrator',
      department: 'Hospital Administration & Executive'
    });

    console.log('[Hospital Setup] Chief Administrator initialized (admin@hospital.com). Ready for live operations with no dummy users.');
  } catch (err) {
    console.error('[Hospital Setup] Error during hospital initialization:', err.message);
  }
};

module.exports = seedInitialData;

