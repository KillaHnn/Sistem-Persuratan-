<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratCuti extends Model
{
    protected $table = 'surat_cutis';

    protected $fillable = [
        'profile_id',
        'tahun_akademik',
        'semester',
        'tahun_akademik_cuti',
        'semester_cuti',
        'alasan_cuti',
        'file_pengajuan',
        'file_pengantar_prodi',
        'file_surat_keterangan',
        'status',
        'catatan',  
    ];

    public function profileMHS()
    {
        return $this->belongsTo(ProfileMHS::class, 'profile_id');
    }

    public function suratAktif()
    {
        return $this->hasOne(SuratKetAktif::class, 'surat_cuti_id');
    }
}
