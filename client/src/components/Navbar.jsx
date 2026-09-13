import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, User, LogOut, ShieldCheck, HeartPulse, RefreshCw } from 'lucide-react';

export const Navbar = ({ onQuickSwitchRole }) => {
  const { user, role, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-medical-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-medical-500/20">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl tracking-tight text-slate-900">MediBook</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-medical-50 text-medical-700 border border-medical-200">
                Healthcare
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Mini Appointment Booking System</p>
          </div>
        </div>

        {/* User Info & Controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {user && (
            <>
              {/* Role Badge */}
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
                {role === 'doctor' ? (
                  <Stethoscope className="w-4 h-4 text-medical-600" />
                ) : (
                  <User className="w-4 h-4 text-emerald-600" />
                )}
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800 leading-none">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize leading-tight mt-0.5">
                    {role === 'doctor' ? `Doctor (${user.specialty || 'General'})` : 'Patient Account'}
                  </div>
                </div>
              </div>

              {/* Quick Switch Button */}
              {onQuickSwitchRole && (
                <button
                  onClick={onQuickSwitchRole}
                  title="Quickly test the other role"
                  className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition border border-slate-200"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Switch to {role === 'doctor' ? 'Patient' : 'Doctor'}</span>
                </button>
              )}

              {/* Logout Button */}
              <button
                onClick={logout}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
