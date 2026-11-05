import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { buildMentorshipBipartiteGraph, runBFSExploration } from '../../algorithms/graph/bipartiteGraph';
import {
  Network,
  Play,
  RotateCcw,
} from 'lucide-react';

export const MentorshipNetworkPage: React.FC = () => {
  const { students, mentors } = useApp();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.student_id || '');
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [minScoreFilter, setMinScoreFilter] = useState<number>(45);
  const [bfsRunning, setBfsRunning] = useState(false);
  const [bfsResult, setBfsResult] = useState<ReturnType<typeof runBFSExploration> | null>(null);

  // Build bipartite graph
  const graph = useMemo(() => {
    return buildMentorshipBipartiteGraph(students, mentors, minScoreFilter);
  }, [students, mentors, minScoreFilter]);

  const currentStudent = students.find(s => s.student_id === selectedStudentId);
  const filteredEdges = graph.edges.filter(e => e.score >= minScoreFilter);
  const studentEdges = selectedStudentId
    ? filteredEdges.filter(e => e.source === selectedStudentId)
    : filteredEdges;

  // Run BFS exploration
  const handleRunBFS = () => {
    if (!selectedStudentId) return;
    setBfsRunning(true);
    const result = runBFSExploration(graph, selectedStudentId, minScoreFilter);
    setBfsResult(result);
    setBfsRunning(false);
  };

  const clearBFS = () => {
    setBfsResult(null);
  };

  // SVG dimensions
  const svgWidth = 840;
  const svgHeight = Math.max(540, Math.max(students.length, mentors.length) * 44);
  const studentX = 140;
  const mentorX = 700;

  const studentCoords = useMemo(() => {
    const coords = new Map<string, { x: number; y: number }>();
    const spacing = (svgHeight - 80) / Math.max(1, students.length - 1);
    students.forEach((s, idx) => {
      coords.set(s.student_id, { x: studentX, y: 40 + idx * spacing });
    });
    return coords;
  }, [students, svgHeight]);

  const mentorCoords = useMemo(() => {
    const coords = new Map<string, { x: number; y: number }>();
    const spacing = (svgHeight - 80) / Math.max(1, mentors.length - 1);
    mentors.forEach((m, idx) => {
      coords.set(m.mentor_id, { x: mentorX, y: 40 + idx * spacing });
    });
    return coords;
  }, [mentors, svgHeight]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-[#EAE2D8] p-5 lg:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-5 border-b border-[#EAE2D8]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5EDFC] text-[#5478D4] text-xs font-semibold mb-2">
              <Network className="w-3.5 h-3.5 text-[#5478D4]" />
              <span className="font-mono uppercase tracking-wider text-[11px]">BIPARTITE GRAPH G = (U, V, E)</span>
            </div>
            <h2 className="font-heading text-xl lg:text-3xl font-extrabold text-[#202C45] tracking-tight">
              Mentorship Network Topology
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-2xl leading-relaxed">
              Mentees are represented on the left set U and Mentors on the right set V. Compatibility edges are weighted by the exact 100-point match score. Run Breadth-First Search (BFS) to explore reachable network paths.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunBFS}
              disabled={!selectedStudentId || bfsRunning}
              className="px-5 py-2.5 rounded-xl bg-[#F07857] hover:bg-[#DE6240] text-white text-xs font-bold transition flex items-center gap-2 disabled:opacity-40 shadow-xs active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Run BFS Traversal from {selectedStudentId}</span>
            </button>

            {bfsResult && (
              <button
                onClick={clearBFS}
                className="px-4 py-2.5 rounded-xl border border-[#EAE2D8] bg-[#FFF9F0] text-[#64748B] hover:text-[#202C45] text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset BFS</span>
              </button>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="text-[10px] font-mono uppercase text-[#64748B] font-bold block mb-1">
                Focus Mentee Node
              </label>
              <select
                value={selectedStudentId}
                onChange={e => {
                  setSelectedStudentId(e.target.value);
                  clearBFS();
                }}
                className="px-3 py-2 bg-[#FFF9F0] border border-[#EAE2D8] rounded-xl text-xs text-[#202C45] font-medium focus:outline-none focus:border-[#5478D4]"
              >
                <option value="">All Mentees</option>
                {students.map(s => (
                  <option key={s.student_id} value={s.student_id}>
                    {s.name} ({s.student_id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-[#64748B] font-bold block mb-1">
                Min Match Score Edge Filter: <span className="text-[#F07857] font-bold">{minScoreFilter} pts</span>
              </label>
              <input
                type="range"
                min="0"
                max="85"
                step="5"
                value={minScoreFilter}
                onChange={e => setMinScoreFilter(parseInt(e.target.value))}
                className="w-40 accent-[#F07857]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-medium text-[#64748B]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#F07857]" /> Mentee Node (U)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#5478D4]" /> Advisor Node (V)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#F3C969]" /> Full Quota
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-1 rounded bg-[#63AFA3]" /> Matched Edge
            </span>
          </div>
        </div>
      </div>

      {/* Main Graph SVG & Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* SVG Canvas (3 Cols) */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-[#EAE2D8] p-5 shadow-xs overflow-x-auto relative">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto min-w-[760px]"
            style={{ maxHeight: '680px' }}
          >
            {/* Background Column Guides */}
            <rect x="20" y="10" width="220" height={svgHeight - 20} rx="16" fill="#FFF9F0" stroke="#EAE2D8" />
            <rect x="600" y="10" width="220" height={svgHeight - 20} rx="16" fill="#FFF9F0" stroke="#EAE2D8" />

            <text x="130" y="32" textAnchor="middle" fill="#F07857" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
              STUDENTS SET U ({students.length})
            </text>
            <text x="710" y="32" textAnchor="middle" fill="#5478D4" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
              ADVISORS SET V ({mentors.length})
            </text>

            {/* Draw Edges */}
            {filteredEdges.map(edge => {
              const sCoord = studentCoords.get(edge.source);
              const mCoord = mentorCoords.get(edge.target);
              if (!sCoord || !mCoord) return null;

              const isHighlighted =
                selectedStudentId === edge.source || selectedMentorId === edge.target;
              const isBFSVisited =
                bfsResult &&
                bfsResult.visited.includes(edge.source) &&
                bfsResult.visited.includes(edge.target);

              let strokeColor = '#EAE2D8';
              let strokeWidth = 1.2;
              let strokeOpacity = 0.5;

              if (edge.isAllocatedEdge) {
                strokeColor = '#63AFA3';
                strokeWidth = 2.8;
                strokeOpacity = 0.95;
              } else if (isBFSVisited) {
                strokeColor = '#F07857';
                strokeWidth = 2.2;
                strokeOpacity = 0.9;
              } else if (isHighlighted) {
                strokeColor = '#5478D4';
                strokeWidth = 2;
                strokeOpacity = 0.85;
              }

              const midX = (sCoord.x + mCoord.x) / 2;
              const pathD = `M ${sCoord.x} ${sCoord.y} C ${midX} ${sCoord.y}, ${midX} ${mCoord.y}, ${mCoord.x} ${mCoord.y}`;

              return (
                <g key={edge.id} className="transition-all duration-300">
                  <path
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeOpacity={strokeOpacity}
                  />

                  {/* Score badge at mid-curve if highlighted */}
                  {isHighlighted && (
                    <g transform={`translate(${midX}, ${(sCoord.y + mCoord.y) / 2})`}>
                      <rect
                        x="-18"
                        y="-9"
                        width="36"
                        height="18"
                        rx="6"
                        fill="#FFFFFF"
                        stroke={edge.isAllocatedEdge ? '#63AFA3' : '#5478D4'}
                        strokeWidth="1.5"
                      />
                      <text
                        x="0"
                        y="3.5"
                        textAnchor="middle"
                        fill={edge.isAllocatedEdge ? '#63AFA3' : '#5478D4'}
                        fontSize="10"
                        fontFamily="sans-serif"
                        fontWeight="bold"
                      >
                        {edge.score}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Draw Student Nodes (Left Set U) */}
            {students.map(s => {
              const coord = studentCoords.get(s.student_id);
              if (!coord) return null;
              const isSelected = selectedStudentId === s.student_id;
              const isBFSVisited = bfsResult && bfsResult.visited.includes(s.student_id);

              return (
                <g
                  key={s.student_id}
                  onClick={() => setSelectedStudentId(s.student_id)}
                  className="cursor-pointer group"
                >
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r={isSelected ? 11 : 7.5}
                    fill={isBFSVisited ? '#F07857' : isSelected ? '#F07857' : '#F07857'}
                    stroke="#FFFFFF"
                    strokeWidth={2.5}
                    className="transition-all"
                  />
                  <text
                    x={coord.x - 16}
                    y={coord.y + 3.5}
                    textAnchor="end"
                    fill={isSelected ? '#F07857' : '#202C45'}
                    fontSize="11"
                    fontFamily="sans-serif"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                  >
                    {s.name}
                  </text>
                </g>
              );
            })}

            {/* Draw Mentor Nodes (Right Set V) */}
            {mentors.map(m => {
              const coord = mentorCoords.get(m.mentor_id);
              if (!coord) return null;
              const isFull = m.current_load >= m.max_capacity;
              const isSelected = selectedMentorId === m.mentor_id;
              const isBFSVisited = bfsResult && bfsResult.visited.includes(m.mentor_id);

              return (
                <g
                  key={m.mentor_id}
                  onClick={() => setSelectedMentorId(m.mentor_id === selectedMentorId ? null : m.mentor_id)}
                  className="cursor-pointer group"
                >
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r={isSelected ? 11 : 7.5}
                    fill={isFull ? '#F3C969' : isBFSVisited ? '#5478D4' : '#5478D4'}
                    stroke="#FFFFFF"
                    strokeWidth={2.5}
                    className="transition-all"
                  />
                  <text
                    x={coord.x + 16}
                    y={coord.y + 3.5}
                    textAnchor="start"
                    fill={isSelected ? '#5478D4' : '#202C45'}
                    fontSize="11"
                    fontFamily="sans-serif"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                  >
                    {m.name} ({m.current_load}/{m.max_capacity})
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right Details Panel */}
        <div className="space-y-4">
          {/* Selected Student Card */}
          {currentStudent ? (
            <div className="bg-white rounded-3xl border border-[#EAE2D8] p-5 space-y-3 shadow-xs text-xs">
              <span className="text-[10px] font-mono uppercase text-[#64748B] font-bold block">
                Selected Mentee Node
              </span>
              <div className="font-heading font-extrabold text-base text-[#202C45]">{currentStudent.name}</div>
              <div className="text-[11px] text-[#64748B] font-mono">
                {currentStudent.student_id} · {currentStudent.academic_year}
              </div>

              <div className="space-y-1.5 pt-3 border-t border-[#EAE2D8]">
                <span className="text-[10px] font-mono uppercase text-[#64748B] font-bold block">
                  Challenge Subjects:
                </span>
                <div className="flex flex-wrap gap-1">
                  {currentStudent.weak_subjects.map(w => (
                    <span key={w} className="px-2 py-0.5 rounded-md bg-[#FFF4E6] text-[#F07857] text-[10px] font-semibold border border-[#F07857]/20">
                      {w}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-[#EAE2D8]">
                <span className="text-[10px] font-mono uppercase text-[#64748B] font-bold block">
                  Compatible Advisors (&ge; {minScoreFilter} pts):
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto text-[11px]">
                  {studentEdges.length === 0 ? (
                    <div className="text-[#64748B]">No mentors meet score threshold</div>
                  ) : (
                    studentEdges.map(e => (
                      <div key={e.id} className="flex justify-between items-center p-2 rounded-xl bg-[#FFF9F0] border border-[#EAE2D8]">
                        <span className="text-[#202C45] font-medium truncate">{e.target}</span>
                        <span className="text-[#5478D4] font-bold tabular-nums">{e.score} pts</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#EAE2D8] p-6 text-center text-xs text-[#64748B] shadow-xs">
              Select a mentee node to inspect network connectivity.
            </div>
          )}

          {/* BFS Exploration Log */}
          {bfsResult && (
            <div className="bg-white rounded-3xl border border-[#EAE2D8] p-5 space-y-3 shadow-xs text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE2D8]">
                <span className="font-heading font-bold text-[#202C45]">BFS Exploration Trace</span>
                <span className="font-mono text-[10px] font-bold text-[#F07857] bg-[#FFF4E6] px-2 py-0.5 rounded-md">{bfsResult.visited.length} Nodes</span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto text-[11px]">
                {bfsResult.trace.map((t, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#FFF9F0] space-y-1 border border-[#EAE2D8]">
                    <div className="font-bold text-[#202C45]">
                      Queue: [{t.currentQueue.join(', ')}]
                    </div>
                    <div className="text-[11px] text-[#64748B]">
                      Step: #{t.step} · Node: <span className="font-semibold text-[#202C45]">{t.currentNodeLabel}</span> · {t.actionDescription}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
