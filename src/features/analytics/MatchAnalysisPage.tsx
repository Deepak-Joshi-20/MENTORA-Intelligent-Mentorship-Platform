import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { binarySearchMentorById } from '../../algorithms/searching/searchAlgorithms';
import { mergeSortCandidates, SortTraceStep } from '../../algorithms/sorting/mergeSort';
import { MaxHeapCandidates, HeapTraceStep } from '../../algorithms/heap/maxHeap';
import { calculateMatchScore } from '../../algorithms/matching/scoringEngine';
import {
  Cpu,
  Search,
  ArrowUpDown,
  Layers,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Code2,
} from 'lucide-react';

export const MatchAnalysisPage: React.FC = () => {
  const { students, mentors } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'sorting' | 'searching' | 'heap' | 'greedy'>('overview');

  // Binary search interactive states
  const sortedMentors = [...mentors].sort((a, b) => a.mentor_id.localeCompare(b.mentor_id));
  const [binarySearchTarget, setBinarySearchTarget] = useState(sortedMentors[0]?.mentor_id || 'MTR-201');
  const [binarySearchTrace, setBinarySearchTrace] = useState<any[]>([]);
  const [binarySearchResult, setBinarySearchResult] = useState<any>(null);

  const runInteractiveBinarySearch = () => {
    const trace: any[] = [];
    const res = binarySearchMentorById(sortedMentors, binarySearchTarget, trace);
    setBinarySearchTrace(trace);
    setBinarySearchResult(res);
  };

  // Merge sort interactive states
  const sampleStudent = students[0];
  const sampleEvaluations = mentors.map(m =>
    calculateMatchScore(
      sampleStudent?.weak_subjects || ['Data Structures & Algorithms'],
      sampleStudent?.interests || ['Competitive Programming'],
      sampleStudent?.free_slots || ['Mon 10:00-12:00'],
      m,
      50
    )
  );
  const [sortTrace, setSortTrace] = useState<SortTraceStep[]>([]);

  const runInteractiveMergeSort = () => {
    const trace: SortTraceStep[] = [];
    mergeSortCandidates(sampleEvaluations, trace);
    setSortTrace(trace);
  };

  // Max Heap interactive states
  const [heapTrace, setHeapTrace] = useState<HeapTraceStep[]>([]);
  const [heapExtracted, setHeapExtracted] = useState<any>(null);

  const runInteractiveHeap = () => {
    const heap = new MaxHeapCandidates(sampleEvaluations, true);
    const extracted = heap.extractMax(true);
    setHeapTrace([...heap.trace]);
    setHeapExtracted(extracted);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#EAE2D8] p-5 lg:p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-[#E5EDFC] border border-[#5478D4]/20 text-[#5478D4] flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#202C45] tracking-tight">
              Algorithm Insights & Complexity Lab
            </h2>
            <p className="text-xs text-[#202C45]/70">
              Interactive execution tracers and theoretical asymptotic profiling for the core matching algorithms.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-[#EAE2D8]">
          {[
            { id: 'overview', label: '1. Theoretical Framework & Mapping', icon: BookOpen },
            { id: 'sorting', label: '2. Merge Sort (Candidate Ranking)', icon: ArrowUpDown },
            { id: 'searching', label: '3. Binary & Linear Search', icon: Search },
            { id: 'heap', label: '4. Max Heap Priority Queue', icon: Layers },
            { id: 'greedy', label: '5. Greedy Heuristic Analysis', icon: Sparkles },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#5478D4] text-white shadow-xs'
                    : 'bg-[#FFF9F0] text-[#202C45]/70 border border-[#EAE2D8] hover:text-[#202C45] hover:bg-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Theoretical Overview & Mapping Table */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-2xl border border-[#EAE2D8] p-5 lg:p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-heading text-base font-bold text-[#202C45]">
              Concept Mapping & Asymptotic Complexity
            </h3>
            <p className="text-xs text-[#202C45]/70 mt-0.5 leading-relaxed">
              Every data structure and algorithm in MENTORA maps to a concrete operational requirement of the student-mentor matching pipeline.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#EAE2D8]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF9F0] text-[10px] font-mono uppercase tracking-wider text-[#202C45]/70 border-b border-[#EAE2D8]">
                <tr>
                  <th className="px-4 py-3">Concept</th>
                  <th className="px-4 py-3">Concrete System Role</th>
                  <th className="px-4 py-3">Time Complexity</th>
                  <th className="px-4 py-3">Aux Space</th>
                  <th className="px-4 py-3">Technical Justification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE2D8]">
                <tr className="hover:bg-[#FFF4E6]/40 transition">
                  <td className="px-4 py-3 font-bold text-[#202C45]">Dynamic Arrays</td>
                  <td className="px-4 py-3 text-[#202C45]/80">Contiguous in-memory storage of candidate evaluations</td>
                  <td className="px-4 py-3 font-mono text-[#5478D4] font-bold">O(1) access</td>
                  <td className="px-4 py-3 font-mono text-[#202C45]/60">O(n)</td>
                  <td className="px-4 py-3 text-[#202C45]/70 text-[11px]">Cache-friendly memory layout enables fast sequential scanning across mentor rosters.</td>
                </tr>
                <tr className="hover:bg-[#FFF4E6]/40 transition">
                  <td className="px-4 py-3 font-bold text-[#202C45]">Linear Search</td>
                  <td className="px-4 py-3 text-[#202C45]/80">Multi-clause filtering (capacity &gt; 0, slot overlap &gt;= 1)</td>
                  <td className="px-4 py-3 font-mono text-[#F07857] font-bold">O(m)</td>
                  <td className="px-4 py-3 font-mono text-[#202C45]/60">O(1)</td>
                  <td className="px-4 py-3 text-[#202C45]/70 text-[11px]">Unsorted mentor evaluations must be checked sequentially for multi-clause eligibility.</td>
                </tr>
                <tr className="hover:bg-[#FFF4E6]/40 transition">
                  <td className="px-4 py-3 font-bold text-[#202C45]">Binary Search</td>
                  <td className="px-4 py-3 text-[#202C45]/80">Direct O(log m) mentor record lookup by ID in sorted roster</td>
                  <td className="px-4 py-3 font-mono text-[#5478D4] font-bold">O(log m)</td>
                  <td className="px-4 py-3 font-mono text-[#202C45]/60">O(1)</td>
                  <td className="px-4 py-3 text-[#202C45]/70 text-[11px]">Halves the search space at each iteration when retrieving faculty credentials by unique identifier.</td>
                </tr>
                <tr className="hover:bg-[#FFF4E6]/40 transition">
                  <td className="px-4 py-3 font-bold text-[#202C45]">Merge Sort</td>
                  <td className="px-4 py-3 text-[#202C45]/80">Deterministic ranking of eligible mentors by computed score</td>
                  <td className="px-4 py-3 font-mono text-[#F07857] font-bold">O(k log k)</td>
                  <td className="px-4 py-3 font-mono text-[#202C45]/60">O(k)</td>
                  <td className="px-4 py-3 text-[#202C45]/70 text-[11px]">Guarantees stable sorting and prevents degradation to O(n²) worst-case performance under duplicate scores.</td>
                </tr>
                <tr className="hover:bg-[#FFF4E6]/40 transition">
                  <td className="px-4 py-3 font-bold text-[#202C45]">Max Heap</td>
                  <td className="px-4 py-3 text-[#202C45]/80">Priority Queue for immediate extraction of top matching mentor</td>
                  <td className="px-4 py-3 font-mono text-[#63AFA3] font-bold">O(log k) extract</td>
                  <td className="px-4 py-3 font-mono text-[#202C45]/60">O(k)</td>
                  <td className="px-4 py-3 text-[#202C45]/70 text-[11px]">Maintains the maximum score element at the root node without requiring complete array re-sorting.</td>
                </tr>
                <tr className="hover:bg-[#FFF4E6]/40 transition">
                  <td className="px-4 py-3 font-bold text-[#202C45]">Bipartite Graph</td>
                  <td className="px-4 py-3 text-[#202C45]/80">Models disjoint sets: Mentees (U) and Mentors (V) with weighted edges</td>
                  <td className="px-4 py-3 font-mono text-[#F3C969] font-bold">G = (U, V, E)</td>
                  <td className="px-4 py-3 font-mono text-[#202C45]/60">O(|V| + |E|)</td>
                  <td className="px-4 py-3 text-[#202C45]/70 text-[11px]">Accurately represents dual-partition network topology with weighted compatibility connections.</td>
                </tr>
                <tr className="hover:bg-[#FFF4E6]/40 transition">
                  <td className="px-4 py-3 font-bold text-[#202C45]">BFS Traversal</td>
                  <td className="px-4 py-3 text-[#202C45]/80">Level-order discovery of reachable mentor clusters and pathways</td>
                  <td className="px-4 py-3 font-mono text-[#5478D4] font-bold">O(|V| + |E|)</td>
                  <td className="px-4 py-3 font-mono text-[#202C45]/60">O(|V|)</td>
                  <td className="px-4 py-3 text-[#202C45]/70 text-[11px]">Finds shortest unweighted connectivity paths between any selected student and all compatible mentors.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Sorting */}
      {activeTab === 'sorting' && (
        <div className="bg-white rounded-2xl border border-[#EAE2D8] p-5 lg:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading text-base font-bold text-[#202C45]">
                Merge Sort: Candidate Ranking by Match Score
              </h3>
              <p className="text-xs text-[#202C45]/70">
                Divide-and-conquer algorithm to sort candidate mentors in descending order of total compatibility score.
              </p>
            </div>

            <button
              onClick={runInteractiveMergeSort}
              className="px-4 py-2 rounded-xl bg-[#5478D4] hover:bg-[#4367be] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-2"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Execute Merge Sort Trace</span>
            </button>
          </div>

          {sortTrace.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono font-bold text-[#202C45] block">
                Merge Steps Log ({sortTrace.length} operations):
              </span>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {sortTrace.map(st => (
                  <div key={st.step} className="p-3.5 rounded-xl bg-[#FFF9F0] border border-[#EAE2D8] text-xs space-y-1.5">
                    <div className="font-bold text-[#5478D4] font-mono flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#E5EDFC] text-[10px]">Step {st.step}</span>
                      <span>{st.description}</span>
                    </div>
                    <div className="font-mono text-[11px] text-[#202C45]/80 bg-white p-2 rounded-lg border border-[#EAE2D8]">
                      [{st.mergedArray.map(m => `${m.name}: ${m.score} pts`).join(' | ')}]
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Searching */}
      {activeTab === 'searching' && (
        <div className="bg-white rounded-2xl border border-[#EAE2D8] p-5 lg:p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-heading text-base font-bold text-[#202C45]">
              Binary Search: O(log m) Mentor ID Lookup
            </h3>
            <p className="text-xs text-[#202C45]/70">
              Searches the sorted mentor roster by repeatedly testing the mid-index target.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={binarySearchTarget}
              onChange={e => setBinarySearchTarget(e.target.value)}
              className="px-3.5 py-2 bg-[#FFF9F0] border border-[#EAE2D8] rounded-xl text-xs font-semibold text-[#202C45] focus:outline-none focus:border-[#5478D4]"
            >
              {sortedMentors.map(m => (
                <option key={m.mentor_id} value={m.mentor_id}>
                  Target: {m.mentor_id} ({m.name})
                </option>
              ))}
            </select>

            <button
              onClick={runInteractiveBinarySearch}
              className="px-4 py-2 rounded-xl bg-[#5478D4] hover:bg-[#4367be] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-2"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Execute Binary Search</span>
            </button>
          </div>

          {binarySearchTrace.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono font-bold text-[#202C45] block">
                Search Iterations ({binarySearchResult?.stepsCount} comparisons):
              </span>
              <div className="space-y-2">
                {binarySearchTrace.map(st => (
                  <div key={st.step} className="p-3 rounded-xl bg-[#FFF9F0] border border-[#EAE2D8] text-xs flex items-center justify-between font-mono">
                    <div className="text-[#202C45]/80">
                      <span className="text-[#202C45] font-bold">Step #{st.step}:</span>{' '}
                      Range [low: {st.low}, high: {st.high}] &rarr; Mid: <strong className="text-[#5478D4]">{st.mid}</strong> ({st.midMentorId})
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${
                      st.action === 'Match Found' ? 'bg-[#63AFA3]/20 text-[#63AFA3]' : 'bg-[#EAE2D8] text-[#202C45]/70'
                    }`}>
                      {st.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Max Heap */}
      {activeTab === 'heap' && (
        <div className="bg-white rounded-2xl border border-[#EAE2D8] p-5 lg:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading text-base font-bold text-[#202C45]">
                Max Heap / Priority Queue
              </h3>
              <p className="text-xs text-[#202C45]/70">
                Maintains highest-scoring mentor candidate at root with O(log k) heapify-up on insertion and heapify-down on extraction.
              </p>
            </div>

            <button
              onClick={runInteractiveHeap}
              className="px-4 py-2 rounded-xl bg-[#5478D4] hover:bg-[#4367be] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-2"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Build Heap & Extract Max</span>
            </button>
          </div>

          {heapExtracted && (
            <div className="p-4 rounded-xl bg-[#63AFA3]/10 border border-[#63AFA3]/30 text-xs font-mono">
              <span className="text-[10px] uppercase text-[#63AFA3] block font-bold tracking-wider">
                Root Max Candidate Extracted:
              </span>
              <div className="text-sm font-bold text-[#202C45] mt-1 font-heading">
                {heapExtracted.mentor.name} ({heapExtracted.mentor.mentor_id}) — Total Score: <span className="text-[#63AFA3] font-black">{heapExtracted.score_breakdown.total_score} pts</span>
              </div>
            </div>
          )}

          {heapTrace.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono font-bold text-[#202C45] block">
                Heap Operations Trace:
              </span>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {heapTrace.map((ht, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#FFF9F0] border border-[#EAE2D8] text-xs font-mono">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#F07857] uppercase text-[9px] bg-[#F9E3D9] px-2 py-0.5 rounded font-bold">
                        {ht.operation}
                      </span>
                      <span className="text-[#202C45] font-semibold">{ht.description}</span>
                    </div>
                    <div className="text-[11px] text-[#202C45]/70 bg-white p-2 rounded-lg border border-[#EAE2D8] mt-1">
                      Heap State: [{ht.heapSnapshot.map(s => `${s.name}: ${s.score}`).join(', ')}]
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Greedy Heuristic Analysis */}
      {activeTab === 'greedy' && (
        <div className="bg-white rounded-2xl border border-[#EAE2D8] p-5 lg:p-6 shadow-xs space-y-5">
          <h3 className="font-heading text-base font-bold text-[#202C45]">
            Greedy Heuristic Architecture & Optimization Analysis
          </h3>
          <div className="text-xs text-[#202C45]/80 space-y-4 leading-relaxed">
            <div className="p-4 rounded-xl bg-[#FFF9F0] border border-[#EAE2D8] space-y-1.5">
              <strong className="text-[#202C45] text-sm font-heading block">
                1. Why Prioritize Students with the Most Weak Subjects?
              </strong>
              <p>
                Students requiring guidance in multiple subjects have the most constrained eligibility pool because their mentors must have broader domain expertise. Allocating them first prevents mentors with versatile expertise from being exhausted by single-subject students early on.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FFF9F0] border border-[#EAE2D8] space-y-1.5">
              <strong className="text-[#202C45] text-sm font-heading block">
                2. The Local Optimum vs. Global Optimum Trade-off:
              </strong>
              <p>
                The greedy algorithm chooses the highest-scoring eligible mentor at each step. While this runs in near-instantaneous polynomial time <code>O(n · m log m)</code>, it is a heuristic. In rare theoretical edge cases, an earlier greedy choice might prevent a subsequent match from achieving an overall globally higher sum. However, for university mentorship, live dynamic assignment with explainable reasoning is heavily preferred over opaque global maximum network flow.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FFF9F0] border border-[#EAE2D8] space-y-1.5">
              <strong className="text-[#202C45] text-sm font-heading block">
                3. Real-Time Capacity Balancing:
              </strong>
              <p>
                Every time a mentor is assigned, their remaining capacity diminishes, which immediately reduces their <em>Workload Score</em> (15 pts max) for subsequent students, naturally steering other students to less burdened mentors!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
