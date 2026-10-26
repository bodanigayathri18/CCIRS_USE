import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { Complaint } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { CivicMap } from '../components/common/CivicMap';
import {
  Search,
  MapPin,
  Calendar,
  Building2,
  UserCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Star,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface PublicTrackerPageProps {
  initialComplaintId?: string;
  onNavigate: (view: string) => void;
  onSelectComplaint?: (id: string) => void;
}

export const PublicTrackerPage: React.FC<PublicTrackerPageProps> = ({
  initialComplaintId,
  onNavigate,
  onSelectComplaint,
}) => {
  const [searchId, setSearchId] = useState(initialComplaintId || 'CCIRS-2026-8491');
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialComplaintId) {
      setSearchId(initialComplaintId);
      handleSearch(initialComplaintId);
    } else {
      handleSearch('CCIRS-2026-8491');
    }
  }, [initialComplaintId]);

  const handleSearch = (idToSearch?: string) => {
    const query = (idToSearch || searchId).trim();
    if (!query) {
      setErrorMessage('Please enter a Complaint ID');
      return;
    }
    const found = storage.getComplaintById(query);
    if (found) {
      setActiveComplaint(found);
      setErrorMessage('');
    } else {
      setActiveComplaint(null);
      setErrorMessage(`Complaint ID "${query}" not found in municipal records.`);
    }
  };

  const sampleIds = ['CCIRS-2026-8491', 'CCIRS-2026-8488', 'CCIRS-2026-8472', 'CCIRS-2026-8465'];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Page Header & Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              Public Grievance Transparency
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
              Track Civic Complaint Status
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Enter your complaint reference number to view real-time department updates, field
              photos, and inspection notes.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="mt-6 flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchId}
                onChange={(e) => {
                  setSearchId(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Enter Complaint ID (e.g. CCIRS-2026-8491)"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 shrink-0"
            >
              <span>Search Records</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Pill Selectors */}
          <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Sample Complaints:</span>
            {sampleIds.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setSearchId(id);
                  handleSearch(id);
                }}
                className={`font-mono text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  activeComplaint?.id === id
                    ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                {id}
              </button>
            ))}
          </div>

          {errorMessage && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Complaint Detail Card */}
        {activeComplaint && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Summary Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono font-bold text-slate-500 text-xs bg-slate-100 px-2 py-0.5 rounded">
                      {activeComplaint.id}
                    </span>
                    <StatusBadge status={activeComplaint.status} size="md" />
                    <PriorityBadge priority={activeComplaint.priority} size="sm" />
                    <span className="text-xs text-slate-500 font-medium">
                      Category: {activeComplaint.categoryName}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-2 leading-snug">
                    {activeComplaint.title}
                  </h2>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectComplaint) onSelectComplaint(activeComplaint.id);
                      onNavigate('complaint-detail');
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>Full Audit View</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="py-4">
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Issue Description</h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {activeComplaint.description}
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
                <div className="flex items-start gap-2.5">
                  <Building2 size={16} className="text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-500">Department</span>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {activeComplaint.departmentName}
                    </p>
                    {activeComplaint.assignedOfficerName && (
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Officer: {activeComplaint.assignedOfficerName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-teal-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-500">Location &amp; Ward</span>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {activeComplaint.location.address}
                    </p>
                    <p className="text-[11px] text-slate-600 font-mono mt-0.5">
                      GPS: {activeComplaint.location.latitude.toFixed(4)}°N,{' '}
                      {activeComplaint.location.longitude.toFixed(4)}°E
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Calendar size={16} className="text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-500">Submission Date</span>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {new Date(activeComplaint.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Citizen: {activeComplaint.citizenName}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Photos & Map Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Complaint Photo Evidence */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-1.5">
                  <FileText size={15} />
                  <span>Citizen Photographic Evidence</span>
                </h3>
                {activeComplaint.images.length > 0 ? (
                  <div className="space-y-3">
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 h-56 bg-slate-100">
                      <img
                        src={activeComplaint.images[0]}
                        alt={activeComplaint.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 left-2 bg-slate-950/80 text-white text-[11px] font-medium px-2 py-0.5 rounded">
                        GPS Verified Attachment
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-44 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400">
                    No images attached
                  </div>
                )}
              </div>

              {/* Map Preview */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
                <h3 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-1.5">
                  <MapPin size={15} />
                  <span>Geographic Location Verification</span>
                </h3>
                <CivicMap
                  complaints={[activeComplaint]}
                  selectedLocation={activeComplaint.location}
                  interactive={false}
                  height="h-56"
                />
              </div>
            </div>

            {/* Resolution Proof Card (if resolved) */}
            {activeComplaint.resolutionEvidence && (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-3">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <span>Municipal Officer Resolution Evidence</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-2 text-xs">
                    <p className="text-slate-800 leading-relaxed font-medium">
                      {activeComplaint.resolutionEvidence.workDescription}
                    </p>
                    {activeComplaint.resolutionEvidence.materialsUsed && (
                      <p className="text-slate-600">
                        <strong>Equipment / Materials:</strong>{' '}
                        {activeComplaint.resolutionEvidence.materialsUsed}
                      </p>
                    )}
                    <p className="text-slate-500 pt-2">
                      Signed off by{' '}
                      <strong>{activeComplaint.resolutionEvidence.resolvedByOfficerName}</strong> on{' '}
                      {new Date(
                        activeComplaint.resolutionEvidence.resolvedAt
                      ).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {activeComplaint.resolutionEvidence.evidenceImages.length > 0 && (
                    <div className="rounded-xl overflow-hidden border border-emerald-300 h-36">
                      <img
                        src={activeComplaint.resolutionEvidence.evidenceImages[0]}
                        alt="Resolution Evidence"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Citizen Feedback (if submitted) */}
            {activeComplaint.feedback && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase text-slate-500">Citizen Review</h3>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        fill={star <= activeComplaint.feedback!.rating ? '#f59e0b' : 'none'}
                        className={
                          star <= activeComplaint.feedback!.rating
                            ? 'text-amber-500'
                            : 'text-slate-300'
                        }
                      />
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-1">
                      {activeComplaint.feedback.rating}/5
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-700 italic">
                  &ldquo;{activeComplaint.feedback.comments}&rdquo;
                </p>
                <p className="text-[11px] text-slate-400 mt-2">
                  Submitted by {activeComplaint.feedback.citizenName}
                </p>
              </div>
            )}

            {/* Complete Status History Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase text-slate-500 mb-6 flex items-center gap-1.5">
                <Clock size={15} />
                <span>Lifecycle Progress Audit Timeline</span>
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {activeComplaint.statusHistory.map((step, idx) => (
                  <div key={step.id || idx} className="relative group">
                    {/* Circle Dot */}
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full border-2 border-white bg-blue-600 shadow-xs flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={step.status} size="sm" />
                          <span className="font-bold text-slate-900">{step.changedBy}</span>
                          <span className="text-[10px] uppercase font-semibold text-slate-500 bg-slate-200 px-1.5 py-0.2 rounded">
                            {step.changedByRole}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                          {new Date(step.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1 leading-relaxed">{step.remarks}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
