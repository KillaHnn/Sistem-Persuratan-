<?php

namespace App\Http\Controllers;

use App\Models\ProfileMHS;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ProfileMHSController extends Controller
{
    /**
     * Menampilkan semua data profil mahasiswa.
     */
    public function index()
    {
        $profiles = ProfileMHS::all();
        return response()->json([
            'success' => true,
            'data'    => $profiles
        ], 200);
    }

    /**
     * Menyimpan data profil baru (Create).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama'     => 'required|string|max:255',
            'nim'      => 'required|string|unique:profile_m_h_s,nim',
            'prodi'    => 'required|string',
            'fakultas' => 'required|string',
            'email'    => 'required|email|unique:profile_m_h_s,email',
            'no_hp'    => 'required|string|max:15',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $profile = ProfileMHS::create(array_merge(
            $request->all(),
            ['user_id' => Auth::id()]
        ));

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil dibuat',
            'data'    => $profile
        ], 201);
    }  
}
