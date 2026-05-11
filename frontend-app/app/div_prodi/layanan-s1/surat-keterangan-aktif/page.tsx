"use client";

import RegistrationTable from "../../components/RegistrationTable";

export default function SuratKeteranganAktifPage() {
    const columns = [
        { header: "Surat Cuti ID", key: "surat_cuti_id" },
        { header: "Tahun Akademik", key: "akademik" },
        { header: "Semester", key: "semester" },
        { header: "Tanggal Lapor", key: "tanggal_lapor" },
        { header: "Tahun Akademik Aktif", key: "akademik_aktif" },
        { header: "Semester Aktif", key: "semester_aktif" },
        { header: "File Pengantar", key: "file_pengantar" },
        { header: "File Surat Cuti", key: "file_surat_cuti" },
        { header: "File SPP", key: "file_spp" },
    ];

    const data = [
        {
            surat_cuti_id: "CT-001",
            akademik: "2025/2026",
            semester: "Ganjil",
            tanggal_lapor: "2026-02-15",
            akademik_aktif: "2026/2027",
            semester_aktif: "Genap",
            file_pengantar: "pengantar.pdf",
            file_surat_cuti: "surat_cuti.pdf",
            file_spp: "spp.pdf",
        },
    ];

    return (
        <RegistrationTable
            title="Surat Keterangan Aktif"
            columns={columns}
            data={data}
            onAddType1={() => console.log("Tambah Surat Keterangan Aktif Format A")}
            onAddType2={() => console.log("Tambah Surat Keterangan Aktif Format B")}
        />
    );
}
