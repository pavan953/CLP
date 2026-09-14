const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    return '/api';
  }
  const clean = envUrl.replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const API_BASE = getApiBase();

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('clp_token') || localStorage.getItem('medibook_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || 'Something went wrong. Please try again.';
    throw new Error(errorMsg);
  }

  return data;
};

export const api = {

  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),

  forgotPassword: (data) => request('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  register: (userData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),

  getMe: () => request('/auth/me'),

  updateProfile: (profileData) => request('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  }),

  getDoctors: () => request('/auth/doctors'),

  getPatients: () => request('/auth/patients'),

  addDoctor: (doctorData) => request('/auth/add-doctor', {
    method: 'POST',
    body: JSON.stringify(doctorData)
  }),

  getAppointments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/appointments${query ? `?${query}` : ''}`);
  },

  createAppointment: (appointmentData) => request('/appointments', {
    method: 'POST',
    body: JSON.stringify(appointmentData)
  }),

  updateAppointmentStatus: (id, status) => request(`/appointments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),

  deleteAppointment: (id) => request(`/appointments/${id}`, {
    method: 'DELETE'
  }),

  generateAiSummary: (payload) => request('/ai/summarize', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};

