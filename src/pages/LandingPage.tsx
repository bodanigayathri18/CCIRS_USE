import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storage';
import {
  Camera,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  Car,
  Trash2,
  Droplets,
  Lightbulb,
  Waves,
  Trees,
  ShieldCheck,
  TrendingUp,
  Star,
  Users,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onTrackComplaint: (id: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onTrackComplaint }) => {
  const { currentUser } = useAuth();
  const [trackInput, setTrackInput] = useState('');
  const [trackError, setTrackError] = useState('');

  const analytics = storage.getAnalytics();

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackInput.trim()) {
      setTrackError('Please enter a Complaint ID (e.g. CCIRS-2026-8491)');
      return;
    }
    const found = storage.getComplaintById(trackInput.trim());
    if (found) {
      setTrackError('');
      onTrackComplaint(found.id);
    } else {
      setTrackError(`No complaint found with ID "${trackInput.trim()}". Try CCIRS-2026-8491 or CCIRS-2026-8488.`);
    }
  };

  const categories = [
    {
      id: 'cat-roads',
      title: 'Roads & Potholes',
      icon: Car,
      color: 'bg-blue-600',
      lightColor: 'bg-blue-50 text-blue-700 border-blue-200',
      sla: '48h SLA',
      desc: 'Cracked asphalt, deep craters, dangerous road cave-ins, and uneven dividers.',
    },
    {
      id: 'cat-sanitation',
      title: 'Garbage & Sanitation',
      icon: Trash2,
      color: 'bg-teal-600',
      lightColor: 'bg-teal-50 text-teal-700 border-teal-200',
      sla: '24h SLA',
      desc: 'Overflowing dumpsters, roadside debris, non-clearance of public dustbins, and stench.',
    },
    {
      id: 'cat-water',
      title: 'Water Works & Leaks',
      icon: Droplets,
      color: 'bg-sky-600',
      lightColor: 'bg-sky-50 text-sky-700 border-sky-200',
      sla: '36h SLA',
      desc: 'Main supply pipe fractures, contaminated tap water, zero pressure, and street flooding.',
    },
    {
      id: 'cat-lighting',
      title: 'Streetlights & Poles',
      icon: Lightbulb,
      color: 'bg-amber-600',
      lightColor: 'bg-amber-50 text-amber-700 border-amber-200',
      sla: '24h SLA',
      desc: 'Non-functioning sodium lamps, tilting utility poles, and hanging live wires.',
    },
    {
      id: 'cat-drainage',
      title: 'Drainage & Sewage',
      icon: Waves,
      color: 'bg-purple-600',
      lightColor: 'bg-purple-50 text-purple-700 border-purple-200',
      sla: '48h SLA',
      desc: 'Blocked monsoon storm drains, overflowing sewer covers, and stagnant dirty water.',
    },
    {
      id: 'cat-facilities',
      title: 'Parks & Infrastructure',
      icon: Trees,
      color: 'bg-emerald-600',
      lightColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      sla: '72h SLA',
      desc: 'Vandalized public garden benches, damaged play equipment, and broken footpaths.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none">
          <img
            src="/src/assets/images/civic_hero_cityscape_1792817454187.jpg"
            alt="Smart City Aerial View"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & Instant Tracker */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-teal-300 font-semibold tracking-wide">
                <ShieldCheck size={14} className="text-teal-400" />
                <span>Government Certified Civic Grievance Portal</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Report civic issues in seconds. <br />
                <span className="bg-gradient-to-r from-teal-400 via-blue-300 to-amber-300 bg-clip-text text-transparent">
                  Hold municipal teams accountable.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                Empowering citizens to report potholes, garbage overflows, water leaks, and dark
                streetlights with GPS photos. Automated departmental dispatch with full status
                transparency.
              </p>

              {/* Instant Complaint Tracker Form */}
              <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 shadow-xl max-w-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-300 mb-2 flex items-center gap-1.5">
                  <Search size={14} />
                  <span>Public Instant Complaint Tracker</span>
                </h3>
                <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={trackInput}
                    onChange={(e) => {
                      setTrackInput(e.target.value);
                      setTrackError('');
                    }}
                    placeholder="Enter Complaint ID (e.g. CCIRS-2026-8491)"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-inner"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span>Track Status</span>
                    <ArrowRight size={15} />
                  </button>
                </form>
                {trackError ? (
                  <p className="text-xs text-rose-300 font-medium mt-2">{trackError}</p>
                ) : (
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-300">
                    <span>Try demo IDs:</span>
                    <button
                      type="button"
                      onClick={() => onTrackComplaint('CCIRS-2026-8491')}
                      className="underline text-teal-300 hover:text-white"
                    >
                      CCIRS-2026-8491
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={() => onTrackComplaint('CCIRS-2026-8488')}
                      className="underline text-teal-300 hover:text-white"
                    >
                      CCIRS-2026-8488
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate(currentUser ? 'report' : 'login')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  <Camera size={18} />
                  <span>Report a Problem Now</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('map')}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition-all flex items-center gap-2 backdrop-blur-xs"
                >
                  <MapPin size={18} className="text-teal-400" />
                  <span>Explore City Issue Map</span>
                </button>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-slate-800">
                <img
                  src="/src/assets/images/civic_hero_cityscape_1792817454187.jpg"
                  alt="Modern Metropolitan Civic Management"
                  className="w-full h-64 sm:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 flex flex-col justify-end">
                  <div className="flex items-center gap-2 text-xs font-semibold text-teal-300 mb-1">
                    <CheckCircle2 size={15} />
                    <span>Live Resolution Feed</span>
                  </div>
                  <h4 className="text-white font-bold text-base leading-snug">
                    Ward 42 Sanitation Overhaul Completed
                  </h4>
                  <p className="text-slate-300 text-xs mt-1">
                    2.4 tons of commercial waste cleared in under 24 hours with hydraulic compactor.
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-white/10 text-slate-400">
                    <span>Officer: Smt. Sunita Verma</span>
                    <span className="text-emerald-400 font-semibold">Verified by Citizen ★★★★★</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-Time Civic Metrics Bar */}
      <section className="relative -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 p-6">
          <div className="p-4 text-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Grievances
            </span>
            <div className="text-3xl font-extrabold text-blue-600 mt-1 tabular-nums">
              {analytics.totalComplaints + 1240}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Recorded across 6 wards</p>
          </div>

          <div className="p-4 text-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Resolution Rate
            </span>
            <div className="text-3xl font-extrabold text-emerald-600 mt-1 tabular-nums">
              {analytics.resolutionRatePercent}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Within strict SLA threshold</p>
          </div>

          <div className="p-4 text-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Average Turnaround
            </span>
            <div className="text-3xl font-extrabold text-indigo-600 mt-1 tabular-nums">
              {analytics.averageResolutionHours}h
            </div>
            <p className="text-[11px] text-slate-500 mt-1">From report to field fix</p>
          </div>

          <div className="p-4 text-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Citizen Satisfaction
            </span>
            <div className="text-3xl font-extrabold text-amber-500 mt-1 flex items-center justify-center gap-1 tabular-nums">
              <span>{analytics.averageRating}</span>
              <Star size={20} fill="#f59e0b" className="text-amber-500" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Based on citizen post-repair feedback</p>
          </div>
        </div>
      </section>

      {/* Colorful Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Automated Departmental Routing
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            Civic Problem Categories &amp; SLAs
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Select a problem type below. The system automatically notifies the responsible
            municipal engineering division without bureaucratic delays.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => onNavigate(currentUser ? 'report' : 'login')}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${cat.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                    >
                      <Icon size={22} />
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${cat.lightColor}`}>
                      {cat.sla}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{cat.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>File this issue</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How CCIRS Works Workflow */}
      <section className="bg-slate-900 text-white py-20 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950 px-3 py-1 rounded-full border border-teal-800">
              End-to-End Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
              How CCIRS Solves Civic Complaints
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              From citizen capture to field resolution, tracked transparently on the public blockchain/audit ledger.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center mb-4">
                1
              </div>
              <h4 className="font-bold text-white text-sm">Citizen Photo &amp; GPS</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Take a photo and auto-pin GPS coordinates. Enter an optional landmark. No long paperwork.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-black text-sm flex items-center justify-center mb-4">
                2
              </div>
              <h4 className="font-bold text-white text-sm">Instant Auto-Assignment</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Rules engine assigns complaint to the designated department officer with SLA countdown timer.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center mb-4">
                3
              </div>
              <h4 className="font-bold text-white text-sm">Field Repair &amp; Evidence</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Municipal maintenance crew executes physical repair and uploads resolution proof photos to close ticket.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center mb-4">
                4
              </div>
              <h4 className="font-bold text-white text-sm">Citizen Rating &amp; Audit</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Citizen receives resolution notification, inspects the repair photos, and submits a 1-5 star quality score.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Evidence Showcase: Before vs After */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Real Proof of Resolution
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            Before &amp; After Field Verifications
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Every resolved complaint requires photographic evidence and work logs by the municipal
            inspection officer before sign-off.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Pothole Repair */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-semibold text-slate-500">CCIRS-2026-8491</span>
                <h4 className="font-bold text-slate-900 text-sm">Road Pothole Surface Leveling</h4>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                In Progress
              </span>
            </div>
            <div className="relative h-60">
              <img
                src="/src/assets/images/civic_issue_pothole_1792817454409.jpg"
                alt="Pothole Repair Work"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-3 left-3 bg-slate-950/80 text-white text-[11px] font-semibold px-2 py-1 rounded">
                Reported Site Photo · 5th Cross Junction
              </span>
            </div>
            <div className="p-4 bg-slate-50 text-xs text-slate-600">
              <p>
                <strong>Department:</strong> Roads &amp; Bridges · <strong>Crew:</strong> Asphalt
                Compactor Team #3
              </p>
            </div>
          </div>

          {/* Card 2: Garbage Dumpster */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-semibold text-slate-500">CCIRS-2026-8488</span>
                <h4 className="font-bold text-slate-900 text-sm">Commercial Dumpster Cleared</h4>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Resolved · 5/5 Stars
              </span>
            </div>
            <div className="relative h-60">
              <img
                src="/src/assets/images/civic_issue_garbage_1792817455474.jpg"
                alt="Overflowing Dumpster"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-3 left-3 bg-emerald-950/80 text-emerald-200 text-[11px] font-semibold px-2 py-1 rounded">
                Verified Cleared &amp; Pressure-Washed
              </span>
            </div>
            <div className="p-4 bg-slate-50 text-xs text-slate-600">
              <p>
                <strong>Citizen Review:</strong> &ldquo;Extremely quick resolution by the sanitation
                team! The sidewalk was thoroughly washed.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 rounded-3xl p-8 sm:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold">Ready to clean up your neighborhood?</h3>
            <p className="text-blue-100 text-sm">
              Join thousands of active citizens reporting civic problems daily. It takes less than 60 seconds.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('report')}
              className="px-6 py-3 bg-white text-blue-900 font-bold text-sm rounded-xl shadow-md hover:bg-blue-50 transition-colors"
            >
              Report an Issue
            </button>
            <button
              type="button"
              onClick={() => onNavigate('track')}
              className="px-6 py-3 bg-blue-800/80 hover:bg-blue-800 text-white font-semibold text-sm rounded-xl border border-white/20 transition-colors"
            >
              Track Complaint
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
