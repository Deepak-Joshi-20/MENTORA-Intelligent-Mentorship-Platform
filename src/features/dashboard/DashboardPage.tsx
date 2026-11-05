import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  GraduationCap,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowRight,
  Zap,
  Activity,
  Layers,
  Award,
} from 'lucide-react';
import { DashboardHeaderIllustration } from '../../components/common/BookIllustration';

export const DashboardPage: React.FC = () => {
  const {
    students,
    mentors,
    requests,
    allocations,
    setActiveNav,
    previousWeekMetrics,
  } = useApp();

  const totalStudents = students.length;
  const totalMentors = mentors.length;
  const pendingRequests = requests.filter(r => r.status === 'Pending').length;
  const successfulAllocations = allocations.length;
  const unallocatedStudents = students.filter(s => s.allocation_status !== 'Allocated').length;

  const totalCapacity = mentors.reduce((acc, m) => acc + m.max_capacity, 0);
  const usedCapacity = mentors.reduce((acc, m) => acc + m.current_load, 0);
  const capacityUtilisation = totalCapacity > 0 ? Math.round((usedCapacity / totalCapacity) * 100) : 0;
  const fullMentorsCount = mentors.filter(m => m.current_load >= m.max_capacity).length;

  const avgMatchScoreNum =
    allocations.length > 0
      ? allocations.reduce((acc, a) => acc + a.match_score, 0) / allocations.length
      : 0;
  const avgMatchScore = avgMatchScoreNum > 0 ? avgMatchScoreNum.toFixed(1) : '0.0';

  /**
   * Calculate dynamic trend indicator and percentage change vs previous week's stored records
   */
  const getTrendData = (current: number, previous: number, invertSentiment = false) => {
    if (previous === 0) {
      const isUp = current > 0;
      return {
        formatted: isUp ? `+100%` : `0.0%`,
        isUp,
        isNeutral: current === 0,
        isPositiveSentiment: invertSentiment ? current === 0 : current > 0,
      };
    }

    const pct = ((current - previous) / previous) * 100;
    const isNeutral = Math.abs(pct) < 0.05;
    const isUp = pct > 0;
    // For unallocated students, a reduction is good news (positive sentiment)
    const isPositiveSentiment = invertSentiment ? pct <= 0 : pct >= 0;

    return {
      formatted: `${isUp ? '+' : ''}${pct.toFixed(1)}%`,
      isUp,
      isNeutral,
      isPositiveSentiment,
    };
  };

  const studentTrend = getTrendData(totalStudents, previousWeekMetrics.total_students);
  const mentorTrend = getTrendData(totalMentors, previousWeekMetrics.active_mentors);
  const requestTrend = getTrendData(pendingRequests, previousWeekMetrics.pending_requests);
  const allocationTrend = getTrendData(successfulAllocations, previousWeekMetrics.successful_allocations);
  const unallocatedTrend = getTrendData(unallocatedStudents, previousWeekMetrics.unallocated_students, true);
  const scoreTrend = getTrendData(avgMatchScoreNum, previousWeekMetrics.average_match_score);

  // Subject demand frequency
  const subjectFrequency: Record<string, number> = {};
  students.forEach(s => {
    s.weak_subjects.forEach(subj => {
      subjectFrequency[subj] = (subjectFrequency[subj] || 0) + 1;
    });
  });
  const topDemandedSubjects = Object.entries(subjectFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Bloom & Knowledge Hero Operations Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FFFFFF] via-[#FFF9F0] to-[#F9E3D9]/30 border border-[#EAE2D8] p-6 lg:p-7 shadow-xs relative overflow-hidden">
        {/* Subtle decorative learning illustration background */}
        <div className="absolute right-0 top-0 bottom-0 w-80 pointer-events-none opacity-80 hidden md:block">
          <DashboardHeaderIllustration className="w-full h-full" />
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5EDFC] border border-[#5478D4]/20 text-[#5478D4] text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#5478D4] animate-pulse" />
              <span className="font-mono uppercase tracking-wider">LIVE MENTORSHIP PIPELINE · 2026</span>
            </div>
            <h2 className="font-heading text-2xl lg:text-3xl font-extrabold text-[#202C45] tracking-tight">
              Mentorship Command &amp; Operations
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Real-time monitoring of student guidance requirements, faculty advisor capacity, and algorithmic matching quality. Balancing academic need with mentor workload protection.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveNav('smart-allocation')}
              className="px-4 py-2.5 rounded-xl bg-[#F07857] hover:bg-[#DE6240] text-white font-bold text-xs transition flex items-center gap-2 shadow-sm hover:shadow active:scale-95"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Run Matching Engine</span>
            </button>
            <button
              onClick={() => setActiveNav('network')}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FFF9F0] border border-[#5478D4]/30 text-[#5478D4] font-bold text-xs transition flex items-center gap-2 shadow-2xs hover:border-[#5478D4]"
            >
              <Activity className="w-4 h-4 text-[#5478D4]" />
              <span>Bipartite Network</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Bar (6 Refined Cards with Dynamic Trend Indicators) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* 1. Total Students */}
        <div className="bg-white p-4 rounded-xl border border-[#EAE2D8] shadow-xs hover:border-[#202C45]/30 transition-all">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">TOTAL STUDENTS</span>
            <div className="w-7 h-7 rounded-lg bg-[#E5EDFC] text-[#5478D4] flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-heading font-black text-[#202C45] tabular-nums">
            {totalStudents}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium mt-2">
            {studentTrend.isUp ? (
              <TrendingUp className="w-3.5 h-3.5 text-[#63AFA3] shrink-0" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-[#F07857] shrink-0" />
            )}
            <span className={studentTrend.isPositiveSentiment ? 'text-[#63AFA3]' : 'text-[#F07857]'}>
              {studentTrend.formatted}
            </span>
            <span className="text-[#64748B] text-[10px]">vs last week</span>
          </div>
        </div>

        {/* 2. Active Mentors */}
        <div className="bg-white p-4 rounded-xl border border-[#EAE2D8] shadow-xs hover:border-[#5478D4]/40 transition-all">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">ACTIVE MENTORS</span>
            <div className="w-7 h-7 rounded-lg bg-[#E5EDFC] text-[#5478D4] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-heading font-black text-[#202C45] tabular-nums">
            {totalMentors}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium mt-2">
            {mentorTrend.isUp ? (
              <TrendingUp className="w-3.5 h-3.5 text-[#63AFA3] shrink-0" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
            )}
            <span className={mentorTrend.isPositiveSentiment ? 'text-[#63AFA3]' : 'text-[#64748B]'}>
              {mentorTrend.formatted}
            </span>
            <span className="text-[#64748B] text-[10px]">vs last week</span>
          </div>
        </div>

        {/* 3. Pending Requests */}
        <div className="bg-white p-4 rounded-xl border border-[#F3C969]/50 shadow-xs hover:border-[#F3C969] transition-all">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">PENDING REQS</span>
            <div className="w-7 h-7 rounded-lg bg-[#FFF4E6] text-[#DE6240] flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-heading font-black text-[#DE6240] tabular-nums">
            {pendingRequests}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium mt-2">
            {requestTrend.isUp ? (
              <TrendingUp className="w-3.5 h-3.5 text-[#DE6240] shrink-0" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-[#63AFA3] shrink-0" />
            )}
            <span className={requestTrend.isUp ? 'text-[#DE6240]' : 'text-[#63AFA3]'}>
              {requestTrend.formatted}
            </span>
            <span className="text-[#64748B] text-[10px]">vs last week</span>
          </div>
        </div>

        {/* 4. Allocated Pairs (VISUALLY DISTINCT WITH TEAL HIGHLIGHT) */}
        <div className="bg-gradient-to-br from-[#FFFFFF] to-[#E5EDFC]/20 p-4 rounded-xl border-2 border-[#63AFA3] shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-12 h-12 bg-[#63AFA3]/10 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#63AFA3]">
              ALLOCATED PAIRS
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#63AFA3] text-white flex items-center justify-center shadow-2xs">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl font-heading font-black text-[#63AFA3] tabular-nums">
            {successfulAllocations}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium mt-2">
            {allocationTrend.isUp ? (
              <TrendingUp className="w-3.5 h-3.5 text-[#63AFA3] shrink-0" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
            )}
            <span className="text-[#63AFA3] font-bold">
              {allocationTrend.formatted}
            </span>
            <span className="text-[#64748B] text-[10px]">vs last week</span>
          </div>
        </div>

        {/* 5. Awaiting Allocation (CORAL ACCENT) */}
        <div className="bg-white p-4 rounded-xl border border-[#F07857]/40 shadow-xs hover:border-[#F07857] transition-all">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#F07857]">
              AWAITING
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#F9E3D9] text-[#F07857] flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-heading font-black text-[#F07857] tabular-nums">
            {unallocatedStudents}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium mt-2">
            {unallocatedTrend.isUp ? (
              <TrendingUp className="w-3.5 h-3.5 text-[#F07857] shrink-0" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-[#63AFA3] shrink-0" />
            )}
            <span className={unallocatedTrend.isPositiveSentiment ? 'text-[#63AFA3]' : 'text-[#F07857]'}>
              {unallocatedTrend.formatted}
            </span>
            <span className="text-[#64748B] text-[10px]">vs last week</span>
          </div>
        </div>

        {/* 6. Average Match Score (COBALT BLUE ACCENT) */}
        <div className="bg-white p-4 rounded-xl border border-[#5478D4]/40 shadow-xs hover:border-[#5478D4] transition-all">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#5478D4]">
              AVG SCORE
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#E5EDFC] text-[#5478D4] flex items-center justify-center">
              <Sparkles className="w-4 h-4 fill-[#5478D4]" />
            </div>
          </div>
          <div className="text-2xl font-heading font-black text-[#5478D4] tabular-nums">
            {avgMatchScore}
            <span className="text-xs font-semibold text-[#64748B] ml-0.5">/100</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium mt-2">
            {scoreTrend.isUp ? (
              <TrendingUp className="w-3.5 h-3.5 text-[#63AFA3] shrink-0" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
            )}
            <span className={scoreTrend.isPositiveSentiment ? 'text-[#63AFA3]' : 'text-[#64748B]'}>
              {scoreTrend.formatted}
            </span>
            <span className="text-[#64748B] text-[10px]">vs last week</span>
          </div>
        </div>
      </div>

      {/* Main Operations Grid: Allocation Performance & Mentor Capacity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Allocation Performance & Progress */}
        <div className="bg-white p-5 lg:p-6 rounded-2xl border border-[#EAE2D8] space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-sm font-bold text-[#202C45]">
                Allocation Performance
              </h3>
              <p className="text-[11px] text-[#64748B]">Enrolled students vs. active pairings</p>
            </div>
            <button
              onClick={() => setActiveNav('allocations')}
              className="text-[11px] text-[#F07857] font-bold hover:underline flex items-center gap-1"
            >
              <span>View Roster</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Allocation Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-2">
              <span className="text-[#64748B]">Completion Rate</span>
              <span className="text-[#5478D4] font-bold tabular-nums">
                {totalStudents > 0 ? Math.round((successfulAllocations / totalStudents) * 100) : 0}%
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-[#EAE2D8]/60 overflow-hidden flex p-0.5">
              <div
                style={{ width: `${totalStudents > 0 ? (successfulAllocations / totalStudents) * 100 : 0}%` }}
                className="bg-[#63AFA3] rounded-l-full transition-all duration-500"
              />
              <div
                style={{ width: `${totalStudents > 0 ? (unallocatedStudents / totalStudents) * 100 : 0}%` }}
                className="bg-[#F07857]/40 rounded-r-full transition-all duration-500"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-medium text-[#64748B] mt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#63AFA3]" />
                <span className="text-[#202C45] font-semibold">{successfulAllocations}</span> Matched
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F07857]" />
                <span className="text-[#F07857] font-semibold">{unallocatedStudents}</span> Awaiting
              </span>
            </div>
          </div>

          {/* Scoring Formula Reference Panel */}
          <div className="p-4 rounded-xl bg-[#FFF9F0] border border-[#EAE2D8] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] font-bold">
                COMPATIBILITY CRITERIA (100 PTS)
              </span>
              <Award className="w-3.5 h-3.5 text-[#F3C969]" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-[#EAE2D8]">
                <div className="text-[10px] text-[#64748B] font-medium">Subject Match</div>
                <div className="font-heading font-bold text-[#F07857]">40 pts max</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-[#EAE2D8]">
                <div className="text-[10px] text-[#64748B] font-medium">Shared Interests</div>
                <div className="font-heading font-bold text-[#DE6240]">25 pts max</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-[#EAE2D8]">
                <div className="text-[10px] text-[#64748B] font-medium">Availability</div>
                <div className="font-heading font-bold text-[#5478D4]">20 pts max</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-[#EAE2D8]">
                <div className="text-[10px] text-[#64748B] font-medium">Workload Balance</div>
                <div className="font-heading font-bold text-[#63AFA3]">15 pts max</div>
              </div>
            </div>
          </div>

          {/* Action Callout */}
          {unallocatedStudents > 0 ? (
            <button
              onClick={() => setActiveNav('smart-allocation')}
              className="w-full py-2.5 rounded-xl bg-[#F07857] hover:bg-[#DE6240] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs hover:shadow active:scale-98"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Solve {unallocatedStudents} Pending Allocations</span>
            </button>
          ) : (
            <div className="p-2.5 rounded-xl bg-[#63AFA3]/10 border border-[#63AFA3]/30 text-xs text-[#63AFA3] font-semibold text-center flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#63AFA3]" />
              <span>All registered students successfully allocated</span>
            </div>
          )}
        </div>

        {/* Center/Right 2 Columns: Mentor Capacity & Workload Balance */}
        <div className="bg-white p-5 lg:p-6 rounded-2xl border border-[#EAE2D8] space-y-4 lg:col-span-2 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-sm font-bold text-[#202C45]">
                Advisor Capacity &amp; Workload Distribution
              </h3>
              <p className="text-[11px] text-[#64748B]">
                Total: <span className="font-semibold text-[#202C45]">{usedCapacity}</span> / {totalCapacity} committed slots ({capacityUtilisation}%) · {fullMentorsCount} at maximum quota
              </p>
            </div>
            <button
              onClick={() => setActiveNav('mentors')}
              className="text-[11px] text-[#5478D4] font-bold hover:underline flex items-center gap-1"
            >
              <span>All Advisors</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-76 overflow-y-auto pr-1">
            {mentors.map(m => {
              const utilPercent = m.max_capacity > 0 ? Math.round((m.current_load / m.max_capacity) * 100) : 0;
              const isFull = m.current_load >= m.max_capacity;

              return (
                <div
                  key={m.mentor_id}
                  className="p-3.5 rounded-xl bg-[#FFF9F0]/60 border border-[#EAE2D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs hover:border-[#5478D4]/40 hover:bg-white transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-[#202C45] truncate">{m.name}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          m.mentor_type === 'Faculty'
                            ? 'bg-[#E5EDFC] text-[#5478D4]'
                            : 'bg-[#F9E3D9] text-[#F07857]'
                        }`}
                      >
                        {m.mentor_type}
                      </span>
                      {isFull && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F07857]/15 text-[#DE6240]">
                          QUOTA FULL
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#64748B] truncate mt-0.5">
                      {m.expertise.slice(0, 3).join(' · ')}
                    </div>
                  </div>

                  {/* Workload metric & bar */}
                  <div className="w-full sm:w-44 shrink-0">
                    <div className="flex justify-between text-[11px] mb-1 font-medium">
                      <span className="text-[#202C45] tabular-nums">{m.current_load} / {m.max_capacity} Mentees</span>
                      <span className={`tabular-nums font-bold ${isFull ? 'text-[#F07857]' : 'text-[#64748B]'}`}>
                        {utilPercent}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#EAE2D8] overflow-hidden">
                      <div
                        style={{ width: `${utilPercent}%` }}
                        className={`h-full rounded-full transition-all duration-300 ${
                          isFull
                            ? 'bg-[#F07857]'
                            : utilPercent > 66
                            ? 'bg-[#F3C969]'
                            : 'bg-[#5478D4]'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subject Demand and Recent Allocation Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Subject Demand Distribution */}
        <div className="bg-white p-5 lg:p-6 rounded-2xl border border-[#EAE2D8] space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-sm font-bold text-[#202C45]">
                Curriculum Demand Distribution
              </h3>
              <p className="text-[11px] text-[#64748B]">Subject areas where students declare highest guidance need</p>
            </div>
            <button
              onClick={() => setActiveNav('analytics')}
              className="text-[11px] text-[#5478D4] font-bold hover:underline flex items-center gap-1"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {topDemandedSubjects.map(([subject, count], idx) => {
              const maxCount = topDemandedSubjects[0]?.[1] || 1;
              const percent = Math.round((count / totalStudents) * 100);

              return (
                <div key={subject} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#202C45] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#FFF4E6] text-[#F07857] font-bold text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      {subject}
                    </span>
                    <span className="text-[#64748B] tabular-nums text-[11px]">
                      {count} cases ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#EAE2D8]/60 overflow-hidden">
                    <div
                      style={{ width: `${(count / maxCount) * 100}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-[#F07857] to-[#DE6240]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Allocation Events */}
        <div className="bg-white p-5 lg:p-6 rounded-2xl border border-[#EAE2D8] space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-sm font-bold text-[#202C45]">
                Recent Allocation Log
              </h3>
              <p className="text-[11px] text-[#64748B]">Committed student-mentor matches recorded to platform</p>
            </div>
            <button
              onClick={() => setActiveNav('allocations')}
              className="text-[11px] text-[#F07857] font-bold hover:underline flex items-center gap-1"
            >
              <span>Full Roster ({allocations.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {allocations.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#64748B]">
              <Layers className="w-8 h-8 text-[#5478D4] mx-auto mb-2 opacity-50" />
              <span>No allocations executed yet. Trigger &quot;Run Matching Engine&quot; to begin.</span>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-76 overflow-y-auto pr-1">
              {allocations.slice(0, 5).map(alc => (
                <div
                  key={alc.allocation_id}
                  className="p-3.5 rounded-xl bg-[#FFF9F0]/60 border border-[#EAE2D8] flex items-center justify-between gap-3 text-xs hover:border-[#5478D4]/40 hover:bg-white transition-all"
                >
                  <div className="min-w-0">
                    <div className="font-heading font-bold text-[#202C45] flex items-center gap-1.5">
                      <span className="truncate">{alc.student_name}</span>
                      <span className="text-[#64748B]">&rarr;</span>
                      <span className="text-[#5478D4] truncate">{alc.mentor_name}</span>
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">
                      Subj: {alc.score_breakdown.subject_score}/40 · Avail: {alc.score_breakdown.availability_score}/20 · Balance: {alc.score_breakdown.workload_score}/15
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-2.5 py-1 rounded-lg bg-[#E5EDFC] text-[#5478D4] border border-[#5478D4]/30 font-heading font-bold text-xs inline-block shadow-2xs tabular-nums">
                      {alc.match_score} pts
                    </span>
                    <span className="text-[10px] font-mono text-[#64748B] block mt-0.5">
                      {alc.allocation_id}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
