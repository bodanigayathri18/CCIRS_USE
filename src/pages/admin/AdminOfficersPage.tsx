import React, { useState, useEffect } from 'react';
import { storage } from '../../services/storage';
import { User, UserRole } from '../../types';
import { GHMC_WARDS, getGHMCWardByNumber, formatGHMCWardFullLabel } from '../../data/ghmcWards';
import {
  Users,
  HardHat,
  ShieldCheck,
  PlusCircle,
  Search,
  Building2,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  X,
  Send,
  AlertCircle,
  Clock,
  Check,
  ThumbsDown,
} from 'lucide-react';

export const AdminOfficersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => storage.getUsers());
  const departments = storage.getDepartments();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('pending-officer');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for creating new officer
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [officerId, setOfficerId] = useState('');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || '');
  const [wardSelectionNumber, setWardSelectionNumber] = useState<number>(GHMC_WARDS[0].wardNumber);
  const [designation, setDesignation] = useState('');

  // Rejection modal state
  const [rejectingUser, setRejectingUser] = useState<User | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const refresh = () => {
    setUsers(storage.getUsers());
  };

  useEffect(() => {
    const unsub = storage.subscribe(refresh);
    return unsub;
  }, []);

  const pendingOfficers = users.filter((u) => u.role === 'officer' && u.isApproved === false);

  const handleCreateOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const dept = departments.find((d) => d.id === departmentId);
    const wardObj = getGHMCWardByNumber(wardSelectionNumber);

    const newOfficer: User = {
      id: `user-officer-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || '+91 98450 00000',
      role: 'officer',
      departmentId,
      departmentName: dept?.name,
      designation: designation.trim() || 'Sub-Divisional Officer',
      officerId: officerId.trim() || `GHMC-${Math.floor(1000 + Math.random() * 9000)}`,
      wardNumber: wardObj?.wardNumber,
      wardName: wardObj?.wardName,
      zone: wardObj?.zone,
      isApproved: true,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    storage.addUser(newOfficer);
    setIsAddModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    setOfficerId('');
    setDesignation('');
    refresh();
  };

  const handleApproveOfficer = (userId: string) => {
    storage.approveOfficer(userId);
    refresh();
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingUser) return;
    storage.rejectOfficer(rejectingUser.id, rejectionReason.trim() || 'Employee credentials could not be verified with GHMC database.');
    setRejectingUser(null);
    setRejectionReason('');
    refresh();
  };

  const toggleUserStatus = (u: User) => {
    storage.updateUser(u.id, { isActive: !u.isActive });
    refresh();
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.officerId && u.officerId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.wardName && u.wardName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.departmentName && u.departmentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.designation && u.designation.toLowerCase().includes(searchQuery.toLowerCase()));

    if (roleFilter === 'pending-officer') {
      return matchesSearch && u.role === 'officer' && u.isApproved === false;
    }
    if (roleFilter === 'approved-officer') {
      return matchesSearch && u.role === 'officer' && u.isApproved !== false;
    }
    if (roleFilter === 'citizen') {
      return matchesSearch && u.role === 'citizen';
    }
    if (roleFilter === 'admin') {
      return matchesSearch && u.role === 'admin';
    }
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              GHMC Personnel Administration
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
              Staff &amp; Officer Verification Roster
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review pending municipal officer credentials, assign wards, and control role-based access.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0 self-start sm:self-center"
          >
            <PlusCircle size={15} />
            <span>Create Verified Officer</span>
          </button>
        </div>

        {/* Pending Approvals Alert Banner */}
        {pendingOfficers.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-900">
                  {pendingOfficers.length} Municipal Officer Registration{pendingOfficers.length > 1 ? 's' : ''} Awaiting Approval
                </h4>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Unverified officers cannot access the field dashboard until approved by an administrator.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRoleFilter('pending-officer')}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors shrink-0"
            >
              Review Now
            </button>
          </div>
        )}

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user by name, badge ID, email, ward..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => setRoleFilter('pending-officer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                roleFilter === 'pending-officer'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending Approval ({pendingOfficers.length})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('approved-officer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                roleFilter === 'approved-officer'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Verified Officers
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('citizen')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                roleFilter === 'citizen'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Citizens
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                roleFilter === 'admin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admins
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                roleFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Users
            </button>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Officer / User</th>
                  <th className="px-5 py-3">Badge ID &amp; Role</th>
                  <th className="px-5 py-3">Department &amp; GHMC Ward</th>
                  <th className="px-5 py-3">Registered On</th>
                  <th className="px-5 py-3">Approval Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                      No users match the selected filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                              u.role === 'admin'
                                ? 'bg-purple-600'
                                : u.role === 'officer'
                                ? 'bg-blue-600'
                                : 'bg-emerald-600'
                            }`}
                          >
                            {u.name
                              .split(' ')
                              .map((p) => p[0])
                              .slice(0, 2)
                              .join('')}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{u.name}</span>
                            <span className="text-[11px] text-slate-500 font-mono">{u.email}</span>
                            <span className="text-[10px] text-slate-400 block">{u.phone}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        {u.officerId && (
                          <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px] block w-fit mb-1 border border-blue-200">
                            {u.officerId}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : u.role === 'officer'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="px-5 py-4 max-w-xs">
                        {u.departmentName ? (
                          <>
                            <span className="font-semibold text-slate-800 block truncate">
                              {u.departmentName}
                            </span>
                            {(() => {
                              const wardObj = u.wardNumber ? getGHMCWardByNumber(u.wardNumber) : null;
                              return (
                                <span className="text-[11px] text-teal-700 font-semibold block">
                                  {wardObj
                                    ? formatGHMCWardFullLabel(wardObj)
                                    : u.wardName
                                    ? `Ward ${u.wardNumber}: ${u.wardName}`
                                    : 'All Wards'}
                                </span>
                              );
                            })()}
                            <span className="text-[10px] text-slate-400">
                              {u.designation || 'Staff'}
                            </span>
                          </>
                        ) : (
                          <span className="text-slate-400 italic">Not applicable</span>
                        )}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-slate-500 font-mono">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        {u.role === 'officer' && u.isApproved === false ? (
                          <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold text-[11px] border border-amber-200">
                            <Clock size={12} className="text-amber-600" />
                            <span>Pending Review</span>
                          </span>
                        ) : u.isActive ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                            <CheckCircle size={13} className="text-emerald-500" />
                            <span>Active / Approved</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-700 font-semibold text-[11px]">
                            <XCircle size={13} className="text-rose-500" />
                            <span>Suspended</span>
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-right space-x-2">
                        {u.role === 'officer' && u.isApproved === false ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApproveOfficer(u.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors inline-flex items-center gap-1"
                            >
                              <Check size={12} />
                              <span>Approve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setRejectingUser(u)}
                              className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 border border-rose-200 font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-1"
                            >
                              <X size={12} />
                              <span>Reject</span>
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleUserStatus(u)}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                              u.isActive
                                ? 'text-rose-600 border-rose-200 hover:bg-rose-50'
                                : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                            }`}
                          >
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Reject Officer Registration</h3>
              <button
                type="button"
                onClick={() => setRejectingUser(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              You are rejecting the officer registration for <strong>{rejectingUser.name}</strong> ({rejectingUser.email}).
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Reason for Rejection *
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Employee ID not found in GHMC payroll registry / Invalid designation."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectingUser(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Officer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Register Verified Municipal Officer</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOfficer} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Officer Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Er. Karthik R"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Official Gov Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="karthik.roads@ghmc.gov.in"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Employee ID / Badge Number
                </label>
                <input
                  type="text"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  placeholder="GHMC-EMP-4089"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assigned Department *
                </label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assigned GHMC Ward (1 to 150) *
                </label>
                <select
                  value={wardSelectionNumber}
                  onChange={(e) => setWardSelectionNumber(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900"
                >
                  {GHMC_WARDS.map((w) => (
                    <option key={w.wardNumber} value={w.wardNumber}>
                      Ward {w.wardNumber}: {w.wardName} ({w.circle} Circle, {w.zone} Zone)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Designation / Role Title
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Ward Road Works Inspector"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
