import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Role,
  User,
  SchoolProfile,
  Teacher,
  Student,
  ClassRoom,
  AcademicYear,
  CalendarEvent,
  LearningElement,
  CapaianPembelajaran,
  TujuanPembelajaran,
  GovCurriculumItem,
  TkCurriculumItem,
  ActiveCurriculum,
  MaterialBankItem,
  ActivityBankItem,
  ProsemItem,
  RPPMItem,
  RPPHItem,
  AttendanceRecord,
  TeacherAttendanceRecord,
  AssessmentRecord,
  ReportCard,
  Announcement,
  ActivityLog,
  AppNotification,
  AttendanceStatus,
  Rombel,
  TeacherPersonalNote,
  RombelChatMessage,
  RombelMeeting,
  MeetingParticipant,
} from '../types';
import {
  INITIAL_SCHOOL_PROFILE,
  INITIAL_USERS,
  INITIAL_TEACHERS,
  INITIAL_CLASSES,
  INITIAL_ROMBELS,
  INITIAL_STUDENTS,
  INITIAL_ACADEMIC_YEAR,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_LEARNING_ELEMENTS,
  INITIAL_CP_LIST,
  INITIAL_TP_LIST,
  INITIAL_GOV_CURRICULUM,
  INITIAL_TK_CURRICULUM,
  INITIAL_ACTIVE_CURRICULUM,
  INITIAL_MATERIAL_BANK,
  INITIAL_ACTIVITY_BANK,
  INITIAL_PROSEM,
  INITIAL_RPPM,
  INITIAL_RPPH,
  INITIAL_ATTENDANCE,
  INITIAL_TEACHER_ATTENDANCE,
  INITIAL_ASSESSMENTS,
  INITIAL_REPORT_CARDS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';
import { OFFICIAL_ADMIN_RPPM_TEMPLATE } from '../data/rppmTemplateData';
import { INITIAL_TEACHER_NOTES } from '../data/teacherNotesData';
import { INITIAL_ROMBEL_CHATS, INITIAL_ROMBEL_MEETINGS } from '../data/rombelForumData';
import { api } from '../services/api';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  currentUser: User | null;
  currentRole: Role;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: Role) => void;

  // Scoped Teacher & Rombel Data Context
  currentTeacher: Teacher | null;
  currentRombel: Rombel | null;
  currentClass: ClassRoom | null;
  accessibleStudents: Student[];
  accessibleRombels: Rombel[];
  switchTeacher: (teacherId: string) => void;

  // Scoped Student (Murid / Wali Murid) Data Context
  currentStudent: Student | null;
  switchStudent: (studentId: string) => void;
  
  // Data State
  schoolProfile: SchoolProfile;
  updateSchoolProfile: (profile: SchoolProfile) => void;
  
  teachers: Teacher[];
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (teacher: Teacher) => void;
  deleteTeacher: (id: string) => void;
  
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  addStudentsBulk: (students: (Omit<Student, 'id'> & { id?: string })[]) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  assignStudentsToClass: (studentIds: string[], classId: string, className: string, rombelId?: string, rombelName?: string, teacherName?: string) => void;
  removeStudentFromClass: (studentId: string) => void;
  
  classes: ClassRoom[];
  addClass: (cls: Omit<ClassRoom, 'id'>) => void;
  updateClass: (cls: ClassRoom) => void;
  deleteClass: (id: string) => void;
  
  rombels: Rombel[];
  addRombel: (rombel: Omit<Rombel, 'id'>) => void;
  updateRombel: (rombel: Rombel) => void;
  deleteRombel: (id: string) => void;
  assignStudentsToRombel: (studentIds: string[], classId: string, className: string, rombelId: string, rombelName: string, teacherName: string) => void;
  assignSingleStudentToRombel: (studentId: string, rombelId: string) => void;
  removeStudentFromRombel: (studentId: string) => void;
  
  academicYear: AcademicYear;
  updateAcademicYear: (ay: AcademicYear) => void;
  
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteCalendarEvent: (id: string) => void;
  
  govCurriculum: GovCurriculumItem[];
  addGovCurriculum: (item: Omit<GovCurriculumItem, 'id'>) => void;
  updateGovCurriculum: (item: GovCurriculumItem) => void;
  deleteGovCurriculum: (id: string) => void;
  
  tkCurriculum: TkCurriculumItem[];
  addTkCurriculum: (item: Omit<TkCurriculumItem, 'id'>) => void;
  updateTkCurriculum: (item: TkCurriculumItem) => void;
  deleteTkCurriculum: (id: string) => void;
  
  // CP & TP Bank (Elemen -> CP -> TP)
  learningElements: LearningElement[];
  cpList: CapaianPembelajaran[];
  tpList: TujuanPembelajaran[];
  addCP: (cp: Omit<CapaianPembelajaran, 'id'>) => void;
  updateCP: (cp: CapaianPembelajaran) => void;
  deleteCP: (id: string) => void;
  addTP: (tp: Omit<TujuanPembelajaran, 'id'>) => void;
  updateTP: (tp: TujuanPembelajaran) => void;
  deleteTP: (id: string) => void;
  resetCPTPToDefault: () => void;
  
  activeCurriculum: ActiveCurriculum;
  saveActiveCurriculum: (curriculum: ActiveCurriculum) => void;
  
  materialBank: MaterialBankItem[];
  addMaterialItem: (item: Omit<MaterialBankItem, 'id'>) => void;
  deleteMaterialItem: (id: string) => void;
  
  activityBank: ActivityBankItem[];
  addActivityItem: (item: Omit<ActivityBankItem, 'id'>) => void;
  deleteActivityItem: (id: string) => void;
  
  prosemList: ProsemItem[];
  addProsemItem: (item: Omit<ProsemItem, 'id'>) => void;
  deleteProsemItem: (id: string) => void;
  
  rppmList: RPPMItem[];
  addRPPMItem: (item: Omit<RPPMItem, 'id'>) => void;
  updateRPPMItem: (item: RPPMItem) => void;
  deleteRPPMItem: (id: string) => void;
  resetRPPMToAdminTemplate: (rppmId: string) => void;
  
  rpphList: RPPHItem[];
  saveRPPH: (rpph: RPPHItem) => void;
  deleteRPPH: (id: string) => void;
  generateRPPHFromRPPM: (rppmId: string, dayName: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat', targetDate: string) => RPPHItem;
  syncRPPMToRPPH: (rppmId: string, startDate?: string) => RPPHItem[];
  
  attendanceList: AttendanceRecord[];
  saveAttendanceBulk: (records: { studentId: string; studentName: string; status: AttendanceStatus; note?: string }[], date: string, classId: string) => void;
  saveLeaveRequest: (data: { id?: string; studentId: string; studentName: string; classId: string; date: string; status: AttendanceStatus; note: string; attachmentUrl?: string; attachmentName?: string; attachmentType?: string }) => void;
  deleteAttendanceRecord: (id: string) => void;
  
  teacherAttendanceList: TeacherAttendanceRecord[];
  saveTeacherAttendanceBulk: (records: { teacherId: string; teacherName: string; status: AttendanceStatus; checkInTime?: string; checkOutTime?: string; note?: string; signatureImage?: string }[], date: string) => void;
  
  assessmentList: AssessmentRecord[];
  saveAssessment: (record: Omit<AssessmentRecord, 'id'>) => void;
  deleteAssessment: (id: string) => void;
  
  reportCards: ReportCard[];
  saveReportCard: (report: ReportCard) => void;
  saveReportCardsBulk: (reports: ReportCard[]) => void;
  
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  deleteAnnouncement: (id: string) => void;
  
  // Catatan Pribadi Guru ke Siswa & Komunikasi Wali
  teacherNotes: TeacherPersonalNote[];
  addTeacherNote: (note: Omit<TeacherPersonalNote, 'id' | 'createdAt' | 'isReadByParent'>) => void;
  updateTeacherNote: (note: TeacherPersonalNote) => void;
  deleteTeacherNote: (id: string) => void;
  markTeacherNoteAsRead: (id: string) => void;
  replyTeacherNoteByParent: (id: string, replyMessage: string, parentName?: string) => void;

  // Forum Diskusi & Rapat Online Rombel
  rombelChats: RombelChatMessage[];
  sendRombelChat: (msg: Omit<RombelChatMessage, 'id' | 'timestamp' | 'likes' | 'likedBy'>) => void;
  deleteRombelChat: (id: string) => void;
  togglePinRombelChat: (id: string) => void;
  toggleLikeRombelChat: (id: string, userId: string) => void;

  rombelMeetings: RombelMeeting[];
  createRombelMeeting: (meeting: Omit<RombelMeeting, 'id' | 'meetingCode' | 'participantsCount' | 'activeParticipants'>) => void;
  updateRombelMeetingStatus: (meetingId: string, status: 'live' | 'scheduled' | 'ended') => void;
  deleteRombelMeeting: (id: string) => void;
  joinMeetingParticipant: (meetingId: string, participant: MeetingParticipant) => void;
  leaveMeetingParticipant: (meetingId: string, participantId: string) => void;

  // Manajemen Pengguna Sistem
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  resetUserPassword: (id: string, tempPass: string) => void;

  activityLogs: ActivityLog[];
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  
  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication & session
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [currentRole, setCurrentRole] = useState<Role>(() => {
    return currentUser ? currentUser.role : 'admin';
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    return 'dashboard';
  });

  // Domain state
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>({} as SchoolProfile);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [rombels, setRombels] = useState<Rombel[]>([]);

  const [academicYear, setAcademicYear] = useState<AcademicYear>({ ...INITIAL_ACADEMIC_YEAR, semesters: [] });
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  // User Accounts State
  const [users, setUsers] = useState<User[]>([]);

  // Curriculum State
  const [learningElements, setLearningElements] = useState<LearningElement[]>([]);
  const [cpList, setCpList] = useState<CapaianPembelajaran[]>([]);
  const [tpList, setTpList] = useState<TujuanPembelajaran[]>([]);

  const [govCurriculum, setGovCurriculum] = useState<GovCurriculumItem[]>([]);
  const [tkCurriculum, setTkCurriculum] = useState<TkCurriculumItem[]>([]);
  const [activeCurriculum, setActiveCurriculum] = useState<ActiveCurriculum>({ ...INITIAL_ACTIVE_CURRICULUM, components: [] });
  const [materialBank, setMaterialBank] = useState<MaterialBankItem[]>([]);
  const [activityBank, setActivityBank] = useState<ActivityBankItem[]>([]);

  // Learning Planning & Execution State
  const [prosemList, setProsemList] = useState<ProsemItem[]>([]);
  const [rppmList, setRppmList] = useState<RPPMItem[]>([]);
  const [rpphList, setRpphList] = useState<RPPHItem[]>([]);

  // Assessment & Attendance State
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [teacherAttendanceList, setTeacherAttendanceList] = useState<TeacherAttendanceRecord[]>([]);
  const [assessmentList, setAssessmentList] = useState<AssessmentRecord[]>([]);
  const [reportCards, setReportCards] = useState<ReportCard[]>([]);

  // Communication & Logs
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Catatan Pribadi Guru ke Siswa
  const [teacherNotes, setTeacherNotes] = useState<TeacherPersonalNote[]>([]);

  // Forum Diskusi Rombel (Chat)
  const [rombelChats, setRombelChats] = useState<RombelChatMessage[]>([]);

  // Rapat Online & Streaming Rombel (Meetings)
  const [rombelMeetings, setRombelMeetings] = useState<RombelMeeting[]>([]);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const stateReadyRef = useRef(false);

  useEffect(() => {
    api.resources().then(resources => {
      const first = <T,>(key: string, fallback: T): T => {
        const items = resources[key];
        return items && items.length > 0 ? items[0] as T : fallback;
      };
      const list = <T,>(key: string): T[] => (resources[key] || []) as T[];
      setSchoolProfile(first('school_profile', {} as SchoolProfile));
      setTeachers(list<Teacher>('teachers'));
      setStudents(list<Student>('students'));
      setClasses(list<ClassRoom>('classes'));
      setRombels(list<Rombel>('rombels'));
      setAcademicYear(first('academic_year', { ...INITIAL_ACADEMIC_YEAR, semesters: [] }));
      setCalendarEvents(list<CalendarEvent>('calendar_events'));
      setUsers(list<User>('users'));
      setLearningElements(list<LearningElement>('learning_elements'));
      setCpList(list<CapaianPembelajaran>('cp_list'));
      setTpList(list<TujuanPembelajaran>('tp_list'));
      setGovCurriculum(list<GovCurriculumItem>('gov_curriculum'));
      setTkCurriculum(list<TkCurriculumItem>('tk_curriculum'));
      setActiveCurriculum(first('active_curriculum', { ...INITIAL_ACTIVE_CURRICULUM, components: [] }));
      setMaterialBank(list<MaterialBankItem>('material_bank'));
      setActivityBank(list<ActivityBankItem>('activity_bank'));
      setProsemList(list<ProsemItem>('prosem_list'));
      setRppmList(list<RPPMItem>('rppm_list'));
      setRpphList(list<RPPHItem>('rpph_list'));
      setAttendanceList(list<AttendanceRecord>('attendance_list'));
      setTeacherAttendanceList(list<TeacherAttendanceRecord>('teacher_attendance'));
      setAssessmentList(list<AssessmentRecord>('assessment_list'));
      setReportCards(list<ReportCard>('report_cards'));
      setAnnouncements(list<Announcement>('announcements'));
      setActivityLogs(list<ActivityLog>('activity_logs'));
      setNotifications(list<AppNotification>('notifications'));
      setTeacherNotes(list<TeacherPersonalNote>('teacher_notes'));
      setRombelChats(list<RombelChatMessage>('rombel_chats'));
      setRombelMeetings(list<RombelMeeting>('rombel_meetings'));
      stateReadyRef.current = true;
    }).catch(error => {
      console.error('Unable to load application state from API.', error);
    });
  }, []);

  useEffect(() => {
    if (!stateReadyRef.current) return;
    const values: Record<string, unknown> = {
      school_profile: [{ id: 'school-profile', ...schoolProfile }], teachers, students, classes, rombels,
      academic_year: [{ ...academicYear, id: academicYear.id || 'academic-year' }], calendar_events: calendarEvents, users,
      learning_elements: learningElements, cp_list: cpList, tp_list: tpList,
      gov_curriculum: govCurriculum, tk_curriculum: tkCurriculum,
      active_curriculum: [{ ...activeCurriculum, id: activeCurriculum.id || 'active-curriculum' }],
      material_bank: materialBank, activity_bank: activityBank, prosem_list: prosemList,
      rppm_list: rppmList, rpph_list: rpphList, attendance_list: attendanceList,
      teacher_attendance: teacherAttendanceList, assessment_list: assessmentList,
      report_cards: reportCards, announcements, activity_logs: activityLogs, notifications,
      teacher_notes: teacherNotes, rombel_chats: rombelChats, rombel_meetings: rombelMeetings,
    };
    const timer = window.setTimeout(() => {
      Promise.all(Object.entries(values).map(([key, value]) => api.replaceResource(key, value as unknown[])))
        .catch(error => console.error('Unable to save application resources to API.', error));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [
    schoolProfile, teachers, students, classes, rombels, academicYear, calendarEvents, users,
    learningElements, cpList, tpList, govCurriculum, tkCurriculum, activeCurriculum,
    materialBank, activityBank, prosemList, rppmList, rpphList, attendanceList,
    teacherAttendanceList, assessmentList, reportCards, announcements, activityLogs, notifications,
    teacherNotes, rombelChats, rombelMeetings,
  ]);

  useEffect(() => {
    if (currentUser) setCurrentRole(currentUser.role);
  }, [currentUser]);

  const showToast = (title: string, message?: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addLog = (activity: string, module: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      userName: currentUser ? currentUser.name : 'Sistem',
      userRole: currentRole,
      activity,
      module,
      timestamp: 'Baru saja',
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Scoped Teacher & Rombel Data State
  const currentTeacher: Teacher | null = React.useMemo(() => {
    if (currentRole !== 'guru' || !currentUser) return null;
    if (currentUser.teacherId) {
      const match = teachers.find(t => t.id === currentUser.teacherId);
      if (match) return match;
    }
    // Match by username or name
    const match = teachers.find(
      t => t.username.toLowerCase() === currentUser.username.toLowerCase() ||
           currentUser.username.toLowerCase().includes(t.username.toLowerCase()) ||
           t.name.toLowerCase().includes(currentUser.name.toLowerCase()) ||
           currentUser.name.toLowerCase().includes(t.name.toLowerCase())
    );
    if (match) return match;
    return teachers[0] || null;
  }, [currentRole, currentUser, teachers]);

  const currentRombel: Rombel | null = React.useMemo(() => {
    if (!currentTeacher) return null;
    // 1. Direct match by teacherId
    let found = rombels.find(r => r.teacherId === currentTeacher.id);
    if (found) return found;
    // 2. Match by teacher name
    found = rombels.find(
      r => r.teacherName && (
        r.teacherName.toLowerCase().includes(currentTeacher.name.toLowerCase()) ||
        currentTeacher.name.toLowerCase().includes(r.teacherName.toLowerCase())
      )
    );
    if (found) return found;
    // 3. Fallback by assigned class
    if (currentTeacher.assignedClassId) {
      found = rombels.find(r => r.classId === currentTeacher.assignedClassId);
      if (found) return found;
    }
    return rombels[0] || null;
  }, [currentTeacher, rombels]);

  const currentClass: ClassRoom | null = React.useMemo(() => {
    if (!currentRombel && !currentTeacher) return null;
    const targetClassId = currentRombel?.classId || currentTeacher?.assignedClassId;
    return classes.find(c => c.id === targetClassId) || classes[0] || null;
  }, [currentRombel, currentTeacher, classes]);

  const accessibleStudents: Student[] = React.useMemo(() => {
    if (currentRole === 'guru') {
      if (currentRombel) {
        const filtered = students.filter(
          s => (s.rombelId && s.rombelId === currentRombel.id) ||
               (s.rombelName && s.rombelName.trim().toLowerCase() === currentRombel.name.trim().toLowerCase())
        );
        if (filtered.length > 0) return filtered;
      }
      if (currentClass) {
        const filtered = students.filter(s => s.classId === currentClass.id);
        if (filtered.length > 0) return filtered;
      }
    }
    return students;
  }, [currentRole, currentRombel, currentClass, students]);

  const accessibleRombels: Rombel[] = React.useMemo(() => {
    if (currentRole === 'guru' && currentRombel) {
      return rombels.filter(r => r.id === currentRombel.id);
    }
    return rombels;
  }, [currentRole, currentRombel, rombels]);

  const switchTeacher = (teacherId: string) => {
    const t = teachers.find(item => item.id === teacherId);
    if (t) {
      const targetRombel = rombels.find(r => r.teacherId === t.id);
      const newUser: User = {
        id: `user-${t.id}`,
        username: t.username,
        name: t.name,
        role: 'guru',
        teacherId: t.id,
        email: t.email,
      };
      setCurrentUser(newUser);
      setCurrentRole('guru');
      showToast(
        'Guru & Rombel Aktif Diubah',
        `Sekarang mengelola: ${t.name} (${targetRombel?.fullName || t.position})`,
        'success'
      );
      addLog(`Beralih akun ke ${t.name} - ${targetRombel?.fullName || t.position}`, 'Autentikasi');
    }
  };

  // Scoped Student (Murid / Wali Murid) State
  const currentStudent: Student | null = React.useMemo(() => {
    if (currentRole !== 'murid') return null;
    if (currentUser?.studentId) {
      const match = students.find(s => s.id === currentUser.studentId);
      if (match) return match;
    }
    if (currentUser?.username) {
      const match = students.find(
        s => (s.username && s.username.toLowerCase() === currentUser.username.toLowerCase()) ||
             s.nis === currentUser.username ||
             s.nickname.toLowerCase() === currentUser.username.toLowerCase()
      );
      if (match) return match;
    }
    // Default fallback to Callista or first student
    return students.find(s => s.id === 'murid-callista') || students[0] || null;
  }, [currentRole, currentUser, students]);

  const switchStudent = (studentId: string) => {
    const s = students.find(item => item.id === studentId);
    if (s) {
      const newUser: User = {
        id: `user-${s.id}`,
        username: s.username || s.nickname.toLowerCase(),
        name: `${s.name} (Murid / Wali)`,
        role: 'murid',
        studentId: s.id,
        email: `wali.${s.nickname.toLowerCase()}@gmail.com`,
      };
      setCurrentUser(newUser);
      setCurrentRole('murid');
      showToast(
        'Akun Santri Aktif Diubah',
        `Menampilkan portal ananda: ${s.name} (${s.className || 'Kelas'} - ${s.rombelName || 'Rombel'})`,
        'success'
      );
      addLog(`Beralih profil santri: ${s.name} (${s.className})`, 'Autentikasi');
    }
  };

  // Auth methods
  const login = async (username: string, pass: string): Promise<boolean> => {
    try {
      const result = await api.login(username.trim(), pass);
      setCurrentUser(result.user);
      setCurrentRole(result.user.role);
      setActiveTab('dashboard');
      showToast('Berhasil Masuk', `Selamat datang kembali, ${result.user.name}!`, 'success');
      addLog(`Masuk ke sistem (${result.user.role.toUpperCase()})`, 'Autentikasi');
      return true;
    } catch (error) {
      showToast(
        'Gagal Masuk',
        error instanceof Error ? error.message : 'Username atau kata sandi tidak cocok.',
        'error'
      );
      throw error;
    }
  };

  const logout = () => {
    const name = currentUser?.name;
    setCurrentUser(null);
    showToast('Telah Keluar', 'Sesi Anda telah berakhir dengan aman.', 'info');
    if (name) addLog(`Keluar dari sistem`, 'Autentikasi');
  };

  const switchRole = (role: Role) => {
    const targetUser = INITIAL_USERS.find(u => u.role === role) || {
      id: `user-${role}`,
      username: role,
      name: role === 'admin'
        ? 'Ustadzah Aminah, S.Kom (Tata Usaha)'
        : role === 'guru'
        ? 'Ibu Alfiyah Nurazizah (Wali Rombel Al Quddus)'
        : 'Muhammad Arzan Al-Fatih (Anak / Wali)',
      role,
      teacherId: role === 'guru' ? 'guru-alfiyah' : undefined,
    };
    setCurrentUser(targetUser);
    setCurrentRole(role);
    setActiveTab('dashboard');
    showToast('Role Berganti', `Sekarang Anda menjelajah sebagai: ${role.toUpperCase()}`, 'info');
    addLog(`Beralih peran menjadi ${role.toUpperCase()}`, 'Sistem');
  };

  // Profile
  const updateSchoolProfile = (profile: SchoolProfile) => {
    setSchoolProfile(profile);
    showToast('Profil Disimpan', 'Data profil TK Ceria Bangsa berhasil diperbarui.', 'success');
    addLog('Memperbarui Profil Lembaga TK', 'Profil TK');
  };

  // Teachers
  const addTeacher = (teacher: Omit<Teacher, 'id'>) => {
    const newTeacher: Teacher = {
      ...teacher,
      id: `guru-${Date.now()}`,
    };
    setTeachers(prev => [newTeacher, ...prev]);
    showToast('Guru Ditambahkan', `${teacher.name} berhasil didaftarkan ke sistem.`, 'success');
    addLog(`Menambahkan Guru Baru: ${teacher.name}`, 'Data Guru');
  };

  const updateTeacher = (teacher: Teacher) => {
    setTeachers(prev => prev.map(t => t.id === teacher.id ? teacher : t));
    showToast('Data Guru Diperbarui', `Informasi ${teacher.name} telah disimpan.`, 'success');
    addLog(`Mengedit data Guru: ${teacher.name}`, 'Data Guru');
  };

  const deleteTeacher = (id: string) => {
    const target = teachers.find(t => t.id === id);
    setTeachers(prev => prev.filter(t => t.id !== id));
    showToast('Guru Dihapus', `${target?.name || 'Data guru'} telah dihapus.`, 'info');
    addLog(`Menghapus data Guru: ${target?.name || id}`, 'Data Guru');
  };

  // Students
  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...student,
      id: `murid-${Date.now()}`,
    };
    setStudents(prev => [newStudent, ...prev]);
    showToast('Murid Ditambahkan', `${student.name} berhasil terdaftar di ${student.className}.`, 'success');
    addLog(`Menambahkan Murid Baru: ${student.name}`, 'Data Murid');
  };

  const addStudentsBulk = (newStudentsList: (Omit<Student, 'id'> & { id?: string })[]) => {
    setStudents(prev => {
      let updated = [...prev];

      newStudentsList.forEach(item => {
        // Match by nis, nisn, or name
        const existingIdx = updated.findIndex(
          s => (item.nis && s.nis.trim() === item.nis.trim()) ||
               (item.nisn && s.nisn.trim() === item.nisn.trim()) ||
               (s.name.trim().toLowerCase() === item.name.trim().toLowerCase())
        );

        if (existingIdx >= 0) {
          // Update / merge existing
          updated[existingIdx] = {
            ...updated[existingIdx],
            ...item,
            id: updated[existingIdx].id,
          };
        } else {
          // Insert new
          const id = item.id || `murid-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
          updated = [
            {
              ...item,
              id,
            } as Student,
            ...updated,
          ];
        }
      });

      return updated;
    });

    showToast(
      'Import Excel Berhasil',
      `${newStudentsList.length} data murid berhasil diimpor & disimpan ke sistem.`,
      'success'
    );
    addLog(`Import Data Murid dari Excel: ${newStudentsList.length} murid`, 'Data Murid');
  };

  const updateStudent = (student: Student) => {
    setStudents(prev => prev.map(s => s.id === student.id ? student : s));
    showToast('Data Murid Diperbarui', `Data ${student.name} telah disimpan.`, 'success');
    addLog(`Mengubah data Murid: ${student.name}`, 'Data Murid');
  };

  const deleteStudent = (id: string) => {
    const target = students.find(s => s.id === id);
    setStudents(prev => prev.filter(s => s.id !== id));
    showToast('Murid Dihapus', `${target?.name || 'Data murid'} telah dihapus.`, 'info');
    addLog(`Menghapus data Murid: ${target?.name || id}`, 'Data Murid');
  };

  const assignStudentsToClass = (
    studentIds: string[],
    classId: string,
    className: string,
    rombelId?: string,
    rombelName?: string,
    rombelTeacherName?: string
  ) => {
    setStudents(prev =>
      prev.map(s => {
        if (!studentIds.includes(s.id)) return s;
        return {
          ...s,
          classId,
          className,
          rombelId: rombelId !== undefined ? rombelId : s.rombelId,
          rombelName: rombelName !== undefined ? rombelName : s.rombelName,
          rombelTeacherName: rombelTeacherName !== undefined ? rombelTeacherName : s.rombelTeacherName,
        };
      })
    );
    showToast(
      'Penempatan Berhasil',
      `${studentIds.length} murid berhasil dimasukkan ke ${className}${rombelName && rombelName !== '-' ? ` (${rombelName})` : ''}.`,
      'success'
    );
    addLog(`Menempatkan ${studentIds.length} murid ke kelas ${className}${rombelName && rombelName !== '-' ? ` - ${rombelName}` : ''}`, 'Data Murid');
  };

  const removeStudentFromClass = (studentId: string) => {
    const target = students.find(s => s.id === studentId);
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, classId: '', className: '-', rombelId: '', rombelName: '-', rombelTeacherName: '-' } : s))
    );
    showToast('Murid Dikeluarkan', `${target?.name || 'Murid'} dikeluarkan dari kelas ke status Belum Ada Kelas (-).`, 'info');
    addLog(`Mengeluarkan ${target?.name} dari kelas & rombel`, 'Data Murid');
  };

  // Classes
  const addClass = (cls: Omit<ClassRoom, 'id'>) => {
    const newCls: ClassRoom = {
      ...cls,
      id: `kelas-${Date.now()}`,
    };
    setClasses(prev => [...prev, newCls]);
    showToast('Kelas Dibuat', `Kelas ${cls.name} berhasil ditambahkan.`, 'success');
  };

  const updateClass = (cls: ClassRoom) => {
    setClasses(prev => prev.map(c => c.id === cls.id ? cls : c));
    showToast('Kelas Diperbarui', `Data kelas ${cls.name} disimpan.`, 'success');
  };

  const deleteClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
    showToast('Kelas Dihapus', 'Data kelas telah dihapus.', 'info');
  };

  // Rombel CRUD
  const addRombel = (rombel: Omit<Rombel, 'id'>) => {
    const newRombel: Rombel = {
      ...rombel,
      id: `rombel-${Date.now()}`,
    };
    setRombels(prev => [...prev, newRombel]);
    showToast('Rombel Ditambahkan', `${rombel.fullName || rombel.name} (${rombel.className}) berhasil dibuat.`, 'success');
    addLog(`Menambahkan Rombel: ${rombel.fullName || rombel.name} (${rombel.teacherName})`, 'Data Rombel');
  };

  const updateRombel = (rombel: Rombel) => {
    setRombels(prev => prev.map(r => r.id === rombel.id ? rombel : r));
    setStudents(prev =>
      prev.map(s =>
        s.rombelId === rombel.id
          ? {
              ...s,
              classId: rombel.classId,
              className: rombel.className,
              rombelName: rombel.fullName || rombel.name,
              rombelTeacherName: rombel.teacherName,
            }
          : s
      )
    );
    showToast('Rombel Diperbarui', `Data rombel ${rombel.name} (${rombel.teacherName}) disimpan.`, 'success');
    addLog(`Memperbarui Rombel: ${rombel.fullName || rombel.name}`, 'Data Rombel');
  };

  const deleteRombel = (id: string) => {
    const target = rombels.find(r => r.id === id);
    setRombels(prev => prev.filter(r => r.id !== id));
    setStudents(prev =>
      prev.map(s =>
        s.rombelId === id
          ? { ...s, rombelId: '', rombelName: '-', rombelTeacherName: '-' }
          : s
      )
    );
    showToast('Rombel Dihapus', `${target?.name || 'Rombel'} telah dihapus.`, 'info');
    addLog(`Menghapus Rombel: ${target?.name || id}`, 'Data Rombel');
  };

  const assignStudentsToRombel = (
    studentIds: string[],
    classId: string,
    className: string,
    rombelId: string,
    rombelName: string,
    teacherName: string
  ) => {
    setStudents(prev =>
      prev.map(s =>
        studentIds.includes(s.id)
          ? {
              ...s,
              classId,
              className,
              rombelId,
              rombelName,
              rombelTeacherName: teacherName,
            }
          : s
      )
    );
    showToast(
      'Santri Masuk Rombel',
      `${studentIds.length} santri berhasil dimasukkan ke ${rombelName} (${teacherName}).`,
      'success'
    );
    addLog(`Memasukkan ${studentIds.length} santri ke ${rombelName} (${teacherName})`, 'Data Rombel');
  };

  const assignSingleStudentToRombel = (studentId: string, rombelId: string) => {
    const targetRombel = rombels.find(r => r.id === rombelId);
    if (!targetRombel) {
      showToast('Gagal Menempatkan Santri', 'Rombel tujuan tidak ditemukan.', 'error');
      return;
    }
    assignStudentsToRombel(
      [studentId],
      targetRombel.classId,
      targetRombel.className,
      targetRombel.id,
      targetRombel.fullName || `Rombel ${targetRombel.name}`,
      targetRombel.teacherName
    );
  };

  const removeStudentFromRombel = (studentId: string) => {
    const target = students.find(s => s.id === studentId);
    setStudents(prev =>
      prev.map(s =>
        s.id === studentId
          ? { ...s, rombelId: '', rombelName: '-', rombelTeacherName: '-' }
          : s
      )
    );
    showToast('Santri Dikeluarkan', `${target?.name || 'Santri'} dikeluarkan dari rombel.`, 'info');
    addLog(`Mengeluarkan ${target?.name} dari rombel`, 'Data Rombel');
  };

  const updateAcademicYear = (ay: AcademicYear) => {
    setAcademicYear(ay);
    showToast('Tahun Ajaran Disimpan', 'Konfigurasi tahun ajaran dan semester diperbarui.', 'success');
  };

  // Calendar
  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEv: CalendarEvent = {
      ...event,
      id: `cal-${Date.now()}`,
    };
    setCalendarEvents(prev => [...prev, newEv]);
    showToast('Agenda Ditambahkan', `${event.title} masuk ke kalender pendidikan.`, 'success');
    addLog(`Menambahkan Agenda Kalender: ${event.title}`, 'Kalender Pendidikan');
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
    showToast('Agenda Dihapus', 'Agenda telah dihapus dari kalender.', 'info');
  };

  // Gov Curriculum
  const addGovCurriculum = (item: Omit<GovCurriculumItem, 'id'>) => {
    const newItem: GovCurriculumItem = {
      ...item,
      id: `gov-${Date.now()}`,
    };
    setGovCurriculum(prev => [...prev, newItem]);
    showToast('Kurikulum Ditambahkan', `Komponen ${item.element} telah disimpan.`, 'success');
    addLog(`Menambahkan komponen Kurikulum Pemerintah (${item.element})`, 'Kurikulum');
  };

  const updateGovCurriculum = (item: GovCurriculumItem) => {
    setGovCurriculum(prev => prev.map(i => i.id === item.id ? item : i));
    showToast('Kurikulum Diperbarui', `Komponen ${item.element} disimpan.`, 'success');
  };

  const deleteGovCurriculum = (id: string) => {
    setGovCurriculum(prev => prev.filter(i => i.id !== id));
    showToast('Komponen Dihapus', 'Komponen kurikulum dihapus.', 'info');
  };

  // TK Khas Curriculum
  const addTkCurriculum = (item: Omit<TkCurriculumItem, 'id'>) => {
    const newItem: TkCurriculumItem = {
      ...item,
      id: `tkq-${Date.now()}`,
    };
    setTkCurriculum(prev => [...prev, newItem]);
    showToast('Kurikulum TKQ Ditambahkan', `Kompetensi ${item.category} berhasil dibuat.`, 'success');
    addLog(`Menambahkan Kurikulum Khas TKQ: ${item.category}`, 'Kurikulum');
  };

  const updateTkCurriculum = (item: TkCurriculumItem) => {
    setTkCurriculum(prev => prev.map(i => i.id === item.id ? item : i));
    showToast('Kurikulum TKQ Diperbarui', `Kompetensi ${item.category} disimpan.`, 'success');
  };

  const deleteTkCurriculum = (id: string) => {
    setTkCurriculum(prev => prev.filter(i => i.id !== id));
    showToast('Kurikulum TKQ Dihapus', 'Kompetensi telah dihapus.', 'info');
  };

  // CRUD CP & TP
  const addCP = (cp: Omit<CapaianPembelajaran, 'id'>) => {
    const newCP: CapaianPembelajaran = {
      ...cp,
      id: `cp-${Date.now()}`,
    };
    setCpList(prev => [...prev, newCP]);
    showToast('CP Berhasil Ditambahkan', `${cp.code}: ${cp.title} berhasil disimpan.`, 'success');
    addLog(`Menambahkan CP: ${cp.code}`, 'Kurikulum');
  };

  const updateCP = (cp: CapaianPembelajaran) => {
    setCpList(prev => prev.map(c => c.id === cp.id ? cp : c));
    setTpList(prev => prev.map(t => t.cpId === cp.id ? { ...t, cpCode: cp.code, cpTitle: cp.title, elementId: cp.elementId, elementName: cp.elementName } : t));
    showToast('CP Diperbarui', `Perubahan pada ${cp.code} disimpan.`, 'success');
    addLog(`Mengubah CP: ${cp.code}`, 'Kurikulum');
  };

  const deleteCP = (id: string) => {
    const target = cpList.find(c => c.id === id);
    setCpList(prev => prev.filter(c => c.id !== id));
    setTpList(prev => prev.filter(t => t.cpId !== id));
    showToast('CP Dihapus', `${target?.code || 'Capaian'} dan seluruh TP terkait telah dihapus.`, 'info');
    addLog(`Menghapus CP: ${target?.code || id}`, 'Kurikulum');
  };

  const addTP = (tp: Omit<TujuanPembelajaran, 'id'>) => {
    const newTP: TujuanPembelajaran = {
      ...tp,
      id: `tp-${Date.now()}`,
    };
    setTpList(prev => [...prev, newTP]);
    showToast('TP Berhasil Ditambahkan', `${tp.code}: Tujuan Pembelajaran disimpan.`, 'success');
    addLog(`Menambahkan TP: ${tp.code}`, 'Kurikulum');
  };

  const updateTP = (tp: TujuanPembelajaran) => {
    setTpList(prev => prev.map(t => t.id === tp.id ? tp : t));
    showToast('TP Diperbarui', `Tujuan pembelajaran ${tp.code} diperbarui.`, 'success');
    addLog(`Mengubah TP: ${tp.code}`, 'Kurikulum');
  };

  const deleteTP = (id: string) => {
    const target = tpList.find(t => t.id === id);
    setTpList(prev => prev.filter(t => t.id !== id));
    showToast('TP Dihapus', `${target?.code || 'Tujuan'} pembelajaran dihapus.`, 'info');
    addLog(`Menghapus TP: ${target?.code || id}`, 'Kurikulum');
  };

  const resetCPTPToDefault = () => {
    setLearningElements(INITIAL_LEARNING_ELEMENTS);
    setCpList(INITIAL_CP_LIST);
    setTpList(INITIAL_TP_LIST);
    showToast('Reset Berhasil', 'Bank CP & TP dikembalikan ke standar awal Kemendikbud & APBQ.', 'success');
    addLog('Mereset Bank CP & TP ke standar awal', 'Kurikulum');
  };

  // Active Curriculum (Synthesized from Builder)
  const saveActiveCurriculum = (curriculum: ActiveCurriculum) => {
    setActiveCurriculum(curriculum);
    showToast('Kurikulum Aktif Disimpan', `${curriculum.name} telah berstatus: ${curriculum.status}.`, 'success');
    addLog(`Menyimpan Kurikulum Aktif: ${curriculum.name} (${curriculum.components.length} komponen)`, 'Curriculum Builder');
  };

  // Bank Materi & Kegiatan
  const addMaterialItem = (item: Omit<MaterialBankItem, 'id'>) => {
    const newItem: MaterialBankItem = {
      ...item,
      id: `mat-${Date.now()}`,
    };
    setMaterialBank(prev => [newItem, ...prev]);
    showToast('Materi Ditambahkan', `${item.name} telah disimpan ke Bank Materi.`, 'success');
  };

  const deleteMaterialItem = (id: string) => {
    setMaterialBank(prev => prev.filter(m => m.id !== id));
    showToast('Materi Dihapus', 'Materi dihapus dari Bank Materi.', 'info');
  };

  const addActivityItem = (item: Omit<ActivityBankItem, 'id'>) => {
    const newItem: ActivityBankItem = {
      ...item,
      id: `act-${Date.now()}`,
    };
    setActivityBank(prev => [newItem, ...prev]);
    showToast('Kegiatan Ditambahkan', `${item.name} disimpan ke Bank Kegiatan.`, 'success');
  };

  const deleteActivityItem = (id: string) => {
    setActivityBank(prev => prev.filter(a => a.id !== id));
    showToast('Kegiatan Dihapus', 'Kegiatan dihapus dari Bank Kegiatan.', 'info');
  };

  // Prosem
  const addProsemItem = (item: Omit<ProsemItem, 'id'>) => {
    const newItem: ProsemItem = {
      ...item,
      id: `prosem-${Date.now()}`,
    };
    setProsemList(prev => [...prev, newItem]);
    showToast('Program Semester Ditambahkan', `Pekan ${item.week}: ${item.subtheme} berhasil dibuat.`, 'success');
    addLog(`Menyusun Program Semester Pekan ${item.week} (${item.theme})`, 'Program Semester');
  };

  const deleteProsemItem = (id: string) => {
    setProsemList(prev => prev.filter(p => p.id !== id));
    showToast('Prosem Dihapus', 'Item program semester dihapus.', 'info');
  };

  // RPPM
  const addRPPMItem = (item: Omit<RPPMItem, 'id'>) => {
    const newItem: RPPMItem = {
      ...item,
      id: `rppm-w${item.week}-${Date.now()}`,
    };
    setRppmList(prev => [newItem, ...prev]);
    showToast('RPPM Berhasil Dibuat', `RPPM Pekan ke-${item.week} (${item.subtheme}) siap digunakan.`, 'success');
    addLog(`Membuat RPPM Pekan ${item.week} (${item.subtheme})`, 'RPPM');
  };

  const updateRPPMItem = (item: RPPMItem) => {
    setRppmList(prev => prev.map(r => r.id === item.id ? item : r));
    showToast('RPPM Diperbarui', `RPPM Pekan ${item.week} disimpan.`, 'success');
  };

  const deleteRPPMItem = (id: string) => {
    setRppmList(prev => prev.filter(r => r.id !== id));
    showToast('RPPM Dihapus', 'Rencana mingguan dihapus.', 'info');
  };

  const resetRPPMToAdminTemplate = (rppmId: string) => {
    setRppmList(prev =>
      prev.map(r => {
        if (r.id === rppmId) {
          return {
            ...OFFICIAL_ADMIN_RPPM_TEMPLATE,
            id: r.id,
            week: r.week,
            classId: r.classId,
            className: r.className,
            lastEditedByRole: 'guru',
          };
        }
        return r;
      })
    );
    showToast('Reset Berhasil', 'RPPM telah direset kembali sesuai Template Standar Resmi Admin/TU.', 'info');
    addLog('Mereset RPPM ke Template Resmi Admin/TU', 'RPPM');
  };

  // Helper to build deep learning RPPH from RPPM Day Plan & Urutan Kegiatan
  const buildRPPHFromRPPMDay = (
    sourceRppm: RPPMItem,
    dayName: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat',
    targetDate: string
  ): RPPHItem => {
    const dailySchedule = sourceRppm.dailySchedules?.[dayName];
    const dayPlan = sourceRppm.dailyPlans?.[dayName];

    // Extract steps
    const steps = dailySchedule?.steps || [];
    const pendahuluanStep = steps.find(s => s.stage === 'Pendahuluan');
    const memahamiStep = steps.find(s => s.stage === 'Memahami');
    const mengaplikasikanStep = steps.find(s => s.stage === 'Mengaplikasikan');
    const merefleksikanStep = steps.find(s => s.stage === 'Merefleksikan');
    const penutupStep = steps.find(s => s.stage === 'Penutup');

    // Mapped plan items for this day
    const mappedPlans = (sourceRppm.planMappings || []).filter(
      m => m.targetDay === dayName || m.targetDay === 'Semua Hari'
    );

    // Relevant indicator from assessmentIndicators
    const dayAssessment = (sourceRppm.assessmentIndicators || []).find(
      a => a.dayName === dayName
    );

    // Theme & Subtheme
    const theme = sourceRppm.topic || sourceRppm.theme || 'Lingkunganku yang Nyaman';
    const subtheme = sourceRppm.subTopic || sourceRppm.subtheme || 'Sekolahku';
    const dailyTopic = dailySchedule?.dailyTopic || `${subtheme} - Hari ${dayName}`;

    // 1. Pembiasaan Pagi (07.00 - 07.45)
    const pembiasaanPagi = [
      '07.00 - 07.15: SOP Penyambutan Ramah Anak di gerbang sekolah (5S: Senyum, Salam, Sapa, Sopan, Santun)',
      '07.15 - 07.30: Berbaris tertib di selasar/halaman, Ikrar Santri TKQ, dan Senam Ceria motorik anak',
      '07.30 - 07.45: Wudhu ceria dan pembiasaan sholat Dhuha berjamaah di musholla / ruang kelas',
    ];

    // 2. Pembukaan & Apersepsi (07.45 - 08.15)
    let opening: string[] = [];
    if (pendahuluanStep?.activityText) {
      const lines = pendahuluanStep.activityText
        .split('\n')
        .map(l => l.replace(/^[•\-\*]\s*/, '').trim())
        .filter(Boolean);
      if (lines.length > 0) {
        opening = lines;
      }
    }
    if (opening.length === 0) {
      opening = [
        'Penyambutan ceria dan salam santun saat santri memasuki ruang kelas',
        'Duduk melingkar tertib di karpet: Membaca Surat Al-Fatihah dan melantunkan Asmaul Husna bersama',
        'Pembiasaan ikrar santri dan tepuk anak sholeh / bernyanyi Mars TKQ',
        `Apersepsi & pemantik: Guru mengajak tanya jawab seputar topik "${dailyTopic}"`,
      ];
    }

    // 3. Kegiatan Inti (08.15 - 09.30)
    const memahamiList: string[] = [];
    if (memahamiStep?.activityText) {
      memahamiList.push(memahamiStep.activityText);
    } else {
      memahamiList.push(`Guru bercerita dan mendiskusikan topik harian: ${dailyTopic}`);
    }
    if (memahamiStep?.kosaKata) {
      memahamiList.push(`Pengenalan kosa kata pilihan: ${memahamiStep.kosaKata}`);
    }
    if (memahamiStep?.inovatif) {
      memahamiList.push(`Muatan Inovatif: ${memahamiStep.inovatif} (Estimasi waktu: ${memahamiStep.estimasiWaktu || '10 menit'})`);
    }

    const mengaplikasikanList: string[] = [];
    if (mengaplikasikanStep?.activityText) {
      mengaplikasikanList.push(mengaplikasikanStep.activityText);
    }
    if (mappedPlans.length > 0) {
      mappedPlans.forEach(mp => {
        mengaplikasikanList.push(`${mp.ragamMain}${mp.alatBahan ? ` (Bahan: ${mp.alatBahan})` : ''}`);
      });
    } else if (dayPlan?.activities && dayPlan.activities.length > 0) {
      dayPlan.activities.forEach((act, idx) => {
        mengaplikasikanList.push(`Kegiatan ${idx + 1}: ${act}`);
      });
    }
    if (mengaplikasikanStep?.inovatif) {
      mengaplikasikanList.push(`Fokus Karakter: ${mengaplikasikanStep.inovatif} (Estimasi waktu: ${mengaplikasikanStep.estimasiWaktu || '15 menit'})`);
    }

    const merefleksikanList: string[] = [];
    if (merefleksikanStep?.activityText) {
      merefleksikanList.push(merefleksikanStep.activityText);
    } else {
      merefleksikanList.push(`Anak menceritakan pengalaman dan hasil karya kegiatan ${dayName}`);
    }
    merefleksikanList.push('Menghubungkan kegiatan bermain dengan rasa syukur kepada Allah SWT atas segala nikmat-Nya');

    // 4 Ragam Main Sentra
    let ragamMain = mappedPlans.map(mp => ({
      sentra: mp.elementName || 'Sentra Belajar Terpadu',
      namaKegiatan: mp.ragamMain,
      alatBahan: mp.alatBahan || sourceRppm.toolsAndMaterials || 'Media konkret & LKPD',
      tujuan: mp.tpTitle || 'Mencapai tujuan pembelajaran',
    }));

    if (ragamMain.length === 0) {
      ragamMain = [
        {
          sentra: 'Sentra Matematika & Berhitung',
          namaKegiatan: mengaplikasikanStep?.activityText || 'Eksplorasi berhitung dan logika visual',
          alatBahan: sourceRppm.toolsAndMaterials || 'LKPD Tematik, alat tulis',
          tujuan: 'Melatih kemampuan berhitung dan kognitif anak',
        },
        {
          sentra: 'Sentra Bahasa & Keaksaraan',
          namaKegiatan: `Pengenalan Kosa Kata & Simbol (${memahamiStep?.kosaKata || 'Kosakata Tema'})`,
          alatBahan: 'Kartu kata, flashcard hijaiyah/angka',
          tujuan: 'Mengembangkan perbendaharaan kata dan keaksaraan awal',
        },
        {
          sentra: 'Sentra Seni & Kreativitas',
          namaKegiatan: merefleksikanStep?.activityText || 'Mewarnai dan kreasi motorik halus',
          alatBahan: 'Krayon, lembar kreasi anak, LKPD',
          tujuan: 'Mengekspresikan imajinasi dan memperkuat motorik halus',
        },
        {
          sentra: 'Sentra Imtaq & Karakter APBQ',
          namaKegiatan: 'Pembiasaan Adab, Doa, dan Hafalan Al-Qur\'an',
          alatBahan: 'Buku prestasi mengaji, kartu adab',
          tujuan: 'Membangun karakter religius dan kebiasaan islami sejak dini',
        },
      ];
    }

    // 4. Istirahat & Makan (09.30 - 10.00)
    const istirahatMakan = [
      '09.30 - 09.40: Cuci tangan 6 langkah menggunakan air mengalir dan sabun cair',
      '09.40 - 09.55: Membaca doa sebelum makan, menikmati bekal sehat dengan adab Islami (duduk tegak, tangan kanan, hening beradab)',
      '09.55 - 10.00: Merapikan kotak bekal ke dalam tas dan membuang sampah ke tempatnya',
      '10.00 - 10.15: Bermain bebas di area bermain luar (outdoor) dengan pengawasan guru',
    ];

    // 5. Penutup (10.00 - 10.30)
    let closing: string[] = [];
    if (penutupStep?.activityText) {
      const lines = penutupStep.activityText
        .split('\n')
        .map(l => l.replace(/^[•\-\*]\s*/, '').trim())
        .filter(Boolean);
      if (lines.length > 0) {
        closing = lines;
      }
    }
    if (closing.length === 0) {
      closing = [
        'Recalling: Menceritakan kembali kegiatan yang paling berkesan dan disukai hari ini',
        'Merapikan perlengkapan belajar dan mainan kembali ke tempat semula secara mandiri',
        'Penyampaian pesan moral / motivasi dan informasi kegiatan esok hari',
        'Doa penutup majelis (Kafaratul Majelis) dan salam tertib berpamitan dengan guru',
      ];
    }

    // APBQ Integrasi Detail
    const apbqDetail = {
      tilawati: memahamiStep?.kosaKata ? `Materi Tilawati & kosakata: ${memahamiStep.kosaKata}` : (sourceRppm.apbqIntegrasi?.hurufHijaiyah || 'Tilawati Jilid 1 & Makharijul Huruf'),
      surat: sourceRppm.apbqIntegrasi?.suratPendek || 'QS. Al-Fatihah & Surat Pendek Pilihan',
      doa: sourceRppm.apbqIntegrasi?.doaHarian || 'Doa Sebelum Belajar & Doa Penutup',
      hadits: sourceRppm.apbqIntegrasi?.haditsPilihan || 'Hadits Menuntut Ilmu / Akhlak Mulia',
      mufrodat: memahamiStep?.kosaKata || sourceRppm.apbqIntegrasi?.hurufHijaiyah || 'Kosakata Harian Tematik',
    };

    // Asesmen Teknik
    const asesmenTeknik = {
      ceklis: dayAssessment?.indicator || 'Skala capaian perkembangan BB, MB, BSH, BSB pada indikator harian',
      catatanAnekdot: 'Mencatat respon kemandirian, konsentrasi, dan interaksi santri selama bermain',
      hasilKarya: mengaplikasikanStep?.activityText ? `Dokumentasi LKPD/Hasil Karya: ${mengaplikasikanStep.activityText.slice(0, 75)}...` : 'Dokumentasi karya dan unjuk kerja anak',
    };

    // Objective & Material
    const learningObjective = mappedPlans.map(m => m.tpTitle).join('; ') || sourceRppm.learningObjective || 'Mencapai tujuan pembelajaran tema';
    const material = `${dailyTopic}. ${sourceRppm.material || ''}`;
    const toolsAndMaterials = sourceRppm.toolsAndMaterials || 'LKPD, alat tulis, media konkret';

    const classId = sourceRppm.classId || 'kelas-a1';
    const className = sourceRppm.className || sourceRppm.phaseAndClass || sourceRppm.ageGroup || 'Kelompok A';

    return {
      id: `rpph-${sourceRppm.id}-${dayName.toLowerCase()}`,
      rppmId: sourceRppm.id,
      date: targetDate,
      dayName,
      classId,
      className,
      theme,
      subtheme: `${subtheme} — ${dailyTopic}`,
      alokasiWaktu: sourceRppm.alokasiWaktu || '210 Menit (07.00 - 10.30 WIB)',
      learningObjective,
      material,
      toolsAndMaterials,
      aspect: (mappedPlans[0]?.elementName as any) || sourceRppm.aspect || 'Nilai Agama dan Moral',
      indicator: dayAssessment?.indicator || sourceRppm.indicator || 'Ketercapaian indikator pembelajaran harian',
      pembiasaanPagi,
      opening,
      coreActivities: {
        memahami: memahamiList,
        mengaplikasikan: mengaplikasikanList,
        merefleksikan: merefleksikanList,
      },
      ragamMain,
      istirahatMakan,
      closing,
      apbqDetail,
      asesmenTeknik,
      assessmentPlan: `Observasi unjuk kerja, LKPD tematik, dan catatan anekdot: ${dayAssessment?.indicator || sourceRppm.indicator || 'KKTP Fase Fondasi'}`,
      teacherNotes: `Disinkronkan otomatis dari RPPM Pekan ${sourceRppm.week} (${theme} - ${subtheme}) Hari ${dayName}. Siap digunakan dalam KBM.`,
      photos: [],
      status: 'Siap Digunakan',
    };
  };

  // KEY WORKFLOW: Generate 1 Day RPPH from RPPM
  const generateRPPHFromRPPM = (
    rppmId: string,
    dayName: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat',
    targetDate: string
  ): RPPHItem => {
    const sourceRppm = rppmList.find(r => r.id === rppmId) || rppmList[0];
    const generatedRPPH = buildRPPHFromRPPMDay(sourceRppm, dayName, targetDate);

    // Save into list
    setRpphList(prev => {
      const exists = prev.some(
        item => item.id === generatedRPPH.id || (item.rppmId === generatedRPPH.rppmId && item.dayName === generatedRPPH.dayName)
      );
      if (exists) {
        return prev.map(item =>
          item.id === generatedRPPH.id || (item.rppmId === generatedRPPH.rppmId && item.dayName === generatedRPPH.dayName)
            ? generatedRPPH
            : item
        );
      }
      return [generatedRPPH, ...prev];
    });

    showToast(
      'RPPH Berhasil Disinkronkan!',
      `Data dari RPPM Pekan ${sourceRppm.week} Hari ${dayName} (${generatedRPPH.subtheme}) telah otomatis terisi lengkap.`,
      'success'
    );
    addLog(`Sinkronisasi RPPH Hari ${dayName} dari RPPM (${sourceRppm.theme})`, 'RPPH');

    return generatedRPPH;
  };

  // KEY WORKFLOW: Synchronize ALL 5 Days (Senin - Jumat) from RPPM to RPPH
  const syncRPPMToRPPH = (rppmId: string, startDate?: string): RPPHItem[] => {
    const sourceRppm = rppmList.find(r => r.id === rppmId) || rppmList[0];
    if (!sourceRppm) return [];

    const dayNames: ('Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat')[] = [
      'Senin',
      'Selasa',
      'Rabu',
      'Kamis',
      'Jumat',
    ];

    const dates: Record<string, string> = {
      Senin: '2026-09-14',
      Selasa: '2026-09-15',
      Rabu: '2026-09-16',
      Kamis: '2026-09-17',
      Jumat: '2026-09-18',
    };

    if (startDate) {
      const base = new Date(startDate);
      dayNames.forEach((day, idx) => {
        const d = new Date(base);
        d.setDate(base.getDate() + idx);
        dates[day] = d.toISOString().split('T')[0];
      });
    }

    const syncedItems: RPPHItem[] = dayNames.map(dayName => {
      return buildRPPHFromRPPMDay(sourceRppm, dayName, dates[dayName]);
    });

    setRpphList(prev => {
      const newIds = new Set(syncedItems.map(i => i.id));
      const newDayKeys = new Set(syncedItems.map(i => `${i.rppmId}-${i.dayName}`));
      const filtered = prev.filter(p => !newIds.has(p.id) && !newDayKeys.has(`${p.rppmId}-${p.dayName}`));
      return [...syncedItems, ...filtered];
    });

    showToast(
      'Sinkronisasi RPPM ke RPPH Berhasil!',
      `5 Dokumen RPPH (Senin s/d Jumat) berhasil disinkronkan dari RPPM Pekan ${sourceRppm.week} (${sourceRppm.subTopic || sourceRppm.subtheme || sourceRppm.theme}).`,
      'success'
    );
    addLog(
      `Sinkronisasi Data RPPM ke RPPH: 5 Hari Lengkap (Pekan ${sourceRppm.week} - ${sourceRppm.subTopic || sourceRppm.theme})`,
      'RPPH'
    );

    return syncedItems;
  };

  const saveRPPH = (rpph: RPPHItem) => {
    setRpphList(prev => {
      const idx = prev.findIndex(item => item.id === rpph.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = rpph;
        return next;
      }
      return [rpph, ...prev];
    });
    showToast('RPPH Tersimpan', `RPPH tanggal ${rpph.date} (${rpph.dayName}) berstatus: ${rpph.status}.`, 'success');
    addLog(`Menyimpan RPPH: ${rpph.subtheme} (${rpph.status})`, 'RPPH');
  };

  const deleteRPPH = (id: string) => {
    setRpphList(prev => prev.filter(r => r.id !== id));
    showToast('RPPH Dihapus', 'Dokumen RPPH telah dihapus.', 'info');
  };

  // Attendance
  const saveAttendanceBulk = (
    records: { studentId: string; studentName: string; status: AttendanceStatus; note?: string }[],
    date: string,
    classId: string
  ) => {
    setAttendanceList(prev => {
      const studentIds = new Set(records.map(r => r.studentId));
      const filtered = prev.filter(a => !(a.date === date && studentIds.has(a.studentId)));
      const newItems: AttendanceRecord[] = records.map(r => ({
        id: `att-${date}-${r.studentId}`,
        date,
        classId,
        studentId: r.studentId,
        studentName: r.studentName,
        status: r.status,
        note: r.note,
      }));
      return [...newItems, ...filtered];
    });

    showToast('Absensi Disimpan', `Presensi untuk ${records.length} murid pada tanggal ${date} berhasil dicatat.`, 'success');
    addLog(`Menginput Absensi Harian: ${records.length} murid (${date})`, 'Absensi');
  };

  const saveLeaveRequest = (data: {
    id?: string;
    studentId: string;
    studentName: string;
    classId: string;
    date: string;
    status: AttendanceStatus;
    note: string;
    attachmentUrl?: string;
    attachmentName?: string;
    attachmentType?: string;
  }) => {
    const recordId = data.id || `att-leave-${Date.now()}-${data.studentId}`;
    setAttendanceList(prev => {
      const filtered = prev.filter(a => a.id !== recordId && !(a.date === data.date && a.studentId === data.studentId));
      const newRecord: AttendanceRecord = {
        id: recordId,
        date: data.date,
        classId: data.classId,
        studentId: data.studentId,
        studentName: data.studentName,
        status: data.status,
        note: data.note,
        attachmentUrl: data.attachmentUrl,
        attachmentName: data.attachmentName,
        attachmentType: data.attachmentType,
        submittedAt: new Date().toISOString(),
      };
      return [newRecord, ...filtered];
    });

    showToast(
      data.id ? 'Surat Permohonan Diperbarui' : 'Surat Permohonan Terkirim',
      `Permohonan ${data.status} ananda ${data.studentName} tanggal ${data.date} berhasil disimpan.`,
      'success'
    );
    addLog(`Pengajuan Surat ${data.status}: ${data.studentName} (${data.date})`, 'Presensi Murid');
  };

  const deleteAttendanceRecord = (id: string) => {
    setAttendanceList(prev => {
      const target = prev.find(a => a.id === id);
      const filtered = prev.filter(a => a.id !== id);
      if (target) {
        showToast('Data Dihapus', `Catatan presensi / surat permohonan tanggal ${target.date} telah dihapus/dibatalkan.`, 'info');
        addLog(`Menghapus catatan presensi: ${target.studentName} (${target.date})`, 'Presensi Murid');
      }
      return filtered;
    });
  };

  // Teacher Attendance (TU)
  const saveTeacherAttendanceBulk = (
    records: { teacherId: string; teacherName: string; status: AttendanceStatus; checkInTime?: string; checkOutTime?: string; note?: string; signatureImage?: string }[],
    date: string
  ) => {
    setTeacherAttendanceList(prev => {
      const filtered = prev.filter(a => a.date !== date);
      const newItems: TeacherAttendanceRecord[] = records.map(r => ({
        id: `tatt-${date}-${r.teacherId}`,
        date,
        teacherId: r.teacherId,
        teacherName: r.teacherName,
        status: r.status,
        checkInTime: r.checkInTime || (r.status === 'Hadir' ? '07:00' : '-'),
        checkOutTime: r.checkOutTime || (r.status === 'Hadir' ? '13:30' : '-'),
        note: r.note,
        signatureImage: r.signatureImage,
      }));
      return [...newItems, ...filtered];
    });

    showToast('Presensi Guru Disimpan', `Presensi untuk ${records.length} pendidik/staf pada tanggal ${date} berhasil dicatat.`, 'success');
    addLog(`Menginput Absensi Guru (TU): ${records.length} guru (${date})`, 'Tata Usaha');
  };

  // Assessment
  const saveAssessment = (record: Omit<AssessmentRecord, 'id'>) => {
    const newRecord: AssessmentRecord = {
      ...record,
      id: `as-${Date.now()}`,
    };
    setAssessmentList(prev => [newRecord, ...prev]);
    showToast(
      'Penilaian Disimpan',
      `Nilai ${record.score} untuk ${record.studentName} (${record.aspect}) telah masuk ke sistem.`,
      'success'
    );
    addLog(`Memasukkan Penilaian Anak: ${record.studentName} (${record.score} - ${record.aspect})`, 'Penilaian');
  };

  const deleteAssessment = (id: string) => {
    setAssessmentList(prev => prev.filter(a => a.id !== id));
    showToast('Penilaian Dihapus', 'Data penilaian telah dihapus.', 'info');
  };

  // Report card
  const saveReportCard = (report: ReportCard) => {
    setReportCards(prev => {
      const idx = prev.findIndex(r => r.id === report.id || r.studentId === report.studentId);
      let next: ReportCard[];
      if (idx >= 0) {
        next = [...prev];
        next[idx] = report;
      } else {
        next = [report, ...prev];
      }
      return next;
    });
    showToast('Rapor Diperbarui', `Buku Laporan Perkembangan untuk ${report.studentName} disimpan.`, 'success');
    addLog(`Memperbarui Draf Rapor Perkembangan: ${report.studentName}`, 'Rapor');
  };

  const saveReportCardsBulk = (reports: ReportCard[]) => {
    setReportCards(prev => {
      let updated = [...prev];
      reports.forEach(report => {
        const idx = updated.findIndex(r => r.id === report.id || r.studentId === report.studentId);
        if (idx >= 0) {
          updated[idx] = report;
        } else {
          updated.push(report);
        }
      });
      return updated;
    });
    showToast('Leger Rapor Disimpan', `${reports.length} data capaian rapor murid berhasil disimpan ke sistem.`, 'success');
    addLog(`Menyimpan data massal rapor (${reports.length} murid)`, 'Rapor');
  };

  // Announcements
  const addAnnouncement = (ann: Omit<Announcement, 'id'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: `ann-${Date.now()}`,
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    showToast('Pengumuman Diterbitkan', `${ann.title} telah dipublikasikan.`, 'success');
    addLog(`Membuat Pengumuman: ${ann.title}`, 'Pengumuman');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    showToast('Pengumuman Dihapus', 'Pengumuman telah dihapus.', 'info');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Catatan Pribadi Guru ke Siswa & Komunikasi Wali
  const addTeacherNote = (note: Omit<TeacherPersonalNote, 'id' | 'createdAt' | 'isReadByParent'>) => {
    const newNote: TeacherPersonalNote = {
      ...note,
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      isReadByParent: false,
      createdAt: new Date().toISOString(),
    };
    setTeacherNotes(prev => [newNote, ...prev]);
    showToast(
      'Catatan Pribadi Terkirim',
      `Catatan personal untuk ananda ${note.studentName} berhasil dikirim dan tersimpan di portal wali murid.`,
      'success'
    );
    addLog(`Mengirim Catatan Pribadi Siswa: ${note.studentName} (${note.priority} - ${note.category})`, 'Catatan Guru');
  };

  const updateTeacherNote = (note: TeacherPersonalNote) => {
    setTeacherNotes(prev => prev.map(n => n.id === note.id ? note : n));
    showToast('Catatan Diperbarui', `Catatan untuk ananda ${note.studentName} telah diperbarui.`, 'success');
    addLog(`Memperbarui Catatan Pribadi Siswa: ${note.studentName}`, 'Catatan Guru');
  };

  const deleteTeacherNote = (id: string) => {
    const target = teacherNotes.find(n => n.id === id);
    setTeacherNotes(prev => prev.filter(n => n.id !== id));
    showToast('Catatan Dihapus', 'Catatan pribadi siswa telah dihapus dari sistem.', 'info');
    if (target) {
      addLog(`Menghapus Catatan Pribadi Siswa: ${target.studentName}`, 'Catatan Guru');
    }
  };

  const markTeacherNoteAsRead = (id: string) => {
    setTeacherNotes(prev => prev.map(n => {
      if (n.id === id) {
        return {
          ...n,
          isReadByParent: true,
          readAt: n.readAt || new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
        };
      }
      return n;
    }));
    showToast('Konfirmasi Terbaca', 'Catatan guru telah ditandai sudah dibaca.', 'info');
  };

  const replyTeacherNoteByParent = (id: string, replyMessage: string, parentName?: string) => {
    setTeacherNotes(prev => prev.map(n => {
      if (n.id === id) {
        return {
          ...n,
          isReadByParent: true,
          readAt: n.readAt || new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
          parentReply: {
            message: replyMessage,
            repliedAt: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
            parentName: parentName || 'Wali Santri',
          },
        };
      }
      return n;
    }));
    showToast(
      'Tanggapan Terkirim',
      'Pesan dan konfirmasi Anda telah dikirimkan ke Guru Kelas.',
      'success'
    );
    addLog('Wali santri menanggapi catatan guru', 'Portal Murid');
  };

  // Forum Diskusi Rombel (Chat) Methods
  const sendRombelChat = (msg: Omit<RombelChatMessage, 'id' | 'timestamp' | 'likes' | 'likedBy'>) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const newChat: RombelChatMessage = {
      ...msg,
      id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: timeFormatted,
      likes: 0,
      likedBy: [],
    };
    setRombelChats(prev => [...prev, newChat]);
    addLog(`Mengirim pesan di Forum ${msg.rombelName}: ${msg.content.slice(0, 30)}...`, 'Forum Rombel');
  };

  const deleteRombelChat = (id: string) => {
    setRombelChats(prev => prev.filter(c => c.id !== id));
    showToast('Pesan Dihapus', 'Pesan forum telah dihapus.', 'info');
  };

  const togglePinRombelChat = (id: string) => {
    setRombelChats(prev => prev.map(c => {
      if (c.id === id) {
        const nextPinned = !c.isPinned;
        showToast(
          nextPinned ? 'Pesan Disematkan' : 'Sematkan Dicabut',
          nextPinned ? 'Pesan penting disematkan di bagian atas forum.' : 'Pesan tidak lagi disematkan.',
          'info'
        );
        return { ...c, isPinned: nextPinned };
      }
      return c;
    }));
  };

  const toggleLikeRombelChat = (id: string, userId: string) => {
    setRombelChats(prev => prev.map(c => {
      if (c.id === id) {
        const currentLikes = c.likedBy || [];
        const isLiked = currentLikes.includes(userId);
        const updatedLikedBy = isLiked ? currentLikes.filter(u => u !== userId) : [...currentLikes, userId];
        return {
          ...c,
          likedBy: updatedLikedBy,
          likes: updatedLikedBy.length,
        };
      }
      return c;
    }));
  };

  // Rapat Online & Streaming Rombel Methods
  const createRombelMeeting = (meeting: Omit<RombelMeeting, 'id' | 'meetingCode' | 'participantsCount' | 'activeParticipants'>) => {
    const code = `${(meeting.rombelName || 'QDS').slice(0, 3).toUpperCase()}-MEET-${Math.floor(1000 + Math.random() * 9000)}`;
    const newMeeting: RombelMeeting = {
      ...meeting,
      id: `meet-${Date.now()}`,
      meetingCode: code,
      participantsCount: meeting.status === 'live' ? 1 : 0,
      activeParticipants: meeting.status === 'live' ? [
        {
          id: meeting.hostTeacherId,
          name: meeting.hostTeacherName,
          role: 'guru',
          roleBadge: 'Wali Rombel (Host)',
          avatarColor: 'emerald',
          isHost: true,
          hasAudio: true,
          hasVideo: true,
          isHandRaised: false,
        }
      ] : [],
    };
    setRombelMeetings(prev => [newMeeting, ...prev]);
    showToast(
      meeting.status === 'live' ? 'Rapat Live Dimulai' : 'Rapat Berhasil Dijadwalkan',
      `Rapat "${meeting.title}" untuk ${meeting.rombelName} siap diikuti wali murid.`,
      'success'
    );
    addLog(`Membuat Rapat Online: ${meeting.title} (${meeting.rombelName})`, 'Rapat Rombel');
  };

  const updateRombelMeetingStatus = (meetingId: string, status: 'live' | 'scheduled' | 'ended') => {
    setRombelMeetings(prev => prev.map(m => {
      if (m.id === meetingId) {
        return {
          ...m,
          status,
          isLiveStreaming: status === 'live',
        };
      }
      return m;
    }));
    const label = status === 'live' ? 'Live Dimulai' : status === 'ended' ? 'Rapat Ditutup' : 'Dijadwalkan';
    showToast('Status Rapat Diperbarui', `Sesi rapat telah berstatus: ${label}`, 'info');
  };

  const deleteRombelMeeting = (id: string) => {
    setRombelMeetings(prev => prev.filter(m => m.id !== id));
    showToast('Rapat Dihapus', 'Jadwal / sesi rapat online telah dihapus.', 'info');
  };

  const joinMeetingParticipant = (meetingId: string, participant: MeetingParticipant) => {
    setRombelMeetings(prev => prev.map(m => {
      if (m.id === meetingId) {
        const currentList = m.activeParticipants || [];
        if (currentList.some(p => p.id === participant.id)) {
          return m;
        }
        const updated = [...currentList, participant];
        return {
          ...m,
          activeParticipants: updated,
          participantsCount: updated.length,
        };
      }
      return m;
    }));
  };

  const leaveMeetingParticipant = (meetingId: string, participantId: string) => {
    setRombelMeetings(prev => prev.map(m => {
      if (m.id === meetingId) {
        const currentList = m.activeParticipants || [];
        const updated = currentList.filter(p => p.id !== participantId);
        return {
          ...m,
          activeParticipants: updated,
          participantsCount: updated.length,
        };
      }
      return m;
    }));
  };

  // User Accounts Management Methods
  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
    };
    setUsers(prev => [newUser, ...prev]);
    addLog(`Menambahkan akun pengguna @${newUser.username}`, 'Pengguna');
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
    addLog(`Memperbarui akun pengguna @${updatedUser.username}`, 'Pengguna');
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    addLog(`Menghapus akun pengguna ID ${id}`, 'Pengguna');
  };

  const resetUserPassword = (id: string, _tempPass: string) => {
    const user = users.find(u => u.id === id);
    if (user) {
      addLog(`Mereset kata sandi pengguna @${user.username}`, 'Pengguna');
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        activeTab,
        setActiveTab,
        login,
        logout,
        switchRole,
        currentTeacher,
        currentRombel,
        currentClass,
        accessibleStudents,
        accessibleRombels,
        switchTeacher,
        currentStudent,
        switchStudent,
        schoolProfile,
        updateSchoolProfile,
        teachers,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        students,
        addStudent,
        addStudentsBulk,
        updateStudent,
        deleteStudent,
        assignStudentsToClass,
        removeStudentFromClass,
        classes,
        addClass,
        updateClass,
        deleteClass,
        rombels,
        addRombel,
        updateRombel,
        deleteRombel,
        assignStudentsToRombel,
        assignSingleStudentToRombel,
        removeStudentFromRombel,
        academicYear,
        updateAcademicYear,
        calendarEvents,
        addCalendarEvent,
        deleteCalendarEvent,
        govCurriculum,
        addGovCurriculum,
        updateGovCurriculum,
        deleteGovCurriculum,
        tkCurriculum,
        addTkCurriculum,
        updateTkCurriculum,
        deleteTkCurriculum,
        learningElements,
        cpList,
        tpList,
        addCP,
        updateCP,
        deleteCP,
        addTP,
        updateTP,
        deleteTP,
        resetCPTPToDefault,
        activeCurriculum,
        saveActiveCurriculum,
        materialBank,
        addMaterialItem,
        deleteMaterialItem,
        activityBank,
        addActivityItem,
        deleteActivityItem,
        prosemList,
        addProsemItem,
        deleteProsemItem,
        rppmList,
        addRPPMItem,
        updateRPPMItem,
        deleteRPPMItem,
        resetRPPMToAdminTemplate,
        rpphList,
        saveRPPH,
        deleteRPPH,
        generateRPPHFromRPPM,
        syncRPPMToRPPH,
        attendanceList,
        saveAttendanceBulk,
        saveLeaveRequest,
        deleteAttendanceRecord,
        teacherAttendanceList,
        saveTeacherAttendanceBulk,
        assessmentList,
        saveAssessment,
        deleteAssessment,
        reportCards,
        saveReportCard,
        saveReportCardsBulk,
        announcements,
        addAnnouncement,
        deleteAnnouncement,
        teacherNotes,
        addTeacherNote,
        updateTeacherNote,
        deleteTeacherNote,
        markTeacherNoteAsRead,
        replyTeacherNoteByParent,
        rombelChats,
        sendRombelChat,
        deleteRombelChat,
        togglePinRombelChat,
        toggleLikeRombelChat,
        rombelMeetings,
        createRombelMeeting,
        updateRombelMeetingStatus,
        deleteRombelMeeting,
        joinMeetingParticipant,
        leaveMeetingParticipant,
        users,
        addUser,
        updateUser,
        deleteUser,
        resetUserPassword,
        activityLogs,
        notifications,
        markNotificationRead,
        toasts,
        showToast,
        removeToast,
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
