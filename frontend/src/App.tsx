import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/common/ToastContainer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { LoginView } from './components/auth/LoginView';

// Admin views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SchoolProfileView } from './components/admin/SchoolProfileView';
import { TeachersView } from './components/admin/TeachersView';
import { StudentsView } from './components/admin/StudentsView';
import { ClassesView } from './components/admin/ClassesView';
import { AcademicYearView } from './components/admin/AcademicYearView';
import { CalendarView } from './components/admin/CalendarView';
import { KalenderAkademikRealView } from './components/admin/KalenderAkademikRealView';
import { TeacherAttendanceView } from './components/admin/TeacherAttendanceView';
import { UsersView } from './components/admin/UsersView';

// Curriculum views
import { GovCurriculumView } from './components/curriculum/GovCurriculumView';
import { TkCurriculumView } from './components/curriculum/TkCurriculumView';
import { CurriculumBuilderView } from './components/curriculum/CurriculumBuilderView';
import { ActiveCurriculumView } from './components/curriculum/ActiveCurriculumView';
import { BankMateriView } from './components/curriculum/BankMateriView';
import { BankKegiatanView } from './components/curriculum/BankKegiatanView';
import { CPTPManagementView } from './components/curriculum/CPTPManagementView';

// Learning views
import { ProsemView } from './components/learning/ProsemView';
import { RPPMView } from './components/learning/RPPMView';
import { RPPHView } from './components/learning/RPPHView';
import { PelaksanaanBelajarView } from './components/learning/PelaksanaanBelajarView';

// Assessment & Rapor views
import { InputNilaiRaporView } from './components/assessment/InputNilaiRaporView';
import { PenilaianView } from './components/assessment/PenilaianView';
import { RekapPenilaianView } from './components/assessment/RekapPenilaianView';
import { PerkembanganAnakView } from './components/assessment/PerkembanganAnakView';
import { RaporView } from './components/assessment/RaporView';

// Student Portal views
import { StudentPortalView } from './components/student/StudentPortalView';
import { StudentProfileView } from './components/student/StudentProfileView';
import { StudentAttendanceView } from './components/student/StudentAttendanceView';
import { StudentAssessmentsView } from './components/student/StudentAssessmentsView';
import { StudentTeacherNotesView } from './components/student/StudentTeacherNotesView';
import { AttendanceManagementView } from './components/attendance/AttendanceManagementView';

// Teacher Personal Notes view
import { TeacherNotesView } from './components/teacher/TeacherNotesView';

// Forum & Rapat Online Rombel view
import { RombelForumView } from './components/rombel/RombelForumView';

// Utility views
import { AnnouncementsView } from './components/common/AnnouncementsView';
import { ActivityLogsView } from './components/common/ActivityLogsView';
import { ReportsExportView } from './components/common/ReportsExportView';

const AppContent: React.FC = () => {
  const { currentUser, activeTab, currentRole } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Shortcut for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!currentUser) {
    return <LoginView />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      // Dashboard
      case 'dashboard':
        if (currentRole === 'murid') return <StudentPortalView />;
        return <AdminDashboard />;

      // Master Data & TU
      case 'profil_tk':
      case 'profil_sekolah':
        return <SchoolProfileView />;
      case 'guru':
        return <TeachersView />;
      case 'absensi_guru':
      case 'absensi_tu':
      case 'presensi_guru':
        return <TeacherAttendanceView />;
      case 'murid':
      case 'murid_saya':
        return <StudentsView />;
      case 'kelas':
      case 'kelas_saya':
        return <ClassesView />;
      case 'tahun_ajaran':
        return <AcademicYearView />;
      case 'kalender_proker':
      case 'kalender':
      case 'agenda':
        return <CalendarView />;
      case 'kalender_akademik':
      case 'kaldik':
        return <KalenderAkademikRealView />;

      // Kurikulum
      case 'kurikulum_pemerintah':
        return <GovCurriculumView />;
      case 'kurikulum_tk':
        return <TkCurriculumView />;
      case 'kelola_cp_tp':
      case 'bank_cp_tp':
      case 'cp_tp':
        return <CPTPManagementView />;
      case 'curriculum_builder':
        return <CurriculumBuilderView />;
      case 'kurikulum_aktif':
        return <ActiveCurriculumView />;
      case 'bank_materi':
        return <BankMateriView />;
      case 'bank_kegiatan':
        return <BankKegiatanView />;

      // Perencanaan & Pembelajaran
      case 'prosem':
        return <ProsemView />;
      case 'template_rppm':
      case 'rppm':
        return <RPPMView />;
      case 'rpph':
        return <RPPHView />;
      case 'pelaksanaan_belajar':
        return <PelaksanaanBelajarView />;

      // Absensi / Kehadiran
      case 'absensi':
        if (currentRole === 'murid') return <StudentAttendanceView />;
        return <AttendanceManagementView />;

      // Penilaian & Rapor
      case 'input_rapor':
      case 'input_nilai':
      case 'input_nilai_rapor':
        return <InputNilaiRaporView />;
      case 'penilaian':
      case 'penilaian_harian':
        return <PenilaianView />;
      case 'rekap_penilaian':
        return <RekapPenilaianView />;
      case 'perkembangan':
      case 'perkembangan_anak':
        return <PerkembanganAnakView />;
      case 'rapor':
      case 'rapor_anak':
        return <RaporView />;

      // Catatan Pribadi Guru ke Siswa & Wali Murid
      case 'catatan_guru':
      case 'catatan_pribadi':
      case 'catatan_siswa':
      case 'catatan_bimbingan':
        return <TeacherNotesView />;

      // Forum Diskusi & Streaming Rapat Online Rombel (Dipisah)
      case 'forum_rombel':
      case 'forum':
      case 'forum_diskusi':
        if (currentRole === 'admin') {
          return <RombelForumView mode="rapat" />;
        }
        return <RombelForumView mode="forum" />;
      case 'rapat_online':
      case 'rapat':
      case 'streaming_rapat':
        return <RombelForumView mode="rapat" />;

      // Portal Murid / Wali
      case 'portal_murid':
        return <StudentPortalView />;
      case 'profil_anak':
      case 'ubah_password':
        return <StudentProfileView />;
      case 'kehadiran_anak':
      case 'portal_presensi':
        return <StudentAttendanceView />;
      case 'nilai_anak':
      case 'portal_penilaian':
        return <StudentAssessmentsView />;
      case 'catatan_guru_anak':
      case 'catatan_wali':
        return <StudentTeacherNotesView />;
      case 'portal_rapor':
        return <RaporView />;

      // Utilitas & Laporan
      case 'pengumuman':
        return <AnnouncementsView />;
      case 'activity_log':
      case 'log_aktivitas':
        return <ActivityLogsView />;
      case 'laporan':
      case 'laporan_cetak':
        return <ReportsExportView />;
      case 'pengguna':
        return <UsersView />;
      case 'pengaturan':
      case 'edit_profil_lembaga':
        return <SchoolProfileView />;

      default:
        if (currentRole === 'murid') return <StudentPortalView />;
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification Layer */}
      <ToastContainer />

      {/* Universal Search Modal */}
      <GlobalSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />

      {/* Role-based Dynamic Sidebar */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation Bar with Quick Role Switcher */}
        <Header onToggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)} />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto pb-12">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
