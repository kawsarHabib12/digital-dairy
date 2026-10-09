import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, Mail, Lock, ArrowRight, AlertCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Email might already be taken.'
      );
    } finally {
      setSubmitting(false);
    }
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
          Create your intelligent diary
        </h2>
        <p className="mt-1.5 text-xs text-diary-muted">
          Your personal memories, securely recorded and organized.
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
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-diary-muted">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Elena Gilbert"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-diary-border bg-parchment-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/30 focus:border-amber-800 transition-all text-diary-ink placeholder:text-diary-muted/60"
                />
              </div>
            </div>

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
                  placeholder="elena@diary.com"
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
                  placeholder="At least 6 characters"
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

            <div>
              <label className="block text-xs font-semibold text-diary-ink mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-diary-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-diary-border bg-parchment-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/30 focus:border-amber-800 transition-all text-diary-ink placeholder:text-diary-muted/60"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-diary-muted hover:text-diary-ink transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[11px] text-diary-muted pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Your memories are strictly encrypted and private.</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-800 text-white font-semibold text-sm hover:bg-amber-900 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <span>{submitting ? 'Creating account...' : 'Create My Diary'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-diary-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-amber-800 hover:text-amber-900">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
