"use client";

import RegistrationTable from "../../components/RegistrationTable";

export default function SuratTunjanganPage() {
    const columns = [
        { header: "Tahun Akademik", key: "akademik" },
        { header: "Semester", key: "semester" },
        { header: "Nama Ortu", key: "nama_ortu" },
        { header: "NIP/NRP Ortu", key: "nip_nrp_ortu" },
        { header: "Pangkat Golongan", key: "pangkat_golongan" },
        { header: "Nama Instansi", key: "nama_instansi" },
        { header: "File KTM", key: "file_ktm" },
        { header: "File SPP", key: "file_spp" },
    ];

    const data = [
        {
            akademik: "2025/2026",
            semester: "Ganjil",
            nama_ortu: "Sudirman",
            nip_nrp_ortu: "198001012005011001",
            pangkat_golongan: "Pembina Tk.I - IV/b",
            nama_instansi: "Dinas Pendidikan",
            file_ktm: "ktm.pdf",
            file_spp: "spp.pdf",
        },
    ];

    return (
        <RegistrationTable
            title="Surat Tunjangan"
            columns={columns}
            data={data}
            onAddType1={() => console.log("Tambah Format A")}
            onAddType2={() => console.log("Tambah Format B")}
        />
    );
}
