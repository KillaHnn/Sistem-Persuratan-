<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailSuratLainnya extends Model
{
    protected $table = 'detail_surat_lainnya';

    protected $fillable = [
        'surat_umum_id',
        'deskripsi',
        'ditujukan_kepada',
        'keterangan',
    ];

    public function suratUmum(): BelongsTo
    {
        return $this->belongsTo(SuratUmum::class);
    }
}
