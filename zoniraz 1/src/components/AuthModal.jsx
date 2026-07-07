import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const { login, signup, sendOtp, verifyOtp, authCallback, setAuthCallback } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup' | 'otp'
  const [error, setError] = useState('');
  
  // Login fields
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup fields
  const [signupForm, setSignupForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    agree: false
  });

  // OTP Login fields
  const [otpMobile, setOtpMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(loginId, loginPassword);
      if (authCallback) {
        authCallback();
        setAuthCallback(null);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (signupForm.password !== signupForm.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (signupForm.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (!signupForm.agree) {
      setError("You must agree to the Terms & Conditions.");
      return;
    }

    try {
      const data = await signup(
        signupForm.firstName,
        signupForm.lastName,
        signupForm.email,
        signupForm.mobile,
        signupForm.password
      );
      if (data && data.success) {
        setOtpMobile(signupForm.email); // Use email for OTP verification
        setOtpSent(true);
        setActiveTab('otp');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await sendOtp(otpMobile);
      setOtpSent(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await verifyOtp(otpMobile, otpCode);
      if (authCallback) {
        authCallback();
        setAuthCallback(null);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-modal-overlay" style={styles.overlay}>
      <div className="auth-modal-card" style={styles.card}>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>
        
        <h2 style={styles.title}>Zoniraz Jewels</h2>
        <p style={styles.subtitle}>A Legacy of Elegance & Trust</p>

        {/* Tab Headers */}
        {activeTab !== 'otp' && (
          <div style={styles.tabHeaders}>
            <button
              onClick={() => { setActiveTab('login'); setError(''); }}
              style={{ ...styles.tabBtn, ...(activeTab === 'login' ? styles.activeTab : {}) }}
            >
              Login
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setError(''); }}
              style={{ ...styles.tabBtn, ...(activeTab === 'signup' ? styles.activeTab : {}) }}
            >
              Sign Up
            </button>
          </div>
        )}

        {error && <div style={styles.errorAlert}>{error}</div>}

        {/* LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address / Mobile Number</label>
              <input
                type="text"
                required
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                style={styles.input}
                placeholder="Enter email or mobile"
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={styles.input}
                placeholder="••••••••"
              />
            </div>
            <button type="submit" style={styles.submitBtn}>LOG IN</button>
            
            <button 
              type="button" 
              onClick={() => { setActiveTab('otp'); setError(''); }}
              style={styles.switchBtn}
            >
              Log in with OTP
            </button>
          </form>
        )}

        {/* SIGNUP FORM */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} style={styles.form}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ ...styles.inputGroup, flex: 1 }}>
                <label style={styles.label}>First Name</label>
                <input
                  type="text"
                  required
                  value={signupForm.firstName}
                  onChange={(e) => setSignupForm({ ...signupForm, firstName: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={{ ...styles.inputGroup, flex: 1 }}>
                <label style={styles.label}>Last Name</label>
                <input
                  type="text"
                  required
                  value={signupForm.lastName}
                  onChange={(e) => setSignupForm({ ...signupForm, lastName: e.target.value })}
                  style={styles.input}
                />
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                required
                value={signupForm.email}
                onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                style={styles.input}
                placeholder="name@example.com"
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Mobile Number</label>
              <input
                type="tel"
                required
                value={signupForm.mobile}
                onChange={(e) => setSignupForm({ ...signupForm, mobile: e.target.value })}
                style={styles.input}
                placeholder="10-digit mobile"
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                required
                value={signupForm.password}
                onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                style={styles.input}
                placeholder="Min 6 characters"
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                required
                value={signupForm.confirmPassword}
                onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                style={styles.input}
              />
            </div>
            <div style={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="agree"
                checked={signupForm.agree}
                onChange={(e) => setSignupForm({ ...signupForm, agree: e.target.checked })}
                style={styles.checkbox}
              />
              <label htmlFor="agree" style={styles.checkboxLabel}>
                I agree to the Terms & Privacy Policy
              </label>
            </div>
            <button type="submit" style={styles.submitBtn}>CREATE ACCOUNT</button>
          </form>
        )}

        {/* OTP LOGIN */}
        {activeTab === 'otp' && (
          <div style={styles.form}>
            {!otpSent ? (
              <form onSubmit={handleSendOtp}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={otpMobile}
                    onChange={(e) => setOtpMobile(e.target.value)}
                    style={styles.input}
                    placeholder="Enter 10-digit mobile"
                  />
                </div>
                <button type="submit" style={styles.submitBtn}>SEND OTP</button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtpSubmit}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Enter 4-Digit OTP (Sent to your email)</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    style={styles.input}
                    placeholder="••••"
                  />
                </div>
                <button type="submit" style={styles.submitBtn}>VERIFY & LOGIN</button>
              </form>
            )}
            
            <button 
              type="button" 
              onClick={() => { setActiveTab('login'); setOtpSent(false); setError(''); }}
              style={styles.switchBtn}
            >
              Back to Password Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(43, 34, 29, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e1d8ea',
    borderRadius: '24px',
    width: '450px',
    maxWidth: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: '40px 30px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    position: 'relative',
    fontFamily: "'Montserrat', sans-serif"
  },
  closeBtn: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#8c7365'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '28px',
    fontWeight: '600',
    color: '#2b221d',
    textAlign: 'center',
    margin: '0 0 4px 0'
  },
  subtitle: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    color: '#8c7365',
    textAlign: 'center',
    margin: '0 0 30px 0',
    fontWeight: '600'
  },
  tabHeaders: {
    display: 'flex',
    borderBottom: '1px solid #f2ebe8',
    marginBottom: '24px'
  },
  tabBtn: {
    flex: 1,
    padding: '12px',
    background: 'none',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    color: '#a39084',
    cursor: 'pointer',
    transition: 'color 0.2s'
  },
  activeTab: {
    color: '#2b221d',
    borderBottom: '2px solid #c5a880'
  },
  errorAlert: {
    backgroundColor: '#fff1f0',
    border: '1px solid #ffccc7',
    color: '#ff4d4f',
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '12.5px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#8c7365',
    letterSpacing: '1px'
  },
  input: {
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #d4c5bd',
    backgroundColor: '#faf7f5',
    fontSize: '14px',
    fontFamily: "'Montserrat', sans-serif",
    color: '#2b221d',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  checkbox: {
    accentColor: '#c5a880',
    width: '16px',
    height: '16px'
  },
  checkboxLabel: {
    fontSize: '12px',
    color: '#746380'
  },
  submitBtn: {
    backgroundColor: '#2b221d',
    color: '#ffffff',
    padding: '14px',
    borderRadius: '30px',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    letterSpacing: '1px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: '10px'
  },
  switchBtn: {
    background: 'none',
    border: 'none',
    color: '#c5a880',
    fontSize: '12.5px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
    textDecoration: 'underline'
  }
};
