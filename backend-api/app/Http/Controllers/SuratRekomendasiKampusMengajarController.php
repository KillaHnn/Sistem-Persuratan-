<?php

namespace App\Http\Controllers;

use App\Models\SuratRekomendasiKampusMengajar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class SuratRekomendasiKampusMengajarController extends Controller
{
    // Mengambil semua data surat
    public function index()
    {
        $data = SuratRekomendasiKampusMengajar::with('profileMHS')->get();
        return response()->json(['success' => true, 'data' => $data], 200);
    }

    // Menyimpan surat baru (POST)
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user || !$user->profileMHS) {
            return response()->json(['message' => 'Profile belum dilengkapi'], 400);
        }

        $validator = Validator::make($request->all(), [
            'tahun_akademik'           => 'required|string',
            'semester'                 => 'required|string',
            'jumlah_sks'               => 'required|string',
            'ipk'                      => 'required|string',
            'file_pengantar_prodi'     => 'required|file|mimes:pdf,jpg,png|max:2048',
            'file_surat_persetujuan'   => 'required|file|mimes:pdf,jpg,png|max:2048',
            'file_sptjm'               => 'required|file|mimes:pdf,jpg,png|max:2048',
            'file_transkrip_kumulatif' => 'required|file|mimes:pdf,jpg,png|max:2048',
            'file_keterangan_dokter'   => 'required|file|mimes:pdf,jpg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Upload File
        $pathPengantar = $request->file('file_pengantar_prodi')->store('kampus_mengajar/pengantar_prodi', 'public');
        $pathPersetujuan = $request->file('file_surat_persetujuan')->store('kampus_mengajar/surat_persetujuan', 'public');
        $pathSptjm = $request->file('file_sptjm')->store('kampus_mengajar/sptjm', 'public');
        $pathTranskrip = $request->file('file_transkrip_kumulatif')->store('kampus_mengajar/transkrip', 'public');
        $pathDokter = $request->file('file_keterangan_dokter')->store('kampus_mengajar/keterangan_dokter', 'public');

        $surat = SuratRekomendasiKampusMengajar::create(array_merge(
            $request->all(),
            [
                'profile_id'               => $user->profileMHS->id,
                'file_pengantar_prodi'     => $pathPengantar,
                'file_surat_persetujuan'   => $pathPersetujuan,
                'file_sptjm'               => $pathSptjm,
                'file_transkrip_kumulatif' => $pathTranskrip,
                'file_keterangan_dokter'   => $pathDokter,
                'status'                   => 'pending' // Default status
            ]
        ));

        return response()->json(['message' => 'Surat berhasil diajukan', 'data' => $surat], 201);
    }

    // Menampilkan detail surat (GET)
    public function show($id)
    {
        $surat = SuratRekomendasiKampusMengajar::with('profileMHS')->find($id);
        if (!$surat) return response()->json(['message' => 'Data tidak ditemukan'], 404);

        return response()->json(['success' => true, 'data' => $surat], 200);
    }

    // Update data atau Status (PUT/PATCH)
    public function update(Request $request, $id)
    {
        $surat = SuratRekomendasiKampusMengajar::find($id);

        if (!$surat) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'status'  => 'sometimes|in:pending,approved,rejected',
            'catatan' => 'sometimes|string',
            'role'    => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // 2. Cek apakah ada upaya mengubah status
        if ($request->has('status')) {
            $allowedRoles = ['div_sekolah', 'div_prodi']; 

            if (!in_array($request->role, $allowedRoles)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses ditolak. Hanya Divisi Sekolah atau Prodi yang bisa mengubah status.'
                ], 403);
            }
        }

        // 3. Eksekusi Update
        $surat->update($request->only(['status', 'catatan']));

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil diperbarui',
            'data'    => $surat
        ], 200);
    }

    // Menghapus data (DELETE)
    public function destroy($id)
    {
        $surat = SuratRekomendasiKampusMengajar::find($id);
        if (!$surat) return response()->json(['message' => 'Data tidak ditemukan'], 404);

        // Hapus file dari storage
        Storage::disk('public')->delete([
            $surat->file_pengantar_prodi,
            $surat->file_surat_persetujuan,
            $surat->file_sptjm,
            $surat->file_transkrip_kumulatif,
            $surat->file_keterangan_dokter
        ]);

        $surat->delete();
        return response()->json(['message' => 'Data berhasil dihapus'], 200);
    }
}
