"use client";

import RegistrationTable from "../../components/RegistrationTable";

export default function SuratPerpanjangMahasiswaPage() {
    const columns = [
        { header: "Tahun Akademik", key: "akademik" },
        { header: "Semester", key: "semester" },
        { header: "Dosen Pembimbing", key: "dosen_pembimbing" },
        { header: "Tahun Akhir Perpanjang", key: "tahun_akhir_perpanjang" },
        { header: "File Table", key: "file_table" },
    ];

    const data = [
        {
            akademik: "2025/2026",
            semester: "Ganjil",
            dosen_pembimbing: "Dr. Budi Santoso",
            tahun_akhir_perpanjang: "2026/2027",
            file_table: "table.pdf",
        },
    ];

    return (
        <RegistrationTable
            title="Surat Perpanjang Mahasiswa"
            columns={columns}
            data={data}
            onAddType1={() => console.log("Tambah Format A")}
            onAddType2={() => console.log("Tambah Format B")}
        />
    );
}
