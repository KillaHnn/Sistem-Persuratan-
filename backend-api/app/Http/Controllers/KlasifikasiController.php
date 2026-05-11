<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\KlasifikasiPrimer;
use App\Models\KlasifikasiSekunder;
use App\Models\KlasifikasiTersier;

class KlasifikasiController extends Controller
{
    public function getPrimers()
    {
        return response()->json([
            'success' => true,
            'data' => KlasifikasiPrimer::all()
        ]);
    }

    public function getSekunders($primer_id)
    {
        return response()->json([
            'success' => true,
            'data' => KlasifikasiSekunder::where('klasifikasi_primer_id', $primer_id)->get()
        ]);
    }

    public function getTersiers($sekunder_id)
    {
        return response()->json([
            'success' => true,
            'data' => KlasifikasiTersier::where('klasifikasi_sekunder_id', $sekunder_id)->get()
        ]);
    }
}
