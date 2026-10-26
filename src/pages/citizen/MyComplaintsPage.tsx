import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { ComplaintStatus } from '../../types';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Building2,
  ArrowRight,
  PlusCircle,
  Clock,
  Star,
  FileText,
  RotateCcw,
} from 'lucide-react';

interface MyComplaintsPageProps {
  onNavigate: (view: string) => void;
  onSelectComplaint: (id: string) => void;
}

export const MyComplaintsPage: React.FC<MyComplaintsPageProps> = ({
  onNavigate,
  onSelectComplaint,
}) => {
  const { currentUser } = useAuth();
  const allComplaints = storage.getComplaints();
  const categories = storage.getCategories();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter for current user
  const userComplaints = allComplaints.filter((c) => c.citizenId === currentUser?.id);

  // Filter query
  const filtered = userComplaints.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.departmentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
    const matchesCat = selectedCategory === 'all' || c.categoryId === selectedCategory;

    return matchesSearch && matchesStatus && matchesCat;
  });

  const statuses: { label: string; value: string }[] = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Submitted', value: 'Submitted' },
    { label: 'Assigned', value: 'Assigned' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Resolved', value: 'Resolved' },
    { label: 'Rejected', value: 'Rejected' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              Citizen Grievance Records
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
              My Civic Complaints ({userComplaints.length})
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Track the progress, assigned municipal crew, and resolution proofs for all your reported issues.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('report')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2 shrink-0 self-start sm:self-center"
          >
            <PlusCircle size={15} />
            <span>Report New Issue</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID (e.g. CCIRS-2026-8491), keyword, or location..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Select */}
          <div className="w-full md:w-44">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Select */}
          <div className="w-full md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {(searchQuery || selectedStatus !== 'all' || selectedCategory !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('all');
                setSelectedCategory('all');
              }}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1 shrink-0"
              title="Clear Filters"
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>

        {/* Complaints List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 shadow-xs">
              <FileText size={40} className="mx-auto text-slate-300 mb-3" />
              <h3 className="font-bold text-slate-800 text-base">No complaints match your criteria</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Try loosening your search keywords or switching status filters to view all issues.
              </p>
            </div>
          ) : (
            filtered.map((complaint) => (
              <div
                key={complaint.id}
                onClick={() => {
                  onSelectComplaint(complaint.id);
                  onNavigate('complaint-detail');
                }}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4">
                  {/* Photo thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                    {complaint.images.length > 0 ? (
                      <img
                        src={complaint.images[0]}
                        alt={complaint.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                        No image
                      </div>
                    )}
                    {complaint.images.length > 1 && (
                      <span className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[9px] font-bold px-1 rounded">
                        +{complaint.images.length - 1}
                      </span>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {complaint.id}
                      </span>
                      <StatusBadge status={complaint.status} size="sm" />
                      <PriorityBadge priority={complaint.priority} size="sm" />
                      <span className="text-xs font-semibold text-slate-600">
                        {complaint.categoryName}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                      {complaint.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-slate-400" />
                        <span>{complaint.location.address}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Building2 size={12} className="text-slate-400" />
                        <span>{complaint.departmentName}</span>
                      </span>
                    </div>

                    {/* Feedback Rating indicator if rated */}
                    {complaint.feedback && (
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 pt-0.5">
                        <Star size={12} fill="#d97706" />
                        <span>
                          You rated this resolution: {complaint.feedback.rating}/5 stars
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action Island */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 text-xs">
                  <span className="text-slate-400 tabular-nums">
                    {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <div className="mt-1 flex items-center gap-1 font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                    <span>View Details</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
