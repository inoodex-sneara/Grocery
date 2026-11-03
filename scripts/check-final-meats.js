const sharp = require('sharp');
const path = require('path');

const files = [
  'prod-chicken-drumsticks.webp',
  'prod-chicken-breast.webp',
  'prod-mutton-curry-cut.webp',
  'prod-farm-eggs.webp',
  'fresh-chicken-clean.webp',
  'tender-red-meat.webp'
];

async function check() {
  for (const f of files) {
    const img = sharp(path.join(__dirname, '../public/products', f));
    const meta = await img.metadata();
    const { data } = await img.raw().toBuffer({ resolveWithObject: true });
    console.log(f, `${meta.width}x${meta.height}`, `corner px: [${data[0]}, ${data[1]}, ${data[2]}]`);
  }
}

check();

