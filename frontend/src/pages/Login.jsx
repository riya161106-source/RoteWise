import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2, Sparkles, Navigation } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const from = location.state?.from?.pathname || '/planner';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setNotification({ type: 'error', message: 'Please enter both your email address and password.' });
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.message || 'Invalid email or password.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for demonstration
  const handleQuickFillDemo = () => {
    setEmail('aditya.sharma@example.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 text-navy-950 font-bold mb-3">
            <Navigation className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Sign In to RouteWise
          </h1>
          <p className="text-xs text-slate-400">
            Access your saved routes, MySQL search history, and vehicle fuel profile
          </p>
        </div>

        {/* Demo Account Quick-Fill Card */}
        <div className="p-3.5 rounded-xl bg-navy-900 border border-emerald-500/30 text-xs text-left flex items-center justify-between gap-3 shadow-md">
          <div>
            <span className="font-bold text-emerald-400 flex items-center gap-1 text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Evaluator Quick-Fill
            </span>
            <p className="text-slate-300 text-[11px] mt-0.5">aditya.sharma@example.com / password123</p>
          </div>
          <button
            type="button"
            onClick={handleQuickFillDemo}
            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-colors"
          >
            Auto Fill
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-navy-900 border border-navy-700/80 rounded-2xl p-6 shadow-xl space-y-4 text-left">
          
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-navy-950 border border-navy-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-navy-950 border border-navy-700 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-600 text-navy-950 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-400 pt-2">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold">
              Create an account
            </Link>
          </p>

        </form>

      </div>

      {notification && (
        <Toast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
