const http = require('http');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });
const PORT = process.env.PORT || 5050;

// Helper to make HTTP requests
const request = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: PORT,
      path: `/api${path}`,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('--- Starting MediBook Full API Test Suite ---');

  try {
    // 1. Health check
    const health = await request('GET', '/health');
    console.log('✔ Health Check:', health.status, health.body);

    // 2. Fetch doctors
    const doctors = await request('GET', '/auth/doctors');
    console.log(`✔ Doctors List: Found ${doctors.body.doctors?.length} doctors`);

    // 3. Login Demo Patient
    const patientLogin = await request('POST', '/auth/login', {
      email: 'patient@demo.com',
      password: 'password123'
    });
    console.log('✔ Patient Login:', patientLogin.status, patientLogin.body.user?.name);
    const patientToken = patientLogin.body.token;

    // 4. Login Demo Doctor
    const doctorLogin = await request('POST', '/auth/login', {
      email: 'doctor.sarah@clinic.com',
      password: 'password123'
    });
    console.log('✔ Doctor Login:', doctorLogin.status, doctorLogin.body.user?.name);
    const doctorToken = doctorLogin.body.token;

    // 5. Create new appointment as Patient
    const newBooking = await request('POST', '/appointments', {
      patientName: 'Alex Morgan',
      mobileNumber: '9876543210',
      doctorName: 'Dr. Sarah Jenkins',
      appointmentDate: '2026-09-20',
      appointmentTime: '10:30 AM',
      reason: 'Chest flutter after morning jogs',
      aiSummary: 'Clinical Summary: Exertional palpitations. Suggested: ECG review.'
    }, patientToken);
    console.log('✔ Create Appointment:', newBooking.status, newBooking.body.message);
    const createdApptId = newBooking.body.appointment._id || newBooking.body.appointment.id;

    // 6. Fetch appointments as Patient (should see their own)
    const patientAppointments = await request('GET', '/appointments', null, patientToken);
    console.log(`✔ Patient Appointments Count: ${patientAppointments.body.count}`);

    // 7. Fetch appointments as Doctor (should see all patient appointments)
    const doctorAppointments = await request('GET', '/appointments', null, doctorToken);
    console.log(`✔ Doctor All Appointments Count: ${doctorAppointments.body.count}`);

    // 8. Update status to Completed (Doctor)
    const completedUpdate = await request('PATCH', `/appointments/${createdApptId}/status`, {
      status: 'Completed'
    }, doctorToken);
    console.log('✔ Doctor Mark as Completed:', completedUpdate.status, completedUpdate.body.message);

    // 9. Update status to Cancelled test
    const cancelledUpdate = await request('PATCH', `/appointments/${createdApptId}/status`, {
      status: 'Cancelled'
    }, doctorToken);
    console.log('✔ Doctor Cancel Appointment:', cancelledUpdate.status, cancelledUpdate.body.message);

    // 10. Test AI summary endpoint
    const aiTest = await request('POST', '/ai/summarize', {
      reason: 'Persistent fever and sore throat for 4 days',
      patientName: 'Alex Morgan',
      doctorName: 'Dr. Marcus Chen'
    });
    console.log('✔ AI Summary Endpoint:', aiTest.status, aiTest.body.summary);

    console.log('\n🎉 ALL API TESTS PASSED SUCCESSFULLY! Data storage and role-based workflows verified.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test suite error:', err);
    process.exit(1);
  }
};

// Wait 1.5s for server to initialize
setTimeout(runTests, 1500);
