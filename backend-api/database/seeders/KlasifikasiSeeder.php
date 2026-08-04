<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\KlasifikasiPrimer;
use App\Models\KlasifikasiSekunder;
use App\Models\KlasifikasiTersier;

class KlasifikasiSeeder extends Seeder
{
    public function run(): void
    {
        // ══════════════════════════════════════════════════════════════════════
        // KP. KEPEGAWAIAN
        // ══════════════════════════════════════════════════════════════════════
        $KP = KlasifikasiPrimer::updateOrCreate(
            ['kode' => 'KP'],
            ['nama' => 'KP. KEPEGAWAIAN']
        );

        // KP.00 — Kebijakan di bidang manajemen Kepegawaian (tanpa tersier)
        $KP00 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'KP.00'],
            ['klasifikasi_primer_id' => $KP->id, 'nama' => 'Kebijakan di bidang manajemen Kepegawaian']
        );
        KlasifikasiTersier::updateOrCreate(
            ['kode' => 'KP.00.00'],
            ['klasifikasi_sekunder_id' => $KP00->id, 'nama' => 'KP.00.00', 'jenis_arsip' => 'Kebijakan di bidang manajemen Kepegawaian']
        );

        // KP.01 — Penyusunan dan Penetapan Kebutuhan ASN
        $KP01 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'KP.01'],
            ['klasifikasi_primer_id' => $KP->id, 'nama' => 'Penyusunan dan Penetapan Kebutuhan Aparatur Sipil Negara']
        );
        foreach ([
            'KP.01.00' => 'Perencanaan Kebutuhan ASN',
            'KP.01.01' => 'Perencanaan Pertimbangan Formasi',
            'KP.01.02' => 'Penetapan Kebutuhan Aparatur Sipil Negara',
            'KP.01.03' => 'Standarisasi Jabatan',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $KP01->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // KP.02 — Formasi Pegawai
        $KP02 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'KP.02'],
            ['klasifikasi_primer_id' => $KP->id, 'nama' => 'Formasi Pegawai']
        );
        foreach ([
            'KP.02.00' => 'Usulan dari Unit kerja',
            'KP.02.01' => 'Usulan permintaan formasi',
            'KP.02.02' => 'Persetujuan formasi dari Menpan',
            'KP.02.03' => 'Penetapan formasi di IPB',
            'KP.02.04' => 'Penetapan formasi khusus',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $KP02->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // KP.03 — Pengadaan ASN PNS
        $KP03 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'KP.03'],
            ['klasifikasi_primer_id' => $KP->id, 'nama' => 'Pengadaan ASN PNS']
        );
        foreach ([
            'KP.03.00' => 'Proses Penerimaan Pegawai',
            'KP.03.01' => 'Berkas lamaran yang diterima',
            'KP.03.02' => 'Berkas lamaran yang tidak diterima',
            'KP.03.03' => 'Usul dan kelengkapan penetapan NIP',
            'KP.03.04' => 'Usul Pengangkatan CPNS menjadi PNS lebih 2 tahun',
            'KP.03.05' => 'SK CPNS/PNS Kolektif',
            'KP.03.06' => 'Usul dan kelengkapan Nomor Induk Dosen (NIDN)',
            'KP.03.07' => 'Open Bidding (Seleksi Terbuka Jabatan)',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $KP03->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // KP.04 — Pengadaan ASN P3K / Pegawai Kontrak
        $KP04 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'KP.04'],
            ['klasifikasi_primer_id' => $KP->id, 'nama' => 'Pengadaan ASN P3K (Pegawai Pemerintah dengan Perjanjian Kerja) / Pegawai Kontrak']
        );
        foreach ([
            'KP.04.00' => 'Proses Penerimaan Pegawai',
            'KP.04.01' => 'Pengangkatan ASN P3K',
            'KP.04.02' => 'Berkas lamaran yang diterima',
            'KP.04.03' => 'Berkas lamaran yang tidak diterima',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $KP04->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // KP.05 — Pengadaan Pegawai Honorer / Harian Lepas
        $KP05 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'KP.05'],
            ['klasifikasi_primer_id' => $KP->id, 'nama' => 'Pengadaan Pegawai Honorer / Harian Lepas']
        );
        foreach ([
            'KP.05.00' => 'Proses Penerimaan Pegawai',
            'KP.05.01' => 'Pengangkatan Pegawai Honorer / harian lepas',
            'KP.05.02' => 'Berkas lamaran yang diterima',
            'KP.05.03' => 'Berkas lamaran yang tidak diterima',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $KP05->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // KP.06 — Pembinaan / Pengembangan Karir Pegawai
        $KP06 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'KP.06'],
            ['klasifikasi_primer_id' => $KP->id, 'nama' => 'Pembinaan / Pengembangan Karir Pegawai']
        );
        foreach ([
            'KP.06.00' => 'Tugas belajar/ijin belajar/diklat/kursus/ujian dinas/uji kompetensi',
            'KP.06.01' => 'Sasaran Kinerja Pegawai (SKP)',
            'KP.06.02' => 'Pakta Integritas',
            'KP.06.03' => 'Penetapan Angka Kredit (PAK)',
            'KP.06.04' => 'Sertifikasi Pegawai',
            'KP.06.05' => 'Kode Etik',
            'KP.06.06' => 'Disiplin pegawai',
            'KP.06.07' => 'Hukuman disiplin',
            'KP.06.08' => 'Penghargaan dan tanda jasa',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $KP06->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // KP.07 — Sistem Informasi Kepegawaian
        $KP07 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'KP.07'],
            ['klasifikasi_primer_id' => $KP->id, 'nama' => 'Sistem Informasi Kepegawaian']
        );
        foreach ([
            'KP.07.00' => 'Pengolahan data dan informasi kepegawaian',
            'KP.07.01' => 'Pengembangan sistem informasi kepegawaian',
            'KP.07.02' => 'Pengembangan sistem pengelolaan arsip kepegawaian',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $KP07->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // KP.08 — Pengawasan dan pengendalian
        $KP08 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'KP.08'],
            ['klasifikasi_primer_id' => $KP->id, 'nama' => 'Pengawasan dan pengendalian']
        );
        foreach ([
            'KP.08.00' => 'Formasi, pengadaan dan pasca diklat',
            'KP.08.01' => 'Kepangkatan, pengangkatan, dan pemberhentian dalam jabatan',
            'KP.08.02' => 'Gaji dan tunjangan, kesejahteraan dan kinerja',
            'KP.08.03' => 'Kode Etik, disiplin, pemberhentian dan pensiun ASN',
            'KP.08.04' => 'Laporan Hasil Pengawasan dan Pengendalian',
            'KP.08.05' => 'Berkas sanggahan terhadap Permasalahan Tenaga Honorer',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $KP08->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // KP.09 — Mutasi Pegawai
        $KP09 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'KP.09'],
            ['klasifikasi_primer_id' => $KP->id, 'nama' => 'Mutasi Pegawai']
        );
        foreach ([
            'KP.09.00' => 'Alih status, pindah instansi, Pindah Wilayah Kerja, Diperbantukan, Dipekerjakan, Penugasan sementara, Pindah sementara, Mutasi antar unit',
            'KP.09.01' => 'Mutasi keluarga',
            'KP.09.02' => 'Usul kenaikan pangkat Golongan',
            'KP.09.03' => 'Kenaikan Gaji berkala',
            'KP.09.04' => 'Usul pengangkatan dan pemberhentian dalam jabatan',
            'KP.09.05' => 'Usul penetapan perubahan data dasar/status/kedudukan hukum pegawai',
            'KP.09.06' => 'Peninjauan masa kerja',
            'KP.09.07' => 'Berkas BAPERJAKAT',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $KP09->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // KP.10 — Administrasi Pegawai
        $KP10 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'KP.10'],
            ['klasifikasi_primer_id' => $KP->id, 'nama' => 'Administrasi Pegawai']
        );
        foreach ([
            'KP.10.00' => 'Cuti besar',
            'KP.10.01' => 'Cuti sakit, Cuti bersalin, Cuti tahunan',
            'KP.10.02' => 'Cuti alasan penting',
            'KP.10.03' => 'Cuti Diluar Tanggungan Negara (CTLN)',
            'KP.10.04' => 'Dokumentasi identitas pegawai',
            'KP.10.05' => 'Daftar Urut kepangkatan (DUK)',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $KP10->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // KP.11 — Kesejahteraan Pegawai
        $KP11 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'KP.11'],
            ['klasifikasi_primer_id' => $KP->id, 'nama' => 'Kesejahteraan Pegawai']
        );
        foreach ([
            'KP.11.00' => 'Layanan pemeliharaan kesehatan pegawai',
            'KP.11.01' => 'Asuransi Pegawai / ASKES / BPJS',
            'KP.11.02' => 'Tabungan Perumahan',
            'KP.11.03' => 'Bantuan Sosial',
            'KP.11.04' => 'Rekreasi',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $KP11->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // KP.12 — Pemberhentian pegawai (tanpa tersier)
        $KP12 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'KP.12'],
            ['klasifikasi_primer_id' => $KP->id, 'nama' => 'Pemberhentian pegawai']
        );
        KlasifikasiTersier::updateOrCreate(
            ['kode' => 'KP.12.00'],
            ['klasifikasi_sekunder_id' => $KP12->id, 'nama' => 'KP.12.00', 'jenis_arsip' => 'Pemberhentian pegawai']
        );

        // KP.13 — Perselisihan/Sengketa kepegawaian (tanpa tersier)
        $KP13 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'KP.13'],
            ['klasifikasi_primer_id' => $KP->id, 'nama' => 'Perselisihan / Sengketa kepegawaian']
        );
        KlasifikasiTersier::updateOrCreate(
            ['kode' => 'KP.13.00'],
            ['klasifikasi_sekunder_id' => $KP13->id, 'nama' => 'KP.13.00', 'jenis_arsip' => 'Perselisihan / Sengketa kepegawaian']
        );

        // KP.14 — Usul pemberhentian dan penetapan pensiun (tanpa tersier)
        $KP14 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'KP.14'],
            ['klasifikasi_primer_id' => $KP->id, 'nama' => 'Usul pemberhentian dan penetapan pensiun pegawai/janda/duda & PNS yang tewas']
        );
        KlasifikasiTersier::updateOrCreate(
            ['kode' => 'KP.14.00'],
            ['klasifikasi_sekunder_id' => $KP14->id, 'nama' => 'KP.14.00', 'jenis_arsip' => 'Usul pemberhentian dan penetapan pensiun pegawai/janda/duda & PNS yang tewas']
        );

        // KP.15 — Berkas Perseorangan ASN PNS (tanpa tersier)
        $KP15 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'KP.15'],
            ['klasifikasi_primer_id' => $KP->id, 'nama' => 'Berkas Perseorangan Pegawai ASN PNS']
        );
        KlasifikasiTersier::updateOrCreate(
            ['kode' => 'KP.15.00'],
            ['klasifikasi_sekunder_id' => $KP15->id, 'nama' => 'KP.15.00', 'jenis_arsip' => 'Berkas Perseorangan Pegawai ASN PNS']
        );

        // KP.16 — Berkas perseorangan ASN P3K (tanpa tersier)
        $KP16 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'KP.16'],
            ['klasifikasi_primer_id' => $KP->id, 'nama' => 'Berkas perseorangan ASN P3K']
        );
        KlasifikasiTersier::updateOrCreate(
            ['kode' => 'KP.16.00'],
            ['klasifikasi_sekunder_id' => $KP16->id, 'nama' => 'KP.16.00', 'jenis_arsip' => 'Berkas perseorangan ASN P3K']
        );

        // KP.17 — Berkas Perseorangan Pegawai Honorer (tanpa tersier)
        $KP17 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'KP.17'],
            ['klasifikasi_primer_id' => $KP->id, 'nama' => 'Berkas Perseorangan Pegawai Honorer']
        );
        KlasifikasiTersier::updateOrCreate(
            ['kode' => 'KP.17.00'],
            ['klasifikasi_sekunder_id' => $KP17->id, 'nama' => 'KP.17.00', 'jenis_arsip' => 'Berkas Perseorangan Pegawai Honorer']
        );

        // KP.18 — Penilaian Kompetensi
        $KP18 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'KP.18'],
            ['klasifikasi_primer_id' => $KP->id, 'nama' => 'Penilaian Kompetensi']
        );
        foreach ([
            'KP.18.00' => 'Berkas Penilaian Kompetensi',
            'KP.18.01' => 'Hasil Penilaian Kompetensi, dll.',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $KP18->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // ══════════════════════════════════════════════════════════════════════
        // TU. KETATAUSAHAAN
        // ══════════════════════════════════════════════════════════════════════
        $TU = KlasifikasiPrimer::updateOrCreate(
            ['kode' => 'TU'],
            ['nama' => 'TU. KETATAUSAHAAN']
        );

        // TU.00 — Permintaan penggandaan dokumen/arsip (tanpa tersier)
        $TU00 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'TU.00'],
            ['klasifikasi_primer_id' => $TU->id, 'nama' => 'Permintaan penggandaan dokumen/arsip']
        );
        KlasifikasiTersier::updateOrCreate(
            ['kode' => 'TU.00.00'],
            ['klasifikasi_sekunder_id' => $TU00->id, 'nama' => 'TU.00.00', 'jenis_arsip' => 'Permintaan penggandaan dokumen/arsip']
        );

        // TU.01 — Risalah/notula rapat
        $TU01 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'TU.01'],
            ['klasifikasi_primer_id' => $TU->id, 'nama' => 'Risalah / notula rapat']
        );
        foreach ([
            'TU.01.00' => 'Rapat Staf',
            'TU.01.01' => 'Rapat Pimpinan',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $TU01->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // ══════════════════════════════════════════════════════════════════════
        // RT. KERUMAHTANGGAAN
        // ══════════════════════════════════════════════════════════════════════
        $RT = KlasifikasiPrimer::updateOrCreate(
            ['kode' => 'RT'],
            ['nama' => 'RT. KERUMAHTANGGAAN']
        );

        // RT.00 — Telekomunikasi
        $RT00 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'RT.00'],
            ['klasifikasi_primer_id' => $RT->id, 'nama' => 'Telekomunikasi : telepon, radio, teleks/Fax, cctv, tv, kabel dan internet']
        );
        KlasifikasiTersier::updateOrCreate(
            ['kode' => 'RT.00.00'],
            ['klasifikasi_sekunder_id' => $RT00->id, 'nama' => 'RT.00.00', 'jenis_arsip' => 'Penggunaan peralatan']
        );

        // RT.01 — Perjalanan dinas
        $RT01 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'RT.01'],
            ['klasifikasi_primer_id' => $RT->id, 'nama' => 'Perjalanan dinas']
        );
        foreach ([
            'RT.01.00' => 'Dalam Negeri',
            'RT.01.01' => 'Luar Negeri',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $RT01->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // RT.02 — Penggunaan fasilitas kantor (tanpa tersier)
        $RT02 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'RT.02'],
            ['klasifikasi_primer_id' => $RT->id, 'nama' => 'Penggunaan fasilitas kantor']
        );
        KlasifikasiTersier::updateOrCreate(
            ['kode' => 'RT.02.00'],
            ['klasifikasi_sekunder_id' => $RT02->id, 'nama' => 'RT.02.00', 'jenis_arsip' => 'Penggunaan fasilitas kantor']
        );

        // RT.03 — Pengurusan kendaraan dinas
        $RT03 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'RT.03'],
            ['klasifikasi_primer_id' => $RT->id, 'nama' => 'Pengurusan kendaraan dinas']
        );
        foreach ([
            'RT.03.00' => 'Pengurusan surat-surat kendaraan dinas',
            'RT.03.01' => 'Pemeliharaan dan perbaikan',
            'RT.03.02' => 'Pengurusan kehilangan kendaraan',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $RT03->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // RT.04 — Permohonan pemeliharaaan gedung dan taman
        $RT04 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'RT.04'],
            ['klasifikasi_primer_id' => $RT->id, 'nama' => 'Permohonan pemeliharaan gedung dan taman']
        );
        foreach ([
            'RT.04.00' => 'Pertamanan/landscaping',
            'RT.04.01' => 'Perbaikan gedung',
            'RT.04.02' => 'Perbaikan rumah dinas/wisma',
            'RT.04.03' => 'Kebersihan gedung dan taman',
            'RT.04.04' => 'Sewa (Tanah, Gedung, Peralatan dan mesin)',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $RT04->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // RT.05 — Mekanikal dan engineering
        $RT05 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'RT.05'],
            ['klasifikasi_primer_id' => $RT->id, 'nama' => 'Mekanikal dan engineering : jaringan listrik, air, gas dan komputer']
        );
        foreach ([
            'RT.05.00' => 'Pemasangan jaringan/instalasi listrik, air, gas dan komputer',
            'RT.05.01' => 'Pengelolaan jaringan/instalasi listrik, air, gas, dan komputer',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $RT05->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // RT.06 — Keamanan dan ketertiban/Sekuriti
        $RT06 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'RT.06'],
            ['klasifikasi_primer_id' => $RT->id, 'nama' => 'Keamanan dan ketertiban / Sekuriti']
        );
        foreach ([
            'RT.06.00' => 'Pengamanan/penjagaan dan pengawalan terhadap pejabat, rumah dinas dan kampus',
            'RT.06.01' => 'Ketertiban dan keamanan',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $RT06->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // RT.07 — Pengelolaan parkir (tanpa tersier)
        $RT07 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'RT.07'],
            ['klasifikasi_primer_id' => $RT->id, 'nama' => 'Pengelolaan parkir']
        );
        KlasifikasiTersier::updateOrCreate(
            ['kode' => 'RT.07.00'],
            ['klasifikasi_sekunder_id' => $RT07->id, 'nama' => 'RT.07.00', 'jenis_arsip' => 'Pengelolaan parkir']
        );

        // RT.08 — Pakaian dinas (tanpa tersier)
        $RT08 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'RT.08'],
            ['klasifikasi_primer_id' => $RT->id, 'nama' => 'Pakaian dinas pegawai, satpam, petugas kebersihan, petugas kesehatan dan pegawai lainnya']
        );
        KlasifikasiTersier::updateOrCreate(
            ['kode' => 'RT.08.00'],
            ['klasifikasi_sekunder_id' => $RT08->id, 'nama' => 'RT.08.00', 'jenis_arsip' => 'Pakaian dinas pegawai, satpam, petugas kebersihan, petugas kesehatan dan pegawai lainnya']
        );

        // RT.09 — Konsumsi dan akomodasi (tanpa tersier)
        $RT09 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'RT.09'],
            ['klasifikasi_primer_id' => $RT->id, 'nama' => 'Konsumsi dan akomodasi']
        );
        KlasifikasiTersier::updateOrCreate(
            ['kode' => 'RT.09.00'],
            ['klasifikasi_sekunder_id' => $RT09->id, 'nama' => 'RT.09.00', 'jenis_arsip' => 'Konsumsi dan akomodasi']
        );

        // ══════════════════════════════════════════════════════════════════════
        // PL. PERLENGKAPAN
        // ══════════════════════════════════════════════════════════════════════
        $PL = KlasifikasiPrimer::updateOrCreate(
            ['kode' => 'PL'],
            ['nama' => 'PL. PERLENGKAPAN']
        );

        // PL.00 — Rencana kebutuhan barang / RUP
        $PL00 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'PL.00'],
            ['klasifikasi_primer_id' => $PL->id, 'nama' => 'Rencana kebutuhan barang / Rencana umum pengadaan']
        );
        foreach ([
            'PL.00.00' => 'Rencana kebutuhan unit kerja',
            'PL.00.01' => 'Rencana kebutuhan IPB',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $PL00->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // PL.01 — Pengadaan barang
        $PL01 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'PL.01'],
            ['klasifikasi_primer_id' => $PL->id, 'nama' => 'Pengadaan barang']
        );
        foreach ([
            'PL.01.00' => 'Pengadaan barang tidak melalui lelang (penunjukan langsung)',
            'PL.01.01' => 'Pengadaan barang melalui lelang',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $PL01->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // PL.02 — Pengadaan Jasa
        $PL02 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'PL.02'],
            ['klasifikasi_primer_id' => $PL->id, 'nama' => 'Pengadaan Jasa']
        );
        foreach ([
            'PL.02.00' => 'Pengadaan jasa tidak melalui lelang (penunjukan langsung)',
            'PL.02.01' => 'Pengadaan jasa melalui lelang',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $PL02->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // PL.03 s/d PL.09 — tanpa tersier
        foreach ([
            'PL.03' => 'Pengadaan barang dan jasa melalui bantuan/hibah',
            'PL.04' => 'Pengadaan Barang dan jasa melalui bantuan/hibah/pinjaman dana asing',
            'PL.05' => 'Pengadaan barang dan jasa melalui tukar menukar',
            'PL.06' => 'Pengadaan barang dan jasa melalui pinjaman',
            'PL.07' => 'Pengadaan barang dan jasa melalui sewa',
            'PL.08' => 'Penyimpanan/pergudangan',
            'PL.09' => 'Penyaluran/Distribusi',
        ] as $kodeSek => $namaSek) {
            $sek = KlasifikasiSekunder::updateOrCreate(
                ['kode' => $kodeSek],
                ['klasifikasi_primer_id' => $PL->id, 'nama' => $namaSek]
            );
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kodeSek . '.00'],
                ['klasifikasi_sekunder_id' => $sek->id, 'nama' => $kodeSek . '.00', 'jenis_arsip' => $namaSek]
            );
        }

        // PL.10 — Inventarisasi barang
        $PL10 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'PL.10'],
            ['klasifikasi_primer_id' => $PL->id, 'nama' => 'Inventarisasi barang']
        );
        foreach ([
            'PL.10.00' => 'Daftar opname fisik barang inventaris (DOFBI)',
            'PL.10.01' => 'Kartu inventaris barang (KIB)',
            'PL.10.02' => 'Laporan SIMAK BMN',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $PL10->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // PL.11 — Perbaikan/pemeliharaan
        $PL11 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'PL.11'],
            ['klasifikasi_primer_id' => $PL->id, 'nama' => 'Perbaikan/pemeliharaan']
        );
        foreach ([
            'PL.11.00' => 'Pemeliharaan barang bergerak/inventaris kantor',
            'PL.11.01' => 'Perbaikan/pemeliharaan barang investasi',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $PL11->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // PL.12 — Penghapusan barang
        $PL12 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'PL.12'],
            ['klasifikasi_primer_id' => $PL->id, 'nama' => 'Penghapusan barang']
        );
        foreach ([
            'PL.12.00' => 'Penghapusan barang bergerak/inventaris',
            'PL.12.01' => 'Penghapusan barang tidak bergerak/investasi',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $PL12->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // PL.13 s/d PL.15 — tanpa tersier
        foreach ([
            'PL.13' => 'Bukti-bukti kepemilikan aset',
            'PL.14' => 'Pemanfaatan Aset',
            'PL.15' => 'Penggunaan Aset',
        ] as $kodeSek => $namaSek) {
            $sek = KlasifikasiSekunder::updateOrCreate(
                ['kode' => $kodeSek],
                ['klasifikasi_primer_id' => $PL->id, 'nama' => $namaSek]
            );
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kodeSek . '.00'],
                ['klasifikasi_sekunder_id' => $sek->id, 'nama' => $kodeSek . '.00', 'jenis_arsip' => $namaSek]
            );
        }

        // ══════════════════════════════════════════════════════════════════════
        // TI. TEKNOLOGI INFORMASI DAN KOMUNIKASI
        // ══════════════════════════════════════════════════════════════════════
        $TI = KlasifikasiPrimer::updateOrCreate(
            ['kode' => 'TI'],
            ['nama' => 'TI. TEKNOLOGI INFORMASI DAN KOMUNIKASI']
        );

        // TI.00 — Organisasi TI
        $TI00 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'TI.00'],
            ['klasifikasi_primer_id' => $TI->id, 'nama' => 'Organisasi TI']
        );
        foreach ([
            'TI.00.00' => 'Rencana Strategis TI',
            'TI.00.01' => 'Enterprise Architecture',
            'TI.00.02' => 'Tata Kelola Teknologi Informasi',
            'TI.00.03' => 'Perencanaan IT',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $TI00->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // TI.01 — Sistem Informasi
        $TI01 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'TI.01'],
            ['klasifikasi_primer_id' => $TI->id, 'nama' => 'Sistem Informasi']
        );
        foreach ([
            'TI.01.00' => 'Perencanaan dan Analisis Sistem',
            'TI.01.01' => 'Perancangan Sistem',
            'TI.01.02' => 'Pembangunan dan Implementasi Sistem',
            'TI.01.03' => 'Pemeliharaan Sistem Informasi',
            'TI.01.04' => 'Dokumentasi Sistem Informasi',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $TI01->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // TI.02 — Manajemen Layanan TI
        $TI02 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'TI.02'],
            ['klasifikasi_primer_id' => $TI->id, 'nama' => 'Manajemen Layanan Teknologi Informasi']
        );
        foreach ([
            'TI.02.00' => 'Desain Strategi Layanan',
            'TI.02.01' => 'Rancangan Layanan',
            'TI.02.02' => 'Transisi Layanan',
            'TI.02.03' => 'Layanan Operasional',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $TI02->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // TI.03 — Pengelolaan Data
        $TI03 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'TI.03'],
            ['klasifikasi_primer_id' => $TI->id, 'nama' => 'Pengelolaan Data']
        );
        foreach ([
            'TI.03.00' => 'Tata Kelola Data',
            'TI.03.01' => 'Pengelolaan Arsitektur Data',
            'TI.03.02' => 'Pengembangan Data',
            'TI.03.03' => 'Pengelolaan Pengoperasian Data',
            'TI.03.04' => 'Pengelolaan Keamanan Data',
            'TI.03.05' => 'Pengelolaan Kualitas Data',
            'TI.03.06' => 'Pencadangan (Backup) Data',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $TI03->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // TI.04 — Pengolahan Data
        $TI04 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'TI.04'],
            ['klasifikasi_primer_id' => $TI->id, 'nama' => 'Pengolahan Data']
        );
        foreach ([
            'TI.04.00' => 'Perencanaan Pengolahan Data',
            'TI.04.01' => 'Persiapan pengolahan Data',
            'TI.04.02' => 'Pelaksanaan Pengolahan Data',
            'TI.04.03' => 'Monitoring dan Evaluasi',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $TI04->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // TI.05 — Jaringan dan Komunikasi
        $TI05 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'TI.05'],
            ['klasifikasi_primer_id' => $TI->id, 'nama' => 'Jaringan dan Komunikasi']
        );
        foreach ([
            'TI.05.00' => 'Analisis Jaringan Komputer',
            'TI.05.01' => 'Perancangan Jaringan Komputer',
            'TI.05.02' => 'Implementasi Jaringan Komputer',
            'TI.05.03' => 'Pemeliharaan Jaringan',
            'TI.05.04' => 'Keamanan Jaringan, dll.',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $TI05->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // TI.06 — Manajemen Fasilitas TI
        $TI06 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'TI.06'],
            ['klasifikasi_primer_id' => $TI->id, 'nama' => 'Manajemen Fasilitas TI']
        );
        foreach ([
            'TI.06.00' => 'Perencanaan fasilitas TI',
            'TI.06.01' => 'Pengoperasian dan evaluasi fasilitas TI',
            'TI.06.02' => 'Pemeliharaan fasilitas TI, dll.',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $TI06->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // TI.07 — Audit TI
        $TI07 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'TI.07'],
            ['klasifikasi_primer_id' => $TI->id, 'nama' => 'Audit TI']
        );
        foreach ([
            'TI.07.00' => 'Perencanaan Audit TI',
            'TI.07.01' => 'Tinjauan Audit TI',
            'TI.07.02' => 'Analisis data Audit TI',
            'TI.07.03' => 'Evaluasi Temuan, dll.',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $TI07->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // TI.08 — Manajemen Risiko TI
        $TI08 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'TI.08'],
            ['klasifikasi_primer_id' => $TI->id, 'nama' => 'Manajemen Risiko TI']
        );
        foreach ([
            'TI.08.00' => 'Identitas risiko TI',
            'TI.08.01' => 'Penilaian Risiko TI',
            'TI.08.02' => 'Pengendalian Risiko TI',
            'TI.08.03' => 'Pemantauan dan Evaluasi Penanganan Risiko TI',
        ] as $kode => $arsip) {
            KlasifikasiTersier::updateOrCreate(
                ['kode' => $kode],
                ['klasifikasi_sekunder_id' => $TI08->id, 'nama' => $kode, 'jenis_arsip' => $arsip]
            );
        }

        // TI.09 — Pemetaan TI (tanpa tersier)
        $TI09 = KlasifikasiSekunder::updateOrCreate(
            ['kode' => 'TI.09'],
            ['klasifikasi_primer_id' => $TI->id, 'nama' => 'Pemetaan TI']
        );
        KlasifikasiTersier::updateOrCreate(
            ['kode' => 'TI.09.00'],
            ['klasifikasi_sekunder_id' => $TI09->id, 'nama' => 'TI.09.00', 'jenis_arsip' => 'Pemetaan TI']
        );
    }
}
