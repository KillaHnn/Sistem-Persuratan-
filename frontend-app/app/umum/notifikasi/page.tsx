"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
    Bell, 
    FileText, 
    Clock, 
    AlertCircle, 
    CheckCircle2, 
    CornerUpLeft, 
    ChevronRight,
    Trash2
} from "lucide-react";

type Notifikasi = {
    id: number;
    surat_id: number;
    perihal: string;
    pesan: string;
    tipe: "info" | "peringatan" | "sukses" | "revisi"; // Menentukan warna & ikon
    tgl_notif: string;
    is_read: boolean;
};

export default function NotifikasiPage() {
    const [notifs, setNotifs] = useState<Notifikasi[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string>("pemohon");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserRole(user.role || "pemohon");
        }
        
        // Simulasi dapat data dari API backend berdasarkan role
        // Nanti kalau API sudah siap, tinggal ganti pakai fetch() ke endpoint laravel kamu
        simulasiDataNotif(userRole);
    }, [userRole]);

    const simulasiDataNotif = (role: string) => {
        setLoading(true);
        // Data dummy disesuaikan dengan alur flowchart per role kamu
        const dummyNotifs: Record<string, Notifikasi[]> = {
            pemohon: [
                { id: 1, surat_id: 101, perihal: "Surat Tugas KKN", pesan: "Surat Anda telah ditandatangani oleh Dekan dan siap diunduh.", tipe: "sukses", tgl_notif: "2026-05-26T09:00:00Z", is_read: false },
                { id: 2, surat_id: 102, perihal: "Permohonan Beasiswa", pesan: "Draft surat dikembalikan oleh Kabag TU dengan catatan: 'Format lampiran belum sesuai'.", tipe: "revisi", tgl_notif: "2026-05-25T14:30:00Z", is_read: true }
            ],
            sekretariat: [
                { id: 3, surat_id: 103, perihal: "Surat Keterangan Aktif", pesan: "Permohonan baru masuk dari Andi Wijaya. Segera siapkan draft surat.", tipe: "info", tgl_notif: "2026-05-26T09:15:00Z", is_read: false },
                { id: 4, surat_id: 102, perihal: "Permohonan Beasiswa", pesan: "Surat yang direvisi oleh Pemohon telah masuk kembali ke antrean.", tipe: "peringatan", tgl_notif: "2026-05-26T08:00:00Z", is_read: false }
            ],
            kabag_tu: [
                { id: 5, surat_id: 104, perihal: "Undangan Rapat Dekanat", pesan: "Sekretariat telah mengunggah draft surat baru. Menunggu verifikasi Anda.", tipe: "peringatan", tgl_notif: "2026-05-26T07:45:00Z", is_read: false }
            ]
        };

        setNotifs(dummyNotifs[role] || dummyNotifs["pemohon"]);
        setLoading(false);
    };

    const markAsRead = (id: number) => {
        setNotifs(notifs.map(n => n.id === id ? { ...n, is_read: true } : n));
        // TODO: Hit API backend untuk update status read di database Laravel
    };

    const deleteNotif = (id: number, e: React.MouseEvent) => {
        e.preventDefault(); // Mencegah klik Link ke-trigger
        setNotifs(notifs.filter(n => n.id !== id));
        // TODO: Hit API backend untuk delete notif
    };

    // Helper untuk style berdasarkan tipe notifikasi
    const getNotifStyle = (tipe: string) => {
        switch (tipe) {
            case "sukses": return { bg: "bg-green-50 border-green-100 text-green-600", icon: CheckCircle2 };
            case "revisi": return { bg: "bg-rose-50 border-rose-100 text-rose-600", icon: CornerUpLeft };
            case "peringatan": return { bg: "bg-amber-50 border-amber-100 text-amber-600", icon: Clock };
            default: return { bg: "bg-blue-50 border-blue-100 text-blue-600", icon: InfoIcon };
        }
    };

    const InfoIcon = FileText; // Fallback icon

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

    const unreadCount = notifs.filter(n => !n.is_read).length;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent flex items-center gap-3">
                        <Bell className="text-orange-500" size={32} /> Notifikasi
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {unreadCount > 0 ? `Anda memiliki ${unreadCount} pesan belum dibaca.` : "Semua pesan telah dibaca."}
                    </p>
                </div>
            </div>

            {/* List Notifikasi */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Kotak Masuk Pemberitahuan</h2>
                </div>

                <div className="divide-y divide-gray-100">
                    {loading ? (
                        <div className="p-6 space-y-4">
                            {[1, 2].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}
                        </div>
                    ) : notifs.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                <Bell size={32} />
                            </div>
                            <h3 className="text-gray-900 font-medium">Tidak ada notifikasi</h3>
                            <p className="text-gray-500 text-sm mt-1">Semua pemberitahuan sistem akan muncul di sini.</p>
                        </div>
                    ) : (
                        notifs.map((notif) => {
                            const style = getNotifStyle(notif.tipe);
                            const IconComponent = style.icon;

                            return (
                                <Link
                                    key={notif.id}
                                    href={`/umum/riwayat/${notif.surat_id}`}
                                    onClick={() => markAsRead(notif.id)}
                                    className={`flex items-start gap-4 p-5 transition-all hover:bg-gray-50 group cursor-pointer ${
                                        !notif.is_read ? "bg-orange-50/30 hover:bg-orange-50/50" : ""
                                    }`}
                                >
                                    {/* Icon Tipe Notif */}
                                    <div className={`p-3 rounded-xl border ${style.bg} shrink-0`}>
                                        <IconComponent size={20} />
                                    </div>

                                    {/* Konten Utama */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className={`font-semibold truncate group-hover:text-orange-600 transition-colors ${
                                                !notif.is_read ? "text-gray-900 font-bold" : "text-gray-700"
                                            }`}>
                                                {notif.perihal}
                                            </h3>
                                            <span className="text-xs text-gray-400 whitespace-nowrap">
                                                {formatDate(notif.tgl_notif)}
                                            </span>
                                        </div>
                                        <p className={`text-sm mt-1 leading-relaxed ${
                                            !notif.is_read ? "text-gray-800" : "text-gray-500"
                                        }`}>
                                            {notif.pesan}
                                        </p>
                                    </div>

                                    {/* Tombol Aksi Kanan */}
                                    <div className="flex items-center gap-2 self-center shrink-0">
                                        {!notif.is_read && (
                                            <span className="w-2 h-2 bg-orange-500 rounded-full" title="Belum dibaca" />
                                        )}
                                        <button
                                            onClick={(e) => deleteNotif(notif.id, e)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            title="Hapus notifikasi"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <ChevronRight size={16} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
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