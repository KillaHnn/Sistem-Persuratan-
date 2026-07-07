<?php

namespace App\Http\Controllers;

use App\Models\ArsipSurat;
use App\Models\DokumenSurat;
use App\Models\NotifikasiSurat;
use App\Models\SuratUmum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ArsipSuratController extends Controller
{
    /**
     * List semua arsip surat.
     */
    public function index(Request $request)
    {
        $query = ArsipSurat::with(['suratUmum.pemohon', 'dibuatOleh'])
            ->orderBy('created_at', 'desc');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nomor_arsip', 'like', "%{$search}%")
                  ->orWhereHas('suratUmum', function ($sq) use ($search) {
                      $sq->where('perihal', 'like', "%{$search}%")
                         ->orWhere('nomor_surat', 'like', "%{$search}%");
                  });
            });
        }

        return response()->json($query->paginate(15));
    }

    /**
     * Arsipkan surat yang sudah ditandatangani (ditandatangani → diarsipkan).
     * path_digital otomatis diambil dari dokumen surat_ttd terbaru.
     */
    public function store(Request $request, $suratId)
    {
                $request->validate([
                    'nomor_arsip'   => 'nullable|string|unique:arsip_surats,nomor_arsip',
                    // nomor_surat optional; if not supplied use existing surat nomor
                    'nomor_surat'   => 'sometimes|string|unique:surat_umum,nomor_surat',
                    'lokasi_fisik'  => 'nullable|string',
                ]);

        $surat = SuratUmum::findOrFail($suratId);
        
        // Jika nomor_surat tidak disertakan, pakai nomor surat yang sudah ada
        $nomorSurat = $request->input('nomor_surat', $surat->nomor_surat);

        $user = Auth::user();

        if ($user->role !== 'sekretariat') {
            return response()->json(['message' => 'Hanya sekretariat yang dapat mengarsipkan surat'], 403);
        }

        if ($surat->status !== 'ditandatangani') {
            return response()->json(['message' => 'Hanya surat yang sudah ditandatangani yang dapat diarsipkan'], 422);
        }

        // Ambil path digital dari dokumen surat_ttd terbaru
        $dokumenTtd = $surat->dokumens()
            ->where('tipe_dokumen', 'surat_ttd')
            ->orderBy('versi', 'desc')
            ->first();

        if (!$dokumenTtd) {
            return response()->json(['message' => 'Dokumen surat yang telah ditandatangani belum diunggah'], 422);
        }

        // Update surat
        $surat->update([
            'status'      => 'diarsipkan',
            // Use provided nomor_arsip if present, otherwise null
            'nomor_arsip' => $request->input('nomor_arsip'),
            // Use fallback nomorSurat if nomor_surat not supplied
            'nomor_surat' => $nomorSurat,
            'tgl_selesai' => now(),
        ]);

        // Buat arsip
        $arsip = ArsipSurat::create([
            'surat_umum_id' => $surat->id,
            'nomor_arsip'   => $request->nomor_arsip,
            'lokasi_fisik'  => $request->lokasi_fisik,
            'path_digital'  => $dokumenTtd->path_file,
            'dibuat_oleh'   => $user->id,
            // gunakan nomor surat yang sudah dipastikan ada
            'nomor_surat'   => $nomorSurat,
        ]);


        // Notifikasi ke pemohon
        NotifikasiSurat::create([
            'surat_umum_id' => $surat->id,
            'user_id'       => $surat->pemohon_id,
            'judul'         => 'Surat Telah Diarsipkan',
            'pesan'         => "Surat {$surat->perihal} telah selesai dan diarsipkan dengan nomor {$request->nomor_surat}",
        ]);

        return response()->json([
            'message' => 'Surat berhasil diarsipkan',
            'data'    => $arsip->load(['suratUmum', 'dibuatOleh']),
        ], 201);
    }
}
