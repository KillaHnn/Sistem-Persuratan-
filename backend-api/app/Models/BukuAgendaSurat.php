<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BukuAgendaSurat extends Model
{
    protected $fillable = [
        'surat_umum_id',
        'nomor_surat',
        'tanggal_surat',
        'jenis_surat',
        'perihal',
        'keterangan',
        'created_by',
    ];

    public function suratUmum()
    {
        return $this->belongsTo(SuratUmum::class, 'surat_umum_id');
    }
}
