import React, { useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Calendar,
  Clock,
  Phone,
  User,
  Stethoscope,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const AppointmentTable = ({
  appointments = [],
  onUpdateStatus,
  title = "Appointments List",
  description = "Real-time records of all booked consultations"
}) => {
  const { role } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const filteredAppointments = appointments.filter(appt => {
    const matchesStatus = statusFilter === 'All' || appt.status === statusFilter;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term ||
      (appt.patientName && appt.patientName.toLowerCase().includes(term)) ||
      (appt.mobileNumber && appt.mobileNumber.includes(term)) ||
      (appt.doctorName && appt.doctorName.toLowerCase().includes(term));
    return matchesStatus && matchesSearch;
  });

  const handleAction = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await onUpdateStatus(id, newStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">

      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">{title}</h2>
          <p className="text-xs text-slate-500">{description}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patient, phone, doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-medical-200 focus:border-medical-500 transition"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-medical-200 appearance-none transition"
            >
              <option value="All">All Statuses ({appointments.length})</option>
              <option value="Pending">Pending ({appointments.filter(a => a.status === 'Pending').length})</option>
              <option value="Completed">Completed ({appointments.filter(a => a.status === 'Completed').length})</option>
              <option value="Cancelled">Cancelled ({appointments.filter(a => a.status === 'Cancelled').length})</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
              ▼
            </div>
          </div>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-700">No appointments found</h3>
          <p className="text-xs text-slate-400 mt-1">
            {searchTerm || statusFilter !== 'All'
              ? 'Try adjusting your search criteria or filter options.'
              : 'Appointments booked by patients will appear right here.'}
          </p>
        </div>
      ) : (
        <>

          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Patient Name</th>
                  <th className="py-3.5 px-6">Mobile Number</th>
                  <th className="py-3.5 px-6">Doctor</th>
                  <th className="py-3.5 px-6">Date & Time</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredAppointments.map((appt) => {
                  const id = appt._id || appt.id;
                  const isExpanded = expandedId === id;
                  const isBusy = updatingId === id;

                  return (
                    <React.Fragment key={id}>
                      <tr className="hover:bg-slate-50/70 transition-colors">

                        <td className="py-4 px-6 font-semibold text-slate-900">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-full bg-medical-50 text-medical-700 flex items-center justify-center font-bold text-xs">
                              {appt.patientName ? appt.patientName.charAt(0).toUpperCase() : 'P'}
                            </div>
                            <div>
                              <div className="text-slate-900 font-semibold">{appt.patientName}</div>
                              {appt.reason && (
                                <button
                                  onClick={() => toggleExpand(id)}
                                  className="text-[11px] text-medical-600 hover:text-medical-800 flex items-center mt-0.5"
                                >
                                  <span>{isExpanded ? 'Hide reason' : 'View reason / AI'}</span>
                                  {isExpanded ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
                                </button>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-slate-600 font-medium">
                          <div className="flex items-center space-x-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{appt.mobileNumber}</span>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-slate-700">
                          <div className="flex items-center space-x-1.5">
                            <Stethoscope className="w-3.5 h-3.5 text-medical-600" />
                            <span className="font-medium">{appt.doctorName}</span>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-slate-600">
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-1.5 font-medium text-slate-800">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>{appt.appointmentDate}</span>
                            </div>
                            <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{appt.appointmentTime}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <StatusBadge status={appt.status} />
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end space-x-2">

                            {role === 'doctor' && appt.status !== 'Completed' && (
                              <button
                                onClick={() => handleAction(id, 'Completed')}
                                disabled={isBusy}
                                title="Mark appointment as Completed"
                                className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition disabled:opacity-50"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Completed</span>
                              </button>
                            )}

                            {appt.status !== 'Cancelled' && (
                              <button
                                onClick={() => handleAction(id, 'Cancelled')}
                                disabled={isBusy}
                                title="Cancel this appointment"
                                className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition disabled:opacity-50"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Cancel</span>
                              </button>
                            )}

                            {appt.status === 'Completed' && role !== 'doctor' && (
                              <span className="text-xs text-slate-400 italic">No further actions</span>
                            )}
                            {appt.status === 'Cancelled' && (
                              <span className="text-xs text-slate-400 italic">Cancelled</span>
                            )}
                          </div>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-slate-50/50">
                          <td colSpan={6} className="px-6 py-3 border-t border-slate-100 text-xs">
                            <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                              {appt.reason && (
                                <div>
                                  <span className="font-bold text-slate-700">Patient Reason: </span>
                                  <span className="text-slate-600">{appt.reason}</span>
                                </div>
                              )}
                              {appt.aiSummary && (
                                <div className="flex items-start space-x-2 text-purple-900 bg-purple-50 p-2.5 rounded-lg border border-purple-100">
                                  <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-bold">AI Clinical Brief: </span>
                                    <span>{appt.aiSummary}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden divide-y divide-slate-100">
            {filteredAppointments.map((appt) => {
              const id = appt._id || appt.id;
              const isBusy = updatingId === id;

              return (
                <div key={id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{appt.patientName}</div>
                      <div className="flex items-center space-x-1 text-xs text-slate-500 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{appt.mobileNumber}</span>
                      </div>
                    </div>
                    <StatusBadge status={appt.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                    <div className="flex items-center space-x-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-medical-600 flex-shrink-0" />
                      <span className="truncate">{appt.doctorName}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{appt.appointmentDate}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 col-span-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{appt.appointmentTime}</span>
                    </div>
                  </div>

                  {appt.reason && (
                    <div className="text-xs text-slate-600 bg-white border border-slate-100 p-2 rounded-lg">
                      <span className="font-semibold text-slate-700">Reason: </span>
                      {appt.reason}
                    </div>
                  )}

                  {appt.aiSummary && (
                    <div className="text-xs text-purple-900 bg-purple-50 border border-purple-100 p-2 rounded-lg flex items-start space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">AI Summary: </span>
                        <span>{appt.aiSummary}</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-1 flex items-center justify-end space-x-2">
                    {role === 'doctor' && appt.status !== 'Completed' && (
                      <button
                        onClick={() => handleAction(id, 'Completed')}
                        disabled={isBusy}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </button>
                    )}

                    {appt.status !== 'Cancelled' && (
                      <button
                        onClick={() => handleAction(id, 'Cancelled')}
                        disabled={isBusy}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

