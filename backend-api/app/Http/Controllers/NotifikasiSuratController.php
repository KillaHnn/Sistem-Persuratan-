<?php

namespace App\Http\Controllers;

use App\Models\NotifikasiSurat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotifikasiSuratController extends Controller
{
    /**
     * List notifikasi milik user yang login.
     * Selalu menyertakan unread_count di root response.
     */
    public function index(Request $request)
    {
        $userId = Auth::id();

        $query = NotifikasiSurat::where('user_id', $userId)
            ->with('suratUmum')
            ->orderBy('created_at', 'desc');

        if ($request->boolean('unread')) {
            $query->where('is_read', false);
        }

        $notifikasi = $query->paginate(20);

        // Hitung total unread secara terpisah (tidak bergantung filter)
        $unreadCount = NotifikasiSurat::where('user_id', $userId)
            ->where('is_read', false)
            ->count();

        return response()->json(array_merge(
            $notifikasi->toArray(),
            ['unread_count' => $unreadCount]
        ));
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
