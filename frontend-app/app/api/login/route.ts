import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const identifier = body.identifier || body.username || body.email;
    const password = body.password;
    const role = body.role;

    if (!identifier || !password) {
      return NextResponse.json(
        { message: "Username/Email dan Password wajib diisi" },
        { status: 400 }
      );
    }

    const isEmail = identifier.includes("@");

    // Pastikan hanya kirim SALAH SATU field, jangan keduanya
    const payload = isEmail
      ? { email: identifier, password: password, role: role}
      : { username: identifier, password: password, role: role};

    // Tambah log untuk verifikasi
    console.log("Payload yang dikirim:", JSON.stringify(payload));

    const res = await fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const contentType = res.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const textError = await res.text();
      console.error("Backend Error (Non-JSON):", textError);
      return NextResponse.json({ message: "Backend tidak merespon dalam format JSON" }, { status: 502 });
    }

    // ✅ GANTI BAGIAN INI — tambah log + errors
    if (!res.ok) {
      console.error("Backend Error Response:", JSON.stringify(data, null, 2)); // <-- lihat di terminal
      return NextResponse.json(
        { 
          message: data.message || "Login gagal, cek kembali kredensial anda",
          errors: data.errors
        },
        { status: res.status }
      );
    }

    const token = data.access_token;
    const user = data.user;

    if (!token) {
      return NextResponse.json({ message: "Token tidak ditemukan" }, { status: 500 });
    }

    const response = NextResponse.json({
      message: "Login Berhasil",
      user: user,
      token: token
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24,
    };

    response.cookies.set("token", token, cookieOptions);
    
    if (user && user.role) {
      response.cookies.set("role", user.role, cookieOptions);
    }

    return response;

  } catch (error: any) {
    console.error("Critical Login Error:", error);

    if (error.cause?.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { message: "Server backend (Port 8000) sedang mati." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { message: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}