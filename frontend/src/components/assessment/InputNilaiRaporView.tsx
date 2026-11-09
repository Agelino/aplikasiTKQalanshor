import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ReportCard,
  PredikatQuran,
  AssessmentScore,
  Student,
  TkqQuranScore,
  MerdekaElementsReport,
  P5ProjectReport,
  DdtkPhysicalReport,
} from '../../types';
import {
  ClipboardCheck,
  Award,
  Sparkles,
  Save,
  Printer,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  CheckCircle2,
  FileText,
  Heart,
  Activity,
  Calendar,
  Layers,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  HelpCircle,
  Star,
  Check,
} from 'lucide-react';
import {
  StarDisplay,
  StarInput,
  predikatQuranToStars,
  starsToPredikatQuran,
  merdekaScoreToStars,
  starsToMerdekaScore,
} from '../common/StarRating';

export const InputNilaiRaporView: React.FC = () => {
  const {
    students,
    classes,
    reportCards,
    saveReportCard,
    saveReportCardsBulk,
    setActiveTab,
    schoolProfile,
    currentRole,
    currentTeacher,
    currentRombel,
    currentClass,
    accessibleStudents,
    showToast,
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>(
    currentRole === 'guru' && currentClass ? currentClass.id : (classes[0]?.id || 'kelas-a1')
  );
  const [selectedSemester, setSelectedSemester] = useState<string>('Semester 1 (Ganjil)');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('2026/2027');
  const [viewMode, setViewMode] = useState<'matrix' | 'detail'>('matrix');

  // Filter students by class (or strictly scoped to accessible students for teacher)
  const classStudents = useMemo(() => {
    if (currentRole === 'guru') {
      return accessibleStudents;
    }
    return students.filter(s => s.classId === selectedClassId);
  }, [students, accessibleStudents, selectedClassId, currentRole]);

  // Selected student for detail mode
  const defaultStudentId = classStudents.find(s => s.id === 'murid-callista')?.id || classStudents[0]?.id || '';
  const [selectedStudentId, setSelectedStudentId] = useState<string>(defaultStudentId);
  const activeStudent = classStudents.find(s => s.id === selectedStudentId) || classStudents[0];

  // Helper to find or create default report card for a student
  const getOrCreateReportCard = (student: Student): ReportCard => {
    const existing = reportCards.find(
      r => r.studentId === student.id && (r.semester === selectedSemester || !r.semester)
    );
    if (existing) return existing;

    // Default template for TK Ceria Bangsa / PAUD Kurikulum Merdeka & TKQ
    return {
      id: `rapor-${student.id}`,
      academicYear: selectedAcademicYear,
      semester: selectedSemester,
      studentId: student.id,
      studentName: student.name,
      nis: student.nis,
      nisn: student.nisn,
      className: student.className,
      ageGroup: student.className?.includes('A') ? '4 - 5 Tahun' : '5 - 6 Tahun',
      institutionName: schoolProfile.name,
      overallRatingStars: 4,
      attendance: {
        hadir: 58,
        sakit: 1,
        izin: 0,
        alpa: 0,
      },
      quranReport: {
        tilawatiJilid: student.apbqProgress?.tilawatiLevel?.split('(')[0]?.trim() || 'Jilid 1',
        tilawatiHalaman: 'Halaman 20',
        tilawatiPredikat: 'Jayyid Jiddan',
        tilawatiStars: 3,
        tilawatiCatatan: 'Mampu melafalkan huruf hijaiyah dan bunyi fathah/kasrah dengan fashohah dan makhraj baik.',
        tahfidzStars: 3,
        tahfidzSurah: [
          { surahName: 'An-Naas', predikat: 'Mumtaz', stars: 4, tuntas: true, catatan: 'Lancar dan tartil' },
          { surahName: 'Al-Falaq', predikat: 'Mumtaz', stars: 4, tuntas: true, catatan: 'Lancar' },
          { surahName: 'Al-Ikhlas', predikat: 'Mumtaz', stars: 4, tuntas: true, catatan: 'Sangat lancar' },
          { surahName: 'Al-Lahab', predikat: 'Jayyid Jiddan', stars: 3, tuntas: true, catatan: 'Lancar bertajwid' },
          { surahName: 'An-Nashr', predikat: 'Jayyid Jiddan', stars: 3, tuntas: true, catatan: 'Lancar' },
        ],
        hikmahStars: 3,
        doaHarian: [
          { doaName: 'Doa Sebelum & Sesudah Makan', predikat: 'Mumtaz', stars: 4, tuntas: true },
          { doaName: 'Doa Bangun Tidur & Sebelum Tidur', predikat: 'Mumtaz', stars: 4, tuntas: true },
          { doaName: 'Doa Kedua Orang Tua & Kebaikan Akhirat', predikat: 'Mumtaz', stars: 4, tuntas: true },
          { doaName: 'Doa Masuk/Keluar Kamar Mandi', predikat: 'Jayyid Jiddan', stars: 3, tuntas: true },
        ],
        haditsPilihan: [
          { haditsName: 'Hadits Kasih Sayang (Man Laa Yarham...)', predikat: 'Mumtaz', stars: 4, tuntas: true },
          { haditsName: 'Hadits Kebersihan (Ath-Thuhuuru...)', predikat: 'Jayyid Jiddan', stars: 3, tuntas: true },
          { haditsName: 'Hadits Menuntut Ilmu (Tholabul Ilmi...)', predikat: 'Jayyid Jiddan', stars: 3, tuntas: true },
        ],
        praktikIbadah: [
          { materi: 'Tata Cara Berwudhu', predikat: 'Jayyid Jiddan', stars: 3, keterangan: 'Tertib mempraktikkan rukun wudhu secara berurutan.' },
          { materi: 'Gerakan & Bacaan Shalat', predikat: 'Jayyid Jiddan', stars: 3, keterangan: 'Tertib takbiratul ihram, ruku, sujud, dan salam.' },
          { materi: 'Adab Harian Islami', predikat: 'Mumtaz', stars: 4, keterangan: 'Santun, senyum, salam, sapa, dan menggunakan tangan kanan.' },
        ],
      },
      merdekaReport: {
        nilaiAgamaBudiPekerti: {
          predikat: 'BSB',
          stars: 4,
          narasi: `Alhamdulillah, Ananda ${student.nickname || student.name} berkembang sangat baik dalam mengenal dan mempraktikkan nilai agama Islam. Terbiasa mengucap salam, membaca doa harian, serta muroja'ah surah pendek juz 30 dengan tartil.`,
        },
        jatiDiri: {
          predikat: 'BSB',
          stars: 4,
          narasi: `Ananda ${student.nickname || student.name} menunjukkan kemandirian dan rasa percaya diri yang tinggi. Menunjukkan sikap empati, mau berbagi alat main, serta aktif dalam kegiatan motorik kasar dan halus.`,
        },
        literasiSteam: {
          predikat: 'BSH',
          stars: 3,
          narasi: `Kemampuan keaksaraan awal dan eksplorasi sains ananda berkembang sesuai harapan. Mampu menyimak cerita, membilang benda 1-20, serta kreatif dalam sentra seni dan rekayasa balok.`,
        },
      },
      p5Report: {
        tema: 'Aku Sayang Bumi (Apotek Hidup & Sahabat Tanaman)',
        subtema: 'Merawat Kebun Tanaman Hijau TK Ceria Bangsa',
        predikat: 'BSB',
        stars: 4,
        narasi: `Ananda berpartisipasi aktif dalam kegiatan menanam bibit tanaman, menyiram secara rutin, dan bekerja sama dengan riang bersama teman sekelas.`,
      },
      ddtkReport: {
        tinggiBadanCm: student.heightCm || 104,
        beratBadanKg: student.weightKg || 16.5,
        lingkarKepalaCm: student.headCircumferenceCm || 49.0,
        statusGizi: 'Gizi Baik / Normal & Ideal',
        kesehatanGigi: 'Bersih, Sehat, Terawat',
        pendengaran: 'Normal & Peka',
        penglihatan: 'Normal & Jelas',
      },
      teacherNotes: `Ananda ${student.name} merupakan santri yang ceria, santun, dan mandiri. Pertahankan semangat belajar, berdoa, dan eksplorasi di rumah bersama ayah bunda tercinta.`,
      recommendation: `Disarankan agar orang tua terus mendampingi kegiatan literasi cerita dan pembiasaan adab harian di rumah.`,
      issueDate: '2026-12-19',
      place: 'Kota Depok',
      teacherSignatureName: currentTeacher?.name || 'Ibu Alfiyah Nurazizah, S.Pd',
      teacherNip: currentTeacher?.nip || '199209212019032007',
      principalSignatureName: schoolProfile.principal || 'Dra. Hj. Rahmawati, S.Pd',
      principalNip: schoolProfile.principalNip || '197608122002122003',
      status: 'Diterbitkan',
    };
  };

  // Local state of matrix rows for quick batch editing
  const [matrixData, setMatrixData] = useState<Record<string, ReportCard>>(() => {
    const initial: Record<string, ReportCard> = {};
    classStudents.forEach(st => {
      initial[st.id] = getOrCreateReportCard(st);
    });
    return initial;
  });

  // Keep matrix data synced when class or students change
  React.useEffect(() => {
    setMatrixData(prev => {
      const next = { ...prev };
      classStudents.forEach(st => {
        if (!next[st.id]) {
          next[st.id] = getOrCreateReportCard(st);
        }
      });
      return next;
    });
  }, [classStudents, selectedClassId, selectedSemester]);

  // Current detail report being edited
  const currentDetailReport: ReportCard = activeStudent
    ? matrixData[activeStudent.id] || getOrCreateReportCard(activeStudent)
    : ({} as ReportCard);

  // Tab inside Detail Studio
  const [detailTab, setDetailTab] = useState<'quran' | 'merdeka' | 'p5_ddtk' | 'catatan'>('quran');

  // Matrix handlers
  const handleMatrixChange = (studentId: string, updates: Partial<ReportCard>) => {
    setMatrixData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        ...updates,
      },
    }));
  };

  const handleMatrixQuranChange = (studentId: string, quranUpdates: Partial<TkqQuranScore>) => {
    setMatrixData(prev => {
      const current = prev[studentId] || getOrCreateReportCard(students.find(s => s.id === studentId)!);
      return {
        ...prev,
        [studentId]: {
          ...current,
          quranReport: {
            ...current.quranReport!,
            ...quranUpdates,
          },
        },
      };
    });
  };

  const handleMatrixMerdekaChange = (
    studentId: string,
    elementKey: 'nilaiAgamaBudiPekerti' | 'jatiDiri' | 'literasiSteam',
    predikat: AssessmentScore
  ) => {
    setMatrixData(prev => {
      const current = prev[studentId] || getOrCreateReportCard(students.find(s => s.id === studentId)!);
      const student = students.find(s => s.id === studentId);
      const currentMerdeka = current.merdekaReport || {
        nilaiAgamaBudiPekerti: { predikat: 'BSB', stars: 4, narasi: '' },
        jatiDiri: { predikat: 'BSB', stars: 4, narasi: '' },
        literasiSteam: { predikat: 'BSH', stars: 3, narasi: '' },
      };

      const narasiAuto = generateSingleNarasi(
        student?.nickname || student?.name || 'Ananda',
        elementKey,
        predikat
      );

      const computedStars = merdekaScoreToStars(predikat);

      return {
        ...prev,
        [studentId]: {
          ...current,
          merdekaReport: {
            ...currentMerdeka,
            [elementKey]: {
              predikat,
              stars: computedStars,
              narasi: currentMerdeka[elementKey]?.narasi || narasiAuto,
            },
          },
        },
      };
    });
  };

  const handleSaveAllMatrix = () => {
    const listToSave = Object.values(matrixData);
    saveReportCardsBulk(listToSave);
  };

  // Generator helpers
  function generateSingleNarasi(
    name: string,
    elem: 'nilaiAgamaBudiPekerti' | 'jatiDiri' | 'literasiSteam',
    score: AssessmentScore
  ): string {
    if (elem === 'nilaiAgamaBudiPekerti') {
      if (score === 'BSB') {
        return `Alhamdulillah, Ananda ${name} berkembang sangat baik (BSB) dalam mengenal dan mengamalkan nilai-nilai Islam. Ananda terbiasa mengucap salam, membaca doa harian sebelum dan sesudah kegiatan, serta hafalan surat pendek juz 30 dan tilawati berkembang sangat tartil dan fasih.`;
      }
      if (score === 'BSH') {
        return `Ananda ${name} berkembang sesuai harapan (BSH) dalam mengenal rukun Islam, tertib mengikuti praktik sholat dhuha dan melafalkan doa-doa harian dengan bimbingan ustadzah.`;
      }
      return `Ananda ${name} mulai berkembang dalam membiasakan adab islami sehari-hari, perlu terus dimotivasi dalam muroja'ah surat pendek di rumah.`;
    }
    if (elem === 'jatiDiri') {
      if (score === 'BSB') {
        return `Ananda ${name} memiliki kemandirian dan rasa percaya diri yang sangat baik (BSB). Mampu mengekspresikan emosi secara positif, sabar mengantre, menyayangi teman, dan motorik halus maupun kasarnya berkembang sangat lincah dan terampil.`;
      }
      if (score === 'BSH') {
        return `Ananda ${name} berkembang sesuai harapan (BSH) dalam kemandirian saat memakai sepatu dan merapikan mainan, serta mampu bersosialisasi dengan akrab bersama teman sekelas.`;
      }
      return `Ananda ${name} mulai berkembang dalam mengelola emosi dan kemandirian di kelas dengan pendampingan guru.`;
    }
    // literasiSteam
    if (score === 'BSB') {
      return `Kemampuan literasi dan eksplorasi STEAM Ananda ${name} berkembang sangat baik (BSB). Mampu menceritakan kembali cerita dengan runtut, mengenal simbol huruf hijaiyah dan latin, membilang benda 1-20, serta sangat antusias bereksplorasi di sentra sains dan seni.`;
    }
    if (score === 'BSH') {
      return `Ananda ${name} berkembang sesuai harapan (BSH) dalam menyimak buku cerita bergambar, mengelompokkan bentuk dan warna, serta aktif dalam eksperimen sederhana di sentra alam.`;
    }
    return `Ananda ${name} mulai berkembang dalam mengenal keaksaraan awal dan konsep berhitung melalui ragam main manipulatif.`;
  }

  const handleGenerateAllNarratives = () => {
    setMatrixData(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(stId => {
        const item = updated[stId];
        const st = students.find(s => s.id === stId);
        const name = st?.nickname || st?.name || 'Ananda';
        const nabpPred = item.merdekaReport?.nilaiAgamaBudiPekerti.predikat || 'BSB';
        const jdPred = item.merdekaReport?.jatiDiri.predikat || 'BSB';
        const steamPred = item.merdekaReport?.literasiSteam.predikat || 'BSH';

        updated[stId] = {
          ...item,
          merdekaReport: {
            nilaiAgamaBudiPekerti: {
              predikat: nabpPred,
              stars: merdekaScoreToStars(nabpPred),
              narasi: generateSingleNarasi(name, 'nilaiAgamaBudiPekerti', nabpPred),
            },
            jatiDiri: {
              predikat: jdPred,
              stars: merdekaScoreToStars(jdPred),
              narasi: generateSingleNarasi(name, 'jatiDiri', jdPred),
            },
            literasiSteam: {
              predikat: steamPred,
              stars: merdekaScoreToStars(steamPred),
              narasi: generateSingleNarasi(name, 'literasiSteam', steamPred),
            },
          },
        };
      });
      return updated;
    });
  };

  // Single detail save
  const handleSaveDetail = () => {
    if (!activeStudent) return;
    saveReportCard(currentDetailReport);
  };

  const navigateStudent = (dir: 'prev' | 'next') => {
    const idx = classStudents.findIndex(s => s.id === selectedStudentId);
    if (idx < 0) return;
    if (dir === 'prev' && idx > 0) {
      setSelectedStudentId(classStudents[idx - 1].id);
    } else if (dir === 'next' && idx < classStudents.length - 1) {
      setSelectedStudentId(classStudents[idx + 1].id);
    }
  };

  const predikatBadgeColor = (p?: PredikatQuran) => {
    switch (p) {
      case 'Mumtaz':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Jayyid Jiddan':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Jayyid':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Maqbul':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const merdekaBadgeColor = (score?: AssessmentScore) => {
    switch (score) {
      case 'BSB':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'BSH':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'MB':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'BB':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                {currentRole === 'guru'
                  ? `Input Leger & Rapor: ${currentRombel?.fullName || 'Rombel Saya'} (${currentRombel?.className || 'Kelas'})`
                  : 'Input Nilai & Leger Rapor TKQ'}
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                {currentRole === 'guru' ? `Wali: ${currentTeacher?.name}` : 'Format Rapor 2026/2027'}
              </span>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                <span>Rating Bintang Aktif</span>
              </span>
              {currentRole === 'guru' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {classStudents.length} Santri Binaan
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentRole === 'guru'
                ? `Pengisian nilai rapor khusus santri rombel ${currentRombel?.name || ''}. Nilai murid di rombel lain diinput oleh guru wali rombel masing-masing.`
                : "Kelola pengisian nilai capaian Al-Qur'an APBQ, Kurikulum Merdeka PAUD 3 Elemen, P5, DDTK, serta Rating Bintang (★ - ★★★★)"}
            </p>
          </div>
        </div>

        {/* Global Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {currentRole === 'guru' ? (
            <div className="px-3 py-2 text-xs bg-emerald-50 border border-emerald-200 rounded-xl font-bold text-emerald-800">
              {currentRombel?.fullName || 'Rombel Saya'}
            </div>
          ) : (
            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 focus:bg-white focus:border-emerald-500"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          <select
            value={selectedSemester}
            onChange={e => setSelectedSemester(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-700"
          >
            <option value="Semester 1 (Ganjil)">Semester 1 (Ganjil)</option>
            <option value="Semester 2 (Genap)">Semester 2 (Genap)</option>
          </select>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'matrix'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Matriks / Leger Kelas
            </button>
            <button
              onClick={() => setViewMode('detail')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'detail'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Studio Input Per Murid
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: MATRIKS LEGER KELAS (SESUAI CONTOH INPUT NILAI.PDF) */}
      {viewMode === 'matrix' && (
        <div className="space-y-4">
          {/* Action Ribbon & Legend */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Skala Bintang & Predikat:</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                <StarDisplay stars={4} size="xs" />
                <span>Mumtaz / BSB (4★)</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <StarDisplay stars={3} size="xs" />
                <span>Jayyid Jiddan / BSH (3★)</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                <StarDisplay stars={2} size="xs" />
                <span>Jayyid / MB (2★)</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                <StarDisplay stars={1} size="xs" />
                <span>Maqbul / BB (1★)</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateAllNarratives}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 transition-all"
                title="Menulis narasi Kurikulum Merdeka otomatis untuk seluruh siswa berdasarkan predikat yang dipilih"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Generate Narasi Merdeka</span>
              </button>

              <button
                onClick={handleSaveAllMatrix}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Semua Perubahan</span>
              </button>
            </div>
          </div>

          {/* Matrix Spreadsheet Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-800">
                  Tabel Pengisian Nilai Leger Rapor Kelas: {classes.find(c => c.id === selectedClassId)?.name}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  ({classStudents.length} Santri)
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span className="flex items-center gap-1 font-semibold text-amber-700">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>Klik bintang pada kolom untuk rating langsung</span>
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3 text-center w-10">No</th>
                    <th className="p-3 min-w-[190px]">Nama Peserta Didik</th>
                    <th className="p-3 min-w-[140px] text-center bg-amber-50/80 text-amber-900 border-x border-amber-200">
                      Rating Bintang Santri
                    </th>
                    <th className="p-3 min-w-[150px] text-center bg-emerald-50/50 text-emerald-900 border-r border-emerald-100">
                      Al-Qur'an / Tilawati
                    </th>
                    <th className="p-3 min-w-[120px] text-center bg-emerald-50/50 text-emerald-900 border-r border-emerald-100">
                      Tahfidz Juz 30
                    </th>
                    <th className="p-3 min-w-[120px] text-center bg-emerald-50/50 text-emerald-900 border-r border-emerald-100">
                      Doa & Hadits
                    </th>
                    <th className="p-3 min-w-[120px] text-center bg-emerald-50/50 text-emerald-900 border-r border-emerald-100">
                      Praktik Ibadah
                    </th>
                    <th className="p-3 min-w-[110px] text-center bg-blue-50/50 text-blue-900 border-r border-blue-100">
                      Agama & Budi
                    </th>
                    <th className="p-3 min-w-[110px] text-center bg-blue-50/50 text-blue-900 border-r border-blue-100">
                      Jati Diri
                    </th>
                    <th className="p-3 min-w-[110px] text-center bg-blue-50/50 text-blue-900 border-r border-blue-100">
                      Literasi STEAM
                    </th>
                    <th className="p-3 min-w-[90px] text-center bg-amber-50/40 text-amber-900 border-r border-amber-100">
                      P5 Projek
                    </th>
                    <th className="p-3 min-w-[120px] text-center">Fisik (BB/TB/LK)</th>
                    <th className="p-3 min-w-[90px] text-center">Presensi (S/I/A)</th>
                    <th className="p-3 min-w-[120px] text-center sticky right-0 bg-white shadow-xs">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classStudents.map((st, idx) => {
                    const rowReport = matrixData[st.id] || getOrCreateReportCard(st);
                    const q = rowReport.quranReport;
                    const m = rowReport.merdekaReport;
                    const d = rowReport.ddtkReport;
                    const att = rowReport.attendance;
                    const isCallista = st.id === 'murid-callista';

                    const currentOverallStars = rowReport.overallRatingStars || 4;

                    return (
                      <tr
                        key={st.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isCallista ? 'bg-emerald-50/20' : ''
                        }`}
                      >
                        <td className="p-3 text-center font-mono text-slate-400 font-semibold">
                          {idx + 1}
                        </td>

                        {/* Nama Siswa */}
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-[11px] shrink-0 ${
                                isCallista ? 'bg-rose-500 ring-2 ring-rose-200' : st.avatarColor
                              }`}
                            >
                              {st.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{st.name}</span>
                                {isCallista && (
                                  <span className="text-[9px] font-bold bg-pink-100 text-pink-700 px-1.5 py-0.2 rounded">
                                    Dokumen Rapor
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-mono text-slate-400">
                                NIS: {st.nis}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Rating Bintang Santri (Interaktif 1 - 4 Stars) */}
                        <td className="p-3 text-center border-x border-amber-200/80 bg-amber-50/25">
                          <div className="flex flex-col items-center gap-1">
                            <StarInput
                              value={currentOverallStars}
                              onChange={val => handleMatrixChange(st.id, { overallRatingStars: val })}
                              size="xs"
                            />
                            <span className="text-[9px] font-bold text-amber-800">
                              {currentOverallStars === 4 ? 'Mumtaz (4★)' : `${currentOverallStars} Bintang`}
                            </span>
                          </div>
                        </td>

                        {/* Tilawati */}
                        <td className="p-3 text-center border-r border-emerald-50 bg-emerald-50/10">
                          <div className="space-y-1">
                            <select
                              value={q?.tilawatiPredikat || 'Jayyid Jiddan'}
                              onChange={e => {
                                const newP = e.target.value as PredikatQuran;
                                handleMatrixQuranChange(st.id, {
                                  tilawatiPredikat: newP,
                                  tilawatiStars: predikatQuranToStars(newP),
                                });
                              }}
                              className={`w-full py-1 px-1.5 rounded-lg text-[11px] font-bold border outline-none ${predikatBadgeColor(
                                q?.tilawatiPredikat
                              )}`}
                            >
                              <option value="Mumtaz">Mumtaz</option>
                              <option value="Jayyid Jiddan">Jayyid Jiddan</option>
                              <option value="Jayyid">Jayyid</option>
                              <option value="Maqbul">Maqbul</option>
                            </select>
                            <div className="flex items-center justify-center py-0.5">
                              <StarDisplay stars={q?.tilawatiStars || predikatQuranToStars(q?.tilawatiPredikat)} size="xs" />
                            </div>
                            <input
                              type="text"
                              value={q?.tilawatiJilid || 'Jilid 1'}
                              onChange={e =>
                                handleMatrixQuranChange(st.id, { tilawatiJilid: e.target.value })
                              }
                              className="w-full text-[10px] text-center bg-white border border-slate-200 rounded px-1 py-0.5 font-medium"
                              placeholder="Jilid & Hal"
                            />
                          </div>
                        </td>

                        {/* Tahfidz */}
                        <td className="p-3 text-center border-r border-emerald-50 bg-emerald-50/10">
                          <select
                            value={q?.tahfidzSurah?.[0]?.predikat || 'Mumtaz'}
                            onChange={e => {
                              const newP = e.target.value as PredikatQuran;
                              const sCount = predikatQuranToStars(newP);
                              const updatedSurah = (q?.tahfidzSurah || []).map(s => ({
                                ...s,
                                predikat: newP,
                                stars: sCount,
                              }));
                              handleMatrixQuranChange(st.id, {
                                tahfidzStars: sCount,
                                tahfidzSurah: updatedSurah,
                              });
                            }}
                            className={`w-full py-1 px-1.5 rounded-lg text-[11px] font-bold border outline-none ${predikatBadgeColor(
                              q?.tahfidzSurah?.[0]?.predikat
                            )}`}
                          >
                            <option value="Mumtaz">Mumtaz</option>
                            <option value="Jayyid Jiddan">Jayyid Jiddan</option>
                            <option value="Jayyid">Jayyid</option>
                            <option value="Maqbul">Maqbul</option>
                          </select>
                          <div className="flex items-center justify-center py-1">
                            <StarDisplay stars={q?.tahfidzStars || predikatQuranToStars(q?.tahfidzSurah?.[0]?.predikat)} size="xs" />
                          </div>
                          <span className="text-[10px] text-slate-400 block">
                            {q?.tahfidzSurah?.length || 5} Surah
                          </span>
                        </td>

                        {/* Doa & Hadits */}
                        <td className="p-3 text-center border-r border-emerald-50 bg-emerald-50/10">
                          <select
                            value={q?.doaHarian?.[0]?.predikat || 'Mumtaz'}
                            onChange={e => {
                              const newP = e.target.value as PredikatQuran;
                              const sCount = predikatQuranToStars(newP);
                              const updatedDoa = (q?.doaHarian || []).map(d => ({
                                ...d,
                                predikat: newP,
                                stars: sCount,
                              }));
                              handleMatrixQuranChange(st.id, {
                                hikmahStars: sCount,
                                doaHarian: updatedDoa,
                              });
                            }}
                            className={`w-full py-1 px-1.5 rounded-lg text-[11px] font-bold border outline-none ${predikatBadgeColor(
                              q?.doaHarian?.[0]?.predikat
                            )}`}
                          >
                            <option value="Mumtaz">Mumtaz</option>
                            <option value="Jayyid Jiddan">Jayyid Jiddan</option>
                            <option value="Jayyid">Jayyid</option>
                            <option value="Maqbul">Maqbul</option>
                          </select>
                          <div className="flex items-center justify-center py-1">
                            <StarDisplay stars={q?.hikmahStars || predikatQuranToStars(q?.doaHarian?.[0]?.predikat)} size="xs" />
                          </div>
                          <span className="text-[10px] text-slate-400 block">Doa & Hadits</span>
                        </td>

                        {/* Praktik Ibadah */}
                        <td className="p-3 text-center border-r border-emerald-50 bg-emerald-50/10">
                          <select
                            value={q?.praktikIbadah?.[0]?.predikat || 'Jayyid Jiddan'}
                            onChange={e => {
                              const newP = e.target.value as PredikatQuran;
                              const sCount = predikatQuranToStars(newP);
                              const updatedIbadah = (q?.praktikIbadah || []).map(ib => ({
                                ...ib,
                                predikat: newP,
                                stars: sCount,
                              }));
                              handleMatrixQuranChange(st.id, { praktikIbadah: updatedIbadah });
                            }}
                            className={`w-full py-1 px-1.5 rounded-lg text-[11px] font-bold border outline-none ${predikatBadgeColor(
                              q?.praktikIbadah?.[0]?.predikat
                            )}`}
                          >
                            <option value="Mumtaz">Mumtaz</option>
                            <option value="Jayyid Jiddan">Jayyid Jiddan</option>
                            <option value="Jayyid">Jayyid</option>
                            <option value="Maqbul">Maqbul</option>
                          </select>
                          <div className="flex items-center justify-center py-1">
                            <StarDisplay stars={predikatQuranToStars(q?.praktikIbadah?.[0]?.predikat)} size="xs" />
                          </div>
                          <span className="text-[10px] text-slate-400 block">Wudhu & Shalat</span>
                        </td>

                        {/* Agama & Budi Pekerti */}
                        <td className="p-3 text-center border-r border-blue-50 bg-blue-50/10">
                          <select
                            value={m?.nilaiAgamaBudiPekerti?.predikat || 'BSB'}
                            onChange={e =>
                              handleMatrixMerdekaChange(
                                st.id,
                                'nilaiAgamaBudiPekerti',
                                e.target.value as AssessmentScore
                              )
                            }
                            className={`w-full py-1 px-1.5 rounded-lg text-[11px] font-bold border outline-none ${merdekaBadgeColor(
                              m?.nilaiAgamaBudiPekerti?.predikat
                            )}`}
                          >
                            <option value="BSB">BSB</option>
                            <option value="BSH">BSH</option>
                            <option value="MB">MB</option>
                            <option value="BB">BB</option>
                          </select>
                          <div className="flex items-center justify-center py-1">
                            <StarDisplay stars={m?.nilaiAgamaBudiPekerti?.stars || merdekaScoreToStars(m?.nilaiAgamaBudiPekerti?.predikat)} size="xs" />
                          </div>
                        </td>

                        {/* Jati Diri */}
                        <td className="p-3 text-center border-r border-blue-50 bg-blue-50/10">
                          <select
                            value={m?.jatiDiri?.predikat || 'BSB'}
                            onChange={e =>
                              handleMatrixMerdekaChange(
                                st.id,
                                'jatiDiri',
                                e.target.value as AssessmentScore
                              )
                            }
                            className={`w-full py-1 px-1.5 rounded-lg text-[11px] font-bold border outline-none ${merdekaBadgeColor(
                              m?.jatiDiri?.predikat
                            )}`}
                          >
                            <option value="BSB">BSB</option>
                            <option value="BSH">BSH</option>
                            <option value="MB">MB</option>
                            <option value="BB">BB</option>
                          </select>
                          <div className="flex items-center justify-center py-1">
                            <StarDisplay stars={m?.jatiDiri?.stars || merdekaScoreToStars(m?.jatiDiri?.predikat)} size="xs" />
                          </div>
                        </td>

                        {/* Literasi STEAM */}
                        <td className="p-3 text-center border-r border-blue-50 bg-blue-50/10">
                          <select
                            value={m?.literasiSteam?.predikat || 'BSH'}
                            onChange={e =>
                              handleMatrixMerdekaChange(
                                st.id,
                                'literasiSteam',
                                e.target.value as AssessmentScore
                              )
                            }
                            className={`w-full py-1 px-1.5 rounded-lg text-[11px] font-bold border outline-none ${merdekaBadgeColor(
                              m?.literasiSteam?.predikat
                            )}`}
                          >
                            <option value="BSB">BSB</option>
                            <option value="BSH">BSH</option>
                            <option value="MB">MB</option>
                            <option value="BB">BB</option>
                          </select>
                          <div className="flex items-center justify-center py-1">
                            <StarDisplay stars={m?.literasiSteam?.stars || merdekaScoreToStars(m?.literasiSteam?.predikat)} size="xs" />
                          </div>
                        </td>

                        {/* P5 */}
                        <td className="p-3 text-center border-r border-amber-50 bg-amber-50/10">
                          <select
                            value={rowReport.p5Report?.predikat || 'BSB'}
                            onChange={e => {
                              const newP = e.target.value as AssessmentScore;
                              handleMatrixChange(st.id, {
                                p5Report: {
                                  tema: rowReport.p5Report?.tema || 'Aku Sayang Bumi',
                                  predikat: newP,
                                  stars: merdekaScoreToStars(newP),
                                  narasi: rowReport.p5Report?.narasi || '',
                                },
                              });
                            }}
                            className={`w-full py-1 px-1 rounded-lg text-[11px] font-bold border outline-none ${merdekaBadgeColor(
                              rowReport.p5Report?.predikat
                            )}`}
                          >
                            <option value="BSB">BSB</option>
                            <option value="BSH">BSH</option>
                            <option value="MB">MB</option>
                          </select>
                          <div className="flex items-center justify-center py-1">
                            <StarDisplay stars={rowReport.p5Report?.stars || merdekaScoreToStars(rowReport.p5Report?.predikat)} size="xs" />
                          </div>
                        </td>

                        {/* Fisik BB/TB/LK */}
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1 font-mono text-[10px] text-slate-700">
                            <span>{d?.beratBadanKg || 16.5}kg</span>
                            <span className="text-slate-300">/</span>
                            <span>{d?.tinggiBadanCm || 104}cm</span>
                            <span className="text-slate-300">/</span>
                            <span>{d?.lingkarKepalaCm || 49}cm</span>
                          </div>
                        </td>

                        {/* Presensi */}
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1 text-[11px]">
                            <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-bold">
                              S:{att?.sakit ?? 1}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold">
                              I:{att?.izin ?? 0}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                              A:{att?.alpa ?? 0}
                            </span>
                          </div>
                        </td>

                        {/* Aksi */}
                        <td className="p-3 text-center sticky right-0 bg-white">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedStudentId(st.id);
                                setViewMode('detail');
                              }}
                              className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] border border-emerald-200 transition-all"
                              title="Buka form input detail santri ini"
                            >
                              Edit Form
                            </button>

                            <button
                              onClick={() => {
                                setSelectedStudentId(st.id);
                                setActiveTab('rapor');
                              }}
                              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-all"
                              title="Lihat Buku Rapor Resmi Siswa"
                            >
                              Rapor
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: FORM STUDIO INPUT NILAI PER MURID */}
      {viewMode === 'detail' && activeStudent && (
        <div className="space-y-6">
          {/* Student Selector Card */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-lg ${
                  activeStudent.id === 'murid-callista' ? 'bg-rose-500' : activeStudent.avatarColor
                }`}
              >
                {activeStudent.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{activeStudent.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {activeStudent.className}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>NIS: <strong className="text-slate-700 font-mono">{activeStudent.nis}</strong></span>
                  <span>·</span>
                  <span>NISN: <strong className="text-slate-700 font-mono">{activeStudent.nisn || '-'}</strong></span>
                  <span>·</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700">Rating Umum:</span>
                    <StarInput
                      value={currentDetailReport.overallRatingStars || 4}
                      onChange={val => handleMatrixChange(activeStudent.id, { overallRatingStars: val })}
                      size="xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateStudent('prev')}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1"
                title="Siswa Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Sebelumnya</span>
              </button>

              <select
                value={selectedStudentId}
                onChange={e => setSelectedStudentId(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800"
              >
                {classStudents.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => navigateStudent('next')}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1"
                title="Siswa Selanjutnya"
              >
                <span className="hidden sm:inline">Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('rapor')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Pratinjau Rapor</span>
              </button>

              <button
                onClick={handleSaveDetail}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Nilai</span>
              </button>
            </div>
          </div>

          {/* Form Tabs */}
          <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-4 pt-2 gap-2 text-xs font-bold overflow-x-auto">
            <button
              onClick={() => setDetailTab('quran')}
              className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
                detailTab === 'quran'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>1. Al-Qur'an & APBQ TKQ</span>
            </button>

            <button
              onClick={() => setDetailTab('merdeka')}
              className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
                detailTab === 'merdeka'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>2. Kurikulum Merdeka (3 Elemen)</span>
            </button>

            <button
              onClick={() => setDetailTab('p5_ddtk')}
              className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
                detailTab === 'p5_ddtk'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>3. Projek P5 & DDTK Fisik</span>
            </button>

            <button
              onClick={() => setDetailTab('catatan')}
              className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
                detailTab === 'catatan'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>4. Absensi, Catatan & Tanda Tangan</span>
            </button>
          </div>

          {/* Form Content Area */}
          <div className="bg-white rounded-b-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
            {/* TAB 1: AL-QUR'AN & APBQ */}
            {detailTab === 'quran' && (
              <div className="space-y-6">
                {/* Tilawati Section */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      <span>Tilawati / Membaca Al-Qur'an (TILAWAH)</span>
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-700">Rating Bintang:</span>
                      <StarInput
                        value={currentDetailReport.quranReport?.tilawatiStars || predikatQuranToStars(currentDetailReport.quranReport?.tilawatiPredikat)}
                        onChange={val => {
                          const pred = starsToPredikatQuran(val);
                          handleMatrixQuranChange(activeStudent.id, {
                            tilawatiStars: val,
                            tilawatiPredikat: pred,
                          });
                        }}
                        size="sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Tingkat / Jilid
                      </label>
                      <input
                        type="text"
                        value={currentDetailReport.quranReport?.tilawatiJilid || 'Jilid 1'}
                        onChange={e =>
                          handleMatrixQuranChange(activeStudent.id, {
                            tilawatiJilid: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none font-medium focus:border-emerald-500"
                        placeholder="e.g. Jilid 1 / Jilid 2"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Capaian Halaman
                      </label>
                      <input
                        type="text"
                        value={currentDetailReport.quranReport?.tilawatiHalaman || 'Halaman 28'}
                        onChange={e =>
                          handleMatrixQuranChange(activeStudent.id, {
                            tilawatiHalaman: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none font-medium focus:border-emerald-500"
                        placeholder="e.g. Halaman 28"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Predikat Capaian
                      </label>
                      <select
                        value={currentDetailReport.quranReport?.tilawatiPredikat || 'Jayyid Jiddan'}
                        onChange={e => {
                          const p = e.target.value as PredikatQuran;
                          handleMatrixQuranChange(activeStudent.id, {
                            tilawatiPredikat: p,
                            tilawatiStars: predikatQuranToStars(p),
                          });
                        }}
                        className={`w-full px-3 py-2 text-xs border rounded-xl outline-none font-bold ${predikatBadgeColor(
                          currentDetailReport.quranReport?.tilawatiPredikat
                        )}`}
                      >
                        <option value="Mumtaz">Mumtaz (Istimewa / 4★)</option>
                        <option value="Jayyid Jiddan">Jayyid Jiddan (Baik Sekali / 3★)</option>
                        <option value="Jayyid">Jayyid (Baik / 2★)</option>
                        <option value="Maqbul">Maqbul (Cukup / 1★)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Catatan Evaluasi Makhraj & Fashohah Tilawati:
                    </label>
                    <textarea
                      rows={2}
                      value={currentDetailReport.quranReport?.tilawatiCatatan || ''}
                      onChange={e =>
                        handleMatrixQuranChange(activeStudent.id, {
                          tilawatiCatatan: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 leading-relaxed"
                      placeholder="Ulasan fashohah dan makhraj..."
                    />
                  </div>
                </div>

                {/* Tahfidz Juz 'Amma Section */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Hafalan Surah Pendek Juz 'Amma (TAHFIDZ)</span>
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-700">Rating Umum Tahfidz:</span>
                      <StarInput
                        value={currentDetailReport.quranReport?.tahfidzStars || 3}
                        onChange={val => handleMatrixQuranChange(activeStudent.id, { tahfidzStars: val })}
                        size="sm"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs bg-white rounded-xl border border-slate-200 overflow-hidden">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-2.5 text-center w-8">No</th>
                          <th className="p-2.5">Surah</th>
                          <th className="p-2.5 text-center w-28">Status</th>
                          <th className="p-2.5 text-center w-36">Predikat</th>
                          <th className="p-2.5 text-center w-32">Rating Bintang</th>
                          <th className="p-2.5">Catatan Tajwid</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(currentDetailReport.quranReport?.tahfidzSurah || []).map((s, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/60">
                            <td className="p-2.5 text-center font-mono text-slate-400">{idx + 1}</td>
                            <td className="p-2.5 font-bold text-slate-900">{s.surahName}</td>
                            <td className="p-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...(currentDetailReport.quranReport?.tahfidzSurah || [])];
                                  updated[idx] = { ...updated[idx], tuntas: !updated[idx].tuntas };
                                  handleMatrixQuranChange(activeStudent.id, { tahfidzSurah: updated });
                                }}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                                  s.tuntas
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : 'bg-amber-50 text-amber-800 border-amber-300'
                                }`}
                              >
                                {s.tuntas ? '✓ Tuntas' : 'Proses'}
                              </button>
                            </td>
                            <td className="p-2.5 text-center">
                              <select
                                value={s.predikat}
                                onChange={e => {
                                  const p = e.target.value as PredikatQuran;
                                  const updated = [...(currentDetailReport.quranReport?.tahfidzSurah || [])];
                                  updated[idx] = { ...updated[idx], predikat: p, stars: predikatQuranToStars(p) };
                                  handleMatrixQuranChange(activeStudent.id, { tahfidzSurah: updated });
                                }}
                                className={`py-1 px-2 rounded-lg text-[11px] font-bold border outline-none ${predikatBadgeColor(
                                  s.predikat
                                )}`}
                              >
                                <option value="Mumtaz">Mumtaz</option>
                                <option value="Jayyid Jiddan">Jayyid Jiddan</option>
                                <option value="Jayyid">Jayyid</option>
                                <option value="Maqbul">Maqbul</option>
                              </select>
                            </td>
                            <td className="p-2.5 text-center">
                              <StarInput
                                value={s.stars || predikatQuranToStars(s.predikat)}
                                onChange={val => {
                                  const updated = [...(currentDetailReport.quranReport?.tahfidzSurah || [])];
                                  updated[idx] = { ...updated[idx], stars: val, predikat: starsToPredikatQuran(val) };
                                  handleMatrixQuranChange(activeStudent.id, { tahfidzSurah: updated });
                                }}
                                size="xs"
                              />
                            </td>
                            <td className="p-2.5">
                              <input
                                type="text"
                                value={s.catatan || ''}
                                onChange={e => {
                                  const updated = [...(currentDetailReport.quranReport?.tahfidzSurah || [])];
                                  updated[idx] = { ...updated[idx], catatan: e.target.value };
                                  handleMatrixQuranChange(activeStudent.id, { tahfidzSurah: updated });
                                }}
                                className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg outline-none"
                                placeholder="Ulasan makhraj/tartil..."
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Hikmah: Doa, Hadits & Praktik Ibadah Section */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Heart className="w-4 h-4 text-emerald-600" />
                      <span>HIKMAH (Doa Harian, Hadits Karakter & Praktik Ibadah)</span>
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-700">Rating Umum Hikmah:</span>
                      <StarInput
                        value={currentDetailReport.quranReport?.hikmahStars || 3}
                        onChange={val => handleMatrixQuranChange(activeStudent.id, { hikmahStars: val })}
                        size="sm"
                      />
                    </div>
                  </div>

                  {/* Doa Harian Grid */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-800">1. Daftar Doa Harian:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(currentDetailReport.quranReport?.doaHarian || []).map((d, dIdx) => (
                        <div key={dIdx} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                          <span className="text-xs text-slate-800 font-medium truncate">{d.doaName}</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <StarInput
                              value={d.stars || predikatQuranToStars(d.predikat)}
                              onChange={val => {
                                const updated = [...(currentDetailReport.quranReport?.doaHarian || [])];
                                updated[dIdx] = { ...updated[dIdx], stars: val, predikat: starsToPredikatQuran(val) };
                                handleMatrixQuranChange(activeStudent.id, { doaHarian: updated });
                              }}
                              size="xs"
                            />
                            <select
                              value={d.predikat}
                              onChange={e => {
                                const p = e.target.value as PredikatQuran;
                                const updated = [...(currentDetailReport.quranReport?.doaHarian || [])];
                                updated[dIdx] = { ...updated[dIdx], predikat: p, stars: predikatQuranToStars(p) };
                                handleMatrixQuranChange(activeStudent.id, { doaHarian: updated });
                              }}
                              className={`py-0.5 px-1.5 rounded text-[10px] font-bold border outline-none ${predikatBadgeColor(
                                d.predikat
                              )}`}
                            >
                              <option value="Mumtaz">Mumtaz</option>
                              <option value="Jayyid Jiddan">Jayyid Jiddan</option>
                              <option value="Jayyid">Jayyid</option>
                              <option value="Maqbul">Maqbul</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hadits Pilihan Grid */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-800">2. Daftar Hadits Pilihan:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(currentDetailReport.quranReport?.haditsPilihan || []).map((h, hIdx) => (
                        <div key={hIdx} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                          <span className="text-xs text-slate-800 font-medium truncate">{h.haditsName}</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <StarInput
                              value={h.stars || predikatQuranToStars(h.predikat)}
                              onChange={val => {
                                const updated = [...(currentDetailReport.quranReport?.haditsPilihan || [])];
                                updated[hIdx] = { ...updated[hIdx], stars: val, predikat: starsToPredikatQuran(val) };
                                handleMatrixQuranChange(activeStudent.id, { haditsPilihan: updated });
                              }}
                              size="xs"
                            />
                            <select
                              value={h.predikat}
                              onChange={e => {
                                const p = e.target.value as PredikatQuran;
                                const updated = [...(currentDetailReport.quranReport?.haditsPilihan || [])];
                                updated[hIdx] = { ...updated[hIdx], predikat: p, stars: predikatQuranToStars(p) };
                                handleMatrixQuranChange(activeStudent.id, { haditsPilihan: updated });
                              }}
                              className={`py-0.5 px-1.5 rounded text-[10px] font-bold border outline-none ${predikatBadgeColor(
                                h.predikat
                              )}`}
                            >
                              <option value="Mumtaz">Mumtaz</option>
                              <option value="Jayyid Jiddan">Jayyid Jiddan</option>
                              <option value="Jayyid">Jayyid</option>
                              <option value="Maqbul">Maqbul</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: KURIKULUM MERDEKA (3 ELEMEN) */}
            {detailTab === 'merdeka' && (
              <div className="space-y-6">
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
                  <span>Format Capaian Pembelajaran Kurikulum Merdeka PAUD: Nilai Agama & Budi Pekerti, Jati Diri, dan Dasar STEAM</span>
                  <button
                    type="button"
                    onClick={() => {
                      const name = activeStudent.nickname || activeStudent.name;
                      const nabpP = currentDetailReport.merdekaReport?.nilaiAgamaBudiPekerti.predikat || 'BSB';
                      const jdP = currentDetailReport.merdekaReport?.jatiDiri.predikat || 'BSB';
                      const stP = currentDetailReport.merdekaReport?.literasiSteam.predikat || 'BSH';
                      handleMatrixChange(activeStudent.id, {
                        merdekaReport: {
                          nilaiAgamaBudiPekerti: {
                            predikat: nabpP,
                            stars: merdekaScoreToStars(nabpP),
                            narasi: generateSingleNarasi(name, 'nilaiAgamaBudiPekerti', nabpP),
                          },
                          jatiDiri: {
                            predikat: jdP,
                            stars: merdekaScoreToStars(jdP),
                            narasi: generateSingleNarasi(name, 'jatiDiri', jdP),
                          },
                          literasiSteam: {
                            predikat: stP,
                            stars: merdekaScoreToStars(stP),
                            narasi: generateSingleNarasi(name, 'literasiSteam', stP),
                          },
                        },
                      });
                    }}
                    className="flex items-center gap-1 font-bold text-purple-700 bg-white px-2.5 py-1 rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Generate 3 Narasi</span>
                  </button>
                </div>

                {/* 1. Nilai Agama & Budi Pekerti */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      1. Elemen Nilai Agama dan Budi Pekerti
                    </h4>
                    <div className="flex items-center gap-3">
                      <StarInput
                        value={currentDetailReport.merdekaReport?.nilaiAgamaBudiPekerti?.stars || merdekaScoreToStars(currentDetailReport.merdekaReport?.nilaiAgamaBudiPekerti?.predikat)}
                        onChange={val => {
                          const p = starsToMerdekaScore(val);
                          handleMatrixMerdekaChange(activeStudent.id, 'nilaiAgamaBudiPekerti', p);
                        }}
                        size="sm"
                      />
                      <select
                        value={currentDetailReport.merdekaReport?.nilaiAgamaBudiPekerti?.predikat || 'BSB'}
                        onChange={e =>
                          handleMatrixMerdekaChange(
                            activeStudent.id,
                            'nilaiAgamaBudiPekerti',
                            e.target.value as AssessmentScore
                          )
                        }
                        className={`py-1 px-2.5 rounded-lg text-xs font-bold border outline-none ${merdekaBadgeColor(
                          currentDetailReport.merdekaReport?.nilaiAgamaBudiPekerti?.predikat
                        )}`}
                      >
                        <option value="BSB">Berkembang Sangat Baik (BSB - 4★)</option>
                        <option value="BSH">Berkembang Sesuai Harapan (BSH - 3★)</option>
                        <option value="MB">Mulai Berkembang (MB - 2★)</option>
                        <option value="BB">Belum Berkembang (BB - 1★)</option>
                      </select>
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    value={currentDetailReport.merdekaReport?.nilaiAgamaBudiPekerti?.narasi || ''}
                    onChange={e => {
                      const cur = currentDetailReport.merdekaReport!;
                      handleMatrixChange(activeStudent.id, {
                        merdekaReport: {
                          ...cur,
                          nilaiAgamaBudiPekerti: {
                            ...cur.nilaiAgamaBudiPekerti,
                            narasi: e.target.value,
                          },
                        },
                      });
                    }}
                    className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 leading-relaxed"
                    placeholder="Deskripsi narasi capaian..."
                  />
                </div>

                {/* 2. Jati Diri */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      2. Elemen Jati Diri
                    </h4>
                    <div className="flex items-center gap-3">
                      <StarInput
                        value={currentDetailReport.merdekaReport?.jatiDiri?.stars || merdekaScoreToStars(currentDetailReport.merdekaReport?.jatiDiri?.predikat)}
                        onChange={val => {
                          const p = starsToMerdekaScore(val);
                          handleMatrixMerdekaChange(activeStudent.id, 'jatiDiri', p);
                        }}
                        size="sm"
                      />
                      <select
                        value={currentDetailReport.merdekaReport?.jatiDiri?.predikat || 'BSB'}
                        onChange={e =>
                          handleMatrixMerdekaChange(
                            activeStudent.id,
                            'jatiDiri',
                            e.target.value as AssessmentScore
                          )
                        }
                        className={`py-1 px-2.5 rounded-lg text-xs font-bold border outline-none ${merdekaBadgeColor(
                          currentDetailReport.merdekaReport?.jatiDiri?.predikat
                        )}`}
                      >
                        <option value="BSB">Berkembang Sangat Baik (BSB - 4★)</option>
                        <option value="BSH">Berkembang Sesuai Harapan (BSH - 3★)</option>
                        <option value="MB">Mulai Berkembang (MB - 2★)</option>
                        <option value="BB">Belum Berkembang (BB - 1★)</option>
                      </select>
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    value={currentDetailReport.merdekaReport?.jatiDiri?.narasi || ''}
                    onChange={e => {
                      const cur = currentDetailReport.merdekaReport!;
                      handleMatrixChange(activeStudent.id, {
                        merdekaReport: {
                          ...cur,
                          jatiDiri: {
                            ...cur.jatiDiri,
                            narasi: e.target.value,
                          },
                        },
                      });
                    }}
                    className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 leading-relaxed"
                    placeholder="Deskripsi narasi capaian..."
                  />
                </div>

                {/* 3. STEAM */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      3. Elemen Dasar Literasi, Matematika, Sains, Rekayasa & Seni (STEAM)
                    </h4>
                    <div className="flex items-center gap-3">
                      <StarInput
                        value={currentDetailReport.merdekaReport?.literasiSteam?.stars || merdekaScoreToStars(currentDetailReport.merdekaReport?.literasiSteam?.predikat)}
                        onChange={val => {
                          const p = starsToMerdekaScore(val);
                          handleMatrixMerdekaChange(activeStudent.id, 'literasiSteam', p);
                        }}
                        size="sm"
                      />
                      <select
                        value={currentDetailReport.merdekaReport?.literasiSteam?.predikat || 'BSH'}
                        onChange={e =>
                          handleMatrixMerdekaChange(
                            activeStudent.id,
                            'literasiSteam',
                            e.target.value as AssessmentScore
                          )
                        }
                        className={`py-1 px-2.5 rounded-lg text-xs font-bold border outline-none ${merdekaBadgeColor(
                          currentDetailReport.merdekaReport?.literasiSteam?.predikat
                        )}`}
                      >
                        <option value="BSB">Berkembang Sangat Baik (BSB - 4★)</option>
                        <option value="BSH">Berkembang Sesuai Harapan (BSH - 3★)</option>
                        <option value="MB">Mulai Berkembang (MB - 2★)</option>
                        <option value="BB">Belum Berkembang (BB - 1★)</option>
                      </select>
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    value={currentDetailReport.merdekaReport?.literasiSteam?.narasi || ''}
                    onChange={e => {
                      const cur = currentDetailReport.merdekaReport!;
                      handleMatrixChange(activeStudent.id, {
                        merdekaReport: {
                          ...cur,
                          literasiSteam: {
                            ...cur.literasiSteam,
                            narasi: e.target.value,
                          },
                        },
                      });
                    }}
                    className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 leading-relaxed"
                    placeholder="Deskripsi narasi capaian..."
                  />
                </div>
              </div>
            )}

            {/* TAB 3: PROJEK P5 & DDTK FISIK */}
            {detailTab === 'p5_ddtk' && (
              <div className="space-y-6">
                {/* P5 */}
                <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-2">
                    <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                      Projek Penguatan Profil Pelajar Pancasila (P5) & P2RA
                    </h4>
                    <div className="flex items-center gap-3">
                      <StarInput
                        value={currentDetailReport.p5Report?.stars || merdekaScoreToStars(currentDetailReport.p5Report?.predikat)}
                        onChange={val => {
                          const p = starsToMerdekaScore(val);
                          const curP5 = currentDetailReport.p5Report || {
                            tema: 'Aku Sayang Bumi',
                            predikat: p,
                            stars: val,
                            narasi: '',
                          };
                          handleMatrixChange(activeStudent.id, {
                            p5Report: { ...curP5, predikat: p, stars: val },
                          });
                        }}
                        size="sm"
                      />
                      <select
                        value={currentDetailReport.p5Report?.predikat || 'BSB'}
                        onChange={e => {
                          const p = e.target.value as AssessmentScore;
                          const curP5 = currentDetailReport.p5Report || {
                            tema: 'Aku Sayang Bumi',
                            predikat: p,
                            stars: merdekaScoreToStars(p),
                            narasi: '',
                          };
                          handleMatrixChange(activeStudent.id, {
                            p5Report: { ...curP5, predikat: p, stars: merdekaScoreToStars(p) },
                          });
                        }}
                        className={`py-1 px-2.5 rounded-lg text-xs font-bold border outline-none ${merdekaBadgeColor(
                          currentDetailReport.p5Report?.predikat
                        )}`}
                      >
                        <option value="BSB">BSB (4★)</option>
                        <option value="BSH">BSH (3★)</option>
                        <option value="MB">MB (2★)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                        Tema Projek P5:
                      </label>
                      <input
                        type="text"
                        value={currentDetailReport.p5Report?.tema || 'Aku Sayang Bumi (Apotek Hidup & Sahabat Tanaman)'}
                        onChange={e => {
                          const cur = currentDetailReport.p5Report!;
                          handleMatrixChange(activeStudent.id, {
                            p5Report: { ...cur, tema: e.target.value },
                          });
                        }}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                        Subtema Projek:
                      </label>
                      <input
                        type="text"
                        value={currentDetailReport.p5Report?.subtema || 'Merawat Tanaman Herbal Berkah Al Anshor'}
                        onChange={e => {
                          const cur = currentDetailReport.p5Report!;
                          handleMatrixChange(activeStudent.id, {
                            p5Report: { ...cur, subtema: e.target.value },
                          });
                        }}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={currentDetailReport.p5Report?.narasi || ''}
                    onChange={e => {
                      const cur = currentDetailReport.p5Report!;
                      handleMatrixChange(activeStudent.id, {
                        p5Report: { ...cur, narasi: e.target.value },
                      });
                    }}
                    className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl outline-none leading-relaxed"
                    placeholder="Deskripsi keaktifan santri dalam projek..."
                  />
                </div>

                {/* DDTK Fisik */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                    Deteksi Dini Tumbuh Kembang (DDTK) & Kesehatan Fisik
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Tinggi Badan (cm)
                      </label>
                      <input
                        type="number"
                        value={currentDetailReport.ddtkReport?.tinggiBadanCm || 104}
                        onChange={e => {
                          const cur = currentDetailReport.ddtkReport!;
                          handleMatrixChange(activeStudent.id, {
                            ddtkReport: { ...cur, tinggiBadanCm: parseFloat(e.target.value) || 0 },
                          });
                        }}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Berat Badan (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={currentDetailReport.ddtkReport?.beratBadanKg || 16.5}
                        onChange={e => {
                          const cur = currentDetailReport.ddtkReport!;
                          handleMatrixChange(activeStudent.id, {
                            ddtkReport: { ...cur, beratBadanKg: parseFloat(e.target.value) || 0 },
                          });
                        }}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Lingkar Kepala (cm)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={currentDetailReport.ddtkReport?.lingkarKepalaCm || 49}
                        onChange={e => {
                          const cur = currentDetailReport.ddtkReport!;
                          handleMatrixChange(activeStudent.id, {
                            ddtkReport: { ...cur, lingkarKepalaCm: parseFloat(e.target.value) || 0 },
                          });
                        }}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Status Gizi
                      </label>
                      <input
                        type="text"
                        value={currentDetailReport.ddtkReport?.statusGizi || 'Gizi Baik / Normal'}
                        onChange={e => {
                          const cur = currentDetailReport.ddtkReport!;
                          handleMatrixChange(activeStudent.id, {
                            ddtkReport: { ...cur, statusGizi: e.target.value },
                          });
                        }}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Kesehatan Gigi
                      </label>
                      <input
                        type="text"
                        value={currentDetailReport.ddtkReport?.kesehatanGigi || 'Bersih, Terawat'}
                        onChange={e => {
                          const cur = currentDetailReport.ddtkReport!;
                          handleMatrixChange(activeStudent.id, {
                            ddtkReport: { ...cur, kesehatanGigi: e.target.value },
                          });
                        }}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Penglihatan / Pendengaran
                      </label>
                      <input
                        type="text"
                        value={currentDetailReport.ddtkReport?.penglihatan || 'Normal & Peka'}
                        onChange={e => {
                          const cur = currentDetailReport.ddtkReport!;
                          handleMatrixChange(activeStudent.id, {
                            ddtkReport: { ...cur, penglihatan: e.target.value, pendengaran: e.target.value },
                          });
                        }}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PRESENSI, CATATAN & PENGESAHAN */}
            {detailTab === 'catatan' && (
              <div className="space-y-6">
                {/* Rating Bintang Umum Santri Box */}
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                      <span>Rating Bintang Capaian Umum Santri</span>
                    </h4>
                    <p className="text-xs text-amber-800 mt-0.5">
                      Rating ringkasan akumulatif yang dicantumkan pada bagian profil buku rapor santri
                    </p>
                  </div>
                  <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-amber-200 shadow-2xs">
                    <StarInput
                      value={currentDetailReport.overallRatingStars || 4}
                      onChange={val => handleMatrixChange(activeStudent.id, { overallRatingStars: val })}
                      size="md"
                    />
                    <span className="font-bold text-xs text-amber-900">
                      {currentDetailReport.overallRatingStars || 4} dari 4 Bintang
                    </span>
                  </div>
                </div>

                {/* Presensi */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                    Rekapitulasi Kehadiran Santri (Semester Ini)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Hadir (Hari)
                      </label>
                      <input
                        type="number"
                        value={currentDetailReport.attendance?.hadir ?? 58}
                        onChange={e => {
                          handleMatrixChange(activeStudent.id, {
                            attendance: {
                              ...currentDetailReport.attendance!,
                              hadir: parseInt(e.target.value) || 0,
                            },
                          });
                        }}
                        className="w-full text-center px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Sakit (Hari)
                      </label>
                      <input
                        type="number"
                        value={currentDetailReport.attendance?.sakit ?? 1}
                        onChange={e => {
                          handleMatrixChange(activeStudent.id, {
                            attendance: {
                              ...currentDetailReport.attendance!,
                              sakit: parseInt(e.target.value) || 0,
                            },
                          });
                        }}
                        className="w-full text-center px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-bold text-rose-700"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Izin (Hari)
                      </label>
                      <input
                        type="number"
                        value={currentDetailReport.attendance?.izin ?? 0}
                        onChange={e => {
                          handleMatrixChange(activeStudent.id, {
                            attendance: {
                              ...currentDetailReport.attendance!,
                              izin: parseInt(e.target.value) || 0,
                            },
                          });
                        }}
                        className="w-full text-center px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-bold text-amber-700"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Tanpa Ket. (Hari)
                      </label>
                      <input
                        type="number"
                        value={currentDetailReport.attendance?.alpa ?? 0}
                        onChange={e => {
                          handleMatrixChange(activeStudent.id, {
                            attendance: {
                              ...currentDetailReport.attendance!,
                              alpa: parseInt(e.target.value) || 0,
                            },
                          });
                        }}
                        className="w-full text-center px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-bold text-slate-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Catatan Guru & Rekomendasi */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Catatan Guru / Pesan Refleksi Wali Kelas untuk Orang Tua:
                    </label>
                    <textarea
                      rows={3}
                      value={currentDetailReport.teacherNotes || ''}
                      onChange={e => {
                        handleMatrixChange(activeStudent.id, {
                          teacherNotes: e.target.value,
                        });
                      }}
                      className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 leading-relaxed"
                      placeholder="Kalimat apresiasi atas prestasi dan karakter ananda..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Saran Stimulasi & Pendampingan di Rumah:
                    </label>
                    <textarea
                      rows={2}
                      value={currentDetailReport.recommendation || ''}
                      onChange={e => {
                        handleMatrixChange(activeStudent.id, {
                          recommendation: e.target.value,
                        });
                      }}
                      className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 leading-relaxed"
                      placeholder="Saran untuk orang tua dalam membimbing ananda..."
                    />
                  </div>
                </div>

                {/* Info Pengesahan */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Identitas Pengesahan Tanda Tangan
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-slate-500 block">Titimangsa Penerbitan:</span>
                      <strong className="text-slate-800">
                        {currentDetailReport.place || 'Jakarta'}, {currentDetailReport.issueDate || '19 Desember 2025'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Guru / Wali Kelas:</span>
                      <strong className="text-slate-800">
                        {currentDetailReport.teacherSignatureName || 'Nurhasanah, S.Pd'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Kepala Sekolah:</span>
                      <strong className="text-slate-800">
                        {currentDetailReport.principalSignatureName || 'Hj. Siti Maryam, S.Pd.I'}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
