# 🚀 Implementasi Code Splitting - Aurelia Application

## 📋 Overview

Code splitting telah dikonfigurasi untuk aplikasi Aurelia ini. Implementasi ini akan:

✅ Memisahkan bundle public (login) dan private (modul internal)
✅ Lazy load modul hanya ketika dibutuhkan
✅ Mengurangi ukuran initial bundle hingga 60-70%
✅ Mempercepat loading time halaman login

---

## 🎯 Hasil yang Diharapkan

### Before Code Splitting:
```
app.bundle.js          ~3-5 MB    (semua modul)
aurelia.bundle.js      ~500 KB
aurelia-bootstrap.js   ~100 KB
```

### After Code Splitting:
```
app.bundle.js          ~300-500 KB  (hanya core + public)
aurelia.bundle.js      ~500 KB
aurelia-bootstrap.js   ~100 KB
accounting.[hash].js   ~400 KB      (lazy loaded)
production.[hash].js   ~600 KB      (lazy loaded)
purchasing.[hash].js   ~500 KB      (lazy loaded)
... dan seterusnya
```

---

## 🔧 Langkah Implementasi

### Langkah 1: Update Webpack Config ✅

File `webpack.config.babel.js` sudah diupdate dengan konfigurasi code splitting.

Konfigurasi yang ditambahkan:
- `splitChunks` untuk memisahkan vendor dan common code
- `runtimeChunk` untuk optimasi cache
- `cacheGroups` untuk grouping chunks

### Langkah 2: Convert Routes ke Lazy Loading

**Pilihan A: Konversi Otomatis (RECOMMENDED)**

Jalankan script converter:

```powershell
node convert-routes-to-lazy.js
```

Script ini akan:
- Backup semua file routes (`.backup` extension)
- Konversi `moduleId` ke dynamic import
- Group routes berdasarkan module name
- Skip public routes (login, forbidden, etc)

**Pilihan B: Konversi Manual**

Edit setiap file di `src/routes/*.js` secara manual.

**Before:**
```javascript
{
    route: "/accounting/journal-transaction",
    name: "journal-transaction",
    moduleId: "./modules/accounting/journal-transaction/index",
    auth: true,
    // ...
}
```

**After:**
```javascript
{
    route: "/accounting/journal-transaction",
    name: "journal-transaction",
    moduleId: () => import(/* webpackChunkName: "accounting" */ "./modules/accounting/journal-transaction/index"),
    auth: true,
    // ...
}
```

#### webpackChunkName Mapping:

| File Routes | Chunk Name | Deskripsi |
|------------|------------|-----------|
| accounting.js | `accounting` | Semua modul accounting |
| production.js | `production` | Semua modul production |
| purchasing.js | `purchasing` | Semua modul purchasing |
| garment-*.js | `garment-[type]` | Modul garment per type |
| inventory.js | `inventory` | Modul inventory |
| sales.js | `sales` | Modul sales |
| ... | ... | ... |

### Langkah 3: Build dan Test

1. **Build Development:**
   ```powershell
   npm run build:dev
   ```

2. **Check Output:**
   Periksa folder `dist/` dan pastikan ada file chunks baru:
   ```
   dist/
   ├── app.bundle.js
   ├── aurelia.bundle.js
   ├── accounting.[hash].js      ← NEW!
   ├── production.[hash].js      ← NEW!
   ├── purchasing.[hash].js      ← NEW!
   └── ...
   ```

3. **Run Development Server:**
   ```powershell
   npm run server:dev
   ```

4. **Test di Browser:**
   - Buka DevTools (F12) → Network tab
   - Akses http://localhost:8080
   - Perhatikan hanya `app.bundle.js` dan vendor yang di-load
   - Login ke aplikasi
   - Navigate ke modul (misal: Accounting)
   - Perhatikan `accounting.[hash].js` baru di-download

---

## 📊 Monitoring & Verification

### Check Bundle Size:

```powershell
npm run build:prod
```

Kemudian check ukuran file di `dist/` folder:

```powershell
Get-ChildItem dist/*.js | Select-Object Name, @{Name="Size(KB)";Expression={[math]::Round($_.Length/1KB,2)}} | Sort-Object "Size(KB)" -Descending
```

### Network Analysis:

Di Chrome DevTools:
1. Buka Network tab
2. Filter by JS
3. Clear (trash icon)
4. Refresh page
5. Lihat file mana saja yang di-download

**Expected Initial Load:**
- app.bundle.js
- aurelia.bundle.js
- aurelia-bootstrap.js
- vendors.bundle.js (jika ada)
- runtime.bundle.js

**Expected After Navigation:**
- accounting.[hash].js (ketika buka accounting module)
- production.[hash].js (ketika buka production module)
- dll.

---

## 🐛 Troubleshooting

### Problem 1: Routes tidak load / blank page

**Solusi:**
- Check browser console untuk error
- Pastikan dynamic import syntax benar
- Verify webpack config tidak ada syntax error

### Problem 2: Chunk file tidak terbuat

**Solusi:**
- Clean build: `npm run clean:dist`
- Build ulang: `npm run build:dev`
- Check webpack config sudah benar

### Problem 3: Error "Cannot find module"

**Solusi:**
- Pastikan path moduleId benar (relative path)
- Check typo di webpackChunkName
- Verify file module masih ada

### Problem 4: Slow loading setelah code splitting

**Kemungkinan:**
- Chunk terlalu banyak (over-splitting)
- Network latency tinggi

**Solusi:**
- Group routes yang sering diakses bersamaan ke 1 chunk
- Implement prefetching untuk chunk yang sering diakses

---

## ⚡ Advanced Optimization

### 1. Prefetch Important Chunks

Tambahkan magic comment `webpackPrefetch`:

```javascript
moduleId: () => import(
  /* webpackChunkName: "accounting" */
  /* webpackPrefetch: true */
  "./modules/accounting/journal-transaction/index"
)
```

### 2. Preload Critical Chunks

```javascript
moduleId: () => import(
  /* webpackChunkName: "dashboard" */
  /* webpackPreload: true */
  "./modules/dashboard/index"
)
```

### 3. Fine-tune splitChunks

Edit `webpack.config.babel.js`:

```javascript
splitChunks: {
  chunks: 'all',
  maxInitialRequests: 25,
  minSize: 20000,
  cacheGroups: {
    // Custom groups...
  }
}
```

---

## 📈 Expected Performance Improvement

### Metrics:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Initial Bundle | 3-5 MB | 800 KB - 1 MB | ~70-80% |
| Time to Interactive | 8-12s | 3-5s | ~60% |
| First Contentful Paint | 2-3s | 1-2s | ~40% |

**Note:** Angka aktual tergantung pada:
- Ukuran module
- Network speed
- Device performance

---

## 🔄 Rollback Plan

Jika terjadi masalah, restore dari backup:

```powershell
# Restore single file
Copy-Item "src\routes\accounting.js.backup" "src\routes\accounting.js" -Force

# Restore all routes
Get-ChildItem "src\routes\*.backup" | ForEach-Object {
  $original = $_.FullName -replace '.backup$',''
  Copy-Item $_.FullName $original -Force
}
```

---

## 📚 References

- [Webpack Code Splitting](https://webpack.js.org/guides/code-splitting/)
- [Aurelia Lazy Loading](https://aurelia.io/docs/fundamentals/cheat-sheet#lazy-loading-routes)
- [Dynamic Imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports)

---

## ✅ Checklist

- [x] Webpack config updated dengan code splitting
- [x] Converter script dibuat
- [ ] Routes dikonversi ke lazy loading
- [ ] Build development berhasil
- [ ] Chunk files terbuat di dist/
- [ ] Testing di browser
- [ ] Build production berhasil
- [ ] Performance measurement
- [ ] Deploy ke environment

---

**Status:** Ready untuk implementasi ✅

**Created:** 2025-11-04
**Author:** Code Splitting Implementation Guide
