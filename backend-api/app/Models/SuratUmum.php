<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class SuratUmum extends Model
{
    protected $table = 'surat_umum';

    protected $fillable = [
        'jenis_surat',
        'perihal',
        'nomor_surat',
        'status',
        'revisi_ke',
        'pemohon_id',
        'handler_id',
        'tgl_permohonan',
        'tgl_selesai',
        // classification foreign keys and nomor surat reference
        'klasifikasi_primer_id',
        'klasifikasi_sekunder_id',
        'klasifikasi_tersier_id',
        'nomor_surat_id',
    ];

    protected $casts = [
        'tgl_permohonan' => 'datetime',
        'tgl_selesai' => 'datetime',
    ];

    // ── Relasi ke Users ──────────────────────────────

    public function pemohon(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pemohon_id');
    }

    public function handler(): BelongsTo
    {
        return $this->belongsTo(User::class, 'handler_id');
    }

    // ── Relasi ke Detail per Jenis Surat ─────────────

    public function detailUndangan(): HasOne
    {
        return $this->hasOne(DetailUndangan::class);
    }

    public function detailSuratTugas(): HasOne
    {
        return $this->hasOne(DetailSuratTugas::class);
    }

    public function detailSuratPengantar(): HasOne
    {
        return $this->hasOne(DetailSuratPengantar::class);
    }

    public function detailSuratKeteranganUmum(): HasOne
    {
        return $this->hasOne(DetailSuratKeteranganUmum::class);
    }

    public function detailSuratLainnya(): HasOne
    {
        return $this->hasOne(DetailSuratLainnya::class);
    }

    /**
     * Helper: ambil detail surat sesuai jenis_surat
     */
    public function detail()
    {
        return match ($this->jenis_surat) {
            'undangan'          => $this->detailUndangan(),
            'surat_tugas'       => $this->detailSuratTugas(),
            'surat_pengantar'   => $this->detailSuratPengantar(),
            'surat_keterangan'  => $this->detailSuratKeteranganUmum(),
            'lainnya'           => $this->detailSuratLainnya(),
            default             => null,
        };
    }

    // ── Relasi ke Tabel Pendukung ────────────────────

    public function approvalLogs(): HasMany
    {
        return $this->hasMany(ApprovalLog::class);
    }

    public function dokumens(): HasMany
    {
        return $this->hasMany(DokumenSurat::class);
    }

    public function notifikasis(): HasMany
    {
        return $this->hasMany(NotifikasiSurat::class);
    }

    public function arsip(): HasOne
    {
        return $this->hasOne(ArsipSurat::class);
    }

    // ── Classification Relationships ────────────────────────
    public function klasifikasiPrimer()
    {
        return $this->belongsTo(KlasifikasiPrimer::class, 'klasifikasi_primer_id');
    }

    public function klasifikasiSekunder()
    {
        return $this->belongsTo(KlasifikasiSekunder::class, 'klasifikasi_sekunder_id');
    }

    public function klasifikasiTersier()
    {
        return $this->belongsTo(KlasifikasiTersier::class, 'klasifikasi_tersier_id');
    }

    public function nomorSurat()
    {
        return $this->belongsTo(NomorSurat::class, 'nomor_surat_id');
    }

    public function nomorHistory()
    {
        return $this->hasMany(NomorSurat::class);
    }
}
