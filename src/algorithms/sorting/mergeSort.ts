import { CandidateEvaluation } from '../../types';

export interface SortTraceStep {
  step: number;
  description: string;
  leftArray: { id: string; name: string; score: number }[];
  rightArray: { id: string; name: string; score: number }[];
  mergedArray: { id: string; name: string; score: number }[];
}

/**
 * Merge Sort implementation to rank eligible mentors by descending match score.
 * Time Complexity: O(n log n)
 * Auxiliary Space: O(n)
 * Stable sort guaranteeing deterministic tie-breaking.
 */
export function mergeSortCandidates(
  candidates: CandidateEvaluation[],
  traceCollector?: SortTraceStep[]
): CandidateEvaluation[] {
  if (candidates.length <= 1) {
    return [...candidates];
  }

  const mid = Math.floor(candidates.length / 2);
  const left = mergeSortCandidates(candidates.slice(0, mid), traceCollector);
  const right = mergeSortCandidates(candidates.slice(mid), traceCollector);

  const merged = merge(left, right);

  if (traceCollector) {
    traceCollector.push({
      step: traceCollector.length + 1,
      description: `Merged sub-arrays of size ${left.length} and ${right.length} in descending match score order.`,
      leftArray: left.map(c => ({ id: c.mentor.mentor_id, name: c.mentor.name, score: c.score_breakdown.total_score })),
      rightArray: right.map(c => ({ id: c.mentor.mentor_id, name: c.mentor.name, score: c.score_breakdown.total_score })),
      mergedArray: merged.map(c => ({ id: c.mentor.mentor_id, name: c.mentor.name, score: c.score_breakdown.total_score })),
    });
  }

  return merged;
}

function merge(left: CandidateEvaluation[], right: CandidateEvaluation[]): CandidateEvaluation[] {
  const result: CandidateEvaluation[] = [];
  let i = 0;
  let j = 0;

  // Descending order sort (highest score first)
  while (i < left.length && j < right.length) {
    const scoreA = left[i].score_breakdown.total_score;
    const scoreB = right[j].score_breakdown.total_score;

    if (scoreA > scoreB) {
      result.push(left[i]);
      i++;
    } else if (scoreB > scoreA) {
      result.push(right[j]);
      j++;
    } else {
      // Deterministic tie-breaker:
      // 1. More remaining capacity first
      const remA = left[i].mentor.max_capacity - left[i].mentor.current_load;
      const remB = right[j].mentor.max_capacity - right[j].mentor.current_load;
      if (remA !== remB) {
        if (remA > remB) {
          result.push(left[i]);
          i++;
        } else {
          result.push(right[j]);
          j++;
        }
      } else {
        // 2. Lexicographical mentor_id for stable determinism
        if (left[i].mentor.mentor_id.localeCompare(right[j].mentor.mentor_id) <= 0) {
          result.push(left[i]);
          i++;
        } else {
          result.push(right[j]);
          j++;
        }
      }
    }
  }

  while (i < left.length) {
    result.push(left[i]);
    i++;
  }

  while (j < right.length) {
    result.push(right[j]);
    j++;
  }

  return result;
}
