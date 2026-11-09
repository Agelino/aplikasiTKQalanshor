import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceRecord, AttendanceStatus } from '../../types';
import {
  CheckCircle2,
  Calendar,
  Clock,
  Plus,
  Send,
  X,
  FileText,
  AlertCircle,
  HelpCircle,
  Upload,
  Edit2,
  Trash2,
  Paperclip,
  Eye,
  FileCheck2,
  Image as ImageIcon,
  User,
  Sparkles,
} from 'lucide-react';

export const StudentAttendanceView: React.FC = () => {
  const {
    students,
    attendanceList,
    currentUser,
    currentRole,
    currentStudent,
    switchStudent,
    saveLeaveRequest,
    deleteAttendanceRecord,
    showToast,
  } = useApp();

  // Active student priority: currentStudent > matched currentUser > fallback
  const student = currentStudent || students.find(s => s.id === currentUser?.studentId) || students[0];

  const records = attendanceList.filter(a => a.studentId === student?.id);

  // Leave requests (records with status 'Izin' or 'Sakit')
  const leaveRequests = records.filter(r => r.status === 'Izin' || r.status === 'Sakit');

  // Stats
  const totalDays = records.length || 1;
  const hadirCount = records.filter(r => r.status === 'Hadir').length;
  const izinCount = records.filter(r => r.status === 'Izin').length;
  const sakitCount = records.filter(r => r.status === 'Sakit').length;
  const alpaCount = records.filter(r => r.status === 'Alpa').length;

  const attendanceRate = Math.round((hadirCount / totalDays) * 100);

  const statusBadges: Record<AttendanceStatus, string> = {
    Hadir: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    Izin: 'bg-amber-50 text-amber-800 border-amber-200',
    Sakit: 'bg-blue-50 text-blue-800 border-blue-200',
    Alpa: 'bg-rose-50 text-rose-800 border-rose-200',
  };

  // Leave Form & Modal state
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [leaveDate, setLeaveDate] = useState('2026-09-24');
  const [leaveType, setLeaveType] = useState<'Sakit' | 'Izin'>('Izin');
  const [leaveReason, setLeaveReason] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState<string | undefined>(undefined);
  const [attachmentName, setAttachmentName] = useState<string | undefined>(undefined);
  const [attachmentType, setAttachmentType] = useState<string | undefined>(undefined);

  // Preview Modal
  const [previewAttachment, setPreviewAttachment] = useState<{ url: string; name: string; type?: string } | null>(null);

  // Delete Confirmation Modal
  const [recordToDelete, setRecordToDelete] = useState<AttendanceRecord | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenAddLeave = () => {
    setEditingRecordId(null);
    setLeaveDate('2026-09-24');
    setLeaveType('Izin');
    setLeaveReason('');
    setAttachmentUrl(undefined);
    setAttachmentName(undefined);
    setAttachmentType(undefined);
    setIsLeaveModalOpen(true);
  };

  const handleOpenEditLeave = (record: AttendanceRecord) => {
    setEditingRecordId(record.id);
    setLeaveDate(record.date);
    setLeaveType((record.status === 'Sakit' ? 'Sakit' : 'Izin'));
    // Strip leading [Surat Wali] if present
    const cleanedNote = (record.note || '').replace(/^\[Surat Wali\]\s*/, '');
    setLeaveReason(cleanedNote);
    setAttachmentUrl(record.attachmentUrl);
    setAttachmentName(record.attachmentName);
    setAttachmentType(record.attachmentType);
    setIsLeaveModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran File Terlalu Besar', 'Maksimal ukuran file surat/foto adalah 5MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target?.result as string;
      setAttachmentUrl(dataUrl);
      setAttachmentName(file.name);
      setAttachmentType(file.type || 'image/png');
      showToast('File Terlampir', `File ${file.name} berhasil diunggah.`, 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAttachment = () => {
    setAttachmentUrl(undefined);
    setAttachmentName(undefined);
    setAttachmentType(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !leaveReason.trim()) return;

    saveLeaveRequest({
      id: editingRecordId || undefined,
      studentId: student.id,
      studentName: student.name,
      classId: student.classId || 'kelas-a1',
      date: leaveDate,
      status: leaveType,
      note: `[Surat Wali] ${leaveReason.trim()}`,
      attachmentUrl,
      attachmentName,
      attachmentType,
    });

    setIsLeaveModalOpen(false);
    setEditingRecordId(null);
    setLeaveReason('');
    handleRemoveAttachment();
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      deleteAttendanceRecord(recordToDelete.id);
      setRecordToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-lg shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Pengajuan Izin & Riwayat Presensi Siswa</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Tahun Ajaran 2026/2027
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Layanan mandiri orang tua untuk pengajuan izin sakit atau keperluan keluarga disertai bukti surat dokter/keterangan, serta rekap catatan kehadiran ananda.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Quick student selector when multiple students exist */}
          {students.length > 1 && (
            <select
              value={student.id}
              onChange={e => switchStudent(e.target.value)}
              className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none hover:border-emerald-400 transition-all cursor-pointer"
              title="Ganti Ananda / Profil Santri"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.className || 'Kelas'})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleOpenAddLeave}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajukan Surat Izin / Sakit</span>
          </button>
        </div>
      </div>

      {/* Student Badge Card */}
      {student && (
        <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl ${student.avatarColor || 'bg-emerald-600'} text-white font-black text-base flex items-center justify-center shadow-xs`}>
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-slate-900 text-sm">{student.name}</p>
                <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {student.status || 'Aktif'}
                </span>
              </div>
              <p className="text-xs text-emerald-900 mt-0.5">
                <span className="font-semibold">{student.className || 'Kelas'}</span> · {student.rombelName || 'Rombel'} · NIS: <span className="font-mono">{student.nis}</span>
                {student.rombelTeacherName && (
                  <span className="text-slate-600 ml-1.5 font-normal">
                    (Wali: <b className="text-slate-800">{student.rombelTeacherName}</b>)
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tingkat Kehadiran</span>
            <span className="text-xl font-black text-emerald-700">{attendanceRate}%</span>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Hadir</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{hadirCount} Hari</p>
          <span className="text-[10px] text-slate-400">Tingkat kehadiran: {attendanceRate}%</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Sakit</span>
          <p className="text-2xl font-black text-blue-700 mt-1">{sakitCount} Hari</p>
          <span className="text-[10px] text-slate-400">Surat dokter / pemberitahuan</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Izin</span>
          <p className="text-2xl font-black text-amber-700 mt-1">{izinCount} Hari</p>
          <span className="text-[10px] text-slate-400">Keluarga / keperluan dinas</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Tanpa Keterangan</span>
          <p className="text-2xl font-black text-rose-700 mt-1">{alpaCount} Hari</p>
          <span className="text-[10px] text-emerald-600 font-bold">Nol absen tanpa kabar</span>
        </div>
      </div>

      {/* Section: Pengajuan Surat Izin & Sakit Online (With Edit, Delete, & Attachment Viewer) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                Surat Permohonan Izin & Sakit Ananda
              </h3>
              <p className="text-xs text-slate-500">
                Daftar surat yang diajukan oleh wali murid. Anda dapat mengedit keterangan, mengunggah surat, atau membatalkan permohonan.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAddLeave}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>+ Buat Pengajuan Baru</span>
          </button>
        </div>

        {leaveRequests.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs space-y-2">
            <FileCheck2 className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-600">Belum ada pengajuan izin atau sakit.</p>
            <p className="text-[11px] text-slate-400">
              Ananda memiliki catatan kehadiran yang sangat baik dan rajin ke sekolah.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {leaveRequests.map(r => (
              <div
                key={r.id}
                className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${statusBadges[r.status] || 'bg-slate-100'}`}>
                      {r.status}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-800">
                      {r.date}
                    </span>
                    {r.attachmentUrl && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        <Paperclip className="w-3 h-3 text-blue-600" />
                        <span>Ada Surat Lampiran</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {r.note || 'Pemberitahuan izin dari wali murid'}
                  </p>

                  {r.attachmentName && (
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <span className="font-medium text-slate-400">File Surat:</span>
                      <span className="font-mono text-slate-600 truncate max-w-xs">{r.attachmentName}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                  {r.attachmentUrl && (
                    <button
                      onClick={() => setPreviewAttachment({
                        url: r.attachmentUrl!,
                        name: r.attachmentName || 'Surat Izin / Sakit',
                        type: r.attachmentType,
                      })}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-all cursor-pointer"
                      title="Lihat Dokumen Surat"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>Lihat Surat</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleOpenEditLeave(r)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                    title="Ubah Surat / Tanggal"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setRecordToDelete(r)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
                    title="Hapus Permohonan"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Attendance History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Riwayat Presensi Ananda Bulan Ini
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">Bulan September 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Status Kehadiran</th>
                <th className="py-3 px-4">Catatan Wali Kelas / Wali Murid</th>
                <th className="py-3 px-4 text-center">Lampiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r: AttendanceRecord) => (
                <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-slate-800">{r.date}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${statusBadges[r.status] || 'bg-slate-100'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {r.note || 'Hadir tepat waktu dan ceria mengikuti kegiatan'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {r.attachmentUrl ? (
                      <button
                        onClick={() => setPreviewAttachment({
                          url: r.attachmentUrl!,
                          name: r.attachmentName || 'Surat Keterangan',
                          type: r.attachmentType,
                        })}
                        className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer underline"
                      >
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>Lihat</span>
                      </button>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: AJUKAN / EDIT SURAT IZIN / SAKIT DENGAN UPLOAD FILE               */}
      {/* ========================================================================= */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {editingRecordId ? 'Ubah Surat Permohonan Izin / Sakit' : 'Formulir Permohonan Izin / Sakit Online'}
                </h3>
              </div>
              <button
                onClick={() => setIsLeaveModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitLeave} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Ananda & Rombel</label>
                <input
                  type="text"
                  disabled
                  value={`${student.name} (${student.className || 'Kelas'} - ${student.rombelName || 'Rombel'})`}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={leaveDate}
                    onChange={e => setLeaveDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jenis Keterangan</label>
                  <select
                    value={leaveType}
                    onChange={e => setLeaveType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 outline-none focus:border-emerald-500 font-bold"
                  >
                    <option value="Izin">Izin (Acara Keluarga / Kepentingan)</option>
                    <option value="Sakit">Sakit (Demam / Dokter / Istirahat)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Alasan & Keterangan untuk Guru Wali Kelas <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={leaveReason}
                  onChange={e => setLeaveReason(e.target.value)}
                  placeholder="Contoh: Ananda demam dan batuk sejak semalam, disarankan dokter beristirahat di rumah selama 2 hari..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-slate-800 outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              {/* Upload File Surat Izin / Surat Dokter (Opsional) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 block">
                    Upload Surat Izin / Surat Dokter <span className="font-normal text-slate-400">(Opsional)</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Format: JPG, PNG, PDF (Maks 5MB)</span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {!attachmentUrl ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-1.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-xs">Klik untuk Mengunggah Dokumen</p>
                      <p className="text-[11px] text-slate-500">Foto surat dari dokter atau foto surat tertulis dari orang tua</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/60 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        {attachmentType?.includes('pdf') ? (
                          <FileText className="w-5 h-5" />
                        ) : (
                          <ImageIcon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 text-xs truncate block">
                          {attachmentName || 'Dokumen Surat'}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-medium">
                          Dokumen siap dilampirkan
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setPreviewAttachment({
                          url: attachmentUrl,
                          name: attachmentName || 'Dokumen Surat',
                          type: attachmentType,
                        })}
                        className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-[11px] font-bold hover:bg-emerald-100 transition-all cursor-pointer"
                      >
                        Pratinjau
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveAttachment}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                        title="Hapus Lampiran"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-800 leading-snug flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Permohonan ini akan otomatis disinkronkan ke rekapitulasi presensi guru wali kelas ananda di rombel {student.rombelName || 'aktif'}.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{editingRecordId ? 'Simpan Perubahan' : 'Kirim Permohonan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PREVIEW SURAT LAMPIRAN                                            */}
      {/* ========================================================================= */}
      {previewAttachment && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-5 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 truncate">
                  {previewAttachment.name}
                </h3>
              </div>
              <button
                onClick={() => setPreviewAttachment(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto flex items-center justify-center p-2 bg-slate-50 rounded-2xl min-h-[250px]">
              {previewAttachment.type?.includes('pdf') || previewAttachment.url.startsWith('data:application/pdf') ? (
                <div className="text-center p-6 space-y-3">
                  <FileText className="w-16 h-16 text-rose-500 mx-auto" />
                  <p className="font-bold text-slate-800 text-sm">{previewAttachment.name}</p>
                  <p className="text-xs text-slate-500">File dokumen PDF terlampir</p>
                  <a
                    href={previewAttachment.url}
                    download={previewAttachment.name}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700"
                  >
                    Unduh / Buka Dokumen PDF
                  </a>
                </div>
              ) : (
                <img
                  src={previewAttachment.url}
                  alt={previewAttachment.name}
                  className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-xs"
                />
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setPreviewAttachment(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: KONFIRMASI HAPUS SURAT                                             */}
      {/* ========================================================================= */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Batalkan / Hapus Permohonan?</h3>
              <p className="text-xs text-slate-500">
                Surat keterangan {recordToDelete.status} tanggal <b>{recordToDelete.date}</b> akan dihapus dari data absensi.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setRecordToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Kembali
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
