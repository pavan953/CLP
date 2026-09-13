import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, User, LogOut, HeartPulse, Calendar, ShieldCheck, Home } from 'lucide-react';

export const Navbar = ({ currentView, onNavigate }) => {
  const { user, role, logout } = useAuth();

  const handleScrollTo = (elementId) => {
    if (currentView !== 'landing') {
      onNavigate('landing');
      setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(elementId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center space-x-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-medical-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-medical-500/20">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl tracking-tight text-slate-900">MediBook</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-medical-50 text-medical-700 border border-medical-200">
                Hospital
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Premier Clinical Center</p>
          </div>
        </div>

        {/* Public Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => onNavigate('landing')}
            className={`hover:text-medical-600 transition ${currentView === 'landing' ? 'text-medical-600 font-bold' : ''}`}
          >
            Home
          </button>
          <button
            onClick={() => handleScrollTo('about')}
            className="hover:text-medical-600 transition"
          >
            About Hospital
          </button>
          <button
            onClick={() => handleScrollTo('doctors')}
            className="hover:text-medical-600 transition"
          >
            Our Doctors
          </button>
          <button
            onClick={() => handleScrollTo('contact')}
            className="hover:text-medical-600 transition"
          >
            Contact & Hours
          </button>
        </nav>

        {/* Auth / Dashboard Controls */}
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              {/* Dashboard Navigation button */}
              <button
                onClick={() => onNavigate('dashboard')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                  currentView === 'dashboard'
                    ? 'bg-medical-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{role === 'doctor' ? 'Doctor Portal' : 'My Dashboard'}</span>
              </button>

              {/* Verified Role Badge (No switch allowed!) */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                {role === 'doctor' ? (
                  <Stethoscope className="w-4 h-4 text-medical-600" />
                ) : (
                  <User className="w-4 h-4 text-emerald-600" />
                )}
                <div>
                  <span className="font-bold text-slate-900 block leading-none">{user.name}</span>
                  <span className="text-[10px] text-slate-500 capitalize">
                    {role === 'doctor' ? 'Medical Staff' : 'Verified Patient'}
                  </span>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={logout}
                title="Sign out from portal"
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onNavigate('auth', 'patient')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
              >
                Patient Sign In
              </button>

              <button
                onClick={() => onNavigate('auth', 'doctor')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-medical-600 hover:bg-medical-700 shadow-sm transition flex items-center space-x-1.5"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Staff Portal</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
