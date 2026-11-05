import {
  Student,
  Mentor,
  AllocationResult,
  UnallocatedReason,
  AllocationBatchRun,
  ExecutionStep,
  CandidateEvaluation,
} from '../../types';
import { calculateMatchScore } from '../matching/scoringEngine';
import { linearSearchEligibleMentors } from '../searching/searchAlgorithms';
import { mergeSortCandidates } from '../sorting/mergeSort';
import { MaxHeapCandidates } from '../heap/maxHeap';

export interface AllocationEngineOptions {
  minScoreThreshold?: number; // default 50
  useMaxHeap?: boolean;       // default false (uses merge sort candidate ranking or max heap)
  prioritizeWeakSubjectsCount?: boolean; // default true
}

/**
 * Executes the Greedy Allocation Algorithm as specified in Progress Report II:
 *
 * 1. Process mentees in priority order (prioritize mentees with the greatest number of weak subjects).
 * 2. For each mentee:
 *    - Calculate scores for all mentors (Subject: 40, Interest: 25, Availability: 20, Workload: 15).
 *    - Filter ineligible mentors (no capacity, zero common slots, score < threshold) using Linear Search.
 *    - Sort eligible candidates by descending score using Merge Sort or Max Heap priority queue.
 *    - Select the highest-scoring eligible available mentor (locally optimal greedy choice).
 *    - Update mentor load immediately (current_load++).
 * 3. Handle ties deterministically (remaining capacity then mentor_id).
 * 4. Record step-by-step execution timeline and unallocated explanations.
 */
export function executeGreedyAllocation(
  students: Student[],
  mentors: Mentor[],
  options: AllocationEngineOptions = {}
): {
  batchRun: AllocationBatchRun;
  updatedStudents: Student[];
  updatedMentors: Mentor[];
} {
  const minThreshold = options.minScoreThreshold ?? 50;
  const prioritizeWeak = options.prioritizeWeakSubjectsCount ?? true;

  // Clone mentors so we can mutate current_load step-by-step during allocation
  const workingMentors: Mentor[] = mentors.map(m => ({ ...m }));
  const workingStudents: Student[] = students.map(s => ({ ...s }));

  // Filter only unallocated students awaiting matching
  const candidateStudents = workingStudents.filter(s => s.allocation_status !== 'Allocated');

  // Step 1: Prioritize mentees with the greatest number of weak subjects (Greedy heuristic)
  if (prioritizeWeak) {
    candidateStudents.sort((a, b) => {
      if (b.weak_subjects.length !== a.weak_subjects.length) {
        return b.weak_subjects.length - a.weak_subjects.length; // descending count
      }
      return a.student_id.localeCompare(b.student_id); // deterministic tie
    });
  }

  const executionSteps: ExecutionStep[] = [];
  const successfulAllocations: AllocationResult[] = [];
  const unallocatedStudents: UnallocatedReason[] = [];

  let stepCounter = 1;

  for (const student of candidateStudents) {
    // 1. Calculate scores for all mentors
    const allEvaluations: CandidateEvaluation[] = workingMentors.map(mentor =>
      calculateMatchScore(
        student.weak_subjects,
        student.interests,
        student.free_slots,
        mentor,
        minThreshold
      )
    );

    // 2. Linear search filtering of eligible candidates
    const eligibleCandidates = linearSearchEligibleMentors(allEvaluations);

    let selectedCandidate: CandidateEvaluation | null = null;
    let rationale = '';

    if (eligibleCandidates.length > 0) {
      if (options.useMaxHeap) {
        // Use Max Heap Priority Queue to extract the highest scoring mentor
        const heap = new MaxHeapCandidates(eligibleCandidates);
        selectedCandidate = heap.extractMax();
        rationale = `Extracted root maximum from Max Heap with match score ${selectedCandidate?.score_breakdown.total_score}.`;
      } else {
        // Use Merge Sort to rank candidates descending
        const rankedCandidates = mergeSortCandidates(eligibleCandidates);
        selectedCandidate = rankedCandidates[0];
        rationale = `Ranked ${rankedCandidates.length} eligible mentors via Merge Sort (O(n log n)). Selected top-ranked mentor.`;
      }
    }

    if (selectedCandidate) {
      // Find the working mentor to update their load
      const targetMentor = workingMentors.find(m => m.mentor_id === selectedCandidate!.mentor.mentor_id)!;
      const prevLoad = targetMentor.current_load;
      targetMentor.current_load += 1;
      const newLoad = targetMentor.current_load;

      const allocationResult: AllocationResult = {
        allocation_id: `ALC-${400 + successfulAllocations.length + 1}`,
        student_id: student.student_id,
        student_name: student.name,
        mentor_id: targetMentor.mentor_id,
        mentor_name: targetMentor.name,
        mentor_type: targetMentor.mentor_type,
        match_score: selectedCandidate.score_breakdown.total_score,
        score_breakdown: selectedCandidate.score_breakdown,
        allocation_date: new Date().toISOString(),
        execution_step: stepCounter,
        candidate_evaluations: allEvaluations,
      };

      successfulAllocations.push(allocationResult);

      // Update student record
      student.allocation_status = 'Allocated';
      student.assigned_mentor_id = targetMentor.mentor_id;
      student.assigned_mentor_name = targetMentor.name;

      executionSteps.push({
        step_number: stepCounter,
        student: { ...student },
        evaluated_candidates: allEvaluations,
        selected_mentor: { ...targetMentor },
        selected_score: selectedCandidate.score_breakdown.total_score,
        decision_rationale: `${rationale} Allocated to ${targetMentor.name}. Mentor load updated: ${prevLoad} -> ${newLoad} / ${targetMentor.max_capacity}.`,
        mentor_previous_load: prevLoad,
        mentor_updated_load: newLoad,
      });
    } else {
      // Unallocated handling with explicit reasons
      const failureReasons: string[] = [];

      const fullMentors = allEvaluations.filter(e => e.mentor.current_load >= e.mentor.max_capacity);
      const noSlotMentors = allEvaluations.filter(e => e.score_breakdown.common_slots.length === 0);
      const lowScoreMentors = allEvaluations.filter(
        e => e.score_breakdown.total_score < minThreshold && e.score_breakdown.common_slots.length > 0 && e.mentor.current_load < e.mentor.max_capacity
      );

      if (workingMentors.every(m => m.current_load >= m.max_capacity)) {
        failureReasons.push('All mentors in the system have reached their maximum capacity.');
      } else if (noSlotMentors.length === allEvaluations.length) {
        failureReasons.push('Zero availability overlap with any mentor in the system.');
      } else {
        if (fullMentors.length > 0) {
          failureReasons.push(`${fullMentors.length} mentor(s) were unavailable due to capacity exhaustion.`);
        }
        if (noSlotMentors.length > 0) {
          failureReasons.push(`${noSlotMentors.length} mentor(s) had no matching free time slots.`);
        }
        if (lowScoreMentors.length > 0) {
          failureReasons.push(`${lowScoreMentors.length} mentor(s) scored below the minimum threshold (${minThreshold}).`);
        }
      }

      if (failureReasons.length === 0) {
        failureReasons.push(`No eligible mentor satisfied capacity, availability, and the score threshold of ${minThreshold}.`);
      }

      // Best candidate evaluation for diagnostic feedback
      const sortedByRawScore = [...allEvaluations].sort(
        (a, b) => b.score_breakdown.total_score - a.score_breakdown.total_score
      );
      const bestCandidate = sortedByRawScore[0];

      unallocatedStudents.push({
        student_id: student.student_id,
        student_name: student.name,
        reasons: failureReasons,
        highest_score: bestCandidate ? bestCandidate.score_breakdown.total_score : 0,
        best_candidate_name: bestCandidate ? bestCandidate.mentor.name : undefined,
      });

      executionSteps.push({
        step_number: stepCounter,
        student: { ...student },
        evaluated_candidates: allEvaluations,
        decision_rationale: `Unable to allocate: ${failureReasons.join(' ')}`,
      });
    }

    stepCounter++;
  }

  const batchRun: AllocationBatchRun = {
    run_id: `RUN-${Date.now().toString(36).toUpperCase()}`,
    run_timestamp: new Date().toISOString(),
    total_processed: candidateStudents.length,
    successful_allocations: successfulAllocations,
    unallocated_students: unallocatedStudents,
    execution_steps: executionSteps,
  };

  return {
    batchRun,
    updatedStudents: workingStudents,
    updatedMentors: workingMentors,
  };
}
