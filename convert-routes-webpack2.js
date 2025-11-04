/**
 * Route Converter untuk Webpack 2
 * Menggunakan PLATFORM.moduleName dari Aurelia
 * 
 * Cara pakai:
 * node convert-routes-webpack2.js
 */

const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'src', 'routes');

// Mapping untuk chunk names
const chunkNameMap = {
  'accounting': 'accounting',
  'production': 'production',
  'purchasing': 'purchasing',
  'inventory': 'inventory',
  'garment-purchasing': 'garment-purchasing',
  'garment-production': 'garment-production',
  'garment-finance': 'garment-finance',
  'garment-master-plan': 'garment-master-plan',
  'garment-shipping': 'garment-shipping',
  'garment-subcon': 'garment-subcon',
  'garment-sample': 'garment-sample',
  'garment-receipt-subcon': 'garment-receipt-subcon',
  'merchandiser': 'merchandiser',
  'sales': 'sales',
  'spinning-production': 'spinning',
  'weaving': 'weaving',
  'customs': 'customs',
  'expedition': 'expedition',
  'master': 'master',
  'general': 'general',
  'auth': 'auth',
  'report': 'report',
  'int-purchasing': 'int-purchasing',
  'customs-report': 'customs-report',
  'packing-sku-inventory': 'packing-sku-inventory',
  'garment-dashboard': 'garment-dashboard',
  'migration-log': 'migration-log'
};

function convertRouteFile(fileName) {
  const filePath = path.join(routesDir, fileName);
  
  // Skip files
  if (fileName.includes('.lazy.') || 
      fileName.includes('.example.') ||
      fileName.includes('.backup') ||
      fileName === 'index.js' || 
      fileName === 'public.js') {
    console.log(`⏭️  Skipping ${fileName}`);
    return;
  }

  console.log(`🔄 Converting ${fileName} for Webpack 2...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Deteksi chunk name
  const baseName = fileName.replace('.js', '');
  const chunkName = chunkNameMap[baseName] || baseName;
  
  // Check if already converted
  if (content.includes('PLATFORM.moduleName')) {
    console.log(`   ⏭️  Already converted, skipping...`);
    return;
  }
  
  // Add PLATFORM import at top if not exists
  if (!content.includes("import { PLATFORM }") && !content.includes('PLATFORM')) {
    // Check if file uses ES6 imports or CommonJS
    if (content.trim().startsWith('module.exports')) {
      // CommonJS style - add require at top
      content = `const { PLATFORM } = require('aurelia-pal');\n\n` + content;
    } else {
      // ES6 style - add import at top
      content = `import { PLATFORM } from 'aurelia-pal';\n\n` + content;
    }
  }
  
  // Convert moduleId patterns
  // Pattern: moduleId: './modules/...' or moduleId: "./modules/..."
  const regex = /moduleId:\s*(['"])(\.[^'"]+)\1/g;
  
  let convertedCount = 0;
  content = content.replace(regex, (match, quote, modulePath) => {
    // Skip public routes
    if (modulePath.includes('./login') || 
        modulePath.includes('./changepass') || 
        modulePath.includes('./forbidden') ||
        modulePath.includes('./samples')) {
      return match; // Keep as is
    }
    
    convertedCount++;
    // Convert to PLATFORM.moduleName
    return `moduleId: PLATFORM.moduleName('${modulePath}', '${chunkName}')`;
  });
  
  if (convertedCount === 0) {
    console.log(`   ⚠️  No moduleId found to convert`);
    return;
  }
  
  // Create backup
  const backupPath = filePath + '.backup';
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
    console.log(`   💾 Backup created: ${fileName}.backup`);
  } else {
    console.log(`   💾 Backup already exists`);
  }
  
  // Write converted file
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`   ✅ Converted ${convertedCount} routes in ${fileName}`);
}

// Main execution
console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║  🚀 Route Converter for Webpack 2 (PLATFORM.moduleName)  ║');
console.log('╚════════════════════════════════════════════════════════════╝');
console.log('');

// Check if routes directory exists
if (!fs.existsSync(routesDir)) {
  console.log('❌ Routes directory not found:', routesDir);
  process.exit(1);
}

const files = fs.readdirSync(routesDir);
const jsFiles = files.filter(f => f.endsWith('.js'));

if (jsFiles.length === 0) {
  console.log('❌ No JavaScript files found in routes directory');
  process.exit(1);
}

console.log(`📁 Found ${jsFiles.length} route files\n`);

let convertedFiles = 0;
let skippedFiles = 0;

jsFiles.forEach(file => {
  try {
    convertRouteFile(file);
    convertedFiles++;
  } catch (error) {
    console.log(`   ❌ Error converting ${file}:`, error.message);
    skippedFiles++;
  }
  console.log('');
});

console.log('═'.repeat(60));
console.log('✨ Conversion completed!');
console.log('');
console.log('📊 Summary:');
console.log(`   ✅ Processed: ${convertedFiles} files`);
if (skippedFiles > 0) {
  console.log(`   ⏭️  Skipped: ${skippedFiles} files`);
}
console.log('');
console.log('📝 Next steps:');
console.log('   1. Review converted files');
console.log('   2. Run: npm run build:dev');
console.log('   3. Check dist folder for chunk files');
console.log('   4. Test in browser (Network tab)');
console.log('');
console.log('💡 Rollback if needed:');
console.log('   Get-ChildItem src\\routes\\*.backup | ForEach-Object {');
console.log('     $original = $_.FullName -replace \'.backup$\',\'\'');
console.log('     Copy-Item $_.FullName $original -Force');
console.log('   }');
console.log('');
console.log('📖 Documentation: WEBPACK2_CODE_SPLITTING.md');
console.log('═'.repeat(60));
