<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KlasifikasiSekunder extends Model
{
    protected $fillable = ['klasifikasi_primer_id', 'kode', 'nama'];

    public function primer()
    {
        return $this->belongsTo(KlasifikasiPrimer::class);
    }

    public function tersier()
    {
        return $this->hasMany(KlasifikasiTersier::class);
    }
}
