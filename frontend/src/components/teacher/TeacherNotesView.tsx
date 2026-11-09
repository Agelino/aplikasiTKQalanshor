import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TeacherPersonalNote,
  TeacherNoteCategory,
  TeacherNotePriority,
  Student,
} from '../../types';
import {
  HeartHandshake,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  MessageSquare,
  AlertTriangle,
  Info,
  Calendar,
  User,
  School,
  X,
  Camera,
  ExternalLink,
  ShieldCheck,
  Send,
  UploadCloud,
  Printer,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const TeacherNotesView: React.FC = () => {
  const {
    currentUser,
    currentRole,
    currentTeacher,
    currentRombel,
    currentClass,
    accessibleStudents,
    students,
    teacherNotes,
    addTeacherNote,
    updateTeacherNote,
    deleteTeacherNote,
    switchStudent,
    setActiveTab,
    showToast,
  } = useApp();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentFilter, setSelectedStudentFilter] = useState('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<TeacherPersonalNote | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<TeacherPersonalNote | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; caption?: string; title: string } | null>(null);
  const [printNote, setPrintNote] = useState<TeacherPersonalNote | null>(null);

  // Form input state
  const [formStudentId, setFormStudentId] = useState('');
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<TeacherNoteCategory>('Perilaku & Emosional');
  const [formPriority, setFormPriority] = useState<TeacherNotePriority>('Penting');
  const [formContent, setFormContent] = useState('');
  const [formActionPlan, setFormActionPlan] = useState('');
  const [formPhotoUrl, setFormPhotoUrl] = useState('');
  const [formPhotoCaption, setFormPhotoCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine active students relevant to this teacher / rombel
  const availableStudents = useMemo(() => {
    if (currentRole === 'guru' && accessibleStudents.length > 0) {
      return accessibleStudents;
    }
    return students;
  }, [currentRole, accessibleStudents, students]);

  // Filtered notes list
  const filteredNotes = useMemo(() => {
    return teacherNotes.filter(note => {
      // Role scope: if teacher, show notes created by teacher or for students in teacher's rombel
      if (currentRole === 'guru' && currentRombel) {
        const isInRombel = availableStudents.some(s => s.id === note.studentId);
        const isMyTeacherId = currentTeacher && note.teacherId === currentTeacher.id;
        if (!isInRombel && !isMyTeacherId) return false;
      }

      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = note.title.toLowerCase().includes(q);
        const matchStudent = note.studentName.toLowerCase().includes(q);
        const matchContent = note.content.toLowerCase().includes(q);
        const matchCategory = note.category.toLowerCase().includes(q);
        if (!matchTitle && !matchStudent && !matchContent && !matchCategory) return false;
      }

      // Student Filter
      if (selectedStudentFilter !== 'all' && note.studentId !== selectedStudentFilter) {
        return false;
      }

      // Category Filter
      if (selectedCategoryFilter !== 'all' && note.category !== selectedCategoryFilter) {
        return false;
      }

      // Priority Filter
      if (selectedPriorityFilter !== 'all' && note.priority !== selectedPriorityFilter) {
        return false;
      }

      // Status Filter
      if (selectedStatusFilter === 'unread' && note.isReadByParent) return false;
      if (selectedStatusFilter === 'read' && (!note.isReadByParent || note.parentReply)) return false;
      if (selectedStatusFilter === 'replied' && !note.parentReply) return false;

      return true;
    });
  }, [
    teacherNotes,
    currentRole,
    currentRombel,
    currentTeacher,
    availableStudents,
    searchTerm,
    selectedStudentFilter,
    selectedCategoryFilter,
    selectedPriorityFilter,
    selectedStatusFilter,
  ]);

  // Statistics
  const stats = useMemo(() => {
    const total = filteredNotes.length;
    const urgent = filteredNotes.filter(n => n.priority === 'Mendesak / Perhatian Khusus').length;
    const unread = filteredNotes.filter(n => !n.isReadByParent).length;
    const replied = filteredNotes.filter(n => !!n.parentReply).length;
    return { total, urgent, unread, replied };
  }, [filteredNotes]);

  // Open Create Form
  const handleOpenCreateModal = (preselectedStudentId?: string) => {
    setEditingNote(null);
    setFormStudentId(preselectedStudentId || (availableStudents[0]?.id ?? ''));
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormTitle('');
    setFormCategory('Perilaku & Emosional');
    setFormPriority('Penting');
    setFormContent('');
    setFormActionPlan('');
    setFormPhotoUrl('');
    setFormPhotoCaption('');
    setIsFormOpen(true);
  };

  // Open Edit Form
  const handleOpenEditModal = (note: TeacherPersonalNote) => {
    setEditingNote(note);
    setFormStudentId(note.studentId);
    setFormDate(note.date);
    setFormTitle(note.title);
    setFormCategory(note.category);
    setFormPriority(note.priority);
    setFormContent(note.content);
    setFormActionPlan(note.actionPlan || '');
    setFormPhotoUrl(note.photoUrl || '');
    setFormPhotoCaption(note.photoCaption || '');
    setIsFormOpen(true);
  };

  // Handle Photo File Upload (Convert to Base64 data URL)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Format File Tidak Didukung', 'Silakan pilih file gambar (JPG, PNG, WEBP).', 'warning');
      return;
    }

    // Limit to 4MB
    if (file.size > 4 * 1024 * 1024) {
      showToast('Ukuran File Terlalu Besar', 'Maksimal ukuran foto adalah 4MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      if (typeof event.target?.result === 'string') {
        setFormPhotoUrl(event.target.result);
        if (!formPhotoCaption) {
          setFormPhotoCaption(`Dokumentasi ananda tanggal ${formDate}`);
        }
        showToast('Foto Terlampir', 'Foto dokumentasi berhasil diunggah.', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  // Preset sample photos
  const presetPhotos = [
    {
      label: 'Foto Istirahat / UKS',
      url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
      caption: 'Callista beristirahat dan minum air hangat di ruang UKS',
    },
    {
      label: 'Foto Kartu Belajar',
      url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
      caption: 'Kartu media latihan pengenalan huruf/tilawati yang digunakan di kelas',
    },
    {
      label: 'Foto Main Sentra',
      url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
      caption: 'Dokumentasi kegiatan interaksi bermain balok di sentra',
    },
    {
      label: 'Foto Hasil Karya',
      url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80',
      caption: 'Dokumentasi kreasi mewarnai dan merapikan alat tulis ananda',
    },
  ];

  // Save Note (Create or Update)
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formStudentId) {
      showToast('Santri Belum Dipilih', 'Silakan pilih santri yang ingin diberikan catatan.', 'error');
      return;
    }

    if (!formTitle.trim()) {
      showToast('Judul Catatan Kosong', 'Harap isi perihal/judul catatan.', 'error');
      return;
    }

    if (!formContent.trim()) {
      showToast('Isi Catatan Kosong', 'Harap tuliskan detail catatan atau masalah yang perlu disampaikan.', 'error');
      return;
    }

    const selectedStudent = students.find(s => s.id === formStudentId);
    if (!selectedStudent) {
      showToast('Santri Tidak Ditemukan', 'Data santri tidak valid.', 'error');
      return;
    }

    const teacherName = currentTeacher?.name || currentUser?.name || 'Ibu Alfiyah Nurazizah';
    const teacherId = currentTeacher?.id || 'guru-alfiyah';

    if (editingNote) {
      // Update existing
      const updated: TeacherPersonalNote = {
        ...editingNote,
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        classId: selectedStudent.classId || currentClass?.id || 'kelas-a1',
        className: selectedStudent.className || currentClass?.name || 'Kelas A1',
        rombelId: selectedStudent.rombelId || currentRombel?.id,
        rombelName: selectedStudent.rombelName || currentRombel?.name,
        date: formDate,
        title: formTitle.trim(),
        category: formCategory,
        priority: formPriority,
        content: formContent.trim(),
        actionPlan: formActionPlan.trim() || undefined,
        photoUrl: formPhotoUrl || undefined,
        photoCaption: formPhotoCaption.trim() || undefined,
      };
      updateTeacherNote(updated);
    } else {
      // Create new
      addTeacherNote({
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        classId: selectedStudent.classId || currentClass?.id || 'kelas-a1',
        className: selectedStudent.className || currentClass?.name || 'Kelas A1',
        rombelId: selectedStudent.rombelId || currentRombel?.id,
        rombelName: selectedStudent.rombelName || currentRombel?.name,
        teacherId,
        teacherName,
        date: formDate,
        title: formTitle.trim(),
        category: formCategory,
        priority: formPriority,
        content: formContent.trim(),
        actionPlan: formActionPlan.trim() || undefined,
        photoUrl: formPhotoUrl || undefined,
        photoCaption: formPhotoCaption.trim() || undefined,
        isConfidential: true,
      });
    }

    setIsFormOpen(false);
  };

  // Switch preview to student portal to verify realization
  const handleTestAsStudent = (studentId: string) => {
    switchStudent(studentId);
    setActiveTab('catatan_guru_anak');
  };

  const getPriorityStyle = (priority: TeacherNotePriority) => {
    switch (priority) {
      case 'Mendesak / Perhatian Khusus':
        return {
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500 animate-pulse',
          border: 'border-l-4 border-l-rose-500',
        };
      case 'Penting':
        return {
          badge: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          border: 'border-l-4 border-l-amber-500',
        };
      case 'Biasa':
      default:
        return {
          badge: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          border: 'border-l-4 border-l-emerald-500',
        };
    }
  };

  const getCategoryColor = (category: TeacherNoteCategory) => {
    switch (category) {
      case 'Kesehatan & Fisik':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Perilaku & Emosional':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Perkembangan Belajar':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Sosialisasi & Teman':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Apresiasi & Prestasi':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Kedisiplinan & Kemandirian':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner & Context */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-semibold border border-emerald-400/30">
                <HeartHandshake className="w-3.5 h-3.5 text-amber-300" />
                Catatan Guru & Komunikasi Pribadi Siswa
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/25 text-white/90 text-xs font-medium border border-white/10">
                <School className="w-3.5 h-3.5 text-emerald-300" />
                {currentRombel ? currentRombel.fullName : 'Rombel Al Quddus'} ({currentClass ? currentClass.name : 'Kelas A1'})
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-medium border border-emerald-400/20">
                <User className="w-3.5 h-3.5 text-emerald-300" />
                Wali Rombel: {currentTeacher?.name || 'Ibu Alfiyah Nurazizah'}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
              Buku Catatan Pribadi & Koordinasi Wali Santri
            </h1>

            <p className="text-xs md:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
              Catat kejadian pribadi, kendala perilaku, kesehatan, atau kebutuhan khusus siswa di rombel Anda secara privat. Catatan ini terkirim langsung ke akun portal murid/orang tua yang bersangkutan lengkap dengan opsi foto dokumentasi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => handleOpenCreateModal()}
              className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Buat Catatan Pribadi Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Total Catatan</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{stats.total}</p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Di rombel yang dikelola</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Perhatian Khusus</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xs">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-700 mt-2">{stats.urgent}</p>
          <span className="text-[11px] text-rose-600 font-medium mt-0.5 block">Tingkat urgensi tinggi</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Belum Dibaca Wali</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-700 mt-2">{stats.unread}</p>
          <span className="text-[11px] text-amber-600 font-medium mt-0.5 block">Menunggu konfirmasi</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Telah Dibalas Wali</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-teal-700 mt-2">{stats.replied}</p>
          <span className="text-[11px] text-teal-600 font-medium mt-0.5 block">Kolaborasi orang tua aktif</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Cari nama santri, perihal catatan, kata kunci masalah..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-900"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter: Student */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Santri:</span>
              <select
                value={selectedStudentFilter}
                onChange={e => setSelectedStudentFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium text-slate-800"
              >
                <option value="all">Semua Santri ({availableStudents.length})</option>
                {availableStudents.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.nickname || s.className})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Filter: Category */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Kategori:</span>
              <select
                value={selectedCategoryFilter}
                onChange={e => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium text-slate-800"
              >
                <option value="all">Semua Kategori</option>
                <option value="Perilaku & Emosional">Perilaku & Emosional</option>
                <option value="Kesehatan & Fisik">Kesehatan & Fisik</option>
                <option value="Perkembangan Belajar">Perkembangan Belajar</option>
                <option value="Sosialisasi & Teman">Sosialisasi & Teman</option>
                <option value="Kedisiplinan & Kemandirian">Kedisiplinan & Kemandirian</option>
                <option value="Apresiasi & Prestasi">Apresiasi & Prestasi</option>
                <option value="Kebutuhan Khusus / Masalah Pribadi">Kebutuhan Khusus</option>
              </select>
            </div>

            {/* Quick Filter: Priority */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Urgensi:</span>
              <select
                value={selectedPriorityFilter}
                onChange={e => setSelectedPriorityFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium text-slate-800"
              >
                <option value="all">Semua Urgensi</option>
                <option value="Mendesak / Perhatian Khusus">Mendesak</option>
                <option value="Penting">Penting</option>
                <option value="Biasa">Biasa</option>
              </select>
            </div>

            {/* Quick Filter: Status */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Status Wali:</span>
              <select
                value={selectedStatusFilter}
                onChange={e => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium text-slate-800"
              >
                <option value="all">Semua Status</option>
                <option value="unread">Belum Dibaca</option>
                <option value="read">Sudah Dibaca</option>
                <option value="replied">Sudah Dibalas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Info Helper Bar */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Privasi Terjamin: Catatan pribadi hanya dapat diakses oleh guru pembuat & akun murid/wali yang bersangkutan.</span>
          </div>
          <span>Menampilkan <strong>{filteredNotes.length}</strong> catatan</span>
        </div>
      </div>

      {/* Note Cards List */}
      {filteredNotes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-800">Belum Ada Catatan Pribadi Siswa</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Jika terdapat kendala atau hal khusus mengenai ananda di rombel Anda (misal kesehatan, perilaku, konsentrasi, dll.), buat catatan pribadi untuk disampaikan ke orang tua.
            </p>
          </div>
          <button
            onClick={() => handleOpenCreateModal()}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Catatan Pertama Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotes.map(note => {
            const pStyle = getPriorityStyle(note.priority);
            const matchedStudent = students.find(s => s.id === note.studentId);

            return (
              <div
                key={note.id}
                className={`p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-400 transition-all space-y-4 ${pStyle.border}`}
              >
                {/* Header: Student Info & Tags */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-start gap-3.5">
                    {/* Student Avatar */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                      {note.studentName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">
                          {note.studentName}
                        </h3>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          NIS: {matchedStudent?.nis || '-'}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {note.rombelName || 'Rombel'} · {note.className || 'Kelas'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {note.date}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-[11px]">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          Guru: <strong className="text-slate-700">{note.teacherName}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Priority & Category Badges */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border ${pStyle.badge}`}>
                      <span className={`w-2 h-2 rounded-full ${pStyle.dot}`} />
                      {note.priority}
                    </span>
                    <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full border ${getCategoryColor(note.category)}`}>
                      {note.category}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {note.title}
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed mt-1.5 whitespace-pre-line bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
                      {note.content}
                    </p>
                  </div>

                  {/* Action Plan / Rekomendasi Guru */}
                  {note.actionPlan && (
                    <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Arahan Kerjasama / Tindak Lanjut untuk Orang Tua di Rumah:</span>
                      </div>
                      <p className="text-xs text-amber-950 leading-relaxed pl-5 whitespace-pre-line">
                        {note.actionPlan}
                      </p>
                    </div>
                  )}

                  {/* Optional Photo Attachment */}
                  {note.photoUrl && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div
                        onClick={() => setLightboxImage({ url: note.photoUrl!, caption: note.photoCaption, title: note.title })}
                        className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0 cursor-pointer group shadow-xs"
                      >
                        <img
                          src={note.photoUrl}
                          alt={note.photoCaption || 'Foto Dokumentasi'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                          <Eye className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                          <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Lampiran Foto Dokumentasi</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 truncate">
                          {note.photoCaption || 'Foto terkait catatan kegiatan/kondisi siswa'}
                        </p>
                        <button
                          onClick={() => setLightboxImage({ url: note.photoUrl!, caption: note.photoCaption, title: note.title })}
                          className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline mt-1 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Perbesar Foto</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status & Parent Response Section */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-600">Status Pembacaan Wali:</span>
                      {note.isReadByParent ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Telah Dibaca Wali {note.readAt ? `(${note.readAt})` : ''}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Menunggu Dibaca oleh Wali Murid
                        </span>
                      )}
                    </div>

                    {/* Test as Student Button */}
                    <button
                      onClick={() => handleTestAsStudent(note.studentId)}
                      title="Lihat bagaimana catatan ini tampil di akun portal murid/wali"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs hover:bg-emerald-50 transition-all cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Cek di Portal Murid</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Parent Reply (if any) */}
                  {note.parentReply ? (
                    <div className="p-3 rounded-xl bg-teal-50/80 border border-teal-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-teal-900 flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                          Tanggapan Balasan dari Orang Tua ({note.parentReply.parentName || 'Wali Santri'}):
                        </span>
                        <span className="text-[10px] font-mono text-teal-700">
                          {note.parentReply.repliedAt}
                        </span>
                      </div>
                      <p className="text-teal-950 leading-relaxed pl-5 italic">
                        &quot;{note.parentReply.message}&quot;
                      </p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 italic pl-1">
                      Belum ada tanggapan teks dari orang tua.
                    </p>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPrintNote(note)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500" />
                      <span>Cetak Lembar Catatan</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(note)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Ubah</span>
                    </button>
                    <button
                      onClick={() => setNoteToDelete(note)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT NOTE MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    {editingNote ? 'Ubah Catatan Pribadi Siswa' : 'Buat Catatan Pribadi Siswa Baru'}
                  </h3>
                  <p className="text-xs text-emerald-200">
                    Kirim catatan personal & rekomendasi kepada santri & orang tua
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Row 1: Student & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pilih Santri di Rombel Anda <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formStudentId}
                    onChange={e => setFormStudentId(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-semibold text-slate-900"
                  >
                    <option value="">-- Pilih Santri --</option>
                    {availableStudents.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.nickname || 'Ananda'}) — NIS: {s.nis}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Kejadian / Observasi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium text-slate-900"
                  />
                </div>
              </div>

              {/* Row 2: Urgency & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tingkat Urgensi / Prioritas <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formPriority}
                    onChange={e => setFormPriority(e.target.value as TeacherNotePriority)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-semibold text-slate-900"
                  >
                    <option value="Biasa">Biasa (Informasi rutin / Apresiasi)</option>
                    <option value="Penting">Penting (Perlu perhatian di rumah)</option>
                    <option value="Mendesak / Perhatian Khusus">Mendesak / Perhatian Khusus (Kesehatan / Masalah)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Catatan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as TeacherNoteCategory)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-semibold text-slate-900"
                  >
                    <option value="Perilaku & Emosional">Perilaku & Emosional</option>
                    <option value="Kesehatan & Fisik">Kesehatan & Fisik</option>
                    <option value="Perkembangan Belajar">Perkembangan Belajar</option>
                    <option value="Sosialisasi & Teman">Sosialisasi & Teman</option>
                    <option value="Kedisiplinan & Kemandirian">Kedisiplinan & Kemandirian</option>
                    <option value="Apresiasi & Prestasi">Apresiasi & Prestasi</option>
                    <option value="Kebutuhan Khusus / Masalah Pribadi">Kebutuhan Khusus / Masalah Pribadi</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Perihal / Judul Singkat Catatan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="Contoh: Keluhan Batuk & Lemas di Halaman Sekolah, Bimbingan Mengenal Huruf, dsb."
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium text-slate-900"
                />
              </div>

              {/* Detail Content */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Detail Kronologi Masalah / Catatan Pribadi Guru <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formContent}
                  onChange={e => setFormContent(e.target.value)}
                  placeholder="Tuliskan secara jelas kronologi apa yang dialami ananda di kelas/sekolah hari ini, bagaimana respon guru, serta kondisi terkini ananda..."
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium text-slate-900 leading-relaxed"
                />
              </div>

              {/* Action Plan / Rekomendasi Orang Tua */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Saran Tindak Lanjut / Kerjasama Orang Tua di Rumah (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={formActionPlan}
                  onChange={e => setFormActionPlan(e.target.value)}
                  placeholder="Contoh: Mohon pastikan ananda istirahat cukup, membawakan bekal air hangat, atau mendampingi latihan tilawati 5 menit sebelum tidur..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium text-slate-900 leading-relaxed"
                />
              </div>

              {/* Upload Foto (Opsional) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>Upload Foto Dokumentasi (Opsional)</span>
                  </label>
                  {formPhotoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormPhotoUrl('');
                        setFormPhotoCaption('');
                      }}
                      className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Hapus Foto</span>
                    </button>
                  )}
                </div>

                {/* Upload or Preset Options */}
                {formPhotoUrl ? (
                  <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200">
                    <img
                      src={formPhotoUrl}
                      alt="Pratinjau"
                      className="w-16 h-16 object-cover rounded-lg border border-slate-100"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-bold text-emerald-700 block">✓ Foto Terpilih</span>
                      <input
                        type="text"
                        value={formPhotoCaption}
                        onChange={e => setFormPhotoCaption(e.target.value)}
                        placeholder="Keterangan singkat foto..."
                        className="w-full mt-1 px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none text-slate-800"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-emerald-500 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 shadow-2xs hover:bg-emerald-50/50 transition-all cursor-pointer"
                      >
                        <UploadCloud className="w-4 h-4 text-emerald-600" />
                        <span>Pilih Foto dari Galeri / Kamera</span>
                      </button>
                      <span className="text-[11px] text-slate-400">atau pilih contoh preset cepat:</span>
                    </div>

                    {/* Quick Preset Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {presetPhotos.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setFormPhotoUrl(preset.url);
                            setFormPhotoCaption(preset.caption);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-[11px] font-medium text-slate-700 transition-colors"
                        >
                          + {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confidentiality notice */}
              <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Jaminan Kerahasiaan:</strong> Catatan ini bersifat privat. Hanya Anda sebagai guru kelas dan akun orang tua dari ananda yang dipilih yang dapat membaca catatan ini.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{editingNote ? 'Simpan Perubahan' : 'Kirim Catatan Pribadi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {noteToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-slate-900">Hapus Catatan Pribadi?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Anda yakin ingin menghapus catatan untuk ananda <strong>{noteToDelete.studentName}</strong> perihal &quot;{noteToDelete.title}&quot;? Catatan ini juga tidak akan dapat dilihat lagi oleh wali santri.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setNoteToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deleteTeacherNote(noteToDelete.id);
                  setNoteToDelete(null);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Ya, Hapus Catatan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX PHOTO MODAL */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-slate-900 rounded-3xl overflow-hidden max-w-3xl w-full border border-slate-800 shadow-2xl"
          >
            <div className="p-4 bg-slate-950/80 flex items-center justify-between text-white border-b border-slate-800">
              <h4 className="text-xs font-bold">{lightboxImage.title}</h4>
              <button
                onClick={() => setLightboxImage(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center max-h-[70vh] bg-black/40">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.caption || 'Foto'}
                className="max-h-[65vh] w-auto object-contain rounded-xl"
              />
            </div>
            {lightboxImage.caption && (
              <div className="p-4 bg-slate-950 text-center text-xs text-slate-300 border-t border-slate-800">
                {lightboxImage.caption}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PRINT SHEET MODAL */}
      {printNote && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-3xl p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">LEMBAR CATATAN PRIBADI SANTRI</h2>
                <p className="text-xs text-slate-600">TK Ceria Bangsa · Tahun Ajaran 2026/2027</p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 bg-slate-100 rounded-lg">
                NO: {printNote.id.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Nama Santri:</span>
                <strong className="text-slate-900 text-sm">{printNote.studentName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Kelas / Rombel:</span>
                <strong className="text-slate-900">{printNote.className} · {printNote.rombelName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Tanggal Catatan:</span>
                <strong className="text-slate-900">{printNote.date}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Tingkat Urgensi:</span>
                <strong className="text-slate-900">{printNote.priority} ({printNote.category})</strong>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <strong className="text-slate-800 block text-sm font-bold border-b border-slate-200 pb-1">
                Perihal: {printNote.title}
              </strong>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200">
                {printNote.content}
              </p>
            </div>

            {printNote.actionPlan && (
              <div className="space-y-1 text-xs">
                <strong className="text-emerald-900 block font-bold">Rekomendasi Tindak Lanjut:</strong>
                <p className="text-slate-700 leading-relaxed bg-emerald-50/50 p-3 rounded-xl border border-emerald-200">
                  {printNote.actionPlan}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs">
              <div>
                <p className="text-slate-500 mb-14">Guru / Wali Kelas</p>
                <p className="font-bold underline text-slate-900">{printNote.teacherName}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-14">Orang Tua / Wali Santri</p>
                <p className="font-bold underline text-slate-900">
                  ( {printNote.parentReply?.parentName || '................................'} )
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setPrintNote(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Lembar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
