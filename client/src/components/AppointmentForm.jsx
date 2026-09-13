import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { User, Phone, Stethoscope, Calendar, Clock, Sparkles, AlertCircle, Check, Loader2 } from 'lucide-react';

const TIME_SLOTS = [
  '09:00 AM',
  '09:45 AM',
  '10:30 AM',
  '11:15 AM',
  '12:00 PM',
  '02:00 PM',
  '02:45 PM',
  '03:30 PM',
  '04:15 PM',
  '05:00 PM'
];

export const AppointmentForm = ({ onAppointmentCreated, showToast, preselectedDoctor = '' }) => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  // Form Fields strictly required by assignment
  const [patientName, setPatientName] = useState(user?.role === 'patient' ? user.name : '');
  const [mobileNumber, setMobileNumber] = useState(user?.phone || '');
  const [doctorName, setDoctorName] = useState(preselectedDoctor || '');
  const [doctorId, setDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  
  // Optional Reason & AI Bonus
  const [reason, setReason] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Status & Validation
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch available doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.getDoctors();
        if (res.success && res.doctors.length > 0) {
          setDoctors(res.doctors);
          if (!preselectedDoctor) {
            setDoctorName(res.doctors[0].name);
            setDoctorId(res.doctors[0]._id || res.doctors[0].id);
          } else {
            const matched = res.doctors.find(d => d.name === preselectedDoctor);
            if (matched) {
              setDoctorName(matched.name);
              setDoctorId(matched._id || matched.id);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  // Set min date to today YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  const handleDoctorChange = (e) => {
    const selectedName = e.target.value;
    setDoctorName(selectedName);
    const doc = doctors.find(d => d.name === selectedName);
    setDoctorId(doc ? (doc._id || doc.id) : '');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!patientName.trim() || patientName.trim().length < 2) {
      newErrors.patientName = 'Please enter a valid patient name (min 2 characters).';
    }

    const digitsOnly = mobileNumber.replace(/\D/g, '');
    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required.';
    } else if (digitsOnly.length !== 10) {
      newErrors.mobileNumber = 'Please enter exactly a 10-digit mobile number.';
    }

    if (!doctorName.trim()) {
      newErrors.doctorName = 'Please select a doctor.';
    }

    if (!appointmentDate) {
      newErrors.appointmentDate = 'Please select an appointment date.';
    } else if (appointmentDate < today) {
      newErrors.appointmentDate = 'Appointment date cannot be in the past.';
    }

    if (!appointmentTime) {
      newErrors.appointmentTime = 'Please select an appointment time slot.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateAiSummary = async () => {
    if (!reason.trim()) {
      setErrors(prev => ({ ...prev, reason: 'Please describe symptoms or reason for visit first.' }));
      return;
    }
    setErrors(prev => ({ ...prev, reason: null }));
    setIsGeneratingAi(true);

    try {
      const res = await api.generateAiSummary({
        reason,
        patientName,
        doctorName
      });
      if (res.success && res.summary) {
        setAiSummary(res.summary);
        showToast('AI Clinical Summary generated!', 'success');
      }
    } catch (err) {
      showToast('Could not generate AI summary: ' + err.message, 'error');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fix the errors in the form before submitting.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        patientName: patientName.trim(),
        mobileNumber: mobileNumber.trim(),
        doctorName: doctorName.trim(),
        doctorId,
        appointmentDate,
        appointmentTime,
        reason: reason.trim(),
        aiSummary: aiSummary.trim()
      };

      const res = await api.createAppointment(payload);
      if (res.success) {
        showToast('Appointment booked successfully! All data has been saved.', 'success');
        
        // Reset fields
        if (user?.role !== 'patient') {
          setPatientName('');
          setMobileNumber('');
        }
        setReason('');
        setAiSummary('');
        setAppointmentDate('');
        setAppointmentTime('');
        setErrors({});

        if (onAppointmentCreated) {
          onAppointmentCreated(res.appointment);
        }
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-medical-50/60 to-white">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-medical-600 text-white shadow-sm">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Book an Appointment</h2>
            <p className="text-xs text-slate-500">Fill in patient details to schedule a clinic visit</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* 1. Patient Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Patient Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={patientName}
                onChange={(e) => {
                  setPatientName(e.target.value);
                  if (errors.patientName) setErrors(prev => ({ ...prev, patientName: null }));
                }}
                placeholder="e.g. Alex Morgan"
                className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition ${
                  errors.patientName ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-medical-200 focus:border-medical-500'
                }`}
              />
            </div>
            {errors.patientName && (
              <p className="text-xs text-rose-600 mt-1 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.patientName}
              </p>
            )}
          </div>

          {/* 2. Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Mobile Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setMobileNumber(cleaned);
                  if (errors.mobileNumber) setErrors(prev => ({ ...prev, mobileNumber: null }));
                }}
                placeholder="10-digit number (e.g. 9876543210)"
                maxLength={10}
                className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition ${
                  errors.mobileNumber ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-medical-200 focus:border-medical-500'
                }`}
              />
            </div>
            {errors.mobileNumber && (
              <p className="text-xs text-rose-600 mt-1 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.mobileNumber}
              </p>
            )}
          </div>
        </div>

        {/* 3. Doctor Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Select Doctor <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Stethoscope className="w-4 h-4" />
            </div>
            <select
              value={doctorName}
              onChange={handleDoctorChange}
              className={`w-full pl-10 pr-8 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition appearance-none ${
                errors.doctorName ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-medical-200 focus:border-medical-500'
              }`}
            >
              {doctors.map(doc => (
                <option key={doc._id || doc.id} value={doc.name}>
                  {doc.name} — {doc.specialty || 'Physician'} ({doc.department || 'General'})
                </option>
              ))}
              {!doctors.some(d => d.name === doctorName) && doctorName && (
                <option value={doctorName}>{doctorName}</option>
              )}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              ▼
            </div>
          </div>
          {errors.doctorName && (
            <p className="text-xs text-rose-600 mt-1 flex items-center">
              <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.doctorName}
            </p>
          )}
        </div>

        {/* 4. Appointment Date & 5. Time Slot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Appointment Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                min={today}
                value={appointmentDate}
                onChange={(e) => {
                  setAppointmentDate(e.target.value);
                  if (errors.appointmentDate) setErrors(prev => ({ ...prev, appointmentDate: null }));
                }}
                className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition ${
                  errors.appointmentDate ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-medical-200 focus:border-medical-500'
                }`}
              />
            </div>
            {errors.appointmentDate && (
              <p className="text-xs text-rose-600 mt-1 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.appointmentDate}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Appointment Time <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Clock className="w-4 h-4" />
              </div>
              <select
                value={appointmentTime}
                onChange={(e) => {
                  setAppointmentTime(e.target.value);
                  if (errors.appointmentTime) setErrors(prev => ({ ...prev, appointmentTime: null }));
                }}
                className={`w-full pl-10 pr-8 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition appearance-none ${
                  errors.appointmentTime ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-medical-200 focus:border-medical-500'
                }`}
              >
                <option value="">-- Choose a time slot --</option>
                {TIME_SLOTS.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
            {errors.appointmentTime && (
              <p className="text-xs text-rose-600 mt-1 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.appointmentTime}
              </p>
            )}
          </div>
        </div>

        {/* Optional Bonus: Reason & AI Summary */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Reason for Visit / Symptoms <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <button
              type="button"
              onClick={handleGenerateAiSummary}
              disabled={isGeneratingAi || !reason.trim()}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingAi ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Generate AI Summary ⭐</span>
                </>
              )}
            </button>
          </div>

          <textarea
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Experiencing persistent dry cough and mild fever for 3 days..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition"
          />
          {errors.reason && (
            <p className="text-xs text-rose-600 mt-1 flex items-center">
              <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.reason}
            </p>
          )}

          {/* AI Summary Output Preview */}
          {aiSummary && (
            <div className="mt-3 p-3 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-purple-950 flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">AI Clinical Brief: </span>
                <span>{aiSummary}</span>
              </div>
            </div>
          )}
        </div>

        {/* 6. Submit button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-medical-600 to-teal-600 hover:from-medical-700 hover:to-teal-700 shadow-md shadow-medical-500/20 active:scale-[0.99] transition flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Appointment...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Confirm & Book Appointment</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
