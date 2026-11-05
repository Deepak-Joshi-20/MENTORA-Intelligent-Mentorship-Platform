import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { AVAILABLE_SUBJECTS, AVAILABLE_INTERESTS, AVAILABLE_SLOTS } from '../../database/seedData';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  Eye,
  X,
  Filter,
  CheckCircle2,
  Clock,
  BookOpen,
  Calendar,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';

export const StudentsPage: React.FC = () => {
  const { students, addStudent, updateStudent, deleteStudent } = useApp();

  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form states
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formYear, setFormYear] = useState<Student['academic_year']>('2nd Year');
  const [formWeakSubjects, setFormWeakSubjects] = useState<string[]>([]);
  const [formInterests, setFormInterests] = useState<string[]>([]);
  const [formSlots, setFormSlots] = useState<string[]>([]);
  const [formMentorType, setFormMentorType] = useState<Student['preferred_mentor_type']>('Any');
  const [formNotes, setFormNotes] = useState('');
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingStudent(null);
    setFormId(`STU-${100 + students.length + 1}`);
    setFormName('');
    setFormEmail('');
    setFormYear('2nd Year');
    setFormWeakSubjects([]);
    setFormInterests([]);
    setFormSlots([]);
    setFormMentorType('Any');
    setFormNotes('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (s: Student) => {
    setEditingStudent(s);
    setFormId(s.student_id);
    setFormName(s.name);
    setFormEmail(s.email);
    setFormYear(s.academic_year);
    setFormWeakSubjects([...s.weak_subjects]);
    setFormInterests([...s.interests]);
    setFormSlots([...s.free_slots]);
    setFormMentorType(s.preferred_mentor_type);
    setFormNotes(s.notes || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formName.trim()) {
      setFormError('Please enter student name.');
      return;
    }
    if (formWeakSubjects.length === 0) {
      setFormError('At least one challenge subject is required for matching.');
      return;
    }
    if (formSlots.length === 0) {
      setFormError('Please select at least one available free time slot.');
      return;
    }

    if (!editingStudent && students.some(s => s.student_id === formId)) {
      setFormError(`Student ID ${formId} already exists.`);
      return;
    }

    const studentData: Student = {
      student_id: formId,
      name: formName.trim(),
      email: formEmail.trim() || `${formName.toLowerCase().replace(/\s+/g, '.')}@campus.edu`,
      academic_year: formYear,
      weak_subjects: formWeakSubjects,
      interests: formInterests.length > 0 ? formInterests : ['General Technology'],
      free_slots: formSlots,
      preferred_mentor_type: formMentorType,
      allocation_status: editingStudent ? editingStudent.allocation_status : 'Unallocated',
      assigned_mentor_id: editingStudent ? editingStudent.assigned_mentor_id : undefined,
      assigned_mentor_name: editingStudent ? editingStudent.assigned_mentor_name : undefined,
      notes: formNotes.trim(),
      created_at: editingStudent ? editingStudent.created_at : new Date().toISOString(),
    };

    if (editingStudent) {
      updateStudent(studentData);
    } else {
      addStudent(studentData);
    }
    setIsModalOpen(false);
  };

  const toggleArrayItem = (arr: string[], item: string, setter: (val: string[]) => void) => {
    if (arr.includes(item)) {
      setter(arr.filter(i => i !== item));
    } else {
      setter([...arr, item]);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.student_id.toLowerCase().includes(search.toLowerCase()) ||
      s.weak_subjects.some(sub => sub.toLowerCase().includes(search.toLowerCase()));

    const matchYear = yearFilter === 'All' || s.academic_year === yearFilter;
    const matchStatus = statusFilter === 'All' || s.allocation_status === statusFilter;
    const matchSubject = subjectFilter === 'All' || s.weak_subjects.includes(subjectFilter);

    return matchSearch && matchYear && matchStatus && matchSubject;
  });

  return (
    <div className="space-y-6">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#202C45]">Student Directory</h2>
          <p className="text-xs text-[#64748B]">
            Academic profiles, declared challenge subjects needing mentorship, and scheduling availability.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-[#F07857] hover:bg-[#DE6240] text-white text-xs font-bold transition flex items-center gap-2 self-start sm:self-auto shadow-xs active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#EAE2D8] flex flex-col md:flex-row items-center gap-3 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by student name, ID (e.g. STU-101), or subject..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#FFF9F0] border border-[#EAE2D8] rounded-xl text-[#202C45] focus:outline-none focus:border-[#5478D4] focus:ring-1 focus:ring-[#5478D4] transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
          <select
            value={yearFilter}
            onChange={e => setYearFilter(e.target.value)}
            className="px-3 py-2 bg-[#FFF9F0] border border-[#EAE2D8] rounded-xl text-[#202C45] text-xs font-medium focus:outline-none focus:border-[#5478D4]"
          >
            <option value="All">All Years</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#FFF9F0] border border-[#EAE2D8] rounded-xl text-[#202C45] text-xs font-medium focus:outline-none focus:border-[#5478D4]"
          >
            <option value="All">All Statuses</option>
            <option value="Unallocated">Unallocated</option>
            <option value="Allocated">Allocated</option>
          </select>

          <select
            value={subjectFilter}
            onChange={e => setSubjectFilter(e.target.value)}
            className="px-3 py-2 bg-[#FFF9F0] border border-[#EAE2D8] rounded-xl text-[#202C45] text-xs font-medium max-w-44 truncate focus:outline-none focus:border-[#5478D4]"
          >
            <option value="All">All Subjects</option>
            {AVAILABLE_SUBJECTS.map(subj => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-[#EAE2D8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF9F0] border-b border-[#EAE2D8] text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
              <tr>
                <th className="px-4 py-3.5 font-bold">Student Mentee</th>
                <th className="px-3 py-3.5 font-bold">Year</th>
                <th className="px-4 py-3.5 font-bold">Challenge Subjects</th>
                <th className="px-3 py-3.5 font-bold">Interests</th>
                <th className="px-3 py-3.5 font-bold">Free Slots</th>
                <th className="px-3 py-3.5 font-bold">Status</th>
                <th className="px-4 py-3.5 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2D8]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-xs text-[#64748B]">
                    No students match filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => {
                  const isAllocated = student.allocation_status === 'Allocated';

                  return (
                    <tr
                      key={student.student_id}
                      className={`transition-colors ${idx % 2 === 1 ? 'bg-[#FFF9F0]/25' : 'bg-white'} hover:bg-[#FFF4E6]/50`}
                    >
                      <td className="px-4 py-3.5">
                        <div className="font-heading font-bold text-[#202C45] flex items-center gap-2">
                          <span>{student.name}</span>
                          <span className="text-[10px] font-mono text-[#64748B] bg-[#FFF9F0] px-1.5 py-0.5 rounded border border-[#EAE2D8]">
                            {student.student_id}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#64748B]">{student.email}</div>
                      </td>

                      <td className="px-3 py-3.5 text-[#202C45] font-medium">
                        {student.academic_year}
                      </td>

                      <td className="px-4 py-3.5 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {student.weak_subjects.map(subj => (
                            <span
                              key={subj}
                              className="px-2 py-0.5 rounded-md bg-[#FFF4E6] text-[#F07857] text-[10px] font-semibold border border-[#F07857]/20"
                            >
                              {subj}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-3 py-3.5 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {student.interests.slice(0, 2).map(int => (
                            <span
                              key={int}
                              className="px-2 py-0.5 rounded-md bg-[#E5EDFC] text-[#5478D4] text-[10px] font-medium"
                            >
                              {int}
                            </span>
                          ))}
                          {student.interests.length > 2 && (
                            <span className="text-[10px] text-[#64748B] font-mono self-center">
                              +{student.interests.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-3 py-3.5 text-[#64748B] text-[11px]">
                        {student.free_slots.length} slots
                      </td>

                      <td className="px-3 py-3.5">
                        {isAllocated ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#E5EDFC] text-[#63AFA3] text-[10px] font-bold border border-[#63AFA3]/30">
                            <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                            <span>Matched</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#FFF4E6] text-[#F07857] text-[10px] font-bold border border-[#F07857]/30">
                            <Clock className="w-3 h-3 stroke-[2.5]" />
                            <span>Unallocated</span>
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewingStudent(student)}
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#5478D4] hover:bg-[#E5EDFC] transition"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(student)}
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#5478D4] hover:bg-[#E5EDFC] transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(student.student_id)}
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#F07857] hover:bg-[#FFF4E6] transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202C45]/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#EAE2D8] text-[#202C45]">
            <div className="p-5 border-b border-[#EAE2D8] flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-heading text-base font-bold text-[#202C45]">
                  {editingStudent ? 'Edit Student Profile' : 'Register New Student'}
                </h3>
                <p className="text-xs text-[#64748B]">
                  Configure academic needs and availability for allocation.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-[#64748B] hover:text-[#202C45] hover:bg-[#FFF9F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-[#F07857]/10 border border-[#F07857]/30 text-[#F07857] font-medium font-mono">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#202C45] mb-1 font-heading text-[11px]">
                    STUDENT ID
                  </label>
                  <input
                    type="text"
                    required
                    value={formId}
                    disabled={!!editingStudent}
                    onChange={e => setFormId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF9F0] border border-[#EAE2D8] rounded-xl text-[#202C45] font-mono focus:outline-none focus:border-[#5478D4] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#202C45] mb-1 font-heading text-[11px]">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3 py-2 bg-[#FFF9F0] border border-[#EAE2D8] rounded-xl text-[#202C45] focus:outline-none focus:border-[#5478D4]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#202C45] mb-1 font-heading text-[11px]">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    placeholder="aarav@campus.edu"
                    className="w-full px-3 py-2 bg-[#FFF9F0] border border-[#EAE2D8] rounded-xl text-[#202C45] font-mono focus:outline-none focus:border-[#5478D4]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#202C45] mb-1 font-heading text-[11px]">
                    ACADEMIC YEAR
                  </label>
                  <select
                    value={formYear}
                    onChange={e => setFormYear(e.target.value as Student['academic_year'])}
                    className="w-full px-3 py-2 bg-[#FFF9F0] border border-[#EAE2D8] rounded-xl text-[#202C45] focus:outline-none focus:border-[#5478D4]"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              {/* Weak Subjects Multi-select */}
              <div>
                <label className="block font-bold text-[#202C45] mb-1 font-heading text-[11px]">
                  CHALLENGE SUBJECTS (40% COMPATIBILITY WEIGHT) *
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2.5 bg-[#FFF9F0] rounded-xl border border-[#EAE2D8]">
                  {AVAILABLE_SUBJECTS.map(subj => {
                    const isSelected = formWeakSubjects.includes(subj);
                    return (
                      <button
                        type="button"
                        key={subj}
                        onClick={() => toggleArrayItem(formWeakSubjects, subj, setFormWeakSubjects)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                          isSelected
                            ? 'bg-[#F07857] text-white font-bold shadow-2xs'
                            : 'bg-white text-[#64748B] border border-[#EAE2D8] hover:text-[#202C45]'
                        }`}
                      >
                        {subj}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Free Slots Multi-select */}
              <div>
                <label className="block font-bold text-[#202C45] mb-1 font-heading text-[11px]">
                  AVAILABLE TIME SLOTS (MANDATORY FOR OVERLAP) *
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2.5 bg-[#FFF9F0] rounded-xl border border-[#EAE2D8]">
                  {AVAILABLE_SLOTS.map(slot => {
                    const isSelected = formSlots.includes(slot);
                    return (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => toggleArrayItem(formSlots, slot, setFormSlots)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                          isSelected
                            ? 'bg-[#5478D4] text-white font-bold shadow-2xs'
                            : 'bg-white text-[#64748B] border border-[#EAE2D8] hover:text-[#202C45]'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-[#EAE2D8] flex items-center justify-end gap-2.5">
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
                  {editingStudent ? 'Save Changes' : 'Register Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202C45]/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-xl max-w-xl w-full p-6 border border-[#EAE2D8] space-y-4 text-[#202C45]">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D8]">
              <div>
                <h3 className="font-heading text-base font-extrabold text-[#202C45]">{viewingStudent.name}</h3>
                <p className="text-xs text-[#64748B] font-mono">{viewingStudent.student_id} · {viewingStudent.academic_year}</p>
              </div>
              <button
                onClick={() => setViewingStudent(null)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#202C45] hover:bg-[#FFF9F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FFF9F0] border border-[#EAE2D8]">
                <span className="text-[10px] font-mono uppercase text-[#64748B] block mb-1">Status</span>
                {viewingStudent.allocation_status === 'Allocated' ? (
                  <div className="text-sm font-bold text-[#63AFA3] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Allocated to {viewingStudent.assigned_mentor_name}</span>
                  </div>
                ) : (
                  <div className="text-xs text-[#F07857] flex items-center gap-1.5 font-bold">
                    <Clock className="w-4 h-4" />
                    <span>Pending allocation engine run</span>
                  </div>
                )}
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[#64748B] block mb-1">Challenge Subjects:</span>
                <div className="flex flex-wrap gap-1">
                  {viewingStudent.weak_subjects.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-[#FFF4E6] text-[#F07857] text-[10px] font-semibold border border-[#F07857]/20">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[#64748B] block mb-1">Free Time Slots:</span>
                <div className="flex flex-wrap gap-1">
                  {viewingStudent.free_slots.map(slot => (
                    <span key={slot} className="px-2 py-0.5 rounded-md bg-[#E5EDFC] text-[#5478D4] text-[10px] font-mono">
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EAE2D8] flex justify-end">
              <button
                onClick={() => setViewingStudent(null)}
                className="px-5 py-2 rounded-xl bg-[#F07857] text-white font-bold text-xs shadow-xs hover:bg-[#DE6240]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202C45]/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-xl max-w-sm w-full p-6 border border-[#EAE2D8] text-center space-y-4 text-[#202C45]">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF4E6] text-[#F07857] flex items-center justify-center mx-auto border border-[#F07857]/20">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-[#202C45]">Delete Student Record?</h3>
              <p className="text-xs text-[#64748B] mt-1 font-mono">
                Confirm deletion for student {confirmDeleteId}.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded-xl border border-[#EAE2D8] bg-[#FFF9F0] text-[#64748B] text-xs font-semibold hover:bg-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteStudent(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#F07857] text-white text-xs font-bold transition shadow-xs hover:bg-[#DE6240]"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
