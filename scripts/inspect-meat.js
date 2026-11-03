const sharp = require('sharp');

const files = [
  'chicken-legs.jpg',
  'chicken-breasts.jpg',
  'kycklingfile.jpg',
  'raw-steak.jpg',
  'brown-eggs.jpg',
  'eggs-carton.jpg',
  '6-pack-eggs.jpg',
];

(async () => {
  for (const f of files) {
    try {
      const img = sharp('public/products/' + f);
      const meta = await img.metadata();
      const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
      console.log(f, `${info.width}x${info.height}`, `corner: [${data[0]}, ${data[1]}, ${data[2]}]`);
    } catch (e) {
      console.error(f, e.message);
    }
  }
})();

