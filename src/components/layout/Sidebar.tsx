import React from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ClipboardList,
  CheckCircle,
  Cpu,
  Network,
  BarChart3,
  FileText,
  Settings,
  Info,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  Globe,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (o: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const {
    activeNav,
    setActiveNav,
    logout,
    setShowLanding,
    students,
    mentors,
    requests,
    allocations,
  } = useApp();

  const unallocatedCount = students.filter(s => s.allocation_status !== 'Allocated').length;

  interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    highlight?: boolean;
    badge?: string | number;
    badgeColor?: string;
  }

  interface NavGroup {
    section: string;
    items: NavItem[];
  }

  const navItems: NavGroup[] = [
    {
      section: 'OPERATIONS',
      items: [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
      ],
    },
    {
      section: 'ROSTER & PIPELINE',
      items: [
        { id: 'students', label: 'Students', icon: GraduationCap, badge: students.length },
        { id: 'mentors', label: 'Faculty Advisors', icon: Users, badge: mentors.length },
        { id: 'requests', label: 'Guidance Requests', icon: ClipboardList, badge: requests.filter(r => r.status === 'Pending').length, badgeColor: 'coral' },
        { id: 'allocations', label: 'Allocation Roster', icon: CheckCircle, badge: allocations.length, badgeColor: 'teal' },
      ],
    },
    {
      section: 'INTELLIGENT MATCHING',
      items: [
        { id: 'smart-allocation', label: 'Smart Matching Engine', icon: Cpu, highlight: true, badge: unallocatedCount > 0 ? `${unallocatedCount}` : undefined, badgeColor: 'coral' },
        { id: 'network', label: 'Mentorship Network', icon: Network },
        { id: 'match-analysis', label: 'Compatibility Explorer', icon: Sparkles },
      ],
    },
    {
      section: 'ANALYTICS & AUDIT',
      items: [
        { id: 'analytics', label: 'Metrics & Trends', icon: BarChart3 },
        { id: 'reports', label: 'Executive Reports', icon: FileText },
      ],
    },
    {
      section: 'CONFIGURATION',
      items: [
        { id: 'settings', label: 'Scoring Thresholds', icon: Settings },
        { id: 'about', label: 'Platform Architecture', icon: Info },
      ],
    },
  ];

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    if (mobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#202C45]/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white border-r border-[#EAE2D8] transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} shadow-xs`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#EAE2D8] bg-[#FFF9F0]/60">
          {!collapsed ? (
            <Logo size="sm" showSubtitle={false} />
          ) : (
            <div className="mx-auto">
              <Logo size="sm" minimal={true} />
            </div>
          )}

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-[#64748B] hover:text-[#202C45] hover:bg-[#FFF9F0] transition border border-transparent hover:border-[#EAE2D8]"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Scrollable Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navItems.map(group => (
            <div key={group.section} className="space-y-1">
              {!collapsed && (
                <div className="px-3 text-[10px] font-mono font-bold tracking-wider text-[#64748B] uppercase mb-1.5">
                  {group.section}
                </div>
              )}

              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all relative group ${
                      isActive
                        ? 'bg-[#E5EDFC] text-[#5478D4] font-bold shadow-2xs'
                        : item.highlight
                        ? 'text-[#F07857] hover:bg-[#FFF4E6] font-semibold'
                        : 'text-[#64748B] hover:text-[#202C45] hover:bg-[#FFF9F0] font-medium'
                    }`}
                  >
                    {/* Active cobalt or coral indicator bar */}
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#5478D4]" />
                    )}

                    <Icon
                      className={`w-4 h-4 shrink-0 transition ${
                        isActive
                          ? 'text-[#5478D4]'
                          : item.highlight
                          ? 'text-[#F07857]'
                          : 'text-[#64748B] group-hover:text-[#202C45]'
                      }`}
                    />

                    {!collapsed && (
                      <span className="truncate flex-1 text-left">{item.label}</span>
                    )}

                    {!collapsed && item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                          isActive
                            ? 'bg-[#5478D4] text-white'
                            : item.badgeColor === 'coral'
                            ? 'bg-[#FFF4E6] text-[#F07857]'
                            : item.badgeColor === 'teal'
                            ? 'bg-[#E5EDFC] text-[#63AFA3]'
                            : 'bg-[#FFF9F0] text-[#64748B] border border-[#EAE2D8]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Engine status indicator */}
        {!collapsed && (
          <div className="p-3 m-2.5 rounded-xl bg-[#FFF9F0] border border-[#EAE2D8] space-y-1">
            <div className="flex items-center justify-between text-[11px] text-[#64748B]">
              <span className="font-heading font-bold text-[#202C45]">Greedy Engine</span>
              <span className="flex items-center gap-1.5 text-[#63AFA3] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#63AFA3] animate-pulse" />
                ONLINE
              </span>
            </div>
            <div className="text-[10px] text-[#64748B]">
              Max Heap &amp; Bipartite Graph ready
            </div>
          </div>
        )}

        {/* User / Landing View switcher */}
        <div className="p-3 border-t border-[#EAE2D8] flex items-center justify-between bg-[#FFF9F0]/60">
          <button
            onClick={() => setShowLanding(true)}
            className="flex items-center gap-2 text-xs text-[#64748B] hover:text-[#5478D4] transition p-1.5 rounded-lg hover:bg-white"
            title="Public Overview"
          >
            <Globe className="w-4 h-4 text-[#5478D4]" />
            {!collapsed && <span className="font-semibold text-[11px]">Public Website</span>}
          </button>

          <button
            onClick={logout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#F07857] hover:bg-white transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};
