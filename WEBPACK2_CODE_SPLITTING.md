# 🚀 Code Splitting untuk Webpack 2 - Panduan Lengkap

## ⚠️ Important: Webpack 2 Compatibility

Aplikasi Anda menggunakan **Webpack 2.1.0-beta.27**. Code splitting di Webpack 2 berbeda dengan Webpack 4+.

---

## ✅ Kabar Baik: Code Splitting TETAP BISA!

Meskipun Webpack 2 tidak mendukung `optimization.splitChunks`, kita tetap bisa melakukan code splitting dengan cara:

1. ✅ **Dynamic Imports** - Fully supported!
2. ✅ **CommonsChunkPlugin** - Built-in di Webpack 2
3. ✅ **Lazy Loading Routes** - Fully supported!

---

## 🎯 Implementasi Code Splitting di Webpack 2

### Metode 1: Dynamic Imports (RECOMMENDED)

Dynamic imports sudah di-support oleh Webpack 2 dan `aurelia-loader-webpack`.

#### Convert Routes ke Lazy Loading:

**Before:**
```javascript
{
    route: "/accounting/journal-transaction",
    name: "journal-transaction",
    moduleId: "./modules/accounting/journal-transaction/index",
    auth: true,
}
```

**After:**
```javascript
{
    route: "/accounting/journal-transaction",
    name: "journal-transaction",
    moduleId: () => import(/* webpackChunkName: "accounting" */ "./modules/accounting/journal-transaction/index").then(m => m),
    auth: true,
}
```

**ATAU menggunakan PLATFORM.moduleName (Aurelia specific):**

```javascript
import { PLATFORM } from 'aurelia-pal';

{
    route: "/accounting/journal-transaction",
    name: "journal-transaction",
    moduleId: PLATFORM.moduleName("./modules/accounting/journal-transaction/index", "accounting"),
    auth: true,
}
```

---

### Metode 2: Webpack 2 CommonsChunkPlugin

Plugin `commonChunksOptimize` dari `@easy-webpack/config-common-chunks-simple` sudah menggunakan CommonsChunkPlugin. Ini sudah baik untuk pemisahan vendor.

**Current config (sudah OK):**
```javascript
commonChunksOptimize({ appChunkName: 'app', firstChunk: 'aurelia-bootstrap' })
```

Ini sudah memisahkan:
- `aurelia-bootstrap.bundle.js` - Core Aurelia
- `aurelia.bundle.js` - Framework Aurelia
- `app.bundle.js` - Application code

---

## 📝 Cara Konversi Routes untuk Webpack 2

### Option A: PLATFORM.moduleName (Paling Stabil untuk Aurelia)

1. **Import PLATFORM di file routes:**

```javascript
import { PLATFORM } from 'aurelia-pal';

module.exports = [
  {
    route: "/accounting/journal-transaction",
    name: "journal-transaction",
    moduleId: PLATFORM.moduleName("./modules/accounting/journal-transaction/index", "accounting"),
    nav: true,
    title: "Jurnal Transaksi",
    auth: true,
    settings: {
      group: "accounting",
      permission: { N31: 1 },
      iconClass: "fa fa-clone",
    },
  },
  // ... other routes
];
```

**Note:** Parameter kedua `"accounting"` adalah chunk name.

### Option B: Dynamic Import (Modern Approach)

```javascript
module.exports = [
  {
    route: "/accounting/journal-transaction",
    name: "journal-transaction",
    moduleId: () => import(
      /* webpackChunkName: "accounting" */
      "./modules/accounting/journal-transaction/index"
    ).then(m => m),
    nav: true,
    title: "Jurnal Transaksi",
    auth: true,
    settings: {
      group: "accounting",
      permission: { N31: 1 },
      iconClass: "fa fa-clone",
    },
  },
];
```

---

## 🛠️ Updated Converter Script untuk Webpack 2

Script converter perlu diupdate untuk Webpack 2:

```javascript
// convert-routes-to-lazy-webpack2.js

const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'src', 'routes');

const chunkNameMap = {
  'accounting': 'accounting',
  'production': 'production',
  'purchasing': 'purchasing',
  'inventory': 'inventory',
  'garment-purchasing': 'garment-purchasing',
  'garment-production': 'garment-production',
  'garment-finance': 'garment-finance',
  'sales': 'sales',
  'master': 'master',
};

function convertRouteFile(fileName) {
  const filePath = path.join(routesDir, fileName);
  
  if (fileName.includes('.lazy.') || 
      fileName === 'index.js' || 
      fileName === 'public.js') {
    console.log(`⏭️  Skipping ${fileName}`);
    return;
  }

  console.log(`🔄 Converting ${fileName} for Webpack 2...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add import for PLATFORM at the top
  if (!content.includes("import { PLATFORM }")) {
    content = `import { PLATFORM } from 'aurelia-pal';\n\n` + content;
  }
  
  const baseName = fileName.replace('.js', '');
  const chunkName = chunkNameMap[baseName] || baseName;
  
  // Convert moduleId using PLATFORM.moduleName
  const regex = /moduleId:\s*['"](\.[^'"]+)['"]/g;
  
  content = content.replace(regex, (match, modulePath) => {
    // Skip public routes
    if (match.includes('./login') || 
        match.includes('./changepass') || 
        match.includes('./forbidden') ||
        match.includes('./samples')) {
      return match;
    }
    
    return `moduleId: PLATFORM.moduleName('${modulePath}', '${chunkName}')`;
  });
  
  // Backup
  const backupPath = filePath + '.backup';
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
    console.log(`   ✅ Backup: ${fileName}.backup`);
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`   ✅ Converted ${fileName}`);
}

// Main
console.log('🚀 Converting Routes for Webpack 2...\n');

const files = fs.readdirSync(routesDir);
const jsFiles = files.filter(f => f.endsWith('.js') && !f.includes('.backup'));

jsFiles.forEach(convertRouteFile);

console.log('\n✨ Conversion completed!');
console.log('\n📝 Next: npm run build:dev');
```

---

## 🔧 Troubleshooting Webpack 2

### Issue 1: "Cannot find module"

**Solution:** Pastikan menggunakan relative path yang benar.

```javascript
// ✅ Correct
moduleId: PLATFORM.moduleName('./modules/accounting/journal-transaction/index', 'accounting')

// ❌ Wrong
moduleId: PLATFORM.moduleName('modules/accounting/journal-transaction/index', 'accounting')
```

### Issue 2: Chunks tidak terbuat

**Webpack 2 behavior:**
- Chunks hanya dibuat saat dynamic import benar-benar digunakan
- Check di `dist/` folder untuk file seperti `0.bundle.js`, `1.bundle.js`, dll atau `accounting.bundle.js`

### Issue 3: Build error setelah konversi

**Solution:**
```powershell
# Clean dan rebuild
npm run clean:dist
npm run build:dev
```

---

## 📊 Expected Results dengan Webpack 2

### Bundle Structure:

```
dist/
├── app.bundle.js                    ~500KB (Core app)
├── aurelia-bootstrap.bundle.js      ~100KB (Bootstrap)
├── aurelia.bundle.js                ~500KB (Framework)
├── underscore.bundle.js             ~50KB  (Underscore)
├── accounting.bundle.js             ~400KB (Lazy - Accounting)
├── production.bundle.js             ~600KB (Lazy - Production)
├── purchasing.bundle.js             ~500KB (Lazy - Purchasing)
└── master.bundle.js                 ~200KB (Lazy - Master)
```

**ATAU dengan numeric names:**
```
dist/
├── app.bundle.js
├── aurelia-bootstrap.bundle.js
├── aurelia.bundle.js
├── 0.bundle.js   (accounting)
├── 1.bundle.js   (production)
├── 2.bundle.js   (purchasing)
└── 3.bundle.js   (master)
```

---

## 🎯 Testing Lazy Loading

### 1. Build aplikasi:
```powershell
npm run build:dev
```

### 2. Check dist folder:
```powershell
Get-ChildItem dist\*.bundle.js | Select-Object Name, @{Name="Size(KB)";Expression={[math]::Round($_.Length/1KB,2)}}
```

### 3. Run dev server:
```powershell
npm run server:dev
```

### 4. Test di Browser:
1. Open DevTools (F12) → Network tab
2. Clear network log
3. Refresh page
4. **Check:** Hanya `app.bundle.js`, `aurelia.bundle.js`, `aurelia-bootstrap.bundle.js` loaded
5. Navigate ke Accounting menu
6. **Check:** File baru (accounting.bundle.js atau 0.bundle.js) di-download
7. Navigate ke Production menu
8. **Check:** File baru (production.bundle.js atau 1.bundle.js) di-download

---

## ⚡ Performance Tips untuk Webpack 2

### 1. Group Related Routes

```javascript
// All accounting routes use same chunk name
moduleId: PLATFORM.moduleName('./modules/accounting/journal/index', 'accounting'),
moduleId: PLATFORM.moduleName('./modules/accounting/posting/index', 'accounting'),
moduleId: PLATFORM.moduleName('./modules/accounting/ledger/index', 'accounting'),
```

### 2. Keep Public Routes Eager

```javascript
// Login, forbidden, changepass - NO lazy loading
{
    route: 'login',
    name: 'login',
    moduleId: './login',  // Direct, no PLATFORM.moduleName
    nav: true,
    title: 'login'
}
```

### 3. Monitor Bundle Sizes

```powershell
# After build
Get-ChildItem dist\*.js | Measure-Object -Property Length -Sum | ForEach-Object { "Total: " + [math]::Round($_.Sum/1MB,2) + " MB" }
```

---

## 🔄 Upgrade Path (Optional)

Jika ingin fitur `optimization.splitChunks` yang lebih powerful, consider upgrade:

```json
{
  "devDependencies": {
    "webpack": "^4.46.0",
    "webpack-dev-server": "^3.11.3"
  }
}
```

**Tapi ini optional!** Webpack 2 dengan PLATFORM.moduleName sudah cukup untuk code splitting.

---

## ✅ Summary

### Untuk Webpack 2, gunakan:

1. ✅ **PLATFORM.moduleName()** untuk lazy loading
2. ✅ **CommonsChunkPlugin** (already configured via easy-webpack)
3. ✅ **webpackChunkName** comments di dynamic imports

### DON'T:
- ❌ Jangan gunakan `optimization.splitChunks` (Webpack 4+ only)
- ❌ Jangan gunakan `runtimeChunk` (Webpack 4+ only)

### Expected Results:
- 📦 Smaller initial bundle (~60-70% reduction)
- ⚡ Faster page load
- 🚀 Better user experience

---

**Ready to implement? Start with the updated converter script!** 🎉
