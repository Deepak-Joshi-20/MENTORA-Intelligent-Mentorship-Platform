# MENTORA — Intelligent Student Mentorship Allocation System
**B.Tech CSE | Course: Data Structures & Algorithms – II (CCSE0301)**  
**Student Name:** Deepak Joshi | **ERP ID:** 2501331720045  
**Course Faculty:** Mr. Pankaj Rajput | **SDG Target:** SDG 4 — Quality Education  
**Project Progress Reference:** PBL Progress Report – II / III  

---

## 1. Project Overview

Students in undergraduate computer science frequently experience difficulties across foundational courses such as *Data Structures & Algorithms*, *Discrete Mathematics*, *Operating Systems*, and *Computer Networks*. Concurrently, academic mentors (comprising faculty professors and top senior student teaching assistants) possess distinct subject domains, diverse technical interests, finite free time slots, and strict mentorship load capacities.

Manual allocation introduces subjective bias, mentor overload, schedule mismatches, and unassigned students.

**MENTORA** is a full-featured web platform implementing a multi-constraint mathematical matching formula and a suite of core **DSA-II algorithms** (Greedy Heuristics, Bipartite Graph Modeling, Breadth-First Search, Max Heap Priority Queues, Merge Sort, and Binary Search) to automate, balance, and explain student mentorship allocation.

---

## 2. Mathematical Scoring Model (100 Points Total)

As documented in *Progress Report II*, every student-mentor candidate pair is evaluated against four transparent criteria:

1. **Subject Match (40 Points Max):**
   $$\text{Score} = \left(\frac{\text{Weak Subjects Covered by Mentor Expertise}}{\text{Total Weak Subjects of Mentee}}\right) \times 40$$

2. **Interest Overlap (25 Points Max):**
   $$\text{Score} = \left(\frac{\text{Common Interests}}{\text{Total Mentee Interests}}\right) \times 25$$

3. **Availability (20 Points Max):**
   $$\text{Score} = \min\left(20, \left(\frac{\text{Common Free Weekly Slots}}{\text{Total Mentee Free Slots}}\right) \times 20\right)$$
   *Constraint:* Mentors with **0 common availability slots** are immediately deemed ineligible.

4. **Workload Balance (15 Points Max):**
   $$\text{Score} = \left(\frac{\text{Remaining Capacity}}{\text{Maximum Capacity}}\right) \times 15$$

### Eligibility Conditions
A mentor is eligible for allocation only if:
- Remaining capacity $> 0$ ($\text{current\_load} < \text{max\_capacity}$)
- At least **1 common free time slot** exists
- $\text{Total Match Score} \ge 50$ (configurable in Settings)

---

## 3. Data Structures & Algorithms (DSA-II) Implementation

The system directly uses the essential curriculum algorithms required in the project specification:

| Algorithm / Data Structure | System Role | Theoretical Time Complexity | Space Complexity |
| :--- | :--- | :--- | :--- |
| **Arrays** | Contiguous in-memory buffers storing student, mentor, and candidate evaluation records | $O(1)$ random access | $O(n)$ |
| **Linear Search** | Filtering mentor lists for multi-clause capacity, availability, and score eligibility | $O(m)$ | $O(1)$ |
| **Binary Search** | Logarithmic lookup of mentor records by unique ID from sorted mentor arrays | $O(\log m)$ | $O(1)$ |
| **Merge Sort** | Stable $O(k \log k)$ ranking of eligible candidate mentors descending by score with deterministic tie-breaking | $O(k \log k)$ | $O(k)$ |
| **Max Heap** | Priority Queue keeping the highest-scoring candidate mentor at the root for $O(\log k)$ extraction | $O(k)$ build, $O(\log k)$ extract | $O(k)$ |
| **Bipartite Graph** | $G = (U, V, E)$ representing Mentees ($U$) and Mentors ($V$) with edges ($E$) weighted by match scores | - | $O(\|V\| + \|E\|)$ |
| **BFS Traversal** | Queue-based systematic exploration of reachable mentor clusters and subject bridges | $O(V + E)$ | $O(V)$ |
| **Greedy Heuristic** | Sequential locally optimal allocation prioritizing students with maximum weak subjects | $O(n \cdot m \log m)$ | $O(n + m)$ |

---

## 4. System Architecture & Relational Database Schema

The application is structured into a clean separation of concerns:
```
src/
  ├── algorithms/
  │    ├── greedy/         # executeGreedyAllocation with step-by-step audit
  │    ├── matching/       # calculateMatchScore (4-component formula)
  │    ├── sorting/        # mergeSortCandidates with trace
  │    ├── searching/      # linearSearchEligibleMentors & binarySearchMentorById
  │    ├── heap/           # MaxHeapCandidates priority queue
  │    └── graph/          # buildMentorshipBipartiteGraph & runBFSExploration
  ├── components/
  │    ├── common/         # Logo, LoginModal
  │    └── layout/         # Sidebar, TopNavbar
  ├── context/             # AppContext (global state, action dispatchers)
  ├── database/
  │    ├── schema.sql      # ANSI SQL 4-table relational database schema
  │    └── seedData.ts     # Realistic academic dataset (13 students, 7 mentors)
  ├── features/
  │    ├── dashboard/      # Overview KPIs, workload bars, subject demands
  │    ├── students/       # Full CRUD, weak subjects selector, search & filters
  │    ├── mentors/        # Full CRUD, capacity quotas, expertise tags
  │    ├── requests/       # Request lifecycle & duplicate prevention
  │    ├── allocation/     # Smart Allocation engine & results table with CSV export
  │    ├── network/        # Interactive SVG Bipartite Graph & BFS visualizer
  │    ├── analytics/      # Score distribution tiers, load balancing, DSA analysis
  │    └── system/         # Settings, JSON backup/restore, About Project
  ├── services/            # dataStore (localStorage persistence with JSON export)
  └── types/               # TypeScript domain interfaces
```

### Relational Schema (4 Core Tables)
Defined in `/src/database/schema.sql`:
1. `students` (`student_id` PK, `name`, `email`, `academic_year`, `weak_subjects`, `interests`, `free_slots`, `preferred_mentor_type`, `allocation_status`, `assigned_mentor_id`)
2. `mentors` (`mentor_id` PK, `name`, `email`, `mentor_type`, `department`, `expertise`, `interests`, `free_slots`, `max_capacity`, `current_load`)
3. `mentorship_requests` (`request_id` PK, `student_id` FK, `weak_subjects`, `interests`, `free_slots`, `preferred_mentor_type`, `request_date`, `status`, `allocated_mentor_id`)
4. `allocations` (`allocation_id` PK, `student_id` FK, `mentor_id` FK, `match_score`, `subject_score`, `interest_score`, `availability_score`, `workload_score`, `score_breakdown`, `allocation_date`)

---

## 5. Demonstration Credentials

- **Demo URL:** `http://localhost:3000`
- **Email:** `admin@mentora.demo`
- **Password:** `demo123`
*(Or click "One-Click Instant Access" on the login modal to log in with a single click)*

---

## 6. Local Setup & Build Instructions

### Prerequisites
- Node.js 18+ / 20+
- npm or pnpm

### Commands
```bash
# 1. Install dependencies
npm install

# 2. Run local development server (Port 3000)
npm run dev

# 3. Typecheck and lint codebase
npm run lint

# 4. Production build (Vite SPA)
npm run build
```

---

## 7. Netlify Frontend Deployment Instructions

1. Push this repository to GitHub.
2. In Netlify, select **Add new site** &rarr; **Import an existing project from GitHub**.
3. Configure build settings:
   - **Base directory:** Leave empty (root)
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Deploy site. The SPA router and local storage persistence will work completely offline and client-side with no external paid backend required.

---

## 8. Academic Viva Preparation & Key Questions

1. **Why Greedy instead of Hungarian / Maximum Bipartite Matching?**  
   Maximum Bipartite Matching (e.g., Hopcroft-Karp or Hungarian Algorithm) finds a global optimum in a static batch, but fails when allocations must be processed dynamically as students enroll over time. The Greedy heuristic provides $O(n \cdot m \log m)$ instant assignments, explainable decision rationales for each student, and naturally balances workload by immediately depreciating the mentor's workload score for subsequent candidates.

2. **Why prioritize students with more weak subjects?**  
   Students who are weak in 3 or 4 subjects face severe eligibility constraints because only mentors with broad multi-subject expertise can assist them. If single-subject students are allocated first, versatile mentors may be consumed prematurely, stranding the higher-need students.

3. **How does BFS support the system?**  
   BFS systematically explores reachable mentor clusters over the Bipartite Graph $G=(U, V, E)$. If a student has no directly available mentor due to capacity limits, BFS discovers alternative mentors connected via related subjects or collaborative mentorship paths.
