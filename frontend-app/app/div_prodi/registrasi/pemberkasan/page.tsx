"use client";

import RegistrationTable from "../../components/RegistrationTable";

export default function PemberkasanPage() {
    const columns = [
        { header: "Kode Berkas", key: "nomor" },
        { header: "Nama Berkas", key: "hal" },
        { header: "Tahun", key: "tanggal" },
        { header: "Lokasi", key: "tujuan" },
    ];

    const data = [
        { nomor: "BRK/2026/001", hal: "Berkas Akreditasi Prodi", tanggal: "2026", tujuan: "Lemari A1" },
        { nomor: "BRK/2026/002", hal: "Kumpulan Ijazah Mahasiswa", tanggal: "2026", tujuan: "Gudang Arsip" },
    ];

    return (
        <RegistrationTable
            title="Pemberkasan"
            columns={columns}
            data={data}
            onAddType1={() => console.log("Tambah Berkas A")}
            onAddType2={() => console.log("Tambah Berkas B")}
        />
    );
}
