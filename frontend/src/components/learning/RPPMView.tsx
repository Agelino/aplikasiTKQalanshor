import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  RPPMItem,
  RPPMPlanMapping,
  RPPMDailySchedule,
  RPPMDayActivityStep,
  RPPMAssessmentItem,
} from '../../types';
import { OFFICIAL_ADMIN_RPPM_TEMPLATE } from '../../data/rppmTemplateData';
import {
  ClipboardList,
  Sparkles,
  Calendar,
  FileText,
  Printer,
  ChevronRight,
  BookOpen,
  Wrench,
  CheckCircle2,
  Plus,
  Play,
  Layers,
  HelpCircle,
  Award,
  Edit2,
  Trash2,
  Target,
  ArrowRight,
  X,
  Check,
  Info,
  RotateCcw,
  ShieldCheck,
  UserCheck,
  LayoutGrid,
  FileSpreadsheet,
  RefreshCw,
} from 'lucide-react';

export const RPPMView: React.FC = () => {
  const {
    rppmList,
    addRPPMItem,
    updateRPPMItem,
    deleteRPPMItem,
    resetRPPMToAdminTemplate,
    generateRPPHFromRPPM,
    syncRPPMToRPPH,
    setActiveTab,
    schoolProfile,
    learningElements,
    cpList,
    tpList,
    showToast,
    currentRole,
    classes,
    currentTeacher,
    currentRombel,
  } = useApp();

  const [selectedRppmId, setSelectedRppmId] = useState<string>(
    rppmList[0]?.id || OFFICIAL_ADMIN_RPPM_TEMPLATE.id
  );
  const currentRppm = useMemo(() => {
    return rppmList.find(r => r.id === selectedRppmId) || rppmList[0] || OFFICIAL_ADMIN_RPPM_TEMPLATE;
  }, [rppmList, selectedRppmId]);

  // View switch: Document View (Official PDF layout) vs Quick Matrix View
  const [activeViewMode, setActiveViewMode] = useState<'document' | 'matrix'>('document');

  // Modals state for Creating / Editing RPPM
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [syncStartDate, setSyncStartDate] = useState('2026-09-14');
  const [autoRedirectRPPH, setAutoRedirectRPPH] = useState(true);

  // Form active tab: 'identitas' | 'cptp' | 'kegiatan_harian' | 'asesmen'
  const [formActiveTab, setFormActiveTab] = useState<'identitas' | 'cptp' | 'kegiatan_harian' | 'asesmen'>('identitas');

  // Form State initialized with Official Template
  const [formData, setFormData] = useState<Omit<RPPMItem, 'id'>>({
    ...OFFICIAL_ADMIN_RPPM_TEMPLATE,
    isTemplate: currentRole === 'admin',
    createdRole: currentRole === 'admin' ? ('admin' as const) : ('guru' as const),
    lastEditedByRole: currentRole === 'admin' ? ('admin' as const) : ('guru' as const),
  });

  // Daily step editor active day in modal
  const [selectedDailyEditorDay, setSelectedDailyEditorDay] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat'>('Senin');

  // Selector state for Elemen -> CP -> TP -> Ragam Main
  const [selectedElementId, setSelectedElementId] = useState<string>(learningElements[0]?.id || '');
  const [selectedCpId, setSelectedCpId] = useState<string>('');
  const [selectedTpId, setSelectedTpId] = useState<string>('');
  const [manualRagamMain, setManualRagamMain] = useState<string>('');
  const [manualAlatBahan, setManualAlatBahan] = useState<string>('');
  const [targetDayPlan, setTargetDayPlan] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Semua Hari'>('Senin');

  // Available CPs filtered by selected Element
  const availableCPs = useMemo(() => {
    return cpList.filter(c => c.elementId === selectedElementId);
  }, [cpList, selectedElementId]);

  // Available TPs filtered by selected CP
  const availableTPs = useMemo(() => {
    return tpList.filter(t => t.cpId === selectedCpId);
  }, [tpList, selectedCpId]);

  const days: ('Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat')[] = [
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
  ];

  // Helper to open create modal
  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormActiveTab('identitas');
    setFormData({
      ...OFFICIAL_ADMIN_RPPM_TEMPLATE,
      week: rppmList.length + 1,
      isTemplate: currentRole === 'admin',
      createdRole: currentRole === 'admin' ? ('admin' as const) : ('guru' as const),
      lastEditedByRole: currentRole === 'admin' ? ('admin' as const) : ('guru' as const),
    });
    // Set initial cascading selections
    const firstElem = learningElements[0];
    setSelectedElementId(firstElem?.id || '');
    const firstCP = cpList.find(c => c.elementId === firstElem?.id);
    setSelectedCpId(firstCP?.id || '');
    const firstTP = tpList.find(t => t.cpId === firstCP?.id);
    setSelectedTpId(firstTP?.id || '');
    setManualRagamMain('');
    setManualAlatBahan('');
    setIsFormModalOpen(true);
  };

  // Helper to open edit modal
  const handleOpenEdit = () => {
    if (!currentRppm) return;
    setIsEditing(true);
    setFormActiveTab('identitas');
    setFormData({
      academicYear: currentRppm.academicYear || '2026/2027',
      semester: currentRppm.semester || 'Semester 1',
      week: currentRppm.week || 1,
      theme: currentRppm.theme || 'Lingkunganku yang Nyaman',
      subtheme: currentRppm.subtheme || 'Sekolahku',
      ageGroup: currentRppm.ageGroup || 'Kelompok A (4-5 Tahun)',
      learningObjective: currentRppm.learningObjective || '',
      material: currentRppm.material || '',
      aspect: currentRppm.aspect || 'Nilai Agama dan Moral',
      activity: currentRppm.activity || '',
      toolsAndMaterials: currentRppm.toolsAndMaterials || '',
      indicator: currentRppm.indicator || '',
      planMappings: currentRppm.planMappings ? [...currentRppm.planMappings] : [...(OFFICIAL_ADMIN_RPPM_TEMPLATE.planMappings || [])],
      dailyPlans: currentRppm.dailyPlans || OFFICIAL_ADMIN_RPPM_TEMPLATE.dailyPlans,
      dailySchedules: currentRppm.dailySchedules || OFFICIAL_ADMIN_RPPM_TEMPLATE.dailySchedules,
      
      // A. Identitas dan Informasi Umum
      isTemplate: currentRppm.isTemplate || false,
      createdRole: currentRppm.createdRole || 'admin',
      lastEditedByRole: currentRole === 'admin' ? ('admin' as const) : ('guru' as const),
      authorName: currentRppm.authorName || 'Syipaurrohmah dan Yeti Nurhasani',
      schoolLevel: currentRppm.schoolLevel || `PAUD (Pendidikan Anak Usia Dini) - ${schoolProfile.name}`,
      phaseAndClass: currentRppm.phaseAndClass || 'Fondasi / Kelompok A (Usia 4-5 Tahun)',
      topic: currentRppm.topic || currentRppm.theme || 'Lingkunganku yang Nyaman',
      subTopic: currentRppm.subTopic || currentRppm.subtheme || 'Sekolahku',
      dateRange: currentRppm.dateRange || 'Senin - Jumat, 14-18 September 2026',
      alokasiWaktu: currentRppm.alokasiWaktu || '2 x 30 Menit (60 Menit) per hari',
      kompetensiAwal: currentRppm.kompetensiAwal || OFFICIAL_ADMIN_RPPM_TEMPLATE.kompetensiAwal || '',
      ketercapaianPembelajaran: currentRppm.ketercapaianPembelajaran || OFFICIAL_ADMIN_RPPM_TEMPLATE.ketercapaianPembelajaran || [],
      dimensiProfilLulusan: currentRppm.dimensiProfilLulusan || OFFICIAL_ADMIN_RPPM_TEMPLATE.dimensiProfilLulusan || [],
      targetPesertaDidik: currentRppm.targetPesertaDidik || 'Reguler/Tipikal',
      modaPembelajaran: currentRppm.modaPembelajaran || 'Tatap Muka',
      pendekatanPembelajaran: currentRppm.pendekatanPembelajaran || OFFICIAL_ADMIN_RPPM_TEMPLATE.pendekatanPembelajaran,
      modelPembelajaran: currentRppm.modelPembelajaran || OFFICIAL_ADMIN_RPPM_TEMPLATE.modelPembelajaran,
      metodePembelajaran: currentRppm.metodePembelajaran || OFFICIAL_ADMIN_RPPM_TEMPLATE.metodePembelajaran,
      saranaPrasarana: currentRppm.saranaPrasarana || OFFICIAL_ADMIN_RPPM_TEMPLATE.saranaPrasarana,
      sumberBelajar: currentRppm.sumberBelajar || OFFICIAL_ADMIN_RPPM_TEMPLATE.sumberBelajar,
      mediaDigital: currentRppm.mediaDigital || OFFICIAL_ADMIN_RPPM_TEMPLATE.mediaDigital,
      mediaKonkret: currentRppm.mediaKonkret || OFFICIAL_ADMIN_RPPM_TEMPLATE.mediaKonkret,
      assessmentIndicators: currentRppm.assessmentIndicators || OFFICIAL_ADMIN_RPPM_TEMPLATE.assessmentIndicators,
      classId: currentRppm.classId,
      className: currentRppm.className,
    });
    setIsFormModalOpen(true);
  };

  // Add a mapped row: Elemen -> CP -> TP -> Ragam Main
  const handleAddPlanMapping = () => {
    if (!manualRagamMain.trim()) {
      showToast('Perhatian', 'Silakan ketikkan deskripsi Ragam Main yang direncanakan untuk santri.', 'warning');
      return;
    }

    const currentElem = learningElements.find(e => e.id === selectedElementId);
    const currentCP = cpList.find(c => c.id === selectedCpId);
    const currentTP = tpList.find(t => t.id === selectedTpId);

    if (!currentCP || !currentTP) {
      showToast('Perhatian', 'Silakan pilih Capaian Pembelajaran (CP) dan Tujuan Pembelajaran (TP) yang sesuai.', 'warning');
      return;
    }

    const newMapping: RPPMPlanMapping = {
      id: `map-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      elementId: currentElem?.id || '',
      elementName: currentElem?.name || '',
      cpId: currentCP.id,
      cpCode: currentCP.code,
      cpTitle: currentCP.title,
      tpId: currentTP.id,
      tpCode: currentTP.code,
      tpTitle: currentTP.title,
      ragamMain: manualRagamMain.trim(),
      alatBahan: manualAlatBahan.trim() || undefined,
      targetDay: targetDayPlan,
    };

    setFormData(prev => ({
      ...prev,
      planMappings: [...(prev.planMappings || []), newMapping],
    }));

    showToast('Ragam Main Ditambahkan', `${currentTP.code}: "${manualRagamMain.trim().slice(0, 30)}..." ditambahkan ke daftar.`, 'success');

    // Reset manual input for next entry
    setManualRagamMain('');
    setManualAlatBahan('');
  };

  // Remove a mapped row
  const handleRemovePlanMapping = (mappingId: string) => {
    setFormData(prev => ({
      ...prev,
      planMappings: (prev.planMappings || []).filter(m => m.id !== mappingId),
    }));
  };

  // Submit Form
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    const mappings = formData.planMappings || [];
    const synthesizedTP = mappings.map(m => m.tpTitle).join('; ') || formData.learningObjective || 'Mencapai tujuan pembelajaran sesuai kurikulum terpadu.';
    const synthesizedActivities = mappings.map(m => m.ragamMain).join(' • ') || formData.activity || 'Kegiatan ragam main tematik.';

    const finalData = {
      ...formData,
      theme: formData.topic || formData.theme,
      subtheme: formData.subTopic || formData.subtheme,
      learningObjective: synthesizedTP,
      activity: synthesizedActivities,
      lastEditedByRole: currentRole === 'admin' ? ('admin' as const) : ('guru' as const),
    };

    if (isEditing && currentRppm) {
      updateRPPMItem({ ...finalData, id: currentRppm.id });
      showToast(
        currentRole === 'admin' ? 'Template Master Disimpan' : 'RPPM Kelas Anda Disimpan',
        `Perubahan RPPM Topik "${finalData.theme} - ${finalData.subtheme}" berhasil disimpan.`,
        'success'
      );
    } else {
      addRPPMItem(finalData);
      showToast(
        currentRole === 'admin' ? 'Template Master Dibuat' : 'RPPM Berhasil Dibuat',
        `RPPM baru telah tersimpan dan siap digunakan.`,
        'success'
      );
    }

    setIsFormModalOpen(false);
  };

  // Confirm Reset to Admin Template
  const handleConfirmReset = () => {
    if (!currentRppm) return;
    resetRPPMToAdminTemplate(currentRppm.id);
    setIsResetModalOpen(false);
  };

  // Confirm Delete RPPM
  const handleDeleteCurrentRPPM = () => {
    if (!currentRppm) return;
    deleteRPPMItem(currentRppm.id);
    setSelectedRppmId(rppmList[0]?.id || '');
    setIsDeleteModalOpen(false);
  };

  // Generate RPPH from RPPM (Single Day)
  const handleGenerateRPPH = (dayName: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat') => {
    const dateMap: Record<string, string> = {
      Senin: '2026-09-14',
      Selasa: '2026-09-15',
      Rabu: '2026-09-16',
      Kamis: '2026-09-17',
      Jumat: '2026-09-18',
    };
    const targetDate = dateMap[dayName] || '2026-09-14';

    generateRPPHFromRPPM(currentRppm.id, dayName, targetDate);
    setActiveTab('rpph');
  };

  // Synchronize ALL 5 Days from RPPM to RPPH
  const handleSyncAllDays = () => {
    if (!currentRppm) return;
    syncRPPMToRPPH(currentRppm.id, syncStartDate);
    setIsSyncModalOpen(false);
    if (autoRedirectRPPH) {
      setActiveTab('rpph');
    }
  };

  // Helper for daily schedule steps
  const currentDailySchedules = currentRppm.dailySchedules || OFFICIAL_ADMIN_RPPM_TEMPLATE.dailySchedules!;

  return (
    <div className="space-y-6">
      {/* Top Banner with Role-Aware Context */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs print:hidden">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                {currentRole === 'admin' ? 'Template Master RPPM (Acuan Pembelajaran Mingguan)' : 'Menyusun RPPM (Rencana Pembelajaran Mingguan)'}
              </h2>
              {currentRole === 'admin' ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Template RPPM Master Admin</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  <span>Penyusunan RPPM Guru Kelas</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentRole === 'admin'
                ? 'Kelola Master Template RPPM terstandarisasi mencakup identitas, CP-TP, ragam main, dan rancangan KBM yang menjadi acuan resmi bagi para guru.'
                : 'Susun dan sesuaikan RPPM mingguan kelas Anda berdasarkan Master Template dari Admin. Pilih ragam main, kosa kata, dan sinkronkan ke RPPH harian.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode View Switch */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setActiveViewMode('document')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeViewMode === 'document'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Dokumen Resmi</span>
            </button>
            <button
              onClick={() => setActiveViewMode('matrix')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeViewMode === 'matrix'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Tabel Ringkasan</span>
            </button>
          </div>

          {/* Reset to Admin Template for Guru */}
          {currentRole === 'guru' && (
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold text-xs transition-all cursor-pointer"
              title="Kembalikan isi RPPM ini ke template resmi awal yang disiapkan oleh Admin/TU"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>Reset ke Template Admin</span>
            </button>
          )}

          {/* SINKRONKAN KE RPPH (Senin - Jumat) */}
          <button
            onClick={() => setIsSyncModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            title="Sinkronkan seluruh 5 hari (Senin s/d Jumat) dari data RPPM ini ke modul ajar harian RPPH"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sinkronkan ke RPPH</span>
          </button>

          {/* Edit RPPM Button */}
          <button
            onClick={handleOpenEdit}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{currentRole === 'admin' ? 'Ubah Template Master' : 'Ubah RPPM Kelas Saya'}</span>
          </button>

          {/* Admin Create Template Button */}
          {currentRole === 'admin' && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Buat Template RPPM</span>
            </button>
          )}

          {/* Print Button */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Cetak Dokumen</span>
          </button>
        </div>
      </div>

      {/* Week / Topic Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 print:hidden">
        {rppmList.map(rppm => {
          const isSelected = selectedRppmId === rppm.id;
          return (
            <button
              key={rppm.id}
              onClick={() => setSelectedRppmId(rppm.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <span>{rppm.ageGroup?.includes('Kelompok A') ? 'Kelompok A' : 'Kelompok B'} • Pekan {rppm.week}</span>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                  isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {rppm.subTopic || rppm.subtheme || rppm.topic || rppm.theme}
              </span>
              {rppm.isTemplate && (
                <span className={`text-[9px] font-mono px-1 rounded ${isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-amber-100 text-amber-800'}`}>
                  Template Admin
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* VIEW MODE 1: DOKUMEN RESMI (PERSIS FORMAT PDF HALAMAN 1 S/D 11)           */}
      {/* ========================================================================= */}
      {activeViewMode === 'document' ? (
        <div className="bg-white rounded-2xl border border-slate-300 shadow-xs p-6 sm:p-10 font-sans text-slate-900 print:p-0 print:border-none print:shadow-none space-y-8">
          {/* Judul Besar Dokumen */}
          <div className="text-center space-y-1 pb-4 border-b-2 border-slate-900">
            <h1 className="text-base sm:text-lg font-black tracking-wide uppercase">
              PERENCANAAN PEMBELAJARAN MENDALAM (INTRAKURIKULER)
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Kurikulum Merdeka PAUD & Pendekatan Deep Learning (Mindful, Meaningful, Joyful Learning)
            </p>
          </div>

          {/* ===================================================================== */}
          {/* A. IDENTITAS DAN INFORMASI UMUM                                       */}
          {/* ===================================================================== */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              A. IDENTITAS DAN INFORMASI UMUM
            </h2>

            <div className="border border-slate-900 overflow-hidden text-xs">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-slate-900">
                    <td className="w-48 sm:w-56 p-2.5 font-bold bg-slate-50 border-r border-slate-900">
                      Penyusun
                    </td>
                    <td className="p-2.5">: {currentRppm.authorName || 'Syipaurrohmah dan Yeti Nurhasani'}</td>
                  </tr>

                  <tr className="border-b border-slate-900">
                    <td className="p-2.5 font-bold bg-slate-50 border-r border-slate-900">
                      Jenjang Sekolah
                    </td>
                    <td className="p-2.5">: {currentRppm.schoolLevel || `PAUD (Pendidikan Anak Usia Dini) - ${schoolProfile.name}`}</td>
                  </tr>

                  <tr className="border-b border-slate-900">
                    <td className="p-2.5 font-bold bg-slate-50 border-r border-slate-900">
                      Fase/Kelas
                    </td>
                    <td className="p-2.5">: {currentRppm.phaseAndClass || currentRppm.ageGroup}</td>
                  </tr>

                  <tr className="border-b border-slate-900">
                    <td className="p-2.5 font-bold bg-slate-50 border-r border-slate-900">
                      Mata Pelajaran/Tema
                    </td>
                    <td className="p-2.5 font-semibold">
                      : Tematik - Topik: {currentRppm.topic || currentRppm.theme}, Sub Topik: {currentRppm.subTopic || currentRppm.subtheme}
                    </td>
                  </tr>

                  <tr className="border-b border-slate-900">
                    <td className="p-2.5 font-bold bg-slate-50 border-r border-slate-900">
                      Hari/Tanggal
                    </td>
                    <td className="p-2.5">: {currentRppm.dateRange || 'Senin - Jumat, 14-18 September 2026'}</td>
                  </tr>

                  {/* Tabel Berjenjang: Tujuan dan Capaian Pembelajaran */}
                  <tr className="border-b border-slate-900">
                    <td className="p-2.5 font-bold bg-slate-50 border-r border-slate-900 align-top">
                      Tujuan dan Capaian Pembelajaran
                    </td>
                    <td className="p-0">
                      <table className="w-full border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-900 bg-slate-100 font-bold text-center">
                            <th className="p-2 border-r border-slate-900 w-36">Elemen</th>
                            <th className="p-2 border-r border-slate-900 w-64">Capaian Pembelajaran (CP)</th>
                            <th className="p-2">Tujuan Pembelajaran (TP)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* 1. Nilai Agama dan Budi Pekerti */}
                          <tr className="border-b border-slate-900">
                            <td className="p-2.5 font-bold border-r border-slate-900 align-top">
                              Nilai Agama dan Budi Pekerti
                            </td>
                            <td className="p-2.5 border-r border-slate-900 align-top leading-relaxed text-slate-800">
                              Anak percaya kepada Tuhan Yang Maha Esa, mulai mengenal dan mempraktikkan ajaran agama yang dianutnya, mengenal keberagaman, serta mempraktikkan sikap saling menghormati dalam kehidupan sehari-hari.
                            </td>
                            <td className="p-2.5 align-top space-y-1.5 leading-relaxed">
                              <p>1. Anak terbiasa mengucapkan salam, membaca surat Al-Fatihah dan melantunkan Asmaul Husna sebagai pembiasaan sebelum belajar</p>
                              <p>2. Anak mengenal angka Arab sebagai pengantar mengenal simbol dalam bahasa Al-Qur&apos;an</p>
                              <p>3. Anak mengenal dan menirukan huruf hijaiyah melalui kosakata sederhana bertema sekolah: <span className="font-arabic font-bold text-emerald-800">مَدْرَسَة, بَاب, كِتَاب, قَلَم</span></p>
                              <p>4. Anak mengucapkan ikrar santri sebagai wujud pembiasaan akhlak baik setiap hari</p>
                            </td>
                          </tr>

                          {/* 2. Jati Diri */}
                          <tr className="border-b border-slate-900">
                            <td className="p-2.5 font-bold border-r border-slate-900 align-top">
                              Jati Diri
                            </td>
                            <td className="p-2.5 border-r border-slate-900 align-top leading-relaxed text-slate-800">
                              Anak mengenali dan mengelola emosi diri serta membangun hubungan sosial secara sehat, anak membangun rutinitas untuk kemandirian dan penguatan tubuh yang sehat, kuat, dan terampil melalui pembiasaan motorik kasar dan halus.
                            </td>
                            <td className="p-2.5 align-top space-y-1.5 leading-relaxed">
                              <p>1. Anak menunjukkan kemandirian dalam mengerjakan tugas sederhana</p>
                              <p>2. Anak menunjukkan rasa percaya diri saat menceritakan hasil karyanya</p>
                              <p>3. Anak mengembangkan motorik kasar melalui gerak dan lagu pada kegiatan pembuka setiap hari</p>
                              <p>4. Anak mengembangkan motorik halus melalui kegiatan menulis, menghubungkan titik, dan menebalkan angka</p>
                            </td>
                          </tr>

                          {/* 3. Dasar-dasar Literasi dan STEAM */}
                          <tr>
                            <td className="p-2.5 font-bold border-r border-slate-900 align-top">
                              Dasar-dasar Literasi dan STEAM
                            </td>
                            <td className="p-2.5 border-r border-slate-900 align-top leading-relaxed text-slate-800">
                              Anak menunjukkan ketertarikan dan berpartisipasi aktif dalam kegiatan literasi, matematika, sains, teknologi, rekayasa, dan seni (STEAM) sederhana untuk mengenal, memahami, serta menyelesaikan masalah dalam kehidupan sehari-hari sesuai konteks bermain anak.
                            </td>
                            <td className="p-2.5 align-top space-y-1.5 leading-relaxed">
                              <p>1. Anak mencoba melakukan penjumlahan sederhana menggunakan media visual tas dan buku</p>
                              <p>2. Anak mengenal dan menirukan angka Arab</p>
                              <p>3. Anak mencoba menyelesaikan tugas sederhana menulis huruf hijaiyah</p>
                              <p>4. Anak mencoba menirukan menulis kata nama perlengkapan sekolah</p>
                              <p>5. Anak mengenal representasi bilangan dalam simbol melalui kegiatan menebalkan angka 6-10</p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  <tr className="border-b border-slate-900">
                    <td className="p-2.5 font-bold bg-slate-50 border-r border-slate-900 align-top">
                      Ketercapaian Pembelajaran
                    </td>
                    <td className="p-2.5 space-y-1">
                      <p className="font-semibold text-slate-900">Setelah mengikuti pembelajaran selama satu minggu, anak diharapkan mampu:</p>
                      {(currentRppm.ketercapaianPembelajaran || OFFICIAL_ADMIN_RPPM_TEMPLATE.ketercapaianPembelajaran || []).map((point, pIdx) => (
                        <p key={pIdx} className="leading-snug">
                          {pIdx + 1}. {point}
                        </p>
                      ))}
                    </td>
                  </tr>

                  <tr className="border-b border-slate-900">
                    <td className="p-2.5 font-bold bg-slate-50 border-r border-slate-900 align-top">
                      Kompetensi Awal
                    </td>
                    <td className="p-2.5 leading-relaxed">
                      : {currentRppm.kompetensiAwal || OFFICIAL_ADMIN_RPPM_TEMPLATE.kompetensiAwal}
                    </td>
                  </tr>

                  <tr className="border-b border-slate-900">
                    <td className="p-2.5 font-bold bg-slate-50 border-r border-slate-900">
                      Alokasi Waktu
                    </td>
                    <td className="p-2.5">: {currentRppm.alokasiWaktu || '2 x 30 Menit (60 Menit) per hari'}</td>
                  </tr>

                  <tr className="border-b border-slate-900">
                    <td className="p-2.5 font-bold bg-slate-50 border-r border-slate-900 align-top">
                      Dimensi Profil Lulusan
                    </td>
                    <td className="p-2.5 space-y-1 leading-relaxed">
                      {(currentRppm.dimensiProfilLulusan || OFFICIAL_ADMIN_RPPM_TEMPLATE.dimensiProfilLulusan || []).map((dim, dIdx) => (
                        <p key={dIdx} className="flex items-start gap-1.5">
                          <span className="font-bold">•</span>
                          <span>{dim}</span>
                        </p>
                      ))}
                    </td>
                  </tr>

                  <tr className="border-b border-slate-900">
                    <td className="p-2.5 font-bold bg-slate-50 border-r border-slate-900">
                      Target Peserta Didik
                    </td>
                    <td className="p-2.5">: {currentRppm.targetPesertaDidik || 'Reguler/Tipikal'}</td>
                  </tr>

                  <tr className="border-b border-slate-900">
                    <td className="p-2.5 font-bold bg-slate-50 border-r border-slate-900">
                      Moda Pembelajaran
                    </td>
                    <td className="p-2.5">: {currentRppm.modaPembelajaran || 'Tatap Muka'}</td>
                  </tr>

                  <tr className="border-b border-slate-900">
                    <td className="p-2.5 font-bold bg-slate-50 border-r border-slate-900 align-top">
                      Pendekatan Pembelajaran
                    </td>
                    <td className="p-2.5 leading-relaxed">
                      : {currentRppm.pendekatanPembelajaran || OFFICIAL_ADMIN_RPPM_TEMPLATE.pendekatanPembelajaran}
                    </td>
                  </tr>

                  <tr className="border-b border-slate-900">
                    <td className="p-2.5 font-bold bg-slate-50 border-r border-slate-900 align-top">
                      Model Pembelajaran
                    </td>
                    <td className="p-2.5 leading-relaxed">
                      : {currentRppm.modelPembelajaran || OFFICIAL_ADMIN_RPPM_TEMPLATE.modelPembelajaran}
                    </td>
                  </tr>

                  <tr className="border-b border-slate-900">
                    <td className="p-2.5 font-bold bg-slate-50 border-r border-slate-900 align-top">
                      Metode Pembelajaran
                    </td>
                    <td className="p-2.5 leading-relaxed">
                      : {currentRppm.metodePembelajaran || OFFICIAL_ADMIN_RPPM_TEMPLATE.metodePembelajaran}
                    </td>
                  </tr>

                  <tr className="border-b border-slate-900">
                    <td className="p-2.5 font-bold bg-slate-50 border-r border-slate-900 align-top">
                      Sarana dan Prasarana
                    </td>
                    <td className="p-2.5 leading-relaxed">
                      : {currentRppm.saranaPrasarana || OFFICIAL_ADMIN_RPPM_TEMPLATE.saranaPrasarana}
                    </td>
                  </tr>

                  <tr className="border-b border-slate-900">
                    <td className="p-2.5 font-bold bg-slate-50 border-r border-slate-900 align-top">
                      Sumber Belajar
                    </td>
                    <td className="p-2.5 leading-relaxed">
                      : {currentRppm.sumberBelajar || OFFICIAL_ADMIN_RPPM_TEMPLATE.sumberBelajar}
                    </td>
                  </tr>

                  <tr>
                    <td className="p-2.5 font-bold bg-slate-50 border-r border-slate-900 align-top">
                      Media Pembelajaran
                    </td>
                    <td className="p-2.5 space-y-1.5 leading-relaxed">
                      <div>
                        <b className="font-semibold text-slate-900">Digital: </b>
                        <span>{currentRppm.mediaDigital || OFFICIAL_ADMIN_RPPM_TEMPLATE.mediaDigital}</span>
                      </div>
                      <div>
                        <b className="font-semibold text-slate-900">Konkret: </b>
                        <span>{currentRppm.mediaKonkret || OFFICIAL_ADMIN_RPPM_TEMPLATE.mediaKonkret}</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* B. URUTAN KEGIATAN PEMBELAJARAN (SENIN S/D JUMAT)                     */}
          {/* ===================================================================== */}
          <div className="space-y-6 pt-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              B. URUTAN KEGIATAN PEMBELAJARAN
            </h2>

            {days.map(day => {
              const schedule = currentDailySchedules[day];
              if (!schedule) return null;

              return (
                <div key={day} className="space-y-2 border border-slate-900 p-4 rounded-lg bg-white">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-300">
                    <div>
                      <h3 className="text-sm font-black tracking-wider text-slate-900 uppercase">
                        {day.toUpperCase()}
                      </h3>
                      <p className="text-xs font-semibold text-emerald-800">
                        Topik: {schedule.dailyTopic}
                      </p>
                    </div>

                    <button
                      onClick={() => handleGenerateRPPH(day)}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer print:hidden"
                      title={`Sinkronkan RPPH Harian dari Rencana Hari ${day}`}
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-teal-200" />
                      <span>Sinkronkan {day} ke RPPH</span>
                    </button>
                  </div>

                  {/* Tabel Urutan Kegiatan Pembelajaran Hari Ini */}
                  <div className="border border-slate-900 overflow-hidden text-xs mt-3">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-900 font-bold text-center">
                          <th className="p-2 border-r border-slate-900 w-28">TAHAP</th>
                          <th className="p-2 border-r border-slate-900">KEGIATAN</th>
                          <th className="p-2 border-r border-slate-900 w-44">MUATAN INOVATIF</th>
                          <th className="p-2 w-28">ESTIMASI WAKTU</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900">
                        {schedule.steps.map((step, sIdx) => {
                          const isInti = ['Memahami', 'Mengaplikasikan', 'Merefleksikan'].includes(step.stage);
                          return (
                            <tr key={sIdx} className="border-b border-slate-900 last:border-b-0">
                              <td className="p-2.5 font-bold border-r border-slate-900 align-top bg-slate-50/50">
                                {isInti ? (
                                  <div>
                                    <span className="text-[10px] text-slate-400 block font-normal">Kegiatan Inti</span>
                                    <span>{step.stage}</span>
                                  </div>
                                ) : (
                                  <span>{step.stage}</span>
                                )}
                              </td>
                              <td className="p-2.5 border-r border-slate-900 align-top leading-relaxed">
                                <div className="whitespace-pre-line text-slate-800">
                                  {step.activityText}
                                </div>
                                {step.kosaKata && (
                                  <div className="mt-2 inline-block px-2.5 py-0.5 rounded font-bold text-xs bg-rose-50 text-rose-800 border border-rose-200">
                                    Kosa Kata : <span className="font-arabic font-bold text-sm">{step.kosaKata}</span>
                                  </div>
                                )}
                              </td>
                              <td className="p-2.5 border-r border-slate-900 align-top text-slate-700 font-medium">
                                {step.inovatif}
                              </td>
                              <td className="p-2.5 align-top text-center font-mono font-semibold text-slate-800">
                                {step.estimasiWaktu}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ===================================================================== */}
          {/* C. ASESMEN                                                            */}
          {/* ===================================================================== */}
          <div className="space-y-3 pt-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              C. ASESMEN
            </h2>

            <div className="space-y-1.5 text-xs text-slate-800 leading-relaxed">
              <p>
                <b>Teknik Asesmen: </b>Observasi (catatan anekdot), Unjuk Kerja, dan Hasil Karya (LKPD)
              </p>
              <p>
                <b>Instrumen: </b>Ceklis Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) dengan skala BB (Belum Berkembang), MB (Mulai Berkembang), BSH (Berkembang Sesuai Harapan), BSB (Berkembang Sangat Baik)
              </p>
            </div>

            {/* Tabel KKTP */}
            <div className="border border-slate-900 overflow-hidden text-xs mt-3">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-900 font-bold text-center">
                    <th className="p-2 border-r border-slate-900 w-10">No</th>
                    <th className="p-2 border-r border-slate-900 w-24">Hari</th>
                    <th className="p-2 border-r border-slate-900">Indikator Ketercapaian Tujuan Pembelajaran</th>
                    <th className="p-2 border-r border-slate-900 w-12">BB</th>
                    <th className="p-2 border-r border-slate-900 w-12">MB</th>
                    <th className="p-2 border-r border-slate-900 w-12">BSH</th>
                    <th className="p-2 w-12">BSB</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-800">
                  {(currentRppm.assessmentIndicators || OFFICIAL_ADMIN_RPPM_TEMPLATE.assessmentIndicators || []).map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2 border-r border-slate-900 text-center font-mono font-bold">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-900 font-semibold">{item.dayName}</td>
                      <td className="p-2 border-r border-slate-900 leading-snug">{item.indicator}</td>
                      <td className="p-2 border-r border-slate-900 text-center" />
                      <td className="p-2 border-r border-slate-900 text-center" />
                      <td className="p-2 border-r border-slate-900 text-center" />
                      <td className="p-2 text-center" />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* D. LEMBAR PENGESAHAN RESMI                                            */}
          {/* ===================================================================== */}
          <div className="pt-8 text-xs text-slate-900">
            <div className="flex justify-end mb-4 font-medium">
              <p>Bekasi, 14 September 2026</p>
            </div>

            <div className="grid grid-cols-2 text-center pt-2">
              <div>
                <p>Mengetahui,</p>
                <p className="font-bold">Kepala TKQ / PAUD {schoolProfile.name}</p>
                <div className="h-20" />
                <p className="font-bold underline">({schoolProfile.principal || 'Dra. Hj. Rahmawati, S.Pd'})</p>
                <p className="text-[10px] font-mono text-slate-500">NIP: {schoolProfile.principalNip || '-'}</p>
              </div>

              <div>
                <p>Guru Kelompok {currentRppm.ageGroup?.includes('Kelompok A') ? 'A' : 'B'}</p>
                <p className="font-bold">Pendidik Pengampu</p>
                <div className="h-20 flex items-center justify-center">
                  {currentTeacher?.signatureImage ? (
                    <img
                      src={currentTeacher.signatureImage}
                      alt="Tanda Tangan Guru"
                      className="h-14 object-contain"
                    />
                  ) : (
                    <div className="h-14" />
                  )}
                </div>
                <p className="font-bold underline">
                  ({currentTeacher?.name || currentRppm.authorName || 'Syipaurrohmah dan Yeti Nurhasani'})
                </p>
                <p className="text-[10px] font-mono text-slate-500">
                  {currentRombel ? `Wali ${currentRombel.name} · NIP: ${currentTeacher?.nip || '-'}` : 'Wali Rombel PAUD'}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* VIEW MODE 2: TABEL RINGKASAN INTEGRASI ELEMEN & RAGAM MAIN (MATRIX VIEW)  */
        /* ========================================================================= */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-teal-600" />
                <span>Matriks Integrasi: Elemen &rarr; CP &rarr; TP &rarr; Ragam Main</span>
              </h3>
              <p className="text-xs text-slate-500">
                Pemetaan langsung kompetensi kurikulum dengan ragam main nyata yang diketik guru.
              </p>
            </div>

            <button
              onClick={handleOpenEdit}
              className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 self-start sm:self-auto"
            >
              <Edit2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Kelola / Tambah Ragam Main</span>
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/90 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">No</th>
                  <th className="py-2.5 px-3 w-40">Elemen</th>
                  <th className="py-2.5 px-3 w-64">Capaian Pembelajaran (CP)</th>
                  <th className="py-2.5 px-3">Tujuan Pembelajaran (TP)</th>
                  <th className="py-2.5 px-3">Ragam Main Santri</th>
                  <th className="py-2.5 px-3 text-center w-24">Hari</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(currentRppm.planMappings || []).map((mapItem, idx) => (
                  <tr key={mapItem.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {mapItem.elementName}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-mono text-[10px] font-bold text-teal-700 block">
                        {mapItem.cpCode}
                      </span>
                      <span className="text-[11px] text-slate-800 leading-snug">
                        {mapItem.cpTitle}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-mono text-[10px] font-bold text-emerald-700 block">
                        {mapItem.tpCode}
                      </span>
                      <span className="text-[11px] text-slate-900 leading-snug font-medium">
                        {mapItem.tpTitle}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <p className="font-bold text-slate-900 leading-snug">{mapItem.ragamMain}</p>
                      {mapItem.alatBahan && (
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Bahan: <span className="text-slate-600">{mapItem.alatBahan}</span>
                        </p>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {mapItem.targetDay || 'Pekan'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL FORM: BUAT / EDIT RPPM LENGKAP (A. IDENTITAS SAMPAI B. URUTAN)      */}
      {/* ========================================================================= */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {isEditing
                      ? (currentRole === 'admin' ? 'Ubah Master Template RPPM' : 'Ubah RPPM Pembelajaran Kelas')
                      : (currentRole === 'admin' ? 'Buat Master Template RPPM Baru' : 'Buat RPPM Baru Berbasis Template')}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Format resmi Perencanaan Pembelajaran Mendalam (Intrakurikuler) dari A. Identitas sampai B. Urutan Kegiatan.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs inside Form Modal */}
            <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 border-b border-slate-100 bg-white overflow-x-auto">
              <button
                type="button"
                onClick={() => setFormActiveTab('identitas')}
                className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  formActiveTab === 'identitas'
                    ? 'border-emerald-600 text-emerald-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                1. A. Identitas & Info Umum
              </button>

              <button
                type="button"
                onClick={() => setFormActiveTab('cptp')}
                className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  formActiveTab === 'cptp'
                    ? 'border-emerald-600 text-emerald-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>2. Elemen, CP & TP</span>
                <span className="text-[10px] px-1.5 rounded-full bg-slate-100 text-slate-600">
                  {(formData.planMappings || []).length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFormActiveTab('kegiatan_harian')}
                className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  formActiveTab === 'kegiatan_harian'
                    ? 'border-emerald-600 text-emerald-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                3. B. Urutan Kegiatan (Senin - Jumat)
              </button>

              <button
                type="button"
                onClick={() => setFormActiveTab('asesmen')}
                className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  formActiveTab === 'asesmen'
                    ? 'border-emerald-600 text-emerald-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                4. C. Asesmen & Media
              </button>
            </div>

            {/* Modal Body / Tab Content */}
            <form onSubmit={handleSubmitForm} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs">
              {/* TAB 1: IDENTITAS & INFO UMUM */}
              {formActiveTab === 'identitas' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="font-semibold text-slate-700 block mb-1">Penyusun / Guru Pengampu *</label>
                      <input
                        type="text"
                        required
                        value={formData.authorName || ''}
                        onChange={e => setFormData({ ...formData, authorName: e.target.value })}
                        placeholder="Syipaurrohmah dan Yeti Nurhasani"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Jenjang Sekolah</label>
                      <input
                        type="text"
                        value={formData.schoolLevel || ''}
                        onChange={e => setFormData({ ...formData, schoolLevel: e.target.value })}
                        placeholder="PAUD - TKQ Al Anshor"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Fase / Kelas Usia</label>
                      <input
                        type="text"
                        value={formData.phaseAndClass || ''}
                        onChange={e => setFormData({ ...formData, phaseAndClass: e.target.value, ageGroup: e.target.value })}
                        placeholder="Fondasi / Kelompok A (Usia 4-5 Tahun)"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Topik Utama</label>
                      <input
                        type="text"
                        required
                        value={formData.topic || ''}
                        onChange={e => setFormData({ ...formData, topic: e.target.value, theme: e.target.value })}
                        placeholder="Lingkunganku yang Nyaman"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Sub Topik</label>
                      <input
                        type="text"
                        required
                        value={formData.subTopic || ''}
                        onChange={e => setFormData({ ...formData, subTopic: e.target.value, subtheme: e.target.value })}
                        placeholder="Sekolahku"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Hari & Rentang Tanggal</label>
                      <input
                        type="text"
                        value={formData.dateRange || ''}
                        onChange={e => setFormData({ ...formData, dateRange: e.target.value })}
                        placeholder="Senin - Jumat, 14-18 September 2026"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Alokasi Waktu</label>
                      <input
                        type="text"
                        value={formData.alokasiWaktu || ''}
                        onChange={e => setFormData({ ...formData, alokasiWaktu: e.target.value })}
                        placeholder="2 x 30 Menit (60 Menit) per hari"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Pekan & Semester</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={formData.week}
                          onChange={e => setFormData({ ...formData, week: parseInt(e.target.value) || 1 })}
                          className="w-20 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center outline-none"
                        />
                        <select
                          value={formData.semester}
                          onChange={e => setFormData({ ...formData, semester: e.target.value })}
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        >
                          <option value="Semester 1">Semester 1</option>
                          <option value="Semester 2">Semester 2</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Kompetensi Awal</label>
                    <textarea
                      rows={2}
                      value={formData.kompetensiAwal || ''}
                      onChange={e => setFormData({ ...formData, kompetensiAwal: e.target.value })}
                      placeholder="Anak sudah mengenal lingkungan sekolah, mampu memegang alat tulis dengan benar..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Pendekatan Pembelajaran (Deep Learning)</label>
                    <input
                      type="text"
                      value={formData.pendekatanPembelajaran || ''}
                      onChange={e => setFormData({ ...formData, pendekatanPembelajaran: e.target.value })}
                      placeholder="Saintifik - Bermain Sambil Belajar - Pendekatan Deep Learning (Mindful, Meaningful, Joyful Learning)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: ELEMEN, CP & TP INTEGRASI */}
              {formActiveTab === 'cptp' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
                      <Target className="w-4 h-4 text-teal-700" />
                      <span>Alur Pemilihan: Elemen &rarr; CP &rarr; TP &rarr; Ketik Ragam Main Manual</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">1. Pilih Elemen Pembelajaran</label>
                        <select
                          value={selectedElementId}
                          onChange={e => {
                            const newElemId = e.target.value;
                            setSelectedElementId(newElemId);
                            const matchedCPs = cpList.filter(c => c.elementId === newElemId);
                            setSelectedCpId(matchedCPs[0]?.id || '');
                            const matchedTPs = tpList.filter(t => t.cpId === matchedCPs[0]?.id);
                            setSelectedTpId(matchedTPs[0]?.id || '');
                          }}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none font-medium"
                        >
                          {learningElements.map(elem => (
                            <option key={elem.id} value={elem.id}>
                              {elem.name} ({elem.code})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">2. Pilih Capaian Pembelajaran (CP)</label>
                        <select
                          value={selectedCpId}
                          onChange={e => {
                            const newCpId = e.target.value;
                            setSelectedCpId(newCpId);
                            const matchedTPs = tpList.filter(t => t.cpId === newCpId);
                            setSelectedTpId(matchedTPs[0]?.id || '');
                          }}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none font-medium"
                        >
                          {availableCPs.length === 0 ? (
                            <option value="">Belum ada CP di elemen ini</option>
                          ) : (
                            availableCPs.map(cp => (
                              <option key={cp.id} value={cp.id}>
                                {cp.code} - {cp.title.slice(0, 45)}...
                              </option>
                            ))
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">3. Pilih Tujuan Pembelajaran (TP)</label>
                        <select
                          value={selectedTpId}
                          onChange={e => setSelectedTpId(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none font-medium"
                        >
                          {availableTPs.length === 0 ? (
                            <option value="">Belum ada TP di CP ini</option>
                          ) : (
                            availableTPs.map(tp => (
                              <option key={tp.id} value={tp.id}>
                                {tp.code} - {tp.title.slice(0, 45)}...
                              </option>
                            ))
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
                      <div className="md:col-span-3">
                        <label className="font-semibold text-slate-700 block mb-1">
                          4. Ketikkan Ragam Main Manual untuk Santri *
                        </label>
                        <input
                          type="text"
                          value={manualRagamMain}
                          onChange={e => setManualRagamMain(e.target.value)}
                          placeholder="Contoh: Menghitung gambar tas dan buku pada LKPD dan bermain memasukkan benda sesuai angka pada cup"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-teal-500 font-medium"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Target Hari</label>
                        <select
                          value={targetDayPlan}
                          onChange={e => setTargetDayPlan(e.target.value as any)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none"
                        >
                          <option value="Senin">Senin</option>
                          <option value="Selasa">Selasa</option>
                          <option value="Rabu">Rabu</option>
                          <option value="Kamis">Kamis</option>
                          <option value="Jumat">Jumat</option>
                          <option value="Semua Hari">Semua Hari</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-end pt-1">
                      <button
                        type="button"
                        onClick={handleAddPlanMapping}
                        className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Tambahkan Ragam Main ke RPPM</span>
                      </button>
                    </div>
                  </div>

                  {/* List of currently mapped activities */}
                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px]">
                        <tr>
                          <th className="py-2.5 px-3 w-8 text-center">No</th>
                          <th className="py-2.5 px-3">Elemen & CP</th>
                          <th className="py-2.5 px-3">Tujuan Pembelajaran</th>
                          <th className="py-2.5 px-3">Ragam Main yang Diketik Guru</th>
                          <th className="py-2.5 px-3 text-center w-20">Hari</th>
                          <th className="py-2.5 px-3 text-right w-12">Hapus</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(formData.planMappings || []).length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-6 text-center text-slate-400">
                              Belum ada baris kegiatan terpetakan. Silakan gunakan pemilih di atas.
                            </td>
                          </tr>
                        ) : (
                          (formData.planMappings || []).map((m, idx) => (
                            <tr key={m.id} className="hover:bg-slate-50/80">
                              <td className="py-2 px-3 text-center font-mono font-bold text-slate-400">{idx + 1}</td>
                              <td className="py-2 px-3">
                                <span className="font-bold text-slate-800 block text-[11px]">{m.elementName}</span>
                                <span className="text-[10px] text-teal-700 font-mono">{m.cpCode}</span>
                              </td>
                              <td className="py-2 px-3">
                                <span className="font-bold text-emerald-700 font-mono text-[10px] block">{m.tpCode}</span>
                                <span className="text-[11px] text-slate-800 line-clamp-2">{m.tpTitle}</span>
                              </td>
                              <td className="py-2 px-3 font-semibold text-slate-900">{m.ragamMain}</td>
                              <td className="py-2 px-3 text-center font-bold text-[10px] text-emerald-800">{m.targetDay}</td>
                              <td className="py-2 px-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleRemovePlanMapping(m.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: B. URUTAN KEGIATAN HARIAN (SENIN - JUMAT) */}
              {formActiveTab === 'kegiatan_harian' && (
                <div className="space-y-4">
                  {/* Day Picker */}
                  <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit">
                    {days.map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setSelectedDailyEditorDay(day)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedDailyEditorDay === day
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>

                  {/* Day Details Form */}
                  {(() => {
                    const currentSchedule = formData.dailySchedules?.[selectedDailyEditorDay] || OFFICIAL_ADMIN_RPPM_TEMPLATE.dailySchedules![selectedDailyEditorDay];

                    return (
                      <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-4">
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">
                            Topik Hari {selectedDailyEditorDay} *
                          </label>
                          <input
                            type="text"
                            value={currentSchedule.dailyTopic}
                            onChange={e => {
                              const newTopic = e.target.value;
                              setFormData(prev => ({
                                ...prev,
                                dailySchedules: {
                                  ...prev.dailySchedules!,
                                  [selectedDailyEditorDay]: {
                                    ...prev.dailySchedules![selectedDailyEditorDay],
                                    dailyTopic: newTopic,
                                  },
                                },
                              }));
                            }}
                            placeholder="Contoh: Berhitung: Penjumlahan Menggunakan Media Visual (Tas dan Buku)"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-semibold"
                          />
                        </div>

                        {/* Steps Editor */}
                        <div className="space-y-3">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                            Rincian Tahapan Kegiatan {selectedDailyEditorDay}:
                          </span>

                          {currentSchedule.steps.map((step, stIdx) => (
                            <div key={stIdx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800 text-xs px-2 py-0.5 rounded bg-slate-200">
                                  {step.stage}
                                </span>
                                <div className="flex items-center gap-2">
                                  <label className="text-[10px] text-slate-400">Estimasi Waktu:</label>
                                  <input
                                    type="text"
                                    value={step.estimasiWaktu}
                                    onChange={e => {
                                      const newSteps = [...currentSchedule.steps];
                                      newSteps[stIdx] = { ...newSteps[stIdx], estimasiWaktu: e.target.value };
                                      setFormData(prev => ({
                                        ...prev,
                                        dailySchedules: {
                                          ...prev.dailySchedules!,
                                          [selectedDailyEditorDay]: {
                                            ...prev.dailySchedules![selectedDailyEditorDay],
                                            steps: newSteps,
                                          },
                                        },
                                      }));
                                    }}
                                    className="w-24 px-2 py-0.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-center outline-none"
                                  />
                                </div>
                              </div>

                              <div>
                                <textarea
                                  rows={step.stage === 'Pendahuluan' || step.stage === 'Penutup' ? 3 : 2}
                                  value={step.activityText}
                                  onChange={e => {
                                    const newSteps = [...currentSchedule.steps];
                                    newSteps[stIdx] = { ...newSteps[stIdx], activityText: e.target.value };
                                    setFormData(prev => ({
                                      ...prev,
                                      dailySchedules: {
                                        ...prev.dailySchedules!,
                                        [selectedDailyEditorDay]: {
                                          ...prev.dailySchedules![selectedDailyEditorDay],
                                          steps: newSteps,
                                        },
                                      },
                                    }));
                                  }}
                                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-xs"
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                <div>
                                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Muatan Inovatif</label>
                                  <input
                                    type="text"
                                    value={step.inovatif}
                                    onChange={e => {
                                      const newSteps = [...currentSchedule.steps];
                                      newSteps[stIdx] = { ...newSteps[stIdx], inovatif: e.target.value };
                                      setFormData(prev => ({
                                        ...prev,
                                        dailySchedules: {
                                          ...prev.dailySchedules!,
                                          [selectedDailyEditorDay]: {
                                            ...prev.dailySchedules![selectedDailyEditorDay],
                                            steps: newSteps,
                                          },
                                        },
                                      }));
                                    }}
                                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                                  />
                                </div>

                                {step.stage === 'Memahami' && (
                                  <div>
                                    <label className="text-[10px] font-semibold text-rose-600 block mb-0.5">
                                      Kosa Kata Khusus (Arab / Tematik)
                                    </label>
                                    <input
                                      type="text"
                                      value={step.kosaKata || ''}
                                      onChange={e => {
                                        const newSteps = [...currentSchedule.steps];
                                        newSteps[stIdx] = { ...newSteps[stIdx], kosaKata: e.target.value };
                                        setFormData(prev => ({
                                          ...prev,
                                          dailySchedules: {
                                            ...prev.dailySchedules!,
                                            [selectedDailyEditorDay]: {
                                              ...prev.dailySchedules![selectedDailyEditorDay],
                                              steps: newSteps,
                                            },
                                          },
                                        }));
                                      }}
                                      placeholder="Contoh: Ransel / سَبُّورَةٌ / مَدْرَسَة"
                                      className="w-full px-2 py-1 bg-white border border-rose-200 rounded-lg text-xs font-semibold text-rose-800 outline-none"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* TAB 4: ASESMEN & MEDIA */}
              {formActiveTab === 'asesmen' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Sarana dan Prasarana</label>
                      <textarea
                        rows={2}
                        value={formData.saranaPrasarana || ''}
                        onChange={e => setFormData({ ...formData, saranaPrasarana: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Sumber Belajar</label>
                      <textarea
                        rows={2}
                        value={formData.sumberBelajar || ''}
                        onChange={e => setFormData({ ...formData, sumberBelajar: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Media Pembelajaran Digital</label>
                      <textarea
                        rows={2}
                        value={formData.mediaDigital || ''}
                        onChange={e => setFormData({ ...formData, mediaDigital: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Media Pembelajaran Konkret</label>
                      <textarea
                        rows={2}
                        value={formData.mediaKonkret || ''}
                        onChange={e => setFormData({ ...formData, mediaKonkret: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Indikator Ceklis KKTP per Hari (Senin s/d Jumat)
                    </label>
                    <div className="space-y-2">
                      {(formData.assessmentIndicators || []).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-16 font-bold text-xs text-slate-700 shrink-0">{item.dayName}:</span>
                          <input
                            type="text"
                            value={item.indicator}
                            onChange={e => {
                              const newInds = [...(formData.assessmentIndicators || [])];
                              newInds[idx] = { ...newInds[idx], indicator: e.target.value };
                              setFormData({ ...formData, assessmentIndicators: newInds });
                            }}
                            className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                {isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus RPPM</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isEditing ? 'Simpan Perubahan RPPM' : 'Simpan RPPM Baru'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: KONFIRMASI RESET KE TEMPLATE ADMIN (KHUSUS GURU)                   */}
      {/* ========================================================================= */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Reset ke Template Standar Admin?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Isi RPPM akan dikembalikan sesuai format acuan resmi dari Admin/TU.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">Dokumen Acuan Standar:</p>
              <p>Topik: <span className="font-bold text-slate-900">Lingkunganku yang Nyaman</span> (Sub: Sekolahku)</p>
              <p>Format: Standar Deep Learning PAUD (A. Identitas s/d B. Urutan Kegiatan)</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ya, Reset ke Template Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SINKRONISASI DATA RPPM KE RPPH (SENIN - JUMAT)                     */}
      {/* ========================================================================= */}
      {isSyncModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-teal-50 to-white">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Sinkronisasi Data RPPM ke Dokumen RPPH
                  </h3>
                  <p className="text-xs text-slate-500">
                    Menghasilkan & memperbarui otomatis 5 dokumen RPPH (Senin s/d Jumat) dari RPPM ini.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSyncModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto text-xs text-slate-700">
              {/* Source RPPM Summary */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">RPPM Sumber Acuan</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {currentRppm.ageGroup?.includes('Kelompok A') ? 'Kelompok A' : 'Kelompok B'} • Pekan {currentRppm.week}
                  </span>
                </div>
                <p className="font-bold text-slate-900 text-sm">{currentRppm.topic || currentRppm.theme} — {currentRppm.subTopic || currentRppm.subtheme}</p>
                <p className="text-slate-500 text-[11px]">Penyusun: {currentRppm.authorName || 'Guru Pengampu'}</p>
              </div>

              {/* Date Selector */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Pilih Tanggal Mulai Pekan (Hari Senin):
                </label>
                <input
                  type="date"
                  value={syncStartDate}
                  onChange={e => setSyncStartDate(e.target.value)}
                  className="w-full sm:w-64 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 focus:bg-white focus:border-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Hari Selasa s/d Jumat akan otomatis dijadwalkan berurutan setelah tanggal Senin ini.
                </p>
              </div>

              {/* 5-Day Preview List */}
              <div>
                <span className="font-bold text-slate-800 block mb-2">5 Rincian Harian yang Akan Disinkronkan:</span>
                <div className="space-y-2">
                  {days.map((day, idx) => {
                    const schedule = currentDailySchedules[day];
                    const targetDateObj = new Date(syncStartDate);
                    targetDateObj.setDate(targetDateObj.getDate() + idx);
                    const dateString = isNaN(targetDateObj.getTime()) ? '' : targetDateObj.toISOString().split('T')[0];

                    return (
                      <div key={day} className="p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition-all flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <strong className="text-slate-900">{day}</strong>
                              {dateString && <span className="font-mono text-[10px] text-slate-400">({dateString})</span>}
                            </div>
                            <p className="text-[11px] text-slate-600 font-medium">
                              Topik: {schedule?.dailyTopic || `${currentRppm.subtheme} Hari ${day}`}
                            </p>
                            <p className="text-[10px] text-emerald-700 mt-0.5">
                              ✓ 5 Tahap Pembelajaran • ✓ Muatan Inovatif • ✓ Asesmen KKTP • ✓ APBQ 2026
                            </p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 shrink-0">
                          Siap Digunakan
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Checkbox: Redirect to RPPH view */}
              <label className="flex items-center gap-2 pt-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoRedirectRPPH}
                  onChange={e => setAutoRedirectRPPH(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                />
                <span className="text-slate-700 font-medium text-xs">
                  Buka langsung halaman RPPH setelah proses sinkronisasi selesai
                </span>
              </label>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setIsSyncModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSyncAllDays}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Mulai Sinkronisasi Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: KONFIRMASI HAPUS RPPM                                              */}
      {/* ========================================================================= */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Hapus Dokumen RPPM Ini?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tindakan ini akan menghapus rancangan mingguan pekan ini.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
              Pekan ke-{currentRppm.week} • {currentRppm.subTopic || currentRppm.subtheme} ({currentRppm.theme})
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteCurrentRPPM}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
