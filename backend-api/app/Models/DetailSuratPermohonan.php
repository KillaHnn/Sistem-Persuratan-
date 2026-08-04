<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailSuratPermohonan extends Model
{
    protected $table = 'detail_surat_permohonan';

    protected $fillable = [
        'surat_umum_id',
        'permohonan',
        'tujuan_permohonan',
        'keterangan',
    ];

    public function suratUmum(): BelongsTo
    {
        return $this->belongsTo(SuratUmum::class);
    }
}
