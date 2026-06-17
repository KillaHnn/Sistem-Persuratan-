<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailUndangan extends Model
{
    protected $table = 'detail_undangan';

    protected $fillable = [
        'surat_umum_id',
        'nama_kegiatan',
        'tanggal_kegiatan',
        'waktu_mulai',
        'waktu_selesai',
        'tempat',
        'ditujukan_kepada',
        'keterangan',
    ];

    protected $casts = [
        'tanggal_kegiatan' => 'date',
    ];

    public function suratUmum(): BelongsTo
    {
        return $this->belongsTo(SuratUmum::class);
    }
}
