export type MentorType = 'Faculty' | 'Senior Student';

export type AllocationStatus = 'Unallocated' | 'Allocated' | 'Pending';

export type RequestStatus = 'Pending' | 'Approved' | 'Allocated' | 'Unallocated' | 'Rejected';

export interface Student {
  student_id: string; // e.g. STU-101
  name: string;
  email: string;
  academic_year: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
  weak_subjects: string[];
  interests: string[];
  free_slots: string[]; // e.g. ['Mon 10-12', 'Wed 14-16', 'Fri 16-18']
  preferred_mentor_type: 'Faculty' | 'Senior Student' | 'Any';
  allocation_status: AllocationStatus;
  assigned_mentor_id?: string;
  assigned_mentor_name?: string;
  notes?: string;
  created_at: string;
}

export interface Mentor {
  mentor_id: string; // e.g. MTR-201
  name: string;
  email: string;
  mentor_type: MentorType;
  department?: string;
  expertise: string[];
  interests: string[];
  free_slots: string[];
  max_capacity: number;
  current_load: number;
  created_at: string;
}

export interface MentorshipRequest {
  request_id: string; // e.g. REQ-301
  student_id: string;
  student_name: string;
  weak_subjects: string[];
  interests: string[];
  free_slots: string[];
  preferred_mentor_type: 'Faculty' | 'Senior Student' | 'Any';
  request_date: string;
  status: RequestStatus;
  allocated_mentor_id?: string;
  allocated_mentor_name?: string;
  rejection_reason?: string;
}

export interface ScoreBreakdown {
  subject_score: number;      // max 40: (weak subjects covered / total weak subjects) * 40
  interest_score: number;     // max 25: (common interests / mentee interests) * 25
  availability_score: number; // max 20: (common free time slots / mentee free slots) * 20 (min 1 required)
  workload_score: number;     // max 15: (remaining capacity / max capacity) * 15
  total_score: number;        // sum of the above (0 - 100)
  common_subjects: string[];
  common_interests: string[];
  common_slots: string[];
  remaining_capacity_at_eval: number;
  max_capacity_at_eval: number;
}

export interface CandidateEvaluation {
  mentor: Mentor;
  score_breakdown: ScoreBreakdown;
  is_eligible: boolean;
  ineligibility_reasons: string[];
}

export interface AllocationResult {
  allocation_id: string; // e.g. ALC-401
  student_id: string;
  student_name: string;
  mentor_id: string;
  mentor_name: string;
  mentor_type: MentorType;
  match_score: number;
  score_breakdown: ScoreBreakdown;
  allocation_date: string;
  execution_step?: number;
  candidate_evaluations?: CandidateEvaluation[];
}

export interface UnallocatedReason {
  student_id: string;
  student_name: string;
  reasons: string[];
  highest_score?: number;
  best_candidate_name?: string;
}

export interface AllocationBatchRun {
  run_id: string;
  run_timestamp: string;
  total_processed: number;
  successful_allocations: AllocationResult[];
  unallocated_students: UnallocatedReason[];
  execution_steps: ExecutionStep[];
}

export interface ExecutionStep {
  step_number: number;
  student: Student;
  evaluated_candidates: CandidateEvaluation[];
  selected_mentor?: Mentor;
  selected_score?: number;
  decision_rationale: string;
  mentor_previous_load?: number;
  mentor_updated_load?: number;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  linkTo?: string;
}

export interface SystemSettings {
  min_score_threshold: number; // default 50
  prioritize_by_weak_subjects_count: boolean; // default true (greedy rule)
  allow_partial_subject_match: boolean;
  academic_year_filter: string;
}

export interface WeeklySnapshot {
  snapshot_date: string;
  total_students: number;
  active_mentors: number;
  pending_requests: number;
  successful_allocations: number;
  unallocated_students: number;
  average_match_score: number;
}

