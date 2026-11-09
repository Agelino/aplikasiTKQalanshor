import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HeartHandshake,
  CheckCircle2,
  Clock,
  MessageSquare,
  AlertTriangle,
  Sparkles,
  Calendar,
  User,
  Image as ImageIcon,
  Eye,
  Send,
  ShieldCheck,
  X,
  ArrowRight,
  Info,
  Check,
  Edit3,
} from 'lucide-react';
import { TeacherPersonalNote, TeacherNotePriority } from '../../types';

export const StudentTeacherNotesView: React.FC = () => {
  const {
    students,
    currentUser,
    currentStudent,
    switchStudent,
    teacherNotes,
    markTeacherNoteAsRead,
    replyTeacherNoteByParent,
    setActiveTab,
    showToast,
  } = useApp();

  // Active student resolution
  const student = currentStudent || students.find(s => s.id === currentUser?.studentId) || students[0];

  // Notes scoped to this specific student
  const studentNotes = useMemo(() => {
    if (!student) return [];
    return teacherNotes
      .filter(n => n.studentId === student.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [teacherNotes, student]);

  // Reply form states keyed by note id
  const [activeReplyNoteId, setActiveReplyNoteId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [parentName, setParentName] = useState(() => {
    if (student?.motherName) return `Bunda ${student.motherName} (Wali ${student.name.split(' ')[0]})`;
    if (student?.fatherName) return `Ayah ${student.fatherName} (Wali ${student.name.split(' ')[0]})`;
    return 'Orang Tua / Wali Santri';
  });

  // Lightbox modal state
  const [lightboxImage, setLightboxImage] = useState<{ url: string; caption?: string; title: string } | null>(null);

  // Statistics
  const stats = useMemo(() => {
    const total = studentNotes.length;
    const urgent = studentNotes.filter(n => n.priority === 'Mendesak / Perhatian Khusus').length;
    const unread = studentNotes.filter(n => !n.isReadByParent).length;
    const replied = studentNotes.filter(n => !!n.parentReply).length;
    return { total, urgent, unread, replied };
  }, [studentNotes]);

  // Open reply form
  const handleStartReply = (note: TeacherPersonalNote) => {
    setActiveReplyNoteId(note.id);
    setReplyText(note.parentReply?.message || '');
    if (note.parentReply?.parentName) {
      setParentName(note.parentReply.parentName);
    }
  };

  // Submit parent reply
  const handleSubmitReply = (noteId: string) => {
    if (!replyText.trim()) {
      showToast('Pesan Kosong', 'Silakan ketik tanggapan Anda untuk guru kelas.', 'warning');
      return;
    }

    replyTeacherNoteByParent(noteId, replyText.trim(), parentName.trim());
    setActiveReplyNoteId(null);
    setReplyText('');
  };

  const getPriorityStyle = (priority: TeacherNotePriority) => {
    switch (priority) {
      case 'Mendesak / Perhatian Khusus':
        return {
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500 animate-pulse',
          border: 'border-l-4 border-l-rose-500',
          banner: 'bg-rose-50/70 border-rose-200 text-rose-900',
        };
      case 'Penting':
        return {
          badge: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          border: 'border-l-4 border-l-amber-500',
          banner: 'bg-amber-50/70 border-amber-200 text-amber-900',
        };
      case 'Biasa':
      default:
        return {
          badge: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          border: 'border-l-4 border-l-emerald-500',
          banner: 'bg-emerald-50/70 border-emerald-200 text-emerald-900',
        };
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-semibold border border-emerald-400/30">
                <HeartHandshake className="w-3.5 h-3.5 text-amber-300" />
                Catatan Khusus dari Guru Kelas
              </span>

              {students.length > 1 && (
                <div className="inline-flex items-center gap-1.5 bg-black/30 px-2.5 py-1 rounded-full border border-white/20 text-xs">
                  <span className="text-emerald-200 text-[11px]">Profil Santri:</span>
                  <select
                    value={student?.id}
                    onChange={e => switchStudent(e.target.value)}
                    className="bg-transparent text-white font-bold outline-none cursor-pointer"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id} className="text-slate-900 font-medium">
                        {s.name} ({s.className || 'Kelas'})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
              Catatan Pribadi & Koordinasi Ananda {student ? student.name : ''}
            </h1>

            <p className="text-xs md:text-sm text-emerald-100/90 max-w-xl leading-relaxed">
              Ruang komunikasi personal dari dewan guru kelas kepada orang tua mengenai perkembangan harian, kondisi kesehatan, atau kendala pribadi yang memerlukan kerjasama di rumah.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-200/90">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Bersifat rahasia & hanya terlihat oleh orang tua ananda yang bersangkutan.</span>
            </div>
          </div>

          {/* Quick Counter */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0 w-full md:w-auto">
            <span className="text-[10px] text-emerald-200 uppercase font-semibold block">
              Catatan Diterima
            </span>
            <span className="text-2xl font-black text-white mt-0.5 block">
              {stats.total} Catatan
            </span>
            {stats.unread > 0 ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] animate-pulse">
                {stats.unread} Perlu Ditinjau
              </span>
            ) : (
              <span className="text-[11px] text-emerald-200 mt-1 block">
                Semua telah dibaca
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Metric Quick Stats for Parent */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Total Catatan Guru</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{stats.total}</p>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Sepanjang semester ini</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Perhatian Khusus</span>
          <p className="text-xl font-bold text-rose-700 mt-1">{stats.urgent}</p>
          <span className="text-[10px] text-rose-600 mt-0.5 block">Urgensi mendesak</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Belum Dibaca</span>
          <p className="text-xl font-bold text-amber-700 mt-1">{stats.unread}</p>
          <span className="text-[10px] text-amber-600 mt-0.5 block">Menunggu konfirmasi</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Telah Dibalas</span>
          <p className="text-xl font-bold text-teal-700 mt-1">{stats.replied}</p>
          <span className="text-[10px] text-teal-600 mt-0.5 block">Konfirmasi terkirim</span>
        </div>
      </div>

      {/* Notes List */}
      {studentNotes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-800">Alhamdulillah, Belum Ada Kendala Khusus</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dewan guru belum mengirimkan catatan kendala pribadi untuk ananda {student?.name}. Aktivitas belajar dan bermain ananda di sekolah berlangsung ceria dan lancar.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('nilai_anak')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Lihat Observasi Harian Ananda</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {studentNotes.map(note => {
            const pStyle = getPriorityStyle(note.priority);
            const isReplying = activeReplyNoteId === note.id;

            return (
              <div
                key={note.id}
                className={`p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all space-y-4 ${pStyle.border}`}
              >
                {/* Header: Teacher Name, Date, Urgency */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {note.teacherName}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Guru / Wali Rombel
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {note.date}
                        </span>
                        <span>·</span>
                        <span className="text-[11px] font-medium text-slate-600">
                          {note.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Priority Badge */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border ${pStyle.badge}`}>
                      <span className={`w-2 h-2 rounded-full ${pStyle.dot}`} />
                      {note.priority}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {note.title}
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed mt-2 whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      {note.content}
                    </p>
                  </div>

                  {/* Recommendations from Teacher */}
                  {note.actionPlan && (
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
                      <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>Arahan Kerjasama untuk Orang Tua di Rumah:</span>
                      </div>
                      <p className="text-xs text-amber-950 leading-relaxed pl-6 whitespace-pre-line font-medium">
                        {note.actionPlan}
                      </p>
                    </div>
                  )}

                  {/* Photo Attachment (Optional) */}
                  {note.photoUrl && (
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div
                        onClick={() => setLightboxImage({ url: note.photoUrl!, caption: note.photoCaption, title: note.title })}
                        className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-200 shrink-0 cursor-pointer group shadow-2xs"
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
                          <span>Lampiran Foto dari Guru Kelas</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 truncate">
                          {note.photoCaption || 'Foto dokumentasi kegiatan ananda di sekolah'}
                        </p>
                        <button
                          onClick={() => setLightboxImage({ url: note.photoUrl!, caption: note.photoCaption, title: note.title })}
                          className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline mt-1.5 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Klik untuk Memperbesar Foto</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status & Confirmation Actions */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-slate-600">Status Catatan:</span>
                      {note.isReadByParent ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Telah Anda Konfirmasi Dibaca {note.readAt ? `(${note.readAt})` : ''}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/90 px-2.5 py-0.5 rounded-full animate-pulse">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Catatan Baru — Belum Anda Konfirmasi
                        </span>
                      )}
                    </div>

                    {/* Quick Button: Mark as Read */}
                    {!note.isReadByParent && (
                      <button
                        onClick={() => markTeacherNoteAsRead(note.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Tandai Sudah Dibaca & Dipahami</span>
                      </button>
                    )}
                  </div>

                  {/* Parent Reply Section */}
                  {note.parentReply ? (
                    <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-teal-900 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                          Tanggapan Anda Telah Terkirim ({note.parentReply.parentName}):
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-teal-700">
                            {note.parentReply.repliedAt}
                          </span>
                          {!isReplying && (
                            <button
                              onClick={() => handleStartReply(note)}
                              className="text-[11px] font-bold text-teal-700 hover:text-teal-800 hover:underline flex items-center gap-0.5"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Ubah Tanggapan</span>
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-teal-950 leading-relaxed pl-5 whitespace-pre-line font-medium">
                        &quot;{note.parentReply.message}&quot;
                      </p>
                    </div>
                  ) : null}

                  {/* Reply Button or Active Form */}
                  {isReplying ? (
                    <div className="p-4 rounded-xl bg-white border border-emerald-300 shadow-xs space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Ketik Tanggapan / Konfirmasi Balasan untuk Guru Kelas:</span>
                        </span>
                        <button
                          onClick={() => setActiveReplyNoteId(null)}
                          className="text-slate-400 hover:text-slate-600 p-0.5"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                            Nama Pengirim (Wali):
                          </label>
                          <input
                            type="text"
                            value={parentName}
                            onChange={e => setParentName(e.target.value)}
                            placeholder="Contoh: Bunda Ratna"
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none text-slate-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                          Pesan Balasan / Informasi Tambahan dari Rumah:
                        </label>
                        <textarea
                          rows={3}
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          placeholder="Tuliskan konfirmasi Anda, misalnya kondisi ananda setelah istirahat di rumah, obat yang telah diberikan, atau kesiapan bekal besok..."
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 text-slate-800 leading-relaxed"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => setActiveReplyNoteId(null)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => handleSubmitReply(note.id)}
                          className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Kirim Balasan ke Guru</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    !note.parentReply && (
                      <div className="pt-1">
                        <button
                          onClick={() => handleStartReply(note)}
                          className="px-4 py-2 rounded-xl bg-white hover:bg-teal-50 border border-teal-300 text-teal-800 font-bold text-xs flex items-center gap-2 shadow-2xs transition-all cursor-pointer hover:border-teal-400"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                          <span>+ Beri Tanggapan / Balas Catatan Guru Ini</span>
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            );
          })}
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
    </div>
  );
};
