const sharp = require('sharp');
const path = require('path');

async function testEgg() {
  const input = path.join(__dirname, '../public/shop/Shop-4.webp');
  const output = path.join(__dirname, '../public/products/prod-farm-eggs.webp');
  await sharp(input)
    .resize(600, 600, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .webp({ quality: 90 })
    .toFile(output);
  console.log('Saved prod-farm-eggs.webp from Shop-4.webp');
}

testEgg();

