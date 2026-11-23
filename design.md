Design System & UI/UX Specification
TKQ Pro
Dokumen: design.md
Tujuan: Menjadi satu-satunya acuan visual saat melakukan redesign
frontend TKQ Pro.
Prioritas: Konsistensi, keterbacaan, kesederhanaan, dan responsive
behavior --- bukan menambah dekorasi.
1. Masalah pada Tampilan Saat Ini
Berdasarkan screenshot aplikasi saat ini, beberapa masalah yang harus
diperbaiki:
1. Ukuran teks, tombol, dan kontrol pada beberapa halaman terlalu besar
   sehingga header dan konten terasa penuh.
2. Sidebar memakan ruang cukup besar dan beberapa label menu terpotong.
3. Header terlalu padat; breadcrumb, pencarian, pemilih peran,
   notifikasi, dan profil saling berebut ruang.
4. Banyak kartu, badge, warna aksen, border, dan ikon digunakan
   sekaligus.
5. Informasi dalam satu section belum memiliki hierarki visual yang
   jelas.
6. Beberapa halaman memakai pola kartu yang berbeda-beda, sehingga
   aplikasi terasa seperti kumpulan komponen yang tidak seragam.
7. Layout belum beradaptasi dengan baik ketika lebar viewport berubah.
Jangan mengatasi masalah ini dengan sekadar mengecilkan seluruh
elemen. Perbaiki struktur layout, prioritas informasi, ukuran
komponen, dan responsive rules.
2. Arah Visual
Gunakan gaya minimal, calm, professional, dan modern seperti
aplikasi administrasi pendidikan yang matang.
Prinsip utama
- Utamakan ruang kosong yang cukup (whitespace).
- Gunakan warna netral sebagai dasar; hijau hanya sebagai warna
  identitas dan aksi utama.
- Gunakan satu gaya ikon yang konsisten.
- Kurangi badge yang tidak memberi informasi penting.
- Hindari gradient besar, glow, ilustrasi dekoratif, dan shadow tebal.
- Hindari membuat setiap informasi menjadi card tersendiri.
- Jangan menambahkan grafik atau angka dummy untuk mempercantik
  halaman.
- Pertahankan bahasa Indonesia dan istilah domain yang sudah digunakan
  aplikasi.
- Tampilan harus terasa seperti produk software nyata, bukan template
  dashboard AI.
3. Design Tokens
Gunakan token berikut secara konsisten. Jika project sudah memiliki
token CSS/Tailwind yang setara, rapikan dan petakan token yang ada;
jangan membuat sistem warna kedua.
3.1 Warna
  Token                     Nilai                   Penggunaan
  --color-sidebar         #101B2D               Sidebar

  --color-primary         #009B72               Tombol utama, active
state, link penting

  --color-primary-hover   #008563               Hover tombol utama

  --color-primary-soft    #E8F6F1               Background aksen ringan

  --color-page            #F7F9FC               Background halaman

  --color-surface         #FFFFFF               Card, panel, dropdown

  --color-text            #172338               Heading dan teks utama

  --color-muted           #718096               Deskripsi, metadata

  --color-subtle          #94A3B8               Placeholder dan label
sekunder

  --color-border          #E5EAF1               Border dan divider

  --color-danger          #DC5555               Aksi destruktif dan
error

  --color-warning         #C78324               Peringatan
--color-info            #4776C8               Informasi sekunder
Aturan warna: - Hijau adalah satu-satunya warna aksen utama. -
Jangan memberi warna berbeda pada setiap kartu statistik. - Warna status
boleh digunakan secara semantik, tetapi dalam jumlah terbatas. - Jangan
menggunakan teks abu-abu terlalu pucat untuk informasi penting.
3.2 Tipografi
Gunakan font aplikasi yang sudah tersedia. Jangan menambahkan font baru
kecuali memang belum ada font yang layak.

  Elemen             Desktop     Mobile Weight
  Page title        24--26px   20--22px 600
Section title     16--18px       16px 600
Card title        14--15px       14px 500--600
Body                  14px       14px 400
Metadata          12--13px       12px 400
KPI number        26--30px   23--26px 600

Aturan: - Gunakan line-height body sekitar 1.5. - Hindari paragraf
panjang di dalam kartu. - Jangan menggunakan uppercase untuk semua
judul. - Batasi penggunaan bold; bold hanya untuk informasi yang perlu
dipindai cepat. - Judul halaman, judul section, dan label harus memiliki
hierarki yang konsisten.
3.3 Spacing dan bentuk
Gunakan skala spacing berbasis kelipatan 4px.

  Token          Nilai
  space-1        4px
space-2        8px
space-3       12px
space-4       16px
space-5       20px
space-6       24px
space-8       32px
space-10      40px
- Radius tombol: 8--10px.
- Radius input: 8--10px.
- Radius card/panel: 12px.
- Border: 1px solid --color-border.
- Shadow: sangat halus atau tanpa shadow. Jangan memberi shadow pada
  semua elemen.
- Tinggi input standar: 40--42px.
- Tinggi tombol standar: 40--42px.
- Area klik icon button minimal 40x40px.
4. Global Application Layout
4.1 Desktop (min-width: 1024px)
Gunakan struktur:
- Sidebar: lebar tetap sekitar 248px.
- Header utama: tinggi sekitar 64px.
- Main content: mengisi sisa ruang.
- Padding konten: 28--32px.
- Lebar konten mengikuti ruang tersedia; jangan memaksakan elemen
  menjadi terlalu lebar.
- Sidebar dan header boleh sticky, tetapi hanya area konten utama yang
  scroll secara vertikal.
- Hindari scrollbar ganda yang tidak diperlukan.
Sidebar: - Logo dan nama sekolah berada di bagian atas dengan tinggi
sekitar 76px. - Navigasi dikelompokkan berdasarkan kategori. - Tinggi
item menu sekitar 40--42px. - Jarak antar-item sekitar 4px. - Active
state menggunakan background hijau dan teks putih, tanpa glow. - Label
panjang boleh wrap maksimal dua baris atau menggunakan tooltip; jangan
memotong label penting dengan ellipsis jika masih bisa ditata. - Badge
hanya untuk informasi yang benar-benar membantu, misalnya jumlah atau
status singkat. - Footer sidebar berisi status semester dan menu
pengaturan/logout sesuai struktur aplikasi.

Header: - Kiri: tombol sidebar (jika diperlukan) dan breadcrumb/page
title. - Kanan: pencarian, pemilih peran, notifikasi, dan profil. -
Jangan biarkan setiap kontrol melebar ketika ruang terbatas. -
Breadcrumb boleh menyusut, tetapi page title aktif harus tetap
terbaca. - Pemilih peran harus ringkas dan tidak memecah kata menjadi
beberapa baris.
4.2 Tablet (768--1023px)
- Sidebar dapat diciutkan menjadi icon rail sekitar 72--80px atau
  menjadi drawer.
- Main content memiliki padding 20--24px.
- KPI cards menggunakan grid 2 kolom.
- Komponen header yang tidak esensial dapat dipindahkan ke menu.
- Tidak boleh ada horizontal overflow pada halaman.
4.3 Mobile (max-width: 767px)
- Sidebar menjadi drawer yang dibuka melalui tombol menu.
- Header dibuat ringkas: menu, judul halaman pendek,
  notifikasi/profil.
- Breadcrumb panjang disembunyikan atau diringkas.
- Pemilih role tidak boleh memaksa header menjadi sempit; pindahkan ke
  menu/profile panel bila perlu.
- Main content padding 16px.
- KPI cards menggunakan 1 atau 2 kolom sesuai lebar perangkat.
- Form menggunakan satu kolom.
- Tombol utama boleh full-width bila memang menjadi aksi utama
  halaman.
- Tabel menggunakan horizontal scroll di dalam container tabel atau
  diubah menjadi list/card yang tetap mempertahankan seluruh informasi
  penting.
- Modal pada layar kecil menggunakan hampir seluruh lebar viewport
  dengan margin 12--16px.
- Hindari fixed-width yang menyebabkan konten keluar dari layar.
5. Dashboard Page
Dashboard harus memberi ringkasan kondisi sekolah. Jangan menampilkan
semua modul sekaligus.

Urutan konten:
1. Page heading: "Dashboard" dan keterangan singkat tahun
   ajaran/semester.
2. Welcome/identity section yang sederhana, bukan banner gradient
   besar.
3. KPI ringkas: Total Murid, Total Guru, Total Kelas, Program/Kegiatan
   aktif.
4. Grafik yang benar-benar didukung data aplikasi.
5. Agenda terdekat atau informasi penting.
6. Aksi cepat hanya jika benar-benar sering digunakan.
KPI: - Gunakan background putih. - Satu ikon kecil dengan background
hijau muda atau abu-abu. - Angka menjadi elemen paling menonjol. - Label
dan keterangan singkat. - Jangan memberi warna berbeda pada setiap
KPI. - Jangan menampilkan persentase pertumbuhan jika datanya tidak
tersedia.

Grafik: - Maksimal 1--2 grafik penting pada dashboard. - Judul dan
periode harus jelas. - Legend sederhana. - Jangan menampilkan chart
kosong dengan data buatan. - Jika data belum tersedia, tampilkan empty
state yang informatif.

Aksi cepat: - Maksimal 3--4 aksi utama. - Gunakan tombol/link sederhana,
bukan banyak kartu besar. - Jangan menduplikasi navigasi sidebar.
6. Standard Page Pattern
Semua halaman modul harus menggunakan pola yang sama:
Page header
- Breadcrumb kecil (opsional).
- Satu page title yang jelas.
- Deskripsi satu baris bila dibutuhkan.
- Satu primary action di sisi kanan pada desktop.
- Pada mobile, action dapat berada di bawah judul atau menjadi
  full-width.
Summary (opsional)
- Tampilkan hanya jika membantu pengguna memahami data.
- Maksimal 3--4 metrik.
- Jangan membuat summary cards jika informasinya sudah jelas dari
  tabel.
Filter and search
- Search dan filter berada dalam satu toolbar.
- Label filter harus jelas.
- Hindari panel filter besar jika hanya ada satu atau dua filter.
- Pada mobile, filter dapat dibuka melalui tombol "Filter".
Data table/list
- Tabel memiliki header yang jelas, tinggi baris nyaman, dan alignment
  konsisten.
- Hindari border vertikal berlebihan.
- Gunakan divider horizontal yang halus.
- Aksi baris ditempatkan konsisten di sisi kanan.
- Aksi destruktif harus dibedakan dan dapat meminta konfirmasi.
- Empty state menjelaskan mengapa data belum ada dan apa tindakan
  berikutnya.
Forms
- Label selalu terlihat; jangan hanya mengandalkan placeholder.
- Kelompokkan field berdasarkan konteks.
- Gunakan jarak vertikal 16--20px.
- Tampilkan validasi dekat field terkait.
- Tombol simpan dan batal berada pada posisi konsisten.
- Jangan menjejalkan semua field ke dalam satu baris.
7. Contoh Penerapan: Halaman Kelas & Rombel
Halaman "Kelas & Rombel" pada screenshot saat ini terlalu banyak lapisan
kartu dan aksen warna.

Susunan baru:
1. Page header
   - Judul: "Kelas & Rombel"
   - Deskripsi singkat: "Kelola kelas dan rombongan belajar tahun
     ajaran aktif."
   - Tombol utama: "Tambah Kelas"
   - Aksi sekunder: "Tambah Rombel" sebagai tombol outline atau menu
     aksi.
2. Summary ringkas
   - Total kelas
   - Total rombel
   - Murid ditempatkan
   - Murid belum ditempatkan
   Keempat metrik memakai gaya visual yang sama. Hindari nomor urut
   "1.", "2." pada judul metrik dan hindari warna berbeda untuk setiap
   kartu.
3. Filter
   - Search kelas/rombel bila tersedia.
   - Filter kelas dalam segmented control atau select sederhana.
   - Jangan membungkus filter sederhana dalam panel besar yang
     kosong.
4. Daftar kelas
   - Setiap kelas menjadi section/card sederhana.
   - Header menampilkan nama kelas, rentang usia, wali/koordinator,
     dan jumlah murid.
   - Aksi edit/hapus menggunakan icon button dengan tooltip.
   - Daftar rombel ditampilkan di bawah header kelas.
   - Hindari nested card berulang. Gunakan divider dan spacing untuk
     menunjukkan hubungan data.
Pada mobile: - Page header ditumpuk vertikal. - Tombol tambah berada di
bawah judul. - Summary menjadi grid dua kolom atau satu kolom jika
sempit. - Filter menjadi full-width. - Informasi kelas dan rombel
disusun vertikal. - Aksi edit/hapus tetap mudah dijangkau.
8. Component Standards
Buat atau rapikan shared components bila sesuai dengan arsitektur yang
sudah ada:
- AppSidebar
- AppHeader
- PageContainer
- PageHeader
- SectionHeader
- StatCard
- FilterToolbar
- DataTable
- EmptyState
- FormField
- ConfirmDialog
- IconButton
Jangan membuat duplikasi komponen hanya karena tiap halaman memiliki
variasi kecil. Variasi harus menggunakan props/variants yang jelas.
Button variants
- Primary: hijau, untuk satu aksi utama.
- Secondary: putih dengan border netral.
- Ghost: tanpa background untuk aksi ringan.
- Danger: merah hanya untuk aksi destruktif.
Dalam satu section, usahakan hanya ada satu primary button.
Badge
Gunakan badge hanya untuk status atau metadata yang berguna. Hindari
badge dekoratif pada hampir setiap judul dan angka.
Icons
- Gunakan satu library ikon yang sudah dipakai project.
- Ukuran umum 16--20px.
- Hindari mencampur gaya outline, filled, dan emoji.
- Ikon dekoratif tidak boleh lebih menonjol daripada label.
9. Accessibility and Interaction
- Pastikan kontras teks memadai.
- Semua tombol memiliki label yang jelas atau accessible name.
- Focus state terlihat ketika menggunakan keyboard.
- Jangan menggunakan warna sebagai satu-satunya penanda status.
- Hover, active, disabled, loading, success, dan error state harus
  konsisten.
- Target klik/tap minimal sekitar 40px.
- Jangan menghilangkan label aksi penting pada mobile.
10. Technical Constraints --- Wajib Dipatuhi
Ini adalah pekerjaan frontend presentation/UI refactor, bukan
pembangunan ulang aplikasi.
1. Pertahankan React + TypeScript dan struktur project yang ada.
2. Pertahankan Laravel backend, API endpoint, request/response schema,
   dan authentication flow.
3. Jangan mengubah business logic, role/permission, routing, validasi,
   atau aturan akses.
4. Jangan menghapus fitur, menu, field, filter, tabel, atau aksi yang
   sudah ada.
5. Jangan mengganti data nyata dengan mock data.
6. Jangan menampilkan angka, grafik, status, atau agenda palsu.
7. Jangan mengubah perilaku CRUD.
8. Jangan memasang dependency baru sebelum memeriksa apakah kebutuhan
   dapat dipenuhi dengan dependency yang sudah tersedia.
9. Periksa shared layout dan komponen yang digunakan lintas halaman
   sebelum mengedit.
10. Pastikan semua halaman yang diubah tetap berfungsi.
Jika sebuah desain bertentangan dengan kebutuhan fungsional, pertahankan
fungsi dan cari penyajian visual yang lebih baik.
11. Implementation Workflow
Kerjakan secara bertahap dan verifikasi hasil setiap tahap.
Phase 1 --- Audit
- Periksa struktur frontend, routing, layout, stylesheet, dan shared
  components.
- Identifikasi penyebab ukuran elemen terlalu besar.
- Periksa global CSS, base font size, browser zoom assumptions, width
  constraints, dan responsive breakpoints.
- Jangan langsung mengubah semua halaman.
Phase 2 --- Foundation
- Implementasikan design tokens.
- Rapikan typography, spacing, button, input, card, badge, dan table
  styles.
- Pastikan tidak ada style global yang merusak komponen lain.
Phase 3 --- Shared Layout
- Redesign sidebar.
- Redesign topbar.
- Redesign page container dan page header.
- Uji desktop, tablet, dan mobile.
Phase 4 --- Pilot Pages
- Terapkan desain ke Dashboard.
- Terapkan desain ke Kelas & Rombel.
- Pastikan halaman lain tidak rusak akibat perubahan shared styles.
Phase 5 --- Rollout
- Terapkan pola yang sama ke modul lain secara bertahap.
- Jangan mengubah semua halaman sekaligus tanpa pemeriksaan.
Phase 6 --- Verification
Uji setidaknya pada viewport: - Desktop: 1440 × 900 - Laptop: 1366 ×
768 - Tablet: 768 × 1024 - Mobile: 390 × 844 - Mobile kecil: 360 × 800

Periksa: - Tidak ada horizontal overflow. - Tidak ada teks bertumpuk
atau terpotong. - Tombol tidak saling berhimpitan. - Header tidak pecah
menjadi beberapa baris yang tidak disengaja. - Sidebar dapat
dibuka/tutup pada mobile. - Tabel dan form tetap dapat digunakan. -
Semua navigasi dan aksi utama tetap berfungsi.
12. Definition of Done
Redesign dianggap selesai jika:
- [ ] Tampilan lebih tenang, bersih, dan mudah dipindai.
- [ ] Warna brand navy dan emerald tetap dipertahankan.
- [ ] Sidebar dan header konsisten pada semua halaman.
- [ ] Tidak ada teks bertumpuk, terpotong, atau overflow.
- [ ] Tidak ada dekorasi, badge, atau warna yang tidak memiliki
  fungsi.
- [ ] Dashboard hanya menampilkan informasi yang relevan dan bersumber
  dari data aplikasi.
- [ ] Halaman Kelas & Rombel memiliki hierarki informasi yang jelas.
- [ ] Layout berfungsi pada desktop, tablet, dan mobile.
- [ ] Semua fitur, API, role, permission, dan business logic tetap
  berjalan.
- [ ] Tidak ada mock data yang menggantikan data aplikasi.
Instruksi akhir untuk coding agent: Baca dokumen ini terlebih
dahulu, audit implementasi yang ada, lalu lakukan perubahan nyata pada
komponen dan stylesheet frontend. Jangan hanya memberikan rekomendasi
atau membuat screenshot konsep. Setelah implementasi, jalankan aplikasi
dan verifikasi hasilnya pada ukuran layar yang ditentukan.