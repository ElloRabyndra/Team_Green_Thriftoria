# Thriftoria - Backend

Ini adalah dokumentasi API untuk layanan backend **Thriftoria**, sebuah platform e-commerce yang berfokus pada *thrifting* (barang bekas). Aplikasi ini menangani manajemen pengguna, toko (shop), produk, keranjang (cart), dan pesanan (order).

Dibuat menggunakan **Golang** dengan framework **Fiber** dan **Gorm**.

## 🚀 Tech Stack

Server backend ini dibangun menggunakan ekosistem Go yang modern dan efisien.

| Teknologi | Tujuan |
| :--- | :--- |
| **Go (Golang)** | Bahasa pemrograman inti untuk membangun API. |
| **Fiber** | Framework web *expressive* dan cepat, terinspirasi dari Express.js. |
| **Gorm** | *Object-Relational Mapper* (ORM) untuk interaksi database yang mudah. |
| **Gorm (MySQL Driver)** | Driver spesifik untuk menghubungkan Gorm dengan database MySQL. |
| **JWT (golang-jwt)** | Implementasi JSON Web Tokens untuk autentikasi *stateless*. |
| **go-dotenv** | Memuat variabel lingkungan (environment variables) dari file `.env`. |
| **bcrypt (x/crypto)** | *Hashing* password yang aman untuk disimpan di database. |

## ✨ Fitur Inti & Peran Pengguna

Aplikasi ini mendukung tiga peran pengguna utama, masing-masing dengan kapabilitas yang diatur oleh API:

| Peran | Kapabilitas API |
| :--- | :--- |
| **Buyer** | Melihat produk, mencari/filter, menambah ke keranjang, checkout, melihat histori pesanan, dan mendaftar untuk menjadi *Seller*. |
| **Seller** | Mengelola profil toko, CRUD produk (Create, Read, Update, Delete), melihat penjualan, dan memperbarui status pengiriman pesanan. |
| **Admin** | Mengelola akun pengguna (Daftar Buyer), mengelola aplikasi toko (Setujui/Tolak Toko), dan mengelola toko yang sudah terdaftar. |

## 🛠️ Instalasi & Konfigurasi

Untuk menjalankan server backend ini secara lokal:

1.  **Kloning Repositori**
    Masuk ke folder `backend`:

    ```bash
    git clone https://github.com/ElloRabyndra/Team_Green_Thriftoria.git
    cd Team_Green_Thriftoria/backend
    ```

2.  **Instalasi Dependensi**
    Unduh semua *package* Go yang diperlukan:

    ```bash
    go mod tidy
    ```

3.  **Konfigurasi Environment**
    Salin file `.env.example` (jika ada) menjadi `.env`.

    ```bash
    cp .env.example .env
    ```

    Sesuaikan isi file `.env` dengan konfigurasi lokal Anda:

    ```.env
    # Konfigurasi Database
    DB_HOST=nama_host_anda
    DB_PORT=db_port_anda
    DB_USER=db_user_anda
    DB_PASSWORD=db_password_anda
    DB_NAME=nama_db_anda

    # Konfigurasi Server
    BASE_URL=http://127.0.0.1:3000

    # JWT
    JWT_SECRET=RAHASIA_ANDA_YANG_SANGAT_AMAN
    ```

4.  **Jalankan Aplikasi**

    ```bash
    go run main.go
    ```

    Server akan berjalan di `http://localhost:3000`.

## 🗺️ Referensi API Endpoints

**Base URL**: `http://localhost:3000/api/v1`

-----

### 1\. 🔐 Autentikasi (Authentication)

Endpoint untuk registrasi, login, dan logout.

| Endpoint | Metode | Otorisasi | Deskripsi |
| :--- | :--- | :--- | :--- |
| `/register` | `POST` | (Public) | Registrasi pengguna baru. |
| `/login` | `POST` | (Public) | Login dan mendapatkan cookie JWT. |
| `/logout` | `POST` | (Public) | Logout dan menghapus cookie JWT. |

#### Register

  * **Request Body**:
    ```json
    {
      "username": "steven",
      "email": "steven@gmail.com",
      "password": "123456"
    }
    ```
  * **Response (201 Created)**:
    ```json
    {
      "message": "Register success",
      "user": { ... }
    }
    ```

#### Login

  * **Request Body**:
    ```json
    {
      "email": "steven@gmail.com",
      "password": "123456"
    }
    ```
  * **Response (200 OK)**:
    ```json
    {
      "message": "Login success",
      "user": { ... }
    }
    ```

-----

### 2\. 👤 Pengguna (User)

Endpoint untuk mengelola data pengguna. Membutuhkan otentikasi JWT.

| Endpoint | Metode | Otorisasi | Deskripsi |
| :--- | :--- | :--- | :--- |
| `/user` | `GET` | Admin | Mendapatkan semua data pengguna. |
| `/user/profile` | `GET` | Buyer, Seller, Admin | Mendapatkan profil pengguna yang sedang login. |
| `/user/profile` | `PATCH` | Buyer, Seller, Admin | Memperbarui profil pengguna yang sedang login. |

#### Update Profile

  * **Request Body**: `multipart/form-data`
      * `username` (string, opsional)
      * `email` (string, opsional)
      * `address` (string, opsional)
      * `telephone` (string, opsional)
      * `password` (string, opsional - jika ingin ganti)
      * `profile_picture` (file, opsional - Maks 1MB, .png, .jpg, .jpeg)
  * **Response (200 OK)**:
    ```json
    {
      "data": { ... },
      "message": "Profile updated successfully",
      "status": "success"
    }
    ```

-----

### 3\. 🏪 Toko (Shop)

Endpoint untuk pendaftaran dan manajemen toko.

| Endpoint | Metode | Otorisasi | Deskripsi |
| :--- | :--- | :--- | :--- |
| `/shop` | `POST` | Buyer | Mendaftarkan toko baru (status `pending`). |
| `/shop/:id` | `GET` | Buyer, Seller, Admin | Mendapatkan detail toko berdasarkan ID. |
| `/shop/:id` | `PATCH` | Seller, Admin | Memperbarui detail toko. |
| `/shop/approve` | `GET` | Admin | Mendapatkan semua toko yang berstatus `approve`. |
| `/shop/pending` | `GET` | Admin | Mendapatkan semua toko yang berstatus `pending`. |
| `/shop/accept` | `PATCH` | Admin | Menerima (approve) atau menolak (reject) pendaftaran toko. |

#### Accept/Reject Request Shop

  * **Request Body**:
    ```json
    {
      "shop_id": 8,
      "status": true
    }
    ```
  * **Keterangan**: `status: true` untuk menerima, `status: false` untuk menolak.
  * **Response (200 OK)**:
    ```json
    {
      "data": { ... },
      "message": "Shop has been accepted and user role updated to seller",
      "status": "success"
    }
    ```

-----

### 4\. 🛍️ Produk (Product)

Endpoint untuk melihat dan mengelola produk.

| Endpoint | Metode | Otorisasi | Deskripsi |
| :--- | :--- | :--- | :--- |
| `/products` | `GET` | (Public) | Mendapatkan semua produk (bisa difilter). |
| `/products/category/:category` | `GET` | (Public) | Mendapatkan produk berdasarkan kategori (`Fashion` / `Others`). |
| `/products/search` | `GET` | (Public) | Mencari produk berdasarkan nama (`?q=kemeja`). |
| `/products/:id` | `GET` | (Public) | Mendapatkan detail produk berdasarkan ID. |
| `/products` | `POST` | Seller | Menambahkan produk baru ke toko. |
| `/products/:id` | `PATCH` | Seller | Memperbarui detail produk. |
| `/products/:id` | `DELETE` | Seller | Menghapus produk dari toko. |

#### Add Product

  * **Request Body**: `multipart/form-data`
      * `name` (string, required)
      * `category` (string, required - "Fashion" atau "Others")
      * `price` (number, required)
      * `stock` (number, required)
      * `image` (file, required - Maks 1MB)
      * `label` (string, opsional)
      * `description` (string, opsional)
  * **Response (201 Created)**:
    ```json
    {
      "status": "success",
      "message": "Product added successfully",
      "data": { ... }
    }
    ```

-----

### 5\. 🛒 Keranjang (Cart)

Endpoint untuk mengelola keranjang belanja pengguna. Membutuhkan otentikasi JWT.

| Endpoint | Metode | Otorisasi | Deskripsi |
| :--- | :--- | :--- | :--- |
| `/cart` | `GET` | Buyer | Melihat semua item di keranjang, dikelompokkan per toko. |
| `/cart` | `POST` | Buyer | Menambahkan produk ke keranjang. |
| `/cart/:cart_id` | `PATCH` | Buyer | Memperbarui kuantitas item di keranjang. |
| `/cart/:cart_id` | `DELETE` | Buyer | Menghapus item dari keranjang. |

#### Add to Cart

  * **Request Body**:
    ```json
    {
      "product_id": 3
    }
    ```
  * **Response (201 Created)**:
    ```json
    {
      "message": "Product added to cart"
    }
    ```

-----

### 6\. 📦 Pesanan (Order)

Endpoint untuk proses checkout dan manajemen pesanan. Membutuhkan otentikasi JWT.

| Endpoint | Metode | Otorisasi | Deskripsi |
| :--- | :--- | :--- | :--- |
| `/orders` | `POST` | Buyer | Membuat pesanan baru (checkout). |
| `/orders` | `GET` | Buyer | Mendapatkan daftar pesanan aktif (milik buyer). |
| `/orders/history` | `GET` | Buyer | Mendapatkan riwayat pesanan (selesai/batal). |
| `/orders/:id` | `GET` | Buyer, Seller | Mendapatkan detail spesifik pesanan. |
| `/orders/sales/:shopid` | `GET` | Seller | Mendapatkan daftar penjualan (pesanan masuk ke toko). |
| `/orders/:orderID/accept-payment` | `PATCH` | Seller | Menerima/Menolak bukti pembayaran dari buyer. |
| `/orders/:orderID/status` | `PATCH` | Seller | Memperbarui status pengiriman (`prepared`, `shipped`, `delivered`). |
| `/orders/:orderID/cancel` | `PATCH` | Buyer, Seller | Mengajukan pembatalan pesanan. |
| `/orders/:orderID/reject-cancel` | `PATCH` | Buyer, Seller | Menolak pengajuan pembatalan. |
| `/orders/:orderID/accept-cancel` | `PATCH` | Buyer, Seller | Menerima pengajuan pembatalan (order dibatalkan). |

#### Create Order

  * **Request Body**: `multipart/form-data`
      * `shop_id` (number, required)
      * `recipient` (string, required)
      * `telephone` (string, required)
      * `address` (string, required)
      * `proof_payment` (file, required - Maks 1MB)
      * `cart_ids[]` (array of numbers, required - misal: `cart_ids[]=1&cart_ids[]=2`)
      * `note` (string, opsional)
  * **Response (201 Created)**:
    ```json
    {
      "message": "Order created successfully",
      "order_id": 1
    }
    ```