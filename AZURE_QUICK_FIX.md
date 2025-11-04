# ⚡ QUICK FIX - Azure ERR_CONNECTION_RESET

## 🎯 Problem:
- ❌ `app.bundle.js` error net::ERR_CONNECTION_RESET
- ❌ Bundle size 113 MB (terlalu besar untuk Azure)
- ❌ Connection timeout

## ✅ Solution Summary:

### 1. Files Created/Updated:
- ✅ `web.config` - Azure IIS configuration
- ✅ `package.json` - Auto-copy web.config to dist
- ✅ `webpack.config.babel.js` - Disabled UglifyJS (compatibility issue)

### 2. Lazy Loading:
- ✅ All routes converted to `PLATFORM.moduleName`
- ✅ 900+ routes ready for lazy loading

### 3. Production Build:
- ⏳ Running: `npm run build:prod`
- ⏳ Expected: Smaller bundles without UglifyJS errors

---

## 🚀 Deployment Steps (After Build Complete):

### Step 1: Verify Build Success

```powershell
# Check if build completed
Get-ChildItem dist\*.js | Select-Object Name, @{Name="Size(MB)";Expression={[math]::Round($_.Length/1MB,2)}}
```

**Expected:**
```
app.bundle.js:                5-10 MB   (lebih kecil dari 113 MB!)
aurelia.bundle.js:            1-2 MB
aurelia-bootstrap.bundle.js:  300-500 KB
underscore.bundle.js:         60-100 KB
```

### Step 2: Verify web.config Copied

```powershell
Test-Path dist\web.config
```

Should return: **True**

### Step 3: Deploy to Azure

**Method A - Via Azure Portal:**
1. Go to Azure Portal → Your Web App
2. Deployment Center → FTP/Credentials
3. Upload all files from `dist/` folder

**Method B - Via Git:**
```powershell
cd dist
git init
git add .
git commit -m "Production build with lazy loading + web.config"
git remote add azure https://your-app.scm.azurewebsites.net:443/your-app.git
git push azure master --force
```

**Method C - Via VS Code:**
1. Install "Azure App Service" extension
2. Right-click dist folder → Deploy to Web App

---

## 🔧 Azure Configuration

### In Azure Portal:

1. **App Service → Configuration → General Settings:**
   ```
   Stack: Node.js
   Node Version: 18.x
   Always On: On
   ARR Affinity: On
   ```

2. **App Service → Configuration → Application Settings:**
   Add these:
   ```
   WEBSITE_NODE_DEFAULT_VERSION = 18.x
   SCM_COMMAND_IDLE_TIMEOUT = 3600
   WEBSITE_RUN_FROM_PACKAGE = 0
   ```

3. **Save** and **Restart** the app

---

## ✅ Expected Results:

### In Browser (after deploy):

1. **Open your Azure URL**
2. **F12 DevTools → Network tab**
3. **Refresh page**

**Initial Load (should see):**
```
✅ app.bundle.js          ~5-10 MB  (loaded successfully)
✅ aurelia.bundle.js      ~1-2 MB
✅ aurelia-bootstrap.js   ~300 KB
✅ underscore.bundle.js   ~60 KB
✅ styles.css             ~200 KB
```

**After Navigation (lazy loaded):**
```
✅ accounting.bundle.js   (loaded when you click Accounting menu)
✅ production.bundle.js   (loaded when you click Production menu)
✅ purchasing.bundle.js   (loaded when you click Purchasing menu)
```

### Performance:
- ⚡ Initial load: 5-10 seconds (better than 30+ seconds)
- ⚡ Page interactive: < 10 seconds
- ✅ No ERR_CONNECTION_RESET
- ✅ No 404 errors

---

## ⚠️ Important Notes:

### 1. Bundle Size Still Large?

Webpack 2 dengan UglifyJS disabled akan menghasilkan bundle lebih besar dari Webpack 4+, tapi masih lebih baik dari 113 MB.

**Options untuk reduce size lebih lanjut:**
- ✅ Lazy loading sudah aktif
- ⚙️ Consider upgrade ke Webpack 4+ (future improvement)
- 🗜️ Enable gzip compression di Azure (web.config sudah set)

### 2. web.config Benefits:

File `web.config` yang sudah dibuat akan:
- ✅ Enable HTTP compression (gzip)
- ✅ Increase request size limits
- ✅ Enable proper SPA routing
- ✅ Set cache headers

### 3. Lazy Loading Verification:

Di browser console, you should see:
- Modules loading on-demand
- Smaller initial payload
- Better performance

---

## 🔍 Troubleshooting:

### Still getting ERR_CONNECTION_RESET?

**Check 1 - Bundle size:**
```powershell
Get-Item dist\app.bundle.js | Select-Object @{Name="Size(MB)";Expression={[math]::Round($_.Length/1MB,2)}}
```

If > 50MB, ada masalah dengan lazy loading.

**Check 2 - web.config deployed:**
```powershell
# Via FTP/SSH, verify web.config exists in root
```

**Check 3 - Azure logs:**
```
Azure Portal → Your App → Monitoring → Log Stream
```

### Getting 404 on chunks?

**Solution:**
- Verify all `*.bundle.js` files uploaded
- Check Azure logs for file access issues
- Restart Azure App Service

---

## 📊 Monitoring After Deploy:

### Azure Metrics to Watch:
1. **Response Time:** Should be < 5 seconds
2. **HTTP 4xx:** Should be minimal
3. **HTTP 5xx:** Should be zero
4. **Data Out:** Monitor bandwidth usage

### Browser Performance:
1. **Network tab:** Check file sizes
2. **Performance tab:** Check loading times
3. **Console:** Check for errors

---

## 🎯 Success Criteria:

- [ ] Build prod completed without errors
- [ ] app.bundle.js < 50 MB
- [ ] web.config exists in dist/
- [ ] Deployed to Azure successfully
- [ ] App loads in browser
- [ ] No ERR_CONNECTION_RESET
- [ ] Lazy loading works (chunks load on navigation)
- [ ] Performance acceptable (< 10s initial load)

---

**Current Status:** ⏳ Waiting for production build to complete...

**Next:** After build, verify sizes and deploy!
