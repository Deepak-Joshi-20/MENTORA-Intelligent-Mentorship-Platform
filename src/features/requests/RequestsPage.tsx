import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MentorshipRequest } from '../../types';
import {
  Search,
  Plus,
  Clock,
  CheckCircle2,
  X,
  Eye,
} from 'lucide-react';

export const RequestsPage: React.FC = () => {
  const { requests, students, addRequest } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [formError, setFormError] = useState('');
  const [viewingRequest, setViewingRequest] = useState<MentorshipRequest | null>(null);

  const eligibleStudents = students.filter(
    s => s.allocation_status !== 'Allocated' && !requests.some(r => r.student_id === s.student_id && r.status === 'Pending')
  );

  const openAddModal = () => {
    setSelectedStudentId(eligibleStudents[0]?.student_id || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!selectedStudentId) {
      setFormError('Please select a student.');
      return;
    }

    const student = students.find(s => s.student_id === selectedStudentId);
    if (!student) {
      setFormError('Student record not found.');
      return;
    }

    if (requests.some(r => r.student_id === student.student_id && r.status === 'Pending')) {
      setFormError(`Student ${student.name} already has an active pending request.`);
      return;
    }

    const newRequest: MentorshipRequest = {
      request_id: `REQ-${Date.now().toString().slice(-4)}`,
      student_id: student.student_id,
      student_name: student.name,
      weak_subjects: [...student.weak_subjects],
      interests: [...student.interests],
      free_slots: [...student.free_slots],
      preferred_mentor_type: student.preferred_mentor_type,
      request_date: new Date().toISOString(),
      status: 'Pending',
    };

    addRequest(newRequest);
    setIsModalOpen(false);
  };

  const filteredRequests = requests.filter(r => {
    const matchSearch =
      r.student_name.toLowerCase().includes(search.toLowerCase()) ||
      r.request_id.toLowerCase().includes(search.toLowerCase()) ||
      r.student_id.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#202C45]">Guidance Requests</h2>
          <p className="text-xs text-[#64748B]">
            Track submitted student guidance requests and their algorithmic assignment lifecycle.
          </p>
        </div>

        <button
          onClick={openAddModal}
          disabled={eligibleStudents.length === 0}
          className="px-4 py-2.5 rounded-xl bg-[#F07857] hover:bg-[#DE6240] text-white text-xs font-bold transition flex items-center gap-2 self-start sm:self-auto shadow-xs disabled:opacity-50 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Guidance Request</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#EAE2D8] flex flex-col sm:flex-row items-center gap-3 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by student name or request ID..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#FFF9F0] border border-[#EAE2D8] rounded-xl text-[#202C45] focus:outline-none focus:border-[#5478D4] focus:ring-1 focus:ring-[#5478D4] transition"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-[#FFF9F0] border border-[#EAE2D8] rounded-xl text-[#202C45] text-xs font-medium w-full sm:w-auto focus:outline-none focus:border-[#5478D4]"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending Assignment</option>
          <option value="Allocated">Allocated</option>
        </select>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-[#EAE2D8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF9F0] border-b border-[#EAE2D8] text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
              <tr>
                <th className="px-4 py-3.5 font-bold">Request ID</th>
                <th className="px-4 py-3.5 font-bold">Student Name</th>
                <th className="px-4 py-3.5 font-bold">Challenge Subjects</th>
                <th className="px-3 py-3.5 font-bold">Preferred Role</th>
                <th className="px-3 py-3.5 font-bold">Submission Date</th>
                <th className="px-3 py-3.5 font-bold">Status</th>
                <th className="px-4 py-3.5 text-right font-bold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2D8]">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-xs text-[#64748B]">
                    No mentorship requests match current filter.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req, idx) => {
                  const isAllocated = req.status === 'Allocated';

                  return (
                    <tr
                      key={req.request_id}
                      className={`transition-colors ${idx % 2 === 1 ? 'bg-[#FFF9F0]/25' : 'bg-white'} hover:bg-[#FFF4E6]/50`}
                    >
                      <td className="px-4 py-3.5 font-mono font-bold text-[#F07857]">
                        {req.request_id}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-heading font-bold text-[#202C45]">{req.student_name}</div>
                        <div className="text-[10px] text-[#64748B] font-mono">{req.student_id}</div>
                      </td>

                      <td className="px-4 py-3.5 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {req.weak_subjects.map(s => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded-md bg-[#FFF4E6] text-[#F07857] text-[10px] font-semibold border border-[#F07857]/20"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-3 py-3.5 text-[#202C45] font-medium">
                        {req.preferred_mentor_type}
                      </td>

                      <td className="px-3 py-3.5 text-[#64748B] text-[11px] tabular-nums">
                        {new Date(req.request_date).toLocaleDateString()}
                      </td>

                      <td className="px-3 py-3.5">
                        {isAllocated ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#E5EDFC] text-[#63AFA3] text-[10px] font-bold border border-[#63AFA3]/30">
                            <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                            <span>Allocated</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#FFF4E6] text-[#F07857] text-[10px] font-bold border border-[#F07857]/30">
                            <Clock className="w-3 h-3 stroke-[2.5]" />
                            <span>Pending</span>
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => setViewingRequest(req)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#5478D4] hover:bg-[#E5EDFC] transition"
                          title="View Request Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202C45]/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-[#EAE2D8] space-y-4 text-[#202C45]">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D8]">
              <div>
                <h3 className="font-heading text-base font-extrabold text-[#202C45]">New Guidance Request</h3>
                <p className="text-xs text-[#64748B]">
                  Select an unallocated student to queue for algorithmic matching.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-[#64748B] hover:text-[#202C45] hover:bg-[#FFF9F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-[#F07857]/10 border border-[#F07857]/30 text-[#F07857] text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#202C45] mb-1 font-heading text-[11px]">
                  SELECT UNALLOCATED STUDENT
                </label>
                <select
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFF9F0] border border-[#EAE2D8] rounded-xl text-[#202C45] focus:outline-none focus:border-[#5478D4]"
                >
                  {eligibleStudents.map(s => (
                    <option key={s.student_id} value={s.student_id}>
                      {s.name} ({s.student_id}) — {s.weak_subjects.join(', ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-[#EAE2D8] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#EAE2D8] text-[#64748B] hover:text-[#202C45] hover:bg-[#FFF9F0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F07857] hover:bg-[#DE6240] text-white font-bold shadow-xs active:scale-95"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Request Modal */}
      {viewingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202C45]/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-[#EAE2D8] space-y-4 text-[#202C45]">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D8]">
              <div>
                <h3 className="font-heading text-base font-extrabold text-[#202C45]">
                  Request {viewingRequest.request_id}
                </h3>
                <p className="text-xs text-[#64748B] font-mono">
                  Submitted for {viewingRequest.student_name} ({viewingRequest.student_id})
                </p>
              </div>
              <button
                onClick={() => setViewingRequest(null)}
                className="p-1.5 rounded-xl text-[#64748B] hover:text-[#202C45] hover:bg-[#FFF9F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FFF9F0] border border-[#EAE2D8]">
                <span className="text-[10px] font-mono uppercase text-[#64748B] block mb-1">Status</span>
                <span className="font-bold text-[#202C45]">{viewingRequest.status}</span>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[#64748B] block mb-1">Challenge Subjects:</span>
                <div className="flex flex-wrap gap-1">
                  {viewingRequest.weak_subjects.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-[#FFF4E6] text-[#F07857] text-[10px] font-semibold border border-[#F07857]/20">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[#64748B] block mb-1">Free Schedule Slots:</span>
                <div className="flex flex-wrap gap-1">
                  {viewingRequest.free_slots.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-[#E5EDFC] text-[#5478D4] text-[10px] font-mono">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EAE2D8] flex justify-end">
              <button
                onClick={() => setViewingRequest(null)}
                className="px-5 py-2 rounded-xl bg-[#F07857] text-white font-bold text-xs shadow-xs hover:bg-[#DE6240]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
