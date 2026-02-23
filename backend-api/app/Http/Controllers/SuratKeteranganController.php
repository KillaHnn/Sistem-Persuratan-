<?php

namespace App\Http\Controllers;

use App\Models\SuratKeterangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class SuratKeteranganController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = SuratKeterangan::with('profileMHS')->get();
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
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user || !$user->profileMHS) {
            return response()->json(['message' => 'Profile belum dilengkapi'], 400);
        }

        $validate = Validator::make($request->all(), [
            'tahun_akademik' => 'required|string',
            'semester'     => 'required|string',
            'keperluan'    => 'required|string',
            'file_ktm'     => 'required|file|mimes:pdf,jpg,png|max:2048',
            'file_spp'     => 'required|file|mimes:pdf,jpg,png|max:2048',
        ]);

        if ($validate->fails()) {
            return response()->json($validate->errors(), 422);
        }

        $pathKTM = $request->file('file_ktm')->store('keterangan/ktm', 'public');
        $pathSPP = $request->file('file_spp')->store('keterangan/spp', 'public');

        $surat = SuratKeterangan::create(array_merge(
            $request->all(),
            [
                'profile_id' => $user->profileMHS->id,
                'file_ktm' => $pathKTM,
                'file_spp' => $pathSPP,
                'status'   => 'pending',
            ]
        ));

        return response()->json([
            'success' => true,
            'message' => 'Surat Keterangan berhasil diajukan',
            'data'    => $surat
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(SuratKeterangan $suratKeterangan)
    {
        $surat = SuratKeterangan::with('profileMHS')->find($suratKeterangan->id);
        if (!$surat) {
            return response()->json(['message' => 'Surat Keterangan tidak ditemukan'], 404);
        }   
        
        return response()->json([
            'success' => true,
            'data'    => $surat
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SuratKeterangan $suratKeterangan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SuratKeterangan $suratKeterangan)
    {
        $surat = SuratKeterangan::find($suratKeterangan->id);

        if (!$surat) {
            return response()->json(['message' => 'Surat Keterangan tidak ditemukan'], 404);
        }

        $validate = Validator::make($request->all(), [
            'status' => 'required|in:pending,approved,rejected',
            'catatan' => 'nullable|string',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SuratKeterangan $suratKeterangan)
    {
        //
    }
}
