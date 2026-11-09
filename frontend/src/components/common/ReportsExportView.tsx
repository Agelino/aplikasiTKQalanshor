import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Printer, Download, BookOpen, Award, Users, Calendar, CheckCircle2 } from 'lucide-react';

export const ReportsExportView: React.FC = () => {
  const { setActiveTab } = useApp();

  const reportItems = [
    {
      title: 'Buku Laporan Perkembangan Anak (Rapor)',
      desc: 'Format rapor resmi TK dengan deskripsi 6 aspek perkembangan, capaian tahfidz/hadits, fisik, dan kehadiran.',
      icon: Award,
      badge: 'Resmi',
      actionTab: 'rapor',
    },
    {
      title: 'Dokumen KOSP (Kurikulum Aktif Lembaga)',
      desc: 'Naskah integrasi Kurikulum Merdeka PAUD dan muatan khas keislaman TKQ Ceria Bangsa tahun berjalan.',
      icon: BookOpen,
      badge: 'Kurikulum',
      actionTab: 'kurikulum_aktif',
    },
    {
      title: 'Perangkat Pembelajaran RPPM & RPPH',
      desc: 'Kumpulan silabus ajar mingguan dan harian lengkap dengan tahapan bermain serta instrumen asesmen.',
      icon: FileText,
      badge: 'Perangkat Ajar',
      actionTab: 'rpph',
    },
    {
      title: 'Buku Induk & Rekap Siswa',
      desc: 'Daftar nama seluruh peserta didik aktif, nomor induk (NIS/NISN), data orang tua, dan rombel.',
      icon: Users,
      badge: 'Kesiswaan',
      actionTab: 'murid',
    },
    {
      title: 'Kalender Pendidikan & Jadwal Agenda',
      desc: 'Jadwal hari efektif belajar, libur semester, pembagian rapor, dan kegiatan ekstra kurikuler.',
      icon: Calendar,
      badge: 'Kalender',
      actionTab: 'kalender',
    },
    {
      title: 'Matriks Rekapitulasi Penilaian Kelas',
      desc: 'Lembar evaluasi capaian seluruh siswa per rombongan belajar (BB, MB, BSH, BSB).',
      icon: CheckCircle2,
      badge: 'Evaluasi',
      actionTab: 'rekap_penilaian',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-lg">
            <Printer className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Pusat Cetak & Unduh Dokumen Lembaga</h2>
            <p className="text-xs text-slate-500">
              Cetak instan rapor resmi, silabus kurikulum aktif, dan rekapitulasi data sekolah
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reportItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Format: Cetak Siap Pakai / PDF</span>
                <button
                  onClick={() => setActiveTab(item.actionTab as any)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-2xs transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Buka & Cetak</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
