"use client";

import RegistrationTable from "../../components/RegistrationTable";

export default function SuratKeteranganPage() {
    const columns = [
        { header: "Nomor Surat", key: "nomor" },
        { header: "Tanggal", key: "tanggal" },
        { header: "Perihal", key: "hal" },
        { header: "Tujuan", key: "tujuan" },
    ];

    const data: any[] = [];

    return (
        <RegistrationTable
            title="Surat Keterangan"
            columns={columns}
            data={data}
            onAddType1={() => console.log("Tambah Surat Keterangan Format A")}
            onAddType2={() => console.log("Tambah Surat Keterangan Format B")}
        />
    );
}
