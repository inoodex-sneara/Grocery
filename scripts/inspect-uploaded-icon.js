const sharp = require('sharp');
const path = require('path');

async function inspectIcon() {
  const file = 'C:/Users/Inoodex/.gemini/antigravity/brain/e71fc3a6-7830-4105-9f0b-585d53bfc2d1/.user_uploaded/media_1793689368455_7d6eef2e.png';
  const img = sharp(file);
  const meta = await img.metadata();
  console.log('Dimensions:', meta.width, 'x', meta.height, 'format:', meta.format);
}

inspectIcon();

