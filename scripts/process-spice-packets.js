const fs = require('fs');
const sharp = require('sharp');

async function processPackets() {
  const items = [
    { in: 'public/products/xxl-jeera.png', out: 'public/products/spice-cumin-powder.webp', name: 'cumin' },
    { in: 'public/products/xxl-chilli.png', out: 'public/products/spice-chilli-powder.webp', name: 'chilli' },
    { in: 'public/products/xxl-turmeric.png', out: 'public/products/spice-turmeric-powder.webp', name: 'turmeric' },
    { in: 'public/products/xxl-garam.jpg', out: 'public/products/spice-garam-masala.webp', name: 'garam' }
  ];

  for (const item of items) {
    const img = sharp(item.in);
    const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
    const w = info.width, h = info.height, ch = info.channels;
    let minX = w, maxX = 0, minY = h, maxY = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * ch;
        const isContent = (ch === 4 ? data[idx+3] > 15 : (data[idx] < 252 || data[idx+1] < 252 || data[idx+2] < 252));
        if (isContent) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    const cropW = maxX - minX + 1;
    const cropH = maxY - minY + 1;

    // Crop tight & resize to height 690px
    const pouchBuffer = await sharp(item.in)
      .extract({ left: minX, top: minY, width: cropW, height: cropH })
      .resize({ height: 690, fit: 'inside' })
      .png()
      .toBuffer();

    const pouchMeta = await sharp(pouchBuffer).metadata();
    const pouchW = pouchMeta.width;
    const pouchH = pouchMeta.height;
    const posX = Math.round((800 - pouchW) / 2);
    const posY = Math.round((760 - pouchH) / 2);

    // Natural shadow SVG
    const shadowRy = 16;
    const shadowRx = Math.round(pouchW * 0.44);
    const shadowCy = posY + pouchH - 5;
    const shadowSvg = Buffer.from(
      `<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">` +
      `<defs>` +
      `<radialGradient id="shadow" cx="50%" cy="50%" r="50%">` +
      `<stop offset="0%" stop-color="#000000" stop-opacity="0.32"/>` +
      `<stop offset="45%" stop-color="#000000" stop-opacity="0.16"/>` +
      `<stop offset="75%" stop-color="#000000" stop-opacity="0.05"/>` +
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
      { input: pouchBuffer, top: posY, left: posX }
    ])
    .webp({ quality: 92 })
    .toFile(item.out);

    console.log('Successfully generated:', item.out, 'pouch dimensions:', pouchW, 'x', pouchH, 'at', posX, posY);
  }
}

processPackets().catch(err => {
  console.error(err);
  process.exit(1);
});

