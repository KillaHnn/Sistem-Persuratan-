"use client";

import RegistrationTable from "../../components/RegistrationTable";

export default function KlasifikasiArsipPage() {
    const columns = [
        { header: "Kode Klasifikasi", key: "nomor" },
        { header: "Nama Klasifikasi", key: "hal" },
        { header: "Deskripsi", key: "tujuan" },
    ];

    const data = [
        { nomor: "HK.01", hal: "Hukum & Perundang-undangan", tujuan: "Berkas Produk Hukum" },
        { nomor: "KP.02", hal: "Kepegawaian", tujuan: "Berkas Data Dosen & Staff" },
    ];

    return (
        <RegistrationTable
            title="Klasifikasi Arsip"
            columns={columns}
            data={data}
            onAddType1={() => console.log("Tambah Klasifikasi A")}
            onAddType2={() => console.log("Tambah Klasifikasi B")}
        />
    );
}
