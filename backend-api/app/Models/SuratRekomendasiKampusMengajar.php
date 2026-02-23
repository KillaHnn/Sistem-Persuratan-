<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratRekomendasiKampusMengajar extends Model
{
    //
    protected $table = 'surat_rekomendasi_kampus_mengajar';

    protected $fillable = [
        'profile_id',
        'tahun_akademik',
        'semester',
        'jumlah_sks',
        'ipk',
        'file_pengantar_prodi',
        'file_surat_persetujuan',
        'file_sptjm',
        'file_transkrip_kumulatif',
        'file_keterangan_dokter',
        'status',
        'catatan',
    ];

    public function profileMHS()
    {
        return $this->belongsTo(ProfileMHS::class, 'profile_id');
    }
}
