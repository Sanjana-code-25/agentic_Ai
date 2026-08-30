import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  ShieldAlert,
  PlusCircle,
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
  Building2,
  CheckCircle,
  Sun,
  Moon,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAdmin, isStudent, isAuthenticated } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <Link
              to={isAdmin ? '/admin/dashboard' : '/student/dashboard'}
              className="flex items-center space-x-2.5 group"
            >
              <img
                src="/college-logo.svg"
                alt="College logo"
                className="w-10 h-10 rounded-xl object-cover shadow-glow-brand group-hover:scale-105 transition-transform duration-200 ring-2 ring-brand-100 dark:ring-brand-500/20"
              />
              <div>
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                  Govt CPC<span className="text-brand-600 dark:text-brand-400"> Polytechnic</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block -mt-1 uppercase tracking-wider">
                  Complaint Desk
                </span>
              </div>
            </Link>

            {/* Portal Badge */}
            {isAuthenticated && (
              <span
                className={`hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ml-2 ${
                  isAdmin
                    ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/30'
                    : 'bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-500/10 dark:text-brand-300 dark:border-brand-500/30'
                }`}
              >
                {isAdmin ? 'Admin Console' : 'Student Portal'}
              </span>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-2">
                {isStudent && (
                  <>
                    <Link
                      to="/student/dashboard"
                      className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                        isActive('/student/dashboard')
                          ? 'bg-brand-50 text-brand-700 border border-brand-200 dark:bg-brand-600/20 dark:text-brand-400 dark:border-brand-500/30'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>My Dashboard</span>
                    </Link>

                    <Link
                      to="/student/complaint/new"
                      className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                        isActive('/student/complaint/new')
                          ? 'bg-brand-600 text-white shadow-glow-brand'
                          : 'bg-brand-600 text-white hover:bg-brand-500 shadow-sm'
                      }`}
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Lodge Complaint</span>
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive('/admin/dashboard')
                        ? 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-600/20 dark:text-purple-300 dark:border-purple-500/30'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Admin Overview</span>
                  </Link>
                )}

                {/* User Pill & Logout */}
                <div className="flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-slate-800">
                  <div className="flex items-center space-x-2.5">
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name || 'User profile'}
                        className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 text-xs font-bold uppercase">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-semibold text-slate-800 dark:text-white leading-tight">
                        {user?.name}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight truncate max-w-[120px]">
                        {user?.department || user?.email}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    title="Log out"
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {!isAuthenticated && (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-glow-brand transition-all"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Theme Toggle Button (Light/Dark) */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Mobile menu button */}
            {isAuthenticated && (
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg"
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isAuthenticated && mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 px-4 pt-3 pb-4 space-y-2">
          <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl mb-3 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-brand-500/20 text-brand-600 dark:text-brand-300 font-bold flex items-center justify-center text-sm">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
            </div>
          </div>

          {isStudent && (
            <>
              <Link
                to="/student/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>My Dashboard</span>
              </Link>
              <Link
                to="/student/complaint/new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-medium text-brand-600 dark:text-brand-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Lodge New Complaint</span>
              </Link>
            </>
          )}

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-medium text-purple-600 dark:text-purple-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin Overview</span>
            </Link>
          )}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
            className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-medium text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg mt-2 border-t border-slate-200 dark:border-slate-800"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
