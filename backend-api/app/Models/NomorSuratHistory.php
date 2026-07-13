<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NomorSuratHistory extends Model
{
    protected $table = 'nomor_surat_histories';
    
    // Disable default timestamps since we use generated_at
    public $timestamps = false;

    protected $fillable = [
        'surat_umum_id',
        'nomor_surat_id',
        'generated_by',
        'status_step',
        'generated_at',
    ];

    protected $casts = [
        'generated_at' => 'datetime',
    ];

    public function suratUmum()
    {
        return $this->belongsTo(SuratUmum::class, 'surat_umum_id');
    }

    public function nomorSurat()
    {
        return $this->belongsTo(NomorSurat::class, 'nomor_surat_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}
