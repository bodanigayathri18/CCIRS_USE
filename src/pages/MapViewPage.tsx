import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { CivicMap } from '../components/common/CivicMap';
import { Complaint } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { GHMC_WARDS, GHMC_ZONES } from '../data/ghmcWards';
import {
  MapPin,
  Filter,
  ArrowRight,
  Eye,
  CheckCircle2,
  Clock,
  Layers,
  Search,
  Building2,
  Compass,
} from 'lucide-react';

interface MapViewPageProps {
  onNavigate: (view: string) => void;
  onSelectComplaint: (id: string) => void;
}

export const MapViewPage: React.FC<MapViewPageProps> = ({ onNavigate, onSelectComplaint }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(() => storage.getComplaints());
  const categories = storage.getCategories();
  const departments = storage.getDepartments();

  // Subscribe to storage changes so map reflects real-time updates
  useEffect(() => {
    const unsubscribe = storage.subscribe(() => {
      setComplaints(storage.getComplaints());
    });
    return unsubscribe;
  }, []);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    complaints[0] || null
  );
  const [photoTab, setPhotoTab] = useState<'citizen' | 'resolution'>('citizen');

  // Sync photoTab when selected complaint changes
  useEffect(() => {
    if (selectedComplaint?.status === 'Resolved' && selectedComplaint?.resolutionEvidence?.evidenceImages?.length) {
      // Keep citizen photo as initial default or allow toggling
    }
  }, [selectedComplaint]);

  const filtered = complaints.filter((c) => {
    const matchesCat = selectedCategory === 'all' || c.categoryId === selectedCategory;
    const matchesStat = selectedStatus === 'all' || c.status === selectedStatus;
    const matchesDept = selectedDepartment === 'all' || c.departmentId === selectedDepartment;
    const matchesZone =
      selectedZone === 'all' ||
      (c.location.wardNumber && String(c.location.wardNumber).includes(selectedZone));

    const matchesSearch =
      !searchQuery.trim() ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.location.wardNumber && String(c.location.wardNumber).toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesStat && matchesDept && matchesZone && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                GHMC Spatial GIS Portal
              </span>
              <span className="text-xs text-slate-400">· Greater Hyderabad Municipal Corporation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              City Civic Grievance Map Explorer
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Spatial distribution of civic issues across all 150 GHMC wards and 6 administrative zones
              (Charminar, Khairatabad, Secunderabad, Serilingampally, Kukatpally, LB Nagar).
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('report')}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 self-start md:self-center shrink-0"
          >
            <MapPin size={15} />
            <span>Report Issue Here</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, address, or ward..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* GHMC Zone Filter */}
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">All 6 GHMC Zones</option>
            {GHMC_ZONES.map((zone) => (
              <option key={zone} value={zone}>
                {zone} Zone
              </option>
            ))}
          </select>

          {/* Department Filter */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Map and Detail Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Google Map */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Compass size={15} className="text-blue-600" />
                <span>Showing {filtered.length} Grievance Pins on Hyderabad Map</span>
              </span>
              <span className="text-slate-500 font-mono text-[11px]">
                Coordinates: 17.3850° N, 78.4867° E
              </span>
            </div>

            <CivicMap
              complaints={filtered}
              highlightComplaintId={selectedComplaint?.id}
              onComplaintSelect={(c) => setSelectedComplaint(c)}
              interactive={true}
              height="h-[560px]"
            />
          </div>

          {/* Right: Selected Pin Inspector Card */}
          <div className="lg:col-span-4 space-y-4">
            {selectedComplaint ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                    {selectedComplaint.id}
                  </span>
                  <StatusBadge status={selectedComplaint.status} size="sm" />
                </div>

                {/* Evidence Photo Viewer with Tabs */}
                <div className="space-y-2">
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setPhotoTab('citizen')}
                      className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
                        photoTab === 'citizen'
                          ? 'bg-white text-blue-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>📸 Submitted Issue</span>
                      {selectedComplaint.images && selectedComplaint.images.length > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotoTab('resolution')}
                      className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
                        photoTab === 'resolution'
                          ? 'bg-white text-emerald-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>✓ Resolution Proof</span>
                      {selectedComplaint.resolutionEvidence?.evidenceImages?.length ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      ) : null}
                    </button>
                  </div>

                  {/* Photo Display Window */}
                  <div className="rounded-2xl overflow-hidden border border-slate-200 h-48 bg-slate-100 relative shadow-inner">
                    {photoTab === 'citizen' ? (
                      selectedComplaint.images && selectedComplaint.images.length > 0 ? (
                        <div className="relative w-full h-full group">
                          <img
                            src={selectedComplaint.images[0]}
                            alt={`Citizen photo for ${selectedComplaint.title}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-2.5 text-white">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 block">
                              Submitted Issue Photo
                            </span>
                            <span className="text-[11px] truncate block text-slate-200">
                              Reported by {selectedComplaint.citizenName}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-50 text-slate-400">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center mb-2 text-slate-500">
                            📷
                          </div>
                          <span className="text-xs font-semibold text-slate-600">
                            No issue photo available
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            Reported without photographic attachment
                          </span>
                        </div>
                      )
                    ) : (
                      selectedComplaint.resolutionEvidence?.evidenceImages &&
                      selectedComplaint.resolutionEvidence.evidenceImages.length > 0 ? (
                        <div className="relative w-full h-full group">
                          <img
                            src={selectedComplaint.resolutionEvidence.evidenceImages[0]}
                            alt={`Resolution evidence for ${selectedComplaint.title}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-2.5 text-white">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                              Verified Resolution Proof
                            </span>
                            <span className="text-[11px] truncate block text-slate-200">
                              Verified by {selectedComplaint.resolutionEvidence.resolvedByOfficerName || selectedComplaint.assignedOfficerName || 'GHMC Officer'}
                            </span>
                          </div>
                        </div>
                      ) : selectedComplaint.status === 'Resolved' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-emerald-50/50 text-emerald-800">
                          <CheckCircle2 size={24} className="text-emerald-600 mb-1.5" />
                          <span className="text-xs font-bold text-emerald-800">
                            Resolved by GHMC Team
                          </span>
                          <span className="text-[10px] text-emerald-700/80 mt-0.5">
                            No photo attached · Marked resolved in system
                          </span>
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-50 text-slate-400">
                          <Clock size={24} className="text-amber-500 mb-1.5 animate-pulse" />
                          <span className="text-xs font-semibold text-slate-700">
                            No resolution photo available
                          </span>
                          <span className="text-[10px] text-slate-500 mt-0.5">
                            Resolution in progress (Status: {selectedComplaint.status})
                          </span>
                        </div>
                      )
                    )}

                    <div className="absolute top-2 left-2 z-10">
                      <PriorityBadge priority={selectedComplaint.priority} size="sm" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    {selectedComplaint.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">
                    {selectedComplaint.description}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-900 block">
                        {selectedComplaint.location.address}
                      </span>
                      <span className="text-[11px] text-teal-700 font-semibold block mt-0.5">
                        {selectedComplaint.location.wardNumber || 'GHMC Ward'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                        Lat: {selectedComplaint.location.latitude.toFixed(5)}° N, Lng:{' '}
                        {selectedComplaint.location.longitude.toFixed(5)}° E
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 pt-1.5">
                    <span>Department:</span>
                    <span className="font-semibold text-slate-900">
                      {selectedComplaint.departmentName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Reported By:</span>
                    <span className="font-semibold text-slate-900">
                      {selectedComplaint.citizenName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Assigned Officer:</span>
                    <span className="font-semibold text-slate-900">
                      {selectedComplaint.assignedOfficerName || 'GHMC Division Team'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectComplaint(selectedComplaint.id);
                    onNavigate('complaint-detail');
                  }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Open Full Grievance Audit</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-400 shadow-xs">
                <MapPin size={32} className="mx-auto mb-2 text-slate-300" />
                <p className="text-xs">Click any map pin on the left to inspect issue details.</p>
              </div>
            )}

            {/* GHMC Fast Resolution Info Box */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 shadow-md text-xs space-y-2 border border-blue-900/40">
              <span className="text-teal-400 font-bold uppercase tracking-wider block text-[11px]">
                GHMC Ward Governance SLA
              </span>
              <p className="text-slate-300 leading-relaxed text-xs">
                Ward officers are dispatched based on proximity and SLA priority. Emergency road damage
                and water supply complaints receive guaranteed 24-hour on-site inspection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
