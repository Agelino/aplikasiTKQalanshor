import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
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
  LogOut,
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
    logout,
    schoolProfile,
    academicYear,
    currentTeacher,
    currentRombel,
    currentStudent,
    teacherNotes,
    rombelMeetings,
  } = useApp();

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  const activeSemesterName = academicYear?.semesters?.find(sem => sem.status === 'Aktif')?.name || 'Semester 1';

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
        { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
      ],
    },
    {
      title: 'MASTER DATA & TU',
      items: [
        { id: 'guru', label: 'Pendidik & Guru', icon: <Users className="w-4 h-4" /> },
        { id: 'absensi_guru', label: 'Absensi Guru (TU)', icon: <UserCheck className="w-4 h-4" /> },
        { id: 'murid', label: 'Murid', icon: <GraduationCap className="w-4 h-4" /> },
        { id: 'kelas', label: 'Kelas & Rombel', icon: <School className="w-4 h-4" /> },
        { id: 'tahun_ajaran', label: 'Tahun Ajaran & Sem.', icon: <CalendarRange className="w-4 h-4" /> },
        { id: 'kalender_proker', label: 'Kalender Program Kerja', icon: <Calendar className="w-4 h-4" /> },
        { id: 'kalender_akademik', label: 'Kalender Akademik', icon: <CalendarDays className="w-4 h-4" /> },
      ],
    },
    {
      title: 'KURIKULUM',
      items: [
        { id: 'kurikulum_pemerintah', label: 'Kurikulum Pemerintah', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'kurikulum_tk', label: "Bustanul Qur'an", icon: <Sparkles className="w-4 h-4" /> },
        { id: 'kelola_cp_tp', label: 'Bank CP & TP', icon: <Target className="w-4 h-4" /> },
        { id: 'curriculum_builder', label: 'Curriculum Builder', icon: <Layers className="w-4 h-4" /> },
        { id: 'kurikulum_aktif', label: 'Kurikulum Aktif', icon: <FileCheck2 className="w-4 h-4" /> },
        { id: 'bank_materi', label: 'Bank Materi', icon: <FolderOpen className="w-4 h-4" /> },
        { id: 'bank_kegiatan', label: 'Bank Kegiatan', icon: <Activity className="w-4 h-4" /> },
      ],
    },
    {
      title: 'PERENCANAAN',
      items: [
        { id: 'template_rppm', label: 'Template RPPM', icon: <ClipboardList className="w-4 h-4" /> },
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
        { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
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
        { id: 'rpph', label: 'RPPH Harian', icon: <FileText className="w-4 h-4" /> },
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
        { id: 'input_rapor', label: 'Input Nilai Rapor', icon: <ClipboardCheck className="w-4 h-4" /> },
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
        { id: 'dashboard', label: 'Dashboard Anak', icon: <Home className="w-4 h-4" /> },
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
    <div className="app-sidebar flex flex-col h-full w-[288px] select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between gap-2 h-[76px] px-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
            <School className="w-5 h-5 text-[#047857]" />
          </div>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-white leading-tight truncate">
              {schoolProfile.name}
            </p>
          </div>
        </div>
        <button
          onClick={onCloseMobile}
          className="md:hidden text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10"
          aria-label="Tutup Menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-scroll flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {section.title && (
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#D1FAE5]/80 mb-2">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full flex items-center justify-between gap-3 px-3.5 min-h-[42px] py-2.5 rounded-xl text-[14px] transition-colors group ${
                      isActive
                        ? 'bg-[#A7F3D0] text-[#064E3B] font-semibold'
                        : 'text-[#D1FAE5] font-medium hover:bg-white/[0.12] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`shrink-0 ${isActive ? 'text-[#064E3B]' : 'text-[#D1FAE5] group-hover:text-white'}`}>
                        {item.icon}
                      </span>
                      <span className="whitespace-nowrap">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0 ${
                        item.badge === 'LIVE'
                          ? 'bg-[#FFFBEB] text-[#D97706]'
                          : isActive
                          ? 'bg-white/70 text-[#064E3B]'
                          : 'bg-[#059669] text-white'
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
      </nav>

      {/* Footer */}
      <div className="border-t border-white/15 p-3 space-y-1.5 shrink-0">
        <div className="flex items-center gap-2 px-2 text-[11px] text-[#D1FAE5]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A7F3D0]" />
          <span className="truncate">{activeSemesterName}</span>
          <span className="text-[#A7F3D0]/50">·</span>
          <span className="truncate">{academicYear?.name}</span>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 min-h-[42px] rounded-xl text-[14px] font-medium text-[#D1FAE5] hover:text-white hover:bg-white/[0.12] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col shrink-0 h-screen sticky top-0 z-40">
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
