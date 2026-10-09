<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SuratStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public string $judul;
    public string $pesan;
    public string $status;
    public int    $suratId;
    public string $perihal;
    public string $namaPemohon;
    public ?string $catatan;

    // Map status → warna tombol email
    private static array $colorMap = [
        'menunggu'      => '#6b7280', // gray
        'diproses'      => '#3b82f6', // blue
        'diverifikasi'  => '#8b5cf6', // purple
        'ditandatangani'=> '#10b981', // green
        'dikembalikan'  => '#ef4444', // red
        'selesai'       => '#10b981', // green
        'diarsipkan'    => '#6b7280', // gray
    ];

    public function __construct(
        string  $judul,
        string  $pesan,
        string  $status,
        int     $suratId,
        string  $perihal,
        string  $namaPemohon,
        ?string $catatan = null
    ) {
        $this->judul       = $judul;
        $this->pesan       = $pesan;
        $this->status      = $status;
        $this->suratId     = $suratId;
        $this->perihal     = $perihal;
        $this->namaPemohon = $namaPemohon;
        $this->catatan     = $catatan;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $color    = self::$colorMap[$this->status] ?? '#ea580c';
        $frontUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));
        $url      = "{$frontUrl}/umum/riwayat/{$this->suratId}";

        $mail = (new MailMessage)
            ->subject("[SSMI SIP] {$this->judul}")
            ->greeting("Halo, {$notifiable->name}!")
            ->line($this->pesan)
            ->line('')
            ->line("**Detail Surat:**")
            ->line("- **Perihal:** {$this->perihal}")
            ->line("- **Pemohon:** {$this->namaPemohon}");

        if ($this->catatan) {
            $mail->line("- **Catatan:** {$this->catatan}");
        }

        $mail->action('Lihat Surat', $url)
            ->line('Terima kasih telah menggunakan Sistem Persuratan SSMI.')
            ->salutation('Salam, Tim SSMI SIP');

        return $mail;
    }
}
