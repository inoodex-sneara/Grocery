const https = require('https');
const fs = require('fs');
const path = require('path');

const target = {
  name: 'mutton-curry-cut.jpg',
  url: 'https://www.bbassets.com/media/uploads/p/l/40329472_3-fresho-mutton-curry-cut-from-whole-carcass.jpg'
};

const dest = path.join(__dirname, '../public/products', target.name);
const file = fs.createWriteStream(dest);

https.get(target.url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  console.log(`Status: ${res.statusCode}`);
  if (res.statusCode === 200) {
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Saved ${target.name} (${fs.statSync(dest).size} bytes)`);
    });
  } else {
    file.close();
    fs.unlinkSync(dest);
    console.error('Failed with status:', res.statusCode);
  }
}).on('error', (err) => {
  console.error('Error:', err.message);
});

