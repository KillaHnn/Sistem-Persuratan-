<?php

namespace App\Http\Controllers;

use App\Models\SuratPengunduranMHS;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class SuratPengunduranMHSController extends Controller
{
    // Mengambil semua data surat
    public function index()
    {
        $data = SuratPengunduranMHS::with('profileMHS')->get();
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
            'thn_akademik_pengunduran' => 'required|string',
            'tanggal_pengunduran'      => 'required|date',
            'tanggal_terakhi_aktif'    => 'required|date', // Sesuai migration: tanggal_terakhi_aktif (typo di migration, kita ikuti dulu)
            'file_ktm'                 => 'required|file|mimes:pdf,jpg,png|max:2048',
            'file_pengajuan'           => 'required|file|mimes:pdf,jpg,png|max:2048',
            'file_pengantar_prodi'     => 'required|file|mimes:pdf,jpg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Upload File
        $pathKtm = $request->file('file_ktm')->store('pengunduran/ktm', 'public');
        $pathPengajuan = $request->file('file_pengajuan')->store('pengunduran/pengajuan', 'public');
        $pathPengantar = $request->file('file_pengantar_prodi')->store('pengunduran/pengantar_prodi', 'public');

        $surat = SuratPengunduranMHS::create(array_merge(
            $request->all(),
            [
                'profile_id'           => $user->profileMHS->id,
                'file_ktm'             => $pathKtm,
                'file_pengajuan'       => $pathPengajuan,
                'file_pengantar_prodi' => $pathPengantar,
                'status'               => 'pending' // Default status
            ]
        ));

        return response()->json(['message' => 'Surat berhasil diajukan', 'data' => $surat], 201);
    }

    // Menampilkan detail surat (GET)
    public function show($id)
    {
        $surat = SuratPengunduranMHS::with('profileMHS')->find($id);
        if (!$surat) return response()->json(['message' => 'Data tidak ditemukan'], 404);

        return response()->json(['success' => true, 'data' => $surat], 200);
    }

    // Update data atau Status (PUT/PATCH)
    public function update(Request $request, $id)
    {
        $surat = SuratPengunduranMHS::find($id);

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
        $surat = SuratPengunduranMHS::find($id);
        if (!$surat) return response()->json(['message' => 'Data tidak ditemukan'], 404);

        // Hapus file dari storage
        Storage::disk('public')->delete([
            $surat->file_ktm,
            $surat->file_pengajuan,
            $surat->file_pengantar_prodi
        ]);

        $surat->delete();
        return response()->json(['message' => 'Data berhasil dihapus'], 200);
    }
}
