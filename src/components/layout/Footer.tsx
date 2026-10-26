import React from 'react';
import { ShieldCheck, Phone, Mail, MapPin, Database } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-extrabold flex items-center justify-center text-base">
                C
              </div>
              <span className="text-lg font-bold text-white tracking-tight">CCIRS Municipal</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Crowdsourced Civic Issue Reporting & Resolution System. Empowering citizens with GPS
              photo-reporting and automated municipal workflow routing.
            </p>
            <div className="pt-1 text-xs text-slate-500 font-mono">
              Academic Software Engineering Lab Project
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Civic Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('report')}
                  className="hover:text-white transition-colors"
                >
                  Report a Civic Problem
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('track')}
                  className="hover:text-white transition-colors"
                >
                  Track by Complaint ID
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('map')}
                  className="hover:text-white transition-colors"
                >
                  Interactive City Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin-database')}
                  className="hover:text-white transition-colors flex items-center gap-1 text-teal-400"
                >
                  <Database size={12} />
                  <span>MySQL Database DDL &amp; Seed</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Municipal Departments */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Departments &amp; SLAs
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex justify-between">
                <span>Roads &amp; Pavements</span>
                <span className="font-mono text-slate-500">48h SLA</span>
              </li>
              <li className="flex justify-between">
                <span>Sanitation &amp; Garbage</span>
                <span className="font-mono text-slate-500">24h SLA</span>
              </li>
              <li className="flex justify-between">
                <span>Water Supply Mains</span>
                <span className="font-mono text-slate-500">36h SLA</span>
              </li>
              <li className="flex justify-between">
                <span>Public Streetlights</span>
                <span className="font-mono text-slate-500">24h SLA</span>
              </li>
            </ul>
          </div>

          {/* Emergency & Municipal Support */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Municipal Helpdesk
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-teal-400 shrink-0" />
                <span>24/7 Helpline: 1800-425-CCIRS (Toll-free)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-blue-400 shrink-0" />
                <span>grievance@municipal.ccirs.gov</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-amber-400 shrink-0" />
                <span>City Municipal Corporation Headquarters</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 CCIRS Municipal Corporation. Developed for Software Engineering Lab Course.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-slate-400">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Role-Based Access Control</span>
            </span>
            <span className="font-mono">MySQL 8.0 Compatible</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
