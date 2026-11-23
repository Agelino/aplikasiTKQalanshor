# DESIGN.md — TKQ Pro
## Emerald Green Professional Design System

> **Design direction:** Modern Emerald Green · Professional · Clean · Friendly Education Portal  
> **Primary reference:** Dashboard Emerald Green Professional yang disetujui.  
> **Design objective:** Mereplikasi tampilan visual referensi secara konsisten di seluruh halaman aplikasi TKQ Pro.

---

# 1. DESIGN PRINCIPLES

Seluruh tampilan aplikasi wajib mengikuti prinsip berikut:

1. **Professional:** Tampilan modern, rapi, dan profesional.
2. **Clean:** Hindari elemen visual yang tidak memiliki fungsi.
3. **Consistent:** Semua halaman menggunakan sistem warna, typography, spacing, dan komponen yang sama.
4. **Readable:** Informasi harus mudah dibaca dan memiliki hierarki visual yang jelas.
5. **Friendly:** Nuansa pendidikan tetap terasa melalui warna hijau, ilustrasi, dan aksen lembut.
6. **Functional:** Desain tidak boleh mengorbankan fungsi aplikasi.

### Visual direction

- Emerald green dark sidebar.
- White content area.
- Soft mint and emerald gradients.
- Rounded cards with subtle shadows.
- Pastel-colored statistic cards.
- Clean typography.
- Minimalist line icons.
- Generous whitespace.
- Consistent alignment.

**PENTING:** Jangan mengubah desain menjadi dashboard generik AI. Hindari terlalu banyak gradient, glassmorphism, dekorasi, ikon warna-warni, dan card yang tidak diperlukan.

---

# 2. COLOR SYSTEM

Gunakan warna berikut sebagai standar utama aplikasi.

## 2.1 Primary colors

| Token | Hex | Penggunaan |
|---|---|---|
| Primary | #059669 | Tombol utama, link aktif |
| Primary Dark | #047857 | Hover dan aksen gelap |
| Emerald Dark | #065F46 | Sidebar |
| Emerald Deep | #064E3B | Sidebar gradient |
| Emerald Light | #D1FAE5 | Background aksen |
| Mint | #A7F3D0 | Highlight lembut |
| Teal | #14B8A6 | Aksen tambahan |

## 2.2 Neutral colors

| Token | Hex | Penggunaan |
|---|---|---|
| Background | #F5F8FC | Background aplikasi |
| Surface | #FFFFFF | Card dan panel |
| Border | #E2E8F0 | Border komponen |
| Heading | #172B45 | Judul utama |
| Text | #334155 | Teks utama |
| Muted | #64748B | Teks sekunder |
| Disabled | #94A3B8 | Elemen nonaktif |

## 2.3 Semantic colors

| Status | Color | Background |
|---|---|---|
| Success | #059669 | #ECFDF5 |
| Warning | #D97706 | #FFFBEB |
| Danger | #E11D48 | #FFF1F2 |
| Information | #0284C7 | #F0F9FF |
| Purple | #9333EA | #FAF5FF |

## 2.4 Color usage rules

- Emerald digunakan sebagai identitas visual utama.
- Putih mendominasi area konten.
- Background menggunakan abu-abu sangat lembut.
- Warna pastel digunakan untuk membedakan kategori statistik.
- Warna merah hanya digunakan untuk error atau status negatif.
- Jangan menggunakan warna berbeda tanpa alasan fungsional.
- Jangan membuat setiap card memiliki warna background yang mencolok.

---

# 3. TYPOGRAPHY

Gunakan font **Inter** sebagai font utama.

Jika Inter belum tersedia, gunakan fallback sans-serif.

```css
font-family: 'Inter', sans-serif;
```

## Typography scale

| Element | Size | Weight |
|---|---:|---:|
| Page title | 24px | 700 |
| Hero heading | 32px | 700 |
| Section heading | 17px | 650 |
| Card heading | 15px | 600 |
| Body | 14px | 400 |
| Secondary text | 12px | 400 |
| Sidebar menu | 14px | 500 |
| Statistic value | 24px | 700 |

### Typography rules

- Gunakan maksimal 3 tingkat ketebalan font dalam satu area.
- Hindari ukuran font yang terlalu kecil.
- Jangan menggunakan bold pada seluruh teks.
- Gunakan warna heading gelap agar kontras dengan background putih.
- Jaga konsistensi ukuran heading di seluruh halaman.

---

# 4. GLOBAL APPLICATION LAYOUT

Desktop layout harus mengikuti struktur referensi.

## 4.1 Main structure

```text
+--------------------------------------------------------------+
| SIDEBAR | TOP HEADER                                         |
|         +----------------------------------------------------+
|         |                                                    |
|         | CONTENT AREA                                       |
|         |                                                    |
|         |  Page Header                                       |
|         |                                                    |
|         |  Main Content                                      |
|         |                                                    |
|         |                                                    |
|         +----------------------------------------------------+
+--------------------------------------------------------------+
```

### Sidebar

- Fixed position pada desktop.
- Lebar: 260px.
- Full viewport height.
- Background emerald dark.
- Border radius pada sisi kanan: 0 22px 22px 0.
- Logo dan nama aplikasi di bagian atas.
- Menu navigasi berkelompok.
- Active menu menggunakan background mint.
- Ikon berwarna putih atau emerald gelap sesuai kondisi.
- Semester dan tombol keluar berada di bagian bawah.

### Top header

- Height: 76px.
- Background: white.
- Display flex.
- Align center.
- Padding horizontal: 32px.
- Border bottom: 1px solid #E2E8F0.

Elemen header:
1. Search bar.
2. Notification button.
3. User avatar.
4. User name.
5. User role.
6. Dropdown profile.

### Main content

- Background: #F5F8FC.
- Padding: 28px.
- Min-height: 100vh.
- Konten tidak boleh menempel pada tepi layar.
- Gunakan max-width yang sesuai dengan ukuran viewport.

---

# 5. SIDEBAR DESIGN

Sidebar merupakan salah satu elemen identitas visual terpenting.

## Visual specification

```css
.sidebar {
  width: 260px;
  min-height: 100vh;
  background: linear-gradient(
    180deg,
    #047857 0%,
    #065F46 55%,
    #064E3B 100%
  );
  color: #FFFFFF;
  border-radius: 0 22px 22px 0;
}
```

### Sidebar sections

**A. Brand area**
- Logo sekolah.
- Nama TKQ Pro.
- Logo menggunakan versi putih atau hijau muda.

**B. Navigation**
- Dashboard.
- Data Anak & Pembelajaran.
- Pengajuan Izin.
- Penilaian Harian.
- Perkembangan Aspek.
- Catatan Guru.
- Rapor Semester.
- Komunikasi & Rapat.
- Forum Diskusi.
- Rapat Online.

**C. Bottom section**
- Semester aktif.
- Tahun ajaran.
- Tombol keluar.

### Navigation item

```css
.nav-item {
  min-height: 42px;
  padding: 10px 14px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #D1FAE5;
  transition: all 180ms ease;
}

.nav-item:hover {
  background: rgba(255,255,255,0.12);
}

.nav-item.active {
  background: #A7F3D0;
  color: #064E3B;
  font-weight: 600;
}
```

Jangan menggunakan active menu dengan warna hijau yang terlalu gelap sehingga teks sulit dibaca.

---

# 6. DASHBOARD DESIGN

Dashboard merupakan referensi utama untuk seluruh visual aplikasi.

## 6.1 Hero section

Hero section harus memiliki tampilan seperti banner pada referensi.

### Specifications

- Background emerald gradient.
- Border radius: 24px.
- Padding: 36px.
- Minimum height: 300px.
- Text berwarna putih.
- Ilustrasi sekolah di sisi kanan.
- Ornamen alam sederhana.
- Tidak menggunakan terlalu banyak dekorasi.

### Content structure

```text
+--------------------------------------------------------------+
| Portal Informasi Wali Murid & Ananda                         |
|                                                              |
| Assalamu'alaikum,                                             |
| Ananda Callista Azzahra!                                     |
| Semangat belajar dan raih prestasi terbaik di semester ini!  |
|                                                              |
| [Pengajuan Izin] [Rapat Online] [Forum Diskusi]               |
|                                      [Ilustrasi Sekolah]      |
+--------------------------------------------------------------+
```

### Hero colors

- Gradient start: #059669.
- Gradient end: #10B981.
- Text: #FFFFFF.
- Button background: #D1FAE5.
- Button text: #065F46.

Ilustrasi harus ditempatkan di sisi kanan dan tidak boleh mengganggu keterbacaan teks.

---

## 6.2 Statistic cards

Gunakan lima kartu statistik dalam satu baris pada desktop.

| Card | Background | Accent |
|---|---|---|
| Tingkat Kehadiran | #ECFDF5 | #059669 |
| Catatan Guru | #EFF6FF | #0EA5E9 |
| Hafalan Juz 30 | #FFF7ED | #F59E0B |
| Capaian Terkini | #F5F3FF | #9333EA |
| Buku Rapor | #F0FDFA | #14B8A6 |

### Card specification

- Background pastel.
- Border radius: 20px.
- Padding: 20px.
- Border: 1px solid dengan warna lembut.
- Shadow sangat tipis.
- Icon berada di dalam rounded icon container.
- Angka utama menggunakan font 24px bold.
- Label menggunakan font 13px.
- Status menggunakan warna sesuai kategori.

Jangan memberikan gradient yang berbeda-beda pada setiap card.

---

## 6.3 Content panels

Di bawah statistic cards gunakan dua kolom.

```text
+--------------------------------+-----------------------------+
| Pencapaian Karakter Qurani     | Pengumuman Sekolah          |
|                                |                             |
| Target Tahfidz Semester Ini    | Informasi sekolah           |
|                                |                             |
| Progress bar                   | Daftar pengumuman           |
|                                |                             |
| Doa Harian & Adab              | Jadwal rapat                |
+--------------------------------+-----------------------------+
```

### Panel style

```css
.content-panel {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 22px;
  padding: 22px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}
```

### Progress component

- Track: #E2E8F0.
- Progress: #059669.
- Height: 10px.
- Border radius: 999px.
- Percentage ditampilkan di sebelah kanan.

---

# 7. BUTTON DESIGN

Gunakan tiga jenis tombol utama.

### Primary button

```css
.btn-primary {
  background: #059669;
  color: white;
  border-radius: 12px;
  padding: 10px 18px;
  font-weight: 600;
}
```

### Secondary button

```css
.btn-secondary {
  background: #ECFDF5;
  color: #065F46;
  border: 1px solid #D1FAE5;
  border-radius: 12px;
  padding: 10px 18px;
}
```

### Outline button

```css
.btn-outline {
  background: white;
  color: #334155;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 10px 18px;
}
```

Button rules:
- Tinggi konsisten.
- Gunakan hover yang halus.
- Jangan menggunakan gradient untuk setiap tombol.
- Jangan menggunakan pill shape secara berlebihan.
- Ikon hanya ditambahkan jika membantu pemahaman fungsi.

---

# 8. FORM DESIGN

Seluruh form harus mengikuti desain yang sama.

### Input

```css
.form-input {
  width: 100%;
  min-height: 44px;
  padding: 10px 14px;
  background: #FFFFFF;
  border: 1px solid #CBD5E1;
  border-radius: 10px;
  color: #172B45;
  outline: none;
}

.form-input:focus {
  border-color: #059669;
  box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.12);
}
```

### Form rules

- Label berada di atas input.
- Required field memiliki penanda yang jelas.
- Error message menggunakan warna merah lembut.
- Placeholder menggunakan warna muted.
- Jarak antarfield konsisten.
- Gunakan grid jika terdapat beberapa field yang berkaitan.

---

# 9. TABLE DESIGN

Tabel harus bersih, modern, dan mudah dibaca.

### Table specification

- Header background: #F8FAFC.
- Header text: #475569.
- Body background: #FFFFFF.
- Border: #E2E8F0.
- Row height: 56px.
- Border radius container: 14px.

### Table rules

- Jangan menggunakan border tebal.
- Gunakan hover lembut pada baris.
- Action button menggunakan ikon sederhana.
- Status menggunakan badge pastel.
- Sediakan pagination yang konsisten.
- Responsive: tabel dapat menggunakan horizontal scrolling pada layar kecil.

---

# 10. BADGES & STATUS

Gunakan badge sederhana dengan warna pastel.

| Status | Text | Background |
|---|---|---|
| Aktif | #047857 | #D1FAE5 |
| Pending | #B45309 | #FEF3C7 |
| Ditolak | #BE123C | #FFE4E6 |
| Selesai | #0369A1 | #E0F2FE |
| Draft | #64748B | #F1F5F9 |

Badge harus memiliki:
- Padding 5px 10px.
- Border radius 999px.
- Font size 12px.
- Font weight 500.

---

# 11. ICONOGRAPHY

Gunakan satu library ikon secara konsisten.

Rekomendasi: Lucide Icons.

```text
Icon style: Outline
Stroke width: 1.8
Default size: 18-20px
```

Rules:
- Jangan mencampur ikon outline dengan ikon 3D.
- Hindari emoji sebagai pengganti ikon navigasi.
- Ikon harus memiliki ukuran konsisten.
- Gunakan warna emerald untuk ikon utama.
- Gunakan warna muted untuk ikon sekunder.

---

# 12. RESPONSIVE DESIGN

Aplikasi wajib berjalan dengan baik di desktop, tablet, dan mobile.

### Desktop: ≥ 1200px

- Sidebar fixed 260px.
- Header horizontal.
- Hero banner full width.
- Statistik lima kolom.
- Content panel dua kolom.

### Tablet: 768px–1199px

- Sidebar dapat diperkecil atau menggunakan drawer.
- Statistik menggunakan dua atau tiga kolom.
- Content panel dapat menjadi satu kolom.
- Padding konten disesuaikan.

### Mobile: < 768px

- Sidebar menjadi mobile drawer.
- Header lebih sederhana.
- Hero banner menggunakan layout vertikal.
- Statistik menggunakan dua kolom.
- Content panel satu kolom.
- Tombol dan input harus mudah disentuh.
- Hindari horizontal overflow.

---

# 13. ANIMATION & INTERACTION

Gunakan animasi sederhana.

| Interaction | Behavior |
|---|---|
| Button hover | Slight color transition |
| Card hover | Subtle elevation |
| Sidebar menu | Smooth background transition |
| Dropdown | Fade and slight slide |
| Modal | Fade in |
| Page transition | Subtle fade |

Durasi animasi: 150–250ms.

Jangan menggunakan:
- Animasi berlebihan.
- Parallax yang tidak diperlukan.
- Floating elements tanpa fungsi.
- Animasi pada setiap elemen ketika halaman dibuka.

---

# 14. DESIGN CONSISTENCY ACROSS PAGES

Semua halaman aplikasi harus menggunakan design system yang sama.

| Page | Visual requirements |
|---|---|
| Dashboard | Hero, statistics, content panels |
| Data Anak | Table, search, filter, form |
| Pengajuan Izin | Status cards, request table, form |
| Penilaian Harian | Assessment cards, data table |
| Perkembangan Aspek | Progress indicators, charts |
| Catatan Guru | Note cards, filters, forms |
| Rapor Semester | Report preview, student information |
| Forum Diskusi | Discussion list, conversation panel |
| Rapat Online | Meeting cards, schedules |

Jangan membuat setiap halaman dengan layout dan warna yang berbeda.

Pertahankan:
- Sidebar yang sama.
- Header yang sama.
- Page title yang sama.
- Button style yang sama.
- Table style yang sama.
- Form style yang sama.
- Spacing system yang sama.

---

# 15. SPACING SYSTEM

Gunakan kelipatan 4px.

| Token | Value |
|---|---:|
| xs | 4px |
| sm | 8px |
| md | 12px |
| lg | 16px |
| xl | 20px |
| 2xl | 24px |
| 3xl | 32px |
| 4xl | 40px |

Jangan memberikan margin dan padding secara acak.

---

# 16. BORDER RADIUS & SHADOW

### Border radius

| Component | Radius |
|---|---:|
| Small button | 10px |
| Input | 10px |
| Standard card | 16px |
| Large panel | 22px |
| Hero banner | 24px |
| Badge | 999px |

### Shadow

Gunakan shadow ringan.

```css
--shadow-card:
  0 2px 8px rgba(15, 23, 42, 0.04);

--shadow-hover:
  0 6px 18px rgba(15, 23, 42, 0.08);
```

Hindari shadow gelap dan tebal.

---

# 17. IMPLEMENTATION RULES FOR AI CODING AGENT

Bagian ini wajib diperhatikan ketika melakukan implementasi.

## Before coding

1. Pelajari struktur proyek yang sudah ada.
2. Identifikasi framework, library, dan komponen yang digunakan.
3. Periksa komponen layout yang sudah tersedia.
4. Periksa sistem routing dan autentikasi.
5. Identifikasi halaman yang perlu diperbarui.
6. Gunakan komponen yang sudah ada jika memungkinkan.

## During coding

1. Jadikan dokumen ini sebagai sumber utama keputusan visual.
2. Implementasikan design system secara konsisten.
3. Gunakan reusable components.
4. Pisahkan komponen layout, navigasi, form, table, dan card.
5. Jangan membuat duplikasi komponen yang memiliki fungsi sama.
6. Pertahankan seluruh fungsi dan business logic yang sudah berjalan.
7. Jangan mengubah struktur database, API, atau autentikasi hanya untuk kebutuhan visual.
8. Jangan mengganti data dinamis dengan data dummy.
9. Jangan menghapus fitur yang sudah tersedia.
10. Jangan mengubah role permission.

## After coding

1. Periksa kesesuaian warna.
2. Periksa spacing dan alignment.
3. Periksa konsistensi typography.
4. Periksa responsivitas.
5. Periksa seluruh tombol dan interaksi.
6. Pastikan tidak ada horizontal overflow.
7. Pastikan semua halaman mengikuti design system.
8. Perbaiki elemen yang terlalu ramai atau tidak konsisten.

---

# 18. STRICT DESIGN RESTRICTIONS

AI coding agent DILARANG:

- Mengubah identitas utama Emerald Green.
- Menggunakan terlalu banyak warna mencolok.
- Membuat dashboard penuh card tanpa hierarki.
- Menggunakan glassmorphism berlebihan.
- Menggunakan gradient di semua komponen.
- Menggunakan font dekoratif.
- Membuat sidebar berbeda di setiap halaman.
- Mengubah struktur fitur aplikasi tanpa instruksi.
- Menghapus informasi atau fungsi yang sudah ada.
- Membuat tampilan generik hasil AI tanpa mengikuti referensi.
- Menambahkan elemen dekoratif yang mengganggu usability.

**Prioritas utama adalah kesetiaan terhadap referensi desain, konsistensi seluruh halaman, dan keterbacaan informasi.**

---

# 19. FINAL DESIGN TARGET

Hasil akhir yang diharapkan:

- Tampilan sedekat mungkin dengan referensi dashboard Emerald Green Professional.
- Sidebar emerald gelap dengan active menu mint.
- Konten utama putih dan background abu-abu lembut.
- Hero banner emerald dengan ilustrasi sekolah.
- Statistic cards pastel.
- Content panels putih dengan shadow tipis.
- Typography Inter yang bersih.
- Layout responsif.
- Komponen reusable.
- Konsistensi visual pada semua role dan halaman.

**Final instruction:** Jangan hanya mempercantik satu halaman. Terapkan seluruh design system ini ke aplikasi TKQ Pro tanpa merusak fitur, data, hak akses, maupun business logic yang sudah ada.
