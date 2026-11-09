import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Teacher } from '../../types';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Upload,
  FileCheck,
} from 'lucide-react';

export const TeachersView: React.FC = () => {
  const { teachers, addTeacher, updateTeacher, deleteTeacher, classes } = useApp();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form input state
  const initialFormState: Omit<Teacher, 'id'> = {
    name: '',
    nip: '',
    nik: '',
    gender: 'P',
    birthPlace: '',
    birthDate: '1990-01-01',
    address: '',
    phone: '',
    email: '',
    education: '',
    position: 'Guru Kelas',
    username: '',
    status: 'Aktif',
    avatarColor: 'bg-emerald-600',
    signatureImage: '',
  };

  const [formData, setFormData] = useState<Omit<Teacher, 'id'>>(initialFormState);

  // Filtered teachers
  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => {
      const matchSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.nip.includes(search) ||
        t.email.toLowerCase().includes(search.toLowerCase()) ||
        t.position.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || t.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [teachers, search, filterStatus]);

  const totalPages = Math.ceil(filteredTeachers.length / pageSize) || 1;
  const paginatedTeachers = filteredTeachers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedTeacher(null);
    setFormData(initialFormState);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (t: Teacher) => {
    setIsEditing(true);
    setSelectedTeacher(t);
    setFormData({
      name: t.name,
      nip: t.nip,
      nik: t.nik,
      gender: t.gender,
      birthPlace: t.birthPlace,
      birthDate: t.birthDate,
      address: t.address,
      phone: t.phone,
      email: t.email,
      education: t.education,
      position: t.position,
      username: t.username,
      status: t.status,
      assignedClassId: t.assignedClassId,
      avatarColor: t.avatarColor || 'bg-emerald-600',
      signatureImage: t.signatureImage || '',
    });
    setIsFormOpen(true);
  };

  const handleOpenDetail = (t: Teacher) => {
    setSelectedTeacher(t);
    setIsDetailOpen(true);
  };

  const handleToggleStatus = (t: Teacher) => {
    const updatedStatus = t.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    updateTeacher({ ...t, status: updatedStatus });
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('Ukuran file foto tanda tangan maksimal 3MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, signatureImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (t: Teacher) => {
    if (window.confirm(`Yakin ingin menghapus data ${t.name}?`)) {
      deleteTeacher(t.id);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && selectedTeacher) {
      updateTeacher({ ...formData, id: selectedTeacher.id });
    } else {
      addTeacher(formData);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Data Pendidik & Guru</h2>
            <p className="text-xs text-slate-500">Kelola informasi guru kelas, guru pendamping, dan staf pengajar</p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Guru Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari nama, NIP, email, jabatan..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => { setFilterStatus('all'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Semua ({teachers.length})
            </button>
            <button
              onClick={() => { setFilterStatus('Aktif'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterStatus === 'Aktif' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Aktif ({teachers.filter(t => t.status === 'Aktif').length})
            </button>
            <button
              onClick={() => { setFilterStatus('Nonaktif'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterStatus === 'Nonaktif' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Nonaktif ({teachers.filter(t => t.status === 'Nonaktif').length})
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200/80 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Pendidik / Guru</th>
                <th className="py-3.5 px-4">NIP / NUPTK</th>
                <th className="py-3.5 px-4">Jabatan & Penugasan</th>
                <th className="py-3.5 px-4">Tanda Tangan</th>
                <th className="py-3.5 px-4">Kontak & Email</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedTeachers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Tidak ditemukan data guru yang cocok.
                  </td>
                </tr>
              ) : (
                paginatedTeachers.map(teacher => (
                  <tr key={teacher.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Foto & Nama */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl ${teacher.avatarColor || 'bg-emerald-600'} text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0`}>
                          {teacher.name.split(' ')[0].charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{teacher.name}</p>
                          <span className="text-[11px] text-slate-500">{teacher.gender === 'L' ? 'Laki-laki' : 'Perempuan'} · {teacher.education}</span>
                        </div>
                      </div>
                    </td>

                    {/* NIP */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 tabular-nums">
                      {teacher.nip}
                    </td>

                    {/* Jabatan */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-900 block">{teacher.position}</span>
                      <span className="text-[11px] text-emerald-600">
                        {classes.find(c => c.id === teacher.assignedClassId)?.name || 'Pengajar Khusus'}
                      </span>
                    </td>

                    {/* Tanda Tangan */}
                    <td className="py-3.5 px-4">
                      {teacher.signatureImage ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-14 h-8 bg-slate-50 border border-slate-200 rounded flex items-center justify-center p-0.5 overflow-hidden shadow-2xs">
                            <img src={teacher.signatureImage} alt="Ttd" className="max-h-full max-w-full object-contain" />
                          </div>
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            Ada
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
                          Belum Ada
                        </span>
                      )}
                    </td>

                    {/* Kontak */}
                    <td className="py-3.5 px-4 text-[11px] text-slate-600 space-y-0.5">
                      <p className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-400" />{teacher.phone}</p>
                      <p className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-slate-400" />{teacher.email}</p>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(teacher)}
                        className="inline-flex items-center gap-1 cursor-pointer focus:outline-none"
                        title="Klik untuk ubah status"
                      >
                        {teacher.status === 'Aktif' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            Nonaktif
                          </span>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenDetail(teacher)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Lihat Detail Guru"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(teacher)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit Guru"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(teacher)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Guru"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan {paginatedTeachers.length} dari {filteredTeachers.length} pendidik</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
            >
              Sebelumnya
            </button>
            <span className="px-2 font-medium text-slate-700">Halaman {currentPage} dari {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Tambah / Edit Guru */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {isEditing ? 'Ubah Data Pendidik' : 'Pendaftaran Pendidik & Guru Baru'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Siti Nurhaliza, S.Pd"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">Jabatan / Penugasan *</label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={e => setFormData({ ...formData, position: e.target.value })}
                    placeholder="Guru Kelas Kelompok B"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">NIP / NUPTK *</label>
                  <input
                    type="text"
                    required
                    value={formData.nip}
                    onChange={e => setFormData({ ...formData, nip: e.target.value })}
                    placeholder="198805142015032004"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">NIK (KTP) *</label>
                  <input
                    type="text"
                    required
                    value={formData.nik}
                    onChange={e => setFormData({ ...formData, nik: e.target.value })}
                    placeholder="3276015405880002"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as 'L' | 'P' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                  >
                    <option value="P">Perempuan</option>
                    <option value="L">Laki-laki</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">Pendidikan Terakhir</label>
                  <input
                    type="text"
                    value={formData.education}
                    onChange={e => setFormData({ ...formData, education: e.target.value })}
                    placeholder="S1 PG-PAUD UNJ"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={formData.birthPlace}
                    onChange={e => setFormData({ ...formData, birthPlace: e.target.value })}
                    placeholder="Bandung"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">Nomor HP / WhatsApp</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">Email Resmi</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="guru@tkceriabangsa.sch.id"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">Username Login</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    placeholder="guru"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">Status Keaktifan</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as 'Aktif' | 'Nonaktif' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Alamat Tempat Tinggal</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Jl. Merpati..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              {/* Upload Foto File Tanda Tangan Guru */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <label className="font-bold text-slate-800 text-xs block">
                  Foto File Tanda Tangan Guru (Untuk Cetak Absensi & Rapor)
                </label>
                <p className="text-[11px] text-slate-500">
                  Upload file foto/scan tanda tangan asli (PNG transparan atau JPG). Tanda tangan ini otomatis dicetak pada lembar presensi bulanan untuk guru yang berstatus hadir.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
                  <div className="w-40 h-20 bg-white border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center p-2 overflow-hidden shadow-2xs">
                    {formData.signatureImage ? (
                      <img src={formData.signatureImage} alt="Preview Tanda Tangan" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-[11px] text-slate-400 text-center">Belum ada file tanda tangan</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs cursor-pointer shadow-xs transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{formData.signatureImage ? 'Ganti Foto Tanda Tangan' : 'Upload Foto File Tanda Tangan'}</span>
                      <input type="file" accept="image/*" onChange={handleSignatureUpload} className="hidden" />
                    </label>

                    {formData.signatureImage && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, signatureImage: '' })}
                        className="block text-[11px] text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
                      >
                        Hapus Tanda Tangan
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  {isEditing ? 'Simpan Perubahan' : 'Daftarkan Guru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Detail Guru */}
      {isDetailOpen && selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl ${selectedTeacher.avatarColor} text-white font-bold text-base flex items-center justify-center shadow-md`}>
                  {selectedTeacher.name.split(' ')[0].charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedTeacher.name}</h3>
                  <p className="text-xs text-emerald-600 font-medium">{selectedTeacher.position}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">NIP / NUPTK</span>
                <span className="font-mono text-slate-800">{selectedTeacher.nip}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">NIK (KTP)</span>
                <span className="font-mono text-slate-800">{selectedTeacher.nik}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">TTL</span>
                <span className="text-slate-800">{selectedTeacher.birthPlace}, {selectedTeacher.birthDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Pendidikan</span>
                <span className="text-slate-800">{selectedTeacher.education}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Telepon</span>
                <span className="text-slate-800">{selectedTeacher.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Email</span>
                <span className="text-slate-800">{selectedTeacher.email}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Alamat Lengkap</span>
                <span className="text-slate-800">{selectedTeacher.address}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Username Akun</span>
                <span className="font-mono text-slate-800 font-semibold">{selectedTeacher.username}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${selectedTeacher.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {selectedTeacher.status}
                </span>
              </div>

              {/* Tanda Tangan Preview in Detail */}
              <div className="col-span-2 pt-2 border-t border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1.5">
                  Spesimen Tanda Tangan / Paraf Kehadiran Guru
                </span>
                {selectedTeacher.signatureImage ? (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="h-16 w-44 bg-white rounded-lg border border-slate-200 flex items-center justify-center p-2 shadow-2xs">
                      <img src={selectedTeacher.signatureImage} alt="Spesimen Ttd" className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="text-right text-[11px] text-slate-500">
                      <p className="font-semibold text-slate-800">{selectedTeacher.name}</p>
                      <p className="font-mono text-slate-500">NIP. {selectedTeacher.nip}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded mt-1 border border-emerald-200">
                        <FileCheck className="w-3 h-3 text-emerald-600" />
                        Terverifikasi Sistem
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px]">
                    Guru ini belum mengupload foto file tanda tangan. Silakan klik &quot;Ubah Data&quot; untuk mengupload foto tanda tangan agar muncul saat cetak presensi bulanan.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setIsDetailOpen(false);
                  handleOpenEdit(selectedTeacher);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs"
              >
                Ubah Data
              </button>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
