# WebGIS Yogyakarta - OpenLayers

Aplikasi WebGIS (Web Geographic Information System) berbasis OpenLayers untuk menampilkan dan mengelola data geografis wilayah Yogyakarta dengan berbagai fitur interaktif.

## Fitur Utama

### 🗺️ Peta Dasar
- **OpenStreetMap**: Peta standar dengan detail jalan dan bangunan
- **Satelit**: Citra satelit untuk visualisasi yang lebih detail

### 📍 Layer Data
- **Tempat Wisata**: Titik-titik lokasi wisata populer di Yogyakarta
  - Candi Borobudur, Prambanan, Sambisari
  - Keraton Yogyakarta
  - Jalan Malioboro
  - Pantai Parangtritis
  - Goa Jomblang
  - Dan lainnya

- **Jalan Utama**: Jaringan jalan utama
  - Jalan Provinsi (Yogya-Magelang, Yogya-Parangtritis)
  - Jalan Kota (Ring Road Utara & Selatan)
  - Informasi panjang, batas kecepatan, dan kondisi jalan

- **Kecamatan**: Batas administratif kecamatan
  - Data populasi, luas area, dan kepadatan penduduk
  - Gondokusuman, Kraton, Danurejan, Wirobrajan, Mergangsan, Bantul

### 🛠️ Tools Interaktif

#### Drawing Tools
- **Tambah Titik**: Menambahkan marker/titik custom
- **Tambah Garis**: Menggambar garis/rute custom
- **Tambah Polygon**: Menggambar area/wilayah custom

#### Measurement Tools
- **Ukur Jarak**: Mengukur jarak antara dua atau lebih titik
- **Ukur Area**: Mengukur luas area tertentu
- **Hapus Semua**: Membersihkan semua gambar dan pengukuran

### 🔍 Fitur Pencarian
- Pencarian berdasarkan nama tempat, tipe, atau deskripsi
- Hasil pencarian dengan zoom otomatis ke lokasi
- Panel informasi dengan detail hasil pencarian

### ℹ️ Informasi Interaktif
- **Popup Detail**: Klik pada fitur peta untuk melihat informasi lengkap
- **Koordinat Real-time**: Menampilkan koordinat mouse pointer
- **Panel Informasi**: Menampilkan detail fitur yang dipilih

## Struktur File

```
openlayers_gpt/
├── index.html          # File HTML utama
├── styles.css          # Stylesheet untuk tampilan UI
├── app.js             # JavaScript utama aplikasi
├── data.js            # Data geografis Yogyakarta
└── README.md          # Dokumentasi (file ini)
```

## Cara Menjalankan

1. **Download/Clone** semua file ke dalam satu folder
2. **Buka file `index.html`** di web browser modern (Chrome, Firefox, Edge)
3. **Aplikasi siap digunakan** tanpa instalasi tambahan

### Alternatif dengan Local Server

Untuk pengalaman yang lebih baik, gunakan local server:

```bash
# Dengan Python 3
python -m http.server 8000

# Dengan Node.js (http-server)
npx http-server

# Dengan PHP
php -S localhost:8000
```

Kemudian buka `http://localhost:8000` di browser.

## Data Sample

### Tempat Wisata (8 lokasi)
- **Candi**: Borobudur, Prambanan, Sambisari
- **Budaya**: Keraton Yogyakarta
- **Belanja**: Jalan Malioboro
- **Alam**: Pantai Parangtritis
- **Petualangan**: Goa Jomblang
- **Sejarah**: Tugu Yogyakarta

### Jalan Utama (4 rute)
- Jalan Yogya-Magelang (45.2 km)
- Jalan Yogya-Parangtritis (28.5 km)
- Ring Road Utara (35.8 km)
- Ring Road Selatan (32.1 km)

### Kecamatan (6 area)
- Gondokusuman (145,231 jiwa)
- Kraton (18,790 jiwa)
- Danurejan (19,481 jiwa)
- Wirobrajan (23,281 jiwa)
- Mergangsan (28,123 jiwa)
- Bantul (189,543 jiwa)

## Teknologi yang Digunakan

- **OpenLayers 8.2.0**: Library peta JavaScript
- **HTML5 & CSS3**: Struktur dan styling
- **Vanilla JavaScript**: Logika aplikasi
- **Font Awesome**: Icons
- **GeoJSON**: Format data geografis

## Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## Customization

### Menambah Data Baru

Edit file `data.js` untuk menambah atau mengubah data:

```javascript
// Menambah tempat wisata baru
const newTouristSpot = {
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [longitude, latitude]
    },
    "properties": {
        "name": "Nama Tempat",
        "type": "Tipe",
        "description": "Deskripsi",
        "category": "Kategori"
    }
};

touristSpots.features.push(newTouristSpot);
```

### Mengubah Styling

Edit file `styles.css` untuk mengubah tampilan:

```css
/* Contoh: Mengubah warna sidebar */
#sidebar {
    background: #your-color;
}
```

### Menambah Fitur Baru

Edit file `app.js` untuk menambah fungsi baru:

```javascript
// Contoh: Menambah tool baru
function newTool() {
    // Implementasi tool baru
}
```

## Lisensi

Proyek ini menggunakan data terbuka dan library open source:
- OpenLayers: BSD 2-Clause License
- OpenStreetMap: Open Database License
- Font Awesome: SIL OFL 1.1

## Kontribusi

Silakan fork repository ini dan buat pull request untuk kontribusi Anda.

## Kontak

Untuk pertanyaan atau saran, silakan buat issue di repository ini.

---

**Catatan**: Data geografis yang digunakan adalah data sample untuk tujuan demonstrasi. Untuk penggunaan production, gunakan data resmi dari sumber yang terpercaya.
