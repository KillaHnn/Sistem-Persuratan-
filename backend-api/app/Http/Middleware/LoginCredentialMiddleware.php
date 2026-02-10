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
            ]);
            $request->merge(['login_field' => 'email']);
        } else {
            $request->validate([
                'username' => 'required',
                'password' => 'required',
            ]);
            $request->merge(['login_field' => 'username']);
        }

        return $next($request);
    }
}
