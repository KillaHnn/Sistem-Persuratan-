<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailSuratKeputusan extends Model
{
    use HasFactory;

    protected $table = 'detail_surat_keputusan';

    protected $fillable = [
        'surat_umum_id',
        'jenis_sk',
        'tentang',
        'menimbang',
        'mengingat',
        'diktum_keputusan',
        'tembusan',
    ];

    public function suratUmum()
    {
        return $this->belongsTo(SuratUmum::class);
    }
}
