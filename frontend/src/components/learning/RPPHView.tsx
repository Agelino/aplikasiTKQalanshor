import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RPPHItem } from '../../types';
import {
  FileText,
  Printer,
  Sparkles,
  CheckCircle2,
  Calendar,
  Save,
  Clock,
  BookOpen,
  Wrench,
  Edit2,
  Trash2,
  Plus,
  Play,
  Heart,
  Layers,
  Award,
  HelpCircle,
  Coffee,
  RefreshCw,
  ArrowRight,
  X,
  ExternalLink,
  Check,
} from 'lucide-react';

export const RPPHView: React.FC = () => {
  const {
    rpphList,
    rppmList,
    generateRPPHFromRPPM,
    syncRPPMToRPPH,
    saveRPPH,
    deleteRPPH,
    setActiveTab,
    schoolProfile,
    currentRole,
    currentTeacher,
    currentRombel,
  } = useApp();

  const [selectedRpphId, setSelectedRpphId] = useState<string>(rpphList[0]?.id || '');
  const [isEditing, setIsEditing] = useState(false);
  const [editActiveTab, setEditActiveTab] = useState<'identitas' | 'kegiatan' | 'ragam_main' | 'apbq_asesmen'>('identitas');

  // Active RPPH
  const currentRpph = rpphList.find(r => r.id === selectedRpphId) || rpphList[0];

  // Quick generator selector state
  const [genRppmId, setGenRppmId] = useState<string>(rppmList[0]?.id || '');
  const [genDay, setGenDay] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat'>('Senin');
  const [genDate, setGenDate] = useState('2026-09-14');

  // Selected RPPM object for display
  const selectedRppm = rppmList.find(r => r.id === genRppmId) || rppmList[0];
  const sourceRppmOfCurrent = rppmList.find(r => r.id === currentRpph?.rppmId);

  // Edit form state
  const [editData, setEditData] = useState<RPPHItem | null>(null);

  const handleStartEdit = () => {
    if (!currentRpph) return;
    setEditData({ ...currentRpph });
    setEditActiveTab('identitas');
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!editData) return;
    saveRPPH(editData);
    setIsEditing(false);
  };

  const handleQuickGenerateSingleDay = () => {
    const generated = generateRPPHFromRPPM(genRppmId, genDay, genDate);
    setSelectedRpphId(generated.id);
  };

  const handleSyncAllDays = () => {
    const synced = syncRPPMToRPPH(genRppmId, genDate);
    if (synced && synced.length > 0) {
      setSelectedRpphId(synced[0].id);
    }
  };

  const handleToggleStatus = (status: 'Draft' | 'Siap Digunakan' | 'Selesai') => {
    if (!currentRpph) return;
    saveRPPH({ ...currentRpph, status });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-lg">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Rencana Pelaksanaan Pembelajaran Harian (RPPH / Modul Ajar Harian)
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Fase Fondasi & APBQ 2026
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Rincian operasional harian: Pembiasaan Pagi, Pembukaan, 4 Ragam Main Sentra, Istirahat/Makan Beradab, Penutup & Asesmen
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs transition-all"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Dokumen RPPH</span>
          </button>
        </div>
      </div>

      {/* SINKRONISASI DARI RPPM STRIP */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-indigo-950 text-white shadow-xs flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 print:hidden">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-800 text-amber-300 border border-emerald-700 shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-white">Sinkronisasi Data RPPM ke RPPH</p>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-700/60 text-emerald-200 border border-emerald-600/50">
                Otomatisasi KBM
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/90 mt-0.5">
              Tarik seluruh data dari RPPM (Identitas, Pembiasaan, 5 Tahap Pembelajaran, 4 Ragam Main, Asesmen KKTP, & APBQ) langsung ke RPPH.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
          {/* Select RPPM */}
          <div className="flex flex-col">
            <label className="text-[10px] text-emerald-300 font-semibold mb-0.5">RPPM Acuan:</label>
            <select
              value={genRppmId}
              onChange={e => setGenRppmId(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-emerald-950 border border-emerald-700 text-white rounded-lg outline-none font-medium"
            >
              {rppmList.map(r => (
                <option key={r.id} value={r.id}>
                  {r.ageGroup?.includes('Kelompok A') ? '[A]' : '[B]'} Pekan {r.week}: {r.subTopic || r.subtheme}
                </option>
              ))}
            </select>
          </div>

          {/* Select Date */}
          <div className="flex flex-col">
            <label className="text-[10px] text-emerald-300 font-semibold mb-0.5">Tgl Mulai Pekan:</label>
            <input
              type="date"
              value={genDate}
              onChange={e => setGenDate(e.target.value)}
              className="px-2.5 py-1 text-xs bg-emerald-950 border border-emerald-700 text-white rounded-lg outline-none font-medium"
            />
          </div>

          {/* Action 1: Sync All 5 Days */}
          <div className="flex flex-col justify-end">
            <label className="text-[10px] text-transparent select-none mb-0.5">Aksi:</label>
            <button
              onClick={handleSyncAllDays}
              className="px-3.5 py-1.5 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-lg transition-all shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
              title="Sinkronkan seluruh 5 hari (Senin s/d Jumat) sekaligus dari RPPM terpilih"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-900" />
              <span>Sinkronkan 5 Hari (Senin - Jumat)</span>
            </button>
          </div>

          {/* Select Single Day */}
          <div className="flex flex-col">
            <label className="text-[10px] text-emerald-300 font-semibold mb-0.5">Pilih Hari:</label>
            <select
              value={genDay}
              onChange={e => setGenDay(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs bg-emerald-950 border border-emerald-700 text-white rounded-lg outline-none"
            >
              {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map(d => (
                <option key={d} value={d}>
                  Hari {d}
                </option>
              ))}
            </select>
          </div>

          {/* Action 2: Sync Single Day */}
          <div className="flex flex-col justify-end">
            <label className="text-[10px] text-transparent select-none mb-0.5">Single:</label>
            <button
              onClick={handleQuickGenerateSingleDay}
              className="px-3 py-1.5 text-xs font-bold bg-emerald-800 hover:bg-emerald-700 text-emerald-100 border border-emerald-600 rounded-lg transition-all shadow-xs shrink-0 flex items-center gap-1 cursor-pointer"
              title="Sinkronkan hanya 1 hari terpilih saja"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Sinkronkan 1 Hari</span>
            </button>
          </div>
        </div>
      </div>

      {/* RPPH List Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 print:hidden">
        {rpphList.map(rpph => (
          <button
            key={rpph.id}
            onClick={() => setSelectedRpphId(rpph.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              selectedRpphId === rpph.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <span className="font-mono text-[11px]">{rpph.dayName}</span>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${
              selectedRpphId === rpph.id ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {rpph.className.includes('Kelompok A') ? 'Kelompok A' : 'Kelompok B'}
            </span>
            <span className="truncate max-w-[120px] font-normal">{rpph.subtheme}</span>
          </button>
        ))}
      </div>

      {/* Printable Kop Surat */}
      <div className="hidden print:block text-center border-b-2 border-slate-800 pb-3 mb-6">
        <h1 className="text-base font-bold uppercase">{schoolProfile.name}</h1>
        <p className="text-xs">{schoolProfile.address}, {schoolProfile.village}, {schoolProfile.district}, {schoolProfile.regency}</p>
        <p className="text-xs font-mono">NPSN: {schoolProfile.npsn} | Modul Ajar Harian / RPPH Kurikulum Merdeka & APBQ 2026</p>
      </div>

      {currentRpph ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 print:hidden">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs">
                  {currentRpph.dayName}, {currentRpph.date}
                </span>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {currentRpph.className}
                </span>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                  currentRpph.status === 'Selesai'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : currentRpph.status === 'Siap Digunakan'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {currentRpph.status}
                </span>

                {sourceRppmOfCurrent && (
                  <button
                    onClick={() => setActiveTab('rppm')}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Buka dokumen RPPM acuan di menu RPPM"
                  >
                    <RefreshCw className="w-3 h-3 text-emerald-600" />
                    <span>Tersinkron: RPPM Pekan {sourceRppmOfCurrent.week} ({sourceRppmOfCurrent.subTopic || sourceRppmOfCurrent.subtheme})</span>
                    <ExternalLink className="w-2.5 h-2.5 ml-0.5 text-emerald-600" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleStatus('Siap Digunakan')}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
              >
                Set Siap
              </button>
              <button
                onClick={() => handleToggleStatus('Selesai')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
              >
                Set Selesai
              </button>
              <button
                onClick={handleStartEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                title="Edit RPPH Harian"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Ubah RPPH</span>
              </button>
            </div>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Tema & Topik</span>
              <p className="font-bold text-slate-900 mt-0.5">{currentRpph.theme}</p>
              <p className="text-indigo-700 font-semibold">{currentRpph.subtheme}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Rombel & Alokasi Waktu</span>
              <p className="font-bold text-slate-800 mt-0.5">{currentRpph.className}</p>
              <p className="text-slate-500">{currentRpph.alokasiWaktu || '210 Menit (07.00 - 10.30 WIB)'}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Aspek Pembelajaran</span>
              <span className="inline-block mt-1 font-bold text-indigo-800 bg-indigo-100/70 px-2 py-0.5 rounded text-[11px]">
                {currentRpph.aspect}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Tanggal Pelaksanaan</span>
              <p className="font-bold text-slate-800 mt-0.5">{currentRpph.dayName}</p>
              <p className="text-slate-500 font-mono">{currentRpph.date}</p>
            </div>
          </div>

          {/* TP & Alat Bahan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
              <span className="font-bold text-blue-900 flex items-center gap-1.5 mb-1">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                Tujuan Pembelajaran (TP)
              </span>
              <p className="text-slate-700 leading-snug">{currentRpph.learningObjective}</p>
            </div>

            <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100">
              <span className="font-bold text-teal-900 flex items-center gap-1.5 mb-1">
                <Wrench className="w-3.5 h-3.5 text-teal-600" />
                Alat dan Bahan Main
              </span>
              <p className="text-slate-700 leading-snug">{currentRpph.toolsAndMaterials}</p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100">
              <span className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                Indikator Capaian
              </span>
              <p className="text-slate-700 leading-snug">{currentRpph.indicator}</p>
            </div>
          </div>

          {/* APBQ 2026 Integration Block */}
          {currentRpph.apbqDetail && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200/80 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Materi Khas TKQ & APBQ 2026 Hari Ini</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
                <div className="p-2 bg-white/80 rounded-lg border border-emerald-100">
                  <span className="text-[10px] text-slate-400 font-bold block">Tilawati/Iqro:</span>
                  <strong className="text-slate-800">{currentRpph.apbqDetail.tilawati}</strong>
                </div>
                <div className="p-2 bg-white/80 rounded-lg border border-emerald-100">
                  <span className="text-[10px] text-slate-400 font-bold block">Surat Pendek:</span>
                  <strong className="text-slate-800">{currentRpph.apbqDetail.surat}</strong>
                </div>
                <div className="p-2 bg-white/80 rounded-lg border border-emerald-100">
                  <span className="text-[10px] text-slate-400 font-bold block">Doa Harian:</span>
                  <strong className="text-slate-800">{currentRpph.apbqDetail.doa}</strong>
                </div>
                <div className="p-2 bg-white/80 rounded-lg border border-emerald-100">
                  <span className="text-[10px] text-slate-400 font-bold block">Hadits Karakter:</span>
                  <strong className="text-slate-800">{currentRpph.apbqDetail.hadits}</strong>
                </div>
                <div className="p-2 bg-white/80 rounded-lg border border-emerald-100">
                  <span className="text-[10px] text-slate-400 font-bold block">Kosa Kata Arab:</span>
                  <strong className="text-slate-800">{currentRpph.apbqDetail.mufrodat}</strong>
                </div>
              </div>
            </div>
          )}

          {/* TAHAP 1: Pembiasaan Pagi (07.00 - 07.45) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              1. Pembiasaan Pagi Santri (07.00 - 07.45 WIB)
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {(currentRpph.pembiasaanPagi || [
                'SOP Penyambutan ramah anak di gerbang sekolah (5S: Senyum, Salam, Sapa, Sopan, Santun)',
                'Berbaris tertib di halaman, Ikrar santri TKQ, senam ceria motorik anak',
                'Wudhu ceria dan pembiasaan sholat dhuha bersama di musholla',
              ]).map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* TAHAP 2: Pembukaan (07.45 - 08.15) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Play className="w-4 h-4 text-blue-600" />
              2. Kegiatan Pembukaan & Apersepsi (07.45 - 08.15 WIB)
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {currentRpph.opening.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* TAHAP 3: Kegiatan Inti / 4 Ragam Main Sentra (08.15 - 09.30) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                3. Kegiatan Inti / Pilihan 4 Ragam Main Sentra (08.15 - 09.30 WIB)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                Merdeka Bermain
              </span>
            </div>

            {currentRpph.ragamMain ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentRpph.ragamMain.map((rm, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-purple-300 transition-all space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                        {rm.sentra}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">Ragam {idx + 1}</span>
                    </div>
                    <p className="font-bold text-slate-900 text-xs">{rm.namaKegiatan}</p>
                    <p className="text-[11px] text-slate-500"><strong>Alat & Bahan:</strong> {rm.alatBahan}</p>
                    <p className="text-[11px] text-purple-900 bg-purple-50/60 p-1.5 rounded-md"><strong>Tujuan:</strong> {rm.tujuan}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Memahami Konsep</span>
                  <ul className="space-y-1 text-slate-600">
                    {currentRpph.coreActivities.memahami.map((a, i) => (
                      <li key={i}>• {a}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Mengaplikasikan</span>
                  <ul className="space-y-1 text-slate-600">
                    {currentRpph.coreActivities.mengaplikasikan.map((a, i) => (
                      <li key={i}>• {a}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Merefleksikan</span>
                  <ul className="space-y-1 text-slate-600">
                    {currentRpph.coreActivities.merefleksikan.map((a, i) => (
                      <li key={i}>• {a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* TAHAP 4: Istirahat & Makan Bersama Beradab (09.30 - 10.00) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Coffee className="w-4 h-4 text-amber-600" />
              4. Istirahat & Makan Bersama Beradab (09.30 - 10.00 WIB)
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {(currentRpph.istirahatMakan || [
                'Cuci tangan 6 langkah dengan air mengalir dan sabun',
                'Membaca doa sebelum makan, makan bekal dengan tangan kanan sambil duduk',
                'Merapikan kotak bekal dan membuang sampah mandiri',
                'Bermain bebas di luar ruangan dengan pengawasan guru',
              ]).map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* TAHAP 5: Penutup & Refleksi (10.00 - 10.30) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-600" />
              5. Penutup & Refleksi Harian (10.00 - 10.30 WIB)
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {currentRpph.closing.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Asesmen Autentik PAUD */}
          <div className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-100 space-y-2 text-xs">
            <span className="font-bold text-indigo-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Award className="w-4 h-4 text-indigo-600" />
              Rencana Asesmen Autentik PAUD & APBQ 2026
            </span>
            <p className="text-slate-700">{currentRpph.assessmentPlan}</p>
            {currentRpph.asesmenTeknik && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-[11px]">
                <div className="p-2 bg-white rounded border border-indigo-100">
                  <strong className="text-indigo-900 block">Ceklis Perkembangan:</strong>
                  <span className="text-slate-600">{currentRpph.asesmenTeknik.ceklis}</span>
                </div>
                <div className="p-2 bg-white rounded border border-indigo-100">
                  <strong className="text-indigo-900 block">Catatan Anekdot:</strong>
                  <span className="text-slate-600">{currentRpph.asesmenTeknik.catatanAnekdot}</span>
                </div>
                <div className="p-2 bg-white rounded border border-indigo-100">
                  <strong className="text-indigo-900 block">Hasil Karya:</strong>
                  <span className="text-slate-600">{currentRpph.asesmenTeknik.hasilKarya}</span>
                </div>
              </div>
            )}
          </div>

          {/* Teacher Execution Notes */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <span className="font-bold text-slate-800 block">Catatan Guru & Evaluasi Pembelajaran:</span>
            <p className="text-slate-600 italic">
              {currentRpph.teacherNotes || 'Pembelajaran terlaksana dengan baik, anak-anak antusias mengikuti seluruh ragam main.'}
            </p>
          </div>

          {/* Official Signatures for Print */}
          <div className="hidden print:grid grid-cols-2 text-center text-xs pt-8 border-t border-slate-200">
            <div>
              <p>Mengetahui,</p>
              <p className="font-bold">Kepala Sekolah {schoolProfile.name}</p>
              <div className="h-16" />
              <p className="font-bold underline">{schoolProfile.principal}</p>
              <p className="text-[10px] font-mono">NIP: {schoolProfile.principalNip}</p>
            </div>
            <div>
              <p>Depok, September 2026</p>
              <p className="font-bold">Guru Kelas PAUD</p>
              <div className="h-16 flex items-center justify-center">
                {currentTeacher?.signatureImage ? (
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
                {currentTeacher?.name || (currentRpph.className.includes('Kelompok A') ? 'Dewi Lestari, S.Pd' : 'Siti Nurhaliza, S.Pd')}
              </p>
              <p className="text-[10px]">
                {currentRombel ? `Wali ${currentRombel.name} · NIP: ${currentTeacher?.nip || '-'}` : 'Guru Kelas'}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* ========================================================================= */}
      {/* MODAL: EDIT DOKUMEN RPPH LENGKAP                                          */}
      {/* ========================================================================= */}
      {isEditing && editData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Ubah Rencana Pelaksanaan Pembelajaran Harian (RPPH)
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editData.dayName}, {editData.date} • {editData.className} • {editData.subtheme}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 border-b border-slate-100 bg-white overflow-x-auto text-xs font-bold">
              <button
                type="button"
                onClick={() => setEditActiveTab('identitas')}
                className={`pb-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  editActiveTab === 'identitas'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                1. Identitas & Tujuan
              </button>
              <button
                type="button"
                onClick={() => setEditActiveTab('kegiatan')}
                className={`pb-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  editActiveTab === 'kegiatan'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                2. Rincian Kegiatan (5 Tahap)
              </button>
              <button
                type="button"
                onClick={() => setEditActiveTab('ragam_main')}
                className={`pb-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  editActiveTab === 'ragam_main'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                3. Ragam Main Sentra
              </button>
              <button
                type="button"
                onClick={() => setEditActiveTab('apbq_asesmen')}
                className={`pb-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  editActiveTab === 'apbq_asesmen'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                4. Integrasi APBQ & Asesmen
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
              {/* TAB 1: IDENTITAS & TUJUAN */}
              {editActiveTab === 'identitas' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Tema / Topik Utama</label>
                      <input
                        type="text"
                        value={editData.theme}
                        onChange={e => setEditData({ ...editData, theme: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Subtema / Topik Harian</label>
                      <input
                        type="text"
                        value={editData.subtheme}
                        onChange={e => setEditData({ ...editData, subtheme: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Kelas / Rombel</label>
                      <input
                        type="text"
                        value={editData.className}
                        onChange={e => setEditData({ ...editData, className: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Hari</label>
                      <select
                        value={editData.dayName}
                        onChange={e => setEditData({ ...editData, dayName: e.target.value as any })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                      >
                        {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map(d => (
                          <option key={d} value={d}>Hari {d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Tanggal Pelaksanaan</label>
                      <input
                        type="date"
                        value={editData.date}
                        onChange={e => setEditData({ ...editData, date: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Status Dokumen</label>
                      <select
                        value={editData.status}
                        onChange={e => setEditData({ ...editData, status: e.target.value as any })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Siap Digunakan">Siap Digunakan</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Tujuan Pembelajaran (TP)</label>
                    <textarea
                      rows={2}
                      value={editData.learningObjective}
                      onChange={e => setEditData({ ...editData, learningObjective: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Materi Pokok Pembelajaran</label>
                      <textarea
                        rows={2}
                        value={editData.material}
                        onChange={e => setEditData({ ...editData, material: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Alat dan Bahan Main</label>
                      <textarea
                        rows={2}
                        value={editData.toolsAndMaterials}
                        onChange={e => setEditData({ ...editData, toolsAndMaterials: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RINCIAN KEGIATAN */}
              {editActiveTab === 'kegiatan' && (
                <div className="space-y-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">1. Pembiasaan Pagi (07.00 - 07.45 WIB)</label>
                    <textarea
                      rows={3}
                      value={(editData.pembiasaanPagi || []).join('\n')}
                      onChange={e => setEditData({
                        ...editData,
                        pembiasaanPagi: e.target.value.split('\n').filter(Boolean),
                      })}
                      placeholder="Satu baris untuk setiap langkah pembiasaan pagi"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">2. Kegiatan Pembukaan & Apersepsi (07.45 - 08.15 WIB)</label>
                    <textarea
                      rows={3}
                      value={(editData.opening || []).join('\n')}
                      onChange={e => setEditData({
                        ...editData,
                        opening: e.target.value.split('\n').filter(Boolean),
                      })}
                      placeholder="Satu baris untuk setiap poin pembukaan"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <span className="font-bold text-slate-900 block">3. Kegiatan Inti (08.15 - 09.30 WIB)</span>
                    <div>
                      <label className="font-medium text-slate-600 block mb-0.5">• Memahami Konsep:</label>
                      <textarea
                        rows={2}
                        value={editData.coreActivities.memahami.join('\n')}
                        onChange={e => setEditData({
                          ...editData,
                          coreActivities: {
                            ...editData.coreActivities,
                            memahami: e.target.value.split('\n').filter(Boolean),
                          },
                        })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-medium text-slate-600 block mb-0.5">• Mengaplikasikan (Aplikasi Mandiri/Kelompok):</label>
                      <textarea
                        rows={2}
                        value={editData.coreActivities.mengaplikasikan.join('\n')}
                        onChange={e => setEditData({
                          ...editData,
                          coreActivities: {
                            ...editData.coreActivities,
                            mengaplikasikan: e.target.value.split('\n').filter(Boolean),
                          },
                        })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-medium text-slate-600 block mb-0.5">• Merefleksikan:</label>
                      <textarea
                        rows={2}
                        value={editData.coreActivities.merefleksikan.join('\n')}
                        onChange={e => setEditData({
                          ...editData,
                          coreActivities: {
                            ...editData.coreActivities,
                            merefleksikan: e.target.value.split('\n').filter(Boolean),
                          },
                        })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">4. Istirahat & Makan Bersama (09.30 - 10.00 WIB)</label>
                    <textarea
                      rows={3}
                      value={(editData.istirahatMakan || []).join('\n')}
                      onChange={e => setEditData({
                        ...editData,
                        istirahatMakan: e.target.value.split('\n').filter(Boolean),
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">5. Kegiatan Penutup & Refleksi Harian (10.00 - 10.30 WIB)</label>
                    <textarea
                      rows={3}
                      value={(editData.closing || []).join('\n')}
                      onChange={e => setEditData({
                        ...editData,
                        closing: e.target.value.split('\n').filter(Boolean),
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: RAGAM MAIN SENTRA */}
              {editActiveTab === 'ragam_main' && (
                <div className="space-y-4">
                  <p className="text-slate-500">
                    Sesuaikan rincian 4 ragam main yang dapat dipilih atau diikuti secara bergantian oleh santri.
                  </p>

                  {(editData.ragamMain || []).map((rm, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-800 text-xs">Ragam Main {idx + 1}</strong>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                          {rm.sentra}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] text-slate-500 block mb-0.5">Nama Sentra / Area</label>
                          <input
                            type="text"
                            value={rm.sentra}
                            onChange={e => {
                              const updated = [...(editData.ragamMain || [])];
                              updated[idx].sentra = e.target.value;
                              setEditData({ ...editData, ragamMain: updated });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500 block mb-0.5">Nama Kegiatan Main</label>
                          <input
                            type="text"
                            value={rm.namaKegiatan}
                            onChange={e => {
                              const updated = [...(editData.ragamMain || [])];
                              updated[idx].namaKegiatan = e.target.value;
                              setEditData({ ...editData, ragamMain: updated });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] text-slate-500 block mb-0.5">Alat & Bahan</label>
                          <input
                            type="text"
                            value={rm.alatBahan}
                            onChange={e => {
                              const updated = [...(editData.ragamMain || [])];
                              updated[idx].alatBahan = e.target.value;
                              setEditData({ ...editData, ragamMain: updated });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500 block mb-0.5">Tujuan Pembelajaran Kegiatan</label>
                          <input
                            type="text"
                            value={rm.tujuan}
                            onChange={e => {
                              const updated = [...(editData.ragamMain || [])];
                              updated[idx].tujuan = e.target.value;
                              setEditData({ ...editData, ragamMain: updated });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: APBQ & ASESMEN */}
              {editActiveTab === 'apbq_asesmen' && (
                <div className="space-y-4">
                  {/* APBQ Details */}
                  <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200/80 space-y-2">
                    <span className="font-bold text-emerald-950 block">Materi Khas TKQ & APBQ 2026</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-emerald-900 block mb-0.5">Tilawati / Iqro</label>
                        <input
                          type="text"
                          value={editData.apbqDetail?.tilawati || ''}
                          onChange={e => setEditData({
                            ...editData,
                            apbqDetail: { ...editData.apbqDetail, tilawati: e.target.value } as any,
                          })}
                          className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 rounded-lg outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-emerald-900 block mb-0.5">Surat Pendek</label>
                        <input
                          type="text"
                          value={editData.apbqDetail?.surat || ''}
                          onChange={e => setEditData({
                            ...editData,
                            apbqDetail: { ...editData.apbqDetail, surat: e.target.value } as any,
                          })}
                          className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 rounded-lg outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-emerald-900 block mb-0.5">Doa Harian</label>
                        <input
                          type="text"
                          value={editData.apbqDetail?.doa || ''}
                          onChange={e => setEditData({
                            ...editData,
                            apbqDetail: { ...editData.apbqDetail, doa: e.target.value } as any,
                          })}
                          className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 rounded-lg outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-emerald-900 block mb-0.5">Hadits Karakter</label>
                        <input
                          type="text"
                          value={editData.apbqDetail?.hadits || ''}
                          onChange={e => setEditData({
                            ...editData,
                            apbqDetail: { ...editData.apbqDetail, hadits: e.target.value } as any,
                          })}
                          className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 rounded-lg outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[11px] text-emerald-900 block mb-0.5">Kosa Kata / Mufrodat Arab</label>
                        <input
                          type="text"
                          value={editData.apbqDetail?.mufrodat || ''}
                          onChange={e => setEditData({
                            ...editData,
                            apbqDetail: { ...editData.apbqDetail, mufrodat: e.target.value } as any,
                          })}
                          className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 rounded-lg outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Asesmen */}
                  <div className="space-y-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Rencana & Instrumen Asesmen</label>
                      <textarea
                        rows={2}
                        value={editData.assessmentPlan}
                        onChange={e => setEditData({ ...editData, assessmentPlan: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Ceklis Perkembangan</label>
                        <input
                          type="text"
                          value={editData.asesmenTeknik?.ceklis || ''}
                          onChange={e => setEditData({
                            ...editData,
                            asesmenTeknik: { ...editData.asesmenTeknik, ceklis: e.target.value } as any,
                          })}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Catatan Anekdot</label>
                        <input
                          type="text"
                          value={editData.asesmenTeknik?.catatanAnekdot || ''}
                          onChange={e => setEditData({
                            ...editData,
                            asesmenTeknik: { ...editData.asesmenTeknik, catatanAnekdot: e.target.value } as any,
                          })}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Hasil Karya</label>
                        <input
                          type="text"
                          value={editData.asesmenTeknik?.hasilKarya || ''}
                          onChange={e => setEditData({
                            ...editData,
                            asesmenTeknik: { ...editData.asesmenTeknik, hasilKarya: e.target.value } as any,
                          })}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Catatan Guru & Evaluasi</label>
                      <textarea
                        rows={2}
                        value={editData.teacherNotes || ''}
                        onChange={e => setEditData({ ...editData, teacherNotes: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan RPPH</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
