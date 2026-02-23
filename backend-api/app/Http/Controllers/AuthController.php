<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
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

        // Enforce role-based login constraints
        if ($user->role === 'mahasiswa') {
            if ($field !== 'email') {
                return response()->json(['message' => 'Mahasiswa must login with Email'], 403);
            }
        } else {
            // If user is NOT mahasiswa, they MUST use username
            if ($field !== 'username') {
                return response()->json(['message' => 'Staff/Admin must login with Username'], 403);
            }
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            "message" => 'Login successful',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer'
        ]);
    }
}
