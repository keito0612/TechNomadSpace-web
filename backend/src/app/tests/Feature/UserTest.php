<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /**
     * 認証トークン付きヘッダーを取得
     */
    private function authHeaders(User $user): array
    {
        $token = $user->createToken('test-token')->plainTextToken;
        return ['Authorization' => "Bearer {$token}"];
    }

    /**
     * ユーザーを作成できることをテスト
     */
    public function testCreateUser(): void
    {
        User::create([
            'name' => 'テストユーザー',
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $this->assertDatabaseHas('users', [
            'name' => 'テストユーザー',
            'email' => 'test@example.com',
        ]);
    }

    /**
     * ユーザーをFactoryで作成できることをテスト
     */
    public function test_can_create_user_with_factory(): void
    {
        $user = User::factory()->create();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'email' => $user->email,
        ]);
    }

    /**
     * ユーザー情報を更新できることをテスト
     */
    public function test_can_update_user(): void
    {
        $user = User::factory()->create();

        $user->update(['name' => '更新された名前']);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => '更新された名前',
        ]);
    }

    /**
     * ユーザーを削除できることをテスト
     */
    public function test_can_delete_user(): void
    {
        $user = User::factory()->create();
        $userId = $user->id;

        $user->delete();

        $this->assertDatabaseMissing('users', ['id' => $userId]);
    }

    /**
     * パスワードがハッシュ化されていることをテスト
     */
    public function test_password_is_hashed(): void
    {
        $user = User::factory()->create([
            'password' => 'plainpassword',
        ]);

        $this->assertNotEquals('plainpassword', $user->password);
    }

    /**
     * パスワードがシリアライズ時に隠されることをテスト
     */
    public function test_password_is_hidden_in_array(): void
    {
        $user = User::factory()->create();
        $userArray = $user->toArray();

        $this->assertArrayNotHasKey('password', $userArray);
        $this->assertArrayNotHasKey('remember_token', $userArray);
    }


    /**
     * ユーザーがレビューとのリレーションを持つことをテスト
     */
    public function test_user_has_reviews_relation(): void
    {
        $user = User::factory()->create();

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Relations\HasMany::class, $user->reviews());
    }

    /**
     * ユーザーがいいねとのリレーションを持つことをテスト
     */
    public function test_user_has_likes_relation(): void
    {
        $user = User::factory()->create();

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Relations\HasMany::class, $user->likes());
    }

    /**
     * 複数ユーザーを一度に作成できることをテスト
     */
    public function test_can_create_multiple_users(): void
    {
        User::factory()->count(5)->create();

        $this->assertCount(5, User::all());
    }

    /**
     * メールアドレスがユニークであることをテスト
     */
    public function test_email_must_be_unique(): void
    {
        User::factory()->create(['email' => 'duplicate@example.com']);

        $this->expectException(\Illuminate\Database\QueryException::class);

        User::factory()->create(['email' => 'duplicate@example.com']);
    }

    // ==================== API Tests ====================

    /**
     * GET /api/users/{id} - ユーザー取得APIテスト
     */
    public function test_api_get_user(): void
    {
        $user = User::factory()->create();

        $response = $this->getJson("/api/users/{$user->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'user' => ['id', 'name', 'email']
            ]);
    }

    /**
     * GET /api/users/{id} - 存在しないユーザーは404
     */
    public function test_api_get_user_not_found(): void
    {
        $response = $this->getJson('/api/users/99999');

        $response->assertStatus(404)
            ->assertJson(['message' => 'User Not Found']);
    }

    /**
     * GET /api/profile - 未認証は401
     */
    public function test_api_profile_unauthenticated(): void
    {
        $response = $this->getJson('/api/profile');

        $response->assertStatus(401);
    }

    /**
     * GET /api/profile - 認証済みでプロフィール取得
     */
    public function test_api_profile_authenticated(): void
    {
        $user = User::factory()->create();

        $response = $this->getJson('/api/profile', $this->authHeaders($user));

        $response->assertStatus(200)
            ->assertJsonStructure(['user']);
    }

    /**
     * DELETE /api/users/delete/{id} - 未認証は401
     */
    public function test_api_delete_user_unauthenticated(): void
    {
        $user = User::factory()->create();

        $response = $this->deleteJson("/api/users/delete/{$user->id}");

        $response->assertStatus(401);
    }

    /**
     * DELETE /api/users/delete/{id} - 認証済みでユーザー削除()
     */
    public function test_api_delete_user_authenticated(): void
    {
        $user = User::factory()->create();

        $response = $this->deleteJson(
            "/api/users/delete/{$user->id}",
            $this->authHeaders($user)
        );

        $response->assertStatus(200);
        $this->assertDatabaseMissing('users', ['id' =>  $user->id]);
    }

    /**
     * DELETE /api/users/delete/{id} - 存在しないユーザーは404
     */
    public function test_api_delete_user_not_found(): void
    {
        $user = User::factory()->create();

        $response = $this->deleteJson(
            '/api/users/delete/99999',
            $this->authHeaders($user)
        );

        $response->assertStatus(404);
    }

    /**
     * POST /api/users/edit/{id} - 未認証は401
     */
    public function test_api_edit_user_unauthenticated(): void
    {
        $user = User::factory()->create();

        $response = $this->postJson("/api/users/edit/{$user->id}", [
            'name' => '新しい名前',
        ]);

        $response->assertStatus(401);
    }

    /**
     * POST /api/users/edit/{id} - 認証済みでユーザー編集
     */
    public function test_api_edit_user_authenticated(): void
    {
        $user = User::factory()->create();

        $response = $this->postJson(
            "/api/users/edit/{$user->id}",
            ['name' => '新しい名前'],
            $this->authHeaders($user)
        );

        $response->assertStatus(200);
    }
}
