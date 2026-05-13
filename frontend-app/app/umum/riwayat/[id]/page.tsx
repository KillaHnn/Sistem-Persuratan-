"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    FileText, Clock, CheckCircle, RotateCcw, Archive,
    ArrowLeft, User, Calendar, Hash, MessageSquare, Paperclip
} from "lucide-react";

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
    menunggu:       { label: "Menunggu",       color: "text-yellow-700",  bg: "bg-yellow-100" },
    diproses:       { label: "Diproses",       color: "text-blue-700",    bg: "bg-blue-100" },
    dikembalikan:   { label: "Dikembalikan",   color: "text-orange-700",  bg: "bg-orange-100" },
    diverifikasi:   { label: "Diverifikasi",   color: "text-purple-700",  bg: "bg-purple-100" },
    ditandatangani: { label: "Ditandatangani", color: "text-green-700",   bg: "bg-green-100" },
    diarsipkan:     { label: "Diarsipkan",     color: "text-gray-700",    bg: "bg-gray-100" },
};

const JENIS_MAP: Record<string, string> = {
    undangan: "Undangan",
    surat_tugas: "Surat Tugas",
    surat_pengantar: "Surat Pengantar",
    surat_keterangan: "Surat Keterangan",
    lainnya: "Lainnya",
};

const APPROVAL_STEPS = [
    { status: "menunggu",       label: "Permohonan Diajukan",    actor: "Pemohon" },
    { status: "diproses",       label: "Diproses Sekretariat",   actor: "Sekretariat" },
    { status: "diverifikasi",   label: "Diverifikasi Kabag TU",  actor: "Kabag TU" },
    { status: "ditandatangani", label: "Ditandatangani Dekan",   actor: "Dekan" },
    { status: "diarsipkan",     label: "Diarsipkan",             actor: "Sekretariat" },
];

const STATUS_ORDER = ["menunggu", "diproses", "diverifikasi", "ditandatangani", "diarsipkan"];

export default function DetailSuratPage() {
    const params = useParams();
    const router = useRouter();
    const [surat, setSurat] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getToken = () => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("token") || "";
        }
        return "";
    };

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/api/umum/surat/${params.id}`, {
                    headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
                });
                if (!res.ok) throw new Error("Surat tidak ditemukan");
                const data = await res.json();
                setSurat(data);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [params.id]);

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

    const currentStepIndex = surat ? STATUS_ORDER.indexOf(surat.status) : -1;

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 w-48 bg-gray-200 rounded-xl" />
                <div className="h-64 bg-gray-100 rounded-3xl" />
                <div className="h-40 bg-gray-100 rounded-3xl" />
            </div>
        );
    }

    if (error || !surat) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500">{error || "Surat tidak ditemukan"}</p>
                <button onClick={() => router.back()} className="mt-4 text-sm text-orange-600 underline">Kembali</button>
            </div>
        );
    }

    const statusInfo = STATUS_MAP[surat.status] || { label: surat.status, color: "text-gray-700", bg: "bg-gray-100" };
    const detail = surat.detail_undangan || surat.detail_surat_tugas || surat.detail_surat_pengantar ||
        surat.detail_surat_keterangan_umum || surat.detail_surat_lainnya;

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Back */}
            <button onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition text-sm font-medium">
                <ArrowLeft size={16} />
                Kembali ke Riwayat
            </button>

            {/* Header Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-orange-50 text-orange-500 rounded-2xl">
                            <FileText size={28} />
                        </div>
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                {JENIS_MAP[surat.jenis_surat] || surat.jenis_surat}
                            </span>
                            <h1 className="text-xl font-bold text-gray-900 mt-0.5">{surat.perihal}</h1>
                        </div>
                    </div>
                    <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold shrink-0 ${statusInfo.bg} ${statusInfo.color}`}>
                        {statusInfo.label}
                    </span>
                </div>

                {/* Meta Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                    <div className="flex items-center gap-3">
                        <Calendar size={16} className="text-gray-400 shrink-0" />
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Tanggal Permohonan</p>
                            <p className="text-sm text-gray-700 font-medium">{formatDate(surat.tgl_permohonan)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <User size={16} className="text-gray-400 shrink-0" />
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Pemohon</p>
                            <p className="text-sm text-gray-700 font-medium">{surat.pemohon?.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Hash size={16} className="text-gray-400 shrink-0" />
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Nomor Surat</p>
                            <p className="text-sm text-gray-700 font-medium font-mono">
                                {surat.nomor_surat || <span className="text-gray-400 italic font-sans">Belum ditetapkan</span>}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Tracker */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-base font-bold text-gray-800 mb-6">Progres Persetujuan</h2>
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-100" />

                    <div className="space-y-6">
                        {APPROVAL_STEPS.map((step, i) => {
                            const isDone = surat.status === "dikembalikan"
                                ? i === 0
                                : STATUS_ORDER.indexOf(step.status) <= currentStepIndex;
                            const isCurrent = step.status === surat.status;

                            return (
                                <div key={step.status} className="flex items-start gap-5">
                                    <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                                        isCurrent && surat.status === "dikembalikan"
                                            ? "border-orange-500 bg-orange-100"
                                            : isDone
                                                ? "border-green-400 bg-green-400"
                                                : "border-gray-200 bg-white"
                                    }`}>
                                        {isDone && surat.status !== "dikembalikan"
                                            ? <CheckCircle size={16} className="text-white" />
                                            : isCurrent && surat.status === "dikembalikan"
                                                ? <RotateCcw size={14} className="text-orange-500" />
                                                : <span className="w-2 h-2 rounded-full bg-gray-300" />
                                        }
                                    </div>
                                    <div className="pt-1">
                                        <p className={`text-sm font-semibold ${isDone ? "text-gray-800" : "text-gray-400"}`}>
                                            {step.label}
                                        </p>
                                        <p className="text-xs text-gray-400">{step.actor}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Detail Isi Surat */}
            {detail && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-base font-bold text-gray-800 mb-6">Detail Isi Surat</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(detail)
                            .filter(([k]) => !["id", "surat_umum_id", "created_at", "updated_at"].includes(k))
                            .map(([k, v]) => (
                                <div key={k} className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">
                                        {k.replace(/_/g, " ")}
                                    </p>
                                    <p className="text-sm text-gray-800 font-medium">
                                        {String(v) || <span className="text-gray-400 italic">-</span>}
                                    </p>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Approval Logs */}
            {surat.approval_logs?.length > 0 && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <MessageSquare size={18} className="text-orange-500" />
                        Catatan Proses
                    </h2>
                    <div className="space-y-4">
                        {surat.approval_logs.map((log: any) => (
                            <div key={log.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                                <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                                    <User size={16} className="text-orange-600" />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-semibold text-gray-800">{log.approver?.name}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                            log.aksi === "dikembalikan" ? "bg-orange-100 text-orange-600"
                                            : log.aksi === "ditandatangani" ? "bg-green-100 text-green-600"
                                            : "bg-blue-100 text-blue-600"
                                        }`}>
                                            {log.aksi}
                                        </span>
                                    </div>
                                    {log.catatan && <p className="text-sm text-gray-600">{log.catatan}</p>}
                                    <p className="text-xs text-gray-400 mt-1">{formatDate(log.created_at)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Dokumen Lampiran */}
            {surat.dokumens?.length > 0 && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Paperclip size={18} className="text-orange-500" />
                        Dokumen & Lampiran
                    </h2>
                    <div className="space-y-3">
                        {surat.dokumens.map((dok: any) => (
                            <a key={dok.id}
                                href={`http://127.0.0.1:8000/storage/${dok.path_file}`}
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-orange-50 border border-transparent hover:border-orange-200 rounded-2xl transition group">
                                <div className="flex items-center gap-3">
                                    <FileText size={18} className="text-orange-500" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 group-hover:text-orange-600 transition">
                                            {dok.nama_file}
                                        </p>
                                        <p className="text-xs text-gray-400 capitalize">
                                            {dok.tipe_dokumen.replace(/_/g, " ")} · v{dok.versi}
                                        </p>
                                    </div>
                                </div>
                                <ArrowLeft size={16} className="text-gray-400 rotate-[225deg] group-hover:text-orange-500 transition" />
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
