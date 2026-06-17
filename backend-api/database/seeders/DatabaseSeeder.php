<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Database\Seeders\UserSeeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Create an role 
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'div_sekolah']);
        Role::create(['name' => 'div_prodi']);
        Role::create(['name' => 'mahasiswa']);

        // Seed default users
        $this->call(UserSeeder::class);
    }
}
