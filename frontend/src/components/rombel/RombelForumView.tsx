import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  RombelChatMessage,
  RombelMeeting,
  MeetingParticipant,
  Role,
} from '../../types';
import {
  MessageSquare,
  Video,
  Send,
  Pin,
  Heart,
  Smile,
  Image as ImageIcon,
  Paperclip,
  Trash2,
  Users,
  Calendar,
  Clock,
  Radio,
  Mic,
  MicOff,
  VideoOff,
  Share2,
  Hand,
  PhoneOff,
  Plus,
  X,
  Eye,
  CheckCircle2,
  Sparkles,
  School,
  User,
  ShieldCheck,
  Search,
  Maximize2,
  Volume2,
  ExternalLink,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

interface RombelForumViewProps {
  mode?: 'forum' | 'rapat';
}

export const RombelForumView: React.FC<RombelForumViewProps> = ({ mode }) => {
  const {
    currentUser,
    currentRole,
    currentTeacher,
    currentRombel,
    currentStudent,
    rombels,
    students,
    rombelChats,
    sendRombelChat,
    deleteRombelChat,
    togglePinRombelChat,
    toggleLikeRombelChat,
    rombelMeetings,
    createRombelMeeting,
    updateRombelMeetingStatus,
    deleteRombelMeeting,
    joinMeetingParticipant,
    leaveMeetingParticipant,
    showToast,
  } = useApp();

  // Active Rombel resolution
  const [selectedRombelId, setSelectedRombelId] = useState<string>(() => {
    if (currentRole === 'murid' && currentStudent) {
      return currentStudent.rombelId || 'rombel-al-quddus';
    }
    if (currentRole === 'guru' && currentRombel) {
      return currentRombel.id;
    }
    return currentRombel?.id || 'rombel-al-quddus';
  });

  // Sync if currentRombel or currentStudent changes
  useEffect(() => {
    if (currentRole === 'murid' && currentStudent?.rombelId) {
      setSelectedRombelId(currentStudent.rombelId);
    } else if (currentRole === 'guru' && currentRombel?.id) {
      setSelectedRombelId(currentRombel.id);
    }
  }, [currentRole, currentStudent, currentRombel]);

  const activeRombel = useMemo(() => {
    return rombels.find(r => r.id === selectedRombelId) || rombels[0];
  }, [rombels, selectedRombelId]);

  // Tab State: 'chat' | 'meetings'
  const [activeTab, setActiveTabState] = useState<'chat' | 'meetings'>(() => mode === 'rapat' ? 'meetings' : 'chat');

  useEffect(() => {
    if (mode === 'rapat') {
      setActiveTabState('meetings');
    } else if (mode === 'forum') {
      setActiveTabState('chat');
    }
  }, [mode]);

  // Chat filter & search
  const [chatSearch, setChatSearch] = useState('');
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Active meeting room state (when participating in live meeting)
  const [activeMeeting, setActiveMeeting] = useState<RombelMeeting | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [meetingChatText, setMeetingChatText] = useState('');
  const [meetingChatMessages, setMeetingChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'Ibu Alfiyah Nurazizah', text: "Selamat bergabung Ayah & Bunda. Rapat akan kita mulai sebentar lagi.", time: '10:00' },
    { sender: 'Bunda Ratna (Wali Callista)', text: 'Hadir Bu Guru, suara dan video terdengar sangat jelas.', time: '10:02' },
  ]);
  const [showInMeetingChat, setShowInMeetingChat] = useState(false);

  // Local camera stream reference
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const [localMediaStream, setLocalMediaStream] = useState<MediaStream | null>(null);

  // New Meeting Modal
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingAgenda, setMeetingAgenda] = useState('');
  const [meetingDate, setMeetingDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [meetingTime, setMeetingTime] = useState('10:00 - 11:30 WIB');
  const [meetingStartLiveNow, setMeetingStartLiveNow] = useState(true);

  // Lightbox Image
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Filtered chats for active rombel
  const rombelChatList = useMemo(() => {
    return rombelChats
      .filter(c => c.rombelId === activeRombel?.id)
      .filter(c => {
        if (showPinnedOnly && !c.isPinned) return false;
        if (chatSearch.trim()) {
          const q = chatSearch.toLowerCase();
          return c.content.toLowerCase().includes(q) || c.senderName.toLowerCase().includes(q);
        }
        return true;
      });
  }, [rombelChats, activeRombel, showPinnedOnly, chatSearch]);

  // Filtered meetings for active rombel
  const rombelMeetingList = useMemo(() => {
    return rombelMeetings.filter(m => m.rombelId === activeRombel?.id);
  }, [rombelMeetings, activeRombel]);

  // Live meeting in this rombel
  const liveMeeting = useMemo(() => {
    return rombelMeetingList.find(m => m.status === 'live');
  }, [rombelMeetingList]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [rombelChatList.length, activeTab]);

  // Webcam management when entering/leaving active meeting
  useEffect(() => {
    if (activeMeeting && isVideoOn) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then(stream => {
          setLocalMediaStream(stream);
          if (userVideoRef.current) {
            userVideoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          // Fallback if camera is unavailable or denied
          setLocalMediaStream(null);
        });
    } else {
      if (localMediaStream) {
        localMediaStream.getTracks().forEach(track => track.stop());
        setLocalMediaStream(null);
      }
    }

    return () => {
      if (localMediaStream) {
        localMediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [activeMeeting, isVideoOn]);

  // Handle Photo Attachment for Forum Chat
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      showToast('Ukuran Terlalu Besar', 'Maksimal ukuran foto adalah 4MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      if (typeof event.target?.result === 'string') {
        setAttachmentUrl(event.target.result);
        setAttachmentName(file.name);
        showToast('Foto Terlampir', 'Foto siap dikirim bersama pesan.', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  // Preset sample image options for quick test
  const handleSelectSampleImage = () => {
    setAttachmentUrl('https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80');
    setAttachmentName('kegiatan-sentra-santri.jpg');
    showToast('Foto Terlampir', 'Contoh foto kegiatan terpasang.', 'info');
  };

  // Determine current sender info
  const currentSenderInfo = useMemo(() => {
    if (currentRole === 'guru') {
      const name = currentTeacher?.name || currentUser?.name || 'Ibu Guru';
      return {
        id: currentTeacher?.id || currentUser?.id || 'guru-1',
        name,
        badge: 'Wali Rombel (Guru)',
        avatarColor: 'emerald',
      };
    }
    if (currentRole === 'murid') {
      const studentName = currentStudent?.name || 'Callista';
      const guardianName = currentStudent?.motherName
        ? `Bunda ${currentStudent.motherName} (Wali ${studentName.split(' ')[0]})`
        : `Wali Murid ${studentName}`;
      return {
        id: currentStudent?.id || currentUser?.studentId || 'murid-1',
        name: guardianName,
        badge: `Wali Murid ${studentName.split(' ')[0]}`,
        avatarColor: 'purple',
      };
    }
    return {
      id: currentUser?.id || 'admin-1',
      name: currentUser?.name || 'Tata Usaha',
      badge: 'Tata Usaha / Admin',
      avatarColor: 'amber',
    };
  }, [currentRole, currentTeacher, currentStudent, currentUser]);

  // Send Chat Message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim() && !attachmentUrl) return;

    sendRombelChat({
      rombelId: activeRombel.id,
      rombelName: activeRombel.name,
      senderId: currentSenderInfo.id,
      senderName: currentSenderInfo.name,
      senderRole: currentRole,
      senderRoleBadge: currentSenderInfo.badge,
      senderAvatarColor: currentSenderInfo.avatarColor,
      content: messageText.trim() || 'Mengirim lampiran foto kegiatan.',
      date: new Date().toISOString().split('T')[0],
      attachmentUrl: attachmentUrl || undefined,
      attachmentType: attachmentUrl ? 'image' : undefined,
      attachmentName: attachmentName || undefined,
    });

    setMessageText('');
    setAttachmentUrl('');
    setAttachmentName('');
  };

  // Create Meeting Submit
  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTitle.trim()) {
      showToast('Judul Rapat Kosong', 'Harap isi judul rapat online.', 'error');
      return;
    }

    const hostId = currentTeacher?.id || currentUser?.id || 'guru-alfiyah';
    const hostName = currentTeacher?.name || currentUser?.name || 'Ibu Alfiyah Nurazizah';

    createRombelMeeting({
      rombelId: activeRombel.id,
      rombelName: activeRombel.name,
      title: meetingTitle.trim(),
      agenda: meetingAgenda.trim() || 'Koordinasi kegiatan belajar dan evaluasi perkembangan santri.',
      hostTeacherId: hostId,
      hostTeacherName: hostName,
      date: meetingDate,
      time: meetingTime,
      status: meetingStartLiveNow ? 'live' : 'scheduled',
      isLiveStreaming: meetingStartLiveNow,
    });

    setIsNewMeetingModalOpen(false);
    setMeetingTitle('');
    setMeetingAgenda('');
    setActiveTabState('meetings');
  };

  // Join Meeting Action
  const handleJoinMeeting = (meeting: RombelMeeting) => {
    setActiveMeeting(meeting);
    joinMeetingParticipant(meeting.id, {
      id: currentSenderInfo.id,
      name: currentSenderInfo.name,
      role: currentRole,
      roleBadge: currentSenderInfo.badge,
      avatarColor: currentSenderInfo.avatarColor,
      isHost: meeting.hostTeacherId === currentSenderInfo.id,
      hasAudio: isMicOn,
      hasVideo: isVideoOn,
      isHandRaised: false,
    });
    showToast('Bergabung ke Rapat', `Anda telah masuk ke sesi rapat ${meeting.title}`, 'success');
  };

  // Leave Meeting Action
  const handleLeaveMeeting = () => {
    if (activeMeeting) {
      leaveMeetingParticipant(activeMeeting.id, currentSenderInfo.id);
      setActiveMeeting(null);
      if (localMediaStream) {
        localMediaStream.getTracks().forEach(t => t.stop());
        setLocalMediaStream(null);
      }
      showToast('Meninggalkan Rapat', 'Anda telah keluar dari ruang rapat online.', 'info');
    }
  };

  // Send In-Meeting Chat
  const handleSendMeetingChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingChatText.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setMeetingChatMessages(prev => [
      ...prev,
      { sender: currentSenderInfo.name, text: meetingChatText.trim(), time },
    ]);
    setMeetingChatText('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Banner & Rombel Switcher */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-semibold border border-emerald-400/30">
                <Users className="w-3.5 h-3.5 text-amber-300" />
                {mode === 'rapat' ? 'Rapat Online & Streaming Rombel' : mode === 'forum' ? 'Forum Diskusi Rombel' : 'Forum Komunikasi & Rapat Online Rombel'}
              </span>

              {/* Rombel Switcher / Badge */}
              {currentRole !== 'murid' ? (
                <div className="inline-flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full border border-white/20 text-xs">
                  <span className="text-emerald-300 font-semibold">Pilih Rombel:</span>
                  <select
                    value={activeRombel?.id}
                    onChange={e => setSelectedRombelId(e.target.value)}
                    className="bg-transparent text-white font-bold outline-none cursor-pointer"
                  >
                    {rombels.map(r => (
                      <option key={r.id} value={r.id} className="text-slate-900 font-medium">
                        {r.fullName || r.name} ({r.className || 'Kelas'})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold border border-white/20">
                  <School className="w-3.5 h-3.5 text-emerald-300" />
                  {activeRombel?.fullName || activeRombel?.name} ({activeRombel?.className})
                </span>
              )}

              {liveMeeting && (
                <button
                  onClick={() => handleJoinMeeting(liveMeeting)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-black shadow-md animate-pulse cursor-pointer hover:bg-rose-600"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>RAPAT LIVE BERLANGSUNG</span>
                </button>
              )}
            </div>

            <h1 className="text-xl md:text-2xl font-black tracking-tight">
              {mode === 'rapat' ? `Rapat Online & Streaming ${activeRombel?.fullName || activeRombel?.name}` : `Forum Diskusi ${activeRombel?.fullName || activeRombel?.name}`}
            </h1>

            <p className="text-xs md:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
              {mode === 'rapat'
                ? `Layanan streaming dan ruang tatap muka virtual untuk ${activeRombel?.fullName || activeRombel?.name}. Jadwal rapat diselenggarakan oleh Admin/Sekolah, Guru dan Wali Murid dapat langsung bergabung.`
                : `Ruang diskusi dan komunikasi terintegrasi antara Guru Wali Kelas (${activeRombel?.teacherName || 'Dewan Guru'}) dan seluruh orang tua/wali santri per-rombel.`}
            </p>
          </div>

          {/* Quick Actions - Only Admin can create meetings! */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {currentRole === 'admin' && (mode === 'rapat' || !mode) && (
              <button
                onClick={() => setIsNewMeetingModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                <Video className="w-4 h-4 stroke-[2.5]" />
                <span>+ Buat / Jadwalkan Rapat</span>
              </button>
            )}

            {liveMeeting && (
              <button
                onClick={() => handleJoinMeeting(liveMeeting)}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Gabung Rapat Live</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Feature Tabs: Only shown if mode is not fixed */}
      {!mode && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTabState('chat')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Forum Obrolan & Diskusi</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeTab === 'chat' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-700'
              }`}>
                {rombelChatList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTabState('meetings')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'meetings'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Streaming Rapat Online</span>
              {liveMeeting ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white animate-pulse">
                  LIVE
                </span>
              ) : (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  activeTab === 'meetings' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-700'
                }`}>
                  {rombelMeetingList.length}
                </span>
              )}
            </button>
          </div>

          {/* Info stats */}
          <div className="text-xs text-slate-500 flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium">
              <School className="w-3.5 h-3.5 text-emerald-600" />
              {activeRombel?.fullName} ({activeRombel?.capacity || 15} Santri)
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 font-medium">
              <User className="w-3.5 h-3.5 text-teal-600" />
              Wali: {activeRombel?.teacherName}
            </span>
          </div>
        </div>
      )}

      {/* TAB 1: FORUM OBROLAN & CHAT */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col h-[750px] overflow-hidden">
          {/* Chat Header Toolbar */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                {activeRombel?.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Ruang Percakapan {activeRombel?.fullName}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </h3>
                <p className="text-[11px] text-slate-500">
                  Guru Wali & Seluruh Orang Tua Murid Rombel {activeRombel?.name}
                </p>
              </div>
            </div>

            {/* Search & Pinned Toggle */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={chatSearch}
                  onChange={e => setChatSearch(e.target.value)}
                  placeholder="Cari pesan..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 w-36 sm:w-48 text-slate-800"
                />
                {chatSearch && (
                  <button
                    onClick={() => setChatSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <button
                onClick={() => setShowPinnedOnly(prev => !prev)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  showPinnedOnly
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Pin className="w-3 h-3 text-amber-600" />
                <span>Disematkan</span>
              </button>
            </div>
          </div>

          {/* Pinned Announcement Bar (if any pinned message exists) */}
          {rombelChats.some(c => c.rombelId === activeRombel?.id && c.isPinned) && !showPinnedOnly && (
            <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 flex items-start gap-2.5 text-xs text-amber-950">
              <Pin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="font-bold block text-[11px] uppercase tracking-wider text-amber-800">
                  Pengumuman Disematkan oleh Wali Rombel:
                </span>
                <p className="line-clamp-2 mt-0.5 leading-relaxed text-slate-800">
                  {rombelChats.find(c => c.rombelId === activeRombel?.id && c.isPinned)?.content}
                </p>
              </div>
            </div>
          )}

          {/* Message List Area */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-slate-50/40">
            {rombelChatList.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <div className="max-w-sm space-y-1">
                  <h4 className="text-sm font-bold text-slate-800">Belum Ada Pesan Diskusi</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Mulai percakapan santai, tanyakan persiapan kegiatan belajar, atau bagikan info seputar ananda di rombel ini.
                  </p>
                </div>
              </div>
            ) : (
              rombelChatList.map((chat, idx) => {
                const isOwn = chat.senderId === currentSenderInfo.id;
                const isTeacher = chat.senderRole === 'guru';
                const isLikedByMe = (chat.likedBy || []).includes(currentSenderInfo.id);

                return (
                  <div
                    key={chat.id}
                    className={`flex items-start gap-3 group ${isOwn ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white font-bold text-xs shadow-2xs shrink-0 ${
                      isTeacher
                        ? 'bg-gradient-to-br from-emerald-600 to-teal-700'
                        : isOwn
                        ? 'bg-gradient-to-br from-purple-600 to-indigo-700'
                        : 'bg-gradient-to-br from-blue-600 to-cyan-700'
                    }`}>
                      {chat.senderName.charAt(0)}
                    </div>

                    {/* Chat Bubble Container */}
                    <div className={`max-w-[85%] sm:max-w-[75%] space-y-1 ${isOwn ? 'items-end' : ''}`}>
                      {/* Sender Meta */}
                      <div className={`flex items-center gap-2 text-[11px] ${isOwn ? 'justify-end' : ''}`}>
                        <span className="font-bold text-slate-800">{chat.senderName}</span>
                        <span className={`px-2 py-0.2 rounded-full font-semibold text-[10px] border ${
                          isTeacher
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {chat.senderRoleBadge}
                        </span>
                        <span className="text-slate-400 font-mono text-[10px]">{chat.timestamp}</span>
                        {chat.isPinned && (
                          <span className="text-amber-600 flex items-center gap-0.5 text-[10px] font-bold" title="Pesan Disematkan">
                            <Pin className="w-3 h-3" />
                          </span>
                        )}
                      </div>

                      {/* Bubble Content */}
                      <div className={`p-4 rounded-3xl text-xs leading-relaxed shadow-2xs relative ${
                        isOwn
                          ? 'bg-emerald-700 text-white rounded-tr-none'
                          : isTeacher
                          ? 'bg-white border-2 border-emerald-200 text-slate-800 rounded-tl-none'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                      }`}>
                        <p className="whitespace-pre-line">{chat.content}</p>

                        {/* Image Attachment (if any) */}
                        {chat.attachmentUrl && (
                          <div className="mt-3 rounded-2xl overflow-hidden border border-black/10 bg-black/5">
                            <img
                              src={chat.attachmentUrl}
                              alt={chat.attachmentName || 'Lampiran'}
                              onClick={() => setLightboxImage(chat.attachmentUrl!)}
                              className="max-h-60 w-full object-cover cursor-pointer hover:scale-102 transition-transform"
                            />
                            {chat.attachmentName && (
                              <div className="p-2 bg-black/20 text-white/90 text-[10px] font-mono truncate">
                                📎 {chat.attachmentName}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Chat Footer: Like Reaction & Action buttons */}
                      <div className={`flex items-center gap-2 pt-0.5 text-[11px] ${isOwn ? 'justify-end' : ''}`}>
                        {/* Like Button */}
                        <button
                          onClick={() => toggleLikeRombelChat(chat.id, currentSenderInfo.id)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                            isLikedByMe
                              ? 'bg-rose-50 text-rose-600 border-rose-200 font-bold'
                              : 'bg-white text-slate-500 border-slate-200 hover:border-rose-300 hover:text-rose-600'
                          }`}
                        >
                          <Heart className={`w-3 h-3 ${isLikedByMe ? 'fill-rose-500 text-rose-500' : ''}`} />
                          <span>{chat.likes || 0}</span>
                        </button>

                        {/* Pin Button (Teacher/Admin only) */}
                        {currentRole !== 'murid' && (
                          <button
                            onClick={() => togglePinRombelChat(chat.id)}
                            className="text-slate-400 hover:text-amber-600 px-1 py-0.5 rounded transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                            title={chat.isPinned ? 'Cabut Sematan' : 'Sematkan Pesan'}
                          >
                            <Pin className="w-3 h-3" />
                          </button>
                        )}

                        {/* Delete Button (Own or Teacher/Admin) */}
                        {(isOwn || currentRole !== 'murid') && (
                          <button
                            onClick={() => deleteRombelChat(chat.id)}
                            className="text-slate-400 hover:text-rose-600 px-1 py-0.5 rounded transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                            title="Hapus Pesan"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Reaction Bar */}
          <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="text-[11px] font-bold">Reaksi Cepat:</span>
              {['👍', '❤️', '🌿', '🤲', '👏', '💡', '👶'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setMessageText(prev => prev + emoji)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-sm transition-transform hover:scale-125 cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Sample Image Quick Test button */}
            <button
              onClick={handleSelectSampleImage}
              className="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Contoh Foto Kegiatan</span>
            </button>
          </div>

          {/* Attachment Preview (if selected) */}
          {attachmentUrl && (
            <div className="px-4 py-2 bg-emerald-50 border-t border-emerald-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <img
                  src={attachmentUrl}
                  alt="Lampiran"
                  className="w-10 h-10 object-cover rounded-lg border border-emerald-300 shadow-2xs"
                />
                <div>
                  <span className="font-bold text-emerald-950 block">Foto Siap Dikirim</span>
                  <span className="text-[10px] text-emerald-700 font-mono">{attachmentName || 'foto-lampiran.jpg'}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setAttachmentUrl('');
                  setAttachmentName('');
                }}
                className="text-rose-600 hover:text-rose-800 text-xs font-semibold p-1"
              >
                Batal
              </button>
            </div>
          )}

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
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
              className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
              title="Lampirkan Foto dari Galeri / Kamera"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              placeholder={`Tulis pesan untuk wali murid & guru ${activeRombel?.fullName}...`}
              className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-900 font-medium"
            />

            <button
              type="submit"
              disabled={!messageText.trim() && !attachmentUrl}
              className="px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kirim</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: STREAMING & RAPAT ONLINE ROMBEL */}
      {activeTab === 'meetings' && (
        <div className="space-y-6">
          {/* Active Live Meeting Card Banner (if available) */}
          {liveMeeting && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 text-white shadow-lg border-2 border-rose-400 relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500 text-white font-black text-xs shadow-md animate-pulse">
                      <Radio className="w-4 h-4" />
                      SEDANG LIVE STREAMING RAPAT
                    </span>
                    <span className="text-xs text-rose-200 font-mono font-bold">
                      Kode: {liveMeeting.meetingCode}
                    </span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-black">
                    {liveMeeting.title}
                  </h2>

                  <p className="text-xs text-rose-100/90 max-w-2xl leading-relaxed whitespace-pre-line">
                    {liveMeeting.agenda}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-rose-200">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-rose-300" />
                      Host Rapat: <strong>{liveMeeting.hostTeacherName}</strong>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-rose-300" />
                      {liveMeeting.time}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 font-bold text-white">
                      <Users className="w-3.5 h-3.5 text-emerald-300" />
                      {liveMeeting.participantsCount || liveMeeting.activeParticipants?.length || 1} Peserta Terhubung
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col gap-2">
                  <button
                    onClick={() => handleJoinMeeting(liveMeeting)}
                    className="px-6 py-3 rounded-2xl bg-white hover:bg-rose-50 text-rose-900 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
                  >
                    <Video className="w-5 h-5 text-rose-700" />
                    <span>Masuk Ruang Rapat Sekarang</span>
                  </button>

                  {currentRole !== 'murid' && (
                    <button
                      onClick={() => updateRombelMeetingStatus(liveMeeting.id, 'ended')}
                      className="px-4 py-2 rounded-xl bg-black/40 hover:bg-black/60 text-rose-200 text-xs font-semibold border border-white/20 transition-colors"
                    >
                      Akhiri Sesi Rapat
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* List of Meetings */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Jadwal & Riwayat Rapat Online {activeRombel?.fullName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pertemuan virtual parenting, koordinasi manasik, dan evaluasi hasil belajar santri.
                </p>
              </div>

              {currentRole !== 'murid' && (
                <button
                  onClick={() => setIsNewMeetingModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Jadwalkan Rapat Baru</span>
                </button>
              )}
            </div>

            {rombelMeetingList.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Video className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">Belum Ada Agenda Rapat Online</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Dewan guru dapat menjadwalkan rapat daring atau memulai live streaming kapan saja untuk berdiskusi dengan seluruh wali murid.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rombelMeetingList.map(meeting => {
                  const isLive = meeting.status === 'live';
                  const isEnded = meeting.status === 'ended';

                  return (
                    <div
                      key={meeting.id}
                      className={`p-5 rounded-3xl border transition-all space-y-3.5 relative overflow-hidden ${
                        isLive
                          ? 'bg-rose-50/50 border-rose-300 shadow-sm ring-1 ring-rose-200'
                          : isEnded
                          ? 'bg-slate-50/70 border-slate-200 text-slate-600'
                          : 'bg-white border-slate-200/90 hover:border-emerald-400 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
                          isLive
                            ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                            : isEnded
                            ? 'bg-slate-100 text-slate-600 border-slate-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {isLive ? <Radio className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
                          {isLive ? 'LIVE SEKARANG' : isEnded ? 'Selesai' : 'Terjadwal'}
                        </span>

                        <span className="text-[11px] font-mono text-slate-500">
                          {meeting.date}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {meeting.title}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line line-clamp-3">
                          {meeting.agenda}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="text-[11px] text-slate-500 font-mono">
                          ⏰ {meeting.time} · Host: <strong className="text-slate-700 font-sans">{meeting.hostTeacherName}</strong>
                        </div>

                        <div className="flex items-center gap-2">
                          {isLive ? (
                            <button
                              onClick={() => handleJoinMeeting(meeting)}
                              className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Gabung Rapat</span>
                            </button>
                          ) : !isEnded ? (
                            currentRole !== 'murid' && (
                              <button
                                onClick={() => updateRombelMeetingStatus(meeting.id, 'live')}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                <Radio className="w-3.5 h-3.5" />
                                <span>Mulai Live Sekarang</span>
                              </button>
                            )
                          ) : null}

                          {currentRole !== 'murid' && (
                            <button
                              onClick={() => deleteRombelMeeting(meeting.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Rapat"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ACTIVE VIRTUAL MEETING ROOM (Full WebRTC / Video Canvas Simulation) */}
      {activeMeeting && (
        <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col overflow-hidden animate-in fade-in duration-200">
          {/* Meeting Top Bar */}
          <div className="h-16 px-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
              <div>
                <h3 className="font-bold text-sm text-white truncate max-w-md">
                  {activeMeeting.title}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {activeMeeting.rombelName} · Kode Rapat: <span className="font-mono text-emerald-400">{activeMeeting.meetingCode}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-red-950 border border-red-500/40 text-red-300 font-bold text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                REC 00:24:18
              </span>
              <button
                onClick={() => setShowInMeetingChat(prev => !prev)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  showInMeetingChat ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
                title="Buka Chat Rapat"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
              <button
                onClick={handleLeaveMeeting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </div>
          </div>

          {/* Meeting Center Stage & Video Grid */}
          <div className="flex-1 flex overflow-hidden">
            {/* Video Tiles Grid */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center justify-center bg-slate-950">
              {/* Tile 1: Current User Video / Camera Tile */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 border-2 border-emerald-500/60 shadow-lg aspect-video flex items-center justify-center group">
                {isVideoOn ? (
                  <video
                    ref={userVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center font-bold text-2xl text-white shadow-lg">
                    {currentSenderInfo.name.charAt(0)}
                  </div>
                )}

                {/* Status Badges */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                  <span className="font-bold truncate text-white flex items-center gap-1.5">
                    {currentSenderInfo.name} (Anda)
                    {isHandRaised && <span title="Mengangkat Tangan">✋</span>}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isMicOn ? (
                      <Mic className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <MicOff className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    {isVideoOn ? (
                      <Video className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <VideoOff className="w-3.5 h-3.5 text-rose-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Tile 2: Host Teacher Tile (Ibu Alfiyah) */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg aspect-video flex items-center justify-center group">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-bold text-2xl text-white shadow-lg ring-4 ring-emerald-500/30 animate-pulse">
                  IA
                </div>
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold">
                  Host / Pembicara
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                  <span className="font-bold truncate text-white">
                    Ibu Alfiyah Nurazizah (Wali Kelas)
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-emerald-400" />
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Tile 3: Parent Participant (Bunda Callista) */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg aspect-video flex items-center justify-center group">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center font-bold text-2xl text-white shadow-lg">
                  BR
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                  <span className="font-bold truncate text-white">
                    Bunda Ratna (Wali Callista)
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Tile 4: Parent Participant (Ayah Pratama) */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg aspect-video flex items-center justify-center group">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-cyan-800 flex items-center justify-center font-bold text-2xl text-white shadow-lg">
                  AP
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                  <span className="font-bold truncate text-white flex items-center gap-1">
                    Ayah Pratama (Wali Arzan) <span>✋</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <MicOff className="w-3.5 h-3.5 text-rose-400" />
                  </div>
                </div>
              </div>

              {/* Tile 5: School TU / Observer */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg aspect-video flex items-center justify-center group">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-600 to-orange-800 flex items-center justify-center font-bold text-2xl text-white shadow-lg">
                  UA
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                  <span className="font-bold truncate text-white">
                    Ustadzah Aminah (TU / Pengawas)
                  </span>
                  <div className="flex items-center gap-1.5">
                    <MicOff className="w-3.5 h-3.5 text-rose-400" />
                  </div>
                </div>
              </div>

              {/* Screen Sharing Slide / Presentation Mock */}
              {isScreenSharing && (
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-teal-950 border-2 border-teal-500 shadow-lg aspect-video flex flex-col p-6 text-white justify-between">
                  <div className="flex items-center justify-between border-b border-teal-500/30 pb-2">
                    <span className="text-xs font-bold text-teal-300">
                      🖥️ Layar Presentasi Ibu Alfiyah
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono">
                      Slide 3 / 8
                    </span>
                  </div>
                  <div className="space-y-2 text-center py-4">
                    <h3 className="text-base font-extrabold text-teal-200">
                      Rundown Simulasi Manasik Haji Santri 2026
                    </h3>
                    <p className="text-xs text-slate-300 max-w-sm mx-auto">
                      1. Niat & Ihram di Gerbang · 2. Tawaf 7 Putaran · 3. Sa&apos;i Shafa Marwah · 4. Tahallul Cilik & Minum Air Zam-zam
                    </p>
                  </div>
                  <div className="text-[10px] text-teal-400 font-mono text-center">
                    Materi dibagikan langsung ke grup WhatsApp wali murid
                  </div>
                </div>
              )}
            </div>

            {/* In-Meeting Chat Drawer */}
            {showInMeetingChat && (
              <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 animate-in slide-in-from-right duration-150">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>Obrolan Rapat Langsung</span>
                  </h4>
                  <button
                    onClick={() => setShowInMeetingChat(false)}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
                  {meetingChatMessages.map((m, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-800/80 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <strong className="text-emerald-300">{m.sender}</strong>
                        <span className="text-slate-500 font-mono">{m.time}</span>
                      </div>
                      <p className="text-slate-200 leading-snug">{m.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMeetingChat} className="p-3 border-t border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={meetingChatText}
                    onChange={e => setMeetingChatText(e.target.value)}
                    placeholder="Tulis pesan rapat..."
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-xl outline-none focus:border-emerald-500 text-white"
                  />
                  <button
                    type="submit"
                    className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Meeting Bottom Control Bar */}
          <div className="h-20 px-6 bg-slate-900 border-t border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">
                Peserta: <strong className="text-white">6 Orang</strong>
              </span>
            </div>

            {/* Central Controls */}
            <div className="flex items-center gap-3">
              {/* Mic Toggle */}
              <button
                onClick={() => setIsMicOn(prev => !prev)}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer shadow-md ${
                  isMicOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'
                }`}
                title={isMicOn ? 'Matikan Mikrofon' : 'Nyalakan Mikrofon'}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              {/* Camera Toggle */}
              <button
                onClick={() => setIsVideoOn(prev => !prev)}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer shadow-md ${
                  isVideoOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'
                }`}
                title={isVideoOn ? 'Matikan Kamera' : 'Nyalakan Kamera'}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              {/* Share Screen Toggle */}
              <button
                onClick={() => setIsScreenSharing(prev => !prev)}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer shadow-md ${
                  isScreenSharing ? 'bg-teal-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title="Bagi Layar Presentasi"
              >
                <Share2 className="w-5 h-5" />
              </button>

              {/* Raise Hand Toggle */}
              <button
                onClick={() => {
                  const next = !isHandRaised;
                  setIsHandRaised(next);
                  showToast(next ? 'Tangan Terangkat ✋' : 'Tangan Diturunkan', next ? 'Host rapat melihat Anda ingin berbicara.' : '', 'info');
                }}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer shadow-md ${
                  isHandRaised ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title="Angkat Tangan / Izin Berbicara"
              >
                <Hand className="w-5 h-5" />
              </button>
            </div>

            {/* End / Leave button */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleLeaveMeeting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Keluar Rapat</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW MEETING MODAL */}
      {isNewMeetingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Video className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-sm">Jadwalkan / Mulai Rapat Online Rombel</h3>
              </div>
              <button
                onClick={() => setIsNewMeetingModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMeeting} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Rombel Target
                </label>
                <input
                  type="text"
                  disabled
                  value={`${activeRombel?.fullName} (${activeRombel?.className})`}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Judul Rapat Parenting / Pertemuan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={e => setMeetingTitle(e.target.value)}
                  placeholder="Contoh: Rapat Parenting: Koordinasi Simulasi Manasik Haji Cilik"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Agenda / Poin Pembahasan
                </label>
                <textarea
                  rows={3}
                  value={meetingAgenda}
                  onChange={e => setMeetingAgenda(e.target.value)}
                  placeholder="Tuliskan poin pembahasan, rundown, atau persiapan yang perlu dibawa wali murid..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium text-slate-900 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Tanggal Rapat
                  </label>
                  <input
                    type="date"
                    value={meetingDate}
                    onChange={e => setMeetingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Jam Pertemuan
                  </label>
                  <input
                    type="text"
                    value={meetingTime}
                    onChange={e => setMeetingTime(e.target.value)}
                    placeholder="10:00 - 11:30 WIB"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-medium"
                  />
                </div>
              </div>

              {/* Start Live Now Checkbox */}
              <label className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={meetingStartLiveNow}
                  onChange={e => setMeetingStartLiveNow(e.target.checked)}
                  className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
                />
                <span>Mulai LIVE Streaming Sekarang (Wali murid langsung dapat bergabung)</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewMeetingModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Video className="w-4 h-4" />
                  <span>{meetingStartLiveNow ? 'Mulai Live Sekarang' : 'Simpan Jadwal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl bg-black shadow-2xl">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxImage}
              alt="Foto Diperbesar"
              className="max-h-[80vh] w-auto object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
