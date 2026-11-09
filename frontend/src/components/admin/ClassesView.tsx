import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassRoom, Rombel, Student } from '../../types';
import {
  School,
  Plus,
  Edit2,
  Trash2,
  Users,
  User,
  X,
  UserPlus,
  UserMinus,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  GraduationCap,
  AlertCircle,
  Filter,
  Check,
  Layers,
  ChevronRight,
  MoveRight,
  ShieldCheck,
} from 'lucide-react';

export const ClassesView: React.FC = () => {
  const {
    classes,
    addClass,
    updateClass,
    deleteClass,
    rombels,
    addRombel,
    updateRombel,
    deleteRombel,
    teachers,
    students,
    addStudent,
    assignStudentsToRombel,
    assignSingleStudentToRombel,
    removeStudentFromRombel,
    removeStudentFromClass,
    showToast,
    currentRole,
    currentTeacher,
    currentRombel,
    currentClass,
  } = useApp();

  // Tab Filter for Kelas (all, A1, A2, B1, B2)
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>(() => {
    if (currentRole === 'guru' && currentClass) {
      return currentClass.id;
    }
    return 'all';
  });

  // Class Modal (Add / Edit Class)
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);
  const [classFormData, setClassFormData] = useState<Omit<ClassRoom, 'id'>>({
    name: '',
    code: 'A1',
    ageGroup: '4 - 5 Tahun (Kelompok A)',
    teacherName: '',
    capacity: 45,
    studentCount: 0,
    status: 'Aktif',
    academicYear: '2026/2027',
  });

  // Rombel Modal (Add / Edit Rombel inside a Class)
  const [isRombelModalOpen, setIsRombelModalOpen] = useState(false);
  const [editingRombel, setEditingRombel] = useState<Rombel | null>(null);
  const [rombelFormData, setRombelFormData] = useState<Omit<Rombel, 'id'>>({
    name: '',
    fullName: '',
    classId: classes[0]?.id || 'kelas-a1',
    className: classes[0]?.name || 'Kelas A1',
    teacherId: teachers[0]?.id || '',
    teacherName: teachers[0]?.name || '',
    capacity: 16,
    studentCount: 0,
    color: 'emerald',
  });

  // Manage Students per Rombel Modal
  const [isManageRombelStudentsOpen, setIsManageRombelStudentsOpen] = useState(false);
  const [activeRombelForStudents, setActiveRombelForStudents] = useState<Rombel | null>(null);
  const [manageTab, setManageTab] = useState<'current' | 'add' | 'new'>('current');
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudentIdsToAdd, setSelectedStudentIdsToAdd] = useState<string[]>([]);
  const [showOnlyUnassigned, setShowOnlyUnassigned] = useState(true);

  // New Student Registration directly into this rombel
  const [newStudentData, setNewStudentData] = useState({
    name: '',
    nickname: '',
    nis: '',
    gender: 'L' as 'L' | 'P',
    fatherName: '',
    motherName: '',
    guardianPhone: '',
  });

  // In-app Delete Confirmation Modal State
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'class' | 'rombel' | 'remove_student';
    id?: string;
    student?: Student;
    title: string;
    description: string;
  } | null>(null);

  // Filtered classes according to selected tab
  const displayedClasses = useMemo(() => {
    if (selectedClassFilter === 'all') return classes;
    return classes.filter(c => c.id === selectedClassFilter || c.code === selectedClassFilter);
  }, [classes, selectedClassFilter]);

  // Unassigned students count
  const unassignedStudents = useMemo(() => {
    return students.filter(
      s => !s.classId || s.className === '-' || !s.className || !s.rombelId || s.rombelName === '-'
    );
  }, [students]);

  // Total summary statistics
  const totalStudents = students.length;
  const assignedStudentsCount = students.filter(s => s.rombelId && s.rombelName !== '-').length;

  // Open Add Class Modal
  const handleOpenAddClass = () => {
    setEditingClass(null);
    setClassFormData({
      name: '',
      code: `A${classes.length + 1}`,
      ageGroup: '4 - 5 Tahun (Kelompok A)',
      teacherName: teachers[0]?.name || '',
      capacity: 45,
      studentCount: 0,
      status: 'Aktif',
      academicYear: '2026/2027',
    });
    setIsClassModalOpen(true);
  };

  // Open Edit Class Modal
  const handleOpenEditClass = (c: ClassRoom) => {
    setEditingClass(c);
    setClassFormData({
      name: c.name,
      code: c.code || 'A1',
      ageGroup: c.ageGroup,
      teacherId: c.teacherId,
      teacherName: c.teacherName,
      capacity: c.capacity,
      studentCount: c.studentCount,
      status: c.status,
      academicYear: c.academicYear,
    });
    setIsClassModalOpen(true);
  };

  // Submit Class Form
  const handleSubmitClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClass) {
      updateClass({ ...classFormData, id: editingClass.id });
    } else {
      addClass(classFormData);
    }
    setIsClassModalOpen(false);
  };

  // Open Add Rombel Modal
  const handleOpenAddRombel = (preselectedClassId?: string) => {
    setEditingRombel(null);
    const targetClass = classes.find(c => c.id === preselectedClassId) || classes[0];
    setRombelFormData({
      name: '',
      fullName: '',
      classId: targetClass?.id || 'kelas-a1',
      className: targetClass?.name || 'Kelas A1',
      teacherId: teachers[0]?.id || '',
      teacherName: teachers[0]?.name || '',
      capacity: 16,
      studentCount: 0,
      color: 'emerald',
    });
    setIsRombelModalOpen(true);
  };

  // Open Edit Rombel Modal
  const handleOpenEditRombel = (r: Rombel) => {
    setEditingRombel(r);
    setRombelFormData({
      name: r.name,
      fullName: r.fullName,
      classId: r.classId,
      className: r.className,
      teacherId: r.teacherId,
      teacherName: r.teacherName,
      capacity: r.capacity,
      studentCount: r.studentCount || 0,
      color: r.color || 'emerald',
    });
    setIsRombelModalOpen(true);
  };

  // Submit Rombel Form
  const handleSubmitRombel = (e: React.FormEvent) => {
    e.preventDefault();
    const targetClass = classes.find(c => c.id === rombelFormData.classId);
    const fullName = rombelFormData.fullName.trim() || `Rombel ${rombelFormData.name.trim()}`;
    const finalData = {
      ...rombelFormData,
      name: rombelFormData.name.trim(),
      fullName,
      className: targetClass?.name || rombelFormData.className,
    };

    if (editingRombel) {
      updateRombel({ ...finalData, id: editingRombel.id });
    } else {
      addRombel(finalData);
    }
    setIsRombelModalOpen(false);
  };

  // Open Manage Students for a specific Rombel
  const handleOpenManageRombelStudents = (r: Rombel, initialTab: 'current' | 'add' | 'new' = 'current') => {
    setActiveRombelForStudents(r);
    setSelectedStudentIdsToAdd([]);
    setStudentSearch('');
    const currentCount = students.filter(s => s.rombelId === r.id).length;
    if (initialTab === 'add') {
      setManageTab('add');
    } else if (initialTab === 'new') {
      setManageTab('new');
    } else {
      setManageTab(currentCount === 0 && unassignedStudents.length > 0 ? 'add' : 'current');
    }
    setShowOnlyUnassigned(unassignedStudents.length > 0);
    setIsManageRombelStudentsOpen(true);
  };

  // Direct registration of a new student directly into this active rombel
  const handleCreateAndAssignStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRombelForStudents || !newStudentData.name.trim()) return;

    const nextNis = newStudentData.nis.trim() || `260${String(students.length + 1).padStart(2, '0')}`;
    const newStudent: Omit<Student, 'id'> = {
      name: newStudentData.name.trim(),
      nickname: newStudentData.nickname.trim() || newStudentData.name.trim().split(' ')[0],
      nis: nextNis,
      nisn: '',
      nik: '',
      gender: newStudentData.gender,
      birthPlace: 'Depok',
      birthDate: '2021-01-01',
      religion: 'Islam',
      address: 'Jl. Merdeka No. 1, Pancoran Mas',
      fatherName: newStudentData.fatherName.trim() || '-',
      motherName: newStudentData.motherName.trim() || '-',
      guardianPhone: newStudentData.guardianPhone.trim() || '0812-3456-7890',
      classId: activeRombelForStudents.classId,
      className: activeRombelForStudents.className,
      rombelId: activeRombelForStudents.id,
      rombelName: activeRombelForStudents.fullName || `Rombel ${activeRombelForStudents.name}`,
      rombelTeacherName: activeRombelForStudents.teacherName,
      entryYear: '2026',
      username: `santri${Date.now().toString().slice(-4)}`,
      status: 'Aktif',
      avatarColor: newStudentData.gender === 'P' ? 'bg-pink-600' : 'bg-emerald-600',
    };

    addStudent(newStudent);
    showToast(
      'Santri Ditambahkan',
      `${newStudent.name} berhasil didaftarkan dan langsung masuk ke ${activeRombelForStudents.fullName || activeRombelForStudents.name}!`,
      'success'
    );
    setNewStudentData({
      name: '',
      nickname: '',
      nis: '',
      gender: 'L',
      fatherName: '',
      motherName: '',
      guardianPhone: '',
    });
    setManageTab('current');
  };

  // Students currently enrolled in this active rombel
  const currentRombelStudents = useMemo(() => {
    if (!activeRombelForStudents) return [];
    return students
      .filter(s => s.rombelId === activeRombelForStudents.id)
      .filter(s => {
        const q = studentSearch.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.nickname.toLowerCase().includes(q) ||
          s.nis.includes(q)
        );
      });
  }, [students, activeRombelForStudents, studentSearch]);

  // Candidate students to add to this rombel
  const candidateStudentsForRombel = useMemo(() => {
    if (!activeRombelForStudents) return [];
    return students
      .filter(s => {
        if (showOnlyUnassigned) {
          return !s.rombelId || s.rombelName === '-' || !s.rombelName;
        }
        return s.rombelId !== activeRombelForStudents.id;
      })
      .filter(s => {
        const q = studentSearch.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.nickname.toLowerCase().includes(q) ||
          s.nis.includes(q)
        );
      });
  }, [students, activeRombelForStudents, showOnlyUnassigned, studentSearch]);

  // Bulk add students to active rombel
  const handleConfirmAddStudentsToRombel = () => {
    if (!activeRombelForStudents || selectedStudentIdsToAdd.length === 0) return;
    assignStudentsToRombel(
      selectedStudentIdsToAdd,
      activeRombelForStudents.classId,
      activeRombelForStudents.className,
      activeRombelForStudents.id,
      activeRombelForStudents.fullName || `Rombel ${activeRombelForStudents.name}`,
      activeRombelForStudents.teacherName
    );
    setSelectedStudentIdsToAdd([]);
    setManageTab('current');
  };

  // Quick single add student to active rombel
  const handleSingleAddStudentToRombel = (studentId: string) => {
    if (!activeRombelForStudents) return;
    assignStudentsToRombel(
      [studentId],
      activeRombelForStudents.classId,
      activeRombelForStudents.className,
      activeRombelForStudents.id,
      activeRombelForStudents.fullName || `Rombel ${activeRombelForStudents.name}`,
      activeRombelForStudents.teacherName
    );
  };

  // Toggle select student to add
  const toggleSelectStudent = (id: string) => {
    setSelectedStudentIdsToAdd(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Select all candidate students
  const handleSelectAllCandidates = () => {
    if (selectedStudentIdsToAdd.length === candidateStudentsForRombel.length) {
      setSelectedStudentIdsToAdd([]);
    } else {
      setSelectedStudentIdsToAdd(candidateStudentsForRombel.map(s => s.id));
    }
  };

  // Color helper for badges and card accents
  const getColorClasses = (colorName?: string) => {
    switch (colorName) {
      case 'purple':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          badgeBg: 'bg-purple-100',
          text: 'text-purple-800',
          headerBg: 'bg-purple-600',
          pill: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'emerald':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          badgeBg: 'bg-emerald-100',
          text: 'text-emerald-800',
          headerBg: 'bg-emerald-600',
          pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'amber':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          badgeBg: 'bg-amber-100',
          text: 'text-amber-800',
          headerBg: 'bg-amber-600',
          pill: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 'sky':
        return {
          bg: 'bg-sky-50',
          border: 'border-sky-200',
          badgeBg: 'bg-sky-100',
          text: 'text-sky-800',
          headerBg: 'bg-sky-600',
          pill: 'bg-sky-50 text-sky-700 border-sky-200',
        };
      case 'rose':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          badgeBg: 'bg-rose-100',
          text: 'text-rose-800',
          headerBg: 'bg-rose-600',
          pill: 'bg-rose-50 text-rose-700 border-rose-200',
        };
      case 'slate':
      default:
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          badgeBg: 'bg-slate-100',
          text: 'text-slate-800',
          headerBg: 'bg-slate-700',
          pill: 'bg-slate-100 text-slate-700 border-slate-200',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
            <School className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Struktur Kelas & Rombongan Belajar (Rombel)
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                4 Kelas (A1, A2, B1, B2)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                {rombels.length} Rombel Asmaul Husna
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Di dalam 1 kelas rata-rata terdapat 3 rombel belajar dengan masing-masing guru pengampu / wali rombel.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleOpenAddRombel()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Rombel</span>
          </button>

          <button
            onClick={handleOpenAddClass}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Kelas</span>
          </button>
        </div>
      </div>

      {/* Teacher Rombel Context Alert */}
      {currentRole === 'guru' && currentTeacher && currentRombel && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 text-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
              👩‍🏫
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-900">
                  Rombel Pengampuan Anda: {currentRombel.fullName || currentRombel.name} ({currentClass?.name || 'Kelas'})
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                  Aktif
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-0.5">
                Anda sebagai <b>{currentTeacher.name}</b> mengampu rombel ini ({students.filter(s => s.rombelId === currentRombel.id).length} santri). Rombel lainnya diampu oleh guru/wali rombel masing-masing.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedClassFilter(currentClass?.id || 'all')}
            className="text-xs font-bold text-emerald-700 bg-white border border-emerald-300 hover:bg-emerald-100/60 px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0"
          >
            Fokus Rombel Saya
          </button>
        </div>
      )}

      {/* 4 Summary Statistic Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              1. Jumlah Kelas
            </span>
            <p className="text-xl font-black text-slate-900 mt-0.5">{classes.length} Kelas</p>
            <p className="text-[11px] text-slate-500 mt-0.5">A1, A2, B1, B2</p>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 block">
              2. Total Rombel
            </span>
            <p className="text-xl font-black text-teal-800 mt-0.5">{rombels.length} Rombel</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Rata-rata 3 per kelas</p>
          </div>
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
            <School className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
              3. Santri Ditempatkan
            </span>
            <p className="text-xl font-black text-emerald-800 mt-0.5">{assignedStudentsCount} Santri</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Dari total {totalStudents} santri</p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
              4. Belum Ada Rombel (-)
            </span>
            <p className="text-xl font-black text-amber-800 mt-0.5">{unassignedStudents.length} Santri</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Perlu dimasukkan ke rombel</p>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs by Class */}
      <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1 whitespace-nowrap">
            <Filter className="w-3.5 h-3.5" />
            <span>Pilih Kelas:</span>
          </span>

          <button
            onClick={() => setSelectedClassFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedClassFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Kelas (A1, A2, B1, B2)
          </button>

          {classes.map(c => {
            const classRombels = rombels.filter(r => r.classId === c.id);
            const classStudentCount = students.filter(s => s.classId === c.id).length;
            const isSelected = selectedClassFilter === c.id;

            return (
              <button
                key={c.id}
                onClick={() => setSelectedClassFilter(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{c.name}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {classRombels.length} Rombel • {classStudentCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Classes & Rombels Hierarchy View */}
      <div className="space-y-6">
        {displayedClasses.map(cls => {
          // Find rombels belonging to this class
          const classRombels = rombels.filter(r => r.classId === cls.id);
          const classStudents = students.filter(s => s.classId === cls.id);
          const capacityTotal = classRombels.reduce((sum, r) => sum + (r.capacity || 15), 0) || cls.capacity;

          return (
            <div
              key={cls.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all hover:border-slate-300"
            >
              {/* Class Header Bar */}
              <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                    {cls.code || 'KL'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{cls.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {cls.ageGroup}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        Tahun Ajaran {cls.academicYear}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Koordinator: <b className="text-slate-700">{cls.teacherName || 'Dewan Guru'}</b></span>
                      <span className="text-slate-300">•</span>
                      <span>Total: <b className="text-emerald-700">{classStudents.length} Santri</b> ({classRombels.length} Rombongan Belajar)</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => handleOpenAddRombel(cls.id)}
                    className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-teal-600" />
                    <span>+ Tambah Rombel di {cls.name}</span>
                  </button>

                  <button
                    onClick={() => handleOpenEditClass(cls)}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                    title="Ubah Data Kelas"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setDeleteConfirmation({
                        type: 'class',
                        id: cls.id,
                        title: `Hapus ${cls.name}?`,
                        description: `Kelas ini memiliki ${classRombels.length} rombel dan ${classStudents.length} santri. Jika dihapus, santri akan berstatus belum ada kelas (-).`,
                      });
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                    title="Hapus Kelas"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Rombels Inside this Class (The 3 Rombel Cards corresponding to the notice boards) */}
              <div className="p-4 sm:p-5 bg-slate-50/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-teal-600" />
                    <span>Daftar Rombongan Belajar di {cls.name} ({classRombels.length} Rombel)</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Kapasitas Terisi: {classStudents.length} / {capacityTotal}
                  </span>
                </div>

                {classRombels.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl bg-white">
                    <p className="text-xs text-slate-500">
                      Belum ada rombel pada {cls.name}. Klik tombol di bawah untuk membuat rombel pertama.
                    </p>
                    <button
                      onClick={() => handleOpenAddRombel(cls.id)}
                      className="mt-2 text-xs font-bold text-teal-700 hover:underline cursor-pointer"
                    >
                      + Tambah Rombel Sekarang
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {classRombels.map((rombel, rIdx) => {
                      const rombelStudents = students.filter(s => s.rombelId === rombel.id);
                      const colors = getColorClasses(rombel.color);
                      const topNames = rombelStudents.slice(0, 4);

                      return (
                        <div
                          key={rombel.id}
                          className={`rounded-2xl border ${colors.border} bg-white shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between overflow-hidden`}
                        >
                          {/* Top Tag & Header */}
                          <div>
                            {/* Rombel Title Bar */}
                            <div className={`p-3.5 ${colors.bg} border-b ${colors.border} flex items-center justify-between`}>
                              <div className="flex items-center gap-2">
                                <span className={`w-6 h-6 rounded-lg ${colors.headerBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                                  {rIdx + 1}
                                </span>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">
                                      {rombel.fullName || `ROMBEL ${rombel.name.toUpperCase()}`}
                                    </h4>
                                    {currentRole === 'guru' && currentRombel?.id === rombel.id && (
                                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-600 text-white">
                                        Rombel Anda
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-slate-500 font-medium">
                                    {cls.name}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleOpenEditRombel(rombel)}
                                  className="p-1 text-slate-400 hover:text-teal-700 rounded-md cursor-pointer"
                                  title="Edit Rombel"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteConfirmation({
                                      type: 'rombel',
                                      id: rombel.id,
                                      title: `Hapus ${rombel.fullName || rombel.name}?`,
                                      description: `Rombel ini memiliki ${rombelStudents.length} santri. Jika dihapus, santri akan berstatus belum ada rombel.`,
                                    });
                                  }}
                                  className="p-1 text-slate-400 hover:text-rose-600 rounded-md cursor-pointer"
                                  title="Hapus Rombel"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Teacher Info Card (Guru Pengampu / Wali Rombel) */}
                            <div className="p-3 border-b border-slate-100 flex items-center gap-2.5 bg-white">
                              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                                👩‍🏫
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                  Guru / Wali Rombel:
                                </span>
                                <p className="font-bold text-slate-900 text-xs truncate">
                                  {rombel.teacherName}
                                  {currentRole === 'guru' && currentRombel?.id === rombel.id && (
                                    <span className="ml-1.5 text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.2 rounded">
                                      Akun Anda
                                    </span>
                                  )}
                                </p>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap">
                                {rombelStudents.length} Santri
                              </span>
                            </div>

                            {/* Students Preview (Notice Board Style List) */}
                            <div className="p-3 space-y-1.5">
                              <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
                                <span>Daftar Santri:</span>
                                <span>Kapasitas: {rombel.capacity || 15}</span>
                              </div>

                              {rombelStudents.length === 0 ? (
                                <p className="text-center text-slate-400 text-xs py-3 italic">
                                  Belum ada murid di rombel ini.
                                </p>
                              ) : (
                                <div className="space-y-1 text-xs">
                                  {topNames.map((s, idx) => (
                                    <div
                                      key={s.id}
                                      className="flex items-center justify-between py-1 px-2 rounded-lg bg-slate-50/80 hover:bg-slate-100/80 text-[11px] transition-colors"
                                    >
                                      <div className="flex items-center gap-2 truncate">
                                        <span className="font-mono text-[10px] font-bold text-slate-400 w-4 text-center">
                                          {idx + 1}
                                        </span>
                                        <span className="font-semibold text-slate-800 truncate">
                                          {s.name}
                                        </span>
                                      </div>
                                      <span className="text-[9px] font-mono px-1 rounded bg-slate-200/80 text-slate-600">
                                        {s.gender}
                                      </span>
                                    </div>
                                  ))}

                                  {rombelStudents.length > 4 && (
                                    <p className="text-[10px] text-slate-400 font-medium pt-1 text-center">
                                      + {rombelStudents.length - 4} santri lainnya terdaftar
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons: Tambah Murid & Kelola Santri */}
                          <div className="p-3 pt-0 grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenManageRombelStudents(rombel, 'add')}
                              className="py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>+ Tambah</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenManageRombelStudents(rombel, 'current')}
                              className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Users className="w-3.5 h-3.5" />
                              <span>Santri ({rombelStudents.length})</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: KELOLA & TAMBAH MURID DI ROMBEL */}
      {isManageRombelStudentsOpen && activeRombelForStudents && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      {activeRombelForStudents.fullName || `Rombel ${activeRombelForStudents.name}`}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {activeRombelForStudents.className}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Guru / Wali Rombel: <b className="text-slate-800">{activeRombelForStudents.teacherName}</b> • Kapasitas: {activeRombelForStudents.capacity || 15} Santri
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsManageRombelStudentsOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs: Murid di Rombel vs Tambah Murid vs Daftarkan Santri Baru */}
            <div className="px-5 pt-3 pb-2 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setManageTab('current')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    manageTab === 'current'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Santri di Rombel ({students.filter(s => s.rombelId === activeRombelForStudents.id).length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setManageTab('add');
                    setShowOnlyUnassigned(unassignedStudents.length > 0);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    manageTab === 'add'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Pilih Santri Terdaftar</span>
                  {unassignedStudents.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-900 font-bold">
                      {unassignedStudents.length} Belum Ada
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setManageTab('new')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    manageTab === 'new'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Daftarkan Santri Baru</span>
                </button>
              </div>

              {/* Quick Search for current / candidate */}
              {manageTab !== 'new' && (
                <div className="relative w-44 sm:w-56">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari nama / NIS..."
                    value={studentSearch}
                    onChange={e => setStudentSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>
              )}
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              {manageTab === 'current' ? (
                /* TAB 1: SANTRI DI ROMBEL INI */
                <div className="space-y-3">
                  {currentRombelStudents.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs space-y-2">
                      <p>Belum ada santri yang terdaftar di <b>{activeRombelForStudents.fullName || activeRombelForStudents.name}</b>.</p>
                      <div className="flex items-center justify-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setManageTab('add');
                            setShowOnlyUnassigned(unassignedStudents.length > 0);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                        >
                          + Pilih Santri Terdaftar
                        </button>
                        <button
                          type="button"
                          onClick={() => setManageTab('new')}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                        >
                          + Daftarkan Santri Baru
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                      <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="py-2.5 px-3 w-10 text-center">No</th>
                            <th className="py-2.5 px-3">Nama Santri</th>
                            <th className="py-2.5 px-3">NIS / NISN</th>
                            <th className="py-2.5 px-3 text-center">L/P</th>
                            <th className="py-2.5 px-3">Kelas & Rombel</th>
                            <th className="py-2.5 px-3 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {currentRombelStudents.map((s, idx) => (
                            <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-400">
                                {idx + 1}
                              </td>
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-2">
                                  <div className={`w-7 h-7 rounded-lg ${s.avatarColor || 'bg-emerald-600'} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                                    {s.name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900 leading-tight">{s.name}</p>
                                    <p className="text-[10px] text-slate-400">{s.nickname}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                                {s.nis}
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  s.gender === 'P' ? 'bg-pink-50 text-pink-700' : 'bg-blue-50 text-blue-700'
                                }`}>
                                  {s.gender === 'P' ? 'Perempuan' : 'Laki-laki'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 whitespace-nowrap">
                                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  {s.className} • {s.rombelName}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDeleteConfirmation({
                                      type: 'remove_student',
                                      student: s,
                                      title: `Keluarkan ${s.name} dari rombel?`,
                                      description: `Santri ini akan dikeluarkan dari ${activeRombelForStudents.name}. Status rombel santri akan menjadi "-" (belum ada rombel).`,
                                    });
                                  }}
                                  className="px-2 py-1 rounded-lg text-rose-600 hover:bg-rose-50 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ml-auto"
                                  title="Keluarkan dari Rombel"
                                >
                                  <UserMinus className="w-3.5 h-3.5" />
                                  <span>Keluarkan</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : manageTab === 'add' ? (
                /* TAB 2: TAMBAH SANTRI KE ROMBEL */
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                      <p className="text-amber-900 font-medium">
                        Pilih santri untuk dimasukkan ke <b>{activeRombelForStudents.fullName || activeRombelForStudents.name} ({activeRombelForStudents.teacherName})</b>.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowOnlyUnassigned(true)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          showOnlyUnassigned
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-white text-amber-900 border border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        Hanya Tanpa Rombel ({unassignedStudents.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowOnlyUnassigned(false)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          !showOnlyUnassigned
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-white text-amber-900 border border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        Semua Santri (Pindah Rombel)
                      </button>
                    </div>
                  </div>

                  {candidateStudentsForRombel.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs space-y-3">
                      <p className="font-semibold text-slate-700">
                        {showOnlyUnassigned
                          ? 'Tidak ada santri tanpa rombel saat ini.'
                          : 'Tidak ada santri yang cocok dengan pencarian.'}
                      </p>
                      <p className="text-slate-400">
                        Anda dapat menampilkan santri dari rombel lain untuk dimutasi atau mendaftarkan santri baru.
                      </p>
                      <div className="flex items-center justify-center gap-2 pt-1">
                        {showOnlyUnassigned && (
                          <button
                            type="button"
                            onClick={() => setShowOnlyUnassigned(false)}
                            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                          >
                            Tampilkan Semua Santri (Pindah Rombel)
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setManageTab('new')}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                        >
                          + Daftarkan Santri Baru Langsung
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                      <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
                        <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              candidateStudentsForRombel.length > 0 &&
                              selectedStudentIdsToAdd.length === candidateStudentsForRombel.length
                            }
                            onChange={handleSelectAllCandidates}
                            className="rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>Pilih Semua ({candidateStudentsForRombel.length} Santri)</span>
                        </label>

                        {selectedStudentIdsToAdd.length > 0 && (
                          <button
                            type="button"
                            onClick={handleConfirmAddStudentsToRombel}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <Check className="w-4 h-4" />
                            <span>Masukkan ({selectedStudentIdsToAdd.length}) Santri Terpilih</span>
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                        {candidateStudentsForRombel.map(s => {
                          const isSelected = selectedStudentIdsToAdd.includes(s.id);
                          return (
                            <div
                              key={s.id}
                              onClick={() => toggleSelectStudent(s.id)}
                              className={`p-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                                isSelected ? 'bg-emerald-50/80' : 'hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {}} // handled by parent onClick
                                  className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                />

                                <div className={`w-7 h-7 rounded-lg ${s.avatarColor || 'bg-slate-500'} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                                  {s.name.charAt(0)}
                                </div>

                                <div className="truncate">
                                  <p className="font-bold text-slate-900 leading-tight truncate">{s.name}</p>
                                  <p className="text-[10px] text-slate-400 font-mono">NIS: {s.nis} • {s.gender === 'P' ? 'Perempuan' : 'Laki-laki'}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  !s.rombelId || s.rombelName === '-'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {!s.rombelId || s.rombelName === '-' ? 'Belum Ada Rombel (-)' : s.rombelName}
                                </span>

                                <button
                                  type="button"
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleSingleAddStudentToRombel(s.id);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Masukkan</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* TAB 3: DAFTARKAN SANTRI BARU LANGSUNG KE ROMBEL INI */
                <form onSubmit={handleCreateAndAssignStudent} className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs">
                    <p className="font-bold text-purple-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                      <span>Pendaftaran Santri Baru Langsung Masuk Rombel</span>
                    </p>
                    <p className="text-purple-700 mt-1">
                      Santri yang didaftarkan akan otomatis ditempatkan di <b>{activeRombelForStudents.fullName || activeRombelForStudents.name}</b> ({activeRombelForStudents.className}) dengan guru pembimbing <b>{activeRombelForStudents.teacherName}</b>.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-700 block mb-1">
                        Nama Lengkap Santri <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newStudentData.name}
                        onChange={e => setNewStudentData({ ...newStudentData, name: e.target.value })}
                        placeholder="Contoh: Muhammad Rayyan Al-Ghifari"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-purple-600 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Nama Panggilan</label>
                      <input
                        type="text"
                        value={newStudentData.nickname}
                        onChange={e => setNewStudentData({ ...newStudentData, nickname: e.target.value })}
                        placeholder="Contoh: Rayyan"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-purple-600 text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Nomor Induk Santri (NIS)</label>
                      <input
                        type="text"
                        value={newStudentData.nis}
                        onChange={e => setNewStudentData({ ...newStudentData, nis: e.target.value })}
                        placeholder={`Otomatis: 260${String(students.length + 1).padStart(2, '0')}`}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-purple-600 text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Jenis Kelamin</label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setNewStudentData({ ...newStudentData, gender: 'L' })}
                          className={`flex-1 py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                            newStudentData.gender === 'L'
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Laki-laki (L)
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewStudentData({ ...newStudentData, gender: 'P' })}
                          className={`flex-1 py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                            newStudentData.gender === 'P'
                              ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Perempuan (P)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Nama Orang Tua / Wali</label>
                      <input
                        type="text"
                        value={newStudentData.fatherName}
                        onChange={e => setNewStudentData({ ...newStudentData, fatherName: e.target.value })}
                        placeholder="Contoh: Irfan Ghifari"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-purple-600 text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-700 block mb-1">No. HP / WhatsApp Wali</label>
                      <input
                        type="tel"
                        value={newStudentData.guardianPhone}
                        onChange={e => setNewStudentData({ ...newStudentData, guardianPhone: e.target.value })}
                        placeholder="0812-xxxx-xxxx"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-purple-600 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setManageTab('current')}
                      className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Daftarkan & Masukkan ke Rombel</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Santri yang dimasukkan ke rombel ini otomatis terdaftar di <b>{activeRombelForStudents.className}</b>.
              </span>
              <button
                type="button"
                onClick={() => setIsManageRombelStudentsOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: TAMBAH / UBAH ROMBEL */}
      {isRombelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {editingRombel ? 'Ubah Data Rombongan Belajar' : 'Tambah Rombel Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Rombel berada di dalam salah satu Kelas.</p>
                </div>
              </div>
              <button
                onClick={() => setIsRombelModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRombel} className="space-y-3.5">
              {/* Pilihan Kelas Induk */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Kelas Induk *</label>
                <select
                  value={rombelFormData.classId}
                  onChange={e => {
                    const c = classes.find(item => item.id === e.target.value);
                    setRombelFormData({
                      ...rombelFormData,
                      classId: e.target.value,
                      className: c?.name || rombelFormData.className,
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-teal-500 font-bold text-slate-800"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.ageGroup})
                    </option>
                  ))}
                </select>
              </div>

              {/* Nama Rombel */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Rombel *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Al Quddus, As Salam, Ar Rahman"
                  value={rombelFormData.name}
                  onChange={e => {
                    const val = e.target.value;
                    setRombelFormData({
                      ...rombelFormData,
                      name: val,
                      fullName: `Rombel ${val}`,
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-teal-500 font-semibold"
                />
              </div>

              {/* Nama Guru / Wali Rombel */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nama Guru Pengampu / Wali Rombel *
                </label>
                <select
                  value={rombelFormData.teacherName}
                  onChange={e => {
                    const selected = teachers.find(t => t.name === e.target.value);
                    setRombelFormData({
                      ...rombelFormData,
                      teacherId: selected?.id || '',
                      teacherName: e.target.value,
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-teal-500 font-medium"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.name}>
                      {t.name} ({t.position || 'Guru'})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Atau ketik langsung jika nama guru belum ada di daftar:
                </p>
                <input
                  type="text"
                  placeholder="Ketik manual nama guru jika belum terdaftar"
                  value={rombelFormData.teacherName}
                  onChange={e => setRombelFormData({ ...rombelFormData, teacherName: e.target.value })}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs focus:bg-white focus:border-teal-500"
                />
              </div>

              {/* Kapasitas Santri & Warna Badge */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kapasitas Maksimal</label>
                  <input
                    type="number"
                    min="5"
                    max="35"
                    value={rombelFormData.capacity}
                    onChange={e => setRombelFormData({ ...rombelFormData, capacity: parseInt(e.target.value) || 16 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-teal-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Warna Aksen Kartu</label>
                  <select
                    value={rombelFormData.color}
                    onChange={e => setRombelFormData({ ...rombelFormData, color: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-teal-500 font-medium"
                  >
                    <option value="emerald">Hijau (Emerald)</option>
                    <option value="purple">Ungu (Lilac)</option>
                    <option value="amber">Kuning (Gold)</option>
                    <option value="sky">Biru Langit (Sky)</option>
                    <option value="rose">Merah Muda (Rose)</option>
                    <option value="slate">Abu-abu (Slate)</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRombelModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold cursor-pointer shadow-xs"
                >
                  {editingRombel ? 'Simpan Perubahan' : 'Buat Rombel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: TAMBAH / UBAH KELAS */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {editingClass ? 'Ubah Data Kelas' : 'Tambah Kelas Baru'}
              </h3>
              <button
                onClick={() => setIsClassModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitClass} className="space-y-3.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Kelas *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kelas A1, Kelas B2"
                  value={classFormData.name}
                  onChange={e => setClassFormData({ ...classFormData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kode Kelas</label>
                  <input
                    type="text"
                    placeholder="A1 / B2"
                    value={classFormData.code}
                    onChange={e => setClassFormData({ ...classFormData, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kelompok Usia</label>
                  <select
                    value={classFormData.ageGroup}
                    onChange={e => setClassFormData({ ...classFormData, ageGroup: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-medium"
                  >
                    <option value="4 - 5 Tahun (Kelompok A)">4 - 5 Tahun (Kelompok A)</option>
                    <option value="5 - 6 Tahun (Kelompok B)">5 - 6 Tahun (Kelompok B)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Guru Koordinator / Wali Kelas</label>
                <input
                  type="text"
                  placeholder="Nama Guru Koordinator"
                  value={classFormData.teacherName}
                  onChange={e => setClassFormData({ ...classFormData, teacherName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer shadow-xs"
                >
                  {editingClass ? 'Simpan Perubahan' : 'Buat Kelas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IN-APP CONFIRMATION MODAL */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full p-5 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{deleteConfirmation.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{deleteConfirmation.description}</p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmation(null)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deleteConfirmation.type === 'class' && deleteConfirmation.id) {
                    const classId = deleteConfirmation.id;
                    const studentIds = students.filter(s => s.classId === classId).map(s => s.id);
                    studentIds.forEach(id => removeStudentFromClass(id));
                    deleteClass(classId);
                  } else if (deleteConfirmation.type === 'rombel' && deleteConfirmation.id) {
                    deleteRombel(deleteConfirmation.id);
                  } else if (deleteConfirmation.type === 'remove_student' && deleteConfirmation.student) {
                    removeStudentFromRombel(deleteConfirmation.student.id);
                  }
                  setDeleteConfirmation(null);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
