import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import {
  User,
  Stethoscope,
  Mail,
  Phone,
  Lock,
  Heart,
  Award,
  Calendar,
  DollarSign,
  Building,
  Clock,
  ShieldCheck,
  AlertCircle,
  Check,
  X,
  Loader2
} from 'lucide-react';

export const ProfileModal = ({ isOpen, onClose, showToast }) => {
  const { user, role, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const [specialty, setSpecialty] = useState(user?.specialty || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [qualification, setQualification] = useState(user?.qualification || '');
  const [experience, setExperience] = useState(user?.experience || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [consultationFee, setConsultationFee] = useState(user?.consultationFee || '$50');
  const [availableDays, setAvailableDays] = useState(user?.availableDays || 'Mon - Fri');
  const [cabinNumber, setCabinNumber] = useState(user?.cabinNumber || '');

  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [emergencyContact, setEmergencyContact] = useState(user?.emergencyContact || '');
  const [allergies, setAllergies] = useState(user?.allergies || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !user) return null;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSaving(true);

    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim()
      };

      if (role === 'doctor') {
        payload.specialty = specialty.trim();
        payload.department = department.trim();
        payload.qualification = qualification.trim();
        payload.experience = experience.trim();
        payload.bio = bio.trim();
        payload.consultationFee = consultationFee.trim();
        payload.availableDays = availableDays.trim();
        payload.cabinNumber = cabinNumber.trim();
      } else {
        payload.bloodGroup = bloodGroup.trim();
        payload.dateOfBirth = dateOfBirth;
        payload.gender = gender;
        payload.emergencyContact = emergencyContact.trim();
        payload.allergies = allergies.trim();
      }

      if (currentPassword || newPassword) {
        if (!currentPassword) {
          throw new Error('Please enter your current password to change password.');
        }
        if (newPassword.length < 6) {
          throw new Error('New password must be at least 6 characters long.');
        }
        if (newPassword !== confirmPassword) {
          throw new Error('New passwords do not match.');
        }
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await api.updateProfile(payload);
      if (res.success) {
        updateUser(res.user);
        showToast(res.message || 'Profile updated successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message);
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">

        <div className="p-6 bg-gradient-to-r from-medical-700 via-medical-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-white/15 backdrop-blur-md text-white border border-white/20">
              {role === 'doctor' ? <Stethoscope className="w-6 h-6" /> : <User className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {role === 'doctor' ? 'Doctor Professional Profile' : 'Patient Account & Health Profile'}
              </h3>
              <p className="text-xs text-medical-100">
                {role === 'doctor'
                  ? 'Update your clinical qualifications, practice hours, and bio'
                  : 'Manage your personal details, emergency contact, and medical records'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pt-4 border-b border-slate-100 flex items-center space-x-4 bg-slate-50/70">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-3 text-xs font-bold transition border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'profile'
                ? 'border-medical-600 text-medical-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Information</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`pb-3 text-xs font-bold transition border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'security'
                ? 'border-medical-600 text-medical-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Security & Password</span>
          </button>
        </div>

        <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto p-6 space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'profile' && (
            <>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Basic Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-medical-200 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address (Permanent)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number (10 Digits)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="e.g. 9876543210"
                      maxLength={10}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-medical-200 focus:outline-none"
                    />
                  </div>

                  {role === 'doctor' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Cabin / Consultation Room
                      </label>
                      <input
                        type="text"
                        value={cabinNumber}
                        onChange={(e) => setCabinNumber(e.target.value)}
                        placeholder="e.g. Room 204, East Wing"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-medical-200 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {role === 'doctor' && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Doctor Clinical Qualifications & Hours
                    </h4>
                    {user.isProfileComplete ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ✓ Profile Complete
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        ⚠ Incomplete Profile
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Medical Degree / Qualifications
                      </label>
                      <input
                        type="text"
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        placeholder="e.g. MBBS, MD (Cardiology), FACC"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-medical-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Clinical Specialty
                      </label>
                      <input
                        type="text"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        placeholder="e.g. Interventional Cardiologist"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-medical-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. Cardiology & ICU"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-medical-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Years of Practice / Experience
                      </label>
                      <input
                        type="text"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="e.g. 10+ Years"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-medical-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Available Consultation Days
                      </label>
                      <input
                        type="text"
                        value={availableDays}
                        onChange={(e) => setAvailableDays(e.target.value)}
                        placeholder="e.g. Mon - Fri (09:00 AM - 05:00 PM)"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-medical-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Consultation Fee
                      </label>
                      <input
                        type="text"
                        value={consultationFee}
                        onChange={(e) => setConsultationFee(e.target.value)}
                        placeholder="e.g. $50"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-medical-200 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Clinical Bio & Areas of Focus
                      </label>
                      <textarea
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Describe your expertise, medical approach, and clinical interests..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-medical-200 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {role === 'patient' && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Patient Medical History & Emergency Info
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Blood Group
                      </label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-medical-200 focus:outline-none"
                      >
                        <option value="">-- Select Blood Group --</option>
                        <option value="A+">A Positive (A+)</option>
                        <option value="A-">A Negative (A-)</option>
                        <option value="B+">B Positive (B+)</option>
                        <option value="B-">B Negative (B-)</option>
                        <option value="O+">O Positive (O+)</option>
                        <option value="O-">O Negative (O-)</option>
                        <option value="AB+">AB Positive (AB+)</option>
                        <option value="AB-">AB Negative (AB-)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-medical-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Gender
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-medical-200 focus:outline-none"
                      >
                        <option value="">-- Select Gender --</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Emergency Contact Phone (10 Digits)
                      </label>
                      <input
                        type="tel"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="e.g. 9876543210"
                        maxLength={10}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-medical-200 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Known Drug Allergies / Conditions
                      </label>
                      <input
                        type="text"
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                        placeholder="e.g. Penicillin allergy, mild asthma, gluten intolerance"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-medical-200 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Change Password
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-medical-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    New Password (min 6 characters)
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-medical-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-medical-200 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-xs font-bold text-white bg-medical-600 hover:bg-medical-700 shadow-md shadow-medical-500/20 rounded-xl transition flex items-center space-x-1.5 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

