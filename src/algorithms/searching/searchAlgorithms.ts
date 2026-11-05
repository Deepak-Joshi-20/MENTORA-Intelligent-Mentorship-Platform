import { Mentor, CandidateEvaluation } from '../../types';

export interface LinearSearchStep {
  index: number;
  mentorId: string;
  mentorName: string;
  checkedCondition: string;
  isEligible: boolean;
  notes: string;
}

export interface BinarySearchStep {
  step: number;
  low: number;
  high: number;
  mid: number;
  midMentorId: string;
  midMentorName: string;
  targetId: string;
  action: 'Match Found' | 'Search Right (target > mid)' | 'Search Left (target < mid)';
}

/**
 * Linear Search over mentors to evaluate eligibility criteria.
 * Time Complexity: O(m) where m is number of mentors.
 */
export function linearSearchEligibleMentors(
  evaluations: CandidateEvaluation[],
  trace?: LinearSearchStep[]
): CandidateEvaluation[] {
  const eligible: CandidateEvaluation[] = [];

  for (let i = 0; i < evaluations.length; i++) {
    const ev = evaluations[i];
    const isEligible = ev.is_eligible;

    if (trace) {
      trace.push({
        index: i,
        mentorId: ev.mentor.mentor_id,
        mentorName: ev.mentor.name,
        checkedCondition: `Remaining Cap > 0 && Common Slots >= 1 && Score (${ev.score_breakdown.total_score}) >= 50`,
        isEligible,
        notes: isEligible
          ? 'Eligible candidate'
          : `Ineligible: ${ev.ineligibility_reasons.join(', ')}`,
      });
    }

    if (isEligible) {
      eligible.push(ev);
    }
  }

  return eligible;
}

/**
 * Binary Search to look up a mentor record by ID from a sorted array of mentors.
 * Time Complexity: O(log m)
 * Prerequisite: Mentors array sorted by mentor_id ascending.
 */
export function binarySearchMentorById(
  sortedMentors: Mentor[],
  targetMentorId: string,
  trace?: BinarySearchStep[]
): { mentor: Mentor | null; index: number; stepsCount: number } {
  let low = 0;
  let high = sortedMentors.length - 1;
  let step = 0;

  while (low <= high) {
    step++;
    const mid = Math.floor((low + high) / 2);
    const midMentor = sortedMentors[mid];

    const cmp = midMentor.mentor_id.localeCompare(targetMentorId);

    if (cmp === 0) {
      if (trace) {
        trace.push({
          step,
          low,
          high,
          mid,
          midMentorId: midMentor.mentor_id,
          midMentorName: midMentor.name,
          targetId: targetMentorId,
          action: 'Match Found',
        });
      }
      return { mentor: midMentor, index: mid, stepsCount: step };
    } else if (cmp < 0) {
      if (trace) {
        trace.push({
          step,
          low,
          high,
          mid,
          midMentorId: midMentor.mentor_id,
          midMentorName: midMentor.name,
          targetId: targetMentorId,
          action: 'Search Right (target > mid)',
        });
      }
      low = mid + 1;
    } else {
      if (trace) {
        trace.push({
          step,
          low,
          high,
          mid,
          midMentorId: midMentor.mentor_id,
          midMentorName: midMentor.name,
          targetId: targetMentorId,
          action: 'Search Left (target < mid)',
        });
      }
      high = mid - 1;
    }
  }

  return { mentor: null, index: -1, stepsCount: step };
}
