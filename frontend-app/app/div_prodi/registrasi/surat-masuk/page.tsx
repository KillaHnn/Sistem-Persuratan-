"use client";

import RegistrationTable from "../../components/RegistrationTable";

export default function SuratMasukPage() {
    const columns = [
        { header: "Nomor Agenda", key: "nomor" },
        { header: "Tanggal Masuk", key: "tanggal" },
        { header: "Asal Surat", key: "tujuan" },
        { header: "Perihal", key: "hal" },
    ];

    const data = [
        { nomor: "MSK/001/2026", tanggal: "2026-02-01", tujuan: "Universitas Indonesia", hal: "Undangan Kerjasama" },
        { nomor: "MSK/002/2026", tanggal: "2026-02-14", tujuan: "Kemenristekdikti", hal: "Pemberitahuan Hibah" },
    ];

    return (
        <RegistrationTable
            title="Surat Masuk"
            columns={columns}
            data={data}
            onAddType1={() => console.log("Tambah Surat Masuk A")}
            onAddType2={() => console.log("Tambah Surat Masuk B")}
        />
    );
}
