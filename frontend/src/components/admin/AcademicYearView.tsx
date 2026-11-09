import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarRange, CheckCircle2, Save, Plus } from 'lucide-react';
import { AcademicYear } from '../../types';

export const AcademicYearView: React.FC = () => {
  const { academicYear, updateAcademicYear } = useApp();

  const [yearData, setYearData] = useState<AcademicYear>(academicYear);

  const handleSave = () => {
    updateAcademicYear(yearData);
  };

  const handleToggleSemesterStatus = (id: string) => {
    const updated = yearData.semesters.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: s.status === 'Aktif' ? ('Selesai' as const) : ('Aktif' as const),
        };
      }
      return s;
    });
    setYearData({ ...yearData, semesters: updated });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-lg">
            <CalendarRange className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Tahun Ajaran & Semester Aktif</h2>
            <p className="text-xs text-slate-500">
              Konfigurasi periode belajar resmi yang menjadi acuan Prosem, RPPM, dan Rapor
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Konfigurasi</span>
        </button>
      </div>

      {/* Main Year Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Tahun Ajaran Berjalan
            </span>
            <input
              type="text"
              value={yearData.name}
              onChange={e => setYearData({ ...yearData, name: e.target.value })}
              className="text-lg font-bold text-slate-900 mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 outline-none focus:bg-white focus:border-emerald-500"
            />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Status: {yearData.status}
          </span>
        </div>

        {/* Semesters list */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Pengaturan Periode Semester
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {yearData.semesters.map((sem, idx) => (
              <div
                key={sem.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{sem.name}</h4>
                  <button
                    type="button"
                    onClick={() => handleToggleSemesterStatus(sem.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                      sem.status === 'Aktif'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-slate-200 text-slate-600 border-slate-300'
                    }`}
                  >
                    {sem.status}
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">Tanggal Mulai:</label>
                    <input
                      type="date"
                      value={sem.startDate}
                      onChange={e => {
                        const updated = [...yearData.semesters];
                        updated[idx].startDate = e.target.value;
                        setYearData({ ...yearData, semesters: updated });
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 font-medium block mb-1">Tanggal Berakhir:</label>
                    <input
                      type="date"
                      value={sem.endDate}
                      onChange={e => {
                        const updated = [...yearData.semesters];
                        updated[idx].endDate = e.target.value;
                        setYearData({ ...yearData, semesters: updated });
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
