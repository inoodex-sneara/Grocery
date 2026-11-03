const sharp = require('sharp');

async function ascii() {
  const file = 'C:/Users/Inoodex/.gemini/antigravity/brain/e71fc3a6-7830-4105-9f0b-585d53bfc2d1/.user_uploaded/media_1793689368455_7d6eef2e.png';
  const img = sharp(file).grayscale();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  for (let y = 0; y < info.height; y++) {
    let line = '';
    for (let x = 0; x < info.width; x++) {
      const val = data[y * info.width + x];
      if (val < 100) line += '██';
      else if (val < 180) line += '▒▒';
      else if (val < 230) line += '░░';
      else line += '  ';
    }
    console.log(line);
  }
}

ascii();

