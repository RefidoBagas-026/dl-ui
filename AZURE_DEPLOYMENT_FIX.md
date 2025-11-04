# Azure Deployment Guide - Fix ERR_CONNECTION_RESET

## Problem yang Terjadi:
- ❌ `app.bundle.js` gagal load (net::ERR_CONNECTION_RESET)
- ❌ Bundle terlalu besar (113 MB)
- ❌ Azure timeout/connection reset

## ✅ Solusi yang Sudah Diterapkan:

### 1. Web.config untuk Azure
File `web.config` sudah dibuat dengan:
- ✅ Increased request limits (500MB)
- ✅ HTTP Compression enabled
- ✅ SPA routing rules
- ✅ Cache headers
- ✅ Gzip compression

### 2. Auto-copy web.config ke dist/
Package.json sudah diupdate:
- `postbuild:dev` - Copy web.config setelah dev build
- `postbuild:prod` - Copy web.config setelah prod build

### 3. Lazy Loading Implementation
Routes sudah dikonversi dengan PLATFORM.moduleName

---

## 🚀 Deployment Steps:

### Step 1: Build Production

```powershell
npm run build:prod
```

**Expected:** 
- Build time: ~2-5 menit
- web.config otomatis dicopy ke dist/
- Bundle sizes jauh lebih kecil dengan minification

### Step 2: Verify Bundle Sizes

```powershell
Get-ChildItem dist\*.js | Select-Object Name, @{Name="Size(MB)";Expression={[math]::Round($_.Length/1MB,2)}} | Sort-Object "Size(MB)" -Descending
```

**Target:**
- app.bundle.js < 2 MB (dengan uglify & minification)
- Lazy chunks: 100-500 KB each

### Step 3: Check web.config Exists

```powershell
Test-Path dist\web.config
```

Should return: `True`

### Step 4: Deploy to Azure

**Option A: Via Azure CLI**
```powershell
az webapp deployment source config-zip --resource-group <your-rg> --name <your-app-name> --src dist.zip
```

**Option B: Via Git Deploy**
```powershell
cd dist
git init
git add .
git commit -m "Production build with lazy loading"
git remote add azure <your-azure-git-url>
git push azure master
```

**Option C: Via FTP**
- Upload semua file dari `dist/` folder
- Pastikan `web.config` ikut terupload

---

## 🔧 Azure App Service Configuration

### Application Settings (via Portal):

1. **Go to Azure Portal** → Your App Service → Configuration

2. **General Settings:**
   ```
   Stack: Node
   Node Version: 18.x (atau sesuai package.json)
   Always On: On
   ARR Affinity: On
   ```

3. **Application Settings:**
   ```
   WEBSITE_NODE_DEFAULT_VERSION: 18.x
   SCM_COMMAND_IDLE_TIMEOUT: 3600
   WEBSITE_RUN_FROM_PACKAGE: 0
   ```

4. **Save & Restart**

---

## 🔍 Troubleshooting

### Issue 1: Still getting ERR_CONNECTION_RESET

**Check:**
```powershell
# Verify production bundle size
Get-ChildItem dist\app.bundle.js | Select-Object Name, @{Name="Size(MB)";Expression={[math]::Round($_.Length/1MB,2)}}
```

**If still > 10MB:**
- Lazy loading mungkin belum aktif
- Check routes sudah pakai PLATFORM.moduleName
- Verify webpack production mode

### Issue 2: 404 on chunk files

**Solution:**
Pastikan semua file chunks terupload:
```powershell
Get-ChildItem dist\*.bundle.js
```

### Issue 3: Blank page after deploy

**Check:**
1. Browser console untuk errors
2. Azure Logs: Deployment → Deployment Center → Logs
3. Verify index.html ada di dist/

---

## ✅ Expected Results After Fix:

### Initial Load:
```
✅ app.bundle.js          ~1-2 MB (minified)
✅ aurelia.bundle.js      ~500 KB
✅ aurelia-bootstrap.js   ~300 KB
✅ underscore.bundle.js   ~100 KB
```

### Lazy Loaded (on navigation):
```
✅ accounting.bundle.js   ~200-400 KB
✅ production.bundle.js   ~300-500 KB
✅ purchasing.bundle.js   ~200-400 KB
```

### Performance:
- ⚡ Initial load: 3-5 seconds (vs 30+ seconds)
- ⚡ Time to Interactive: < 5 seconds
- ✅ No connection reset errors

---

## 📊 Monitoring After Deploy

### Check in Browser DevTools (F12):

1. **Network Tab:**
   - Initial load hanya core bundles
   - Lazy chunks load on-demand
   - No 404 or connection errors

2. **Console Tab:**
   - No errors
   - Check for lazy module loading messages

3. **Performance Tab:**
   - First Contentful Paint < 2s
   - Time to Interactive < 5s

### Check in Azure Portal:

1. **Metrics:**
   - Response time < 3s
   - HTTP 2xx > 95%
   - HTTP 4xx/5xx minimal

2. **Logs:**
   - No connection timeout errors
   - No request size errors

---

## 🎯 Quick Fix Checklist:

- [ ] Build production: `npm run build:prod`
- [ ] Verify app.bundle.js < 5MB
- [ ] Verify web.config exists in dist/
- [ ] Deploy to Azure
- [ ] Update Azure App Settings
- [ ] Test in browser
- [ ] Check DevTools Network tab
- [ ] Verify lazy loading works

---

## 📝 Common Azure Issues:

### Issue: "Request Entity Too Large"
**Solution:** web.config sudah mengatur maxRequestLength & maxAllowedContentLength

### Issue: "Connection Timeout"
**Solution:** web.config sudah mengatur executionTimeout & idle timeout

### Issue: "502 Bad Gateway"
**Solution:** 
1. Check Azure logs
2. Restart App Service
3. Verify Node version compatible

---

## 💡 Performance Tips:

1. **Enable CDN** (optional):
   - Azure CDN untuk static assets
   - Faster global delivery

2. **Enable Application Insights**:
   - Monitor real user performance
   - Track errors

3. **Configure Autoscaling**:
   - Handle traffic spikes
   - Maintain performance

---

**Status:** Ready untuk deployment! 🚀

**Build Status:** Checking...

**Next:** Tunggu `npm run build:prod` selesai, lalu deploy!
