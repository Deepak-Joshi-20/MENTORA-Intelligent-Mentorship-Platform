import { Student, Mentor, CandidateEvaluation } from '../../types';
import { calculateMatchScore } from '../matching/scoringEngine';

export interface GraphNode {
  id: string;
  label: string;
  type: 'student' | 'mentor';
  details: Student | Mentor;
  x?: number;
  y?: number;
  isAllocated?: boolean;
  isFull?: boolean;
}

export interface GraphEdge {
  id: string;
  source: string; // student_id
  target: string; // mentor_id
  score: number;
  isEligible: boolean;
  scoreBreakdown: CandidateEvaluation['score_breakdown'];
  isAllocatedEdge?: boolean;
}

export interface BipartiteGraph {
  mentees: GraphNode[];
  mentors: GraphNode[];
  edges: GraphEdge[];
}

export interface BFSTraceStep {
  step: number;
  currentQueue: string[];
  currentNode: string;
  currentNodeLabel: string;
  visitedNodes: string[];
  discoveredNeighbors: { id: string; label: string; edgeScore: number }[];
  actionDescription: string;
}

/**
 * Builds the Bipartite Graph G = (U, V, E)
 * U = Mentees set
 * V = Mentors set
 * E = Compatibility edges weighted by Match Score
 */
export function buildMentorshipBipartiteGraph(
  students: Student[],
  mentors: Mentor[],
  minThreshold = 50
): BipartiteGraph {
  const menteeNodes: GraphNode[] = students.map(s => ({
    id: s.student_id,
    label: s.name,
    type: 'student',
    details: s,
    isAllocated: s.allocation_status === 'Allocated',
  }));

  const mentorNodes: GraphNode[] = mentors.map(m => ({
    id: m.mentor_id,
    label: m.name,
    type: 'mentor',
    details: m,
    isFull: m.current_load >= m.max_capacity,
  }));

  const edges: GraphEdge[] = [];

  for (const s of students) {
    for (const m of mentors) {
      const evaluation = calculateMatchScore(
        s.weak_subjects,
        s.interests,
        s.free_slots,
        m,
        minThreshold
      );

      // Only draw edges if there is at least some subject overlap or availability,
      // or if it qualifies with score > 0
      if (evaluation.score_breakdown.common_subjects.length > 0 || evaluation.score_breakdown.total_score >= 40) {
        const isAllocated = s.assigned_mentor_id === m.mentor_id;

        edges.push({
          id: `${s.student_id}-${m.mentor_id}`,
          source: s.student_id,
          target: m.mentor_id,
          score: evaluation.score_breakdown.total_score,
          isEligible: evaluation.is_eligible,
          scoreBreakdown: evaluation.score_breakdown,
          isAllocatedEdge: isAllocated,
        });
      }
    }
  }

  return {
    mentees: menteeNodes,
    mentors: mentorNodes,
    edges,
  };
}

/**
 * Breadth-First Search (BFS) over the Mentorship Bipartite Graph.
 * Explores eligible mentor connections from a starting mentee node and
 * discovers related mentor options through shared subject relationships.
 *
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 */
export function runBFSExploration(
  graph: BipartiteGraph,
  startStudentId: string,
  minScoreFilter = 50
): {
  visited: string[];
  traversalOrder: string[];
  trace: BFSTraceStep[];
  discoveredMentors: { mentor: Mentor; score: number; viaNode: string }[];
} {
  const queue: string[] = [startStudentId];
  const visited = new Set<string>([startStudentId]);
  const traversalOrder: string[] = [startStudentId];
  const trace: BFSTraceStep[] = [];
  const discoveredMentors: { mentor: Mentor; score: number; viaNode: string }[] = [];

  // Build adjacency map for BFS exploration
  const adj = new Map<string, { neighborId: string; score: number; isEligible: boolean }[]>();

  for (const edge of graph.edges) {
    if (edge.score < minScoreFilter && !edge.isAllocatedEdge) continue;

    if (!adj.has(edge.source)) adj.set(edge.source, []);
    if (!adj.has(edge.target)) adj.set(edge.target, []);

    adj.get(edge.source)!.push({ neighborId: edge.target, score: edge.score, isEligible: edge.isEligible });
    adj.get(edge.target)!.push({ neighborId: edge.source, score: edge.score, isEligible: edge.isEligible });
  }

  let stepCount = 0;

  while (queue.length > 0) {
    stepCount++;
    const currentNodeId = queue.shift()!;
    const isStudentNode = currentNodeId.startsWith('STU');
    const nodeObj = isStudentNode
      ? graph.mentees.find(m => m.id === currentNodeId)
      : graph.mentors.find(m => m.id === currentNodeId);
    const nodeLabel = nodeObj ? nodeObj.label : currentNodeId;

    const neighbors = adj.get(currentNodeId) || [];
    const discoveredThisStep: { id: string; label: string; edgeScore: number }[] = [];

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.neighborId)) {
        visited.add(neighbor.neighborId);
        traversalOrder.push(neighbor.neighborId);
        queue.push(neighbor.neighborId);

        const neighborObj = neighbor.neighborId.startsWith('STU')
          ? graph.mentees.find(m => m.id === neighbor.neighborId)
          : graph.mentors.find(m => m.id === neighbor.neighborId);
        const neighborLabel = neighborObj ? neighborObj.label : neighbor.neighborId;

        discoveredThisStep.push({
          id: neighbor.neighborId,
          label: neighborLabel,
          edgeScore: neighbor.score,
        });

        if (!neighbor.neighborId.startsWith('STU')) {
          const mentorDetails = graph.mentors.find(m => m.id === neighbor.neighborId)?.details as Mentor;
          if (mentorDetails) {
            discoveredMentors.push({
              mentor: mentorDetails,
              score: neighbor.score,
              viaNode: nodeLabel,
            });
          }
        }
      }
    }

    trace.push({
      step: stepCount,
      currentQueue: [...queue],
      currentNode: currentNodeId,
      currentNodeLabel: nodeLabel,
      visitedNodes: Array.from(visited),
      discoveredNeighbors: discoveredThisStep,
      actionDescription: `De-queued ${nodeLabel}. Explored ${neighbors.length} adjacent connections. Discovered ${discoveredThisStep.length} new unvisited nodes.`,
    });
  }

  return {
    visited: Array.from(visited),
    traversalOrder,
    trace,
    discoveredMentors,
  };
}
