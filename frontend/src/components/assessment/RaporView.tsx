import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  Printer,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Calendar,
  Activity,
  Heart,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Star,
} from 'lucide-react';
import { PredikatQuran, AssessmentScore } from '../../types';
import {
  StarDisplay,
  predikatQuranToStars,
  merdekaScoreToStars,
} from '../common/StarRating';

export const RaporView: React.FC = () => {
  const {
    students,
    reportCards,
    currentUser,
    currentStudent,
    setActiveTab,
    currentRole,
    currentTeacher,
    currentRombel,
    accessibleStudents,
    schoolProfile,
  } = useApp();

  // Filter students based on role
  const availableStudents = React.useMemo(() => {
    if (currentRole === 'guru') {
      return accessibleStudents;
    }
    if (currentRole === 'murid') {
      const target = currentStudent || students.find(s => s.id === currentUser?.studentId) || students[0];
      return target ? [target] : [];
    }
    return students;
  }, [currentRole, accessibleStudents, students, currentUser, currentStudent]);

  // Pick default student
  const defaultStudentId =
    currentRole === 'murid'
      ? (currentStudent?.id || currentUser?.studentId || availableStudents[0]?.id || '')
      : (availableStudents.find(s => s.id === 'murid-callista')?.id || availableStudents[0]?.id || '');

  const [selectedStudentId, setSelectedStudentId] = useState<string>(defaultStudentId);
  const student = availableStudents.find(s => s.id === selectedStudentId) || availableStudents[0] || students[0];

  // Retrieve current student's report card from store
  const report =
    reportCards.find(r => r.studentId === student?.id) ||
    reportCards.find(r => r.studentId === 'murid-callista') ||
    reportCards[0];

  const quran = report?.quranReport;
  const merdeka = report?.merdekaReport;
  const p5 = report?.p5Report;
  const ddtk = report?.ddtkReport;
  const att = report?.attendance || { hadir: 58, sakit: 1, izin: 1, alpa: 0 };

  const predikatBadgeColor = (p?: PredikatQuran) => {
    switch (p) {
      case 'Mumtaz':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Jayyid Jiddan':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Jayyid':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Maqbul':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const merdekaScoreBadge = (score?: AssessmentScore) => {
    switch (score) {
      case 'BSB':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'BSH':
        return 'bg-teal-50 text-teal-800 border-teal-300';
      case 'MB':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'BB':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-300';
    }
  };

  const merdekaScoreLabel = (score?: AssessmentScore) => {
    switch (score) {
      case 'BSB':
        return 'Berkembang Sangat Baik (BSB)';
      case 'BSH':
        return 'Berkembang Sesuai Harapan (BSH)';
      case 'MB':
        return 'Mulai Berkembang (MB)';
      case 'BB':
        return 'Belum Berkembang (BB)';
      default:
        return score || 'Berkembang Baik';
    }
  };

  // Compute stars for Tilawah, Tahfidz, Hikmah
  const tilawahStars = quran?.tilawatiStars || predikatQuranToStars(quran?.tilawatiPredikat);
  const tahfidzStars = quran?.tahfidzStars || 3;
  const hikmahStars = quran?.hikmahStars || 3;
  const overallStars = report?.overallRatingStars || 4;

  return (
    <div className="space-y-6">
      {/* Action Header (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Buku Laporan Capaian Pembelajaran (Rapor)
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                TKQ Al-Anshor Resmi
              </span>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                <span>Rating Bintang Aktif</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Format terpadu Bustanul Qur'an & Kurikulum Merdeka PAUD dengan rating bintang pencapaian (★ - ★★★★)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Student Selector */}
          {currentRole === 'murid' ? (
            <div className="px-3.5 py-2 text-xs bg-emerald-50 border border-emerald-200 rounded-xl font-bold text-emerald-900 flex items-center gap-1.5">
              <span>Santri:</span>
              <span className="font-extrabold">{student?.name}</span>
              <span className="text-[10px] text-emerald-700">({student?.rombelName || student?.className})</span>
            </div>
          ) : (
            <select
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 hover:bg-white focus:bg-white focus:border-emerald-500"
            >
              {availableStudents.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.rombelName || s.className})
                </option>
              ))}
            </select>
          )}

          {/* Quick link to input grading for teachers/admin */}
          {currentRole !== 'murid' && (
            <button
              onClick={() => setActiveTab('input_rapor')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 transition-all"
              title="Buka form input penilaian rapor & rating bintang"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Input Nilai & Bintang</span>
            </button>
          )}

          {/* Print Button */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rapor Resmi (PDF)</span>
          </button>
        </div>
      </div>

      {/* Printable Report Card Document Sheet */}
      {student && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-8 sm:p-10 max-w-4xl mx-auto space-y-6 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none text-slate-900 leading-normal">
          {/* KOP SURAT FORMAL TKQ AL ANSHOR */}
          <div className="border-b-2 border-slate-900 pb-3 text-center relative">
            <div className="flex items-center justify-between px-2">
              <div className="w-16 h-16 rounded-full border border-emerald-600 flex items-center justify-center text-emerald-700 font-black text-2xl print:border-slate-800">
                QA
              </div>
              <div className="flex-1 px-4">
                <p className="text-[11px] font-bold tracking-widest text-slate-600 uppercase">
                  LEMBAGA PEMBINAAN PENDIDIKAN AL-QUR'AN
                </p>
                <h1 className="text-xl font-black uppercase tracking-wider text-slate-900 sm:text-2xl">
                  TKQ AL ANSHOR
                </h1>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">
                  TAMAN KANAK-KANAK AL-QUR'AN (TKQ) BERBASIS KURIKULUM MERDEKA PAUD
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Jl. Masjid Al-Anshor No. 12, RT 02/RW 03, Gondrong, Cipondoh · NPSN: 69987215 · SK Kemenag RI
                </p>
              </div>
              <div className="w-16 h-16 rounded-full border border-emerald-600 flex items-center justify-center text-emerald-700 font-black text-xs text-center p-1 print:border-slate-800">
                TKQ 2026
              </div>
            </div>

            <div className="mt-3 py-1 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded flex items-center justify-center gap-2">
              <span>LAPORAN CAPAIAN PEMBELAJARAN (RAPOR) PESERTA DIDIK</span>
            </div>
          </div>

          {/* LEGEND SKALA RATING BINTANG & PREDIKAT */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-amber-50/60 border border-amber-200 rounded-xl text-[11px] print:bg-transparent">
            <span className="font-bold text-amber-950 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>SKALA RATING BINTANG PENCAPAIAN:</span>
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1">
                <StarDisplay stars={4} size="xs" />
                <strong className="text-slate-800">★★★★ (BSB / Mumtaz)</strong>
              </span>
              <span className="flex items-center gap-1">
                <StarDisplay stars={3} size="xs" />
                <strong className="text-slate-800">★★★ (BSH / Jayyid Jiddan)</strong>
              </span>
              <span className="flex items-center gap-1">
                <StarDisplay stars={2} size="xs" />
                <strong className="text-slate-800">★★ (MB / Jayyid)</strong>
              </span>
              <span className="flex items-center gap-1">
                <StarDisplay stars={1} size="xs" />
                <strong className="text-slate-800">★ (BB / Maqbul)</strong>
              </span>
            </div>
          </div>

          {/* IDENTITAS SANTRI / PESERTA DIDIK */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs border border-slate-200 rounded-xl p-4 bg-slate-50/50 print:bg-transparent">
            <div className="flex justify-between border-b border-slate-200/60 pb-1">
              <span className="text-slate-500">Nama Peserta Didik:</span>
              <strong className="text-slate-900 font-bold uppercase">{student.name}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-1">
              <span className="text-slate-500">Semester / Tahun Ajaran:</span>
              <strong className="text-slate-900">{report?.semester || 'Semester 1 (Ganjil)'} / {report?.academicYear || '2025/2026'}</strong>
            </div>

            <div className="flex justify-between border-b border-slate-200/60 pb-1">
              <span className="text-slate-500">Nomor Induk Siswa (NIS):</span>
              <strong className="text-slate-900 font-mono">{student.nis}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-1">
              <span className="text-slate-500">Kelompok / Rombongan:</span>
              <strong className="text-slate-900">{report?.className || student.className || 'Kelompok A'}</strong>
            </div>

            <div className="flex justify-between border-b border-slate-200/60 pb-1">
              <span className="text-slate-500">Nomor Induk Siswa Nasional (NISN):</span>
              <strong className="text-slate-900 font-mono">{student.nisn || '3210984421'}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-1">
              <span className="text-slate-500">Fase / Rentang Usia:</span>
              <strong className="text-slate-900">Fase Fondasi (4 - 5 Tahun)</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Tempat, Tanggal Lahir:</span>
              <strong className="text-slate-900">{student.birthPlace}, {student.birthDate}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Rating Umum Santri:</span>
              <div className="flex items-center gap-1.5">
                <StarDisplay stars={overallStars} size="sm" />
                <span className="font-bold text-[10px] text-amber-900 bg-amber-100/80 px-1.5 py-0.2 rounded border border-amber-300">
                  {overallStars} Bintang
                </span>
              </div>
            </div>
          </div>

          {/* BAGIAN I: CAPAIAN PEMBELAJARAN AL-QUR'AN & PENDIDIKAN AGAMA ISLAM (BUSTANUL QUR'AN) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-emerald-800 text-white p-2.5 rounded-lg">
              <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>I. CAPAIAN PEMBELAJARAN AL-QUR'AN & APBQ (BUSTANUL QUR'AN TKQ)</span>
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-700/80 px-2 py-0.5 rounded">
                Khas TKQ Al-Anshor
              </span>
            </div>

            {/* 1. TILAWAH HEADER BLOCK (SESUAI DOKUMEN RAPOR AL ANSHOR) */}
            <div className="border border-slate-200 rounded-xl p-3.5 space-y-2 bg-slate-50/40 print:bg-transparent">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-black text-slate-900 uppercase tracking-wide bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                    TILAWAH
                  </span>
                  <span className="font-bold text-slate-800">
                    Membaca Al-Qur'an (Metode Tilawati)
                  </span>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <span className="text-[10px] font-bold text-amber-900">Rating:</span>
                    <StarDisplay stars={tilawahStars} size="sm" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">
                    Capaian: <strong className="text-emerald-800">{quran?.tilawatiJilid || 'Jilid 1'} ({quran?.tilawatiHalaman || 'Halaman 28'})</strong>
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${predikatBadgeColor(quran?.tilawatiPredikat)}`}>
                    Predikat: {quran?.tilawatiPredikat || 'Jayyid Jiddan'}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed text-justify">
                {quran?.tilawatiCatatan ||
                  'Alhamdulillah ananda mampu membaca huruf-huruf hijaiyah berharakat fathah, kasrah, dan dhammah dengan lancar, fashohah dan makhraj halqiyah & lisaniyah tepat serta bertajwid.'}
              </p>
            </div>

            {/* 2. TAHFIDZ HEADER BLOCK & TABEL SURAH JUZ 'AMMA */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="p-2.5 bg-slate-100 font-bold text-slate-800 flex items-center justify-between border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <span className="font-black text-slate-900 uppercase tracking-wide bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                    TAHFIDZ
                  </span>
                  <span>Hafalan Surah-Surah Pendek (Juz 'Amma)</span>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <span className="text-[10px] font-bold text-amber-900">Rating:</span>
                    <StarDisplay stars={tahfidzStars} size="sm" />
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-normal">Target Semester 1</span>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="p-2.5 text-center w-8">No</th>
                    <th className="p-2.5">Nama Surah Pendek</th>
                    <th className="p-2.5 text-center w-24">Status</th>
                    <th className="p-2.5 text-center w-28">Predikat</th>
                    <th className="p-2.5 text-center w-24">Rating Bintang</th>
                    <th className="p-2.5">Keterangan / Ulasan Makhraj</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(quran?.tahfidzSurah || [
                    { surahName: 'An-Naas', predikat: 'Mumtaz', stars: 4, tuntas: true, catatan: 'Sangat lancar, tartil, fashih' },
                    { surahName: 'Al-Falaq', predikat: 'Mumtaz', stars: 4, tuntas: true, catatan: 'Lancar dan makhorijul huruf tepat' },
                    { surahName: 'Al-Ikhlas', predikat: 'Mumtaz', stars: 4, tuntas: true, catatan: 'Sangat lancar dan tartil' },
                    { surahName: 'Al-Lahab', predikat: 'Jayyid Jiddan', stars: 3, tuntas: true, catatan: 'Lancar bertajwid' },
                    { surahName: 'An-Nashr', predikat: 'Jayyid Jiddan', stars: 3, tuntas: true, catatan: 'Lancar' },
                  ]).map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-2.5 text-center font-mono text-slate-400">{idx + 1}</td>
                      <td className="p-2.5 font-bold text-slate-900">{s.surahName}</td>
                      <td className="p-2.5 text-center">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {s.tuntas ? 'Tuntas' : 'Proses'}
                        </span>
                      </td>
                      <td className="p-2.5 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${predikatBadgeColor(s.predikat)}`}>
                          {s.predikat}
                        </span>
                      </td>
                      <td className="p-2.5 text-center">
                        <StarDisplay stars={s.stars || predikatQuranToStars(s.predikat)} size="xs" />
                      </td>
                      <td className="p-2.5 text-slate-700 text-[11px]">{s.catatan || 'Lancar dan fasih'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 3. HIKMAH HEADER BLOCK & TABEL DOA & HADITS */}
            <div className="border border-slate-200 rounded-xl p-3.5 space-y-3 bg-slate-50/30 print:bg-transparent">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-black text-slate-900 uppercase tracking-wide bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                    HIKMAH
                  </span>
                  <span className="font-bold text-slate-800 text-xs">
                    Hafalan Doa Harian, Hadits Pilihan & Karakter Islami
                  </span>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <span className="text-[10px] font-bold text-amber-900">Rating:</span>
                    <StarDisplay stars={hikmahStars} size="sm" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Doa Harian */}
                <div className="border border-slate-200 rounded-xl p-3 space-y-2 bg-white">
                  <span className="font-bold text-slate-900 block border-b border-slate-100 pb-1">
                    Hafalan Doa Harian
                  </span>
                  <ul className="space-y-1.5 divide-y divide-slate-100">
                    {(quran?.doaHarian || [
                      { doaName: 'Doa Sebelum & Sesudah Makan', predikat: 'Mumtaz', stars: 4 },
                      { doaName: 'Doa Bangun Tidur & Sebelum Tidur', predikat: 'Mumtaz', stars: 4 },
                      { doaName: 'Doa Kedua Orang Tua & Kebaikan Akhirat', predikat: 'Mumtaz', stars: 4 },
                      { doaName: 'Doa Masuk & Keluar Kamar Mandi', predikat: 'Jayyid Jiddan', stars: 3 },
                    ]).map((d, dIdx) => (
                      <li key={dIdx} className="pt-1 flex items-center justify-between gap-1">
                        <span className="text-slate-800">{d.doaName}</span>
                        <div className="flex items-center gap-1.5">
                          <StarDisplay stars={d.stars || predikatQuranToStars(d.predikat)} size="xs" />
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${predikatBadgeColor(d.predikat)}`}>
                            {d.predikat}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hadits Pilihan */}
                <div className="border border-slate-200 rounded-xl p-3 space-y-2 bg-white">
                  <span className="font-bold text-slate-900 block border-b border-slate-100 pb-1">
                    Hafalan Hadits & Karakter Islami
                  </span>
                  <ul className="space-y-1.5 divide-y divide-slate-100">
                    {(quran?.haditsPilihan || [
                      { haditsName: 'Hadits Kasih Sayang (Man Laa Yarham...)', predikat: 'Mumtaz', stars: 4 },
                      { haditsName: 'Hadits Kebersihan (Ath-Thuhuuru...)', predikat: 'Jayyid Jiddan', stars: 3 },
                      { haditsName: 'Hadits Menuntut Ilmu (Tholabul Ilmi...)', predikat: 'Jayyid Jiddan', stars: 3 },
                      { haditsName: 'Hadits Larangan Marah (Laa Taghdhob...)', predikat: 'Jayyid', stars: 2 },
                    ]).map((h, hIdx) => (
                      <li key={hIdx} className="pt-1 flex items-center justify-between gap-1">
                        <span className="text-slate-800 truncate">{h.haditsName}</span>
                        <div className="flex items-center gap-1.5">
                          <StarDisplay stars={h.stars || predikatQuranToStars(h.predikat)} size="xs" />
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${predikatBadgeColor(h.predikat)}`}>
                            {h.predikat}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Praktik Shalat & Wudhu */}
              <div className="border border-slate-200 rounded-xl p-3 space-y-1.5 text-xs bg-white">
                <span className="font-bold text-slate-900 block border-b border-slate-100 pb-1">
                  Praktik Ibadah Shalat, Wudhu & Adab Islami
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-700">
                  {(quran?.praktikIbadah || [
                    { materi: 'Tata Cara Berwudhu', predikat: 'Jayyid Jiddan', stars: 3, keterangan: 'Tertib mempraktikkan rukun wudhu secara berurutan dan rapi.' },
                    { materi: 'Gerakan & Bacaan Shalat', predikat: 'Jayyid Jiddan', stars: 3, keterangan: 'Tertib dalam takbiratul ihram, ruku, sujud, dan salam saat shalat berjamaah.' },
                    { materi: 'Adab Harian Islami', predikat: 'Mumtaz', stars: 4, keterangan: 'Terbiasa bersikap santun, mengucap salam, menggunakan tangan kanan saat makan, dan tertib antri.' },
                  ]).map((ib, idx) => (
                    <div key={idx} className="p-2 bg-slate-50/50 rounded-lg border border-slate-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900 text-[11px]">{ib.materi}</strong>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${predikatBadgeColor(ib.predikat)}`}>
                          {ib.predikat}
                        </span>
                      </div>
                      <div className="py-0.5">
                        <StarDisplay stars={ib.stars || predikatQuranToStars(ib.predikat)} size="xs" />
                      </div>
                      <p className="text-[10.5px] text-slate-600 leading-snug">{ib.keterangan}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BAGIAN II: CAPAIAN PEMBELAJARAN KURIKULUM MERDEKA PAUD (3 ELEMEN UTAMA) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between bg-blue-900 text-white p-2.5 rounded-lg">
              <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>II. CAPAIAN PEMBELAJARAN KURIKULUM MERDEKA PAUD (3 ELEMEN UTAMA)</span>
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-800/80 px-2 py-0.5 rounded">
                Standar PAUD Nasional
              </span>
            </div>

            {/* Elemen 1: Nilai Agama & Budi Pekerti */}
            <div className="border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-1.5">
                <h4 className="font-bold text-slate-900 text-xs">
                  1. Elemen Nilai Agama dan Budi Pekerti
                </h4>
                <div className="flex items-center gap-2">
                  <StarDisplay
                    stars={merdeka?.nilaiAgamaBudiPekerti?.stars || merdekaScoreToStars(merdeka?.nilaiAgamaBudiPekerti?.predikat)}
                    size="sm"
                  />
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${merdekaScoreBadge(merdeka?.nilaiAgamaBudiPekerti?.predikat)}`}>
                    {merdekaScoreLabel(merdeka?.nilaiAgamaBudiPekerti?.predikat)}
                  </span>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed text-justify">
                {merdeka?.nilaiAgamaBudiPekerti?.narasi ||
                  'Alhamdulillah, ananda menunjukkan perkembangan yang sangat baik dalam mengenal dan mempraktikkan nilai-nilai keagamaan. Ananda terbiasa mengucap salam, membaca doa harian, menyayangi teman serta merawat ciptaan Allah SWT. Hafalan surah-surah pendek juz 30 dan doa harian berkembang sangat membanggakan.'}
              </p>
            </div>

            {/* Elemen 2: Jati Diri */}
            <div className="border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-1.5">
                <h4 className="font-bold text-slate-900 text-xs">
                  2. Elemen Jati Diri
                </h4>
                <div className="flex items-center gap-2">
                  <StarDisplay
                    stars={merdeka?.jatiDiri?.stars || merdekaScoreToStars(merdeka?.jatiDiri?.predikat)}
                    size="sm"
                  />
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${merdekaScoreBadge(merdeka?.jatiDiri?.predikat)}`}>
                    {merdekaScoreLabel(merdeka?.jatiDiri?.predikat)}
                  </span>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed text-justify">
                {merdeka?.jatiDiri?.narasi ||
                  'Ananda memiliki kemandirian yang tinggi, rasa percaya diri yang cerah, dan kemampuan mengelola emosi dengan sangat baik. Mampu beradaptasi di lingkungan sekolah, berbagi alat main, dan menunjukkan koordinasi motorik halus maupun kasar yang sangat lincah dalam senam, melipat, menggunting pola, dan meronce.'}
              </p>
            </div>

            {/* Elemen 3: STEAM */}
            <div className="border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-1.5">
                <h4 className="font-bold text-slate-900 text-xs">
                  3. Elemen Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa & Seni (STEAM)
                </h4>
                <div className="flex items-center gap-2">
                  <StarDisplay
                    stars={merdeka?.literasiSteam?.stars || merdekaScoreToStars(merdeka?.literasiSteam?.predikat)}
                    size="sm"
                  />
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${merdekaScoreBadge(merdeka?.literasiSteam?.predikat)}`}>
                    {merdekaScoreLabel(merdeka?.literasiSteam?.predikat)}
                  </span>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed text-justify">
                {merdeka?.literasiSteam?.narasi ||
                  'Kemampuan literasi dan eksplorasi sains matematika ananda berkembang sangat baik. Mampu menceritakan kembali cerita dengan runtut, mengenali simbol huruf hijaiyah dan latin, membilang benda 1-20, serta sangat antusias bereksplorasi dalam sentra seni, kreasi kolase, dan eksperimen sains air.'}
              </p>
            </div>
          </div>

          {/* BAGIAN III: PROJEK PENGUATAN PROFIL PELAJAR PANCASILA (P5) */}
          <div className="border border-amber-200 rounded-xl p-3.5 space-y-2 text-xs bg-amber-50/20 print:bg-transparent">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-amber-200/60 pb-1.5">
              <div>
                <h4 className="font-bold text-amber-950 uppercase tracking-wide text-xs">
                  III. PROJEK PENGUATAN PROFIL PELAJAR PANCASILA (P5) & P2RA
                </h4>
                <p className="text-[11px] text-amber-800">
                  Tema: <strong>{p5?.tema || 'Aku Sayang Bumi (Apotek Hidup & Sahabat Tanaman)'}</strong>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StarDisplay
                  stars={p5?.stars || merdekaScoreToStars(p5?.predikat)}
                  size="sm"
                />
                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${merdekaScoreBadge(p5?.predikat)}`}>
                  {merdekaScoreLabel(p5?.predikat)}
                </span>
              </div>
            </div>
            <p className="text-slate-700 leading-relaxed text-justify">
              {p5?.narasi ||
                'Ananda berpartisipasi aktif dan penuh kegembiraan dalam projek menanam bibit herbal, menyiram tanaman secara bertanggung jawab, serta bekerja sama dengan riang bersama kelompoknya.'}
            </p>
          </div>

          {/* BAGIAN IV & V: DATA FISIK (DDTK) & REKAPITULASI PRESENSI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* DDTK */}
            <div className="border border-slate-200 rounded-xl p-3.5 space-y-2">
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-1 uppercase tracking-wider text-[11px]">
                IV. Pertumbuhan Fisik & Kesehatan (DDTK)
              </h4>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <p>Tinggi Badan: <strong className="text-slate-900">{ddtk?.tinggiBadanCm || 104} cm</strong></p>
                <p>Berat Badan: <strong className="text-slate-900">{ddtk?.beratBadanKg || 16.5} kg</strong></p>
                <p>Lingkar Kepala: <strong className="text-slate-900">{ddtk?.lingkarKepalaCm || 49.0} cm</strong></p>
                <p>Status Gizi: <strong className="text-slate-900">{ddtk?.statusGizi || 'Gizi Baik / Ideal'}</strong></p>
                <p>Kesehatan Gigi: <strong className="text-slate-900">{ddtk?.kesehatanGigi || 'Bersih, Terawat'}</strong></p>
                <p>Penglihatan/Dengar: <strong className="text-slate-900">{ddtk?.penglihatan || 'Normal & Peka'}</strong></p>
              </div>
            </div>

            {/* Presensi */}
            <div className="border border-slate-200 rounded-xl p-3.5 space-y-2">
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-1 uppercase tracking-wider text-[11px]">
                V. Rekapitulasi Ketidakhadiran
              </h4>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl">
                  <span className="text-[10px] text-rose-600 block uppercase font-bold">Sakit</span>
                  <span className="font-black text-rose-900 text-sm">{att.sakit} Hari</span>
                </div>
                <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-xl">
                  <span className="text-[10px] text-amber-600 block uppercase font-bold">Izin</span>
                  <span className="font-black text-amber-900 text-sm">{att.izin} Hari</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Tanpa Ket.</span>
                  <span className="font-black text-slate-800 text-sm">{att.alpa} Hari</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 text-center mt-1">
                Jumlah hari efektif belajar ananda hadir: <strong>{att.hadir || 58} Hari</strong>
              </p>
            </div>
          </div>

          {/* BAGIAN VI: CATATAN GURU & PESAN WALI KELAS */}
          <div className="border border-slate-200 rounded-xl p-3.5 space-y-1.5 text-xs bg-slate-50/50 print:bg-transparent">
            <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[11px]">
              VI. Catatan Guru & Pesan Refleksi Wali Kelas untuk Orang Tua:
            </h4>
            <p className="text-slate-700 leading-relaxed text-justify">
              {report?.teacherNotes ||
                'Ananda Ade Eva Duratul Callista adalah santri yang ceria, santun, cerdas, dan shalihah. Pertahankan semangat belajar Al-Qur\'an dan muroja\'ah di rumah bersama ayah dan bunda tercinta. Semoga tumbuh menjadi generasi Qur\'ani penyejuk hati keluarga. Aamiin.'}
            </p>
            {report?.recommendation && (
              <p className="text-slate-600 text-[11px] italic pt-1 border-t border-slate-200/60">
                Saran stimulasi di rumah: {report.recommendation}
              </p>
            )}
          </div>

          {/* BAGIAN VII: PENGESAHAN TANDA TANGAN RESMI (3 PIHAK) */}
          <div className="pt-6 grid grid-cols-3 text-center text-xs text-slate-800 gap-4 print:pt-4">
            <div>
              <p>Mengetahui,</p>
              <p className="font-bold mt-0.5">Orang Tua / Wali Murid</p>
              <div className="h-16 print:h-14" />
              <p className="border-b border-slate-500 w-36 mx-auto" />
              <p className="text-[10px] text-slate-500 mt-0.5">(Nama Lengkap & Ttd)</p>
            </div>

            <div>
              <p>Mengetahui,</p>
              <p className="font-bold mt-0.5">Kepala {schoolProfile.name}</p>
              <div className="h-16 print:h-14 flex items-center justify-center" />
              <p className="font-bold underline">{schoolProfile.principal || report?.principalSignatureName}</p>
              <p className="text-[10px] text-slate-500 font-mono">NIP: {schoolProfile.principalNip || report?.principalNip || '197608122002122003'}</p>
            </div>

            <div>
              <p>{report?.place || 'Depok'}, {report?.issueDate || '19 Desember 2026'}</p>
              <p className="font-bold mt-0.5">Guru / Wali Rombel</p>
              <div className="h-16 print:h-14 flex items-center justify-center">
                {(currentTeacher?.signatureImage) ? (
                  <img
                    src={currentTeacher.signatureImage}
                    alt="Tanda Tangan Guru"
                    className="h-12 object-contain"
                  />
                ) : (
                  <div className="h-12" />
                )}
              </div>
              <p className="font-bold underline">
                {currentTeacher?.name || student?.rombelTeacherName || report?.teacherSignatureName || 'Ibu Alfiyah Nurazizah'}
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                NIP: {currentTeacher?.nip || report?.teacherNip || '199104122016032001'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
