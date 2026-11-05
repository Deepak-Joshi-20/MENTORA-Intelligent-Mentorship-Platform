import {
  Student,
  Mentor,
  MentorshipRequest,
  AllocationResult,
  SystemNotification,
  SystemSettings,
  AllocationBatchRun,
  WeeklySnapshot,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_MENTORS,
  INITIAL_REQUESTS,
} from '../database/seedData';

const STORAGE_KEYS = {
  STUDENTS: 'mentora_students_v1',
  MENTORS: 'mentora_mentors_v1',
  REQUESTS: 'mentora_requests_v1',
  ALLOCATIONS: 'mentora_allocations_v1',
  NOTIFICATIONS: 'mentora_notifications_v1',
  SETTINGS: 'mentora_settings_v1',
  LAST_BATCH: 'mentora_last_batch_v1',
  AUTH: 'mentora_auth_v1',
  WEEKLY_SNAPSHOT: 'mentora_weekly_snapshot_v1',
};

export const DEFAULT_PREVIOUS_WEEK_METRICS: WeeklySnapshot = {
  snapshot_date: '2026-10-29T00:00:00Z',
  total_students: 12,
  active_mentors: 7,
  pending_requests: 11,
  successful_allocations: 3,
  unallocated_students: 9,
  average_match_score: 72.5,
};

export const DEFAULT_SETTINGS: SystemSettings = {
  min_score_threshold: 50,
  prioritize_by_weak_subjects_count: true,
  allow_partial_subject_match: true,
  academic_year_filter: 'All',
};

class DataStoreService {
  private get<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data) as T;
    } catch {
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to save key ${key} to localStorage:`, e);
    }
  }

  // Initial Seed Check
  public initializeDefaults(): void {
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      this.set(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.MENTORS)) {
      this.set(STORAGE_KEYS.MENTORS, INITIAL_MENTORS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
      this.set(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ALLOCATIONS)) {
      this.set(STORAGE_KEYS.ALLOCATIONS, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this.set(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.WEEKLY_SNAPSHOT)) {
      this.set(STORAGE_KEYS.WEEKLY_SNAPSHOT, DEFAULT_PREVIOUS_WEEK_METRICS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      const initialNotes: SystemNotification[] = [
        {
          id: 'note-1',
          title: 'Welcome to Mentora Platform',
          message: 'System seeded with 13 sample students and 7 faculty/senior mentors.',
          type: 'info',
          timestamp: new Date().toISOString(),
          read: false,
        },
        {
          id: 'note-2',
          title: 'Ready for Smart Allocation',
          message: '13 students are waiting for greedy allocation based on DSA-II matching.',
          type: 'success',
          timestamp: new Date().toISOString(),
          read: false,
          linkTo: 'smart-allocation',
        },
      ];
      this.set(STORAGE_KEYS.NOTIFICATIONS, initialNotes);
    }
  }

  // Students
  public getStudents(): Student[] {
    this.initializeDefaults();
    return this.get<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  }

  public saveStudents(students: Student[]): void {
    this.set(STORAGE_KEYS.STUDENTS, students);
  }

  public addStudent(student: Student): void {
    const list = this.getStudents();
    list.push(student);
    this.saveStudents(list);

    // Auto-create a pending MentorshipRequest
    const req: MentorshipRequest = {
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
    this.addRequest(req);
  }

  public updateStudent(student: Student): void {
    const list = this.getStudents().map(s => (s.student_id === student.student_id ? student : s));
    this.saveStudents(list);
  }

  public deleteStudent(studentId: string): void {
    const list = this.getStudents().filter(s => s.student_id !== studentId);
    this.saveStudents(list);

    // Also remove from allocations & requests if any
    const allocations = this.getAllocations().filter(a => a.student_id !== studentId);
    this.saveAllocations(allocations);

    const requests = this.getRequests().filter(r => r.student_id !== studentId);
    this.saveRequests(requests);
  }

  // Mentors
  public getMentors(): Mentor[] {
    this.initializeDefaults();
    return this.get<Mentor[]>(STORAGE_KEYS.MENTORS, INITIAL_MENTORS);
  }

  public saveMentors(mentors: Mentor[]): void {
    this.set(STORAGE_KEYS.MENTORS, mentors);
  }

  public addMentor(mentor: Mentor): void {
    const list = this.getMentors();
    list.push(mentor);
    this.saveMentors(list);
  }

  public updateMentor(mentor: Mentor): void {
    const list = this.getMentors().map(m => (m.mentor_id === mentor.mentor_id ? mentor : m));
    this.saveMentors(list);
  }

  public deleteMentor(mentorId: string): void {
    const list = this.getMentors().filter(m => m.mentor_id !== mentorId);
    this.saveMentors(list);
  }

  // Requests
  public getRequests(): MentorshipRequest[] {
    this.initializeDefaults();
    return this.get<MentorshipRequest[]>(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  }

  public saveRequests(requests: MentorshipRequest[]): void {
    this.set(STORAGE_KEYS.REQUESTS, requests);
  }

  public addRequest(request: MentorshipRequest): void {
    const list = this.getRequests();
    list.unshift(request);
    this.saveRequests(list);
  }

  public updateRequest(request: MentorshipRequest): void {
    const list = this.getRequests().map(r => (r.request_id === request.request_id ? request : r));
    this.saveRequests(list);
  }

  // Allocations
  public getAllocations(): AllocationResult[] {
    this.initializeDefaults();
    return this.get<AllocationResult[]>(STORAGE_KEYS.ALLOCATIONS, []);
  }

  public saveAllocations(allocations: AllocationResult[]): void {
    this.set(STORAGE_KEYS.ALLOCATIONS, allocations);
  }

  // Last Batch Run
  public getLastBatchRun(): AllocationBatchRun | null {
    return this.get<AllocationBatchRun | null>(STORAGE_KEYS.LAST_BATCH, null);
  }

  public saveLastBatchRun(run: AllocationBatchRun): void {
    this.set(STORAGE_KEYS.LAST_BATCH, run);
  }

  // Settings
  public getSettings(): SystemSettings {
    this.initializeDefaults();
    return this.get<SystemSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  public saveSettings(settings: SystemSettings): void {
    this.set(STORAGE_KEYS.SETTINGS, settings);
  }

  // Previous Week Historical Snapshot
  public getPreviousWeekMetrics(): WeeklySnapshot {
    this.initializeDefaults();
    return this.get<WeeklySnapshot>(STORAGE_KEYS.WEEKLY_SNAPSHOT, DEFAULT_PREVIOUS_WEEK_METRICS);
  }

  public savePreviousWeekMetrics(snapshot: WeeklySnapshot): void {
    this.set(STORAGE_KEYS.WEEKLY_SNAPSHOT, snapshot);
  }

  // Notifications
  public getNotifications(): SystemNotification[] {
    this.initializeDefaults();
    return this.get<SystemNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  }

  public saveNotifications(notifications: SystemNotification[]): void {
    this.set(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }

  public addNotification(note: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>): void {
    const notes = this.getNotifications();
    const newNote: SystemNotification = {
      ...note,
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    notes.unshift(newNote);
    this.saveNotifications(notes.slice(0, 30));
  }

  public markNotificationAsRead(id: string): void {
    const notes = this.getNotifications().map(n => (n.id === id ? { ...n, read: true } : n));
    this.saveNotifications(notes);
  }

  public markAllNotificationsRead(): void {
    const notes = this.getNotifications().map(n => ({ ...n, read: true }));
    this.saveNotifications(notes);
  }

  // Reset to initial demo state
  public resetToDemo(): void {
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.MENTORS);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.ALLOCATIONS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.LAST_BATCH);
    localStorage.removeItem(STORAGE_KEYS.WEEKLY_SNAPSHOT);
    this.initializeDefaults();
  }

  // Export full JSON
  public exportData(): string {
    const payload = {
      app: 'MENTORA',
      version: '2.0.0',
      exported_at: new Date().toISOString(),
      students: this.getStudents(),
      mentors: this.getMentors(),
      requests: this.getRequests(),
      allocations: this.getAllocations(),
      settings: this.getSettings(),
    };
    return JSON.stringify(payload, null, 2);
  }

  // Import JSON with validation
  public importData(jsonString: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.students || !Array.isArray(parsed.students)) {
        return { success: false, message: 'Invalid payload: missing students array.' };
      }
      if (!parsed.mentors || !Array.isArray(parsed.mentors)) {
        return { success: false, message: 'Invalid payload: missing mentors array.' };
      }

      this.saveStudents(parsed.students);
      this.saveMentors(parsed.mentors);
      if (Array.isArray(parsed.requests)) this.saveRequests(parsed.requests);
      if (Array.isArray(parsed.allocations)) this.saveAllocations(parsed.allocations);
      if (parsed.settings) this.saveSettings(parsed.settings);

      return { success: true, message: 'Application state restored successfully!' };
    } catch (e) {
      return { success: false, message: `Failed to parse JSON file: ${(e as Error).message}` };
    }
  }
}

export const dataStore = new DataStoreService();
