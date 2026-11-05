import React from 'react';
import {
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  Users,
  GraduationCap,
  Scale,
  Sparkles,
  Zap,
  Lock,
  Compass,
  BookOpen,
} from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { OpenBookMotif } from '../../components/common/BookIllustration';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl text-[#202C45]">
      {/* Product Banner */}
      <div className="bg-white border border-[#EAE2D8] p-6 lg:p-8 rounded-2xl shadow-xs space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#FFF4E6]/80 via-[#E5EDFC]/40 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#F07857] block">
              PLATFORM ARCHITECTURE & SPECIFICATIONS
            </span>
            <h2 className="font-heading text-2xl lg:text-3xl font-extrabold text-[#202C45] tracking-tight">
              About MENTORA
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5EDFC] border border-[#5478D4]/20 text-[#5478D4] text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-[#5478D4] animate-pulse" />
            <span>Bloom &amp; Knowledge Edition</span>
          </div>
        </div>

        <p className="text-sm text-[#202C45]/80 max-w-3xl leading-relaxed relative z-10">
          MENTORA is an intelligent mentorship operations platform engineered for universities, colleges, and academic institutions. It replaces manual, time-consuming coordinator spreadsheets with a multi-factor allocation engine that optimizes subject compatibility, schedule alignment, and mentor workload distribution.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#EAE2D8] text-xs font-mono relative z-10">
          <div>
            <span className="text-[#202C45]/60 block text-[10px] uppercase">Engine Type</span>
            <span className="font-bold text-[#202C45]">Greedy Heuristic</span>
          </div>
          <div>
            <span className="text-[#202C45]/60 block text-[10px] uppercase">Graph Model</span>
            <span className="font-bold text-[#F07857]">Bipartite Matching</span>
          </div>
          <div>
            <span className="text-[#202C45]/60 block text-[10px] uppercase">Queue Structure</span>
            <span className="font-bold text-[#5478D4]">Binary Max Heap</span>
          </div>
          <div>
            <span className="text-[#202C45]/60 block text-[10px] uppercase">Auditability</span>
            <span className="font-bold text-[#63AFA3]">100% Deterministic</span>
          </div>
        </div>
      </div>

      {/* Core Institutional Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#EAE2D8] space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#F9E3D9] flex items-center justify-center text-[#F07857]">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-base font-bold text-[#202C45]">Workload Leveling</h3>
          <p className="text-xs text-[#202C45]/70 leading-relaxed">
            Faculty burnout is eliminated through strict capacity caps and real-time workload weighting. As a mentor accepts mentees, their load score drops dynamically, distributing demand to less utilized colleagues.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EAE2D8] space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#E5EDFC] flex items-center justify-center text-[#5478D4]">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-base font-bold text-[#202C45]">Needs-First Priority</h3>
          <p className="text-xs text-[#202C45]/70 leading-relaxed">
            Students facing the greatest academic difficulties are matched first. High-need students are never left stranded by premature allocation of multi-subject mentors to single-subject candidates.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EAE2D8] space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#63AFA3]/15 flex items-center justify-center text-[#63AFA3]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-base font-bold text-[#202C45]">Zero-Conflict Guarantee</h3>
          <p className="text-xs text-[#202C45]/70 leading-relaxed">
            Multi-clause filtering enforces hard requirements: remaining capacity must exceed zero, and mentor and mentee must have at least one mutually confirmed weekly availability window.
          </p>
        </div>
      </div>

      {/* 4-Factor Mathematical Architecture */}
      <div className="bg-white rounded-2xl border border-[#EAE2D8] p-6 shadow-xs space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-base font-bold text-[#202C45]">
            100-Point Mathematical Evaluation Framework
          </h3>
          <span className="text-[11px] font-mono text-[#202C45]/60 bg-[#FFF9F0] px-2.5 py-1 rounded-md border border-[#EAE2D8]">
            Eligibility Cutoff: 50 pts
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-[#FFF9F0] border border-[#EAE2D8] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#202C45] font-heading">Subject Match</span>
              <span className="font-mono font-black text-[#F07857]">40%</span>
            </div>
            <div className="font-mono text-[11px] text-[#202C45]/70 bg-white p-1.5 rounded border border-[#EAE2D8]">
              (Weak Cov / Total) &times; 40
            </div>
            <p className="text-[11px] text-[#202C45]/70 leading-relaxed">
              Measures overlap between the student&apos;s declared challenge subjects and mentor expertise.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FFF9F0] border border-[#EAE2D8] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#202C45] font-heading">Shared Interests</span>
              <span className="font-mono font-black text-[#F3C969]">25%</span>
            </div>
            <div className="font-mono text-[11px] text-[#202C45]/70 bg-white p-1.5 rounded border border-[#EAE2D8]">
              (Common / Mentee) &times; 25
            </div>
            <p className="text-[11px] text-[#202C45]/70 leading-relaxed">
              Aligns research, engineering domains, and extracurricular technology affinities.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FFF9F0] border border-[#EAE2D8] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#202C45] font-heading">Availability</span>
              <span className="font-mono font-black text-[#5478D4]">20%</span>
            </div>
            <div className="font-mono text-[11px] text-[#202C45]/70 bg-white p-1.5 rounded border border-[#EAE2D8]">
              (Slots / Mentee) &times; 20
            </div>
            <p className="text-[11px] text-[#202C45]/70 leading-relaxed">
              Evaluates weekly shared meeting opportunities. Zero overlap results in immediate rejection.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FFF9F0] border border-[#EAE2D8] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#202C45] font-heading">Workload Score</span>
              <span className="font-mono font-black text-[#63AFA3]">15%</span>
            </div>
            <div className="font-mono text-[11px] text-[#202C45]/70 bg-white p-1.5 rounded border border-[#EAE2D8]">
              (Rem Cap / Max) &times; 15
            </div>
            <p className="text-[11px] text-[#202C45]/70 leading-relaxed">
              Dynamically boosts underutilized faculty and penalizes mentors approaching capacity limit.
            </p>
          </div>
        </div>
      </div>

      {/* Platform Architecture & Specifications */}
      <div className="bg-white rounded-2xl border border-[#EAE2D8] p-6 shadow-xs space-y-4 text-xs">
        <h3 className="font-heading text-base font-bold text-[#202C45]">
          System Specifications & Compliance
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-[#FFF9F0] border border-[#EAE2D8]">
            <span className="font-mono font-bold text-[#202C45] block">UI Framework</span>
            <span className="text-[#202C45]/70 text-[11px]">React 19, TypeScript, Tailwind CSS</span>
          </div>
          <div className="p-4 rounded-xl bg-[#FFF9F0] border border-[#EAE2D8]">
            <span className="font-mono font-bold text-[#202C45] block">Algorithmic Runtime</span>
            <span className="text-[#202C45]/70 text-[11px]">Sub-50ms heuristic execution</span>
          </div>
          <div className="p-4 rounded-xl bg-[#FFF9F0] border border-[#EAE2D8]">
            <span className="font-mono font-bold text-[#202C45] block">Data Privacy</span>
            <span className="text-[#202C45]/70 text-[11px]">FERPA-aligned client &amp; server state</span>
          </div>
          <div className="p-4 rounded-xl bg-[#FFF9F0] border border-[#EAE2D8]">
            <span className="font-mono font-bold text-[#202C45] block">Export Capabilities</span>
            <span className="text-[#202C45]/70 text-[11px]">JSON snapshot, CSV rosters</span>
          </div>
        </div>
      </div>
    </div>
  );
};
