<?php

namespace App\Http\Controllers;

use App\Models\SuratUmum;
use App\Models\DetailUndangan;
use App\Models\DetailSuratTugas;
use App\Models\DetailSuratPengantar;
use App\Models\DetailSuratKeteranganUmum;
use App\Models\DetailSuratLainnya;
use App\Models\NotifikasiSurat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SuratUmumController extends Controller
{
    /**
     * Daftar surat — filtered by role:
     * - pemohon: hanya surat miliknya
     * - sekretariat/kabag_tu: semua surat
     * - wakil_dekan/dekan: surat yang sudah diverifikasi ke atas
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = SuratUmum::with(['pemohon', 'handler']);

        // Filter berdasarkan role
        if ($user->role === 'pemohon') {
            $query->where('pemohon_id', $user->id);
        } elseif (in_array($user->role, ['wakil_dekan', 'dekan'])) {
            $query->whereIn('status', ['diverifikasi', 'ditandatangani', 'diarsipkan']);
        }
        // sekretariat & kabag_tu bisa lihat semua

        // Filter opsional
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('jenis_surat')) {
            $query->where('jenis_surat', $request->jenis_surat);
        }

        $surat = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($surat);
    }

    /**
     * Buat permohonan surat baru.
     * Body: { jenis_surat, perihal, detail: { ...fields } }
     */
    public function store(Request $request)
    {
        $request->validate([
            'jenis_surat' => 'required|in:undangan,surat_tugas,surat_pengantar,surat_keterangan,lainnya',
            'perihal'     => 'required|string',
            'detail'      => 'required|array',
            'lampiran'    => 'nullable|file|mimes:pdf,jpg,jpeg,png,docx|max:10240', // Optional, max 10MB
        ]);

        // Validasi detail sesuai jenis surat
        $detailRules = $this->getDetailValidationRules($request->jenis_surat);
        $request->validate(['detail' => 'required|array'] + $detailRules);

        $surat = DB::transaction(function () use ($request) {
            // 1. Buat surat induk
            $surat = SuratUmum::create([
                'jenis_surat'    => $request->jenis_surat,
                'perihal'        => $request->perihal,
                'status'         => 'menunggu',
                'pemohon_id'     => Auth::id(),
                'tgl_permohonan' => now(),
            ]);

            // 2. Buat detail sesuai jenis
            $detailData = array_merge($request->detail, ['surat_umum_id' => $surat->id]);

            match ($request->jenis_surat) {
                'undangan'         => \App\Models\DetailUndangan::create($detailData),
                'surat_tugas'      => \App\Models\DetailSuratTugas::create($detailData),
                'surat_pengantar'  => \App\Models\DetailSuratPengantar::create($detailData),
                'surat_keterangan' => \App\Models\DetailSuratKeteranganUmum::create($detailData),
                'lainnya'          => \App\Models\DetailSuratLainnya::create($detailData),
            };

            // 3. Simpan Lampiran jika ada
            if ($request->hasFile('lampiran')) {
                $file = $request->file('lampiran');
                $path = $file->store("dokumen-surat/{$surat->id}", 'public');

                \App\Models\DokumenSurat::create([
                    'surat_umum_id' => $surat->id,
                    'tipe_dokumen'  => 'lampiran_pendukung',
                    'nama_file'     => $file->getClientOriginalName(),
                    'path_file'     => $path,
                    'versi'         => 1,
                    'uploaded_by'   => Auth::id(),
                ]);
            }

            // 4. Kirim notifikasi ke sekretariat
            $this->notifySekretariat($surat);

            return $surat;
        });

        $surat->load('pemohon');
        // Load detail yang sesuai
        $this->loadDetail($surat);

        return response()->json([
            'message' => 'Permohonan surat berhasil dibuat',
            'data'    => $surat,
        ], 201);
    }

    /**
     * Detail satu surat beserta detail & approval log.
     */
    public function show($id)
    {
                $surat = SuratUmum::with([
            'pemohon',
            'handler',
            'approvalLogs.approver',
            'dokumens' => function ($q) {
                $q->whereNotIn('tipe_dokumen', ['draft', 'draft_revisi']);
            },
        ])
            ->findOrFail($id);

        $this->loadDetail($surat);

        return response()->json($surat);
    }

    /**
     * Update surat (hanya saat status menunggu atau dikembalikan).
     */
    public function update(Request $request, $id)
    {
        $surat = SuratUmum::findOrFail($id);

        // Hanya pemohon & saat status memungkinkan
        if ($surat->pemohon_id !== Auth::id()) {
            return response()->json(['message' => 'Anda bukan pemohon surat ini'], 403);
        }

        if (!in_array($surat->status, ['menunggu', 'dikembalikan'])) {
            return response()->json(['message' => 'Surat tidak dapat diedit pada status ini'], 422);
        }

        DB::transaction(function () use ($request, $surat) {
            if ($request->has('perihal')) {
                $surat->update(['perihal' => $request->perihal]);
            }

            if ($request->has('detail')) {
                $detail = $surat->detail;
                if ($detail) {
                    $detail->update($request->detail);
                }
            }
        });

        $surat->refresh();
        $this->loadDetail($surat);

        return response()->json([
            'message' => 'Surat berhasil diperbarui',
            'data'    => $surat,
        ]);
    }

    /**
     * Hapus surat (hanya saat status menunggu).
     */
    public function destroy($id)
    {
        $surat = SuratUmum::findOrFail($id);

        if ($surat->pemohon_id !== Auth::id()) {
            return response()->json(['message' => 'Anda bukan pemohon surat ini'], 403);
        }

        if ($surat->status !== 'menunggu') {
            return response()->json(['message' => 'Hanya surat berstatus menunggu yang dapat dihapus'], 422);
        }

        $surat->delete();

        return response()->json(['message' => 'Surat berhasil dihapus']);
    }

    // ── Helper Methods ───────────────────────────────

    private function getDetailValidationRules(string $jenis): array
    {
        return match ($jenis) {
            'undangan' => [
                'detail.nama_kegiatan'     => 'required|string',
                'detail.tanggal_kegiatan'  => 'required|date',
                'detail.waktu_mulai'       => 'required',
                'detail.tempat'            => 'required|string',
                'detail.ditujukan_kepada'  => 'required|string',
            ],
            'surat_tugas' => [
                'detail.nama_ditugaskan'   => 'required|string',
                'detail.jabatan'           => 'required|string',
                'detail.tujuan_tugas'      => 'required|string',
                'detail.tempat_tugas'      => 'required|string',
                'detail.tanggal_mulai'     => 'required|date',
                'detail.tanggal_selesai'   => 'required|date|after_or_equal:detail.tanggal_mulai',
            ],
            'surat_pengantar' => [
                'detail.ditujukan_kepada'  => 'required|string',
                'detail.keperluan'         => 'required|string',
            ],
            'surat_keterangan' => [
                'detail.nama_yang_diterangkan' => 'required|string',
                'detail.isi_keterangan'        => 'required|string',
                'detail.keperluan'             => 'required|string',
            ],
            'lainnya' => [
                'detail.deskripsi' => 'required|string',
            ],
        };
    }

    private function loadDetail(SuratUmum $surat): void
    {
        match ($surat->jenis_surat) {
            'undangan'         => $surat->load('detailUndangan'),
            'surat_tugas'      => $surat->load('detailSuratTugas'),
            'surat_pengantar'  => $surat->load('detailSuratPengantar'),
            'surat_keterangan' => $surat->load('detailSuratKeteranganUmum'),
            'lainnya'          => $surat->load('detailSuratLainnya'),
            default            => null,
        };
    }

    private function notifySekretariat(SuratUmum $surat): void
    {
        $sekretariats = \App\Models\User::where('role', 'sekretariat')->get();

        foreach ($sekretariats as $sekretariat) {
            NotifikasiSurat::create([
                'surat_umum_id' => $surat->id,
                'user_id'       => $sekretariat->id,
                'judul'         => 'Permohonan Surat Baru',
                'pesan'         => "Permohonan {$surat->jenis_surat} dari {$surat->pemohon->name}: {$surat->perihal}",
            ]);
        }
    }
}
