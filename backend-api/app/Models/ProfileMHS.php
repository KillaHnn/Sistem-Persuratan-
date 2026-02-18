<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfileMHS extends Model
{
    protected $table = 'profile_m_h_s';

    protected $fillable = [
        'user_id',
        'nama',
        'nim',
        'no_hp',
        'email',
        'strata',
        'prodi',
        'fakultas',        
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    //relasikan ke semua table surat (kecuali surat keluar) yang ada

    public function suratTunjangan()
    {
        return $this->hasMany(SuratTunjangan::class, 'profile_mhs_id');
    }

    public function suratCuti()
    {
        return $this->hasMany(SuratCuti::class, 'profile_mhs_id');
    }

    public function suratKeterangan()
    {
        return $this->hasMany(SuratKeterangan::class, 'profile_mhs_id');
    }

    public function suratPerpanjangMS()
    {
        return $this->hasMany(SuratPerpanjangMS::class, 'profile_mhs_id');
    }

    public function suratPengunduranMHS()
    {
        return $this->hasMany(SuratPengunduranMHS::class, 'profile_mhs_id');
    }

    public function suratKetAktif()
    {
        return $this->hasMany(SuratKetAktif::class, 'profile_mhs_id');
    }

    public function suratMagang()
    {
        return $this->hasMany(SuratMagang::class, 'profile_mhs_id');
    }

    public function suratRekomendasiKampusMengajar()
    {
        return $this->hasMany(SuratRekomendasiKampusMengajar::class, 'profile_mhs_id');
    }
}


