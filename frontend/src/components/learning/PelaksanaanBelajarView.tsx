import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RPPHItem } from '../../types';
import {
  Play,
  CheckCircle2,
  Calendar,
  Clock,
  Camera,
  MessageSquare,
  Users,
  Award,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

export const PelaksanaanBelajarView: React.FC = () => {
  const {
    rpphList,
    saveRPPH,
    setActiveTab,
    currentRole,
    currentTeacher,
    currentRombel,
    currentClass,
  } = useApp();

  const [selectedRpphId, setSelectedRpphId] = useState<string>(rpphList[0]?.id || '');
  const rpph = rpphList.find(r => r.id === selectedRpphId) || rpphList[0];

  const [reflectionInput, setReflectionInput] = useState(rpph?.reflection || '');
  const [executedNotesInput, setExecutedNotesInput] = useState(rpph?.executedNotes || '');

  const handleCompleteTeaching = () => {
    if (!rpph) return;
    saveRPPH({
      ...rpph,
      status: 'Selesai',
      reflection: reflectionInput || 'Anak-anak sangat antusias dan bermain aktif.',
      executedNotes: executedNotesInput || 'Seluruh tahapan dari pembukaan hingga penutup terlaksana lancar.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-lg">
            <Play className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                {currentRole === 'guru'
                  ? `Pelaksanaan Belajar: ${currentRombel?.fullName || 'Rombel Saya'}`
                  : 'Pelaksanaan Pembelajaran Harian'}
              </h2>
              {currentRole === 'guru' && currentTeacher && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Guru: {currentTeacher.name} ({currentClass?.name || 'Kelas'})
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {currentRole === 'guru'
                ? `Jurnal pengajaran interaktif rombel ${currentRombel?.name || ''}, panduan rundown kegiatan kelas, refleksi, dan link cepat ke penilaian.`
                : 'Jurnal pengajaran interaktif guru, panduan rundown kegiatan kelas, refleksi, dan link cepat ke penilaian.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedRpphId}
            onChange={e => setSelectedRpphId(e.target.value)}
            className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800"
          >
            {rpphList.map(r => (
              <option key={r.id} value={r.id}>
                {r.dayName}, {r.date} — {r.subtheme}
              </option>
            ))}
          </select>
        </div>
      </div>

      {rpph && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Teaching Flow (2 Cols) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Status Banner */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Status Pelaksanaan Sesi
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      rpph.status === 'Selesai' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                    }`}
                  />
                  <h3 className="text-base font-bold text-slate-900">
                    {rpph.status === 'Selesai' ? 'Pembelajaran Selesai Terlaksana' : 'Sedang Berlangsung / Siap Digunakan'}
                  </h3>
                </div>
              </div>

              {rpph.status !== 'Selesai' ? (
                <button
                  onClick={handleCompleteTeaching}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tandai Selesai Terlaksana</span>
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  Dokumentasi Tersimpan
                </span>
              )}
            </div>

            {/* Teaching Steps Timeline */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
                Rundown & Panduan Guru Mengajar Hari Ini
              </h4>

              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                    01
                  </div>
                  <div className="w-[2px] bg-slate-100 flex-1 my-2" />
                </div>
                <div className="space-y-2 flex-1 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Pembukaan (07.30 - 08.00 WIB)</span>
                    <span className="text-[10px] text-slate-400 font-mono">30 Menit</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {rpph.opening.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                    02
                  </div>
                  <div className="w-[2px] bg-slate-100 flex-1 my-2" />
                </div>
                <div className="space-y-3 flex-1 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Kegiatan Inti Bermain (08.00 - 09.30 WIB)</span>
                    <span className="text-[10px] text-slate-400 font-mono">90 Menit</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                      <strong className="text-blue-900 block mb-0.5">A. Memahami (Literasi & Tanya Jawab)</strong>
                      <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                        {rpph.coreActivities.memahami.map((act, i) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                      <strong className="text-emerald-900 block mb-0.5">B. Mengaplikasikan (Ragam Main & Eksperimen)</strong>
                      <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                        {rpph.coreActivities.mengaplikasikan.map((act, i) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
                      <strong className="text-purple-900 block mb-0.5">C. Merefleksikan (Ekspresi & Rasa Syukur)</strong>
                      <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                        {rpph.coreActivities.merefleksikan.map((act, i) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                    03
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Penutup & Doa Pulang (09.30 - 10.00 WIB)</span>
                    <span className="text-[10px] text-slate-400 font-mono">30 Menit</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {rpph.closing.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Teacher Notes & Quick Action to Assessment (1 Col) */}
          <div className="space-y-5">
            {/* Quick Link to Assessment */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white shadow-sm space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Langkah Lanjutan
              </span>
              <h4 className="text-sm font-bold">Input Penilaian Autentik Anak</h4>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Langsung catat hasil observasi bermain siswa untuk kegiatan hari ini ke modul penilaian.
              </p>
              <button
                onClick={() => setActiveTab('penilaian_harian')}
                className="w-full mt-2 py-2.5 px-3 rounded-xl bg-white text-emerald-900 font-bold text-xs shadow-md hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4 text-emerald-700" />
                <span>Buka Lembar Penilaian</span>
              </button>
            </div>

            {/* Teacher Reflection Form */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4 text-xs">
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
                Catatan Evaluasi & Refleksi Guru
              </h4>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Catatan Pelaksanaan Hari Ini:
                </label>
                <textarea
                  rows={3}
                  value={executedNotesInput}
                  onChange={e => setExecutedNotesInput(e.target.value)}
                  placeholder="Misal: Eksperimen berjalan seru, ananda Arzan dan Nadhira memimpin doa..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 leading-snug"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Refleksi Pendidik (Tindak Lanjut):
                </label>
                <textarea
                  rows={3}
                  value={reflectionInput}
                  onChange={e => setReflectionInput(e.target.value)}
                  placeholder="Misal: Perlu tambahan bahan loose parts untuk kelompok A besok pagi..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 leading-snug"
                />
              </div>

              <button
                onClick={handleCompleteTeaching}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
              >
                Simpan Catatan Guru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
