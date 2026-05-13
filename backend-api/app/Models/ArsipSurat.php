<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArsipSurat extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'surat_umum_id',
        'nomor_arsip',
        'lokasi_fisik',
        'path_digital',
        'dibuat_oleh',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function suratUmum(): BelongsTo
    {
        return $this->belongsTo(SuratUmum::class);
    }

    public function dibuatOleh(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }
}
