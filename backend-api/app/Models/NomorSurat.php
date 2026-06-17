<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NomorSurat extends Model
{
    protected $table = 'nomor_surats';
    protected $fillable = [
        'klasifikasi_primer',
        'klasifikasi_sekunder',
        'klasifikasi_tersier',
        'jenis_arsip',
        'nomor_surat',
        'nomor_urut',
        'kode_surat',
        'tanggal_surat',
        'hal_surat',
        'isi_surat',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $year = date('Y', strtotime($model->tanggal_surat));
            $model->kode_surat = $model->klasifikasi_tersier;
            
            // Get the last nomor_urut for the same classification and year
            $lastSurat = static::where('klasifikasi_tersier', $model->klasifikasi_tersier)
                ->whereYear('tanggal_surat', $year)
                ->orderBy('nomor_urut', 'desc')
                ->first();

            $model->nomor_urut = $lastSurat ? $lastSurat->nomor_urut + 1 : 1;
            
            // Format: 1046/IT3/TM.00.00/P/B/2026
            $model->nomor_surat = sprintf(
                "%d/IT3/%s/P/B/%d",
                $model->nomor_urut,
                $model->kode_surat,
                $year
            );
        });
    }
}
