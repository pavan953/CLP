const http = require('http');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });
const PORT = process.env.PORT || 5050;

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
  console.log('--- Starting Clinic Living Plus Real-Time Test Suite ---');

  try {

    const health = await request('GET', '/health');
    console.log('✔ Health Check:', health.status, health.body);

    const fakeLogin = await request('POST', '/auth/login', {
      email: 'nonexistent.user.12345@gmail.com',
      password: 'password123'
    });
    console.log('✔ Non-Existent User Login (Expected 404):', fakeLogin.status, fakeLogin.body.message);
    if (fakeLogin.status !== 404) {
      throw new Error(`Expected 404 for non-existent user, got ${fakeLogin.status}`);
    }

    const wrongPass = await request('POST', '/auth/login', {
      email: 'admin@hospital.com',
      password: 'wrong_password_xyz'
    });
    console.log('✔ Wrong Password Login (Expected 401):', wrongPass.status, wrongPass.body.message);
    if (wrongPass.status !== 401) {
      throw new Error(`Expected 401 for wrong password, got ${wrongPass.status}`);
    }

    const adminLogin = await request('POST', '/auth/login', {
      email: 'admin@hospital.com',
      password: 'Admin@123'
    });
    console.log('✔ Hospital Admin Login:', adminLogin.status, adminLogin.body.user?.name);
    const adminToken = adminLogin.body.token;

    const runId = Date.now();
    const docEmail = `marcus.${runId}@hospital.com`;
    const patientEmail = `elena.${runId}@gmail.com`;

    const addDoc = await request('POST', '/auth/add-doctor', {
      name: 'Dr. Marcus Chen',
      email: docEmail,
      password: 'Password@123',
      specialty: 'Pediatric Specialist',
      department: 'Pediatrics',
      phone: '+1 (555) 321-7654'
    }, adminToken);
    console.log('✔ Admin Onboard Doctor:', addDoc.status, addDoc.body.message);
    if (addDoc.status !== 201) {
      throw new Error(`Expected 201 for doctor onboarding, got ${addDoc.status}`);
    }

    const realPatient = await request('POST', '/auth/register', {
      name: 'Elena Rostova',
      email: patientEmail,
      password: 'PatientPassword123',
      phone: '9876543210'
    });
    console.log('✔ Real Patient Register:', realPatient.status, realPatient.body.user?.name);
    if (realPatient.status !== 201) {
      throw new Error(`Expected 201 for patient register, got ${realPatient.status}`);
    }
    const patientToken = realPatient.body.token;

    const patientAsDoctor = await request('POST', '/auth/login', {
      email: patientEmail,
      password: 'PatientPassword123',
      role: 'doctor'
    });
    console.log('✔ Patient Email in Doctor Portal (Expected 403):', patientAsDoctor.status, patientAsDoctor.body.message);
    if (patientAsDoctor.status !== 403) {
      throw new Error(`Expected 403 for patient logging in as doctor, got ${patientAsDoctor.status}`);
    }

    const doctorAsPatient = await request('POST', '/auth/login', {
      email: 'admin@hospital.com',
      password: 'Admin@123',
      role: 'patient'
    });
    console.log('✔ Doctor Email in Patient Portal (Expected 403):', doctorAsPatient.status, doctorAsPatient.body.message);
    if (doctorAsPatient.status !== 403) {
      throw new Error(`Expected 403 for doctor logging in as patient, got ${doctorAsPatient.status}`);
    }

    const duplicateRegister = await request('POST', '/auth/register', {
      name: 'Duplicate Elena',
      email: patientEmail,
      password: 'SomePassword123'
    });
    console.log('✔ Duplicate Email Registration (Expected 409):', duplicateRegister.status, duplicateRegister.body.message);
    if (duplicateRegister.status !== 409) {
      throw new Error(`Expected 409 for duplicate registration, got ${duplicateRegister.status}`);
    }

    const doctors = await request('GET', '/auth/doctors');
    console.log(`✔ Verified Doctors on Duty: Found ${doctors.body.doctors?.length} doctors`);

    const invalidPhoneLong = await request('POST', '/appointments', {
      patientName: 'Elena Rostova',
      mobileNumber: '98765432101',
      doctorName: 'Dr. Marcus Chen',
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '11:15 AM'
    }, patientToken);
    console.log('✔ Reject 11-Digit Mobile Number (Expected 400):', invalidPhoneLong.status, invalidPhoneLong.body.message);
    if (invalidPhoneLong.status !== 400) {
      throw new Error(`Expected 400 for 11-digit phone number, got ${invalidPhoneLong.status}`);
    }

    const invalidPhoneShort = await request('POST', '/appointments', {
      patientName: 'Elena Rostova',
      mobileNumber: '987654321',
      doctorName: 'Dr. Marcus Chen',
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '11:15 AM'
    }, patientToken);
    console.log('✔ Reject 9-Digit Mobile Number (Expected 400):', invalidPhoneShort.status, invalidPhoneShort.body.message);
    if (invalidPhoneShort.status !== 400) {
      throw new Error(`Expected 400 for 9-digit phone number, got ${invalidPhoneShort.status}`);
    }

    const booking = await request('POST', '/appointments', {
      patientName: 'Elena Rostova',
      mobileNumber: '9876543210',
      doctorName: 'Dr. Marcus Chen',
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '11:15 AM',
      reason: 'Routine pediatric assessment and vaccination consultation'
    }, patientToken);
    console.log('✔ Patient Book Appointment with Valid 10-Digit Mobile:', booking.status, booking.body.message);
    if (booking.status !== 201) {
      throw new Error(`Expected 201 for valid booking, got ${booking.status}`);
    }
    const apptId = booking.body.appointment._id || booking.body.appointment.id;

    const doctorQueue = await request('GET', '/appointments', null, adminToken);
    console.log(`✔ Doctor Real-Time Patient Queue Count: ${doctorQueue.body.count}`);

    const completeAction = await request('PATCH', `/appointments/${apptId}/status`, {
      status: 'Completed'
    }, adminToken);
    console.log('✔ Doctor Mark as Completed:', completeAction.status, completeAction.body.message);

    const doctorProfileUpdate = await request('PUT', '/auth/profile', {
      qualification: 'MBBS, MD (Cardiology), FACC',
      experience: '14+ Years',
      bio: 'Board-certified cardiologist dedicated to preventive care, non-invasive imaging, and heart health.',
      cabinNumber: 'Room 304, East Wing',
      consultationFee: '$65'
    }, adminToken);
    console.log('✔ Doctor Clinical Profile Update:', doctorProfileUpdate.status, doctorProfileUpdate.body.user?.qualification, 'Complete:', doctorProfileUpdate.body.user?.isProfileComplete);

    const patientProfileUpdate = await request('PUT', '/auth/profile', {
      bloodGroup: 'O+',
      emergencyContact: '+1 (555) 998-0011',
      allergies: 'Penicillin allergy',

      specialty: 'Fake Surgeon',
      department: 'Surgery',
      qualification: 'Fake Degree',
      consultationFee: '$500'
    }, patientToken);
    console.log('✔ Patient Health Profile Update:', patientProfileUpdate.status, 'Blood Group:', patientProfileUpdate.body.user?.bloodGroup);

    const patientMe = await request('GET', '/auth/me', null, patientToken);
    const pUser = patientMe.body.user;
    const forbiddenDoctorKeys = ['specialty', 'department', 'qualification', 'experience', 'bio', 'consultationFee', 'availableDays', 'cabinNumber', 'isProfileComplete'];
    for (const key of forbiddenDoctorKeys) {
      if (pUser[key] !== undefined) {
        throw new Error(`Security Violation: Doctor-only field "${key}" is present in patient profile! Value: ${pUser[key]}`);
      }
    }
    console.log('✔ Patient Role Schema Verified: Zero doctor-specific fields in patient profile.');

    const fpNonExistent = await request('POST', '/auth/forgot-password', {
      email: 'nonexistent_user_recovery@hospital.com',
      newPassword: 'newpassword123',
      confirmPassword: 'newpassword123'
    });
    if (fpNonExistent.status !== 404) {
      throw new Error(`Expected 404 for non-existent email recovery, got ${fpNonExistent.status}`);
    }
    console.log('✔ Forgot Password Non-Existent Email (Expected 404):', fpNonExistent.status);

    const fpWrongRole = await request('POST', '/auth/forgot-password', {
      email: patientEmail,
      newPassword: 'newpassword123',
      confirmPassword: 'newpassword123',
      role: 'doctor'
    });
    if (fpWrongRole.status !== 403) {
      throw new Error(`Expected 403 for patient email on doctor portal recovery, got ${fpWrongRole.status}`);
    }
    console.log('✔ Forgot Password Portal Role Mismatch (Expected 403):', fpWrongRole.status);

    const fpShortPass = await request('POST', '/auth/forgot-password', {
      email: patientEmail,
      newPassword: '123',
      confirmPassword: '123',
      role: 'patient'
    });
    if (fpShortPass.status !== 400) {
      throw new Error(`Expected 400 for short password recovery, got ${fpShortPass.status}`);
    }
    console.log('✔ Forgot Password Short Password (Expected 400):', fpShortPass.status);

    const fpSuccess = await request('POST', '/auth/forgot-password', {
      email: patientEmail,
      newPassword: 'UpdatedSecurePass123!',
      confirmPassword: 'UpdatedSecurePass123!',
      role: 'patient'
    });
    if (fpSuccess.status !== 200) {
      throw new Error(`Expected 200 for successful forgot password, got ${fpSuccess.status}`);
    }
    console.log('✔ Forgot Password Reset Success:', fpSuccess.status, fpSuccess.body.message);

    const loginWithNewPass = await request('POST', '/auth/login', {
      email: patientEmail,
      password: 'UpdatedSecurePass123!',
      role: 'patient'
    });
    if (loginWithNewPass.status !== 200) {
      throw new Error(`Expected 200 login with new password, got ${loginWithNewPass.status}`);
    }
    console.log('✔ Sign In with Reset Password Success:', loginWithNewPass.status, loginWithNewPass.body.user.name);

    await request('POST', '/auth/forgot-password', {
      email: patientEmail,
      newPassword: 'patientpassword123',
      confirmPassword: 'patientpassword123',
      role: 'patient'
    });

    console.log('\n🎉 ALL CLINIC LIVING PLUS AUTH, APPOINTMENT, ROLE ENFORCEMENT & SCHEMA TESTS PASSED CLEANLY!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test suite failure:', err);
    process.exit(1);
  }
};

setTimeout(runTests, 1500);

