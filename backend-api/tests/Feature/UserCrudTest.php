<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class UserCrudTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Seed roles
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'mahasiswa']);
    }

    public function test_admin_can_view_users()
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->getJson('/api/users');

        $response->assertStatus(200);
    }

    public function test_non_admin_cannot_view_users()
    {
        $user = User::factory()->mahasiswa()->create();

        $response = $this->actingAs($user)->getJson('/api/users');

        $response->assertStatus(403);
    }

    public function test_admin_can_create_user()
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->postJson('/api/users', [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'username' => 'newuser',
            'password' => 'password',
            'role' => 'mahasiswa',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', ['email' => 'newuser@example.com', 'role' => 'mahasiswa']);
    }

    public function test_admin_can_update_user()
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->mahasiswa()->create();

        $response = $this->actingAs($admin)->putJson("/api/users/{$user->id}", [
            'name' => 'Updated Name',
            'role' => 'mahasiswa', 
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('users', ['id' => $user->id, 'name' => 'Updated Name']);
    }

    public function test_admin_can_delete_user()
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->create(); // Default is mahasiswa

        $response = $this->actingAs($admin)->deleteJson("/api/users/{$user->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }
}
