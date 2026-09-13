import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { AppointmentTable } from '../components/AppointmentTable';
import { CalendarView } from '../components/CalendarView';
import { StatsOverview } from '../components/StatsOverview';
import { Stethoscope, Calendar, ListFilter, RefreshCw, Users, Activity } from 'lucide-react';

export const DoctorDashboard = ({ showToast }) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [myOnly, setMyOnly] = useState(false);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.getAppointments({ myOnly: myOnly ? 'true' : 'false' });
      if (res.success) {
        setAppointments(res.appointments);
      }
    } catch (err) {
      showToast('Failed to load appointments: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Doctor Header Banner */}
      <div className="bg-gradient-to-r from-medical-700 via-medical-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-medical-700/10 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>Doctor & Clinical Administrator Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {user?.name || 'Doctor'}
            </h1>
            <p className="text-sm text-medical-100 mt-1 max-w-xl">
              Specialty: <span className="font-semibold text-white">{user?.specialty || 'General Physician'}</span> • Department: <span className="font-semibold text-white">{user?.department || 'OPD'}</span>
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={fetchAppointments}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition shadow-sm"
              title="Refresh Appointments"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* My Patients vs All Patients filter toggle */}
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

      {/* Analytics Overview */}
      <StatsOverview appointments={appointments} />

      {/* View Switcher: List vs Calendar */}
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
            <span>Appointment List ({appointments.length})</span>
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
        </div>

        <div className="text-xs text-slate-500 hidden sm:block">
          Click <span className="font-semibold text-emerald-600">Completed</span> to mark finished or <span className="font-semibold text-rose-600">Cancel</span> to reject
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'list' ? (
        <AppointmentTable
          appointments={appointments}
          onUpdateStatus={handleUpdateStatus}
          title="Patient Appointments"
          description={myOnly ? `Patient appointments assigned to ${user?.name}` : "All appointments received across hospital departments"}
        />
      ) : (
        <CalendarView
          appointments={appointments}
        />
      )}
    </div>
  );
};
