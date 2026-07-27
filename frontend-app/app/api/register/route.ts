import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const payload = {
        name: body.name,
        username: body.username,
        email: body.email,
        password: body.password,
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
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

    if (!res.ok) {
      console.error("Backend Error Response:", JSON.stringify(data, null, 2));
      return NextResponse.json(
        { 
          message: data.message || "Registrasi gagal, periksa kembali data anda",
          errors: data.errors
        },
        { status: res.status }
      );
    }

    const token = data.access_token;
    const user = data.user;

    const response = NextResponse.json({
      message: "Registrasi Berhasil",
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
    console.error("Critical Register Error:", error);

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
