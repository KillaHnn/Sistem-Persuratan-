<?php

namespace App\Http\Controllers;

use App\Models\NomorSurat;
use Illuminate\Http\Request;

class NomorSuratController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $nomorSurats = NomorSurat::all();
        return response()->json([
            'success' => true,
            'data' => $nomorSurats
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_surat' => 'required|string',
            'tanggal_surat' => 'required|date',
            'hal_surat' => 'required|string',
            'isi_surat' => 'required|string',
        ]);

        $nomorSurat = NomorSurat::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Nomor surat berhasil dibuat',
            'data' => $nomorSurat
        ], 201);
    }

    public function show(NomorSurat $nomorSurat)
    {
        return response()->json([
            'success' => true,
            'data' => $nomorSurat
        ]);
    }

    public function update(Request $request, NomorSurat $nomorSurat)
    {
        $validated = $request->validate([
            'kode_surat' => 'sometimes|required|string',
            'tanggal_surat' => 'sometimes|required|date',
            'hal_surat' => 'sometimes|required|string',
            'isi_surat' => 'sometimes|required|string',
        ]);

        $nomorSurat->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Nomor surat berhasil diperbarui',
            'data' => $nomorSurat
        ]);
    }

    public function destroy(NomorSurat $nomorSurat)
    {
        $nomorSurat->delete();

        return response()->json([
            'success' => true,
            'message' => 'Nomor surat berhasil dihapus'
        ]);
    }
}
