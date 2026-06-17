<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


class KlasifikasiSeeder extends Seeder
{
    public function run(): void
    {
        $primer = \App\Models\KlasifikasiPrimer::create([
            'kode' => 'TM',
            'nama' => 'TM. PENERIMAAN MAHASISWA BARU'
        ]);

        $sekunder = \App\Models\KlasifikasiSekunder::create([
            'klasifikasi_primer_id' => $primer->id,
            'kode' => 'TM.00',
            'nama' => 'TM.00'
        ]);

        \App\Models\KlasifikasiTersier::create([
            'klasifikasi_sekunder_id' => $sekunder->id,
            'kode' => 'TM.00.00',
            'nama' => 'TM.00.00',
            'jenis_arsip' => 'Penyusunan Rencana Penerimaan Mahasiswa Baru'
        ]);

        \App\Models\KlasifikasiTersier::create([
            'klasifikasi_sekunder_id' => $sekunder->id,
            'kode' => 'TM.00.01',
            'nama' => 'TM.00.01',
            'jenis_arsip' => 'Pengumuman Penerimaan Mahasiswa Baru'
        ]);

        $sekunder2 = \App\Models\KlasifikasiSekunder::create([
            'klasifikasi_primer_id' => $primer->id,
            'kode' => 'TM.01',
            'nama' => 'TM.01'
        ]);

        \App\Models\KlasifikasiTersier::create([
            'klasifikasi_sekunder_id' => $sekunder2->id,
            'kode' => 'TM.01.00',
            'nama' => 'TM.01.00',
            'jenis_arsip' => 'Pelaksanaan PMB'
        ]);
    }
}
