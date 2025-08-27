const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read current version
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const currentVersion = packageJson.version;

console.log(`Aktuálna verzia: ${currentVersion}`);

// Increment version (patch)
const versionParts = currentVersion.split('.');
versionParts[2] = parseInt(versionParts[2]) + 1;
const newVersion = versionParts.join('.');

console.log(`Nová verzia: ${newVersion}`);

// Update package.json
packageJson.version = newVersion;
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

// Build and publish
try {
    console.log('Build aplikácie...');
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log('Publikovanie na GitHub...');
    execSync('npm run publish', { stdio: 'inherit' });
    
    console.log(`✅ Verzia ${newVersion} bola úspešne publikovaná!`);
    console.log('Používatelia dostanú notifikáciu o novej verzii pri ďalšom spustení aplikácie.');
} catch (error) {
    console.error('❌ Chyba počas build/publish:', error);
    process.exit(1);
}
