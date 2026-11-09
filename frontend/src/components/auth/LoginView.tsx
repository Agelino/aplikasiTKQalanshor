import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import {
  Lock,
  User as UserIcon,
  Shield,
  GraduationCap,
  Sparkles,
  ArrowRight,
  BookOpen,
  CalendarCheck,
  Award,
  ChevronDown,
  School,
  CheckCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, schoolProfile, teachers, rombels } = useApp();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showTeacherList, setShowTeacherList] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const ok = await login(username, password);
      if (!ok) setErrorMsg('Username atau password tidak sesuai. Coba gunakan tombol akun demo di bawah.');
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Tidak dapat terhubung ke server API.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDemoAccount = (acc: 'admin' | 'guru' | 'callista' | 'arzan') => {
    if (acc === 'admin') {
      setUsername('admin');
      setPassword('password');
      setShowTeacherList(false);
    } else if (acc === 'guru') {
      setUsername('guru_alfiyah');
      setPassword('password');
      setShowTeacherList(true);
    } else if (acc === 'callista') {
      setUsername('callista');
      setPassword('password');
      setShowTeacherList(false);
    } else {
      setUsername('murid');
      setPassword('password');
      setShowTeacherList(false);
    }
    setErrorMsg('');
  };

  const handleSelectSpecificTeacher = (guruUsername: string) => {
    setUsername(guruUsername);
    setPassword('password');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-900 text-slate-100">
      {/* Left Panel: App Branding & Overview (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand identity */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/20">
              CB
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">{schoolProfile.name}</h1>
              <p className="text-xs text-emerald-400 font-medium">Sistem Informasi Manajemen & Pembelajaran TK</p>
            </div>
          </div>
        </div>

        {/* Value Proposition & Integrated Pipeline */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Pengelolaan Kurikulum, Pembelajaran, dan Rapor TK dalam Satu Ekosistem
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Menghubungkan data sekolah, Kurikulum Pemerintah (Merdeka) & Khas TKQ, Program Semester,
            RPPM, RPPH otomatis, observasi harian, hingga Rapor Perkembangan secara rapi dan transparan.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
                <BookOpen className="w-4 h-4" />
                Curriculum Builder
              </div>
              <p className="text-[11px] text-slate-400">Padukan Kurikulum Kemendikbud & Khas TKQ menjadi Kurikulum Aktif.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold mb-1">
                <CalendarCheck className="w-4 h-4" />
                RPPM → RPPH Otomatis
              </div>
              <p className="text-[11px] text-slate-400">Guru tidak perlu mengetik RPPH dari nol; satu klik langsung terisi.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold mb-1">
                <Award className="w-4 h-4" />
                Penilaian 4 Skala (BB/MB/BSH/BSB)
              </div>
              <p className="text-[11px] text-slate-400">Observasi terintegrasi per kegiatan yang langsung merekapitulasi rapor.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
                <Sparkles className="w-4 h-4" />
                Portal Murid & Wali
              </div>
              <p className="text-[11px] text-slate-400">Pantau perkembangan 6 aspek anak & riwayat presensi secara berkala.</p>
            </div>
          </div>
        </div>

        {/* Footer meta */}
        <div className="relative z-10 text-xs text-slate-500 flex items-center justify-between border-t border-slate-800/80 pt-4">
          <span>{schoolProfile.accreditation} · NPSN {schoolProfile.npsn}</span>
          <span>Tahun Ajaran 2026/2027</span>
        </div>
      </div>

      {/* Right Panel: Login Form & Demo Selector */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-16 bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Header */}
          <div className="text-center lg:text-left space-y-2">
            <div className="inline-flex lg:hidden items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-bold text-lg mb-2 shadow-md">
              CB
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Masuk ke Akun Anda</h2>
            <p className="text-xs text-slate-400">
              Silakan masukkan kredensial atau pilih akun demo di bawah untuk mencoba sistem.
            </p>
          </div>

          {/* Quick Demo Account Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Pilih Akun Demo Cepat
              </label>
              <button
                type="button"
                onClick={() => setShowTeacherList(prev => !prev)}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
              >
                <span>Pilih Guru / Rombel (12 Rombel)</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showTeacherList ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleSelectDemoAccount('admin')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  username === 'admin'
                    ? 'border-indigo-500 bg-indigo-950/60 ring-1 ring-indigo-500'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-indigo-400 mb-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">Admin TU</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">admin</p>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoAccount('guru')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  username.startsWith('guru')
                    ? 'border-emerald-500 bg-emerald-950/60 ring-1 ring-emerald-500'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">Guru Rombel</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono truncate">{username.startsWith('guru') ? username : 'guru'}</p>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoAccount('callista')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  username === 'callista'
                    ? 'border-amber-500 bg-amber-950/60 ring-1 ring-amber-500'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">Callista</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">callista</p>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoAccount('arzan')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  username === 'murid'
                    ? 'border-amber-500 bg-amber-950/60 ring-1 ring-amber-500'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">Arzan</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">murid</p>
              </button>
            </div>

            {/* Expandable 12 Teachers & Rombels selector */}
            {showTeacherList && (
              <div className="p-3 bg-slate-900/90 border border-emerald-900/60 rounded-xl space-y-2 mt-2 max-h-56 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <School className="w-3 h-3" />
                    Pilih Akun Guru per Rombel:
                  </span>
                  <span className="text-[10px] text-slate-400">Data murid otomatis terisolasi</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                  {teachers.map(t => {
                    const r = rombels.find(rom => rom.teacherId === t.id);
                    const isSelected = username === t.username;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleSelectSpecificTeacher(t.username)}
                        className={`p-2 text-left rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-emerald-950/80 border-emerald-500 ring-1 ring-emerald-500'
                            : 'bg-slate-950/50 border-slate-800/80 hover:border-emerald-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-200 truncate">{t.name}</p>
                          {isSelected && <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-emerald-400 font-medium">
                          {r ? `${r.fullName} (${r.className})` : t.position}
                        </p>
                        <p className="text-[9px] text-slate-500 font-mono">user: {t.username}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs leading-snug">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 block">
                Username / Email
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="admin / guru / murid"
                  required
                  className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300 block">
                  Password
                </label>
                <span className="text-[11px] text-emerald-400">
                  Password demo: <code className="font-mono">password</code>
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl py-2.5 pl-9 pr-10 text-xs text-white placeholder-slate-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-900 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Ingat saya di perangkat ini</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <span>Memproses...</span>
              ) : (
                <>
                  <span>Masuk ke Aplikasi</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick tips */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Catatan Akses Demo:</p>
            <p>• <strong>Admin:</strong> Akses penuh Master Data, Curriculum Builder, Laporan, & Pengaturan.</p>
            <p>• <strong>Guru:</strong> Akses Program Semester, RPPM, RPPH Generator, Absensi, & Input Penilaian.</p>
            <p>• <strong>Murid:</strong> Portal peserta didik (M. Arzan Al-Fatih) melihat presensi, penilaian, & rapor.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
