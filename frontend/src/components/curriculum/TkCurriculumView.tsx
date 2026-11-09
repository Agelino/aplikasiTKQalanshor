import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TkCurriculumItem } from '../../types';
import { Sparkles, Plus, Trash2, Edit2, CheckCircle2, X, Star, BookOpen, Heart, Award, Filter } from 'lucide-react';

const BUSTANUL_QURAN_PILARS = [
  {
    key: 'Tilawah',
    label: '1. Tilawah',
    desc: 'Metode Tilawati PAUD, pengenalan huruf hijaiyah, fashohah makharijul huruf, dan ketukan tartil.',
    icon: <BookOpen className="w-4 h-4 text-emerald-600" />,
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  {
    key: 'Tahfidz',
    label: '2. Tahfidz',
    desc: 'Hafalan surat-surat pendek Juz 30 (An-Naas s/d Al-Fil), muroja’ah harian, dan sambung ayat.',
    icon: <Award className="w-4 h-4 text-amber-600" />,
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  {
    key: 'Hikmah',
    label: '3. Hikmah',
    desc: 'Doa harian santun, 5 hadits adab & karakter, serta praktik ibadah wudhu dan sholat dhuha.',
    icon: <Heart className="w-4 h-4 text-blue-600" />,
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
  },
];

export const TkCurriculumView: React.FC = () => {
  const { tkCurriculum, addTkCurriculum, updateTkCurriculum, deleteTkCurriculum } = useApp();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TkCurriculumItem | null>(null);

  const [formData, setFormData] = useState<Omit<TkCurriculumItem, 'id'>>({
    curriculumName: "Kurikulum Bustanul Qur'an",
    category: 'Tilawah',
    competency: '',
    objective: '',
    material: '',
    activity: '',
    indicator: '',
    aspect: 'Nilai Agama dan Moral',
    ageGroup: 'Kelompok B (5-6 th)',
    description: '',
    status: 'Aktif',
  });

  const filteredItems = useMemo(() => {
    if (activeCategoryFilter === 'all') return tkCurriculum;
    return tkCurriculum.filter(item => item.category.toLowerCase().includes(activeCategoryFilter.toLowerCase()));
  }, [tkCurriculum, activeCategoryFilter]);

  const handleOpenAdd = (defaultCat?: string) => {
    setEditingItem(null);
    const chosenCat = defaultCat && defaultCat !== 'all' ? defaultCat : 'Tilawah';
    setFormData({
      curriculumName: "Kurikulum Bustanul Qur'an",
      category: chosenCat,
      competency: '',
      objective: '',
      material: '',
      activity: '',
      indicator: '',
      aspect: 'Nilai Agama dan Moral',
      ageGroup: 'Kelompok B (5-6 th)',
      description: '',
      status: 'Aktif',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: TkCurriculumItem) => {
    setEditingItem(item);
    setFormData({
      curriculumName: item.curriculumName,
      category: item.category,
      competency: item.competency,
      objective: item.objective,
      material: item.material,
      activity: item.activity,
      indicator: item.indicator,
      aspect: item.aspect,
      ageGroup: item.ageGroup,
      description: item.description,
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Yakin ingin menghapus komponen Kurikulum Bustanul Qur'an ini?")) {
      deleteTkCurriculum(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateTkCurriculum({ ...formData, id: editingItem.id });
    } else {
      addTkCurriculum(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Kurikulum Bustanul Qur'an (Khas TKQ)</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                3 Pilar Utama
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Pilar Pendidikan Al-Qur'an dan Karakter Khas Lembaga TKQ: <b>Tilawah</b>, <b>Tahfidz</b>, dan <b>Hikmah</b>
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenAdd(activeCategoryFilter)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pilar Bustanul Qur'an</span>
        </button>
      </div>

      {/* 3 Pilar Card Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {BUSTANUL_QURAN_PILARS.map(pilar => {
          const count = tkCurriculum.filter(c => c.category.toLowerCase().includes(pilar.key.toLowerCase())).length;
          const isSelected = activeCategoryFilter === pilar.key;
          return (
            <div
              key={pilar.key}
              onClick={() => setActiveCategoryFilter(isSelected ? 'all' : pilar.key)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-500/30'
                  : 'bg-white hover:border-slate-300 border-slate-200/80 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${isSelected ? 'bg-slate-800 text-amber-400' : 'bg-slate-100'}`}>
                  {pilar.icon}
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'}`}>
                  {count} Kompetensi
                </span>
              </div>
              <h3 className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>{pilar.label}</h3>
              <p className={`text-[11px] mt-1 leading-snug line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                {pilar.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-100 rounded-xl">
        <button
          onClick={() => setActiveCategoryFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategoryFilter === 'all'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Semua Pilar ({tkCurriculum.length})</span>
        </button>
        {BUSTANUL_QURAN_PILARS.map(pilar => (
          <button
            key={pilar.key}
            onClick={() => setActiveCategoryFilter(pilar.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeCategoryFilter === pilar.key
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {pilar.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map(item => {
          const matchedPilar = BUSTANUL_QURAN_PILARS.find(p => item.category.toLowerCase().includes(p.key.toLowerCase())) || BUSTANUL_QURAN_PILARS[0];
          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${matchedPilar.badgeColor}`}>
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    {item.category}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      title="Ubah"
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Hapus"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Kompetensi Pokok:
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 leading-snug mt-0.5">{item.competency}</h3>
                </div>

                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Tujuan Pembelajaran:
                    </span>
                    <p className="text-slate-700 mt-0.5 leading-snug">{item.objective}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Materi & Media:
                    </span>
                    <p className="text-slate-700 mt-0.5 font-medium">{item.material}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Kegiatan Unggulan:
                    </span>
                    <p className="text-slate-700 mt-0.5">{item.activity}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Indikator Capaian Santri:
                    </span>
                    <p className="text-slate-600 mt-0.5 italic">{item.indicator}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium text-[11px]">{item.ageGroup}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {item.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {editingItem ? "Ubah Kompetensi Bustanul Qur'an" : "Tambah Kompetensi Bustanul Qur'an (Khas TKQ)"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Pilar Bustanul Qur'an (3 Pilar Resmi) *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-amber-500 font-medium text-slate-800"
                >
                  <option value="Tilawah">1. Tilawah (Metode Tilawati, Makharijul Huruf, Fashohah)</option>
                  <option value="Tahfidz">2. Tahfidz (Hafalan Surat Pendek Juz 30, Muroja'ah)</option>
                  <option value="Hikmah">3. Hikmah (Doa Harian, Hadits Adab, Praktik Sholat & Wudhu)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Kompetensi Khas *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.competency}
                  onChange={e => setFormData({ ...formData, competency: e.target.value })}
                  placeholder="Contoh: Pengenalan & Pelafalan Huruf Hijaiyah Berharakat (Tilawati PAUD Jilid 1 & 2)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tujuan Pembelajaran *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.objective}
                  onChange={e => setFormData({ ...formData, objective: e.target.value })}
                  placeholder="Contoh: Santri mampu melafalkan huruf hijaiyah dengan makhraj jelas dan tartil."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Materi & Alat Bahan</label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={e => setFormData({ ...formData, material: e.target.value })}
                    placeholder="Contoh: Buku Tilawati, kartu ayat visual"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kegiatan Unggulan</label>
                  <input
                    type="text"
                    value={formData.activity}
                    onChange={e => setFormData({ ...formData, activity: e.target.value })}
                    placeholder="Contoh: Talaqqi Pagi & Sambung Ayat"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Indikator Ketercapaian</label>
                  <input
                    type="text"
                    value={formData.indicator}
                    onChange={e => setFormData({ ...formData, indicator: e.target.value })}
                    placeholder="Contoh: Menghafal Surat Al-Falaq mandiri"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kelompok Usia</label>
                  <select
                    value={formData.ageGroup}
                    onChange={e => setFormData({ ...formData, ageGroup: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-amber-500"
                  >
                    <option value="Kelompok A (4-5 th)">Kelompok A (4-5 Tahun)</option>
                    <option value="Kelompok B (5-6 th)">Kelompok B (5-6 Tahun)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-sm cursor-pointer"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Tambahkan ke Bustanul Quran'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
