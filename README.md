# TKQ Pro - AplikasiTKQalanshor

Monorepo aplikasi manajemen TK dengan backend Laravel 13 dan frontend React/Vite.

## Struktur

- `backend/`: REST API Laravel, migration, seeder, dan Docker container.
- `frontend/`: aplikasi React dan TypeScript yang menggunakan Vite.
- Backend API tersedia pada prefix `/api/v1`.
- Health check tersedia pada `/up` dan `/api/health`.

## Menjalankan Lokal

### Backend

Prasyarat: PHP 8.3+, Composer, dan MySQL/SQLite.

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

Untuk MySQL, isi `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, dan `DB_PASSWORD`.

### Frontend

Prasyarat: Node.js 24+ dan npm.

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Set `VITE_API_URL=http://127.0.0.1:8000/api/v1` pada `.env` lokal.

## Akun Demo

Password demo default adalah `password`. Untuk deployment demo, set `DEMO_PASSWORD` sebelum menjalankan seeder.

| Peran | Username | Password |
|---|---|---|
| Admin | `admin` | `password` |
| Guru | `guru1` | `password` |
| Murid/Wali | `siswa1` | `password` |

Data dan akun lain tersedia pada `backend/database/seeders/DatabaseSeeder.php`.

## Environment Backend

Wajib produksi:

- `APP_NAME`
- `APP_ENV=production`
- `APP_KEY`
- `APP_DEBUG=false`
- `APP_URL`
- `FRONTEND_URL` atau `FRONTEND_URLS`
- `FORCE_HTTPS=true`
- `TRUSTED_PROXIES=*` atau daftar proxy tepercaya
- `DB_CONNECTION=mysql`
- `DB_HOST`
- `DB_PORT`
- `DB_DATABASE`
- `DB_USERNAME`
- `DB_PASSWORD`
- `SESSION_DRIVER=cookie`
- `CACHE_STORE=database`
- `QUEUE_CONNECTION=sync`
- `LOG_CHANNEL=stderr`
- `FILESYSTEM_DISK=s3`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_DEFAULT_REGION`
- `AWS_BUCKET`
- `AWS_ENDPOINT`
- `AWS_URL`
- `AWS_USE_PATH_STYLE_ENDPOINT=false`
- `DEMO_PASSWORD`

Jangan menyimpan nilai secret pada file `.env.example`.

## Environment Frontend

- `VITE_API_URL`: URL lengkap backend, termasuk `/api/v1`.
- Contoh: `https://api-demo.example.com/api/v1`

Pada production build, variabel ini wajib disediakan.

## Deploy Backend Docker

1. Buat MySQL eksternal.
2. Buat penyimpanan S3-compatible, misalnya Cloudflare R2.
3. Deploy `backend/` dengan Dockerfile.
4. Isi semua environment backend di platform hosting.
5. Set port aplikasi menggunakan `PORT`; nilai fallback container adalah `8080`.
6. Pastikan health check menggunakan `/api/health`.
7. Container menjalankan migrasi dengan `php artisan migrate --force` saat startup.

Contoh build lokal:

```bash
cd backend
docker build -t tkq-backend .
docker run --env-file .env -p 8080:8080 tkq-backend
```

## Deploy Frontend

Vercel atau Netlify:

1. Set root directory menjadi `frontend`.
2. Set build command `npm run build`.
3. Set output directory `dist`.
4. Set `VITE_API_URL` ke URL backend production.
5. Vercel menggunakan `vercel.json`; Netlify menggunakan `public/_redirects`.

## Penyimpanan File

Upload disimpan melalui disk Laravel `s3`, sehingga dapat dipakai oleh AWS S3 atau provider S3-compatible.
Server gratis tidak menyimpan file lokal sebagai penyimpanan permanen.

## Keamanan Demo

Ubah atau reset password demo sebelum penggunaan selain demo. API saat ini belum sepenuhnya dilindungi dengan middleware autentikasi; deployment publik sebaiknya menambahkan otorisasi sebelum data sensitif dipakai.
