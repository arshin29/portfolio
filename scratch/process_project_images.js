const sharp = require('sharp');
const fs = require('fs');

async function processImages() {
  const dPath = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794483164516_efbd1cca.webp';
  const tPath = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794483184179_f552c39f.webp';

  // 1. DocuMind:
  // Clean extraction inside borders:
  // Left: 16 (skips left black curve)
  // Top: 175 (skips top border line)
  // Width: 1008
  // Height: 232 (skips bottom transition)
  const dClean = await sharp(dPath)
    .extract({ left: 16, top: 175, width: 1008, height: 232 })
    .toBuffer();

  // 2. TripNext:
  // Clean extraction inside borders:
  // Left: 14
  // Top: 170
  // Width: 1010
  // Height: 236
  const tClean = await sharp(tPath)
    .extract({ left: 14, top: 170, width: 1010, height: 236 })
    .toBuffer();

  // Save to public/projects/ as high quality, optimized JPEGs (and also WebP if needed)
  // Resolution: keep full 1008 width with lanczos3, quality 90, mozjpeg progressive
  await sharp(dClean)
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile('public/projects/documind.jpg');

  await sharp(tClean)
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile('public/projects/tripnext.jpg');

  const dStat = fs.statSync('public/projects/documind.jpg');
  const tStat = fs.statSync('public/projects/tripnext.jpg');
  console.log('DocuMind size:', Math.round(dStat.size / 1024), 'KB');
  console.log('TripNext size:', Math.round(tStat.size / 1024), 'KB');
}

processImages();
