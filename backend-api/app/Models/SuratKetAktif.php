<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratKetAktif extends Model
{
    protected $table = 'surat_ket_aktif';

    protected $fillable = [
        'profile_id',
        'surat_cuti_id', // Added as it's a foreign key in migration
        'tahun_akademik',
        'semester',
        'tanggal_lapor',
        'tahun_akademik_aktif',
        'semester_aktif',
        'file_pengantar',
        'file_surat_cuti',
        'file_spp',
        'status',
        'catatan',
    ];

    //direlasikan dengan table surat_cuti untuk mengambil data tahun akademik dan semester cuti serta file surat cuti

    public function profileMHS()
    {
        return $this->belongsTo(ProfileMHS::class, 'profile_id');
    }

    public function suratCuti()
    {
        return $this->belongsTo(SuratCuti::class, 'surat_cuti_id');
    }
}
