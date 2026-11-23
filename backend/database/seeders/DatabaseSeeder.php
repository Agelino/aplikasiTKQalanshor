<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\DomainRecord;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::query()->delete();

        $adminAccounts = [
            ['admin', 'Admin Utama', 'admin@tkqpro.sch.id'],
            ['admin2', 'Admin Akademik', 'akademik@tkqpro.sch.id'],
            ['admin3', 'Admin Keuangan', 'keuangan@tkqpro.sch.id'],
            ['admin4', 'Admin Tata Usaha', 'tu@tkqpro.sch.id'],
        ];

        foreach ($adminAccounts as [$username, $name, $email]) {
            User::query()->updateOrCreate(['username' => $username], [
                'name' => $name,
                'email' => $email,
                'role' => 'admin',
                'teacher_id' => null,
                'student_id' => null,
                'password' => Hash::make('password'),
            ]);
        }

        $teacherAccounts = [
            ['guru1', 'Ibu Alfiyah Nurazizah', 'guru1@tkqpro.sch.id', 'guru-alfiyah'],
            ['guru2', 'Ibu Lilik Alawiyah', 'guru2@tkqpro.sch.id', 'guru-lilik'],
            ['guru3', 'Ibu Syipaurrohmah', 'guru3@tkqpro.sch.id', 'guru-syipaurrohmah'],
            ['guru4', 'Ibu Indri Samrotussadah', 'guru4@tkqpro.sch.id', 'guru-indri'],
            ['guru5', 'Ibu Yeti Nurhasani', 'guru5@tkqpro.sch.id', 'guru-yeti'],
        ];

        foreach ($teacherAccounts as [$username, $name, $email, $teacherId]) {
            User::query()->updateOrCreate(['username' => $username], [
                'name' => $name,
                'email' => $email,
                'role' => 'guru',
                'teacher_id' => $teacherId,
                'student_id' => null,
                'password' => Hash::make('password'),
            ]);
        }

        $studentAccounts = [
            ['siswa1', 'Muhammad Arzan Al-Fatih', 'siswa1@tkqpro.sch.id', 'murid-1'],
            ['siswa2', 'Aisyah Putri Humaira', 'siswa2@tkqpro.sch.id', 'murid-2'],
            ['siswa3', 'Kenzo Alvaro Daniswara', 'siswa3@tkqpro.sch.id', 'murid-3'],
            ['siswa4', 'Nadhifa Syakira Al-Maida', 'siswa4@tkqpro.sch.id', 'murid-4'],
            ['siswa5', 'Raffasya Bilal Al-Ghifari', 'siswa5@tkqpro.sch.id', 'murid-5'],
            ['siswa6', 'Zahra Medina Khairunnisa', 'siswa6@tkqpro.sch.id', 'murid-6'],
            ['siswa7', 'Fathan Malik Ibrahim', 'siswa7@tkqpro.sch.id', 'murid-7'],
            ['siswa8', 'Aqila Shafa Marwah', 'siswa8@tkqpro.sch.id', 'murid-8'],
            ['siswa9', 'Devan Putra Pratama', 'siswa9@tkqpro.sch.id', 'murid-9'],
            ['siswa10', 'Ade Eva Duratul Callista', 'siswa10@tkqpro.sch.id', 'murid-callista'],
        ];

        foreach ($studentAccounts as [$username, $name, $email, $studentId]) {
            User::query()->updateOrCreate(['username' => $username], [
                'name' => $name,
                'email' => $email,
                'role' => 'murid',
                'teacher_id' => null,
                'student_id' => $studentId,
                'password' => Hash::make('password'),
            ]);
        }

        $resources = [
            'school_profile' => [[
                'id' => 'school-profile',
                'name' => 'TKQ Pro',
                'npsn' => '69876543',
                'address' => 'Jl. Pendidikan No. 1',
                'village' => 'Sukamaju',
                'district' => 'Cibinong',
                'regency' => 'Bogor',
                'province' => 'Jawa Barat',
                'postalCode' => '16911',
                'phone' => '021-555-0101',
                'email' => 'info@tkceriabangsa.sch.id',
                'principal' => 'Ustadzah Aminah, S.Kom',
                'description' => 'Taman kanak-kanak dengan pembelajaran holistik dan berkarakter.',
                'foundedYear' => '2014',
                'accreditation' => 'Akreditasi A',
            ]],
            'teachers' => [
                ['id' => 'guru-alfiyah', 'name' => 'Ibu Alfiyah Nurazizah', 'nip' => '199104122016032001', 'gender' => 'P', 'email' => 'guru1@tkqpro.sch.id', 'position' => 'Wali Rombel Al Quddus', 'username' => 'guru1', 'status' => 'Aktif', 'assignedClassId' => 'kelas-a1', 'avatarColor' => 'emerald'],
                ['id' => 'guru-lilik', 'name' => 'Ibu Lilik Alawiyah', 'nip' => '199208152017042002', 'gender' => 'P', 'email' => 'guru2@tkqpro.sch.id', 'position' => 'Wali Rombel As Salam', 'username' => 'guru2', 'status' => 'Aktif', 'assignedClassId' => 'kelas-a1', 'avatarColor' => 'emerald'],
                ['id' => 'guru-syipaurrohmah', 'name' => 'Ibu Syipaurrohmah', 'nip' => '199302102018032003', 'gender' => 'P', 'email' => 'guru3@tkqpro.sch.id', 'position' => 'Wali Rombel Al Alim', 'username' => 'guru3', 'status' => 'Aktif', 'assignedClassId' => 'kelas-a1', 'avatarColor' => 'emerald'],
                ['id' => 'guru-indri', 'name' => 'Ibu Indri Samrotussadah', 'nip' => '199009182015032004', 'gender' => 'P', 'email' => 'guru4@tkqpro.sch.id', 'position' => 'Wali Rombel Al Fattah', 'username' => 'guru4', 'status' => 'Aktif', 'assignedClassId' => 'kelas-a2', 'avatarColor' => 'emerald'],
                ['id' => 'guru-yeti', 'name' => 'Ibu Yeti Nurhasani', 'nip' => '199112212016042005', 'gender' => 'P', 'email' => 'guru5@tkqpro.sch.id', 'position' => 'Wali Rombel Al Malik', 'username' => 'guru5', 'status' => 'Aktif', 'assignedClassId' => 'kelas-a2', 'avatarColor' => 'emerald'],
            ],
            'students' => [
                ['id' => 'murid-1', 'nis' => '2026001', 'nisn' => '0098765431', 'name' => 'Muhammad Arzan Al-Fatih', 'nickname' => 'Arzan', 'gender' => 'L', 'birthPlace' => 'Bogor', 'birthDate' => '2021-03-20', 'religion' => 'Islam', 'address' => 'Bogor', 'fatherName' => 'Bapak Arzan', 'motherName' => 'Ibu Arzan', 'guardianPhone' => '081234567891', 'classId' => 'kelas-a1', 'className' => 'Kelas A1', 'rombelId' => 'rombel-al-quddus', 'rombelName' => 'Al Quddus', 'rombelTeacherName' => 'Ibu Alfiyah Nurazizah', 'entryYear' => '2026', 'username' => 'siswa1', 'status' => 'Aktif', 'avatarColor' => 'emerald'],
                ['id' => 'murid-2', 'nis' => '2026002', 'nisn' => '0098765432', 'name' => 'Aisyah Putri Humaira', 'nickname' => 'Aisyah', 'gender' => 'P', 'birthPlace' => 'Bogor', 'birthDate' => '2021-04-10', 'religion' => 'Islam', 'address' => 'Bogor', 'fatherName' => 'Bapak Aisyah', 'motherName' => 'Ibu Aisyah', 'guardianPhone' => '081234567892', 'classId' => 'kelas-a1', 'className' => 'Kelas A1', 'rombelId' => 'rombel-al-quddus', 'rombelName' => 'Al Quddus', 'rombelTeacherName' => 'Ibu Alfiyah Nurazizah', 'entryYear' => '2026', 'username' => 'siswa2', 'status' => 'Aktif', 'avatarColor' => 'rose'],
                ['id' => 'murid-3', 'nis' => '2026003', 'nisn' => '0098765433', 'name' => 'Kenzo Alvaro Daniswara', 'nickname' => 'Kenzo', 'gender' => 'L', 'birthPlace' => 'Bogor', 'birthDate' => '2021-05-12', 'religion' => 'Islam', 'address' => 'Bogor', 'fatherName' => 'Bapak Kenzo', 'motherName' => 'Ibu Kenzo', 'guardianPhone' => '081234567893', 'classId' => 'kelas-a1', 'className' => 'Kelas A1', 'rombelId' => 'rombel-al-quddus', 'rombelName' => 'Al Quddus', 'rombelTeacherName' => 'Ibu Alfiyah Nurazizah', 'entryYear' => '2026', 'username' => 'siswa3', 'status' => 'Aktif', 'avatarColor' => 'amber'],
                ['id' => 'murid-4', 'nis' => '2026004', 'nisn' => '0098765434', 'name' => 'Nadhifa Syakira Al-Maida', 'nickname' => 'Nadhifa', 'gender' => 'P', 'birthPlace' => 'Bogor', 'birthDate' => '2021-06-15', 'religion' => 'Islam', 'address' => 'Bogor', 'fatherName' => 'Bapak Nadhifa', 'motherName' => 'Ibu Nadhifa', 'guardianPhone' => '081234567894', 'classId' => 'kelas-a1', 'className' => 'Kelas A1', 'rombelId' => 'rombel-al-quddus', 'rombelName' => 'Al Quddus', 'rombelTeacherName' => 'Ibu Alfiyah Nurazizah', 'entryYear' => '2026', 'username' => 'siswa4', 'status' => 'Aktif', 'avatarColor' => 'purple'],
                ['id' => 'murid-5', 'nis' => '2026005', 'nisn' => '0098765435', 'name' => 'Raffasya Bilal Al-Ghifari', 'nickname' => 'Raffasya', 'gender' => 'L', 'birthPlace' => 'Bogor', 'birthDate' => '2021-07-18', 'religion' => 'Islam', 'address' => 'Bogor', 'fatherName' => 'Bapak Raffasya', 'motherName' => 'Ibu Raffasya', 'guardianPhone' => '081234567895', 'classId' => 'kelas-a1', 'className' => 'Kelas A1', 'rombelId' => 'rombel-al-quddus', 'rombelName' => 'Al Quddus', 'rombelTeacherName' => 'Ibu Alfiyah Nurazizah', 'entryYear' => '2026', 'username' => 'siswa5', 'status' => 'Aktif', 'avatarColor' => 'blue'],
                ['id' => 'murid-6', 'nis' => '2026006', 'nisn' => '0098765436', 'name' => 'Zahra Medina Khairunnisa', 'nickname' => 'Zahra', 'gender' => 'P', 'birthPlace' => 'Bogor', 'birthDate' => '2021-08-20', 'religion' => 'Islam', 'address' => 'Bogor', 'fatherName' => 'Bapak Zahra', 'motherName' => 'Ibu Zahra', 'guardianPhone' => '081234567896', 'classId' => 'kelas-a1', 'className' => 'Kelas A1', 'rombelId' => 'rombel-as-salam', 'rombelName' => 'As Salam', 'rombelTeacherName' => 'Ibu Lilik Alawiyah', 'entryYear' => '2026', 'username' => 'siswa6', 'status' => 'Aktif', 'avatarColor' => 'rose'],
                ['id' => 'murid-7', 'nis' => '2026007', 'nisn' => '0098765437', 'name' => 'Fathan Malik Ibrahim', 'nickname' => 'Fathan', 'gender' => 'L', 'birthPlace' => 'Bogor', 'birthDate' => '2021-09-22', 'religion' => 'Islam', 'address' => 'Bogor', 'fatherName' => 'Bapak Fathan', 'motherName' => 'Ibu Fathan', 'guardianPhone' => '081234567897', 'classId' => 'kelas-a1', 'className' => 'Kelas A1', 'rombelId' => 'rombel-as-salam', 'rombelName' => 'As Salam', 'rombelTeacherName' => 'Ibu Lilik Alawiyah', 'entryYear' => '2026', 'username' => 'siswa7', 'status' => 'Aktif', 'avatarColor' => 'blue'],
                ['id' => 'murid-8', 'nis' => '2026008', 'nisn' => '0098765438', 'name' => 'Aqila Shafa Marwah', 'nickname' => 'Aqila', 'gender' => 'P', 'birthPlace' => 'Bogor', 'birthDate' => '2021-10-25', 'religion' => 'Islam', 'address' => 'Bogor', 'fatherName' => 'Bapak Aqila', 'motherName' => 'Ibu Aqila', 'guardianPhone' => '081234567898', 'classId' => 'kelas-a1', 'className' => 'Kelas A1', 'rombelId' => 'rombel-as-salam', 'rombelName' => 'As Salam', 'rombelTeacherName' => 'Ibu Lilik Alawiyah', 'entryYear' => '2026', 'username' => 'siswa8', 'status' => 'Aktif', 'avatarColor' => 'pink'],
                ['id' => 'murid-9', 'nis' => '2026009', 'nisn' => '0098765439', 'name' => 'Devan Putra Pratama', 'nickname' => 'Devan', 'gender' => 'L', 'birthPlace' => 'Bogor', 'birthDate' => '2021-11-28', 'religion' => 'Islam', 'address' => 'Bogor', 'fatherName' => 'Bapak Devan', 'motherName' => 'Ibu Devan', 'guardianPhone' => '081234567899', 'classId' => 'kelas-a1', 'className' => 'Kelas A1', 'rombelId' => 'rombel-as-salam', 'rombelName' => 'As Salam', 'rombelTeacherName' => 'Ibu Lilik Alawiyah', 'entryYear' => '2026', 'username' => 'siswa9', 'status' => 'Aktif', 'avatarColor' => 'amber'],
                ['id' => 'murid-callista', 'nis' => '2026010', 'nisn' => '0098765440', 'name' => 'Ade Eva Duratul Callista', 'nickname' => 'Callista', 'gender' => 'P', 'birthPlace' => 'Bogor', 'birthDate' => '2021-12-30', 'religion' => 'Islam', 'address' => 'Bogor', 'fatherName' => 'Bapak Callista', 'motherName' => 'Ibu Callista', 'guardianPhone' => '081234567900', 'classId' => 'kelas-a1', 'className' => 'Kelas A1', 'rombelId' => 'rombel-as-salam', 'rombelName' => 'As Salam', 'rombelTeacherName' => 'Ibu Lilik Alawiyah', 'entryYear' => '2026', 'username' => 'siswa10', 'status' => 'Aktif', 'avatarColor' => 'purple'],
            ],
            'classes' => [
                ['id' => 'kelas-a1', 'name' => 'Kelas A1', 'code' => 'A1', 'ageGroup' => '4 - 5 Tahun', 'teacherId' => 'guru-alfiyah', 'teacherName' => 'Ibu Alfiyah Nurazizah', 'academicYear' => '2026/2027', 'capacity' => 20, 'studentCount' => 10, 'status' => 'Aktif'],
                ['id' => 'kelas-a2', 'name' => 'Kelas A2', 'code' => 'A2', 'ageGroup' => '4 - 5 Tahun', 'teacherId' => 'guru-indri', 'teacherName' => 'Ibu Indri Samrotussadah', 'academicYear' => '2026/2027', 'capacity' => 20, 'studentCount' => 0, 'status' => 'Aktif'],
            ],
            'rombels' => [
                ['id' => 'rombel-al-quddus', 'name' => 'Al Quddus', 'fullName' => 'Rombel Al Quddus', 'classId' => 'kelas-a1', 'className' => 'Kelas A1', 'teacherId' => 'guru-alfiyah', 'teacherName' => 'Ibu Alfiyah Nurazizah', 'capacity' => 20, 'studentCount' => 5, 'color' => 'emerald'],
                ['id' => 'rombel-as-salam', 'name' => 'As Salam', 'fullName' => 'Rombel As Salam', 'classId' => 'kelas-a1', 'className' => 'Kelas A1', 'teacherId' => 'guru-lilik', 'teacherName' => 'Ibu Lilik Alawiyah', 'capacity' => 20, 'studentCount' => 5, 'color' => 'emerald'],
                ['id' => 'rombel-al-alim', 'name' => 'Al Alim', 'fullName' => 'Rombel Al Alim', 'classId' => 'kelas-a1', 'className' => 'Kelas A1', 'teacherId' => 'guru-syipaurrohmah', 'teacherName' => 'Ibu Syipaurrohmah', 'capacity' => 20, 'studentCount' => 0, 'color' => 'emerald'],
                ['id' => 'rombel-al-fattah', 'name' => 'Al Fattah', 'fullName' => 'Rombel Al Fattah', 'classId' => 'kelas-a2', 'className' => 'Kelas A2', 'teacherId' => 'guru-indri', 'teacherName' => 'Ibu Indri Samrotussadah', 'capacity' => 20, 'studentCount' => 0, 'color' => 'emerald'],
                ['id' => 'rombel-al-malik', 'name' => 'Al Malik', 'fullName' => 'Rombel Al Malik', 'classId' => 'kelas-a2', 'className' => 'Kelas A2', 'teacherId' => 'guru-yeti', 'teacherName' => 'Ibu Yeti Nurhasani', 'capacity' => 20, 'studentCount' => 0, 'color' => 'emerald'],
            ],
            'users' => array_merge(
                array_map(function (array $account): array {
                    return [
                        'id' => 'user-' . $account[0],
                        'username' => $account[0],
                        'name' => $account[1],
                        'role' => 'admin',
                        'email' => $account[2],
                    ];
                }, $adminAccounts),
                array_map(function (array $account): array {
                    return [
                        'id' => 'user-' . $account[0],
                        'username' => $account[0],
                        'name' => $account[1],
                        'role' => 'guru',
                        'email' => $account[2],
                        'teacherId' => $account[3],
                    ];
                }, $teacherAccounts),
                array_map(function (array $account): array {
                    return [
                        'id' => 'user-' . $account[0],
                        'username' => $account[0],
                        'name' => $account[1],
                        'role' => 'murid',
                        'email' => $account[2],
                        'studentId' => $account[3],
                    ];
                }, $studentAccounts)
            ),
            'academic_year' => [[
                'id' => 'ay-2026-2027',
                'name' => '2026/2027',
                'status' => 'Aktif',
                'semesters' => [
                    ['id' => 'semester-1', 'name' => 'Semester 1', 'status' => 'Aktif', 'startDate' => '2026-07-13', 'endDate' => '2026-12-19'],
                    ['id' => 'semester-2', 'name' => 'Semester 2', 'status' => 'Selesai', 'startDate' => '2027-01-04', 'endDate' => '2027-06-19'],
                ],
            ]],
            'announcements' => [[
                'id' => 'announcement-welcome',
                'title' => 'Selamat Datang di Tahun Ajaran 2026/2027',
                'content' => 'Informasi akademik dan komunikasi sekolah tersedia di aplikasi.',
                'date' => '2026-07-13',
                'author' => 'Admin',
            ]],
            'calendar_events' => [
                [
                    'id' => 'kaldik-2026-08-17',
                    'title' => 'Hari Kemerdekaan Republik Indonesia',
                    'date' => '2026-08-17',
                    'type' => 'holiday',
                    'description' => 'Hari libur nasional berdasarkan kalender pemerintah Republik Indonesia.',
                    'color' => 'red',
                ],
                [
                    'id' => 'kaldik-2026-12-25',
                    'title' => 'Hari Raya Natal',
                    'date' => '2026-12-25',
                    'type' => 'holiday',
                    'description' => 'Hari libur nasional berdasarkan kalender pemerintah Republik Indonesia.',
                    'color' => 'red',
                ],
                [
                    'id' => 'kaldik-2027-01-01',
                    'title' => 'Tahun Baru Masehi',
                    'date' => '2027-01-01',
                    'type' => 'holiday',
                    'description' => 'Hari libur nasional berdasarkan kalender pemerintah Republik Indonesia.',
                    'color' => 'red',
                ],
                [
                    'id' => 'kaldik-2027-02-06',
                    'title' => 'Tahun Baru Imlek 2578 Kongzili',
                    'date' => '2027-02-06',
                    'type' => 'holiday',
                    'description' => 'Hari libur nasional berdasarkan kalender pemerintah Republik Indonesia.',
                    'color' => 'red',
                ],
                [
                    'id' => 'kaldik-2027-03-09',
                    'title' => 'Hari Suci Nyepi Tahun Baru Saka 1949',
                    'date' => '2027-03-09',
                    'type' => 'holiday',
                    'description' => 'Hari libur nasional berdasarkan kalender pemerintah Republik Indonesia.',
                    'color' => 'red',
                ],
                [
                    'id' => 'kaldik-2027-03-26',
                    'title' => 'Wafat Yesus Kristus',
                    'date' => '2027-03-26',
                    'type' => 'holiday',
                    'description' => 'Hari libur nasional berdasarkan kalender pemerintah Republik Indonesia.',
                    'color' => 'red',
                ],
                [
                    'id' => 'kaldik-2027-05-01',
                    'title' => 'Hari Buruh Internasional',
                    'date' => '2027-05-01',
                    'type' => 'holiday',
                    'description' => 'Hari libur nasional berdasarkan kalender pemerintah Republik Indonesia.',
                    'color' => 'red',
                ],
                [
                    'id' => 'kaldik-2027-05-13',
                    'title' => 'Kenaikan Yesus Kristus',
                    'date' => '2027-05-13',
                    'type' => 'holiday',
                    'description' => 'Hari libur nasional berdasarkan kalender pemerintah Republik Indonesia.',
                    'color' => 'red',
                ],
                [
                    'id' => 'kaldik-2027-06-01',
                    'title' => 'Hari Lahir Pancasila',
                    'date' => '2027-06-01',
                    'type' => 'holiday',
                    'description' => 'Hari libur nasional berdasarkan kalender pemerintah Republik Indonesia.',
                    'color' => 'red',
                ],
            ],
            'learning_elements' => [],
            'cp_list' => [],
            'tp_list' => [],
            'active_curriculum' => [],
            'gov_curriculum' => [],
            'tk_curriculum' => [],
            'material_bank' => [],
            'activity_bank' => [],
            'prosem_list' => [],
            'rppm_list' => [[
                'id' => 'rppm-seeder-1',
                'academicYear' => '2026/2027',
                'semester' => 'Semester 1',
                'week' => 1,
                'theme' => 'Lingkunganku yang Nyaman',
                'subtheme' => 'Sekolahku',
                'ageGroup' => 'Kelompok A (4-5 Tahun)',
                'classId' => 'kelas-a1',
                'className' => 'Kelas A1',
                'learningObjective' => 'Anak mengenal lingkungan sekolah dengan aman dan percaya diri.',
                'material' => 'Lingkungan kelas dan halaman sekolah',
                'aspect' => 'Nilai Agama dan Moral',
                'activity' => 'Observasi lingkungan sekolah dan permainan mengenal teman',
                'toolsAndMaterials' => 'Buku cerita, kartu nama, alat tulis',
                'indicator' => 'Anak mampu mengenal lingkungan sekolah dan mengikuti aturan kegiatan.',
                'isTemplate' => false,
                'createdRole' => 'admin',
                'lastEditedByRole' => 'admin',
                'authorName' => 'Admin Utama',
            ]],
            'rpph_list' => [],
            'attendance_list' => [],
            'teacher_attendance' => [],
            'assessment_list' => [],
            'report_cards' => [],
            'activity_logs' => [],
            'notifications' => [],
            'teacher_notes' => [],
            'rombel_chats' => [],
            'rombel_meetings' => [],
        ];

        foreach ($resources as $resource => $items) {
            DomainRecord::query()->where('resource', $resource)->delete();
            foreach ($items as $item) {
                DomainRecord::create([
                    'resource' => $resource,
                    'record_id' => $item['id'],
                    'payload' => $item,
                ]);
            }
        }
    }
}
