import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MaterialBankItem, DevelopmentalAspect } from '../../types';
import { FolderOpen, Plus, Trash2, Search, Tag, X } from 'lucide-react';

export const BankMateriView: React.FC = () => {
  const { materialBank, addMaterialItem, deleteMaterialItem } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Omit<MaterialBankItem, 'id'>>({
    name: '',
    category: 'Sains & Alam',
    description: '',
    curriculumSource: 'Kurikulum Merdeka',
    ageGroup: '4-6 Tahun',
    aspect: 'Kognitif',
    status: 'Aktif',
  });

  const filteredMaterials = materialBank.filter(m => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'all' || m.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addMaterialItem(formData);
    setIsModalOpen(false);
    setFormData({
      name: '',
      category: 'Sains & Alam',
      description: '',
      curriculumSource: 'Kurikulum Merdeka',
      ageGroup: '4-6 Tahun',
      aspect: 'Kognitif',
      status: 'Aktif',
    });
  };

  const categories = ['Semua', 'Sains & Alam', 'Keagamaan / Islam', 'Sosial & Emosional', 'Literasi & Angka', 'Seni & Motorik'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-lg">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Bank Materi Pembelajaran</h2>
            <p className="text-xs text-slate-500">
              Kumpulan materi siap pakai untuk dimasukkan guru ke dalam RPPM dan RPPH
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Materi Baru</span>
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
            placeholder="Cari materi pembelajaran..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === 'Semua' ? 'all' : cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                (selectedCategory === 'all' && cat === 'Semua') || selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Materials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMaterials.map(m => (
          <div
            key={m.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                  {m.category}
                </span>

                <button
                  onClick={() => deleteMaterialItem(m.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
                  title="Hapus Materi"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{m.name}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{m.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>{m.curriculumSource}</span>
              <span className="font-mono">{m.ageGroup}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Tambah Materi Pembelajaran Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Nama Materi *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Eksperimen Sifat-Sifat Air"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                  >
                    <option value="Sains & Alam">Sains & Alam</option>
                    <option value="Keagamaan / Islam">Keagamaan / Islam</option>
                    <option value="Sosial & Emosional">Sosial & Emosional</option>
                    <option value="Literasi & Angka">Literasi & Angka</option>
                    <option value="Seni & Motorik">Seni & Motorik</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">Usia Target</label>
                  <input
                    type="text"
                    value={formData.ageGroup}
                    onChange={e => setFormData({ ...formData, ageGroup: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Sumber Kurikulum</label>
                <input
                  type="text"
                  value={formData.curriculumSource}
                  onChange={e => setFormData({ ...formData, curriculumSource: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Deskripsi & Ruang Lingkup Materi *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Jelaskan konsep, fakta dasar, dan poin yang dipelajari anak..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 leading-snug"
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
                  Simpan Materi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
