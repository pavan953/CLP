import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';
import { AuthPage } from './pages/AuthPage';
import { PatientDashboard } from './pages/PatientDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { Loader2 } from 'lucide-react';

export function App() {
  const { user, role, loading, login } = useAuth();
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleQuickSwitchRole = async () => {
    try {
      if (role === 'doctor') {
        await login('patient@demo.com', 'password123');
        showToast('Switched to Demo Patient (Alex Morgan)', 'success');
      } else {
        await login('doctor.sarah@clinic.com', 'password123');
        showToast('Switched to Demo Doctor (Dr. Sarah Jenkins)', 'success');
      }
    } catch (err) {
      showToast('Could not switch role: ' + err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 text-medical-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading MediBook...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Navbar onQuickSwitchRole={user ? handleQuickSwitchRole : null} />

      <main className="flex-1">
        {!user ? (
          <AuthPage showToast={showToast} />
        ) : role === 'doctor' ? (
          <DoctorDashboard showToast={showToast} />
        ) : (
          <PatientDashboard showToast={showToast} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>MediBook Mini Appointment Booking Platform • Full Stack MERN Architecture</span>
          <span className="text-slate-400">Node.js • Express • MongoDB • React</span>
        </div>
      </footer>

      {/* Floating Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />
    </div>
  );
}

export default App;
