"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    FileText, Clock, CheckCircle, XCircle, RotateCcw, Archive,
    ArrowLeft, User, Calendar, Hash, MessageSquare, Paperclip, AlertCircle
} from "lucide-react";

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
    menunggu:       { label: "Diproses",       color: "text-blue-700",    bg: "bg-blue-100" },
    diproses:       { label: "Diproses",       color: "text-blue-700",    bg: "bg-blue-100" },
    dikembalikan:   { label: "Dikembalikan",   color: "text-red-700",     bg: "bg-red-100" },
    diverifikasi:   { label: "Diproses",       color: "text-blue-700",    bg: "bg-blue-100" },
    ditandatangani: { label: "Diproses",       color: "text-blue-700",    bg: "bg-blue-100" },
    selesai:        { label: "Selesai",        color: "text-green-700",   bg: "bg-green-100" },
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
    { status: "ditandatangani", label: "Ditandatangani Dekan",   actor: "Sekretariat" },
    { status: "selesai",        label: "Surat Selesai",          actor: "Sistem" },
    { status: "diarsipkan",     label: "Diarsipkan",             actor: "Sekretariat" },
];

const STATUS_ORDER = ["menunggu", "diproses", "diverifikasi", "ditandatangani", "selesai", "diarsipkan"];

export default function DetailSuratPage() {
    const params = useParams();
    const router = useRouter();
    const [surat, setSurat] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null)
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const [catatan, setCatatan] = useState("");
    const [showRejectModal, setRejectModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showProsesModal, setShowProsesModal] = useState(false);
    const [klasifikasi, setKlasifikasi] = useState({ primerId: "", sekunderId: "", tersierId: "" });
    const [primers, setPrimers] = useState<any[]>([]);
    const [sekunders, setSekunders] = useState<any[]>([]);
    const [tersiers, setTersiers] = useState<any[]>([]);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    useEffect(() => {
        if (showProsesModal && primers.length === 0) {
            fetch(`${API_BASE}/api/klasifikasi/primer`, {
                headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" }
            })
            .then(res => res.json())
            .then(data => setPrimers(data.data || data));
        }
    }, [showProsesModal]);

    useEffect(() => {
        if (klasifikasi.primerId) {
            fetch(`${API_BASE}/api/klasifikasi/sekunder/${klasifikasi.primerId}`, {
                headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" }
            })
            .then(res => res.json())
            .then(data => { setSekunders(data.data || data); setKlasifikasi(prev => ({ ...prev, sekunderId: "", tersierId: "" })); setTersiers([]); });
        }
    }, [klasifikasi.primerId]);

    useEffect(() => {
        if (klasifikasi.sekunderId) {
            fetch(`${API_BASE}/api/klasifikasi/tersier/${klasifikasi.sekunderId}`, {
                headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" }
            })
            .then(res => res.json())
            .then(data => { setTersiers(data.data || data); setKlasifikasi(prev => ({ ...prev, tersierId: "" })); });
        }
    }, [klasifikasi.sekunderId]);

    useEffect(() =>{
        if(typeof window !== "undefined"){
            const u = localStorage.getItem("user");
            if (u){
                try {
                    setUser(JSON.parse(u));
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }, []);

    const getToken = () => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("token") || "";
        }
        return "";
    };

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/umum/surat/${params.id}`, {
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

    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [pendingAction, setPendingAction] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setSelectedFile(file);
        if (pendingAction && file) {
            submitAction(pendingAction, file);
        }
    };

    const submitAction = async (action: string, file?: File) => {
        setActionLoading(true);
        setActionError(null);
        try {
            const token = getToken();
            let body: any = null;
            let headers: any = {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            };
            if (file) {
                const form = new FormData();
                form.append("file", file);
                if (action === "kembalikan") {
                    form.append("catatan", catatan);
                }
                if (action === "proses" && klasifikasi.primerId) {
                    form.append("klasifikasi_primer_id", klasifikasi.primerId);
                    form.append("klasifikasi_sekunder_id", klasifikasi.sekunderId);
                    form.append("klasifikasi_tersier_id", klasifikasi.tersierId);
                }
                body = form;
                // Note: fetch will set correct multipart headers automatically
            } else if (action === "kembalikan") {
                body = JSON.stringify({ catatan });
                headers["Content-Type"] = "application/json";
            }

            const res = await fetch(`${API_BASE}/api/umum/surat/${params.id}/${action}`, {
                method: "POST",
                headers,
                body,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Gagal memproses aksi.");

            setSurat(data.data);
            setCatatan("");
            setRejectModal(false);
            setSuccessMessage(`Surat berhasil diproses dengan aksi: ${action}`);
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 3000);
        } catch (e: any) {
            setActionError(e.message);
        } finally {
            setActionLoading(false);
            setPendingAction(null);
            setSelectedFile(null);
            setShowProsesModal(false);
        }
    };

    const handleApprovalAction = (action: string) => {
        // Actions requiring file upload
        if (action === "proses") {
            if (surat.nomor_surat_id) {
                setPendingAction(action);
                const fileInput = document.getElementById("file-upload-input");
                fileInput?.click();
            } else {
                setShowProsesModal(true);
            }
        } else if (["paraf", "tandatangan"].includes(action)) {
            setPendingAction(action);
            // trigger hidden file input
            const fileInput = document.getElementById("file-upload-input");
            fileInput?.click();
        } else {
            submitAction(action);
        }
    };


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

    const statusInfo = (surat.status === "diarsipkan" && user?.role !== "sekretariat")
        ? { label: "Selesai", color: "text-green-700", bg: "bg-green-100" }
        : STATUS_MAP[surat.status] || { label: surat.status, color: "text-gray-700", bg: "bg-gray-100" };
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
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-3 sm:p-4 bg-orange-50 text-orange-500 rounded-2xl shrink-0">
                            <FileText size={28} />
                        </div>
                        <div className="min-w-0">
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                {JENIS_MAP[surat.jenis_surat] || surat.jenis_surat}
                            </span>
                            <h1 className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5">{surat.perihal}</h1>
                        </div>
                    </div>
                    <span className={`self-start sm:self-auto flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold shrink-0 ${statusInfo.bg} ${statusInfo.color}`}>
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

            {/* Notice Penolakan */}
            {surat.status === "dikembalikan" && (
                <div className="bg-red-50 border border-red-200 rounded-3xl p-6 flex items-start gap-4">
                    <div className="p-3 bg-red-100 text-red-600 rounded-2xl shrink-0">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <h3 className="text-red-800 font-bold text-lg mb-1">Permohonan Dikembalikan / Ditolak</h3>
                        <p className="text-red-600 text-sm">
                            Surat ini telah dikembalikan dan tidak dapat dilanjutkan prosesnya. Silakan buat permohonan baru jika diperlukan.
                        </p>
                    </div>
                </div>
            )}

            {/* Panel Tindakan Validasi dipindah ke bawah */}

            {/* Modal Input Catatan Penolakan (Kembalikan) */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
                        <h3 className="text-lg font-bold text-gray-900">Alasan Pengembalian / Revisi</h3>
                        <p className="text-sm text-gray-500">
                            Berikan catatan detail mengapa surat ini dikembalikan agar pemohon/sekretariat dapat merevisinya.
                        </p>
                        <textarea
                            value={catatan}
                            onChange={(e) => setCatatan(e.target.value)}
                            placeholder="Tulis alasan minimal 5 karakter..."
                            className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 h-28"
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={() => setRejectModal(false)}
                                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => handleApprovalAction("kembalikan")}
                                disabled={catatan.trim().length < 5 || actionLoading}
                                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition disabled:opacity-50"
                            >
                                Kirim Catatan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Sukses (In-app popup) */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-300">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full flex flex-col items-center text-center space-y-4 shadow-2xl">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                            <CheckCircle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Berhasil!</h3>
                        <p className="text-gray-500 text-sm">
                            {successMessage}
                        </p>
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl transition"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Proses Sekretariat */}
            {showProsesModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
                        <h3 className="text-lg font-bold text-gray-900">Proses & Buat Nomor Surat</h3>
                        <p className="text-sm text-gray-500">
                            Pilih klasifikasi untuk men-generate nomor surat dan unggah draft dokumen awal.
                        </p>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Klasifikasi Primer</label>
                                <select 
                                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm"
                                    value={klasifikasi.primerId}
                                    onChange={e => setKlasifikasi(p => ({ ...p, primerId: e.target.value }))}
                                >
                                    <option value="">-- Pilih Primer --</option>
                                    {primers.map((p: any) => <option key={p.id} value={p.id}>{p.kode} - {p.nama}</option>)}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Klasifikasi Sekunder</label>
                                <select 
                                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm"
                                    value={klasifikasi.sekunderId}
                                    onChange={e => setKlasifikasi(p => ({ ...p, sekunderId: e.target.value }))}
                                    disabled={!klasifikasi.primerId}
                                >
                                    <option value="">-- Pilih Sekunder --</option>
                                    {sekunders.map((s: any) => <option key={s.id} value={s.id}>{s.kode} - {s.nama}</option>)}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Klasifikasi Tersier</label>
                                <select 
                                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm"
                                    value={klasifikasi.tersierId}
                                    onChange={e => setKlasifikasi(p => ({ ...p, tersierId: e.target.value }))}
                                    disabled={!klasifikasi.sekunderId}
                                >
                                    <option value="">-- Pilih Tersier --</option>
                                    {tersiers.map((t: any) => <option key={t.id} value={t.id}>{t.kode} - {t.nama}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Unggah Draft Surat (.pdf/.docx)</label>
                                <input 
                                    type="file" 
                                    accept=".pdf,.docx"
                                    className="w-full p-2 border border-gray-200 rounded-xl text-sm"
                                    onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-2">
                            <button
                                onClick={() => { setShowProsesModal(false); setSelectedFile(null); }}
                                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => submitAction("proses", selectedFile as File)}
                                disabled={!klasifikasi.tersierId || !selectedFile || actionLoading}
                                className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition disabled:opacity-50"
                            >
                                {actionLoading ? "Menyimpan..." : "Proses & Buat Draft"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Progress Tracker */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-8">
                <h2 className="text-base font-bold text-gray-800 mb-6">Progres Persetujuan</h2>
                <div className="relative">
                    {/* Hidden file input for upload actions */}
                    <input type="file" id="file-upload-input" className="hidden" accept=".pdf,.docx" onChange={handleFileChange} />

                    {/* Tentukan apakah surat ditolak */}
                    {(() => {
                        const isRejected = surat.status === "dikembalikan" || 
                            (surat.status === "diarsipkan" && surat.hasil_arsip === "ditolak");

                        // Langkah-langkah yang ditampilkan — kalau ditolak, ganti step setelah yang dicapai
                        const stepsToRender = [...APPROVAL_STEPS];

                        // Hitung berapa step yang sudah dilalui sebelum ditolak
                        // Cek dari approval_logs: step terakhir sebelum dikembalikan
                        let rejectedAfterIndex = 0;
                        if (isRejected) {
                            // Cari step sejauh mana sudah diproses berdasarkan approval_logs
                            const logAksis = (surat.approval_logs || []).map((l: any) => l.aksi);
                            if (logAksis.includes("diverifikasi")) rejectedAfterIndex = 2; // sampai verifikasi
                            else if (logAksis.includes("diproses")) rejectedAfterIndex = 1;  // sampai diproses
                            else rejectedAfterIndex = 0; // langsung ditolak dari menunggu
                        }

                        return (
                            <>
                                {/* Vertical line */}
                                <div className={`absolute left-4 top-4 bottom-4 w-0.5 ${
                                    isRejected ? "bg-red-100" : "bg-gray-100"
                                }`} />

                                <div className="space-y-6">
                                    {stepsToRender.map((step, i) => {
                                        // Step sudah dilalui (normal/berjalan)
                                        const isDoneNormal = !isRejected && STATUS_ORDER.indexOf(step.status) <= currentStepIndex;

                                        // Step sudah dilalui sebelum ditolak
                                        const isDoneBeforeRejection = isRejected && i <= rejectedAfterIndex;

                                        // Step ini adalah step saat ini dan surat ditolak (hanya step pertama yg done)
                                        const isCurrent = step.status === surat.status;

                                        // Sembunyikan step setelah titik penolakan jika ditolak
                                        if (isRejected && i > rejectedAfterIndex) return null;

                                        return (
                                            <div key={step.status} className="flex items-start gap-5">
                                                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                                                    isDoneBeforeRejection
                                                        ? "border-red-400 bg-red-400"     // merah — dilalui sebelum ditolak
                                                        : isDoneNormal
                                                            ? "border-green-400 bg-green-400" // hijau — selesai normal
                                                            : "border-gray-200 bg-white"      // abu — belum diproses
                                                }`}>
                                                    {isDoneBeforeRejection
                                                        ? <XCircle size={16} className="text-white" />
                                                        : isDoneNormal
                                                            ? <CheckCircle size={16} className="text-white" />
                                                            : <span className="w-2 h-2 rounded-full bg-gray-300" />
                                                    }
                                                </div>
                                                <div className="pt-1">
                                                    <p className={`text-sm font-semibold ${
                                                        isDoneBeforeRejection ? "text-red-600"
                                                        : isDoneNormal ? "text-gray-800"
                                                        : "text-gray-400"
                                                    }`}>
                                                        {step.label}
                                                    </p>
                                                    <p className="text-xs text-gray-400">{step.actor}</p>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Step tambahan: Surat Ditolak (hanya muncul jika ditolak) */}
                                    {isRejected && (
                                        <div className="flex items-start gap-5">
                                            <div className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-red-500 bg-red-500">
                                                <XCircle size={16} className="text-white" />
                                            </div>
                                            <div className="pt-1">
                                                <p className="text-sm font-semibold text-red-600">Surat Ditolak / Dikembalikan</p>
                                                <p className="text-xs text-gray-400">Sekretariat</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        );
                    })()}
                </div>
            </div>

            {/* Detail Isi Surat */}
            {detail && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-8">
                    <h2 className="text-base font-bold text-gray-800 mb-6">Detail Isi Surat</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(detail)
                            .filter(([k]) => !["id", "surat_umum_id", "created_at", "updated_at"].includes(k))
                            .map(([k, v]) => {
                                let displayValue: React.ReactNode = String(v);
                                if (!v) {
                                    displayValue = <span className="text-gray-400 italic">-</span>;
                                } else if (k.includes('tanggal')) {
                                    displayValue = new Date(String(v)).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
                                }
                                
                                return (
                                    <div key={k} className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">
                                            {k.replace(/_/g, " ")}
                                        </p>
                                        <p className="text-sm text-gray-800 font-medium">
                                            {displayValue}
                                        </p>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}

            {/* Approval Logs */}
            {surat.approval_logs?.length > 0 && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-8">
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
                                            log.aksi === "dikembalikan" ? "bg-red-100 text-red-600"
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
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-8">
                    <h2 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Paperclip size={18} className="text-orange-500" />
                        Dokumen & Lampiran
                    </h2>
                    <div className="space-y-3">
                        {surat.dokumens.map((dok: any) => (
                            <a key={dok.id}
                                href={`${API_BASE}/storage/${dok.path_file}`}
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

            {/* Panel Tindakan Validasi */}
            {user && surat.status !== "diarsipkan" && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-8 space-y-4">
                    <h2 className="text-base font-bold text-gray-800">Panel Tindakan Validasi</h2>
                    
                    {actionError && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-start gap-2">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <p>{actionError}</p>
                        </div>
                    )}
                    
                    {/* 1. SELEKSI UNTUK SEKRETARIAT */}
                    {user.role === "sekretariat" && (
                        <div className="flex flex-col sm:flex-row gap-4">
                            {surat.status === "menunggu" && (
                                <>
                                    <button
                                        onClick={() => handleApprovalAction("proses")}
                                        disabled={actionLoading}
                                        className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl transition duration-300 disabled:opacity-50"
                                    >
                                        {actionLoading ? "Memproses..." : "Verifikasi (Setujui)"}
                                    </button>
                                    <button
                                        onClick={() => setRejectModal(true)}
                                        disabled={actionLoading}
                                        className="flex-1 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-2xl transition duration-300 disabled:opacity-50"
                                    >
                                        Kembalikan (Tolak)
                                    </button>
                                </>
                            )}

                            {surat.status === "diverifikasi" && (
                                <div className="w-full space-y-3">
                                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-sm text-blue-700">
                                        <p className="font-semibold mb-1">Berkas Siap Diunggah</p>
                                        <p>Surat telah diverifikasi oleh Kabag TU. Silakan upload berkas yang <strong>sudah ditandatangani fisik oleh Dekan</strong>.</p>
                                    </div>
                                    <button
                                        onClick={() => handleApprovalAction("tandatangan")}
                                        disabled={actionLoading}
                                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl transition duration-300 disabled:opacity-50"
                                    >
                                        {actionLoading ? "Mengupload..." : "Upload Berkas TTD Dekan"}
                                    </button>
                                </div>
                            )}
                            
                            {surat.status === "selesai" && (
                                <button
                                    onClick={() => handleApprovalAction("arsipkan")}
                                    disabled={actionLoading}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition duration-300 disabled:opacity-50"
                                >
                                    {actionLoading ? "Memproses..." : "Arsipkan Surat (Berhasil)"}
                                </button>
                            )}

                            {surat.status === "dikembalikan" && (
                                <button
                                    onClick={() => handleApprovalAction("arsipkan")}
                                    disabled={actionLoading}
                                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl transition duration-300 disabled:opacity-50"
                                >
                                    {actionLoading ? "Memproses..." : "Arsipkan Surat (Ditolak)"}
                                </button>
                            )}
                        </div>
                    )}

                    {/* 2. SELEKSI UNTUK KABAG TU */}
                    {user.role === "kabag_tu" && surat.status === "diproses" && (
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => handleApprovalAction("verifikasi")}
                                disabled={actionLoading}
                                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl transition duration-300 disabled:opacity-50"
                            >
                                Verifikasi (Setujui)
                            </button>
                            
                            <button
                                onClick={() => setRejectModal(true)}
                                disabled={actionLoading}
                                className="flex-1 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-2xl transition duration-300 disabled:opacity-50"
                            >
                                Kembalikan (Revisi / Tolak)
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
