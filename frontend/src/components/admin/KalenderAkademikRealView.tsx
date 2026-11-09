import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarEvent } from '../../types';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Clock,
  MapPin,
  Sparkles,
  Info,
  CheckCircle2,
  X,
  Printer,
  Calendar as CalendarIcon,
  Filter,
  Layers,
  Award,
  AlertCircle,
  Edit2,
} from 'lucide-react';

interface KaldikMonth {
  year: number;
  monthIndex: number; // 0-11
  label: string; // e.g. "Juli 2026"
  semester: 'Semester 1' | 'Semester 2';
}

const MONTHS_ACADEMIC_YEAR: KaldikMonth[] = [
  { year: 2026, monthIndex: 6, label: 'Juli 2026', semester: 'Semester 1' },
  { year: 2026, monthIndex: 7, label: 'Agustus 2026', semester: 'Semester 1' },
  { year: 2026, monthIndex: 8, label: 'September 2026', semester: 'Semester 1' },
  { year: 2026, monthIndex: 9, label: 'Oktober 2026', semester: 'Semester 1' },
  { year: 2026, monthIndex: 10, label: 'November 2026', semester: 'Semester 1' },
  { year: 2026, monthIndex: 11, label: 'Desember 2026', semester: 'Semester 1' },
  { year: 2027, monthIndex: 0, label: 'Januari 2027', semester: 'Semester 2' },
  { year: 2027, monthIndex: 1, label: 'Februari 2027', semester: 'Semester 2' },
  { year: 2027, monthIndex: 2, label: 'Maret 2027', semester: 'Semester 2' },
  { year: 2027, monthIndex: 3, label: 'April 2027', semester: 'Semester 2' },
  { year: 2027, monthIndex: 4, label: 'Mei 2027', semester: 'Semester 2' },
  { year: 2027, monthIndex: 5, label: 'Juni 2027', semester: 'Semester 2' },
];

const DAY_NAMES = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export const KalenderAkademikRealView: React.FC = () => {
  const {
    currentRole,
    calendarEvents,
    addCalendarEvent,
    deleteCalendarEvent,
    schoolProfile,
    showToast,
  } = useApp();

  // Active month selector (default: September 2026 or current)
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(2); // 2 = September 2026
  const activeMonth = MONTHS_ACADEMIC_YEAR[selectedMonthIdx] || MONTHS_ACADEMIC_YEAR[0];

  // Selected date for day details sidebar / modal
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-09-15');

  // Filter type
  const [filterType, setFilterType] = useState<string>('all');

  // Modal tambah/edit kegiatan kaldik (Admin only)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formDate, setFormDate] = useState(selectedDateStr);
  const [formEndDate, setFormEndDate] = useState(selectedDateStr);
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<CalendarEvent['type']>('school_event');
  const [formDescription, setFormDescription] = useState('');
  const [formColor, setFormColor] = useState('teal');

  // Extended events with default official holidays & kaldik benchmarks
  const allEvents = useMemo(() => {
    return calendarEvents;
  }, [calendarEvents]);

  // Filtered events
  const displayedEvents = useMemo(() => {
    if (filterType === 'all') return allEvents;
    return allEvents.filter(e => e.type === filterType);
  }, [allEvents, filterType]);

  // Calendar matrix calculation for activeMonth
  const calendarDays = useMemo(() => {
    const { year, monthIndex } = activeMonth;
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Day of week: 0 = Sun, 1 = Mon, ... 6 = Sat
    // We want 0 = Mon, 1 = Tue, ... 6 = Sun
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const days: {
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      events: CalendarEvent[];
      isSunday: boolean;
    }[] = [];

    // Prev month days padding
    const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dNum = prevMonthLastDay - i;
      const prevMonthIdx = monthIndex === 0 ? 11 : monthIndex - 1;
      const prevYear = monthIndex === 0 ? year - 1 : year;
      const dateStr = `${prevYear}-${String(prevMonthIdx + 1).padStart(2, '0')}-${String(dNum).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNumber: dNum,
        isCurrentMonth: false,
        isToday: false,
        events: [],
        isSunday: false,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayOfWeek = new Date(year, monthIndex, d).getDay();
      const isSunday = dayOfWeek === 0;

      // Find events matching this date or falling in range
      const dayEvents = displayedEvents.filter(e => {
        if (!e.endDate || e.endDate === e.date) {
          return e.date === dateStr;
        }
        return dateStr >= e.date && dateStr <= e.endDate;
      });

      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: true,
        isToday: dateStr === '2026-09-23' || dateStr === '2026-10-03',
        events: dayEvents,
        isSunday,
      });
    }

    // Next month padding to fill out 35 or 42 cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let j = 1; j <= remaining; j++) {
      const nextMonthIdx = monthIndex === 11 ? 0 : monthIndex + 1;
      const nextYear = monthIndex === 11 ? year + 1 : year;
      const dateStr = `${nextYear}-${String(nextMonthIdx + 1).padStart(2, '0')}-${String(j).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNumber: j,
        isCurrentMonth: false,
        isToday: false,
        events: [],
        isSunday: false,
      });
    }

    return days;
  }, [activeMonth, displayedEvents]);

  // Selected date events
  const selectedDateEvents = useMemo(() => {
    return allEvents.filter(e => {
      if (!e.endDate || e.endDate === e.date) {
        return e.date === selectedDateStr;
      }
      return selectedDateStr >= e.date && selectedDateStr <= e.endDate;
    });
  }, [allEvents, selectedDateStr]);

  const handlePrevMonth = () => {
    setSelectedMonthIdx(prev => (prev > 0 ? prev - 1 : MONTHS_ACADEMIC_YEAR.length - 1));
  };

  const handleNextMonth = () => {
    setSelectedMonthIdx(prev => (prev < MONTHS_ACADEMIC_YEAR.length - 1 ? prev + 1 : 0));
  };

  const handleOpenAddModal = (dateStr?: string) => {
    const targetDate = dateStr || selectedDateStr;
    setFormDate(targetDate);
    setFormEndDate(targetDate);
    setFormTitle('');
    setFormType('school_event');
    setFormDescription('');
    setFormColor('teal');
    setIsAddModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast('Judul kegiatan wajib diisi', '', 'error');
      return;
    }

    addCalendarEvent({
      title: formTitle.trim(),
      date: formDate,
      endDate: formEndDate >= formDate ? formEndDate : formDate,
      type: formType,
      description: formDescription.trim(),
      color: formColor,
    });

    setIsAddModalOpen(false);
    showToast('Kegiatan Berhasil Ditambahkan', `Agenda telah dicatat ke Kalender Akademik.`, 'success');
  };

  const handleDeleteEvent = (id: string, title: string) => {
    if (window.confirm(`Hapus kegiatan "${title}" dari kalender akademik?`)) {
      deleteCalendarEvent(id);
      showToast('Kegiatan Dihapus', `Agenda "${title}" telah dihapus.`, 'info');
    }
  };

  // Color mapper helper
  const getEventBadgeStyle = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'holiday':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'semester_start':
      case 'semester_end':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'report_distribution':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'tk_event':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'school_event':
      default:
        return 'bg-sky-100 text-sky-800 border-sky-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Kalender Akademik Resmi (Kaldik)
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                T.A. 2026/2027
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {activeMonth.semester}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Visual matriks kalender tanggal, hari efektif pembelajaran, libur nasional, dan agenda TK Ceria Bangsa
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick Month Selector */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all cursor-pointer"
              title="Bulan Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <select
              value={selectedMonthIdx}
              onChange={e => setSelectedMonthIdx(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-slate-800 px-2 py-1 outline-none cursor-pointer"
            >
              {MONTHS_ACADEMIC_YEAR.map((m, idx) => (
                <option key={idx} value={idx}>
                  {m.label} ({m.semester})
                </option>
              ))}
            </select>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all cursor-pointer"
              title="Bulan Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Admin only Add Button */}
          {currentRole === 'admin' && (
            <button
              onClick={() => handleOpenAddModal()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Agenda Kaldik</span>
            </button>
          )}

          {/* Guru/Siswa Read-only indicator */}
          {currentRole !== 'admin' && (
            <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              Mode Lihat (Hanya Baca)
            </span>
          )}

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Cetak Kaldik</span>
          </button>
        </div>
      </div>

      {/* Filter Chips & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white rounded-2xl border border-slate-200/80 text-xs shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-500 flex items-center gap-1 text-[11px]">
            <Filter className="w-3.5 h-3.5" />
            Filter Tipe:
          </span>
          {[
            { id: 'all', label: 'Semua Agenda' },
            { id: 'holiday', label: 'Libur Nasional & Cuti', color: 'bg-rose-50 text-rose-700 border-rose-200' },
            { id: 'tk_event', label: 'Kegiatan Unggulan TK', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            { id: 'school_event', label: 'Agenda Sekolah', color: 'bg-sky-50 text-sky-700 border-sky-200' },
            { id: 'report_distribution', label: 'Pembagian Rapor', color: 'bg-amber-50 text-amber-700 border-amber-200' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                filterType === f.id
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            <span>Libur</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>Kegiatan TK</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
            <span>Agenda Pembelajaran</span>
          </div>
        </div>
      </div>

      {/* Main Grid & Details Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Calendar Grid (3 columns on large screens) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Calendar Month Header */}
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                {activeMonth.label}
              </h3>
              <p className="text-[11px] text-slate-500">
                Pendidikan Anak Usia Dini · {schoolProfile.name}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/60 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                {activeMonth.semester}
              </span>
            </div>
          </div>

          {/* Weekday Names Header */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-100/60 text-center text-xs font-bold text-slate-600 py-2.5">
            {DAY_NAMES.map((d, i) => (
              <div key={d} className={i === 6 ? 'text-rose-600' : ''}>
                {d}
              </div>
            ))}
          </div>

          {/* Day Cells Matrix */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100">
            {calendarDays.map((cell, idx) => {
              const isSelected = cell.dateStr === selectedDateStr;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (cell.isCurrentMonth) {
                      setSelectedDateStr(cell.dateStr);
                    }
                  }}
                  className={`min-h-[90px] sm:min-h-[110px] p-1.5 sm:p-2 flex flex-col justify-between transition-all cursor-pointer ${
                    !cell.isCurrentMonth
                      ? 'bg-slate-50/50 text-slate-300 pointer-events-none'
                      : isSelected
                      ? 'bg-emerald-50/70 ring-2 ring-emerald-500 ring-inset'
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  {/* Top Bar of Day Cell: Date Number & Badges */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                        cell.isToday
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : cell.isSunday
                          ? 'text-rose-600'
                          : isSelected
                          ? 'bg-emerald-200 text-emerald-900'
                          : 'text-slate-800'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {/* Today indicator or quick add */}
                    {cell.isToday && (
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-100 px-1 rounded">
                        Hari Ini
                      </span>
                    )}
                  </div>

                  {/* Events list in cell */}
                  <div className="space-y-1 my-1 overflow-hidden">
                    {cell.events.slice(0, 2).map(ev => (
                      <div
                        key={ev.id}
                        title={ev.title}
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded truncate border leading-tight ${getEventBadgeStyle(
                          ev.type
                        )}`}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {cell.events.length > 2 && (
                      <span className="text-[9px] font-bold text-slate-500 block px-1">
                        +{cell.events.length - 2} lainnya
                      </span>
                    )}
                  </div>

                  {/* Bottom indicator if events exist */}
                  <div className="h-1 flex gap-0.5">
                    {cell.events.map((e, ei) => (
                      <span
                        key={ei}
                        className={`h-1 w-2 rounded-full ${
                          e.type === 'holiday'
                            ? 'bg-rose-500'
                            : e.type === 'tk_event'
                            ? 'bg-emerald-500'
                            : 'bg-sky-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details Sidebar (1 column) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Detail Tanggal
                </h4>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                {selectedDateStr}
              </span>
            </div>

            {/* Event listing for chosen date */}
            <div className="mt-4 space-y-3">
              {selectedDateEvents.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-300" />
                  <p className="text-xs font-medium">Tidak ada kegiatan terjadwal pada tanggal ini.</p>
                  <p className="text-[11px] text-slate-400 mt-1">Hari belajar dan bermain efektif reguler.</p>
                  {currentRole === 'admin' && (
                    <button
                      onClick={() => handleOpenAddModal(selectedDateStr)}
                      className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Jadwalkan Agenda</span>
                    </button>
                  )}
                </div>
              ) : (
                selectedDateEvents.map(event => (
                  <div
                    key={event.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getEventBadgeStyle(
                          event.type
                        )}`}
                      >
                        {event.type === 'holiday'
                          ? 'Libur'
                          : event.type === 'tk_event'
                          ? 'Kegiatan TK'
                          : event.type === 'report_distribution'
                          ? 'Rapor'
                          : 'Sekolah'}
                      </span>
                      {currentRole === 'admin' && (
                        <button
                          onClick={() => handleDeleteEvent(event.id, event.title)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                          title="Hapus Agenda"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <h5 className="text-xs font-bold text-slate-900 leading-snug">
                      {event.title}
                    </h5>

                    {event.description && (
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {event.description}
                      </p>
                    )}

                    <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{event.endDate && event.endDate !== event.date ? `${event.date} s/d ${event.endDate}` : event.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {currentRole === 'admin' && selectedDateEvents.length > 0 && (
              <button
                onClick={() => handleOpenAddModal(selectedDateStr)}
                className="w-full mt-4 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-dashed border-emerald-300 text-emerald-700 text-xs font-semibold hover:bg-emerald-50 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Agenda Tanggal Ini</span>
              </button>
            )}
          </div>

          {/* Quick Academic Summary Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900 to-teal-950 text-white shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Pedoman Kaldik PAUD</span>
            </div>
            <p className="text-[11px] text-emerald-100/90 leading-relaxed">
              Kalender akademik ini disusun berdasarkan ketetapan Dinas Pendidikan dan acuan kurikulum PAUD terpadu tahun ajaran 2026/2027.
            </p>
            <div className="space-y-1 text-[11px] text-emerald-200/90 pt-1 border-t border-emerald-800">
              <p>• Semester 1: 13 Juli – 19 Desember 2026</p>
              <p>• Semester 2: 05 Januari – 19 Juni 2027</p>
              <p>• Total Hari Belajar Efektif: ~104 Hari / Semester</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah Agenda Kaldik (Admin Only) */}
      {isAddModalOpen && currentRole === 'admin' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  Tambah Agenda Kalender Akademik
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Kegiatan / Peristiwa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Peringatan Hari Kartini Cilik"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={e => {
                      setFormDate(e.target.value);
                      if (formEndDate < e.target.value) setFormEndDate(e.target.value);
                    }}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    required
                    value={formEndDate}
                    onChange={e => setFormEndDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori Agenda
                </label>
                <select
                  value={formType}
                  onChange={e => setFormType(e.target.value as CalendarEvent['type'])}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="school_event">Agenda Kegiatan Sekolah</option>
                  <option value="tk_event">Kegiatan Unggulan TK (Lomba/Pentas/Manasik)</option>
                  <option value="holiday">Hari Libur Nasional / Cuti Bersama</option>
                  <option value="semester_start">Awal Semester / MPLS</option>
                  <option value="report_distribution">Pembagian Buku Rapor</option>
                  <option value="effective">Hari Belajar Efektif</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keterangan / Deskripsi
                </label>
                <textarea
                  rows={3}
                  placeholder="Tambahkan detail informasi agenda ini..."
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
                >
                  Simpan ke Kaldik
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
