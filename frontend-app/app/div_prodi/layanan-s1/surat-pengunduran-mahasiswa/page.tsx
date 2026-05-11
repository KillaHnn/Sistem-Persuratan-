"use client";

import RegistrationTable from "../../components/RegistrationTable";

export default function SuratPengunduranMahasiswaPage() {
    const columns = [
        { header: "Tahun Akademik", key: "akademik" },
        { header: "Semester", key: "semester" },
        { header: "Thn Akademik Pengunduran", key: "akademik_pengunduran" },
        { header: "Tanggal Pengunduran", key: "tanggal_pengunduran" },
        { header: "Tanggal Terakhir Aktif", key: "tanggal_terakhir_aktif" },
        { header: "File KTM", key: "file_ktm" },
        { header: "File Pengajuan", key: "file_pengajuan" },
        { header: "File Pengantar Prodi", key: "file_pengantar_prodi" },
    ];

    const data = [
        {
            akademik: "2025/2026",
            semester: "Ganjil",
            akademik_pengunduran: "2025/2026",
            tanggal_pengunduran: "2026-02-15",
            tanggal_terakhir_aktif: "2026-01-30",
            file_ktm: "ktm.pdf",
            file_pengajuan: "pengajuan.pdf",
            file_pengantar_prodi: "pengantar.pdf",
        },
    ];

    return (
        <RegistrationTable
            title="Surat Pengunduran Mahasiswa"
            columns={columns}
            data={data}
            onAddType1={() => console.log("Tambah Format A")}
            onAddType2={() => console.log("Tambah Format B")}
        />
    );
}
