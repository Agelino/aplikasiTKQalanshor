import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Sparkles, Filter, CheckCircle2, Star, HeartHandshake } from 'lucide-react';
import { AssessmentScore } from '../../types';
import { StarDisplay, merdekaScoreToStars } from '../common/StarRating';

export const StudentAssessmentsView: React.FC = () => {
  const { students, assessmentList, currentUser, currentStudent, switchStudent, setActiveTab } = useApp();

  const student = currentStudent || students.find(s => s.id === currentUser?.studentId) || students[0];
  const records = assessmentList.filter(a => a.studentId === student?.id);

  const [selectedAspect, setSelectedAspect] = useState<string>('all');

  const filtered = records.filter(r => selectedAspect === 'all' || r.aspect === selectedAspect);

  const scoreBadges: Record<AssessmentScore, { badge: string; label: string }> = {
    BB: { badge: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Belum Berkembang' },
    MB: { badge: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Mulai Berkembang' },
    BSH: { badge: 'bg-teal-50 text-teal-700 border-teal-200', label: 'Berkembang Sesuai Harapan' },
    BSB: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Berkembang Sangat Baik' },
  };

  const aspects = [
    'Semua Aspek',
    'Nilai Agama dan Moral',
    'Fisik/Motorik',
    'Kognitif',
    'Bahasa',
    'Sosial Emosional',
    'Seni',
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-lg">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Catatan Observasi Belajar Ananda</h2>
            <p className="text-xs text-slate-500">
              Dokumentasi capaian bermain dan belajar yang dinilai langsung oleh Guru Kelas
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('catatan_guru_anak')}
            className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-amber-700" />
            <span>Lihat Catatan Guru</span>
          </button>
          <button
            onClick={() => setActiveTab('portal_rapor')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
          >
            Lihat Buku Rapor Lengkap
          </button>
        </div>
      </div>

      {/* Filter and stats */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-700">Filter Aspek:</span>
          <select
            value={selectedAspect}
            onChange={e => setSelectedAspect(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-800"
          >
            {aspects.map(a => (
              <option key={a} value={a === 'Semua Aspek' ? 'all' : a}>{a}</option>
            ))}
          </select>
        </div>

        <span className="text-xs font-medium text-slate-500">
          Menampilkan {filtered.length} catatan observasi
        </span>
      </div>

      {/* Assessment Cards */}
      <div className="space-y-3">
        {filtered.map(record => (
          <div
            key={record.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2 hover:border-emerald-300 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{record.activityName}</span>
                <span className="text-[10px] text-slate-400">·</span>
                <span className="text-xs font-mono text-slate-500">{record.date}</span>
              </div>

              <div className="flex items-center gap-2">
                <StarDisplay stars={merdekaScoreToStars(record.score)} size="xs" />
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${scoreBadges[record.score].badge}`}>
                  {record.score} — {scoreBadges[record.score].label}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {record.aspect}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              <strong className="text-slate-700">Catatan Observasi Guru:</strong> {record.observationNotes}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
