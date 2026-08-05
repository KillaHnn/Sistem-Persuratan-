<?php

namespace App\Http\Controllers;

use App\Models\SuratUmum;
use App\Models\ApprovalLog;
use App\Models\DokumenSurat;
use App\Models\NotifikasiSurat;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApprovalController extends Controller
{
    // ── Helper: buat nama file berformat standar ────────────────────────────
    /**
     * Format: {JenisSurat}_{NomorUrut}_{DDMMYY}_{NamaPemohon}_{tipe}_v{versi}.{ext}
     * Contoh: SuratTugas_001_040826_BudiSantoso_draft_v1.pdf
     *
     * Jenis surat, nomor urut, tanggal, dan nama pemohon diambil dari objek $surat.
     */
    private function generateNamaFile(
        SuratUmum $surat,
        string $tipe,
        int $versi,
        string $ext
    ): string {
        // Jenis surat → singkatan resmi
        $jenisMap = [
            'undangan'         => 'UND',
            'surat_tugas'      => 'ST',
            'surat_pengantar'  => 'SP',
            'surat_keterangan' => 'SKet',
            'surat_keputusan'  => 'SK',
            'lainnya'          => 'LN',
        ];
        $jenis = $jenisMap[$surat->jenis_surat] ?? strtoupper(substr($surat->jenis_surat, 0, 3));

        // Nomor urut dari nomor_surat — ambil angka terakhir, atau id surat sebagai fallback
        $nomorUrut = '001';
        if ($surat->nomor_surat) {
            // nomor_surat biasanya format B-XXX/... — ambil angka pertama yang ditemukan
            if (preg_match('/\d+/', $surat->nomor_surat, $m)) {
                $nomorUrut = str_pad($m[0], 3, '0', STR_PAD_LEFT);
            }
        } else {
            $nomorUrut = str_pad($surat->id, 3, '0', STR_PAD_LEFT);
        }

        // Tanggal permohonan: DDMMYY
        $tgl = $surat->tgl_permohonan
            ? Carbon::parse($surat->tgl_permohonan)->format('dmy')
            : now()->format('dmy');

        // Nama pemohon: hapus spasi & karakter non-alfanumerik
        $nama = preg_replace('/[^A-Za-z0-9]/', '', $surat->pemohon->name ?? 'Pemohon');

        return "{$jenis}_{$nomorUrut}_{$tgl}_{$nama}_{$tipe}_v{$versi}.{$ext}";
    }

    // ── Helper: kirim notifikasi ke sekumpulan user ─────────────────────────
    private function sendNotif(int $suratId, array $userIds, string $judul, string $pesan): void
    {
        foreach ($userIds as $userId) {
            if ($userId) {
                NotifikasiSurat::create([
                    'surat_umum_id' => $suratId,
                    'user_id'       => $userId,
                    'judul'         => $judul,
                    'pesan'         => $pesan,
                ]);
            }
        }
    }

    /**
     * Sekretariat memproses surat (menunggu / dikembalikan → diproses).
     * Wajib upload file draf surat.
     */
    public function proses(Request $request, $id)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,docx|max:10240',
            'klasifikasi_primer_id'  => 'required_without:nomor_surat_id|exists:klasifikasi_primers,id',
            'klasifikasi_sekunder_id'=> 'required_without:nomor_surat_id|exists:klasifikasi_sekunders,id',
            'klasifikasi_tersier_id' => 'required_without:nomor_surat_id|exists:klasifikasi_tersiers,id',
            'jenis_arsip'            => 'nullable|string',
        ]);

        $surat = SuratUmum::with('pemohon')->findOrFail($id);
        $user  = Auth::user();

        if ($user->role !== 'sekretariat') {
            return response()->json(['message' => 'Hanya sekretariat yang dapat memproses surat'], 403);
        }

        if (!in_array($surat->status, ['menunggu', 'dikembalikan'])) {
            return response()->json(['message' => 'Surat tidak dalam status yang dapat diproses'], 422);
        }

        // Tentukan tipe dokumen berdasarkan revisi
        $tipeDokumen = $surat->revisi_ke > 0 ? 'draft_revisi' : 'draft';

        $latestVersion = $surat->dokumens()
            ->where('tipe_dokumen', $tipeDokumen)
            ->max('versi') ?? 0;
        $newVersion = $latestVersion + 1;

        // Upload file draf — nama file menggunakan format standar
        $file      = $request->file('file');
        $ext       = $file->getClientOriginalExtension();
        $filename  = $this->generateNamaFile($surat, $tipeDokumen, $newVersion, $ext);
        $path      = $file->storeAs("dokumen-surat/{$surat->id}", $filename, 'public');

        DokumenSurat::create([
            'surat_umum_id' => $surat->id,
            'tipe_dokumen'  => $tipeDokumen,
            'nama_file'     => $filename,
            'path_file'     => $path,
            'versi'         => $newVersion,
            'uploaded_by'   => $user->id,
        ]);

        $nomorSuratId = $surat->nomor_surat_id;

        if (!$nomorSuratId) {
            $primer   = \App\Models\KlasifikasiPrimer::findOrFail($request->klasifikasi_primer_id);
            $sekunder = \App\Models\KlasifikasiSekunder::findOrFail($request->klasifikasi_sekunder_id);
            $tersier  = \App\Models\KlasifikasiTersier::findOrFail($request->klasifikasi_tersier_id);

            $nomorSurat = \App\Models\NomorSurat::create([
                'klasifikasi_primer'  => $primer->kode,
                'klasifikasi_sekunder'=> $sekunder->kode,
                'klasifikasi_tersier' => $tersier->kode,
                'jenis_arsip'         => $request->input('jenis_arsip', 'Surat Umum'),
                'tanggal_surat'       => now()->toDateString(),
                'hal_surat'           => $surat->perihal,
                'isi_surat'           => '-',
            ]);

            $nomorSuratId = $nomorSurat->id;

            $surat->update([
                'klasifikasi_primer_id'  => $primer->id,
                'klasifikasi_sekunder_id'=> $sekunder->id,
                'klasifikasi_tersier_id' => $tersier->id,
                'nomor_surat_id'         => $nomorSuratId,
                'nomor_surat'            => $nomorSurat->nomor_surat,
            ]);
        }

        $surat->update([
            'status'     => 'diproses',
            'handler_id' => $user->id,
        ]);

        \App\Models\NomorSuratHistory::create([
            'surat_umum_id'  => $surat->id,
            'nomor_surat_id' => $nomorSuratId,
            'generated_by'   => $user->id,
            'status_step'    => 'sekretariat_validated',
        ]);

        ApprovalLog::create([
            'surat_umum_id' => $surat->id,
            'approver_id'   => $user->id,
            'aksi'          => 'disetujui',
            'catatan'       => 'Surat mulai diproses oleh sekretariat',
        ]);

        $namaPemohon = $surat->pemohon->name ?? 'Pemohon';

        // Notifikasi ke pemohon: surat sudah diverifikasi sekretariat
        $this->sendNotif(
            $surat->id,
            [$surat->pemohon_id],
            'Surat Diproses Sekretariat',
            "Surat \"{$surat->perihal}\" atas nama {$namaPemohon} sedang diverifikasi oleh sekretariat."
        );

        // Notifikasi ke semua Kabag TU: menunggu verifikasi
        $kabagTuIds = \App\Models\User::where('role', 'kabag_tu')->pluck('id')->toArray();
        $this->sendNotif(
            $surat->id,
            $kabagTuIds,
            'Surat Menunggu Verifikasi',
            "Surat \"{$surat->perihal}\" atas nama {$namaPemohon} telah diproses sekretariat dan menunggu verifikasi Anda."
        );

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
        $surat = SuratUmum::with('pemohon')->findOrFail($id);
        $user  = Auth::user();

        if ($user->role !== 'kabag_tu') {
            return response()->json(['message' => 'Hanya Kabag TU yang dapat memverifikasi'], 403);
        }

        if ($surat->status !== 'diproses') {
            return response()->json(['message' => 'Surat harus berstatus diproses untuk diverifikasi'], 422);
        }

        $surat->update(['status' => 'diverifikasi']);

        \App\Models\NomorSuratHistory::create([
            'surat_umum_id'  => $surat->id,
            'nomor_surat_id' => $surat->nomor_surat_id,
            'generated_by'   => $user->id,
            'status_step'    => 'kabag_validated',
        ]);

        ApprovalLog::create([
            'surat_umum_id' => $surat->id,
            'approver_id'   => $user->id,
            'aksi'          => 'disetujui',
            'catatan'       => $request->input('catatan', 'Draft diverifikasi oleh Kabag TU'),
        ]);

        $namaPemohon = $surat->pemohon->name ?? 'Pemohon';

        // Notifikasi ke pemohon: surat terverifikasi Kabag TU
        $this->sendNotif(
            $surat->id,
            [$surat->pemohon_id],
            'Surat Terverifikasi Kabag TU',
            "Surat \"{$surat->perihal}\" atas nama {$namaPemohon} telah diverifikasi oleh Kabag TU."
        );

        // Notifikasi ke Sekretariat: surat sudah diverifikasi, harap upload berkas yang sudah ditandatangani
        $sekretariatIds = \App\Models\User::where('role', 'sekretariat')->pluck('id')->toArray();
        $this->sendNotif(
            $surat->id,
            $sekretariatIds,
            'Surat Siap Diunggah TTD',
            "Surat \"{$surat->perihal}\" atas nama {$namaPemohon} telah diverifikasi Kabag TU. Mohon upload berkas yang sudah ditandatangani."
        );

        return response()->json([
            'message' => 'Surat berhasil diverifikasi',
            'data'    => $surat->fresh(),
        ]);
    }

    /**
     * Kabag TU / Sekretariat mengembalikan draft untuk revisi.
     */
    public function kembalikan(Request $request, $id)
    {
        $surat = SuratUmum::with('pemohon')->findOrFail($id);
        $user  = Auth::user();

        if (!in_array($user->role, ['kabag_tu', 'sekretariat'])) {
            return response()->json(['message' => 'Anda tidak memiliki akses mengembalikan surat'], 403);
        }

        if ($user->role === 'kabag_tu' && $surat->status !== 'diproses') {
            return response()->json(['message' => 'Surat harus berstatus diproses untuk dikembalikan oleh Kabag TU'], 422);
        }

        if ($user->role === 'sekretariat' && !in_array($surat->status, ['menunggu'])) {
            return response()->json(['message' => 'Surat harus berstatus menunggu untuk dikembalikan oleh Sekretariat'], 422);
        }

        // Hapus semua dokumen draft yang ada
        DokumenSurat::where('surat_umum_id', $surat->id)
            ->whereIn('tipe_dokumen', ['draft', 'draft_revisi'])
            ->delete();

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

        $namaPemohon = $surat->pemohon->name ?? 'Pemohon';
        $catatanText = $request->catatan ? " Catatan: \"{$request->catatan}\"." : '';

        // Notifikasi ke pemohon: surat dikembalikan
        $this->sendNotif(
            $surat->id,
            [$surat->pemohon_id],
            'Surat Dikembalikan',
            "Surat \"{$surat->perihal}\" atas nama {$namaPemohon} dikembalikan untuk revisi oleh {$user->name}.{$catatanText}"
        );

        // Jika yang mengembalikan adalah Kabag TU, notifikasi juga ke sekretariat
        if ($user->role === 'kabag_tu' && $surat->handler_id) {
            $this->sendNotif(
                $surat->id,
                [$surat->handler_id],
                'Draft Dikembalikan oleh Kabag TU',
                "Draft surat \"{$surat->perihal}\" atas nama {$namaPemohon} dikembalikan oleh Kabag TU.{$catatanText} Mohon perbaiki draft."
            );
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

        $surat = SuratUmum::with('pemohon')->findOrFail($id);
        $user  = Auth::user();

        if ($user->role !== 'wakil_dekan') {
            return response()->json(['message' => 'Hanya Wakil Dekan yang dapat memberi paraf'], 403);
        }

        if ($surat->status !== 'diverifikasi') {
            return response()->json(['message' => 'Surat harus berstatus diverifikasi untuk diparaf'], 422);
        }

        $latestVersion = $surat->dokumens()
            ->where('tipe_dokumen', 'surat_paraf')
            ->max('versi') ?? 0;
        $newVersion = $latestVersion + 1;

        // Upload file surat paraf
        $file         = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $filename     = str_replace(' ', '_', pathinfo($originalName, PATHINFO_FILENAME)) . "_v{$newVersion}." . $file->getClientOriginalExtension();
        $path         = $file->storeAs("dokumen-surat/{$surat->id}", $filename, 'public');

        // Hapus draft lama
        DokumenSurat::where('surat_umum_id', $surat->id)
            ->whereIn('tipe_dokumen', ['draft', 'draft_revisi'])
            ->delete();

        DokumenSurat::create([
            'surat_umum_id' => $surat->id,
            'tipe_dokumen'  => 'surat_paraf',
            'nama_file'     => $originalName,
            'path_file'     => $path,
            'versi'         => $newVersion,
            'uploaded_by'   => $user->id,
        ]);

        ApprovalLog::create([
            'surat_umum_id' => $surat->id,
            'approver_id'   => $user->id,
            'aksi'          => 'diparaf',
            'catatan'       => $request->input('catatan', 'Diparaf oleh Wakil Dekan'),
        ]);

        $namaPemohon = $surat->pemohon->name ?? 'Pemohon';

        // Notifikasi ke pemohon: surat diparaf Wakil Dekan
        $this->sendNotif(
            $surat->id,
            [$surat->pemohon_id],
            'Surat Diparaf Wakil Dekan',
            "Surat \"{$surat->perihal}\" atas nama {$namaPemohon} telah diparaf oleh Wakil Dekan dan menunggu tanda tangan Dekan."
        );

        return response()->json([
            'message' => 'Paraf berhasil diberikan',
            'data'    => $surat->fresh(['approvalLogs.approver', 'dokumens']),
        ]);
    }

    /**
     * Sekretariat mengupload berkas yang telah ditandatangani Dekan (diverifikasi → selesai).
     * Proses fisik penandatanganan dilakukan oleh Dekan, sekretariat yang mengupload hasilnya.
     */
    public function tandatangan(Request $request, $id)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf|max:10240',
        ]);

        $surat = SuratUmum::with('pemohon')->findOrFail($id);
        $user  = Auth::user();

        if ($user->role !== 'sekretariat') {
            return response()->json(['message' => 'Hanya Sekretariat yang dapat mengupload berkas yang telah ditandatangani'], 403);
        }

        if ($surat->status !== 'diverifikasi') {
            return response()->json(['message' => 'Surat harus berstatus diverifikasi untuk diupload berkas TTD-nya'], 422);
        }

        $latestVersion = $surat->dokumens()
            ->where('tipe_dokumen', 'surat_ttd')
            ->max('versi') ?? 0;
        $newVersion = $latestVersion + 1;

        // Upload file surat TTD — nama file menggunakan format standar
        $file      = $request->file('file');
        $ext       = $file->getClientOriginalExtension();
        $filename  = $this->generateNamaFile($surat, 'surat_ttd', $newVersion, $ext);
        $path      = $file->storeAs("dokumen-surat/{$surat->id}", $filename, 'public');

        DokumenSurat::create([
            'surat_umum_id' => $surat->id,
            'tipe_dokumen'  => 'surat_ttd',
            'nama_file'     => $filename,
            'path_file'     => $path,
            'versi'         => $newVersion,
            'uploaded_by'   => $user->id,
        ]);

        $surat->update(['status' => 'selesai']);

        \App\Models\NomorSuratHistory::create([
            'surat_umum_id'  => $surat->id,
            'nomor_surat_id' => $surat->nomor_surat_id,
            'generated_by'   => $user->id,
            'status_step'    => 'signed',
        ]);

        ApprovalLog::create([
            'surat_umum_id' => $surat->id,
            'approver_id'   => $user->id,
            'aksi'          => 'ditandatangani',
            // Catatan selalu menyebut Dekan karena proses TTD fisik tetap oleh Dekan
            'catatan'       => 'Ditandatangani oleh Dekan, siap diunduh',
        ]);

        $namaPemohon = $surat->pemohon->name ?? 'Pemohon';

        // Notifikasi ke pemohon: surat ditandatangani Dekan & siap diunduh
        $this->sendNotif(
            $surat->id,
            [$surat->pemohon_id],
            'Surat Ditandatangani Dekan',
            "Surat \"{$surat->perihal}\" atas nama {$namaPemohon} telah ditandatangani oleh Dekan dan siap diunduh."
        );

        // Notifikasi ke sekretariat (handler): perlu diarsipkan
        if ($surat->handler_id) {
            $this->sendNotif(
                $surat->id,
                [$surat->handler_id],
                'Surat Siap Diarsipkan',
                "Surat \"{$surat->perihal}\" atas nama {$namaPemohon} telah selesai ditandatangani Dekan. Mohon segera arsipkan."
            );
        }

        return response()->json([
            'message' => 'Surat berhasil ditandatangani dan selesai',
            'data'    => $surat->fresh(['dokumens']),
        ]);
    }

    /**
     * Sekretariat mengarsipkan surat — bisa dari status 'selesai' (berhasil) atau 'dikembalikan' (ditolak).
     * Kolom hasil_arsip diset otomatis berdasarkan status sebelum diarsipkan.
     */
    public function arsipkan(Request $request, $id)
    {
        $surat = SuratUmum::with(['nomorSurat', 'pemohon'])->findOrFail($id);
        $user  = Auth::user();

        if ($user->role !== 'sekretariat') {
            return response()->json(['message' => 'Hanya sekretariat yang dapat mengarsipkan surat'], 403);
        }

        if (!in_array($surat->status, ['selesai', 'dikembalikan'])) {
            return response()->json(['message' => 'Surat harus berstatus selesai atau dikembalikan untuk diarsipkan'], 422);
        }

        // Tentukan hasil arsip berdasarkan status sebelumnya
        $hasilArsip = $surat->status === 'selesai' ? 'berhasil' : 'ditolak';

        \Illuminate\Support\Facades\DB::transaction(function () use ($surat, $request, $user, $hasilArsip) {
            $surat->update([
                'status'      => 'diarsipkan',
                'tgl_selesai' => now(),
                'hasil_arsip' => $hasilArsip,
            ]);

            if ($surat->nomor_surat_id) {
                \App\Models\NomorSuratHistory::create([
                    'surat_umum_id'  => $surat->id,
                    'nomor_surat_id' => $surat->nomor_surat_id,
                    'generated_by'   => $user->id,
                    'status_step'    => 'ready_for_user',
                ]);
            }

            // Dapatkan path_digital dari dokumen surat_ttd terbaru (jika ada)
            $signedDokumen = $surat->dokumens()->where('tipe_dokumen', 'surat_ttd')->latest('versi')->first();
            $pathDigital   = $signedDokumen ? $signedDokumen->path_file : 'Tidak ada dokumen';

            // Simpan ke tabel arsip_surats
            if (!\App\Models\ArsipSurat::where('surat_umum_id', $surat->id)->exists()) {
                \App\Models\ArsipSurat::create([
                    'surat_umum_id' => $surat->id,
                    'nomor_arsip'   => $surat->nomor_surat ?? '-',
                    'lokasi_fisik'  => 'Ruang Sekretariat',
                    'path_digital'  => $pathDigital,
                    'dibuat_oleh'   => $user->id,
                ]);
            }

            $catatanLog = $hasilArsip === 'berhasil'
                ? 'Surat berhasil diarsipkan oleh sekretariat'
                : 'Surat yang dikembalikan/ditolak telah diarsipkan oleh sekretariat';

            ApprovalLog::create([
                'surat_umum_id' => $surat->id,
                'approver_id'   => $user->id,
                'aksi'          => 'disetujui',
                'catatan'       => $catatanLog,
            ]);

            $namaPemohon = $surat->pemohon->name ?? 'Pemohon';

            $pesanNotif = $hasilArsip === 'berhasil'
                ? "Surat \"{$surat->perihal}\" atas nama {$namaPemohon} telah selesai dan resmi diarsipkan oleh sekretariat."
                : "Surat \"{$surat->perihal}\" atas nama {$namaPemohon} yang dikembalikan telah diarsipkan oleh sekretariat.";

            // Notifikasi ke pemohon
            NotifikasiSurat::create([
                'surat_umum_id' => $surat->id,
                'user_id'       => $surat->pemohon_id,
                'judul'         => $hasilArsip === 'berhasil' ? 'Surat Selesai & Terarsipkan' : 'Surat Ditolak & Diarsipkan',
                'pesan'         => $pesanNotif,
            ]);
        });

        return response()->json([
            'message' => 'Surat berhasil diarsipkan',
            'data'    => $surat->fresh(),
        ]);
    }
}
