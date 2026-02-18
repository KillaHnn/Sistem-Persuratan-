<?php

namespace App\Http\Controllers;

use App\Models\SuratTunjangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class SuratTunjanganController extends Controller
{
    // Mengambil semua data surat
    public function index()
    {
        $data = SuratTunjangan::with('profileMHS')->get();
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
            'tahun_akademik'   => 'required|string',
            'semester'         => 'required|string',
            'nama_ortu'        => 'required|string',
            'nip_nrp_ortu'     => 'required|string',
            'pangkat_golongan' => 'required|string',
            'nama_instansi'    => 'required|string',
            'file_ktm'         => 'required|file|mimes:pdf,jpg,png|max:2048',
            'file_spp'         => 'required|file|mimes:pdf,jpg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Upload File
        $pathKtm = $request->file('file_ktm')->store('tunjangan/ktm', 'public');
        $pathSpp = $request->file('file_spp')->store('tunjangan/spp', 'public');

        $surat = SuratTunjangan::create(array_merge(
            $request->all(),
            [
                'profile_id' => $user->profileMHS->id,
                'file_ktm'   => $pathKtm,
                'file_spp'   => $pathSpp,
                'status'     => 'pending' // Default status
            ]
        ));

        return response()->json(['message' => 'Surat berhasil diajukan', 'data' => $surat], 201);
    }

    // Menampilkan detail surat (GET)
    public function show($id)
    {
        $surat = SuratTunjangan::with('profileMHS')->find($id);
        if (!$surat) return response()->json(['message' => 'Data tidak ditemukan'], 404);

        return response()->json(['success' => true, 'data' => $surat], 200);
    }

    // Update data atau Status (PUT/PATCH)
    public function update(Request $request, $id)
    {
        $surat = SuratTunjangan::find($id);

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
            $allowedRoles = ['div_sekolah', 'div_prodi'];

            // Cek apakah role yang mengirim request diizinkan
            if (!in_array($request->role, $allowedRoles)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses ditolak. Hanya Divisi Sekolah atau Prodi yang bisa mengubah status.'
                ], 403); // 403 Forbidden
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
        $surat = SuratTunjangan::find($id);
        if (!$surat) return response()->json(['message' => 'Data tidak ditemukan'], 404);

        // Hapus file dari storage
        Storage::disk('public')->delete([$surat->file_ktm, $surat->file_spp]);

        $surat->delete();
        return response()->json(['message' => 'Data berhasil dihapus'], 200);
    }
}
