# Code Splitting Implementation Guide

## Penjelasan
Implementasi code splitting di aplikasi Aurelia ini akan memisahkan bundle menjadi:
- **Public bundle**: Login, forbidden, changepass (loading cepat)
- **Private modules**: Setiap modul dimuat secara lazy hanya ketika user mengaksesnya

## Perubahan yang Diperlukan

### 1. Update Webpack Configuration

Tambahkan optimization config di `webpack.config.babel.js` untuk code splitting otomatis.

### 2. Convert Routes ke Lazy Loading

Ubah `moduleId` menjadi fungsi yang mengembalikan dynamic import.

**Contoh Before (Eager Loading):**
```javascript
{
    route: "/accounting/journal-transaction",
    name: "journal-transaction",
    moduleId: "./modules/accounting/journal-transaction/index",
    auth: true,
    // ...
}
```

**After (Lazy Loading):**
```javascript
{
    route: "/accounting/journal-transaction",
    name: "journal-transaction",
    moduleId: () => import(/* webpackChunkName: "accounting" */ "./modules/accounting/journal-transaction/index"),
    auth: true,
    // ...
}
```

### 3. Grouping Strategy

Untuk optimasi lebih baik, group modules berdasarkan kategori:
- `webpackChunkName: "accounting"` - Semua accounting routes
- `webpackChunkName: "production"` - Semua production routes
- `webpackChunkName: "purchasing"` - Semua purchasing routes
- dst.

## Expected Results

Setelah implementasi:
1. **app.bundle.js** akan jauh lebih kecil (hanya core + public routes)
2. File chunk baru akan dibuat: `accounting.[hash].js`, `production.[hash].js`, dll
3. Chunk hanya di-download ketika user navigasi ke route tersebut
4. Loading time awal akan **jauh lebih cepat**

## Implementasi

Lihat file-file berikut untuk implementasi lengkap:
- `webpack.config.babel.js` - Konfigurasi webpack
- `src/routes/*.lazy.js` - Contoh routes dengan lazy loading
