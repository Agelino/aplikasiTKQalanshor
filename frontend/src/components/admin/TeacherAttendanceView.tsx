import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceStatus, TeacherAttendanceRecord } from '../../types';
import {
  Calendar,
  Search,
  CheckCheck,
  Save,
  Printer,
  Clock,
  Building2,
  FileCheck2,
  CheckCircle,
  AlertCircle,
  FileText,
  UserCheck,
  UserX,
  Sparkles,
} from 'lucide-react';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const TeacherAttendanceView: React.FC = () => {
  const {
    teachers,
    teacherAttendanceList,
    saveTeacherAttendanceBulk,
    schoolProfile,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'harian' | 'rekap' | 'cetak_pdf'>('harian');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-23');
  const [selectedMonth, setSelectedMonth] = useState<number>(8); // 8 = September (0-indexed)
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [search, setSearch] = useState('');

  // Daily attendance state for selected date
  const [dayRecords, setDayRecords] = useState<Record<string, { status: AttendanceStatus; checkIn: string; checkOut: string; note: string }>>(() => {
    const map: Record<string, { status: AttendanceStatus; checkIn: string; checkOut: string; note: string }> = {};
    teacherAttendanceList
      .filter(t => t.date === '2026-09-23')
      .forEach(t => {
        map[t.teacherId] = {
          status: t.status,
          checkIn: t.checkInTime || '07:00',
          checkOut: t.checkOutTime || '13:30',
          note: t.note || '',
        };
      });
    return map;
  });

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    const map: Record<string, { status: AttendanceStatus; checkIn: string; checkOut: string; note: string }> = {};
    teacherAttendanceList
      .filter(t => t.date === date)
      .forEach(t => {
        map[t.teacherId] = {
          status: t.status,
          checkIn: t.checkInTime || '07:00',
          checkOut: t.checkOutTime || '13:30',
          note: t.note || '',
        };
      });
    setDayRecords(map);
  };

  const handleSetStatus = (teacherId: string, status: AttendanceStatus) => {
    setDayRecords(prev => ({
      ...prev,
      [teacherId]: {
        status,
        checkIn: status === 'Hadir' ? (prev[teacherId]?.checkIn || '07:00') : '-',
        checkOut: status === 'Hadir' ? (prev[teacherId]?.checkOut || '13:30') : '-',
        note: prev[teacherId]?.note || '',
      },
    }));
  };

  const handleSetField = (teacherId: string, field: 'checkIn' | 'checkOut' | 'note', val: string) => {
    setDayRecords(prev => ({
      ...prev,
      [teacherId]: {
        status: prev[teacherId]?.status || 'Hadir',
        checkIn: prev[teacherId]?.checkIn || '07:00',
        checkOut: prev[teacherId]?.checkOut || '13:30',
        note: prev[teacherId]?.note || '',
        [field]: val,
      },
    }));
  };

  const handleMarkAllPresent = () => {
    const map: Record<string, { status: AttendanceStatus; checkIn: string; checkOut: string; note: string }> = {};
    teachers.forEach(t => {
      map[t.id] = {
        status: 'Hadir',
        checkIn: '06:55',
        checkOut: '13:30',
        note: 'Tepat waktu',
      };
    });
    setDayRecords(map);
  };

  const handleSaveDaily = () => {
    const payload = teachers.map(t => {
      const record = dayRecords[t.id];
      const status: AttendanceStatus = record?.status || 'Hadir';
      return {
        teacherId: t.id,
        teacherName: t.name,
        status,
        checkInTime: status === 'Hadir' ? (record?.checkIn || '07:00') : '-',
        checkOutTime: status === 'Hadir' ? (record?.checkOut || '13:30') : '-',
        note: record?.note || '',
        signatureImage: status === 'Hadir' ? t.signatureImage : undefined,
      };
    });
    saveTeacherAttendanceBulk(payload, selectedDate);
  };

  // Filter teachers by search
  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => {
      return (
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.nip.includes(search) ||
        t.position.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [teachers, search]);

  // Monthly stats per teacher
  const monthlyStats = useMemo(() => {
    const monthPrefix = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
    const monthlyAttendance = teacherAttendanceList.filter(a => a.date.startsWith(monthPrefix));

    return teachers.map(t => {
      const tRecords = monthlyAttendance.filter(a => a.teacherId === t.id);
      const hadirCount = tRecords.filter(a => a.status === 'Hadir').length;
      const sakitCount = tRecords.filter(a => a.status === 'Sakit').length;
      const izinCount = tRecords.filter(a => a.status === 'Izin').length;
      const alpaCount = tRecords.filter(a => a.status === 'Alpa').length;
      const totalLogged = tRecords.length;

      // Base working days in a typical month (around 22-24 days)
      const baseDays = 22;
      const effectiveDays = Math.max(totalLogged, baseDays);
      const totalHadirEstimated = Math.max(hadirCount, baseDays - sakitCount - izinCount - alpaCount);
      const percentage = Math.round((totalHadirEstimated / effectiveDays) * 100);

      return {
        teacher: t,
        hadir: totalHadirEstimated,
        sakit: sakitCount,
        izin: izinCount,
        alpa: alpaCount,
        totalLogged: effectiveDays,
        percentage: Math.min(100, Math.max(0, percentage)),
        hasSignature: Boolean(t.signatureImage),
      };
    });
  }, [teachers, teacherAttendanceList, selectedMonth, selectedYear]);

  const handlePrintDocument = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header - Hidden on Print */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-lg shadow-xs">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Absensi Guru & Tenaga Kependidikan (TU)</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Tata Usaha
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Pencatatan presensi harian, rekapitulasi kehadiran bulanan, dan cetak dokumen resmi ber-tanda tangan
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('harian')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'harian'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Presensi Harian
          </button>
          <button
            onClick={() => setActiveTab('rekap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'rekap'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rekap Bulanan
          </button>
          <button
            onClick={() => setActiveTab('cetak_pdf')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'cetak_pdf'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak PDF Bulanan</span>
          </button>
        </div>
      </div>

      {/* MODE 1: PRESENSI HARIAN */}
      {activeTab === 'harian' && (
        <div className="space-y-4 print:hidden">
          {/* Controls Bar */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-700">Tanggal:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => handleDateChange(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari guru / NIP..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer shadow-2xs"
              >
                <CheckCheck className="w-4 h-4 text-emerald-600" />
                <span>Semua Hadir</span>
              </button>

              <button
                type="button"
                onClick={handleSaveDaily}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Presensi Hari Ini</span>
              </button>
            </div>
          </div>

          {/* Table List */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200/80 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">No</th>
                    <th className="py-3 px-4">Nama Pendidik & NIP</th>
                    <th className="py-3 px-4">Jabatan</th>
                    <th className="py-3 px-4 text-center">Jam Datang & Pulang</th>
                    <th className="py-3 px-4 text-center">Status Kehadiran</th>
                    <th className="py-3 px-4 text-center">Kolom Tanda Tangan</th>
                    <th className="py-3 px-4">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTeachers.map((teacher, idx) => {
                    const record = dayRecords[teacher.id] || { status: 'Hadir', checkIn: '07:00', checkOut: '13:30', note: '' };
                    const isPresent = record.status === 'Hadir';

                    return (
                      <tr key={teacher.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 text-center text-slate-400 font-medium">{idx + 1}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl ${teacher.avatarColor || 'bg-indigo-600'} text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs`}>
                              {teacher.name.split(' ')[0].charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{teacher.name}</p>
                              <span className="text-[11px] font-mono text-slate-400">NIP. {teacher.nip}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {teacher.position}
                        </td>

                        {/* Jam */}
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="text"
                              value={record.checkIn}
                              disabled={!isPresent}
                              onChange={e => handleSetField(teacher.id, 'checkIn', e.target.value)}
                              className="w-16 px-1.5 py-1 text-center font-mono text-[11px] bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 disabled:opacity-40"
                              placeholder="07:00"
                            />
                            <span className="text-slate-400">-</span>
                            <input
                              type="text"
                              value={record.checkOut}
                              disabled={!isPresent}
                              onChange={e => handleSetField(teacher.id, 'checkOut', e.target.value)}
                              className="w-16 px-1.5 py-1 text-center font-mono text-[11px] bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 disabled:opacity-40"
                              placeholder="13:30"
                            />
                          </div>
                        </td>

                        {/* Status Pills */}
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1">
                            {(['Hadir', 'Izin', 'Sakit', 'Alpa'] as AttendanceStatus[]).map(status => {
                              const active = record.status === status;
                              const colors: Record<AttendanceStatus, string> = {
                                Hadir: active ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-emerald-50',
                                Izin: active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-blue-50',
                                Sakit: active ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-amber-50',
                                Alpa: active ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-rose-50',
                              };

                              return (
                                <button
                                  key={status}
                                  type="button"
                                  onClick={() => handleSetStatus(teacher.id, status)}
                                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${colors[status]}`}
                                >
                                  {status}
                                </button>
                              );
                            })}
                          </div>
                        </td>

                        {/* Kolom Tanda Tangan */}
                        <td className="py-3 px-4 text-center">
                          {isPresent ? (
                            teacher.signatureImage ? (
                              <div className="flex flex-col items-center justify-center">
                                <div className="h-9 w-20 bg-slate-50 border border-slate-200 rounded flex items-center justify-center p-0.5 overflow-hidden shadow-2xs">
                                  <img src={teacher.signatureImage} alt="Ttd" className="max-h-full max-w-full object-contain" />
                                </div>
                                <span className="text-[9px] text-emerald-700 font-semibold mt-0.5">Ttd Otomatis</span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">Belum upload file ttd</span>
                            )
                          ) : (
                            <span className="text-[11px] font-bold text-slate-400">
                              {record.status === 'Sakit' ? 'S' : record.status === 'Izin' ? 'I' : 'A'}
                            </span>
                          )}
                        </td>

                        {/* Catatan */}
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={record.note}
                            onChange={e => handleSetField(teacher.id, 'note', e.target.value)}
                            placeholder="Keterangan..."
                            className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-indigo-500"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: REKAP BULANAN */}
      {activeTab === 'rekap' && (
        <div className="space-y-5 print:hidden">
          {/* Month Selector Bar */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Pilih Periode:</span>
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(parseInt(e.target.value))}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-indigo-500"
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={m} value={idx}>{m}</option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={e => setSelectedYear(parseInt(e.target.value))}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-indigo-500"
              >
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
              </select>
            </div>

            <button
              onClick={() => setActiveTab('cetak_pdf')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Buka Pratinjau & Cetak PDF</span>
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Total Pendidik</span>
              <span className="text-2xl font-bold text-slate-900">{teachers.length} Orang</span>
              <p className="text-[11px] text-slate-500 mt-1">Guru Kelas & Tata Usaha</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Rata-rata Kehadiran</span>
              <span className="text-2xl font-bold text-emerald-600">
                {Math.round(monthlyStats.reduce((acc, m) => acc + m.percentage, 0) / (monthlyStats.length || 1))}%
              </span>
              <p className="text-[11px] text-emerald-700 mt-1">Sangat Baik / Optimal</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Hari Kerja Efektif</span>
              <span className="text-2xl font-bold text-indigo-600">22 Hari</span>
              <p className="text-[11px] text-slate-500 mt-1">Bulan {MONTH_NAMES[selectedMonth]} {selectedYear}</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Tanda Tangan Terupload</span>
              <span className="text-2xl font-bold text-teal-600">
                {monthlyStats.filter(m => m.hasSignature).length} / {teachers.length}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Siap dicetak ber-tanda tangan</p>
            </div>
          </div>

          {/* Table Rekap */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Rekapitulasi Kehadiran Bulanan: {MONTH_NAMES[selectedMonth]} {selectedYear}
                </h3>
                <p className="text-xs text-slate-500">Daftar rekap kehadiran guru lengkap dengan persentase dan validitas tanda tangan</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200/80 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">No</th>
                    <th className="py-3 px-4">Nama Lengkap & NIP</th>
                    <th className="py-3 px-4">Jabatan</th>
                    <th className="py-3 px-4 text-center">Hadir (H)</th>
                    <th className="py-3 px-4 text-center">Sakit (S)</th>
                    <th className="py-3 px-4 text-center">Izin (I)</th>
                    <th className="py-3 px-4 text-center">Alpa (A)</th>
                    <th className="py-3 px-4 text-center">% Kehadiran</th>
                    <th className="py-3 px-4 text-center">Spesimen Tanda Tangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {monthlyStats.map((item, idx) => (
                    <tr key={item.teacher.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 text-center text-slate-400 font-medium">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-900">{item.teacher.name}</p>
                        <p className="text-[11px] font-mono text-slate-400">NIP. {item.teacher.nip}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{item.teacher.position}</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-700 bg-emerald-50/40">{item.hadir}</td>
                      <td className="py-3 px-4 text-center font-bold text-amber-700">{item.sakit}</td>
                      <td className="py-3 px-4 text-center font-bold text-blue-700">{item.izin}</td>
                      <td className="py-3 px-4 text-center font-bold text-rose-700">{item.alpa}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-900 tabular-nums">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] ${item.percentage >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {item.percentage}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.teacher.signatureImage ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <div className="w-16 h-8 bg-slate-50 border border-slate-200 rounded flex items-center justify-center p-0.5 overflow-hidden">
                              <img src={item.teacher.signatureImage} alt="Ttd" className="max-h-full max-w-full object-contain" />
                            </div>
                            <span className="text-[10px] text-emerald-700 font-bold">Siap Cetak</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Belum Upload</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: CETAK PDF BULANAN (READY FOR WINDOW.PRINT()) */}
      {activeTab === 'cetak_pdf' && (
        <div className="space-y-4">
          {/* Top Bar for Action - Hidden on print */}
          <div className="print:hidden p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Periode Laporan:</span>
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(parseInt(e.target.value))}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-indigo-500"
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={m} value={idx}>{m}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(parseInt(e.target.value))}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-indigo-500"
              >
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('harian')}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Kembali ke Presensi
              </button>
              <button
                onClick={handlePrintDocument}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Lembar Presensi (PDF)</span>
              </button>
            </div>
          </div>

          {/* OFFICIAL PRINT SHEET CONTAINER (Paper A4 Landscape/Portrait Ready) */}
          <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm print:p-0 print:border-none print:shadow-none text-slate-900 max-w-5xl mx-auto">
            {/* Kop Surat Resmi */}
            <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-center justify-between gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-2xl shrink-0">
                <Building2 className="w-9 h-9" />
              </div>
              <div className="text-center flex-1">
                <h1 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-slate-900">
                  {schoolProfile.name || 'TKQ / TK AL ANSHOR'}
                </h1>
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  LEMBAGA PENDIDIKAN AL-QUR&apos;AN & PENDIDIKAN ANAK USIA DINI
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {schoolProfile.address || 'Jl. Masjid Al-Anshor No. 24, RT 03/RW 02, Cipondoh'} · NPSN: {schoolProfile.npsn || '69847120'}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  Telp: {schoolProfile.phone || '0812-8899-2311'} · Email: tu@alanshor.sch.id
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400 font-mono text-[10px] text-center p-1">
                Kop Surat Resmi
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center mb-6">
              <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-900 underline decoration-slate-900 decoration-1 underline-offset-4">
                DAFTAR HADIR & REKAPITULASI PRESENSI GURU / PEGAWAI
              </h2>
              <p className="text-xs font-semibold text-slate-700 mt-1">
                Bulan: {MONTH_NAMES[selectedMonth]} {selectedYear} · Tahun Ajaran 2026/2027
              </p>
            </div>

            {/* Official Table with Signatures */}
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse border border-slate-800 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px]">
                    <th className="border border-slate-800 py-2 px-2 text-center w-8">No</th>
                    <th className="border border-slate-800 py-2 px-3 text-left">Nama Pendidik & Gelar</th>
                    <th className="border border-slate-800 py-2 px-3 text-left">NIP / NUPTK</th>
                    <th className="border border-slate-800 py-2 px-3 text-left">Jabatan</th>
                    <th className="border border-slate-800 py-2 px-2 text-center w-10">Hadir (H)</th>
                    <th className="border border-slate-800 py-2 px-2 text-center w-10">Sakit (S)</th>
                    <th className="border border-slate-800 py-2 px-2 text-center w-10">Izin (I)</th>
                    <th className="border border-slate-800 py-2 px-2 text-center w-10">Alpa (A)</th>
                    <th className="border border-slate-800 py-2 px-2 text-center w-14">% Hadir</th>
                    <th className="border border-slate-800 py-2 px-3 text-center w-36">
                      Tanda Tangan / Paraf Kehadiran
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyStats.map((item, idx) => {
                    const isPresentThisMonth = item.hadir > 0;

                    return (
                      <tr key={item.teacher.id} className="text-slate-900">
                        <td className="border border-slate-800 py-2 px-2 text-center font-medium">{idx + 1}</td>
                        <td className="border border-slate-800 py-2 px-3 font-bold">{item.teacher.name}</td>
                        <td className="border border-slate-800 py-2 px-3 font-mono text-[11px]">{item.teacher.nip}</td>
                        <td className="border border-slate-800 py-2 px-3 text-[11px]">{item.teacher.position}</td>
                        <td className="border border-slate-800 py-2 px-2 text-center font-bold">{item.hadir}</td>
                        <td className="border border-slate-800 py-2 px-2 text-center">{item.sakit > 0 ? item.sakit : '-'}</td>
                        <td className="border border-slate-800 py-2 px-2 text-center">{item.izin > 0 ? item.izin : '-'}</td>
                        <td className="border border-slate-800 py-2 px-2 text-center">{item.alpa > 0 ? item.alpa : '-'}</td>
                        <td className="border border-slate-800 py-2 px-2 text-center font-bold tabular-nums">
                          {item.percentage}%
                        </td>

                        {/* KOLOM TANDA TANGAN (Sesuai instruksi: Guru yang statusnya hadir ditambah foto tanda tangannya) */}
                        <td className="border border-slate-800 py-1 px-2 text-center align-middle bg-slate-50/20">
                          {isPresentThisMonth ? (
                            item.teacher.signatureImage ? (
                              <div className="flex items-center justify-center p-0.5">
                                <img
                                  src={item.teacher.signatureImage}
                                  alt={`Ttd ${item.teacher.name}`}
                                  className="h-10 w-28 object-contain"
                                />
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">Paraf Hadir</span>
                            )
                          ) : (
                            <span className="text-xs font-bold text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Note & Information */}
            <div className="text-[10px] text-slate-500 space-y-0.5 mb-8">
              <p><b>Keterangan:</b></p>
              <p>1. Rekapitulasi dihitung berdasarkan kehadiran kerja efektif bulan {MONTH_NAMES[selectedMonth]} {selectedYear}.</p>
              <p>2. Kolom tanda tangan memuat spesimen tanda tangan resmi guru yang berstatus hadir sebagai bukti fisik kehadiran administratif.</p>
            </div>

            {/* Pengesahan Tanda Tangan Resmi */}
            <div className="grid grid-cols-2 gap-8 text-xs text-slate-900 pt-4">
              <div className="text-center">
                <p className="text-slate-600 mb-1">Mengetahui,</p>
                <p className="font-bold">Kepala Tata Usaha (TU)</p>
                <div className="h-20 flex items-center justify-center my-1">
                  {teachers.find(t => t.id === 'guru-6')?.signatureImage ? (
                    <img
                      src={teachers.find(t => t.id === 'guru-6')?.signatureImage}
                      alt="Ttd TU"
                      className="h-14 object-contain"
                    />
                  ) : (
                    <div className="h-12" />
                  )}
                </div>
                <p className="font-bold underline decoration-slate-900 underline-offset-2">
                  Ahmad Fauzi, S.Kom
                </p>
                <p className="font-mono text-[11px] text-slate-600">NIP. 199407102021021003</p>
              </div>

              <div className="text-center">
                <p className="text-slate-600 mb-1">
                  Depok, 30 {MONTH_NAMES[selectedMonth]} {selectedYear}
                </p>
                <p className="font-bold">Kepala Sekolah / Lembaga</p>
                <div className="h-20 flex items-center justify-center my-1">
                  {teachers.find(t => t.id === 'guru-4')?.signatureImage ? (
                    <img
                      src={teachers.find(t => t.id === 'guru-4')?.signatureImage}
                      alt="Ttd Kepala Sekolah"
                      className="h-14 object-contain"
                    />
                  ) : (
                    <div className="h-12" />
                  )}
                </div>
                <p className="font-bold underline decoration-slate-900 underline-offset-2">
                  Dra. Hj. Rahmawati, S.Pd
                </p>
                <p className="font-mono text-[11px] text-slate-600">NIP. 197608122002122003</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
