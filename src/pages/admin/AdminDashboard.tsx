import React from 'react';
import { storage } from '../../services/storage';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import {
  ShieldCheck,
  TrendingUp,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Star,
  FileText,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (view: string) => void;
  onSelectComplaint: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  onSelectComplaint,
}) => {
  const analytics = storage.getAnalytics();
  const complaints = storage.getComplaints();
  const departments = storage.getDepartments();
  const users = storage.getUsers();

  const citizenCount = users.filter((u) => u.role === 'citizen').length;
  const officerCount = users.filter((u) => u.role === 'officer').length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-300">
              <ShieldCheck size={14} className="text-teal-400" />
              <span>Municipal Directorate &amp; Executive Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              CCIRS Central Control Console
            </h1>
            <p className="text-xs sm:text-sm text-purple-200 max-w-xl">
              System-wide oversight across {departments.length} municipal engineering divisions,{' '}
              {citizenCount + 1200} citizens, and automated grievance routing workflows.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => onNavigate('admin-complaints')}
              className="px-4 py-2.5 bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Manage All Grievances</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Executive Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Complaints
              </span>
              <FileText size={16} className="text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-blue-600 mt-2 tabular-nums">
              {analytics.totalComplaints}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Across all city wards</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Resolution Rate
              </span>
              <CheckCircle2 size={16} className="text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-600 mt-2 tabular-nums">
              {analytics.resolutionRatePercent}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Target SLA adherence</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Average Turnaround
              </span>
              <Clock size={16} className="text-indigo-600" />
            </div>
            <div className="text-3xl font-extrabold text-indigo-600 mt-2 tabular-nums">
              {analytics.averageResolutionHours}h
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Mean repair elapsed time</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Public Rating
              </span>
              <Star size={16} className="text-amber-500" />
            </div>
            <div className="text-3xl font-extrabold text-amber-500 mt-2 flex items-center gap-1 tabular-nums">
              <span>{analytics.averageRating}</span>
              <Star size={20} fill="#f59e0b" className="text-amber-500" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              From {analytics.totalFeedbackCount || 1} verified citizen reviews
            </p>
          </div>
        </div>

        {/* Visual Charts & Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Status Breakdown Horizontal Ring/Bars */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Complaint Status Pipeline</h3>
                <p className="text-xs text-slate-500">Live system workflow progression</p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">
                {analytics.totalComplaints} Tickets
              </span>
            </div>

            {/* Visual Multi-segment Bar */}
            <div className="h-4 rounded-full overflow-hidden flex bg-slate-100 shadow-inner">
              <div
                style={{
                  width: `${(analytics.submitted / (analytics.totalComplaints || 1)) * 100}%`,
                }}
                className="bg-amber-500"
                title={`Submitted: ${analytics.submitted}`}
              />
              <div
                style={{
                  width: `${(analytics.assigned / (analytics.totalComplaints || 1)) * 100}%`,
                }}
                className="bg-blue-500"
                title={`Assigned: ${analytics.assigned}`}
              />
              <div
                style={{
                  width: `${(analytics.inProgress / (analytics.totalComplaints || 1)) * 100}%`,
                }}
                className="bg-indigo-500"
                title={`In Progress: ${analytics.inProgress}`}
              />
              <div
                style={{
                  width: `${(analytics.resolved / (analytics.totalComplaints || 1)) * 100}%`,
                }}
                className="bg-emerald-500"
                title={`Resolved: ${analytics.resolved}`}
              />
              <div
                style={{
                  width: `${(analytics.rejected / (analytics.totalComplaints || 1)) * 100}%`,
                }}
                className="bg-rose-500"
                title={`Rejected: ${analytics.rejected}`}
              />
            </div>

            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-600 font-medium">Submitted (New Citizen Intake)</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{analytics.submitted}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-slate-600 font-medium">Assigned to Department</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{analytics.assigned}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className="text-slate-600 font-medium">In Progress (Field Crew Dispatched)</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{analytics.inProgress}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 font-medium">Resolved (Evidence Verified)</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{analytics.resolved}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-slate-600 font-medium">Rejected (Documented Justification)</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{analytics.rejected}</span>
              </div>
            </div>
          </div>

          {/* Department-wise Performance Bar Chart */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Department Workload &amp; Resolution Rate
                </h3>
                <p className="text-xs text-slate-500">Live performance across municipal boards</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('admin-departments')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                Manage Depts →
              </button>
            </div>

            <div className="space-y-3 pt-1">
              {analytics.byDepartment.map((dept, idx) => {
                const percent = dept.total > 0 ? Math.round((dept.resolved / dept.total) * 100) : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 truncate max-w-xs">
                        {dept.name}
                      </span>
                      <span className="text-slate-500 font-mono">
                        {dept.resolved}/{dept.total} resolved ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-teal-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(5, percent)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category Breakdown & Monthly Trends */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Complaints by Category</h3>
            <div className="space-y-2.5">
              {analytics.byCategory.map((cat, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-md shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="font-semibold text-slate-700">{cat.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {cat.count} issues
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trajectory */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Monthly Civic Grievance Volume</h3>
            <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
              {analytics.monthlyTrend.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1 h-32">
                    <div
                      className="w-3.5 bg-blue-500 rounded-t transition-all"
                      style={{ height: `${(item.submitted / 130) * 100}%` }}
                      title={`Submitted: ${item.submitted}`}
                    />
                    <div
                      className="w-3.5 bg-emerald-500 rounded-t transition-all"
                      style={{ height: `${(item.resolved / 130) * 100}%` }}
                      title={`Resolved: ${item.resolved}`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono truncate">
                    {item.month.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-blue-500" />
                Submitted
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                Resolved
              </span>
            </div>
          </div>
        </div>

        {/* Global Recent Complaints Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Latest Municipal Action Feed</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Most recent grievances logged into the central civic registry
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('admin-complaints')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>View All Complaints</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">ID &amp; Date</th>
                  <th className="px-5 py-3">Title &amp; Category</th>
                  <th className="px-5 py-3">Department</th>
                  <th className="px-5 py-3">Priority</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.slice(0, 5).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-900 block">{c.id}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 max-w-xs">
                      <span className="font-bold text-slate-900 block truncate">{c.title}</span>
                      <span className="text-[11px] text-slate-500">{c.categoryName}</span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="font-medium text-slate-700 block">{c.departmentName}</span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <PriorityBadge priority={c.priority} size="sm" />
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectComplaint(c.id);
                          onNavigate('complaint-detail');
                        }}
                        className="px-2.5 py-1 text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
