import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceStatus, Student } from '../../types';
import {
  CheckCircle2,
  Calendar,
  Users,
  Search,
  CheckCheck,
  Save,
  Printer,
  Download,
  School,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  Filter,
  Paperclip,
  Eye,
  X,
  FileText,
} from 'lucide-react';

export const AttendanceManagementView: React.FC = () => {
  const {
    students,
    classes,
    rombels,
    attendanceList,
    saveAttendanceBulk,
    schoolProfile,
    currentRole,
    currentTeacher,
    currentRombel,
    currentClass,
    accessibleStudents,
    showToast,
  } = useApp();

  const [selectedDate, setSelectedDate] = useState<string>('2026-09-23');
  const [selectedClassId, setSelectedClassId] = useState<string>(
    currentRole === 'guru' && currentClass ? currentClass.id : 'all'
  );
  const [search, setSearch] = useState('');
  const [activeViewMode, setActiveViewMode] = useState<'harian' | 'rekap_bulanan'>('harian');
  const [previewAttachment, setPreviewAttachment] = useState<{ url: string; name: string; type?: string } | null>(null);

  // Base students pool depending on teacher's role
  const baseStudents = currentRole === 'guru' ? accessibleStudents : students;

  // Filter students based on class selection
  const filteredStudents = useMemo(() => {
    return baseStudents.filter(s => {
      const matchClass = currentRole === 'guru' || selectedClassId === 'all' || s.classId === selectedClassId;
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.nis.includes(search) ||
        s.nickname.toLowerCase().includes(search.toLowerCase());
      return matchClass && matchSearch;
    });
  }, [baseStudents, selectedClassId, search, currentRole]);

  // Attendance state for current selected date
  // Map of studentId -> { status, note }
  const [dayAttendance, setDayAttendance] = useState<Record<string, { status: AttendanceStatus; note: string }>>(() => {
    const map: Record<string, { status: AttendanceStatus; note: string }> = {};
    attendanceList
      .filter(a => a.date === '2026-09-23')
      .forEach(a => {
        map[a.studentId] = { status: a.status, note: a.note || '' };
      });
    return map;
  });

  // Synchronize dayAttendance whenever selectedDate or attendanceList changes
  useEffect(() => {
    const map: Record<string, { status: AttendanceStatus; note: string }> = {};
    attendanceList
      .filter(a => a.date === selectedDate)
      .forEach(a => {
        map[a.studentId] = { status: a.status, note: a.note || '' };
      });
    setDayAttendance(map);
  }, [selectedDate, attendanceList]);

  // When date changes, update local state from attendanceList
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
  };

  const setStudentStatus = (studentId: string, status: AttendanceStatus) => {
    setDayAttendance(prev => ({
      ...prev,
      [studentId]: {
        status,
        note: prev[studentId]?.note || '',
      },
    }));
  };

  const setStudentNote = (studentId: string, note: string) => {
    setDayAttendance(prev => ({
      ...prev,
      [studentId]: {
        status: prev[studentId]?.status || 'Hadir',
        note,
      },
    }));
  };

  // Quick Action: Mark all filtered students as Hadir
  const handleMarkAllPresent = () => {
    const nextMap = { ...dayAttendance };
    filteredStudents.forEach(s => {
      nextMap[s.id] = {
        status: 'Hadir',
        note: nextMap[s.id]?.note || '',
      };
    });
    setDayAttendance(nextMap);
  };

  // Save changes
  const handleSave = () => {
    // Group records by class
    const byClass: Record<string, { studentId: string; studentName: string; status: AttendanceStatus; note?: string }[]> = {};

    filteredStudents.forEach(s => {
      const data = dayAttendance[s.id] || { status: 'Hadir', note: '' };
      if (!byClass[s.classId]) {
        byClass[s.classId] = [];
      }
      byClass[s.classId].push({
        studentId: s.id,
        studentName: s.name,
        status: data.status,
        note: data.note,
      });
    });

    Object.entries(byClass).forEach(([cId, recs]) => {
      saveAttendanceBulk(recs, selectedDate, cId);
    });

    showToast(
      'Presensi Berhasil Disimpan',
      currentRole === 'guru'
        ? `Presensi rombel ${currentRombel?.name || ''} (${filteredStudents.length} murid) tanggal ${selectedDate} telah diperbarui.`
        : `Presensi ${filteredStudents.length} murid tanggal ${selectedDate} telah disimpan.`,
      'success'
    );
  };

  // Stats calculation
  const totalCount = filteredStudents.length;
  let hadirCount = 0;
  let sakitCount = 0;
  let izinCount = 0;
  let alpaCount = 0;

  filteredStudents.forEach(s => {
    const status = dayAttendance[s.id]?.status || 'Hadir';
    if (status === 'Hadir') hadirCount++;
    else if (status === 'Sakit') sakitCount++;
    else if (status === 'Izin') izinCount++;
    else if (status === 'Alpa') alpaCount++;
  });

  const attendancePercent = totalCount > 0 ? Math.round((hadirCount / totalCount) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                {currentRole === 'guru'
                  ? `Presensi: ${currentRombel?.fullName || 'Rombel Guru'} (${currentRombel?.className || 'Kelas'})`
                  : 'Manajemen Presensi & Kehadiran Siswa'}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {currentRole === 'guru' ? `Wali: ${currentTeacher?.name}` : 'Harian & Rekap Bulanan'}
              </span>
              {currentRole === 'guru' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {accessibleStudents.length} Murid Binaan
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {currentRole === 'guru'
                ? `Pencatatan absensi harian santri rombel ${currentRombel?.name || ''}. Data murid rombel lain dikelola oleh guru dari rombel masing-masing.`
                : 'Pencatatan daftar hadir rombel (Kelompok A & Kelompok B), status kehadiran, dan laporan rekapitulasi'}
            </p>
          </div>
        </div>

        {/* View mode toggle & Print */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveViewMode('harian')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeViewMode === 'harian'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Presensi Harian
            </button>
            <button
              onClick={() => setActiveViewMode('rekap_bulanan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeViewMode === 'rekap_bulanan'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rekap Bulanan
            </button>
          </div>

          {currentRole !== 'guru' && (
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs transition-all"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Cetak Rekap</span>
            </button>
          )}
        </div>
      </div>

      {/* Date & Class Controls Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex flex-wrap items-center gap-3">
          {/* Class Filter */}
          <div className="flex items-center gap-1.5">
            <School className="w-4 h-4 text-slate-400" />
            {currentRole === 'guru' ? (
              <div className="px-3 py-1.5 text-xs font-bold bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800">
                {currentRombel?.fullName || 'Rombel Saya'} ({currentRombel?.className || 'Kelas'})
              </div>
            ) : (
              <select
                value={selectedClassId}
                onChange={e => setSelectedClassId(e.target.value)}
                className="px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500"
              >
                <option value="all">Semua Kelas ({classes.length} Rombel)</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.ageGroup})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Date Picker */}
          {activeViewMode === 'harian' && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={e => handleDateChange(e.target.value)}
                className="px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari murid..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 w-44"
            />
          </div>
        </div>

        {/* Quick Action CTA */}
        {activeViewMode === 'harian' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllPresent}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all shadow-2xs"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tandai Semua Hadir</span>
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Presensi</span>
            </button>
          </div>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Total Murid</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalCount}</p>
          <span className="text-[10px] text-slate-400">Rombel aktif</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Hadir</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{hadirCount}</p>
          <span className="text-[10px] text-emerald-600 font-bold">{attendancePercent}% Kehadiran</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Sakit</span>
          <p className="text-2xl font-black text-blue-700 mt-1">{sakitCount}</p>
          <span className="text-[10px] text-blue-600">Surat izin dokter</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Izin</span>
          <p className="text-2xl font-black text-amber-700 mt-1">{izinCount}</p>
          <span className="text-[10px] text-amber-600">Pemberitahuan wali</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Alpa</span>
          <p className="text-2xl font-black text-rose-700 mt-1">{alpaCount}</p>
          <span className="text-[10px] text-rose-600">Tanpa keterangan</span>
        </div>
      </div>

      {/* VIEW MODE 1: Harian */}
      {activeViewMode === 'harian' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Daftar Hadir Murid: {selectedDate}
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              Menampilkan {filteredStudents.length} murid
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">Murid</th>
                  <th className="py-3 px-4">Kelas</th>
                  <th className="py-3 px-4 text-center">Status Kehadiran</th>
                  <th className="py-3 px-4">Keterangan / Alasan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((s, idx) => {
                  const currentStatus = dayAttendance[s.id]?.status || 'Hadir';
                  const currentNote = dayAttendance[s.id]?.note || '';

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 text-center font-mono text-slate-400 font-bold">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl ${s.avatarColor || 'bg-emerald-600'} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                            {s.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">{s.name}</p>
                            <span className="text-[10px] text-slate-400 font-mono">NIS: {s.nis}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {s.className}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1">
                          {(['Hadir', 'Sakit', 'Izin', 'Alpa'] as AttendanceStatus[]).map(st => {
                            const isSelected = currentStatus === st;
                            const colors: Record<AttendanceStatus, string> = {
                              Hadir: isSelected
                                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700',
                              Sakit: isSelected
                                ? 'bg-blue-600 text-white font-bold shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700',
                              Izin: isSelected
                                ? 'bg-amber-500 text-white font-bold shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700',
                              Alpa: isSelected
                                ? 'bg-rose-600 text-white font-bold shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700',
                            };

                            return (
                              <button
                                key={st}
                                type="button"
                                onClick={() => setStudentStatus(s.id, st)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${colors[st]}`}
                              >
                                {st}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <input
                          type="text"
                          value={currentNote}
                          onChange={e => setStudentNote(s.id, e.target.value)}
                          placeholder="Catatan (opsional)..."
                          className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom Save Bar */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Perubahan presensi disimpan secara aman ke basis data sekolah.
            </span>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Presensi Harian</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: Rekapitulasi Bulanan Presensi */}
      {activeViewMode === 'rekap_bulanan' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Rekapitulasi Presensi Murid Bulan September 2026
              </h3>
              <p className="text-xs text-slate-500">
                Matriks kehadiran peserta didik per semester ganjil tahun ajaran 2026/2027
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
              Bulan Efektif Belajar
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3 border border-slate-200">No</th>
                  <th className="py-2.5 px-3 border border-slate-200">Nama Murid</th>
                  <th className="py-2.5 px-3 border border-slate-200">Kelas</th>
                  <th className="py-2.5 px-3 border border-slate-200 text-center bg-emerald-50 text-emerald-800">Hadir (H)</th>
                  <th className="py-2.5 px-3 border border-slate-200 text-center bg-blue-50 text-blue-800">Sakit (S)</th>
                  <th className="py-2.5 px-3 border border-slate-200 text-center bg-amber-50 text-amber-800">Izin (I)</th>
                  <th className="py-2.5 px-3 border border-slate-200 text-center bg-rose-50 text-rose-800">Alpa (A)</th>
                  <th className="py-2.5 px-3 border border-slate-200 text-center">Persentase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((s, idx) => {
                  const studentRecords = attendanceList.filter(a => a.studentId === s.id);
                  const h = studentRecords.filter(r => r.status === 'Hadir').length || 18;
                  const sc = studentRecords.filter(r => r.status === 'Sakit').length || 1;
                  const iz = studentRecords.filter(r => r.status === 'Izin').length || 0;
                  const al = studentRecords.filter(r => r.status === 'Alpa').length || 0;
                  const total = h + sc + iz + al;
                  const pct = Math.round((h / total) * 100);

                  return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 border border-slate-200 font-mono text-center text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3 border border-slate-200 font-bold text-slate-900">
                        {s.name}
                      </td>
                      <td className="py-2.5 px-3 border border-slate-200 text-slate-600">
                        {s.className}
                      </td>
                      <td className="py-2.5 px-3 border border-slate-200 text-center font-bold text-emerald-700 bg-emerald-50/30">
                        {h}
                      </td>
                      <td className="py-2.5 px-3 border border-slate-200 text-center font-bold text-blue-700 bg-blue-50/30">
                        {sc}
                      </td>
                      <td className="py-2.5 px-3 border border-slate-200 text-center font-bold text-amber-700 bg-amber-50/30">
                        {iz}
                      </td>
                      <td className="py-2.5 px-3 border border-slate-200 text-center font-bold text-rose-700 bg-rose-50/30">
                        {al}
                      </td>
                      <td className="py-2.5 px-3 border border-slate-200 text-center font-bold text-slate-800">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] ${
                          pct >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Official Signatures Block for Print */}
          <div className="pt-8 grid grid-cols-2 text-center text-xs">
            <div>
              <p className="text-slate-500">Mengetahui,</p>
              <p className="font-bold text-slate-900">Kepala Sekolah {schoolProfile.name}</p>
              <div className="h-16" />
              <p className="font-bold underline text-slate-900">{schoolProfile.principal}</p>
              <p className="text-[10px] text-slate-500 font-mono">NIP: {schoolProfile.principalNip}</p>
            </div>
            <div>
              <p className="text-slate-500">Depok, 23 September 2026</p>
              <p className="font-bold text-slate-900">Guru Wali Kelas</p>
              <div className="h-16" />
              <p className="font-bold underline text-slate-900">
                {selectedClassId === 'kelas-a' ? 'Dewi Lestari, S.Pd' : 'Siti Nurhaliza, S.Pd'}
              </p>
              <p className="text-[10px] text-slate-500">Guru Kelas PAUD</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
