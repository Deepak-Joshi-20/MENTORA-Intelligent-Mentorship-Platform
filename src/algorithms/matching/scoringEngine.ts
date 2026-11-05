import { Mentor, ScoreBreakdown, CandidateEvaluation } from '../../types';

/**
 * Evaluates the match between a student and a mentor according to the exact formula in Progress Report II:
 *
 * Total match score = 100 points
 * A. Subject Match — 40 points
 *    Formula: (Weak subjects covered by mentor expertise / Total weak subjects) * 40
 * B. Interest Overlap — 25 points
 *    Formula: (Common interests / Mentee interests) * 25
 * C. Availability — 20 points
 *    Formula: (Common free time slots / Mentee free slots) * 20 (Cap at 20)
 *    * A mentor with zero common availability slots must be rejected.
 * D. Workload Balance — 15 points
 *    Formula: (Remaining capacity / Maximum capacity) * 15
 *
 * Eligibility criteria:
 * - Mentor has remaining capacity > 0 (current_load < max_capacity)
 * - At least one common free time slot exists
 * - Total match score >= min_threshold (default 50)
 */
export function calculateMatchScore(
  weak_subjects: string[],
  interests: string[],
  free_slots: string[],
  mentor: Mentor,
  min_score_threshold: number = 50
): CandidateEvaluation {
  const ineligibility_reasons: string[] = [];

  // Remaining capacity check
  const remaining_capacity = Math.max(0, mentor.max_capacity - mentor.current_load);
  if (remaining_capacity <= 0) {
    ineligibility_reasons.push(`Mentor has no remaining capacity (${mentor.current_load}/${mentor.max_capacity} filled).`);
  }

  // A. Subject Match (40 points)
  const common_subjects = weak_subjects.filter((subj: string) =>
    mentor.expertise.some((exp: string) => exp.trim().toLowerCase() === subj.trim().toLowerCase())
  );
  const subject_score = weak_subjects.length > 0
    ? Number(((common_subjects.length / weak_subjects.length) * 40).toFixed(2))
    : 0;

  // B. Interest Overlap (25 points)
  const common_interests = interests.filter((int: string) =>
    mentor.interests.some((mInt: string) => mInt.trim().toLowerCase() === int.trim().toLowerCase())
  );
  const interest_score = interests.length > 0
    ? Number(((common_interests.length / interests.length) * 25).toFixed(2))
    : 0;

  // C. Availability (20 points)
  const common_slots = free_slots.filter((slot: string) =>
    mentor.free_slots.some((mSlot: string) => mSlot.trim().toLowerCase() === slot.trim().toLowerCase())
  );
  const availability_score = free_slots.length > 0
    ? Number(Math.min(20, (common_slots.length / free_slots.length) * 20).toFixed(2))
    : 0;

  if (common_slots.length === 0) {
    ineligibility_reasons.push('No common free time slots between mentee and mentor (zero availability).');
  }

  // D. Workload Balance (15 points)
  const workload_score = mentor.max_capacity > 0
    ? Number(((remaining_capacity / mentor.max_capacity) * 15).toFixed(2))
    : 0;

  // Total
  const total_score = Number((subject_score + interest_score + availability_score + workload_score).toFixed(2));

  if (total_score < min_score_threshold) {
    ineligibility_reasons.push(`Total match score (${total_score.toFixed(1)}) is below minimum threshold (${min_score_threshold}).`);
  }

  const score_breakdown: ScoreBreakdown = {
    subject_score,
    interest_score,
    availability_score,
    workload_score,
    total_score,
    common_subjects,
    common_interests,
    common_slots,
    remaining_capacity_at_eval: remaining_capacity,
    max_capacity_at_eval: mentor.max_capacity,
  };

  const is_eligible = ineligibility_reasons.length === 0;

  return {
    mentor: { ...mentor },
    score_breakdown,
    is_eligible,
    ineligibility_reasons,
  };
}
