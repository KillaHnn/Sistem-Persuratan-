<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class LoginCredentialMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $role = $request->input('role');

        if ($role === 'mahasiswa') {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ], [
                'email.required' => 'Mahasiswa wajib login menggunakan Email.',
                'email.email' => 'Format email mahasiswa tidak valid.'
            ]);
            $request->merge(['login_field' => 'email']);
        } else {
            $request->validate([
                'username' => 'required',
                'password' => 'required',
            ], [
                'username.required' => "Role $role wajib login menggunakan Username."
            ]);
            $request->merge(['login_field' => 'username']);
        }

        return $next($request);
    }
}