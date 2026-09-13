import React from 'react';
import { Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { ThreeDCard } from './ThreeDCard';

export const StatsOverview = ({ appointments = [] }) => {
  const total = appointments.length;
  const pending = appointments.filter(a => a.status === 'Pending').length;
  const completed = appointments.filter(a => a.status === 'Completed').length;
  const cancelled = appointments.filter(a => a.status === 'Cancelled').length;

  const stats = [
    {
      label: 'Total Appointments',
      value: total,
      icon: <Calendar className="w-5 h-5 text-medical-600" />,
      bg: 'bg-medical-50/90 border-medical-200/80 text-medical-900 shadow-3d-cyan',
      badgeBg: 'bg-medical-100 text-medical-700'
    },
    {
      label: 'Pending Approval',
      value: pending,
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50/90 border-amber-200/80 text-amber-900 shadow-soft',
      badgeBg: 'bg-amber-100 text-amber-700'
    },
    {
      label: 'Completed Visits',
      value: completed,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50/90 border-emerald-200/80 text-emerald-900 shadow-3d-teal',
      badgeBg: 'bg-emerald-100 text-emerald-700'
    },
    {
      label: 'Cancelled',
      value: cancelled,
      icon: <XCircle className="w-5 h-5 text-rose-600" />,
      bg: 'bg-rose-50/90 border-rose-200/80 text-rose-900 shadow-soft',
      badgeBg: 'bg-rose-100 text-rose-700'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => (
        <ThreeDCard key={idx} depth={12} maxRotation={8} className="rounded-2xl">
          <div
            className={`p-4 rounded-2xl border transition-all duration-200 h-full preserve-3d ${stat.bg}`}
          >
            <div className="flex items-center justify-between mb-2 translate-z-10">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                {stat.label}
              </span>
              <div className="p-2 rounded-xl bg-white shadow-sm badge-3d">
                {stat.icon}
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 translate-z-20">
              {stat.value}
            </div>
          </div>
        </ThreeDCard>
      ))}
    </div>
  );
};

