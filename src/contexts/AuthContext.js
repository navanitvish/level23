import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/endpoints';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore session from localStorage and re-apply token to axios
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedUser !== 'undefined' && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (error) {
        console.error('Error restoring session:', error);
        _clearSession();
      }
    }
    setLoading(false);
  }, []);

  // ─── Helpers ──────────────────────────────────────────────

  const _applySession = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  };

  const _clearSession = () => {
    setUser(null);
    setToken(null);
    delete axiosInstance.defaults.headers.common['Authorization'];
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // ─── Auth Actions ─────────────────────────────────────────

  /**
   * Login with email + password.
   * Pass `role` if your backend requires it: login(email, password, 'admin')
   */
  const login = async (email, password, role = 'admin') => {
    const payload = { type: 'email', email, password, role };
    const response = await authApi.login(payload);

    console.log('📦 Full axios response:', response);

    const json = response; // axiosInstance interceptor already unwraps .data

    if (!json.success) {
      throw new Error(json.message || 'Login failed');
    }

    const { user: rawUser, token: authToken } = json.data;
    const { password: _, ...userData } = rawUser; // never store hashed password
    console.log('🔐 Auth Token:', authToken);
    console.log('👤 User Data:', userData);
    _applySession(userData, authToken);
    return userData;
  };

  const logout = () => {
    _clearSession();
  };

  /**
   * Refresh user data from the server (e.g. after a profile update).
   * Updates stored user without touching the token.
   */
  const refreshUser = async () => {
    const { data: json } = await authApi.me();
    if (json?.data?.user) {
      setUser(json.data.user);
      localStorage.setItem('user', JSON.stringify(json.data.user));
    }
  };

  // ─── Context Value ────────────────────────────────────────

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    refreshUser,
    isAdmin: user?.role === 'admin',
    sAdmin: user?.role === 'user',
    isEmailVerified: user?.isEmailVerified ?? false,
    isOnBoardingCompleted: user?.isOnBoardingCompleted ?? false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};