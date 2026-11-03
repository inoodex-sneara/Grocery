const fs = require('fs');
const code = fs.readFileSync('src/data/productsData.ts', 'utf8');
const slugs = [...code.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1]);
console.log('Slugs:', slugs);

