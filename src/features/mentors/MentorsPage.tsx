import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mentor } from '../../types';
import { AVAILABLE_SUBJECTS, AVAILABLE_INTERESTS, AVAILABLE_SLOTS } from '../../database/seedData';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  Eye,
  X,
  Users,
  Briefcase,
  Calendar,
  AlertCircle,
  GraduationCap,
  BookOpen,
} from 'lucide-react';

export const MentorsPage: React.FC = () => {
  const { mentors, addMentor, updateMentor, deleteMentor } = useApp();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [capacityFilter, setCapacityFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null);
  const [viewingMentor, setViewingMentor] = useState<Mentor | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form states
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formType, setFormType] = useState<Mentor['mentor_type']>('Faculty');
  const [formDept, setFormDept] = useState('');
  const [formExpertise, setFormExpertise] = useState<string[]>([]);
  const [formInterests, setFormInterests] = useState<string[]>([]);
  const [formSlots, setFormSlots] = useState<string[]>([]);
  const [formCapacity, setFormCapacity] = useState<number>(3);
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingMentor(null);
    setFormId(`MTR-${200 + mentors.length + 1}`);
    setFormName('');
    setFormEmail('');
    setFormType('Faculty');
    setFormDept('Computer Science & Engineering');
    setFormExpertise([]);
    setFormInterests([]);
    setFormSlots([]);
    setFormCapacity(3);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (m: Mentor) => {
    setEditingMentor(m);
    setFormId(m.mentor_id);
    setFormName(m.name);
    setFormEmail(m.email);
    setFormType(m.mentor_type);
    setFormDept(m.department || '');
    setFormExpertise([...m.expertise]);
    setFormInterests([...m.interests]);
    setFormSlots([...m.free_slots]);
    setFormCapacity(m.max_capacity);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formName.trim()) {
      setFormError('Please enter mentor name.');
      return;
    }
    if (formExpertise.length === 0) {
      setFormError('Please select at least one area of expertise.');
      return;
    }
    if (formSlots.length === 0) {
      setFormError('Please select at least one time slot.');
      return;
    }
    if (formCapacity <= 0) {
      setFormError('Capacity must be at least 1.');
      return;
    }
    if (editingMentor && formCapacity < editingMentor.current_load) {
      setFormError(`Capacity cannot be lower than current load (${editingMentor.current_load}).`);
      return;
    }

    const mentorData: Mentor = {
      mentor_id: formId,
      name: formName.trim(),
      email: formEmail.trim() || `${formName.toLowerCase().replace(/\s+/g, '.')}@campus.edu`,
      mentor_type: formType,
      department: formDept.trim() || 'Computer Science & Engineering',
      expertise: formExpertise,
      interests: formInterests.length > 0 ? formInterests : ['Academic Research'],
      free_slots: formSlots,
      max_capacity: formCapacity,
      current_load: editingMentor ? editingMentor.current_load : 0,
      created_at: editingMentor ? editingMentor.created_at : new Date().toISOString(),
    };

    if (editingMentor) {
      updateMentor(mentorData);
    } else {
      addMentor(mentorData);
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

  const filteredMentors = mentors.filter(m => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.mentor_id.toLowerCase().includes(search.toLowerCase()) ||
      m.expertise.some(exp => exp.toLowerCase().includes(search.toLowerCase()));

    const matchType = typeFilter === 'All' || m.mentor_type === typeFilter;
    const matchCapacity =
      capacityFilter === 'All' ||
      (capacityFilter === 'Available' && m.current_load < m.max_capacity) ||
      (capacityFilter === 'Full' && m.current_load >= m.max_capacity);

    return matchSearch && matchType && matchCapacity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#202C45]">Faculty Advisor Directory</h2>
          <p className="text-xs text-[#64748B]">
            Faculty and senior student mentors with capacity quotas, expertise vectors, and availability.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-[#F07857] hover:bg-[#DE6240] text-white text-xs font-bold transition flex items-center gap-2 self-start sm:self-auto shadow-xs active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Advisor</span>
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
            placeholder="Search by mentor name, ID (e.g. MTR-201), or expertise..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#FFF9F0] border border-[#EAE2D8] rounded-xl text-[#202C45] focus:outline-none focus:border-[#5478D4] focus:ring-1 focus:ring-[#5478D4] transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-[#FFF9F0] border border-[#EAE2D8] rounded-xl text-[#202C45] text-xs font-medium focus:outline-none focus:border-[#5478D4]"
          >
            <option value="All">All Types</option>
            <option value="Faculty">Faculty</option>
            <option value="Senior Student">Senior Student</option>
          </select>

          <select
            value={capacityFilter}
            onChange={e => setCapacityFilter(e.target.value)}
            className="px-3 py-2 bg-[#FFF9F0] border border-[#EAE2D8] rounded-xl text-[#202C45] text-xs font-medium focus:outline-none focus:border-[#5478D4]"
          >
            <option value="All">All Capacities</option>
            <option value="Available">Available Slots</option>
            <option value="Full">Full Quota</option>
          </select>
        </div>
      </div>

      {/* Mentor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMentors.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs font-mono text-[#64748B] bg-white rounded-2xl border border-[#EAE2D8]">
            No advisor profiles match filter criteria.
          </div>
        ) : (
          filteredMentors.map(mentor => {
            const isFull = mentor.current_load >= mentor.max_capacity;
            const remaining = Math.max(0, mentor.max_capacity - mentor.current_load);
            const utilPercent = Math.round((mentor.current_load / mentor.max_capacity) * 100);

            return (
              <div
                key={mentor.mentor_id}
                className="bg-white rounded-2xl border border-[#EAE2D8] p-5 flex flex-col justify-between space-y-4 shadow-xs hover:border-[#5478D4]/40 hover:shadow transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="font-heading font-bold text-sm text-[#202C45]">{mentor.name}</div>
                      <div className="text-[10px] text-[#64748B] font-mono mt-0.5">
                        {mentor.mentor_id} · {mentor.department}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 ${
                        mentor.mentor_type === 'Faculty'
                          ? 'bg-[#E5EDFC] text-[#5478D4]'
                          : 'bg-[#FFF4E6] text-[#F07857]'
                      }`}
                    >
                      {mentor.mentor_type}
                    </span>
                  </div>

                  {/* Expertise tags */}
                  <div className="space-y-1 mb-3">
                    <span className="text-[10px] font-mono uppercase text-[#64748B]">
                      Expertise:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {mentor.expertise.map(exp => (
                        <span
                          key={exp}
                          className="px-2 py-0.5 rounded-md bg-[#FFF9F0] text-[#202C45] text-[10px] font-medium border border-[#EAE2D8]"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] text-[#64748B]">
                    {mentor.free_slots.length} weekly time slot(s)
                  </div>
                </div>

                {/* Bottom workload bar & controls */}
                <div className="pt-3 border-t border-[#EAE2D8] space-y-2.5">
                  <div>
                    <div className="flex justify-between text-[11px] font-medium mb-1">
                      <span className="text-[#202C45] tabular-nums">
                        Capacity: {mentor.current_load} / {mentor.max_capacity}
                      </span>
                      <span className={isFull ? 'text-[#F07857] font-bold' : 'text-[#64748B]'}>
                        {isFull ? 'Full Quota' : `${remaining} slot(s) open`}
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-[#EAE2D8] overflow-hidden">
                      <div
                        style={{ width: `${utilPercent}%` }}
                        className={`h-full rounded-full transition-all duration-300 ${
                          isFull
                            ? 'bg-[#F07857]'
                            : utilPercent > 66
                            ? 'bg-[#F3C969]'
                            : 'bg-[#5478D4]'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1 pt-1">
                    <button
                      onClick={() => setViewingMentor(mentor)}
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#5478D4] hover:bg-[#E5EDFC] transition"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(mentor)}
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#5478D4] hover:bg-[#E5EDFC] transition"
                      title="Edit Profile"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(mentor.mentor_id)}
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#F07857] hover:bg-[#FFF4E6] transition"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Mentor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202C45]/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#EAE2D8] text-[#202C45]">
            <div className="p-5 border-b border-[#EAE2D8] flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-heading text-base font-bold text-[#202C45]">
                  {editingMentor ? 'Edit Advisor Profile' : 'Register New Advisor'}
                </h3>
                <p className="text-xs text-[#64748B]">
                  Configure subject expertise, schedule slots, and maximum mentee capacity.
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
                    ADVISOR ID
                  </label>
                  <input
                    type="text"
                    required
                    value={formId}
                    disabled={!!editingMentor}
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
                    placeholder="e.g. Dr. Kavita Sharma"
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
                    placeholder="kavita@faculty.edu"
                    className="w-full px-3 py-2 bg-[#FFF9F0] border border-[#EAE2D8] rounded-xl text-[#202C45] font-mono focus:outline-none focus:border-[#5478D4]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#202C45] mb-1 font-heading text-[11px]">
                    ADVISOR ROLE
                  </label>
                  <select
                    value={formType}
                    onChange={e => setFormType(e.target.value as Mentor['mentor_type'])}
                    className="w-full px-3 py-2 bg-[#FFF9F0] border border-[#EAE2D8] rounded-xl text-[#202C45] focus:outline-none focus:border-[#5478D4]"
                  >
                    <option value="Faculty">Faculty</option>
                    <option value="Senior Student">Senior Student</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#202C45] mb-1 font-heading text-[11px]">
                    MAXIMUM CAPACITY QUOTA (1-10 MENTEES) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formCapacity}
                    onChange={e => setFormCapacity(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-[#FFF9F0] border border-[#EAE2D8] rounded-xl text-[#202C45] font-mono focus:outline-none focus:border-[#5478D4]"
                  />
                </div>
              </div>

              {/* Areas of Expertise */}
              <div>
                <label className="block font-bold text-[#202C45] mb-1 font-heading text-[11px]">
                  AREAS OF EXPERTISE (SUBJECT MATCH WEIGHT) *
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2.5 bg-[#FFF9F0] rounded-xl border border-[#EAE2D8]">
                  {AVAILABLE_SUBJECTS.map(subj => {
                    const isSelected = formExpertise.includes(subj);
                    return (
                      <button
                        type="button"
                        key={subj}
                        onClick={() => toggleArrayItem(formExpertise, subj, setFormExpertise)}
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

              {/* Free Slots */}
              <div>
                <label className="block font-bold text-[#202C45] mb-1 font-heading text-[11px]">
                  WEEKLY AVAILABLE TIME SLOTS *
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
                  {editingMentor ? 'Save Changes' : 'Register Advisor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mentor Detail Modal */}
      {viewingMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202C45]/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-xl max-w-xl w-full p-6 border border-[#EAE2D8] space-y-4 text-[#202C45]">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D8]">
              <div>
                <h3 className="font-heading text-base font-extrabold text-[#202C45]">{viewingMentor.name}</h3>
                <p className="text-xs text-[#64748B] font-mono">{viewingMentor.mentor_id} · {viewingMentor.department}</p>
              </div>
              <button
                onClick={() => setViewingMentor(null)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#202C45] hover:bg-[#FFF9F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FFF9F0] border border-[#EAE2D8]">
                <span className="text-[10px] font-mono uppercase text-[#64748B] block mb-1">Capacity &amp; Workload</span>
                <div className="text-sm font-bold text-[#202C45]">
                  {viewingMentor.current_load} of {viewingMentor.max_capacity} Mentees Allocated ({Math.max(0, viewingMentor.max_capacity - viewingMentor.current_load)} remaining)
                </div>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[#64748B] block mb-1">Subject Expertise:</span>
                <div className="flex flex-wrap gap-1">
                  {viewingMentor.expertise.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-[#FFF9F0] text-[#202C45] border border-[#EAE2D8] text-[10px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[#64748B] block mb-1">Weekly Time Slots:</span>
                <div className="flex flex-wrap gap-1">
                  {viewingMentor.free_slots.map(slot => (
                    <span key={slot} className="px-2 py-0.5 rounded-md bg-[#E5EDFC] text-[#5478D4] text-[10px] font-mono">
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EAE2D8] flex justify-end">
              <button
                onClick={() => setViewingMentor(null)}
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
              <h3 className="font-heading text-base font-bold text-[#202C45]">Delete Advisor Record?</h3>
              <p className="text-xs text-[#64748B] mt-1 font-mono">
                Confirm deletion for advisor {confirmDeleteId}.
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
                  deleteMentor(confirmDeleteId);
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
