const sharp = require('sharp');

async function testExtractTwoCookies() {
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

      // Tabletop is light grey/white (r,g,b all > 215 and max - min < 18)
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const diff = max - min;
      const brightness = (r + g + b) / 3;

      if (brightness > 225 && diff < 20) {
        // Tabletop background
        rgba[oIdx + 3] = 0;
      } else if (brightness > 210 && diff < 20) {
        // Feather edge
        const alpha = Math.round((225 - brightness) / 15 * 255);
        rgba[oIdx + 3] = Math.max(0, Math.min(255, alpha));
      } else {
        // Cookie or chocolate chip
        rgba[oIdx + 3] = 255;
      }
    }
  }

  // Find bounding box of non-zero alpha
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

  console.log('BBox:', { minX, maxX, minY, maxY, w: maxX - minX + 1, h: maxY - minY + 1 });

  const cookiePng = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
    .resize({ width: 680, height: 680, fit: 'inside' })
    .png()
    .toBuffer();

  const cMeta = await sharp(cookiePng).metadata();
  const posX = Math.round((800 - cMeta.width) / 2);
  const posY = Math.round((800 - cMeta.height) / 2);

  const shadowSvg = Buffer.from(`
    <svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.25"/>
          <stop offset="45%" stop-color="#000000" stop-opacity="0.12"/>
          <stop offset="80%" stop-color="#000000" stop-opacity="0.03"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="400" cy="${posY + cMeta.height - 10}" rx="${Math.round(cMeta.width * 0.44)}" ry="20" fill="url(#shadow)"/>
    </svg>
  `);

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
  .toFile('public/products/test-cutout-cookies.webp');

  console.log('Saved test-cutout-cookies.webp', cMeta.width, 'x', cMeta.height, 'at', posX, posY);
}

testExtractTwoCookies().catch(console.error);

