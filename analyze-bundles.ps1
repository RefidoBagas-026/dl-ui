# Bundle Size Analyzer
# Jalankan setelah build untuk melihat ukuran bundle

Write-Host "📊 Analyzing Bundle Sizes..." -ForegroundColor Cyan
Write-Host ""

$distPath = "dist"

if (!(Test-Path $distPath)) {
    Write-Host "❌ Dist folder not found. Please run build first." -ForegroundColor Red
    Write-Host "   Run: npm run build:dev" -ForegroundColor Yellow
    exit
}

$jsFiles = Get-ChildItem "$distPath\*.js" -ErrorAction SilentlyContinue

if ($jsFiles.Count -eq 0) {
    Write-Host "❌ No JS files found in dist folder." -ForegroundColor Red
    exit
}

Write-Host "Bundle Files:" -ForegroundColor Green
Write-Host ("=" * 80) -ForegroundColor Gray

$totalSize = 0
$bundles = @()

foreach ($file in $jsFiles) {
    $sizeKB = [math]::Round($file.Length / 1KB, 2)
    $sizeMB = [math]::Round($file.Length / 1MB, 2)
    $totalSize += $file.Length
    
    $displaySize = if ($sizeMB -ge 1) { "$sizeMB MB" } else { "$sizeKB KB" }
    
    $bundles += [PSCustomObject]@{
        Name = $file.Name
        Size = $displaySize
        Bytes = $file.Length
        Type = if ($file.Name -match "^(app|aurelia|vendor|runtime)") { "Core" } 
               elseif ($file.Name -match "^\d+\.") { "Chunk" }
               else { "Module" }
    }
}

# Sort by size
$bundles | Sort-Object Bytes -Descending | Format-Table -AutoSize

Write-Host ("=" * 80) -ForegroundColor Gray

$totalMB = [math]::Round($totalSize / 1MB, 2)
Write-Host "Total Size: $totalMB MB" -ForegroundColor Cyan

# Statistics
$coreFiles = $bundles | Where-Object { $_.Type -eq "Core" }
$chunkFiles = $bundles | Where-Object { $_.Type -eq "Chunk" }
$moduleFiles = $bundles | Where-Object { $_.Type -eq "Module" }

Write-Host ""
Write-Host "📈 Statistics:" -ForegroundColor Green
Write-Host "  Core Bundles: $($coreFiles.Count) files" -ForegroundColor White
Write-Host "  Lazy Chunks: $($chunkFiles.Count) files" -ForegroundColor White
Write-Host "  Module Chunks: $($moduleFiles.Count) files" -ForegroundColor White

# Calculate initial load size (core bundles only)
$initialLoadSize = 0
foreach ($core in $coreFiles) {
    $initialLoadSize += $core.Bytes
}
$initialLoadMB = [math]::Round($initialLoadSize / 1MB, 2)

Write-Host ""
Write-Host "🚀 Initial Load Size: $initialLoadMB MB" -ForegroundColor Yellow
Write-Host "   (Files loaded on first page visit)" -ForegroundColor Gray

# Show recommendations
Write-Host ""
if ($initialLoadMB -gt 2) {
    Write-Host "⚠️  Initial load is large. Consider:" -ForegroundColor Yellow
    Write-Host "   - More aggressive code splitting" -ForegroundColor Gray
    Write-Host "   - Tree shaking optimization" -ForegroundColor Gray
    Write-Host "   - Removing unused dependencies" -ForegroundColor Gray
} else {
    Write-Host "✅ Initial load size looks good!" -ForegroundColor Green
}

Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Cyan
Write-Host "   - Run 'npm run build:prod' for optimized production build" -ForegroundColor Gray
Write-Host "   - Use webpack-bundle-analyzer for detailed analysis" -ForegroundColor Gray
Write-Host "   - Monitor bundle sizes over time" -ForegroundColor Gray
