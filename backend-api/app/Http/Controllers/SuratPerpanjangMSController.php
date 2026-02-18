<?php

namespace App\Http\Controllers;

use App\Models\SuratPerpanjangMS;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class SuratPerpanjangMSController extends Controller
{
    // Mengambil semua data surat
    public function index()
    {
        $data = SuratPerpanjangMS::with('profileMHS')->get();
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
            'tahun_akademik'         => 'required|string',
            'semester'               => 'required|string',
            'dosen_pembimbing'       => 'required|string',
            'tahun_akhir_perpanjang' => 'required|string',
            'file_table'             => 'required|file|mimes:pdf,jpg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Upload File
        $pathTable = $request->file('file_table')->store('perpanjang/table', 'public');

        $surat = SuratPerpanjangMS::create(array_merge(
            $request->all(),
            [
                'profile_id' => $user->profileMHS->id,
                'file_table' => $pathTable,
                'status'     => 'pending' // Default status
            ]
        ));

        return response()->json(['message' => 'Surat berhasil diajukan', 'data' => $surat], 201);
    }

    // Menampilkan detail surat (GET)
    public function show($id)
    {
        $surat = SuratPerpanjangMS::with('profileMHS')->find($id);
        if (!$surat) return response()->json(['message' => 'Data tidak ditemukan'], 404);

        return response()->json(['success' => true, 'data' => $surat], 200);
    }

    // Update data atau Status (PUT/PATCH)
    public function update(Request $request, $id)
    {
        $surat = SuratPerpanjangMS::find($id);

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
        $surat = SuratPerpanjangMS::find($id);
        if (!$surat) return response()->json(['message' => 'Data tidak ditemukan'], 404);

        // Hapus file dari storage
        Storage::disk('public')->delete([
            $surat->file_table
        ]);

        $surat->delete();
        return response()->json(['message' => 'Data berhasil dihapus'], 200);
    }
}
