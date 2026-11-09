import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProsemItem, DevelopmentalAspect } from '../../types';
import { Calendar, Plus, Trash2, ClipboardList, X } from 'lucide-react';

export const ProsemView: React.FC = () => {
  const { prosemList, addProsemItem, deleteProsemItem, setActiveTab } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<ProsemItem, 'id'>>({
    academicYear: '2026/2027',
    semester: 'Semester 1',
    curriculumName: 'Kurikulum Terpadu Merdeka & TKQ',
    theme: 'Lingkunganku',
    subtheme: 'Rumahku Surgaku',
    week: prosemList.length + 1,
    learningObjective: 'Mengenal bagian rumah, fungsi, dan adab bertamu',
    material: 'Struktur bangunan rumah, hadits kebersihan',
    activity: 'Melipat kertas bentuk atap rumah, menceritakan ruang favorit',
    aspect: 'Kognitif',
    indicator: 'Anak mampu menyebutkan 4 fungsi ruangan di rumah',
    ageGroup: 'Kelompok B (5-6 th)',
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addProsemItem(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-lg">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Program Semester (Prosem) TK</h2>
            <p className="text-xs text-slate-500">
              Distribusi tema, subtema, alokasi waktu mingguan, dan integrasi Capaian Pembelajaran Kurikulum Aktif
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pekan Tema</span>
        </button>
      </div>

      {/* Prosem Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200/80 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 text-center">Pekan Ke-</th>
                <th className="py-3.5 px-4">Tema Pokok</th>
                <th className="py-3.5 px-4">Subtema & Topik Bahasan</th>
                <th className="py-3.5 px-4">Kelompok Usia</th>
                <th className="py-3.5 px-4">Tujuan & Materi</th>
                <th className="py-3.5 px-4">Rencana Kegiatan</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prosemList.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
                      P{item.week}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {item.theme}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-emerald-800 block">{item.subtheme}</span>
                    <span className="text-[10px] text-slate-400">Aspek: {item.aspect}</span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                    {item.ageGroup}
                  </td>

                  <td className="py-3.5 px-4 max-w-xs text-slate-600 leading-snug">
                    <strong className="text-slate-800 block">{item.learningObjective}</strong>
                    <span className="text-[11px] text-slate-500">Materi: {item.material}</span>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs text-slate-600 leading-snug">
                    {item.activity}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setActiveTab('rppm')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] border border-emerald-200 flex items-center gap-1 transition-colors"
                        title="Buka RPPM Pekan Ini"
                      >
                        <ClipboardList className="w-3.5 h-3.5" />
                        <span>RPPM</span>
                      </button>
                      <button
                        onClick={() => deleteProsemItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus Prosem"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Prosem */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Tambah Pekan Program Semester</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Pekan Ke-</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="20"
                    value={formData.week}
                    onChange={e => setFormData({ ...formData, week: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">Kelompok Usia</label>
                  <input
                    type="text"
                    required
                    value={formData.ageGroup}
                    onChange={e => setFormData({ ...formData, ageGroup: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Tema Pokok *</label>
                <input
                  type="text"
                  required
                  value={formData.theme}
                  onChange={e => setFormData({ ...formData, theme: e.target.value })}
                  placeholder="Contoh: Diriku / Lingkunganku"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Subtema *</label>
                <input
                  type="text"
                  required
                  value={formData.subtheme}
                  onChange={e => setFormData({ ...formData, subtheme: e.target.value })}
                  placeholder="Contoh: Rumahku Surgaku"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Aspek Perkembangan</label>
                <select
                  value={formData.aspect}
                  onChange={e => setFormData({ ...formData, aspect: e.target.value as DevelopmentalAspect })}
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
                <label className="font-medium text-slate-700 block mb-1">Tujuan Pembelajaran</label>
                <textarea
                  rows={2}
                  value={formData.learningObjective}
                  onChange={e => setFormData({ ...formData, learningObjective: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Rencana Ragam Kegiatan</label>
                <textarea
                  rows={2}
                  value={formData.activity}
                  onChange={e => setFormData({ ...formData, activity: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Simpan Prosem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
