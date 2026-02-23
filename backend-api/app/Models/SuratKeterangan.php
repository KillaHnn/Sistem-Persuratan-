<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratKeterangan extends Model
{
    protected $table = 'surat_keterangans';

    protected $fillable = [
        'profile_id',
        'tahun_akademik',
        'semester',
        'keperluan',
        'file_ktm',
        'file_spp',
        'status',
        'catatan',  
    ];

    public function profileMHS()
    {
        return $this->belongsTo(ProfileMHS::class, 'profile_id');
    }
}
