const sharp = require('sharp');
const path = require('path');

async function test(name) {
  try {
    const img = sharp(path.join(__dirname, '../public/products', name));
    const meta = await img.metadata();
    console.log(name, meta.width, meta.height, meta.format);
  } catch(e) {
    console.error(name, e.message);
  }
}

(async () => {
  await test('wiki-drumsticks.jpg');
  await test('wiki-breast.jpg');
  await test('wiki-chicken.jpg');
})();

