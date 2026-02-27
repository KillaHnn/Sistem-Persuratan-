import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
    // 1. Ambil token dan role dari cookies (karena kamu sudah set di API route)
    const token = request.cookies.get('token')?.value;
    const role = request.cookies.get('role')?.value;
    const { pathname } = request.nextUrl;

    // 2. Jika user mencoba akses halaman dashboard tapi tidak ada token
    if (!token && (pathname.startsWith('/admins') || pathname.startsWith('/mahasiswa') || pathname.startsWith('/div_'))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 3. Proteksi berdasarkan Role
    // Jika role admin mencoba masuk ke area mahasiswa, atau sebaliknya
    const userRole = role?.toLowerCase();

    if (pathname.startsWith('/admins') && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (pathname.startsWith('/mahasiswa') && userRole !== 'mahasiswa') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (pathname.startsWith('/div_sekolah') && userRole !== 'div_sekolah') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (pathname.startsWith('/div_prodi') && userRole !== 'div_prodi') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

// Tentukan halaman mana saja yang harus lewat middleware ini
export const config = {
    matcher: ['/admins/:path*', '/mahasiswa/:path*', '/div_sekolah/:path*', '/div_prodi/:path*'],
};