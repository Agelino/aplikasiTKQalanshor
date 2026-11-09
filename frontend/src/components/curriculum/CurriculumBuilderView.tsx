import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveCurriculum, ActiveCurriculumComponent } from '../../types';
import {
  Layers,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Sparkles,
  Save,
  Check,
  Building2,
  Award,
} from 'lucide-react';

export const CurriculumBuilderView: React.FC = () => {
  const {
    govCurriculum,
    tkCurriculum,
    activeCurriculum,
    saveActiveCurriculum,
    setActiveTab,
  } = useApp();

  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Meta (Proporsi Integrasi Pembelajaran dihapus sesuai instruksi)
  const [curriculumName, setCurriculumName] = useState(
    activeCurriculum.name || "Kurikulum Terpadu Merdeka & Bustanul Qur'an"
  );
  const [academicYear, setAcademicYear] = useState('2026/2027');
  const [semester, setSemester] = useState('Semester 1 & 2');
  const [description, setDescription] = useState(
    "Integrasi Kurikulum Pemerintah Standar PAUD (Nilai Agama & Moral, Jati Diri, Dasar Literasi) dan Kurikulum Khas Bustanul Qur'an (Tilawah, Tahfidz, Hikmah)."
  );

  // Step 2: Selected Gov components (IDs)
  const [selectedGovIds, setSelectedGovIds] = useState<string[]>(
    govCurriculum.map(g => g.id)
  );

  // Step 3: Selected Bustanul Qur'an components (IDs)
  const [selectedTkqIds, setSelectedTkqIds] = useState<string[]>(
    tkCurriculum.map(t => t.id)
  );

  // Step 4: Custom notes per aspect
  const [aspectNotes, setAspectNotes] = useState<Record<string, string>>({
    'Nilai Agama dan Moral': 'Penguatan tilawah talaqqi, sholat dhuha berjamaah dan hafalan surat pendek setiap pagi',
    'Fisik/Motorik': 'Eksplorasi sensorik motorik halus melalui gunting pola, meronce, dan senam irama',
    'Kognitif': 'Eksplorasi pra-matematika membilang benda, bentuk geometri, dan sains air sederhana',
    'Bahasa': 'Literasi cerita bergambar anak, kosa kata thoyyibah, dan mufrodat tematik',
    'Sosial Emosional': 'Membiasakan antre tertib, berbagi alat main, dan adab 5S (Senyum, Salam, Sapa, Sopan, Santun)',
    'Seni': 'Kreativitas membuat kolase bahan alam, mewarnai teratur, dan nasyid islami',
  });

  const handleToggleGov = (id: string) => {
    setSelectedGovIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleToggleTkq = (id: string) => {
    setSelectedTkqIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Compile final ActiveCurriculum object
  const buildCombinedCurriculum = (): ActiveCurriculum => {
    const components: ActiveCurriculumComponent[] = [];
    let orderCounter = 1;

    // Include selected Gov items (3 Elemen: Nilai Agama & Moral, Jati Diri, Dasar Literasi)
    govCurriculum
      .filter(g => selectedGovIds.includes(g.id))
      .forEach(g => {
        components.push({
          id: `act-gov-${g.id}`,
          sourceType: 'pemerintah',
          sourceTitle: `Kurikulum Merdeka (${g.element})`,
          element: g.element,
          learningOutcomeOrCompetency: g.learningOutcome,
          learningObjective: g.learningObjective,
          material: g.material,
          indicator: g.indicator,
          aspect: g.aspect,
          ageGroup: g.ageGroup,
          order: orderCounter++,
        });
      });

    // Include selected Bustanul Qur'an items (3 Pilar: Tilawah, Tahfidz, Hikmah)
    tkCurriculum
      .filter(t => selectedTkqIds.includes(t.id))
      .forEach(t => {
        components.push({
          id: `act-bq-${t.id}`,
          sourceType: 'tk_khas',
          sourceTitle: `Bustanul Qur'an (${t.category})`,
          element: t.category,
          learningOutcomeOrCompetency: t.competency,
          learningObjective: t.objective,
          material: t.material,
          indicator: t.indicator,
          aspect: t.aspect,
          activity: t.activity,
          ageGroup: t.ageGroup,
          order: orderCounter++,
        });
      });

    return {
      id: `curr-active-${Date.now()}`,
      name: curriculumName,
      academicYear,
      semester,
      status: 'Aktif',
      lastUpdated: new Date().toISOString().split('T')[0],
      sourcesIncluded: ['Kurikulum Pemerintah', "Bustanul Qur'an"],
      components,
    };
  };

  const handleFinalSave = () => {
    const finalCurriculum = buildCombinedCurriculum();
    saveActiveCurriculum(finalCurriculum);
    setActiveTab('kurikulum_aktif');
  };

  const steps = [
    { num: 1, title: 'Identitas Kurikulum', desc: 'Nama & Keterangan' },
    { num: 2, title: 'Kurikulum Pemerintah', desc: '3 Elemen Standar' },
    { num: 3, title: "Bustanul Qur'an", desc: 'Tilawah, Tahfidz, Hikmah' },
    { num: 4, title: 'Pemetaan 6 Aspek', desc: 'Integrasi Perkembangan' },
    { num: 5, title: 'Finalisasi & Pratinjau', desc: 'Aktifkan Dokumen' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Curriculum Builder (Penyusun Kurikulum Terpadu)</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Integrasi Terpadu
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Penggabungan menyeluruh <b>Kurikulum Pemerintah</b> (Nilai Agama & Moral, Jati Diri, Dasar Literasi) + <b>Kurikulum Bustanul Qur'an</b> (Tilawah, Tahfidz, Hikmah)
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('kurikulum_aktif')}
          className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
        >
          <span>Lihat Kurikulum Aktif</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stepper Progress Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[620px]">
          {steps.map(step => {
            const isDone = currentStep > step.num;
            const isCurrent = currentStep === step.num;

            return (
              <div
                key={step.num}
                onClick={() => setCurrentStep(step.num)}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-emerald-700 text-white ring-4 ring-emerald-100 shadow-sm'
                      : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : step.num}
                </div>
                <div>
                  <p
                    className={`text-xs font-bold leading-tight ${
                      isCurrent ? 'text-emerald-800' : isDone ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-[10px] text-slate-400">{step.desc}</p>
                </div>
                {step.num < 5 && (
                  <div className="w-8 h-[2px] bg-slate-200 mx-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Basic Information & Composition (Proporsi Slider Dihapus) */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Langkah 1: Identitas & Struktur Kurikulum Terpadu</h3>
            <p className="text-xs text-slate-500">Tentukan nama dokumen kurikulum operasional yang memadukan Kurikulum Pemerintah dan Bustanul Qur'an</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-1.5 md:col-span-2">
              <label className="font-semibold text-slate-700 block">Nama Kurikulum Operasional Terpadu *</label>
              <input
                type="text"
                value={curriculumName}
                onChange={e => setCurriculumName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-semibold text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Tahun Ajaran Implementasi *</label>
              <input
                type="text"
                value={academicYear}
                onChange={e => setAcademicYear(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Semester Pelaksanaan *</label>
              <input
                type="text"
                value={semester}
                onChange={e => setSemester(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="font-semibold text-slate-700 block">Deskripsi Integrasi Pembelajaran</label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 text-slate-700"
              />
            </div>
          </div>

          {/* Dual Sources Visual Representation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-blue-700" />
                <h4 className="font-bold text-blue-900">Kurikulum Pemerintah (3 Elemen)</h4>
              </div>
              <ul className="list-disc list-inside text-blue-800 space-y-1">
                <li><b>Nilai Agama dan Moral</b>: Akidah, ibadah, toleransi, budi pekerti</li>
                <li><b>Jati Diri</b>: Emosional, sosial kemandirian, fisik & motorik</li>
                <li><b>Dasar-Dasar Literasi</b>: Bahasa, pra-matematika, sains & seni</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <h4 className="font-bold text-amber-900">Kurikulum Bustanul Qur'an (3 Pilar)</h4>
              </div>
              <ul className="list-disc list-inside text-amber-800 space-y-1">
                <li><b>Tilawah</b>: Metode Tilawati, jilid PAUD, fashohah makhraj</li>
                <li><b>Tahfidz</b>: Hafalan Surat Pendek Juz 30 (An-Naas s/d Al-Fil)</li>
                <li><b>Hikmah</b>: Doa harian, hadits adab & kasih sayang, sholat dhuha</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Select Government Curriculum Components */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Langkah 2: Pilih Capaian Kurikulum Pemerintah (3 Elemen)</h3>
              <p className="text-xs text-slate-500">Centang elemen Capaian Pembelajaran (CP) Kurikulum Pemerintah yang diadopsi</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {selectedGovIds.length} dari {govCurriculum.length} Terpilih
            </span>
          </div>

          <div className="space-y-3">
            {govCurriculum.map(item => {
              const isSelected = selectedGovIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => handleToggleGov(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-blue-300 bg-blue-50/40 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-all shrink-0 ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900">{item.element}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-blue-100 text-blue-800">
                        {item.aspect}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{item.learningOutcome}</p>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{item.learningObjective}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 3: Select Bustanul Qur'an Components */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Langkah 3: Pilih Pilar Kurikulum Bustanul Qur'an</h3>
              <p className="text-xs text-slate-500">Centang target Tilawah, Tahfidz Juz 30, dan Hikmah/Adab yang diintegrasikan</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              {selectedTkqIds.length} dari {tkCurriculum.length} Terpilih
            </span>
          </div>

          <div className="space-y-3">
            {tkCurriculum.map(item => {
              const isSelected = selectedTkqIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => handleToggleTkq(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-amber-300 bg-amber-50/40 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-all shrink-0 ${
                      isSelected
                        ? 'bg-amber-600 border-amber-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900">{item.category}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-amber-100 text-amber-800">
                        {item.aspect}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-800">{item.competency}</p>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{item.objective}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 4: Mapping to 6 Aspects */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Langkah 4: Pemetaan ke 6 Aspek Perkembangan Anak</h3>
            <p className="text-xs text-slate-500">
              Lihat bagaimana Kurikulum Pemerintah dan Kurikulum Bustanul Qur'an saling melengkapi ke dalam 6 Aspek PAUD
            </p>
          </div>

          <div className="space-y-4">
            {Object.keys(aspectNotes).map(aspectName => {
              const matchingGov = govCurriculum.filter(
                g => selectedGovIds.includes(g.id) && g.aspect === aspectName
              );
              const matchingTkq = tkCurriculum.filter(
                t => selectedTkqIds.includes(t.id) && t.aspect === aspectName
              );

              return (
                <div key={aspectName} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      Aspek: {aspectName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {matchingGov.length} Standar Pemerintah + {matchingTkq.length} Bustanul Qur'an
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                    <div className="p-3 bg-white rounded-lg border border-slate-200/70">
                      <span className="font-semibold text-blue-700 block mb-1">Kurikulum Pemerintah:</span>
                      {matchingGov.length === 0 ? (
                        <span className="text-slate-400 italic">Tidak ada komponen langsung</span>
                      ) : (
                        <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                          {matchingGov.map(g => (
                            <li key={g.id}>{g.element} ({g.learningOutcome})</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200/70">
                      <span className="font-semibold text-amber-700 block mb-1">Bustanul Qur'an:</span>
                      {matchingTkq.length === 0 ? (
                        <span className="text-slate-400 italic">Tidak ada komponen langsung</span>
                      ) : (
                        <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                          {matchingTkq.map(t => (
                            <li key={t.id}>{t.category} ({t.competency})</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Catatan Implementasi Guru untuk Aspek Ini:
                    </label>
                    <input
                      type="text"
                      value={aspectNotes[aspectName]}
                      onChange={e =>
                        setAspectNotes({ ...aspectNotes, [aspectName]: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 5: Final Preview & Activation */}
      {currentStep === 5 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Langkah 5: Pratinjau & Finalisasi Kurikulum Aktif</h3>
              <p className="text-xs text-slate-500">
                Verifikasi seluruh gabungan komponen kurikulum sebelum diaktifkan secara resmi bagi seluruh Guru
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Siap Diaktifkan
            </span>
          </div>

          {/* Master Summary Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Nama Kurikulum Resmi
              </span>
              <h4 className="text-lg font-bold mt-0.5">{curriculumName}</h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-emerald-800 text-xs">
              <div>
                <span className="text-[10px] text-emerald-300 uppercase block font-semibold">Tahun Ajaran</span>
                <span className="font-bold">{academicYear}</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-300 uppercase block font-semibold">Semester</span>
                <span className="font-bold">{semester}</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-300 uppercase block font-semibold">Kurikulum Pemerintah</span>
                <span className="font-bold">{selectedGovIds.length} Elemen</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-300 uppercase block font-semibold">Bustanul Qur'an</span>
                <span className="font-bold">{selectedTkqIds.length} Pilar</span>
              </div>
            </div>
          </div>

          {/* Component list preview */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Daftar Komponen Kurikulum Terpadu ({selectedGovIds.length + selectedTkqIds.length} Komponen Total)
            </h4>

            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl">
              {buildCombinedCurriculum().components.map(comp => (
                <div key={comp.id} className="p-3 text-xs flex items-center justify-between hover:bg-slate-50">
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        comp.sourceType === 'pemerintah' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {comp.sourceType === 'pemerintah' ? 'Pemerintah' : "Bustanul Qur'an"}
                      </span>
                      <span className="font-semibold text-slate-800 truncate">{comp.element}</span>
                    </div>
                    <p className="text-slate-500 text-[11px] truncate">{comp.learningObjective}</p>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                    {comp.aspect}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-bold">Setelah tombol &quot;Simpan & Jadikan Kurikulum Aktif&quot; ditekan:</p>
              <p className="text-emerald-800 text-[11px]">
                Semua guru langsung dapat menarik komponen terpadu ini saat menyusun Prosem, RPPM, dan men-generate RPPH otomatis.
              </p>
            </div>
            <button
              onClick={handleFinalSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan & Jadikan Kurikulum Aktif</span>
            </button>
          </div>
        </div>
      )}

      {/* Navigation Buttons (Prev / Next) */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
          disabled={currentStep === 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs transition-all disabled:opacity-40 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Sebelumnya</span>
        </button>

        {currentStep < 5 ? (
          <button
            onClick={() => setCurrentStep(s => Math.min(5, s + 1))}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
          >
            <span>Selanjutnya: {steps[currentStep].title}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={handleFinalSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Aktifkan Kurikulum Ini Sekarang</span>
          </button>
        )}
      </div>
    </div>
  );
};
