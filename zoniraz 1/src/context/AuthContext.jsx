import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('zoniraz_token') || null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authCallback, setAuthCallback] = useState(null);

  const requireAuth = (callback) => {
    if (token && user) {
      callback();
    } else {
      setAuthCallback(() => callback);
      setIsAuthModalOpen(true);
    }
  };

  useEffect(() => {
    if (token) {
      // Validate token and get user profile
      fetch('http://localhost:55000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Session expired');
      })
      .then(data => {
        setUser(data);
      })
      .catch(() => {
        logout();
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (identifier, password) => {
    const res = await fetch('http://localhost:55000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    
    localStorage.setItem('zoniraz_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const signup = async (firstName, lastName, email, mobile, password) => {
    const res = await fetch('http://localhost:55000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, mobile, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');

    localStorage.setItem('zoniraz_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('zoniraz_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (fields) => {
    const res = await fetch('http://localhost:55000/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(fields)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Profile update failed');
    setUser(data);
    return data;
  };

  const deleteAccount = async () => {
    const res = await fetch('http://localhost:55000/api/auth/profile', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete account');
    logout();
  };

  const sendOtp = async (mobile) => {
    const res = await fetch('http://localhost:55000/api/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
    return data.message;
  };

  const verifyOtp = async (mobile, otp) => {
    const res = await fetch('http://localhost:55000/api/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, otp })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invalid OTP code');
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, updateProfile, deleteAccount, sendOtp, verifyOtp, isAuthModalOpen, setIsAuthModalOpen, authCallback, setAuthCallback, requireAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
