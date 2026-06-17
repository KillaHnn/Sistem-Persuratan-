"use client";

import RegistrationTable from "../../components/RegistrationTable";

export default function NomorSuratPage() {
    const columns = [
        { header: "Nomor Surat", key: "nomor" },
        { header: "Tanggal", key: "tanggal" },
        { header: "Perihal", key: "hal" },
        { header: "Tujuan", key: "tujuan" },
    ];

    const data = [
        { nomor: "001/UN/2026", tanggal: "2026-02-10", hal: "Surat Keterangan Aktif", tujuan: "Mahasiswa" },
        { nomor: "002/UN/2026", tanggal: "2026-02-12", hal: "Surat Pengantar Magang", tujuan: "PT. Maju Mundur" },
        { nomor: "003/UN/2026", tanggal: "2026-02-15", hal: "Undangan Rapat", tujuan: "Dosen Prodi" },
    ];

    return (
        <RegistrationTable
            title="Nomor Surat"
            columns={columns}
            data={data}
            onAddType1={() => console.log("Tambah Nomor Surat A")}
            onAddType2={() => console.log("Tambah Nomor Surat B")}
        />
    );
}
