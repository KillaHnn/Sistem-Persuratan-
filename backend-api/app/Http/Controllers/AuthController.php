<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $field = $request->get('login_field') ?? ($request->has('email') ? 'email' : 'username');
        $role = $request->input('role');

        $credentials = [
            $field => $request->input($field),
            'password' => $request->input('password'),
        ];

        $user = User::where($field, $request->input($field))
            ->where('role', $role)
            ->first();

        if (! $user) {
            return response()->json(['message' => 'Invalid credentials or role'], 401);
        }

        if (! Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();

        return response()->json(["message" => 'Login successful', 'user' => $user]);
    }
}
