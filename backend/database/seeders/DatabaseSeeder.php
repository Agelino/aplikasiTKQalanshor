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
        User::query()->updateOrCreate(['username' => 'admin'], [
            'name' => 'Ustadzah Aminah, S.Kom',
            'email' => 'admin@example.com',
            'role' => 'admin',
            'password' => Hash::make('password'),
        ]);

        $resources = [
            'school_profile' => [[
                'id' => 'school-profile',
                'name' => 'TK Ceria Bangsa',
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
            'teachers' => [[
                'id' => 'guru-alfiyah',
                'name' => 'Ibu Alfiyah Nurazizah',
                'nip' => '198901012020012001',
                'nik' => '3271010101890001',
                'gender' => 'P',
                'birthPlace' => 'Bogor',
                'birthDate' => '1989-01-01',
                'address' => 'Bogor',
                'phone' => '081234567890',
                'email' => 'alfiyah@tkceriabangsa.sch.id',
                'education' => 'S1 PGPAUD',
                'position' => 'Guru Kelas',
                'username' => 'guru_alfiyah',
                'status' => 'Aktif',
                'avatarColor' => 'emerald',
            ]],
            'students' => [[
                'id' => 'murid-callista',
                'nis' => '2026001',
                'nisn' => '0098765432',
                'name' => 'Callista Azzahra',
                'nickname' => 'Callista',
                'nik' => '3271010101200001',
                'gender' => 'P',
                'birthPlace' => 'Bogor',
                'birthDate' => '2020-01-15',
                'religion' => 'Islam',
                'address' => 'Bogor',
                'fatherName' => 'Budi Azzam',
                'motherName' => 'Siti Aminah',
                'guardianPhone' => '081234567891',
                'classId' => 'kelas-a1',
                'className' => 'Kelas A1',
                'rombelId' => 'rombel-al-quddus',
                'rombelName' => 'Al Quddus',
                'rombelTeacherName' => 'Ibu Alfiyah Nurazizah',
                'entryYear' => '2026',
                'username' => 'callista',
                'status' => 'Aktif',
                'avatarColor' => 'rose',
            ]],
            'classes' => [[
                'id' => 'kelas-a1',
                'name' => 'Kelas A1',
                'code' => 'A1',
                'ageGroup' => '4 - 5 Tahun',
                'teacherId' => 'guru-alfiyah',
                'teacherName' => 'Ibu Alfiyah Nurazizah',
                'academicYear' => '2026/2027',
                'capacity' => 20,
                'studentCount' => 1,
                'status' => 'Aktif',
            ]],
            'rombels' => [[
                'id' => 'rombel-al-quddus',
                'name' => 'Al Quddus',
                'fullName' => 'Rombel Al Quddus',
                'classId' => 'kelas-a1',
                'className' => 'Kelas A1',
                'teacherId' => 'guru-alfiyah',
                'teacherName' => 'Ibu Alfiyah Nurazizah',
                'capacity' => 20,
                'studentCount' => 1,
                'color' => 'emerald',
            ]],
            'users' => [[
                'id' => '1',
                'username' => 'admin',
                'name' => 'Ustadzah Aminah, S.Kom',
                'role' => 'admin',
                'email' => 'admin@example.com',
            ]],
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
