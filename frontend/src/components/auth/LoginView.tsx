import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Info,
  LayoutGrid,
  HelpCircle,
  Headset,
  Megaphone,
  Users,
  CalendarDays,
  MessagesSquare,
  BarChart3,
  UserRound,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Heart,
  Loader2,
} from 'lucide-react';

const BrandMark: React.FC<{ className?: string }> = ({ className = 'h-12 w-12' }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <path
      d="M32 3c9 0 18 2.5 24 5.5v19c0 17.5-10.5 28.5-24 33.5C18.5 56 8 45 8 27.5v-19C14 5.5 23 3 32 3Z"
      fill="#0B7A4B"
    />
    <path
      d="M32 10c7 0 14 2 19 4.3v16.2c0 14-8.2 23-19 27.5-10.8-4.5-19-13.5-19-27.5V14.3C18 12 25 10 32 10Z"
      fill="#12965F"
    />
    <circle cx="32" cy="26" r="7" fill="#FFFFFF" />
    <path d="M20 45c0-7.5 5.4-12 12-12s12 4.5 12 12v2H20v-2Z" fill="#FFFFFF" />
    <path d="M14 20C7 16 6 8 12 4c6 4 7 10 2 16Z" fill="#5FCB8B" />
    <path d="M50 20c7-4 8-12 2-16-6 4-7 10-2 16Z" fill="#5FCB8B" />
  </svg>
);

const navItems = [
  { label: 'Beranda', icon: Home, href: '#beranda', active: true },
  { label: 'Tentang Kami', icon: Info, href: '#tentang' },
  { label: 'Fitur', icon: LayoutGrid, href: '#fitur' },
  { label: 'Bantuan', icon: HelpCircle, href: '#bantuan' },
];

const featureItems = [
  {
    label: 'Monitoring\nPerkembangan',
    icon: Users,
    card: 'bg-[#E8F8EE] border-[#CDEEDB]',
    iconColor: 'text-[#12965F]',
  },
  {
    label: 'Informasi\nPembelajaran',
    icon: CalendarDays,
    card: 'bg-[#FFF6E5] border-[#FBE6B7]',
    iconColor: 'text-[#F0A32A]',
  },
  {
    label: 'Komunikasi\nSekolah',
    icon: MessagesSquare,
    card: 'bg-[#E9F8FB] border-[#CDEDF3]',
    iconColor: 'text-[#2AA7C4]',
  },
  {
    label: 'Laporan\nLengkap',
    icon: BarChart3,
    card: 'bg-[#F3EDFF] border-[#E2D5FF]',
    iconColor: 'text-[#8B5CF6]',
  },
];

export const LoginView: React.FC = () => {
  const { login, schoolProfile, showToast } = useApp();

  const [username, setUsername] = useState<string>(() => {
    try {
      return localStorage.getItem('tkq_remember_username') || '';
    } catch {
      return '';
    }
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem('tkq_remember_username'));
    } catch {
      return false;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const ok = await login(username.trim(), password);
      if (!ok) {
        setErrorMsg('Username atau password tidak sesuai.');
      } else {
        try {
          if (rememberMe) localStorage.setItem('tkq_remember_username', username.trim());
          else localStorage.removeItem('tkq_remember_username');
        } catch {
          // localStorage tidak tersedia, abaikan
        }
      }
    } catch (error) {
      setErrorMsg(
        error instanceof Error ? error.message : 'Tidak dapat terhubung ke server. Silakan coba lagi.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = () => {
    showToast('Lupa Password', 'Silakan hubungi admin sekolah untuk mengatur ulang kata sandi Anda.', 'info');
  };

  const handleHelp = () => {
    if (schoolProfile?.email) {
      window.location.href = `mailto:${schoolProfile.email}?subject=Bantuan%20Login%20TKQ%20Pro`;
      return;
    }
    showToast('Butuh Bantuan', 'Silakan hubungi admin sekolah untuk mendapatkan bantuan.', 'info');
  };

  const [stage, setStage] = useState({ desktop: false, scale: 1 });

  useEffect(() => {
    const updateStage = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setStage({
        desktop: width >= 1024,
        scale: Math.min(width / 1680, height / 945),
      });
    };
    updateStage();
    window.addEventListener('resize', updateStage);
    return () => window.removeEventListener('resize', updateStage);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#DFF3EA] font-sans lg:h-screen lg:overflow-hidden">
      <img
        src="/assets/login-bg.png"
        alt=""
        className="pointer-events-none fixed inset-0 z-0 h-screen w-screen object-cover object-center"
      />
      <div
        className="relative z-10 flex min-h-screen w-full flex-col lg:absolute lg:left-1/2 lg:top-1/2 lg:h-[945px] lg:w-[1680px] lg:min-h-0 lg:flex-none"
        style={
          stage.desktop
            ? { transform: `translate(-50%, -50%) scale(${stage.scale})` }
            : undefined
        }
      >
        {/* Header / Brand */}
        <header className="flex items-start px-5 pt-5 sm:px-8 lg:absolute lg:left-[100px] lg:top-[26px] lg:px-0 lg:pt-0">
          <a href="#beranda" className="flex items-center gap-3 rounded-2xl focus:outline-none">
            <BrandMark className="h-12 w-12 sm:h-[56px] sm:w-[56px] lg:h-[60px] lg:w-[60px]" />
            <span className="min-w-0">
              <span className="block text-[22px] font-extrabold leading-none tracking-tight text-[#0B5F45] sm:text-[26px] lg:text-[27px]">
                TKQ Pro
              </span>
              <span className="mt-1 block text-[9px] font-semibold tracking-[0.08em] text-[#2F7A5D] sm:text-[10.5px] lg:text-[11px]">
                Belajar • Bermain • Tumbuh Bersama
              </span>
            </span>
          </a>
        </header>

        {/* Navigation */}
        <nav className="hidden items-center gap-1 rounded-full border border-white/70 bg-white/80 px-2 py-1.5 shadow-[0_10px_36px_rgba(16,83,45,0.12)] backdrop-blur-md lg:absolute lg:right-[40px] lg:top-[33px] lg:z-20 lg:flex">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`relative flex items-center gap-2 rounded-full px-3.5 py-2 text-[14px] font-semibold transition-colors ${
                  item.active ? 'text-[#0B7A4B]' : 'text-[#14532D] hover:bg-[#F0FAF3]'
                }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
                <span>{item.label}</span>
                {item.active && (
                  <span className="absolute inset-x-3 -bottom-1 h-[3px] rounded-full bg-[#0B8F5F]" />
                )}
              </a>
            );
          })}
          <button
            type="button"
            onClick={handleHelp}
            className="ml-1 flex items-center gap-2 rounded-full border border-[#E3EEE7] bg-white px-4 py-2 text-[14px] font-semibold text-[#14532D] shadow-sm transition-colors hover:bg-[#F6FBF8]"
          >
            <Headset className="h-[18px] w-[18px] text-[#0B7A4B]" strokeWidth={2.2} />
            Hubungi Kami
          </button>
        </nav>

        <main className="relative z-10 mx-auto flex w-full max-w-[1660px] flex-1 items-start px-5 pb-20 pt-6 sm:px-8 lg:contents">
          <div className="grid w-full items-start gap-10 lg:contents">
            <section id="beranda" className="max-w-[720px] lg:absolute lg:left-[132px] lg:top-[142px] lg:w-[700px] lg:max-w-none">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#BFE8D0] bg-[#DDF6E6]/95 px-4 py-2 text-[13px] font-bold text-[#0F6B45] shadow-sm backdrop-blur-sm sm:text-[14px]">
                <Megaphone className="h-[18px] w-[18px]" />
                Sistem Informasi TKQ Pro
              </span>

              <h1 className="mt-5 font-extrabold tracking-tight text-[#14532D] lg:mt-[10px]">
                <span className="block text-[32px] leading-[1.05] sm:text-[44px] lg:text-[51px] lg:leading-none">
                  Selamat Datang di
                </span>
                <span className="relative mt-1 inline-block bg-gradient-to-r from-[#16A56C] via-[#0B8F5F] to-[#0B6B45] bg-clip-text text-[54px] leading-[0.95] text-transparent sm:text-[72px] lg:text-[104px] lg:leading-[0.9]">
                  TKQ Pro
                  <svg
                    className="absolute -bottom-2 left-0 h-3 w-full"
                    viewBox="0 0 400 14"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 10C110 3 280 3 396 8"
                      fill="none"
                      stroke="#F5C542"
                      strokeWidth="7"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p
                id="tentang"
                className="mt-4 max-w-[560px] text-[15px] leading-relaxed text-[#1F4A35] sm:text-[18px] lg:mt-[12px] lg:w-[560px] lg:text-[19px] lg:leading-[1.55]"
              >
                Platform digital untuk mendukung proses belajar mengajar yang lebih baik, transparan, dan terintegrasi.
              </p>

              <div id="fitur" className="mt-5 grid max-w-[660px] grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:mt-[16px] lg:max-w-none lg:grid-cols-[repeat(4,150px)] lg:gap-[18px]">
                {featureItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className={`rounded-2xl border px-2.5 py-3.5 text-center shadow-[0_10px_26px_rgba(16,83,45,0.07)] backdrop-blur-sm lg:flex lg:h-[118px] lg:flex-col lg:items-center lg:justify-center lg:px-2 lg:py-0 ${item.card}`}
                    >
                      <Icon className={`mx-auto h-7 w-7 lg:h-8 lg:w-8 ${item.iconColor}`} strokeWidth={2.4} />
                      <p className="mt-2.5 whitespace-pre-line text-[12px] font-bold leading-tight text-[#14532D] sm:text-[13px]">
                        {item.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            <div
              id="bantuan"
              className="w-full max-w-[510px] justify-self-center rounded-[26px] border border-white/80 bg-white p-6 shadow-[0_24px_60px_rgba(15,60,40,0.18)] sm:p-8 lg:absolute lg:right-[80px] lg:top-[144px] lg:flex lg:h-[716px] lg:w-[510px] lg:max-w-none lg:flex-col lg:justify-self-auto lg:p-[38px]"
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-3">
                  <BrandMark className="h-16 w-16" />
                  <div className="text-left">
                    <p className="text-[32px] font-extrabold leading-none tracking-tight text-[#0B7A4B]">
                      TKQ Pro
                    </p>
                    <p className="mt-1.5 text-[13px] font-medium text-[#64748B]">Sistem Informasi Sekolah</p>
                  </div>
                </div>
                <h2 className="mt-7 text-[26px] font-extrabold tracking-tight text-[#0F2E22] sm:text-[30px]">
                  Login ke Akun Anda
                </h2>
                <p className="mt-2 text-[13px] text-[#64748B] sm:text-[14px]">
                  Masuk untuk mengakses fitur lengkap sistem
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <div className="relative">
                  <UserRound
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#14532D]"
                    strokeWidth={2}
                  />
                  <input
                    id="login-username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={event => setUsername(event.target.value)}
                    placeholder="Username"
                    required
                    className="h-[58px] w-full rounded-2xl border border-[#E2E8F0] bg-[#F6F8FB] pl-[52px] pr-4 text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition focus:border-[#12A46B] focus:bg-white focus:ring-4 focus:ring-[#12A46B]/10"
                  />
                </div>

                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#14532D]"
                    strokeWidth={2}
                  />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    placeholder="Password"
                    required
                    className="h-[58px] w-full rounded-2xl border border-[#E2E8F0] bg-[#F6F8FB] pl-[52px] pr-12 text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition focus:border-[#12A46B] focus:bg-white focus:ring-4 focus:ring-[#12A46B]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(previous => !previous)}
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#94A3B8] transition-colors hover:bg-[#EEF5F0] hover:text-[#0B7A4B]"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <label className="flex cursor-pointer select-none items-center gap-2.5 text-[13px] font-medium text-[#334155] sm:text-[14px]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={event => setRememberMe(event.target.checked)}
                      className="peer sr-only"
                    />
                    <span className="flex h-5 w-5 items-center justify-center rounded-[6px] border-2 border-[#CBD5E1] bg-white text-transparent transition-colors peer-checked:border-[#0B8F5F] peer-checked:bg-[#0B8F5F] peer-checked:text-white">
                      <svg viewBox="0 0 12 10" className="h-[10px] w-[12px]" fill="none" aria-hidden="true">
                        <path
                          d="M1 5.2 4.2 8.4 11 1.4"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    Ingat Saya
                  </label>
                  <button
                    type="button"
                    onClick={handleForgot}
                    className="text-[13px] font-semibold text-[#0B7A4B] underline underline-offset-4 transition-colors hover:text-[#075E45] sm:text-[14px]"
                  >
                    Lupa Password?
                  </button>
                </div>

                {errorMsg && (
                  <div
                    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] font-medium text-rose-600"
                    role="alert"
                  >
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#13A76D] to-[#0B7A4B] text-[16px] font-semibold text-white shadow-[0_14px_30px_rgba(11,122,75,0.28)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 sm:text-[17px]"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
                  {isLoading ? 'Memproses...' : 'Login'}
                </button>

              </form>

              <button
                type="button"
                onClick={handleHelp}
                className="mx-auto mt-6 flex items-center justify-center gap-2 text-[12.5px] font-semibold text-[#0B7A4B] transition-colors hover:text-[#075E45] hover:underline sm:text-[13.5px] lg:mt-auto"
              >
                <Headset className="h-[18px] w-[18px]" />
                Butuh bantuan? Hubungi Admin Sekolah
              </button>
            </div>
          </div>
        </main>

        {/* Tagline */}
        <div id="tagline" className="pointer-events-none absolute bottom-6 left-5 z-20 hidden max-w-[340px] sm:left-8 lg:bottom-[26px] lg:left-[55px] lg:block lg:max-w-[360px]">
          <p className="text-[15px] font-semibold italic leading-snug text-white drop-shadow-[0_2px_8px_rgba(6,78,59,0.65)] lg:text-[17px]">
            Mendidik dengan Cinta,
            <br />
            Menyiapkan Masa Depan yang Cerah
            <Heart className="ml-1.5 inline h-4 w-4" strokeWidth={2} />
          </p>
          <svg className="mt-1 h-2 w-[230px]" viewBox="0 0 230 8" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M2 5C64 1 164 1 228 5"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.9"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
