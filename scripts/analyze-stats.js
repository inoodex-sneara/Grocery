const sharp = require('sharp');
const path = require('path');

async function analyze(file) {
  const img = sharp(path.join(__dirname, '../public/products', file));
  const stats = await img.stats();
  console.log(`\n=== ${file} Stats ===`);
  console.log('Channels min/max/mean:');
  stats.channels.forEach((c, idx) => {
    console.log(`Channel ${idx}: min=${c.min}, max=${c.max}, mean=${c.mean.toFixed(1)}`);
  });
}

(async () => {
  await analyze('chicken-drumsticks.jpg');
  await analyze('chicken-breast.jpg');
  await analyze('mutton-curry-cut.jpg');
  await analyze('farm-eggs.jpg');
})();

