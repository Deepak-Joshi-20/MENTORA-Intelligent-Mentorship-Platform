-- =========================================================================
-- MENTORA: INTELLIGENT STUDENT MENTORSHIP ALLOCATION SYSTEM
-- Core Relational Database Schema (ANSI SQL / PostgreSQL Compatible)
-- Version: 2.4 Enterprise Edition
-- =========================================================================

-- 1. Student Table
CREATE TABLE IF NOT EXISTS students (
  student_id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  academic_year VARCHAR(30) NOT NULL,
  weak_subjects TEXT NOT NULL,           -- JSON array or comma-separated string
  interests TEXT NOT NULL,               -- JSON array or comma-separated string
  free_slots TEXT NOT NULL,              -- JSON array or comma-separated string
  preferred_mentor_type VARCHAR(30) DEFAULT 'Any',
  allocation_status VARCHAR(30) DEFAULT 'Unallocated',
  assigned_mentor_id VARCHAR(32),
  assigned_mentor_name VARCHAR(120),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_mentor_id) REFERENCES mentors(mentor_id) ON DELETE SET NULL
);

-- 2. Mentor Table
CREATE TABLE IF NOT EXISTS mentors (
  mentor_id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  mentor_type VARCHAR(30) NOT NULL,     -- 'Faculty' OR 'Senior Student'
  department VARCHAR(120),
  expertise TEXT NOT NULL,              -- JSON array of expert subjects
  interests TEXT NOT NULL,              -- JSON array of research/practical interests
  free_slots TEXT NOT NULL,             -- JSON array of weekly time slots
  max_capacity INTEGER NOT NULL CHECK(max_capacity > 0),
  current_load INTEGER NOT NULL DEFAULT 0 CHECK(current_load >= 0 AND current_load <= max_capacity),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. MentorshipRequest Table
CREATE TABLE IF NOT EXISTS mentorship_requests (
  request_id VARCHAR(32) PRIMARY KEY,
  student_id VARCHAR(32) NOT NULL,
  weak_subjects TEXT NOT NULL,
  interests TEXT NOT NULL,
  free_slots TEXT NOT NULL,
  preferred_mentor_type VARCHAR(30) DEFAULT 'Any',
  request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(30) DEFAULT 'Pending' CHECK(status IN ('Pending', 'Approved', 'Allocated', 'Unallocated', 'Rejected')),
  allocated_mentor_id VARCHAR(32),
  rejection_reason TEXT,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  FOREIGN KEY (allocated_mentor_id) REFERENCES mentors(mentor_id) ON DELETE SET NULL
);

-- 4. Allocation Table
CREATE TABLE IF NOT EXISTS allocations (
  allocation_id VARCHAR(32) PRIMARY KEY,
  student_id VARCHAR(32) NOT NULL UNIQUE,
  mentor_id VARCHAR(32) NOT NULL,
  match_score NUMERIC(5,2) NOT NULL CHECK(match_score >= 50.0 AND match_score <= 100.0),
  subject_score NUMERIC(5,2) NOT NULL,
  interest_score NUMERIC(5,2) NOT NULL,
  availability_score NUMERIC(5,2) NOT NULL,
  workload_score NUMERIC(5,2) NOT NULL,
  score_breakdown TEXT NOT NULL,         -- JSON object with calculation traces
  allocation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id) ON DELETE CASCADE
);

-- Indexes for high-performance lookup
CREATE INDEX IF NOT EXISTS idx_students_status ON students(allocation_status);
CREATE INDEX IF NOT EXISTS idx_mentors_capacity ON mentors(current_load, max_capacity);
CREATE INDEX IF NOT EXISTS idx_requests_status ON mentorship_requests(status);
CREATE INDEX IF NOT EXISTS idx_allocations_mentor ON allocations(mentor_id);
