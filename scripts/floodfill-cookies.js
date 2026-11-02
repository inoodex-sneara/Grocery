const sharp = require('sharp');

async function floodfillCookies() {
  const img = sharp('public/products/test-two-cookies2.jpg');
  // Downscale slightly to 1800 width for fast, super clean processing
  const { data, info } = await img
    .resize(1800, null)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width, h = info.height;
  const isBg = new Uint8Array(w * h); // 1 = background, 0 = foreground

  // BFS Queue
  const queue = [];

  function isBackgroundPixel(idx) {
    const r = data[idx * 3];
    const g = data[idx * 3 + 1];
    const b = data[idx * 3 + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    const brightness = (r + g + b) / 3;
    // Table is grey/white: brightness > 200 and low saturation (diff < 28)
    return (brightness > 202 && diff < 30);
  }

  // Seed borders
  for (let x = 0; x < w; x++) {
    const topIdx = 0 * w + x;
    const botIdx = (h - 1) * w + x;
    if (isBackgroundPixel(topIdx)) { isBg[topIdx] = 1; queue.push(topIdx); }
    if (isBackgroundPixel(botIdx)) { isBg[botIdx] = 1; queue.push(botIdx); }
  }
  for (let y = 0; y < h; y++) {
    const leftIdx = y * w + 0;
    const rightIdx = y * w + (w - 1);
    if (isBackgroundPixel(leftIdx)) { isBg[leftIdx] = 1; queue.push(leftIdx); }
    if (isBackgroundPixel(rightIdx)) { isBg[rightIdx] = 1; queue.push(rightIdx); }
  }

  // BFS
  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    const cx = curr % w;
    const cy = Math.floor(curr / w);

    const neighbors = [
      cy > 0 ? (cy - 1) * w + cx : -1,
      cy < h - 1 ? (cy + 1) * w + cx : -1,
      cx > 0 ? cy * w + (cx - 1) : -1,
      cx < w - 1 ? cy * w + (cx + 1) : -1
    ];

    for (const n of neighbors) {
      if (n !== -1 && isBg[n] === 0) {
        if (isBackgroundPixel(n)) {
          isBg[n] = 1;
          queue.push(n);
        }
      }
    }
  }

  // Now create RGBA buffer
  const rgba = Buffer.alloc(w * h * 4);
  let minX = w, maxX = 0, minY = h, maxY = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      const oIdx = idx * 4;
      const r = data[idx * 3];
      const g = data[idx * 3 + 1];
      const b = data[idx * 3 + 2];

      rgba[oIdx] = r;
      rgba[oIdx + 1] = g;
      rgba[oIdx + 2] = b;

      if (isBg[idx] === 1) {
        rgba[oIdx + 3] = 0;
      } else {
        rgba[oIdx + 3] = 255;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log('BFS Cookie BBox:', { minX, maxX, minY, maxY, w: maxX - minX + 1, h: maxY - minY + 1 });

  // Crop tight and resize
  const cookiePng = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
    .resize({ width: 680, height: 680, fit: 'inside' })
    .png()
    .toBuffer();

  const cMeta = await sharp(cookiePng).metadata();
  const posX = Math.round((800 - cMeta.width) / 2);
  const posY = Math.round((800 - cMeta.height) / 2);

  // Soft natural contact shadow underneath
  const shadowSvg = Buffer.from(`
    <svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.25"/>
          <stop offset="40%" stop-color="#000000" stop-opacity="0.14"/>
          <stop offset="70%" stop-color="#000000" stop-opacity="0.04"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="400" cy="${posY + cMeta.height - 10}" rx="${Math.round(cMeta.width * 0.44)}" ry="22" fill="url(#shadow)"/>
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
  .toFile('public/products/prod-cookies.webp');

  console.log('Saved floodfill prod-cookies.webp successfully!');
}

floodfillCookies().catch(err => {
  console.error(err);
  process.exit(1);
});

