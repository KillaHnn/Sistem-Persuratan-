<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KlasifikasiTersier extends Model
{
    protected $fillable = ['klasifikasi_sekunder_id', 'kode', 'nama', 'jenis_arsip'];

    public function sekunder()
    {
        return $this->belongsTo(KlasifikasiSekunder::class);
    }
}
