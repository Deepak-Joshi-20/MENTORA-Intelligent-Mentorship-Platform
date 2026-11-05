import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Calendar,
  CheckCheck,
  Menu,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Zap,
} from 'lucide-react';

interface TopNavbarProps {
  collapsed: boolean;
  onOpenMobileMenu: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onOpenMobileMenu }) => {
  const {
    activeNav,
    setActiveNav,
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    setShowLanding,
  } = useApp();

  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  const todayStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const getPageInfo = (nav: string) => {
    switch (nav) {
      case 'dashboard':
        return {
          title: 'Mentorship Overview',
          subtitle: 'A holistic overview of student requirements, faculty capacities, and matched pairings.',
        };
      case 'students':
        return {
          title: 'Student Directory',
          subtitle: 'Academic records, declared challenge subjects, and weekly schedule availability.',
        };
      case 'mentors':
        return {
          title: 'Faculty Advisor Directory',
          subtitle: 'Advisor capacities, domain expertise, and active mentoring workloads.',
        };
      case 'requests':
        return {
          title: 'Guidance Requests',
          subtitle: 'Incoming student mentorship requests and real-time assignment lifecycle tracking.',
        };
      case 'allocations':
        return {
          title: 'Allocation Roster',
          subtitle: 'Confirmed mentor-mentee matches with itemized 4-factor scoring breakdown.',
        };
      case 'smart-allocation':
        return {
          title: 'Smart Matching Engine',
          subtitle: 'Execute greedy heuristic allocation pipeline with real-time step-by-step audit trail.',
        };
      case 'match-analysis':
        return {
          title: 'Compatibility Explorer',
          subtitle: 'Candidate evaluation matrix and multi-factor scoring parameter audit.',
        };
      case 'network':
        return {
          title: 'Mentorship Network Graph',
          subtitle: 'Bipartite graph visualizer of students, mentors, compatibility edges, and BFS traversal.',
        };
      case 'analytics':
        return {
          title: 'Metrics & Trends',
          subtitle: 'Workload distribution, subject demands, and match score distribution.',
        };
      case 'reports':
        return {
          title: 'Executive Program Reports',
          subtitle: 'Institutional summaries, cohort analytics, and allocation audits.',
        };
      case 'settings':
        return {
          title: 'Scoring Thresholds & Persistence',
          subtitle: 'Matching threshold tuning, demo seed reset, and JSON database export/import.',
        };
      case 'about':
        return {
          title: 'About Mentora Platform',
          subtitle: 'Intelligent mentorship operations architecture, matching principles, and platform specifications.',
        };
      default:
        return {
          title: 'Mentorship Overview',
          subtitle: 'Operational platform for student-mentor allocation.',
        };
    }
  };

  const { title } = getPageInfo(activeNav);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#EAE2D8] px-4 lg:px-8 py-3.5 transition-all text-[#202C45]">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-1.5 rounded-xl text-[#64748B] hover:bg-[#FFF9F0] transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
              <span className="font-semibold">MENTORA</span>
              <span className="text-[#EAE2D8]">/</span>
              <span className="text-[#F07857] font-bold">{activeNav.replace('-', ' ')}</span>
            </div>
            <h1 className="font-heading text-base lg:text-lg font-extrabold text-[#202C45] tracking-tight">
              {title}
            </h1>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Quick Launch Smart Matching button */}
          {activeNav !== 'smart-allocation' && (
            <button
              onClick={() => setActiveNav('smart-allocation')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F07857] hover:bg-[#DE6240] text-white text-xs font-bold transition shadow-xs active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Smart Matching</span>
            </button>
          )}

          {/* Date badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF9F0] border border-[#EAE2D8] text-[11px] font-medium text-[#64748B]">
            <Calendar className="w-3.5 h-3.5 text-[#5478D4]" />
            <span>{todayStr}</span>
          </div>

          {/* Public Overview link */}
          <button
            onClick={() => setShowLanding(true)}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#5478D4] hover:bg-[#FFF9F0] border border-[#EAE2D8] transition"
            title="Public Product Website"
          >
            <Globe className="w-4 h-4" />
          </button>

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationPanel(!showNotificationPanel)}
              className="relative p-2 rounded-xl text-[#64748B] hover:text-[#F07857] hover:bg-[#FFF9F0] border border-[#EAE2D8] transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F07857] text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotificationPanel && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-xl border border-[#EAE2D8] overflow-hidden z-50">
                <div className="p-3.5 bg-[#FFF9F0] border-b border-[#EAE2D8] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-heading font-bold text-[#202C45]">Program Events</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-mono bg-[#FFF4E6] text-[#F07857] font-bold px-2 py-0.5 rounded-md">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] font-semibold text-[#5478D4] hover:underline flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-[#EAE2D8]">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#64748B]">
                      No recorded operational events.
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.linkTo) {
                            setActiveNav(n.linkTo);
                            setShowNotificationPanel(false);
                          }
                        }}
                        className={`p-3.5 text-xs transition cursor-pointer hover:bg-[#FFF9F0] ${
                          !n.read ? 'bg-[#E5EDFC]/30' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#63AFA3] shrink-0 mt-0.5" />}
                          {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-[#F3C969] shrink-0 mt-0.5" />}
                          {n.type === 'info' && <Info className="w-4 h-4 text-[#5478D4] shrink-0 mt-0.5" />}
                          {n.type === 'error' && <AlertTriangle className="w-4 h-4 text-[#F07857] shrink-0 mt-0.5" />}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-heading font-bold text-[#202C45] truncate">{n.title}</span>
                              <span className="text-[10px] font-mono text-[#64748B]">
                                {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">
                              {n.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User coordinator profile badge */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-[#EAE2D8]">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E5EDFC] to-[#FFF4E6] border border-[#5478D4]/30 text-[#5478D4] flex items-center justify-center font-bold font-heading text-xs shadow-2xs">
              CO
            </div>
            <div className="hidden lg:block text-left">
              <span className="text-xs font-heading font-bold text-[#202C45] block leading-tight">Academic Director</span>
              <span className="text-[10px] font-medium text-[#64748B]">Program Coordinator</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
