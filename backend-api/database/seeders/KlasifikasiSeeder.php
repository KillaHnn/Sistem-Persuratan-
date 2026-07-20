<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class KlasifikasiSeeder extends Seeder
{
    public function run(): void
    {
        // ── 1. UNDANGAN ───────────────────────────────────────────────────────
        $primerUndangan = \App\Models\KlasifikasiPrimer::create([
            'kode' => 'UN',
            'nama' => 'UN. UNDANGAN',
        ]);

        $sekUN00 = \App\Models\KlasifikasiSekunder::create([
            'klasifikasi_primer_id' => $primerUndangan->id,
            'kode' => 'UN.00',
            'nama' => 'Undangan Rapat',
        ]);

        \App\Models\KlasifikasiTersier::create([
            'klasifikasi_sekunder_id' => $sekUN00->id,
            'kode' => 'UN.00.00',
            'nama' => 'UN.00.00',
            'jenis_arsip' => 'Undangan Rapat Internal',
        ]);

        \App\Models\KlasifikasiTersier::create([
            'klasifikasi_sekunder_id' => $sekUN00->id,
            'kode' => 'UN.00.01',
            'nama' => 'UN.00.01',
            'jenis_arsip' => 'Undangan Rapat Eksternal',
        ]);

        $sekUN01 = \App\Models\KlasifikasiSekunder::create([
            'klasifikasi_primer_id' => $primerUndangan->id,
            'kode' => 'UN.01',
            'nama' => 'Undangan Kegiatan / Acara',
        ]);

        \App\Models\KlasifikasiTersier::create([
            'klasifikasi_sekunder_id' => $sekUN01->id,
            'kode' => 'UN.01.00',
            'nama' => 'UN.01.00',
            'jenis_arsip' => 'Undangan Seminar / Workshop',
        ]);

        \App\Models\KlasifikasiTersier::create([
            'klasifikasi_sekunder_id' => $sekUN01->id,
            'kode' => 'UN.01.01',
            'nama' => 'UN.01.01',
            'jenis_arsip' => 'Undangan Wisuda / Pelantikan',
        ]);

        // ── 2. SURAT TUGAS ────────────────────────────────────────────────────
        $primerST = \App\Models\KlasifikasiPrimer::create([
            'kode' => 'ST',
            'nama' => 'ST. SURAT TUGAS',
        ]);

        $sekST00 = \App\Models\KlasifikasiSekunder::create([
            'klasifikasi_primer_id' => $primerST->id,
            'kode' => 'ST.00',
            'nama' => 'Tugas Mengajar / Akademik',
        ]);

        \App\Models\KlasifikasiTersier::create([
            'klasifikasi_sekunder_id' => $sekST00->id,
            'kode' => 'ST.00.00',
            'nama' => 'ST.00.00',
            'jenis_arsip' => 'Surat Tugas Mengajar',
        ]);

        \App\Models\KlasifikasiTersier::create([
            'klasifikasi_sekunder_id' => $sekST00->id,
            'kode' => 'ST.00.01',
            'nama' => 'ST.00.01',
            'jenis_arsip' => 'Surat Tugas Pembimbingan / Pengujian',
        ]);

        $sekST01 = \App\Models\KlasifikasiSekunder::create([
            'klasifikasi_primer_id' => $primerST->id,
            'kode' => 'ST.01',
            'nama' => 'Tugas Perjalanan Dinas',
        ]);

        \App\Models\KlasifikasiTersier::create([
            'klasifikasi_sekunder_id' => $sekST01->id,
            'kode' => 'ST.01.00',
            'nama' => 'ST.01.00',
            'jenis_arsip' => 'Surat Tugas Perjalanan Dinas Dalam Negeri',
        ]);

        \App\Models\KlasifikasiTersier::create([
            'klasifikasi_sekunder_id' => $sekST01->id,
            'kode' => 'ST.01.01',
            'nama' => 'ST.01.01',
            'jenis_arsip' => 'Surat Tugas Perjalanan Dinas Luar Negeri',
        ]);

        $sekST02 = \App\Models\KlasifikasiSekunder::create([
            'klasifikasi_primer_id' => $primerST->id,
            'kode' => 'ST.02',
            'nama' => 'Tugas Kepanitiaan',
        ]);

        \App\Models\KlasifikasiTersier::create([
            'klasifikasi_sekunder_id' => $sekST02->id,
            'kode' => 'ST.02.00',
            'nama' => 'ST.02.00',
            'jenis_arsip' => 'Surat Tugas Panitia Kegiatan',
        ]);

        // ── 3. SURAT PENGANTAR ────────────────────────────────────────────────
        $primerSP = \App\Models\KlasifikasiPrimer::create([
            'kode' => 'SP',
            'nama' => 'SP. SURAT PENGANTAR',
        ]);

        $sekSP00 = \App\Models\KlasifikasiSekunder::create([
            'klasifikasi_primer_id' => $primerSP->id,
            'kode' => 'SP.00',
            'nama' => 'Pengantar Dokumen / Berkas',
        ]);

        \App\Models\KlasifikasiTersier::create([
            'klasifikasi_sekunder_id' => $sekSP00->id,
            'kode' => 'SP.00.00',
            'nama' => 'SP.00.00',
            'jenis_arsip' => 'Pengantar Berkas Pegawai / Dosen',
        ]);

        $sekSP01 = \App\Models\KlasifikasiSekunder::create([
            'klasifikasi_primer_id' => $primerSP->id,
            'kode' => 'SP.01',
            'nama' => 'Pengantar Surat / Nota Dinas',
        ]);

        \App\Models\KlasifikasiTersier::create([
            'klasifikasi_sekunder_id' => $sekSP01->id,
            'kode' => 'SP.01.00',
            'nama' => 'SP.01.00',
            'jenis_arsip' => 'Pengantar Surat ke Instansi Luar',
        ]);

        // ── 4. SURAT KETERANGAN ───────────────────────────────────────────────
        $primerSK = \App\Models\KlasifikasiPrimer::create([
            'kode' => 'SK',
            'nama' => 'SK. SURAT KETERANGAN',
        ]);

        $sekSK00 = \App\Models\KlasifikasiSekunder::create([
            'klasifikasi_primer_id' => $primerSK->id,
            'kode' => 'SK.00',
            'nama' => 'Keterangan Kepegawaian / Dosen',
        ]);

        \App\Models\KlasifikasiTersier::create([
            'klasifikasi_sekunder_id' => $sekSK00->id,
            'kode' => 'SK.00.00',
            'nama' => 'SK.00.00',
            'jenis_arsip' => 'Surat Keterangan Aktif Mengajar',
        ]);

        \App\Models\KlasifikasiTersier::create([
            'klasifikasi_sekunder_id' => $sekSK00->id,
            'kode' => 'SK.00.01',
            'nama' => 'SK.00.01',
            'jenis_arsip' => 'Surat Keterangan Gaji / Penghasilan',
        ]);

        // ── 5. SURAT LAINNYA ──────────────────────────────────────────────────
        $primerLN = \App\Models\KlasifikasiPrimer::create([
            'kode' => 'LN',
            'nama' => 'LN. SURAT LAINNYA',
        ]);

        $sekLN00 = \App\Models\KlasifikasiSekunder::create([
            'klasifikasi_primer_id' => $primerLN->id,
            'kode' => 'LN.00',
            'nama' => 'Permohonan / Pengajuan',
        ]);

        \App\Models\KlasifikasiTersier::create([
            'klasifikasi_sekunder_id' => $sekLN00->id,
            'kode' => 'LN.00.00',
            'nama' => 'LN.00.00',
            'jenis_arsip' => 'Surat Permohonan Izin',
        ]);

        \App\Models\KlasifikasiTersier::create([
            'klasifikasi_sekunder_id' => $sekLN00->id,
            'kode' => 'LN.00.01',
            'nama' => 'LN.00.01',
            'jenis_arsip' => 'Surat Permohonan Dana / Sponsorship',
        ]);

        $sekLN01 = \App\Models\KlasifikasiSekunder::create([
            'klasifikasi_primer_id' => $primerLN->id,
            'kode' => 'LN.01',
            'nama' => 'Pemberitahuan / Edaran',
        ]);

        \App\Models\KlasifikasiTersier::create([
            'klasifikasi_sekunder_id' => $sekLN01->id,
            'kode' => 'LN.01.00',
            'nama' => 'LN.01.00',
            'jenis_arsip' => 'Surat Pemberitahuan Internal',
        ]);

        \App\Models\KlasifikasiTersier::create([
            'klasifikasi_sekunder_id' => $sekLN01->id,
            'kode' => 'LN.01.01',
            'nama' => 'LN.01.01',
            'jenis_arsip' => 'Surat Edaran',
        ]);
    }
}
