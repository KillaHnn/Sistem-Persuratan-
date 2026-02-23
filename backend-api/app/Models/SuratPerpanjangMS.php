<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratPerpanjangMS extends Model
{
    protected $table = 'surat_perpanjang_ms';

    protected $fillable = [
        'profile_id',
        'tahun_akademik',
        'semester',
        'dosen_pembimbing',
        'tahun_akhir_perpanjang',
        'file_table',
        'status',
        'catatan',
    ];

    public function profileMHS()
    {
        return $this->belongsTo(ProfileMHS::class, 'profile_id');
    }
}
