#  SSMI SIP — Sistem Informasi Persuratan

Sistem manajemen persuratan internal berbasis web untuk lingkungan kampus SSMI. Aplikasi ini menangani pembuatan surat, alur persetujuan multi-level (approval flow), notifikasi email, arsip surat, dan buku agenda.

---

##  Daftar Isi

- [Arsitektur Sistem](#-arsitektur-sistem)
- [Tech Stack](#-tech-stack)
- [Struktur Proyek](#-struktur-proyek)
- [Konfigurasi Environment](#-konfigurasi-environment)
- [Database Migration & Seeding](#-database-migration--seeding)
- [Queue Worker (Wajib)](#-queue-worker-wajib)
- [Storage & File Upload](#-storage--file-upload)
- [CORS & Domain Configuration](#-cors--domain-configuration)
- [SSL / HTTPS](#-ssl--https)
- [Health Check & Monitoring](#-health-check--monitoring)
- [Troubleshooting](#-troubleshooting)
- [Akun Demo (Seeder)](#-akun-demo-seeder)

---

##  Arsitektur Sistem

```
┌──────────────────────┐         ┌──────────────────────┐
│    Frontend (SSR)    │  HTTP   │    Backend (API)     │
│    Next.js 16        │────────▶│    Laravel 12        │
│    Port: 3000        │         │    Port: 8000        │
│    TypeScript + React│         │    PHP 8.2+          │
└──────────────────────┘         └──────┬───────────────┘
                                        │
                              ┌─────────┼─────────────┐
                              │         │             │
                         ┌────▼───┐ ┌───▼────┐  ┌────▼────┐
                         │ MySQL  │ │ Queue  │  │  SMTP   │
                         │  DB    │ │ Worker │  │  Email  │
                         └────────┘ └────────┘  └─────────┘
```

**Catatan penting:** Backend dan frontend adalah **dua aplikasi terpisah** yang berkomunikasi via REST API. Keduanya harus di-deploy secara independen.

---

##  Tech Stack

| Komponen       | Teknologi                                                   |
| -------------- | ----------------------------------------------------------- |
| **Frontend**   | Next.js 16.1.6, React 19, TypeScript, Tailwind CSS 4        |
| **Backend**    | Laravel 12, PHP 8.2+, Sanctum (API Token Auth)              |
| **Database**   | MySQL 8.0+                                                  |
| **Queue**      | Database-driven queue (`QUEUE_CONNECTION=database`)          |
| **Email**      | SMTP (default: Gmail App Password)                           |
| **Auth**       | Laravel Sanctum (Bearer Token) + Spatie Laravel Permission   |
| **File Store** | Local disk (upgradable ke S3-compatible)                     |

---

##  Struktur Proyek

```
Sistem-Persuratan-/
├── backend-api/          ← Laravel 12 REST API
│   ├── app/
│   │   ├── Http/Controllers/   ← 10 controllers (Auth, SuratUmum, Approval, dll)
│   │   ├── Models/
│   │   ├── Notifications/      ← SuratStatusNotification (queued email)
│   │   └── Providers/
│   ├── config/
│   ├── database/
│   │   ├── migrations/         ← 36 migration files
│   │   └── seeders/            ← PersuratanUmumSeeder (roles + users)
│   ├── routes/api.php          ← Semua endpoint REST
│   ├── storage/
│   ├── .env.example
│   └── composer.json
│
├── frontend-app/         ← Next.js 16 (App Router, SSR)
│   ├── app/
│   │   ├── api/                ← Next.js route handlers (login, logout, register)
│   │   ├── login/
│   │   ├── register/
│   │   └── umum/               ← Modul persuratan utama
│   │       ├── buat-surat/
│   │       ├── buku-register/
│   │       ├── dashboard/
│   │       ├── notifikasi/
│   │       ├── riwayat/
│   │       └── users/
│   ├── middleware.ts            ← Auth guard (cookie-based)
│   ├── .env (tidak ter-commit)
│   └── package.json
│
└── README.md             ← File ini
```

---

##  Konfigurasi Environment

### Backend (`backend-api/.env`)

Salin `.env.example` lalu sesuaikan:

```bash
cd backend-api
cp .env.example .env
```

Variabel yang **wajib diubah** untuk production:

```env
# ── App ──────────────────────────────────────────
APP_NAME="SSMI SIP"
APP_ENV=production
APP_DEBUG=false                          # WAJIB false di production!
APP_URL=https://api.your-domain.com      # URL backend (tanpa trailing slash)
FRONTEND_URL=https://your-domain.com     # URL frontend (untuk link di email notifikasi)

# ── Database ─────────────────────────────────────
DB_CONNECTION=mysql
DB_HOST=<IP_DATABASE_SERVER>             # misalnya: 10.0.0.5 atau cloud SQL endpoint
DB_PORT=3306
DB_DATABASE=db_sip
DB_USERNAME=<DB_USER>
DB_PASSWORD=<DB_PASSWORD>

# ── Session & Cache ──────────────────────────────
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

# ── Email SMTP ───────────────────────────────────
MAIL_MAILER=smtp
MAIL_ENCRYPTION=tls
MAIL_HOST=smtp.gmail.com                 # atau SMTP provider lain
MAIL_PORT=587
MAIL_USERNAME=<EMAIL>
MAIL_PASSWORD=<APP_PASSWORD>             # Gmail: gunakan App Password
MAIL_FROM_ADDRESS=<EMAIL>
MAIL_FROM_NAME="SSMI SIP"

# ── Encryption Key ───────────────────────────────
APP_KEY=                                 # Akan di-generate otomatis via artisan
```

### Frontend (`frontend-app/.env`)

```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

> ** PENTING:** `NEXT_PUBLIC_API_URL` harus mengarah ke URL backend yang bisa diakses **dari browser klien** (bukan internal network).

---

## Queue Worker

Aplikasi ini menggunakan **database queue** untuk mengirim email notifikasi status surat secara asinkron. Queue worker **harus berjalan terus-menerus** di production.

### Menggunakan Supervisor (Rekomendasi)

Buat file `/etc/supervisor/conf.d/ssmi-queue.conf`:

```ini
[program:ssmi-queue]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/ssmi-sip/backend-api/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/var/log/supervisor/ssmi-queue.log
stopwaitsecs=3600
```

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start ssmi-queue:*
```

### Menggunakan systemd (Alternatif)

Buat file `/etc/systemd/system/ssmi-queue.service`:

```ini
[Unit]
Description=SSMI SIP Queue Worker
After=network.target mysql.service

[Service]
User=www-data
Group=www-data
Restart=always
RestartSec=5
WorkingDirectory=/var/www/ssmi-sip/backend-api
ExecStart=/usr/bin/php artisan queue:work --sleep=3 --tries=3 --max-time=3600

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable ssmi-queue
sudo systemctl start ssmi-queue
```

---

## Storage & File Upload

Aplikasi menyimpan dokumen surat di `storage/app/private`. Pastikan:

1. **Storage link** sudah dibuat:
   ```bash
   php artisan storage:link
   ```

2. **Permission** sudah benar:
   ```bash
   sudo chown -R www-data:www-data storage bootstrap/cache
   sudo chmod -R 775 storage bootstrap/cache
   ```

3. **Nginx** mengizinkan upload file besar (default max 20MB):
   ```nginx
   client_max_body_size 20M;
   ```

4. **PHP** juga mendukung upload besar (edit `php.ini`):
   ```ini
   upload_max_filesize = 20M
   post_max_size = 25M
   ```

### Migrasi ke Object Storage (Opsional)

Untuk cloud yang tidak memiliki persistent disk, ubah ke S3-compatible storage:

```env
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
AWS_DEFAULT_REGION=ap-southeast-1
AWS_BUCKET=ssmi-sip-documents
```

Kompatibel dengan: AWS S3, GCP Cloud Storage (via interoperability), DigitalOcean Spaces, MinIO.

---

## CORS & Domain Configuration

Laravel Sanctum digunakan untuk autentikasi API (Bearer Token). Pastikan konfigurasi berikut:

### File `config/cors.php` (jika belum ada, publish dulu)

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

### Variabel `.env` yang terkait

```env
APP_URL=https://api.your-domain.com
FRONTEND_URL=https://your-domain.com
SESSION_DOMAIN=.your-domain.com        # Untuk cross-subdomain cookie (opsional)
SANCTUM_STATEFUL_DOMAINS=your-domain.com,api.your-domain.com
```

## SSL / HTTPS

Gunakan **Certbot** (Let's Encrypt) untuk SSL gratis:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d api.your-domain.com
```

Certbot akan otomatis mengatur auto-renewal.

---

## Health Check & Monitoring

### Endpoint Health Check

Buat endpoint sederhana untuk monitoring (tambahkan di `routes/web.php`):

```php
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
});
```

### Cek Status Queue

```bash
# Lihat jumlah job yang menunggu
php artisan queue:monitor database:default --max=100

# Cek failed jobs
php artisan queue:failed

# Retry failed jobs
php artisan queue:retry all
```

### Log Monitoring

```bash
# Backend log (Laravel)
tail -f /var/www/ssmi-sip/backend-api/storage/logs/laravel.log

# Queue log (Supervisor)
tail -f /var/log/supervisor/ssmi-queue.log

# Nginx error log
tail -f /var/log/nginx/error.log
```

## Troubleshooting

### 500 Internal Server Error

```bash
# Cek log
tail -50 storage/logs/laravel.log

# Clear semua cache
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Re-cache
php artisan config:cache
php artisan route:cache
```

### Email tidak terkirim

```bash
# Pastikan queue worker berjalan
sudo supervisorctl status ssmi-queue:*

# Cek failed jobs
php artisan queue:failed

# Test koneksi SMTP manual
php artisan tinker
>>> Mail::raw('Test', fn($msg) => $msg->to('test@example.com')->subject('Test'));
```

### CORS Error di Browser

- Pastikan `FRONTEND_URL` di `.env` backend sudah benar (termasuk protocol `https://`)
- Pastikan **tidak ada trailing slash** di URL
- Clear config cache: `php artisan config:cache`

### Frontend tidak bisa konek ke backend

- Pastikan `NEXT_PUBLIC_API_URL` sudah benar
- Pastikan backend API bisa diakses dari internet (bukan hanya localhost)
- Cek firewall: port 8000 (atau 80/443 via Nginx) harus terbuka
- Jika rebuild, pastikan `npm run build` dijalankan ulang (karena `NEXT_PUBLIC_*` di-inject saat build)

### Permission denied pada storage

```bash
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### Migration gagal

```bash
# Cek koneksi database
php artisan tinker
>>> DB::connection()->getPdo();

# Reset dan migrasi ulang (⚠️ HAPUS SEMUA DATA)
php artisan migrate:fresh --seed --force
```

## Akun Demo (Seeder)

Setelah menjalankan `php artisan db:seed`, tersedia akun berikut:

| Role            | Username       | Default Password |
| --------------- | -------------- | ---------------- |
| Super Admin     | `admin01`      | `password`       |
| Pemohon         | `pemohon01`    | `password`       |
| Sekretariat     | `sekretariat01`| `password`       |
| Kabag TU        | `kabagtu01`    | `password`       |
| Wakil Dekan     | `wadek01`      | `password`       |

### Alur Approval Surat

```
Pemohon (buat surat)
    → Sekretariat (proses & verifikasi)
        → Kabag TU (paraf)
            → Wakil Dekan (tandatangan)
                → Sekretariat (arsipkan)
```

Setiap perpindahan status akan mengirim **notifikasi email** ke pihak terkait.

---

## Checklist Deployment

Gunakan checklist ini untuk memastikan deployment berjalan lancar:

- [ ] Server/VM sudah tersetup dengan PHP 8.2, MySQL, Nginx, Node.js
- [ ] Repository sudah di-clone
- [ ] `composer install --no-dev --optimize-autoloader` berhasil
- [ ] `.env` backend sudah dikonfigurasi (APP_URL, DB, MAIL, FRONTEND_URL)
- [ ] `php artisan key:generate` sudah dijalankan
- [ ] `php artisan migrate --force` berhasil
- [ ] `php artisan db:seed --force` berhasil
- [ ] `php artisan storage:link` berhasil
- [ ] `php artisan config:cache && route:cache && view:cache` berhasil
- [ ] Permission `storage/` dan `bootstrap/cache/` sudah benar
- [ ] Frontend `.env` sudah dikonfigurasi (`NEXT_PUBLIC_API_URL`)
- [ ] `npm ci && npm run build` berhasil
- [ ] Nginx reverse proxy sudah terkonfigurasi untuk backend & frontend
- [ ] SSL/HTTPS sudah aktif (Certbot)
- [ ] Queue worker berjalan via Supervisor / systemd
- [ ] PM2 menjalankan frontend Next.js
- [ ] Password default akun demo sudah diganti
- [ ] `APP_DEBUG=false` di production
- [ ] Health check endpoint bisa diakses

---

