import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Eye,
  Cpu,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SmartAllocationPage: React.FC = () => {
  const {
    students,
    mentors,
    allocations,
    lastBatchRun,
    runAllocation,
    resetAllocations,
    settings,
  } = useApp();

  const [useMaxHeap, setUseMaxHeap] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedStepModal, setSelectedStepModal] = useState<number | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const unallocatedStudents = students.filter(s => s.allocation_status !== 'Allocated');
  const availableMentors = mentors.filter(m => m.current_load < m.max_capacity);
  const totalRemainingCapacity = mentors.reduce(
    (acc, m) => acc + Math.max(0, m.max_capacity - m.current_load),
    0
  );

  const handleExecuteAllocation = () => {
    setIsExecuting(true);
    setTimeout(() => {
      const result = runAllocation(useMaxHeap);
      setIsExecuting(false);

      if (result.successful_allocations.length > 0) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#F07857', '#5478D4', '#F3C969', '#63AFA3'],
          });
        } catch {
          // ignore
        }
      }
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Algorithm Parameter Status */}
      <div className="bg-white rounded-3xl border border-[#EAE2D8] p-5 lg:p-7 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-5 border-b border-[#EAE2D8]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5EDFC] text-[#5478D4] text-xs font-semibold mb-2">
              <Cpu className="w-3.5 h-3.5 text-[#5478D4]" />
              <span className="font-mono uppercase tracking-wider text-[11px]">GREEDY HEURISTIC SOLVER</span>
            </div>
            <h2 className="font-heading text-xl lg:text-3xl font-extrabold text-[#202C45] tracking-tight">
              Smart Matching Engine
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-2xl leading-relaxed">
              Prioritizes students with the highest number of challenge subjects. Dynamically evaluates all 4 scoring components: Subject Match (40 pts), Shared Interests (25 pts), Schedule Overlap (20 pts), and Workload Balance (15 pts).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {allocations.length > 0 && (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FFF9F0] border border-[#EAE2D8] text-[#202C45] font-bold text-xs transition flex items-center gap-2 shadow-2xs hover:border-[#64748B]"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Reset Allocations</span>
              </button>
            )}

            <button
              onClick={handleExecuteAllocation}
              disabled={isExecuting || unallocatedStudents.length === 0}
              className="px-6 py-3 rounded-xl bg-[#F07857] hover:bg-[#DE6240] text-white font-bold text-xs transition flex items-center gap-2 shadow-sm hover:shadow active:scale-95 disabled:opacity-40"
            >
              {isExecuting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Computing Optimal Matches...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Run Smart Matching ({unallocatedStudents.length} Students)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Operational Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-2xl bg-[#FFF9F0] border border-[#EAE2D8]">
            <div className="text-[10px] font-mono uppercase text-[#64748B] font-bold">Awaiting Mentees</div>
            <div className="text-2xl font-heading font-black text-[#F07857] mt-1 tabular-nums">
              {unallocatedStudents.length}
            </div>
            <div className="text-[11px] text-[#64748B] mt-0.5">In intake queue</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9F0] border border-[#EAE2D8]">
            <div className="text-[10px] font-mono uppercase text-[#64748B] font-bold">Available Mentors</div>
            <div className="text-2xl font-heading font-black text-[#5478D4] mt-1 tabular-nums">
              {availableMentors.length} / {mentors.length}
            </div>
            <div className="text-[11px] text-[#64748B] mt-0.5">With open capacity</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9F0] border border-[#EAE2D8]">
            <div className="text-[10px] font-mono uppercase text-[#64748B] font-bold">Available Quota</div>
            <div className="text-2xl font-heading font-black text-[#63AFA3] mt-1 tabular-nums">
              {totalRemainingCapacity}
            </div>
            <div className="text-[11px] text-[#64748B] mt-0.5">Remaining slots</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9F0] border border-[#EAE2D8]">
            <div className="text-[10px] font-mono uppercase text-[#64748B] font-bold">Score Cutoff</div>
            <div className="text-2xl font-heading font-black text-[#202C45] mt-1 tabular-nums">
              {settings.min_score_threshold}
              <span className="text-xs font-semibold text-[#64748B] ml-1">/100</span>
            </div>
            <div className="text-[11px] text-[#64748B] mt-0.5">Min eligibility</div>
          </div>
        </div>

        {/* Algorithm Strategy Switcher */}
        <div className="p-4 rounded-2xl bg-[#FFF9F0] border border-[#EAE2D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white border border-[#EAE2D8] text-[#5478D4] flex items-center justify-center font-bold text-xs shadow-2xs">
              DSA
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-[#202C45]">
                Candidate Ranking Strategy
              </div>
              <div className="text-[11px] text-[#64748B]">
                {useMaxHeap
                  ? 'Active: Max Heap Priority Queue (O(log k) root extraction)'
                  : 'Active: Merge Sort (O(k log k) stable descending sort)'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#EAE2D8] shadow-2xs">
            <button
              onClick={() => setUseMaxHeap(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                !useMaxHeap ? 'bg-[#5478D4] text-white shadow-2xs' : 'text-[#64748B] hover:text-[#202C45]'
              }`}
            >
              Merge Sort
            </button>
            <button
              onClick={() => setUseMaxHeap(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                useMaxHeap ? 'bg-[#5478D4] text-white shadow-2xs' : 'text-[#64748B] hover:text-[#202C45]'
              }`}
            >
              Max Heap
            </button>
          </div>
        </div>
      </div>

      {/* Execution Timeline / Results Trace */}
      {lastBatchRun ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-base font-extrabold text-[#202C45]">
                Algorithm Execution Timeline ({lastBatchRun.execution_steps.length} Steps)
              </h3>
              <p className="text-xs text-[#64748B]">
                Step-by-step greedy selections with instantaneous advisor capacity updates.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#63AFA3] bg-[#E5EDFC] px-3 py-1 rounded-lg border border-[#63AFA3]/30">
                {lastBatchRun.successful_allocations.length} Matched
              </span>
              {lastBatchRun.unallocated_students.length > 0 && (
                <span className="text-xs font-bold text-[#F07857] bg-[#FFF4E6] px-3 py-1 rounded-lg border border-[#F07857]/30">
                  {lastBatchRun.unallocated_students.length} Unallocated
                </span>
              )}
            </div>
          </div>

          {/* Timeline steps cards */}
          <div className="space-y-3">
            {lastBatchRun.execution_steps.map(step => {
              const isMatched = !!step.selected_mentor;

              return (
                <div
                  key={step.step_number}
                  className={`bg-white rounded-2xl border p-4 transition shadow-xs ${
                    isMatched ? 'border-[#EAE2D8]' : 'border-[#F07857]/30 bg-[#FFF4E6]/20'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                          isMatched
                            ? 'bg-[#E5EDFC] text-[#5478D4] border border-[#5478D4]/20'
                            : 'bg-[#FFF4E6] text-[#F07857] border border-[#F07857]/30'
                        }`}
                      >
                        #{step.step_number}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-sm text-[#202C45]">
                            {step.student.name}
                          </span>
                          <span className="text-[10px] font-mono text-[#64748B] bg-[#FFF9F0] px-2 py-0.5 rounded border border-[#EAE2D8]">
                            {step.student.student_id}
                          </span>
                          <span className="text-[10px] font-bold text-[#F07857] bg-[#FFF4E6] px-2 py-0.5 rounded-md border border-[#F07857]/20">
                            {step.student.weak_subjects.length} Needs
                          </span>
                        </div>

                        <div className="text-xs text-[#64748B] mt-1">
                          Struggling with: <span className="font-semibold text-[#202C45]">{step.student.weak_subjects.join(', ')}</span>
                        </div>

                        <p className="text-xs text-[#202C45] mt-2 flex items-center gap-2">
                          {isMatched ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-[#63AFA3] shrink-0 stroke-[2.5]" />
                              <span>{step.decision_rationale}</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 text-[#F07857] shrink-0" />
                              <span className="text-[#F07857]">{step.decision_rationale}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end lg:self-auto">
                      {isMatched && (
                        <div className="text-right">
                          <span className="text-xs font-heading font-black text-[#5478D4] bg-[#E5EDFC] border border-[#5478D4]/20 px-3 py-1 rounded-lg inline-block tabular-nums shadow-2xs">
                            {step.selected_score} pts
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => setSelectedStepModal(step.step_number)}
                        className="px-3.5 py-2 rounded-xl border border-[#EAE2D8] bg-white hover:bg-[#FFF9F0] text-[#202C45] text-xs font-bold transition flex items-center gap-1.5 shadow-2xs hover:border-[#5478D4]"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#5478D4]" />
                        <span>Candidate Matrix</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#EAE2D8] p-12 text-center space-y-3 shadow-xs">
          <Cpu className="w-10 h-10 text-[#5478D4] mx-auto opacity-50" />
          <h3 className="font-heading text-sm font-bold text-[#202C45]">No Allocation Run Recorded</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            Click &quot;Run Smart Matching&quot; above to solve student-mentor assignments and trace candidate evaluations.
          </p>
        </div>
      )}

      {/* Candidate Matrix Modal for a specific step */}
      {selectedStepModal !== null && lastBatchRun && (() => {
        const step = lastBatchRun.execution_steps.find(s => s.step_number === selectedStepModal);
        if (!step) return null;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202C45]/40 backdrop-blur-xs">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#EAE2D8] p-6 space-y-5 text-[#202C45]">
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE2D8]">
                <div>
                  <h3 className="font-heading text-base font-extrabold text-[#202C45]">
                    Step #{step.step_number}: Candidate Comparison Matrix
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Evaluating all mentors for student: <strong>{step.student.name}</strong> ({step.student.student_id})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedStepModal(null)}
                  className="px-3.5 py-1.5 rounded-xl border border-[#EAE2D8] bg-[#FFF9F0] text-xs font-bold text-[#64748B] hover:text-[#202C45]"
                >
                  Close
                </button>
              </div>

              {/* Table of evaluated candidate mentors */}
              <div className="overflow-x-auto rounded-2xl border border-[#EAE2D8]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FFF9F0] text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
                    <tr>
                      <th className="px-4 py-3 font-bold">Advisor Candidate</th>
                      <th className="px-3 py-3 font-bold">Subj (40)</th>
                      <th className="px-3 py-3 font-bold">Int (25)</th>
                      <th className="px-3 py-3 font-bold">Avail (20)</th>
                      <th className="px-3 py-3 font-bold">Work (15)</th>
                      <th className="px-3 py-3 text-[#5478D4] font-bold">Total (100)</th>
                      <th className="px-4 py-3 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE2D8]">
                    {step.evaluated_candidates.map(cand => {
                      const isChosen = step.selected_mentor?.mentor_id === cand.mentor.mentor_id;

                      return (
                        <tr
                          key={cand.mentor.mentor_id}
                          className={`hover:bg-[#FFF9F0]/60 transition ${
                            isChosen ? 'bg-[#E5EDFC]/40 font-semibold' : ''
                          }`}
                        >
                          <td className="px-4 py-3">
                            <div className="font-heading font-bold text-[#202C45] flex items-center gap-1.5">
                              <span>{cand.mentor.name}</span>
                              {isChosen && (
                                <span className="text-[10px] font-bold bg-[#5478D4] text-white px-2 py-0.5 rounded-md">
                                  SELECTED
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] font-mono text-[#64748B]">
                              {cand.mentor.mentor_id} · Load: {cand.mentor.current_load}/{cand.mentor.max_capacity}
                            </div>
                          </td>

                          <td className="px-3 py-3 font-heading font-semibold text-[#202C45] tabular-nums">{cand.score_breakdown.subject_score}</td>
                          <td className="px-3 py-3 font-heading font-semibold text-[#64748B] tabular-nums">{cand.score_breakdown.interest_score}</td>
                          <td className="px-3 py-3 font-heading font-semibold text-[#64748B] tabular-nums">{cand.score_breakdown.availability_score}</td>
                          <td className="px-3 py-3 font-heading font-semibold text-[#64748B] tabular-nums">{cand.score_breakdown.workload_score}</td>

                          <td className="px-3 py-3 font-heading font-black text-xs text-[#5478D4] tabular-nums">
                            {cand.score_breakdown.total_score}
                          </td>

                          <td className="px-4 py-3">
                            {cand.is_eligible ? (
                              <span className="text-[10px] font-bold text-[#63AFA3] bg-[#E5EDFC] px-2.5 py-0.5 rounded-md border border-[#63AFA3]/30">
                                Eligible
                              </span>
                            ) : (
                              <span
                                className="text-[10px] font-medium text-[#F07857] bg-[#FFF4E6] px-2 py-0.5 rounded-md"
                                title={cand.ineligibility_reasons.join('; ')}
                              >
                                Rejected: {cand.ineligibility_reasons[0]}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Confirm Reset Dialog */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202C45]/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-xl max-w-sm w-full p-6 border border-[#EAE2D8] text-center space-y-4 text-[#202C45]">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF4E6] text-[#F07857] flex items-center justify-center mx-auto border border-[#F07857]/30">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-[#202C45]">Reset Allocations?</h3>
              <p className="text-xs text-[#64748B] mt-1">
                Resets all mentees to &quot;Unallocated&quot; and mentor loads to 0 to re-run the matching experiment.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 rounded-xl border border-[#EAE2D8] bg-[#FFF9F0] text-[#64748B] text-xs font-semibold hover:bg-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAllocations();
                  setShowConfirmReset(false);
                }}
                className="px-5 py-2 rounded-xl bg-[#F07857] hover:bg-[#DE6240] text-white text-xs font-bold transition shadow-xs"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
