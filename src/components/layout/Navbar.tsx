import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Bell,
  UserCheck,
  LogOut,
  PlusCircle,
  Menu,
  X,
  Shield,
  Layers,
  MapPin,
  Search,
} from 'lucide-react';
import { NotificationDrawer } from '../common/NotificationDrawer';
import { DemoSwitcherModal } from '../common/DemoSwitcherModal';
import { ConfirmationModal } from '../common/ConfirmationModal';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenComplaint?: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenComplaint }) => {
  const { currentUser, logout, unreadNotifsCount } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic Navigation Links based on role
  const getNavLinks = () => {
    if (!currentUser) {
      return [
        { id: 'landing', label: 'Home' },
        { id: 'track', label: 'Track Issue' },
        { id: 'map', label: 'Civic Map' },
        { id: 'signin', label: 'Sign In' },
        { id: 'register', label: 'Register' },
      ];
    }

    if (currentUser.role === 'citizen') {
      return [
        { id: 'citizen-dash', label: 'Dashboard' },
        { id: 'report', label: 'Report Issue' },
        { id: 'my-complaints', label: 'My Complaints' },
        { id: 'map', label: 'City Map' },
      ];
    }

    if (currentUser.role === 'officer') {
      return [
        { id: 'officer-dash', label: 'Officer Queue' },
        { id: 'map', label: 'Issue Map' },
        { id: 'track', label: 'Search' },
      ];
    }

    // Admin (Operational modules only)
    return [
      { id: 'admin-dash', label: 'Analytics' },
      { id: 'admin-complaints', label: 'All Issues' },
      { id: 'admin-departments', label: 'Departments' },
      { id: 'admin-officers', label: 'Staff & Approvals' },
    ];
  };

  const navLinks = getNavLinks();

  const handleConfirmLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    onNavigate('landing');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        {/* Top Notification / Role Ribbon */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-600 text-white text-[11px] px-4 py-1 flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider text-[10px]">
              {currentUser ? currentUser.role : 'Public Portal'}
            </span>
            <span className="hidden sm:inline">
              {currentUser
                ? `Logged in as: ${currentUser.name} ${
                    currentUser.departmentName ? `(${currentUser.departmentName})` : ''
                  }`
                : 'CCIRS · Greater Hyderabad Municipal Corporation Grievance Portal'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDemoModalOpen(true)}
              className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded text-[11px] hover:bg-amber-300 transition-colors shadow-xs"
            >
              <UserCheck size={12} />
              <span>Switch Demo Persona</span>
            </button>
          </div>
        </div>

        {/* 3-Zone Top Navigation Contract */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single Text Element) */}
          <div
            onClick={() => onNavigate(currentUser ? `${currentUser.role}-dash` : 'landing')}
            className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
              C
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap leading-none">
                CCIRS<span className="text-teal-600 font-black">.gov</span>
              </span>
              <span className="text-[10px] text-slate-500 tracking-wider font-semibold uppercase mt-0.5">
                Civic Resolution System
              </span>
            </div>
          </div>

          {/* Zone 2: Concise single-line text links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 text-xs font-semibold ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action Area */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Report Issue Button for Citizens */}
            {currentUser?.role === 'citizen' && currentView !== 'report' && (
              <button
                type="button"
                onClick={() => onNavigate('report')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-sm transition-all whitespace-nowrap shrink-0"
              >
                <PlusCircle size={14} />
                <span>Report Issue</span>
              </button>
            )}

            {/* Notification Bell */}
            {currentUser && (
              <button
                type="button"
                onClick={() => setIsNotifOpen(true)}
                className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell size={18} />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>
            )}

            {/* User Profile Avatar / Logout */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div
                  onClick={() => onNavigate('profile')}
                  className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200 cursor-pointer"
                  title="View Profile Settings"
                >
                  {currentUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('signin')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 rounded-xl transition-colors whitespace-nowrap shrink-0"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('register')}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors whitespace-nowrap shrink-0 shadow-sm"
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Mobile Hamburger Menu */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-xl text-sm font-medium ${
                  currentView === link.id
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        title="Confirm Sign Out"
        message="Are you sure you want to sign out of the CCIRS platform? You can sign back in anytime to submit complaints or manage department resolutions."
        confirmLabel="Yes, Sign Out"
        cancelLabel="Stay Logged In"
        isDestructive={true}
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        onSelectComplaint={onOpenComplaint}
      />

      {/* Persona Switcher Modal */}
      <DemoSwitcherModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onSwitched={() => {
          if (currentUser) {
            onNavigate(`${currentUser.role}-dash`);
          }
        }}
      />
    </>
  );
};
