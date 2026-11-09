import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AssessmentRecord, AssessmentScore, DevelopmentalAspect } from '../../types';
import {
  ClipboardCheck,
  Plus,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  User,
  Sparkles,
  Award,
} from 'lucide-react';

export const PenilaianView: React.FC = () => {
  const {
    students,
    assessmentList,
    saveAssessment,
    deleteAssessment,
    classes,
    setActiveTab,
    currentRole,
    currentTeacher,
    currentRombel,
    currentClass,
    accessibleStudents,
    showToast,
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState(
    currentRole === 'guru' && currentClass ? currentClass.id : (classes[0]?.id || 'kelas-a1')
  );
  const [search, setSearch] = useState('');
  const [filterScore, setFilterScore] = useState<string>('all');
  const [filterAspect, setFilterAspect] = useState<string>('all');

  // Input form state: scoped to accessible students for teacher
  const classStudents = currentRole === 'guru'
    ? accessibleStudents
    : students.filter(s => s.classId === selectedClassId);

  const [formStudentId, setFormStudentId] = useState(classStudents[0]?.id || students[0]?.id || '');
  const [formDate, setFormDate] = useState('2026-09-08');
  const [formAspect, setFormAspect] = useState<DevelopmentalAspect>('Kognitif');
  const [formActivityName, setFormActivityName] = useState('Eksplorasi Sains: Mengapung & Tenggelam');
  const [formScore, setFormScore] = useState<AssessmentScore>('BSB');
  const [formNotes, setFormNotes] = useState(
    'Anak antusias mencoba mencelupkan daun, batu, dan kayu ke dalam air serta dengan tepat membedakan benda yang mengapung.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === formStudentId);
    if (!st) return;

    saveAssessment({
      date: formDate,
      studentId: st.id,
      studentName: st.name,
      rpphId: 'rpph-1',
      rpphTheme: 'Diriku & Lingkunganku',
      aspect: formAspect,
      activityName: formActivityName,
      indicator: 'Mampu membedakan objek berdasarkan sifat fisik',
      score: formScore,
      observationNotes: formNotes,
    });
    showToast('Observasi Disimpan', `Penilaian untuk ${st.name} skala ${formScore} berhasil dicatat.`, 'success');
  };

  const accessibleStudentIds = new Set(accessibleStudents.map(s => s.id));

  const filteredAssessments = assessmentList.filter(a => {
    if (currentRole === 'guru' && !accessibleStudentIds.has(a.studentId)) {
      return false;
    }
    const matchSearch =
      a.studentName.toLowerCase().includes(search.toLowerCase()) ||
      a.activityName.toLowerCase().includes(search.toLowerCase()) ||
      (a.observationNotes || '').toLowerCase().includes(search.toLowerCase());
    const matchScore = filterScore === 'all' || a.score === filterScore;
    const matchAspect = filterAspect === 'all' || a.aspect === filterAspect;
    return matchSearch && matchScore && matchAspect;
  });

  const scoreBadges: Record<AssessmentScore, { badge: string; label: string }> = {
    BB: { badge: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Belum Berkembang' },
    MB: { badge: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Mulai Berkembang' },
    BSH: { badge: 'bg-teal-50 text-teal-700 border-teal-200', label: 'Berkembang Sesuai Harapan' },
    BSB: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Berkembang Sangat Baik' },
  };

  const aspects: (DevelopmentalAspect | 'Semua Aspek')[] = [
    'Semua Aspek',
    'Nilai Agama dan Moral',
    'Fisik/Motorik',
    'Kognitif',
    'Bahasa',
    'Sosial Emosional',
    'Seni',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-lg">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                {currentRole === 'guru'
                  ? `Penilaian Harian: ${currentRombel?.fullName || 'Rombel Saya'} (${currentRombel?.className || 'Kelas'})`
                  : 'Penilaian Autentik Harian TK'}
              </h2>
              {currentRole === 'guru' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {accessibleStudents.length} Murid Binaan
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {currentRole === 'guru'
                ? `Pencatatan observasi santri binaan ${currentTeacher?.name}. Murid di rombel lain dinilai oleh guru dari rombel masing-masing.`
                : 'Pencatatan observasi capaian 6 aspek perkembangan (BB, MB, BSH, BSB) terhubung ke RPPH'}
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
            onClick={() => setActiveTab('input_rapor')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all"
          >
            <Award className="w-4 h-4" />
            <span>Input Leger & Nilai Rapor</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Input Penilaian (1 Col) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Input Hasil Observasi
            </h3>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
              Live Record
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nama Siswa *</label>
              <select
                value={formStudentId}
                onChange={e => setFormStudentId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-medium"
              >
                {classStudents.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.nis})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tanggal</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={e => setFormDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Skala Capaian *</label>
                <select
                  value={formScore}
                  onChange={e => setFormScore(e.target.value as AssessmentScore)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-bold"
                >
                  <option value="BB">BB - Belum Berkembang</option>
                  <option value="MB">MB - Mulai Berkembang</option>
                  <option value="BSH">BSH - Berkembang Sesuai Harapan</option>
                  <option value="BSB">BSB - Berkembang Sangat Baik</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Aspek Perkembangan *</label>
              <select
                value={formAspect}
                onChange={e => setFormAspect(e.target.value as DevelopmentalAspect)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
              >
                <option value="Nilai Agama dan Moral">Nilai Agama dan Moral</option>
                <option value="Fisik/Motorik">Fisik/Motorik</option>
                <option value="Kognitif">Kognitif</option>
                <option value="Bahasa">Bahasa</option>
                <option value="Sosial Emosional">Sosial Emosional</option>
                <option value="Seni">Seni</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nama Kegiatan Main *</label>
              <input
                type="text"
                required
                value={formActivityName}
                onChange={e => setFormActivityName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Catatan Pengamatan Guru *</label>
              <textarea
                rows={3}
                required
                value={formNotes}
                onChange={e => setFormNotes(e.target.value)}
                placeholder="Deskripsikan fakta yang teramati secara objektif..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 leading-snug"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan Catatan Penilaian</span>
            </button>
          </form>
        </div>

        {/* History / Daftar Penilaian (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Bar */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari siswa, kegiatan, atau catatan..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterScore}
                onChange={e => setFilterScore(e.target.value)}
                className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-700 font-medium"
              >
                <option value="all">Semua Nilai</option>
                <option value="BSB">BSB</option>
                <option value="BSH">BSH</option>
                <option value="MB">MB</option>
                <option value="BB">BB</option>
              </select>

              <select
                value={filterAspect}
                onChange={e => setFilterAspect(e.target.value)}
                className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-700 font-medium"
              >
                {aspects.map(asp => (
                  <option key={asp} value={asp === 'Semua Aspek' ? 'all' : asp}>{asp}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {filteredAssessments.map(record => (
              <div
                key={record.id}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all text-xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{record.studentName}</span>
                      <span className="font-mono text-[10px] text-slate-400">{record.date}</span>
                    </div>
                    <span className="font-semibold text-emerald-800 text-xs block mt-0.5">
                      {record.activityName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                        scoreBadges[record.score].badge
                      }`}
                    >
                      {record.score} — {scoreBadges[record.score].label}
                    </span>
                    <button
                      onClick={() => deleteAssessment(record.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
                      title="Hapus Nilai"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Aspek: {record.aspect}
                  </span>
                </div>

                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-snug">
                  {record.observationNotes}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
