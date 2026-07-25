import { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  KeyRound, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft
} from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (token: string, admin: any) => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  // Mode: 'login' | 'forgot'
  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot Password Wizard State (Step 1: Email, Step 2: OTP, Step 3: New Password)
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  // 1. Handle Admin Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginEmail || !loginPassword) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();

      if (data.success && data.token) {
        localStorage.setItem('adminToken', data.token);
        if (data.admin) {
          localStorage.setItem('adminUser', JSON.stringify(data.admin));
        }
        onLoginSuccess(data.token, data.admin);
      } else {
        setError(data.message || 'Authentication failed. Please check credentials.');
      }
    } catch (err: any) {
      setError('Connection to admin server failed. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Step 1: Send OTP to Admin Email
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!forgotEmail) {
      setForgotError('Please enter your registered admin email address.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch('/api/admin/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();

      if (data.success) {
        setForgotSuccess(data.message || `Verification code sent to ${forgotEmail}`);
        setForgotStep(2);
      } else {
        setForgotError(data.message || 'Failed to dispatch verification code.');
      }
    } catch (err: any) {
      setForgotError('Network error requesting OTP. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  // 3. Step 2: Verify 6-digit OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!otpCode || otpCode.trim().length < 4) {
      setForgotError('Please enter the verification code sent to your email.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch('/api/admin/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, otp: otpCode })
      });
      const data = await res.json();

      if (data.success) {
        setForgotSuccess('Code verified! Set your new master password.');
        setForgotStep(3);
      } else {
        setForgotError(data.message || 'Invalid or expired code.');
      }
    } catch (err: any) {
      setForgotError('Network error verifying code.');
    } finally {
      setForgotLoading(false);
    }
  };

  // 4. Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!newPassword || newPassword.length < 6) {
      setForgotError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError('Passwords do not match. Please re-enter.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch('/api/admin/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail,
          otp: otpCode,
          newPassword
        })
      });
      const data = await res.json();

      if (data.success) {
        setForgotSuccess('Password updated successfully! Redirecting to login...');
        setTimeout(() => {
          setMode('login');
          setForgotStep(1);
          setLoginEmail(forgotEmail);
          setLoginPassword('');
          setForgotSuccess('');
          setError('Password reset complete. Please log in with your new password.');
        }, 1500);
      } else {
        setForgotError(data.message || 'Failed to update password.');
      }
    } catch (err: any) {
      setForgotError('Network error resetting password.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1412] text-[#efe7e5] flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      
      {/* Background Ambient Glow Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#c5a880]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#5d463c]/40 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Luxury Glass Card */}
      <div className="w-full max-w-md bg-[#251d18]/90 backdrop-blur-xl border border-[#c5a880]/20 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#5d463c]/60 border border-[#c5a880]/40 shadow-inner mb-2">
            <span className="font-serif italic text-2.5xl font-black text-[#c5a880]">Z</span>
          </div>
          <h1 className="text-2.5xl font-serif font-bold text-white tracking-wider">ZONIRAZ JEWELS</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-[#c5a880]">
            Atelier Executive Portal
          </p>
        </div>

        {/* ---------------- LOGIN MODE ---------------- */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-5 animate-in fade-in duration-300">
            
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start space-x-3 text-red-200 text-xs">
                <AlertCircle size={16} className="shrink-0 text-red-400 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-black text-[#c5a880]/80 block">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c5a880]/60" />
                <input 
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@zoniraz.com"
                  className="w-full bg-black/40 border border-[#c5a880]/20 rounded-2xl py-3.5 pl-11 pr-4 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#c5a880] transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase tracking-widest font-black text-[#c5a880]/80">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setForgotStep(1);
                    setForgotEmail(loginEmail);
                    setForgotError('');
                    setForgotSuccess('');
                  }}
                  className="text-[10px] uppercase tracking-widest font-bold text-[#c5a880] hover:text-white transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c5a880]/60" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black/40 border border-[#c5a880]/20 rounded-2xl py-3.5 pl-11 pr-11 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#c5a880] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c5a880]/60 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#5d463c] hover:bg-[#4a372f] text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 border border-[#c5a880]/30 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin text-[#c5a880]" />
              ) : (
                <>
                  <span>Sign In to Executive Portal</span>
                  <ArrowRight size={16} className="text-[#c5a880]" />
                </>
              )}
            </button>

            {/* Helper Notice for Quick Testing */}
            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-[10.5px] text-[#c5a880]/70 text-center">
              💡 Default Admin: <span className="text-white font-mono font-bold">admin@zoniraz.com</span> / <span className="text-white font-mono font-bold">admin123</span>
            </div>

          </form>
        )}

        {/* ---------------- FORGOT PASSWORD MODE ---------------- */}
        {mode === 'forgot' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            
            <button
              type="button"
              onClick={() => setMode('login')}
              className="inline-flex items-center space-x-1.5 text-xs text-[#c5a880] hover:text-white transition-colors cursor-pointer mb-2"
            >
              <ArrowLeft size={14} />
              <span>Back to Login</span>
            </button>

            <div className="border-b border-[#c5a880]/20 pb-3">
              <h3 className="text-lg font-serif font-bold text-white flex items-center space-x-2">
                <KeyRound size={18} className="text-[#c5a880]" />
                <span>Reset Admin Password</span>
              </h3>
              <p className="text-[11px] text-[#c5a880]/70 mt-1">
                Step {forgotStep} of 3 — Email Verification OTP
              </p>
            </div>

            {forgotError && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start space-x-3 text-red-200 text-xs">
                <AlertCircle size={16} className="shrink-0 text-red-400 mt-0.5" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSuccess && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start space-x-3 text-emerald-200 text-xs">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-400 mt-0.5" />
                <span>{forgotSuccess}</span>
              </div>
            )}

            {/* STEP 1: Enter Email & Send OTP */}
            {forgotStep === 1 && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-black text-[#c5a880]/80 block">
                    Registered Admin Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c5a880]/60" />
                    <input 
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="admin@zoniraz.com"
                      className="w-full bg-black/40 border border-[#c5a880]/20 rounded-2xl py-3.5 pl-11 pr-4 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3.5 bg-[#5d463c] hover:bg-[#4a372f] text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  {forgotLoading ? (
                    <Loader2 size={16} className="animate-spin text-[#c5a880]" />
                  ) : (
                    <>
                      <span>Send Verification Code 📧</span>
                      <ArrowRight size={14} className="text-[#c5a880]" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: Enter OTP Code */}
            {forgotStep === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-black text-[#c5a880]/80 block">
                    Enter 6-Digit Email Code
                  </label>
                  <div className="relative">
                    <ShieldCheck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c5a880]/60" />
                    <input 
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full bg-black/40 border border-[#c5a880]/20 rounded-2xl py-3.5 pl-11 pr-4 text-center font-mono text-lg tracking-[0.4em] text-white placeholder-white/20 focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3.5 bg-[#5d463c] hover:bg-[#4a372f] text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  {forgotLoading ? (
                    <Loader2 size={16} className="animate-spin text-[#c5a880]" />
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <ArrowRight size={14} className="text-[#c5a880]" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 3: Enter New Password */}
            {forgotStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-black text-[#c5a880]/80 block">
                    New Master Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c5a880]/60" />
                    <input 
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full bg-black/40 border border-[#c5a880]/20 rounded-2xl py-3.5 pl-11 pr-11 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#c5a880]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c5a880]/60 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-black text-[#c5a880]/80 block">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c5a880]/60" />
                    <input 
                      type="password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full bg-black/40 border border-[#c5a880]/20 rounded-2xl py-3.5 pl-11 pr-4 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  {forgotLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <span>Update Password & Save 🔒</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        )}

      </div>

      {/* Subtle Footer Note */}
      <div className="absolute bottom-6 text-[10px] uppercase tracking-widest text-[#c5a880]/40 font-bold">
        Zoniraz Jewels • Security Protected Panel
      </div>

    </div>
  );
}
