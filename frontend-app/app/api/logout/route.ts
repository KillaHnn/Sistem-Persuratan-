import { NextResponse } from "next/server";

export async function POST() {
    try {
        const response = NextResponse.json({
            message: "Logout Berhasil",
        });

        // Clear cookies
        response.cookies.set("token", "", { maxAge: 0, path: "/" });
        response.cookies.set("role", "", { maxAge: 0, path: "/" });

        return response;
    } catch (error) {
        console.error("Logout Error:", error);
        return NextResponse.json(
            { message: "Terjadi kesalahan saat logout." },
            { status: 500 }
        );
    }
}
