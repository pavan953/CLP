import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { AppointmentTable } from '../components/AppointmentTable';
import { CalendarView } from '../components/CalendarView';
import { StatsOverview } from '../components/StatsOverview';
import {
  Stethoscope,
  Calendar,
  ListFilter,
  RefreshCw,
  Users,
  Activity,
  UserPlus,
  Plus,
  ShieldCheck,
  X,
  Lock,
  Mail,
  Phone,
  Building
} from 'lucide-react';

export const DoctorDashboard = ({ showToast, onOpenProfile }) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'calendar', 'staff'
  const [myOnly, setMyOnly] = useState(false);

  // Doctors list for staff tab
  const [doctorsList, setDoctorsList] = useState([]);

  // Add Doctor Form Modal
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocEmail, setNewDocEmail] = useState('');
  const [newDocPassword, setNewDocPassword] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState('Cardiologist');
  const [newDocDepartment, setNewDocDepartment] = useState('Cardiology');
  const [newDocPhone, setNewDocPhone] = useState('');
  const [addingDoc, setAddingDoc] = useState(false);

  // Fetch appointments
  const fetchAppointments = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await api.getAppointments({ myOnly: myOnly ? 'true' : 'false' });
      if (res.success) {
        setAppointments(res.appointments);
      }
    } catch (err) {
      if (!silent) showToast('Failed to load appointments: ' + err.message, 'error');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await api.getDoctors();
      if (res.success) {
        setDoctorsList(res.doctors);
      }
    } catch (err) {
      console.error('Failed to load doctors list:', err);
    }
  };

  // Real-time synchronization polling every 4 seconds
  useEffect(() => {
    fetchAppointments(false);
    fetchDoctors();

    const interval = setInterval(() => {
      fetchAppointments(true);
    }, 4000);

    return () => clearInterval(interval);
  }, [myOnly]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await api.updateAppointmentStatus(id, newStatus);
      if (res.success) {
        showToast(res.message, 'success');
        setAppointments(prev => prev.map(a => (a._id === id || a.id === id) ? res.appointment : a));
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    if (!newDocName.trim() || !newDocEmail.trim() || !newDocPassword.trim()) {
      showToast('Doctor name, email, and password are required.', 'warning');
      return;
    }

    setAddingDoc(true);
    try {
      const res = await api.addDoctor({
        name: newDocName.trim(),
        email: newDocEmail.trim(),
        password: newDocPassword,
        specialty: newDocSpecialty.trim(),
        department: newDocDepartment.trim(),
        phone: newDocPhone.trim()
      });

      if (res.success) {
        showToast(res.message, 'success');
        setShowAddDoctorModal(false);
        setNewDocName('');
        setNewDocEmail('');
        setNewDocPassword('');
        setNewDocPhone('');
        fetchDoctors();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setAddingDoc(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Doctor Header Banner */}
      <div className="bg-gradient-to-r from-medical-700 via-medical-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-medical-700/10 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>Hospital Clinical Staff Portal • Live Real-Time Queue</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {user?.name || 'Doctor'}
            </h1>
            <p className="text-sm text-medical-100 mt-1 max-w-xl">
              Specialty: <span className="font-semibold text-white">{user?.specialty || 'Medical Specialist'}</span> • Department: <span className="font-semibold text-white">{user?.department || 'OPD'}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Real-Time Status Indicator */}
            <div className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white/10 text-xs font-semibold border border-white/15">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live Sync Active</span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => fetchAppointments(false)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition shadow-sm"
              title="Force Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Edit Clinical Profile Button */}
            <button
              onClick={onOpenProfile}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 shadow-sm transition flex items-center space-x-1.5"
            >
              <Stethoscope className="w-4 h-4 text-teal-300" />
              <span>Edit My Profile</span>
            </button>

            {/* Onboard Doctor Button */}
            <button
              onClick={() => setShowAddDoctorModal(true)}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold text-xs shadow-md transition flex items-center space-x-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Onboard Doctor</span>
            </button>

            {/* Scope Filter Toggle */}
            <button
              onClick={() => setMyOnly(!myOnly)}
              className="px-4 py-2.5 rounded-xl bg-white text-medical-800 hover:bg-medical-50 font-bold text-xs shadow-md transition flex items-center space-x-2"
            >
              <Users className="w-4 h-4 text-medical-600" />
              <span>{myOnly ? 'Showing My Patients' : 'Showing All Patients'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Doctor Incomplete Profile Prompt */}
      {!user?.isProfileComplete && (
        <div className="mb-8 p-5 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 flex-shrink-0 mt-0.5">
              <Stethoscope className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Please Complete Your Clinical Profile</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Add your medical qualifications, years of experience, consultation fee, cabin room, and clinical bio so patients can view your profile on the hospital directory.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenProfile}
            className="self-start sm:self-center px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition whitespace-nowrap"
          >
            Complete Profile Now →
          </button>
        </div>
      )}

      {/* Analytics Overview */}
      <StatsOverview appointments={appointments} />

      {/* View Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 mb-6 pb-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              viewMode === 'list'
                ? 'bg-medical-50 text-medical-700 border border-medical-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>Patient Queue ({appointments.length})</span>
          </button>

          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              viewMode === 'calendar'
                ? 'bg-medical-50 text-medical-700 border border-medical-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Calendar</span>
          </button>

          <button
            onClick={() => setViewMode('staff')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              viewMode === 'staff'
                ? 'bg-medical-50 text-medical-700 border border-medical-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Hospital Doctors Roster ({doctorsList.length})</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 hidden sm:block">
          Click <span className="font-semibold text-emerald-600">Completed</span> to finish visit or <span className="font-semibold text-rose-600">Cancel</span> to reject
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'list' && (
        <AppointmentTable
          appointments={appointments}
          onUpdateStatus={handleUpdateStatus}
          title="Live Patient Consultations"
          description={myOnly ? `Real-time appointments assigned to ${user?.name}` : "All incoming appointments received from patients across clinic departments"}
        />
      )}

      {viewMode === 'calendar' && (
        <CalendarView
          appointments={appointments}
        />
      )}

      {viewMode === 'staff' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Hospital Medical Staff</h3>
              <p className="text-xs text-slate-500">Verified physicians authorized to conduct consultations</p>
            </div>
            <button
              onClick={() => setShowAddDoctorModal(true)}
              className="px-4 py-2 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs shadow-sm transition flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Verified Doctor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {doctorsList.map(doc => (
              <div key={doc._id || doc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{doc.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    Staff
                  </span>
                </div>
                <div className="text-xs font-semibold text-medical-600">{doc.specialty || 'Physician'}</div>
                <div className="text-[11px] text-slate-400">Department: {doc.department || 'General'}</div>
                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span>{doc.email}</span>
                  <span>{doc.phone || 'On Call'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Doctor Modal */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-medical-600 text-white">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Onboard Verified Doctor</h3>
              </div>
              <button
                onClick={() => setShowAddDoctorModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDoctor} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Doctor Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Chen"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-medical-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Specialty <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pediatrician"
                    value={newDocSpecialty}
                    onChange={(e) => setNewDocSpecialty(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-medical-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pediatrics"
                    value={newDocDepartment}
                    onChange={(e) => setNewDocDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-medical-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Staff Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="doctor@hospital.com"
                    value={newDocEmail}
                    onChange={(e) => setNewDocEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-medical-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Temporary Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={newDocPassword}
                    onChange={(e) => setNewDocPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-medical-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 012-3456"
                  value={newDocPhone}
                  onChange={(e) => setNewDocPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-medical-200 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddDoctorModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingDoc}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-medical-600 hover:bg-medical-700 shadow-sm disabled:opacity-50"
                >
                  {addingDoc ? 'Onboarding...' : 'Confirm & Add to Directory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
