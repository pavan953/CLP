import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { AppointmentForm } from '../components/AppointmentForm';
import { AppointmentTable } from '../components/AppointmentTable';
import { CalendarView } from '../components/CalendarView';
import { StatsOverview } from '../components/StatsOverview';
import { PlusCircle, List, Calendar, UserCheck } from 'lucide-react';

export const PatientDashboard = ({ showToast }) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('book'); // 'book', 'list', 'calendar'

  const fetchMyAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.getAppointments();
      if (res.success) {
        setAppointments(res.appointments);
      }
    } catch (err) {
      showToast('Failed to load your appointments: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAppointments();
  }, []);

  const handleAppointmentCreated = (newAppt) => {
    setAppointments(prev => [newAppt, ...prev]);
    // Switch to My Appointments tab so patient immediately sees their booking
    setActiveTab('list');
  };

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
      {/* Patient Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-medical-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-teal-700/10 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md mb-2">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Patient Health Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hello, {user?.name || 'Patient'}
            </h1>
            <p className="text-sm text-emerald-100 mt-1 max-w-xl">
              Schedule your next doctor consultation, view interactive calendars, and track your appointment statuses in real-time.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('book')}
            className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-white text-teal-800 hover:bg-emerald-50 font-bold text-xs shadow-md transition flex items-center space-x-2"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>Book New Appointment</span>
          </button>
        </div>
      </div>

      {/* Patient Stats Overview */}
      <StatsOverview appointments={appointments} />

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('book')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'book'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>

        <button
          onClick={() => setActiveTab('list')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'list'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <List className="w-4 h-4" />
          <span>My Appointments ({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'calendar'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Calendar Schedule</span>
        </button>
      </div>

      {/* Active Tab Content */}
      <div className="space-y-8">
        {activeTab === 'book' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <AppointmentForm
                onAppointmentCreated={handleAppointmentCreated}
                showToast={showToast}
              />
            </div>
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
                <h3 className="font-bold text-sm text-slate-800 mb-2">Booking Guidelines</h3>
                <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                  <li>Consultations can be scheduled up to 30 days in advance.</li>
                  <li>Ensure your 10-digit mobile number is accurate for SMS alerts.</li>
                  <li>Need quick assistance? Use our <strong>AI Summary</strong> button to summarize symptoms for your doctor.</li>
                </ul>
              </div>

              {appointments.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Recent Bookings
                  </h4>
                  <AppointmentTable
                    appointments={appointments.slice(0, 3)}
                    onUpdateStatus={handleUpdateStatus}
                    title="Recent Bookings"
                    description="Your latest 3 scheduled visits"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'list' && (
          <AppointmentTable
            appointments={appointments}
            onUpdateStatus={handleUpdateStatus}
            title="My Appointments"
            description="All appointments you have booked through this portal"
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            appointments={appointments}
          />
        )}
      </div>
    </div>
  );
};
