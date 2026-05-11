"use client";

import RegistrationTable from "../../components/RegistrationTable";

export default function SuratKeluarPage() {
    const columns = [
        { header: "Nomor Surat", key: "nomor" },
        { header: "Tanggal", key: "tanggal" },
        { header: "Perihal", key: "hal" },
        { header: "Penerima", key: "tujuan" },
    ];

    const data = [
        { nomor: "KLR/001/2026", tanggal: "2026-02-05", hal: "Balasan Permohonan Data", tujuan: "Dinas Pendidikan" },
        { nomor: "KLR/002/2026", tanggal: "2026-02-18", hal: "Surat Tugas Penelitian", tujuan: "Dosen" },
    ];

    return (
        <RegistrationTable
            title="Surat Keluar"
            columns={columns}
            data={data}
            onAddType1={() => console.log("Tambah Surat Keluar A")}
            onAddType2={() => console.log("Tambah Surat Keluar B")}
        />
    );
}
