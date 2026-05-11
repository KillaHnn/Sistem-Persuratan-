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
        $email = $request->input('email');
        $username = $request->input('username');

        // If role is provided, follow existing specific logic
        if ($role === 'mahasiswa') {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ], [
                'email.required' => 'Mahasiswa wajib login menggunakan Email.',
                'email.email' => 'Format email mahasiswa tidak valid.'
            ]);
            $request->merge(['login_field' => 'email']);
        } elseif ($role) {
            $request->validate([
                'username' => 'required',
                'password' => 'required',
            ], [
                'username.required' => "Role $role wajib login menggunakan Username."
            ]);
            $request->merge(['login_field' => 'username']);
        } else {
            // If NO role is provided, validate that at least one identifier is present
            $request->validate([
                'email' => 'required_without:username',
                'username' => 'required_without:email',
                'password' => 'required',
            ]);

            // Determine login field dynamically
            if ($email) {
                $request->merge(['login_field' => 'email']);
            } else {
                $request->merge(['login_field' => 'username']);
            }
        }

        return $next($request);
    }
}
