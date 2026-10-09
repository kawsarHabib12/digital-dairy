import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  PenLine, 
  Clock, 
  Map, 
  Sparkles, 
  BarChart3, 
  LogOut, 
  User as UserIcon,
  Menu,
  X,
  Calendar,
  Feather
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: BookOpen },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Reflection', path: '/reflection', icon: Feather },
    { name: 'Timeline', path: '/timeline', icon: Clock },
    { name: 'Memory Map', path: '/map', icon: Map },
    { name: 'Ask My Diary', path: '/ask', icon: Sparkles },
    { name: 'Insights', path: '/insights', icon: BarChart3 },
  ];

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-diary-border sticky top-0 z-50 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[4.5rem] flex items-center justify-between py-2">
        {/* Brand Logo */}
        <Link 
          to={isAuthenticated ? '/dashboard' : '/'} 
          className="flex items-center space-x-3 group"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="w-11 h-11 rounded-2xl bg-parchment-200 border border-parchment-400/50 flex items-center justify-center text-amber-800 shadow-sm group-hover:scale-105 transition-transform">
            <BookOpen className="w-6 h-6 text-amber-800" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-serif font-bold text-2xl tracking-tight text-diary-ink">
                MemoAI
              </span>
            </div>
            <p className="text-xs sm:text-sm text-diary-muted font-medium hidden sm:block tracking-wide">
              Your Intelligent Diary
            </p>
          </div>
        </Link>

        {/* Navigation Items (Authenticated - Desktop) */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center space-x-1.5 lg:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm lg:text-base font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-100/70 text-amber-900 border border-amber-300/60 shadow-xs'
                      : 'text-diary-muted hover:text-diary-ink hover:bg-parchment-100'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-amber-800' : 'text-diary-muted'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              {/* Write Memory Button */}
              <Link
                to="/write"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-800 text-white text-sm lg:text-base font-semibold hover:bg-amber-900 transition-colors shadow-sm"
              >
                <PenLine className="w-4 h-4" />
                <span>Write</span>
              </Link>

              {/* User Profile & Logout */}
              <div className="hidden sm:flex items-center space-x-3 pl-2.5 border-l border-diary-border">
                <div className="w-9 h-9 rounded-full bg-parchment-200 border border-diary-border flex items-center justify-center text-sm font-bold text-amber-900 shadow-2xs">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="hidden lg:block text-left text-sm">
                  <div className="font-semibold text-diary-ink truncate max-w-[130px]">
                    {user?.name || 'User'}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-xl text-diary-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-diary-muted hover:text-diary-ink hover:bg-parchment-100 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2.5">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-sm lg:text-base font-semibold text-diary-ink hover:bg-parchment-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-xl bg-amber-800 text-white text-sm lg:text-base font-semibold hover:bg-amber-900 transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isAuthenticated && mobileMenuOpen && (
        <div className="md:hidden border-t border-diary-border bg-white/98 px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-base font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-100/70 text-amber-900 border border-amber-300/60'
                    : 'text-diary-muted hover:text-diary-ink hover:bg-parchment-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-800' : 'text-diary-muted'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}

          <div className="pt-3 mt-2 border-t border-diary-border flex items-center justify-between px-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-parchment-200 flex items-center justify-center text-sm font-bold text-amber-900">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <span className="text-sm font-semibold text-diary-ink">{user?.name || 'User'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1.5 text-sm font-semibold text-rose-600 hover:text-rose-700 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
