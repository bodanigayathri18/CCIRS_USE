import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  MapPin,
  Star,
  FileText,
  Calendar,
  Sparkles,
  PhoneCall,
} from 'lucide-react';

interface CitizenDashboardProps {
  onNavigate: (view: string) => void;
  onSelectComplaint: (id: string) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  onNavigate,
  onSelectComplaint,
}) => {
  const { currentUser } = useAuth();
  const allComplaints = storage.getComplaints();

  // Filter complaints for current citizen
  const myComplaints = allComplaints.filter((c) => c.citizenId === currentUser?.id);

  const pendingCount = myComplaints.filter(
    (c) => c.status === 'Submitted' || c.status === 'Assigned' || c.status === 'In Progress'
  ).length;
  const resolvedCount = myComplaints.filter((c) => c.status === 'Resolved').length;
  const feedbackPending = myComplaints.filter((c) => c.status === 'Resolved' && !c.feedback);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold">
              <Sparkles size={13} className="text-teal-300" />
              <span>Citizen Civic Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Track the civic complaints you have filed in your ward, view municipal team work
              updates, and rate completed resolutions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('report')}
            className="px-6 py-3 bg-white text-blue-900 font-bold text-sm rounded-xl shadow-lg hover:bg-blue-50 transition-all flex items-center gap-2 shrink-0 group"
          >
            <PlusCircle size={18} className="text-blue-600 group-hover:scale-110 transition-transform" />
            <span>Report New Civic Issue</span>
          </button>
        </div>

        {/* Feedback Alert Callout (If any resolved complaint is waiting for citizen review) */}
        {feedbackPending.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 font-bold">
                ★
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Resolution Feedback Requested ({feedbackPending.length})
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Complaint #{feedbackPending[0].id} ({feedbackPending[0].categoryName}) was resolved
                  by {feedbackPending[0].departmentName}. Please rate their work quality.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onSelectComplaint(feedbackPending[0].id);
                onNavigate('complaint-detail');
              }}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>Submit Rating</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                My Total Filed
              </span>
              <FileText size={16} className="text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-2 tabular-nums">
              {myComplaints.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Recorded in system</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Active / In Progress
              </span>
              <Clock size={16} className="text-indigo-600" />
            </div>
            <div className="text-3xl font-extrabold text-indigo-600 mt-2 tabular-nums">
              {pendingCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Being worked on by crews</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Resolved Issues
              </span>
              <CheckCircle2 size={16} className="text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-600 mt-2 tabular-nums">
              {resolvedCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Repairs completed</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Resolution Rate
              </span>
              <Star size={16} className="text-amber-500" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-2 tabular-nums">
              {myComplaints.length > 0
                ? Math.round((resolvedCount / myComplaints.length) * 100)
                : 100}
              %
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Your closed grievance ratio</p>
          </div>
        </div>

        {/* Recent Complaints Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">My Recent Grievances</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time lifecycle and departmental responsibility
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('my-complaints')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {myComplaints.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <FileText size={36} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-700">No civic complaints filed yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Notice a pothole, broken streetlight, or garbage pile? Report it now.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('report')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
                >
                  Report First Issue
                </button>
              </div>
            ) : (
              myComplaints.slice(0, 5).map((complaint) => (
                <div
                  key={complaint.id}
                  onClick={() => {
                    onSelectComplaint(complaint.id);
                    onNavigate('complaint-detail');
                  }}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      {complaint.images.length > 0 ? (
                        <img
                          src={complaint.images[0]}
                          alt={complaint.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                          No Pic
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-500">
                          {complaint.id}
                        </span>
                        <StatusBadge status={complaint.status} size="sm" />
                        <PriorityBadge priority={complaint.priority} size="sm" />
                        <span className="text-xs text-slate-500">· {complaint.categoryName}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {complaint.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-slate-400" />
                          <span className="truncate max-w-xs">{complaint.location.address}</span>
                        </span>
                        <span>·</span>
                        <span className="text-slate-600 font-medium">
                          {complaint.departmentName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span className="text-xs text-slate-400 tabular-nums">
                      {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <div className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Citizen Help & Ward Directory Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <PhoneCall size={22} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Emergency Civic Hotline</h4>
              <p className="text-xs text-slate-500">Toll-free 24/7 dispatch</p>
              <p className="text-xs font-mono font-bold text-blue-600 mt-1">1800-425-2247</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Citizen Service Guarantee</h4>
              <p className="text-xs text-slate-500">Mandated SLA compliance</p>
              <p className="text-xs font-bold text-teal-700 mt-1">24h - 48h Resolution</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <Star size={22} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Public Audit Rating</h4>
              <p className="text-xs text-slate-500">Citizen verified repairs</p>
              <p className="text-xs font-bold text-purple-700 mt-1">98.4% Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
