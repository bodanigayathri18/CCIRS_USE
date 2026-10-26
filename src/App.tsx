import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { PublicTrackerPage } from './pages/PublicTrackerPage';
import { SignInPage } from './pages/SignInPage';
import { RegisterPage } from './pages/RegisterPage';
import { MapViewPage } from './pages/MapViewPage';

import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { ReportIssuePage } from './pages/citizen/ReportIssuePage';
import { MyComplaintsPage } from './pages/citizen/MyComplaintsPage';
import { ComplaintDetailPage } from './pages/citizen/ComplaintDetailPage';
import { ProfilePage } from './pages/citizen/ProfilePage';

import { OfficerDashboard } from './pages/officer/OfficerDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminComplaintsPage } from './pages/admin/AdminComplaintsPage';
import { AdminDepartmentsPage } from './pages/admin/AdminDepartmentsPage';
import { AdminOfficersPage } from './pages/admin/AdminOfficersPage';
import { AdminDatabasePage } from './pages/admin/AdminDatabasePage';

import { Complaint } from './types';

const MainContent: React.FC = () => {
  const { currentUser } = useAuth();
  const [currentView, setCurrentView] = useState<string>('landing');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>('CCIRS-2026-8491');
  const [activeOfficerModalComplaint, setActiveOfficerModalComplaint] = useState<Complaint | null>(
    null
  );
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  // Listen for Google Maps Platform quota defense event
  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectComplaint = (id: string) => {
    setSelectedComplaintId(id);
    handleNavigate('complaint-detail');
  };

  const handleTrackComplaint = (id: string) => {
    setSelectedComplaintId(id);
    handleNavigate('track');
  };

  const handleOpenOfficerStatusModal = (complaint: Complaint) => {
    setActiveOfficerModalComplaint(complaint);
    handleNavigate('officer-dash');
  };

  // Determine current component to render
  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingPage onNavigate={handleNavigate} onTrackComplaint={handleTrackComplaint} />
        );
      case 'track':
        return (
          <PublicTrackerPage
            initialComplaintId={selectedComplaintId}
            onNavigate={handleNavigate}
            onSelectComplaint={handleSelectComplaint}
          />
        );
      case 'map':
        return (
          <MapViewPage onNavigate={handleNavigate} onSelectComplaint={handleSelectComplaint} />
        );
      case 'signin':
      case 'login':
        return <SignInPage onNavigate={handleNavigate} />;
      case 'register':
        return <RegisterPage onNavigate={handleNavigate} />;

      // Citizen Views
      case 'citizen-dash':
        return (
          <CitizenDashboard
            onNavigate={handleNavigate}
            onSelectComplaint={handleSelectComplaint}
          />
        );
      case 'report':
        return (
          <ReportIssuePage
            onNavigate={handleNavigate}
            onComplaintCreated={(id) => {
              setSelectedComplaintId(id);
              handleNavigate('complaint-detail');
            }}
          />
        );
      case 'my-complaints':
        return (
          <MyComplaintsPage
            onNavigate={handleNavigate}
            onSelectComplaint={handleSelectComplaint}
          />
        );
      case 'complaint-detail':
        return (
          <ComplaintDetailPage
            complaintId={selectedComplaintId}
            onNavigate={handleNavigate}
            onOpenOfficerStatusModal={handleOpenOfficerStatusModal}
          />
        );
      case 'profile':
        return <ProfilePage />;

      // Municipal Officer Views
      case 'officer-dash':
        return (
          <OfficerDashboard
            onNavigate={handleNavigate}
            onSelectComplaint={handleSelectComplaint}
            activeStatusModalComplaint={activeOfficerModalComplaint}
            onCloseStatusModal={() => setActiveOfficerModalComplaint(null)}
          />
        );

      // Administrator Views
      case 'admin-dash':
        return (
          <AdminDashboard
            onNavigate={handleNavigate}
            onSelectComplaint={handleSelectComplaint}
          />
        );
      case 'admin-complaints':
        return (
          <AdminComplaintsPage
            onNavigate={handleNavigate}
            onSelectComplaint={handleSelectComplaint}
          />
        );
      case 'admin-departments':
        return <AdminDepartmentsPage />;
      case 'admin-officers':
        return <AdminOfficersPage />;
      case 'admin-database':
        return <AdminDatabasePage />;

      default:
        return (
          <LandingPage onNavigate={handleNavigate} onTrackComplaint={handleTrackComplaint} />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Google Maps Quota Defense Banner if triggered */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenComplaint={handleSelectComplaint}
      />
      <main className="flex-1">{renderView()}</main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
