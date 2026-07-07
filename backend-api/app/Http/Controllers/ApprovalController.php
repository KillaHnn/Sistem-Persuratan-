<?php

namespace App\Http\Controllers;

use App\Models\SuratUmum;
use App\Models\ApprovalLog;
use App\Models\DokumenSurat;
use App\Models\NotifikasiSurat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApprovalController extends Controller
{
    /**
     * Sekretariat memproses surat (menunggu → diproses).
     * Wajib upload file draf surat.
     */
    public function proses(Request $request, $id)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,docx|max:10240',
        ]);

        $surat = SuratUmum::findOrFail($id);
        $user = Auth::user();

        if ($user->role !== 'sekretariat') {
            return response()->json(['message' => 'Hanya sekretariat yang dapat memproses surat'], 403);
        }

        if (!in_array($surat->status, ['menunggu', 'dikembalikan'])) {
            return response()->json(['message' => 'Surat tidak dalam status yang dapat diproses'], 422);
        }

        // Tentukan tipe dokumen berdasarkan revisi
        $tipeDokumen = $surat->revisi_ke > 0 ? 'draft_revisi' : 'draft';

        // Upload file draf
        $file = $request->file('file');
        $path = $file->store("dokumen-surat/{$surat->id}", 'public');

        $latestVersion = $surat->dokumens()
            ->where('tipe_dokumen', $tipeDokumen)
            ->max('versi') ?? 0;

        DokumenSurat::create([
            'surat_umum_id' => $surat->id,
            'tipe_dokumen'  => $tipeDokumen,
            'nama_file'     => $file->getClientOriginalName(),
            'path_file'     => $path,
            'versi'         => $latestVersion + 1,
            'uploaded_by'   => $user->id,
        ]);

        $surat->update([
            'status'     => 'diproses',
            'handler_id' => $user->id,
        ]);

        ApprovalLog::create([
            'surat_umum_id' => $surat->id,
            'approver_id'   => $user->id,
            'aksi'          => 'disetujui',
            'catatan'       => 'Surat mulai diproses oleh sekretariat',
        ]);

        return response()->json([
            'message' => 'Surat berhasil diproses',
            'data'    => $surat->fresh(['pemohon', 'handler', 'dokumens']),
        ]);
    }

    /**
     * Kabag TU memverifikasi draft (diproses → diverifikasi).
     */
    public function verifikasi(Request $request, $id)
    {
        $surat = SuratUmum::findOrFail($id);
        $user = Auth::user();

        if ($user->role !== 'kabag_tu') {
            return response()->json(['message' => 'Hanya Kabag TU yang dapat memverifikasi'], 403);
        }

        if ($surat->status !== 'diproses') {
            return response()->json(['message' => 'Surat harus berstatus diproses untuk diverifikasi'], 422);
        }

        $surat->update(['status' => 'diverifikasi']);

        ApprovalLog::create([
            'surat_umum_id' => $surat->id,
            'approver_id'   => $user->id,
            'aksi'          => 'disetujui',
            'catatan'       => $request->input('catatan', 'Draft diverifikasi oleh Kabag TU'),
        ]);

        // Notifikasi ke wakil dekan & dekan
        $pejabats = \App\Models\User::whereIn('role', ['wakil_dekan', 'dekan'])->get();
        foreach ($pejabats as $pejabat) {
            NotifikasiSurat::create([
                'surat_umum_id' => $surat->id,
                'user_id'       => $pejabat->id,
                'judul'         => 'Surat Siap Ditinjau',
                'pesan'         => "Surat {$surat->jenis_surat}: {$surat->perihal} telah diverifikasi Kabag TU",
            ]);
        }

        return response()->json([
            'message' => 'Surat berhasil diverifikasi',
            'data'    => $surat->fresh(),
        ]);
    }

    /**
     * Kabag TU mengembalikan draft untuk revisi (diproses → dikembalikan).
     */
    public function kembalikan(Request $request, $id)
    {
        $request->validate([
            'nomor_arsip'   => 'required|string|unique:arsip_surats,nomor_arsip',
            // nomor_surat optional; if provided, must be unique
            'nomor_surat'   => 'sometimes|string|unique:surat_umum,nomor_surat',
            'lokasi_fisik'  => 'nullable|string',
        ]);
        
        $surat = SuratUmum::findOrFail($id);
        $user = Auth::user();

        if (!in_array($user->role, ['kabag_tu', 'sekretariat'])) {
            return response()->json(['message' => 'Anda tidak memiliki akses mengembalikan surat'], 403);
        }

        if ($user->role === 'kabag_tu' && $surat->status !== 'diproses') {
            return response()->json(['message' => 'Surat harus berstatus diproses untuk dikembalikan oleh Kabag TU'], 422);
        }

        if ($user->role === 'sekretariat' && !in_array($surat->status, ['menunggu'])) {
            return response()->json(['message' => 'Surat harus berstatus menunggu untuk dikembalikan oleh Sekretariat'], 422);
        }

        // Hapus semua dokumen draft yang ada (draft dan draft_revisi)
        DokumenSurat::where('surat_umum_id', $surat->id)
            ->whereIn('tipe_dokumen', ['draft', 'draft_revisi'])
            ->delete();

        // Update surat status to dikembalikan
        $surat->update([
            'status'    => 'dikembalikan',
            'revisi_ke' => $surat->revisi_ke + 1,
        ]);

        ApprovalLog::create([
            'surat_umum_id' => $surat->id,
            'approver_id'   => $user->id,
            'aksi'          => 'dikembalikan',
            'catatan'       => $request->catatan,
        ]);

        // Notifikasi ke sekretariat (handler)
        if ($surat->handler_id) {
            NotifikasiSurat::create([
                'surat_umum_id' => $surat->id,
                'user_id'       => $surat->handler_id,
                'judul'         => 'Surat Dikembalikan',
                'pesan'         => "Surat {$surat->perihal} dikembalikan: {$request->catatan}",
            ]);
        }

        return response()->json([
            'message' => 'Surat dikembalikan untuk revisi',
            'data'    => $surat->fresh(),
        ]);
    }

    /**
     * Wakil Dekan memberi paraf (diverifikasi → tetap diverifikasi, tercatat di log).
     * Wajib upload file surat yang telah diparaf.
     */
    public function paraf(Request $request, $id)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf|max:10240',
        ]);

        $surat = SuratUmum::findOrFail($id);
        $user = Auth::user();

        if ($user->role !== 'wakil_dekan') {
            return response()->json(['message' => 'Hanya Wakil Dekan yang dapat memberi paraf'], 403);
        }

        if ($surat->status !== 'diverifikasi') {
            return response()->json(['message' => 'Surat harus berstatus diverifikasi untuk diparaf'], 422);
        }

        // Upload file surat tandatangan
        $file = $request->file('file');
        $path = $file->store("dokumen-surat/{$surat->id}", 'public');

        // Hapus semua dokumen draft yang ada (draft dan draft_revisi) sebelum menyimpan tandatangan
        DokumenSurat::where('surat_umum_id', $surat->id)
            ->whereIn('tipe_dokumen', ['draft', 'draft_revisi'])
            ->delete();

        DokumenSurat::create([
            'surat_umum_id' => $surat->id,
            'tipe_dokumen'  => 'surat_paraf',
            'nama_file'     => $file->getClientOriginalName(),
            'path_file'     => $path,
            'versi'         => $latestVersion + 1,
            'uploaded_by'   => $user->id,
        ]);

        ApprovalLog::create([
            'surat_umum_id' => $surat->id,
            'approver_id'   => $user->id,
            'aksi'          => 'diparaf',
            'catatan'       => $request->input('catatan', 'Diparaf oleh Wakil Dekan'),
        ]);

        return response()->json([
            'message' => 'Paraf berhasil diberikan',
            'data'    => $surat->fresh(['approvalLogs.approver', 'dokumens']),
        ]);
    }

    /**
     * Dekan menandatangani surat (diverifikasi → ditandatangani).
     * Wajib upload file surat yang telah ditandatangani.
     */
    public function tandatangan(Request $request, $id)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf|max:10240',
        ]);

        $surat = SuratUmum::findOrFail($id);
        $user = Auth::user();

        if ($user->role !== 'dekan') {
            return response()->json(['message' => 'Hanya Dekan yang dapat menandatangani'], 403);
        }

        if ($surat->status !== 'diverifikasi') {
            return response()->json(['message' => 'Surat harus berstatus diverifikasi untuk ditandatangani'], 422);
        }

        // Upload file surat TTD
        $file = $request->file('file');
        $path = $file->store("dokumen-surat/{$surat->id}", 'public');

        $latestVersion = $surat->dokumens()
            ->where('tipe_dokumen', 'surat_ttd')
            ->max('versi') ?? 0;

        DokumenSurat::create([
            'surat_umum_id' => $surat->id,
            'tipe_dokumen'  => 'surat_ttd',
            'nama_file'     => $file->getClientOriginalName(),
            'path_file'     => $path,
            'versi'         => $latestVersion + 1,
            'uploaded_by'   => $user->id,
        ]);

        $surat->update(['status' => 'ditandatangani']);

        ApprovalLog::create([
            'surat_umum_id' => $surat->id,
            'approver_id'   => $user->id,
            'aksi'          => 'ditandatangani',
            'catatan'       => $request->input('catatan', 'Ditandatangani oleh Dekan'),
        ]);

        // Notifikasi ke sekretariat untuk arsip
        if ($surat->handler_id) {
            NotifikasiSurat::create([
                'surat_umum_id' => $surat->id,
                'user_id'       => $surat->handler_id,
                'judul'         => 'Surat Ditandatangani',
                'pesan'         => "Surat {$surat->perihal} telah ditandatangani Dekan, siap diarsipkan",
            ]);
        }

        // Notifikasi ke pemohon
        NotifikasiSurat::create([
            'surat_umum_id' => $surat->id,
            'user_id'       => $surat->pemohon_id,
            'judul'         => 'Surat Selesai Ditandatangani',
            'pesan'         => "Surat {$surat->perihal} telah ditandatangani oleh Dekan",
        ]);

        return response()->json([
            'message' => 'Surat berhasil ditandatangani',
            'data'    => $surat->fresh(['dokumens']),
        ]);
    }
}
