"use client";

import { useState } from "react";

type FieldConfig = {
    name: string;
    label: string;
    type: "text" | "textarea" | "file" | "date" | "number";
};

const formFieldsConfig: Record<string, FieldConfig[]> = {
    surat_cuti: [
        { name: "tahun_akademik", label: "Tahun Akademik", type: "text" },
        { name: "semester", label: "Semester", type: "text" },
        { name: "tahun_akademik_cuti", label: "Tahun Akademik Cuti", type: "text" },
        { name: "semester_cuti", label: "Semester Cuti", type: "text" },
        { name: "alasan_cuti", label: "Alasan Cuti", type: "textarea" },
        { name: "file_pengajuan", label: "File Pengajuan", type: "file" },
        { name: "file_pengantar_prodi", label: "File Pengantar Prodi", type: "file" },
        { name: "file_surat_keterangan", label: "File Surat Keterangan", type: "file" },
    ],
    surat_keluar: [
        { name: "nomor_surat", label: "Nomor Surat", type: "text" },
        { name: "tanggal_surat", label: "Tanggal Surat", type: "date" },
        { name: "kode_klasifikasi", label: "Kode Klasifikasi", type: "text" },
        { name: "perihal", label: "Perihal", type: "text" },
        { name: "jenis_surat", label: "Jenis Surat", type: "text" },
    ],
    surat_keterangan_aktif: [
        { name: "surat_cuti_id", label: "Surat Cuti ID", type: "text" },
        { name: "tahun_akademik", label: "Tahun Akademik", type: "text" },
        { name: "semester", label: "Semester", type: "text" },
        { name: "tanggal_lapor", label: "Tanggal Lapor", type: "date" },
        { name: "tanggal_akademik_aktif", label: "Tanggal Akademik Aktif", type: "text" },
        { name: "file_pengantar", label: "File Pengantar", type: "file" },
        { name: "file_surat_cuti", label: "File Surat Cuti", type: "file" },
        { name: "file_spp", label: "File SPP", type: "file" },
    ],
    surat_keterangan: [
        { name: "tahun_akademik", label: "Tahun Akademik", type: "text" },
        { name: "semester", label: "Semester", type: "text" },
        { name: "keperluan", label: "Keperluan", type: "textarea" },
        { name: "file_ktm", label: "File KTM", type: "file" },
        { name: "file_spp", label: "File SPP", type: "file" },
    ],
    surat_magang: [
        { name: "tahun_akademik", label: "Tahun Akademik", type: "text" },
        { name: "semester", label: "Semester", type: "text" },
        { name: "jumlah_sks", label: "Jumlah SKS", type: "number" },
        { name: "ipk", label: "IPK", type: "number" },
        { name: "lokasi_kegiatan", label: "Lokasi Kegiatan", type: "text" },
        { name: "jenis_kegiatan", label: "Jenis Kegiatan", type: "text" },
        { name: "file_pengantar_prodi", label: "File Pengantar Prodi", type: "file" },
        { name: "file_surat_persetujuan", label: "File Surat Persetujuan", type: "file" },
        { name: "file_sptjm", label: "File SPTJM", type: "file" },
    ],
    surat_pengunduran_mahasiswa: [
        { name: "tahun_akademik", label: "Tahun Akademik", type: "text" },
        { name: "semester", label: "Semester", type: "text" },
        { name: "thn_akademik_pengunduran", label: "Tahun Akademik Pengunduran", type: "text" },
        { name: "tanggal_pengunduran", label: "Tanggal Pengunduran", type: "date" },
        { name: "tanggal_terakhi_aktif", label: "Tanggal Terakhir Aktif", type: "date" },
        { name: "file_ktm", label: "File KTM", type: "file" },
        { name: "file_pengajuan", label: "File Pengajuan", type: "file" },
        { name: "file_pengantar_prodi", label: "File Pengantar Prodi", type: "file" },
    ],
    surat_perpanjang_mahasiswa: [
        { name: "tahun_akademik", label: "Tahun Akademik", type: "text" },
        { name: "semester", label: "Semester", type: "text" },
        { name: "dosen_pembimbing", label: "Dosen Pembimbing", type: "text" },
        { name: "tahun_akhir_perpanjang", label: "Tahun Akhir Perpanjang", type: "text" },
        { name: "file_table", label: "File Table", type: "file" },
    ],
    surat_rekomendasi_kampus_mengajar: [
        { name: "tahun_akademik", label: "Tahun Akademik", type: "text" },
        { name: "semester", label: "Semester", type: "text" },
        { name: "jumlah_sks", label: "Jumlah SKS", type: "number" },
        { name: "ipk", label: "IPK", type: "number" },
        { name: "file_pengantar_prodi", label: "File Pengantar Prodi", type: "file" },
        { name: "file_surat_persetujuan", label: "File Surat Persetujuan", type: "file" },
        { name: "file_sptjm", label: "File SPTJM", type: "file" },
        { name: "file_transkrip_kumulatif", label: "File Transkrip Kumulatif", type: "file" },
        { name: "file_keterangan_dokter", label: "File Keterangan Dokter", type: "file" },
    ],
    surat_tunjangan: [
        { name: "tahun_akademik", label: "Tahun Akademik", type: "text" },
        { name: "semester", label: "Semester", type: "text" },
        { name: "nama_ortu", label: "Nama Orang Tua", type: "text" },
        { name: "nip_nrp_ortu", label: "NIP/NRP Orang Tua", type: "text" },
        { name: "pangkat_golongan", label: "Pangkat/Golongan", type: "text" },
        { name: "nama_instansi", label: "Nama Instansi", type: "text" },
        { name: "file_ktm", label: "File KTM", type: "file" },
        { name: "file_spp", label: "File SPP", type: "file" },
    ],
};

export default function PengajuanSuratPage() {
    const [selectedSurat, setSelectedSurat] = useState("surat_cuti");

    const handleSuratChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSurat(e.target.value);
    };

    const currentFields = formFieldsConfig[selectedSurat] || [];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Handle form submission
        alert(`Form untuk ${selectedSurat} siap disubmit!`);
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="font-semibold text-gray-800">
                Pengajuan Surat
            </h3>
            <p className="text-sm text-gray-500 mt-1 mb-7">
                Silakan isi formulir di bawah untuk mengajukan surat baru.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                    <label className="font-medium text-gray-700 w-40">
                        Jenis Surat :
                    </label>

                    <div className="relative w-full max-w-md">
                        <select
                            value={selectedSurat}
                            onChange={handleSuratChange}
                            className="appearance-none w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            <option value="surat_cuti">Surat Cuti</option>
                            <option value="surat_keluar">Surat Keluar</option>
                            <option value="surat_keterangan_aktif">Surat Keterangan Aktif</option>
                            <option value="surat_keterangan">Surat Keterangan</option>
                            <option value="surat_magang">Surat Magang</option>
                            <option value="surat_pengunduran_mahasiswa">Surat Pengunduran Mahasiswa</option>
                            <option value="surat_perpanjang_mahasiswa">Surat Perpanjang Mahasiswa</option>
                            <option value="surat_rekomendasi_kampus_mengajar">Surat Rekomendasi Kampus Mengajar</option>
                            <option value="surat_tunjangan">Surat Tunjangan</option>
                        </select>

                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                            ▼
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentFields.map((field) => (
                        <div key={field.name} className="flex flex-col space-y-2">
                            <label className="font-medium text-gray-700 text-sm">
                                {field.label}
                                {field.type === "file" && " (File)"}
                            </label>
                            {field.type === "textarea" ? (
                                <textarea
                                    name={field.name}
                                    className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-[100px]"
                                    placeholder={`Masukkan ${field.label}`}
                                ></textarea>
                            ) : field.type === "file" ? (
                                <input
                                    type="file"
                                    name={field.name}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer border border-gray-300 rounded-lg p-2"
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    placeholder={`Masukkan ${field.label}`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                        Ajukan Surat
                    </button>
                </div>
            </form>
        </div>
    );
}