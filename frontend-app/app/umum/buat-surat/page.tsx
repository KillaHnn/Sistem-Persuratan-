"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    FilePlus2, ChevronDown, Upload, X,
    CalendarDays, MapPin, Users, FileText, Briefcase, AlertCircle, CheckCircle
} from "lucide-react";

type JenisSurat = "undangan" | "surat_tugas" | "surat_pengantar" | "surat_keterangan" | "lainnya";

const JENIS_OPTIONS = [
    { value: "undangan",         label: "Undangan",          desc: "Surat undangan untuk kegiatan atau rapat" },
    { value: "surat_tugas",      label: "Surat Tugas",       desc: "Penugasan dinas atau kegiatan luar" },
    { value: "surat_pengantar",  label: "Surat Pengantar",   desc: "Surat pengantar dokumen atau keperluan" },
    { value: "surat_keterangan", label: "Surat Keterangan",  desc: "Keterangan status atau keperluan tertentu" },
    { value: "lainnya",          label: "Lainnya",           desc: "Jenis surat lain yang tidak tercantum" },
];

export default function BuatSuratPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);
    const [jenisSurat, setJenisSurat] = useState<JenisSurat | "">("");
    const [perihal, setPerihal] = useState("");
    const [detail, setDetail] = useState<Record<string, string>>({});
    const [lampiran, setLampiran] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const getToken = () => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("token") || "";
        }
        return "";
    };

    const handleDetailChange = (key: string, value: string) => {
        setDetail(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("jenis_surat", jenisSurat);
            formData.append("perihal", perihal);
            Object.entries(detail).forEach(([k, v]) => formData.append(`detail[${k}]`, v));
            if (lampiran) formData.append("lampiran", lampiran);

            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
            const res = await fetch(`${baseUrl}/api/umum/surat`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    Accept: "application/json",
                },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Gagal membuat surat");

            setSuccess(true);
            setTimeout(() => router.push("/umum/dashboard"), 2000);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition text-sm text-gray-700 placeholder:text-gray-400";
    const labelClass = "block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5";

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4 animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle size={40} className="text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Permohonan Terkirim!</h2>
                    <p className="text-gray-500">Surat Anda telah berhasil diajukan dan sedang menunggu diproses oleh sekretariat.</p>
                    <p className="text-sm text-gray-400">Mengalihkan ke dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2.5 sm:gap-3">
                    <FilePlus2 className="text-orange-500 shrink-0" size={28} />
                    Buat Permohonan Surat
                </h1>
                <p className="text-sm sm:text-base text-gray-500 mt-1">Isi formulir berikut untuk mengajukan surat baru</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-2 sm:gap-3">
                {[
                    { num: 1, label: "Pilih Jenis Surat" },
                    { num: 2, label: "Isi Detail Surat" },
                ].map((s, i) => (
                    <div key={s.num} className="flex items-center gap-2 sm:gap-3 flex-1">
                        <div className={`flex items-center gap-2 ${step >= s.num ? "text-orange-600" : "text-gray-400"}`}>
                            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border-2 transition-colors ${
                                step >= s.num ? "bg-orange-500 border-orange-500 text-white" : "border-gray-300 text-gray-400"
                            }`}>
                                {s.num}
                            </div>
                            <span className="text-xs sm:text-sm font-medium">{s.label}</span>
                        </div>
                        {i < 1 && <div className={`flex-1 h-0.5 rounded ${step >= 2 ? "bg-orange-400" : "bg-gray-200"}`} />}
                    </div>
                ))}
            </div>

            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100">
                    <AlertCircle size={18} className="shrink-0" />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* STEP 1 – Pilih Jenis Surat */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {JENIS_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setJenisSurat(opt.value as JenisSurat)}
                                    className={`text-left p-4 sm:p-5 rounded-2xl border-2 transition-all ${
                                        jenisSurat === opt.value
                                            ? "border-orange-400 bg-orange-50"
                                            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm sm:text-base">{opt.label}</p>
                                            <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                                            jenisSurat === opt.value ? "border-orange-500 bg-orange-500" : "border-gray-300"
                                        }`}>
                                            {jenisSurat === opt.value && <div className="w-2 h-2 rounded-full bg-white" />}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            disabled={!jenisSurat}
                            onClick={() => setStep(2)}
                            className="w-full py-3.5 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99]"
                        >
                            Lanjut →
                        </button>
                    </div>
                )}

                {/* STEP 2 – Isi Detail */}
                {step === 2 && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 space-y-6">
                        {/* Perihal */}
                        <div>
                            <label className={labelClass}>Perihal / Tujuan Surat</label>
                            <input
                                type="text"
                                placeholder="Contoh: Permohonan Izin Mengikuti Seminar Nasional"
                                value={perihal}
                                onChange={e => setPerihal(e.target.value)}
                                required
                                className={inputClass}
                            />
                        </div>

                        {/* Dynamic Fields */}
                        <div className="border-t border-gray-100 pt-6 space-y-5">
                            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-orange-500 rounded-full inline-block" />
                                Detail {JENIS_OPTIONS.find(o => o.value === jenisSurat)?.label}
                            </h3>

                            {/* Undangan */}
                            {jenisSurat === "undangan" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="sm:col-span-2">
                                        <label className={labelClass}>Nama Kegiatan</label>
                                        <input type="text" required placeholder="Nama kegiatan yang diselenggarakan" className={inputClass}
                                            onChange={e => handleDetailChange("nama_kegiatan", e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Tanggal Kegiatan</label>
                                        <input type="date" required className={inputClass}
                                            onChange={e => handleDetailChange("tanggal_kegiatan", e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Waktu Mulai</label>
                                        <input type="time" required className={inputClass}
                                            onChange={e => handleDetailChange("waktu_mulai", e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Waktu Selesai (opsional)</label>
                                        <input type="time" className={inputClass}
                                            onChange={e => handleDetailChange("waktu_selesai", e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Tempat</label>
                                        <input type="text" required placeholder="Lokasi kegiatan" className={inputClass}
                                            onChange={e => handleDetailChange("tempat", e.target.value)} />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className={labelClass}>Ditujukan Kepada</label>
                                        <input type="text" required placeholder="Misal: Seluruh Dosen Prodi Informatika" className={inputClass}
                                            onChange={e => handleDetailChange("ditujukan_kepada", e.target.value)} />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className={labelClass}>Keterangan (opsional)</label>
                                        <textarea rows={3} placeholder="Informasi tambahan..." className={inputClass}
                                            onChange={e => handleDetailChange("keterangan", e.target.value)} />
                                    </div>
                                </div>
                            )}

                            {/* Surat Tugas */}
                            {jenisSurat === "surat_tugas" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className={labelClass}>Nama yang Ditugaskan</label>
                                        <input type="text" required placeholder="Nama lengkap" className={inputClass}
                                            onChange={e => handleDetailChange("nama_ditugaskan", e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>NIP (opsional)</label>
                                        <input type="text" placeholder="Nomor Induk Pegawai" className={inputClass}
                                            onChange={e => handleDetailChange("nip", e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Jabatan</label>
                                        <input type="text" required placeholder="Jabatan / posisi" className={inputClass}
                                            onChange={e => handleDetailChange("jabatan", e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Tempat Tugas</label>
                                        <input type="text" required placeholder="Lokasi tujuan" className={inputClass}
                                            onChange={e => handleDetailChange("tempat_tugas", e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Tanggal Mulai</label>
                                        <input type="date" required className={inputClass}
                                            onChange={e => handleDetailChange("tanggal_mulai", e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Tanggal Selesai</label>
                                        <input type="date" required className={inputClass}
                                            onChange={e => handleDetailChange("tanggal_selesai", e.target.value)} />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className={labelClass}>Tujuan Tugas</label>
                                        <textarea rows={3} required placeholder="Tujuan dan maksud penugasan..." className={inputClass}
                                            onChange={e => handleDetailChange("tujuan_tugas", e.target.value)} />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className={labelClass}>Dasar Penugasan (opsional)</label>
                                        <input type="text" placeholder="Misal: SK Dekan No. ..." className={inputClass}
                                            onChange={e => handleDetailChange("dasar_penugasan", e.target.value)} />
                                    </div>
                                </div>
                            )}

                            {/* Surat Pengantar */}
                            {jenisSurat === "surat_pengantar" && (
                                <div className="space-y-5">
                                    <div>
                                        <label className={labelClass}>Ditujukan Kepada</label>
                                        <input type="text" required placeholder="Nama instansi/pihak tujuan" className={inputClass}
                                            onChange={e => handleDetailChange("ditujukan_kepada", e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Keperluan</label>
                                        <textarea rows={3} required placeholder="Keperluan surat pengantar ini..." className={inputClass}
                                            onChange={e => handleDetailChange("keperluan", e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Lampiran Dokumen (opsional)</label>
                                        <input type="text" placeholder="Misal: Fotokopi KTP, Berkas Pendaftaran" className={inputClass}
                                            onChange={e => handleDetailChange("lampiran", e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Keterangan (opsional)</label>
                                        <textarea rows={2} className={inputClass}
                                            onChange={e => handleDetailChange("keterangan", e.target.value)} />
                                    </div>
                                </div>
                            )}

                            {/* Surat Keterangan */}
                            {jenisSurat === "surat_keterangan" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className={labelClass}>Nama yang Diterangkan</label>
                                        <input type="text" required placeholder="Nama lengkap" className={inputClass}
                                            onChange={e => handleDetailChange("nama_yang_diterangkan", e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>NIP (opsional)</label>
                                        <input type="text" placeholder="Nomor Induk Pegawai" className={inputClass}
                                            onChange={e => handleDetailChange("nip", e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Jabatan (opsional)</label>
                                        <input type="text" placeholder="Jabatan di instansi" className={inputClass}
                                            onChange={e => handleDetailChange("jabatan", e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Unit Kerja (opsional)</label>
                                        <input type="text" placeholder="Departemen / Prodi" className={inputClass}
                                            onChange={e => handleDetailChange("unit_kerja", e.target.value)} />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className={labelClass}>Isi Keterangan</label>
                                        <textarea rows={3} required placeholder="Keterangan yang perlu dicantumkan dalam surat..." className={inputClass}
                                            onChange={e => handleDetailChange("isi_keterangan", e.target.value)} />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className={labelClass}>Keperluan</label>
                                        <input type="text" required placeholder="Untuk keperluan apa surat ini..." className={inputClass}
                                            onChange={e => handleDetailChange("keperluan", e.target.value)} />
                                    </div>
                                </div>
                            )}

                            {/* Lainnya */}
                            {jenisSurat === "lainnya" && (
                                <div className="space-y-5">
                                    <div>
                                        <label className={labelClass}>Deskripsi Surat</label>
                                        <textarea rows={4} required placeholder="Jelaskan secara detail kebutuhan surat Anda..." className={inputClass}
                                            onChange={e => handleDetailChange("deskripsi", e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Ditujukan Kepada (opsional)</label>
                                        <input type="text" placeholder="Pihak yang dituju" className={inputClass}
                                            onChange={e => handleDetailChange("ditujukan_kepada", e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Keterangan Tambahan (opsional)</label>
                                        <textarea rows={2} className={inputClass}
                                            onChange={e => handleDetailChange("keterangan", e.target.value)} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Lampiran Pendukung */}
                        <div className="border-t border-gray-100 pt-6">
                            <label className={labelClass}>Lampiran Pendukung (opsional)</label>
                            <p className="text-xs text-gray-400 mb-3">Contoh: Surat undangan dari pihak lain, SK, atau dokumen referensi. Maks 10MB (PDF/JPG/PNG/DOCX)</p>
                            {lampiran ? (
                                <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <FileText size={20} className="text-orange-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{lampiran.name}</p>
                                            <p className="text-xs text-gray-500">{(lampiran.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => setLampiran(null)}
                                        className="text-gray-400 hover:text-red-500 transition">
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-all">
                                    <Upload size={24} className="text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500">Klik untuk upload atau drag & drop</span>
                                    <input type="file" accept=".pdf,.jpg,.jpeg,.png,.docx" className="hidden"
                                        onChange={e => setLampiran(e.target.files?.[0] || null)} />
                                </label>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setStep(1)}
                                className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium text-sm">
                                ← Kembali
                            </button>
                            <button type="submit" disabled={isLoading}
                                className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]">
                                {isLoading ? "Mengirim..." : "Kirim Permohonan"}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
