import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_USERS } from '../services/storage';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  Clock,
  Sparkles,
  User,
  HardHat,
  X,
  CheckCircle2,
} from 'lucide-react';

interface SignInPageProps {
  onNavigate: (view: string) => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ onNavigate }) => {
  const { login, switchDemoUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPendingNotice, setIsPendingNotice] = useState<string | null>(null);

  // Forgot password modal
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsPendingNotice(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter your registered email address and password.');
      return;
    }

    const result = login(email.trim(), password);

    if (result.success && result.user) {
      if (result.user.role === 'admin') {
        onNavigate('admin-dash');
      } else if (result.user.role === 'officer') {
        onNavigate('officer-dash');
      } else {
        onNavigate('citizen-dash');
      }
    } else if (result.isPendingApproval) {
      setIsPendingNotice(result.message || 'Your officer account is pending administrative verification.');
    } else {
      setErrorMessage(result.message || 'Invalid credentials. Please verify your email and password.');
    }
  };

  const handleQuickDemoLogin = (userId: string) => {
    switchDemoUser(userId);
    const user = INITIAL_USERS.find((u) => u.id === userId);
    if (user?.role === 'admin') onNavigate('admin-dash');
    else if (user?.role === 'officer') onNavigate('officer-dash');
    else onNavigate('citizen-dash');
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Information Column */}
        <div className="md:col-span-5 text-white space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-teal-300 text-xs font-semibold">
            <ShieldCheck size={14} className="text-teal-400" />
            <span>GHMC Grievance Redressal Portal</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight leading-tight">
            Sign In to CCIRS Hyderabad
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Unified access for Citizens, GHMC Field Engineers, and Municipal Directorate.
            Report civic problems with GPS photos, monitor ward progress, and track resolution timelines.
          </p>

          <div className="space-y-3 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                ✓
              </div>
              <span>Verified 150 GHMC Wards coverage</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                ✓
              </div>
              <span>Real Google Maps &amp; GPS coordinates</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                ✓
              </div>
              <span>Mandated 24h - 48h Resolution SLAs</span>
            </div>
          </div>
        </div>

        {/* Right Column: Sign In Card */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Sign In to Your Account</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter your registered credentials below
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 text-white flex items-center justify-center font-black text-lg shadow-sm">
              C
            </div>
          </div>

          {/* Pending Verification Notice */}
          {isPendingNotice && (
            <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium flex items-start gap-2.5">
              <Clock size={18} className="text-amber-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold block">Officer Verification Pending</span>
                <p className="mt-0.5 leading-relaxed">{isPendingNotice}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage('');
                  }}
                  autoComplete="email"
                  placeholder="name@ccirs.gov or citizen@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotModalOpen(true);
                    setForgotEmail(email);
                    setForgotSuccess(false);
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage('');
                  }}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>Sign In</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Separate Registration Navigation */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="font-bold text-blue-600 hover:text-blue-800 transition-colors underline"
              >
                Create an account
              </button>
            </p>
          </div>

          {/* Quick Demo Login Roster for Lab Testing */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Sparkles size={13} className="text-amber-500" />
                <span>Instant Demo Login (1-Click)</span>
              </span>
              <span className="text-[10px] text-slate-400">Software Eng Lab Profiles</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('user-citizen-1')}
                className="p-2 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-left transition-all flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                  <User size={13} />
                </div>
                <div className="min-w-0">
                  <span className="font-semibold text-slate-900 block truncate">Gayathri (Citizen)</span>
                  <span className="text-[10px] text-slate-500">Citizen</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('user-officer-roads')}
                className="p-2 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left transition-all flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0">
                  <HardHat size={13} />
                </div>
                <div className="min-w-0">
                  <span className="font-semibold text-slate-900 block truncate">Er. Rajesh (Roads)</span>
                  <span className="text-[10px] text-slate-500">Ward 105 Banjara Hills</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('user-officer-sanitation')}
                className="p-2 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 text-left transition-all flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0">
                  <HardHat size={13} />
                </div>
                <div className="min-w-0">
                  <span className="font-semibold text-slate-900 block truncate">Smt. Sunita (Sanitation)</span>
                  <span className="text-[10px] text-slate-500">Ward 113 Gachibowli</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('user-admin')}
                className="p-2 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 text-left transition-all flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 font-bold flex items-center justify-center shrink-0">
                  <ShieldCheck size={13} />
                </div>
                <div className="min-w-0">
                  <span className="font-semibold text-slate-900 block truncate">Dr. Aruna (Admin)</span>
                  <span className="text-[10px] text-slate-500">GHMC Commissioner</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Reset Your Password</h3>
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {forgotSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Password Reset Link Dispatched</span>
                </div>
                <p>
                  A secure reset link has been simulated for <strong>{forgotEmail}</strong>. Check your inbox or use the demonstration login credentials.
                </p>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="mt-2 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 text-xs">
                <p className="text-slate-600 leading-relaxed">
                  Enter your registered email address and we will dispatch password recovery instructions.
                </p>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@ghmc.gov or citizen@gmail.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                    required
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
