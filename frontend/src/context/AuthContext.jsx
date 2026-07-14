import React, { createContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('zoniraz_token') || null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authCallback, setAuthCallback] = useState(null);

  const requireAuth = (callback) => {
    if (token) {
      callback();
    } else {
      setAuthCallback(() => callback);
      setIsAuthModalOpen(true);
    }
  };

  useEffect(() => {
    if (token) {
      // Validate token and get user profile
      fetch(`${API_BASE_URL}/api/userSide/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Session expired');
      })
      .then(data => {
        if (data && data.success && data.user) {
          const names = (data.user.user_name || '').split(' ');
          const firstName = names[0] || '';
          const lastName = names.slice(1).join(' ') || '';
          setUser({
            id: data.user._id,
            firstName,
            lastName,
            email: data.user.email,
            mobile: data.user.phone_number
          });
        } else {
          throw new Error('Session expired');
        }
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

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/api/userSide/user_login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Login failed');
    
    localStorage.setItem('zoniraz_token', data.token);
    setToken(data.token);
    return data;
  };

  const signup = async (firstName, lastName, email, mobile, password) => {
    const user_name = `${firstName} ${lastName}`.trim();
    const res = await fetch(`${API_BASE_URL}/api/userSide/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_name, email, password, phone_number: mobile })
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Registration failed');
    return data;
  };

  const logout = () => {
    localStorage.removeItem('zoniraz_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (fields) => {
    const user_name = `${fields.firstName} ${fields.lastName}`.trim();
    const res = await fetch(`${API_BASE_URL}/api/userSide/userID`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userID: user_name })
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Profile update failed');
    
    const names = (data.user.user_name || '').split(' ');
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || '';
    const updatedUser = {
      ...user,
      firstName,
      lastName
    };
    setUser(updatedUser);
    return updatedUser;
  };

  const deleteAccount = async () => {
    logout();
  };

  const sendOtp = async (mobile) => {
    const res = await fetch(`${API_BASE_URL}/api/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
    return data.message;
  };

  const verifyOtp = async (emailOrMobile, otp) => {
    // If it's a mobile number (only digits), it's mock passwordless OTP login
    if (/^\d+$/.test(emailOrMobile)) {
      const res = await fetch(`${API_BASE_URL}/api/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: emailOrMobile, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP code');
      setUser({
        id: 'mock-user-123',
        firstName: 'Valued',
        lastName: 'Customer',
        email: 'customer@example.com',
        mobile: emailOrMobile
      });
      return true;
    }

    // Otherwise, it's the real email registration OTP verification
    const res = await fetch(`${API_BASE_URL}/api/userSide/verifyOtp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailOrMobile, otp })
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Invalid OTP code');
    
    localStorage.setItem('zoniraz_token', data.token);
    setToken(data.token);
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, updateProfile, deleteAccount, sendOtp, verifyOtp, isAuthModalOpen, setIsAuthModalOpen, authCallback, setAuthCallback, requireAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
