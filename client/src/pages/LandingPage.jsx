import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  HeartPulse,
  Stethoscope,
  ShieldCheck,
  Clock,
  PhoneCall,
  Calendar,
  CheckCircle2,
  Users,
  User,
  Sparkles,
  Activity,
  Award,
  ArrowRight,
  MapPin,
  Building2,
  Ambulance
} from 'lucide-react';

export const LandingPage = ({ onNavigateToAuth, onNavigateToBooking }) => {
  const { user, role } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  // Fetch real verified doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.getDoctors();
        if (res.success) {
          setDoctors(res.doctors);
        }
      } catch (err) {
        console.error('Error loading doctors for landing page:', err);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  const departments = [
    {
      name: 'Cardiology & Vascular',
      desc: 'Comprehensive cardiovascular care, ECG, and preventative heart screening.',
      icon: <Activity className="w-6 h-6 text-rose-500" />,
      bg: 'bg-rose-50 border-rose-100'
    },
    {
      name: 'Pediatrics & Child Care',
      desc: 'Gentle developmental care, immunizations, and pediatric health checkups.',
      icon: <HeartPulse className="w-6 h-6 text-teal-500" />,
      bg: 'bg-teal-50 border-teal-100'
    },
    {
      name: 'General Medicine & OPD',
      desc: 'Day-to-day diagnostic consultations, routine evaluations, and preventative triage.',
      icon: <Stethoscope className="w-6 h-6 text-medical-600" />,
      bg: 'bg-medical-50 border-medical-100'
    },
    {
      name: 'Orthopedics & Joint Care',
      desc: 'Bone health, musculoskeletal treatments, joint mobility, and rehabilitation.',
      icon: <ShieldCheck className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50 border-amber-100'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-medical-50/70 via-white to-slate-50 pt-10 pb-16 sm:pb-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Emergency Alert Banner */}
          <div className="mb-6 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800">
            <Ambulance className="w-4 h-4 text-rose-600 animate-pulse" />
            <span>24/7 Emergency & Trauma Hotline: <strong>+1 (800) 555-0199</strong></span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-medical-100/80 text-medical-800 text-xs font-bold uppercase tracking-wider badge-3d">
                <Building2 className="w-4 h-4 text-medical-600" />
                <span>Clinic Living Plus</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Excellence in Healthcare, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-600 to-teal-600">
                  Precision in Care.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Connect directly with board-certified physicians, schedule clinic visits without waiting, and manage your health records in real-time.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigateToBooking ? onNavigateToBooking() : onNavigateToAuth('patient', 'login')}
                  className="px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-medical-600 to-teal-600 hover:from-medical-700 hover:to-teal-700 shadow-md shadow-medical-500/20 active:scale-[0.99] transition flex items-center space-x-2 badge-3d"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{user && role === 'patient' ? 'Go to My Booking Dashboard' : 'Book an Appointment'}</span>
                </button>

                {!user && (
                  <>
                    <button
                      onClick={() => onNavigateToAuth('patient', 'login')}
                      className="px-5 py-3.5 rounded-xl font-bold text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition flex items-center space-x-1.5 badge-3d"
                    >
                      <User className="w-4 h-4 text-medical-600" />
                      <span>Sign In / Login</span>
                    </button>

                    <button
                      onClick={() => onNavigateToAuth('patient', 'signup')}
                      className="px-5 py-3.5 rounded-xl font-bold text-sm text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition flex items-center space-x-1.5 badge-3d"
                    >
                      <Sparkles className="w-4 h-4 text-teal-200" />
                      <span>Sign Up</span>
                    </button>
                  </>
                )}

                <a
                  href="#doctors"
                  className="px-5 py-3.5 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center space-x-1.5 badge-3d"
                >
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>View Our Doctors</span>
                </a>
              </div>

              {/* Trust Indicators with 3D Depth */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4">
                <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/70 shadow-soft badge-3d">
                  <div className="text-2xl font-extrabold text-slate-900">24/7</div>
                  <div className="text-xs text-slate-500 mt-0.5 font-medium">Emergency Care</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/70 shadow-soft badge-3d">
                  <div className="text-2xl font-extrabold text-slate-900">100%</div>
                  <div className="text-xs text-slate-500 mt-0.5 font-medium">Real-Time Sync</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/70 shadow-soft badge-3d">
                  <div className="text-2xl font-extrabold text-slate-900">Zero</div>
                  <div className="text-xs text-slate-500 mt-0.5 font-medium">Paperwork Lag</div>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Card with 3D Float & Depth */}
            <div className="lg:col-span-5 perspective-container">
              <div className="relative bg-gradient-to-tr from-medical-700 via-medical-600 to-teal-700 p-8 rounded-3xl text-white shadow-2xl overflow-hidden animate-float-3d preserve-3d glow-3d">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="space-y-6 relative z-10 preserve-3d">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-md">
                    <HeartPulse className="w-7 h-7 text-teal-200" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold">Trusted Hospital Services</h3>
                    <p className="text-xs text-medical-100 mt-1.5 leading-relaxed">
                      Equipped with modern outpatient facilities, digital clinical notes, and emergency critical triage.
                    </p>
                  </div>

                  <div className="space-y-3 text-xs bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shadow-inner">
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-300 flex-shrink-0" />
                      <span>Direct physician calendar reservation</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-300 flex-shrink-0" />
                      <span>Live status alerts: Pending, Completed, Cancelled</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-300 flex-shrink-0" />
                      <span>Automated clinical AI intake briefs</span>
                    </div>
                  </div>

                  <div className="pt-2 text-xs text-medical-200 flex items-center justify-between">
                    <span>Mon - Sat: 8:00 AM - 8:00 PM</span>
                    <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-full">OPD Open</span>
                  </div>

                  {!user && (
                    <div className="pt-3 border-t border-white/15 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onNavigateToAuth('patient', 'login')}
                        className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 transition shadow-sm text-center"
                      >
                        Patient Login
                      </button>
                      <button
                        onClick={() => onNavigateToAuth('patient', 'signup')}
                        className="py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-teal-500 hover:bg-teal-400 transition shadow-sm text-center"
                      >
                        New Patient Sign Up
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. About The Hospital Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-medical-600 bg-medical-50 px-3 py-1 rounded-full border border-medical-200">
            About Our Healthcare Center
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
            Committed to Compassionate Clinical Excellence
          </h2>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">
            Founded with the belief that exceptional healthcare begins with attentive, timely consultations, Clinic Living Plus integrates experienced medical specialists with modern digital patient management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-3 card-3d">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-sm">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Certified Specialists</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every medical practitioner in our directory is verified and accredited in their respective fields of medicine.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-3 card-3d">
            <div className="w-10 h-10 rounded-xl bg-medical-50 text-medical-600 flex items-center justify-center shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Zero Waiting Queue</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dedicated scheduled appointment slots prevent clinic congestion and guarantee focused 1-on-1 consultations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-3 card-3d">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Smart AI Clinical Triage</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Synthesizes patient symptom entries into structured medical briefs to help doctors prepare ahead of consultations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-3 card-3d">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Permanent Records</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              All consultation bookings and health statuses remain persistently stored and securely available whenever you sign in.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Hospital Departments */}
      <section id="departments" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Our Medical Departments
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Multi-disciplinary healthcare services designed to cover all aspects of family and specialized medicine.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border transition card-3d ${dept.bg}`}
            >
              <div className="p-2.5 rounded-xl bg-white shadow-sm inline-block mb-4">
                {dept.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">{dept.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{dept.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Verified Doctors Showcase (Live Real-Time Data) */}
      <section id="doctors" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-medical-600 bg-medical-50 px-3 py-1 rounded-full border border-medical-200">
              Medical Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Meet Our Verified Doctors
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Active medical staff currently accepting appointments at Clinic Living Plus
            </p>
          </div>

          <div className="mt-4 md:mt-0 text-xs font-semibold text-slate-500">
            Total Staff on Roster: <span className="text-slate-900 font-bold">{doctors.length}</span>
          </div>
        </div>

        {loadingDoctors ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading verified doctors directory...</div>
        ) : doctors.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
            <p className="text-xs text-slate-500">No doctors on duty yet. Hospital administrator can add new verified doctors.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doc) => (
              <div
                key={doc._id || doc.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 flex flex-col justify-between card-3d hover:border-medical-300 transition"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-medical-50 border border-medical-100 flex items-center justify-center text-medical-700 font-bold text-lg shadow-sm">
                      {doc.name.replace('Dr. ', '').charAt(0)}
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ● Active Duty
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{doc.name}</h3>
                  {doc.qualification && (
                    <div className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md inline-block mt-1">
                      {doc.qualification}
                    </div>
                  )}
                  <div className="text-xs font-semibold text-medical-600 mt-1">
                    {doc.specialty || 'General Physician'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Department: {doc.department || 'Outpatient Department'}
                  </div>

                  {doc.bio && (
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 italic">
                      "{doc.bio}"
                    </p>
                  )}

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Exp: {doc.experience || 'Experienced'}</span>
                    <span className="font-bold text-slate-800">Fee: {doc.consultationFee || '$50'}</span>
                  </div>

                  {doc.phone && (
                    <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-2">
                      <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                      <span>{doc.phone}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => onNavigateToBooking ? onNavigateToBooking(doc.name) : onNavigateToAuth('patient', 'login')}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-medical-700 bg-medical-50 hover:bg-medical-100 transition flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book with {doc.name.split(' ')[0]}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Hospital Contact & Visiting Hours */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-teal-400">
                <MapPin className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Hospital Location</span>
              </div>
              <h3 className="text-lg font-bold">Clinic Living Plus Medical Pavilion</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                450 Healthcare Boulevard, Suite 100<br />
                Central Medical District, NY 10001
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-teal-400">
                <Clock className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">OPD & Consultation Hours</span>
              </div>
              <p className="text-xs text-slate-300">
                Monday – Friday: 08:00 AM – 08:00 PM<br />
                Saturday: 09:00 AM – 04:00 PM<br />
                <span className="text-rose-400 font-semibold">24/7 Emergency & ICU Always Open</span>
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-teal-400">
                <PhoneCall className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Help Desk & Contact</span>
              </div>
              <p className="text-xs text-slate-300">
                Appointment Desk: +1 (800) 555-0144<br />
                Emergency Line: +1 (800) 555-0199<br />
                Email: support@cliniclivingplus.com
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Patient Onboarding & Schedule Consultation Banner (Only for Visitors) */}
      {!user && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-medical-700 via-medical-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 card-3d">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full inline-block">
                Start Your Care Journey
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold">Ready to Schedule Your Consultation?</h3>
              <p className="text-xs sm:text-sm text-medical-100 leading-relaxed">
                Sign in to your patient account or create a new profile in seconds to access certified doctors and real-time appointment bookings.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigateToAuth('patient', 'login')}
                className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-white text-medical-800 hover:bg-slate-50 shadow-md transition flex items-center space-x-2"
              >
                <User className="w-4 h-4 text-medical-600" />
                <span>Sign In / Login</span>
              </button>
              <button
                onClick={() => onNavigateToAuth('patient', 'signup')}
                className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-teal-500 hover:bg-teal-400 text-white shadow-md transition flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-teal-200" />
                <span>Create Patient Account</span>
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
