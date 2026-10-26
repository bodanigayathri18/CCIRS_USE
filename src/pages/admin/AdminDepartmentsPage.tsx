import React, { useState } from 'react';
import { storage } from '../../services/storage';
import { Department } from '../../types';
import {
  Building2,
  PlusCircle,
  Clock,
  Phone,
  Mail,
  Users,
  CheckCircle2,
  Edit,
  X,
  Send,
} from 'lucide-react';

export const AdminDepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>(() => storage.getDepartments());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [headName, setHeadName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [slaTargetHours, setSlaTargetHours] = useState(48);
  const [description, setDescription] = useState('');

  const refresh = () => {
    setDepartments(storage.getDepartments());
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !headName.trim()) return;

    const newDept: Department = {
      id: `dept-${Date.now()}`,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim(),
      headName: headName.trim(),
      email: email.trim() || `${code.toLowerCase()}@municipal.ccirs.gov`,
      phone: phone.trim() || '+91 80 2297 5000',
      slaTargetHours: Number(slaTargetHours) || 48,
    };

    storage.addDepartment(newDept);
    setIsAddModalOpen(false);
    resetForm();
    refresh();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;

    storage.updateDepartment(editingDept.id, {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      headName: headName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      slaTargetHours: Number(slaTargetHours) || 48,
      description: description.trim(),
    });

    setEditingDept(null);
    resetForm();
    refresh();
  };

  const resetForm = () => {
    setName('');
    setCode('');
    setHeadName('');
    setEmail('');
    setPhone('');
    setSlaTargetHours(48);
    setDescription('');
  };

  const openEditModal = (d: Department) => {
    setEditingDept(d);
    setName(d.name);
    setCode(d.code);
    setHeadName(d.headName);
    setEmail(d.email);
    setPhone(d.phone);
    setSlaTargetHours(d.slaTargetHours);
    setDescription(d.description);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              Municipal Organizational Hierarchy
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
              Municipal Departments &amp; SLA Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure engineering divisions, supervisory heads, and grievance resolution SLA
              deadlines.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0 self-start sm:self-center"
          >
            <PlusCircle size={15} />
            <span>Create Department</span>
          </button>
        </div>

        {/* Department Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => {
            const resolved = dept.resolvedComplaints || 0;
            const total = dept.totalComplaints || 0;
            const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;

            return (
              <div
                key={dept.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-400 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {dept.code}
                    </span>
                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <Clock size={12} className="text-indigo-600" />
                      <span>{dept.slaTargetHours}h SLA</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-3 leading-snug">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{dept.description}</p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-slate-500">Superintendent:</span>
                    <span className="font-bold text-slate-900">{dept.headName}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-slate-500">Active Staff:</span>
                    <span className="font-semibold text-slate-900 flex items-center gap-1">
                      <Users size={13} className="text-slate-400" />
                      <span>{dept.activeOfficerCount || 1} Officers</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-slate-500">Resolution Rate:</span>
                    <span className="font-mono font-bold text-emerald-600">
                      {resolved}/{total} ({rate}%)
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="truncate">{dept.email}</span>
                    <span className="font-mono shrink-0">{dept.phone}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(dept)}
                    className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Edit size={13} />
                    <span>Configure Division SLA</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(isAddModalOpen || editingDept) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingDept ? 'Edit Municipal Department' : 'Create New Municipal Department'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingDept(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={editingDept ? handleEditSubmit : handleCreateSubmit}
              className="space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Department Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Roads & Bridges Department"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Department Code *
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. DEP-ROADS"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono uppercase"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Superintendent / Head Name *
                  </label>
                  <input
                    type="text"
                    value={headName}
                    onChange={(e) => setHeadName(e.target.value)}
                    placeholder="e.g. Er. Rajesh Kumar"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Target SLA Hours *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="168"
                    value={slaTargetHours}
                    onChange={(e) => setSlaTargetHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dept@municipal.ccirs.gov"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Direct Phone Line
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 80 2297 5001"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Scope &amp; Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Civic responsibilities and infrastructure covered..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingDept(null);
                  }}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                >
                  {editingDept ? 'Save Changes' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
