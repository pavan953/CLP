import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const getToken = () => localStorage.getItem('clp_token') || localStorage.getItem('medibook_token');
  const getStoredUser = () => localStorage.getItem('clp_user') || localStorage.getItem('medibook_user');

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getToken());
  const [loading, setLoading] = useState(true);

  // Restore session from token on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getToken();
      const storedUser = getStoredUser();

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Refresh profile in background
          const res = await api.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('clp_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session verification failed, logging out:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password, role) => {
    const res = await api.login({ email, password, role });
    if (res.success) {
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('clp_token', res.token);
      localStorage.setItem('clp_user', JSON.stringify(res.user));
    }
    return res;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.success) {
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('clp_token', res.token);
      localStorage.setItem('clp_user', JSON.stringify(res.user));
    }
    return res;
  };

  const updateUser = (updatedUserData) => {
    const merged = { ...user, ...updatedUserData };
    setUser(merged);
    localStorage.setItem('clp_user', JSON.stringify(merged));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('clp_token');
    localStorage.removeItem('clp_user');
    localStorage.removeItem('medibook_token');
    localStorage.removeItem('medibook_user');
  };

  const value = {
    user,
    role: user?.role || null,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    updateUser,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
