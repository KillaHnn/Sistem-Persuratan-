import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
    // 1. Ambil token dan role dari cookies (karena kamu sudah set di API route)
    const token = request.cookies.get('token')?.value;
    const role = request.cookies.get('role')?.value;
    const { pathname } = request.nextUrl;

    // 2. Jika user mencoba akses halaman dashboard tapi tidak ada token
    if (!token && pathname.startsWith('/umum')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 3. Proteksi berdasarkan Role
    // Hanya pengguna yang sah dengan role persuratan umum yang boleh masuk
    const userRole = role?.toLowerCase();
    const validRoles = ['superadmin', 'pemohon', 'sekretariat', 'kabag_tu', 'wakil_dekan'];
    
    if (pathname.startsWith('/umum') && (!userRole || !validRoles.includes(userRole))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

// Tentukan halaman mana saja yang harus lewat middleware ini
export const config = {
    matcher: ['/umum/:path*'],
};