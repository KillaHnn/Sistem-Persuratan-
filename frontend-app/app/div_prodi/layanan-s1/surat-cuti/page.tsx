"use client";

import { useState, useEffect } from "react";
import RegistrationTable from "../../components/RegistrationTable";

export default function SuratCutiPage() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        akademik: "",
        semester: "",
        akademik_cuti: "",
        semester_cuti: "",
        alasan: "",
        file_pengajuan: null as File | null,
        file_pengantar_prodi: null as File | null,
        file_surat_keterangan: null as File | null,
    });

    const columns = [
        { header: "No", key: "no" },
        { header: "Tahun Akademik", key: "akademik" },
        { header: "Semester", key: "semester" },
        { header: "Tahun Akademik Cuti", key: "akademik_cuti" },
        { header: "Semester Cuti", key: "semester_cuti" },
        { header: "Alasan Cuti", key: "alasan" },
        { header: "File Pengajuan", key: "file_pengajuan" },
        { header: "File Pengantar Prodi", key: "file_pengantar_prodi" },
        { header: "File Surat Keterangan", key: "file_surat_keterangan" },
        { header: "Status", key: "status" },
    ];

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://127.0.0.1:8000/api/surat-cuti");
            const result = await response.json();
            if (response.ok) {
                // Assuming result.data contains the array of records
                const tableData = (result.data || result).map((item: any, index: number) => ({
                    ...item,
                    no: index + 1,
                    status: item.status || "pending",
                }));
                setData(tableData);
            } else {
                console.error("Failed to fetch data", result);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        }
    };

    const openCreateModal = () => {
        setModalMode("create");
        setSelectedId(null);
        setFormData({
            akademik: "",
            semester: "",
            akademik_cuti: "",
            semester_cuti: "",
            alasan: "",
            file_pengajuan: null,
            file_pengantar_prodi: null,
            file_surat_keterangan: null,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (row: any) => {
        setModalMode("edit");
        setSelectedId(row.id);
        setFormData({
            akademik: row.akademik || "",
            semester: row.semester || "",
            akademik_cuti: row.akademik_cuti || "",
            semester_cuti: row.semester_cuti || "",
            alasan: row.alasan || "",
            file_pengajuan: null, 
            file_pengantar_prodi: null,
            file_surat_keterangan: null,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (row: any) => {
        if (confirm(`Apakah Anda yakin ingin menghapus surat cuti ini?`)) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/surat-cuti/${row.id}`, {
                    method: "DELETE",
                });
                if (response.ok) {
                    fetchData();
                } else {
                    alert("Gagal menghapus data.");
                }
            } catch (error) {
                console.error("Error deleting data:", error);
                alert("Terjadi kesalahan.");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append("akademik", formData.akademik);
        data.append("semester", formData.semester);
        data.append("akademik_cuti", formData.akademik_cuti);
        data.append("semester_cuti", formData.semester_cuti);
        data.append("alasan", formData.alasan);

        if (formData.file_pengajuan) {
            data.append("file_pengajuan", formData.file_pengajuan);
        }
        if (formData.file_pengantar_prodi) {
            data.append("file_pengantar_prodi", formData.file_pengantar_prodi);
        }
        if (formData.file_surat_keterangan) {
            data.append("file_surat_keterangan", formData.file_surat_keterangan);
        }

        let url = "http://127.0.0.1:8000/api/surat-cuti";
        let method = "POST";

        if (modalMode === "edit" && selectedId) {
            url = `http://127.0.0.1:8000/api/surat-cuti/${selectedId}`;
            // For Laravel, to update with files via POST, spoof the PUT method method
            data.append("_method", "PUT");
        }

        try {
            const response = await fetch(url, {
                method: method,
                body: data,
            });

            if (response.ok) {
                setIsModalOpen(false);
                fetchData();
            } else {
                const errorData = await response.json();
                alert(`Gagal menyimpan data: ${errorData.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Terjadi kesalahan.");
        }
    };

    return (
        <>
            <RegistrationTable
                title="Surat Cuti"
                columns={columns}
                data={data}
                onAdd={openCreateModal}
                addText="Create Surat Cuti"
                onEdit={openEditModal}
                onDelete={handleDelete}
            />

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-800">
                                {modalMode === "create" ? "Tambah Surat Cuti" : "Edit Surat Cuti"}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Akademik</label>
                                    <input
                                        type="text"
                                        name="akademik"
                                        value={formData.akademik}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                        placeholder="Contoh: 2025/2026"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                                    <select
                                        name="semester"
                                        value={formData.semester}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                    >
                                        <option value="">Pilih Semester</option>
                                        <option value="Ganjil">Ganjil</option>
                                        <option value="Genap">Genap</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Akademik Cuti</label>
                                    <input
                                        type="text"
                                        name="akademik_cuti"
                                        value={formData.akademik_cuti}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                        placeholder="Contoh: 2026/2027"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester Cuti</label>
                                    <select
                                        name="semester_cuti"
                                        value={formData.semester_cuti}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                    >
                                        <option value="">Pilih Semester</option>
                                        <option value="Ganjil">Ganjil</option>
                                        <option value="Genap">Genap</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alasan Cuti</label>
                                <textarea
                                    name="alasan"
                                    value={formData.alasan}
                                    onChange={handleInputChange}
                                    required
                                    rows={3}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Masukkan alasan cuti..."
                                ></textarea>
                            </div>

                            <div className="space-y-4 pt-2 border-t border-gray-100">
                                <h3 className="font-semibold text-gray-800">Dokumen Lampiran</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">File Pengajuan {modalMode === 'edit' && '(Opsional)'}</label>
                                    <input
                                        type="file"
                                        name="file_pengajuan"
                                        onChange={handleFileChange}
                                        accept=".pdf"
                                        required={modalMode === "create"}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">File Pengantar Prodi {modalMode === 'edit' && '(Opsional)'}</label>
                                    <input
                                        type="file"
                                        name="file_pengantar_prodi"
                                        onChange={handleFileChange}
                                        accept=".pdf"
                                        required={modalMode === "create"}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">File Surat Keterangan {modalMode === 'edit' && '(Opsional)'}</label>
                                    <input
                                        type="file"
                                        name="file_surat_keterangan"
                                        onChange={handleFileChange}
                                        accept=".pdf"
                                        required={modalMode === "create"}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-all shadow-md shadow-orange-100"
                                >
                                    {modalMode === "create" ? "Simpan Data" : "Update Data"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
