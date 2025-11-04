/**
 * Utility Script untuk Konversi Routes ke Lazy Loading
 * 
 * Script ini akan mengkonversi semua routes dengan auth: true
 * dari eager loading ke lazy loading
 * 
 * Cara pakai:
 * 1. Backup dulu folder routes Anda
 * 2. Jalankan: node convert-routes-to-lazy.js
 */

const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'src', 'routes');

// Mapping module group untuk webpackChunkName
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
  'merchandiser': 'merchandiser',
  'sales': 'sales',
  'spinning': 'spinning',
  'weaving': 'weaving',
  'customs': 'customs',
  'expedition': 'expedition',
  'master': 'master',
  'general': 'general',
  'auth': 'auth',
  'report': 'report'
};

function convertRouteFile(fileName) {
  const filePath = path.join(routesDir, fileName);
  
  // Skip files yang sudah dikonversi atau files khusus
  if (fileName.includes('.lazy.') || 
      fileName === 'index.js' || 
      fileName === 'public.js') {
    console.log(`⏭️  Skipping ${fileName}`);
    return;
  }

  console.log(`🔄 Converting ${fileName}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Deteksi chunk name dari nama file
  const baseName = fileName.replace('.js', '');
  const chunkName = chunkNameMap[baseName] || baseName;
  
  // Convert moduleId dari string ke dynamic import
  // Pattern: moduleId: './modules/...'
  // Menjadi: moduleId: () => import(/* webpackChunkName: "chunkName" */ './modules/...')
  
  const regex = /moduleId:\s*['"](\.[^'"]+)['"]/g;
  
  content = content.replace(regex, (match, modulePath) => {
    // Hanya konversi jika bukan route public
    if (match.includes('./login') || 
        match.includes('./changepass') || 
        match.includes('./forbidden') ||
        match.includes('./samples')) {
      return match; // Keep as eager loading for public routes
    }
    
    return `moduleId: () => import(/* webpackChunkName: "${chunkName}" */ '${modulePath}')`;
  });
  
  // Backup original file
  const backupPath = filePath + '.backup';
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
    console.log(`   ✅ Backup created: ${fileName}.backup`);
  }
  
  // Write converted file
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`   ✅ Converted ${fileName}`);
}

// Main execution
console.log('🚀 Starting Route Conversion to Lazy Loading...\n');

const files = fs.readdirSync(routesDir);
const jsFiles = files.filter(f => f.endsWith('.js'));

jsFiles.forEach(convertRouteFile);

console.log('\n✨ Conversion completed!');
console.log('\n📝 Next steps:');
console.log('1. Review the converted files');
console.log('2. Run: npm run build:dev');
console.log('3. Check dist folder for new chunk files');
console.log('4. Test the application');
console.log('\n💡 Tip: Backup files are saved with .backup extension');
console.log('   If something goes wrong, you can restore from backup files');
