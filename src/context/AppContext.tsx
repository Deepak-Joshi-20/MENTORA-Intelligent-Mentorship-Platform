import React, { createContext, useContext, useState, useEffect } from 'react';
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
import { dataStore } from '../services/dataStore';
import { executeGreedyAllocation } from '../algorithms/greedy/greedyAllocationEngine';

interface AppContextType {
  // Data
  students: Student[];
  mentors: Mentor[];
  requests: MentorshipRequest[];
  allocations: AllocationResult[];
  notifications: SystemNotification[];
  settings: SystemSettings;
  lastBatchRun: AllocationBatchRun | null;
  unreadCount: number;
  previousWeekMetrics: WeeklySnapshot;
  updatePreviousWeekMetrics: (snapshot: WeeklySnapshot) => void;

  // Actions - Students
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (studentId: string) => void;

  // Actions - Mentors
  addMentor: (mentor: Mentor) => void;
  updateMentor: (mentor: Mentor) => void;
  deleteMentor: (mentorId: string) => void;

  // Actions - Requests
  addRequest: (request: MentorshipRequest) => void;
  updateRequest: (request: MentorshipRequest) => void;

  // Actions - Matching & Allocations
  runAllocation: (useMaxHeap?: boolean) => AllocationBatchRun;
  resetAllocations: () => void;
  resetAllDemoData: () => void;

  // Actions - Notifications & Settings
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateSettings: (newSettings: SystemSettings) => void;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;

  // Auth / Navigation / Dialogs
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  showLanding: boolean;
  setShowLanding: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [allocations, setAllocations] = useState<AllocationResult[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(dataStore.getSettings());
  const [lastBatchRun, setLastBatchRun] = useState<AllocationBatchRun | null>(null);
  const [previousWeekMetrics, setPreviousWeekMetricsState] = useState<WeeklySnapshot>(() =>
    dataStore.getPreviousWeekMetrics()
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('mentora_auth_state') === 'true';
  });
  const [activeNav, setActiveNav] = useState<string>('dashboard');
  const [showLanding, setShowLanding] = useState<boolean>(() => {
    // If not authenticated, start on landing page by default
    return localStorage.getItem('mentora_auth_state') !== 'true';
  });

  const refreshAllState = () => {
    setStudents(dataStore.getStudents());
    setMentors(dataStore.getMentors());
    setRequests(dataStore.getRequests());
    setAllocations(dataStore.getAllocations());
    setNotifications(dataStore.getNotifications());
    setSettings(dataStore.getSettings());
    setLastBatchRun(dataStore.getLastBatchRun());
    setPreviousWeekMetricsState(dataStore.getPreviousWeekMetrics());
  };

  const updatePreviousWeekMetrics = (snapshot: WeeklySnapshot) => {
    dataStore.savePreviousWeekMetrics(snapshot);
    setPreviousWeekMetricsState(snapshot);
  };

  useEffect(() => {
    dataStore.initializeDefaults();
    refreshAllState();
  }, []);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    dataStore.addNotification({ title, message, type });
    setNotifications(dataStore.getNotifications());
  };

  // Student Actions
  const addStudent = (student: Student) => {
    dataStore.addStudent(student);
    refreshAllState();
    showToast('Student Added', `${student.name} was successfully registered.`, 'success');
  };

  const updateStudent = (student: Student) => {
    dataStore.updateStudent(student);
    refreshAllState();
    showToast('Student Updated', `${student.name} profile has been updated.`, 'info');
  };

  const deleteStudent = (studentId: string) => {
    dataStore.deleteStudent(studentId);
    refreshAllState();
    showToast('Student Removed', `Student ${studentId} was deleted.`, 'warning');
  };

  // Mentor Actions
  const addMentor = (mentor: Mentor) => {
    dataStore.addMentor(mentor);
    refreshAllState();
    showToast('Mentor Added', `${mentor.name} is now available in the mentor pool.`, 'success');
  };

  const updateMentor = (mentor: Mentor) => {
    dataStore.updateMentor(mentor);
    refreshAllState();
    showToast('Mentor Updated', `${mentor.name} capacity/expertise updated.`, 'info');
  };

  const deleteMentor = (mentorId: string) => {
    dataStore.deleteMentor(mentorId);
    refreshAllState();
    showToast('Mentor Removed', `Mentor ${mentorId} has been removed.`, 'warning');
  };

  // Request Actions
  const addRequest = (request: MentorshipRequest) => {
    dataStore.addRequest(request);
    refreshAllState();
    showToast('Request Logged', `Mentorship request registered for ${request.student_name}.`, 'info');
  };

  const updateRequest = (request: MentorshipRequest) => {
    dataStore.updateRequest(request);
    refreshAllState();
  };

  // Allocation Execution
  const runAllocation = (useMaxHeap = false): AllocationBatchRun => {
    const currentStudents = dataStore.getStudents();
    const currentMentors = dataStore.getMentors();

    const { batchRun, updatedStudents, updatedMentors } = executeGreedyAllocation(
      currentStudents,
      currentMentors,
      {
        minScoreThreshold: settings.min_score_threshold,
        prioritizeWeakSubjectsCount: settings.prioritize_by_weak_subjects_count,
        useMaxHeap,
      }
    );

    // Save newly allocated students & mentors
    dataStore.saveStudents(updatedStudents);
    dataStore.saveMentors(updatedMentors);

    // Update existing allocations list
    const existingAllocations = dataStore.getAllocations();
    const combinedAllocations = [...existingAllocations, ...batchRun.successful_allocations];
    dataStore.saveAllocations(combinedAllocations);

    // Update Requests statuses
    const updatedRequests = dataStore.getRequests().map(req => {
      const matched = batchRun.successful_allocations.find(a => a.student_id === req.student_id);
      if (matched) {
        return {
          ...req,
          status: 'Allocated' as const,
          allocated_mentor_id: matched.mentor_id,
          allocated_mentor_name: matched.mentor_name,
        };
      }
      const unallocated = batchRun.unallocated_students.find(u => u.student_id === req.student_id);
      if (unallocated) {
        return {
          ...req,
          status: 'Unallocated' as const,
          rejection_reason: unallocated.reasons.join('; '),
        };
      }
      return req;
    });
    dataStore.saveRequests(updatedRequests);

    // Save batch run audit log
    dataStore.saveLastBatchRun(batchRun);

    showToast(
      'Allocation Completed',
      `Matched ${batchRun.successful_allocations.length} students. ${batchRun.unallocated_students.length} unallocated.`,
      batchRun.successful_allocations.length > 0 ? 'success' : 'warning'
    );

    refreshAllState();
    return batchRun;
  };

  const resetAllocations = () => {
    // Reset student statuses to Unallocated
    const unallocatedStudents = dataStore.getStudents().map(s => ({
      ...s,
      allocation_status: 'Unallocated' as const,
      assigned_mentor_id: undefined,
      assigned_mentor_name: undefined,
    }));
    // Reset mentor loads to 0
    const resetMentors = dataStore.getMentors().map(m => ({
      ...m,
      current_load: 0,
    }));
    // Reset requests
    const resetReqs = dataStore.getRequests().map(r => ({
      ...r,
      status: 'Pending' as const,
      allocated_mentor_id: undefined,
      rejection_reason: undefined,
    }));

    dataStore.saveStudents(unallocatedStudents);
    dataStore.saveMentors(resetMentors);
    dataStore.saveRequests(resetReqs);
    dataStore.saveAllocations([]);
    localStorage.removeItem('mentora_last_batch_v1');

    refreshAllState();
    showToast('Allocations Cleared', 'All student and mentor allocation states have been reset.', 'info');
  };

  const resetAllDemoData = () => {
    dataStore.resetToDemo();
    refreshAllState();
    showToast('System Reset', 'All records restored to fresh demonstration seed data.', 'success');
  };

  // Notification Actions
  const markNotificationRead = (id: string) => {
    dataStore.markNotificationAsRead(id);
    setNotifications(dataStore.getNotifications());
  };

  const markAllNotificationsRead = () => {
    dataStore.markAllNotificationsRead();
    setNotifications(dataStore.getNotifications());
  };

  const updateSettings = (newSettings: SystemSettings) => {
    dataStore.saveSettings(newSettings);
    setSettings(newSettings);
    showToast('Settings Updated', 'Matching parameters updated.', 'info');
  };

  // Demo Auth
  const login = (email: string, pass: string): boolean => {
    if (email.trim().toLowerCase() === 'admin@mentora.demo' && pass === 'demo123') {
      localStorage.setItem('mentora_auth_state', 'true');
      setIsAuthenticated(true);
      showToast('Welcome, Administrator', 'Successfully signed in to Mentora.', 'success');
      return true;
    }
    // Also accept any valid demo input
    if (email.includes('@') && pass.length >= 4) {
      localStorage.setItem('mentora_auth_state', 'true');
      setIsAuthenticated(true);
      showToast('Welcome to Mentora', 'Authenticated under Demonstration Mode.', 'success');
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('mentora_auth_state');
    setIsAuthenticated(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        students,
        mentors,
        requests,
        allocations,
        notifications,
        settings,
        lastBatchRun,
        unreadCount,
        addStudent,
        updateStudent,
        deleteStudent,
        addMentor,
        updateMentor,
        deleteMentor,
        addRequest,
        updateRequest,
        runAllocation,
        resetAllocations,
        resetAllDemoData,
        markNotificationRead,
        markAllNotificationsRead,
        updateSettings,
        showToast,
        isAuthenticated,
        login,
        logout,
        activeNav,
        setActiveNav,
        showLanding,
        setShowLanding,
        previousWeekMetrics,
        updatePreviousWeekMetrics,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
