import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, Users, GraduationCap, BookOpen, Calendar, FileText, CheckSquare, ArrowRight, HeartHandshake, CalendarDays, Video, MessageSquare } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const {
    students,
    teachers,
    classes,
    activeCurriculum,
    rppmList,
    rpphList,
    assessmentList,
    teacherNotes,
    calendarEvents,
    rombelMeetings,
    currentRole,
    setActiveTab,
  } = useApp();

  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: {
      type: string;
      title: string;
      subtitle: string;
      tab: string;
      icon: React.ReactNode;
    }[] = [];

    // Murid
    students.forEach(s => {
      if (s.name.toLowerCase().includes(q) || s.nis.includes(q) || s.className.toLowerCase().includes(q)) {
        results.push({
          type: 'Murid',
          title: s.name,
          subtitle: `NIS: ${s.nis} · ${s.className}`,
          tab: 'murid',
          icon: <GraduationCap className="w-4 h-4 text-emerald-600" />,
        });
      }
    });

    // Guru
    teachers.forEach(t => {
      if (t.name.toLowerCase().includes(q) || t.position.toLowerCase().includes(q)) {
        results.push({
          type: 'Guru',
          title: t.name,
          subtitle: `${t.position} · NIP: ${t.nip}`,
          tab: 'guru',
          icon: <Users className="w-4 h-4 text-blue-600" />,
        });
      }
    });

    // Kelas
    classes.forEach(c => {
      if (c.name.toLowerCase().includes(q) || c.teacherName.toLowerCase().includes(q)) {
        results.push({
          type: 'Kelas',
          title: c.name,
          subtitle: `Wali Kelas: ${c.teacherName} · Kapasitas: ${c.studentCount}/${c.capacity}`,
          tab: 'kelas',
          icon: <Calendar className="w-4 h-4 text-amber-600" />,
        });
      }
    });

    // Kurikulum Aktif
    activeCurriculum.components.forEach(comp => {
      if (
        comp.element.toLowerCase().includes(q) ||
        comp.learningObjective.toLowerCase().includes(q) ||
        comp.material.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'Kurikulum',
          title: comp.element,
          subtitle: `${comp.aspect} · ${comp.sourceTitle}`,
          tab: 'kurikulum_aktif',
          icon: <BookOpen className="w-4 h-4 text-purple-600" />,
        });
      }
    });

    // RPPM
    rppmList.forEach(r => {
      if (r.theme.toLowerCase().includes(q) || r.subtheme.toLowerCase().includes(q)) {
        results.push({
          type: 'RPPM',
          title: `RPPM Pekan ${r.week}: ${r.subtheme}`,
          subtitle: `Tema: ${r.theme} · ${r.ageGroup}`,
          tab: 'rppm',
          icon: <FileText className="w-4 h-4 text-teal-600" />,
        });
      }
    });

    // RPPH
    rpphList.forEach(r => {
      if (r.subtheme.toLowerCase().includes(q) || r.theme.toLowerCase().includes(q) || r.dayName.toLowerCase().includes(q)) {
        results.push({
          type: 'RPPH',
          title: `RPPH ${r.dayName} (${r.date})`,
          subtitle: `${r.subtheme} · Status: ${r.status}`,
          tab: 'rpph',
          icon: <CheckSquare className="w-4 h-4 text-indigo-600" />,
        });
      }
    });

    // Penilaian
    assessmentList.forEach(a => {
      if (a.studentName.toLowerCase().includes(q) || a.activityName.toLowerCase().includes(q)) {
        results.push({
          type: 'Penilaian',
          title: `${a.studentName} — ${a.score}`,
          subtitle: `${a.aspect} · ${a.activityName}`,
          tab: 'penilaian',
          icon: <CheckSquare className="w-4 h-4 text-pink-600" />,
        });
      }
    });

    // Catatan Pribadi Guru
    teacherNotes.forEach(n => {
      if (
        n.title.toLowerCase().includes(q) ||
        n.studentName.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'Catatan Guru',
          title: `${n.title} (${n.studentName})`,
          subtitle: `${n.priority} · ${n.category} · ${n.date}`,
          tab: currentRole === 'murid' ? 'catatan_guru_anak' : 'catatan_guru',
          icon: <HeartHandshake className="w-4 h-4 text-rose-600" />,
        });
      }
    });

    // Kalender Akademik
    calendarEvents.forEach(c => {
      if (c.title.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q)) || c.date.includes(q)) {
        results.push({
          type: 'Kalender Akademik',
          title: c.title,
          subtitle: `${c.date} · ${c.type}`,
          tab: 'kalender',
          icon: <CalendarDays className="w-4 h-4 text-teal-600" />,
        });
      }
    });

    // Forum & Rapat Online Rombel
    rombelMeetings.forEach(m => {
      if (m.title.toLowerCase().includes(q) || m.rombelName.toLowerCase().includes(q) || m.meetingCode.toLowerCase().includes(q)) {
        results.push({
          type: 'Rapat Online Rombel',
          title: `${m.title} (${m.rombelName})`,
          subtitle: `${m.time} · Status: ${m.status.toUpperCase()}`,
          tab: 'forum_rombel',
          icon: <Video className="w-4 h-4 text-emerald-600" />,
        });
      }
    });

    return results.slice(0, 12);
  }, [query, students, teachers, classes, activeCurriculum, rppmList, rpphList, assessmentList, teacherNotes, calendarEvents, rombelMeetings, currentRole]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Search header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cari guru, murid, kelas, kurikulum, RPPM, RPPH, penilaian..."
            autoFocus
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded bg-slate-100"
            >
              Reset
            </button>
          )}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="py-10 text-center text-slate-400 text-xs">
              Ketik kata kunci untuk mencari data di seluruh modul SIM TK Ceria Bangsa
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-xs">
              Tidak ada hasil yang cocok dengan &quot;{query}&quot;
            </div>
          ) : (
            <div className="space-y-1">
              {searchResults.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveTab(item.tab);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-white border border-slate-200/60 shadow-xs">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-800 truncate">{item.title}</span>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Tekan ESC untuk menutup</span>
          <span>Ditemukan {searchResults.length} hasil</span>
        </div>
      </div>
    </div>
  );
};
