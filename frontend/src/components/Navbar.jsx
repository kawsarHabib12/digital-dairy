import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  PenLine, 
  Clock, 
  Map, 
  Sparkles, 
  BarChart3, 
  LogOut, 
  User as UserIcon 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: BookOpen },
    { name: 'Timeline', path: '/timeline', icon: Clock },
    { name: 'Memory Map', path: '/map', icon: Map },
    { name: 'Ask My Diary', path: '/ask', icon: Sparkles },
    { name: 'Insights', path: '/insights', icon: BarChart3 },
  ];

  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-diary-border sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-parchment-200 border border-parchment-400/50 flex items-center justify-center text-amber-800 shadow-sm group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 text-amber-800" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-serif font-bold text-xl tracking-tight text-diary-ink">
                MemoAI
              </span>
            </div>
            <p className="text-xs text-diary-muted font-medium hidden sm:block tracking-wide">
              Your Intelligent Diary
            </p>
          </div>
        </Link>

        {/* Navigation Items (Authenticated) */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-50 text-amber-900 border border-amber-200/60 shadow-xs'
                      : 'text-diary-muted hover:text-diary-ink hover:bg-parchment-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-800' : 'text-diary-muted'}`} />
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
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-amber-800 text-white text-xs font-medium hover:bg-amber-900 transition-colors shadow-sm"
              >
                <PenLine className="w-3.5 h-3.5" />
                <span>Write</span>
              </Link>

              {/* User Profile & Logout */}
              <div className="flex items-center space-x-2 pl-2 border-l border-diary-border">
                <div className="w-8 h-8 rounded-full bg-parchment-200 border border-diary-border flex items-center justify-center text-xs font-semibold text-amber-900">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="hidden lg:block text-left text-xs">
                  <div className="font-semibold text-diary-ink truncate max-w-[120px]">
                    {user?.name || 'User'}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 rounded-lg text-diary-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-diary-ink hover:bg-parchment-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-xl bg-amber-800 text-white text-xs font-semibold hover:bg-amber-900 transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
