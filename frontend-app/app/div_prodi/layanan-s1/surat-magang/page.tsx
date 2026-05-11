"use client";

import RegistrationTable from "../../components/RegistrationTable";

export default function SuratMagangPage() {
    const columns = [
        { header: "Tahun Akademik", key: "akademik" },
        { header: "Semester", key: "semester" },
        { header: "Jumlah SKS", key: "jumlah_sks" },
        { header: "IPK", key: "ipk" },
        { header: "Lokasi Kegiatan", key: "lokasi_kegiatan" },
        { header: "Jenis Kegiatan", key: "jenis_kegiatan" },
        { header: "File Pengantar Prodi", key: "file_pengantar_prodi" },
        { header: "File Surat Persetujuan", key: "file_surat_persetujuan" },
        { header: "File SPTJM", key: "file_sptjm" },
    ];

    const data = [
        {
            akademik: "2025/2026",
            semester: "Ganjil",
            jumlah_sks: "100",
            ipk: "3.5",
            lokasi_kegiatan: "Jakarta",
            jenis_kegiatan: "Magang MSIB",
            file_pengantar_prodi: "pengantar.pdf",
            file_surat_persetujuan: "persetujuan.pdf",
            file_sptjm: "sptjm.pdf",
        },
    ];

    return (
        <RegistrationTable
            title="Surat Keterangan Magang"
            columns={columns}
            data={data}
            onAddType1={() => console.log("Tambah Surat Magang Format A")}
            onAddType2={() => console.log("Tambah Surat Magang Format B")}
        />
    );
}
