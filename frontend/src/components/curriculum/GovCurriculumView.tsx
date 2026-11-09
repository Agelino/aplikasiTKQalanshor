import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { GovCurriculumItem, DevelopmentalAspect } from '../../types';
import { BookOpen, Plus, Trash2, Edit2, CheckCircle2, X, Filter, ShieldCheck, Heart, Sparkles } from 'lucide-react';

const GOV_ELEMENTS = [
  {
    key: 'Nilai Agama dan Moral',
    label: '1. Nilai Agama dan Moral',
    desc: 'Mengenal Tuhan, ajaran agama, adab sopan santun, doa harian, dan toleransi antar sesama.',
    icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    key: 'Jati Diri',
    label: '2. Jati Diri',
    desc: 'Pengenalan dan pengelolaan emosi diri, kemandirian sosial, serta motorik kasar dan halus.',
    icon: <Heart className="w-4 h-4 text-blue-600" />,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    key: 'Dasar-Dasar Literasi',
    label: '3. Dasar-Dasar Literasi',
    desc: 'Literasi awal, kecakapan bahasa, pra-matematika, eksplorasi sains, teknologi, dan seni.',
    icon: <Sparkles className="w-4 h-4 text-purple-600" />,
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
  },
];

export const GovCurriculumView: React.FC = () => {
  const { govCurriculum, addGovCurriculum, updateGovCurriculum, deleteGovCurriculum } = useApp();

  const [activeElementFilter, setActiveElementFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GovCurriculumItem | null>(null);

  const [formData, setFormData] = useState<Omit<GovCurriculumItem, 'id'>>({
    curriculumName: 'Kurikulum Merdeka PAUD',
    year: '2026',
    version: 'Kemendikbudristek Rev. 2026',
    element: 'Nilai Agama dan Moral',
    learningOutcome: '',
    learningObjective: '',
    material: '',
    indicator: '',
    aspect: 'Nilai Agama dan Moral',
    ageGroup: 'Kelompok B (5-6 th)',
    status: 'Aktif',
  });

  const filteredItems = useMemo(() => {
    if (activeElementFilter === 'all') return govCurriculum;
    return govCurriculum.filter(item => item.element.toLowerCase().includes(activeElementFilter.toLowerCase()));
  }, [govCurriculum, activeElementFilter]);

  const handleOpenAdd = (defaultElement?: string) => {
    setEditingItem(null);
    const chosenElement = defaultElement && defaultElement !== 'all' ? defaultElement : 'Nilai Agama dan Moral';
    setFormData({
      curriculumName: 'Kurikulum Merdeka PAUD',
      year: '2026',
      version: 'Kemendikbudristek Rev. 2026',
      element: chosenElement,
      learningOutcome: '',
      learningObjective: '',
      material: '',
      indicator: '',
      aspect: chosenElement === 'Nilai Agama dan Moral' ? 'Nilai Agama dan Moral' : chosenElement === 'Jati Diri' ? 'Sosial Emosional' : 'Bahasa',
      ageGroup: 'Kelompok B (5-6 th)',
      status: 'Aktif',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GovCurriculumItem) => {
    setEditingItem(item);
    setFormData({
      curriculumName: item.curriculumName,
      year: item.year,
      version: item.version,
      element: item.element,
      learningOutcome: item.learningOutcome,
      learningObjective: item.learningObjective,
      material: item.material,
      indicator: item.indicator,
      aspect: item.aspect,
      ageGroup: item.ageGroup,
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus komponen kurikulum pemerintah ini?')) {
      deleteGovCurriculum(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateGovCurriculum({ ...formData, id: editingItem.id });
    } else {
      addGovCurriculum(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-lg shadow-xs">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Kurikulum Pemerintah (Standar Nasional PAUD)</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                3 Elemen Pokok
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Struktur muatan resmi Capaian Pembelajaran (CP) Kurikulum Merdeka PAUD: <b>Nilai Agama dan Moral</b>, <b>Jati Diri</b>, dan <b>Dasar-Dasar Literasi</b>
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenAdd(activeElementFilter)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Komponen Standar</span>
        </button>
      </div>

      {/* 3 Elemen Card Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {GOV_ELEMENTS.map(el => {
          const count = govCurriculum.filter(c => c.element.toLowerCase().includes(el.key.toLowerCase())).length;
          const isSelected = activeElementFilter === el.key;
          return (
            <div
              key={el.key}
              onClick={() => setActiveElementFilter(isSelected ? 'all' : el.key)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500/30'
                  : 'bg-white hover:border-slate-300 border-slate-200/80 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${isSelected ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100'}`}>
                  {el.icon}
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'}`}>
                  {count} Capaian
                </span>
              </div>
              <h3 className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>{el.label}</h3>
              <p className={`text-[11px] mt-1 leading-snug line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                {el.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Element Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-100 rounded-xl">
        <button
          onClick={() => setActiveElementFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeElementFilter === 'all'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Semua Elemen ({govCurriculum.length})</span>
        </button>
        {GOV_ELEMENTS.map(el => (
          <button
            key={el.key}
            onClick={() => setActiveElementFilter(el.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeElementFilter === el.key
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {el.label}
          </button>
        ))}
      </div>

      {/* Grid of Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map(item => {
          const matchedEl = GOV_ELEMENTS.find(e => item.element.toLowerCase().includes(e.key.toLowerCase())) || GOV_ELEMENTS[0];
          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${matchedEl.badgeColor}`}>
                    {item.element}
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
                    Capaian Pembelajaran (CP):
                  </span>
                  <p className="text-xs font-semibold text-slate-800 mt-0.5 leading-snug">{item.learningOutcome}</p>
                </div>

                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Tujuan Pembelajaran (TP):
                    </span>
                    <p className="text-slate-700 mt-0.5 leading-snug">{item.learningObjective}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Materi Pokok:
                    </span>
                    <p className="text-slate-700 mt-0.5 font-medium">{item.material}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Indikator Ketercapaian:
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
                {editingItem ? 'Ubah Komponen Kurikulum Standar' : 'Tambah Komponen Kurikulum Standar Nasional'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Elemen Kurikulum Pemerintah (3 Elemen Resmi) *
                </label>
                <select
                  required
                  value={formData.element}
                  onChange={e => {
                    const el = e.target.value;
                    setFormData({
                      ...formData,
                      element: el,
                      aspect: el === 'Nilai Agama dan Moral' ? 'Nilai Agama dan Moral' : el === 'Jati Diri' ? 'Sosial Emosional' : 'Bahasa',
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-medium text-slate-800"
                >
                  <option value="Nilai Agama dan Moral">1. Nilai Agama dan Moral</option>
                  <option value="Jati Diri">2. Jati Diri</option>
                  <option value="Dasar-Dasar Literasi">3. Dasar-Dasar Literasi (Literasi, Numerasi, Sains & Seni)</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">Sesuai Kepmendikbudristek Standar Kurikulum Merdeka PAUD</p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Capaian Pembelajaran (CP) *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.learningOutcome}
                  onChange={e => setFormData({ ...formData, learningOutcome: e.target.value })}
                  placeholder="Contoh: Anak mengenali dan mempraktikkan nilai ajaran agama serta budi pekerti dalam kehidupan sehari-hari."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tujuan Pembelajaran (TP) *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.learningObjective}
                  onChange={e => setFormData({ ...formData, learningObjective: e.target.value })}
                  placeholder="Contoh: Anak terbiasa berdoa dengan khusyuk sebelum dan sesudah beraktivitas."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Materi Pokok *</label>
                  <input
                    type="text"
                    required
                    value={formData.material}
                    onChange={e => setFormData({ ...formData, material: e.target.value })}
                    placeholder="Contoh: Doa harian, adab santun"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kelompok Usia</label>
                  <select
                    value={formData.ageGroup}
                    onChange={e => setFormData({ ...formData, ageGroup: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                  >
                    <option value="Kelompok A (4-5 th)">Kelompok A (4-5 Tahun)</option>
                    <option value="Kelompok B (5-6 th)">Kelompok B (5-6 Tahun)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Indikator Ketercapaian</label>
                <input
                  type="text"
                  value={formData.indicator}
                  onChange={e => setFormData({ ...formData, indicator: e.target.value })}
                  placeholder="Contoh: Mengucapkan doa pembuka belajar dengan khusyuk"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                />
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
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm cursor-pointer"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Tambahkan Komponen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
