/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { LoginModal } from './components/common/LoginModal';
import { LandingPage } from './components/common/LandingPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { StudentsPage } from './features/students/StudentsPage';
import { MentorsPage } from './features/mentors/MentorsPage';
import { RequestsPage } from './features/requests/RequestsPage';
import { AllocationsPage } from './features/allocation/AllocationsPage';
import { SmartAllocationPage } from './features/allocation/SmartAllocationPage';
import { MatchAnalysisPage } from './features/analytics/MatchAnalysisPage';
import { MentorshipNetworkPage } from './features/network/MentorshipNetworkPage';
import { AnalyticsPage } from './features/analytics/AnalyticsPage';
import { ReportsPage } from './features/analytics/ReportsPage';
import { SettingsPage } from './features/system/SettingsPage';
import { AboutPage } from './features/system/AboutPage';

function AppContent() {
  const { isAuthenticated, activeNav, showLanding } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // If user is viewing public landing page
  if (showLanding) {
    return <LandingPage />;
  }

  // If user is not authenticated and not on landing, show login modal over warm ivory backdrop
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFF9F0]">
        <LoginModal />
      </div>
    );
  }

  const renderActivePage = () => {
    switch (activeNav) {
      case 'dashboard':
        return <DashboardPage />;
      case 'students':
        return <StudentsPage />;
      case 'mentors':
        return <MentorsPage />;
      case 'requests':
        return <RequestsPage />;
      case 'allocations':
        return <AllocationsPage />;
      case 'smart-allocation':
        return <SmartAllocationPage />;
      case 'match-analysis':
        return <MatchAnalysisPage />;
      case 'network':
        return <MentorshipNetworkPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] text-[#202C45] flex flex-col antialiased selection:bg-[#F07857]/20">
      {/* Persistent Left Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main command centre app body */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <TopNavbar
          collapsed={collapsed}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />

        <main className="flex-1 p-4 lg:p-7 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
