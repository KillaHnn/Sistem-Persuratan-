<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class PersuratanUmumSeeder extends Seeder
{
    /**
     * Seed role & user dummy untuk modul persuratan umum.
     */
    public function run(): void
    {
        // Buat role baru (tidak menghapus role lama)
        $roles = ['superadmin', 'pemohon', 'sekretariat', 'kabag_tu', 'wakil_dekan'];

        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
        }

        // User dummy untuk setiap role
        $users = [
            [
                'name'     => 'Super Admin',
                'username' => 'admin01',
                'email'    => 'admin01@ssdmi.ac.id',
                'password' => Hash::make('password'),
                'role'     => 'superadmin',
                'unit_kerja' => 'Pusat',
                'is_active'  => true,
            ],
            [
                'name'     => 'Ahmad Pemohon',
                'username' => 'pemohon01',
                'email'    => 'pemohon01@ssdmi.ac.id',
                'password' => Hash::make('password'),
                'role'     => 'pemohon',
                'unit_kerja' => 'Prodi Informatika',
                'is_active'  => true,
            ],
            [
                'name'     => 'Siti Sekretariat',
                'username' => 'sekretariat01',
                'email'    => 'sekretariat01@ssdmi.ac.id',
                'password' => Hash::make('password'),
                'role'     => 'sekretariat',
                'unit_kerja' => 'Sekretariat Dekanat',
                'is_active'  => true,
            ],
            [
                'name'     => 'Budi Kabag TU',
                'username' => 'kabagtu01',
                'email'    => 'kabagtu01@ssdmi.ac.id',
                'password' => Hash::make('password'),
                'role'     => 'kabag_tu',
                'unit_kerja' => 'Bagian TU',
                'is_active'  => true,
            ],
            [
                'name'     => 'Dr. Rina Wakil Dekan',
                'username' => 'wadek01',
                'email'    => 'wadek01@ssdmi.ac.id',
                'password' => Hash::make('password'),
                'role'     => 'wakil_dekan',
                'unit_kerja' => 'Dekanat',
                'is_active'  => true,
            ],
        ];

        foreach ($users as $userData) {
            $role = $userData['role'];
            $user = User::firstOrCreate(
                ['username' => $userData['username']],
                $userData
            );
            $user->assignRole($role);
        }
    }
}
