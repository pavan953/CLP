import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, User, LogOut, HeartPulse, Calendar, AlertTriangle, X, ShieldCheck } from 'lucide-react';

export const Navbar = ({ currentView, onNavigate, onOpenProfile }) => {
  const { user, role, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    onNavigate('landing');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
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
                <span className="font-bold text-xl tracking-tight text-slate-900">Clinic Living Plus</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-medical-50 text-medical-700 border border-medical-200">
                  Hospital
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Premier Clinical Center</p>
            </div>
          </div>

          {/* Navigation Links — ONLY shown when user is logged in! */}
          {user ? (
            <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-600">
              <button
                onClick={() => onNavigate('dashboard')}
                className={`hover:text-medical-600 transition ${currentView === 'dashboard' ? 'text-medical-600 font-bold' : ''}`}
              >
                {role === 'doctor' ? 'Doctor Portal' : 'My Dashboard'}
              </button>
              <button
                onClick={() => onNavigate('landing')}
                className={`hover:text-medical-600 transition ${currentView === 'landing' ? 'text-medical-600 font-bold' : ''}`}
              >
                Hospital Home
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
          ) : (
            <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-slate-500 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-medical-600" />
              <span>Sign in required to access hospital records</span>
            </div>
          )}

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

                {/* Verified Role Badge (Clickable to open profile settings) */}
                <button
                  onClick={onOpenProfile}
                  title="Click to view & edit profile settings"
                  className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs transition cursor-pointer text-left"
                >
                  {role === 'doctor' ? (
                    <Stethoscope className="w-4 h-4 text-medical-600 flex-shrink-0" />
                  ) : (
                    <User className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  )}
                  <div>
                    <span className="font-bold text-slate-900 block leading-none">{user.name}</span>
                    <span className="text-[10px] text-slate-500 capitalize">
                      {role === 'doctor' ? 'Edit Doctor Profile' : 'Profile Settings'}
                    </span>
                  </div>
                </button>

                {/* Mobile Profile button */}
                <button
                  onClick={onOpenProfile}
                  title="Profile Settings"
                  className="sm:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                >
                  <User className="w-4 h-4" />
                </button>

                {/* Logout Button (Triggers Confirmation Modal) */}
                <button
                  onClick={() => setShowLogoutModal(true)}
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
                  Sign In
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

      {/* Logout Confirmation Dialog Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Are you sure you want to logout?</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                You will be signed out of your {role === 'doctor' ? 'Doctor Portal' : 'Patient Account'}. Your booked appointments remain safely stored in the database.
              </p>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmLogout}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm shadow-rose-600/20 transition flex items-center justify-center space-x-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Yes, Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
