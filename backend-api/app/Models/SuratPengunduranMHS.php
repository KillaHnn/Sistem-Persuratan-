<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratPengunduranMHS extends Model
{
    protected $table = 'surat_pengunduran_mhs';

    protected $fillable = [
        'profile_id',
        'tahun_akademik',
        'semester',
        'thn_akademik_pengunduran',
        'tanggal_pengunduran',
        'tanggal_terakhi_aktif', // Fixed typo from migration (tanggal_terakhi_aktif) or model usage? Migration said 'tanggal_terakhi_aktif', Model said 'tahun_terakhir_aktif'? Let's check migration again. Migration has 'tanggal_terakhi_aktif'. Model has 'tahun_terakhir_aktif'. I should align with migration.
        'file_ktm',
        'file_pengajuan',
        'file_pengantar_prodi',
        'status',
        'catatan',
    ];

    public function profileMHS()
    {
        return $this->belongsTo(ProfileMHS::class, 'profile_id');
    }
}
