"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, X, Loader2, BookOpen } from "lucide-react";

export default function BukuRegisterPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [dropdownSurat, setDropdownSurat] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        id: "",
        surat_umum_id: "",
        nomor_surat: "",
        tanggal_surat: "",
        jenis_surat: "",
        perihal: "",
        keterangan: ""
    });
    const [searchTerm, setSearchTerm] = useState("");

    const getToken = () => typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/umum/buku-agenda`, {
                headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" }
            });
            const result = await res.json();
            if (res.ok) {
                setData(result.data || []);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDropdown = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/umum/buku-agenda-dropdown`, {
                headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" }
            });
            const result = await res.json();
            if (res.ok) {
                setDropdownSurat(result.data || []);
            }
        } catch (error) {
            console.error("Error fetching dropdown:", error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchDropdown();
    }, []);

    const handleOpenModal = (item?: any) => {
        if (item) {
            setFormData({
                id: item.id,
                surat_umum_id: item.surat_umum_id || "",
                nomor_surat: item.nomor_surat || "",
                tanggal_surat: item.tanggal_surat ? item.tanggal_surat.split("T")[0] : "",
                jenis_surat: item.jenis_surat || "",
                perihal: item.perihal || "",
                keterangan: item.keterangan || ""
            });
        } else {
            setFormData({ id: "", surat_umum_id: "", nomor_surat: "", tanggal_surat: "", jenis_surat: "", perihal: "", keterangan: "" });
        }
        setShowModal(true);
    };

    const handleSuratSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (!val) {
            setFormData({ ...formData, surat_umum_id: "", nomor_surat: "", jenis_surat: "", perihal: "", tanggal_surat: "" });
            return;
        }
        const selected = dropdownSurat.find(s => String(s.id) === val);
        if (selected) {
            setFormData({
                ...formData,
                surat_umum_id: selected.id,
                nomor_surat: selected.nomor_surat,
                jenis_surat: selected.jenis_surat || "",
                perihal: selected.perihal || "",
                tanggal_surat: selected.created_at ? selected.created_at.split("T")[0] : ""
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const isEdit = !!formData.id;
            const url = isEdit 
                ? `${API_BASE}/api/umum/buku-agenda/${formData.id}`
                : `${API_BASE}/api/umum/buku-agenda`;
                
            const method = isEdit ? "PUT" : "POST";
            
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`, 
                    Accept: "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setShowModal(false);
                fetchData();
            } else {
                const err = await res.json();
                alert(err.message || "Terjadi kesalahan");
            }
        } catch (error) {
            console.error("Error saving:", error);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
        try {
            const res = await fetch(`${API_BASE}/api/umum/buku-agenda/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" }
            });
            if (res.ok) {
                fetchData();
            }
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    const filteredData = data.filter(d => 
        (d.nomor_surat || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.perihal || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-3.5 sm:p-4 bg-orange-50 text-orange-500 rounded-2xl shrink-0">
                        <BookOpen size={28} />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Buku Register Surat</h1>
                        <p className="text-xs sm:text-sm text-gray-500">Pencatatan digital nomor surat keluar (Sekretariat)</p>
                    </div>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl transition font-medium text-sm w-full sm:w-auto"
                >
                    <Plus size={18} />
                    <span>Tambah Register</span>
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="relative w-full max-w-sm">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari nomor surat atau perihal..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 text-sm"
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 min-w-[600px]">
                        <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Nomor Surat</th>
                                <th className="px-6 py-4">Tanggal</th>
                                <th className="px-6 py-4">Jenis Surat</th>
                                <th className="px-6 py-4">Perihal</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                        <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                        Data register kosong atau tidak ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-6 py-4 font-mono font-medium text-gray-800">
                                            {item.nomor_surat}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.tanggal_surat ? new Date(item.tanggal_surat).toLocaleDateString('id-ID') : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600 uppercase">
                                                {item.jenis_surat?.replace(/_/g, ' ') || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 truncate max-w-xs" title={item.perihal}>
                                            {item.perihal || '-'}
                                        </td>
                                        <td className="px-6 py-4 flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => handleOpenModal(item)}
                                                className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                                                title="Hapus"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="font-bold text-base sm:text-lg text-gray-900">
                                {formData.id ? "Edit Register Surat" : "Tambah Register Surat"}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1 bg-white rounded-full border border-gray-200">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-5 sm:p-6 overflow-y-auto">
                            <form id="registerForm" onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Pilih Nomor Surat (Opsional / Terhubung Sistem)</label>
                                    <select
                                        className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500"
                                        value={formData.surat_umum_id}
                                        onChange={handleSuratSelect}
                                    >
                                        <option value="">-- Input Manual (Tanpa Pilihan) --</option>
                                        {dropdownSurat.map(s => (
                                            <option key={s.id} value={s.id}>
                                                {s.nomor_surat} - {s.perihal?.substring(0,40)}...
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor Surat <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.nomor_surat}
                                        onChange={e => setFormData({ ...formData, nomor_surat: e.target.value })}
                                        className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 font-mono"
                                        placeholder="Contoh: 123/UN.1/DT/2026"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Surat</label>
                                        <input
                                            type="date"
                                            value={formData.tanggal_surat}
                                            onChange={e => setFormData({ ...formData, tanggal_surat: e.target.value })}
                                            className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Jenis Surat</label>
                                        <input
                                            type="text"
                                            value={formData.jenis_surat}
                                            onChange={e => setFormData({ ...formData, jenis_surat: e.target.value })}
                                            className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500"
                                            placeholder="Cth: Undangan"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Perihal</label>
                                    <textarea
                                        value={formData.perihal}
                                        onChange={e => setFormData({ ...formData, perihal: e.target.value })}
                                        className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 min-h-[80px]"
                                        placeholder="Perihal surat..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Keterangan / Tujuan (Opsional)</label>
                                    <textarea
                                        value={formData.keterangan}
                                        onChange={e => setFormData({ ...formData, keterangan: e.target.value })}
                                        className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 min-h-[60px]"
                                        placeholder="Tujuan surat atau keterangan lainnya"
                                    />
                                </div>
                            </form>
                        </div>
                        
                        <div className="p-6 border-t border-gray-100 flex gap-4 bg-gray-50/50">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                form="registerForm"
                                disabled={formLoading}
                                className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition disabled:opacity-50 flex items-center justify-center"
                            >
                                {formLoading ? <Loader2 className="animate-spin" size={18} /> : "Simpan Data"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
