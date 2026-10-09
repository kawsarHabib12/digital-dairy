import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Lock, Mail, ArrowRight, AlertCircle, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Invalid email or password. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('elena@diary.com');
    setPassword('secretPassword123');
  };

  return (
    <div className="min-h-screen bg-diary-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2.5 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-parchment-200 border border-parchment-400/50 flex items-center justify-center text-amber-800 shadow-sm group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 text-amber-800" />
          </div>
          <span className="font-serif font-bold text-2xl text-diary-ink">MemoAI</span>
        </Link>
        <h2 className="font-serif font-bold text-2xl text-diary-ink tracking-tight">
          Welcome back to your diary
        </h2>
        <p className="mt-1.5 text-xs text-diary-muted">
          Your personal memories are waiting for you.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-diary-border shadow-diary-lg">
          {error && (
            <div className="mb-5 flex items-center space-x-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-diary-ink mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-diary-muted">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-diary-border bg-parchment-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/30 focus:border-amber-800 transition-all text-diary-ink placeholder:text-diary-muted/60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-diary-ink mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-diary-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-diary-border bg-parchment-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/30 focus:border-amber-800 transition-all text-diary-ink placeholder:text-diary-muted/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-diary-muted hover:text-diary-ink transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 cursor-pointer text-diary-muted select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-amber-800 focus:ring-amber-800/30 border-diary-border"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => alert('Password reset link will be sent to your email (Mock UI).')}
                className="text-amber-800 hover:text-amber-900 font-medium"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-800 text-white font-semibold text-sm hover:bg-amber-900 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Fill */}
          <div className="mt-5 pt-5 border-t border-diary-border text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center space-x-1.5 text-xs text-diary-muted hover:text-amber-800 transition-colors bg-parchment-100 hover:bg-parchment-200 px-3 py-1.5 rounded-lg border border-diary-border"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Fill Demo Credentials (Elena)</span>
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-diary-muted">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-amber-800 hover:text-amber-900">
            Create your diary
          </Link>
        </p>
      </div>
    </div>
  );
}
