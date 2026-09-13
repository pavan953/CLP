import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, User, Lock, Mail, Phone, HeartPulse, ArrowRight, ArrowLeft, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const AuthPage = ({ initialRole = 'patient', showToast, onBackToHome }) => {
  const { login, register } = useAuth();
  
  // Selected Portal Type: 'patient' or 'doctor'
  const [portalType, setPortalType] = useState(initialRole);
  const [isLogin, setIsLogin] = useState(true);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePortalSwitch = (type) => {
    setPortalType(type);
    setErrorMessage('');
    // Doctor portal only allows login (doctors are added by hospital admin)
    if (type === 'doctor') {
      setIsLogin(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    if (!isLogin && (!name.trim() || name.trim().length < 2)) {
      setErrorMessage('Please enter your full name (minimum 2 characters).');
      return;
    }

    setSubmitting(true);
    try {
      if (isLogin) {
        const res = await login(email.trim(), password);
        showToast(`Welcome back, ${res.user.name}!`, 'success');
      } else {
        const res = await register({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.trim()
        });
        showToast('Your patient account has been created successfully!', 'success');
      }
    } catch (err) {
      setErrorMessage(err.message);
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Top Header Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-medical-700 via-medical-600 to-teal-700 text-white">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center space-x-1.5 text-xs text-medical-100 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Hospital Home</span>
            </button>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/15 backdrop-blur-md border border-white/20">
              Secure Auth
            </span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight">
            {portalType === 'doctor' ? 'Medical Staff & Doctor Portal' : 'Patient Health Portal'}
          </h2>
          <p className="text-xs text-medical-100 mt-1">
            {portalType === 'doctor'
              ? 'Enter your verified hospital credentials to manage patient consultations'
              : 'Sign in or create a patient account to schedule and manage your visits'}
          </p>

          {/* Portal Switcher Tabs */}
          <div className="mt-6 grid grid-cols-2 gap-2 bg-white/10 p-1 rounded-2xl backdrop-blur-md border border-white/15">
            <button
              type="button"
              onClick={() => handlePortalSwitch('patient')}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition ${
                portalType === 'patient'
                  ? 'bg-white text-medical-800 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient</span>
            </button>

            <button
              type="button"
              onClick={() => handlePortalSwitch('doctor')}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition ${
                portalType === 'doctor'
                  ? 'bg-white text-medical-800 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor / Staff</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {/* Patient Login vs Register Toggle */}
          {portalType === 'patient' && (
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <span className="text-xs font-bold text-slate-700">
                {isLogin ? 'Sign In to Your Account' : 'Register New Patient Profile'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrorMessage('');
                }}
                className="text-xs font-bold text-medical-600 hover:text-medical-800 underline"
              >
                {isLogin ? 'Need an account? Register here' : 'Already registered? Sign In'}
              </button>
            </div>
          )}

          {/* Doctor note regarding onboarding */}
          {portalType === 'doctor' && (
            <div className="mb-6 p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-800 flex items-start space-x-2">
              <Stethoscope className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Hospital Policy: </span>
                <span>Doctors and clinical staff are onboarded exclusively by hospital administration. If you require credentials, please contact the Chief Medical Officer.</span>
              </div>
            </div>
          )}

          {/* Inline Error Message */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start space-x-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Authentication Notice: </span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name & Phone for Patient Registration */}
            {portalType === 'patient' && !isLogin && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-medical-200 focus:border-medical-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Contact Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-medical-200 focus:border-medical-500 transition"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder={portalType === 'doctor' ? 'doctor@hospital.com' : 'patient@example.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-medical-200 focus:border-medical-500 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-medical-200 focus:border-medical-500 transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-medical-600 to-teal-600 hover:from-medical-700 hover:to-teal-700 shadow-md shadow-medical-500/20 active:scale-[0.99] transition flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                <span>
                  {submitting
                    ? 'Verifying Credentials...'
                    : portalType === 'doctor'
                    ? 'Sign In to Doctor Portal'
                    : isLogin
                    ? 'Sign In as Patient'
                    : 'Create Patient Profile'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
