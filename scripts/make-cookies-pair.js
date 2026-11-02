const sharp = require('sharp');

async function createCookieArrangement() {
  // Load and crop cookie1
  const c1Raw = await sharp('public/products/test-cookie1.jpg')
    .extract({ left: 89, top: 68, width: 2845, height: 1785 })
    .resize({ width: 520, height: 330, fit: 'inside' })
    .toBuffer();

  // Load and crop cookie2 (transparent PNG)
  const c2Raw = await sharp('public/products/test-cookie2.png')
    .extract({ left: 92, top: 81, width: 2148, height: 1346 })
    .resize({ width: 560, height: 350, fit: 'inside' })
    .png()
    .toBuffer();

  // Let's create an alpha mask for cookie1 where background is white
  const c1Info = await sharp(c1Raw).metadata();
  const { data: c1Data } = await sharp(c1Raw).raw().toBuffer({ resolveWithObject: true });
  const c1Rgba = Buffer.alloc(c1Info.width * c1Info.height * 4);
  for (let i = 0; i < c1Info.width * c1Info.height; i++) {
    const r = c1Data[i * 3];
    const g = c1Data[i * 3 + 1];
    const b = c1Data[i * 3 + 2];
    c1Rgba[i * 4] = r;
    c1Rgba[i * 4 + 1] = g;
    c1Rgba[i * 4 + 2] = b;
    // transparency if pure white
    if (r > 250 && g > 250 && b > 250) {
      c1Rgba[i * 4 + 3] = 0;
    } else if (r > 245 && g > 245 && b > 245) {
      c1Rgba[i * 4 + 3] = Math.round((255 - ((r + g + b) / 3)) * 25.5);
    } else {
      c1Rgba[i * 4 + 3] = 255;
    }
  }

  const c1Png = await sharp(c1Rgba, { raw: { width: c1Info.width, height: c1Info.height, channels: 4 } })
    .png()
    .toBuffer();

  // Rotate cookie 1 slightly for natural stacking
  const c1Rotated = await sharp(c1Png)
    .rotate(-12, { background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();

  const c1RotMeta = await sharp(c1Rotated).metadata();
  const c2Meta = await sharp(c2Raw).metadata();

  // Position:
  // c1 in the back (top-left / center): x: 120, y: 150
  // c2 in the front (bottom-right / center): x: 180, y: 340
  // Canvas 800x800
  const shadowSvg = Buffer.from(`
    <svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="shadow1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.25"/>
          <stop offset="50%" stop-color="#000000" stop-opacity="0.10"/>
          <stop offset="85%" stop-color="#000000" stop-opacity="0.02"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="shadow2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.30"/>
          <stop offset="45%" stop-color="#000000" stop-opacity="0.15"/>
          <stop offset="80%" stop-color="#000000" stop-opacity="0.03"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- Shadow under back cookie -->
      <ellipse cx="360" cy="460" rx="230" ry="22" fill="url(#shadow1)"/>
      <!-- Shadow under front cookie -->
      <ellipse cx="440" cy="650" rx="260" ry="25" fill="url(#shadow2)"/>
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
    { input: c1Rotated, top: 160, left: 120 },
    { input: c2Raw, top: 340, left: 160 }
  ])
  .webp({ quality: 95 })
  .toFile('public/products/test-cookies-pair.webp');

  console.log('Done test-cookies-pair.webp');
}

createCookieArrangement().catch(console.error);

