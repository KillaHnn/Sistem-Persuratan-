# 📄 Dokumentasi Pengembang & Teknis — SSMI SIP
**Sistem Informasi Persuratan (SSDMI)**

| Atribut | Nilai |
|---|---|
| **Versi Dokumen** | 1.0 |
| **Terakhir Diperbarui** | Oktober 2026 |
| **Status** | Aktif |
| **Dibuat dari** | Source code analisis langsung |

---

## 📑 Daftar Isi

1. [Gambaran Umum Sistem](#1-gambaran-umum-sistem)
2. [Arsitektur Sistem](#2-arsitektur-sistem)
3. [Tech Stack & Dependensi](#3-tech-stack--dependensi)
4. [Struktur Direktori](#4-struktur-direktori)
5. [Konfigurasi Environment](#5-konfigurasi-environment)
6. [Skema Database](#6-skema-database)
7. [Relasi Antar Model (ORM)](#7-relasi-antar-model-orm)
8. [REST API Reference](#8-rest-api-reference)
9. [Alur Autentikasi](#9-alur-autentikasi)
10. [State Machine — Alur Approval Surat](#10-state-machine--alur-approval-surat)
11. [Sistem Notifikasi](#11-sistem-notifikasi)
12. [Sistem Nomor Surat](#12-sistem-nomor-surat)
13. [Manajemen File & Dokumen](#13-manajemen-file--dokumen)
14. [Frontend — Routing & Middleware](#14-frontend--routing--middleware)
15. [Role & Permission](#15-role--permission)
16. [Queue Worker & Email](#16-queue-worker--email)
17. [Panduan Setup Lokal (Development)](#17-panduan-setup-lokal-development)
18. [Panduan Deployment Production](#18-panduan-deployment-production)
19. [Troubleshooting](#19-troubleshooting)
20. [Konvensi Kode](#20-konvensi-kode)

---

## 1. Gambaran Umum Sistem

SSMI SIP adalah sistem manajemen persuratan digital untuk lingkungan kampus SSMI. Sistem ini mendigitalisasi proses pembuatan, verifikasi, penandatanganan, dan pengarsipan surat keluar secara bertingkat (multi-level approval).

### Fitur Utama
- **Pembuatan Surat** — Pemohon mengajukan permohonan surat dengan mengisi form sesuai jenis surat
- **Approval Bertingkat** — Alur: Pemohon > Sekretariat > Kabag TU > Wakil Dekan > Sekretariat (arsip)
- **Notifikasi Real-time** — Notifikasi in-app + email otomatis di setiap perpindahan status
- **Manajemen Dokumen** — Upload/download draft, revisi, surat paraf, surat TTD
- **Buku Agenda** — Pencatatan dan pencarian surat berdasarkan nomor dan agenda
- **Arsip Digital** — Penyimpanan surat final beserta nomor arsip resmi
- **Manajemen User** — CRUD user dengan role-based access (Superadmin only)
- **Nomor Surat Otomatis** — Generate nomor surat berdasarkan kode klasifikasi

---

## 2. Arsitektur Sistem

```
Frontend (SSR)          Backend (API)
Next.js 16    --HTTP-->  Laravel 12
Port: 3000               Port: 8000
TypeScript+React         PHP 8.2+
                              |
                    __________|___________
                   |          |           |
                MySQL DB   Queue       SMTP Email
                           Worker
```

### Prinsip Desain
- **Decoupled Architecture** — Backend dan frontend adalah dua aplikasi terpisah yang berkomunikasi via REST API
- **Stateless API** — Autentikasi menggunakan Bearer Token (Laravel Sanctum)
- **Database Queue** — Email dikirim secara asinkron melalui database queue untuk performa yang lebih baik
- **Role-Based Access Control** — Menggunakan Spatie Laravel Permission

---

## 3. Tech Stack & Dependensi

### Backend (`backend-api/`)

| Komponen | Teknologi | Versi |
|---|---|---|
| Framework | Laravel | ^12.0 |
| Bahasa | PHP | ^8.2 |
| Database | MySQL | 8.0+ |
| Autentikasi | Laravel Sanctum | ^4.3 |
| Otorisasi | Spatie Laravel Permission | ^6.24 |
| Queue | Database Queue | — |
| Email | Laravel Mail (SMTP) | — |
| Testing | PHPUnit | ^11.5.3 |

### Frontend (`frontend-app/`)

| Komponen | Teknologi | Versi |
|---|---|---|
| Framework | Next.js (App Router, SSR) | 16.1.6 |
| UI Library | React | 19.2.3 |
| Bahasa | TypeScript | ^5 |
| Styling | Tailwind CSS | ^4 |
| Icon | Lucide React | ^0.574.0 |
| Linting | ESLint | ^9 |

---

## 4. Struktur Direktori

```
Sistem-Persuratan-/
|
+-- backend-api/                    <- Laravel 12 REST API
|   +-- app/
|   |   +-- Http/
|   |   |   +-- Controllers/
|   |   |   |   +-- AuthController.php          <- Login, Register, Logout
|   |   |   |   +-- SuratUmumController.php     <- CRUD permohonan surat
|   |   |   |   +-- ApprovalController.php      <- Alur approval (proses, verifikasi, dll)
|   |   |   |   +-- ArsipSuratController.php    <- Pengarsipan surat
|   |   |   |   +-- DokumenSuratController.php  <- Upload/download file dokumen
|   |   |   |   +-- NomorSuratController.php    <- Manajemen nomor surat
|   |   |   |   +-- NotifikasiSuratController.php <- Notifikasi in-app
|   |   |   |   +-- BukuAgendaSuratController.php <- Buku register/agenda
|   |   |   |   +-- UserController.php          <- CRUD user (Superadmin)
|   |   +-- Models/
|   |   |   +-- SuratUmum.php                   <- Model utama surat
|   |   |   +-- User.php
|   |   |   +-- ApprovalLog.php                 <- Audit trail approval
|   |   |   +-- DokumenSurat.php                <- Metadata file
|   |   |   +-- NotifikasiSurat.php
|   |   |   +-- ArsipSurat.php
|   |   |   +-- NomorSurat.php                  <- Generate nomor surat otomatis
|   |   |   +-- NomorSuratHistory.php
|   |   |   +-- BukuAgendaSurat.php
|   |   |   +-- DetailUndangan.php
|   |   |   +-- DetailSuratTugas.php
|   |   |   +-- DetailSuratPengantar.php
|   |   |   +-- DetailSuratKeteranganUmum.php
|   |   |   +-- DetailSuratPermohonan.php
|   |   |   +-- DetailSuratKeputusan.php
|   |   |   +-- DetailSuratLainnya.php
|   |   +-- Notifications/
|   |   |   +-- SuratStatusNotification.php     <- Email notification (queued)
|   +-- database/
|   |   +-- migrations/                         <- 36 file migrasi
|   |   +-- seeders/
|   |       +-- PersuratanUmumSeeder.php        <- Seeder roles + demo users
|   +-- routes/
|       +-- api.php                             <- Semua endpoint REST API
|       +-- web.php
|
+-- frontend-app/                   <- Next.js 16 (App Router)
    +-- app/
    |   +-- api/                               <- Next.js Route Handlers
    |   |   +-- login/route.ts
    |   |   +-- logout/route.ts
    |   |   +-- register/route.ts
    |   +-- login/
    |   +-- register/
    |   +-- umum/                              <- Modul persuratan utama
    |       +-- buat-surat/                    <- Form pengajuan surat
    |       +-- buku-register/                 <- Buku agenda surat
    |       +-- dashboard/                     <- Halaman utama per role
    |       +-- notifikasi/                    <- Daftar notifikasi
    |       +-- riwayat/                       <- Riwayat dan detail surat
    |       +-- users/                         <- Manajemen user (Superadmin)
    |       +-- components/                    <- Shared UI components
    |       +-- hooks/                         <- Custom React hooks
    +-- middleware.ts                          <- Auth guard (route protection)
```

---

## 5. Konfigurasi Environment

### Backend — `backend-api/.env`

```env
# Aplikasi
APP_NAME="SSMI SIP"
APP_ENV=local                       # production | local
APP_KEY=                            # Generate: php artisan key:generate
APP_DEBUG=true                      # WAJIB false di production!
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000  # URL frontend (untuk email notifikasi)

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=db_sip
DB_USERNAME=root
DB_PASSWORD=

# Session, Cache, Queue
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database           # WAJIB database (bukan sync)

# Email SMTP
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password     # Gmail: gunakan App Password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="SSMI SIP"

# CORS / Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:3000
```

### Frontend — `frontend-app/.env`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> PENTING: `NEXT_PUBLIC_API_URL` di-inject saat build. Jika diubah, harus rebuild dengan `npm run build`.

---

## 6. Skema Database

### 6.1 Enum & Nilai yang Valid

```
status_surat:  menunggu | diproses | dikembalikan | diverifikasi |
               ditandatangani | selesai | diarsipkan

jenis_surat:   undangan | surat_tugas | surat_pengantar | surat_keterangan |
               surat_permohonan | surat_keputusan | lainnya

tipe_dokumen:  lampiran_pendukung | draft | draft_revisi | surat_paraf | surat_ttd

aksi_approval: proses | verifikasi | kembalikan | paraf | tandatangan | arsipkan
```

### 6.2 Tabel `users`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT PK AI | Primary key |
| `name` | VARCHAR(255) | Nama lengkap |
| `username` | VARCHAR(255) UNIQUE | Username untuk login |
| `email` | VARCHAR(255) UNIQUE | Email login |
| `password` | VARCHAR(255) | Hash bcrypt |
| `role` | VARCHAR | superadmin/pemohon/sekretariat/kabag_tu/wakil_dekan |
| `unit_kerja` | VARCHAR(255) NULL | Nama unit/fakultas/prodi |
| `is_active` | BOOLEAN | true=aktif, false=dinonaktifkan |
| `created_at` | TIMESTAMP | — |
| `updated_at` | TIMESTAMP | — |

### 6.3 Tabel `surat_umum`

Tabel inti sistem. Setiap baris = satu permohonan surat.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT PK AI | Primary key |
| `jenis_surat` | ENUM | Jenis surat |
| `perihal` | TEXT | Perihal/subject surat |
| `nomor_surat` | VARCHAR(50) NULL | Nomor surat resmi |
| `nomor_surat_id` | BIGINT FK NULL | Referensi ke nomor_surats.id |
| `status` | ENUM | Status dalam alur approval |
| `revisi_ke` | INTEGER DEFAULT 0 | Counter pengembalian untuk revisi |
| `pemohon_id` | BIGINT FK | Referensi ke users.id (pembuat surat) |
| `handler_id` | BIGINT FK NULL | Referensi ke users.id (sekretariat) |
| `tgl_permohonan` | TIMESTAMP | Waktu surat dibuat |
| `tgl_selesai` | TIMESTAMP NULL | Waktu surat selesai diproses |
| `hasil_arsip` | TEXT NULL | Catatan hasil pengarsipan |
| `created_at` | TIMESTAMP | — |
| `updated_at` | TIMESTAMP | — |

### 6.4 Tabel `detail_undangans`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT PK | Primary key |
| `surat_umum_id` | BIGINT FK | Relasi ke surat_umum |
| `nama_kegiatan` | VARCHAR | Nama kegiatan undangan |
| `tanggal_kegiatan` | DATE | Tanggal pelaksanaan |
| `waktu_mulai` | TIME | Jam mulai |
| `tempat` | VARCHAR | Lokasi kegiatan |
| `ditujukan_kepada` | TEXT | Penerima undangan |

### 6.5 Tabel `detail_surat_tugas`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT PK | Primary key |
| `surat_umum_id` | BIGINT FK | Relasi ke surat_umum |
| `nama_ditugaskan` | VARCHAR | Nama pegawai yang ditugaskan |
| `jabatan` | VARCHAR | Jabatan |
| `tujuan_tugas` | TEXT | Tujuan/keperluan penugasan |
| `tempat_tugas` | VARCHAR | Lokasi penugasan |
| `tanggal_mulai` | DATE | Tanggal mulai tugas |
| `tanggal_selesai` | DATE | Tanggal selesai tugas |

### 6.6 Tabel `detail_surat_pengantars`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT PK | Primary key |
| `surat_umum_id` | BIGINT FK | Relasi ke surat_umum |
| `ditujukan_kepada` | TEXT | Tujuan surat pengantar |
| `keperluan` | TEXT | Keperluan/tujuan pengantaran |

### 6.7 Tabel `detail_surat_keterangan_umums`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT PK | Primary key |
| `surat_umum_id` | BIGINT FK | Relasi ke surat_umum |
| `nama_yang_diterangkan` | VARCHAR | Nama subjek keterangan |
| `isi_keterangan` | TEXT | Isi keterangan |
| `keperluan` | TEXT | Keperluan surat keterangan |

### 6.8 Tabel `detail_surat_permohonan`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT PK | Primary key |
| `surat_umum_id` | BIGINT FK | Relasi ke surat_umum |
| `permohonan` | TEXT | Isi permohonan |
| `tujuan_permohonan` | TEXT | Tujuan dari permohonan |

### 6.9 Tabel `detail_surat_keputusan`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT PK | Primary key |
| `surat_umum_id` | BIGINT FK | Relasi ke surat_umum |
| `jenis_sk` | ENUM(Dekan, Rektor) | Jenis surat keputusan |
| `tentang` | TEXT | Hal yang diputuskan |
| `menimbang` | TEXT | Pertimbangan |
| `mengingat` | TEXT | Dasar hukum |
| `diktum_keputusan` | TEXT | Bunyi keputusan |
| `tembusan` | TEXT NULL | Pihak yang mendapat tembusan |

### 6.10 Tabel `detail_surat_lainnyas`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT PK | Primary key |
| `surat_umum_id` | BIGINT FK | Relasi ke surat_umum |
| `deskripsi` | TEXT | Deskripsi bebas surat |

### 6.11 Tabel `approval_logs`

Audit trail — setiap aksi approval dicatat di sini.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT PK | Primary key |
| `surat_umum_id` | BIGINT FK | Relasi ke surat_umum |
| `approver_id` | BIGINT FK | Referensi ke users.id (yang melakukan aksi) |
| `aksi` | VARCHAR | Jenis aksi (proses/verifikasi/kembalikan/dll) |
| `catatan` | TEXT NULL | Catatan/alasan (wajib saat kembalikan) |
| `created_at` | TIMESTAMP | Waktu aksi dilakukan |

### 6.12 Tabel `dokumen_surats`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT PK | Primary key |
| `surat_umum_id` | BIGINT FK | Relasi ke surat_umum |
| `tipe_dokumen` | ENUM | lampiran_pendukung/draft/draft_revisi/surat_paraf/surat_ttd |
| `nama_file` | VARCHAR(255) | Nama file asli saat upload |
| `path_file` | TEXT | Path penyimpanan di storage |
| `versi` | INTEGER | Nomor versi (mulai dari 1) |
| `uploaded_by` | BIGINT FK | Referensi ke users.id |
| `created_at` | TIMESTAMP | Waktu upload |

### 6.13 Tabel `notifikasi_surats`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT PK | Primary key |
| `surat_umum_id` | BIGINT FK | Relasi ke surat_umum |
| `user_id` | BIGINT FK | Referensi ke users.id (penerima) |
| `judul` | VARCHAR(200) | Judul notifikasi |
| `pesan` | TEXT | Isi pesan |
| `is_read` | BOOLEAN DEFAULT false | Status baca |
| `created_at` | TIMESTAMP | Waktu dibuat |

### 6.14 Tabel `arsip_surats`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT PK | Primary key |
| `surat_umum_id` | BIGINT FK UNIQUE | Relasi ke surat_umum |
| `nomor_arsip` | VARCHAR(50) NULL | Nomor arsip resmi institusi |
| `lokasi_fisik` | VARCHAR(200) NULL | Keterangan lokasi fisik |
| `path_digital` | TEXT NULL | Path file surat final TTD |
| `dibuat_oleh` | BIGINT FK | Referensi ke users.id (sekretariat) |
| `created_at` | TIMESTAMP | Waktu arsip dibuat |

### 6.15 Tabel `nomor_surats`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT PK | Primary key |
| `nomor_surat` | VARCHAR | Auto-generated: {urut}/IT3/{kode}/P/B/{tahun} |
| `nomor_urut` | INTEGER | Nomor urut dalam tahun dan kode yang sama |
| `kode_surat` | VARCHAR | Kode klasifikasi (misal: TM.00.00) |
| `tanggal_surat` | DATE | Tanggal surat |
| `hal_surat` | TEXT | Hal/subject surat |
| `isi_surat` | TEXT | Isi ringkas surat |

**Format Nomor Surat:** `{nomor_urut}/IT3/{kode_surat}/P/B/{tahun}`
Contoh: `1046/IT3/TM.00.00/P/B/2026`

### 6.16 Tabel `buku_agenda_surats`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT PK | Primary key |
| `surat_umum_id` | BIGINT FK NULL | Opsional referensi ke surat |
| `nomor_agenda` | VARCHAR | Nomor urut agenda |
| `tanggal` | DATE | Tanggal agenda |
| `perihal` | TEXT | Perihal surat |
| `keterangan` | TEXT NULL | Catatan tambahan |

---

## 7. Relasi Antar Model (ORM)

```
users (1) ----------------------- (N) surat_umum        [pemohon_id]
users (1) ----------------------- (N) surat_umum        [handler_id]
surat_umum (1) ------------------ (N) approval_logs
surat_umum (1) ------------------ (N) dokumen_surats
surat_umum (1) ------------------ (N) notifikasi_surats
surat_umum (1) ------------------ (1) arsip_surats
surat_umum (1) ------------------ (1) detail_undangans
surat_umum (1) ------------------ (1) detail_surat_tugas
surat_umum (1) ------------------ (1) detail_surat_pengantars
surat_umum (1) ------------------ (1) detail_surat_keterangan_umums
surat_umum (1) ------------------ (1) detail_surat_permohonan
surat_umum (1) ------------------ (1) detail_surat_keputusan
surat_umum (1) ------------------ (1) detail_surat_lainnyas
surat_umum (N) ------------------ (1) nomor_surats
users (1) ----------------------- (N) approval_logs     [approver_id]
users (1) ----------------------- (N) dokumen_surats    [uploaded_by]
users (1) ----------------------- (N) notifikasi_surats [user_id]
users (1) ----------------------- (N) arsip_surats      [dibuat_oleh]
```

### Helper Method `SuratUmum::detail()`

```php
// Secara dinamis mengembalikan relasi yang sesuai berdasarkan jenis_surat
$surat->detail()  // Returns HasOne relation ke detail table yang sesuai
```

---

## 8. REST API Reference

**Base URL:** `{APP_URL}/api`
**Autentikasi:** `Authorization: Bearer {token}` (kecuali endpoint publik)

---

### 8.1 Autentikasi

#### POST /api/login

Login pengguna. Tidak memerlukan token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "user01",
  "password": "password123"
}
```
(email ATAU username, salah satu wajib ada)

**Response 200:**
```json
{
  "message": "Login successful",
  "user": { "id": 1, "name": "...", "role": "pemohon" },
  "access_token": "1|abc123...",
  "token_type": "Bearer"
}
```

**Response 401:**
```json
{ "message": "Invalid credentials" }
```

---

#### POST /api/register

Registrasi akun baru (role default: pemohon).

**Request Body:**
```json
{
  "name": "Nama Lengkap",
  "username": "username_unik",
  "email": "email@example.com",
  "password": "password123"
}
```

**Response 201:**
```json
{
  "message": "User registered successfully",
  "user": { ... },
  "access_token": "1|abc...",
  "token_type": "Bearer"
}
```

---

#### POST /api/auth/logout [AUTH REQUIRED]

Logout dan revoke current token.

**Response 200:**
```json
{ "message": "Logged out successfully" }
```

---

### 8.2 User Management (Superadmin Only)

| Endpoint | Method | Deskripsi |
|---|---|---|
| `/api/users` | GET | Daftar semua user |
| `/api/users` | POST | Buat user baru |
| `/api/users/{id}` | GET | Detail user |
| `/api/users/{id}` | PUT/PATCH | Update user |
| `/api/users/{id}` | DELETE | Hapus user |
| `/api/users/{id}/toggle-active` | PATCH | Aktifkan/nonaktifkan user |
| `/api/users/{id}/reset-password` | PATCH | Reset password user |

---

### 8.3 Surat Umum (CRUD)

#### GET /api/umum/surat [AUTH REQUIRED]

Daftar surat (paginated, 15 per halaman). Data difilter otomatis berdasarkan role.

**Query Parameters (opsional):**
```
?status=menunggu        Filter berdasarkan status
?jenis_surat=undangan   Filter berdasarkan jenis
```

**Filter berdasarkan role:**
- `pemohon` — Hanya surat miliknya
- `sekretariat` — Semua surat
- `kabag_tu` — Semua surat kecuali yang berstatus "dikembalikan"
- `wakil_dekan` — Surat berstatus diverifikasi/ditandatangani/selesai/diarsipkan

---

#### POST /api/umum/surat [AUTH REQUIRED]

Buat permohonan surat baru.

**Request:** multipart/form-data

| Field | Wajib | Tipe | Keterangan |
|---|---|---|---|
| `jenis_surat` | Ya | string | Lihat enum jenis_surat |
| `perihal` | Ya | string | Perihal surat |
| `detail` | Ya | object | Field tergantung jenis_surat |
| `lampiran` | Tidak | file | pdf/doc/docx, max 10MB |
| `file_penerima` | Tidak | file | pdf/doc/docx/xls/xlsx, max 10MB (untuk undangan) |

**Field `detail` per Jenis Surat:**

Untuk `undangan`:
```json
{
  "nama_kegiatan": "string (wajib)",
  "tanggal_kegiatan": "YYYY-MM-DD (wajib)",
  "waktu_mulai": "HH:MM (wajib)",
  "tempat": "string (wajib)",
  "ditujukan_kepada": "string (wajib)"
}
```

Untuk `surat_tugas`:
```json
{
  "nama_ditugaskan": "string (wajib)",
  "jabatan": "string (wajib)",
  "tujuan_tugas": "string (wajib)",
  "tempat_tugas": "string (wajib)",
  "tanggal_mulai": "YYYY-MM-DD (wajib)",
  "tanggal_selesai": "YYYY-MM-DD (wajib, >= tanggal_mulai)"
}
```

Untuk `surat_pengantar`:
```json
{
  "ditujukan_kepada": "string (wajib)",
  "keperluan": "string (wajib)"
}
```

Untuk `surat_keterangan`:
```json
{
  "nama_yang_diterangkan": "string (wajib)",
  "isi_keterangan": "string (wajib)",
  "keperluan": "string (wajib)"
}
```

Untuk `surat_permohonan`:
```json
{
  "permohonan": "string (wajib)",
  "tujuan_permohonan": "string (wajib)"
}
```

Untuk `surat_keputusan`:
```json
{
  "jenis_sk": "Dekan|Rektor (wajib)",
  "tentang": "string (wajib)",
  "menimbang": "string (wajib)",
  "mengingat": "string (wajib)",
  "diktum_keputusan": "string (wajib)",
  "tembusan": "string (opsional)"
}
```

Untuk `lainnya`:
```json
{
  "deskripsi": "string (wajib)"
}
```

**Response 201:**
```json
{
  "message": "Permohonan surat berhasil terkirim",
  "data": { "id": 1, "jenis_surat": "undangan", "status": "menunggu", ... }
}
```

---

#### GET /api/umum/surat/{id} [AUTH REQUIRED]

Detail lengkap surat beserta approval log, dokumen, dan data detail.

> Catatan: User dengan role `pemohon` tidak bisa melihat dokumen berjenis `draft`, `draft_revisi`, dan `surat_paraf`.

---

#### PUT /api/umum/surat/{id} [AUTH REQUIRED]

Update surat. Hanya bisa dilakukan oleh pemohon saat status `menunggu` atau `dikembalikan`.

**Request Body:**
```json
{
  "perihal": "string (opsional)",
  "detail": { "field": "value" }
}
```

---

#### DELETE /api/umum/surat/{id} [AUTH REQUIRED]

Hapus surat. Hanya bisa saat status `menunggu` dan hanya oleh pemohon yang bersangkutan.

---

### 8.4 Alur Approval

Semua endpoint memerlukan autentikasi. Format: `POST /api/umum/surat/{id}/{aksi}`

#### POST /api/umum/surat/{id}/proses [AUTH REQUIRED]

- **Role:** sekretariat
- **Transisi:** menunggu/dikembalikan -> diproses
- **Body:** multipart/form-data (catatan: opsional, file: opsional pdf/doc/docx max 20MB)

---

#### POST /api/umum/surat/{id}/verifikasi [AUTH REQUIRED]

- **Role:** kabag_tu
- **Transisi:** diproses -> diverifikasi
- **Body:** `{ "catatan": "string (opsional)" }`

---

#### POST /api/umum/surat/{id}/kembalikan [AUTH REQUIRED]

- **Role:** kabag_tu atau sekretariat
- **Transisi:** diproses -> dikembalikan | diverifikasi -> diproses
- **Body:** `{ "catatan": "string (WAJIB — alasan pengembalian)" }`

---

#### POST /api/umum/surat/{id}/paraf [AUTH REQUIRED]

- **Role:** wakil_dekan
- **Transisi:** diverifikasi -> ditandatangani
- **Body:** multipart/form-data (catatan: opsional, file: opsional — surat dengan paraf)

---

#### POST /api/umum/surat/{id}/tandatangan [AUTH REQUIRED]

- **Role:** wakil_dekan
- **Transisi:** diverifikasi/ditandatangani -> ditandatangani
- **Body:** multipart/form-data (catatan: opsional, file: opsional — surat TTD final)

---

#### POST /api/umum/surat/{id}/arsipkan [AUTH REQUIRED]

- **Role:** sekretariat
- **Transisi:** ditandatangani -> diarsipkan
- **Body:**
```json
{
  "nomor_arsip": "string (opsional)",
  "lokasi_fisik": "string (opsional)",
  "hasil_arsip": "string (opsional)"
}
```

---

### 8.5 Dokumen Surat

| Endpoint | Method | Deskripsi |
|---|---|---|
| `/api/umum/surat/{id}/dokumen` | GET | Daftar dokumen terkait surat |
| `/api/umum/surat/{id}/dokumen` | POST | Upload dokumen (multipart/form-data) |
| `/api/umum/dokumen/{id}/file` | GET | Download/preview file dokumen |

**Upload dokumen Body (multipart/form-data):**
- `file` — file (pdf/doc/docx, max 20MB) — wajib
- `tipe_dokumen` — lampiran_pendukung / draft / draft_revisi / surat_paraf / surat_ttd — wajib

---

### 8.6 Notifikasi

| Endpoint | Method | Deskripsi |
|---|---|---|
| `/api/umum/notifikasi` | GET | Daftar notifikasi milik user yang login |
| `/api/umum/notifikasi/{nid}/read` | PATCH | Tandai satu notifikasi sebagai dibaca |
| `/api/umum/notifikasi/read-all` | POST | Tandai semua notifikasi sebagai dibaca |

---

### 8.7 Arsip Surat

| Endpoint | Method | Deskripsi |
|---|---|---|
| `/api/umum/arsip` | GET | Daftar semua surat yang sudah diarsipkan |

---

### 8.8 Buku Agenda Surat

| Endpoint | Method | Deskripsi |
|---|---|---|
| `/api/umum/buku-agenda` | GET | Daftar buku agenda (paginated) |
| `/api/umum/buku-agenda` | POST | Tambah entri buku agenda baru |
| `/api/umum/buku-agenda/{id}` | GET | Detail entri |
| `/api/umum/buku-agenda/{id}` | PUT/PATCH | Update entri |
| `/api/umum/buku-agenda/{id}` | DELETE | Hapus entri |
| `/api/umum/buku-agenda-dropdown` | GET | Daftar surat untuk dropdown |

---

### 8.9 Nomor Surat

| Endpoint | Method | Deskripsi |
|---|---|---|
| `/api/nomor-surat` | GET | Daftar nomor surat |
| `/api/nomor-surat` | POST | Buat nomor surat baru (auto-generate) |
| `/api/nomor-surat/{id}` | GET | Detail nomor surat |
| `/api/nomor-surat/{id}` | PUT | Update |
| `/api/nomor-surat/{id}` | DELETE | Hapus |

---

## 9. Alur Autentikasi

### 9.1 Login Flow

```
Klien              Next.js API Route           Laravel API
  |                      |                          |
  |-- POST /api/login -->|                          |
  |   {email, password}  |-- POST /api/login ------>|
  |                      |                          | Validasi credential
  |                      |<------ response ----------|
  |                      | Set cookies httpOnly:    |
  |                      |  - token (Bearer token)  |
  |                      |  - role                  |
  |<-- Redirect dashboard|                          |
```

### 9.2 Token Sanctum

Token adalah Personal Access Token (bukan JWT). Format: `{id}|{random_string}`

Setiap request API harus menyertakan:
```
Authorization: Bearer 1|AbCdEfGhIjKl...
```

### 9.3 Cookie Storage (Frontend)

Frontend menyimpan token di cookie httpOnly:
- `token` — Laravel Sanctum Bearer Token
- `role` — Role user untuk routing guard

---

## 10. State Machine — Alur Approval Surat

```
[menunggu] --(sekretariat: proses)--> [diproses]
[diproses] --(kabag_tu: verifikasi)--> [diverifikasi]
[diproses] --(kabag_tu: kembalikan)--> [dikembalikan]
[dikembalikan] --(sekretariat: proses)--> [diproses]
[diverifikasi] --(wakil_dekan: paraf)--> [ditandatangani]
[diverifikasi] --(wakil_dekan: tandatangan)--> [ditandatangani]
[ditandatangani] --(sekretariat: arsipkan)--> [diarsipkan]
```

### Tabel Transisi Lengkap

| Dari Status | Aksi | Ke Status | Siapa |
|---|---|---|---|
| menunggu | proses | diproses | sekretariat |
| diproses | verifikasi | diverifikasi | kabag_tu |
| diproses | kembalikan | dikembalikan | kabag_tu / sekretariat |
| dikembalikan | proses | diproses | sekretariat |
| diverifikasi | paraf | ditandatangani | wakil_dekan |
| diverifikasi | tandatangan | ditandatangani | wakil_dekan |
| ditandatangani | arsipkan | diarsipkan | sekretariat |

---

## 11. Sistem Notifikasi

### 11.1 Notifikasi In-App

Setiap transisi status surat otomatis membuat record di tabel `notifikasi_surats`.

### 11.2 Notifikasi Email

Email dikirim menggunakan class `SuratStatusNotification` yang implements `ShouldQueue`. Diproses secara asinkron melalui database queue.

### 11.3 Penerima Notifikasi per Aksi

| Aksi | Penerima Notifikasi |
|---|---|
| Buat surat | Pemohon + semua Sekretariat |
| Proses (sekretariat) | Pemohon |
| Verifikasi (kabag_tu) | Sekretariat + Wakil Dekan |
| Kembalikan | Sekretariat |
| Paraf/Tandatangan | Sekretariat |
| Arsipkan | Pemohon |

---

## 12. Sistem Nomor Surat

### 12.1 Format Nomor

```
{nomor_urut}/IT3/{kode_klasifikasi}/P/B/{tahun}
```

Contoh: `1046/IT3/TM.00.00/P/B/2026`

### 12.2 Auto-Generate Logic

Pada event `creating`, model `NomorSurat` secara otomatis:
1. Mencari nomor_urut terakhir untuk kode_surat + tahun yang sama
2. Increment nomor_urut
3. Format nomor_surat dengan `sprintf`

Nomor urut direset per tahun dan per kode klasifikasi.

### 12.3 Kode Klasifikasi Primer

| Kode | Deskripsi |
|---|---|
| `KP` | Kepegawaian |
| `TU` | Ketatausahaan |
| `RT` | Kerumahtanggaan |
| `PL` | Perlengkapan |
| `TI` | Teknologi Informasi |

---

## 13. Manajemen File & Dokumen

### 13.1 Lokasi Penyimpanan

File disimpan di: `storage/app/public/dokumen-surat/{surat_id}/`

### 13.2 Konvensi Penamaan File

Format: `{JenisSingkat}_{NomorUrut}_{DDMMYY}_{NamaPemohon}_{tipe}_v{versi}.{ext}`

Contoh: `ST_001_040826_BudiSantoso_draft_v1.pdf`

**Singkatan Jenis Surat:**

| Jenis Surat | Singkatan |
|---|---|
| undangan | UND |
| surat_tugas | ST |
| surat_pengantar | SP |
| surat_keterangan | SKet |
| surat_keputusan | SK |
| lainnya | LN |

### 13.3 Batas Ukuran File

- File surat (draft, paraf, TTD): **max 20MB** (pdf/doc/docx)
- Lampiran pengajuan: **max 10MB** (pdf/doc/docx)
- File daftar penerima: **max 10MB** (pdf/doc/docx/xls/xlsx)

---

## 14. Frontend — Routing & Middleware

### 14.1 Struktur Route

| Route | Halaman | Akses |
|---|---|---|
| `/login` | Halaman login | Publik |
| `/register` | Halaman registrasi | Publik |
| `/umum/dashboard` | Dashboard utama | Semua role (authenticated) |
| `/umum/buat-surat` | Form buat surat | Pemohon |
| `/umum/riwayat` | Riwayat surat | Semua role |
| `/umum/notifikasi` | Daftar notifikasi | Semua role |
| `/umum/buku-register` | Buku agenda surat | Sekretariat |
| `/umum/users` | Manajemen user | Superadmin |

### 14.2 Middleware Guard (middleware.ts)

```typescript
// Role yang diizinkan masuk ke /umum/*
const validRoles = ['superadmin', 'pemohon', 'sekretariat', 'kabag_tu', 'wakil_dekan'];

// Logika:
// 1. Jika tidak ada token => redirect /login
// 2. Jika role tidak valid => redirect /login
// 3. Jika OK => lanjut
```

---

## 15. Role & Permission

### 15.1 Daftar Role

| Role | Kemampuan Utama |
|---|---|
| `superadmin` | Full access, CRUD user |
| `pemohon` | Buat surat, lihat status surat sendiri |
| `sekretariat` | Proses surat, upload draft, arsipkan |
| `kabag_tu` | Verifikasi atau kembalikan draft |
| `wakil_dekan` | Paraf dan tanda tangan surat |

### 15.2 Implementasi

```php
// Assign role ke user
$user->assignRole('pemohon');

// Cek role di controller
if ($user->role === 'sekretariat') { ... }

// Proteksi route berdasarkan role
Route::middleware('role:superadmin')->group(function () { ... });
```

### 15.3 Akun Demo (Seeder)

| Role | Username | Password |
|---|---|---|
| Super Admin | admin01 | password |
| Pemohon | pemohon01 | password |
| Sekretariat | sekretariat01 | password |
| Kabag TU | kabagtu01 | password |
| Wakil Dekan | wadek01 | password |

> PERINGATAN: Ganti semua password default sebelum production!

---

## 16. Queue Worker & Email

### 16.1 Development

```bash
cd backend-api
php artisan queue:work --sleep=3 --tries=1
```

### 16.2 Supervisor (Production)

File `/etc/supervisor/conf.d/ssmi-queue.conf`:

```ini
[program:ssmi-queue]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/ssmi-sip/backend-api/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/var/log/supervisor/ssmi-queue.log
```

```bash
sudo supervisorctl reread && sudo supervisorctl update
sudo supervisorctl start ssmi-queue:*
```

### 16.3 Monitoring

```bash
php artisan queue:failed       # Lihat failed jobs
php artisan queue:retry all    # Retry semua failed jobs
```

---

## 17. Panduan Setup Lokal (Development)

### 17.1 Backend

```bash
cd backend-api
composer install
cp .env.example .env
# Edit: DB_*, MAIL_*, FRONTEND_URL
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan storage:link
php artisan serve
```

### 17.2 Frontend

```bash
cd frontend-app
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env
npm run dev
```

### 17.3 Queue Worker

```bash
# Terminal terpisah
cd backend-api
php artisan queue:work --sleep=3 --tries=1
```

### 17.4 Shortcut (semua dalam satu)

```bash
cd backend-api
composer dev
# Menjalankan: artisan serve + queue:listen + pail + npm run dev (concurrently)
```

---

## 18. Panduan Deployment Production

### 18.1 Checklist

- [ ] PHP 8.2, MySQL, Nginx, Node.js sudah terinstall
- [ ] `composer install --no-dev --optimize-autoloader`
- [ ] `.env` backend sudah dikonfigurasi (APP_URL, DB, MAIL, FRONTEND_URL)
- [ ] `php artisan key:generate`
- [ ] `php artisan migrate --force`
- [ ] `php artisan storage:link`
- [ ] `php artisan config:cache && php artisan route:cache && php artisan view:cache`
- [ ] Permission storage benar (`www-data:www-data`, `775`)
- [ ] `.env` frontend dikonfigurasi (`NEXT_PUBLIC_API_URL`)
- [ ] `npm ci && npm run build`
- [ ] Nginx dikonfigurasi untuk backend & frontend
- [ ] SSL/HTTPS aktif via Certbot
- [ ] Queue worker via Supervisor
- [ ] Frontend berjalan via PM2
- [ ] `APP_DEBUG=false`
- [ ] Password default diganti

### 18.2 Nginx Backend

```nginx
server {
    listen 443 ssl;
    server_name api.your-domain.com;
    root /var/www/ssmi-sip/backend-api/public;
    client_max_body_size 20M;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### 18.3 Nginx Frontend (Next.js)

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
```

### 18.4 PM2 (Frontend)

```bash
npm install -g pm2
cd frontend-app && pm2 start npm --name "ssmi-frontend" -- start
pm2 save && pm2 startup
```

---

## 19. Troubleshooting

### 19.1 500 Internal Server Error

```bash
tail -50 storage/logs/laravel.log
php artisan config:clear && php artisan cache:clear
php artisan config:cache && php artisan route:cache
```

### 19.2 Email Tidak Terkirim

```bash
sudo supervisorctl status ssmi-queue:*
php artisan queue:failed
php artisan queue:retry all
```

### 19.3 CORS Error

1. Pastikan `FRONTEND_URL` di `.env` backend sudah benar (termasuk `https://`, tanpa trailing slash)
2. Jalankan: `php artisan config:cache`

### 19.4 Frontend Tidak Bisa Konek Backend

1. Pastikan `NEXT_PUBLIC_API_URL` benar dan bisa diakses dari browser
2. Jika `.env` diubah, rebuild: `npm run build`
3. Cek firewall — port 80/443 harus terbuka

### 19.5 Permission Denied pada Storage

```bash
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### 19.6 Migration Gagal

```bash
php artisan tinker
>>> DB::connection()->getPdo();  # Test koneksi

# RESET TOTAL (hapus semua data!)
php artisan migrate:fresh --seed --force
```

---

## 20. Konvensi Kode

### 20.1 Backend (PHP/Laravel)

| Konvensi | Aturan |
|---|---|
| Nama class | PascalCase |
| Nama method/variable | camelCase |
| Nama database column | snake_case |
| Nama route | kebab-case |
| Controller | {Resource}Controller |
| Model | Singular (SuratUmum, bukan SuratUmums) |
| Response sukses | `{ "message": "...", "data": {...} }` |
| Response error | `{ "message": "..." }` |

### 20.2 Frontend (TypeScript/Next.js)

| Konvensi | Aturan |
|---|---|
| Nama component | PascalCase |
| Nama file component | PascalCase.tsx |
| Nama file page | page.tsx (App Router) |
| Nama hook | use{Name} |
| Nama route handler | route.ts |

### 20.3 HTTP Status Codes

| Code | Makna | Kapan |
|---|---|---|
| 200 | OK | Request berhasil |
| 201 | Created | Resource berhasil dibuat |
| 401 | Unauthorized | Token tidak valid / tidak ada |
| 403 | Forbidden | Tidak punya izin |
| 404 | Not Found | Resource tidak ditemukan |
| 422 | Unprocessable Entity | Validasi gagal |
| 500 | Server Error | Error tak terduga di server |

---

*— Akhir Dokumentasi Teknis SSMI SIP v1.0 —*
