<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class KlasifikasiSeeder extends Seeder
{
    public function run(): void
    {
        // ── 1. UNDANGAN ───────────────────────────────────────────────────────
        $primerUndangan = \App\Models\KlasifikasiPrimer::updateOrCreate(
            ['kode' => 'UN'],
            ['nama' => 'UN. UNDANGAN']
        );

        $sekUN00 = \App\Models\KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'UN.00'],
            [
                'klasifikasi_primer_id' => $primerUndangan->id,
                'nama' => 'Undangan Rapat',
            ]
        );

        \App\Models\KlasifikasiTersier::updateOrCreate(
            ['kode' => 'UN.00.00'],
            [
                'klasifikasi_sekunder_id' => $sekUN00->id,
                'nama' => 'UN.00.00',
                'jenis_arsip' => 'Undangan Rapat Internal',
            ]
        );

        \App\Models\KlasifikasiTersier::updateOrCreate(
            ['kode' => 'UN.00.01'],
            [
                'klasifikasi_sekunder_id' => $sekUN00->id,
                'nama' => 'UN.00.01',
                'jenis_arsip' => 'Undangan Rapat Eksternal',
            ]
        );

        $sekUN01 = \App\Models\KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'UN.01'],
            [
                'klasifikasi_primer_id' => $primerUndangan->id,
                'nama' => 'Undangan Kegiatan / Acara',
            ]
        );

        \App\Models\KlasifikasiTersier::updateOrCreate(
            ['kode' => 'UN.01.00'],
            [
                'klasifikasi_sekunder_id' => $sekUN01->id,
                'nama' => 'UN.01.00',
                'jenis_arsip' => 'Undangan Seminar / Workshop',
            ]
        );

        \App\Models\KlasifikasiTersier::updateOrCreate(
            ['kode' => 'UN.01.01'],
            [
                'klasifikasi_sekunder_id' => $sekUN01->id,
                'nama' => 'UN.01.01',
                'jenis_arsip' => 'Undangan Wisuda / Pelantikan',
            ]
        );

        // ── 2. SURAT TUGAS ────────────────────────────────────────────────────
        $primerST = \App\Models\KlasifikasiPrimer::updateOrCreate(
            ['kode' => 'ST'],
            ['nama' => 'ST. SURAT TUGAS']
        );

        $sekST00 = \App\Models\KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'ST.00'],
            [
                'klasifikasi_primer_id' => $primerST->id,
                'nama' => 'Tugas Mengajar / Akademik',
            ]
        );

        \App\Models\KlasifikasiTersier::updateOrCreate(
            ['kode' => 'ST.00.00'],
            [
                'klasifikasi_sekunder_id' => $sekST00->id,
                'nama' => 'ST.00.00',
                'jenis_arsip' => 'Surat Tugas Mengajar',
            ]
        );

        \App\Models\KlasifikasiTersier::updateOrCreate(
            ['kode' => 'ST.00.01'],
            [
                'klasifikasi_sekunder_id' => $sekST00->id,
                'nama' => 'ST.00.01',
                'jenis_arsip' => 'Surat Tugas Pembimbingan / Pengujian',
            ]
        );

        $sekST01 = \App\Models\KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'ST.01'],
            [
                'klasifikasi_primer_id' => $primerST->id,
                'nama' => 'Tugas Perjalanan Dinas',
            ]
        );

        \App\Models\KlasifikasiTersier::updateOrCreate(
            ['kode' => 'ST.01.00'],
            [
                'klasifikasi_sekunder_id' => $sekST01->id,
                'nama' => 'ST.01.00',
                'jenis_arsip' => 'Surat Tugas Perjalanan Dinas Dalam Negeri',
            ]
        );

        \App\Models\KlasifikasiTersier::updateOrCreate(
            ['kode' => 'ST.01.01'],
            [
                'klasifikasi_sekunder_id' => $sekST01->id,
                'nama' => 'ST.01.01',
                'jenis_arsip' => 'Surat Tugas Perjalanan Dinas Luar Negeri',
            ]
        );

        $sekST02 = \App\Models\KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'ST.02'],
            [
                'klasifikasi_primer_id' => $primerST->id,
                'nama' => 'Tugas Kepanitiaan',
            ]
        );

        \App\Models\KlasifikasiTersier::updateOrCreate(
            ['kode' => 'ST.02.00'],
            [
                'klasifikasi_sekunder_id' => $sekST02->id,
                'nama' => 'ST.02.00',
                'jenis_arsip' => 'Surat Tugas Panitia Kegiatan',
            ]
        );

        // ── 3. SURAT PENGANTAR ────────────────────────────────────────────────
        $primerSP = \App\Models\KlasifikasiPrimer::updateOrCreate(
            ['kode' => 'SP'],
            ['nama' => 'SP. SURAT PENGANTAR']
        );

        $sekSP00 = \App\Models\KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'SP.00'],
            [
                'klasifikasi_primer_id' => $primerSP->id,
                'nama' => 'Pengantar Dokumen / Berkas',
            ]
        );

        \App\Models\KlasifikasiTersier::updateOrCreate(
            ['kode' => 'SP.00.00'],
            [
                'klasifikasi_sekunder_id' => $sekSP00->id,
                'nama' => 'SP.00.00',
                'jenis_arsip' => 'Pengantar Berkas Pegawai / Dosen',
            ]
        );

        $sekSP01 = \App\Models\KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'SP.01'],
            [
                'klasifikasi_primer_id' => $primerSP->id,
                'nama' => 'Pengantar Surat / Nota Dinas',
            ]
        );

        \App\Models\KlasifikasiTersier::updateOrCreate(
            ['kode' => 'SP.01.00'],
            [
                'klasifikasi_sekunder_id' => $sekSP01->id,
                'nama' => 'SP.01.00',
                'jenis_arsip' => 'Pengantar Surat ke Instansi Luar',
            ]
        );

        // ── 4. SURAT KETERANGAN ───────────────────────────────────────────────
        $primerSK = \App\Models\KlasifikasiPrimer::updateOrCreate(
            ['kode' => 'SK'],
            ['nama' => 'SK. SURAT KETERANGAN']
        );

        $sekSK00 = \App\Models\KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'SK.00'],
            [
                'klasifikasi_primer_id' => $primerSK->id,
                'nama' => 'Keterangan Kepegawaian / Dosen',
            ]
        );

        \App\Models\KlasifikasiTersier::updateOrCreate(
            ['kode' => 'SK.00.00'],
            [
                'klasifikasi_sekunder_id' => $sekSK00->id,
                'nama' => 'SK.00.00',
                'jenis_arsip' => 'Surat Keterangan Aktif Mengajar',
            ]
        );

        \App\Models\KlasifikasiTersier::updateOrCreate(
            ['kode' => 'SK.00.01'],
            [
                'klasifikasi_sekunder_id' => $sekSK00->id,
                'nama' => 'SK.00.01',
                'jenis_arsip' => 'Surat Keterangan Gaji / Penghasilan',
            ]
        );

        // ── 5. SURAT LAINNYA ──────────────────────────────────────────────────
        $primerLN = \App\Models\KlasifikasiPrimer::updateOrCreate(
            ['kode' => 'LN'],
            ['nama' => 'LN. SURAT LAINNYA']
        );

        $sekLN00 = \App\Models\KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'LN.00'],
            [
                'klasifikasi_primer_id' => $primerLN->id,
                'nama' => 'Permohonan / Pengajuan',
            ]
        );

        \App\Models\KlasifikasiTersier::updateOrCreate(
            ['kode' => 'LN.00.00'],
            [
                'klasifikasi_sekunder_id' => $sekLN00->id,
                'nama' => 'LN.00.00',
                'jenis_arsip' => 'Surat Permohonan Izin',
            ]
        );

        \App\Models\KlasifikasiTersier::updateOrCreate(
            ['kode' => 'LN.00.01'],
            [
                'klasifikasi_sekunder_id' => $sekLN00->id,
                'nama' => 'LN.00.01',
                'jenis_arsip' => 'Surat Permohonan Dana / Sponsorship',
            ]
        );

        $sekLN01 = \App\Models\KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'LN.01'],
            [
                'klasifikasi_primer_id' => $primerLN->id,
                'nama' => 'Pemberitahuan / Edaran',
            ]
        );

        \App\Models\KlasifikasiTersier::updateOrCreate(
            ['kode' => 'LN.01.00'],
            [
                'klasifikasi_sekunder_id' => $sekLN01->id,
                'nama' => 'LN.01.00',
                'jenis_arsip' => 'Surat Pemberitahuan Internal',
            ]
        );

        \App\Models\KlasifikasiTersier::updateOrCreate(
            ['kode' => 'LN.01.01'],
            [
                'klasifikasi_sekunder_id' => $sekLN01->id,
                'nama' => 'LN.01.01',
                'jenis_arsip' => 'Surat Edaran',
            ]
        );
    }
}
