import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CapaianPembelajaran, TujuanPembelajaran, LearningElement } from '../../types';
import {
  Layers,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  X,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Target,
  FileText,
  RotateCcw,
  Check,
  Info,
  ListTree,
} from 'lucide-react';

export const CPTPManagementView: React.FC = () => {
  const {
    learningElements,
    cpList,
    tpList,
    addCP,
    updateCP,
    deleteCP,
    addTP,
    updateTP,
    deleteTP,
    resetCPTPToDefault,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'hierarchy' | 'cp' | 'tp'>('hierarchy');
  const [selectedElementFilter, setSelectedElementFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Accordion state for hierarchy view
  const [expandedElements, setExpandedElements] = useState<Record<string, boolean>>({
    'elem-nabp': true,
    'elem-jd': true,
    'elem-literasi': true,
    'elem-tilawah': true,
    'elem-tahfidz': true,
    'elem-hikmah': true,
  });
  const [expandedCPs, setExpandedCPs] = useState<Record<string, boolean>>({});

  // Modals state
  const [isCPModalOpen, setIsCPModalOpen] = useState(false);
  const [editingCP, setEditingCP] = useState<CapaianPembelajaran | null>(null);

  const [isTPModalOpen, setIsTPModalOpen] = useState(false);
  const [editingTP, setEditingTP] = useState<TujuanPembelajaran | null>(null);

  // In-app confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    type: 'cp' | 'tp' | 'reset';
    id?: string;
    title: string;
    description: string;
  } | null>(null);

  // CP Form Data
  const [cpFormData, setCpFormData] = useState<Omit<CapaianPembelajaran, 'id'>>({
    elementId: learningElements[0]?.id || '',
    elementName: learningElements[0]?.name || '',
    code: '',
    title: '',
    description: '',
    ageGroup: 'Semua Usia',
    status: 'Aktif',
  });

  // TP Form Data
  const [tpFormData, setTpFormData] = useState<Omit<TujuanPembelajaran, 'id'>>({
    elementId: learningElements[0]?.id || '',
    elementName: learningElements[0]?.name || '',
    cpId: '',
    cpCode: '',
    cpTitle: '',
    code: '',
    title: '',
    indicator: '',
    ageGroup: 'Semua Usia',
    status: 'Aktif',
  });

  const toggleElementExpand = (elemId: string) => {
    setExpandedElements(prev => ({ ...prev, [elemId]: !prev[elemId] }));
  };

  const toggleCPExpand = (cpId: string) => {
    setExpandedCPs(prev => ({ ...prev, [cpId]: !prev[cpId] }));
  };

  // Open Add CP
  const handleOpenAddCP = (preselectedElementId?: string) => {
    setEditingCP(null);
    const targetElement = learningElements.find(e => e.id === preselectedElementId) || learningElements[0];
    const elementCPs = cpList.filter(c => c.elementId === targetElement.id);
    const nextCode = `CP-${targetElement.code}-${String(elementCPs.length + 1).padStart(2, '0')}`;

    setCpFormData({
      elementId: targetElement.id,
      elementName: targetElement.name,
      code: nextCode,
      title: '',
      description: '',
      ageGroup: 'Semua Usia',
      status: 'Aktif',
    });
    setIsCPModalOpen(true);
  };

  // Open Edit CP
  const handleOpenEditCP = (cp: CapaianPembelajaran) => {
    setEditingCP(cp);
    setCpFormData({
      elementId: cp.elementId,
      elementName: cp.elementName,
      code: cp.code,
      title: cp.title,
      description: cp.description,
      ageGroup: cp.ageGroup,
      status: cp.status,
    });
    setIsCPModalOpen(true);
  };

  // Handle Save CP
  const handleSaveCP = (e: React.FormEvent) => {
    e.preventDefault();
    const elem = learningElements.find(el => el.id === cpFormData.elementId);
    const finalData = {
      ...cpFormData,
      elementName: elem?.name || cpFormData.elementName,
    };

    if (editingCP) {
      updateCP({ ...finalData, id: editingCP.id });
    } else {
      addCP(finalData);
    }
    setIsCPModalOpen(false);
  };

  // Open Add TP
  const handleOpenAddTP = (preselectedCpId?: string) => {
    setEditingTP(null);
    const targetCP = cpList.find(c => c.id === preselectedCpId) || cpList[0];
    const elem = learningElements.find(el => el.id === targetCP?.elementId) || learningElements[0];
    const relatedTPs = tpList.filter(t => t.cpId === targetCP?.id);
    const nextCode = targetCP ? `${targetCP.code.replace('CP', 'TP')}.${relatedTPs.length + 1}` : 'TP-01.1';

    setTpFormData({
      elementId: elem.id,
      elementName: elem.name,
      cpId: targetCP?.id || '',
      cpCode: targetCP?.code || '',
      cpTitle: targetCP?.title || '',
      code: nextCode,
      title: '',
      indicator: '',
      ageGroup: 'Semua Usia',
      status: 'Aktif',
    });
    setIsTPModalOpen(true);
  };

  // Open Edit TP
  const handleOpenEditTP = (tp: TujuanPembelajaran) => {
    setEditingTP(tp);
    setTpFormData({
      elementId: tp.elementId,
      elementName: tp.elementName,
      cpId: tp.cpId,
      cpCode: tp.cpCode,
      cpTitle: tp.cpTitle,
      code: tp.code,
      title: tp.title,
      indicator: tp.indicator || '',
      ageGroup: tp.ageGroup,
      status: tp.status,
    });
    setIsTPModalOpen(true);
  };

  // Handle Save TP
  const handleSaveTP = (e: React.FormEvent) => {
    e.preventDefault();
    const cp = cpList.find(c => c.id === tpFormData.cpId);
    const elem = learningElements.find(el => el.id === (cp?.elementId || tpFormData.elementId));

    const finalData = {
      ...tpFormData,
      elementId: elem?.id || tpFormData.elementId,
      elementName: elem?.name || tpFormData.elementName,
      cpCode: cp?.code || tpFormData.cpCode,
      cpTitle: cp?.title || tpFormData.cpTitle,
    };

    if (editingTP) {
      updateTP({ ...finalData, id: editingTP.id });
    } else {
      addTP(finalData);
    }
    setIsTPModalOpen(false);
  };

  // Filtered CP & TP
  const filteredCPList = useMemo(() => {
    return cpList.filter(cp => {
      const matchElem = selectedElementFilter === 'all' || cp.elementId === selectedElementFilter;
      const matchSearch =
        cp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cp.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cp.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchElem && matchSearch;
    });
  }, [cpList, selectedElementFilter, searchQuery]);

  const filteredTPList = useMemo(() => {
    return tpList.filter(tp => {
      const matchElem = selectedElementFilter === 'all' || tp.elementId === selectedElementFilter;
      const matchSearch =
        tp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tp.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tp.indicator && tp.indicator.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchElem && matchSearch;
    });
  }, [tpList, selectedElementFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Bank Capaian Pembelajaran (CP) & Tujuan Pembelajaran (TP)
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                Admin / TU Kurikulum
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola struktur berjenjang <b>Elemen &rarr; CP &rarr; TP</b> agar guru dapat langsung memilih data saat menyusun RPPM.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setConfirmModal({
                type: 'reset',
                title: 'Kembalikan Bank CP & TP ke Standar Awal?',
                description: 'Seluruh penyesuaian akan direset kembali ke standar Kurikulum Merdeka Kemendikbud & Khas Bustanul Qur\'an.',
              });
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs transition-all cursor-pointer"
            title="Kembalikan preset standar Kemendikbud & APBQ"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Standar</span>
          </button>

          <button
            onClick={() => handleOpenAddCP()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tambah CP</span>
          </button>

          <button
            onClick={() => handleOpenAddTP()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tambah TP</span>
          </button>
        </div>
      </div>

      {/* 3 Summary Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              1. Elemen Pembelajaran
            </span>
            <p className="text-xl font-black text-slate-900 mt-0.5">{learningElements.length} Elemen</p>
            <p className="text-[11px] text-slate-500 mt-0.5">3 Merdeka PAUD + 3 Bustanul Qur&apos;an</p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 block">
              2. Capaian Pembelajaran (CP)
            </span>
            <p className="text-xl font-black text-teal-800 mt-0.5">{cpList.length} Capaian (CP)</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Tersedia untuk dipilih guru di RPPM</p>
          </div>
          <div className="p-3 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
            <Target className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
              3. Tujuan Pembelajaran (TP)
            </span>
            <p className="text-xl font-black text-emerald-800 mt-0.5">{tpList.length} Tujuan (TP)</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Siap dipasangkan dengan ragam main</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & View Mode Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Tabs: Hierarki, Tabel CP, Tabel TP */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('hierarchy')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'hierarchy'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListTree className="w-3.5 h-3.5" />
            <span>Pohon Elemen &rarr; CP &rarr; TP</span>
          </button>

          <button
            onClick={() => setActiveTab('cp')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'cp'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Daftar CP ({filteredCPList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tp')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'tp'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Daftar TP ({filteredTPList.length})</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Search */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari CP, TP, kode, atau materi..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-teal-500"
            />
          </div>

          {/* Element Filter */}
          <select
            value={selectedElementFilter}
            onChange={e => setSelectedElementFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-teal-500"
          >
            <option value="all">Semua Elemen ({learningElements.length})</option>
            {learningElements.map(el => (
              <option key={el.id} value={el.id}>
                {el.name} ({el.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TAB 1: POHON HIERARKI (Elemen -> CP -> TP) */}
      {activeTab === 'hierarchy' && (
        <div className="space-y-4">
          {learningElements
            .filter(el => selectedElementFilter === 'all' || el.id === selectedElementFilter)
            .map(element => {
              const isElemExpanded = expandedElements[element.id] !== false;
              const elementCPs = cpList.filter(c => c.elementId === element.id);
              const elementTPs = tpList.filter(t => t.elementId === element.id);

              return (
                <div
                  key={element.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
                >
                  {/* Element Bar */}
                  <div
                    onClick={() => toggleElementExpand(element.id)}
                    className="p-4 bg-slate-50 hover:bg-slate-100/80 border-b border-slate-200 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <button className="p-1 rounded-lg text-slate-400">
                        {isElemExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg bg-slate-900 text-white">
                          {element.code}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm">{element.name}</h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          {element.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-500 font-medium">
                        <b>{elementCPs.length}</b> CP · <b>{elementTPs.length}</b> TP
                      </span>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleOpenAddCP(element.id);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>CP Baru</span>
                      </button>
                    </div>
                  </div>

                  {/* CPs under this Element */}
                  {isElemExpanded && (
                    <div className="p-4 space-y-4 bg-slate-50/30">
                      {elementCPs.length === 0 ? (
                        <div className="py-6 text-center text-slate-400 text-xs">
                          Belum ada Capaian Pembelajaran (CP) untuk elemen ini.{' '}
                          <button
                            onClick={() => handleOpenAddCP(element.id)}
                            className="text-teal-600 font-bold underline cursor-pointer"
                          >
                            Tambah CP Pertama
                          </button>
                        </div>
                      ) : (
                        elementCPs.map(cp => {
                          const isCPExp = expandedCPs[cp.id] !== false;
                          const relatedTPs = tpList.filter(t => t.cpId === cp.id);

                          return (
                            <div
                              key={cp.id}
                              className="rounded-xl border border-teal-200/80 bg-white overflow-hidden shadow-2xs"
                            >
                              {/* CP Header Bar */}
                              <div
                                onClick={() => toggleCPExpand(cp.id)}
                                className="p-3.5 bg-teal-50/50 hover:bg-teal-50 border-b border-teal-100 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                              >
                                <div className="flex items-start gap-2.5">
                                  <button className="p-0.5 rounded text-teal-600 mt-0.5">
                                    {isCPExp ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                  </button>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono font-bold text-[11px] px-2 py-0.5 rounded bg-teal-600 text-white">
                                        {cp.code}
                                      </span>
                                      <h4 className="font-bold text-slate-900 text-xs">{cp.title}</h4>
                                      <span className="text-[10px] text-teal-800 bg-teal-100 px-1.5 py-0.5 rounded font-medium">
                                        {relatedTPs.length} TP
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                                      {cp.description}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                                  <button
                                    onClick={e => {
                                      e.stopPropagation();
                                      handleOpenAddTP(cp.id);
                                    }}
                                    className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                                    title="Tambah TP di bawah CP ini"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>Tambah TP</span>
                                  </button>
                                  <button
                                    onClick={e => {
                                      e.stopPropagation();
                                      handleOpenEditCP(cp);
                                    }}
                                    className="p-1 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg cursor-pointer"
                                    title="Edit CP"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={e => {
                                      e.stopPropagation();
                                      setConfirmModal({
                                        type: 'cp',
                                        id: cp.id,
                                        title: `Hapus Capaian ${cp.code}?`,
                                        description: `Seluruh Tujuan Pembelajaran (TP) yang diturunkan dari "${cp.title}" juga akan dihapus.`,
                                      });
                                    }}
                                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                    title="Hapus CP"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* TPs under this CP */}
                              {isCPExp && (
                                <div className="p-3 bg-white space-y-2">
                                  {relatedTPs.length === 0 ? (
                                    <p className="text-center text-slate-400 text-xs py-3">
                                      Belum ada Tujuan Pembelajaran (TP) yang diturunkan dari CP ini.{' '}
                                      <button
                                        onClick={() => handleOpenAddTP(cp.id)}
                                        className="text-emerald-600 font-bold underline cursor-pointer"
                                      >
                                        + Tambah TP
                                      </button>
                                    </p>
                                  ) : (
                                    <div className="grid grid-cols-1 gap-2">
                                      {relatedTPs.map(tp => (
                                        <div
                                          key={tp.id}
                                          className="p-3 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors"
                                        >
                                          <div className="flex items-start gap-2.5">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                            <div>
                                              <div className="flex items-center gap-2">
                                                <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                                  {tp.code}
                                                </span>
                                                <span className="text-[10px] font-semibold text-slate-400">
                                                  Tujuan Pembelajaran Konkret:
                                                </span>
                                              </div>
                                              <p className="font-semibold text-slate-900 mt-0.5 leading-snug">
                                                {tp.title}
                                              </p>
                                              {tp.indicator && (
                                                <p className="text-[11px] text-slate-500 mt-1">
                                                  Indikator: <span className="italic">{tp.indicator}</span>
                                                </p>
                                              )}
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
                                            <button
                                              onClick={() => handleOpenEditTP(tp)}
                                              className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"
                                              title="Edit TP"
                                            >
                                              <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                              onClick={() => {
                                                setConfirmModal({
                                                  type: 'tp',
                                                  id: tp.id,
                                                  title: `Hapus Tujuan Pembelajaran ${tp.code}?`,
                                                  description: `Tujuan pembelajaran "${tp.title}" akan dihapus dari bank data.`,
                                                });
                                              }}
                                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                              title="Hapus TP"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {/* TAB 2: DAFTAR CAPAIAN PEMBELAJARAN (CP) */}
      {activeTab === 'cp' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/90 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Kode CP</th>
                  <th className="py-3 px-4">Elemen</th>
                  <th className="py-3 px-4">Judul & Deskripsi Capaian Pembelajaran</th>
                  <th className="py-3 px-4 text-center">Jumlah TP</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCPList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Tidak ada data Capaian Pembelajaran yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  filteredCPList.map(cp => {
                    const tpCount = tpList.filter(t => t.cpId === cp.id).length;
                    return (
                      <tr key={cp.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-teal-800 whitespace-nowrap">
                          {cp.code}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-800">
                          {cp.elementName}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900 leading-snug">{cp.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{cp.description}</p>
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                          <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                            {tpCount} TP
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-[10px] border border-emerald-200">
                            {cp.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenAddTP(cp.id)}
                              className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold cursor-pointer"
                              title="Tambah TP di bawah CP ini"
                            >
                              + TP
                            </button>
                            <button
                              onClick={() => handleOpenEditCP(cp)}
                              className="p-1.5 text-slate-400 hover:text-teal-600 rounded-lg cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setConfirmModal({
                                  type: 'cp',
                                  id: cp.id,
                                  title: `Hapus Capaian ${cp.code}?`,
                                  description: `Seluruh Tujuan Pembelajaran (TP) yang diturunkan dari "${cp.title}" juga akan dihapus.`,
                                });
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DAFTAR TUJUAN PEMBELAJARAN (TP) */}
      {activeTab === 'tp' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/90 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Kode TP</th>
                  <th className="py-3 px-4">Elemen & CP Induk</th>
                  <th className="py-3 px-4">Bunyi Tujuan Pembelajaran (TP)</th>
                  <th className="py-3 px-4">Indikator Ketercapaian</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTPList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Tidak ada data Tujuan Pembelajaran yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  filteredTPList.map(tp => (
                    <tr key={tp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-800 whitespace-nowrap">
                        {tp.code}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-800 block text-xs">{tp.elementName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{tp.cpCode}</span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900 leading-snug">
                        {tp.title}
                      </td>
                      <td className="py-3 px-4 text-slate-500 italic text-[11px]">
                        {tp.indicator || '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-[10px] border border-emerald-200">
                          {tp.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditTP(tp)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setConfirmModal({
                                type: 'tp',
                                id: tp.id,
                                title: `Hapus Tujuan Pembelajaran ${tp.code}?`,
                                description: `Tujuan pembelajaran "${tp.title}" akan dihapus dari bank data.`,
                              });
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH / EDIT CAPAIAN PEMBELAJARAN (CP) */}
      {isCPModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {editingCP ? 'Ubah Capaian Pembelajaran (CP)' : 'Tambah Capaian Pembelajaran (CP) Baru'}
              </h3>
              <button
                onClick={() => setIsCPModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCP} className="space-y-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Elemen Pembelajaran *</label>
                <select
                  value={cpFormData.elementId}
                  onChange={e => {
                    const el = learningElements.find(item => item.id === e.target.value);
                    setCpFormData({
                      ...cpFormData,
                      elementId: e.target.value,
                      elementName: el?.name || '',
                      code: `CP-${el?.code || 'XX'}-${String(cpList.filter(c => c.elementId === e.target.value).length + 1).padStart(2, '0')}`,
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-teal-500 font-medium"
                >
                  {learningElements.map(el => (
                    <option key={el.id} value={el.id}>
                      {el.name} ({el.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kode CP *</label>
                  <input
                    type="text"
                    required
                    value={cpFormData.code}
                    onChange={e => setCpFormData({ ...cpFormData, code: e.target.value })}
                    placeholder="CP-NABP-01"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-teal-500 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Sasaran Usia</label>
                  <select
                    value={cpFormData.ageGroup}
                    onChange={e => setCpFormData({ ...cpFormData, ageGroup: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-teal-500"
                  >
                    <option value="Semua Usia">Semua Usia (Fase Fondasi)</option>
                    <option value="Kelompok A (4-5 Tahun)">Kelompok A (4-5 Tahun)</option>
                    <option value="Kelompok B (5-6 Tahun)">Kelompok B (5-6 Tahun)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Judul Singkat CP *</label>
                <input
                  type="text"
                  required
                  value={cpFormData.title}
                  onChange={e => setCpFormData({ ...cpFormData, title: e.target.value })}
                  placeholder="Contoh: Mengenal dan Mempraktikkan Pokok Ajaran Agama Islam"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-teal-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Deskripsi Lengkap Capaian Pembelajaran (CP) *</label>
                <textarea
                  rows={3}
                  required
                  value={cpFormData.description}
                  onChange={e => setCpFormData({ ...cpFormData, description: e.target.value })}
                  placeholder="Deskripsi rumusan capaian pembelajaran yang diharapkan..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-teal-500 text-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCPModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer shadow-sm"
                >
                  Simpan Capaian (CP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH / EDIT TUJUAN PEMBELAJARAN (TP) */}
      {isTPModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {editingTP ? 'Ubah Tujuan Pembelajaran (TP)' : 'Tambah Tujuan Pembelajaran (TP) Baru'}
              </h3>
              <button
                onClick={() => setIsTPModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTP} className="space-y-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Pilih CP Induk (Capaian Pembelajaran) *</label>
                <select
                  value={tpFormData.cpId}
                  onChange={e => {
                    const selectedCP = cpList.find(c => c.id === e.target.value);
                    const relatedTPs = tpList.filter(t => t.cpId === e.target.value);
                    setTpFormData({
                      ...tpFormData,
                      cpId: e.target.value,
                      cpCode: selectedCP?.code || '',
                      cpTitle: selectedCP?.title || '',
                      elementId: selectedCP?.elementId || tpFormData.elementId,
                      elementName: selectedCP?.elementName || tpFormData.elementName,
                      code: selectedCP ? `${selectedCP.code.replace('CP', 'TP')}.${relatedTPs.length + 1}` : 'TP-01.1',
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-medium"
                >
                  {cpList.map(c => (
                    <option key={c.id} value={c.id}>
                      [{c.code}] {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kode TP *</label>
                  <input
                    type="text"
                    required
                    value={tpFormData.code}
                    onChange={e => setTpFormData({ ...tpFormData, code: e.target.value })}
                    placeholder="TP-NABP-01.1"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Sasaran Usia</label>
                  <select
                    value={tpFormData.ageGroup}
                    onChange={e => setTpFormData({ ...tpFormData, ageGroup: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                  >
                    <option value="Semua Usia">Semua Usia (Fase Fondasi)</option>
                    <option value="Kelompok A (4-5 Tahun)">Kelompok A (4-5 Tahun)</option>
                    <option value="Kelompok B (5-6 Tahun)">Kelompok B (5-6 Tahun)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Bunyi Tujuan Pembelajaran (TP) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={tpFormData.title}
                  onChange={e => setTpFormData({ ...tpFormData, title: e.target.value })}
                  placeholder="Contoh: Anak terbiasa berdoa dengan khusyuk sebelum dan sesudah beraktivitas sehari-hari"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 text-slate-700"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Indikator Ketercapaian (Opsional)</label>
                <input
                  type="text"
                  value={tpFormData.indicator}
                  onChange={e => setTpFormData({ ...tpFormData, indicator: e.target.value })}
                  placeholder="Contoh: Melafalkan doa dengan sikap tertib tanpa diingatkan"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTPModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer shadow-sm"
                >
                  Simpan Tujuan (TP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full p-5 space-y-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              confirmModal.type === 'reset' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-rose-50 text-rose-600 border border-rose-200'
            }`}>
              {confirmModal.type === 'reset' ? <RotateCcw className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{confirmModal.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{confirmModal.description}</p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmModal.type === 'reset') {
                    resetCPTPToDefault();
                  } else if (confirmModal.type === 'cp' && confirmModal.id) {
                    deleteCP(confirmModal.id);
                  } else if (confirmModal.type === 'tp' && confirmModal.id) {
                    deleteTP(confirmModal.id);
                  }
                  setConfirmModal(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-white text-xs font-bold shadow-xs cursor-pointer ${
                  confirmModal.type === 'reset' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {confirmModal.type === 'reset' ? 'Ya, Reset Standar' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
