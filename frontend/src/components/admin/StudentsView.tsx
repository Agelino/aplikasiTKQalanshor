import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import * as XLSX from 'xlsx';
import {
  GraduationCap,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Phone,
  User,
  Heart,
  Calendar,
  Sparkles,
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileText,
  Filter,
  Check,
  ChevronDown,
  Info,
  School,
  ArrowRight,
} from 'lucide-react';

interface ParsedStudentRow {
  raw: any;
  student: Omit<Student, 'id'> & { id?: string };
  isDuplicate: boolean;
  duplicateReason?: string;
  matchedStudent?: Student;
  selected: boolean;
}

export const StudentsView: React.FC = () => {
  const {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    addStudentsBulk,
    classes,
    rombels,
    assignSingleStudentToRombel,
    setActiveTab,
    showToast,
    currentRole,
    currentTeacher,
    currentRombel,
    currentClass,
    accessibleStudents,
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Quick Assign Rombel Modal State
  const [quickAssignStudent, setQuickAssignStudent] = useState<Student | null>(null);
  const [quickSelectedRombelId, setQuickSelectedRombelId] = useState<string>('');

  // Single Student Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // In-app delete confirm modal
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Excel Import State
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedStudentRow[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [importMode, setImportMode] = useState<'update_and_add' | 'only_new' | 'add_all'>('update_and_add');
  const [excelPreviewSearch, setExcelPreviewSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default initial form state
  const initialFormState: Omit<Student, 'id'> = {
    nis: '',
    nisn: '',
    name: '',
    nickname: '',
    nik: '',
    gender: 'L',
    birthPlace: 'Depok',
    birthDate: '2021-01-01',
    religion: 'Islam',
    address: '',
    fatherName: '',
    motherName: '',
    guardianPhone: '',
    classId: currentRole === 'guru' ? (currentClass?.id || '') : '',
    className: currentRole === 'guru' ? (currentClass?.name || '-') : '-',
    rombelId: currentRole === 'guru' ? (currentRombel?.id || '') : '',
    rombelName: currentRole === 'guru' ? (currentRombel?.name || '-') : '-',
    rombelTeacherName: currentRole === 'guru' ? (currentTeacher?.name || '-') : '-',
    entryYear: '2026',
    username: '',
    status: 'Aktif',
    avatarColor: 'bg-emerald-500',
  };

  const [formData, setFormData] = useState<Omit<Student, 'id'>>(initialFormState);

  // Base list of students depending on role
  const baseStudents = currentRole === 'guru' ? accessibleStudents : students;

  // Filtered students for table
  const filteredStudents = useMemo(() => {
    return baseStudents.filter(s => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.nickname.toLowerCase().includes(search.toLowerCase()) ||
        s.nis.includes(search) ||
        s.nisn.includes(search) ||
        (s.rombelName && s.rombelName.toLowerCase().includes(search.toLowerCase())) ||
        (s.rombelTeacherName && s.rombelTeacherName.toLowerCase().includes(search.toLowerCase())) ||
        (s.fatherName && s.fatherName.toLowerCase().includes(search.toLowerCase())) ||
        (s.motherName && s.motherName.toLowerCase().includes(search.toLowerCase()));

      let matchClass = true;
      if (currentRole === 'guru') {
        // Teacher is strictly scoped to their own rombel
        matchClass = true;
      } else {
        if (filterClass === 'all') {
          matchClass = true;
        } else if (filterClass === 'unassigned') {
          matchClass = !s.classId || s.className === '-' || !s.className;
        } else if (filterClass.startsWith('rombel:')) {
          const rId = filterClass.replace('rombel:', '');
          matchClass = s.rombelId === rId;
        } else {
          matchClass = s.classId === filterClass;
        }
      }

      const matchStatus = filterStatus === 'all' || s.status === filterStatus;
      return matchSearch && matchClass && matchStatus;
    });
  }, [baseStudents, search, filterClass, filterStatus, currentRole]);

  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const unassignedStudentsCount = useMemo(() => {
    return students.filter(s => !s.classId || s.className === '-' || !s.className).length;
  }, [students]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedStudent(null);
    const nextNis = `260${String(students.length + 1).padStart(2, '0')}`;
    setFormData({
      ...initialFormState,
      nis: nextNis,
      username: `murid${students.length + 1}`,
      classId: currentRole === 'guru' ? (currentClass?.id || '') : '',
      className: currentRole === 'guru' ? (currentClass?.name || '-') : '-',
      rombelId: currentRole === 'guru' ? (currentRombel?.id || '') : '',
      rombelName: currentRole === 'guru' ? (currentRombel?.name || '-') : '-',
      rombelTeacherName: currentRole === 'guru' ? (currentTeacher?.name || '-') : '-',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (s: Student) => {
    setIsEditing(true);
    setSelectedStudent(s);
    setFormData({
      nis: s.nis,
      nisn: s.nisn,
      name: s.name,
      nickname: s.nickname,
      nik: s.nik,
      gender: s.gender,
      birthPlace: s.birthPlace,
      birthDate: s.birthDate,
      religion: s.religion,
      address: s.address,
      fatherName: s.fatherName,
      motherName: s.motherName,
      guardianPhone: s.guardianPhone,
      classId: s.classId || '',
      className: s.className || '-',
      rombelId: s.rombelId || '',
      rombelName: s.rombelName || '-',
      rombelTeacherName: s.rombelTeacherName || '-',
      entryYear: s.entryYear,
      username: s.username,
      status: s.status,
      avatarColor: s.avatarColor || 'bg-emerald-500',
    });
    setIsFormOpen(true);
  };

  const handleOpenDetail = (s: Student) => {
    setSelectedStudent(s);
    setIsDetailOpen(true);
  };

  const handleDelete = (s: Student) => {
    setStudentToDelete(s);
  };

  const confirmDeleteStudent = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.id);
      showToast('Data Dihapus', `Data santri ${studentToDelete.name} berhasil dihapus.`, 'info');
      setStudentToDelete(null);
    }
  };

  const handleOpenQuickAssignRombel = (s: Student) => {
    setQuickAssignStudent(s);
    setQuickSelectedRombelId(s.rombelId && s.rombelId !== '-' ? s.rombelId : (rombels[0]?.id || ''));
  };

  const handleConfirmQuickAssign = () => {
    if (!quickAssignStudent || !quickSelectedRombelId) return;
    assignSingleStudentToRombel(quickAssignStudent.id, quickSelectedRombelId);
    setQuickAssignStudent(null);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const targetClass = classes.find(c => c.id === formData.classId);
    const targetRombel = rombels.find(r => r.id === formData.rombelId);

    const finalData = {
      ...formData,
      classId: formData.classId || '',
      className: targetClass ? targetClass.name : '-',
      rombelId: targetRombel ? targetRombel.id : '',
      rombelName: targetRombel ? (targetRombel.fullName || targetRombel.name) : '-',
      rombelTeacherName: targetRombel ? targetRombel.teacherName : '-',
    };

    if (isEditing && selectedStudent) {
      updateStudent({ ...finalData, id: selectedStudent.id });
      showToast('Berhasil Diperbarui', `Data santri ${finalData.name} berhasil diperbarui.`, 'success');
    } else {
      addStudent(finalData);
      showToast('Santri Ditambahkan', `Santri ${finalData.name} berhasil didaftarkan.`, 'success');
    }
    setIsFormOpen(false);
  };

  // Helper: parse Excel date format (serial or string)
  const parseExcelDate = (val: any): string => {
    if (!val) return '2021-01-01';
    if (typeof val === 'number') {
      const date = new Date((val - 25569) * 86400 * 1000);
      const y = date.getUTCFullYear();
      const m = String(date.getUTCMonth() + 1).padStart(2, '0');
      const d = String(date.getUTCDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
    const str = String(val).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
    if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/.test(str)) {
      const parts = str.split(/[\/\-]/);
      const d = parts[0].padStart(2, '0');
      const m = parts[1].padStart(2, '0');
      const y = parts[2];
      return `${y}-${m}-${d}`;
    }
    return str || '2021-01-01';
  };

  // Helper: Find value from multiple possible header keys
  const getFieldValue = (row: any, aliases: string[]): string => {
    const keys = Object.keys(row);
    for (const alias of aliases) {
      const cleanAlias = alias.toLowerCase().replace(/[^a-z0-9]/g, '');
      const foundKey = keys.find(k => k.toLowerCase().replace(/[^a-z0-9]/g, '').includes(cleanAlias));
      if (foundKey && row[foundKey] !== undefined && row[foundKey] !== null) {
        return String(row[foundKey]).trim();
      }
    }
    return '';
  };

  const AVATAR_COLORS = [
    'bg-emerald-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-amber-500',
    'bg-teal-500',
    'bg-rose-500',
  ];

  // Excel File Handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelFile(file);
    setIsParsing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rawJson = XLSX.utils.sheet_to_json<any>(worksheet, { defval: '' });

      if (rawJson.length === 0) {
        alert('File Excel tidak berisi data baris atau format kosong.');
        setIsParsing(false);
        return;
      }

      const parsed: ParsedStudentRow[] = rawJson.map((row, index) => {
        const name = getFieldValue(row, ['namalengkap', 'nama', 'namamurid', 'namasiswa', 'fullname', 'name']);
        const nickname = getFieldValue(row, ['namapanggilan', 'panggilan', 'nickname']) || (name ? name.split(' ')[0] : '');
        const nis = getFieldValue(row, ['nis', 'nomorinduk', 'noinduk']) || `260${String(students.length + index + 1).padStart(2, '0')}`;
        const nisn = getFieldValue(row, ['nisn', 'nomorinduksiswanasional']);
        const nik = getFieldValue(row, ['nik', 'nikkk', 'nokk']);

        const rawGender = getFieldValue(row, ['jeniskelamin', 'jk', 'gender', 'lp']).toUpperCase();
        const gender: 'L' | 'P' = rawGender.startsWith('P') || rawGender === 'PEREMPUAN' ? 'P' : 'L';

        const birthPlace = getFieldValue(row, ['tempatlahir', 'tempat', 'tmplahir', 'birthplace']) || 'Depok';
        const rawBirthDate = getFieldValue(row, ['tanggallahir', 'tgllahir', 'tgllahir', 'birthdate']);
        const birthDate = parseExcelDate(rawBirthDate);

        const religion = getFieldValue(row, ['agama', 'religion']) || 'Islam';
        const address = getFieldValue(row, ['alamat', 'alamatrumah', 'address', 'domisili']) || 'Jl. Pendidikan No. 1';
        const fatherName = getFieldValue(row, ['namaayah', 'ayah', 'father']);
        const motherName = getFieldValue(row, ['namaibu', 'ibu', 'mother']);
        const guardianPhone = getFieldValue(row, ['nohp', 'nowa', 'telepon', 'kontak', 'hp', 'phone', 'guardianphone']) || '0812-3456-7890';

        // Check if student already exists in system (NIS, NISN, or Name)
        const matched = students.find(existing => {
          if (nis && existing.nis.trim() === nis.trim()) return true;
          if (nisn && existing.nisn.trim() === nisn.trim()) return true;
          if (name && existing.name.trim().toLowerCase() === name.trim().toLowerCase()) return true;
          return false;
        });

        // USER RULE: Saat upload atau tambah baru, kolom kelas defaultnya kosong / '-'
        // Jika murid lama sudah punya kelas, pertahankan kelas lamanya. Jika baru, set ke '-'
        const classId = matched ? (matched.classId || '') : '';
        const className = matched ? (matched.className || '-') : '-';

        const entryYear = getFieldValue(row, ['tahunmasuk', 'angkatan', 'entryyear']) || '2026';
        const rawStatus = getFieldValue(row, ['status', 'statussiswa']);
        let status: 'Aktif' | 'Nonaktif' | 'Lulus' = 'Aktif';
        if (rawStatus.toLowerCase().includes('lulus')) status = 'Lulus';
        else if (rawStatus.toLowerCase().includes('non')) status = 'Nonaktif';

        const username = getFieldValue(row, ['username', 'user']) || (nickname ? `${nickname.toLowerCase().replace(/[^a-z0-9]/g, '')}26` : `murid${index + 1}`);
        const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

        const studentObj: Omit<Student, 'id'> & { id?: string } = {
          name: name || `Santri Baru ${index + 1}`,
          nickname: nickname || name.slice(0, 5),
          nis,
          nisn,
          nik,
          gender,
          birthPlace,
          birthDate,
          religion,
          address,
          fatherName,
          motherName,
          guardianPhone,
          classId,
          className,
          entryYear,
          username,
          status,
          avatarColor,
        };

        let duplicateReason = '';
        if (matched) {
          if (name && matched.name.trim().toLowerCase() === name.trim().toLowerCase()) {
            duplicateReason = `Nama sama (${matched.name})`;
          } else if (nis && matched.nis.trim() === nis.trim()) {
            duplicateReason = `NIS sama (${matched.nis})`;
          } else if (nisn && matched.nisn.trim() === nisn.trim()) {
            duplicateReason = `NISN sama (${matched.nisn})`;
          }
        }

        return {
          raw: row,
          student: {
            ...studentObj,
            id: matched ? matched.id : undefined,
          },
          isDuplicate: !!matched,
          duplicateReason,
          matchedStudent: matched,
          selected: true,
        };
      });

      setParsedRows(parsed);
      setIsExcelModalOpen(true);
    } catch (err) {
      console.error('Error parsing Excel:', err);
      showToast('Gagal Membaca Excel', 'Pastikan file berformat .xlsx, .xls, atau .csv yang valid.', 'error');
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Confirm Import
  const handleConfirmImport = () => {
    const selectedRows = parsedRows.filter(r => r.selected);
    if (selectedRows.length === 0) {
      showToast('Perhatian', 'Pilih setidaknya 1 baris data untuk diimpor.', 'warning');
      return;
    }

    let rowsToImport: (Omit<Student, 'id'> & { id?: string })[] = [];

    if (importMode === 'update_and_add') {
      rowsToImport = selectedRows.map(r => ({
        ...r.student,
        id: r.matchedStudent ? r.matchedStudent.id : undefined,
        // Ensure new student gets '-' class
        classId: r.matchedStudent ? r.matchedStudent.classId : '',
        className: r.matchedStudent ? r.matchedStudent.className : '-',
      }));
    } else if (importMode === 'only_new') {
      rowsToImport = selectedRows
        .filter(r => !r.isDuplicate)
        .map(r => ({
          ...r.student,
          classId: '',
          className: '-',
        }));
    } else if (importMode === 'add_all') {
      rowsToImport = selectedRows.map(r => ({
        ...r.student,
        id: undefined,
        classId: '',
        className: '-',
      }));
    }

    if (rowsToImport.length === 0) {
      showToast('Perhatian', 'Tidak ada data yang memenuhi kriteria mode impor yang dipilih.', 'warning');
      return;
    }

    addStudentsBulk(rowsToImport);
    setIsExcelModalOpen(false);
    setExcelFile(null);
    setParsedRows([]);
  };

  // Download Sample Excel Template
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'Nama Lengkap *': 'Muhammad Arfan Syahputra',
        'Nama Panggilan': 'Arfan',
        'NIS *': '26018',
        'NISN': '3210925201',
        'NIK (KK)': '3276011405210008',
        'Jenis Kelamin (L/P) *': 'L',
        'Tempat Lahir': 'Depok',
        'Tanggal Lahir (YYYY-MM-DD)': '2021-06-15',
        'Agama': 'Islam',
        'Alamat Lengkap': 'Jl. Melati Raya Blok C No. 5, Pancoran Mas',
        'Nama Ayah': 'Syahputra Pratama',
        'Nama Ibu': 'Dina Andriani',
        'No HP/WA Wali *': '0812-9988-7766',
        'Kelas (Dikosongkan / -)': '-',
        'Tahun Masuk': '2026',
        'Status (Aktif/Nonaktif)': 'Aktif',
      },
      {
        'Nama Lengkap *': 'Aisyah Humaira Azzahra',
        'Nama Panggilan': 'Humaira',
        'NIS *': '26019',
        'NISN': '3210925202',
        'NIK (KK)': '3276015507210009',
        'Jenis Kelamin (L/P) *': 'P',
        'Tempat Lahir': 'Jakarta',
        'Tanggal Lahir (YYYY-MM-DD)': '2021-07-22',
        'Agama': 'Islam',
        'Alamat Lengkap': 'Perumahan Griya Asri Blok D-12',
        'Nama Ayah': 'Fajar Nugraha, S.T',
        'Nama Ibu': 'Siti Rahmawati',
        'No HP/WA Wali *': '0857-1122-3344',
        'Kelas (Dikosongkan / -)': '-',
        'Tahun Masuk': '2026',
        'Status (Aktif/Nonaktif)': 'Aktif',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    worksheet['!cols'] = [
      { wch: 28 }, // Nama
      { wch: 16 }, // Panggilan
      { wch: 12 }, // NIS
      { wch: 14 }, // NISN
      { wch: 18 }, // NIK
      { wch: 14 }, // JK
      { wch: 16 }, // Tempat Lahir
      { wch: 20 }, // Tanggal Lahir
      { wch: 12 }, // Agama
      { wch: 35 }, // Alamat
      { wch: 22 }, // Ayah
      { wch: 22 }, // Ibu
      { wch: 18 }, // No HP
      { wch: 24 }, // Kelas
      { wch: 14 }, // Tahun Masuk
      { wch: 14 }, // Status
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data_Murid');
    XLSX.writeFile(workbook, 'Template_Upload_Murid_TK.xlsx');
  };

  // Export current students to Excel
  const handleExportStudents = () => {
    const exportData = students.map((s, idx) => ({
      'No': idx + 1,
      'Nama Lengkap': s.name,
      'Nama Panggilan': s.nickname,
      'NIS': s.nis,
      'NISN': s.nisn,
      'NIK': s.nik,
      'Jenis Kelamin': s.gender === 'L' ? 'Laki-laki' : 'Perempuan',
      'Tempat Lahir': s.birthPlace,
      'Tanggal Lahir': s.birthDate,
      'Agama': s.religion,
      'Kelas / Rombel': s.className || '-',
      'Nama Ayah': s.fatherName,
      'Nama Ibu': s.motherName,
      'No HP/WA Wali': s.guardianPhone,
      'Alamat Rumah': s.address,
      'Tahun Masuk': s.entryYear,
      'Username Portal': s.username,
      'Status': s.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Daftar_Santri');
    XLSX.writeFile(workbook, `Data_Santri_Bustanul_Quran_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Filtered rows for Excel preview modal
  const filteredPreviewRows = useMemo(() => {
    return parsedRows.filter(r => {
      const q = excelPreviewSearch.toLowerCase();
      return (
        r.student.name.toLowerCase().includes(q) ||
        r.student.nickname.toLowerCase().includes(q) ||
        r.student.nis.includes(q) ||
        r.student.guardianPhone.includes(q)
      );
    });
  }, [parsedRows, excelPreviewSearch]);

  const excelStats = useMemo(() => {
    const total = parsedRows.length;
    const duplicates = parsedRows.filter(r => r.isDuplicate).length;
    const newItems = total - duplicates;
    const selectedCount = parsedRows.filter(r => r.selected).length;
    return { total, duplicates, newItems, selectedCount };
  }, [parsedRows]);

  return (
    <div className="space-y-6">
      {/* Hidden file input for Excel */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                {currentRole === 'guru'
                  ? `Daftar Murid: ${currentRombel?.fullName || 'Rombel Saya'} (${currentRombel?.className || 'Kelas'})`
                  : 'Master Data Peserta Didik (Santri Murid)'}
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {currentRole === 'guru'
                  ? `Rombel Anda: ${accessibleStudents.length} Santri`
                  : `Total: ${students.length} Santri`}
              </span>
              {currentRole === 'guru' && currentTeacher && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                  Wali: {currentTeacher.name}
                </span>
              )}
              {currentRole === 'admin' && unassignedStudentsCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  {unassignedStudentsCount} Belum Ada Kelas (-)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentRole === 'guru'
                ? `Data murid disaring otomatis khusus rombel ${currentRombel?.name || ''}. Murid di rombel lain dikelola langsung oleh guru wali dari rombel masing-masing.`
                : 'Santri baru / hasil upload Excel berstatus kelas - secara default, dan baru memiliki nama kelas setelah dimasukkan di menu Kelas.'}
            </p>
          </div>
        </div>

        {/* Action Buttons: Add Manual, Upload Excel, Template & Export */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Download Template (Admin only) */}
          {currentRole === 'admin' && (
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs transition-all cursor-pointer"
              title="Download Template Format Excel (.xlsx)"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Format Excel</span>
            </button>
          )}

          {/* Export Data */}
          <button
            onClick={handleExportStudents}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs transition-all cursor-pointer"
            title="Ekspor Data Santri ke Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ekspor (.xlsx)</span>
          </button>

          {/* Upload Excel Button (Admin only) */}
          {currentRole === 'admin' && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isParsing}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
              title="Unggah File Excel untuk Tambah/Update Data Murid"
            >
              {isParsing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span>Upload Excel</span>
            </button>
          )}

          {/* Add Manual Single Student */}
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Murid Baru</span>
          </button>
        </div>
      </div>

      {/* Unassigned Notification Banner if any */}
      {unassignedStudentsCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
              <School className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-amber-900">
                Terdapat {unassignedStudentsCount} santri dengan kolom kelas kosong / &quot;-&quot;
              </p>
              <p className="text-[11px] text-amber-700">
                Santri-santri ini siap ditambahkan ke dalam rombel di menu Pengelolaan Kelas.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('kelas')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-2xs transition-all self-start sm:self-auto cursor-pointer"
          >
            <span>Buka Menu Kelas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari nama, panggilan, NIS, wali..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Class & Rombel Filter */}
          {currentRole === 'guru' ? (
            <div className="flex items-center gap-1.5 px-3 py-2 text-xs bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-semibold">
              <School className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentRombel?.fullName || 'Rombel Saya'} ({currentRombel?.className || 'Kelas'})</span>
            </div>
          ) : (
            <select
              value={filterClass}
              onChange={e => {
                setFilterClass(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-emerald-500 font-medium"
            >
              <option value="all">Semua Kelas & Rombel ({students.length})</option>
              <option value="unassigned">Belum Ada Kelas / Rombel (-) ({unassignedStudentsCount})</option>
              {classes.map(c => {
                const classCount = students.filter(s => s.classId === c.id).length;
                const classRombels = rombels.filter(r => r.classId === c.id);
                return (
                  <optgroup key={c.id} label={`${c.name} (${classCount} Santri)`}>
                    <option value={c.id}>Semua {c.name} ({classCount})</option>
                    {classRombels.map(r => {
                      const rCount = students.filter(s => s.rombelId === r.id).length;
                      return (
                        <option key={r.id} value={`rombel:${r.id}`}>
                          ↳ {r.fullName || `Rombel ${r.name}`} • {r.teacherName} ({rCount})
                        </option>
                      );
                    })}
                  </optgroup>
                );
              })}
            </select>
          )}

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={e => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-emerald-500"
          >
            <option value="all">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
            <option value="Lulus">Lulus</option>
          </select>
        </div>
      </div>

      {/* Table of Students */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/90 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Murid / Nama Panggilan</th>
                <th className="py-3.5 px-4">NIS / NISN</th>
                <th className="py-3.5 px-4">L/P</th>
                <th className="py-3.5 px-4">Kelas & Rombel</th>
                <th className="py-3.5 px-4">Nama Orang Tua & Kontak</th>
                <th className="py-3.5 px-4">Tahun Masuk</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ada peserta didik yang memenuhi filter pencarian.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map(student => {
                  const isUnassigned = !student.classId || student.className === '-' || !student.className;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Foto & Nama */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl ${student.avatarColor || 'bg-emerald-500'} text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0`}
                          >
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 leading-snug">{student.name}</p>
                            <span className="text-[11px] text-slate-400">
                              Panggilan: &quot;{student.nickname}&quot;
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* NIS */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 tabular-nums">
                        <div>{student.nis}</div>
                        <div className="text-[10px] text-slate-400">{student.nisn || '-'}</div>
                      </td>

                      {/* Gender */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          student.gender === 'L' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
                        }`}>
                          {student.gender === 'L' ? 'L' : 'P'}
                        </span>
                      </td>

                      {/* Kelas & Rombel: Menampilkan nama Kelas, Rombel, dan Nama Guru Pengampu */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isUnassigned ? (
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold text-slate-400 bg-slate-100 border border-dashed border-slate-300 font-mono"
                            title="Belum ditambahkan ke kelas. Tambahkan di menu Kelas."
                          >
                            - (Belum Ada)
                          </span>
                        ) : (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 text-xs">
                                {student.className}
                              </span>
                              {student.rombelName && student.rombelName !== '-' && (
                                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                                  {student.rombelName.replace('Rombel ', '')}
                                </span>
                              )}
                            </div>
                            {student.rombelTeacherName && student.rombelTeacherName !== '-' ? (
                              <p className="text-[10px] text-slate-500 flex items-center gap-1">
                                <span className="text-slate-400">Guru:</span>
                                <span className="font-medium text-slate-700 truncate max-w-[170px]" title={student.rombelTeacherName}>
                                  {student.rombelTeacherName}
                                </span>
                              </p>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">Belum ada rombel</span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Wali */}
                      <td className="py-3.5 px-4 text-[11px] text-slate-600 space-y-0.5">
                        <p className="font-medium text-slate-800">{student.fatherName || student.motherName || '-'}</p>
                        <p className="flex items-center gap-1 text-slate-500">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {student.guardianPhone}
                        </p>
                      </td>

                      {/* Tahun Masuk */}
                      <td className="py-3.5 px-4 font-mono text-slate-600 tabular-nums">
                        {student.entryYear}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          student.status === 'Aktif'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${student.status === 'Aktif' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          {student.status}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {currentRole === 'admin' && (
                            <button
                              onClick={() => handleOpenQuickAssignRombel(student)}
                              className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                              title="Tempatkan / Pindah Rombel"
                            >
                              <School className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenDetail(student)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Lihat Detail Murid"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(student)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Murid"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(student)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Murid"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan {paginatedStudents.length} dari {filteredStudents.length} peserta didik</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              Sebelumnya
            </button>
            <span className="px-2 font-medium text-slate-700">Halaman {currentPage} dari {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: PREVIEW & KONFIRMASI UPLOAD EXCEL */}
      {isExcelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Preview Data Import Excel Murid
                  </h3>
                  <p className="text-xs text-slate-500">
                    File: <span className="font-semibold text-slate-800 font-mono">{excelFile?.name}</span> · {excelStats.total} baris data terbaca (Kolom kelas baru diset kosong / &quot;-&quot;)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsExcelModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stats & Import Mode Selector */}
            <div className="p-4 bg-white border-b border-slate-100 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Total Baris Excel</span>
                    <p className="text-lg font-bold text-slate-800">{excelStats.total} Santri</p>
                  </div>
                  <FileSpreadsheet className="w-5 h-5 text-slate-400" />
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-700">Murid Baru (Kelas: -)</span>
                    <p className="text-lg font-bold text-emerald-800">{excelStats.newItems} Data Baru</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-700">Data Sama / Terdaftar</span>
                    <p className="text-lg font-bold text-amber-800">{excelStats.duplicates} Duplikat</p>
                  </div>
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
              </div>

              {/* Mode Options */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <p className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>Pilihan Penanganan Data yang Sama (Nama / NIS / NISN Sama):</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2 ${
                    importMode === 'update_and_add'
                      ? 'bg-teal-50 border-teal-500 text-teal-900 ring-1 ring-teal-400'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}>
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'update_and_add'}
                      onChange={() => setImportMode('update_and_add')}
                      className="mt-0.5 text-teal-600 cursor-pointer"
                    />
                    <div>
                      <span className="font-bold block text-[11px]">Perbarui & Tambah (Rekomendasi)</span>
                      <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
                        Data lama diperbarui, murid baru otomatis ditambahkan dengan status kelas: &quot;-&quot;.
                      </span>
                    </div>
                  </label>

                  <label className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2 ${
                    importMode === 'only_new'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-400'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}>
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'only_new'}
                      onChange={() => setImportMode('only_new')}
                      className="mt-0.5 text-emerald-600 cursor-pointer"
                    />
                    <div>
                      <span className="font-bold block text-[11px]">Hanya Tambah Data Baru</span>
                      <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
                        Abaikan/lewati data yang namanya atau NIS-nya sudah ada di sistem.
                      </span>
                    </div>
                  </label>

                  <label className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2 ${
                    importMode === 'add_all'
                      ? 'bg-blue-50 border-blue-500 text-blue-900 ring-1 ring-blue-400'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}>
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'add_all'}
                      onChange={() => setImportMode('add_all')}
                      className="mt-0.5 text-blue-600 cursor-pointer"
                    />
                    <div>
                      <span className="font-bold block text-[11px]">Tambah Seluruhnya Sebagai Baru</span>
                      <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
                        Seluruh baris Excel dimasukkan dengan status kelas: &quot;-&quot;.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Preview Search & Select All */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-xs">
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={excelPreviewSearch}
                    onChange={e => setExcelPreviewSearch(e.target.value)}
                    placeholder="Cari dalam hasil Excel..."
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-teal-500"
                  />
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => {
                      const allSelected = parsedRows.every(r => r.selected);
                      setParsedRows(prev => prev.map(r => ({ ...r, selected: !allSelected })));
                    }}
                    className="text-teal-700 hover:underline font-semibold text-xs cursor-pointer"
                  >
                    {parsedRows.every(r => r.selected) ? 'Batalkan Pilih Semua' : 'Pilih Semua'}
                  </button>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600">
                    <b>{excelStats.selectedCount}</b> dari {excelStats.total} baris terpilih
                  </span>
                </div>
              </div>
            </div>

            {/* Preview Table */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50/90 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px] sticky top-0 z-10 backdrop-blur-xs">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">Pilih</th>
                    <th className="py-2.5 px-3">Status Deteksi</th>
                    <th className="py-2.5 px-3">Nama Santri & Panggilan</th>
                    <th className="py-2.5 px-3">NIS / NISN</th>
                    <th className="py-2.5 px-3">L/P</th>
                    <th className="py-2.5 px-3">Tgl Lahir</th>
                    <th className="py-2.5 px-3">Status Kelas</th>
                    <th className="py-2.5 px-3">Orang Tua / Wali</th>
                    <th className="py-2.5 px-3">Kontak HP/WA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPreviewRows.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400">
                        Tidak ada baris yang sesuai pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredPreviewRows.map((row, idx) => (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          !row.selected
                            ? 'opacity-40 bg-slate-50/50'
                            : row.isDuplicate
                            ? 'bg-amber-50/20 hover:bg-amber-50/40'
                            : 'hover:bg-slate-50/80'
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={row.selected}
                            onChange={() => {
                              setParsedRows(prev =>
                                prev.map((item, i) =>
                                  i === idx ? { ...item, selected: !item.selected } : item
                                )
                              );
                            }}
                            className="rounded text-teal-600 cursor-pointer"
                          />
                        </td>

                        {/* Status Deteksi */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          {row.isDuplicate ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              <span>Sama ({row.duplicateReason})</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Murid Baru</span>
                            </span>
                          )}
                        </td>

                        {/* Nama */}
                        <td className="py-2.5 px-3">
                          <p className="font-bold text-slate-900 leading-snug">{row.student.name}</p>
                          <span className="text-[10px] text-slate-500">
                            Panggilan: &quot;{row.student.nickname}&quot;
                          </span>
                        </td>

                        {/* NIS */}
                        <td className="py-2.5 px-3 font-mono text-[11px] whitespace-nowrap">
                          <div className="font-semibold text-slate-800">{row.student.nis}</div>
                          <div className="text-[10px] text-slate-400">{row.student.nisn || '-'}</div>
                        </td>

                        {/* Gender */}
                        <td className="py-2.5 px-3 text-center">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            row.student.gender === 'L' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
                          }`}>
                            {row.student.gender}
                          </span>
                        </td>

                        {/* Tanggal Lahir */}
                        <td className="py-2.5 px-3 font-mono text-[11px] whitespace-nowrap text-slate-600">
                          {row.student.birthDate}
                        </td>

                        {/* Status Kelas: Dikasih '-' jika murid baru */}
                        <td className="py-2.5 px-3 whitespace-nowrap font-mono text-center">
                          {row.student.className && row.student.className !== '-' ? (
                            <span className="font-semibold text-slate-800 font-sans text-xs">
                              {row.student.className}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold text-slate-400 bg-slate-100 border border-dashed border-slate-300">
                              -
                            </span>
                          )}
                        </td>

                        {/* Orang Tua */}
                        <td className="py-2.5 px-3 text-[11px] text-slate-700">
                          {row.student.fatherName || row.student.motherName || '-'}
                        </td>

                        {/* HP */}
                        <td className="py-2.5 px-3 font-mono text-[11px] whitespace-nowrap text-slate-600">
                          {row.student.guardianPhone}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-slate-600">
                <span>Mode Aktif: </span>
                <b className="text-slate-900">
                  {importMode === 'update_and_add'
                    ? 'Perbarui Data Sama & Tambah Data Baru'
                    : importMode === 'only_new'
                    ? 'Hanya Tambahkan Data Baru'
                    : 'Tambah Semua Sebagai Murid Baru'}
                </b>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setIsExcelModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                >
                  Batalkan
                </button>

                <button
                  type="button"
                  onClick={handleConfirmImport}
                  disabled={excelStats.selectedCount === 0}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Konfirmasi & Simpan ({excelStats.selectedCount} Murid)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH / EDIT MANUAL SATU MURID */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {isEditing ? 'Ubah Data Peserta Didik' : 'Pendaftaran Peserta Didik Baru'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="font-medium text-slate-700 block mb-1">Nama Lengkap Anak *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Muhammad Arzan Al-Fatih"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">Nama Panggilan *</label>
                  <input
                    type="text"
                    required
                    value={formData.nickname}
                    onChange={e => setFormData({ ...formData, nickname: e.target.value })}
                    placeholder="Arzan"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">NIS (Nomor Induk Siswa) *</label>
                  <input
                    type="text"
                    required
                    value={formData.nis}
                    onChange={e => setFormData({ ...formData, nis: e.target.value })}
                    placeholder="26001"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">NISN Nasional</label>
                  <input
                    type="text"
                    value={formData.nisn}
                    onChange={e => setFormData({ ...formData, nisn: e.target.value })}
                    placeholder="3190824101"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">NIK Anak (KK)</label>
                  <input
                    type="text"
                    value={formData.nik}
                    onChange={e => setFormData({ ...formData, nik: e.target.value })}
                    placeholder="327601xxxx"
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
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={formData.birthPlace}
                    onChange={e => setFormData({ ...formData, birthPlace: e.target.value })}
                    placeholder="Depok"
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

                {/* Kolom Kelas: Opsi Kosong atau '-' */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-medium text-slate-700">Kelas Penempatan</label>
                    <span className="text-[10px] text-slate-400">Pilih Kelas</span>
                  </div>
                  <select
                    value={formData.classId}
                    onChange={e => {
                      const selectedClass = classes.find(c => c.id === e.target.value);
                      const matchingRombels = rombels.filter(r => r.classId === e.target.value);
                      const currentValid = matchingRombels.some(r => r.id === formData.rombelId);
                      const nextRombel = currentValid
                        ? rombels.find(r => r.id === formData.rombelId)
                        : (matchingRombels[0] || null);

                      setFormData({
                        ...formData,
                        classId: e.target.value,
                        className: selectedClass ? selectedClass.name : '-',
                        rombelId: nextRombel ? nextRombel.id : '',
                        rombelName: nextRombel ? (nextRombel.fullName || `Rombel ${nextRombel.name}`) : '-',
                        rombelTeacherName: nextRombel ? nextRombel.teacherName : '-',
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                  >
                    <option value="">- (Belum Ada Kelas / Dikosongkan)</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.code}) - {c.ageGroup}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Bisa dipilih langsung atau otomatis terisi saat memilih Rombel.
                  </p>
                </div>

                {/* Kolom Rombel: Otomatis memuat rombel dan nama guru pengampu */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-medium text-slate-700">Rombongan Belajar (Rombel)</label>
                    <span className="text-[10px] text-emerald-600 font-bold">Bisa pilih langsung</span>
                  </div>
                  <select
                    value={formData.rombelId || ''}
                    onChange={e => {
                      const selRombel = rombels.find(r => r.id === e.target.value);
                      if (selRombel) {
                        setFormData({
                          ...formData,
                          rombelId: selRombel.id,
                          rombelName: selRombel.fullName || `Rombel ${selRombel.name}`,
                          rombelTeacherName: selRombel.teacherName,
                          classId: selRombel.classId,
                          className: selRombel.className,
                        });
                      } else {
                        setFormData({
                          ...formData,
                          rombelId: '',
                          rombelName: '-',
                          rombelTeacherName: '-',
                        });
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                  >
                    <option value="">- (Belum Ada Rombel / Tanpa Rombel)</option>
                    {classes.map(c => {
                      const classRombels = rombels.filter(r => r.classId === c.id);
                      if (classRombels.length === 0) return null;
                      return (
                        <optgroup key={c.id} label={`${c.name} (${c.code})`}>
                          {classRombels.map(r => (
                            <option key={r.id} value={r.id}>
                              {r.fullName || `Rombel ${r.name}`} • Wali: {r.teacherName}
                            </option>
                          ))}
                        </optgroup>
                      );
                    })}
                  </select>
                  {formData.rombelTeacherName && formData.rombelTeacherName !== '-' ? (
                    <p className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                      <span>👩‍🏫 Guru/Wali Rombel:</span>
                      <span className="underline">{formData.rombelTeacherName}</span>
                      <span className="text-slate-400">({formData.className})</span>
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-400 mt-1">
                      Pilih rombel untuk menetapkan santri dan guru pembimbingnya secara otomatis.
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">Tahun Masuk</label>
                  <input
                    type="text"
                    value={formData.entryYear}
                    onChange={e => setFormData({ ...formData, entryYear: e.target.value })}
                    placeholder="2026"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">Status Murid</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as 'Aktif' | 'Nonaktif' | 'Lulus' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                    <option value="Lulus">Lulus</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">Nama Ayah</label>
                  <input
                    type="text"
                    value={formData.fatherName}
                    onChange={e => setFormData({ ...formData, fatherName: e.target.value })}
                    placeholder="Ir. Hendra Pratama"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">Nama Ibu</label>
                  <input
                    type="text"
                    value={formData.motherName}
                    onChange={e => setFormData({ ...formData, motherName: e.target.value })}
                    placeholder="Nadia Azzahra, S.Farm"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">Nomor HP / WA Wali *</label>
                  <input
                    type="text"
                    required
                    value={formData.guardianPhone}
                    onChange={e => setFormData({ ...formData, guardianPhone: e.target.value })}
                    placeholder="0812-8877-6655"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Alamat Tempat Tinggal</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Jl. Kenanga No. 12, Pancoran Mas, Depok"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer shadow-sm"
                >
                  {isEditing ? 'Simpan Perubahan' : 'Daftarkan Murid'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DETAIL MURID */}
      {isDetailOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-2xl ${selectedStudent.avatarColor} text-white font-bold text-xl flex items-center justify-center shadow-md`}
                >
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedStudent.name}</h3>
                  <p className="text-xs text-emerald-600 font-semibold">
                    {!selectedStudent.classId || selectedStudent.className === '-' || !selectedStudent.className
                      ? 'Belum Ada Kelas (-)'
                      : selectedStudent.className}
                  </p>
                  <p className="text-[11px] text-slate-400">Panggilan: &quot;{selectedStudent.nickname}&quot; · {selectedStudent.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">NIS & NISN</span>
                <span className="font-mono text-slate-800">{selectedStudent.nis} / {selectedStudent.nisn || '-'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">NIK Anak</span>
                <span className="font-mono text-slate-800">{selectedStudent.nik || '-'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Kelas</span>
                <span className="font-semibold text-slate-800">
                  {!selectedStudent.classId || selectedStudent.className === '-' || !selectedStudent.className
                    ? '- (Belum Ditempatkan)'
                    : selectedStudent.className}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Rombongan Belajar (Rombel)</span>
                <span className="font-semibold text-teal-800">
                  {!selectedStudent.rombelName || selectedStudent.rombelName === '-'
                    ? '- (Belum Ditempatkan)'
                    : selectedStudent.rombelName}
                </span>
              </div>
              <div className="col-span-2 p-2.5 rounded-xl bg-teal-50 border border-teal-200">
                <span className="text-teal-700 block text-[10px] uppercase font-bold">Guru / Wali Rombel</span>
                <p className="font-bold text-slate-900 text-xs mt-0.5 flex items-center gap-1.5">
                  <span>👩‍🏫</span>
                  <span>{selectedStudent.rombelTeacherName || 'Belum Ditentukan'}</span>
                </p>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Tempat & Tgl Lahir</span>
                <span className="text-slate-800">{selectedStudent.birthPlace}, {selectedStudent.birthDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Agama</span>
                <span className="text-slate-800">{selectedStudent.religion}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Nama Ayah</span>
                <span className="text-slate-800">{selectedStudent.fatherName || '-'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Nama Ibu</span>
                <span className="text-slate-800">{selectedStudent.motherName || '-'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Kontak HP Wali</span>
                <span className="text-slate-800">{selectedStudent.guardianPhone}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Tahun Masuk</span>
                <span className="text-slate-800">{selectedStudent.entryYear}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Status Siswa</span>
                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                  {selectedStudent.status}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Alamat Rumah</span>
                <span className="text-slate-800">{selectedStudent.address || '-'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Username Portal Murid</span>
                <span className="font-mono font-semibold text-emerald-700">{selectedStudent.username}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setIsDetailOpen(false);
                  setActiveTab('profil_anak');
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Lihat Profil Lengkap & APBQ</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsDetailOpen(false);
                    handleOpenEdit(selectedStudent);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs cursor-pointer"
                >
                  Ubah Biodata
                </button>
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: KONFIRMASI HAPUS MURID */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Hapus Data Santri?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
              <p className="font-bold text-slate-800">{studentToDelete.name}</p>
              <p className="text-slate-500">NIS: <span className="font-mono">{studentToDelete.nis}</span></p>
              <p className="text-slate-500">
                Kelas: <span className="font-semibold text-slate-700">{studentToDelete.className}</span>
                {studentToDelete.rombelName && studentToDelete.rombelName !== '-' && (
                  <span> • {studentToDelete.rombelName}</span>
                )}
              </p>
              {studentToDelete.rombelTeacherName && studentToDelete.rombelTeacherName !== '-' && (
                <p className="text-slate-500">
                  Guru: <span className="font-semibold text-slate-700">{studentToDelete.rombelTeacherName}</span>
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteStudent}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Santri</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CEPAT: PENEMPATAN / PINDAH ROMBEL */}
      {quickAssignStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Tempatkan Santri ke Rombel</h3>
                  <p className="text-[11px] text-slate-400">Pilih rombel untuk santri ini</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuickAssignStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Nama Santri:</span>
                <span className="font-bold text-slate-900">{quickAssignStudent.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">NIS:</span>
                <span className="font-mono text-slate-700">{quickAssignStudent.nis}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Rombel Saat Ini:</span>
                <span className="font-semibold text-purple-700">
                  {quickAssignStudent.rombelName && quickAssignStudent.rombelName !== '-'
                    ? `${quickAssignStudent.className} • ${quickAssignStudent.rombelName}`
                    : 'Belum Ada Rombel (-)'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Pilih Rombel Tujuan:
              </label>
              <select
                value={quickSelectedRombelId}
                onChange={e => setQuickSelectedRombelId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-purple-600 font-medium"
              >
                {classes.map(c => {
                  const classRombels = rombels.filter(r => r.classId === c.id);
                  if (classRombels.length === 0) return null;
                  return (
                    <optgroup key={c.id} label={`${c.name} (${c.code}) - ${c.ageGroup}`}>
                      {classRombels.map(r => (
                        <option key={r.id} value={r.id}>
                          {r.fullName || `Rombel ${r.name}`} • Wali: {r.teacherName}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setQuickAssignStudent(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmQuickAssign}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Simpan Penempatan Rombel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
