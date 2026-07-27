"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    Bell,
    FileText,
    Clock,
    AlertCircle,
    CheckCircle2,
    CornerUpLeft,
    ChevronRight,
    CheckCheck,
    Loader2,
    Info,
} from "lucide-react";

type Notifikasi = {
    id: number;
    surat_umum_id: number;
    judul: string;
    pesan: string;
    is_read: boolean;
    created_at: string;
};

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/umum`;

// Tentukan ikon & warna berdasarkan kata kunci judul
function getNotifStyle(judul: string) {
    const j = judul.toLowerCase();
    if (j.includes("selesai") || j.includes("ditandatangani") || j.includes("terarsip"))
        return { bg: "bg-green-50 border-green-200 text-green-600", Icon: CheckCircle2 };
    if (j.includes("dikembalikan"))
        return { bg: "bg-rose-50 border-rose-200 text-rose-600", Icon: CornerUpLeft };
    if (j.includes("menunggu") || j.includes("diproses"))
        return { bg: "bg-amber-50 border-amber-200 text-amber-600", Icon: Clock };
    if (j.includes("terverifikasi") || j.includes("diparaf"))
        return { bg: "bg-blue-50 border-blue-200 text-blue-600", Icon: CheckCircle2 };
    if (j.includes("baru") || j.includes("dibuat"))
        return { bg: "bg-purple-50 border-purple-200 text-purple-600", Icon: FileText };
    return { bg: "bg-gray-50 border-gray-200 text-gray-500", Icon: Info };
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function authHeaders() {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}`, Accept: "application/json" };
}

export default function NotifikasiPage() {
    const [notifs, setNotifs] = useState<Notifikasi[]>([]);
    const [loading, setLoading] = useState(true);
    const [markingAll, setMarkingAll] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/notifikasi`, {
                headers: authHeaders(),
            });
            if (!res.ok) throw new Error("Gagal memuat notifikasi");
            const json = await res.json();
            // Paginator: data ada di json.data
            setNotifs(json.data ?? []);
        } catch (e: any) {
            setError(e.message ?? "Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifs();
    }, [fetchNotifs]);

    const markAsRead = async (id: number) => {
        // Optimistic update
        setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
        try {
            await fetch(`${API_BASE}/notifikasi/${id}/read`, {
                method: "PATCH",
                headers: authHeaders(),
            });
        } catch (_) {
            // silent — UI sudah di-update optimistically
        }
    };

    const markAllRead = async () => {
        setMarkingAll(true);
        try {
            await fetch(`${API_BASE}/notifikasi/read-all`, {
                method: "POST",
                headers: authHeaders(),
            });
            setNotifs((prev) => prev.map((n) => ({ ...n, is_read: true })));
        } catch (_) {
        } finally {
            setMarkingAll(false);
        }
    };

    const unreadCount = notifs.filter((n) => !n.is_read).length;

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent flex items-center gap-2.5 sm:gap-3">
                        <Bell className="text-orange-500 shrink-0" size={28} />
                        Notifikasi
                    </h1>
                    <p className="text-sm sm:text-base text-gray-500 mt-1">
                        {loading
                            ? "Memuat pemberitahuan..."
                            : unreadCount > 0
                            ? `Anda memiliki ${unreadCount} pesan belum dibaca.`
                            : "Semua pesan telah dibaca."}
                    </p>
                </div>

                {unreadCount > 0 && !loading && (
                    <button
                        onClick={markAllRead}
                        disabled={markingAll}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-50 text-orange-600 text-sm font-medium hover:bg-orange-100 transition-colors disabled:opacity-60 w-full sm:w-auto"
                    >
                        {markingAll ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <CheckCheck size={16} />
                        )}
                        Tandai Semua Dibaca
                    </button>
                )}
            </div>

            {/* List Notifikasi */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800">Kotak Masuk Pemberitahuan</h2>
                    {!loading && notifs.length > 0 && (
                        <span className="text-xs sm:text-sm text-gray-400">{notifs.length} pemberitahuan</span>
                    )}
                </div>

                <div className="divide-y divide-gray-100">
                    {loading ? (
                        <div className="p-6 space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-4 animate-pulse">
                                    <div className="w-12 h-12 bg-gray-100 rounded-xl shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-100 rounded w-2/3" />
                                        <div className="h-3 bg-gray-100 rounded w-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-300">
                                <AlertCircle size={32} />
                            </div>
                            <h3 className="text-gray-900 font-medium">Gagal memuat notifikasi</h3>
                            <p className="text-gray-500 text-sm mt-1">{error}</p>
                            <button
                                onClick={fetchNotifs}
                                className="mt-4 px-4 py-2 text-sm rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition"
                            >
                                Coba Lagi
                            </button>
                        </div>
                    ) : notifs.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                <Bell size={32} />
                            </div>
                            <h3 className="text-gray-900 font-medium">Tidak ada notifikasi</h3>
                            <p className="text-gray-500 text-sm mt-1">
                                Semua pemberitahuan sistem akan muncul di sini.
                            </p>
                        </div>
                    ) : (
                        notifs.map((notif) => {
                            const { bg, Icon } = getNotifStyle(notif.judul);
                            return (
                                <Link
                                    key={notif.id}
                                    href={`/umum/riwayat/${notif.surat_umum_id}`}
                                    onClick={() => markAsRead(notif.id)}
                                    className={`flex items-start gap-4 p-5 transition-all hover:bg-gray-50 group cursor-pointer ${
                                        !notif.is_read ? "bg-orange-50/30 hover:bg-orange-50/50" : ""
                                    }`}
                                >
                                    {/* Icon Tipe Notif */}
                                    <div className={`p-3 rounded-xl border ${bg} shrink-0`}>
                                        <Icon size={20} />
                                    </div>

                                    {/* Konten Utama */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3
                                                className={`font-semibold group-hover:text-orange-600 transition-colors ${
                                                    !notif.is_read
                                                        ? "text-gray-900"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                {notif.judul}
                                            </h3>
                                            <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                                                {formatDate(notif.created_at)}
                                            </span>
                                        </div>
                                        <p
                                            className={`text-sm mt-1 leading-relaxed ${
                                                !notif.is_read ? "text-gray-700" : "text-gray-500"
                                            }`}
                                        >
                                            {notif.pesan}
                                        </p>
                                    </div>

                                    {/* Indikator & Chevron */}
                                    <div className="flex items-center gap-2 self-center shrink-0">
                                        {!notif.is_read && (
                                            <span
                                                className="w-2.5 h-2.5 bg-orange-500 rounded-full"
                                                title="Belum dibaca"
                                            />
                                        )}
                                        <ChevronRight
                                            size={16}
                                            className="text-gray-400 group-hover:text-orange-500 transition-colors"
                                        />
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}