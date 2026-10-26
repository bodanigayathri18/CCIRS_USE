import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storage';
import { GHMC_WARDS, GHMCWard, getGHMCWardByNumber, formatGHMCWardFullLabel } from '../data/ghmcWards';
import {
  User,
  HardHat,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Building2,
  MapPin,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Search,
  ChevronDown,
  X,
} from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (view: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { registerCitizen, registerOfficer } = useAuth();
  const departments = storage.getDepartments();

  // Registration Type: 'citizen' | 'officer'
  const [roleType, setRoleType] = useState<'citizen' | 'officer'>('citizen');

  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Officer-specific fields: No ward is selected by default (null)
  const [officerId, setOfficerId] = useState('');
  const [wardNumber, setWardNumber] = useState<number | null>(null);
  const [isWardDropdownOpen, setIsWardDropdownOpen] = useState(false);
  const [wardSearch, setWardSearch] = useState('');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || 'dept-roads');
  const [designation, setDesignation] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);

  const wardDropdownRef = useRef<HTMLDivElement>(null);

  // Close ward dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wardDropdownRef.current && !wardDropdownRef.current.contains(e.target as Node)) {
        setIsWardDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Status & Error
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Filter 150 GHMC wards for search (search query does not affect selected ward)
  const filteredWards = GHMC_WARDS.filter((w) => {
    const q = wardSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      w.wardNumber.toString().includes(q) ||
      w.wardName.toLowerCase().includes(q) ||
      w.zone.toLowerCase().includes(q) ||
      w.circle.toLowerCase().includes(q)
    );
  });

  // Selected ward record derived reliably from verified official dataset
  const selectedWard = wardNumber !== null ? getGHMCWardByNumber(wardNumber) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessNotice(null);

    // Common validations
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.');
      return;
    }

    // Citizen Registration
    if (roleType === 'citizen') {
      const res = registerCitizen(name.trim(), email.trim(), phone.trim());
      if (res.success) {
        onNavigate('citizen-dash');
      } else {
        setErrorMessage(res.message || 'Registration failed.');
      }
      return;
    }

    // Officer Registration validations
    if (!officerId.trim()) {
      setErrorMessage('Official Municipal Employee ID is mandatory for officer registration.');
      return;
    }

    if (wardNumber === null || !selectedWard) {
      setErrorMessage('Please select your assigned GHMC ward (1 to 150) from the official list.');
      return;
    }

    if (!consentChecked) {
      setErrorMessage('Please accept the official municipal code of conduct consent checkbox.');
      return;
    }

    const res = registerOfficer({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      officerId: officerId.trim().toUpperCase(),
      wardNumber: selectedWard.wardNumber,
      departmentId,
      designation: designation.trim() || undefined,
    });

    if (res.success) {
      setSuccessNotice(res.message || 'Officer registration submitted for administrative approval.');
    } else {
      setErrorMessage(res.message || 'Officer registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Information Column */}
        <div className="md:col-span-5 text-white space-y-6 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-teal-300 text-xs font-semibold">
            <ShieldCheck size={14} className="text-teal-400" />
            <span>GHMC Official Registration Portal</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight leading-tight">
            Create Your CCIRS Account
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Select your account type to register. Citizens can immediately report civic problems,
            while Municipal Officers register with official employee credentials for verification.
          </p>

          {/* Account Types Explainer */}
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold text-teal-300">
                <User size={16} />
                <span>Citizen Account</span>
              </div>
              <p className="text-slate-300">
                Instant access. Report potholes, garbage, streetlights, or water leaks in any of Hyderabad&apos;s 150 wards.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <HardHat size={16} />
                <span>Municipal Officer Account</span>
              </div>
              <p className="text-slate-300">
                Requires official GHMC / HMWSSB employee ID, department, and assigned ward. Accounts are verified by the GHMC Commissioner prior to activation.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Registration Card */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
          {successNotice ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Registration Submitted!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                {successNotice}
              </p>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-left text-slate-700 max-w-sm mx-auto space-y-1">
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Officer ID:</strong> {officerId.toUpperCase()}</p>
                <p><strong>Assigned Ward:</strong> {selectedWard ? formatGHMCWardFullLabel(selectedWard) : 'None'}</p>
                <p><strong>Verification:</strong> Pending Administrative Review</p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('signin')}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  Go to Sign In
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="pb-5 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">Create New Account</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose your registration role below to get started
                </p>

                {/* Role Switcher Tabs */}
                <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setRoleType('citizen');
                      setErrorMessage('');
                    }}
                    className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      roleType === 'citizen'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <User size={14} />
                    <span>Citizen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRoleType('officer');
                      setErrorMessage('');
                    }}
                    className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      roleType === 'officer'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <HardHat size={14} />
                    <span>Municipal Officer</span>
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    placeholder={roleType === 'citizen' ? 'e.g. Gayathri Bodanapu' : 'e.g. Er. K. V. S. Murthy'}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      placeholder={roleType === 'citizen' ? 'citizen@gmail.com' : 'officer.roads@ghmc.gov.in'}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                      placeholder="+91 98451 23456"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Officer-Specific Section */}
                {roleType === 'officer' && (
                  <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-3.5">
                    <span className="font-bold text-indigo-950 uppercase tracking-wider block text-[11px]">
                      Official Municipal Credentials (GHMC)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Officer / Employee ID *
                        </label>
                        <input
                          type="text"
                          value={officerId}
                          onChange={(e) => setOfficerId(e.target.value)}
                          placeholder="e.g. GHMC-ENG-4921"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 bg-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Department *
                        </label>
                        <select
                          value={departmentId}
                          onChange={(e) => setDepartmentId(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                        >
                          {departments.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name} ({d.code})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Searchable GHMC Ward Selector */}
                    <div ref={wardDropdownRef} className="relative">
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-bold text-slate-700 uppercase tracking-wider">
                          Assigned GHMC Ward (1 to 150) *
                        </label>
                        {selectedWard && (
                          <span className="text-[10px] text-indigo-700 font-semibold">
                            {selectedWard.circle} Circle · {selectedWard.zone} Zone
                          </span>
                        )}
                      </div>

                      {/* Closed Selector Field Trigger Button */}
                      <button
                        type="button"
                        onClick={() => setIsWardDropdownOpen(!isWardDropdownOpen)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between transition-all bg-white ${
                          isWardDropdownOpen
                            ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                            : selectedWard
                            ? 'border-indigo-300 bg-indigo-50/20 hover:border-indigo-400'
                            : 'border-slate-300 hover:border-slate-400'
                        }`}
                        aria-haspopup="listbox"
                        aria-expanded={isWardDropdownOpen}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <MapPin
                            size={16}
                            className={selectedWard ? 'text-indigo-600 shrink-0' : 'text-slate-400 shrink-0'}
                          />
                          {selectedWard ? (
                            <div className="truncate flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-xs">
                                Ward {selectedWard.wardNumber} — {selectedWard.wardName}
                              </span>
                              <span className="text-[11px] text-indigo-600 font-medium hidden sm:inline">
                                ({selectedWard.circle} Circle, {selectedWard.zone} Zone)
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">
                              Select assigned GHMC ward (1 to 150)...
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          {selectedWard && (
                            <span
                              role="button"
                              tabIndex={0}
                              title="Clear ward selection"
                              onClick={(e) => {
                                e.stopPropagation();
                                setWardNumber(null);
                              }}
                              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <X size={14} />
                            </span>
                          )}
                          <ChevronDown
                            size={16}
                            className={`text-slate-500 transition-transform duration-200 ${
                              isWardDropdownOpen ? 'rotate-180 text-indigo-600' : ''
                            }`}
                          />
                        </div>
                      </button>

                      {/* Dropdown Popover */}
                      {isWardDropdownOpen && (
                        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                          {/* Search Input Filter */}
                          <div className="p-2.5 border-b border-slate-100 bg-slate-50/90">
                            <div className="relative">
                              <Search
                                size={14}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                              />
                              <input
                                type="text"
                                value={wardSearch}
                                onChange={(e) => setWardSearch(e.target.value)}
                                placeholder="Search by ward number, name, circle, or zone (e.g. 129, Suraram, Banjara)..."
                                className="w-full pl-8 pr-8 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                autoFocus
                              />
                              {wardSearch && (
                                <button
                                  type="button"
                                  onClick={() => setWardSearch('')}
                                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                  title="Clear search text"
                                >
                                  <X size={13} />
                                </button>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-500 px-1 pt-1.5">
                              <span>Showing {filteredWards.length} of 150 official GHMC wards</span>
                              {selectedWard && (
                                <span className="text-indigo-700 font-semibold">
                                  Current: Ward {selectedWard.wardNumber}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Scrollable List of Filtered Wards */}
                          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100/70 p-1">
                            {filteredWards.length === 0 ? (
                              <div className="p-6 text-center text-xs text-slate-400">
                                No official GHMC ward found matching &quot;{wardSearch}&quot;.
                                <button
                                  type="button"
                                  onClick={() => setWardSearch('')}
                                  className="block mx-auto mt-1 text-indigo-600 font-bold hover:underline"
                                >
                                  Show all 150 wards
                                </button>
                              </div>
                            ) : (
                              filteredWards.map((w) => {
                                const isSelected = wardNumber === w.wardNumber;
                                return (
                                  <button
                                    type="button"
                                    key={w.wardNumber}
                                    onClick={() => {
                                      setWardNumber(w.wardNumber);
                                      setIsWardDropdownOpen(false);
                                      setWardSearch('');
                                      setErrorMessage('');
                                    }}
                                    className={`w-full px-3 py-2 text-left rounded-xl transition-colors flex items-center justify-between gap-3 text-xs ${
                                      isSelected
                                        ? 'bg-indigo-50/90 text-indigo-950 font-semibold ring-1 ring-indigo-200'
                                        : 'hover:bg-slate-50 text-slate-700'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 truncate">
                                      <span
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                                          isSelected
                                            ? 'bg-indigo-600 text-white shadow-xs'
                                            : 'bg-slate-100 text-slate-600'
                                        }`}
                                      >
                                        {w.wardNumber}
                                      </span>
                                      <div className="truncate">
                                        <span className="font-bold text-slate-900 block truncate">
                                          {w.wardName}
                                        </span>
                                        <span className="text-[10px] text-slate-500 block truncate">
                                          {w.circle} Circle · {w.zone} Zone
                                        </span>
                                      </div>
                                    </div>

                                    {isSelected && (
                                      <div className="flex items-center gap-1 text-emerald-600 font-bold text-[11px] shrink-0">
                                        <CheckCircle2 size={16} />
                                        <span>Selected</span>
                                      </div>
                                    )}
                                  </button>
                                );
                              })
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Designation / Role Title
                      </label>
                      <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. Assistant Engineer (Roads) / AMOH Sanitation"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        placeholder="Min 6 characters"
                        className="w-full px-3.5 py-2 pr-9 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      placeholder="Re-enter password"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Officer Consent Checkbox */}
                {roleType === 'officer' && (
                  <label className="flex items-start gap-2.5 cursor-pointer text-slate-700 text-xs pt-1">
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      required
                    />
                    <span className="leading-relaxed">
                      I certify that I am a bonafide municipal engineer/officer of GHMC/HMWSSB and agree to official administrative verification before account activation.
                    </span>
                  </label>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <span>
                    {roleType === 'citizen'
                      ? 'Complete Citizen Registration'
                      : 'Submit Officer Registration for Approval'}
                  </span>
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* Navigation to Sign In */}
              <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('signin')}
                    className="font-bold text-blue-600 hover:text-blue-800 transition-colors underline"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
