<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email'    => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users',
                function ($attribute, $value, $fail) {
                    $allowedDomains = ['apps.ipb.ac.id', 'student.ipb.ac.id'];
                    $domain = strtolower(substr(strrchr($value, '@'), 1));
                    if (!in_array($domain, $allowedDomains)) {
                        $fail('Registrasi hanya diperbolehkan menggunakan Email resmi civitas akademika IPB (@apps.ipb.ac.id atau @student.ipb.ac.id).');
                    }
                },
            ],
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'pemohon',
            'is_active' => true,
        ]);

        $user->assignRole('pemohon');

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer'
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required_without:username|email',
            'username' => 'required_without:email',
            'password' => 'required',
        ]);

        $field = $request->get('login_field') ?? ($request->has('email') ? 'email' : 'username');

        $credentials = [
            $field => $request->input($field),
            'password' => $request->input('password'),
        ];

        if (! Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            "message" => 'Login successful',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer'
        ]);
    }

    /**
     * Logout — revoke current Sanctum token.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
