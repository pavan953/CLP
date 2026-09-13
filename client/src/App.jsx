import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';
import { ProfileModal } from './components/ProfileModal';
import { ThreeDParticleBackground } from './components/ThreeDParticleBackground';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { PatientDashboard } from './pages/PatientDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { Loader2 } from 'lucide-react';

export function App() {
  const { user, role, loading } = useAuth();
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [currentView, setCurrentView] = useState('landing'); // Initial view: always show Landing Page first!
  const [authRole, setAuthRole] = useState('patient'); // 'patient' or 'doctor'
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [preselectedDoctor, setPreselectedDoctor] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleNavigate = (view, roleParam = 'patient', modeParam = 'login') => {
    setAuthRole(roleParam);
    setAuthMode(modeParam);
    setCurrentView(view);
  };

  const handleNavigateToBooking = (docName = '') => {
    if (docName) {
      setPreselectedDoctor(docName);
    }
    if (!user) {
      showToast(
        docName
          ? `Please sign in to schedule your consultation with ${docName}.`
          : 'Please sign in or create an account to book an appointment.',
        'info'
      );
      handleNavigate('auth', 'patient', 'login');
      return;
    }
    setCurrentView('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 text-medical-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading Clinic Living Plus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col relative overflow-x-hidden">
      {/* 3D Ambient Moving Particle Cloud in Background */}
      <ThreeDParticleBackground />

      {/* Ambient Lighting Orbs */}
      <div className="pointer-events-none fixed top-0 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl z-0" />
      <div className="pointer-events-none fixed top-1/3 right-10 w-96 h-96 bg-teal-200/15 rounded-full blur-3xl z-0" />
      <div className="pointer-events-none fixed bottom-10 left-10 w-80 h-80 bg-sky-200/20 rounded-full blur-3xl z-0" />

      {/* Top Header */}
      <div className="relative z-30">
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenProfile={() => setIsProfileOpen(true)}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        {currentView === 'auth' ? (
          <AuthPage
            initialRole={authRole}
            initialMode={authMode}
            showToast={showToast}
            onBackToHome={() => setCurrentView('landing')}
            onSuccess={() => setCurrentView('dashboard')}
          />
        ) : currentView === 'landing' ? (
          <LandingPage
            onNavigateToAuth={(preferredRole = 'patient', preferredMode = 'login') => handleNavigate('auth', preferredRole, preferredMode)}
            onNavigateToBooking={handleNavigateToBooking}
          />
        ) : !user ? (
          <AuthPage
            initialRole={authRole}
            initialMode={authMode}
            showToast={showToast}
            onBackToHome={() => setCurrentView('landing')}
            onSuccess={() => setCurrentView('dashboard')}
          />
        ) : role === 'doctor' ? (
          <DoctorDashboard
            showToast={showToast}
            onOpenProfile={() => setIsProfileOpen(true)}
          />
        ) : (
          <PatientDashboard
            showToast={showToast}
            preselectedDoctor={preselectedDoctor}
            onOpenProfile={() => setIsProfileOpen(true)}
          />
        )}
      </main>

      {/* Hospital Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-slate-800">Clinic Living Plus</span> • 24/7 Outpatient & Clinical Care Facility
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Quality Care</span>
            <span>•</span>
            <span>Compassion</span>
            <span>•</span>
            <span>Clinical Excellence</span>
            <span>•</span>
            <span>Real-Time Live Sync</span>
          </div>
        </div>
      </footer>

      {/* User / Doctor Profile Settings Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        showToast={showToast}
      />

      {/* Toast Notification Container */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />
    </div>
  );
}

export default App;
