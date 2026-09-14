import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, User, Lock, Mail, Phone, HeartPulse, ArrowRight, ArrowLeft, ShieldAlert, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export const AuthPage = ({ initialRole = 'patient', initialMode = 'login', showToast, onBackToHome, onSuccess }) => {
  const { login, register, forgotPassword } = useAuth();

  const [portalType, setPortalType] = useState(initialRole);
  const [isLogin, setIsLogin] = useState(initialMode !== 'signup');
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  useEffect(() => {
    setPortalType(initialRole);
    setIsLogin(initialMode !== 'signup');
    setIsForgotPassword(false);
    setErrorMessage('');
    setSuccessMessage('');
  }, [initialRole, initialMode]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handlePortalSwitch = (type) => {
    setPortalType(type);
    setErrorMessage('');
    setSuccessMessage('');
    setIsForgotPassword(false);

    if (type === 'doctor') {
      setIsLogin(true);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    if (!newPassword) {
      setErrorMessage('Please enter your new password.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match. Please re-enter.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await forgotPassword({
        email: email.trim(),
        newPassword,
        confirmPassword,
        role: portalType
      });
      setSuccessMessage(res.message || 'Password reset successfully! You can now sign in with your new password.');
      showToast('Password reset successfully! Please sign in with your new credentials.', 'success');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMessage(err.message);
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
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

    if (!isLogin && phone.trim()) {
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        setErrorMessage('Mobile number must be exactly 10 digits.');
        return;
      }
    }

    setSubmitting(true);
    try {
      if (isLogin) {
        const res = await login(email.trim(), password, portalType);
        showToast(`Welcome back, ${res.user.name}!`, 'success');
      } else {
        const res = await register({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.replace(/\D/g, '').slice(0, 10)
        });
        showToast('Your patient account has been created successfully!', 'success');
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setErrorMessage(err.message);
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50">
      {onBackToHome && (
        <div className="max-w-xl w-full mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-medical-700 transition bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm hover:shadow"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Hospital Home</span>
          </button>
        </div>
      )}

      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">

        <div className="p-6 sm:p-8 bg-gradient-to-r from-medical-700 via-medical-600 to-teal-700 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-medical-100 text-xs font-semibold">
              <HeartPulse className="w-4 h-4 text-teal-300" />
              <span>Clinic Living Plus Security Gate</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/15 backdrop-blur-md border border-white/20">
              {isForgotPassword ? 'Password Recovery' : 'Sign In Required'}
            </span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight">
            {isForgotPassword
              ? 'Account Password Recovery'
              : portalType === 'doctor'
              ? 'Medical Staff & Doctor Portal'
              : 'Patient Health Portal'}
          </h2>
          <p className="text-xs text-medical-100 mt-1">
            {isForgotPassword
              ? 'Recover and reset access credentials for your registered account'
              : portalType === 'doctor'
              ? 'Enter your verified hospital credentials to manage patient consultations'
              : 'Sign in or create a patient account to schedule and manage your visits'}
          </p>

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

        <div className="p-6 sm:p-8">
          {isForgotPassword ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
                <span className="text-xs font-bold text-slate-700">
                  Reset Account Password
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-xs font-bold text-medical-600 hover:text-medical-800 underline inline-flex items-center space-x-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start space-x-2.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Reset Notice: </span>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              {successMessage ? (
                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Success: </span>
                      <span>{successMessage}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setSuccessMessage('');
                      setErrorMessage('');
                    }}
                    className="w-full py-3 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-medical-600 to-teal-600 hover:from-medical-700 hover:to-teal-700 shadow-md shadow-medical-500/20 active:scale-[0.99] transition flex items-center justify-center space-x-2"
                  >
                    <span>Proceed to Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Registered Email Address <span className="text-rose-500">*</span>
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

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      New Password <span className="text-rose-500">*</span> (min 6 characters)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        minLength={6}
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-medical-200 focus:border-medical-500 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 focus:outline-none"
                        title={showNewPassword ? 'Hide password' : 'Show password'}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Confirm New Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        minLength={6}
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-medical-200 focus:border-medical-500 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 focus:outline-none"
                        title={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-medical-600 to-teal-600 hover:from-medical-700 hover:to-teal-700 shadow-md shadow-medical-500/20 active:scale-[0.99] transition flex items-center justify-center space-x-2 disabled:opacity-60"
                    >
                      <span>{submitting ? 'Resetting Password...' : 'Confirm & Reset Password'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(false);
                        setErrorMessage('');
                        setSuccessMessage('');
                      }}
                      className="text-xs font-medium text-slate-500 hover:text-slate-700"
                    >
                      Remembered your password? <span className="font-bold text-medical-600 underline">Sign In</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div>
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

              {portalType === 'doctor' && (
                <div className="mb-6 p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-800 flex items-start space-x-2">
                  <Stethoscope className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Hospital Policy: </span>
                    <span>Doctors and clinical staff are onboarded exclusively by hospital administration. If you require credentials, please contact the Chief Medical Officer.</span>
                  </div>
                </div>
              )}

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
                        Mobile Contact Number <span className="text-slate-400 font-normal">(10 Digits)</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          placeholder="10-digit number (e.g. 9876543210)"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          maxLength={10}
                          className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-medical-200 focus:border-medical-500 transition"
                        />
                      </div>
                    </div>
                  </>
                )}

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

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true);
                          setErrorMessage('');
                          setSuccessMessage('');
                        }}
                        className="text-xs font-semibold text-medical-600 hover:text-medical-800 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-medical-200 focus:border-medical-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 focus:outline-none"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

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
                        ? 'Sign In'
                        : 'Create Patient Profile'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

