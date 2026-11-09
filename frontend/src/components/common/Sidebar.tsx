import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Building2,
  Users,
  GraduationCap,
  School,
  CalendarDays,
  CalendarRange,
  BookOpen,
  Sparkles,
  Layers,
  FileCheck2,
  FolderOpen,
  Activity,
  Calendar,
  ClipboardList,
  FileText,
  PlayCircle,
  ClipboardCheck,
  BarChart3,
  TrendingUp,
  Award,
  Target,
  CheckCircle,
  UserCheck,
  BellRing,
  BookmarkCheck,
  FileSpreadsheet,
  UserCog,
  History,
  Settings,
  HeartHandshake,
  MessageSquare,
  Lock,
  User,
  X,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavSection {
  title?: string;
  items: {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const {
    currentRole,
    activeTab,
    setActiveTab,
    schoolProfile,
    currentTeacher,
    currentRombel,
    currentClass,
    accessibleStudents,
    currentStudent,
    teacherNotes,
    rombelMeetings,
  } = useApp();

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  // Count unread notes for active student
  const studentUnreadNotesCount = React.useMemo(() => {
    if (!currentStudent) return 0;
    return teacherNotes.filter(n => n.studentId === currentStudent.id && !n.isReadByParent).length;
  }, [teacherNotes, currentStudent]);

  // Count urgent/unread notes for active teacher
  const teacherPendingNotesCount = React.useMemo(() => {
    if (!currentTeacher) return teacherNotes.length;
    return teacherNotes.filter(n => n.teacherId === currentTeacher.id || (currentRombel && n.rombelId === currentRombel.id)).length;
  }, [teacherNotes, currentTeacher, currentRombel]);

  // Check live meeting count in rombels
  const liveMeetingCount = React.useMemo(() => {
    return rombelMeetings.filter(m => m.status === 'live').length;
  }, [rombelMeetings]);

  const getAdminSections = (): NavSection[] => [
    {
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      ],
    },
    {
      title: 'MASTER DATA & TU',
      items: [
        { id: 'guru', label: 'Pendidik & Guru', icon: <Users className="w-4 h-4" /> },
        { id: 'absensi_guru', label: 'Absensi Guru (TU)', icon: <UserCheck className="w-4 h-4" />, badge: 'TU' },
        { id: 'murid', label: 'Murid', icon: <GraduationCap className="w-4 h-4" /> },
        { id: 'kelas', label: 'Kelas & Rombel', icon: <School className="w-4 h-4" />, badge: 'A1-B2' },
        { id: 'tahun_ajaran', label: 'Tahun Ajaran & Sem.', icon: <CalendarRange className="w-4 h-4" /> },
        { id: 'kalender_proker', label: 'Kalender Program Kerja', icon: <Calendar className="w-4 h-4" /> },
        { id: 'kalender_akademik', label: 'Kalender Akademik', icon: <CalendarDays className="w-4 h-4" />, badge: 'Real' },
      ],
    },
    {
      title: 'KURIKULUM',
      items: [
        { id: 'kurikulum_pemerintah', label: 'Kurikulum Pemerintah', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'kurikulum_tk', label: "Bustanul Qur'an", icon: <Sparkles className="w-4 h-4" /> },
        { id: 'kelola_cp_tp', label: 'Bank CP & TP', icon: <Target className="w-4 h-4" />, badge: 'Elemen' },
        { id: 'curriculum_builder', label: 'Curriculum Builder', icon: <Layers className="w-4 h-4" />, badge: 'Wizard' },
        { id: 'kurikulum_aktif', label: 'Kurikulum Aktif', icon: <FileCheck2 className="w-4 h-4" /> },
        { id: 'bank_materi', label: 'Bank Materi', icon: <FolderOpen className="w-4 h-4" /> },
        { id: 'bank_kegiatan', label: 'Bank Kegiatan', icon: <Activity className="w-4 h-4" /> },
      ],
    },
    {
      title: 'PERENCANAAN',
      items: [
        { id: 'template_rppm', label: 'Template RPPM', icon: <ClipboardList className="w-4 h-4" />, badge: 'Master' },
      ],
    },
    {
      title: 'PENILAIAN & BIMBINGAN',
      items: [
        { id: 'catatan_guru', label: 'Catatan Siswa & Bimbingan', icon: <HeartHandshake className="w-4 h-4" /> },
      ],
    },
    {
      title: 'INFORMASI & KOMUNITAS',
      items: [
        { id: 'rapat_online', label: 'Rapat Online', icon: <PlayCircle className="w-4 h-4" />, badge: liveMeetingCount > 0 ? 'LIVE' : undefined },
        { id: 'pengumuman', label: 'Pengumuman', icon: <BellRing className="w-4 h-4" /> },
      ],
    },
    {
      title: 'LAPORAN',
      items: [
        { id: 'laporan', label: 'Laporan & Ekspor', icon: <FileSpreadsheet className="w-4 h-4" /> },
      ],
    },
    {
      title: 'SISTEM & PENGATURAN',
      items: [
        { id: 'pengguna', label: 'Pengguna', icon: <UserCog className="w-4 h-4" /> },
        { id: 'activity_log', label: 'Activity Log', icon: <History className="w-4 h-4" /> },
        { id: 'pengaturan', label: 'Edit Profil Lembaga', icon: <Building2 className="w-4 h-4" /> },
      ],
    },
  ];

  const getGuruSections = (): NavSection[] => [
    {
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      ],
    },
    {
      title: 'AKADEMIK & SISWA',
      items: [
        { id: 'murid_saya', label: 'Murid Saya', icon: <GraduationCap className="w-4 h-4" /> },
        { id: 'catatan_guru', label: 'Catatan Pribadi Siswa', icon: <HeartHandshake className="w-4 h-4" />, badge: teacherPendingNotesCount > 0 ? `${teacherPendingNotesCount}` : undefined },
        { id: 'kalender_proker', label: 'Kalender Proker', icon: <Calendar className="w-4 h-4" /> },
        { id: 'kalender_akademik', label: 'Kalender Akademik', icon: <CalendarDays className="w-4 h-4" />, badge: 'Lihat' },
        { id: 'kurikulum_aktif', label: 'Kurikulum Aktif', icon: <FileCheck2 className="w-4 h-4" /> },
      ],
    },
    {
      title: 'PERENCANAAN',
      items: [
        { id: 'kelola_cp_tp', label: 'Bank CP & TP', icon: <Target className="w-4 h-4" /> },
        { id: 'bank_materi', label: 'Bank Materi', icon: <FolderOpen className="w-4 h-4" /> },
        { id: 'bank_kegiatan', label: 'Bank Kegiatan', icon: <Activity className="w-4 h-4" /> },
        { id: 'rppm', label: 'Menyusun RPPM', icon: <ClipboardList className="w-4 h-4" /> },
        { id: 'rpph', label: 'RPPH Harian', icon: <FileText className="w-4 h-4" />, badge: '1 Hari' },
      ],
    },
    {
      title: 'PRESENSI & KOMUNITAS',
      items: [
        { id: 'absensi', label: 'Absensi Murid', icon: <CheckCircle className="w-4 h-4" /> },
        { id: 'forum_rombel', label: 'Forum Diskusi Rombel', icon: <MessageSquare className="w-4 h-4" /> },
        { id: 'rapat_online', label: 'Rapat Online', icon: <PlayCircle className="w-4 h-4" />, badge: liveMeetingCount > 0 ? 'LIVE' : 'Gabung' },
      ],
    },
    {
      title: 'PENILAIAN',
      items: [
        { id: 'input_rapor', label: 'Input Nilai Rapor', icon: <ClipboardCheck className="w-4 h-4" />, badge: 'Format Baru' },
        { id: 'penilaian', label: 'Penilaian Harian', icon: <ClipboardList className="w-4 h-4" /> },
        { id: 'rekap_penilaian', label: 'Rekap Penilaian', icon: <BarChart3 className="w-4 h-4" /> },
        { id: 'perkembangan', label: 'Perkembangan Anak', icon: <TrendingUp className="w-4 h-4" /> },
        { id: 'rapor', label: 'Buku Rapor Siswa', icon: <Award className="w-4 h-4" /> },
      ],
    },
    {
      title: 'INFORMASI',
      items: [
        { id: 'pengumuman', label: 'Pengumuman', icon: <BellRing className="w-4 h-4" /> },
      ],
    },
  ];

  const getMuridSections = (): NavSection[] => [
    {
      items: [
        { id: 'dashboard', label: 'Dashboard Anak', icon: <LayoutDashboard className="w-4 h-4" /> },
      ],
    },
    {
      title: 'DATA ANAK & PEMBELAJARAN',
      items: [
        { id: 'kehadiran_anak', label: 'Pengajuan Izin', icon: <CheckCircle className="w-4 h-4" /> },
        { id: 'nilai_anak', label: 'Penilaian Harian', icon: <ClipboardCheck className="w-4 h-4" /> },
        { id: 'perkembangan_anak', label: 'Perkembangan 6 Aspek', icon: <TrendingUp className="w-4 h-4" /> },
        { id: 'catatan_guru_anak', label: 'Catatan Guru', icon: <HeartHandshake className="w-4 h-4" />, badge: studentUnreadNotesCount > 0 ? `${studentUnreadNotesCount} Baru` : undefined },
        { id: 'rapor_anak', label: 'Rapor Semester', icon: <Award className="w-4 h-4" /> },
      ],
    },
    {
      title: 'KOMUNIKASI & RAPAT',
      items: [
        { id: 'forum_rombel', label: 'Forum Diskusi', icon: <MessageSquare className="w-4 h-4" /> },
        { id: 'rapat_online', label: 'Rapat Online', icon: <PlayCircle className="w-4 h-4" />, badge: liveMeetingCount > 0 ? 'LIVE' : 'Gabung' },
      ],
    },
    {
      title: 'INFORMASI',
      items: [
        { id: 'pengumuman', label: 'Pengumuman', icon: <BellRing className="w-4 h-4" /> },
        { id: 'kalender_akademik', label: 'Kalender Akademik', icon: <CalendarDays className="w-4 h-4" /> },
      ],
    },
    {
      title: 'PENGATURAN',
      items: [
        { id: 'profil_anak', label: 'Profil Anak', icon: <User className="w-4 h-4" /> },
        { id: 'ubah_password', label: 'Ubah Kata Sandi', icon: <Lock className="w-4 h-4" /> },
      ],
    },
  ];

  const sections = currentRole === 'admin'
    ? getAdminSections()
    : currentRole === 'guru'
    ? getGuruSections()
    : getMuridSections();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-64 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
            CB
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-white tracking-tight truncate leading-tight">
              {schoolProfile.name}
            </h2>
            <p className="text-[11px] text-emerald-400 font-medium truncate">
              Tahun Ajaran 2026/2027
            </p>
          </div>
        </div>
        <button
          onClick={onCloseMobile}
          className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          aria-label="Tutup Menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Teacher & Rombel Profile Card in Guru Mode */}
      {currentRole === 'guru' && (
        <div className="mx-3 mt-3 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {currentTeacher?.name.charAt(0) || 'G'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{currentTeacher?.name || 'Guru'}</p>
              <p className="text-[10px] text-emerald-400 font-medium truncate">
                {currentRombel ? `${currentRombel.name} (${currentClass?.code || 'Kelas'})` : 'Wali Rombel'}
              </p>
            </div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400">
            <span>Murid Binaan Rombel:</span>
            <span className="font-bold text-emerald-400 px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700">
              {accessibleStudents.length} Anak
            </span>
          </div>
        </div>
      )}

      {/* Student Profile Card in Murid Mode */}
      {currentRole === 'murid' && currentStudent && (
        <div className="mx-3 mt-3 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 shrink-0">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg ${currentStudent.avatarColor || 'bg-teal-600'} text-white flex items-center justify-center text-xs font-bold shrink-0`}>
              {currentStudent.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{currentStudent.name}</p>
              <p className="text-[10px] text-teal-400 font-medium truncate">
                {currentStudent.className || 'Kelas'} · {currentStudent.rombelName || 'Rombel'}
              </p>
            </div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400">
            <span>NIS: <strong className="text-white font-mono">{currentStudent.nis}</strong></span>
            <span className="font-semibold text-teal-300 truncate max-w-[100px]">
              {currentStudent.rombelTeacherName || 'Dewan Guru'}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Links Scrollable */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-slate-700">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {section.title && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/50'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`shrink-0 transition-transform ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400 group-hover:scale-105'}`}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-md ${
                        isActive ? 'bg-emerald-700/80 text-white' : 'bg-slate-800 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Institution Info Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-2.5 px-2 py-1.5 text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="truncate font-medium">Semester 1 Aktif</span>
          <span className="text-slate-600">·</span>
          <span className="truncate">{schoolProfile.accreditation.split(' ')[0]}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col shrink-0 h-screen sticky top-0 z-40 border-r border-slate-800">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden animate-in fade-in"
        />
      )}

      {/* Mobile Off-canvas Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform md:hidden transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
