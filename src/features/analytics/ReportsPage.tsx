import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Printer,
  Building2,
  CheckCircle2,
  Users,
  Award,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { students, mentors, allocations } = useApp();

  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
  }).format(new Date());

  const totalCapacity = mentors.reduce((acc, m) => acc + m.max_capacity, 0);
  const usedCapacity = mentors.reduce((acc, m) => acc + m.current_load, 0);
  const avgScore = allocations.length > 0
    ? (allocations.reduce((acc, a) => acc + a.match_score, 0) / allocations.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      {/* Action Header (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E5EDFC] text-[#5478D4] text-[11px] font-bold tracking-wide uppercase font-mono mb-2">
            <BookOpen className="w-3 h-3" />
            <span>Executive Reporting</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#202C45] tracking-tight">
            Institutional Mentorship Audit
          </h2>
          <p className="text-xs sm:text-sm text-[#202C45]/70 mt-1">
            Official summary roster for academic leadership, coordinators, and faculty advisors.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl bg-[#F07857] hover:bg-[#e06847] text-white text-xs font-bold transition flex items-center gap-2 shadow-xs font-mono cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Document Sheet */}
      <div className="bg-white rounded-2xl border border-[#EAE2D8] p-8 shadow-xs space-y-6 text-[#202C45]">
        {/* Document Header */}
        <div className="border-b-2 border-[#F07857] pb-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#F07857]">
                <Building2 className="w-3.5 h-3.5" />
                <span>MENTORA · ACADEMIC OPERATIONS INTELLIGENCE</span>
              </div>
              <h1 className="font-heading text-2xl lg:text-3xl font-black text-[#202C45] tracking-tight mt-1">
                MENTORSHIP ALLOCATION & COHORT REPORT
              </h1>
            </div>
            <div className="text-left sm:text-right text-xs text-[#202C45]/70 font-mono">
              <div className="font-bold text-[#202C45]">OPERATIONAL CYCLE 2026-I</div>
              <div>{todayStr}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs font-mono">
            <div>
              <span className="text-[#202C45]/60 block text-[10px] uppercase">Program Division</span>
              <span className="font-bold text-[#202C45]">Academic Affairs</span>
            </div>
            <div>
              <span className="text-[#202C45]/60 block text-[10px] uppercase">Allocation Status</span>
              <span className="font-bold text-[#63AFA3]">Audit Verified</span>
            </div>
            <div>
              <span className="text-[#202C45]/60 block text-[10px] uppercase">Matching Engine</span>
              <span className="font-bold text-[#5478D4]">Greedy Heuristic v2.4</span>
            </div>
            <div>
              <span className="text-[#202C45]/60 block text-[10px] uppercase">Mean Score</span>
              <span className="font-bold text-[#202C45]">{avgScore} / 100</span>
            </div>
          </div>
        </div>

        {/* Section 1: Executive KPI Summary */}
        <div className="space-y-3 text-xs">
          <h3 className="font-heading text-sm font-bold text-[#202C45] uppercase tracking-wide">
            1. Cohort Operational Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 bg-[#FFF9F0] rounded-xl border border-[#EAE2D8]">
              <span className="text-[#202C45]/60 text-[10px] font-mono uppercase block">Total Mentees</span>
              <span className="text-2xl font-heading font-extrabold text-[#202C45] mt-0.5 block tabular-nums">{students.length}</span>
            </div>
            <div className="p-4 bg-[#FFF9F0] rounded-xl border border-[#EAE2D8]">
              <span className="text-[#202C45]/60 text-[10px] font-mono uppercase block">Available Mentors</span>
              <span className="text-2xl font-heading font-extrabold text-[#202C45] mt-0.5 block tabular-nums">{mentors.length}</span>
            </div>
            <div className="p-4 bg-[#FFF9F0] rounded-xl border border-[#EAE2D8]">
              <span className="text-[#202C45]/60 text-[10px] font-mono uppercase block">Matched Pairs</span>
              <span className="text-2xl font-heading font-extrabold text-[#63AFA3] mt-0.5 block tabular-nums">{allocations.length}</span>
            </div>
            <div className="p-4 bg-[#FFF9F0] rounded-xl border border-[#EAE2D8]">
              <span className="text-[#202C45]/60 text-[10px] font-mono uppercase block">Capacity Utilization</span>
              <span className="text-2xl font-heading font-extrabold text-[#F07857] mt-0.5 block tabular-nums">
                {totalCapacity > 0 ? Math.round((usedCapacity / totalCapacity) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Mathematical Scoring System */}
        <div className="space-y-2 text-xs">
          <h3 className="font-heading text-sm font-bold text-[#202C45] uppercase tracking-wide">
            2. Algorithmic Scoring Criteria & Thresholds
          </h3>
          <p className="text-[#202C45]/70 leading-relaxed">
            All mentor-mentee matches adhere to the standard 100-point multi-factor model with a 50-point cutoff and mandatory availability overlap:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#202C45]/80 font-mono text-[11px]">
            <li><strong className="text-[#202C45]">Subject Match (40 pts):</strong> <code>(Challenge Subjects Covered / Total Challenge Subjects) &times; 40</code></li>
            <li><strong className="text-[#202C45]">Interest Overlap (25 pts):</strong> <code>(Common Interests / Mentee Interests) &times; 25</code></li>
            <li><strong className="text-[#202C45]">Availability (20 pts):</strong> <code>(Common Free Slots / Mentee Free Slots) &times; 20</code> (Requires min 1 slot overlap)</li>
            <li><strong className="text-[#202C45]">Workload Balance (15 pts):</strong> <code>(Remaining Capacity / Max Capacity) &times; 15</code></li>
          </ul>
        </div>

        {/* Section 3: Allocated Pairs Table */}
        <div className="space-y-2 text-xs">
          <h3 className="font-heading text-sm font-bold text-[#202C45] uppercase tracking-wide">
            3. Verified Mentorship Assignments ({allocations.length})
          </h3>

          <div className="overflow-x-auto rounded-xl border border-[#EAE2D8]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF9F0] text-[10px] font-mono uppercase tracking-wider text-[#202C45]/70 border-b border-[#EAE2D8]">
                <tr>
                  <th className="px-3 py-2.5">Allocation ID</th>
                  <th className="px-3 py-2.5">Mentee</th>
                  <th className="px-3 py-2.5">Assigned Mentor</th>
                  <th className="px-3 py-2.5">Match Score</th>
                  <th className="px-3 py-2.5">Subj (40)</th>
                  <th className="px-3 py-2.5">Int (25)</th>
                  <th className="px-3 py-2.5">Avail (20)</th>
                  <th className="px-3 py-2.5">Work (15)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE2D8]">
                {allocations.map(a => (
                  <tr key={a.allocation_id} className="hover:bg-[#FFF4E6]/40 transition">
                    <td className="px-3 py-2.5 font-mono font-bold text-[#5478D4]">{a.allocation_id}</td>
                    <td className="px-3 py-2.5 font-bold text-[#202C45]">{a.student_name}</td>
                    <td className="px-3 py-2.5 text-[#202C45]/80">{a.mentor_name} ({a.mentor_type})</td>
                    <td className="px-3 py-2.5 font-bold font-mono">
                      <span className="px-2 py-0.5 rounded-full bg-[#63AFA3]/15 text-[#63AFA3]">
                        {a.match_score} pts
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[#202C45]/70">{a.score_breakdown.subject_score}</td>
                    <td className="px-3 py-2.5 font-mono text-[#202C45]/70">{a.score_breakdown.interest_score}</td>
                    <td className="px-3 py-2.5 font-mono text-[#202C45]/70">{a.score_breakdown.availability_score}</td>
                    <td className="px-3 py-2.5 font-mono text-[#202C45]/70">{a.score_breakdown.workload_score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Operational Certification block */}
        <div className="pt-8 border-t border-[#EAE2D8] grid grid-cols-2 gap-8 text-xs text-center text-[#202C45]/70">
          <div>
            <div className="h-12 border-b border-dashed border-[#EAE2D8] mb-2" />
            <span className="font-bold text-[#202C45]">Program Coordinator</span>
            <div className="text-[10px] font-mono">Mentorship Operations Unit</div>
          </div>
          <div>
            <div className="h-12 border-b border-dashed border-[#EAE2D8] mb-2" />
            <span className="font-bold text-[#202C45]">Academic Affairs Office</span>
            <div className="text-[10px] font-mono">Official Program Endorsement</div>
          </div>
        </div>
      </div>
    </div>
  );
};
