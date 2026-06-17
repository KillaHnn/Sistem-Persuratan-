<?php

namespace App\Http\Controllers;

use App\Models\ArsipSurat;
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
     */
    public function store(Request $request, $suratId)
    {
        $request->validate([
            'nomor_arsip'   => 'required|string|unique:arsip_surats,nomor_arsip',
            'nomor_surat'   => 'required|string|unique:surat_umum,nomor_surat',
            'lokasi_fisik'  => 'nullable|string',
            'path_digital'  => 'required|string',
        ]);

        $surat = SuratUmum::findOrFail($suratId);
        $user = Auth::user();

        if ($user->role !== 'sekretariat') {
            return response()->json(['message' => 'Hanya sekretariat yang dapat mengarsipkan surat'], 403);
        }

        if ($surat->status !== 'ditandatangani') {
            return response()->json(['message' => 'Hanya surat yang sudah ditandatangani yang dapat diarsipkan'], 422);
        }

        // Update surat
        $surat->update([
            'status'      => 'diarsipkan',
            'nomor_surat' => $request->nomor_surat,
            'tgl_selesai'  => now(),
        ]);

        // Buat arsip
        $arsip = ArsipSurat::create([
            'surat_umum_id' => $surat->id,
            'nomor_arsip'   => $request->nomor_arsip,
            'lokasi_fisik'  => $request->lokasi_fisik,
            'path_digital'  => $request->path_digital,
            'dibuat_oleh'   => $user->id,
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
