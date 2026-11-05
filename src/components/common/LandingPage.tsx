import React from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import {
  HeroLibraryScene,
  OpenBookMotif,
  BookStackMotif,
  DeskLampMotif,
} from './BookIllustration';
import {
  ArrowRight,
  Sparkles,
  Calendar,
  Users,
  CheckCircle2,
  Award,
  ShieldCheck,
  Compass,
  GraduationCap,
  Layers,
  ChevronRight,
  Activity,
  Zap,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setShowLanding, isAuthenticated } = useApp();

  const handleGetStarted = () => {
    setShowLanding(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] text-[#202C45] flex flex-col font-body selection:bg-[#F07857]/20">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-[#FFF9F0]/90 backdrop-blur-md border-b border-[#EAE2D8] px-6 lg:px-12 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo size="md" showSubtitle={true} />

          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#64748B]">
            <a href="#how-it-works" className="hover:text-[#202C45] transition">
              How It Works
            </a>
            <a href="#matching-model" className="hover:text-[#202C45] transition">
              Matching Model
            </a>
            <a href="#network-preview" className="hover:text-[#202C45] transition">
              Bipartite Network
            </a>
            <a href="#principles" className="hover:text-[#202C45] transition">
              Core Principles
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGetStarted}
              className="px-5 py-2.5 rounded-xl bg-[#F07857] hover:bg-[#DE6240] text-white text-xs font-bold transition flex items-center gap-2 shadow-sm hover:shadow active:scale-95"
            >
              <span>{isAuthenticated ? 'Go to Workspace' : 'Get Started'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* HERO SECTION — Featuring Signature Bloom & Knowledge Vector Art */}
        <section className="relative overflow-hidden pt-12 lg:pt-20 pb-20 px-6 lg:px-12 border-b border-[#EAE2D8]">
          {/* Subtle warm mesh background */}
          <div className="absolute inset-0 bg-warm-mesh opacity-40 pointer-events-none" />

          {/* Ambient colorful energy orbs */}
          <div className="absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-[#F3C969]/15 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-[#F07857]/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-[#5478D4]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Inspiring Headline and Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E5EDFC] border border-[#5478D4]/20 text-xs font-semibold text-[#5478D4]">
                <span className="w-2 h-2 rounded-full bg-[#F07857]" />
                <span className="font-heading font-bold text-[#202C45]">Bloom &amp; Knowledge</span>
                <span className="text-[#64748B]">·</span>
                <span>Intelligent Mentorship Platform</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#202C45] tracking-tight leading-[1.12]">
                Every Great Journey Begins With{' '}
                <span className="text-[#F07857] font-black underline decoration-[#F3C969] decoration-wavy decoration-2">
                  The Right Mentor.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#64748B] max-w-xl leading-relaxed">
                Discover meaningful mentorship connections through smarter matching, shared interests and compatible schedules.
              </p>

              {/* Call to action buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={handleGetStarted}
                  className="px-6 py-3.5 rounded-xl bg-[#F07857] hover:bg-[#DE6240] text-white font-bold text-sm transition flex items-center gap-2.5 shadow-md hover:shadow-lg active:scale-95"
                >
                  <span>Explore Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#matching-model"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-[#FFF9F0] border border-[#5478D4]/30 text-[#5478D4] font-bold text-sm transition flex items-center gap-2 shadow-xs hover:border-[#5478D4]"
                >
                  <Sparkles className="w-4 h-4 text-[#5478D4]" />
                  <span>How Matching Works</span>
                </a>
              </div>

              {/* Quick highlights */}
              <div className="pt-6 border-t border-[#EAE2D8] grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <div className="text-2xl font-heading font-black text-[#202C45] tabular-nums">100%</div>
                  <div className="text-xs text-[#64748B] font-medium mt-0.5">Transparent Scoring</div>
                </div>
                <div>
                  <div className="text-2xl font-heading font-black text-[#5478D4] tabular-nums">&lt;50ms</div>
                  <div className="text-xs text-[#64748B] font-medium mt-0.5">Greedy Allocation</div>
                </div>
                <div>
                  <div className="text-2xl font-heading font-black text-[#63AFA3] tabular-nums">0 Overload</div>
                  <div className="text-xs text-[#64748B] font-medium mt-0.5">Capacity Protected</div>
                </div>
              </div>
            </div>

            {/* Right: Signature Illustrated Hero Vector */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-lg">
                {/* Illustrated Scene */}
                <HeroLibraryScene className="w-full h-auto drop-shadow-sm" />

                {/* Floating Active Pairing Card Accent */}
                <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-[#EAE2D8] shadow-md max-w-xs space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
                    <span className="flex items-center gap-1.5 text-[#63AFA3]">
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      <span>Optimal Pairing Found</span>
                    </span>
                    <span className="font-heading font-bold text-[#5478D4] px-2 py-0.5 bg-[#E5EDFC] rounded-md tabular-nums">
                      94/100
                    </span>
                  </div>
                  <div className="text-xs font-heading font-bold text-[#202C45]">
                    Aarav Sharma &rarr; Dr. Rajesh Verma
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    High Subject Overlap · Common Slot Mon 10:00 · Balanced Load
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 CORE ADVANTAGES */}
        <section id="how-it-works" className="py-20 px-6 lg:px-12 bg-white border-b border-[#EAE2D8]">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#F07857] font-bold">
                SYSTEM ARCHITECTURE
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#202C45] tracking-tight">
                Designed for Equitable, Purposeful Guidance
              </h2>
              <p className="text-sm text-[#64748B]">
                Mentora removes guesswork and administrative friction from mentorship management through transparent algorithmic allocation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-[#FFF9F0] border border-[#EAE2D8] space-y-3 hover:border-[#5478D4]/40 hover:bg-white transition-all shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#FFF4E6] text-[#F07857] flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-[#202C45]">Need-First Priority</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Students struggling across multiple core courses are scheduled first, guaranteeing attention where it has the highest academic impact.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-[#FFF9F0] border border-[#EAE2D8] space-y-3 hover:border-[#5478D4]/40 hover:bg-white transition-all shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#E5EDFC] text-[#5478D4] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-[#202C45]">Strict Quota Defense</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Faculty advisors and senior student guides specify hard workload limits. Mentora guarantees zero quota breaches under any batch load.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-[#FFF9F0] border border-[#EAE2D8] space-y-3 hover:border-[#5478D4]/40 hover:bg-white transition-all shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#FFF4E6] text-[#DE6240] flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-[#202C45]">Real Availability Match</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Pairs require at least one mutual open timetable window, eliminating endless scheduling emails and calendar coordination deadlocks.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-2xl bg-[#FFF9F0] border border-[#EAE2D8] space-y-3 hover:border-[#5478D4]/40 hover:bg-white transition-all shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#E5EDFC] text-[#63AFA3] flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-[#202C45]">Bipartite Network Graph</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Interactive graph visualizer shows full relationship topology, compatibility edges, and step-by-step BFS exploratory traces.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 100-POINT COMPATIBILITY MODEL SECTION */}
        <section id="matching-model" className="py-20 px-6 lg:px-12 bg-[#FFF9F0] border-b border-[#EAE2D8]">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#5478D4] font-bold">
                MATHEMATICAL FOUNDATION
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#202C45] tracking-tight">
                The 100-Point Compatibility Score
              </h2>
              <p className="text-sm text-[#64748B]">
                Mentora evaluates every student against all active advisors using four weighted pillars. Every match is explainable down to each individual component.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Criterion 1 */}
              <div className="p-6 rounded-2xl bg-white border border-[#EAE2D8] shadow-xs space-y-3 relative overflow-hidden">
                <div className="text-3xl font-heading font-black text-[#F07857] tabular-nums">40 pts</div>
                <h4 className="font-heading text-base font-bold text-[#202C45]">Subject Expertise</h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Measures the fraction of the student&apos;s declared weak subjects covered by the mentor&apos;s proven domain competency.
                </p>
                <div className="text-[11px] font-mono text-[#64748B] bg-[#FFF9F0] p-2 rounded-lg border border-[#EAE2D8]">
                  (Covered / Total Weak) &times; 40
                </div>
              </div>

              {/* Criterion 2 */}
              <div className="p-6 rounded-2xl bg-white border border-[#EAE2D8] shadow-xs space-y-3 relative overflow-hidden">
                <div className="text-3xl font-heading font-black text-[#DE6240] tabular-nums">25 pts</div>
                <h4 className="font-heading text-base font-bold text-[#202C45]">Shared Interests</h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Rewards common research passions, engineering domains, and technology stacks to spark natural rapport.
                </p>
                <div className="text-[11px] font-mono text-[#64748B] bg-[#FFF9F0] p-2 rounded-lg border border-[#EAE2D8]">
                  (Shared / Mentee Interests) &times; 25
                </div>
              </div>

              {/* Criterion 3 */}
              <div className="p-6 rounded-2xl bg-white border border-[#EAE2D8] shadow-xs space-y-3 relative overflow-hidden">
                <div className="text-3xl font-heading font-black text-[#5478D4] tabular-nums">20 pts</div>
                <h4 className="font-heading text-base font-bold text-[#202C45]">Time Slot Availability</h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Evaluates common weekly timetable blocks. Minimum 1 mutual block required to avoid allocation failure.
                </p>
                <div className="text-[11px] font-mono text-[#64748B] bg-[#FFF9F0] p-2 rounded-lg border border-[#EAE2D8]">
                  (Common / Mentee Slots) &times; 20
                </div>
              </div>

              {/* Criterion 4 */}
              <div className="p-6 rounded-2xl bg-white border border-[#EAE2D8] shadow-xs space-y-3 relative overflow-hidden">
                <div className="text-3xl font-heading font-black text-[#63AFA3] tabular-nums">15 pts</div>
                <h4 className="font-heading text-base font-bold text-[#202C45]">Workload Balance</h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Incentivizes assigning mentors with higher remaining capacity to protect faculty from uneven workload concentration.
                </p>
                <div className="text-[11px] font-mono text-[#64748B] bg-[#FFF9F0] p-2 rounded-lg border border-[#EAE2D8]">
                  (Remaining / Max Quota) &times; 15
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BIPARTITE NETWORK PREVIEW */}
        <section id="network-preview" className="py-20 px-6 lg:px-12 bg-white border-b border-[#EAE2D8]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-mono uppercase tracking-widest text-[#F07857] font-bold">
                GRAPH TOPOLOGY
              </span>
              <h2 className="font-heading text-3xl font-extrabold text-[#202C45] tracking-tight">
                Modeled as a Weighted Bipartite Graph
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                The mentorship ecosystem is mapped as <span className="font-mono font-bold text-[#202C45]">G = (U, V, E)</span> where <span className="font-mono text-[#F07857]">U</span> is the set of students, <span className="font-mono text-[#5478D4]">V</span> is the set of mentors, and edges <span className="font-mono text-[#202C45]">E</span> carry compatibility weights.
              </p>
              <div className="space-y-2.5 text-xs text-[#202C45]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F07857]" />
                  <span>Mentees partitioned on left axis (ranked by need)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#5478D4]" />
                  <span>Advisors partitioned on right axis with capacity gauges</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#63AFA3]" />
                  <span>Interactive BFS exploration highlights connected paths</span>
                </div>
              </div>
              <button
                onClick={handleGetStarted}
                className="px-5 py-2.5 rounded-xl bg-[#5478D4] hover:bg-[#3E61BF] text-white font-bold text-xs transition flex items-center gap-2 shadow-xs"
              >
                <span>Open Graph Visualizer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="lg:col-span-7 bg-[#FFF9F0] p-6 rounded-2xl border border-[#EAE2D8] shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE2D8] text-xs">
                <span className="font-heading font-bold text-[#202C45]">Sample Graph Topology (Live Preview)</span>
                <span className="text-[#64748B] font-mono text-[11px]">Bipartite G=(U,V,E)</span>
              </div>
              <div className="py-6 flex items-center justify-between gap-4">
                {/* Students Column */}
                <div className="space-y-2 flex-1">
                  <div className="text-[10px] font-mono text-[#F07857] uppercase font-bold text-center">STUDENTS (U)</div>
                  {['Aarav Sharma', 'Priya Patel', 'Rohan Verma', 'Ananya Iyer'].map((name, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-white border border-[#EAE2D8] text-xs text-[#202C45] font-semibold text-center shadow-2xs">
                      {name}
                    </div>
                  ))}
                </div>

                {/* Flow Indicators */}
                <div className="space-y-4 px-2 text-center">
                  <div className="w-12 h-0.5 bg-[#F07857]/40 mx-auto" />
                  <div className="w-16 h-0.5 bg-[#5478D4]/60 mx-auto" />
                  <div className="w-14 h-0.5 bg-[#63AFA3]/50 mx-auto" />
                  <div className="w-12 h-0.5 bg-[#F3C969]/60 mx-auto" />
                </div>

                {/* Mentors Column */}
                <div className="space-y-2 flex-1">
                  <div className="text-[10px] font-mono text-[#5478D4] uppercase font-bold text-center">ADVISORS (V)</div>
                  {['Dr. Rajesh Verma', 'Prof. Sunita Rao', 'Kavita Sen', 'Vikramaditya'].map((name, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-white border border-[#EAE2D8] text-xs text-[#202C45] font-semibold text-center shadow-2xs">
                      {name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* READY TO BEGIN CTA */}
        <section className="py-20 px-6 lg:px-12 bg-gradient-to-br from-[#FFF9F0] via-white to-[#F9E3D9]/40 border-b border-[#EAE2D8] text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white border border-[#EAE2D8] shadow-xs text-[#F07857]">
              <OpenBookMotif className="w-16 h-10" />
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#202C45] tracking-tight">
              Ready to Modernize Your Mentorship Program?
            </h2>

            <p className="text-sm sm:text-base text-[#64748B] max-w-xl mx-auto leading-relaxed">
              Launch Mentora to import student rosters, register faculty capacities, and run greedy heuristic matching in seconds.
            </p>

            <div className="pt-2">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 rounded-xl bg-[#F07857] hover:bg-[#DE6240] text-white font-bold text-sm transition inline-flex items-center gap-2.5 shadow-md hover:shadow-lg active:scale-95"
              >
                <span>Launch Mentorship Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-[#EAE2D8] px-6 lg:px-12 py-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#64748B]">
          <div className="flex items-center gap-3">
            <Logo size="sm" showSubtitle={false} />
            <span>&copy; 2026 MENTORA Operations Platform. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <a href="#how-it-works" className="hover:text-[#202C45] transition">Documentation</a>
            <a href="#matching-model" className="hover:text-[#202C45] transition">Scoring Model</a>
            <a href="#network-preview" className="hover:text-[#202C45] transition">Network Graph</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
