import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, User, LogOut, HeartPulse, Calendar, AlertTriangle, X, Menu, ShieldCheck, ChevronRight } from 'lucide-react';

export const Navbar = ({ currentView, onNavigate, onOpenProfile }) => {
  const { user, role, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScrollTo = (elementId) => {
    setMobileMenuOpen(false);
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
    setMobileMenuOpen(false);
    logout();
    onNavigate('landing');
  };

  const isAdmin = user?.email === 'admin@hospital.com' || (user?.name && user.name.toLowerCase().includes('admin'));

  return (
    <>
      <header className="w-full bg-white/85 backdrop-blur-xl backdrop-saturate-150 border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-4">

          <div
            onClick={() => { setMobileMenuOpen(false); onNavigate('landing'); }}
            className="flex items-center space-x-3.5 cursor-pointer group py-1"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-medical-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-medical-500/25 badge-3d flex-shrink-0">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div className="py-0.5">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 leading-tight">Clinic Living Plus</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-medical-50 text-medical-700 border border-medical-200 shadow-xs">
                  Hospital
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block mt-0.5">Premier Clinical Center</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-1.5 text-xs font-semibold text-slate-600 px-2 py-1">
            {user && (
              <button
                onClick={() => onNavigate('dashboard')}
                className={`px-3.5 py-2 rounded-xl transition ${
                  currentView === 'dashboard'
                    ? 'bg-medical-50 text-medical-700 font-bold border border-medical-200/80 shadow-xs'
                    : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {isAdmin ? 'Admin Portal' : role === 'doctor' ? 'Doctor Portal' : 'My Dashboard'}
              </button>
            )}
            <button
              onClick={() => onNavigate('landing')}
              className={`px-3.5 py-2 rounded-xl transition ${
                currentView === 'landing'
                  ? 'bg-medical-50 text-medical-700 font-bold border border-medical-200/80 shadow-xs'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Hospital Home
            </button>
            <button
              onClick={() => handleScrollTo('about')}
              className="px-3.5 py-2 rounded-xl transition hover:bg-slate-100 hover:text-slate-900"
            >
              About Hospital
            </button>
            <button
              onClick={() => handleScrollTo('departments')}
              className="px-3.5 py-2 rounded-xl transition hover:bg-slate-100 hover:text-slate-900"
            >
              Departments
            </button>
            <button
              onClick={() => handleScrollTo('doctors')}
              className="px-3.5 py-2 rounded-xl transition hover:bg-slate-100 hover:text-slate-900"
            >
              Our Doctors
            </button>
            <button
              onClick={() => handleScrollTo('contact')}
              className="px-3.5 py-2 rounded-xl transition hover:bg-slate-100 hover:text-slate-900"
            >
              Contact & Hours
            </button>
          </nav>

          <div className="flex items-center space-x-2.5 sm:space-x-3 py-1">
            {user ? (
              <>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`hidden sm:flex items-center space-x-2 px-4 py-2.5 text-xs font-bold rounded-xl transition ${
                    currentView === 'dashboard'
                      ? 'bg-medical-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isAdmin ? 'Admin Portal' : role === 'doctor' ? 'Doctor Portal' : 'My Dashboard'}</span>
                </button>

                <button
                  onClick={onOpenProfile}
                  title="Click to view & edit profile settings"
                  className="hidden sm:flex items-center space-x-2.5 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs transition cursor-pointer text-left badge-3d shadow-xs"
                >
                  {isAdmin ? (
                    <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  ) : role === 'doctor' ? (
                    <Stethoscope className="w-4 h-4 text-medical-600 flex-shrink-0" />
                  ) : (
                    <User className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  )}
                  <span className="font-bold text-slate-900 leading-none">
                    {isAdmin ? 'Hospital Administrator' : user.name}
                  </span>
                </button>

                <button
                  onClick={onOpenProfile}
                  title="Profile Settings"
                  className="sm:hidden p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                >
                  <User className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowLogoutModal(true)}
                  title="Sign out from portal"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition badge-3d"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-2.5">
                <button
                  onClick={() => onNavigate('auth', 'patient', 'login')}
                  className="px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
                >
                  Sign In
                </button>

                <button
                  onClick={() => onNavigate('auth', 'patient', 'signup')}
                  className="px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-medical-600 hover:bg-medical-700 btn-3d shadow-md shadow-medical-600/20 flex items-center space-x-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>

                <button
                  onClick={() => onNavigate('auth', 'doctor', 'login')}
                  className="hidden sm:flex px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition items-center space-x-1.5 border border-slate-200 badge-3d"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-medical-600" />
                  <span>Staff Portal</span>
                </button>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition border border-slate-200 ml-1"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-2xl px-4 sm:px-6 py-4 space-y-2 shadow-2xl animate-fade-in">
            {user && (
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('dashboard'); }}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-medical-50 text-medical-800 font-bold text-xs border border-medical-200"
              >
                <div className="flex items-center space-x-2.5">
                  <Calendar className="w-4 h-4 text-medical-600" />
                  <span>{isAdmin ? 'Hospital Admin Dashboard' : role === 'doctor' ? 'Doctor Portal Dashboard' : 'My Patient Dashboard'}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-medical-400" />
              </button>
            )}

            <button
              onClick={() => { setMobileMenuOpen(false); onNavigate('landing'); }}
              className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-slate-100 text-slate-800 font-semibold text-xs transition"
            >
              <span>Hospital Home</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => handleScrollTo('about')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-slate-100 text-slate-800 font-semibold text-xs transition"
            >
              <span>About Hospital</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => handleScrollTo('departments')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-slate-100 text-slate-800 font-semibold text-xs transition"
            >
              <span>Medical Departments</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => handleScrollTo('doctors')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-slate-100 text-slate-800 font-semibold text-xs transition"
            >
              <span>Our Verified Doctors</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => handleScrollTo('contact')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-slate-100 text-slate-800 font-semibold text-xs transition"
            >
              <span>Contact & Clinic Hours</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {user ? (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenProfile(); }}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs transition"
              >
                <div className="flex items-center space-x-2.5">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">{isAdmin ? 'Hospital Administrator' : user.name}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ) : (
              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => { setMobileMenuOpen(false); onNavigate('auth', 'patient', 'login'); }}
                  className="w-full py-3 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs text-center hover:bg-slate-200 transition"
                >
                  Patient Sign In
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onNavigate('auth', 'doctor', 'login'); }}
                  className="w-full py-3 rounded-xl bg-medical-50 text-medical-800 font-bold text-xs text-center border border-medical-200 hover:bg-medical-100 transition"
                >
                  Doctor Portal
                </button>
              </div>
            )}
          </div>
        )}
      </header>

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

