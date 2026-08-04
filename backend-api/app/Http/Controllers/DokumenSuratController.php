<?php

namespace App\Http\Controllers;

use App\Models\DokumenSurat;
use App\Models\SuratUmum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class DokumenSuratController extends Controller
{
    /**
     * List semua dokumen untuk surat tertentu.
     */
    public function index($suratId)
    {
        $surat = SuratUmum::findOrFail($suratId);

        $dokumens = $surat->dokumens()
            ->with('uploader')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($dokumens);
    }

    /**
     * Upload dokumen baru untuk surat.
     */
    public function store(Request $request, $suratId)
    {
        $request->validate([
            'file'          => 'required|file|max:10240', // max 10MB
            'tipe_dokumen'  => 'required|in:draft,draft_revisi,surat_paraf,surat_ttd',
        ]);

        $surat = SuratUmum::findOrFail($suratId);

        // Hitung versi berikutnya
        $latestVersion = $surat->dokumens()
            ->where('tipe_dokumen', $request->tipe_dokumen)
            ->max('versi') ?? 0;

        $file = $request->file('file');
        $newVersion = $latestVersion + 1;
        $originalName = $file->getClientOriginalName();
        $filename = str_replace(' ', '_', pathinfo($originalName, PATHINFO_FILENAME)) . "_v{$newVersion}." . $file->getClientOriginalExtension();
        $path = $file->storeAs("dokumen-surat/{$suratId}", $filename, 'public');

        $dokumen = DokumenSurat::create([
            'surat_umum_id' => $surat->id,
            'tipe_dokumen'  => $request->tipe_dokumen,
            'nama_file'     => $originalName,
            'path_file'     => $path,
            'versi'         => $latestVersion + 1,
            'uploaded_by'   => Auth::id(),
        ]);

        return response()->json([
            'message' => 'Dokumen berhasil diupload',
            'data'    => $dokumen->load('uploader'),
        ], 201);
    }

    /**
     * Tampilkan / download file dokumen surat.
     */
    public function showFile($id)
    {
        $dokumen = DokumenSurat::find($id);

        $rawPath = $dokumen ? $dokumen->path_file : $id;
        $cleanPath = preg_replace('/^\/?(storage\/|public\/)?/', '', $rawPath);

        $candidates = [
            storage_path('app/public/' . $cleanPath),
            storage_path('app/' . $cleanPath),
            public_path('storage/' . $cleanPath),
            public_path($cleanPath),
        ];

        foreach ($candidates as $filePath) {
            if (file_exists($filePath) && !is_dir($filePath)) {
                $mimeType = mime_content_type($filePath) ?: 'application/octet-stream';
                $filename = $dokumen ? $dokumen->nama_file : basename($filePath);

                return response()->file($filePath, [
                    'Content-Type'        => $mimeType,
                    'Content-Disposition' => 'inline; filename="' . $filename . '"',
                ]);
            }
        }

        return response()->json([
            'message'      => 'File tidak ditemukan di server.',
            'path_checked' => $cleanPath,
        ], 404);
    }
}
