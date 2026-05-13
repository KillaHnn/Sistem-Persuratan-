<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailSuratTugas extends Model
{
    protected $table = 'detail_surat_tugas';

    protected $fillable = [
        'surat_umum_id',
        'nama_ditugaskan',
        'nip',
        'jabatan',
        'tujuan_tugas',
        'tempat_tugas',
        'tanggal_mulai',
        'tanggal_selesai',
        'dasar_penugasan',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
    ];

    public function suratUmum(): BelongsTo
    {
        return $this->belongsTo(SuratUmum::class);
    }
}
