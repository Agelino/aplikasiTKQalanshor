import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  GraduationCap,
  School,
  CalendarRange,
  BookOpen,
  ClipboardList,
  FileText,
  UserPlus,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  UserCheck,
  CalendarDays,
  MessageSquare,
  Video,
  Radio,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    teachers,
    students,
    classes,
    academicYear,
    activeCurriculum,
    rppmList,
    rpphList,
    attendanceList,
    assessmentList,
    reportCards,
    activityLogs,
    setActiveTab,
    currentRole,
    currentTeacher,
    currentRombel,
    currentClass,
    accessibleStudents,
    calendarEvents,
    rombelMeetings,
  } = useApp();

  const activeSemester = academicYear.semesters.find(s => s.status === 'Aktif')?.name || 'Semester 1';

  // --- GURU SPECIFIC METRICS & VIEW ---
  if (currentRole === 'guru') {
    const rombelStudents = accessibleStudents;
    const rombelStudentIds = new Set(rombelStudents.map(s => s.id));

    // Attendance stats for teacher's rombel
    const rombelAttendance = attendanceList.filter(a => rombelStudentIds.has(a.studentId));
    const hadirRombel = rombelAttendance.filter(a => a.status === 'Hadir').length;
    const sakitRombel = rombelAttendance.filter(a => a.status === 'Sakit').length;
    const izinRombel = rombelAttendance.filter(a => a.status === 'Izin').length;
    const alpaRombel = rombelAttendance.filter(a => a.status === 'Alpa').length;
    const totalAttRombel = hadirRombel + sakitRombel + izinRombel + alpaRombel || 1;
    const hadirRombelPct = Math.round((hadirRombel / totalAttRombel) * 100);

    // Assessments for teacher's rombel
    const rombelAssessments = assessmentList.filter(a => rombelStudentIds.has(a.studentId));
    const rombelReports = reportCards.filter(r => rombelStudentIds.has(r.studentId));

    const boysCount = rombelStudents.filter(s => s.gender === 'L').length;
    const girlsCount = rombelStudents.filter(s => s.gender === 'P').length;

    return (
      <div className="space-y-6">
        {/* Welcome Banner for Teacher */}
        <div className="surface-card p-6 border-l-4 border-l-[#059669] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#059669] text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Portal Guru & Wali Rombel</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#172B45]">
              Selamat Datang, {currentTeacher?.name || 'Ibu Guru'}!
            </h2>
            <p className="text-xs md:text-sm text-[#64748B] mt-1">
              Wali <span className="font-semibold text-[#172B45]">{currentRombel?.fullName || 'Rombel'}</span> ({currentClass?.name || 'Kelas'}) · Tahun Ajaran <span className="font-semibold text-[#172B45]">{academicYear.name}</span> · {activeSemester}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('forum_rombel')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Forum & Rapat Rombel</span>
              {rombelMeetings.some(m => m.status === 'live') && (
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('absensi')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white text-emerald-900 font-bold text-xs shadow-md hover:bg-emerald-50 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Catat Absensi Rombel</span>
            </button>
            <button
              onClick={() => setActiveTab('penilaian')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <ClipboardList className="w-4 h-4" />
              <span>Observasi Harian</span>
            </button>
          </div>
        </div>

        {/* Isolation Info Alert */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-xs text-emerald-900 shadow-2xs">
          <School className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold text-emerald-950">
              Hak Akses Terisolasi: Rombel {currentRombel?.fullName} ({currentRombel?.className})
            </p>
            <p className="text-emerald-800 leading-relaxed">
              Anda sedang mengelola data <b>{rombelStudents.length} santri</b> pada rombel ini. Sesuai arsitektur sistem, data presensi, catatan observasi, perencanaan kelas, dan rapor murid di rombel lain dikelola secara mandiri oleh guru wali dari rombel masing-masing.
            </p>
          </div>
        </div>

        {/* 4 Key Metric Cards for the Teacher */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => setActiveTab('murid_saya')}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Santri Rombel Anda</span>
              <GraduationCap className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{rombelStudents.length} <span className="text-sm font-normal text-slate-500">Santri</span></p>
            <p className="text-[11px] text-emerald-600 mt-1 font-medium">
              {boysCount} Laki-laki · {girlsCount} Perempuan
            </p>
          </div>

          <div
            onClick={() => setActiveTab('absensi')}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Kehadiran Rombel</span>
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
            </div>
            <p className="text-2xl font-bold text-teal-700">{hadirRombelPct}% <span className="text-sm font-normal text-slate-500">Hadir</span></p>
            <p className="text-[11px] text-slate-500 mt-1">
              Sakit: {sakitRombel} · Izin: {izinRombel} · Alpa: {alpaRombel}
            </p>
          </div>

          <div
            onClick={() => setActiveTab('penilaian')}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Observasi Harian</span>
              <ClipboardList className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{rombelAssessments.length} <span className="text-sm font-normal text-slate-500">Catatan</span></p>
            <p className="text-[11px] text-indigo-600 mt-1 font-medium">Terhubung ke 6 Aspek</p>
          </div>

          <div
            onClick={() => setActiveTab('input_rapor')}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Leger Rapor Terisi</span>
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{rombelReports.length} / {rombelStudents.length}</p>
            <p className="text-[11px] text-amber-600 mt-1 font-medium">Format Kurikulum Aktif</p>
          </div>
        </div>

        {/* Quick Actions Shortcuts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setActiveTab('absensi')}
            className="p-3 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-left transition-all shadow-2xs group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-900 leading-tight">Presensi Rombel</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Input kehadiran</p>
          </button>

          <button
            onClick={() => setActiveTab('penilaian')}
            className="p-3 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-left transition-all shadow-2xs group"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <ClipboardList className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-900 leading-tight">Penilaian Harian</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Observasi 6 aspek</p>
          </button>

          <button
            onClick={() => setActiveTab('input_rapor')}
            className="p-3 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-left transition-all shadow-2xs group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-900 leading-tight">Input Nilai Rapor</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Leger nilai bintang</p>
          </button>

          <button
            onClick={() => setActiveTab('rpph')}
            className="p-3 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-left transition-all shadow-2xs group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-900 leading-tight">RPPH Harian</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Rencana belajar</p>
          </button>

          <button
            onClick={() => setActiveTab('rekap_penilaian')}
            className="p-3 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-left transition-all shadow-2xs group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-900 leading-tight">Rekapitulasi</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Matriks capaian</p>
          </button>

          <button
            onClick={() => setActiveTab('rapor')}
            className="p-3 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-left transition-all shadow-2xs group"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-900 leading-tight">Pratinjau Rapor</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Cetak & tanda tangan</p>
          </button>
        </div>

        {/* Student Roster Table for Teacher's Rombel */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Daftar Santri Rombel {currentRombel?.fullName}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {rombelStudents.length} santri terdaftar aktif di bawah bimbingan {currentTeacher?.name}
              </p>
            </div>

            <button
              onClick={() => setActiveTab('murid_saya')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Kelola Seluruh Murid Rombel</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="p-3 text-center w-10">No</th>
                  <th className="p-3">Nama Santri</th>
                  <th className="p-3 text-center">L/P</th>
                  <th className="p-3">NIS / NISN</th>
                  <th className="p-3">Kontak Wali</th>
                  <th className="p-3 text-center">Status Presensi</th>
                  <th className="p-3 text-center">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rombelStudents.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-semibold text-slate-900">
                      <div>{s.name}</div>
                      <span className="text-[10px] text-slate-400 font-normal">Panggilan: {s.nickname || '-'}</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.gender === 'L' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
                      }`}>
                        {s.gender === 'L' ? 'L' : 'P'}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-600">{s.nis} / {s.nisn || '-'}</td>
                    <td className="p-3 text-slate-600">{s.guardianPhone || '-'}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Aktif / Hadir
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setActiveTab('penilaian')}
                          className="px-2 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-[10px] font-bold transition-colors"
                          title="Input Nilai Harian"
                        >
                          Nilai
                        </button>
                        <button
                          onClick={() => setActiveTab('rapor')}
                          className="px-2 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10px] font-bold transition-colors"
                          title="Buka Rapor"
                        >
                          Rapor
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // --- ADMIN / TU DASHBOARD METRICS ---

  // Metrics calculation
  const totalGuru = teachers.length;
  const totalMurid = students.length;
  const totalKelas = classes.length;
  const totalRppm = rppmList.length;
  const totalRpph = rpphList.length;

  // Class distribution
  const studentsInClassA = students.filter(s => s.classId === 'kelas-a').length;
  const studentsInClassB = students.filter(s => s.classId === 'kelas-b').length;

  // Attendance stats (from current attendance list)
  const hadirCount = attendanceList.filter(a => a.status === 'Hadir').length;
  const izinCount = attendanceList.filter(a => a.status === 'Izin').length;
  const sakitCount = attendanceList.filter(a => a.status === 'Sakit').length;
  const alpaCount = attendanceList.filter(a => a.status === 'Alpa').length;
  const totalAttendance = hadirCount + izinCount + sakitCount + alpaCount || 1;

  const hadirPct = Math.round((hadirCount / totalAttendance) * 100);
  const izinPct = Math.round((izinCount / totalAttendance) * 100);
  const sakitPct = Math.round((sakitCount / totalAttendance) * 100);
  const alpaPct = Math.round((alpaCount / totalAttendance) * 100);

  // Assessment score distribution
  const bbCount = assessmentList.filter(a => a.score === 'BB').length;
  const mbCount = assessmentList.filter(a => a.score === 'MB').length;
  const bshCount = assessmentList.filter(a => a.score === 'BSH').length;
  const bsbCount = assessmentList.filter(a => a.score === 'BSB').length;
  const totalScores = bbCount + mbCount + bshCount + bsbCount || 1;

  const bbPct = Math.round((bbCount / totalScores) * 100);
  const mbPct = Math.round((mbCount / totalScores) * 100);
  const bshPct = Math.round((bshCount / totalScores) * 100);
  const bsbPct = Math.round((bsbCount / totalScores) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="surface-card p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#059669] text-[11px] font-semibold tracking-wide mb-1.5">
            <Sparkles className="w-4 h-4" />
            Dashboard Administrasi & Tata Usaha
          </div>
          <h2 className="text-xl md:text-[22px] font-semibold tracking-tight text-[#172B45]">
            Selamat Datang di TKQ Pro
          </h2>
          <p className="text-xs md:text-sm text-[#64748B] mt-1 max-w-xl">
            Tahun Ajaran <span className="font-semibold text-[#172B45]">{academicYear.name}</span> · {activeSemester} Aktif · Kurikulum Terpadu Merdeka & TKQ.
          </p>
        </div>

        {/* Quick Shortcut to Curriculum Builder */}
        <button
          onClick={() => setActiveTab('curriculum_builder')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#172B45] font-semibold text-xs border border-[#E2E8F0] hover:border-[#059669]/40 hover:bg-[#ECFDF5] transition-colors shrink-0"
        >
          <BookOpen className="w-4 h-4 text-emerald-700" />
          <span>Curriculum Builder</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
        </button>
      </div>

      {/* 4 KPI utama (design.md: satu gaya visual, angka paling menonjol) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('murid')}
          className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:border-[#059669]/40 transition-colors cursor-pointer"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-[13px] font-medium text-[#64748B]">Total Murid</p>
            <span className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-3 text-[28px] leading-none font-semibold text-[#172B45] tabular-nums">{totalMurid}</p>
          <p className="mt-2 text-xs text-[#64748B]">Peserta didik terdaftar</p>
        </div>

        <div
          onClick={() => setActiveTab('guru')}
          className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:border-[#059669]/40 transition-colors cursor-pointer"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-[13px] font-medium text-[#64748B]">Total Guru</p>
            <span className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-3 text-[28px] leading-none font-semibold text-[#172B45] tabular-nums">{totalGuru}</p>
          <p className="mt-2 text-xs text-[#64748B]">Pendidik & tenaga pengajar</p>
        </div>

        <div
          onClick={() => setActiveTab('kelas')}
          className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:border-[#059669]/40 transition-colors cursor-pointer"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-[13px] font-medium text-[#64748B]">Total Kelas</p>
            <span className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
              <School className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-3 text-[28px] leading-none font-semibold text-[#172B45] tabular-nums">{totalKelas}</p>
          <p className="mt-2 text-xs text-[#64748B]">Rombongan belajar aktif</p>
        </div>

        <div
          onClick={() => setActiveTab('kalender')}
          className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:border-[#059669]/40 transition-colors cursor-pointer"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-[13px] font-medium text-[#64748B]">Kegiatan Aktif</p>
            <span className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
              <CalendarDays className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-3 text-[28px] leading-none font-semibold text-[#172B45] tabular-nums">
            {calendarEvents.filter(event => event.type !== 'holiday').length}
          </p>
          <p className="mt-2 text-xs text-[#64748B]">Agenda akademik terjadwal</p>
        </div>
      </div>

      {/* Ringkasan Akademik: data real, satu panel tanpa kartu berwarna */}
      <div className="surface-card px-5 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
          <p className="text-[11px] font-semibold tracking-wide text-[#94A3B8] shrink-0">
            Ringkasan Akademik
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-2 flex-1">
            {[
              { label: 'RPPM tersusun', value: totalRppm },
              { label: 'RPPH tersusun', value: totalRpph },
              { label: 'Kehadiran', value: `${hadirPct}%` },
              { label: 'Asesmen tercatat', value: assessmentList.length },
              { label: 'Capaian BSB', value: `${bsbPct}%` },
              { label: 'Komponen kurikulum', value: activeCurriculum.components.length },
            ].map(item => (
              <div key={item.label} className="flex items-baseline gap-2 min-w-0">
                <span className="text-base font-semibold text-[#172B45] tabular-nums">{item.value}</span>
                <span className="text-xs text-[#64748B] truncate">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions (maks 4, satu gaya visual) */}
      <div className="surface-card p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[#172B45]">Aksi Cepat</h3>
          <p className="text-xs text-[#64748B] mt-0.5">Tugas administrasi yang paling sering digunakan</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'murid', label: 'Tambah Murid', icon: <UserPlus className="w-4 h-4" /> },
            { id: 'kelas', label: 'Kelola Kelas', icon: <School className="w-4 h-4" /> },
            { id: 'rpph', label: 'Susun RPPH', icon: <FileText className="w-4 h-4" /> },
            { id: 'kalender', label: 'Kalender Akademik', icon: <CalendarDays className="w-4 h-4" /> },
          ].map(action => (
            <button
              key={action.id}
              onClick={() => setActiveTab(action.id)}
              className="flex items-center gap-2.5 px-3.5 min-h-10 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[13px] font-medium text-[#172B45] text-left hover:border-[#059669]/40 hover:bg-[#ECFDF5] transition-colors"
            >
              <span className="text-[#059669] shrink-0">{action.icon}</span>
              <span className="truncate">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2 grafik utama (design.md §6.3) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Jumlah Murid Berdasarkan Kelas */}
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-900">Grafik Jumlah Murid</h3>
              <School className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 mb-4">Distribusi peserta didik menurut kelompok usia</p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Kelompok A (4-5 Tahun)</span>
                  <span className="tabular-nums font-bold text-slate-900">{studentsInClassA} Murid ({Math.round((studentsInClassA/totalMurid)*100)}%)</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${(studentsInClassA / totalMurid) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Wali Kelas: Dewi Lestari, S.Pd · Kapasitas: 20</p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Kelompok B (5-6 Tahun)</span>
                  <span className="tabular-nums font-bold text-slate-900">{studentsInClassB} Murid ({Math.round((studentsInClassB/totalMurid)*100)}%)</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-600 rounded-full transition-all duration-500"
                    style={{ width: `${(studentsInClassB / totalMurid) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Wali Kelas: Siti Nurhaliza, S.Pd · Kapasitas: 20</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Kapasitas: 40 Murid</span>
            <span className="font-semibold text-emerald-700">{totalMurid} Terisi ({Math.round((totalMurid/40)*100)}%)</span>
          </div>
        </div>

        {/* Chart 2: Grafik Kehadiran */}
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-900">Grafik Kehadiran</h3>
              <CheckCircle2 className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 mb-4">Rekapitulasi presensi harian siswa bulan ini</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-xs font-medium text-emerald-800">🟢 Hadir</span>
                <p className="text-lg font-bold text-emerald-950 tabular-nums mt-0.5">{hadirCount} <span className="text-xs font-normal text-emerald-700">({hadirPct}%)</span></p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100">
                <span className="text-xs font-medium text-amber-800">🟡 Izin</span>
                <p className="text-lg font-bold text-amber-950 tabular-nums mt-0.5">{izinCount} <span className="text-xs font-normal text-amber-700">({izinPct}%)</span></p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                <span className="text-xs font-medium text-blue-800">🔵 Sakit</span>
                <p className="text-lg font-bold text-blue-950 tabular-nums mt-0.5">{sakitCount} <span className="text-xs font-normal text-blue-700">({sakitPct}%)</span></p>
              </div>
              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100">
                <span className="text-xs font-medium text-rose-800">🔴 Alpa</span>
                <p className="text-lg font-bold text-rose-950 tabular-nums mt-0.5">{alpaCount} <span className="text-xs font-normal text-rose-700">({alpaPct}%)</span></p>
              </div>
            </div>

            {/* Combined stacked bar */}
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div style={{ width: `${hadirPct}%` }} className="bg-emerald-500 h-full" title={`Hadir: ${hadirPct}%`} />
              <div style={{ width: `${izinPct}%` }} className="bg-amber-400 h-full" title={`Izin: ${izinPct}%`} />
              <div style={{ width: `${sakitPct}%` }} className="bg-sky-500 h-full" title={`Sakit: ${sakitPct}%`} />
              <div style={{ width: `${alpaPct}%` }} className="bg-rose-500 h-full" title={`Alpa: ${alpaPct}%`} />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Tingkat Kehadiran:</span>
            <span className="font-bold text-emerald-600">{hadirPct}% (Sangat Baik)</span>
          </div>
        </div>
      </div>

      {/* Synchronized Kalender Akademik Section */}
      <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Kalender Akademik Lembaga</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  Tersinkronisasi Real-time
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Kegiatan belajar mengajar, libur resmi, evaluasi sumatif, dan jadwal rapat online wali murid.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('kalender')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Buka Kalender Akademik Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {calendarEvents.slice(0, 4).map(event => (
            <div
              key={event.id}
              onClick={() => setActiveTab('kalender')}
              className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-teal-50/50 hover:border-teal-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[11px] font-mono font-bold text-slate-500">{event.date}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    event.type === 'holiday'
                      ? 'bg-rose-100 text-rose-800'
                      : event.type === 'report_distribution'
                      ? 'bg-amber-100 text-amber-800'
                      : event.type === 'effective'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-teal-100 text-teal-800'
                  }`}>
                    {event.type === 'holiday' ? 'Libur' : event.type === 'report_distribution' ? 'Rapor' : event.type === 'effective' ? 'Efektif' : 'Kegiatan'}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-teal-900 transition-colors">
                  {event.title}
                </h4>
                {event.description && (
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Aktivitas Terbaru Sistem</h3>
          </div>
          <button
            onClick={() => setActiveTab('activity_log')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            Lihat Semua Log
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {activityLogs.slice(0, 5).map(log => (
            <div key={log.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0">
                  {log.userName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {log.userName} · <span className="font-normal text-slate-600">{log.activity}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Modul: <span className="font-medium text-slate-600">{log.module}</span>
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 shrink-0 font-medium">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
