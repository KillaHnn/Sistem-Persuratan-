"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    FileText, Clock, CheckCircle, RotateCcw,
    Archive, FilePlus2, ChevronRight, AlertCircle, Search
} from "lucide-react";

type SuratUmum = {
    id: number;
    jenis_surat: string;
    perihal: string;
    nomor_surat: string | null;
    status: string;
    tgl_permohonan: string;
};

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
    menunggu:       { label: "Menunggu",       color: "bg-yellow-100 text-yellow-700 border-yellow-200",   icon: Clock },
    diproses:       { label: "Diproses",       color: "bg-blue-100 text-blue-700 border-blue-200",         icon: Clock },
    dikembalikan:   { label: "Dikembalikan",   color: "bg-red-100 text-red-700 border-red-200",            icon: RotateCcw },
    diverifikasi:   { label: "Diverifikasi",   color: "bg-purple-100 text-purple-700 border-purple-200",   icon: CheckCircle },
    ditandatangani: { label: "Ditandatangani", color: "bg-green-100 text-green-700 border-green-200",      icon: CheckCircle },
    diarsipkan:     { label: "Diarsipkan",     color: "bg-gray-100 text-gray-700 border-gray-200",         icon: Archive },
};

const JENIS_MAP: Record<string, string> = {
    undangan: "Undangan",
    surat_tugas: "Surat Tugas",
    surat_pengantar: "Surat Pengantar",
    surat_keterangan: "Surat Keterangan",
    lainnya: "Lainnya",
};

export default function RiwayatPage() {
    const [surats, setSurats] = useState<SuratUmum[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [filterJenis, setFilterJenis] = useState("semua");

    const getToken = () => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("token") || "";
        }
        return "";
    };

    useEffect(() => {
        const fetchSurats = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/api/umum/surat", {
                    headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
                });
                if (!res.ok) throw new Error("Gagal memuat data");
                const data = await res.json();
                setSurats(data.data || []);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSurats();
    }, []);

    const filtered = surats.filter(s => {
        const matchSearch = s.perihal.toLowerCase().includes(search.toLowerCase()) ||
            (s.nomor_surat || "").toLowerCase().includes(search.toLowerCase());
        const matchJenis = filterJenis === "semua" || s.jenis_surat === filterJenis;
        return matchSearch && matchJenis;
    });

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Riwayat Surat</h1>
                    <p className="text-gray-500 mt-1">Semua permohonan surat yang pernah Anda ajukan</p>
                </div>
                <Link href="/umum/buat-surat"
                    className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl hover:bg-orange-600 transition shadow-lg shadow-orange-100 active:scale-95">
                    <FilePlus2 size={18} />
                    <span className="font-medium">Buat Surat Baru</span>
                </Link>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="flex items-center bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 flex-1 focus-within:ring-2 focus-within:ring-orange-100 transition">
                    <Search size={16} className="text-gray-400 mr-2 shrink-0" />
                    <input type="text" placeholder="Cari perihal atau nomor surat..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder:text-gray-400" />
                </div>

                {/* Jenis filter */}
                <select value={filterJenis} onChange={e => setFilterJenis(e.target.value)}
                    className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:ring-2 focus:ring-orange-100">
                    <option value="semua">Semua Jenis</option>
                    {Object.entries(JENIS_MAP).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                    ))}
                </select>
            </div>

            {/* List */}
            <div className="space-y-4">
                {error && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100">
                        <AlertCircle size={18} />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {loading ? (
                    [1, 2, 3, 4].map(i => (
                        <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
                    ))
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <FileText size={32} />
                        </div>
                        <h3 className="text-gray-900 font-medium">Tidak ada surat ditemukan</h3>
                        <p className="text-gray-500 text-sm mt-1">
                            {search ? `Tidak ada hasil untuk "${search}"` : "Belum ada riwayat surat"}
                        </p>
                    </div>
                ) : (
                    filtered.map((surat) => {
                        const st = STATUS_MAP[surat.status] || { label: surat.status, color: "bg-gray-100 text-gray-700 border-gray-200", icon: FileText };
                        const StIcon = st.icon;
                        return (
                            <Link key={surat.id} href={`/umum/riwayat/${surat.id}`}
                                className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-gray-100 bg-white hover:border-orange-200 hover:shadow-md transition-all">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-orange-50 text-orange-500 rounded-xl hidden sm:flex shrink-0">
                                        <FileText size={22} />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                                            {surat.perihal}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-gray-500">
                                            <span className="bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                                                {JENIS_MAP[surat.jenis_surat] || surat.jenis_surat}
                                            </span>
                                            <span>•</span>
                                            <span>{formatDate(surat.tgl_permohonan)}</span>
                                            {surat.nomor_surat && (
                                                <>
                                                    <span>•</span>
                                                    <span className="font-mono text-gray-600">{surat.nomor_surat}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 mt-4 sm:mt-0 shrink-0">
                                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${st.color}`}>
                                        <StIcon size={12} />
                                        {st.label}
                                    </span>
                                    <ChevronRight size={16} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
}
