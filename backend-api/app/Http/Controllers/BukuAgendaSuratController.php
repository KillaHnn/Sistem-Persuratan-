<?php

namespace App\Http\Controllers;

use App\Models\BukuAgendaSurat;
use App\Models\SuratUmum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BukuAgendaSuratController extends Controller
{
    public function index()
    {
        $data = BukuAgendaSurat::with(['suratUmum', 'suratUmum.pemohon'])->orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $data]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nomor_surat' => 'required|string|max:100',
            'surat_umum_id' => 'nullable|exists:surat_umum,id',
            'tanggal_surat' => 'nullable|date',
            'jenis_surat' => 'nullable|string|max:100',
            'perihal' => 'nullable|string',
            'keterangan' => 'nullable|string',
        ]);

        $agenda = BukuAgendaSurat::create([
            'surat_umum_id' => $request->surat_umum_id,
            'nomor_surat' => $request->nomor_surat,
            'tanggal_surat' => $request->tanggal_surat,
            'jenis_surat' => $request->jenis_surat,
            'perihal' => $request->perihal,
            'keterangan' => $request->keterangan,
            'created_by' => Auth::id(),
        ]);

        return response()->json([
            'message' => 'Buku agenda surat berhasil ditambahkan',
            'data' => $agenda
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nomor_surat' => 'required|string|max:100',
            'surat_umum_id' => 'nullable|exists:surat_umum,id',
            'tanggal_surat' => 'nullable|date',
            'jenis_surat' => 'nullable|string|max:100',
            'perihal' => 'nullable|string',
            'keterangan' => 'nullable|string',
        ]);

        $agenda = BukuAgendaSurat::findOrFail($id);
        
        $agenda->update([
            'surat_umum_id' => $request->surat_umum_id,
            'nomor_surat' => $request->nomor_surat,
            'tanggal_surat' => $request->tanggal_surat,
            'jenis_surat' => $request->jenis_surat,
            'perihal' => $request->perihal,
            'keterangan' => $request->keterangan,
        ]);

        return response()->json([
            'message' => 'Buku agenda surat berhasil diperbarui',
            'data' => $agenda
        ]);
    }

    public function destroy($id)
    {
        $agenda = BukuAgendaSurat::findOrFail($id);
        $agenda->delete();
        
        return response()->json(['message' => 'Buku agenda surat berhasil dihapus']);
    }

    public function getDropdownSurat()
    {
        // Get letters that have passed kabag tu verification and have a nomor_surat
        $suratList = SuratUmum::whereNotNull('nomor_surat')
            ->whereIn('status', ['diverifikasi', 'ditandatangani', 'selesai', 'diarsipkan'])
            ->select('id', 'nomor_surat', 'perihal', 'jenis_surat', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $suratList]);
    }
}
