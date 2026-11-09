import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarEvent, RombelMeeting } from '../../types';
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Clock,
  X,
  CheckCircle2,
  CheckCheck,
  PlayCircle,
  Filter,
  CalendarDays,
  Sparkles,
  Info,
  LayoutGrid,
  List,
  RotateCcw,
  Check,
  Radio,
  Video,
  MessageSquare,
  ArrowRight,
  School,
  Users,
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const {
    calendarEvents,
    addCalendarEvent,
    deleteCalendarEvent,
    currentRole,
    setActiveTab,
    rombelMeetings,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'berlangsung' | 'mendatang' | 'selesai'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Local actual date string helper (e.g. 2026-10-03)
  const getLocalDateStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const actualToday = useMemo(() => getLocalDateStr(), []);
  const [currentReferenceDate, setCurrentReferenceDate] = useState<string>(actualToday);

  const [formData, setFormData] = useState<Omit<CalendarEvent, 'id'>>({
    title: '',
    date: currentReferenceDate,
    endDate: currentReferenceDate,
    type: 'school_event',
    description: '',
  });

  // Combine standard calendar events with online rombel meetings for unified real-time synchronization
  const allCalendarEvents = useMemo(() => {
    const list: (CalendarEvent & { meetingRef?: RombelMeeting })[] = calendarEvents.map(e => ({ ...e }));

    rombelMeetings.forEach(m => {
      const exists = list.find(e =>
        e.id === `cal-meet-${m.id}` ||
        e.id === `meet-sync-${m.id}` ||
        e.title.includes(m.meetingCode) ||
        (e.title.includes(m.title) && e.date === m.date)
      );

      if (!exists) {
        list.push({
          id: `meet-sync-${m.id}`,
          title: `[Rapat Online] ${m.title} (${m.rombelName})`,
          date: m.date,
          endDate: m.date,
          type: 'tk_event',
          description: `Rapat online dan streaming untuk ${m.rombelName}. Host: ${m.hostTeacherName}. Pukul: ${m.time}. Status: ${m.status === 'live' ? 'SEDANG LIVE' : 'Dijadwalkan'}. Kode: ${m.meetingCode}`,
          color: m.status === 'live' ? 'rose' : 'teal',
          meetingRef: m,
        });
      } else {
        exists.meetingRef = m;
      }
    });

    return list;
  }, [calendarEvents, rombelMeetings]);

  // Calculate status for each event relative to the reference date:
  // - 'selesai': if event has already passed (referenceDate > endDate)
  // - 'berlangsung': if event is happening today (referenceDate >= startDate && referenceDate <= endDate)
  // - 'mendatang': if event is in the future (referenceDate < startDate)
  const getEventTiming = (date: string, endDate?: string): 'selesai' | 'berlangsung' | 'mendatang' => {
    const end = endDate && endDate >= date ? endDate : date;
    if (currentReferenceDate > end) {
      return 'selesai';
    }
    if (currentReferenceDate >= date && currentReferenceDate <= end) {
      return 'berlangsung';
    }
    return 'mendatang';
  };

  // Human-readable days difference
  const getDaysDiffDescription = (date: string, endDate?: string) => {
    const timing = getEventTiming(date, endDate);
    const ref = new Date(currentReferenceDate).getTime();
    const start = new Date(date).getTime();
    const end = new Date(endDate || date).getTime();
    const msInDay = 1000 * 60 * 60 * 24;

    if (timing === 'berlangsung') {
      return 'Sedang berlangsung hari ini';
    }
    if (timing === 'selesai') {
      const daysAgo = Math.round((ref - end) / msInDay);
      return daysAgo <= 1 ? 'Selesai kemarin' : `Telah lewat ${daysAgo} hari lalu`;
    }
    const daysAhead = Math.round((start - ref) / msInDay);
    return daysAhead === 1 ? 'Besok' : `Dalam ${daysAhead} hari`;
  };

  const filteredEvents = useMemo(() => {
    return allCalendarEvents
      .filter(event => {
        const timing = getEventTiming(event.date, event.endDate);
        if (activeFilter === 'all') return true;
        return timing === activeFilter;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [allCalendarEvents, activeFilter, currentReferenceDate]);

  const stats = useMemo(() => {
    let berlangsung = 0;
    let selesai = 0;
    let mendatang = 0;

    allCalendarEvents.forEach(e => {
      const t = getEventTiming(e.date, e.endDate);
      if (t === 'berlangsung') berlangsung++;
      else if (t === 'selesai') selesai++;
      else mendatang++;
    });

    return { berlangsung, selesai, mendatang, total: allCalendarEvents.length };
  }, [allCalendarEvents, currentReferenceDate]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addCalendarEvent(formData);
    setIsModalOpen(false);
    setFormData({
      title: '',
      date: currentReferenceDate,
      endDate: currentReferenceDate,
      type: 'school_event',
      description: '',
    });
  };

  const typeBadges: Record<CalendarEvent['type'], { badge: string; label: string }> = {
    effective: { badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', label: 'Hari Efektif' },
    holiday: { badge: 'bg-rose-50 text-rose-800 border-rose-200', label: 'Libur Sekolah' },
    school_event: { badge: 'bg-blue-50 text-blue-800 border-blue-200', label: 'Kegiatan Sekolah' },
    semester_start: { badge: 'bg-purple-50 text-purple-800 border-purple-200', label: 'Awal Semester' },
    semester_end: { badge: 'bg-slate-100 text-slate-800 border-slate-200', label: 'Akhir Semester' },
    report_distribution: { badge: 'bg-amber-50 text-amber-800 border-amber-200', label: 'Pembagian Rapor' },
    tk_event: { badge: 'bg-teal-50 text-teal-800 border-teal-200', label: 'Acara Khas TKQ' },
  };

  // Format date to Indonesian text
  const formatDateID = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Kalender Program Kerja</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                Program Kerja 2026/2027
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                Terintegrasi Proker & Kegiatan
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Jadwal pelaksanaan program kerja satuan PAUD TK Ceria Bangsa, timeline kegiatan berlangsung, agenda mendatang, dan monitoring ketercapaian program.
            </p>
          </div>
        </div>

        {/* Right Action & Reference Date Indicator */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <span className="text-slate-500 font-medium">Hari Ini:</span>
            <input
              type="date"
              value={currentReferenceDate}
              onChange={e => setCurrentReferenceDate(e.target.value)}
              className="bg-transparent font-mono font-bold text-slate-800 outline-none text-xs cursor-pointer"
              title="Ubah tanggal acuan jika ingin mensimulasikan tanggal lain"
            />
            {currentReferenceDate !== actualToday && (
              <button
                onClick={() => setCurrentReferenceDate(actualToday)}
                className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                title="Kembali ke tanggal sistem saat ini"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {currentRole === 'admin' && (
            <button
              onClick={() => {
                setFormData({
                  title: '',
                  date: currentReferenceDate,
                  endDate: currentReferenceDate,
                  type: 'school_event',
                  description: '',
                });
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Program Kerja</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 Status Summary Banner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 1. Sedang Berlangsung (Hari Ini) */}
        <div
          onClick={() => setActiveFilter(activeFilter === 'berlangsung' ? 'all' : 'berlangsung')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            activeFilter === 'berlangsung'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
              : 'bg-white border-blue-200/90 hover:border-blue-400 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-xl ${activeFilter === 'berlangsung' ? 'bg-blue-700 text-white' : 'bg-blue-50 text-blue-700'}`}>
              <PlayCircle className="w-4 h-4" />
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              activeFilter === 'berlangsung' ? 'bg-blue-800 text-blue-100' : 'bg-blue-100 text-blue-800'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
              Hari Ini Aktif
            </span>
          </div>
          <p className={`text-2xl font-extrabold tabular-nums ${activeFilter === 'berlangsung' ? 'text-white' : 'text-blue-700'}`}>
            {stats.berlangsung} Kegiatan
          </p>
          <p className={`text-xs font-bold mt-0.5 ${activeFilter === 'berlangsung' ? 'text-blue-100' : 'text-slate-800'}`}>
            Sedang Berlangsung
          </p>
          <p className={`text-[11px] mt-1 ${activeFilter === 'berlangsung' ? 'text-blue-200' : 'text-slate-500'}`}>
            Kegiatan aktif di sekolah pada hari ini ({formatDateID(currentReferenceDate)})
          </p>
        </div>

        {/* 2. Sudah Selesai (Telah Lewat) */}
        <div
          onClick={() => setActiveFilter(activeFilter === 'selesai' ? 'all' : 'selesai')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            activeFilter === 'selesai'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300'
              : 'bg-white border-slate-200/80 hover:border-emerald-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-xl ${activeFilter === 'selesai' ? 'bg-emerald-800 text-white' : 'bg-emerald-50 text-emerald-700'}`}>
              <CheckCheck className="w-4 h-4" />
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              activeFilter === 'selesai' ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-100 text-emerald-800'
            }`}>
              Telah Terlaksana
            </span>
          </div>
          <p className={`text-2xl font-extrabold tabular-nums ${activeFilter === 'selesai' ? 'text-white' : 'text-emerald-700'}`}>
            {stats.selesai} Kegiatan
          </p>
          <p className={`text-xs font-bold mt-0.5 ${activeFilter === 'selesai' ? 'text-emerald-100' : 'text-slate-800'}`}>
            Sudah Selesai
          </p>
          <p className={`text-[11px] mt-1 ${activeFilter === 'selesai' ? 'text-emerald-200' : 'text-slate-500'}`}>
            Jadwal kegiatan yang tanggalnya telah terlewati
          </p>
        </div>

        {/* 3. Akan Datang (Mendatang) */}
        <div
          onClick={() => setActiveFilter(activeFilter === 'mendatang' ? 'all' : 'mendatang')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            activeFilter === 'mendatang'
              ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-300'
              : 'bg-white border-slate-200/80 hover:border-purple-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-xl ${activeFilter === 'mendatang' ? 'bg-purple-700 text-white' : 'bg-purple-50 text-purple-700'}`}>
              <Clock className="w-4 h-4" />
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              activeFilter === 'mendatang' ? 'bg-purple-800 text-purple-100' : 'bg-purple-100 text-purple-800'
            }`}>
              Akan Datang
            </span>
          </div>
          <p className={`text-2xl font-extrabold tabular-nums ${activeFilter === 'mendatang' ? 'text-white' : 'text-purple-700'}`}>
            {stats.mendatang} Kegiatan
          </p>
          <p className={`text-xs font-bold mt-0.5 ${activeFilter === 'mendatang' ? 'text-purple-100' : 'text-slate-800'}`}>
            Mendatang
          </p>
          <p className={`text-[11px] mt-1 ${activeFilter === 'mendatang' ? 'text-purple-200' : 'text-slate-500'}`}>
            Rencana agenda kegiatan berikutnya di masa mendatang
          </p>
        </div>
      </div>

      {/* Control Bar: Filter Tabs & View Mode */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 bg-slate-100/90 rounded-2xl">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Semua Kegiatan ({stats.total})</span>
          </button>

          <button
            onClick={() => setActiveFilter('berlangsung')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'berlangsung'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span>Sedang Berlangsung ({stats.berlangsung})</span>
          </button>

          <button
            onClick={() => setActiveFilter('selesai')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'selesai'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Sudah Selesai ({stats.selesai})</span>
          </button>

          <button
            onClick={() => setActiveFilter('mendatang')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'mendatang'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>Akan Datang ({stats.mendatang})</span>
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs self-end sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'grid' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Tampilan Kartu (Grid)"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'table' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Tampilan Tabel (List)"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid or Table of Events */}
      {filteredEvents.length === 0 ? (
        <div className="py-14 text-center bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs">
          <Info className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700">Tidak ada kegiatan pada kategori ini</p>
          <p className="text-xs text-slate-500 mt-1">Pilih filter lain atau tambahkan kegiatan baru ke kalender akademik.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map(event => {
            const timing = getEventTiming(event.date, event.endDate);
            const timingDiff = getDaysDiffDescription(event.date, event.endDate);

            return (
              <div
                key={event.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                  timing === 'berlangsung'
                    ? 'bg-blue-50/40 border-blue-400 ring-2 ring-blue-300/70 shadow-md'
                    : timing === 'selesai'
                    ? 'bg-slate-50/70 border-slate-200/80 hover:border-slate-300 opacity-90 hover:opacity-100'
                    : 'bg-white border-slate-200/80 shadow-xs hover:border-purple-300'
                }`}
              >
                {/* Active indicator top bar */}
                {timing === 'berlangsung' && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-teal-400 to-blue-600 animate-pulse" />
                )}

                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    {/* Status Badge: Sedang Berlangsung vs Sudah Selesai vs Akan Datang */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {timing === 'berlangsung' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[11px] bg-blue-600 text-white shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                          Sedang Berlangsung (Hari Ini)
                        </span>
                      ) : timing === 'selesai' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[11px] bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-700" />
                          Sudah Selesai
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold text-[11px] bg-purple-50 text-purple-700 border border-purple-200">
                          <Clock className="w-3.5 h-3.5 text-purple-600" />
                          Akan Datang
                        </span>
                      )}

                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                          typeBadges[event.type]?.badge || 'bg-slate-100'
                        }`}
                      >
                        {typeBadges[event.type]?.label || event.type}
                      </span>

                      {event.meetingRef && (
                        event.meetingRef.status === 'live' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-black text-[10px] bg-rose-500 text-white animate-pulse">
                            <Radio className="w-3 h-3" />
                            LIVE RAPAT
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-teal-50 text-teal-800 border border-teal-200">
                            <Video className="w-3 h-3 text-teal-600" />
                            Rapat Online
                          </span>
                        )
                      )}
                    </div>

                    {currentRole !== 'murid' && !event.meetingRef && (
                      <button
                        onClick={() => deleteCalendarEvent(event.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Hapus Kegiatan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <h3 className={`text-sm font-bold leading-snug ${
                    timing === 'selesai' ? 'text-slate-700 line-clamp-2' : 'text-slate-900'
                  }`}>
                    {event.title}
                  </h3>

                  {event.description && (
                    <p className={`text-xs mt-2 leading-relaxed ${
                      timing === 'selesai' ? 'text-slate-500' : 'text-slate-600'
                    }`}>
                      {event.description}
                    </p>
                  )}

                  {/* Connected Rapat Online Widget */}
                  {event.meetingRef && (
                    <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-teal-950">
                          <Users className="w-3.5 h-3.5 text-teal-700" />
                          <span>Rombel {event.meetingRef.rombelName}</span>
                        </div>
                        <p className="text-[11px] text-teal-800 font-mono mt-0.5">
                          {event.meetingRef.time} · Kode: {event.meetingRef.meetingCode}
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('forum_rombel')}
                        className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer hover:scale-105"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Masuk Ruang Rapat</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                <div className={`mt-5 pt-3 border-t flex items-center justify-between text-xs ${
                  timing === 'berlangsung'
                    ? 'border-blue-200 text-blue-900 font-semibold'
                    : timing === 'selesai'
                    ? 'border-slate-200 text-slate-500'
                    : 'border-slate-100 text-slate-600'
                }`}>
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {event.date}
                      {event.endDate && event.endDate !== event.date ? ` s/d ${event.endDate}` : ''}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    timing === 'berlangsung'
                      ? 'bg-blue-100 text-blue-800'
                      : timing === 'selesai'
                      ? 'bg-slate-200/80 text-slate-700'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {timingDiff}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table Mode */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/90 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Status Kegiatan</th>
                  <th className="py-3 px-4">Nama Kegiatan Akademik</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Tanggal Pelaksanaan</th>
                  <th className="py-3 px-4">Keterangan</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvents.map(event => {
                  const timing = getEventTiming(event.date, event.endDate);
                  const timingDiff = getDaysDiffDescription(event.date, event.endDate);

                  return (
                    <tr
                      key={event.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        timing === 'berlangsung' ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {timing === 'berlangsung' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] bg-blue-600 text-white shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                            Sedang Berlangsung (Hari Ini)
                          </span>
                        ) : timing === 'selesai' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-700" />
                            Sudah Selesai
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-[10px] bg-purple-50 text-purple-700 border border-purple-200">
                            <Clock className="w-3 h-3 text-purple-600" />
                            Akan Datang
                          </span>
                        )}
                      </td>

                      {/* Title */}
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{event.title}</span>
                          {event.meetingRef && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200 shrink-0 flex items-center gap-1">
                              <Video className="w-3 h-3 text-teal-600" />
                              Rapat Online
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                            typeBadges[event.type]?.badge || 'bg-slate-100'
                          }`}
                        >
                          {typeBadges[event.type]?.label || event.type}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px]">
                        <div>
                          {event.date}
                          {event.endDate && event.endDate !== event.date ? ` s/d ${event.endDate}` : ''}
                        </div>
                        <span className="text-[10px] text-slate-400 font-sans">{timingDiff}</span>
                      </td>

                      {/* Description */}
                      <td className="py-3 px-4 text-slate-600 text-[11px] max-w-xs truncate">
                        {event.description || '-'}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {event.meetingRef && (
                            <button
                              onClick={() => setActiveTab('forum_rombel')}
                              className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                              title="Masuk Ruang Rapat"
                            >
                              <Video className="w-3 h-3" />
                              <span>Buka Rapat</span>
                            </button>
                          )}
                          {currentRole !== 'murid' && !event.meetingRef ? (
                            <button
                              onClick={() => deleteCalendarEvent(event.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Kegiatan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : !event.meetingRef ? (
                            <span className="text-[11px] text-slate-400 font-medium italic">Resmi</span>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Tambah Kegiatan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Tambah Kegiatan Kalender Akademik</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Kegiatan / Acara *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Peragaan Manasik Haji Cilik"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tanggal Mulai *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tanggal Selesai</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Jenis / Kategori Kegiatan</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as CalendarEvent['type'] })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-medium"
                >
                  <option value="school_event">Kegiatan Sekolah / Field Trip</option>
                  <option value="tk_event">Acara Khas TKQ / Panggung Seni</option>
                  <option value="effective">Hari Efektif Belajar</option>
                  <option value="holiday">Libur Sekolah / Hari Libur Nasional</option>
                  <option value="semester_start">Awal Semester / MPLS</option>
                  <option value="semester_end">Akhir Semester / Libur</option>
                  <option value="report_distribution">Pembagian Rapor Santri</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Deskripsi / Keterangan</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Keterangan singkat mengenai jadwal kegiatan..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 text-slate-700"
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
                  Simpan ke Kalender
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
