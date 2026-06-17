"use client";

import RegistrationTable from "../../components/RegistrationTable";

export default function SuratRekomendasiKampusMengajarPage() {
    const columns = [
        { header: "Tahun Akademik", key: "akademik" },
        { header: "Semester", key: "semester" },
        { header: "Jumlah SKS", key: "jumlah_sks" },
        { header: "IPK", key: "ipk" },
        { header: "File Pengantar Prodi", key: "file_pengantar_prodi" },
        { header: "File Surat Persetujuan", key: "file_surat_persetujuan" },
        { header: "File SPTJM", key: "file_sptjm" },
        { header: "File Transkrip Kumulatif", key: "file_transkrip_kumulatif" },
        { header: "File Keterangan Dokter", key: "file_keterangan_dokter" },
    ];

    const data = [
        {
            akademik: "2025/2026",
            semester: "Ganjil",
            jumlah_sks: "100",
            ipk: "3.6",
            file_pengantar_prodi: "pengantar.pdf",
            file_surat_persetujuan: "persetujuan.pdf",
            file_sptjm: "sptjm.pdf",
            file_transkrip_kumulatif: "transkrip.pdf",
            file_keterangan_dokter: "dokter.pdf",
        },
    ];

    return (
        <RegistrationTable
            title="Surat Rekomendasi Kampus Mengajar"
            columns={columns}
            data={data}
            onAddType1={() => console.log("Tambah Format A")}
            onAddType2={() => console.log("Tambah Format B")}
        />
    );
}
