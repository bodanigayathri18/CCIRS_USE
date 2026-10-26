import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { CivicMap } from '../../components/common/CivicMap';
import { Complaint, ComplaintStatus } from '../../types';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Star,
  User,
  ShieldCheck,
  FileText,
  AlertCircle,
  Share2,
  Sparkles,
  Send,
} from 'lucide-react';

interface ComplaintDetailPageProps {
  complaintId: string;
  onNavigate: (view: string) => void;
  onOpenOfficerStatusModal?: (complaint: Complaint) => void;
}

export const ComplaintDetailPage: React.FC<ComplaintDetailPageProps> = ({
  complaintId,
  onNavigate,
  onOpenOfficerStatusModal,
}) => {
  const { currentUser } = useAuth();
  const [complaint, setComplaint] = useState<Complaint | undefined>(() =>
    storage.getComplaintById(complaintId)
  );

  // Feedback form state
  const [rating, setRating] = useState(5);
  const [feedbackComments, setFeedbackComments] = useState('');
  const [isSatisfied, setIsSatisfied] = useState(true);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  if (!complaint) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full text-center space-y-4">
          <AlertCircle size={36} className="mx-auto text-rose-500" />
          <h3 className="font-bold text-slate-900 text-lg">Complaint Not Found</h3>
          <p className="text-xs text-slate-500">
            No record found for ID &ldquo;{complaintId}&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('track')}
            className="px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const isCitizenOwner = currentUser?.id === complaint.citizenId;
  const isOfficerOrAdmin = currentUser?.role === 'officer' || currentUser?.role === 'admin';

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!feedbackComments.trim()) {
      setFeedbackError('Please enter a brief written comment about the resolution.');
      return;
    }

    const fb = storage.submitFeedback(
      complaint.id,
      rating,
      feedbackComments.trim(),
      currentUser,
      isSatisfied
    );

    if (fb) {
      setFeedbackSuccess(true);
      setFeedbackError('');
      // Reload complaint state
      setComplaint(storage.getComplaintById(complaint.id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate(currentUser ? `${currentUser.role}-dash` : 'track')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>

          {isOfficerOrAdmin && onOpenOfficerStatusModal && (
            <button
              type="button"
              onClick={() => onOpenOfficerStatusModal(complaint)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Update Status / Upload Evidence
            </button>
          )}
        </div>

        {/* Primary Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono font-bold text-slate-600 text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {complaint.id}
                </span>
                <StatusBadge status={complaint.status} size="md" />
                <PriorityBadge priority={complaint.priority} size="sm" />
                <span className="text-xs text-slate-500 font-medium">
                  {complaint.categoryName}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2 leading-snug">
                {complaint.title}
              </h1>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-slate-500 tabular-nums">
                Filed on{' '}
                {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="py-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Citizen Description
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-100">
              {complaint.description}
            </p>
          </div>

          {/* Key Responsible Entities */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div className="flex items-start gap-2.5">
              <Building2 size={16} className="text-blue-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-slate-500">Department Assigned</span>
                <p className="font-bold text-slate-900 mt-0.5">{complaint.departmentName}</p>
                {complaint.assignedOfficerName && (
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Lead: {complaint.assignedOfficerName}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <User size={16} className="text-teal-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-slate-500">Reporting Citizen</span>
                <p className="font-bold text-slate-900 mt-0.5">{complaint.citizenName}</p>
                <p className="text-[11px] text-slate-600 mt-0.5">{complaint.citizenPhone}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin size={16} className="text-amber-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-slate-500">Ward &amp; Landmark</span>
                <p className="font-bold text-slate-900 mt-0.5">
                  {complaint.location.wardNumber || 'Metropolitan Ward'}
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {complaint.location.landmark || 'GPS Pinned Location'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Photographic Evidence and Geolocation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Photo Gallery */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <FileText size={15} />
              <span>Citizen Submitted Images ({complaint.images.length})</span>
            </h3>

            {complaint.images.length > 0 ? (
              <div className="space-y-2">
                <div className="rounded-xl overflow-hidden border border-slate-200 h-64 bg-slate-100">
                  <img
                    src={complaint.images[0]}
                    alt={complaint.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {complaint.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {complaint.images.slice(1).map((img, i) => (
                      <div key={i} className="h-20 rounded-lg overflow-hidden border border-slate-200">
                        <img src={img} alt="Additional" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-44 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400">
                No images attached
              </div>
            )}
          </div>

          {/* Location & Map */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <MapPin size={15} />
                <span>GPS Location Coordinates</span>
              </h3>
              <p className="text-xs font-semibold text-slate-800 mb-2">
                {complaint.location.address}
              </p>
              <div className="text-[11px] font-mono text-slate-500 flex items-center gap-3 mb-3">
                <span>Lat: {complaint.location.latitude.toFixed(5)}° N</span>
                <span>Lng: {complaint.location.longitude.toFixed(5)}° E</span>
              </div>
            </div>

            <CivicMap
              complaints={[complaint]}
              selectedLocation={complaint.location}
              interactive={false}
              height="h-56"
            />
          </div>
        </div>

        {/* Resolution Evidence Card (When Resolved) */}
        {complaint.resolutionEvidence && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-200/60 mb-4">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span>Municipal Resolution Evidence &amp; Verification</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800">
                Closed {new Date(complaint.resolutionEvidence.resolvedAt).toLocaleDateString()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-800">Field Work Summary:</span>
                  <p className="text-slate-700 leading-relaxed mt-1">
                    {complaint.resolutionEvidence.workDescription}
                  </p>
                </div>

                {complaint.resolutionEvidence.materialsUsed && (
                  <p className="text-slate-600 pt-1">
                    <strong>Materials / Equipment Deployed:</strong>{' '}
                    {complaint.resolutionEvidence.materialsUsed}
                  </p>
                )}

                <p className="text-slate-500 pt-2">
                  Certified by Inspection Officer:{' '}
                  <strong>{complaint.resolutionEvidence.resolvedByOfficerName}</strong>
                </p>
              </div>

              {complaint.resolutionEvidence.evidenceImages.length > 0 && (
                <div className="rounded-xl overflow-hidden border border-emerald-300 h-40 bg-white">
                  <img
                    src={complaint.resolutionEvidence.evidenceImages[0]}
                    alt="Resolution Proof"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Citizen Feedback Form / Review Card */}
        {complaint.status === 'Resolved' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            {complaint.feedback ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                      Citizen Satisfaction Score
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      Verified Citizen Feedback
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={18}
                        fill={s <= complaint.feedback!.rating ? '#f59e0b' : 'none'}
                        className={
                          s <= complaint.feedback!.rating ? 'text-amber-500' : 'text-slate-300'
                        }
                      />
                    ))}
                    <span className="text-sm font-bold text-slate-800 ml-1">
                      {complaint.feedback.rating}/5
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 italic bg-amber-50/50 p-3.5 rounded-xl border border-amber-100">
                  &ldquo;{complaint.feedback.comments}&rdquo;
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Rated by {complaint.feedback.citizenName}</span>
                  <span>{new Date(complaint.feedback.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ) : isCitizenOwner ? (
              /* Citizen Rating Form */
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-500" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Rate the Resolution Quality
                    </h3>
                    <p className="text-xs text-slate-500">
                      Your feedback directly impacts municipal department performance metrics.
                    </p>
                  </div>
                </div>

                {feedbackError && (
                  <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                    {feedbackError}
                  </p>
                )}

                {/* Star rating selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Service Rating (1 to 5 Stars)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          size={24}
                          fill={star <= rating ? '#f59e0b' : 'none'}
                          className={star <= rating ? 'text-amber-500' : 'text-slate-300'}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">
                      {rating === 5
                        ? 'Excellent (5/5)'
                        : rating === 4
                        ? 'Good (4/5)'
                        : rating === 3
                        ? 'Acceptable (3/5)'
                        : rating === 2
                        ? 'Poor (2/5)'
                        : 'Very Poor (1/5)'}
                    </span>
                  </div>
                </div>

                {/* Satisfaction toggle */}
                <div className="flex items-center gap-4 text-xs font-medium text-slate-700">
                  <span>Did this fix solve the problem?</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="satisfied"
                      checked={isSatisfied}
                      onChange={() => setIsSatisfied(true)}
                    />
                    <span>Yes, fully resolved</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="satisfied"
                      checked={!isSatisfied}
                      onChange={() => setIsSatisfied(false)}
                    />
                    <span>No, incomplete</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Written Feedback / Comments
                  </label>
                  <textarea
                    rows={2}
                    value={feedbackComments}
                    onChange={(e) => setFeedbackComments(e.target.value)}
                    placeholder="e.g. Prompt cleaning of the site and polite crew, well done!"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Send size={13} />
                  <span>Submit Citizen Rating</span>
                </button>
              </form>
            ) : (
              <div className="text-xs text-slate-500 italic">
                Citizen feedback has not yet been submitted for this resolved ticket.
              </div>
            )}
          </div>
        )}

        {/* Status Lifecycle Audit History */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6 flex items-center gap-1.5">
            <Clock size={15} />
            <span>Complete Audit &amp; Status Timeline ({complaint.statusHistory.length} events)</span>
          </h3>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {complaint.statusHistory.map((step, idx) => (
              <div key={step.id || idx} className="relative">
                {/* Node marker */}
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full border-2 border-white bg-blue-600 shadow-xs flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={step.status} size="sm" />
                      <span className="font-bold text-slate-900">{step.changedBy}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-200 px-1.5 py-0.2 rounded">
                        {step.changedByRole}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                      {new Date(step.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-slate-600 leading-relaxed">{step.remarks}</p>

                  {step.evidenceImages && step.evidenceImages.length > 0 && (
                    <div className="mt-2 flex gap-2">
                      {step.evidenceImages.map((img, i) => (
                        <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                          <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
