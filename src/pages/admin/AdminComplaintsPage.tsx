import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { Complaint, ComplaintStatus } from '../../types';
import {
  Search,
  Filter,
  Download,
  Building2,
  RefreshCw,
  Edit,
  ArrowRight,
  X,
  Send,
  AlertCircle,
} from 'lucide-react';

interface AdminComplaintsPageProps {
  onNavigate: (view: string) => void;
  onSelectComplaint: (id: string) => void;
}

export const AdminComplaintsPage: React.FC<AdminComplaintsPageProps> = ({
  onNavigate,
  onSelectComplaint,
}) => {
  const { currentUser } = useAuth();
  const complaints = storage.getComplaints();
  const departments = storage.getDepartments();
  const categories = storage.getCategories();
  const users = storage.getUsers();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Reassignment modal
  const [reassignModalComplaint, setReassignModalComplaint] = useState<Complaint | null>(null);
  const [targetDeptId, setTargetDeptId] = useState(departments[0]?.id || '');
  const [targetOfficerId, setTargetOfficerId] = useState('');

  // Status override modal
  const [statusOverrideComplaint, setStatusOverrideComplaint] = useState<Complaint | null>(null);
  const [overrideStatus, setOverrideStatus] = useState<ComplaintStatus>('In Progress');
  const [overrideRemarks, setOverrideRemarks] = useState('');

  const filtered = complaints.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.citizenName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = filterDept === 'all' || c.departmentId === filterDept;
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || c.priority === filterPriority;

    return matchesSearch && matchesDept && matchesStatus && matchesPriority;
  });

  // Handle Reassignment
  const handleReassignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignModalComplaint || !currentUser) return;

    storage.reassignComplaint(
      reassignModalComplaint.id,
      targetDeptId,
      targetOfficerId || undefined,
      currentUser
    );

    setReassignModalComplaint(null);
  };

  // Handle Status Override
  const handleStatusOverrideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusOverrideComplaint || !currentUser) return;

    storage.updateComplaintStatus(
      statusOverrideComplaint.id,
      overrideStatus,
      currentUser,
      overrideRemarks.trim() || `Administrative override to ${overrideStatus}`
    );

    setStatusOverrideComplaint(null);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Complaint ID',
      'Title',
      'Category',
      'Priority',
      'Status',
      'Citizen Name',
      'Citizen Phone',
      'Department',
      'Assigned Officer',
      'Address',
      'Latitude',
      'Longitude',
      'Created At',
      'Resolved At',
    ];

    const rows = complaints.map((c) => [
      c.id,
      `"${c.title.replace(/"/g, '""')}"`,
      c.categoryName,
      c.priority,
      c.status,
      c.citizenName,
      c.citizenPhone,
      `"${c.departmentName}"`,
      c.assignedOfficerName || 'Unassigned',
      `"${c.location.address.replace(/"/g, '""')}"`,
      c.location.latitude,
      c.location.longitude,
      c.createdAt,
      c.resolvedAt || 'N/A',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ccirs_complaints_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
              Administrative Control Registry
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
              All Municipal Grievances ({complaints.length})
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Inspect, reassign departments, override statuses, or export records for audit.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0 self-start sm:self-center"
          >
            <Download size={14} />
            <span>Export CSV Report</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, title, citizen..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white"
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">ID &amp; Date</th>
                  <th className="px-5 py-3">Title &amp; Category</th>
                  <th className="px-5 py-3">Citizen</th>
                  <th className="px-5 py-3">Department &amp; Officer</th>
                  <th className="px-5 py-3">Priority</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                      No complaints match the selected administrative filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-900 block">{c.id}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="px-5 py-4 max-w-xs">
                        <span className="font-bold text-slate-900 block truncate">{c.title}</span>
                        <span className="text-[11px] text-slate-500">{c.categoryName}</span>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-900 block">{c.citizenName}</span>
                        <span className="text-[10px] text-slate-400">{c.citizenPhone}</span>
                      </td>

                      <td className="px-5 py-4 max-w-xs">
                        <span className="font-medium text-slate-800 block truncate">
                          {c.departmentName}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {c.assignedOfficerName || 'Auto-Assigned Queue'}
                        </span>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <PriorityBadge priority={c.priority} size="sm" />
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={c.status} size="sm" />
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-right space-x-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectComplaint(c.id);
                            onNavigate('complaint-detail');
                          }}
                          className="px-2.5 py-1 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-white rounded-lg transition-colors font-medium"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setReassignModalComplaint(c);
                            setTargetDeptId(c.departmentId);
                            setTargetOfficerId(c.assignedOfficerId || '');
                          }}
                          className="px-2.5 py-1 text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors font-semibold"
                          title="Transfer to different Department or Officer"
                        >
                          Reassign
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setStatusOverrideComplaint(c);
                            setOverrideStatus(c.status);
                            setOverrideRemarks('');
                          }}
                          className="px-2.5 py-1 text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors font-semibold"
                          title="Administrative Status Override"
                        >
                          Override
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reassign Modal */}
      {reassignModalComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Reassign Grievance #{reassignModalComplaint.id}
              </h3>
              <button
                type="button"
                onClick={() => setReassignModalComplaint(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReassignSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target Municipal Department *
                </label>
                <select
                  value={targetDeptId}
                  onChange={(e) => {
                    setTargetDeptId(e.target.value);
                    setTargetOfficerId('');
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  required
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
                  Assign to Specific Officer (Optional)
                </label>
                <select
                  value={targetOfficerId}
                  onChange={(e) => setTargetOfficerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="">Department Head / Queue Auto-Dispatch</option>
                  {users
                    .filter((u) => u.role === 'officer' && u.departmentId === targetDeptId)
                    .map((off) => (
                      <option key={off.id} value={off.id}>
                        {off.name} ({off.designation || 'Officer'})
                      </option>
                    ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReassignModalComplaint(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Confirm Reassignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Override Modal */}
      {statusOverrideComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Administrative Status Override #{statusOverrideComplaint.id}
              </h3>
              <button
                type="button"
                onClick={() => setStatusOverrideComplaint(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleStatusOverrideSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Override Status *
                </label>
                <select
                  value={overrideStatus}
                  onChange={(e) => setOverrideStatus(e.target.value as ComplaintStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Administrative Audit Remarks *
                </label>
                <textarea
                  rows={2}
                  value={overrideRemarks}
                  onChange={(e) => setOverrideRemarks(e.target.value)}
                  placeholder="Reason for administrative override (e.g. Director site inspection signoff)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStatusOverrideComplaint(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Apply Status Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
