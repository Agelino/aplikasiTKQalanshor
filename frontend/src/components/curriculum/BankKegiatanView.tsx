import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActivityBankItem, DevelopmentalAspect } from '../../types';
import { Activity, Plus, Trash2, Search, Wrench, CheckCircle, X, Clock } from 'lucide-react';

export const BankKegiatanView: React.FC = () => {
  const { activityBank, addActivityItem, deleteActivityItem } = useApp();

  const [search, setSearch] = useState('');
  const [selectedAspect, setSelectedAspect] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Omit<ActivityBankItem, 'id'>>({
    name: '',
    category: 'Sains & Eksplorasi',
    objective: '',
    aspect: 'Kognitif',
    ageGroup: 'Kelompok B (5-6 th)',
    toolsAndMaterials: ['Baskom air', 'Daun', 'Batu kerikil'],
    durationMinutes: 30,
  });

  const [toolsInput, setToolsInput] = useState('Baskom air, Daun, Batu kerikil');

  const filteredActivities = activityBank.filter(act => {
    const matchSearch =
      act.name.toLowerCase().includes(search.toLowerCase()) ||
      act.objective.toLowerCase().includes(search.toLowerCase()) ||
      act.toolsAndMaterials.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchAspect = selectedAspect === 'all' || act.aspect === selectedAspect;
    return matchSearch && matchAspect;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const splittedTools = toolsInput.split(',').map(s => s.trim()).filter(Boolean);
    addActivityItem({
      ...formData,
      toolsAndMaterials: splittedTools.length ? splittedTools : ['Alat tulis dan kertas'],
    });
    setIsModalOpen(false);
    setFormData({
      name: '',
      category: 'Sains & Eksplorasi',
      objective: '',
      aspect: 'Kognitif',
      ageGroup: 'Kelompok B (5-6 th)',
      toolsAndMaterials: ['Baskom air', 'Daun', 'Batu kerikil'],
      durationMinutes: 30,
    });
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
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-lg">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Bank Kegiatan Pembelajaran Anak</h2>
            <p className="text-xs text-slate-500">
              Repositori ragam main interaktif dengan alat & bahan serta tujuan capaian siap pakai di RPPM/RPPH
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kegiatan Baru</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari kegiatan bermain, alat, tujuan..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
          <span className="text-slate-500 font-medium">Aspek:</span>
          <select
            value={selectedAspect}
            onChange={e => setSelectedAspect(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-700"
          >
            {aspects.map(asp => (
              <option key={asp} value={asp === 'Semua Aspek' ? 'all' : asp}>{asp}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredActivities.map(act => (
          <div
            key={act.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 uppercase tracking-wider">
                  {act.category}
                </span>

                <button
                  onClick={() => deleteActivityItem(act.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
                  title="Hapus Kegiatan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">{act.name}</h3>
                <span className="text-[11px] font-semibold text-emerald-700 block mt-0.5">
                  Aspek: {act.aspect} · {act.ageGroup}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-snug">
                  <strong className="text-slate-800">Tujuan:</strong> {act.objective}
                </p>
                <div className="flex items-start gap-1.5 text-[11px] text-slate-500">
                  <Wrench className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>Alat & Bahan: {act.toolsAndMaterials.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {act.durationMinutes} Menit
              </span>
              <span className="font-semibold text-emerald-600">Siap Pakai di RPPM</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Tambah Kegiatan Pembelajaran Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Nama Kegiatan Main *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Menghitung Kerikil di Wadah"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Kategori</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
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
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Tujuan Pembelajaran *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.objective}
                  onChange={e => setFormData({ ...formData, objective: e.target.value })}
                  placeholder="Kemampuan apa yang ingin dicapai melalui kegiatan ini..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 leading-snug"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Alat & Bahan (Pisahkan koma)</label>
                <input
                  type="text"
                  value={toolsInput}
                  onChange={e => setToolsInput(e.target.value)}
                  placeholder="Contoh: Kertas lipat, Lem, Gunting"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Target Kelompok</label>
                  <input
                    type="text"
                    value={formData.ageGroup}
                    onChange={e => setFormData({ ...formData, ageGroup: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">Durasi (Menit)</label>
                  <input
                    type="number"
                    min="10"
                    max="120"
                    value={formData.durationMinutes}
                    onChange={e => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 30 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-mono"
                  />
                </div>
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
                  Simpan Kegiatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
