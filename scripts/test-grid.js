const sharp = require('sharp');
const path = require('path');

async function testGrid(file) {
  const img = sharp(path.join(__dirname, '../public/products', file));
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  console.log(`\nGrid for ${file}:`);
  for (let y = 0; y < 5; y++) {
    let row = '';
    for (let x = 0; x < 5; x++) {
      const px = Math.floor(x * (info.width - 1) / 4);
      const py = Math.floor(y * (info.height - 1) / 4);
      const idx = (py * info.width + px) * info.channels;
      row += `[${data[idx]},${data[idx+1]},${data[idx+2]}] `;
    }
    console.log(`y=${y}: ${row}`);
  }
}

(async () => {
  await testGrid('chicken-drumsticks.jpg');
  await testGrid('chicken-breast.jpg');
  await testGrid('mutton-curry-cut.jpg');
})();

