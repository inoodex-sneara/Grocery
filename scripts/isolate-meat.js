const sharp = require('sharp');
const path = require('path');

async function cleanImage(fileIn, fileOut, tolerance = 40) {
  const imgPath = path.join(__dirname, '../public/products', fileIn);
  const outPath = path.join(__dirname, '../public/products', fileOut);

  const img = sharp(imgPath);
  const meta = await img.metadata();
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Corner colors:
  const getPixel = (x, y) => {
    const idx = (y * width + x) * channels;
    return [data[idx], data[idx + 1], data[idx + 2]];
  };

  const bgR = data[0];
  const bgG = data[1];
  const bgB = data[2];

  console.log(`${fileIn}: BG reference: [${bgR}, ${bgG}, ${bgB}]`);

  // Floodfill from all 4 borders using BFS
  const visited = new Uint8Array(width * height);
  const queue = [];

  // Seed borders
  for (let x = 0; x < width; x++) {
    queue.push([x, 0]);
    queue.push([x, height - 1]);
    visited[x] = 1;
    visited[(height - 1) * width + x] = 1;
  }
  for (let y = 1; y < height - 1; y++) {
    queue.push([0, y]);
    queue.push([width - 1, y]);
    visited[y * width] = 1;
    visited[y * width + (width - 1)] = 1;
  }

  let head = 0;
  while (head < queue.length) {
    const [cx, cy] = queue[head++];
    const idx = (cy * width + cx) * channels;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
    if (dist <= tolerance) {
      // Set to pure white
      data[idx] = 255;
      data[idx + 1] = 255;
      data[idx + 2] = 255;
      data[idx + 3] = 0; // transparent

      // Check 4 neighbors
      const neighbors = [
        [cx + 1, cy],
        [cx - 1, cy],
        [cx, cy + 1],
        [cx, cy - 1]
      ];

      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nIdx = ny * width + nx;
          if (!visited[nIdx]) {
            visited[nIdx] = 1;
            queue.push([nx, ny]);
          }
        }
      }
    }
  }

  // Flatten on pure white
  await sharp(data, { raw: { width, height, channels } })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .resize(600, 600, { fit: 'contain', background: { r: 255, g: 255, b: 255 } })
    .webp({ quality: 90 })
    .toFile(outPath);

  console.log(`Saved clean ${fileOut}`);
}

(async () => {
  await cleanImage('chicken-breast.jpg', 'prod-chicken-breast.webp', 45);
  await cleanImage('chicken-drumsticks.jpg', 'prod-chicken-drumsticks.webp', 45);
})();

