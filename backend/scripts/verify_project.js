const fs = require('fs');
const path = require('path');

function fileExists(p) { return fs.existsSync(path.join(__dirname, '..', p)); }

console.log('LABEXPRESS-LIS verification script');

const checks = [
  { desc: 'backend/.env.example exists', ok: fileExists('backend/.env.example') },
  { desc: 'backend/database/schema.sql exists', ok: fileExists('backend/database/schema.sql') },
  { desc: 'backend/database/seed.sql exists (optional)', ok: fileExists('backend/database/seed.sql') },
  { desc: 'frontend exists', ok: fileExists('frontend') },
  { desc: 'android exists', ok: fileExists('android') }
];

checks.forEach(c => console.log((c.ok? '[OK]':'[NO]'), c.desc));

// scan for obvious secrets
const repoRoot = path.join(__dirname, '..');
const patterns = [/-----BEGIN PRIVATE KEY/, /FIREBASE_SERVICE_ACCOUNT_JSON/, /JWT_SECRET\s*=\s*['\"]?.+['\"]?/, /private_key\"/i];
let found = [];
function scanDir(dir) {
  const items = fs.readdirSync(dir);
  for (const it of items) {
    const full = path.join(dir, it);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (['node_modules','.git','uploads'].includes(it)) continue;
      scanDir(full);
    } else {
      try {
        const txt = fs.readFileSync(full, 'utf8');
        for (const p of patterns) if (p.test(txt)) found.push({ file: path.relative(repoRoot, full), pattern: p.toString() });
      } catch (e) { /* skip binary */ }
    }
  }
}

scanDir(repoRoot);
if (found.length) {
  console.log('\nPotential secrets found:');
  found.forEach(f => console.log(' -', f.file, f.pattern));
} else console.log('\nNo obvious secrets found (scan heuristics).');

console.log('\nFinished. Run build steps manually as needed.');
