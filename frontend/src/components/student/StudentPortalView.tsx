import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  Heart,
  FileText,
  Bell,
  ArrowRight,
  TrendingUp,
  UserCheck,
  ShieldCheck,
  GraduationCap,
  HeartHandshake,
  Video,
  Radio,
  CalendarDays,
  MessageSquare,
} from 'lucide-react';

export const StudentPortalView: React.FC = () => {
  const {
    students,
    currentUser,
    currentStudent,
    switchStudent,
    setActiveTab,
    announcements,
    attendanceList,
    assessmentList,
    reportCards,
    teacherNotes,
    calendarEvents,
    rombelMeetings,
  } = useApp();

  const student = currentStudent || students.find(s => s.id === currentUser?.studentId) || students[0];

  // Dynamic calculations for this student
  const studentAttendance = attendanceList.filter(a => a.studentId === student?.id);
  const hadirCount = studentAttendance.filter(a => a.status === 'Hadir').length;
  const totalDays = studentAttendance.length || 1;
  const attendanceRate = Math.round((hadirCount / totalDays) * 100);

  const studentAssessments = assessmentList.filter(a => a.studentId === student?.id);
  const latestAssessment = studentAssessments[studentAssessments.length - 1];
  const dominantScore = latestAssessment?.score || 'BSB';

  const studentReport = reportCards.find(r => r.studentId === student?.id);

  // Teacher notes calculations for this student
  const studentNotes = teacherNotes.filter(n => n.studentId === student?.id);
  const unreadNotes = studentNotes.filter(n => !n.isReadByParent);
  const latestNote = studentNotes[0];

  // Active meeting for student's rombel
  const studentRombelMeeting = rombelMeetings.find(
    m => m.rombelId === (student?.rombelId || 'rombel-al-quddus')
  );
  const isLiveMeetingNow = studentRombelMeeting?.status === 'live';

  // Check today's attendance status
  const todayRecord = studentAttendance.find(a => a.date === '2026-09-23' || a.date === '2026-09-24');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-semibold border border-emerald-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Portal Informasi Wali Murid & Ananda
              </span>
              {students.length > 1 && (
                <div className="inline-flex items-center gap-1.5 bg-black/25 px-2.5 py-1 rounded-full border border-white/15 text-xs">
                  <span className="text-emerald-200 text-[11px]">Ganti Profil:</span>
                  <select
                    value={student?.id}
                    onChange={e => switchStudent(e.target.value)}
                    className="bg-transparent text-white font-bold outline-none cursor-pointer"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id} className="text-slate-900 font-medium">
                        {s.name} ({s.className || 'Kelas'})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">
              Assalamu&apos;alaikum, Ananda {student ? student.name : 'Santri Ceria'}! 👋
            </h1>

            <p className="text-xs md:text-sm text-emerald-100/90 max-w-xl leading-relaxed">
              Santri <span className="font-bold text-white">{student?.rombelName || 'Rombel'}</span> ({student?.className || 'Kelas'}) · NIS: <span className="font-mono font-semibold text-white">{student?.nis || '-'}</span> · Wali: <span className="font-semibold text-white">{student?.rombelTeacherName || 'Dewan Guru'}</span>.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={() => setActiveTab('kehadiran_anak')}
                className="px-4 py-2 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pengajuan Izin & Sakit</span>
              </button>
              <button
                onClick={() => setActiveTab('rapat_online')}
                className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs backdrop-blur-md transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Video className="w-3.5 h-3.5 text-emerald-300" />
                <span>Rapat Online Rombel</span>
              </button>
              <button
                onClick={() => setActiveTab('forum_rombel')}
                className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs backdrop-blur-md transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-teal-300" />
                <span>Forum Diskusi</span>
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0 w-full md:w-auto">
            <span className="text-[10px] text-emerald-200 uppercase font-semibold block">Status Kehadiran Hari Ini</span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className={`w-3 h-3 rounded-full ${todayRecord?.status === 'Izin' || todayRecord?.status === 'Sakit' ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`} />
              <span className="text-base font-bold text-white">
                {todayRecord ? (todayRecord.status === 'Hadir' ? 'Hadir di Sekolah' : `Status: ${todayRecord.status}`) : 'Hadir di Sekolah'}
              </span>
            </div>
            <span className="text-[11px] text-emerald-200/90 font-mono mt-0.5 block">Jam Masuk KBM: 07.25 WIB</span>
          </div>
        </div>
      </div>

      {/* Alert Banner for Teacher Personal Notes */}
      {unreadNotes.length > 0 && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/10 border-2 border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs animate-bounce">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  Pemberitahuan Khusus dari Guru Kelas Ananda
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold animate-pulse">
                  {unreadNotes.length} Catatan Baru
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-0.5">
                Perihal: &quot;<strong>{unreadNotes[0].title}</strong>&quot; ({unreadNotes[0].date}) — Guru telah mengirimkan catatan personal & rekomendasi untuk orang tua.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('catatan_guru_anak')}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer hover:scale-105"
          >
            <span>Buka & Balas Catatan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Rombel Online Meeting Banner (Join Only for Student) */}
      {studentRombelMeeting && (
        <div className={`p-4 rounded-3xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in transition-all ${
          isLiveMeetingNow
            ? 'bg-gradient-to-r from-rose-500/15 via-red-500/10 to-rose-500/15 border-rose-400'
            : 'bg-gradient-to-r from-teal-500/15 via-emerald-500/10 to-teal-500/15 border-teal-300'
        }`}>
          <div className="flex items-start sm:items-center gap-3.5">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shrink-0 shadow-xs ${
              isLiveMeetingNow ? 'bg-rose-600 text-white animate-pulse' : 'bg-teal-700 text-white'
            }`}>
              {isLiveMeetingNow ? <Radio className="w-6 h-6 animate-pulse" /> : <Video className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  {isLiveMeetingNow ? 'Rapat Online Rombel Sedang Live' : 'Jadwal Rapat Online Rombel'}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-white text-[10px] font-extrabold ${
                  isLiveMeetingNow ? 'bg-rose-600 animate-pulse' : 'bg-teal-700'
                }`}>
                  {isLiveMeetingNow ? 'LIVE SEKARANG' : `${studentRombelMeeting.date}`}
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-0.5">
                &quot;<strong>{studentRombelMeeting.title}</strong>&quot; — Waktu: {studentRombelMeeting.time}. Diselenggarakan oleh Admin Sekolah.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('rapat_online')}
              className={`px-4 py-2 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-105 ${
                isLiveMeetingNow
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-teal-700 hover:bg-teal-800 text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>{isLiveMeetingNow ? 'Gabung Rapat Sekarang' : 'Lihat Ruang Rapat'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Metric Quick Stats Scoped to Student */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div
          onClick={() => setActiveTab('portal_presensi')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-500 font-medium block">Tingkat Kehadiran</span>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{attendanceRate}%</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
            <span>{hadirCount} dari {totalDays} hari</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => setActiveTab('catatan_guru_anak')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group relative overflow-hidden"
        >
          {unreadNotes.length > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
          )}
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-500 font-medium block">Catatan Guru</span>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{studentNotes.length} Catatan</p>
          <span className="text-[10px] text-rose-700 font-semibold flex items-center gap-0.5 mt-1">
            <span>{unreadNotes.length > 0 ? `${unreadNotes.length} Belum Dibaca` : 'Telah Ditinjau'}</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => setActiveTab('perkembangan')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-500 font-medium block">Hafalan Juz 30</span>
          <p className="text-xl font-bold text-slate-900 mt-0.5">
            {studentReport?.quranReport?.tahfidzSurah?.[0]?.predikat || 'Mumtaz'}
          </p>
          <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-0.5 mt-1">
            <span>
              {studentReport?.quranReport?.tahfidzSurah?.map(s => s.surahName).slice(0, 2).join(', ') || 'An-Nas s/d Al-Lahab'}
            </span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => setActiveTab('portal_penilaian')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-500 font-medium block">Capaian Terkini</span>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{dominantScore}</p>
          <span className="text-[10px] text-teal-700 font-semibold flex items-center gap-0.5 mt-1">
            <span>{studentAssessments.length} Catatan Observasi</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => setActiveTab('portal_rapor')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-500 font-medium block">Buku Rapor</span>
          <p className="text-xl font-bold text-slate-900 mt-0.5">
            {studentReport?.semester || 'Sem. 1'}
          </p>
          <span className="text-[10px] text-purple-700 font-semibold flex items-center gap-0.5 mt-1">
            <span>{studentReport ? 'Telah Divalidasi' : 'Draf Siap'}</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Islamic Milestones & Announcements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Islamic Milestones */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">
                Pencapaian Karakter Qurani Ananda ({student?.name})
              </h3>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/70 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                📖
              </div>
              <div className="min-w-0">
                <span className="font-bold text-slate-900 block">Target Tahfidz Semester Ini:</span>
                <p className="text-slate-600 mt-0.5">
                  {studentReport?.quranReport?.tahfidzSurah?.map(s => s.surahName).join(', ') || 'Hafalan Surat An-Nas, Al-Falaq, Al-Ikhlas, dan Al-Lahab dengan tajwid dasar dan makhraj fasih.'}
                </p>
                <span className="inline-block mt-1 font-semibold text-emerald-700 text-[11px]">
                  Predikat: {studentReport?.quranReport?.tahfidzSurah?.[0]?.predikat || 'Mumtaz'} (Sangat Baik)
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-200/70 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold shrink-0">
                🤲
              </div>
              <div className="min-w-0">
                <span className="font-bold text-slate-900 block">Doa Harian & Adab:</span>
                <p className="text-slate-600 mt-0.5">
                  {studentReport?.quranReport?.doaHarian?.map(d => d.doaName).join(', ') || 'Doa sebelum & sesudah makan, doa kedua orang tua, doa kebaikan dunia akhirat.'}
                </p>
                <span className="inline-block mt-1 font-semibold text-emerald-700 text-[11px]">
                  Predikat: {studentReport?.quranReport?.doaHarian?.[0]?.predikat || 'Mumtaz'} (Membudaya Mandiri)
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200/70 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0">
                🕌
              </div>
              <div className="min-w-0">
                <span className="font-bold text-slate-900 block">Praktik Shalat & Wudhu:</span>
                <p className="text-slate-600 mt-0.5">
                  {studentReport?.quranReport?.praktikIbadah?.map(i => `${i.materi} (${i.keterangan})`).join(', ') || 'Wudhu tertib 6 rukun, gerakan shalat Dhuha berjamaah 2 rakaat di musholla.'}
                </p>
                <span className="inline-block mt-1 font-semibold text-emerald-700 text-[11px]">
                  Predikat: {studentReport?.quranReport?.praktikIbadah?.[0]?.predikat || 'Jayyid Jiddan'} (Sangat Tertib)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* School Announcements for Parents */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Pengumuman Sekolah untuk Wali Murid
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {announcements.map(ann => (
              <div
                key={ann.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-emerald-100 text-emerald-800">
                    {ann.targetRole}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{ann.date}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">{ann.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Synchronized Kalender Akademik Widget for Parents */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Kalender Akademik & Jadwal Kegiatan Terdekat
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              Sinkron Real-time
            </span>
          </div>
          <button
            onClick={() => setActiveTab('kalender')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Buka Kalender Akademik Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {calendarEvents.slice(0, 4).map(event => (
            <div
              key={event.id}
              onClick={() => setActiveTab('kalender')}
              className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-teal-50/40 hover:border-teal-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-500">{event.date}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                    event.type === 'holiday' ? 'bg-rose-100 text-rose-800' : event.type === 'report_distribution' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'
                  }`}>
                    {event.type === 'holiday' ? 'Libur' : event.type === 'report_distribution' ? 'Rapor' : 'Kegiatan'}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-teal-800 transition-colors">{event.title}</h4>
                {event.description && (
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{event.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
