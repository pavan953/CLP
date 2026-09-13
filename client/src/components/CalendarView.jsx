import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Stethoscope, User } from 'lucide-react';

export const CalendarView = ({ appointments = [], onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState('');

  // Year & Month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Navigate months
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Days in current month
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Map appointments to date string YYYY-MM-DD
  const apptsByDate = {};
  appointments.forEach(appt => {
    const dStr = appt.appointmentDate;
    if (!apptsByDate[dStr]) {
      apptsByDate[dStr] = [];
    }
    apptsByDate[dStr].push(appt);
  });

  const handleDayClick = (dayNumber) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
    setSelectedDateStr(prev => prev === formattedDate ? '' : formattedDate);
    if (onSelectDate) {
      onSelectDate(formattedDate);
    }
  };

  const selectedDayAppointments = selectedDateStr ? (apptsByDate[selectedDateStr] || []) : [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
      {/* Calendar Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-slate-500">View scheduled appointments on calendar</p>
          </div>
        </div>

        <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-slate-600 transition"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-white hover:shadow-sm rounded-lg transition"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-slate-600 transition"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/70 text-center py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 border-b border-slate-100">
        {/* Leading empty cells */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="h-16 sm:h-20 bg-slate-50/40 p-1"></div>
        ))}

        {/* Days of month */}
        {Array.from({ length: totalDays }).map((_, i) => {
          const dayNum = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
          const dayAppts = apptsByDate[dateStr] || [];
          const isSelected = selectedDateStr === dateStr;
          const isToday = new Date().toISOString().split('T')[0] === dateStr;

          return (
            <div
              key={dayNum}
              onClick={() => handleDayClick(dayNum)}
              className={`h-16 sm:h-20 p-1.5 sm:p-2 cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-medical-50/80 ring-2 ring-inset ring-medical-500'
                  : 'hover:bg-slate-50'
              } ${isToday ? 'bg-amber-50/30' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ${
                    isToday
                      ? 'bg-medical-600 text-white'
                      : isSelected
                      ? 'text-medical-700 font-extrabold'
                      : 'text-slate-700'
                  }`}
                >
                  {dayNum}
                </span>

                {dayAppts.length > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-medical-100 text-medical-800">
                    {dayAppts.length}
                  </span>
                )}
              </div>

              {/* Day preview dots */}
              <div className="space-y-1 overflow-hidden">
                {dayAppts.slice(0, 2).map((a, idx) => (
                  <div
                    key={idx}
                    className={`text-[9px] truncate px-1 rounded font-medium ${
                      a.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : a.status === 'Cancelled'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {a.appointmentTime} - {a.doctorName?.split(' ')[1] || a.patientName}
                  </div>
                ))}
                {dayAppts.length > 2 && (
                  <div className="text-[9px] text-slate-400 pl-1 font-semibold">
                    +{dayAppts.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Day Details Panel */}
      {selectedDateStr && (
        <div className="p-4 sm:p-6 bg-slate-50/80 border-t border-slate-200 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4 text-medical-600" />
              <span>Appointments for {selectedDateStr}</span>
            </h3>
            <button
              onClick={() => setSelectedDateStr('')}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              Clear filter
            </button>
          </div>

          {selectedDayAppointments.length === 0 ? (
            <p className="text-xs text-slate-500">No appointments scheduled on this date.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedDayAppointments.map((appt, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{appt.patientName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      appt.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                      appt.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{appt.appointmentTime}</span>
                    <span>•</span>
                    <Stethoscope className="w-3.5 h-3.5 text-medical-600" />
                    <span className="truncate">{appt.doctorName}</span>
                  </div>
                  {appt.reason && (
                    <div className="text-[11px] text-slate-500 italic bg-slate-50 p-1.5 rounded">
                      "{appt.reason}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
