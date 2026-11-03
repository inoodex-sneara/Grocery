const sharp = require('sharp');
const path = require('path');

async function test(name) {
  const img = sharp(path.join(__dirname, '../public/products', name));
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  console.log(`\n--- ${name} (${info.width}x${info.height}) ---`);
  const getRGB = (x, y) => {
    const idx = (y * info.width + x) * info.channels;
    return `[${data[idx]}, ${data[idx+1]}, ${data[idx+2]}]`;
  };
  console.log('Top-Left:', getRGB(0, 0));
  console.log('Top-Right:', getRGB(info.width-1, 0));
  console.log('Bottom-Left:', getRGB(0, info.height-1));
  console.log('Bottom-Right:', getRGB(info.width-1, info.height-1));
}

(async () => {
  await test('wiki-drumsticks.jpg');
  await test('wiki-breast.jpg');
})();

