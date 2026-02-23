<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'mahasiswa']);
    }

    public function test_mahasiswa_can_login_with_email()
    {
        $user = User::factory()->mahasiswa()->create([
            'email' => 'mhs@example.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->postJson('/api/login', [
            'role' => 'mahasiswa',
            'email' => 'mhs@example.com',
            'password' => 'password',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['access_token', 'user']);
    }

    public function test_admin_can_login_with_username()
    {
        $user = User::factory()->admin()->create([
            'username' => 'adminuser',
            'password' => bcrypt('password'),
        ]);

        $response = $this->postJson('/api/login', [
            'role' => 'admin',
            'username' => 'adminuser',
            'password' => 'password',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['access_token', 'user']);
    }

    public function test_admin_cannot_login_with_email_and_receives_403_not_502()
    {
        $user = User::factory()->admin()->create([
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->postJson('/api/login', [
            'role' => 'admin',
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);

        // This should return 422 because the middleware requires 'username' for admin
        $this->assertNotEquals(502, $response->getStatusCode());
        $response->assertStatus(422);
    }

    public function test_mahasiswa_cannot_login_with_username()
    {
        $user = User::factory()->mahasiswa()->create([
            'username' => 'mhsuser',
            'password' => bcrypt('password'),
        ]);

        $response = $this->postJson('/api/login', [
            'role' => 'mahasiswa',
            'username' => 'mhsuser',
            'password' => 'password',
        ]);

        // This should return 422 because the middleware requires 'email' for mahasiswa
        $response->assertStatus(422);
    }
}
