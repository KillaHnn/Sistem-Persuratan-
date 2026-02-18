<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratMagang extends Model
{
    protected $table = 'surat_magang';

    protected $fillable = [
        'profile_id',
        'tahun_akademik',
        'semester',
        'jumlah_sks',
        'ipk',
        'lokasi_kegiatan',
        'jenis_kegiatan',
        'file_pengantar_prodi',
        'file_surat_persetujuan',
        'file_sptjm',
        'status',
        'catatan',
    ];

    public function profileMHS()
    {
        return $this->belongsTo(ProfileMHS::class, 'profile_id');
    }
}
