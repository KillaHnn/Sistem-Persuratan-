<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailSuratPengantar extends Model
{
    protected $table = 'detail_surat_pengantar';

    protected $fillable = [
        'surat_umum_id',
        'ditujukan_kepada',
        'keperluan',
        'lampiran',
        'keterangan',
    ];

    public function suratUmum(): BelongsTo
    {
        return $this->belongsTo(SuratUmum::class);
    }
}
