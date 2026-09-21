"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    FileText, Clock, CheckCircle, RotateCcw,
    Archive, ChevronRight, AlertCircle, Search, X,
} from "lucide-react";

type SuratUmum = {
    id: number;
    jenis_surat: string;
    perihal: string;
    nomor_surat: string | null;
    status: string;
    tgl_permohonan: string;
    hasil_arsip: string | null;
};

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
    menunggu: { label: "Diproses", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Clock },
    diproses: { label: "Diproses", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Clock },
    dikembalikan: { label: "Dikembalikan", color: "bg-red-100 text-red-700 border-red-200", icon: RotateCcw },
    diverifikasi: { label: "Diproses", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Clock },
    ditandatangani: { label: "Diproses", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Clock },
    selesai: { label: "Selesai", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
    diarsipkan: { label: "Diarsipkan", color: "bg-gray-100 text-gray-700 border-gray-200", icon: Archive },
};

const JENIS_MAP: Record<string, string> = {
    undangan: "Undangan",
    surat_tugas: "Surat Tugas",
    surat_pengantar: "Surat Pengantar",
    surat_keterangan: "Surat Keterangan",
    surat_permohonan: "Surat Permohonan",
    surat_keputusan: "Surat Keputusan",
    lainnya: "Lainnya",
};

const emptyForm = { tahun: "", jenis_surat: "", nomor_surat: "", perihal: "" };

type SearchModalProps = {
    title: string;
    subtitle: string;
    form: typeof emptyForm;
    onChange: (form: typeof emptyForm) => void;
    onApply: () => void;
    onReset: () => void;
    onClose: () => void;
};

function SearchModal({ title, subtitle, form, onChange, onApply, onReset, onClose }: SearchModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
                <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 text-orange-500 rounded-xl">
                            <Search size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-gray-900">{title}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1 bg-white rounded-full border border-gray-200"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-5 sm:p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tahun Surat</label>
                        <input
                            type="number"
                            placeholder="Contoh: 2026"
                            min="2000"
                            max="2099"
                            value={form.tahun}
                            onChange={e => onChange({ ...form, tahun: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jenis Surat</label>
                        <select
                            value={form.jenis_surat}
                            onChange={e => onChange({ ...form, jenis_surat: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 bg-gray-50"
                        >
                            <option value="">-- Semua Jenis --</option>
                            {Object.entries(JENIS_MAP).map(([k, v]) => (
                                <option key={k} value={k}>{v}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">No Surat</label>
                        <input
                            type="text"
                            placeholder="Contoh: 123/UN.1/DT/2026"
                            value={form.nomor_surat}
                            onChange={e => onChange({ ...form, nomor_surat: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 bg-gray-50 font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Perihal Surat</label>
                        <input
                            type="text"
                            placeholder="Kata kunci perihal surat..."
                            value={form.perihal}
                            onChange={e => onChange({ ...form, perihal: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 bg-gray-50"
                        />
                    </div>
                </div>

                <div className="p-5 sm:p-6 border-t border-gray-100 flex gap-3 bg-gray-50/50">
                    <button
                        type="button"
                        onClick={onReset}
                        className="flex-1 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition text-sm"
                    >
                        Reset
                    </button>
                    <button
                        type="button"
                        onClick={onApply}
                        className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition text-sm flex items-center justify-center gap-2"
                    >
                        <Search size={16} />
                        Cari
                    </button>
                </div>
            </div>
        </div>
    );
}
export default function RiwayatPage() {
    const [surats, setSurats] = useState<SuratUmum[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState("semua");
    const [userRole, setUserRole] = useState<string>("pemohon");

    // --- Pemohon: modal cari surat ---
    const [showCariModal, setShowCariModal] = useState(false);
    const [cariForm, setCariForm] = useState({ ...emptyForm });
    const [cariApplied, setCariApplied] = useState({ ...emptyForm });
    const [hasSearched, setHasSearched] = useState(false);

    // --- Sekretariat: modal cari arsip ---
    const [showArsipModal, setShowArsipModal] = useState(false);
    const [arsipForm, setArsipForm] = useState({ ...emptyForm });
    const [arsipApplied, setArsipApplied] = useState({ ...emptyForm });
    const [hasArsipSearched, setHasArsipSearched] = useState(false);

    const getToken = () => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("token") || "";
        }
        return "";
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserRole(user.role || "pemohon");
        }
        const fetchSurats = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
                const res = await fetch(`${baseUrl}/api/umum/surat`, {
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

    const getStatusInfo = (status: string) => {
        if (status === "diarsipkan" && userRole !== "sekretariat") {
            return { label: "Selesai", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle };
        }
        return STATUS_MAP[status] || { label: status, color: "bg-gray-100 text-gray-700 border-gray-200", icon: FileText };
    };

    // Tab filter khusus sekretariat
    const sekretariatTabs = [
        { key: "semua", label: "Semua Arsip" },
        { key: "berhasil", label: "Arsip (Selesai/Berhasil)" },
        { key: "ditolak", label: "Arsip (Dikembalikan/Ditolak)" },
    ];

    // Filter list berdasarkan role
    const displayList = surats.filter(s => {
        if (userRole === "sekretariat") {
            // Hanya arsip
            if (s.status !== "diarsipkan") return false;
            // Tab status
            if (filterStatus === "berhasil" && s.hasil_arsip !== "berhasil") return false;
            if (filterStatus === "ditolak" && s.hasil_arsip !== "ditolak") return false;
            // Filter dari modal cari arsip
            if (hasArsipSearched) {
                const tahun = arsipApplied.tahun.trim();
                const jenis = arsipApplied.jenis_surat.trim();
                const nomor = arsipApplied.nomor_surat.trim().toLowerCase();
                const perihal = arsipApplied.perihal.trim().toLowerCase();
                if (tahun && !new Date(s.tgl_permohonan).getFullYear().toString().includes(tahun)) return false;
                if (jenis && s.jenis_surat !== jenis) return false;
                if (nomor && !(s.nomor_surat || "").toLowerCase().includes(nomor)) return false;
                if (perihal && !s.perihal.toLowerCase().includes(perihal)) return false;
            }
            return true;
        }
        // Pemohon: filter dari modal cari
        if (hasSearched) {
            const tahun = cariApplied.tahun.trim();
            const jenis = cariApplied.jenis_surat.trim();
            const nomor = cariApplied.nomor_surat.trim().toLowerCase();
            const perihal = cariApplied.perihal.trim().toLowerCase();
            if (tahun && !new Date(s.tgl_permohonan).getFullYear().toString().includes(tahun)) return false;
            if (jenis && s.jenis_surat !== jenis) return false;
            if (nomor && !(s.nomor_surat || "").toLowerCase().includes(nomor)) return false;
            if (perihal && !s.perihal.toLowerCase().includes(perihal)) return false;
        }
        return true;
    });

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

    // Modal cari surat (pemohon)
    const handleApplyCari = () => {
        setCariApplied({ ...cariForm });
        setHasSearched(true);
        setShowCariModal(false);
    };
    const handleResetCari = () => {
        setCariForm({ ...emptyForm });
        setCariApplied({ ...emptyForm });
        setHasSearched(false);
        setShowCariModal(false);
    };
    const hasActiveFilter = hasSearched && Object.values(cariApplied).some(v => v.trim() !== "");

    // Modal cari arsip (sekretariat)
    const handleApplyArsip = () => {
        setArsipApplied({ ...arsipForm });
        setHasArsipSearched(true);
        setShowArsipModal(false);
    };
    const handleResetArsip = () => {
        setArsipForm({ ...emptyForm });
        setArsipApplied({ ...emptyForm });
        setHasArsipSearched(false);
        setShowArsipModal(false);
    };
    const hasArsipFilter = hasArsipSearched && Object.values(arsipApplied).some(v => v.trim() !== "");

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Riwayat Surat</h1>
                    <p className="text-sm sm:text-base text-gray-500 mt-1">
                        {userRole === "sekretariat"
                            ? "Semua permohonan surat yang masuk ke sekretariat"
                            : "Semua permohonan surat yang pernah Anda ajukan"}
                    </p>
                </div>

                {/* Tombol Cari: tampil untuk semua role */}
                <button
                    onClick={() => {
                        if (userRole === "sekretariat") {
                            setArsipForm({ ...arsipApplied });
                            setShowArsipModal(true);
                        } else {
                            setCariForm({ ...cariApplied });
                            setShowCariModal(true);
                        }
                    }}
                    className="flex items-center justify-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl hover:bg-orange-600 transition shadow-lg shadow-orange-100 active:scale-95 text-sm font-medium w-full sm:w-auto"
                >
                    <Search size={18} />
                    <span>Cari Surat</span>
                </button>
            </div>

            {/* Badge filter aktif (pemohon) */}
            {userRole !== "sekretariat" && hasActiveFilter && (
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="font-medium text-gray-600 text-xs">Filter aktif:</span>
                    {cariApplied.tahun && <span className="bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Tahun: {cariApplied.tahun}</span>}
                    {cariApplied.jenis_surat && <span className="bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Jenis: {JENIS_MAP[cariApplied.jenis_surat] || cariApplied.jenis_surat}</span>}
                    {cariApplied.nomor_surat && <span className="bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full text-xs font-medium">No: {cariApplied.nomor_surat}</span>}
                    {cariApplied.perihal && <span className="bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Perihal: {cariApplied.perihal}</span>}
                    <button onClick={handleResetCari} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium"><X size={13} /> Reset</button>
                </div>
            )}

            {/* Badge filter aktif (sekretariat) */}
            {userRole === "sekretariat" && hasArsipFilter && (
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="font-medium text-gray-600 text-xs">Filter aktif:</span>
                    {arsipApplied.tahun && <span className="bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Tahun: {arsipApplied.tahun}</span>}
                    {arsipApplied.jenis_surat && <span className="bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Jenis: {JENIS_MAP[arsipApplied.jenis_surat] || arsipApplied.jenis_surat}</span>}
                    {arsipApplied.nomor_surat && <span className="bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full text-xs font-medium">No: {arsipApplied.nomor_surat}</span>}
                    {arsipApplied.perihal && <span className="bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Perihal: {arsipApplied.perihal}</span>}
                    <button onClick={handleResetArsip} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium"><X size={13} /> Reset</button>
                </div>
            )}

            {/* Tab Status — hanya sekretariat, di luar modal */}
            {userRole === "sekretariat" && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4">
                    <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200 overflow-x-auto gap-1">
                        {sekretariatTabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setFilterStatus(tab.key)}
                                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${filterStatus === tab.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* List */}
            <div className="space-y-3 sm:space-y-4">
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
                ) : displayList.length === 0 ? (
                    <div className="text-center py-16 sm:py-20 bg-white rounded-3xl border border-gray-100">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <FileText size={32} />
                        </div>
                        <h3 className="text-gray-900 font-medium">Tidak ada surat ditemukan</h3>
                        <p className="text-gray-500 text-sm mt-1">
                            {hasArsipFilter || hasActiveFilter
                                ? "Tidak ada hasil untuk filter yang dipilih"
                                : "Belum ada riwayat surat"}
                        </p>
                    </div>
                ) : (
                    displayList.map((surat) => {
                        const st = getStatusInfo(surat.status);
                        const StIcon = st.icon;
                        return (
                            <Link key={surat.id} href={`/umum/riwayat/${surat.id}`}
                                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border border-gray-100 bg-white hover:border-orange-200 hover:shadow-md transition-all gap-3 sm:gap-4">
                                <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                                    <div className="p-3 bg-orange-50 text-orange-500 rounded-xl hidden sm:flex shrink-0">
                                        <FileText size={22} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors truncate text-sm sm:text-base">
                                            {surat.perihal}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1 text-xs text-gray-500">
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
                                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
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

            {/* ===== MODAL CARI SURAT (Pemohon) ===== */}
            {showCariModal && (
                <SearchModal
                    title="Cari Surat"
                    subtitle="Masukkan kriteria pencarian surat"
                    form={cariForm}
                    onChange={f => setCariForm(f)}
                    onApply={handleApplyCari}
                    onReset={handleResetCari}
                    onClose={() => setShowCariModal(false)}
                />
            )}

            {/* ===== MODAL CARI ARSIP (Sekretariat) ===== */}
            {showArsipModal && (
                <SearchModal
                    title="Cari Arsip Surat"
                    subtitle="Masukkan kriteria pencarian arsip"
                    form={arsipForm}
                    onChange={f => setArsipForm(f)}
                    onApply={handleApplyArsip}
                    onReset={handleResetArsip}
                    onClose={() => setShowArsipModal(false)}
                />
            )}
        </div>
    );
}
