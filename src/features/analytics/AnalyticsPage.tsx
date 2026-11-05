import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Percent,
  PieChart,
  Users,
  Award,
  Layers,
  BookOpen,
  Sparkles,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { students, mentors, allocations } = useApp();

  const totalStudents = students.length;
  const totalAllocated = allocations.length;
  const allocationRate = totalStudents > 0 ? Math.round((totalAllocated / totalStudents) * 100) : 0;

  const scoreBuckets = [
    { label: '90 - 100 (Exceptional)', count: allocations.filter(a => a.match_score >= 90).length, color: '#63AFA3' },
    { label: '75 - 89 (Strong)', count: allocations.filter(a => a.match_score >= 75 && a.match_score < 90).length, color: '#5478D4' },
    { label: '60 - 74 (Moderate)', count: allocations.filter(a => a.match_score >= 60 && a.match_score < 75).length, color: '#F3C969' },
    { label: '50 - 59 (Threshold)', count: allocations.filter(a => a.match_score >= 50 && a.match_score < 60).length, color: '#F07857' },
  ];

  const subjectFrequency: Record<string, number> = {};
  students.forEach(s => {
    s.weak_subjects.forEach(subj => {
      subjectFrequency[subj] = (subjectFrequency[subj] || 0) + 1;
    });
  });
  const sortedSubjects = Object.entries(subjectFrequency).sort((a, b) => b[1] - a[1]);

  const totalCapacity = mentors.reduce((acc, m) => acc + m.max_capacity, 0);
  const usedCapacity = mentors.reduce((acc, m) => acc + m.current_load, 0);
  const meanScore = allocations.length > 0
    ? (allocations.reduce((acc, a) => acc + a.match_score, 0) / allocations.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E5EDFC] text-[#5478D4] text-[11px] font-bold tracking-wide uppercase font-mono mb-2">
          <BarChart3 className="w-3 h-3" />
          <span>Operational Intelligence</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#202C45] tracking-tight">
          Cohort Analytics & Performance
        </h2>
        <p className="text-xs sm:text-sm text-[#202C45]/70 mt-1">
          Real-time metrics, capacity distribution, and pairing score health calculated from live student-mentor assignments.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Allocation Rate */}
        <div className="bg-white p-5 rounded-2xl border border-[#EAE2D8] shadow-xs relative overflow-hidden group hover:border-[#63AFA3]/40 transition">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#63AFA3]/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-[#202C45]/70 mb-2 font-mono text-[10px] uppercase font-bold tracking-wider">
            <span>Cohort Allocation Rate</span>
            <div className="w-7 h-7 rounded-lg bg-[#63AFA3]/15 text-[#63AFA3] flex items-center justify-center font-bold">
              <Percent className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-heading font-extrabold text-[#202C45] tabular-nums">
            {allocationRate}%
          </div>
          <div className="text-xs text-[#202C45]/70 mt-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#63AFA3]" />
            <span><strong className="text-[#202C45] font-bold">{totalAllocated}</strong> of {totalStudents} mentees assigned</span>
          </div>
        </div>

        {/* Mean Match Score */}
        <div className="bg-white p-5 rounded-2xl border border-[#EAE2D8] shadow-xs relative overflow-hidden group hover:border-[#5478D4]/40 transition">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#5478D4]/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-[#202C45]/70 mb-2 font-mono text-[10px] uppercase font-bold tracking-wider">
            <span>Mean Match Compatibility</span>
            <div className="w-7 h-7 rounded-lg bg-[#5478D4]/15 text-[#5478D4] flex items-center justify-center font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-heading font-extrabold text-[#5478D4] tabular-nums flex items-baseline gap-1">
            {meanScore}
            <span className="text-xs text-[#202C45]/60 font-semibold">/100</span>
          </div>
          <div className="text-xs text-[#202C45]/70 mt-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#F3C969]" />
            <span>Multi-factor quality rating</span>
          </div>
        </div>

        {/* Mentor Capacity Utilization */}
        <div className="bg-white p-5 rounded-2xl border border-[#EAE2D8] shadow-xs relative overflow-hidden group hover:border-[#F07857]/40 transition">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#F07857]/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-[#202C45]/70 mb-2 font-mono text-[10px] uppercase font-bold tracking-wider">
            <span>Mentor Quota Occupied</span>
            <div className="w-7 h-7 rounded-lg bg-[#F07857]/15 text-[#F07857] flex items-center justify-center font-bold">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-heading font-extrabold text-[#202C45] tabular-nums">
            {usedCapacity} <span className="text-base text-[#202C45]/50 font-medium">/ {totalCapacity}</span>
          </div>
          <div className="text-xs text-[#202C45]/70 mt-1.5">
            <span className="font-semibold text-[#F07857]">
              {totalCapacity > 0 ? Math.round((usedCapacity / totalCapacity) * 100) : 0}%
            </span>{' '}
            of total advisory capacity filled
          </div>
        </div>
      </div>

      {/* Match Score Distribution and Subjects Demand */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Score Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE2D8] space-y-4 shadow-xs">
          <div>
            <h3 className="font-heading text-base font-bold text-[#202C45]">
              Match Score Distribution
            </h3>
            <p className="text-xs text-[#202C45]/70">Pairing quality breakdown across score tiers</p>
          </div>

          <div className="space-y-3.5 pt-1">
            {scoreBuckets.map(bucket => {
              const pct = totalAllocated > 0 ? Math.round((bucket.count / totalAllocated) * 100) : 0;
              return (
                <div key={bucket.label} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[#202C45] font-semibold">{bucket.label}</span>
                    <span className="font-mono text-[#202C45]/70 font-semibold tabular-nums">
                      {bucket.count} pairs ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#FFF9F0] border border-[#EAE2D8] overflow-hidden">
                    <div
                      style={{ width: `${pct}%`, backgroundColor: bucket.color }}
                      className="h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subjects Demand */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE2D8] space-y-4 shadow-xs">
          <div>
            <h3 className="font-heading text-base font-bold text-[#202C45]">
              Challenge Subjects Demand
            </h3>
            <p className="text-xs text-[#202C45]/70">Subjects flagged by students needing advisory assistance</p>
          </div>

          <div className="space-y-3 max-h-68 overflow-y-auto pr-1">
            {sortedSubjects.map(([subj, count], idx) => {
              const maxC = sortedSubjects[0]?.[1] || 1;
              const pct = Math.round((count / maxC) * 100);
              const barColors = ['#F07857', '#5478D4', '#63AFA3', '#F3C969'];
              const color = barColors[idx % barColors.length];

              return (
                <div key={subj} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#202C45]">{subj}</span>
                    <span className="font-mono text-[#202C45]/70 text-[11px] font-semibold tabular-nums">
                      {count} student{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#FFF9F0] border border-[#EAE2D8] overflow-hidden">
                    <div
                      style={{ width: `${pct}%`, backgroundColor: color }}
                      className="h-full rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
