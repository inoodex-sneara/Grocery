const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function inspectShop() {
  const dir = path.join(__dirname, '../public/shop');
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f.endsWith('.webp') || f.endsWith('.jxl')) {
      try {
        const meta = await sharp(path.join(dir, f)).metadata();
        console.log(f, `${meta.width}x${meta.height}`, meta.format, `channels: ${meta.channels}`);
      } catch(e) {
        console.log(f, e.message);
      }
    }
  }
}

inspectShop();

