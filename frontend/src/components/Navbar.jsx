import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Navigation, 
  MapPin, 
  History as HistoryIcon, 
  LayoutDashboard, 
  Fuel, 
  Info, 
  User, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Menu, 
  X,
  ShieldCheck
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Route Planner', path: '/planner', icon: MapPin },
    { name: 'Search History', path: '/history', icon: HistoryIcon, authRequired: true },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, authRequired: true },
    { name: 'Fuel Settings', path: '/settings', icon: Fuel, authRequired: true },
    { name: 'About System', path: '/about', icon: Info }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-navy-900/90 backdrop-blur-md border-b border-navy-700/60 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Navigation className="w-5 h-5 text-navy-950 font-bold" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Route<span className="text-emerald-400">Wise</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden sm:inline-block">
                  AI & ML
                </span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block -mt-1">
                Smart Route Optimization
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.authRequired && !isAuthenticated) return null;
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-navy-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* User Profile / Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-navy-800 border border-navy-700">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-200 leading-none">{user?.name}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{user?.email}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Log out of RouteWise"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-navy-800 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-navy-950 shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-900 border-b border-navy-700 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            if (link.authRequired && !isAuthenticated) return null;
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-navy-800 mt-2">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-2 text-sm text-slate-300">
                  Signed in as <span className="font-semibold text-emerald-400">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-rose-400 hover:bg-rose-500/10 font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-lg text-slate-200 bg-navy-800 font-medium text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-lg bg-emerald-500 text-navy-950 font-semibold text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
