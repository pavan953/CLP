import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ThreeDCard } from '../components/ThreeDCard';
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
  Ambulance,
  BadgeCheck,
  Check
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
    <div className="space-y-16 sm:space-y-24 pb-16 overflow-x-hidden">
      {/* 1. Hero Section with Interactive WebGL Scene */}
      <section className="relative overflow-hidden bg-gradient-to-b from-medical-50/60 via-white/80 to-slate-50/60 pt-8 pb-16 sm:pb-24 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Emergency Alert Banner with Glassmorphic Depth */}
          <div className="mb-6 inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-rose-50/90 backdrop-blur-md border border-rose-200 text-xs font-bold text-rose-800 shadow-soft badge-3d">
            <Ambulance className="w-4 h-4 text-rose-600 animate-pulse flex-shrink-0" />
            <span>24/7 Emergency & Trauma Hotline: <strong>+1 (800) 555-0199</strong></span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-medical-100/90 text-medical-800 text-xs font-bold uppercase tracking-wider badge-3d border border-medical-200/60">
                <Building2 className="w-4 h-4 text-medical-600" />
                <span>Clinic Living Plus</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Excellence in Healthcare, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-600 via-teal-600 to-cyan-600">
                  Precision in Care.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                Connect directly with board-certified physicians, schedule clinic visits without waiting, and manage your health records in real-time.
              </p>

              {/* Action Buttons with Tactile Extrusion */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigateToBooking ? onNavigateToBooking() : onNavigateToAuth('patient', 'login')}
                  className="px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-medical-600 btn-3d flex items-center space-x-2 shadow-md shadow-medical-500/20"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{user && role === 'patient' ? 'Go to My Booking Dashboard' : 'Book an Appointment'}</span>
                </button>

                {!user && (
                  <>
                    <button
                      onClick={() => onNavigateToAuth('patient', 'login')}
                      className="px-5 py-3.5 rounded-xl font-bold text-sm text-slate-700 bg-white border border-slate-200 btn-3d-white flex items-center space-x-1.5"
                    >
                      <User className="w-4 h-4 text-medical-600" />
                      <span>Sign In / Login</span>
                    </button>

                    <button
                      onClick={() => onNavigateToAuth('patient', 'signup')}
                      className="px-5 py-3.5 rounded-xl font-bold text-sm text-white bg-teal-600 btn-3d-teal flex items-center space-x-1.5 shadow-md shadow-teal-500/20"
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
              <div className="pt-4 border-t border-slate-200/80 grid grid-cols-3 gap-3 sm:gap-4">
                <ThreeDCard depth={10} maxRotation={8} className="rounded-2xl">
                  <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-soft h-full">
                    <div className="text-xl sm:text-2xl font-extrabold text-slate-900 translate-z-10">24/7</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-semibold">Emergency Care</div>
                  </div>
                </ThreeDCard>
                <ThreeDCard depth={10} maxRotation={8} className="rounded-2xl">
                  <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-soft h-full">
                    <div className="text-xl sm:text-2xl font-extrabold text-slate-900 translate-z-10">100%</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-semibold">Real-Time Sync</div>
                  </div>
                </ThreeDCard>
                <ThreeDCard depth={10} maxRotation={8} className="rounded-2xl">
                  <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-soft h-full">
                    <div className="text-xl sm:text-2xl font-extrabold text-slate-900 translate-z-10">Zero</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-semibold">Paperwork Lag</div>
                  </div>
                </ThreeDCard>
              </div>
            </div>

            {/* Right Hero: Clinical Care & Services Showcase (Clean Modern Visual) */}
            <div className="lg:col-span-6">
              <div className="relative bg-gradient-to-tr from-medical-700 via-medical-600 to-teal-700 p-6 sm:p-8 rounded-3xl text-white shadow-2xl overflow-hidden border border-white/20 shadow-3d-cyan">
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-52 h-52 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-44 h-44 bg-teal-400/15 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  {/* Top Status Banner */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-md">
                        <HeartPulse className="w-7 h-7 text-teal-200" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white leading-tight">Clinic Living Plus Pavilion</div>
                        <p className="text-[11px] text-teal-100">Outpatient & Consultation Center</p>
                      </div>
                    </div>

                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                      <span>OPD Open Now</span>
                    </span>
                  </div>

                  {/* Consultation Features Quick Glance */}
                  <div className="space-y-3 bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 shadow-inner text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-lg bg-teal-400/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-teal-300" />
                      </div>
                      <span className="font-medium text-slate-100">Direct physician calendar reservation with zero wait time</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-lg bg-teal-400/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-teal-300" />
                      </div>
                      <span className="font-medium text-slate-100">Live appointment status tracking: Pending, Approved, Completed</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-lg bg-teal-400/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-teal-300" />
                      </div>
                      <span className="font-medium text-slate-100">Automated clinical AI intake briefs prepared for your doctor</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-lg bg-teal-400/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-teal-300" />
                      </div>
                      <span className="font-medium text-slate-100">Permanent digital medical history and health records</span>
                    </div>
                  </div>

                  {/* Quick Schedule Preview */}
                  <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between text-xs text-medical-100">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-teal-300" />
                      <span>Mon – Sat: <strong>8:00 AM – 8:00 PM</strong></span>
                    </div>
                    <span className="font-bold text-white bg-white/20 px-2.5 py-1 rounded-full text-[10px]">
                      24/7 Trauma Ready
                    </span>
                  </div>

                  {/* Visitor Action CTA */}
                  {!user && (
                    <div className="pt-2 border-t border-white/15 grid grid-cols-2 gap-3">
                      <button
                        onClick={() => onNavigateToAuth('patient', 'login')}
                        className="py-3 px-4 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-50 transition shadow-sm text-center active:scale-95"
                      >
                        Patient Login
                      </button>
                      <button
                        onClick={() => onNavigateToAuth('patient', 'signup')}
                        className="py-3 px-4 rounded-xl text-xs font-bold text-white bg-teal-500 hover:bg-teal-400 transition shadow-sm text-center active:scale-95"
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

      {/* 2. About The Hospital Section with 3D Cards */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-medical-600 bg-medical-50 px-3 py-1 rounded-full border border-medical-200 badge-3d">
            About Our Healthcare Center
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
            Committed to Compassionate Clinical Excellence
          </h2>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">
            Founded with the belief that exceptional healthcare begins with attentive, timely consultations, Clinic Living Plus integrates experienced medical specialists with modern digital patient management.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ThreeDCard depth={18} maxRotation={10} className="rounded-2xl">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-3 h-full preserve-3d">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-sm translate-z-20">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base translate-z-10">Certified Specialists</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every medical practitioner in our directory is verified and accredited in their respective fields of medicine.
              </p>
            </div>
          </ThreeDCard>

          <ThreeDCard depth={18} maxRotation={10} className="rounded-2xl">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-3 h-full preserve-3d">
              <div className="w-10 h-10 rounded-xl bg-medical-50 text-medical-600 flex items-center justify-center shadow-sm translate-z-20">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base translate-z-10">Zero Waiting Queue</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dedicated scheduled appointment slots prevent clinic congestion and guarantee focused 1-on-1 consultations.
              </p>
            </div>
          </ThreeDCard>

          <ThreeDCard depth={18} maxRotation={10} className="rounded-2xl">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-3 h-full preserve-3d">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm translate-z-20">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base translate-z-10">Smart AI Clinical Triage</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Synthesizes patient symptom entries into structured medical briefs to help doctors prepare ahead of consultations.
              </p>
            </div>
          </ThreeDCard>

          <ThreeDCard depth={18} maxRotation={10} className="rounded-2xl">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-3 h-full preserve-3d">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm translate-z-20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base translate-z-10">Permanent Records</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                All consultation bookings and health statuses remain persistently stored and securely available whenever you sign in.
              </p>
            </div>
          </ThreeDCard>
        </div>
      </section>

      {/* 3. Hospital Departments with 3D Depth */}
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
            <ThreeDCard key={idx} depth={16} maxRotation={8} className="rounded-2xl">
              <div className={`p-6 rounded-2xl border transition h-full preserve-3d shadow-soft ${dept.bg}`}>
                <div className="p-2.5 rounded-xl bg-white shadow-sm inline-block mb-4 translate-z-20">
                  {dept.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5 translate-z-10">{dept.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{dept.desc}</p>
              </div>
            </ThreeDCard>
          ))}
        </div>
      </section>

      {/* 4. Verified Doctors Showcase with 3D Cards */}
      <section id="doctors" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-medical-600 bg-medical-50 px-3 py-1 rounded-full border border-medical-200 badge-3d">
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
              <ThreeDCard key={doc._id || doc.id} depth={14} maxRotation={8} className="rounded-2xl">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 flex flex-col justify-between h-full preserve-3d hover:border-medical-300 transition">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-medical-50 border border-medical-100 flex items-center justify-center text-medical-700 font-bold text-lg shadow-sm translate-z-20">
                        {doc.name.replace('Dr. ', '').charAt(0)}
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 translate-z-10">
                        ● Active Duty
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 translate-z-10">{doc.name}</h3>
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

                  <div className="mt-6 pt-4 border-t border-slate-100 translate-z-20">
                    <button
                      onClick={() => onNavigateToBooking ? onNavigateToBooking(doc.name) : onNavigateToAuth('patient', 'login')}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-medical-700 bg-medical-50 hover:bg-medical-100 transition flex items-center justify-center space-x-1.5 shadow-sm badge-3d"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book with {doc.name.split(' ')[0]}</span>
                    </button>
                  </div>
                </div>
              </ThreeDCard>
            ))}
          </div>
        )}
      </section>

      {/* 5. Hospital Contact & Visiting Hours */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-800 shadow-3d-slate">
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

      {/* 6. Patient Onboarding Banner (Only for Visitors) with 3D Depth */}
      {!user && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ThreeDCard depth={12} maxRotation={5} className="rounded-3xl">
            <div className="bg-gradient-to-r from-medical-700 via-medical-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 preserve-3d">
              <div className="space-y-2 max-w-xl">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full inline-block badge-3d">
                  Start Your Care Journey
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold translate-z-10">Ready to Schedule Your Consultation?</h3>
                <p className="text-xs sm:text-sm text-medical-100 leading-relaxed">
                  Sign in to your patient account or create a new profile in seconds to access certified doctors and real-time appointment bookings.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 translate-z-20">
                <button
                  onClick={() => onNavigateToAuth('patient', 'login')}
                  className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-white text-medical-800 btn-3d-white flex items-center space-x-2"
                >
                  <User className="w-4 h-4 text-medical-600" />
                  <span>Sign In / Login</span>
                </button>
                <button
                  onClick={() => onNavigateToAuth('patient', 'signup')}
                  className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-teal-500 text-white btn-3d-teal flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-teal-200" />
                  <span>Create Patient Account</span>
                </button>
              </div>
            </div>
          </ThreeDCard>
        </section>
      )}
    </div>
  );
};
