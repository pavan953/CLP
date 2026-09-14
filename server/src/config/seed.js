const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const { getStatus, readData, writeData } = require('./db');

const CANONICAL_DOCTORS = [
  {
    name: 'Dr. Marcus Chen',
    email: 'marcus.chen@hospital.com',
    specialty: 'Pediatrician',
    department: 'Pediatrics & Child Care',
    qualification: 'MD, FAAP (Pediatrics)',
    experience: '10+ Years',
    bio: 'Specializing in child development, routine pediatric screening, and compassionate infant wellness care.',
    consultationFee: '₹600',
    availableDays: 'Mon - Fri',
    cabinNumber: 'Suite 101, East Wing',
    phone: '+1 (555) 012-3401',
    isProfileComplete: true
  },
  {
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@hospital.com',
    specialty: 'Cardiologist',
    department: 'Cardiology & Vascular',
    qualification: 'MBBS, MD (Cardiology), FACC',
    experience: '15+ Years',
    bio: 'Board-certified cardiologist dedicated to preventive cardiology, non-invasive imaging, and heart health.',
    consultationFee: '₹750',
    availableDays: 'Mon - Thu',
    cabinNumber: 'Suite 204, West Wing',
    phone: '+1 (555) 012-3402',
    isProfileComplete: true
  },
  {
    name: 'Dr. Emily Watson',
    email: 'emily.watson@hospital.com',
    specialty: 'Neurologist',
    department: 'Neurology & Neurosurgery',
    qualification: 'MD, PhD (Neurology)',
    experience: '12+ Years',
    bio: 'Expertise in neurological disorders, migraine management, and brain health evaluations.',
    consultationFee: '₹800',
    availableDays: 'Tue - Sat',
    cabinNumber: 'Suite 302, North Tower',
    phone: '+1 (555) 012-3403',
    isProfileComplete: true
  },
  {
    name: 'Dr. James Wilson',
    email: 'james.wilson@hospital.com',
    specialty: 'Orthopedic Surgeon',
    department: 'Orthopedics & Joint Care',
    qualification: 'MS (Orthopedics), FRCS',
    experience: '14+ Years',
    bio: 'Specializes in joint preservation, musculoskeletal rehabilitation, and sports injury recovery.',
    consultationFee: '₹700',
    availableDays: 'Mon, Wed, Fri',
    cabinNumber: 'Suite 105, East Wing',
    phone: '+1 (555) 012-3404',
    isProfileComplete: true
  },
  {
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@hospital.com',
    specialty: 'Dermatologist',
    department: 'Dermatology & Cosmetology',
    qualification: 'MD (Dermatology), DNB',
    experience: '9+ Years',
    bio: 'Clinical and aesthetic dermatology specialist focusing on skin health, allergy detection, and therapies.',
    consultationFee: '₹550',
    availableDays: 'Mon - Fri',
    cabinNumber: 'Suite 210, South Wing',
    phone: '+1 (555) 012-3405',
    isProfileComplete: true
  },
  {
    name: 'Dr. Robert Taylor',
    email: 'robert.taylor@hospital.com',
    specialty: 'General Physician',
    department: 'General Medicine & OPD',
    qualification: 'MBBS, MD (Internal Medicine)',
    experience: '16+ Years',
    bio: 'Primary care physician providing holistic medical diagnoses, health checkups, and chronic disease care.',
    consultationFee: '₹500',
    availableDays: 'Mon - Sat',
    cabinNumber: 'Suite 102, OPD Clinic',
    phone: '+1 (555) 012-3406',
    isProfileComplete: true
  },
  {
    name: 'Dr. Maria Garcia',
    email: 'maria.garcia@hospital.com',
    specialty: 'Gynecologist',
    department: 'Obstetrics & Gynecology',
    qualification: 'MD (OB/GYN), FACOG',
    experience: '11+ Years',
    bio: 'Dedicated womens health physician offering prenatal guidance, reproductive healthcare, and wellness care.',
    consultationFee: '₹650',
    availableDays: 'Mon - Thu',
    cabinNumber: 'Suite 208, West Wing',
    phone: '+1 (555) 012-3407',
    isProfileComplete: true
  },
  {
    name: 'Dr. David Kim',
    email: 'david.kim@hospital.com',
    specialty: 'ENT Specialist',
    department: 'ENT (Ear, Nose, Throat)',
    qualification: 'MS (Otolaryngology)',
    experience: '8+ Years',
    bio: 'Specialized care for ear, nose, throat, sinusitis, hearing health, and balance disorders.',
    consultationFee: '₹550',
    availableDays: 'Tue - Sat',
    cabinNumber: 'Suite 112, East Wing',
    phone: '+1 (555) 012-3408',
    isProfileComplete: true
  },
  {
    name: 'Dr. Anita Desai',
    email: 'anita.desai@hospital.com',
    specialty: 'Psychiatrist',
    department: 'Psychiatry & Behavioral Health',
    qualification: 'MD (Psychiatry), MRCPsych',
    experience: '13+ Years',
    bio: 'Compassionate behavioral health specialist focusing on mental well-being, mindfulness, and cognitive health.',
    consultationFee: '₹750',
    availableDays: 'Mon - Fri',
    cabinNumber: 'Suite 315, North Tower',
    phone: '+1 (555) 012-3409',
    isProfileComplete: true
  },
  {
    name: 'Dr. Alan Foster',
    email: 'alan.foster@hospital.com',
    specialty: 'Oncologist',
    department: 'Oncology & Cancer Care',
    qualification: 'MD, DM (Medical Oncology)',
    experience: '18+ Years',
    bio: 'Renowned oncologist providing oncology consultations, advanced tumor therapy plans, and patient support.',
    consultationFee: '₹900',
    availableDays: 'Mon, Wed, Thu',
    cabinNumber: 'Suite 401, Specialized Care',
    phone: '+1 (555) 012-3410',
    isProfileComplete: true
  }
];

const seedInitialData = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin@123', salt);
    const doctorPassword = await bcrypt.hash('Doctor@123', salt);

    const canonicalEmails = CANONICAL_DOCTORS.map(d => d.email.toLowerCase());

    const { isMongoConnected } = getStatus();

    if (isMongoConnected) {
      const adminUser = await User.findOne({ email: 'admin@hospital.com' });
      if (!adminUser) {
        await User.create({
          name: 'Hospital Administrator',
          email: 'admin@hospital.com',
          password: adminPassword,
          role: 'doctor',
          phone: '+1 (555) 019-2834',
          specialty: 'Chief Hospital Administrator',
          department: 'Hospital Administration & Executive'
        });
      } else {
        adminUser.name = 'Hospital Administrator';
        adminUser.specialty = 'Chief Hospital Administrator';
        adminUser.department = 'Hospital Administration & Executive';
        adminUser.password = adminPassword;
        await adminUser.save();
      }

      const allAllowedEmails = ['admin@hospital.com', ...canonicalEmails];
      await User.deleteMany({
        role: 'doctor',
        email: { $nin: allAllowedEmails }
      });

      for (const docData of CANONICAL_DOCTORS) {
        const existing = await User.findOne({ email: docData.email.toLowerCase() });
        if (!existing) {
          await User.create({
            ...docData,
            role: 'doctor',
            password: doctorPassword
          });
        } else {
          Object.assign(existing, docData);
          existing.password = doctorPassword;
          await existing.save();
        }
      }
    }

    const fileData = readData();
    let updatedUsers = fileData.users || [];

    const fileAdminIndex = updatedUsers.findIndex(u => u.email === 'admin@hospital.com');
    if (fileAdminIndex === -1) {
      updatedUsers.push({
        _id: '6aa6c66c03030196952abfa9',
        name: 'Hospital Administrator',
        email: 'admin@hospital.com',
        password: adminPassword,
        role: 'doctor',
        phone: '+1 (555) 019-2834',
        specialty: 'Chief Hospital Administrator',
        department: 'Hospital Administration & Executive',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } else {
      updatedUsers[fileAdminIndex].name = 'Hospital Administrator';
      updatedUsers[fileAdminIndex].specialty = 'Chief Hospital Administrator';
      updatedUsers[fileAdminIndex].department = 'Hospital Administration & Executive';
      updatedUsers[fileAdminIndex].password = adminPassword;
    }

    updatedUsers = updatedUsers.filter(u => {
      if (u.role !== 'doctor') return true;
      if (u.email === 'admin@hospital.com') return true;
      return canonicalEmails.includes(u.email.toLowerCase());
    });

    for (const docData of CANONICAL_DOCTORS) {
      const idx = updatedUsers.findIndex(u => u.email.toLowerCase() === docData.email.toLowerCase());
      if (idx === -1) {
        updatedUsers.push({
          _id: 'doc_' + docData.email.split('@')[0],
          ...docData,
          role: 'doctor',
          password: doctorPassword,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } else {
        Object.assign(updatedUsers[idx], docData);
        updatedUsers[idx].password = doctorPassword;
        updatedUsers[idx].updatedAt = new Date().toISOString();
      }
    }

    fileData.users = updatedUsers;
    writeData(fileData);

    console.log('[Hospital Setup] Initialized 10 canonical doctors with distinct specialties. Purged all duplicate staff records.');
  } catch (err) {
    console.error('[Hospital Setup] Error during hospital initialization:', err.message);
  }
};

module.exports = seedInitialData;

