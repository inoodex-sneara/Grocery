const sharp = require('sharp');
const path = require('path');

async function check(file) {
  const img = sharp(path.join(__dirname, '../public/products', file));
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  console.log(`\n--- ${file} (${info.width}x${info.height}, channels: ${info.channels}) ---`);
  const getRGB = (x, y) => {
    const idx = (y * info.width + x) * info.channels;
    return `[${data[idx]}, ${data[idx+1]}, ${data[idx+2]}]`;
  };
  console.log('Top-Left (0,0):', getRGB(0, 0));
  console.log('Top-Right (w-1,0):', getRGB(info.width - 1, 0));
  console.log('Bottom-Left (0,h-1):', getRGB(0, info.height - 1));
  console.log('Bottom-Right (w-1,h-1):', getRGB(info.width - 1, info.height - 1));
}

(async () => {
  await check('fresh-chicken-clean.webp');
  await check('tender-red-meat.webp');
  const shopImg = sharp(path.join(__dirname, '../public/shop/Shop-4.webp'));
  const { data, info } = await shopImg.raw().toBuffer({ resolveWithObject: true });
  console.log(`\n--- Shop-4.webp (${info.width}x${info.height}, channels: ${info.channels}) ---`);
  const getRGB = (x, y) => {
    const idx = (y * info.width + x) * info.channels;
    return `[${data[idx]}, ${data[idx+1]}, ${data[idx+2]}]`;
  };
  console.log('Top-Left (0,0):', getRGB(0, 0));
  console.log('Top-Right (w-1,0):', getRGB(info.width - 1, 0));
  console.log('Bottom-Left (0,h-1):', getRGB(0, info.height - 1));
  console.log('Bottom-Right (w-1,h-1):', getRGB(info.width - 1, info.height - 1));
})();

