# 🔥 Advanced Code Splitting Strategies

## Overview

Setelah implementasi basic code splitting, Anda bisa melakukan optimasi lebih lanjut untuk performa maksimal.

---

## 1️⃣ Route Grouping Strategy

### Problem:
Terlalu banyak chunk kecil membuat overhead HTTP requests.

### Solution:
Group routes yang sering diakses bersamaan dalam satu chunk.

### Example:

#### ❌ Bad (Terlalu Banyak Chunks):
```javascript
// accounting-journal.js
moduleId: () => import(/* webpackChunkName: "accounting-journal" */ ...)

// accounting-posting.js
moduleId: () => import(/* webpackChunkName: "accounting-posting" */ ...)

// accounting-ledger.js
moduleId: () => import(/* webpackChunkName: "accounting-ledger" */ ...)
```
Result: 3 small chunks (100KB each)

#### ✅ Good (Grouped):
```javascript
// All accounting routes
moduleId: () => import(/* webpackChunkName: "accounting" */ ...)
moduleId: () => import(/* webpackChunkName: "accounting" */ ...)
moduleId: () => import(/* webpackChunkName: "accounting" */ ...)
```
Result: 1 medium chunk (300KB) - Lebih efisien!

---

## 2️⃣ Prefetch Critical Routes

### Concept:
Prefetch = Download chunk di background SEBELUM user klik.

### When to Use:
- Routes yang kemungkinan besar akan diakses
- Dashboard atau landing page setelah login
- Menu yang sering dibuka

### Implementation:

```javascript
{
  route: "dashboard",
  name: "dashboard",
  moduleId: () => import(
    /* webpackChunkName: "dashboard" */
    /* webpackPrefetch: true */
    "./modules/dashboard/index"
  ),
  auth: true,
  title: "Dashboard"
}
```

**Browser behavior:**
```html
<link rel="prefetch" href="dashboard.abc123.js">
```

Browser akan download `dashboard.js` saat idle (low priority), sehingga ketika user klik menu Dashboard, file sudah ready!

### Best Practices:
- Prefetch 2-3 routes yang paling sering diakses
- Jangan prefetch terlalu banyak (waste bandwidth)
- Ideal untuk routes setelah login

---

## 3️⃣ Preload Important Chunks

### Concept:
Preload = Download chunk dengan HIGH PRIORITY, parallel dengan main bundle.

### When to Use:
- Components yang PASTI dibutuhkan di current page
- Critical modules untuk initial render

### Implementation:

```javascript
{
  route: "welcome",
  name: "welcome",
  moduleId: () => import(
    /* webpackChunkName: "welcome" */
    /* webpackPreload: true */
    "./modules/welcome/index"
  ),
  auth: true,
  title: "Welcome"
}
```

**Browser behavior:**
```html
<link rel="preload" href="welcome.abc123.js" as="script">
```

### ⚠️ Warning:
- Preload menambah initial load time
- Gunakan HANYA untuk critical resources
- Berbeda dengan prefetch (preload = high priority)

---

## 4️⃣ Webpack Magic Comments

### Available Options:

```javascript
import(
  /* webpackChunkName: "my-chunk" */      // Nama chunk
  /* webpackMode: "lazy" */               // Mode: lazy, lazy-once, eager, weak
  /* webpackPrefetch: true */             // Prefetch chunk
  /* webpackPreload: true */              // Preload chunk
  /* webpackExports: ["default"] */       // Export specific parts only
  "./my-module"
)
```

### Mode Options:

| Mode | Behavior | Use Case |
|------|----------|----------|
| `lazy` | Separate chunk per import | Default, paling sering dipakai |
| `lazy-once` | Single chunk untuk semua imports | Dynamic imports dalam loop |
| `eager` | No separate chunk | Combine dengan main bundle |
| `weak` | Assume module loaded | Advanced, jarang dipakai |

### Example - Export Specific Parts:

```javascript
// Hanya load fungsi 'calculate' dari module
const { calculate } = await import(
  /* webpackChunkName: "utils" */
  /* webpackExports: ["calculate"] */
  "./utils/math"
)
```

Benefit: Tree shaking lebih agresif, bundle lebih kecil.

---

## 5️⃣ Fine-tune splitChunks Config

### Current Config (Basic):

```javascript
splitChunks: {
  chunks: 'all',
  cacheGroups: {
    vendors: { ... },
    commons: { ... }
  }
}
```

### Advanced Config:

```javascript
splitChunks: {
  chunks: 'all',
  maxInitialRequests: 25,        // Max parallel downloads
  maxAsyncRequests: 25,          // Max async downloads
  minSize: 20000,                // Min chunk size (20KB)
  maxSize: 244000,               // Max chunk size (244KB)
  
  cacheGroups: {
    // Framework vendors (Aurelia, etc)
    framework: {
      test: /[\\/]node_modules[\\/](aurelia-.*|bluebird)[\\/]/,
      name: 'framework',
      priority: 30,
      enforce: true,
      reuseExistingChunk: true
    },
    
    // UI Libraries (Bootstrap, etc)
    ui: {
      test: /[\\/]node_modules[\\/](bootstrap|jquery)[\\/]/,
      name: 'ui-vendors',
      priority: 25,
      enforce: true
    },
    
    // Other vendors
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      name: 'vendors',
      priority: 20,
      enforce: true
    },
    
    // Common code (used by multiple modules)
    commons: {
      name: 'commons',
      minChunks: 3,              // Used by at least 3 modules
      priority: 10,
      reuseExistingChunk: true
    },
    
    // Module-specific commons
    accountingCommon: {
      test: /[\\/]modules[\\/]accounting[\\/]/,
      name: 'accounting-common',
      minChunks: 2,
      priority: 15,
      reuseExistingChunk: true
    }
  }
}
```

### Benefits:
- ✅ Framework terpisah dari vendor libraries
- ✅ UI libs terpisah (cache lebih baik)
- ✅ Common code extracted
- ✅ Module-specific commons

---

## 6️⃣ Dynamic Import Patterns

### Pattern 1: Conditional Loading

```javascript
// Load module based on user permission
async loadModule(permission) {
  if (permission === 'admin') {
    const { AdminModule } = await import('./admin-module');
    return new AdminModule();
  } else {
    const { UserModule } = await import('./user-module');
    return new UserModule();
  }
}
```

### Pattern 2: Component Level Splitting

```javascript
// In Aurelia view-model
export class MyPage {
  async attached() {
    // Lazy load heavy component only when needed
    const { HeavyChart } = await import('./components/heavy-chart');
    this.chart = new HeavyChart();
  }
}
```

### Pattern 3: Feature Flags

```javascript
// Load features based on environment
if (ENV === 'production') {
  await import('./analytics');
  await import('./error-tracking');
}

if (FEATURE_FLAGS.newDashboard) {
  await import('./new-dashboard');
} else {
  await import('./old-dashboard');
}
```

---

## 7️⃣ Bundle Analysis

### Install webpack-bundle-analyzer:

```powershell
npm install --save-dev webpack-bundle-analyzer
```

### Add to webpack config:

```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// In plugins section:
plugins: [
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: 'bundle-report.html',
    openAnalyzer: false
  })
]
```

### Generate report:

```powershell
npm run build:prod
```

Open `dist/bundle-report.html` untuk visualisasi interaktif bundle sizes.

### What to Look For:
- 📦 Large modules (candidates for splitting)
- 📊 Duplicate dependencies
- 🔍 Unused code (tree shaking opportunities)

---

## 8️⃣ Performance Monitoring

### Metrics to Track:

```javascript
// In main.js atau app.js
if (window.performance) {
  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const connectTime = perfData.responseEnd - perfData.requestStart;
    const renderTime = perfData.domComplete - perfData.domLoading;
    
    console.log('Page Load Time:', pageLoadTime + 'ms');
    console.log('Connect Time:', connectTime + 'ms');
    console.log('Render Time:', renderTime + 'ms');
    
    // Send to analytics
    // sendToAnalytics({ pageLoadTime, connectTime, renderTime });
  });
}
```

### Real User Monitoring:

```javascript
// Track chunk loading time
const chunkLoadStart = Date.now();

import('./my-chunk').then(() => {
  const loadTime = Date.now() - chunkLoadStart;
  console.log('Chunk loaded in:', loadTime + 'ms');
  
  // Track to analytics
  // analytics.track('chunk_loaded', { name: 'my-chunk', time: loadTime });
});
```

---

## 9️⃣ Caching Strategy

### Long-term Caching:

```javascript
// In webpack output config
output: {
  filename: '[name].[contenthash].js',
  chunkFilename: '[name].[contenthash].js'
}
```

**Benefits:**
- Hash berubah hanya jika content berubah
- Browser cache chunks yang tidak berubah
- Deployment lebih efisien

### Service Worker (PWA):

```javascript
// Cache chunks dengan Workbox
workbox.routing.registerRoute(
  /\.js$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'js-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);
```

---

## 🔟 Progressive Loading Pattern

### Concept:
Load essentials first, enhance progressively.

### Implementation:

```javascript
// 1. Load core UI immediately
import('./core-ui');

// 2. Prefetch likely-needed modules
setTimeout(() => {
  import(/* webpackPrefetch: true */ './dashboard');
  import(/* webpackPrefetch: true */ './user-profile');
}, 1000);

// 3. Load analytics and tracking (low priority)
setTimeout(() => {
  import('./analytics');
  import('./error-tracking');
}, 3000);

// 4. Load heavy features on idle
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    import('./heavy-features');
  });
}
```

---

## 📊 Performance Checklist

### Before Production:

- [ ] Bundle analysis completed
- [ ] Chunk sizes < 250KB (ideal)
- [ ] Initial bundle < 1MB
- [ ] Critical routes prefetched
- [ ] Caching headers configured
- [ ] Performance metrics tracked
- [ ] Tested on slow network (3G)
- [ ] Tested on mobile devices
- [ ] Error handling for chunk load failures

### Monitoring:

```javascript
// Handle chunk load failures
window.addEventListener('error', (e) => {
  if (e.message.includes('Loading chunk')) {
    console.error('Chunk loading failed:', e);
    
    // Retry or show user-friendly message
    alert('Network error. Please refresh the page.');
  }
});
```

---

## 🎯 Optimization Goals

| Metric | Target | Excellent |
|--------|--------|-----------|
| Initial Bundle | < 1 MB | < 500 KB |
| Time to Interactive | < 5s | < 3s |
| First Contentful Paint | < 2s | < 1s |
| Chunk Load Time | < 2s | < 1s |
| Number of Chunks | 10-20 | 5-15 |

---

## 💡 Key Takeaways

1. **Group related routes** - Avoid too many small chunks
2. **Prefetch smartly** - Only 2-3 most likely routes
3. **Monitor performance** - Track real user metrics
4. **Progressive enhancement** - Load essentials first
5. **Cache aggressively** - Use content hashing
6. **Analyze regularly** - Use bundle analyzer

---

**Remember:** Optimization is iterative. Start simple, measure, improve! 🚀
