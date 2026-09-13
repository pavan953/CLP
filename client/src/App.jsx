import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';
import { ProfileModal } from './components/ProfileModal';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { PatientDashboard } from './pages/PatientDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { Loader2 } from 'lucide-react';

export function App() {
  const { user, role, loading } = useAuth();
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or 'landing'
  const [authRole, setAuthRole] = useState('patient'); // 'patient' or 'doctor'
  const [preselectedDoctor, setPreselectedDoctor] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleNavigate = (view, roleParam = 'patient') => {
    if (!user) {
      setAuthRole(roleParam);
      return;
    }
    setCurrentView(view);
  };

  const handleNavigateToBooking = (docName = '') => {
    if (docName) {
      setPreselectedDoctor(docName);
    }
    setCurrentView('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 text-medical-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading MediBook Healthcare Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Header */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content Area - Strictly Requires Login Before Access */}
      <main className="flex-1">
        {!user ? (
          <AuthPage
            initialRole={authRole}
            showToast={showToast}
          />
        ) : currentView === 'landing' ? (
          <LandingPage
            onNavigateToAuth={(preferredRole) => handleNavigate('auth', preferredRole)}
            onNavigateToBooking={handleNavigateToBooking}
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
            <span className="font-bold text-slate-800">MediBook Medical Center</span> • 24/7 Outpatient & Critical Care Facility
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>ReactJS</span>
            <span>•</span>
            <span>Node.js Express</span>
            <span>•</span>
            <span>MongoDB Database</span>
            <span>•</span>
            <span>Real-Time Sync</span>
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
