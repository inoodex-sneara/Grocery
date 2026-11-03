const https = require('https');
const fs = require('fs');
const path = require('path');

const targets = [
  {
    name: 'chicken-drumsticks.jpg',
    url: 'https://www.bbassets.com/media/uploads/p/l/10000904_8-fresho-chicken-drumstick-without-skin-antibiotic-residue-free-4-6-pcs.jpg',
  },
  {
    name: 'chicken-breast.jpg',
    url: 'https://www.bbassets.com/media/uploads/p/l/10001001_7-fresho-chicken-breast-boneless-antibiotic-residue-free.jpg',
  },
  {
    name: 'mutton-curry-cut.jpg',
    url: 'https://www.bbassets.com/media/uploads/p/l/20000961_7-fresho-mutton-curry-cut.jpg',
  },
  {
    name: 'farm-eggs.jpg',
    url: 'https://www.bbassets.com/media/uploads/p/l/1200056_2-fresho-farm-eggs-regular-medium-antibiotic-residue-free.jpg',
  }
];

function fetchUrl(target) {
  return new Promise((resolve, reject) => {
    const dest = path.join(__dirname, '../public/products', target.name);
    const file = fs.createWriteStream(dest);
    https.get(target.url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      console.log(`${target.name} HTTP status: ${res.statusCode}`);
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Saved ${target.name} (${fs.statSync(dest).size} bytes)`);
          resolve(true);
        });
      } else {
        file.close();
        fs.unlinkSync(dest);
        resolve(false);
      }
    }).on('error', (err) => {
      console.error(`Error ${target.name}:`, err.message);
      resolve(false);
    });
  });
}

(async () => {
  for (const t of targets) {
    await fetchUrl(t);
  }
})();

