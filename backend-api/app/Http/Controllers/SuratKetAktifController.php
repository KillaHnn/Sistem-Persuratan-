<?php

namespace App\Http\Controllers;

use App\Models\SuratKetAktif;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class SuratKetAktifController extends Controller
{
    // Mengambil semua data surat
    public function index()
    {
        $data = SuratKetAktif::with(['profileMHS', 'suratCuti'])->get();
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
            'surat_cuti_id'        => 'required|exists:surat_cutis,id',
            'tahun_akademik'       => 'required|string',
            'semester'             => 'required|string',
            'tanggal_lapor'        => 'required|date',
            'tahun_akademik_aktif' => 'required|string',
            'semester_aktif'       => 'required|string',
            'file_pengantar'       => 'required|file|mimes:pdf,jpg,png|max:2048',
            'file_surat_cuti'      => 'required|file|mimes:pdf,jpg,png|max:2048',
            'file_spp'             => 'required|file|mimes:pdf,jpg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Upload File
        $pathPengantar = $request->file('file_pengantar')->store('aktif/pengantar', 'public');
        $pathSuratCuti = $request->file('file_surat_cuti')->store('aktif/surat_cuti', 'public');
        $pathSpp       = $request->file('file_spp')->store('aktif/spp', 'public');

        $surat = SuratKetAktif::create(array_merge(
            $request->all(),
            [
                'profile_id'      => $user->profileMHS->id,
                'file_pengantar'  => $pathPengantar,
                'file_surat_cuti' => $pathSuratCuti,
                'file_spp'        => $pathSpp,
                'status'          => 'pending' // Default status
            ]
        ));

        return response()->json(['message' => 'Surat berhasil diajukan', 'data' => $surat], 201);
    }

    // Menampilkan detail surat (GET)
    public function show($id)
    {
        $surat = SuratKetAktif::with(['profileMHS', 'suratCuti'])->find($id);
        if (!$surat) return response()->json(['message' => 'Data tidak ditemukan'], 404);

        return response()->json(['success' => true, 'data' => $surat], 200);
    }

    // Update data atau Status (PUT/PATCH)
    public function update(Request $request, $id)
    {
        $surat = SuratKetAktif::find($id);

        if (!$surat) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'status'  => 'sometimes|in:pending,approved,rejected',
            'catatan' => 'sometimes|string',
            'role'    => 'required|string' // Sementara kita minta role dikirim di request
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // 2. Cek apakah ada upaya mengubah status
        if ($request->has('status')) {
            $allowedRoles = ['div_sekolah', 'div_prodi']; // Asumsi role yang sama

            // Cek apakah role yang mengirim request diizinkan
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
        $surat = SuratKetAktif::find($id);
        if (!$surat) return response()->json(['message' => 'Data tidak ditemukan'], 404);

        // Hapus file dari storage
        Storage::disk('public')->delete([
            $surat->file_pengantar,
            $surat->file_surat_cuti,
            $surat->file_spp
        ]);

        $surat->delete();
        return response()->json(['message' => 'Data berhasil dihapus'], 200);
    }
}
