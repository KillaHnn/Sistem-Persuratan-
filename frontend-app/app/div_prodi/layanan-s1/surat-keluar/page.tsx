"use client";

import RegistrationTable from "../../components/RegistrationTable";

export default function SuratKeluarPage() {
    const columns = [
        { header: "Nomor Surat", key: "nomor" },
        { header: "Tanggal", key: "tanggal" },
        { header: "Perihal", key: "hal" },
        { header: "Tujuan", key: "tujuan" },
    ];

    const data: any[] = [];

    return (
        <RegistrationTable
            title="Surat Keluar"
            columns={columns}
            data={data}
            onAddType1={() => console.log("Tambah Surat Keluar Format A")}
            onAddType2={() => console.log("Tambah Surat Keluar Format B")}
        />
    );
}
