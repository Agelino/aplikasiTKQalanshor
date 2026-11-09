import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import {
  Menu,
  Search,
  Bell,
  Check,
  ChevronDown,
  User,
  LogOut,
  Shield,
  GraduationCap,
  Sparkles,
  School,
  CheckCircle2,
} from 'lucide-react';
import { GlobalSearchModal } from './GlobalSearchModal';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const {
    currentUser,
    currentRole,
    switchRole,
    logout,
    notifications,
    markNotificationRead,
    setActiveTab,
    activeTab,
    currentTeacher,
    currentRombel,
    currentClass,
    accessibleStudents,
    teachers,
    rombels,
    switchTeacher,
    currentStudent,
    switchStudent,
    students,
  } = useApp();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isTeacherMenuOpen, setIsTeacherMenuOpen] = useState(false);
  const [isStudentMenuOpen, setIsStudentMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const teacherMenuRef = useRef<HTMLDivElement>(null);
  const studentMenuRef = useRef<HTMLDivElement>(null);

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (teacherMenuRef.current && !teacherMenuRef.current.contains(event.target as Node)) {
        setIsTeacherMenuOpen(false);
      }
      if (studentMenuRef.current && !studentMenuRef.current.contains(event.target as Node)) {
        setIsStudentMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleLabels: Record<Role, { label: string; badge: string; icon: React.ReactNode }> = {
    admin: {
      label: 'Admin / Tata Usaha',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: <Shield className="w-3.5 h-3.5 text-indigo-600" />,
    },
    guru: {
      label: 'Guru Kelas / Pengajar',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />,
    },
    murid: {
      label: 'Portal Murid / Orang Tua',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-600" />,
    },
  };

  const getBreadcrumbTitle = (tab: string) => {
    const map: Record<string, string> = {
      dashboard: 'Dashboard',
      profil_tk: 'Master Data / Profil TK',
      guru: 'Master Data / Data Guru',
      murid: 'Master Data / Data Murid',
      kelas: 'Master Data / Pengelolaan Kelas',
      tahun_ajaran: 'Master Data / Tahun Ajaran & Semester',
      kalender: 'Akademik / Kalender Akademik',
      agenda: 'Akademik / Kalender Akademik',
      forum_rombel: 'Komunitas / Forum Diskusi & Streaming Rapat Rombel',
      catatan_guru: 'Bimbingan / Catatan Pribadi Siswa',
      catatan_guru_anak: 'Data Anak / Catatan Pribadi Guru',
      kurikulum_tk: 'Kurikulum / Kurikulum Khas TK/TKQ',
      curriculum_builder: 'Kurikulum / Curriculum Builder (Penyusun Kurikulum)',
      kurikulum_aktif: 'Kurikulum / Kurikulum Aktif Terpadu',
      bank_materi: 'Kurikulum / Bank Materi Pembelajaran',
      bank_kegiatan: 'Kurikulum / Bank Kegiatan Anak',
      prosem: 'Pembelajaran / Program Semester (Prosem)',
      rppm: 'Pembelajaran / RPPM Mingguan',
      rpph: 'Pembelajaran / RPPH Harian Terintegrasi',
      pelaksanaan_belajar: 'Pembelajaran / Catatan Pelaksanaan Belajar',
      absensi: 'Informasi / Presensi & Absensi Harian',
      penilaian: 'Penilaian / Input Observasi Harian',
      rekap_penilaian: 'Penilaian / Rekapitulasi Capaian',
      perkembangan: 'Penilaian / Perkembangan 6 Aspek Anak',
      rapor: 'Penilaian / Buku Laporan (Rapor TK)',
      pengumuman: 'Informasi / Pengumuman Resmi',
      laporan: 'Laporan / Rekapitulasi & Cetak Eksekutif',
      activity_log: 'Sistem / Audit & Activity Log',
      pengaturan: 'Sistem / Pengaturan Lembaga',
      kelas_saya: 'Akademik / Kelas Saya',
      murid_saya: 'Akademik / Daftar Murid Saya',
      profil_anak: 'Data Anak / Profil Peserta Didik',
      kehadiran_anak: 'Data Anak / Riwayat Kehadiran',
      nilai_anak: 'Data Anak / Nilai & Observasi Guru',
      perkembangan_anak: 'Data Anak / Analisis Perkembangan 6 Aspek',
      rapor_anak: 'Data Anak / Pratinjau Rapor Resmi',
    };
    return map[tab] || 'Sistem Informasi Manajemen TK';
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white/95 backdrop-blur-md border-b border-slate-200">
        {/* Left Zone: Hamburger + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <span className="hidden sm:inline-block text-xs font-medium text-slate-400">
              SIM TK Ceria Bangsa
            </span>
            <span className="hidden sm:inline-block text-slate-300">/</span>
            <h1 className="text-sm md:text-base font-semibold text-slate-800 truncate">
              {getBreadcrumbTitle(activeTab)}
            </h1>
          </div>
        </div>

        {/* Center/Right Zone: Universal Search trigger + Role Switcher Demo Bar + Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Universal Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/80 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200/60 transition-colors text-xs font-medium"
            title="Cari data (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Cari data...</span>
            <kbd className="hidden lg:inline px-1 py-0.2 rounded bg-white text-[10px] text-slate-400 font-mono shadow-xs">
              ⌘K
            </kbd>
          </button>

          {/* Role Switcher (Crucial for live prototype presentation!) */}
          <div className="hidden sm:flex items-center p-1 rounded-xl bg-slate-100/90 border border-slate-200/60 gap-0.5">
            <span className="text-[11px] font-medium text-slate-400 px-2 select-none">
              Peran:
            </span>
            {(['admin', 'guru', 'murid'] as Role[]).map(role => (
              <button
                key={role}
                onClick={() => switchRole(role)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  currentRole === role
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                }`}
              >
                {role === 'admin' ? 'Admin / TU' : role === 'guru' ? 'Guru' : 'Murid'}
              </button>
            ))}
          </div>

          {/* Active Teacher & Rombel Switcher (Exclusive for Guru mode) */}
          {currentRole === 'guru' && (
            <div className="relative" ref={teacherMenuRef}>
              <button
                onClick={() => setIsTeacherMenuOpen(!isTeacherMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold hover:bg-emerald-100/70 transition-colors shadow-xs"
                title="Ganti Guru / Rombel untuk simulasi"
              >
                <School className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="max-w-[130px] sm:max-w-[170px] truncate">
                  {currentRombel ? `${currentRombel.name} (${currentClass?.code || 'Kelas'})` : currentTeacher?.name}
                </span>
                <ChevronDown className="w-3 h-3 text-emerald-600 shrink-0" />
              </button>

              {isTeacherMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 p-2.5">
                  <div className="px-2 py-1.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">Pilih Guru & Rombel Binaan</p>
                    <p className="text-[10px] text-slate-500">
                      Data murid, presensi & penilaian akan otomatis disaring sesuai rombel guru yang dipilih.
                    </p>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-1 pt-1.5">
                    {teachers.map(t => {
                      const r = rombels.find(rom => rom.teacherId === t.id);
                      const isCurrent = currentTeacher?.id === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            switchTeacher(t.id);
                            setIsTeacherMenuOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
                            isCurrent
                              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-semibold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <p className="truncate font-semibold">{t.name}</p>
                            <p className="text-[11px] text-emerald-700 truncate">
                              {r ? `${r.fullName} · ${r.className}` : t.position}
                            </p>
                          </div>
                          {isCurrent && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Active Student Badge & Switcher for Murid Role */}
          {currentRole === 'murid' && currentStudent && (
            <div className="relative" ref={studentMenuRef}>
              <button
                onClick={() => setIsStudentMenuOpen(!isStudentMenuOpen)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/90 text-teal-900 text-xs font-bold hover:shadow-xs transition-all cursor-pointer"
                title="Profil Santri Aktif & Pengaturan Ananda"
              >
                <div className={`w-5 h-5 rounded-lg ${currentStudent.avatarColor || 'bg-teal-600'} text-white text-[10px] flex items-center justify-center font-black`}>
                  {currentStudent.name.charAt(0)}
                </div>
                <div className="text-left">
                  <span className="block text-[11px] font-bold text-slate-900 leading-tight">
                    Ananda: {currentStudent.name}
                  </span>
                  <span className="block text-[9px] text-teal-700 font-semibold leading-none">
                    {currentStudent.className || 'Kelas'} · {currentStudent.rombelName || 'Rombel'}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-teal-600 shrink-0" />
              </button>

              {isStudentMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 p-2.5">
                  <div className="px-2 py-1.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">Pilih Santri / Ananda</p>
                    <p className="text-[10px] text-slate-500">
                      Beralih akun wali murid untuk melihat data perkembangan ananda.
                    </p>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-1 pt-1.5">
                    {students.slice(0, 12).map(s => {
                      const isCurrent = currentStudent?.id === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            switchStudent(s.id);
                            setIsStudentMenuOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
                            isCurrent
                              ? 'bg-teal-50 text-teal-900 border border-teal-300 font-semibold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <p className="truncate font-semibold">{s.name}</p>
                            <p className="text-[11px] text-teal-700 truncate">
                              {s.className || 'Kelas'} · {s.rombelName || 'Rombel'} · NIS: {s.nis}
                            </p>
                          </div>
                          {isCurrent && <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Notifikasi"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">Notifikasi</span>
                    {unreadNotifCount > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700">
                        {unreadNotifCount} baru
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => notifications.forEach(n => markNotificationRead(n.id))}
                    className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Tandai dibaca
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">Tidak ada notifikasi</div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.linkTab) setActiveTab(n.linkTab);
                          setIsNotifOpen(false);
                        }}
                        className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                          !n.read ? 'bg-emerald-50/30' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-snug">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {currentUser?.name.charAt(0) || 'U'}
              </div>
              <div className="hidden xl:block min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate max-w-[120px]">
                  {currentUser?.name.split(',')[0] || 'Pengguna'}
                </p>
                <p className="text-[10px] text-slate-500 capitalize">{currentRole}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-3.5 border-b border-slate-100 bg-slate-50/70">
                  <p className="text-xs font-bold text-slate-800">{currentTeacher?.name || currentUser?.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{currentTeacher?.email || currentUser?.email || 'user@tkceriabangsa.sch.id'}</p>
                  
                  {currentRole === 'guru' && currentRombel && (
                    <div className="mt-2 p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 space-y-0.5">
                      <p className="font-bold flex items-center gap-1">
                        <School className="w-3 h-3 text-emerald-600" />
                        {currentRombel.fullName} ({currentRombel.className})
                      </p>
                      <p className="text-[10px] text-emerald-700">
                        NIP: {currentTeacher?.nip || '-'} · {accessibleStudents.length} Murid Binaan
                      </p>
                    </div>
                  )}

                  {currentRole === 'murid' && currentStudent && (
                    <div className="mt-2 p-2 bg-teal-50 rounded-xl border border-teal-200 text-[11px] text-teal-800 space-y-0.5">
                      <p className="font-bold flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
                        {currentStudent.name}
                      </p>
                      <p className="text-[10px] text-teal-700">
                        NIS: {currentStudent.nis} · {currentStudent.className || 'Kelas'} ({currentStudent.rombelName || 'Rombel'})
                      </p>
                      {currentStudent.rombelTeacherName && (
                        <p className="text-[9px] text-slate-500">
                          Wali Rombel: {currentStudent.rombelTeacherName}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-2 flex items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md border ${roleLabels[currentRole].badge}`}>
                      {roleLabels[currentRole].icon}
                      {roleLabels[currentRole].label}
                    </span>
                  </div>
                </div>

                <div className="p-1.5 space-y-0.5">
                  <button
                    onClick={() => {
                      setActiveTab(currentRole === 'murid' ? 'profil_anak' : 'profil_tk');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    Profil Pengguna
                  </button>
                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      Keluar (Logout)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global search modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
