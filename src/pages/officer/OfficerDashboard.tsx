import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { Complaint, ComplaintStatus } from '../../types';
import { getGHMCWardByNumber, formatGHMCWardFullLabel } from '../../data/ghmcWards';
import {
  HardHat,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PlayCircle,
  XCircle,
  Camera,
  Upload,
  ArrowRight,
  Eye,
  FileCheck,
  Building2,
  Calendar,
  X,
  Send,
  RefreshCw,
  MapPin,
} from 'lucide-react';

interface OfficerDashboardProps {
  onNavigate: (view: string) => void;
  onSelectComplaint: (id: string) => void;
  activeStatusModalComplaint?: Complaint | null;
  onCloseStatusModal?: () => void;
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({
  onNavigate,
  onSelectComplaint,
  activeStatusModalComplaint,
  onCloseStatusModal,
}) => {
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>(() => storage.getComplaints());

  // Subscribe to storage changes for instant real-time synchronization
  useEffect(() => {
    const unsubscribe = storage.subscribe(() => {
      setComplaints(storage.getComplaints());
    });
    return unsubscribe;
  }, []);

  // Filter complaints for officer:
  // If officer has a departmentId, match complaints with that department or assigned directly to the officer
  const deptId = currentUser?.departmentId || 'dept-roads';
  const deptComplaints = complaints.filter(
    (c) =>
      c.departmentId === deptId ||
      c.assignedOfficerId === currentUser?.id ||
      (currentUser?.wardNumber &&
        c.location.wardNumber &&
        String(c.location.wardNumber).includes(String(currentUser.wardNumber)))
  );

  // Status modal state
  const [modalComplaint, setModalComplaint] = useState<Complaint | null>(
    activeStatusModalComplaint || null
  );
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('In Progress');
  const [remarks, setRemarks] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [materialsUsed, setMaterialsUsed] = useState('');
  const [resolutionImages, setResolutionImages] = useState<string[]>([]);
  const [resolutionFileError, setResolutionFileError] = useState('');
  const [modalError, setModalError] = useState('');

  // Table filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [viewScope, setViewScope] = useState<'department' | 'all'>('department');

  const activePool = viewScope === 'department' ? deptComplaints : complaints;

  const assignedCount = activePool.filter((c) => c.status === 'Assigned').length;
  const inProgressCount = activePool.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = activePool.filter((c) => c.status === 'Resolved').length;
  const rejectedCount = activePool.filter((c) => c.status === 'Rejected').length;

  const filteredComplaints = activePool.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.location.wardNumber &&
        String(c.location.wardNumber).toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || c.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const openStatusModal = (complaint: Complaint) => {
    setModalComplaint(complaint);
    setNewStatus(complaint.status === 'Assigned' ? 'In Progress' : 'Resolved');
    setRemarks('');
    setWorkDescription('');
    setMaterialsUsed('');
    setResolutionImages([]);
    setResolutionFileError('');
    setModalError('');
  };

  // Resolution photo native file upload handler with preview and 5MB validation
  const handleResolutionPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResolutionFileError('');
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      setResolutionFileError('Resolution image must be 5 MB or smaller.');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      setResolutionFileError('Only JPG, JPEG, and PNG images are accepted.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setResolutionImages((prev) => [...prev, event.target!.result as string]);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeResolutionPhoto = (index: number) => {
    setResolutionImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalComplaint || !currentUser) return;

    if (!remarks.trim()) {
      setModalError('Official inspection remarks are mandatory for municipal audit logging.');
      return;
    }

    if (newStatus === 'Resolved' && resolutionImages.length === 0) {
      setModalError('At least one resolution proof photo is required to mark a ticket as Resolved.');
      return;
    }

    storage.updateComplaintStatus(
      modalComplaint.id,
      newStatus,
      currentUser,
      remarks.trim(),
      resolutionImages,
      workDescription.trim() || undefined,
      materialsUsed.trim() || undefined
    );

    setModalComplaint(null);
    if (onCloseStatusModal) onCloseStatusModal();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Officer Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-semibold text-teal-300">
              <HardHat size={14} className="text-teal-400" />
              <span>GHMC Municipal Field Engineering Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {currentUser?.departmentName || 'Departmental Field Queue'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Officer: <strong className="text-white">{currentUser?.name}</strong> ·{' '}
              {currentUser?.designation || 'Field Inspector'}{' '}
              {currentUser?.wardName ? `· Assigned to ${currentUser.wardName}` : ''}{' '}
              {currentUser?.officerId ? `(${currentUser.officerId})` : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-xs text-right shrink-0">
              <span className="text-slate-400 block">Department Active Queue</span>
              <span className="text-2xl font-black text-teal-300 tabular-nums">
                {assignedCount + inProgressCount} Active
              </span>
            </div>
          </div>
        </div>

        {/* Workload Summary KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Assigned / Pending
              </span>
              <Clock size={16} className="text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-blue-600 mt-2 tabular-nums">
              {assignedCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Awaiting dispatch</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                In Progress
              </span>
              <PlayCircle size={16} className="text-indigo-600" />
            </div>
            <div className="text-3xl font-extrabold text-indigo-600 mt-2 tabular-nums">
              {inProgressCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Field repair active</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Resolved
              </span>
              <CheckCircle2 size={16} className="text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-600 mt-2 tabular-nums">
              {resolvedCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Evidence verified</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Rejected / Duplicate
              </span>
              <XCircle size={16} className="text-rose-500" />
            </div>
            <div className="text-3xl font-extrabold text-slate-700 mt-2 tabular-nums">
              {rejectedCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Documented reasons</p>
          </div>
        </div>

        {/* Complaints Management Table & Filters */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">
                  Grievance Dispatch Roster ({filteredComplaints.length})
                </h3>
                <span className="text-[10px] bg-teal-50 text-teal-700 font-extrabold px-2 py-0.5 rounded-full border border-teal-200">
                  Live Synchronized
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Review assigned issues, inspect photos, upload completion evidence, and update status
              </p>
            </div>

            {/* Scope switcher & Filter controls */}
            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setViewScope('department')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewScope === 'department'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  My Department ({deptComplaints.length})
                </button>
                <button
                  type="button"
                  onClick={() => setViewScope('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewScope === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All GHMC ({complaints.length})
                </button>
              </div>

              <div className="relative flex-1 sm:w-56">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ID, title, citizen, ward..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white"
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
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white"
              >
                <option value="all">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Complaint ID &amp; Date</th>
                  <th className="px-5 py-3">Title &amp; Category</th>
                  <th className="px-5 py-3">Location &amp; GHMC Ward</th>
                  <th className="px-5 py-3">Priority</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                      No complaints currently match this filter.
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((c) => (
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

                      <td className="px-5 py-4 max-w-xs">
                        <span className="text-slate-700 block truncate">{c.location.address}</span>
                        <span className="text-[10px] text-teal-700 font-semibold block">
                          {c.location.wardNumber || 'GHMC Ward'}
                        </span>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <PriorityBadge priority={c.priority} size="sm" />
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={c.status} size="sm" />
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-right space-x-2">
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
                          onClick={() => openStatusModal(c)}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs transition-colors"
                        >
                          Update Status
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

      {/* Status Update / Resolution Modal */}
      {modalComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-teal-300 font-bold uppercase">
                  GHMC Field Action Order · {modalComplaint.id}
                </span>
                <h3 className="font-bold text-base mt-0.5">Update Grievance Status &amp; Evidence</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalComplaint(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateStatus} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {modalError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
                  <AlertTriangle size={15} />
                  <span>{modalError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Transition Status To *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewStatus('In Progress')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      newStatus === 'In Progress'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStatus('Resolved')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      newStatus === 'Resolved'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Resolved
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStatus('Rejected')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      newStatus === 'Rejected'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Rejected
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Official Field Remarks *
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Field inspection completed. Repair crew dispatched to site with equipment..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Resolution fields if Resolved */}
              {newStatus === 'Resolved' && (
                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                    Resolution Certification Details
                  </span>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Work Carried Out Description
                    </label>
                    <input
                      type="text"
                      value={workDescription}
                      onChange={(e) => setWorkDescription(e.target.value)}
                      placeholder="e.g. Bitumen premix laying, road leveling, debris clearance."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Materials / Equipment Used
                    </label>
                    <input
                      type="text"
                      value={materialsUsed}
                      onChange={(e) => setMaterialsUsed(e.target.value)}
                      placeholder="e.g. 1.2 metric tons asphalt, vibrating plate compactor, 3 safety cones."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                    />
                  </div>

                  {/* Resolution Proof Photo Upload Control */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Resolution Evidence Photo * (Max 5MB)
                      </label>
                      <span className="text-[10px] text-slate-400">Proof of completed work</span>
                    </div>

                    {resolutionFileError && (
                      <p className="text-xs text-rose-600 font-medium mb-1.5">{resolutionFileError}</p>
                    )}

                    <div className="flex items-center gap-2 flex-wrap">
                      {resolutionImages.map((img, i) => (
                        <div
                          key={i}
                          className="w-20 h-16 rounded-xl overflow-hidden border border-emerald-300 relative group shadow-xs"
                        >
                          <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeResolutionPhoto(i)}
                            className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-80 hover:opacity-100 text-[10px]"
                            title="Remove Photo"
                          >
                            ×
                          </button>
                        </div>
                      ))}

                      {/* Native file upload button */}
                      <label className="border-2 border-dashed border-emerald-400 hover:bg-emerald-100/50 rounded-xl h-16 px-3 flex flex-col items-center justify-center cursor-pointer transition-colors text-emerald-800">
                        <Upload size={16} className="mb-0.5" />
                        <span className="text-[10px] font-bold">Upload Photo</span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          onChange={handleResolutionPhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Rejection justification if Rejected */}
              {newStatus === 'Rejected' && (
                <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 text-xs text-rose-800 space-y-1">
                  <span className="font-bold">Rejection Compliance Notice:</span>
                  <p>
                    Rejections must state whether the ticket is a duplicate, out of GHMC
                    jurisdiction, or already covered under an active state capital works tender.
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalComplaint(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                >
                  <Send size={13} />
                  <span>Confirm Status Update</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
