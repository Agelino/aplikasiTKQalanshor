import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, User, Heart, Award, CheckCircle2, TrendingUp, BookOpen } from 'lucide-react';

export const PerkembanganAnakView: React.FC = () => {
  const {
    students,
    assessmentList,
    currentUser,
    currentStudent,
    setActiveTab,
    currentRole,
    currentTeacher,
    currentRombel,
    accessibleStudents,
  } = useApp();

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

  const defaultStudentId =
    currentUser?.studentId ||
    availableStudents[0]?.id ||
    students[0]?.id ||
    '';

  const [selectedStudentId, setSelectedStudentId] = useState<string>(defaultStudentId);

  const student = availableStudents.find(s => s.id === selectedStudentId) || availableStudents[0] || students[0];

  // Aspects with child's scores and descriptive growth notes
  const aspectEvaluations = [
    {
      aspect: 'Nilai Agama dan Moral',
      score: 'BSB',
      percentage: 95,
      narrative:
        'Anak sangat terbiasa mengucapkan kalimat thayyibah (Bismillah, Alhamdulillah), tertib saat berwudhu dan shalat dhuha berjamaah, serta santun terhadap ustadzah dan teman.',
    },
    {
      aspect: 'Fisik/Motorik',
      score: 'BSH',
      percentage: 82,
      narrative:
        'Motorik halus berkembang sangat baik dalam memegang gunting dan melipat origami. Motorik kasar aktif dan lincah dalam senam irama serta melompat satu kaki.',
    },
    {
      aspect: 'Kognitif',
      score: 'BSB',
      percentage: 92,
      narrative:
        'Mampu memecahkan masalah sederhana, memahami konsep terapung-tenggelam pada eksperimen sains air, serta membilang benda 1-20 secara runtut.',
    },
    {
      aspect: 'Bahasa',
      score: 'BSB',
      percentage: 90,
      narrative:
        'Kaya kosa kata bahasa Indonesia dan mulai mengenali kosa kata bahasa Arab tematik. Berani bercerita di depan kelas mengenai pengalaman liburan.',
    },
    {
      aspect: 'Sosial Emosional',
      score: 'BSH',
      percentage: 85,
      narrative:
        'Menunjukkan sikap empati yang tinggi, bersedia meminjamkan alat main kepada teman, antre dengan sabar saat mencuci tangan.',
    },
    {
      aspect: 'Seni',
      score: 'BSH',
      percentage: 80,
      narrative:
        'Menyukai kegiatan mewarnai dengan perpaduan warna harmonis dan antusias menyanyikan lagu-lagu islami serta nasyid ceria.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Perkembangan Holistik Anak</h2>
            <p className="text-xs text-slate-500">
              Analisis pertumbuhan 6 Aspek Perkembangan & Capaian Khas TKQ per individu siswa
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStudentId}
            onChange={e => setSelectedStudentId(e.target.value)}
            className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800"
          >
            {availableStudents.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.rombelName || s.className})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Child Hero Card */}
      {student && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-xl font-bold">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h3 className="text-lg font-bold">{student.name}</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                  {student.gender}
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-0.5 font-mono">
                NIS: {student.nis} · Rombel: {student.className}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('rapor')}
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs shadow-md hover:bg-emerald-50 transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-emerald-700" />
              <span>Buka Dokumen Rapor Anak</span>
            </button>
          </div>
        </div>
      )}

      {/* 6 Aspects Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aspectEvaluations.map(item => (
          <div
            key={item.aspect}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3 hover:border-emerald-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">{item.aspect}</h4>
                <span className="text-[10px] text-slate-400">Aspek Standar Nasional</span>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                item.score === 'BSB'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-teal-50 text-teal-800 border-teal-200'
              }`}>
                {item.score} ({item.percentage}%)
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${item.percentage}%` }}
              />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {item.narrative}
            </p>
          </div>
        ))}
      </div>

      {/* Islamic TKQ Milestone Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900">
            Capaian Kompetensi Khas TKQ & Karakter Islami
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
            <span className="font-bold text-amber-900 block mb-1">Tahfidz Juz 30</span>
            <p className="text-slate-700">Sudah menguasai An-Nas, Al-Falaq, Al-Ikhlas, dan Al-Lahab dengan makhraj fasih.</p>
            <span className="inline-block mt-2 font-bold text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              Lancar & Mandiri
            </span>
          </div>

          <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200">
            <span className="font-bold text-teal-900 block mb-1">Doa Harian & Adab</span>
            <p className="text-slate-700">Hafal doa sebelum/sesudah makan, masuk/keluar kamar mandi, dan adab berbicara sopan.</p>
            <span className="inline-block mt-2 font-bold text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              Membudaya Harian
            </span>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
            <span className="font-bold text-blue-900 block mb-1">Praktik Ibadah Shalat</span>
            <p className="text-slate-700">Mampu berwudhu secara tertib dan melaksanakan gerakan shalat dhuha 2 rakaat berjamaah.</p>
            <span className="inline-block mt-2 font-bold text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              Sangat Tertib
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
