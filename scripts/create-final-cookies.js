const sharp = require('sharp');

async function createFinalCookies() {
  const img = sharp('public/products/test-two-cookies2.jpg');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;

  // Let's create an alpha channel
  const rgba = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 3;
      const oIdx = (y * w + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      rgba[oIdx] = r;
      rgba[oIdx + 1] = g;
      rgba[oIdx + 2] = b;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const diff = max - min;
      const brightness = (r + g + b) / 3;

      // Tabletop background: brightness > 220 or diff < 22 with brightness > 200
      if (brightness > 222 && diff < 24) {
        rgba[oIdx + 3] = 0;
      } else if (brightness > 208 && diff < 22) {
        const alpha = Math.round((222 - brightness) / 14 * 255);
        rgba[oIdx + 3] = Math.max(0, Math.min(255, alpha));
      } else {
        // Also remove any stray pixels in the extreme outer corners / borders
        // Cookie center is around x: 1950, y: 1300
        const dx = (x - 1950) / 1650;
        const dy = (y - 1300) / 1150;
        const distSq = dx * dx + dy * dy;
        if (distSq > 1.05) {
          rgba[oIdx + 3] = 0;
        } else {
          rgba[oIdx + 3] = 255;
        }
      }
    }
  }

  // Find tight bounding box of cookies
  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const a = rgba[(y * w + x) * 4 + 3];
      if (a > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log('Cleaned BBox:', { minX, maxX, minY, maxY, w: maxX - minX + 1, h: maxY - minY + 1 });

  // Crop and resize to 680x680 inside 800x800 square
  const cookiePng = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
    .resize({ width: 680, height: 680, fit: 'inside' })
    .png()
    .toBuffer();

  const cMeta = await sharp(cookiePng).metadata();
  const posX = Math.round((800 - cMeta.width) / 2);
  const posY = Math.round((800 - cMeta.height) / 2);

  // Studio quality natural ground contact shadow
  const shadowSvg = Buffer.from(`
    <svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.30"/>
          <stop offset="35%" stop-color="#000000" stop-opacity="0.18"/>
          <stop offset="65%" stop-color="#000000" stop-opacity="0.06"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="400" cy="${posY + cMeta.height - 12}" rx="${Math.round(cMeta.width * 0.45)}" ry="24" fill="url(#shadow)"/>
    </svg>
  `);

  // Write directly to public/products/prod-cookies.webp
  await sharp({
    create: {
      width: 800,
      height: 800,
      channels: 3,
      background: { r: 255, g: 255, b: 255 }
    }
  })
  .composite([
    { input: shadowSvg, top: 0, left: 0 },
    { input: cookiePng, top: posY, left: posX }
  ])
  .webp({ quality: 95 })
  .toFile('public/products/prod-cookies.webp');

  console.log('Saved final public/products/prod-cookies.webp successfully!');
}

createFinalCookies().catch(err => {
  console.error(err);
  process.exit(1);
});

