const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const list = [
  { in: 'chicken-drumsticks.jpg', out: 'prod-chicken-drumsticks.webp' },
  { in: 'chicken-breast.jpg', out: 'prod-chicken-breast.webp' },
  { in: 'mutton-curry-cut.jpg', out: 'prod-mutton-curry-cut.webp' },
  { in: 'farm-eggs.jpg', out: 'prod-farm-eggs.webp' },
];

async function processAll() {
  for (const item of list) {
    const inputPath = path.join(__dirname, '../public/products', item.in);
    const outputPath = path.join(__dirname, '../public/products', item.out);

    const img = sharp(inputPath);
    const meta = await img.metadata();
    console.log(`Processing ${item.in}: ${meta.width}x${meta.height}, format: ${meta.format}`);

    // Let's inspect corner pixels:
    const { data } = await img.raw().toBuffer({ resolveWithObject: true });
    console.log(`${item.in} top-left pixel RGB:`, data[0], data[1], data[2]);

    // Trim edge whitespace/margins cleanly, resize to square 600x600 with white background contain
    await sharp(inputPath)
      .trim()
      .resize(600, 600, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .webp({ quality: 90 })
      .toFile(outputPath);

    console.log(`-> Saved ${item.out} (${fs.statSync(outputPath).size} bytes)`);
  }
}

processAll().catch(console.error);

