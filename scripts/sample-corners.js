const sharp = require('sharp');
const path = require('path');

async function inspect(file) {
  const img = sharp(path.join(__dirname, '../public/products', file));
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  console.log(`\n--- ${file} (${info.width}x${info.height}, channels: ${info.channels}) ---`);
  
  // Sample 4 corners and center
  const getRGB = (x, y) => {
    const idx = (y * info.width + x) * info.channels;
    return `[${data[idx]}, ${data[idx+1]}, ${data[idx+2]}]`;
  };
  
  console.log('Top-Left (0,0):', getRGB(0, 0));
  console.log('Top-Right (w-1,0):', getRGB(info.width - 1, 0));
  console.log('Bottom-Left (0,h-1):', getRGB(0, info.height - 1));
  console.log('Bottom-Right (w-1,h-1):', getRGB(info.width - 1, info.height - 1));
  console.log('Center (w/2, h/2):', getRGB(Math.floor(info.width / 2), Math.floor(info.height / 2)));
}

(async () => {
  await inspect('chicken-drumsticks.jpg');
  await inspect('chicken-breast.jpg');
  await inspect('mutton-curry-cut.jpg');
  await inspect('farm-eggs.jpg');
})();

