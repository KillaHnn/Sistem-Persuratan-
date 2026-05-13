<?php

namespace App\Http\Controllers;

use App\Models\NotifikasiSurat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotifikasiSuratController extends Controller
{
    /**
     * List notifikasi milik user yang login.
     */
    public function index(Request $request)
    {
        $query = NotifikasiSurat::where('user_id', Auth::id())
            ->with('suratUmum')
            ->orderBy('created_at', 'desc');

        if ($request->has('unread') && $request->unread === 'true') {
            $query->where('is_read', false);
        }

        $notifikasi = $query->paginate(20);

        return response()->json($notifikasi);
    }

    /**
     * Tandai satu notifikasi sebagai sudah dibaca.
     */
    public function markRead($id)
    {
        $notifikasi = NotifikasiSurat::where('user_id', Auth::id())
            ->findOrFail($id);

        $notifikasi->update(['is_read' => true]);

        return response()->json(['message' => 'Notifikasi telah dibaca']);
    }

    /**
     * Tandai semua notifikasi sebagai sudah dibaca.
     */
    public function markAllRead()
    {
        NotifikasiSurat::where('user_id', Auth::id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['message' => 'Semua notifikasi telah dibaca']);
    }
}
