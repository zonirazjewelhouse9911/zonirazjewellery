import React, { useState, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AuthContext } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, onSuccess, initialTab = 'login' }) {
  const { login, signup, sendOtp, verifyOtp, authCallback, setAuthCallback } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(initialTab); // 'login' | 'signup' | 'otp'
  const [error, setError] = useState('');
  
  // Passwords visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setError('');
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen, initialTab]);

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

  return createPortal(
    <div className="auth-modal-overlay">
      <style>{`
        .auth-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(43, 34, 29, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .auth-modal-card {
          background-color: #ffffff;
          border-radius: 32px;
          width: 900px;
          max-width: 95%;
          height: 600px;
          max-height: 90vh;
          box-shadow: 0 20px 50px rgba(43, 34, 29, 0.15);
          position: relative;
          display: flex;
          flex-direction: row;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }
        .auth-left-pane {
          width: 42%;
          background: linear-gradient(180deg, #efe7e5 0%, #dbcfcb 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 40px;
          position: relative;
        }
        .auth-right-pane {
          width: 58%;
          padding: 40px 48px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow-y: auto;
        }
        .auth-logo-img {
          width: 220px;
          height: auto;
          margin: 0 auto 24px auto;
          display: block;
          object-fit: contain;
        }
        .auth-left-brand-first {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-style: italic;
          font-weight: 500;
          color: #2b221d;
          text-align: center;
          margin: 0;
          letter-spacing: 0.5px;
        }
        .auth-left-brand-second {
          font-family: 'Playfair Display', serif;
          font-size: 34px;
          font-weight: 700;
          color: #634d40;
          text-align: center;
          margin: 2px 0 16px 0;
          letter-spacing: 1px;
        }
        .auth-left-brand-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 9.5px;
          color: #8c7365;
          font-weight: 700;
          letter-spacing: 2px;
          text-align: center;
          line-height: 1.6;
          max-width: 240px;
          margin: 0 auto;
        }
        .auth-pagination-dots {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-top: 36px;
          position: absolute;
          bottom: 40px;
        }
        .auth-pagination-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #dcd0c0;
          transition: all 0.2s;
        }
        .auth-pagination-dot.active {
          background-color: #634d40;
          width: 18px;
          border-radius: 10px;
        }
        .auth-tab-headers {
          display: flex;
          border-bottom: 1px solid #efe7e5;
          margin-bottom: 24px;
        }
        .auth-tab-btn {
          flex: 1;
          padding: 12px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          font-size: 13px;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          color: #a39084;
          cursor: pointer;
          transition: color 0.2s, border-bottom-color 0.2s;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .auth-tab-btn.active {
          color: #634d40;
          border-bottom-color: #634d40;
        }
        .auth-welcome-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 600;
          color: #2b221d;
          margin: 0 0 6px 0;
          text-align: left;
        }
        .auth-welcome-desc {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          color: #746380;
          margin: 0 0 24px 0;
          text-align: left;
          line-height: 1.4;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
        }
        .auth-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
        }
        .auth-label {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          color: #8c7365;
          letter-spacing: 1.2px;
          margin-bottom: 2px;
        }
        .auth-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }
        .auth-input-wrapper svg.input-icon {
          position: absolute;
          left: 16px;
          color: #634d40;
          width: 18px;
          height: 18px;
          pointer-events: none;
        }
        .auth-input-wrapper svg.password-toggle {
          position: absolute;
          right: 16px;
          color: #a39084;
          width: 18px;
          height: 18px;
          cursor: pointer;
          transition: color 0.2s;
        }
        .auth-input-wrapper svg.password-toggle:hover {
          color: #2b221d;
        }
        .auth-input-wrapper input {
          width: 100%;
          padding: 12px 16px 12px 46px;
          border-radius: 12px;
          border: 1px solid #d4c5bd;
          background-color: #ffffff;
          font-size: 14px;
          font-family: 'Montserrat', sans-serif;
          color: #2b221d;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .auth-input-wrapper input:focus {
          border-color: #634d40;
          box-shadow: 0 0 0 3px rgba(99, 77, 64, 0.1);
        }
        .auth-input-wrapper.password-input input {
          padding-right: 46px;
        }
        .auth-forgot-btn {
          font-family: 'Inter', sans-serif;
          color: #634d40;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.5px;
          align-self: flex-end;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          text-align: right;
          margin-top: -6px;
          margin-bottom: 8px;
          text-transform: uppercase;
          transition: color 0.2s;
        }
        .auth-forgot-btn:hover {
          color: #4a3830;
        }
        .auth-pill-submit-btn {
          font-family: 'Inter', sans-serif;
          background-color: #634d40;
          color: #ffffff;
          padding: 14px 28px;
          border-radius: 30px;
          border: none;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1.5px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
          margin-top: 8px;
          box-shadow: 0 4px 14px rgba(99, 77, 64, 0.25);
        }
        .auth-pill-submit-btn:hover {
          background-color: #4a3830;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 77, 64, 0.35);
        }
        .auth-pill-submit-btn:active {
          transform: translateY(0);
        }
        .auth-switch-prompt {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 500;
          color: #8c7365;
          letter-spacing: 1px;
          text-align: center;
          margin-top: 24px;
          text-transform: uppercase;
        }
        .auth-switch-link {
          font-weight: 700;
          color: #634d40;
          cursor: pointer;
          margin-left: 4px;
          text-decoration: underline;
          transition: color 0.2s;
        }
        .auth-switch-link:hover {
          color: #4a3830;
        }
        .auth-close-btn {
          position: absolute;
          top: 24px;
          right: 24px;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #a39084;
          padding: 4px;
          line-height: 1;
          transition: color 0.2s, transform 0.2s;
          z-index: 10;
        }
        .auth-close-btn:hover {
          color: #2b221d;
          transform: scale(1.1);
        }
        .auth-error-alert {
          background-color: #fff1f0;
          border: 1px solid #ffccc7;
          color: #ff4d4f;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 12.5px;
          margin-bottom: 20px;
          text-align: center;
          width: 100%;
        }
        .auth-back-btn {
          font-family: 'Inter', sans-serif;
          color: #634d40;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          margin-top: 20px;
          width: 100%;
          text-align: center;
          text-transform: uppercase;
          transition: color 0.2s;
        }
        .auth-back-btn:hover {
          color: #4a3830;
        }
        .auth-checkbox-group {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 4px;
        }
        .auth-checkbox {
          accent-color: #634d40;
          width: 16px;
          height: 16px;
          cursor: pointer;
        }
        .auth-checkbox-label {
          font-size: 12px;
          color: #746380;
          cursor: pointer;
        }
        @media (max-width: 768px) {
          .auth-modal-card {
            flex-direction: column;
            height: auto;
            max-height: 95vh;
            width: 440px;
          }
          .auth-left-pane {
            width: 100%;
            padding: 30px 20px;
            height: 160px;
            justify-content: center;
          }
          .auth-logo-img {
            width: 150px;
            margin: 0 auto 16px auto;
          }
          .auth-left-brand-first {
            font-size: 16px;
          }
          .auth-left-brand-second {
            font-size: 20px;
            margin: 0 0 6px 0;
          }
          .auth-left-brand-subtitle {
            display: none !important;
          }
          .auth-left-pane .auth-pagination-dots {
            display: none !important;
          }
          .auth-right-pane {
            width: 100%;
            padding: 36px 24px;
          }
          .auth-welcome-title {
            font-size: 24px;
          }
          .auth-welcome-desc {
            font-size: 12.5px;
            margin-bottom: 20px;
          }
        }
      `}</style>
      
      <div className="auth-modal-card">
        {/* Left Pane: Branding / Custom Illustration */}
        <div className="auth-left-pane">
          <img src="/zoni.png" className="auth-logo-img" alt="Zoniraz Logo" />
          <h3 className="auth-left-brand-first">Personalized</h3>
          <h2 className="auth-left-brand-second">Curations</h2>
          <p className="auth-left-brand-subtitle">
            EXPLORE MASTERPIECES TAILORED TO YOUR EXQUISITE TASTE
          </p>
          <div className="auth-pagination-dots">
            <span className="auth-pagination-dot active" />
            <span className="auth-pagination-dot" />
            <span className="auth-pagination-dot" />
          </div>
        </div>

        {/* Right Pane: Forms */}
        <div className="auth-right-pane">
          <button onClick={onClose} className="auth-close-btn">✕</button>

          {/* Tab switching tabs at the top */}
          {activeTab !== 'otp' && (
            <div className="auth-tab-headers">
              <button
                onClick={() => { setActiveTab('login'); setError(''); }}
                className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              >
                Log In
              </button>
              <button
                onClick={() => { setActiveTab('signup'); setError(''); }}
                className={`auth-tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
              >
                Sign Up
              </button>
            </div>
          )}

          {error && <div className="auth-error-alert">{error}</div>}

          {/* LOGIN FORM */}
          {activeTab === 'login' && (
            <div>
              <h2 className="auth-welcome-title">Welcome to Zoniraz</h2>
              <p className="auth-welcome-desc">Access your account using your email and password.</p>

              <form onSubmit={handleLoginSubmit} className="auth-form">
                <div className="auth-input-group">
                  <label className="auth-label">Email Address</label>
                  <div className="auth-input-wrapper">
                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <input
                      type="text"
                      required
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label className="auth-label">Password</label>
                  <div className="auth-input-wrapper password-input">
                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <svg 
                      className="password-toggle" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      )}
                    </svg>
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={() => { setActiveTab('otp'); setError(''); }}
                  className="auth-forgot-btn"
                >
                  Log in with OTP / Forgot Password?
                </button>

                <button type="submit" className="auth-pill-submit-btn">
                  SIGN IN <span style={{ marginLeft: '6px', fontSize: '14px' }}>→</span>
                </button>
              </form>

              <div className="auth-switch-prompt">
                Don't have an account? <span className="auth-switch-link" onClick={() => { setActiveTab('signup'); setError(''); }}>Sign Up</span>
              </div>
            </div>
          )}

          {/* SIGNUP FORM */}
          {activeTab === 'signup' && (
            <div>
              <h2 className="auth-welcome-title">Create Account</h2>
              <p className="auth-welcome-desc">Join Zoniraz and discover curated premium masterpieces.</p>

              <form onSubmit={handleSignupSubmit} className="auth-form" style={{ gap: '14px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="auth-input-group" style={{ flex: 1 }}>
                    <label className="auth-label">First Name</label>
                    <div className="auth-input-wrapper">
                      <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <input
                        type="text"
                        required
                        value={signupForm.firstName}
                        onChange={(e) => setSignupForm({ ...signupForm, firstName: e.target.value })}
                        placeholder="John"
                      />
                    </div>
                  </div>
                  <div className="auth-input-group" style={{ flex: 1 }}>
                    <label className="auth-label">Last Name</label>
                    <div className="auth-input-wrapper">
                      <input
                        type="text"
                        required
                        value={signupForm.lastName}
                        onChange={(e) => setSignupForm({ ...signupForm, lastName: e.target.value })}
                        placeholder="Doe"
                        style={{ paddingLeft: '18px' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="auth-input-group">
                  <label className="auth-label">Email Address</label>
                  <div className="auth-input-wrapper">
                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <input
                      type="email"
                      required
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label className="auth-label">Mobile Number</label>
                  <div className="auth-input-wrapper">
                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <input
                      type="tel"
                      required
                      value={signupForm.mobile}
                      onChange={(e) => setSignupForm({ ...signupForm, mobile: e.target.value })}
                      placeholder="10-digit mobile"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="auth-input-group" style={{ flex: 1 }}>
                    <label className="auth-label">Password</label>
                    <div className="auth-input-wrapper password-input">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        placeholder="••••••"
                        style={{ paddingLeft: '18px' }}
                      />
                    </div>
                  </div>
                  <div className="auth-input-group" style={{ flex: 1 }}>
                    <label className="auth-label">Confirm Password</label>
                    <div className="auth-input-wrapper password-input">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                        placeholder="••••••"
                        style={{ paddingLeft: '18px' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="auth-checkbox-group">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={signupForm.agree}
                    onChange={(e) => setSignupForm({ ...signupForm, agree: e.target.checked })}
                    className="auth-checkbox"
                  />
                  <label htmlFor="agree" className="auth-checkbox-label">
                    I agree to the Terms & Privacy Policy
                  </label>
                </div>

                <button type="submit" className="auth-pill-submit-btn">
                  CREATE ACCOUNT <span style={{ marginLeft: '6px', fontSize: '14px' }}>→</span>
                </button>
              </form>

              <div className="auth-switch-prompt">
                Already have an account? <span className="auth-switch-link" onClick={() => { setActiveTab('login'); setError(''); }}>Sign In</span>
              </div>
            </div>
          )}

          {/* OTP LOGIN */}
          {activeTab === 'otp' && (
            <div>
              <h2 className="auth-welcome-title">{otpSent ? "Verify OTP" : "OTP Verification"}</h2>
              <p className="auth-welcome-desc">
                {otpSent 
                  ? "We've sent a 4-digit verification code. Please check your inbox." 
                  : "Enter your registered email or mobile to get verification code."}
              </p>

              <div style={{ marginTop: '20px' }}>
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="auth-form">
                    <div className="auth-input-group">
                      <label className="auth-label">Mobile Number / Email</label>
                      <div className="auth-input-wrapper">
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        <input
                          type="text"
                          required
                          value={otpMobile}
                          onChange={(e) => setOtpMobile(e.target.value)}
                          placeholder="name@example.com or 10-digit mobile"
                        />
                      </div>
                    </div>
                    <button type="submit" className="auth-pill-submit-btn">
                      SEND OTP <span style={{ marginLeft: '6px', fontSize: '14px' }}>→</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtpSubmit} className="auth-form">
                    <div className="auth-input-group">
                      <label className="auth-label">4-Digit OTP Code</label>
                      <div className="auth-input-wrapper">
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <input
                          type="text"
                          required
                          maxLength={4}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="••••"
                        />
                      </div>
                    </div>
                    <button type="submit" className="auth-pill-submit-btn">
                      VERIFY & SIGN IN <span style={{ marginLeft: '6px', fontSize: '14px' }}>→</span>
                    </button>
                  </form>
                )}
                
                <button 
                  type="button" 
                  onClick={() => { setActiveTab('login'); setOtpSent(false); setError(''); }}
                  className="auth-back-btn"
                >
                  ← Back to Password Login
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>,
    document.body
  );
}
