export type Role = 'admin' | 'guru' | 'murid';

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
  avatar?: string;
  email?: string;
  teacherId?: string;
  studentId?: string;
}

export interface SchoolProfile {
  name: string;
  npsn: string;
  address: string;
  village: string; // Desa/Kelurahan
  district: string; // Kecamatan
  regency: string; // Kabupaten/Kota
  province: string;
  postalCode: string;
  phone: string;
  email: string;
  principal: string;
  principalNip?: string;
  description: string;
  foundedYear: string;
  accreditation: string;
}

export interface Teacher {
  id: string;
  name: string;
  nip: string;
  nik: string;
  gender: 'L' | 'P';
  birthPlace: string;
  birthDate: string;
  address: string;
  phone: string;
  email: string;
  education: string;
  position: string;
  username: string;
  status: 'Aktif' | 'Nonaktif';
  assignedClassId?: string;
  avatarColor: string;
  signatureImage?: string; // foto/file gambar tanda tangan digital guru (base64 Data URL)
}

export interface Student {
  id: string;
  nis: string;
  nisn: string;
  name: string;
  nickname: string;
  nik: string;
  gender: 'L' | 'P';
  birthPlace: string;
  birthDate: string;
  religion: string;
  address: string;
  fatherName: string;
  motherName: string;
  guardianPhone: string;
  classId: string;
  className: string;
  rombelId?: string;
  rombelName?: string;
  rombelTeacherName?: string;
  entryYear: string;
  username: string;
  status: 'Aktif' | 'Nonaktif' | 'Lulus';
  avatarColor: string;
  
  // Data Tambahan Profil Lengkap Anak
  bloodType?: string;
  heightCm?: number;
  weightKg?: number;
  headCircumferenceCm?: number;
  childOrder?: number;
  siblingsCount?: number;
  allergies?: string;
  medicalNotes?: string;
  immunizationStatus?: string;
  fatherNik?: string;
  fatherJob?: string;
  fatherEducation?: string;
  motherNik?: string;
  motherJob?: string;
  motherEducation?: string;
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
  
  // Capaian APBQ 2026 & Karakter Qurani Khas TKQ
  apbqProgress?: {
    tilawatiLevel: string; // e.g. "Jilid 2 (Hal. 14)"
    tahfidzCompleted: string[]; // e.g. ["An-Nas", "Al-Falaq", "Al-Ikhlas", "Al-Lahab"]
    dailyPrayersCompleted: string[]; // e.g. ["Doa Sebelum Belajar", "Doa Kedua Orang Tua", "Doa Kebaikan Dunia Akhirat"]
    hadithCompleted: string[]; // e.g. ["Hadits Kasih Sayang", "Hadits Menuntut Ilmu", "Hadits Kebersihan"]
    adabScore: 'A (Sangat Baik)' | 'B (Baik)' | 'C (Cukup)';
    makharijulScore: 'A (Fasih)' | 'B (Lancar)' | 'C (Perlu Bimbingan)';
    notes: string;
  };
}

export interface Rombel {
  id: string;
  name: string; // e.g. "Al Quddus", "As Salam", "Al Alim"
  fullName: string; // e.g. "Rombel Al Quddus"
  classId: string; // 'kelas-a1', 'kelas-a2', 'kelas-b1', 'kelas-b2'
  className: string; // 'Kelas A1', 'Kelas A2', 'Kelas B1', 'Kelas B2'
  teacherId?: string;
  teacherName: string; // e.g. "Ibu Alfiyah Nurazizah"
  teacherPhoto?: string;
  capacity: number;
  studentCount?: number;
  color?: string; // e.g. 'purple', 'emerald', 'amber', 'sky', 'rose', 'teal'
}

export interface ClassRoom {
  id: string;
  name: string; // e.g. "Kelas A1", "Kelas A2", "Kelas B1", "Kelas B2"
  code: string; // e.g. "A1", "A2", "B1", "B2"
  ageGroup: string; // e.g. "4 - 5 Tahun", "5 - 6 Tahun"
  teacherId?: string;
  teacherName: string;
  academicYear: string;
  capacity: number;
  studentCount: number;
  status: 'Aktif' | 'Arsip';
  rombels?: Rombel[];
}

export interface AcademicYear {
  id: string;
  name: string; // e.g. "2026/2027"
  status: 'Aktif' | 'Arsip';
  semesters: {
    id: string;
    name: 'Semester 1' | 'Semester 2';
    status: 'Aktif' | 'Selesai';
    startDate: string;
    endDate: string;
  }[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  type: 'effective' | 'holiday' | 'school_event' | 'semester_start' | 'semester_end' | 'report_distribution' | 'tk_event';
  description?: string;
  color?: string;
}

export type DevelopmentalAspect = 
  | 'Nilai Agama dan Moral'
  | 'Fisik/Motorik'
  | 'Kognitif'
  | 'Bahasa'
  | 'Sosial Emosional'
  | 'Seni';

export interface GovCurriculumItem {
  id: string;
  curriculumName: string; // e.g. "Kurikulum Merdeka PAUD 2026"
  year: string;
  version: string;
  element: string; // e.g. "Nilai Agama & Budi Pekerti", "Jati Diri", "Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni"
  learningOutcome: string; // Capaian Pembelajaran (CP)
  learningObjective: string; // Tujuan Pembelajaran (TP)
  material: string; // Materi
  indicator: string; // Indikator
  aspect: DevelopmentalAspect;
  ageGroup: string; // "Kelompok A (4-5 th)" / "Kelompok B (5-6 th)"
  status: 'Aktif' | 'Draft';
}

export interface TkCurriculumItem {
  id: string;
  curriculumName: string; // e.g. "Kurikulum Bustanul Qur'an"
  category: 'Tilawah' | 'Tahfidz' | 'Hikmah' | string; // 3 pilar: Tilawah, Tahfidz, Hikmah
  competency: string; // Kompetensi Khas
  objective: string; // Tujuan
  material: string; // Materi
  activity: string; // Kegiatan Unggulan
  indicator: string; // Indikator Ketercapaian
  aspect: DevelopmentalAspect;
  ageGroup: string;
  description: string;
  status: 'Aktif' | 'Draft';
}

export interface ActiveCurriculumComponent {
  id: string;
  sourceType: 'pemerintah' | 'tk_khas';
  sourceTitle: string;
  element: string;
  learningOutcomeOrCompetency: string;
  learningObjective: string;
  material: string;
  indicator: string;
  aspect: DevelopmentalAspect;
  activity?: string;
  ageGroup: string;
  order: number;
}

export interface ActiveCurriculum {
  id: string;
  name: string;
  academicYear: string;
  semester: string;
  status: 'Aktif' | 'Draft' | 'Arsip';
  lastUpdated: string;
  sourcesIncluded: ('Kurikulum Pemerintah' | "Bustanul Qur'an" | 'Kurikulum TK/TKQ')[];
  components: ActiveCurriculumComponent[];
}

export interface MaterialBankItem {
  id: string;
  name: string;
  category: string;
  aspect: DevelopmentalAspect;
  ageGroup: string;
  curriculumSource: string;
  description: string;
  status: 'Aktif' | 'Arsip';
}

export interface ActivityBankItem {
  id: string;
  name: string;
  category: string;
  objective: string;
  aspect: DevelopmentalAspect;
  ageGroup: string;
  toolsAndMaterials: string[];
  durationMinutes: number;
}

export interface ProsemItem {
  id: string;
  academicYear: string;
  semester: string;
  curriculumName: string;
  theme: string;
  subtheme: string;
  week: number;
  learningObjective: string;
  material: string;
  activity: string;
  aspect: DevelopmentalAspect;
  indicator: string;
  ageGroup: string;
}

export interface LearningElement {
  id: string;
  name: string; // e.g. "Nilai Agama dan Budi Pekerti", "Jati Diri", "Dasar-dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni", "Tilawah", "Tahfidz", "Hikmah"
  category: 'Pemerintah (Merdeka)' | "Bustanul Qur'an";
  code: string; // e.g. "NABP", "JD", "L-STEAM", "TLW", "THF", "HKM"
  color: string;
  description?: string;
}

export interface CapaianPembelajaran {
  id: string;
  elementId: string;
  elementName: string;
  code: string; // e.g. "CP-NABP-01"
  title: string;
  description: string;
  ageGroup: 'Semua Usia' | 'Kelompok A (4-5 Tahun)' | 'Kelompok B (5-6 Tahun)' | string;
  status: 'Aktif' | 'Nonaktif';
}

export interface TujuanPembelajaran {
  id: string;
  elementId: string;
  elementName: string;
  cpId: string;
  cpCode: string;
  cpTitle: string;
  code: string; // e.g. "TP-NABP-01.1"
  title: string; // Bunyi Tujuan Pembelajaran konkret
  indicator?: string; // Indikator Ketercapaian
  suggestedActivities?: string[];
  ageGroup: 'Semua Usia' | 'Kelompok A (4-5 Tahun)' | 'Kelompok B (5-6 Tahun)' | string;
  status: 'Aktif' | 'Nonaktif';
}

export interface RPPMPlanMapping {
  id: string;
  elementId: string;
  elementName: string;
  cpId: string;
  cpCode: string;
  cpTitle: string;
  tpId: string;
  tpCode: string;
  tpTitle: string;
  ragamMain: string; // Diketik manual oleh guru pada saat buat rppm
  alatBahan?: string;
  targetDay?: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Semua Hari';
}

export interface RPPMDayPlan {
  dayName: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat';
  activities: string[];
  materials: string[];
  indicators: string[];
  aspects: DevelopmentalAspect[];
}

export interface RPPMDayActivityStep {
  stage: 'Pendahuluan' | 'Memahami' | 'Mengaplikasikan' | 'Merefleksikan' | 'Penutup';
  activityText: string;
  kosaKata?: string; // e.g. "Ransel", "سَبُّورَةٌ / papan tulis", dll.
  inovatif: string; // e.g. "Religius; Joyful Learning", "Literasi; Communication", "Motorik halus; HOTS-C5; Penalaran kritis"
  estimasiWaktu: string; // e.g. "13 menit", "10 menit", "15 menit"
}

export interface RPPMDailySchedule {
  dayName: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat';
  dailyTopic: string; // e.g. "Berhitung: Penjumlahan Menggunakan Media Visual (Tas dan Buku)"
  steps: RPPMDayActivityStep[];
}

export interface RPPMAssessmentItem {
  dayName: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | string;
  indicator: string;
}

export interface RPPMItem {
  id: string;
  academicYear: string;
  semester: string;
  week: number;
  theme: string;
  subtheme: string;
  ageGroup: string;
  learningObjective: string;
  material: string;
  aspect: DevelopmentalAspect;
  activity: string;
  toolsAndMaterials: string;
  indicator: string;
  dailyPlans: Record<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat', RPPMDayPlan>;
  planMappings?: RPPMPlanMapping[]; // Pemetaan Elemen -> CP -> TP -> Ragam Main yang diketik guru

  // Perencanaan Pembelajaran Mendalam (Intrakurikuler) - Standard Template Sesuai Dokumen
  isTemplate?: boolean; // True jika merupakan template master dari Admin/TU
  createdRole?: 'admin' | 'guru';
  lastEditedByRole?: 'admin' | 'guru';
  authorName?: string; // Penyusun, e.g. "Syipaurrohmah dan Yeti Nurhasani"
  schoolLevel?: string; // Jenjang Sekolah, e.g. "PAUD (Pendidikan Anak Usia Dini) - TKQ Al Anshor"
  phaseAndClass?: string; // Fase/Kelas, e.g. "Fondasi / Kelompok A (Usia 4-5 Tahun)"
  topic?: string; // Topik, e.g. "Lingkunganku yang Nyaman"
  subTopic?: string; // Sub Topik, e.g. "Sekolahku"
  dateRange?: string; // Hari/Tanggal, e.g. "Senin - Jumat, 14-18 September 2026"
  ketercapaianPembelajaran?: string[]; // Poin 1 s/d 5
  kompetensiAwal?: string;
  dimensiProfilLulusan?: string[];
  targetPesertaDidik?: string;
  modaPembelajaran?: string;
  pendekatanPembelajaran?: string;
  metodePembelajaran?: string;
  saranaPrasarana?: string;
  sumberBelajar?: string;
  mediaDigital?: string;
  mediaKonkret?: string;
  dailySchedules?: Record<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat', RPPMDailySchedule>;
  assessmentIndicators?: RPPMAssessmentItem[];
  classId?: string;
  className?: string;
  
  // Modul Ajar Kurikulum Merdeka PAUD Fields
  alokasiWaktu?: string; // e.g. "2 x 30 Menit (60 Menit) per hari"
  modelPembelajaran?: string; // e.g. "Experience-Based Learning dengan Pendekatan Sentra"
  petaKonsep?: string[];
  pertanyaanPemantik?: string[];
  targetCapaianPembelajaran?: {
    agamaBudiPekerti: string;
    jatiDiri: string;
    literasiSteam: string;
  };
  
  // Integrasi APBQ 2026 (Al-Qur'an & Karakter Islami TKQ)
  apbqIntegrasi?: {
    suratPendek: string;
    doaHarian: string;
    haditsPilihan: string;
    hurufHijaiyah: string;
    adabKarakter: string;
  };
}

export interface RPPHActivityGroup {
  memahami: string[];
  mengaplikasikan: string[];
  merefleksikan: string[];
}

export interface RPPHItem {
  id: string;
  rppmId?: string;
  date: string;
  dayName: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat';
  classId: string;
  className: string;
  theme: string;
  subtheme: string;
  learningObjective: string;
  material: string;
  toolsAndMaterials: string;
  aspect: DevelopmentalAspect;
  indicator: string;
  
  // Rincian Kegiatan Standar
  opening: string[]; // Pembukaan (Berbaris, ikrar, doa, apersepsi)
  coreActivities: RPPHActivityGroup; // Kegiatan Inti
  closing: string[]; // Penutup (Recalling, pesan moral, doa pulang)
  assessmentPlan: string;
  teacherNotes: string;
  photos: string[];
  status: 'Draft' | 'Siap Digunakan' | 'Selesai';
  executedNotes?: string;
  reflection?: string;
  
  // Penyesuaian Modul Ajar Kurikulum Merdeka & APBQ 2026
  alokasiWaktu?: string; // e.g. "210 Menit"
  pembiasaanPagi?: string[]; // 07.00 - 07.45: 5S di gerbang, Ikrar santri, senam, wudhu/dhuha, talaqqi Al-Qur'an APBQ
  istirahatMakan?: string[]; // 09.30 - 10.00: Cuci tangan 6 langkah, doa makan, adab islami, outdoor
  ragamMain?: {
    sentra: string;
    namaKegiatan: string;
    alatBahan: string;
    tujuan: string;
  }[];
  apbqDetail?: {
    tilawati: string;
    surat: string;
    doa: string;
    hadits: string;
    mufrodat: string;
  };
  asesmenTeknik?: {
    ceklis: string;
    catatanAnekdot: string;
    hasilKarya: string;
  };
}

export type AttendanceStatus = 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';

export interface AttendanceRecord {
  id: string;
  date: string;
  classId: string;
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  note?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: string;
  submittedAt?: string;
}

export interface TeacherAttendanceRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  checkInTime?: string; // e.g. "07:00"
  checkOutTime?: string; // e.g. "13:30"
  note?: string;
  signatureImage?: string; // signature snapshot or link to teacher signature
}

export type AssessmentScore = 'BB' | 'MB' | 'BSH' | 'BSB';

export type PredikatQuran = 'Mumtaz' | 'Jayyid Jiddan' | 'Jayyid' | 'Maqbul';

export interface TkqQuranScore {
  tilawatiJilid: string; // e.g. "Jilid 1"
  tilawatiHalaman: string; // e.g. "Hal. 28"
  tilawatiPredikat: PredikatQuran;
  tilawatiStars?: number; // 1 - 4 bintang (sesuai header TILAWAH di Rapor Al Anshor)
  tilawatiCatatan?: string; // e.g. "Mampu membaca huruf berharakat fathah & kasrah dengan fashohah dan makhraj tepat"
  
  tahfidzStars?: number; // 1 - 4 bintang (sesuai header TAHFIDZ di Rapor Al Anshor)
  tahfidzSurah: {
    surahName: string;
    predikat: PredikatQuran;
    stars?: number;
    tuntas: boolean;
    catatan?: string;
  }[];
  
  hikmahStars?: number; // 1 - 4 bintang (sesuai header HIKMAH di Rapor Al Anshor)
  doaHarian: {
    doaName: string;
    predikat: PredikatQuran;
    stars?: number;
    tuntas: boolean;
    catatan?: string;
  }[];
  
  haditsPilihan: {
    haditsName: string;
    predikat: PredikatQuran;
    stars?: number;
    tuntas: boolean;
    catatan?: string;
  }[];
  
  praktikIbadah: {
    materi: string;
    predikat: PredikatQuran;
    stars?: number;
    keterangan: string;
  }[];
}

export interface KurikulumMerdekaElemen {
  predikat: AssessmentScore; // BB, MB, BSH, BSB
  stars?: number; // 1 - 4 bintang
  narasi: string;
}

export interface MerdekaElementsReport {
  nilaiAgamaBudiPekerti: KurikulumMerdekaElemen;
  jatiDiri: KurikulumMerdekaElemen;
  literasiSteam: KurikulumMerdekaElemen;
}

export interface P5ProjectReport {
  tema: string;
  subtema?: string;
  predikat: AssessmentScore;
  stars?: number; // 1 - 4 bintang
  narasi: string;
}

export interface DdtkPhysicalReport {
  tinggiBadanCm: number;
  beratBadanKg: number;
  lingkarKepalaCm: number;
  statusGizi: string;
  kesehatanGigi: string;
  pendengaran: string;
  penglihatan: string;
}

export interface AssessmentRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  rpphId: string;
  rpphTheme: string;
  activityName: string;
  aspect: DevelopmentalAspect;
  indicator: string;
  score: AssessmentScore;
  observationNotes: string;
  documentationUrl?: string;
}

export interface ChildDevelopmentSummary {
  studentId: string;
  aspect: DevelopmentalAspect;
  currentLevel: AssessmentScore;
  scorePercentage: number;
  assessmentCount: number;
  notes: string;
  strengths: string;
  pointsToStimulate: string;
  recommendations: string;
  history: { date: string; score: AssessmentScore }[];
}

export interface ReportCard {
  id: string;
  academicYear: string;
  semester: string;
  studentId: string;
  studentName: string;
  nis: string;
  nisn?: string;
  className: string;
  ageGroup?: string;
  institutionName?: string;
  
  attendance: {
    hadir: number;
    sakit: number;
    izin: number;
    alpa: number;
  };
  
  // Capaian Al-Qur'an & APBQ khas TKQ Al Anshor (Bustanul Qur'an)
  quranReport?: TkqQuranScore;
  
  // Capaian Kurikulum Merdeka PAUD (3 Elemen Utama)
  merdekaReport?: MerdekaElementsReport;
  
  // Projek Penguatan Profil Pelajar Pancasila (P5)
  p5Report?: P5ProjectReport;
  
  // Deteksi Dini Tumbuh Kembang & Kesehatan (DDTK)
  ddtkReport?: DdtkPhysicalReport;
  
  // Legacy / 6 Aspek PAUD Nasional
  aspectSummaries?: {
    aspect: DevelopmentalAspect;
    score: AssessmentScore;
    description: string;
  }[];
  
  teacherNotes: string;
  recommendation: string;
  issueDate: string;
  place?: string;
  teacherSignatureName: string;
  teacherNip?: string;
  principalSignatureName: string;
  principalNip?: string;
  parentSignatureName?: string;
  overallRatingStars?: number; // 1-4 bintang rating umum
  status: 'Draft' | 'Diterbitkan';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  targetRole: 'Semua' | 'Guru' | 'Murid';
  author: string;
  attachmentName?: string;
  priority?: 'normal' | 'penting';
}

export interface ActivityLog {
  id: string;
  userName: string;
  userRole: Role;
  activity: string;
  module: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkTab?: string;
}

export type TeacherNoteCategory =
  | 'Perilaku & Emosional'
  | 'Kedisiplinan & Kemandirian'
  | 'Kesehatan & Fisik'
  | 'Perkembangan Belajar'
  | 'Sosialisasi & Teman'
  | 'Kebutuhan Khusus / Masalah Pribadi'
  | 'Apresiasi & Prestasi';

export type TeacherNotePriority = 'Biasa' | 'Penting' | 'Mendesak / Perhatian Khusus';

export interface TeacherPersonalNote {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  rombelId?: string;
  rombelName?: string;
  teacherId: string;
  teacherName: string;
  date: string; // YYYY-MM-DD
  title: string;
  category: TeacherNoteCategory;
  priority: TeacherNotePriority;
  content: string; // Catatan detail / kronologi masalah pribadi siswa
  actionPlan?: string; // Saran tindak lanjut guru untuk orang tua / kerjasama di rumah
  photoUrl?: string; // Opsional URL foto atau base64 foto dokumentasi
  photoCaption?: string; // Keterangan opsional foto
  isReadByParent: boolean;
  readAt?: string;
  parentReply?: {
    message: string;
    repliedAt: string;
    parentName?: string;
  };
  isConfidential: boolean; // Selalu personal / rahasia antara guru & orang tua
  createdAt: string;
}

// Forum Diskusi & Rapat Online Rombel
export interface RombelChatMessage {
  id: string;
  rombelId: string;
  rombelName: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  senderRoleBadge: string; // e.g. "Wali Rombel (Guru)", "Wali Murid Callista", "Tata Usaha"
  senderAvatarColor?: string;
  content: string;
  timestamp: string; // formatted time or ISO
  date: string; // YYYY-MM-DD
  attachmentUrl?: string;
  attachmentType?: 'image' | 'file';
  attachmentName?: string;
  isPinned?: boolean;
  likes?: number;
  likedBy?: string[];
}

export type MeetingStatus = 'live' | 'scheduled' | 'ended';

export interface MeetingParticipant {
  id: string;
  name: string;
  role: Role;
  roleBadge: string;
  avatarColor?: string;
  isHost?: boolean;
  hasAudio?: boolean;
  hasVideo?: boolean;
  isHandRaised?: boolean;
}

export interface RombelMeeting {
  id: string;
  rombelId: string;
  rombelName: string;
  title: string;
  agenda: string;
  hostTeacherId: string;
  hostTeacherName: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "09:00 - 10:30 WIB"
  status: MeetingStatus;
  meetingCode: string; // e.g. "QDS-MEET-26"
  isLiveStreaming?: boolean;
  streamUrl?: string;
  notes?: string;
  participantsCount?: number;
  activeParticipants?: MeetingParticipant[];
}
