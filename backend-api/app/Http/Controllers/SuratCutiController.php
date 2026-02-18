<?php

namespace App\Http\Controllers;

use App\Models\SuratCuti;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class SuratCutiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = SuratCuti::with('profileMHS')->get();
        return response()->json([
            'success' => true,
            'data'    => $data
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    // Menyimpan surat baru (POST)
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user || !$user->profileMHS) {
            return response()->json(['message' => 'Profile belum dilengkapi'], 400);
        }

        $validator = Validator::make($request->all(), [
            'tahun_akademik'          => 'required|string',
            'semester'                => 'required|string',
            'tahun_akademik_cuti'     => 'required|string',
            'semester_cuti'           => 'required|string',
            'alasan_cuti'             => 'required|string',
            'file_pengajuan'          => 'required|file|mimes:pdf,jpg,png|max:2048',
            'file_pengantar_prodi'    => 'required|file|mimes:pdf,jpg,png|max:2048',
            'file_surat_keterangan'   => 'required|file|mimes:pdf,jpg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Upload Files
        $pathPengajuan = $request->file('file_pengajuan')->store('cuti/pengajuan', 'public');
        $pathPengantar = $request->file('file_pengantar_prodi')->store('cuti/pengantar_prodi', 'public');
        $pathKeterangan = $request->file('file_surat_keterangan')->store('cuti/surat_keterangan', 'public');

        $surat = SuratCuti::create(array_merge(
            $request->all(),
            [
                'profile_id'            => $user->profileMHS->id,
                'file_pengajuan'        => $pathPengajuan,
                'file_pengantar_prodi'  => $pathPengantar,
                'file_surat_keterangan' => $pathKeterangan,
                'status'                => 'pending' // Default status
            ]
        ));

        return response()->json(['message' => 'Surat berhasil diajukan', 'data' => $surat], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $surat = SuratCuti::with('profileMHS')->find($id);
        if (!$surat) return response()->json(['message' => 'Data tidak ditemukan'], 404);

        return response()->json(['success' => true, 'data' => $surat], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SuratCuti $suratCuti)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $surat = SuratCuti::find($id);

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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $surat = SuratCuti::find($id);
        if (!$surat) return response()->json(['message' => 'Data tidak ditemukan'], 404);

        // Hapus file dari storage
        Storage::disk('public')->delete([
            $surat->file_pengajuan,
            $surat->file_pengantar_prodi,
            $surat->file_surat_keterangan
        ]);

        $surat->delete();
        return response()->json(['message' => 'Data berhasil dihapus'], 200);
    }
}
