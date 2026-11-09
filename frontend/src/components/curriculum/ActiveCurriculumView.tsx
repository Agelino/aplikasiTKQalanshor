import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, BookOpen, Sparkles, CheckCircle2, Filter, Printer } from 'lucide-react';
import { DevelopmentalAspect } from '../../types';

export const ActiveCurriculumView: React.FC = () => {
  const { activeCurriculum, setActiveTab } = useApp();

  const [selectedSource, setSelectedSource] = useState<'all' | 'pemerintah' | 'tk_khas'>('all');
  const [selectedAspect, setSelectedAspect] = useState<string>('all');

  const filteredComponents = activeCurriculum.components.filter(c => {
    const matchSource = selectedSource === 'all' || c.sourceType === selectedSource;
    const matchAspect = selectedAspect === 'all' || c.aspect === selectedAspect;
    return matchSource && matchAspect;
  });

  const aspects: DevelopmentalAspect[] = [
    'Nilai Agama dan Moral',
    'Fisik/Motorik',
    'Kognitif',
    'Bahasa',
    'Sosial Emosional',
    'Seni',
  ];

  const govCount = activeCurriculum.components.filter(c => c.sourceType === 'pemerintah').length;
  const tkqCount = activeCurriculum.components.filter(c => c.sourceType === 'tk_khas').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <CheckCircle2 className="w-4 h-4" />
            Dokumen Kurikulum Operasional Satuan Pendidikan (KOSP)
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            {activeCurriculum.name}
          </h2>
          <p className="text-xs md:text-sm text-emerald-100/80 mt-1 max-w-2xl leading-relaxed">
            Kurikulum resmi yang aktif digunakan untuk penyusunan Program Semester (Prosem), RPPM, dan penilaian ananda.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('curriculum_builder')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-semibold text-xs shadow-md hover:bg-emerald-50 transition-all"
          >
            <Layers className="w-4 h-4 text-emerald-700" />
            <span>Sesuaikan di Builder</span>
          </button>
        </div>
      </div>

      {/* Composition & Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Tahun Ajaran</span>
          <p className="text-lg font-bold text-slate-900 mt-0.5">{activeCurriculum.academicYear}</p>
          <span className="text-[10px] text-emerald-600 font-medium">{activeCurriculum.semester}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Integrasi Kurikulum</span>
          <p className="text-lg font-bold text-slate-900 mt-0.5">
            {govCount} Nas : {tkqCount} TKQ
          </p>
          <span className="text-[10px] text-slate-500 font-medium">Harmonis & Seimbang</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Total Komponen Aktif</span>
          <p className="text-lg font-bold text-slate-900 mt-0.5">
            {activeCurriculum.components.length} Capaian
          </p>
          <span className="text-[10px] text-teal-600 font-medium">Tersebar di 6 Aspek</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Status Penggunaan</span>
          <p className="text-lg font-bold text-emerald-700 mt-0.5">
            {activeCurriculum.status}
          </p>
          <span className="text-[10px] text-slate-400">Siap untuk Prosem/RPPM</span>
        </div>
      </div>

      {/* Filters & Component List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Filter Capaian Kurikulum
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Sumber */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs">
              <button
                onClick={() => setSelectedSource('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedSource === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Semua Sumber
              </button>
              <button
                onClick={() => setSelectedSource('pemerintah')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedSource === 'pemerintah' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Pemerintah
              </button>
              <button
                onClick={() => setSelectedSource('tk_khas')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedSource === 'tk_khas' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Bustanul Qur'an
              </button>
            </div>

            {/* Filter Aspek */}
            <select
              value={selectedAspect}
              onChange={e => setSelectedAspect(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-emerald-500"
            >
              <option value="all">Semua 6 Aspek Perkembangan</option>
              {aspects.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table / List */}
        <div className="divide-y divide-slate-100">
          {filteredComponents.map((comp, idx) => (
            <div key={comp.id || idx} className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/60 p-3 rounded-xl transition-colors">
              <div className="space-y-1.5 min-w-0 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      comp.sourceType === 'pemerintah'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {comp.sourceType === 'pemerintah' ? (
                      <BookOpen className="w-3 h-3 text-blue-600" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-amber-600" />
                    )}
                    {comp.sourceType === 'pemerintah' ? 'Pemerintah' : "Bustanul Qur'an"}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{comp.element}</span>
                </div>

                <p className="text-xs text-slate-700 leading-snug">
                  <strong className="text-slate-900">Tujuan:</strong> {comp.learningObjective}
                </p>

                <p className="text-[11px] text-slate-500">
                  <strong className="text-slate-600">Materi Pokok:</strong> {comp.material}
                </p>
              </div>

              <div className="flex md:flex-col items-end gap-1 shrink-0 text-right">
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {comp.aspect}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {comp.ageGroup}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
