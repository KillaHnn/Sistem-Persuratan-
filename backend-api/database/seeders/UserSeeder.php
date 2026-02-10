<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin (login with username)
        $admin = User::updateOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Administrator',
                'email' => 'admin@example.com',
                'username' => 'admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );
        $admin->assignRole('admin');

        // Div Sekolah (login with username)
        $divSekolah = User::updateOrCreate(
            ['username' => 'divsekolah'],
            [
                'name' => 'Div Sekolah',
                'email' => 'divsekolah@example.com',
                'username' => 'divsekolah',
                'password' => Hash::make('password'),
                'role' => 'div_sekolah',
            ]
        );
        $divSekolah->assignRole('div_sekolah');

        // Div Prodi (login with username)
        $divProdi = User::updateOrCreate(
            ['username' => 'divprodi'],
            [
                'name' => 'Div Prodi',
                'email' => 'divprodi@example.com',
                'username' => 'divprodi',
                'password' => Hash::make('password'),
                'role' => 'div_prodi',
            ]
        );
        $divProdi->assignRole('div_prodi');

        // Mahasiswa (login with email)
        $mhs = User::updateOrCreate(
            ['email' => 'mhs@example.com'],
            [
                'name' => 'Mahasiswa',
                'email' => 'mhs@example.com',
                'username' => 'mhs',
                'password' => Hash::make('password'),
                'role' => 'mahasiswa',
            ]
        );
        $mhs->assignRole('mahasiswa');
    }
}
