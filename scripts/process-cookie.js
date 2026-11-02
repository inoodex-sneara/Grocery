const fs = require('fs');
const sharp = require('sharp');

async function processCookie() {
  const file = 'public/products/test-cookie1.jpg';
  const out = 'public/products/test-cookie-square.webp';

  const img = sharp(file);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;
  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 3;
      if (data[idx] < 252 || data[idx+1] < 252 || data[idx+2] < 252) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;

  // Resize cookie so it fits nicely inside 680x680 area
  const cookieBuffer = await sharp(file)
    .extract({ left: minX, top: minY, width: cropW, height: cropH })
    .resize({ width: 660, height: 660, fit: 'inside' })
    .png()
    .toBuffer();

  const meta = await sharp(cookieBuffer).metadata();
  const posX = Math.round((800 - meta.width) / 2);
  const posY = Math.round((800 - meta.height) / 2);

  // Soft natural grounding contact shadow
  const shadowRy = 22;
  const shadowRx = Math.round(meta.width * 0.44);
  const shadowCy = posY + meta.height - 12;
  const shadowSvg = Buffer.from(
    `<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">` +
    `<defs>` +
    `<radialGradient id="shadow" cx="50%" cy="50%" r="50%">` +
    `<stop offset="0%" stop-color="#000000" stop-opacity="0.22"/>` +
    `<stop offset="50%" stop-color="#000000" stop-opacity="0.10"/>` +
    `<stop offset="80%" stop-color="#000000" stop-opacity="0.03"/>` +
    `<stop offset="100%" stop-color="#000000" stop-opacity="0"/>` +
    `</radialGradient>` +
    `</defs>` +
    `<ellipse cx="400" cy="${shadowCy}" rx="${shadowRx}" ry="${shadowRy}" fill="url(#shadow)"/>` +
    `</svg>`
  );

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
    { input: cookieBuffer, top: posY, left: posX }
  ])
  .webp({ quality: 95 })
  .toFile(out);

  console.log('Saved:', out, meta.width, 'x', meta.height, 'at', posX, posY);
}

processCookie().catch(err => {
  console.error(err);
  process.exit(1);
});

