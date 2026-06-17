<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailSuratKeteranganUmum extends Model
{
    protected $table = 'detail_surat_keterangan_umum';

    protected $fillable = [
        'surat_umum_id',
        'nama_yang_diterangkan',
        'nip',
        'jabatan',
        'unit_kerja',
        'isi_keterangan',
        'keperluan',
    ];

    public function suratUmum(): BelongsTo
    {
        return $this->belongsTo(SuratUmum::class);
    }
}
