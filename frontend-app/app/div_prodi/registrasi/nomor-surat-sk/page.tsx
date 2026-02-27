"use client";

import RegistrationTable from "../../components/RegistrationTable";

export default function NomorSuratSKPage() {
    const columns = [
        { header: "Nomor SK", key: "nomor" },
        { header: "Tanggal", key: "tanggal" },
        { header: "Judul SK", key: "hal" },
        { header: "Pejabat TTD", key: "ttd" },
    ];

    const data = [
        { nomor: "SK/001/2026", tanggal: "2026-01-20", hal: "SK Pengangkatan Dosen", ttd: "Dekan" },
        { nomor: "SK/002/2026", tanggal: "2026-01-25", hal: "SK Panitia Seminar", ttd: "Ketua Prodi" },
    ];

    return (
        <RegistrationTable
            title="Nomor Surat SK"
            columns={columns}
            data={data}
            onAddType1={() => console.log("Tambah SK A")}
            onAddType2={() => console.log("Tambah SK B")}
        />
    );
}
