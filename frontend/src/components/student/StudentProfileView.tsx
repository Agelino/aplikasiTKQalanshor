import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  User,
  Heart,
  Phone,
  Calendar,
  Sparkles,
  BookOpen,
  Printer,
  Edit2,
  CheckCircle2,
  ShieldAlert,
  Award,
  GraduationCap,
  Save,
  X,
  School,
  Clock,
  Activity,
  FileText,
} from 'lucide-react';

export const StudentProfileView: React.FC = () => {
  const {
    students,
    currentUser,
    currentRole,
    currentStudent,
    switchStudent,
    updateStudent,
    schoolProfile,
  } = useApp();

  // If role is murid, strictly use currentStudent
  const defaultStudentId =
    currentRole === 'murid'
      ? (currentStudent?.id || currentUser?.studentId || students[0]?.id)
      : students[0]?.id;

  const [selectedStudentId, setSelectedStudentId] = useState<string>(defaultStudentId || '');
  const [activeTab, setActiveTab] = useState<'biodata' | 'orangtua' | 'kesehatan' | 'apbq' | 'kehadiran'>('biodata');
  const [isEditing, setIsEditing] = useState(false);

  const student = currentRole === 'murid'
    ? (currentStudent || students.find(s => s.id === currentUser?.studentId) || students[0])
    : (students.find(s => s.id === selectedStudentId) || students[0]);

  // Editable form state
  const [editForm, setEditForm] = useState<Partial<Student>>({});

  const startEdit = () => {
    if (!student) return;
    setEditForm({
      guardianPhone: student.guardianPhone,
      address: student.address,
      bloodType: student.bloodType || 'O',
      heightCm: student.heightCm || 105,
      weightKg: student.weightKg || 17,
      headCircumferenceCm: student.headCircumferenceCm || 50,
      allergies: student.allergies || 'Tidak ada',
      medicalNotes: student.medicalNotes || '',
      fatherJob: student.fatherJob || '',
      motherJob: student.motherJob || '',
      emergencyContact: student.emergencyContact || {
        name: student.fatherName,
        relation: 'Ayah Kandung',
        phone: student.guardianPhone,
      },
    });
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;
    const updated: Student = {
      ...student,
      address: editForm.address ?? student.address,
      bloodType: editForm.bloodType ?? student.bloodType,
      heightCm: Number(editForm.heightCm) || student.heightCm,
      weightKg: Number(editForm.weightKg) || student.weightKg,
      headCircumferenceCm: Number(editForm.headCircumferenceCm) || student.headCircumferenceCm,
      allergies: editForm.allergies ?? student.allergies,
      medicalNotes: editForm.medicalNotes ?? student.medicalNotes,
      fatherJob: editForm.fatherJob ?? student.fatherJob,
      motherJob: editForm.motherJob ?? student.motherJob,
      emergencyContact: editForm.emergencyContact ?? student.emergencyContact,
    };
    updateStudent(updated);
    setIsEditing(false);
  };

  if (!student) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
        Data profil ananda tidak ditemukan.
      </div>
    );
  }

  // Calculate age
  const birthYear = new Date(student.birthDate).getFullYear();
  const currentYear = 2026;
  const ageYears = currentYear - birthYear;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 relative p-6 flex justify-between items-start">
          <div className="flex items-center gap-2 text-emerald-100 text-xs font-semibold">
            <School className="w-4 h-4" />
            <span>{schoolProfile.name} • Tahun Ajaran 2026/2027</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-md transition-all border border-white/20 print:hidden"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Biodata</span>
            </button>
            <button
              onClick={startEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold transition-all shadow-sm print:hidden"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Perbarui Data</span>
            </button>
          </div>
        </div>

        {/* Profile Card Main Info */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className={`w-24 h-24 rounded-3xl ${student.avatarColor || 'bg-emerald-600'} text-white text-3xl font-extrabold flex items-center justify-center border-4 border-white shadow-md shrink-0`}>
              {student.name.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {student.name}
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {student.status}
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  Panggilan: &quot;{student.nickname}&quot;
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span>NIS: <strong className="text-slate-800 font-mono">{student.nis}</strong></span>
                <span>•</span>
                <span>NISN: <strong className="text-slate-800 font-mono">{student.nisn}</strong></span>
                <span>•</span>
                <span>Kelas: <strong className="text-emerald-700">{student.className}</strong></span>
                <span>•</span>
                <span>Usia: <strong className="text-slate-800">{ageYears} Tahun</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Switcher for Admin/Guru */}
          {currentRole !== 'murid' && students.length > 1 && (
            <div className="flex items-center gap-2 shrink-0 self-start md:self-auto bg-slate-50 p-2 rounded-2xl border border-slate-200 print:hidden">
              <span className="text-[11px] font-semibold text-slate-500 pl-1">Pilih Siswa:</span>
              <select
                value={selectedStudentId}
                onChange={e => setSelectedStudentId(e.target.value)}
                className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.className})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-t border-slate-100 overflow-x-auto print:hidden">
          <button
            onClick={() => setActiveTab('biodata')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'biodata'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Biodata Anak</span>
          </button>

          <button
            onClick={() => setActiveTab('orangtua')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'orangtua'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Orang Tua & Kontak Darurat</span>
          </button>

          <button
            onClick={() => setActiveTab('kesehatan')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'kesehatan'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Tumbuh Kembang & DDTK</span>
          </button>

          <button
            onClick={() => setActiveTab('apbq')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'apbq'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Capaian APBQ 2026 (TKQ)</span>
          </button>

          <button
            onClick={() => setActiveTab('kehadiran')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'kehadiran'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Ringkasan Kehadiran</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Biodata Lengkap Anak */}
      {activeTab === 'biodata' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-4 h-4 text-emerald-600" />
              Identitas Lengkap Murid
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Nama Lengkap</span>
                <p className="font-bold text-slate-900 mt-0.5">{student.name}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Nama Panggilan</span>
                <p className="font-bold text-slate-900 mt-0.5">{student.nickname}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Nomor Induk Siswa (NIS)</span>
                <p className="font-mono font-bold text-slate-800 mt-0.5">{student.nis}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">NISN Resmi</span>
                <p className="font-mono font-bold text-slate-800 mt-0.5">{student.nisn}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">NIK (Kartu Keluarga)</span>
                <p className="font-mono font-bold text-slate-800 mt-0.5">{student.nik}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Jenis Kelamin</span>
                <p className="font-bold text-slate-900 mt-0.5">
                  {student.gender === 'L' ? 'Laki-laki (Ikhwan)' : 'Perempuan (Akhwat)'}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Tempat, Tanggal Lahir</span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {student.birthPlace}, {student.birthDate}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Agama</span>
                <p className="font-bold text-emerald-800 mt-0.5">{student.religion}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Anak ke- / Jumlah Saudara</span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  Anak ke-{student.childOrder || 1} dari {student.siblingsCount || 2} bersaudara
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Tahun Masuk</span>
                <p className="font-semibold text-slate-800 mt-0.5">{student.entryYear}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Alamat Tempat Tinggal</span>
              <p className="text-slate-700 mt-1 leading-relaxed">{student.address}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <School className="w-4 h-4 text-emerald-600" />
              Rombongan Belajar & Wali Kelas
            </h3>

            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800">Kelas Terdaftar</span>
                  <p className="text-base font-black text-slate-900 mt-0.5">{student.className}</p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs">
                  {student.classId === 'kelas-a' ? 'Fase Fondasi (4-5 Th)' : 'Fase Fondasi (5-6 Th)'}
                </span>
              </div>

              <div className="pt-2 border-t border-emerald-200/50 text-xs space-y-1">
                <span className="text-slate-500">Guru Wali Kelas:</span>
                <p className="font-bold text-slate-900">
                  {student.classId === 'kelas-a' ? 'Dewi Lestari, S.Pd' : 'Siti Nurhaliza, S.Pd'}
                </p>
                <p className="text-[11px] text-slate-500">
                  Kontak Komunikasi Wali: 0812-8899-2311 (WhatsApp Aktif)
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block">Kurikulum Pembelajaran Aktif</span>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Kurikulum Operasional Terpadu (Integrasi Kurikulum Merdeka PAUD Kemdikbudristek + Kurikulum Khas TKQ & APBQ 2026).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-[11px] text-blue-900">
                  <strong>Status Data Dapodik:</strong> Terverifikasi & Sinkron dengan NPSN 69847120.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Orang Tua / Wali & Kontak Darurat */}
      {activeTab === 'orangtua' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data Orang Tua */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Heart className="w-4 h-4 text-rose-600" />
              Data Ayah & Ibu Kandung
            </h3>

            {/* Ayah */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Data Ayah</span>
              <p className="text-sm font-bold text-slate-900">{student.fatherName}</p>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <span>NIK: <strong className="font-mono">{student.fatherNik || '3276011203870001'}</strong></span>
                <span>Pendidikan: <strong>{student.fatherEducation || 'S1 Perguruan Tinggi'}</strong></span>
                <span className="col-span-2">Pekerjaan: <strong>{student.fatherJob || 'Wiraswasta / Pegawai'}</strong></span>
              </div>
            </div>

            {/* Ibu */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Data Ibu</span>
              <p className="text-sm font-bold text-slate-900">{student.motherName}</p>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <span>NIK: <strong className="font-mono">{student.motherNik || '3276015509900004'}</strong></span>
                <span>Pendidikan: <strong>{student.motherEducation || 'S1 Perguruan Tinggi'}</strong></span>
                <span className="col-span-2">Pekerjaan: <strong>{student.motherJob || 'Ibu Rumah Tangga / Karyawan'}</strong></span>
              </div>
            </div>

            <div className="pt-2 text-xs flex items-center gap-2 text-slate-700">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>No. WhatsApp Utama Wali: <strong className="font-mono text-emerald-800">{student.guardianPhone}</strong></span>
            </div>
          </div>

          {/* Kontak Darurat */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Kontak Darurat (Emergency Call)
            </h3>

            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Kontak Prioritas Cepat</span>
                  <p className="font-black text-slate-900 text-base">
                    {student.emergencyContact?.name || student.fatherName}
                  </p>
                  <p className="text-xs text-amber-900 font-semibold">
                    Hubungan: {student.emergencyContact?.relation || 'Ayah Kandung'}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-amber-200/60 flex items-center justify-between">
                <span className="text-xs text-slate-600">Nomor Telepon:</span>
                <a
                  href={`tel:${student.emergencyContact?.phone || student.guardianPhone}`}
                  className="font-mono font-bold text-sm text-emerald-700 bg-white px-3 py-1 rounded-lg border border-amber-200 shadow-2xs hover:bg-emerald-50"
                >
                  {student.emergencyContact?.phone || student.guardianPhone}
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-800 block mb-1">Catatan Penting Guru & Tata Usaha:</strong>
              Kontak darurat akan dihubungi oleh pihak sekolah bila ananda mendadak sakit, demam tinggi saat jam belajar, atau diperlukan penjemputan khusus di luar jadwal.
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Tumbuh Kembang & Kesehatan (DDTK PAUD) */}
      {activeTab === 'kesehatan' && (
        <div className="space-y-6">
          {/* Antropometri & Pertumbuhan */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Tinggi Badan (TB)</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">{student.heightCm || 108} cm</p>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
                Tinggi Normal (Sesuai Kurva WHO)
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Berat Badan (BB)</span>
              <p className="text-2xl font-black text-teal-700 mt-1">{student.weightKg || 18.5} kg</p>
              <span className="text-[11px] text-teal-600 font-semibold mt-1 inline-block">
                Gizi Baik / Ideal
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Lingkar Kepala (LK)</span>
              <p className="text-2xl font-black text-indigo-700 mt-1">{student.headCircumferenceCm || 50.5} cm</p>
              <span className="text-[11px] text-indigo-600 font-semibold mt-1 inline-block">
                Normosefal (Normal)
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Golongan Darah</span>
              <p className="text-2xl font-black text-rose-700 mt-1">{student.bloodType || 'O'}</p>
              <span className="text-[11px] text-slate-400 font-semibold mt-1 inline-block">
                Rhesus Positif
              </span>
            </div>
          </div>

          {/* Kesehatan & Alergi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                Catatan Alergi & Riwayat Kesehatan
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100">
                  <span className="font-bold text-rose-900 block mb-1">Riwayat Alergi Makanan/Obat:</span>
                  <p className="text-slate-700 font-medium">
                    {student.allergies || 'Tidak ada riwayat alergi khusus. Aman mengikuti menu makan sehat sekolah.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">Catatan Khusus Dokter / Tumbuh Kembang:</span>
                  <p className="text-slate-600 leading-relaxed">
                    {student.medicalNotes || 'Ananda aktif, riang, koordinasi gerak mata dan tangan sangat baik. Tidak memiliki hambatan pendengaran atau penglihatan.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                <Activity className="w-4 h-4 text-emerald-600" />
                Status Imunisasi Dasar & Booster
              </h3>

              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{student.immunizationStatus || 'Imunisasi Dasar Lengkap (IDL) Tercatat'}</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Telah menerima vaksin Hepatitis B, BCG, Polio tetes & suntik, DPT-HB-Hib, Campak/MR, serta imunisasi lanjutan usia balita.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-800 block">Pemeriksaan Berkala Puskesmas & Guru Sentra:</span>
                <p className="text-slate-500 text-[11px]">
                  Jadwal penimbangan berat badan, pengukuran tinggi badan, dan pemeriksaan kebersihan kuku/gigi dilakukan setiap bulan pekan ke-1.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Capaian APBQ 2026 (TKQ) */}
      {activeTab === 'apbq' && (
        <div className="space-y-6">
          {/* APBQ Highlight Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Pedoman APBQ 2026 (Asesmen Pembelajaran & Pembiasaan Al-Qur&apos;an TKQ)
                </span>
                <h2 className="text-xl md:text-2xl font-black mt-2">
                  Kemajuan Pembelajaran Al-Qur&apos;an: {student.name}
                </h2>
                <p className="text-xs text-emerald-200/90 max-w-xl">
                  Evaluasi holistik capaian baca Al-Qur&apos;an (Tilawati/Ummi/Iqro), hafalan surat pendek Juz 30, doa harian, dan hadits adab islami santri.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0 w-full md:w-auto">
                <span className="text-[10px] text-emerald-200 uppercase font-bold block">Tingkat Tilawati Saat Ini</span>
                <p className="text-xl font-black text-amber-300 mt-0.5">
                  {student.apbqProgress?.tilawatiLevel || 'Jilid 2 (Hal. 18)'}
                </p>
                <span className="text-[11px] text-emerald-100 block mt-0.5">
                  Makharijul: <strong>{student.apbqProgress?.makharijulScore || 'A (Fasih)'}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Cards for Tahfidz, Doa, Hadits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Surat Pendek */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Tahfidz Juz 30 Mutqin
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                  {student.apbqProgress?.tahfidzCompleted?.length || 4} Surat
                </span>
              </div>

              <div className="space-y-1.5">
                {(student.apbqProgress?.tahfidzCompleted || ['An-Nas', 'Al-Falaq', 'Al-Ikhlas', 'Al-Lahab']).map((surah, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="font-semibold text-slate-800">QS. {surah}</span>
                    <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Tuntas
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Doa Harian */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-teal-600" />
                  Doa Harian Santri
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700">
                  {student.apbqProgress?.dailyPrayersCompleted?.length || 5} Doa
                </span>
              </div>

              <div className="space-y-1.5">
                {(student.apbqProgress?.dailyPrayersCompleted || [
                  'Doa Sebelum Belajar',
                  'Doa Kedua Orang Tua',
                  'Doa Kebaikan Dunia Akhirat',
                  'Doa Masuk Masjid',
                ]).map((doa, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="font-semibold text-slate-800 truncate pr-2">{doa}</span>
                    <span className="text-[10px] font-bold text-teal-700 shrink-0">Hafal & Diamalkan</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hadits Karakter & Adab */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  Hadits Adab & Karakter
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700">
                  Nilai: {student.apbqProgress?.adabScore || 'A (Sangat Baik)'}
                </span>
              </div>

              <div className="space-y-1.5">
                {(student.apbqProgress?.hadithCompleted || [
                  'Hadits Kasih Sayang (Man Laa Yarham...)',
                  'Hadits Menuntut Ilmu (Tholabul Ilmi...)',
                  'Hadits Kebersihan (Ath-Thuhuuru...)',
                ]).map((hadits, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-0.5">
                    <p className="font-semibold text-slate-800">{hadits}</p>
                    <span className="text-[10px] text-emerald-600 font-medium">Praktik harian di sekolah</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Teacher/Ustadz Notes */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 text-xs">
            <span className="font-bold text-slate-900 block mb-1">Catatan Pembimbing Sentra Al-Qur&apos;an & APBQ:</span>
            <p className="text-slate-600 leading-relaxed italic">
              &quot;{student.apbqProgress?.notes || 'Ananda menunjukkan kecintaan tinggi terhadap Al-Qur\'an, pelafalan makhraj huruf sangat jelas, serta santun dalam berdoa bersama teman-temannya di kelas.'}&quot;
            </p>
          </div>
        </div>
      )}

      {/* TAB 5: Ringkasan Kehadiran */}
      {activeTab === 'kehadiran' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Hadir</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">18 Hari</p>
              <span className="text-[10px] text-emerald-600 font-bold">94.7% Kehadiran</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Sakit</span>
              <p className="text-2xl font-black text-blue-700 mt-1">1 Hari</p>
              <span className="text-[10px] text-blue-600 font-medium">Surat dokter tercatat</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Izin</span>
              <p className="text-2xl font-black text-amber-700 mt-1">0 Hari</p>
              <span className="text-[10px] text-slate-400">Pemberitahuan wali</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Tanpa Keterangan</span>
              <p className="text-2xl font-black text-rose-700 mt-1">0 Hari</p>
              <span className="text-[10px] text-emerald-600 font-bold">Tertib & Disiplin</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit / Perbarui Data */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Perbarui Data & Kesehatan Ananda
                </h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Alamat Tempat Tinggal</label>
                <textarea
                  rows={2}
                  value={editForm.address || ''}
                  onChange={e => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tinggi Badan (cm)</label>
                  <input
                    type="number"
                    value={editForm.heightCm || ''}
                    onChange={e => setEditForm(prev => ({ ...prev, heightCm: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Berat Badan (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editForm.weightKg || ''}
                    onChange={e => setEditForm(prev => ({ ...prev, weightKg: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Golongan Darah</label>
                  <select
                    value={editForm.bloodType || 'O'}
                    onChange={e => setEditForm(prev => ({ ...prev, bloodType: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 outline-none focus:border-emerald-500"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Lingkar Kepala (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editForm.headCircumferenceCm || ''}
                    onChange={e => setEditForm(prev => ({ ...prev, headCircumferenceCm: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Riwayat Alergi Makanan/Obat</label>
                <input
                  type="text"
                  value={editForm.allergies || ''}
                  onChange={e => setEditForm(prev => ({ ...prev, allergies: e.target.value }))}
                  placeholder="Contoh: Alergi udang/seafood, tidak ada"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Khusus Kesehatan / Perkembangan</label>
                <textarea
                  rows={2}
                  value={editForm.medicalNotes || ''}
                  onChange={e => setEditForm(prev => ({ ...prev, medicalNotes: e.target.value }))}
                  placeholder="Informasi kondisi anak yang perlu diketahui guru..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
