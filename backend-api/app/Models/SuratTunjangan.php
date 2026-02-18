<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratTunjangan extends Model
{
    //
    protected $table = 'surat_tunjangans';

    protected $fillable = [
        'profile_id',
        'tahun_akademik',
        'semester',
        'nama_ortu',
        'nip_nrp_ortu',
        'pangkat_golongan',
        'nama_instansi',
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
