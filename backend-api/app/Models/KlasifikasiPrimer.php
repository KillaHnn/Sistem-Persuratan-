<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KlasifikasiPrimer extends Model
{
    protected $fillable = ['kode', 'nama'];

    public function sekunder()
    {
        return $this->hasMany(KlasifikasiSekunder::class);
    }
}
