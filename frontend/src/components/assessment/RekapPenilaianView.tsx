import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, Printer, Users, School } from 'lucide-react';
import { AssessmentScore } from '../../types';

export const RekapPenilaianView: React.FC = () => {
  const {
    students,
    assessmentList,
    classes,
    currentRole,
    currentTeacher,
    currentRombel,
    currentClass,
    accessibleStudents,
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState(
    currentRole === 'guru' && currentClass ? currentClass.id : (classes[0]?.id || 'kelas-a1')
  );

  const classStudents = currentRole === 'guru'
    ? accessibleStudents
    : students.filter(s => s.classId === selectedClassId);

  const selectedClass = classes.find(c => c.id === selectedClassId);

  const aspects = [
    'Nilai Agama & Moral',
    'Fisik Motorik',
    'Kognitif',
    'Bahasa',
    'Sosial Emosional',
    'Seni',
  ];

  // Helper to get dominant score of a student for an aspect
  const getDominantScore = (studentId: string, aspectName: string): AssessmentScore => {
    const records = assessmentList.filter(a => a.studentId === studentId && a.aspect === aspectName);
    if (records.length === 0) return 'BSH'; // Default expected in kindergarten
    return records[records.length - 1].score;
  };

  const scorePills: Record<AssessmentScore, string> = {
    BB: 'bg-rose-50 text-rose-700 border-rose-200',
    MB: 'bg-amber-50 text-amber-700 border-amber-200',
    BSH: 'bg-teal-50 text-teal-700 border-teal-200',
    BSB: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-lg">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                {currentRole === 'guru'
                  ? `Rekapitulasi: ${currentRombel?.fullName || 'Rombel Saya'} (${currentRombel?.className || 'Kelas'})`
                  : 'Rekapitulasi Penilaian Kelas'}
              </h2>
              {currentRole === 'guru' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {accessibleStudents.length} Santri Binaan
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {currentRole === 'guru'
                ? `Matriks capaian santri rombel ${currentRombel?.name || ''} binaan ${currentTeacher?.name}. Rombel lain dikelola oleh guru masing-masing.`
                : 'Matriks capaian perkembangan seluruh murid dalam rombongan belajar'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentRole === 'guru' ? (
            <div className="px-3 py-2 text-xs bg-emerald-50 border border-emerald-200 rounded-xl font-bold text-emerald-800">
              {currentRombel?.fullName || 'Rombel Saya'}
            </div>
          ) : (
            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-700"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs transition-all"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Rekap</span>
          </button>
        </div>
      </div>

      {/* Legend Ribbon */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
        <span className="font-semibold text-slate-800">Keterangan Skala Penilaian:</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /><strong>BB:</strong> Belum Berkembang</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /><strong>MB:</strong> Mulai Berkembang</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-500" /><strong>BSH:</strong> Sesuai Harapan</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><strong>BSB:</strong> Sangat Baik</span>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900">
            {selectedClass?.name} · Wali Kelas: {selectedClass?.teacherName}
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Total {classStudents.length} Siswa Terdaftar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-3 text-center w-12">No</th>
                <th className="py-3 px-3">Nama Siswa</th>
                <th className="py-3 px-3 text-center">NIS</th>
                {aspects.map(asp => (
                  <th key={asp} className="py-3 px-3 text-center">
                    {asp}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((st, idx) => (
                <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 text-center font-mono text-slate-400">{idx + 1}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">
                    {st.name}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-500">{st.nis}</td>

                  {aspects.map(asp => {
                    const score = getDominantScore(st.id, asp);
                    return (
                      <td key={asp} className="py-3 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-md font-bold text-[10px] border ${scorePills[score]}`}>
                          {score}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
