# Dokumentasi Sistem Persuratan 

| Versi | 1.0 |
| :---- | :---- |
| **Tanggal** | Mei 2026 |
| **Dibuat oleh** | Tim Pengembang |
| **Status** | Draft |

 

#  **Daftar Isi** {#daftar-isi}

[**Daftar Isi	1**](#daftar-isi)

[**BAB I	3**](#bab-i)

[1\. Pendahuluan	3](#1.-pendahuluan)

[1.1 Ruang Lingkup	3](#1.1-ruang-lingkup)

[1.2 Aktor Sistem	3](#1.2-aktor-sistem)

[**BAB II	3**](#bab-ii)

[2\. Alur Autentikasi	3](#2.-alur-autentikasi)

[2.1 Langkah-Langkah Login	4](#2.1-langkah-langkah-login)

[2.2 Struktur JWT Token	4](#2.2-struktur-jwt-token)

[2.3 Redirect Dashboard per Role	4](#2.3-redirect-dashboard-per-role)

[**BAB III	6**](#bab-iii)

[3\. Alur Utama Sistem Surat Keluar	6](#3.-alur-utama-sistem-surat-keluar)

[3.1 Bagan Alur Proses	6](#3.1-bagan-alur-proses)

[3.2 Status Surat (State Machine)	7](#3.2-status-surat-\(state-machine\))

[**BAB IV	8**](#bab-iv)

[4\. Alur Logout	8](#4.-alur-logout)

[**BAB V	9**](#bab-v)

[5\. Skema Database	9](#5.-skema-database)

[5.1 Tipe Data Enum	9](#5.1-tipe-data-enum)

[5.2 Tabel users	9](#5.2-tabel-users)

[5.3 Tabel surat\_keluar	9](#5.3-tabel-surat_keluar)

[5.4 Tabel approval\_log	10](#5.4-tabel-approval_log)

[5.5 Tabel dokumen	10](#5.5-tabel-dokumen)

[5.6 Tabel notifikasi	11](#5.6-tabel-notifikasi)

[5.7 Tabel arsip\_surat	11](#5.7-tabel-arsip_surat)

[**BAB VI	13**](#bab-vi)

[6\. Relasi Antar Tabel	13](#6.-relasi-antar-tabel)

[**BAB VII	14**](#bab-vii)

[7\. Catatan Implementasi	14](#7.-catatan-implementasi)

[7.1 Indeks yang Direkomendasikan	14](#7.1-indeks-yang-direkomendasikan)

[7.2 Rekomendasi Teknis	14](#7.2-rekomendasi-teknis)

# **BAB I** {#bab-i}

## **1\. Pendahuluan** {#1.-pendahuluan}

Dokumen ini menjelaskan alur sistem (system flow) dan skema basis data untuk aplikasi Inventaris Surat Keluar. Aplikasi ini mengelola proses pembuatan dan pengesahan surat keluar secara digital, mulai dari permohonan oleh pemohon hingga pengarsipan oleh sekretariat.

### **1.1 Ruang Lingkup** {#1.1-ruang-lingkup}

Sistem mencakup seluruh alur surat keluar di lingkungan dekanat, meliputi jenis surat: Undangan, Surat Tugas (Surtug), Surat Pengantar (Surpeng), Surat Keterangan (Surket), dan surat lainnya.

### **1.2 Aktor Sistem** {#1.2-aktor-sistem}

| Role | Nama Aktor | Kewenangan Utama |
| ----- | ----- | ----- |
| **pemohon** | Pemohon / Pegawai / Dosen | Membuat permohonan surat via portal |
| **sekretariat** | Sekretariat Dekanat | Menerima, membuat draft, mengarsipkan |
| **kabag\_tu** | Kepala Bagian TU | Memeriksa dan memverifikasi draft surat |
| **wakil\_dekan** | Wakil Dekan SKP/AKA | Verifikasi dan paraf surat |
| **dekan** | Dekan | Tanda tangan surat resmi |

 

# 

# 

# 

# 

# 

# **BAB II** {#bab-ii}

## **2\. Alur Autentikasi** {#2.-alur-autentikasi}

Sistem tidak menyediakan fitur registrasi mandiri. Akun pengguna dibuat oleh administrator. Setiap pengguna masuk melalui halaman login dan diarahkan ke dashboard sesuai role masing-masing.

### **2.1 Langkah-Langkah Login** {#2.1-langkah-langkah-login}

| No | Langkah | Keterangan |
| :---: | ----- | ----- |
| **1** | **Buka Aplikasi** | Pengguna membuka URL aplikasi di browser. |
| **2** | **Halaman Login** | Sistem menampilkan form input username dan password. |
| **3** | **Submit Credential** | Pengguna memasukkan username dan password, lalu klik tombol Masuk. |
| **4** | **Validasi Credential** | Server memverifikasi username dan password terhadap database. Jika tidak cocok, sistem menampilkan pesan error dan pengguna dapat mencoba kembali. |
| **5** | **Buat Session / Token** | Jika valid, server membuat JWT yang berisi user\_id, role, dan waktu kedaluwarsa (exp). |
| **6** | **Redirect ke Dashboard** | Sistem mengarahkan pengguna ke dashboard sesuai role: Pemohon, Staf/Sekretariat, atau Pejabat. |

 

### **2.2 Struktur JWT Token** {#2.2-struktur-jwt-token}

Token JWT yang dibuat saat login menyimpan informasi berikut:

{  
  "sub": "uuid-user-id",  
  "role": "sekretariat",  
  "nama": "Budi Santoso",  
  "exp": 1746432000  
}

Token disimpan di localStorage atau cookie httpOnly di sisi client. Setiap request ke API menyertakan token di header Authorization: Bearer \<token\>.

### **2.3 Redirect Dashboard per Role** {#2.3-redirect-dashboard-per-role}

| Role | Dashboard | Fitur Utama |
| ----- | ----- | ----- |
| **pemohon** | **Dashboard Pemohon** | Buat permohonan, pantau status surat, download surat selesai |
| **sekretariat / kabag\_tu** | **Dashboard Staf** | Terima permohonan, buat draft, upload file, kelola arsip |
| **wakil\_dekan / dekan** | **Dashboard Pejabat** | Daftar surat untuk diverifikasi, paraf, dan tanda tangan |

 

# **BAB III** {#bab-iii}

## **3\. Alur Utama Sistem Surat Keluar** {#3.-alur-utama-sistem-surat-keluar}

Setelah login berhasil, pengguna menggunakan sistem sesuai alur SOP pembuatan surat keluar. Alur ini melibatkan lima aktor yang bekerja secara berurutan dengan mekanisme persetujuan bertingkat.

### **3.1 Bagan Alur Proses** {#3.1-bagan-alur-proses}

Berikut adalah bagan alur (flowchart) lengkap proses surat keluar dari permohonan hingga pengarsipan. Panah merah menunjukkan jalur pengembalian draft untuk direvisi.

![][image1]

 

### **3.2 Status Surat (State Machine)** {#3.2-status-surat-(state-machine)}

Setiap surat keluar memiliki status yang berubah mengikuti alur persetujuan:

| Status | Keterangan | Dipicu Oleh |
| ----- | ----- | ----- |
| **menunggu** | Permohonan baru masuk dari portal | Sistem otomatis |
| **diproses** | Sekretariat sedang membuat/merevisi draft | Sekretariat |
| **dikembalikan** | Kabag TU mengembalikan draft untuk direvisi | Kabag TU |
| **diverifikasi** | Draft disetujui Kabag TU, diteruskan ke pejabat | Kabag TU |
| **ditandatangani** | Dekan telah menandatangani surat | Dekan |
| **diarsipkan** | Surat selesai dan tersimpan di arsip | Sekretariat |

 

# **BAB IV** {#bab-iv}

## **4\. Alur Logout** {#4.-alur-logout}

Logout berlaku untuk semua role. Proses ini memastikan session pengguna dihapus dengan benar di sisi client maupun server.

**•**  Langkah 1: Klik tombol logout dari navbar/sidebar

**•**  Langkah 2: Client menghapus token JWT dari localStorage/cookie

**•**  Langkah 3: Client mengirim request ke endpoint POST /api/auth/logout

**•**  Langkah 4: Server menginvalidate token (blacklist atau hapus refresh token)

**•**  Langkah 5: Server merespons 200 OK

**•**  Langkah 6: Client redirect ke halaman login

 

# **BAB V** {#bab-v}

## **5\. Skema Database** {#5.-skema-database}

Database dirancang menggunakan 6 tabel utama. Semua primary key menggunakan UUID untuk menghindari enumerasi.

### **5.1 Tipe Data Enum** {#5.1-tipe-data-enum}

Definisi enum yang digunakan di seluruh tabel:

CREATE TYPE user\_role AS ENUM ('pemohon', 'sekretariat', 'kabag\_tu', 'wakil\_dekan', 'dekan');

CREATE TYPE status\_surat AS ENUM ('menunggu', 'diproses', 'dikembalikan', 'diverifikasi', 'ditandatangani', 'diarsipkan');

CREATE TYPE jenis\_surat AS ENUM ('undangan', 'surat\_tugas', 'surat\_pengantar', 'surat\_keterangan', 'lainnya');

CREATE TYPE tipe\_dokumen AS ENUM ('draft', 'draft\_revisi', 'surat\_paraf', 'surat\_ttd');

CREATE TYPE aksi\_approval AS ENUM ('disetujui', 'dikembalikan', 'diparaf', 'ditandatangani');

 

### **5.2 Tabel users** {#5.2-tabel-users}

Menyimpan data semua pengguna sistem. Satu tabel untuk semua role. Akun dibuat oleh administrator, tidak ada registrasi mandiri.

Tabel: users

| Kolom | Tipe Data | Ket. | Deskripsi |
| ----- | ----- | ----- | :---- |
| **id** | UUID | **PK** | Primary key, auto-generated |
| **nama** | VARCHAR(150) |  | Nama lengkap pengguna |
| **email** | VARCHAR(150) | **UQ** | Email login, harus unik |
| **password\_hash** | TEXT |  | Hash bcrypt dari password |
| **role** | user\_role |  | Enum role pengguna |
| **unit\_kerja** | VARCHAR(100) |  | Nama unit/fakultas/prodi |
| **is\_active** | BOOLEAN |  | TRUE \= aktif, FALSE \= dinonaktifkan |
| **created\_at** | TIMESTAMP |  | Waktu akun dibuat |
| **updated\_at** | TIMESTAMP |  | Waktu terakhir diperbarui |

 

### **5.3 Tabel surat\_keluar** {#5.3-tabel-surat_keluar}

Tabel inti sistem. Setiap baris merepresentasikan satu permohonan surat. Kolom status mengikuti state machine dan revisi\_ke mencatat berapa kali surat dikembalikan.

Tabel: surat\_keluar

| Kolom | Tipe Data | Ket. | Deskripsi |
| ----- | ----- | ----- | :---- |
| **id** | UUID | **PK** | Primary key |
| **nomor\_surat** | VARCHAR(50) | **UQ** | Nomor surat resmi, diisi saat diarsipkan |
| **jenis\_surat** | jenis\_surat |  | Enum jenis surat |
| **perihal** | TEXT |  | Isi perihal surat |
| **status** | status\_surat |  | Status saat ini dalam alur |
| **revisi\_ke** | INTEGER |  | Counter pengembalian, default 0 |
| **pemohon\_id** | UUID | **FK** | Referensi ke users.id (pemohon) |
| **handler\_id** | UUID | **FK** | Referensi ke users.id (sekretariat) |
| **tgl\_permohonan** | TIMESTAMP |  | Waktu permohonan disubmit |
| **tgl\_selesai** | TIMESTAMP |  | Waktu surat selesai, nullable |
| **created\_at** | TIMESTAMP |  | Waktu record dibuat |
| **updated\_at** | TIMESTAMP |  | Waktu terakhir diperbarui |

 

### **5.4 Tabel approval\_log** {#5.4-tabel-approval_log}

Mencatat setiap aksi persetujuan/penolakan sebagai audit trail. Status surat tidak langsung di-update — selalu ada rekam jejaknya.

Tabel: approval\_log

| Kolom | Tipe Data | Ket. | Deskripsi |
| ----- | ----- | ----- | :---- |
| **id** | UUID | **PK** | Primary key |
| **surat\_id** | UUID | **FK** | Referensi ke surat\_keluar.id |
| **approver\_id** | UUID | **FK** | Referensi ke users.id (pejabat) |
| **aksi** | aksi\_approval |  | Enum aksi yang dilakukan |
| **catatan** | TEXT |  | Catatan revisi, wajib saat dikembalikan |
| **created\_at** | TIMESTAMP |  | Waktu aksi dilakukan |

 

### **5.5 Tabel dokumen** {#5.5-tabel-dokumen}

Menyimpan metadata semua file yang diunggah terkait surat. Kolom versi memungkinkan tracking revisi dari draft hingga surat final TTD.

Tabel: dokumen

| Kolom | Tipe Data | Ket. | Deskripsi |
| ----- | ----- | ----- | :---- |
| **id** | UUID | **PK** | Primary key |
| **surat\_id** | UUID | **FK** | Referensi ke surat\_keluar.id |
| **tipe\_dokumen** | tipe\_dokumen |  | Enum: draft, draft\_revisi, surat\_paraf, surat\_ttd |
| **nama\_file** | VARCHAR(255) |  | Nama file asli saat diupload |
| **path\_file** | TEXT |  | Path/URL di cloud storage |
| **versi** | INTEGER |  | Nomor versi file, mulai dari 1 |
| **uploaded\_by** | UUID | **FK** | Referensi ke users.id |
| **created\_at** | TIMESTAMP |  | Waktu file diupload |

 

### **5.6 Tabel notifikasi** {#5.6-tabel-notifikasi}

Menyimpan notifikasi in-app untuk setiap pengguna. Dapat dikembangkan ke email atau push notification.

Tabel: notifikasi

| Kolom | Tipe Data | Ket. | Deskripsi |
| ----- | ----- | ----- | :---- |
| **id** | UUID | **PK** | Primary key |
| **surat\_id** | UUID | **FK** | Referensi ke surat\_keluar.id |
| **user\_id** | UUID | **FK** | Referensi ke users.id (penerima) |
| **judul** | VARCHAR(200) |  | Judul singkat notifikasi |
| **pesan** | TEXT |  | Isi pesan notifikasi |
| **is\_read** | BOOLEAN |  | FALSE \= belum dibaca |
| **created\_at** | TIMESTAMP |  | Waktu notifikasi dibuat |

 

### **5.7 Tabel arsip\_surat** {#5.7-tabel-arsip_surat}

Relasi one-to-one dengan surat\_keluar. Dibuat saat surat selesai ditandatangani dan diarsipkan oleh sekretariat.

Tabel: arsip\_surat

| Kolom | Tipe Data | Ket. | Deskripsi |
| ----- | ----- | ----- | :---- |
| **id** | UUID | **PK** | Primary key |
| **surat\_id** | UUID | **FK/UQ** | Referensi ke surat\_keluar.id, UNIQUE |
| **nomor\_arsip** | VARCHAR(50) | **UQ** | Nomor arsip resmi institusi |
| **lokasi\_fisik** | VARCHAR(200) |  | Keterangan lokasi fisik penyimpanan |
| **path\_digital** | TEXT |  | Path/URL file surat final TTD |
| **dibuat\_oleh** | UUID | **FK** | Referensi ke users.id (sekretariat) |
| **created\_at** | TIMESTAMP |  | Waktu arsip dibuat |

 

## 

## 

## 

## 

## 

## 

## 

## 

## 

## 

## 

## 

## 

## 

## 

## 

# **BAB VI** {#bab-vi}

## **6\. Relasi Antar Tabel** {#6.-relasi-antar-tabel}

Berikut adalah ringkasan relasi antar tabel dalam database:

| Tabel Asal | Tabel Tujuan | Kardinalitas | Keterangan |
| ----- | ----- | :---: | ----- |
| **users** | **surat\_keluar** | **1 — N** | Satu pemohon dapat memiliki banyak permohonan surat |
| **users** | **surat\_keluar** | **1 — N** | Satu sekretariat dapat menangani banyak surat (handler\_id) |
| **surat\_keluar** | **approval\_log** | **1 — N** | Satu surat memiliki banyak rekam jejak persetujuan |
| **users** | **approval\_log** | **1 — N** | Satu pejabat dapat melakukan banyak aksi approval |
| **surat\_keluar** | **dokumen** | **1 — N** | Satu surat dapat memiliki banyak versi dokumen |
| **users** | **dokumen** | **1 — N** | Satu user dapat mengupload banyak dokumen |
| **surat\_keluar** | **notifikasi** | **1 — N** | Satu surat menghasilkan banyak notifikasi |
| **users** | **notifikasi** | **1 — N** | Satu user dapat menerima banyak notifikasi |
| **surat\_keluar** | **arsip\_surat** | **1 — 1** | Satu surat diarsipkan tepat satu kali (one-to-one) |
| **users** | **arsip\_surat** | **1 — N** | Satu sekretariat dapat mengarsipkan banyak surat |

 

## 

## 

## 

# **BAB VII** {#bab-vii}

## **7\. Catatan Implementasi** {#7.-catatan-implementasi}

### **7.1 Indeks yang Direkomendasikan** {#7.1-indeks-yang-direkomendasikan}

Tambahkan indeks berikut untuk performa query yang optimal:

CREATE INDEX idx\_surat\_pemohon  ON surat\_keluar(pemohon\_id);

CREATE INDEX idx\_surat\_status   ON surat\_keluar(status);

CREATE INDEX idx\_approval\_surat ON approval\_log(surat\_id);

CREATE INDEX idx\_dokumen\_surat  ON dokumen(surat\_id);

CREATE INDEX idx\_notif\_user     ON notifikasi(user\_id, is\_read);

### **7.2 Rekomendasi Teknis** {#7.2-rekomendasi-teknis}

**•**  Gunakan PostgreSQL untuk memanfaatkan tipe UUID native dan ENUM.

**•**  Aktifkan Row Level Security (RLS) agar tiap role hanya mengakses data yang relevan.

**•**  Simpan file dokumen di cloud storage (S3/GCS/MinIO) dan simpan path/URL-nya di kolom path\_file.

**•**  Gunakan migration tool seperti Flyway atau Liquibase untuk mengelola perubahan skema.

**•**  Implementasikan trigger PostgreSQL untuk otomatis mengisi updated\_at setiap kali record diperbarui.

 

*— Akhir Dokumen —*

[image1]: <data:image/png;base64,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>